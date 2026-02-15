import { readFile } from 'node:fs/promises';

import chokidar from 'chokidar';

import { loadConfig } from '../config/load-config.ts';
import { renderToFile } from '../render/pipeline.ts';
import type { BackgroundStyle, OutputFormat } from '../types.ts';
import { detectLanguage } from '../utils/language.ts';
import { inferFormat } from '../utils/output.ts';

export interface WatchCommandOptions {
  output?: string;
  format?: OutputFormat;
  theme?: string;
  lineNumbers?: boolean;
  windowControls?: boolean;
  shadow?: boolean;
  backgroundStyle?: BackgroundStyle;
  watermark?: string;
  language?: string;
  profile?: string;
}

export async function runWatch(input: string, options: WatchCommandOptions): Promise<void> {
  const config = await loadConfig(process.cwd(), options.profile);
  const outputFile = options.output ?? `snippet.${options.format ?? config.format}`;
  const format = options.format ?? inferFormat(outputFile, config.format);

  const render = async (): Promise<void> => {
    const code = await readFile(input, 'utf8');

    await renderToFile({
      code,
      outputFile,
      format,
      theme: options.theme ?? config.theme,
      fontFamily: config.fontFamily,
      fontSize: config.fontSize,
      padding: config.padding,
      lineNumbers: options.lineNumbers ?? config.lineNumbers,
      windowControls: options.windowControls ?? config.windowControls,
      shadow: options.shadow ?? config.shadow,
      backgroundStyle: options.backgroundStyle ?? config.backgroundStyle,
      watermark: options.watermark ?? config.watermark,
      language: detectLanguage(input, options.language),
      title: input
    });

    console.log(`[watch] rendered ${outputFile}`);
  };

  await render();

  const watcher = chokidar.watch(input, {
    ignoreInitial: true
  });

  watcher.on('change', async () => {
    try {
      await render();
    } catch (error) {
      console.error('[watch] render failed', error);
    }
  });

  console.log(`[watch] watching ${input}`);
}
