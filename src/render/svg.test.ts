import test from 'node:test';
import assert from 'node:assert/strict';

import { renderSvg } from './svg.ts';

const baseOptions = {
  outputFile: 'out.svg',
  format: 'svg' as const,
  theme: 'dracula',
  fontFamily: 'monospace',
  fontSize: 14,
  padding: 20,
  lineNumbers: false,
  windowControls: true,
  shadow: true,
  backgroundStyle: 'gradient' as const,
  scale: 2
};

test('renderSvg escapes XML special chars', async () => {
  const svg = await renderSvg({
    ...baseOptions,
    code: 'const a = "<tag>" & true;'
  });

  assert.match(svg, /&lt;tag&gt;/);
  assert.match(svg, /&amp; true/);
});

test('renderSvg adds line numbers when enabled', async () => {
  const svg = await renderSvg({
    ...baseOptions,
    code: 'line1\nline2',
    lineNumbers: true
  });

  assert.match(svg, />1<\/text>/);
  assert.match(svg, />2<\/text>/);
});

test('renderSvg renders window controls and watermark', async () => {
  const svg = await renderSvg({
    ...baseOptions,
    code: 'const x = 1',
    watermark: 'snipgrapher'
  });

  assert.match(svg, /#ff5f57/);
  assert.match(svg, /snipgrapher/);
});

test('renderSvg uses borderRadius from options', async () => {
  const svg = await renderSvg({
    ...baseOptions,
    code: 'const x = 1',
    borderRadius: 0
  });

  // Should have rx="0" for both background and card rects
  assert.match(svg, /rx="0"/);
});

test('renderSvg defaults borderRadius to 14 when not specified', async () => {
  const svg = await renderSvg({
    ...baseOptions,
    code: 'const x = 1'
  });

  // Should have rx="14" (the default)
  assert.match(svg, /rx="14"/);
});
