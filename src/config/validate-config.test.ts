import test from 'node:test';
import assert from 'node:assert/strict';

import { validateConfig } from './validate-config.ts';

test('validateConfig accepts valid partial config', () => {
  assert.doesNotThrow(() => {
    validateConfig({
      format: 'svg',
      backgroundStyle: 'gradient',
      fontSize: 14,
      padding: 16,
      lineNumbers: true,
      windowControls: false,
      shadow: true
    });
  });
});

test('validateConfig rejects invalid format', () => {
  assert.throws(() => validateConfig({ format: 'jpg' as never }), /format/);
});

test('validateConfig rejects invalid font size', () => {
  assert.throws(() => validateConfig({ fontSize: 200 }), /fontSize/);
});
