import { readFile } from 'node:fs/promises';

import chokidar from 'chokidar';

import { loadConfig } from '../config/load-config.ts';
import { loadEnvConfig } from '../config/env.ts';
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
  const envConfig = loadEnvConfig();
  const config = await loadConfig(process.cwd(), options.profile ?? envConfig.profile);
  const effectiveConfig = {
    ...config,
    ...envConfig.overrides
  };

  const outputFile = options.output ?? `snippet.${options.format ?? effectiveConfig.format}`;
  const format = options.format ?? inferFormat(outputFile, effectiveConfig.format);

  const render = async (): Promise<void> => {
    const code = await readFile(input, 'utf8');

    await renderToFile({
      code,
      outputFile,
      format,
      theme: options.theme ?? effectiveConfig.theme,
      fontFamily: effectiveConfig.fontFamily,
      fontSize: effectiveConfig.fontSize,
      padding: effectiveConfig.padding,
      lineNumbers: options.lineNumbers ?? effectiveConfig.lineNumbers,
      windowControls: options.windowControls ?? effectiveConfig.windowControls,
      shadow: options.shadow ?? effectiveConfig.shadow,
      backgroundStyle: options.backgroundStyle ?? effectiveConfig.backgroundStyle,
      watermark: options.watermark ?? effectiveConfig.watermark,
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
