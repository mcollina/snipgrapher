import { readFile } from 'node:fs/promises';

import chokidar from 'chokidar';

import { loadConfig } from '../config/load-config.ts';
import { renderToFile } from '../render/pipeline.ts';
import type { OutputFormat } from '../types.ts';
import { inferFormat } from '../utils/output.ts';

export interface WatchCommandOptions {
  output?: string;
  format?: OutputFormat;
  theme?: string;
  lineNumbers?: boolean;
}

export async function runWatch(input: string, options: WatchCommandOptions): Promise<void> {
  const config = await loadConfig();
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
