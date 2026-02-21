import { listFontFamilies } from '../fonts/fonts.ts';

export function runFontsList(): void {
  console.log('Available font-family values:');
  for (const fontFamily of listFontFamilies()) {
    console.log(fontFamily);
  }

  console.log('');
  console.log(
    'Note: named fonts require local installation. PNG/WebP rendering uses system font fallback when a font is missing.'
  );
}
