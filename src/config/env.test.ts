import assert from 'node:assert/strict';
import test from 'node:test';

import { loadEnvConfig } from './env.ts';

test('loadEnvConfig reads valid env overrides', () => {
  const result = loadEnvConfig({
    SNIPGRAPHER_THEME: 'nord',
    SNIPGRAPHER_FORMAT: 'webp',
    SNIPGRAPHER_FONT_SIZE: '18',
    SNIPGRAPHER_LINE_NUMBERS: 'true'
  });

  assert.equal(result.overrides.theme, 'nord');
  assert.equal(result.overrides.format, 'webp');
  assert.equal(result.overrides.fontSize, 18);
  assert.equal(result.overrides.lineNumbers, true);
});

test('loadEnvConfig rejects invalid booleans', () => {
  assert.throws(() => {
    loadEnvConfig({ SNIPGRAPHER_SHADOW: 'maybe' });
  }, /SNIPGRAPHER_SHADOW/);
});

test('loadEnvConfig reads profile', () => {
  const result = loadEnvConfig({ SNIPGRAPHER_PROFILE: 'social' });
  assert.equal(result.profile, 'social');
});
