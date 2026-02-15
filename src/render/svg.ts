import type { RenderOptions } from '../types.ts';
import { getTheme } from '../theme/themes.ts';
import { colorizeLine } from './tokenize.ts';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderSvg(options: RenderOptions): string {
  const theme = getTheme(options.theme);
  const lines = options.code.replaceAll('\t', '  ').split('\n');
  const maxLine = Math.max(...lines.map((line) => line.length), 1);

  const lineHeight = Math.round(options.fontSize * 1.6);
  const charWidth = Math.round(options.fontSize * 0.6);
  const lineNumberGutter = options.lineNumbers ? String(lines.length).length * charWidth + 20 : 0;

  const width = options.padding * 2 + lineNumberGutter + maxLine * charWidth;
  const headerHeight = options.title ? lineHeight + 8 : 0;
  const contentHeight = lines.length * lineHeight;
  const height = options.padding * 2 + headerHeight + contentHeight;

  let y = options.padding + headerHeight;

  const textRows = lines
    .map((line, idx) => {
      y += lineHeight;
      const segments = colorizeLine(line, theme)
        .map((segment) => `<tspan fill="${segment.color}">${escapeXml(segment.text)}</tspan>`)
        .join('');

      const lineNumber = options.lineNumbers
        ? `<text x="${options.padding}" y="${y}" fill="${theme.lineNumber}">${idx + 1}</text>`
        : '';

      return `${lineNumber}<text x="${options.padding + lineNumberGutter}" y="${y}" fill="${theme.foreground}">${segments}</text>`;
    })
    .join('');

  const title = options.title
    ? `<text x="${options.padding}" y="${options.padding + lineHeight - 8}" fill="${theme.comment}">${escapeXml(options.title)}</text>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${theme.background}" rx="14" />
  <g font-family="${escapeXml(options.fontFamily)}" font-size="${options.fontSize}" xml:space="preserve">
    ${title}
    ${textRows}
  </g>
</svg>`;
}
