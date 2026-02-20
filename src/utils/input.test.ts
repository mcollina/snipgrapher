import assert from 'node:assert/strict';
import test from 'node:test';

import { shouldUseStdin } from './input.ts';

test('shouldUseStdin is true when --stdin is set', () => {
  const original = process.stdin.isTTY;
  process.stdin.isTTY = true;

  try {
    assert.equal(shouldUseStdin({ stdin: true }), true);
  } finally {
    process.stdin.isTTY = original;
  }
});

test('shouldUseStdin is true when input is piped and no file/code was provided', () => {
  const original = process.stdin.isTTY;
  process.stdin.isTTY = false;

  try {
    assert.equal(shouldUseStdin({}), true);
  } finally {
    process.stdin.isTTY = original;
  }
});

test('shouldUseStdin is false for interactive shell without --stdin and no input', () => {
  const original = process.stdin.isTTY;
  process.stdin.isTTY = true;

  try {
    assert.equal(shouldUseStdin({}), false);
  } finally {
    process.stdin.isTTY = original;
  }
});

test('shouldUseStdin is false when file input is provided', () => {
  const original = process.stdin.isTTY;
  process.stdin.isTTY = false;

  try {
    assert.equal(shouldUseStdin({ input: 'a.ts' }), false);
  } finally {
    process.stdin.isTTY = original;
  }
});
