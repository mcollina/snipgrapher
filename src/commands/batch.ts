import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

import fg from 'fast-glob';

import { loadConfig } from '../config/load-config.ts';
import { loadEnvConfig } from '../config/env.ts';
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

export async function runBatch(
  pattern: string,
  options: BatchCommandOptions
): Promise<RenderResult[]> {
  const envConfig = loadEnvConfig();
  const config = await loadConfig(process.cwd(), options.profile ?? envConfig.profile);
  const effectiveConfig = {
    ...config,
    ...envConfig.overrides
  };

  const files = await fg(pattern, { onlyFiles: true, unique: true, dot: false });

  if (files.length === 0) {
    throw new Error(`No files matched pattern: ${pattern}`);
  }

  const outDir = options.outDir ?? 'snippets';
  const format = options.format ?? effectiveConfig.format;
  const theme = options.theme ?? effectiveConfig.theme;
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
        fontFamily: effectiveConfig.fontFamily,
        fontSize: effectiveConfig.fontSize,
        padding: effectiveConfig.padding,
        lineNumbers: options.lineNumbers ?? effectiveConfig.lineNumbers,
        windowControls: options.windowControls ?? effectiveConfig.windowControls,
        shadow: options.shadow ?? effectiveConfig.shadow,
        backgroundStyle: options.backgroundStyle ?? effectiveConfig.backgroundStyle,
        watermark: options.watermark ?? effectiveConfig.watermark,
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
