import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { listCuratedFonts } from './fonts.ts';

test('LICENSE includes notices for bundled fonts', async () => {
  const licensePath = fileURLToPath(new URL('../../LICENSE', import.meta.url));
  const license = await readFile(licensePath, 'utf8');

  const bundledFonts = listCuratedFonts().filter((font) => font.source === 'bundled');

  assert.ok(
    license.includes('SIL OPEN FONT LICENSE Version 1.1'),
    'LICENSE must include SIL Open Font License text'
  );

  for (const font of bundledFonts) {
    assert.ok(
      license.includes(font.family),
      `LICENSE is missing bundled font notice for ${font.family}`
    );
  }
});
