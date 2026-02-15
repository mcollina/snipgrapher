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

function withOpacity(hex: string, alphaHex: string): string {
  if (!hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) {
    return hex;
  }

  const normalized = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;

  return `${normalized}${alphaHex}`;
}

export function renderSvg(options: RenderOptions): string {
  const theme = getTheme(options.theme);
  const lines = options.code.replaceAll('\t', '  ').split('\n');
  const maxLine = Math.max(...lines.map((line) => line.length), 1);

  const lineHeight = Math.round(options.fontSize * 1.6);
  const charWidth = Math.round(options.fontSize * 0.6);
  const lineNumberGutter = options.lineNumbers ? String(lines.length).length * charWidth + 20 : 0;

  const headerVisible = Boolean(options.title || options.windowControls || options.language);
  const headerHeight = headerVisible ? lineHeight + 14 : 0;
  const footerHeight = options.watermark ? lineHeight : 0;

  const width = options.padding * 2 + lineNumberGutter + maxLine * charWidth;
  const contentHeight = lines.length * lineHeight;
  const height = options.padding * 2 + headerHeight + contentHeight + footerHeight;

  const backgroundFill = options.backgroundStyle === 'gradient' ? 'url(#bgGradient)' : theme.background;
  const cardY = options.shadow ? 10 : 0;

  let y = options.padding + headerHeight + cardY;

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

  const titleY = options.padding + cardY + lineHeight - 5;
  const title = options.title
    ? `<text x="${options.padding + (options.windowControls ? 56 : 0)}" y="${titleY}" fill="${theme.comment}">${escapeXml(options.title)}</text>`
    : '';

  const languageTag = options.language
    ? `<text x="${width - options.padding - 80}" y="${titleY}" fill="${theme.comment}">${escapeXml(options.language)}</text>`
    : '';

  const controls = options.windowControls
    ? `<circle cx="${options.padding + 10}" cy="${options.padding + cardY + 8}" r="5" fill="#ff5f57" />
       <circle cx="${options.padding + 26}" cy="${options.padding + cardY + 8}" r="5" fill="#febc2e" />
       <circle cx="${options.padding + 42}" cy="${options.padding + cardY + 8}" r="5" fill="#28c840" />`
    : '';

  const watermark = options.watermark
    ? `<text x="${width - options.padding}" y="${height - options.padding / 2}" text-anchor="end" fill="${theme.comment}">${escapeXml(options.watermark)}</text>`
    : '';

  const defs = options.backgroundStyle === 'gradient'
    ? `<defs>
        <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${withOpacity(theme.background, 'FF')}" />
          <stop offset="100%" stop-color="${withOpacity(theme.background, 'CC')}" />
        </linearGradient>
      </defs>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height + cardY}" viewBox="0 0 ${width} ${height + cardY}">
  ${defs}
  <rect width="100%" height="100%" fill="${backgroundFill}" rx="14" />
  <g ${options.shadow ? 'filter="drop-shadow(0 8px 20px rgba(0,0,0,0.28))"' : ''}>
    <rect x="0" y="${cardY}" width="${width}" height="${height}" fill="${theme.background}" rx="14" />
  </g>
  <g font-family="${escapeXml(options.fontFamily)}" font-size="${options.fontSize}" xml:space="preserve">
    ${controls}
    ${title}
    ${languageTag}
    ${textRows}
    ${watermark}
  </g>
</svg>`;
}
