import { extname } from 'node:path';

import type { OutputFormat } from '../types.ts';

export function inferFormat(outputFile: string, fallback: OutputFormat): OutputFormat {
  const ext = extname(outputFile).toLowerCase();

  if (ext === '.png') return 'png';
  if (ext === '.svg') return 'svg';
  if (ext === '.webp') return 'webp';

  return fallback;
}
