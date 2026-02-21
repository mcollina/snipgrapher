import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { listBundledFontFiles } from './fonts.ts';

export function getBundledFontPaths(): string[] {
  return listBundledFontFiles()
    .map((fileName) => fileURLToPath(new URL(`../../assets/fonts/${fileName}`, import.meta.url)))
    .filter((fontPath) => existsSync(fontPath));
}
