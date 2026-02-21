export type FontSource = 'bundled' | 'system' | 'generic';

export interface CuratedFont {
  family: string;
  source: FontSource;
  fileName?: string;
}

// These are CSS/SVG font-family values used by the renderer.
// Bundled fonts are shipped with the package and loaded by the rasterizer.
// System fonts depend on host installation. Generic families are always valid.
const curatedFonts: CuratedFont[] = [
  { family: 'Fira Code', source: 'bundled', fileName: 'FiraCode-Regular.ttf' },
  { family: 'JetBrains Mono', source: 'bundled', fileName: 'JetBrainsMono-Regular.ttf' },
  { family: 'Cascadia Code', source: 'bundled', fileName: 'CascadiaCode-Regular.ttf' },
  { family: 'Source Code Pro', source: 'bundled', fileName: 'SourceCodePro-Regular.ttf' },
  { family: 'IBM Plex Mono', source: 'bundled', fileName: 'IBMPlexMono-Regular.ttf' },
  { family: 'SFMono-Regular', source: 'system' },
  { family: 'Menlo', source: 'system' },
  { family: 'Monaco', source: 'system' },
  { family: 'Consolas', source: 'system' },
  { family: 'ui-monospace', source: 'generic' },
  { family: 'monospace', source: 'generic' }
];

export function listCuratedFonts(): CuratedFont[] {
  return curatedFonts.map((font) => ({ ...font }));
}

export function listFontFamilies(): string[] {
  return curatedFonts.map((font) => font.family);
}

export function listBundledFontFiles(): string[] {
  return curatedFonts
    .filter((font) => font.source === 'bundled' && font.fileName)
    .map((font) => font.fileName as string);
}
