import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { RenderOptions } from '../types.ts';
import { svgToPng } from './png.ts';
import { renderSvg } from './svg.ts';
import { svgToWebp } from './webp.ts';

export async function renderToFile(options: RenderOptions): Promise<void> {
  const svg = renderSvg(options);

  await mkdir(dirname(options.outputFile), { recursive: true });

  if (options.format === 'svg') {
    await writeFile(options.outputFile, svg, 'utf8');
    return;
  }

  if (options.format === 'png') {
    const png = svgToPng(svg);
    await writeFile(options.outputFile, png);
    return;
  }

  const webp = await svgToWebp(svg);
  await writeFile(options.outputFile, webp);
}
