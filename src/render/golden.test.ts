import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import test from 'node:test';

import { svgToPng } from './png.ts';
import { renderSvg } from './svg.ts';

const snapshotPath = fileURLToPath(new URL('./__snapshots__/typescript-card.png', import.meta.url));

test('golden: typescript render stays stable', async () => {
  const svg = await renderSvg({
    code: "export async function hello(name: string) {\n  return 'Hello ' + name;\n}",
    outputFile: 'out.png',
    format: 'png',
    theme: 'dracula',
    fontFamily: 'Fira Code',
    fontSize: 14,
    padding: 32,
    lineNumbers: true,
    windowControls: true,
    shadow: true,
    backgroundStyle: 'gradient',
    watermark: 'snipgrapher',
    language: 'typescript',
    title: 'hello.ts'
  });

  const currentPng = svgToPng(svg);
  const expectedPng = await readFile(snapshotPath);

  const current = PNG.sync.read(currentPng);
  const expected = PNG.sync.read(expectedPng);

  assert.equal(current.width, expected.width, 'golden width mismatch');
  assert.equal(current.height, expected.height, 'golden height mismatch');

  const diff = new PNG({ width: current.width, height: current.height });
  const mismatch = pixelmatch(
    current.data,
    expected.data,
    diff.data,
    current.width,
    current.height,
    {
      threshold: 0.1
    }
  );

  assert.equal(mismatch, 0, `golden mismatch: ${mismatch} pixels differ`);
});
