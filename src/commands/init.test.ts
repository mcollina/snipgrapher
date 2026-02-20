import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { runInit } from './init.ts';

test('runInit requires interactive terminal', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'snipgrapher-init-'));
  const originalStdinTTY = process.stdin.isTTY;
  const originalStdoutTTY = process.stdout.isTTY;

  process.stdin.isTTY = false;
  process.stdout.isTTY = true;

  try {
    await assert.rejects(() => runInit(dir), /interactive terminal/);
  } finally {
    process.stdin.isTTY = originalStdinTTY;
    process.stdout.isTTY = originalStdoutTTY;
    await rm(dir, { recursive: true, force: true });
  }
});

test('runInit fails when config already exists', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'snipgrapher-init-'));

  try {
    await writeFile(join(dir, 'snipgrapher.config.json'), '{}\n', 'utf8');
    await assert.rejects(() => runInit(dir), /Config already exists/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
