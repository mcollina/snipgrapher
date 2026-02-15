import { Resvg } from '@resvg/resvg-js';

export function svgToPng(svg: string): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'original'
    }
  });

  const image = resvg.render();
  return image.asPng();
}
