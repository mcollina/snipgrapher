import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { loadConfig } from './load-config.ts';

test('loadConfig applies selected profile', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'snipgrapher-config-'));

  try {
    await writeFile(
      join(dir, 'snipgrapher.config.json'),
      JSON.stringify(
        {
          theme: 'nord',
          defaultProfile: 'social',
          profiles: {
            social: {
              padding: 64,
              watermark: 'social'
            }
          }
        },
        null,
        2
      )
    );

    const config = await loadConfig(dir);

    assert.equal(config.theme, 'nord');
    assert.equal(config.padding, 64);
    assert.equal(config.watermark, 'social');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('loadConfig throws on unknown explicit profile', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'snipgrapher-config-'));

  try {
    await writeFile(join(dir, 'snipgrapher.config.json'), JSON.stringify({ theme: 'dracula' }, null, 2));

    await assert.rejects(() => loadConfig(dir, 'missing'), /unknown profile/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
