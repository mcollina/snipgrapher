import { basename } from 'node:path';

import { loadConfig } from '../config/load-config.ts';
import { loadEnvConfig } from '../config/env.ts';
import { render, renderToFile } from '../render/pipeline.ts';
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
  scale?: number;
  watermark?: string;
  language?: string;
  profile?: string;
  stdin?: boolean;
  code?: string;
}

async function writeStdout(output: string | Buffer): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    process.stdout.write(output, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export async function runRender(
  input: string | undefined,
  options: RenderCommandOptions
): Promise<RenderResult> {
  const envConfig = loadEnvConfig();
  const config = await loadConfig(process.cwd(), options.profile ?? envConfig.profile);
  const effectiveConfig = {
    ...config,
    ...envConfig.overrides
  };

  const inputData = await resolveCodeInput({
    input,
    stdin: options.stdin,
    code: options.code
  });

  const writeToStdout = !options.output && !process.stdout.isTTY;
  const outputFile =
    options.output ??
    (writeToStdout ? 'stdout' : `snippet.${options.format ?? effectiveConfig.format}`);
  const format =
    options.format ?? (writeToStdout ? effectiveConfig.format : inferFormat(outputFile, effectiveConfig.format));
  const theme = options.theme ?? effectiveConfig.theme;
  const language = detectLanguage(input, options.language);

  const renderOptions = {
    code: inputData.code,
    outputFile,
    format,
    theme,
    fontFamily: options.fontFamily ?? effectiveConfig.fontFamily,
    fontSize: options.fontSize ?? effectiveConfig.fontSize,
    padding: options.padding ?? effectiveConfig.padding,
    lineNumbers: options.lineNumbers ?? effectiveConfig.lineNumbers,
    windowControls: options.windowControls ?? effectiveConfig.windowControls,
    shadow: options.shadow ?? effectiveConfig.shadow,
    backgroundStyle: options.backgroundStyle ?? effectiveConfig.backgroundStyle,
    scale: options.scale ?? effectiveConfig.scale,
    watermark: options.watermark ?? effectiveConfig.watermark,
    language,
    title: inputData.title ? basename(inputData.title) : undefined
  };

  if (writeToStdout) {
    const output = await render(renderOptions);
    await writeStdout(output);
  } else {
    await renderToFile(renderOptions);
  }

  return {
    input,
    outputFile,
    format,
    theme,
    language
  };
}
