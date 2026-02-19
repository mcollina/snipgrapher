import { Resvg } from '@resvg/resvg-js';

export function svgToPng(svg: string, scale = 2): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'zoom',
      value: scale
    }
  });

  const image = resvg.render();
  return image.asPng();
}
