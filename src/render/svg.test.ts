import test from 'node:test';
import assert from 'node:assert/strict';

import { renderSvg } from './svg.ts';

test('renderSvg escapes XML special chars', () => {
  const svg = renderSvg({
    code: 'const a = "<tag>" & true;',
    outputFile: 'out.svg',
    format: 'svg',
    theme: 'dracula',
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 20,
    lineNumbers: false
  });

  assert.match(svg, /&lt;tag&gt;/);
  assert.match(svg, /&amp; true/);
});

test('renderSvg adds line numbers when enabled', () => {
  const svg = renderSvg({
    code: 'line1\nline2',
    outputFile: 'out.svg',
    format: 'svg',
    theme: 'dracula',
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 20,
    lineNumbers: true
  });

  assert.match(svg, />1<\/text>/);
  assert.match(svg, />2<\/text>/);
});
