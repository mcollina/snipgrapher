import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

import fg from 'fast-glob';

import { loadConfig } from '../config/load-config.ts';
import { renderToFile } from '../render/pipeline.ts';
import type { BackgroundStyle, OutputFormat, RenderResult } from '../types.ts';
import { detectLanguage } from '../utils/language.ts';

export interface BatchCommandOptions {
  outDir?: string;
  format?: OutputFormat;
  theme?: string;
  lineNumbers?: boolean;
  windowControls?: boolean;
  shadow?: boolean;
  backgroundStyle?: BackgroundStyle;
  watermark?: string;
  language?: string;
  profile?: string;
  concurrency?: number;
}

export async function runBatch(pattern: string, options: BatchCommandOptions): Promise<RenderResult[]> {
  const config = await loadConfig(process.cwd(), options.profile);
  const files = await fg(pattern, { onlyFiles: true, unique: true, dot: false });

  if (files.length === 0) {
    throw new Error(`No files matched pattern: ${pattern}`);
  }

  const outDir = options.outDir ?? 'snippets';
  const format = options.format ?? config.format;
  const theme = options.theme ?? config.theme;
  const concurrency = Math.max(1, Math.min(options.concurrency ?? 4, 32));

  const results: RenderResult[] = new Array(files.length);
  let cursor = 0;

  const worker = async (): Promise<void> => {
    while (true) {
      const idx = cursor;
      cursor += 1;

      if (idx >= files.length) {
        return;
      }

      const file = files[idx];
      const outputFile = join(outDir, `${basename(file)}.${format}`);
      const language = detectLanguage(file, options.language);

      await renderToFile({
        code: await readFile(file, 'utf8'),
        outputFile,
        format,
        theme,
        fontFamily: config.fontFamily,
        fontSize: config.fontSize,
        padding: config.padding,
        lineNumbers: options.lineNumbers ?? config.lineNumbers,
        windowControls: options.windowControls ?? config.windowControls,
        shadow: options.shadow ?? config.shadow,
        backgroundStyle: options.backgroundStyle ?? config.backgroundStyle,
        watermark: options.watermark ?? config.watermark,
        language,
        title: file
      });

      results[idx] = {
        input: file,
        outputFile,
        format,
        theme,
        language
      };
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, files.length) }, worker));

  return results;
}
