import sharp from 'sharp';

import { svgToPng } from './png.ts';

export async function svgToWebp(svg: string): Promise<Buffer> {
  return sharp(svgToPng(svg, 1)).webp({ quality: 92 }).toBuffer();
}
