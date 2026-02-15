import { basename } from 'node:path';

import { loadConfig } from '../config/load-config.ts';
import { renderToFile } from '../render/pipeline.ts';
import type { OutputFormat } from '../types.ts';
import { resolveCodeInput } from '../utils/input.ts';
import { inferFormat } from '../utils/output.ts';

export interface RenderCommandOptions {
  output?: string;
  format?: OutputFormat;
  theme?: string;
  fontFamily?: string;
  fontSize?: number;
  padding?: number;
  lineNumbers?: boolean;
  stdin?: boolean;
  code?: string;
}

export async function runRender(input: string | undefined, options: RenderCommandOptions): Promise<void> {
  const config = await loadConfig();
  const inputData = await resolveCodeInput({
    input,
    stdin: options.stdin,
    code: options.code
  });

  const outputFile = options.output ?? `snippet.${options.format ?? config.format}`;
  const format = options.format ?? inferFormat(outputFile, config.format);

  await renderToFile({
    code: inputData.code,
    outputFile,
    format,
    theme: options.theme ?? config.theme,
    fontFamily: options.fontFamily ?? config.fontFamily,
    fontSize: options.fontSize ?? config.fontSize,
    padding: options.padding ?? config.padding,
    lineNumbers: options.lineNumbers ?? config.lineNumbers,
    title: inputData.title ? basename(inputData.title) : undefined
  });

  console.log(`Rendered ${outputFile}`);
}
