import { Resvg } from '@resvg/resvg-js';

import { getBundledFontPaths } from '../fonts/bundled.ts';

export function svgToPng(svg: string, scale = 2): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'zoom',
      value: scale
    },
    font: {
      fontFiles: getBundledFontPaths(),
      loadSystemFonts: true
    }
  });

  const image = resvg.render();
  return image.asPng();
}
