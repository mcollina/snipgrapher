import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { RenderOptions } from '../types.ts';
import { renderSvg } from './svg.ts';
import { svgToPng } from './png.ts';

export async function renderToFile(options: RenderOptions): Promise<void> {
  const svg = renderSvg(options);

  await mkdir(dirname(options.outputFile), { recursive: true });

  if (options.format === 'svg') {
    await writeFile(options.outputFile, svg, 'utf8');
    return;
  }

  const png = svgToPng(svg);
  await writeFile(options.outputFile, png);
}
