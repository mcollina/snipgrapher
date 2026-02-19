import test from 'node:test';
import assert from 'node:assert/strict';

import { validateConfig } from './validate-config.ts';

test('validateConfig accepts valid partial config', () => {
  assert.doesNotThrow(() => {
    validateConfig({
      format: 'webp',
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

test('validateConfig accepts valid scale', () => {
  assert.doesNotThrow(() => validateConfig({ scale: 1 }));
  assert.doesNotThrow(() => validateConfig({ scale: 2 }));
  assert.doesNotThrow(() => validateConfig({ scale: 4 }));
});

test('validateConfig rejects scale below 1', () => {
  assert.throws(() => validateConfig({ scale: 0 }), /scale/);
});

test('validateConfig rejects scale above 4', () => {
  assert.throws(() => validateConfig({ scale: 5 }), /scale/);
});
