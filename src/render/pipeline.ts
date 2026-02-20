import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { RenderOptions } from '../types.ts';
import { svgToPng } from './png.ts';
import { renderSvg } from './svg.ts';
import { svgToWebp } from './webp.ts';

export async function render(options: RenderOptions): Promise<string | Buffer> {
  const svg = await renderSvg(options);

  if (options.format === 'svg') {
    return svg;
  }

  if (options.format === 'png') {
    return svgToPng(svg, options.scale);
  }

  return svgToWebp(svg);
}

export async function renderToFile(options: RenderOptions): Promise<void> {
  const output = await render(options);

  await mkdir(dirname(options.outputFile), { recursive: true });

  if (typeof output === 'string') {
    await writeFile(options.outputFile, output, 'utf8');
    return;
  }

  await writeFile(options.outputFile, output);
}
