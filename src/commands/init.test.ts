import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import inquirer from 'inquirer';

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
  const originalStdinTTY = process.stdin.isTTY;
  const originalStdoutTTY = process.stdout.isTTY;

  process.stdin.isTTY = true;
  process.stdout.isTTY = true;

  try {
    await writeFile(join(dir, 'snipgrapher.config.json'), '{}\n', 'utf8');
    await assert.rejects(() => runInit(dir), /Use --force to overwrite/);
  } finally {
    process.stdin.isTTY = originalStdinTTY;
    process.stdout.isTTY = originalStdoutTTY;
    await rm(dir, { recursive: true, force: true });
  }
});

test('runInit overwrites existing config when force is enabled', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'snipgrapher-init-'));
  const originalStdinTTY = process.stdin.isTTY;
  const originalStdoutTTY = process.stdout.isTTY;

  process.stdin.isTTY = true;
  process.stdout.isTTY = true;

  t.mock.method(inquirer, 'prompt', async () => ({
    theme: 'githubDark',
    format: 'svg',
    fontFamily: 'Fira Code',
    fontSize: '14',
    padding: '24',
    lineNumbers: false,
    windowControls: true,
    shadow: true,
    backgroundStyle: 'gradient',
    scale: '2',
    watermark: ''
  }));

  try {
    await writeFile(join(dir, 'snipgrapher.config.json'), '{"theme":"nord"}\n', 'utf8');
    await runInit(dir, { force: true });

    const raw = await readFile(join(dir, 'snipgrapher.config.json'), 'utf8');
    const config = JSON.parse(raw) as Record<string, unknown>;

    assert.equal(config.theme, 'githubDark');
    assert.equal(config.padding, 24);
    assert.equal(config.defaultProfile, 'default');
  } finally {
    process.stdin.isTTY = originalStdinTTY;
    process.stdout.isTTY = originalStdoutTTY;
    await rm(dir, { recursive: true, force: true });
  }
});

test('runInit writes config from inquirer answers', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'snipgrapher-init-'));
  const originalStdinTTY = process.stdin.isTTY;
  const originalStdoutTTY = process.stdout.isTTY;

  process.stdin.isTTY = true;
  process.stdout.isTTY = true;

  t.mock.method(inquirer, 'prompt', async () => ({
    theme: 'nord',
    format: 'webp',
    fontFamily: 'JetBrains Mono',
    fontSize: '18',
    padding: '40',
    lineNumbers: true,
    windowControls: false,
    shadow: true,
    backgroundStyle: 'solid',
    scale: '3',
    watermark: 'demo'
  }));

  try {
    await runInit(dir);

    const raw = await readFile(join(dir, 'snipgrapher.config.json'), 'utf8');
    const config = JSON.parse(raw) as Record<string, unknown>;

    assert.equal(config.theme, 'nord');
    assert.equal(config.format, 'webp');
    assert.equal(config.fontFamily, 'JetBrains Mono');
    assert.equal(config.fontSize, 18);
    assert.equal(config.padding, 40);
    assert.equal(config.lineNumbers, true);
    assert.equal(config.windowControls, false);
    assert.equal(config.shadow, true);
    assert.equal(config.backgroundStyle, 'solid');
    assert.equal(config.scale, 3);
    assert.equal(config.watermark, 'demo');
    assert.equal(config.defaultProfile, 'default');
  } finally {
    process.stdin.isTTY = originalStdinTTY;
    process.stdout.isTTY = originalStdoutTTY;
    await rm(dir, { recursive: true, force: true });
  }
});
