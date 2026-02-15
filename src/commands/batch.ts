import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

import fg from 'fast-glob';

import { loadConfig } from '../config/load-config.ts';
import { renderToFile } from '../render/pipeline.ts';
import type { OutputFormat } from '../types.ts';

export interface BatchCommandOptions {
  outDir?: string;
  format?: OutputFormat;
  theme?: string;
  lineNumbers?: boolean;
}

export async function runBatch(pattern: string, options: BatchCommandOptions): Promise<void> {
  const config = await loadConfig();
  const files = await fg(pattern, { onlyFiles: true, unique: true, dot: false });

  if (files.length === 0) {
    throw new Error(`No files matched pattern: ${pattern}`);
  }

  const outDir = options.outDir ?? 'snippets';
  const format = options.format ?? config.format;

  for (const file of files) {
    const outputFile = join(outDir, `${basename(file)}.${format}`);

    await renderToFile({
      code: await readFile(file, 'utf8'),
      outputFile,
      format,
      theme: options.theme ?? config.theme,
      fontFamily: config.fontFamily,
      fontSize: config.fontSize,
      padding: config.padding,
      lineNumbers: options.lineNumbers ?? config.lineNumbers,
      title: file
    });

    console.log(`Rendered ${outputFile}`);
  }
}
