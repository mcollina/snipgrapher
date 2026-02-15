import { basename } from 'node:path';

import { loadConfig } from '../config/load-config.ts';
import { renderToFile } from '../render/pipeline.ts';
import type { BackgroundStyle, OutputFormat, RenderResult } from '../types.ts';
import { resolveCodeInput } from '../utils/input.ts';
import { detectLanguage } from '../utils/language.ts';
import { inferFormat } from '../utils/output.ts';

export interface RenderCommandOptions {
  output?: string;
  format?: OutputFormat;
  theme?: string;
  fontFamily?: string;
  fontSize?: number;
  padding?: number;
  lineNumbers?: boolean;
  windowControls?: boolean;
  shadow?: boolean;
  backgroundStyle?: BackgroundStyle;
  watermark?: string;
  language?: string;
  profile?: string;
  stdin?: boolean;
  code?: string;
}

export async function runRender(
  input: string | undefined,
  options: RenderCommandOptions
): Promise<RenderResult> {
  const config = await loadConfig(process.cwd(), options.profile);
  const inputData = await resolveCodeInput({
    input,
    stdin: options.stdin,
    code: options.code
  });

  const outputFile = options.output ?? `snippet.${options.format ?? config.format}`;
  const format = options.format ?? inferFormat(outputFile, config.format);
  const theme = options.theme ?? config.theme;
  const language = detectLanguage(input, options.language);

  await renderToFile({
    code: inputData.code,
    outputFile,
    format,
    theme,
    fontFamily: options.fontFamily ?? config.fontFamily,
    fontSize: options.fontSize ?? config.fontSize,
    padding: options.padding ?? config.padding,
    lineNumbers: options.lineNumbers ?? config.lineNumbers,
    windowControls: options.windowControls ?? config.windowControls,
    shadow: options.shadow ?? config.shadow,
    backgroundStyle: options.backgroundStyle ?? config.backgroundStyle,
    watermark: options.watermark ?? config.watermark,
    language,
    title: inputData.title ? basename(inputData.title) : undefined
  });

  return {
    input,
    outputFile,
    format,
    theme,
    language
  };
}
