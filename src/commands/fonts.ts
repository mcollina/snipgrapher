import { listFontsWithAvailability } from '../fonts/availability.ts';

function formatAvailability(availability: 'bundled' | 'installed' | 'generic' | 'unavailable'): string {
  if (availability === 'bundled') {
    return 'bundled';
  }

  if (availability === 'installed') {
    return 'installed';
  }

  if (availability === 'generic') {
    return 'generic fallback';
  }

  return 'unavailable';
}

export async function runFontsList(): Promise<void> {
  console.log('Available font-family values:');

  const fonts = await listFontsWithAvailability();
  for (const font of fonts) {
    const status = formatAvailability(font.availability);
    console.log(`${font.family}\t[${status}]`);
  }

  console.log('');
  console.log('Legend: bundled fonts ship with snipgrapher for PNG/WebP rendering.');
  console.log('System fonts depend on local installation.');
}
