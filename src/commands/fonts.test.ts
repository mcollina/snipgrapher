import assert from 'node:assert/strict';
import test from 'node:test';

import { runFontsList } from './fonts.ts';

test('runFontsList prints curated font families and disclaimer', async (t) => {
  const output: string[] = [];

  t.mock.method(console, 'log', (...args: unknown[]) => {
    output.push(args.join(' '));
  });

  await runFontsList();

  assert.ok(output.some((line) => line.includes('Available font-family values:')));
  assert.ok(output.some((line) => line.includes('Fira Code')));
  assert.ok(output.some((line) => line.includes('monospace')));
  assert.ok(output.some((line) => line.includes('local installation')));
});
