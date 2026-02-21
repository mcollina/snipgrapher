import assert from 'node:assert/strict';
import test from 'node:test';

import { getTheme, listThemes } from './themes.ts';

test('listThemes includes Carbon theme catalog', () => {
  const names = new Set(listThemes().map((theme) => theme.name));

  assert.ok(names.has('dracula'));
  assert.ok(names.has('3024-night'));
  assert.ok(names.has('synthwave-84'));
  assert.ok(names.has('vscode'));
});

test('getTheme falls back to dracula for unknown themes', () => {
  const theme = getTheme('__does_not_exist__');
  assert.equal(theme.name, 'dracula');
});
