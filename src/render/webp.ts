import sharp from 'sharp';

export async function svgToWebp(svg: string): Promise<Buffer> {
  return sharp(Buffer.from(svg, 'utf8')).webp({ quality: 92 }).toBuffer();
}
