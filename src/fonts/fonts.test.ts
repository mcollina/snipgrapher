import assert from 'node:assert/strict';
import test from 'node:test';

import { listFontFamilies } from './fonts.ts';

test('listFontFamilies returns curated named fonts and generic fallbacks', () => {
  const fonts = listFontFamilies();

  assert.ok(fonts.includes('Fira Code'));
  assert.ok(fonts.includes('JetBrains Mono'));
  assert.ok(fonts.includes('ui-monospace'));
  assert.ok(fonts.includes('monospace'));
});
