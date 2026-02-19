import test from 'node:test';
import assert from 'node:assert/strict';

import { PNG } from 'pngjs';

import { svgToPng } from './png.ts';
import { renderSvg } from './svg.ts';

const baseOptions = {
  outputFile: 'out.png',
  format: 'png' as const,
  theme: 'dracula',
  fontFamily: 'monospace',
  fontSize: 14,
  padding: 20,
  lineNumbers: false,
  windowControls: false,
  shadow: false,
  backgroundStyle: 'solid' as const,
  scale: 1
};

test('svgToPng defaults to 2x scale', async () => {
  const svg = await renderSvg({ ...baseOptions, code: 'hello' });

  const png1x = PNG.sync.read(svgToPng(svg, 1));
  const pngDefault = PNG.sync.read(svgToPng(svg));

  assert.equal(pngDefault.width, png1x.width * 2);
  assert.equal(pngDefault.height, png1x.height * 2);
});

test('svgToPng respects custom scale', async () => {
  const svg = await renderSvg({ ...baseOptions, code: 'hello' });

  const png1x = PNG.sync.read(svgToPng(svg, 1));
  const png3x = PNG.sync.read(svgToPng(svg, 3));

  assert.equal(png3x.width, png1x.width * 3);
  assert.equal(png3x.height, png1x.height * 3);
});
