// These are CSS font-family strings shown in the CLI wizard/list.
// Named families require host installation to render as expected.
// Generic families are always valid but may map to different concrete fonts per system.
const specificFonts = [
  'Fira Code',
  'JetBrains Mono',
  'Cascadia Code',
  'Source Code Pro',
  'IBM Plex Mono',
  'SFMono-Regular',
  'Menlo',
  'Monaco',
  'Consolas'
] as const;

const genericFallbacks = ['ui-monospace', 'monospace'] as const;

export function listFontFamilies(): string[] {
  return [...specificFonts, ...genericFallbacks];
}
