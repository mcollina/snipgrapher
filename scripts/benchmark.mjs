import { mkdtemp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { spawn } from 'node:child_process';

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} failed (${code})\n${stderr}`));
        return;
      }

      resolve({ stdout, stderr });
    });
  });
}

function sampleCode(index) {
  return `export function example${index}(input: string): string {\n  const value = input.trim();\n  return value.toUpperCase();\n}\n`;
}

const fixtureCount = 50;

const root = globalThis.process.cwd();
const tmp = await mkdtemp(join(tmpdir(), 'snipgrapher-bench-'));

try {
  const srcDir = join(tmp, 'fixtures');
  const outDir = join(tmp, 'out');

  await mkdir(srcDir, { recursive: true });

  for (let i = 0; i < fixtureCount; i++) {
    await writeFile(join(srcDir, `sample-${String(i).padStart(3, '0')}.ts`), sampleCode(i), 'utf8');
  }

  const start = performance.now();
  await run(
    'node',
    [
      'dist/cli.js',
      'batch',
      `${srcDir}/*.ts`,
      '--out-dir',
      outDir,
      '--format',
      'png',
      '--concurrency',
      '8',
      '--json'
    ],
    root
  );
  const end = performance.now();

  const generatedFiles = (await readdir(outDir)).length;
  const seconds = (end - start) / 1000;

  const result = {
    fixtures: fixtureCount,
    generatedFiles,
    durationMs: Math.round(end - start),
    filesPerSecond: Number((generatedFiles / seconds).toFixed(2))
  };

  globalThis.process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} finally {
  await rm(tmp, { recursive: true, force: true });
}
