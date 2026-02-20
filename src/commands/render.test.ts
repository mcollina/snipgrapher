import assert from 'node:assert/strict';
import test from 'node:test';

import { runRender } from './render.ts';

test('runRender writes image bytes to stdout when output is redirected', async () => {
  const originalIsTTY = process.stdout.isTTY;
  const originalWrite = process.stdout.write;

  let written = '';

  process.stdout.isTTY = false;
  (process.stdout as any).write = (...args: any[]): boolean => {
    const [chunk, encodingOrCallback, callback] = args;

    written += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);

    const cb =
      typeof encodingOrCallback === 'function'
        ? encodingOrCallback
        : typeof callback === 'function'
          ? callback
          : undefined;

    cb?.(null);
    return true;
  };

  try {
    const result = await runRender(undefined, {
      code: 'const value = 42;',
      format: 'svg'
    });

    assert.equal(result.outputFile, 'stdout');
    assert.match(written, /<svg[\s>]/);
  } finally {
    process.stdout.isTTY = originalIsTTY;
    process.stdout.write = originalWrite;
  }
});
