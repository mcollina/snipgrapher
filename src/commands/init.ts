import { access, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';

import { defaultConfig } from '../config/defaults.ts';
import { validateConfig } from '../config/validate-config.ts';
import { listThemes } from '../theme/themes.ts';
import type { BackgroundStyle, OutputFormat, SnipgrapherConfig, SnipgrapherConfigFile } from '../types.ts';

async function askString(
  ask: (prompt: string) => Promise<string>,
  label: string,
  fallback: string
): Promise<string> {
  const value = (await ask(`${label} [${fallback}]: `)).trim();
  return value === '' ? fallback : value;
}

async function askNumber(
  ask: (prompt: string) => Promise<string>,
  label: string,
  fallback: number,
  min: number,
  max: number
): Promise<number> {
  const raw = (await ask(`${label} [${fallback}]: `)).trim();
  if (raw === '') return fallback;

  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`Invalid value for ${label}: expected number between ${min} and ${max}`);
  }

  return value;
}

async function askBoolean(
  ask: (prompt: string) => Promise<string>,
  label: string,
  fallback: boolean
): Promise<boolean> {
  const fallbackText = fallback ? 'Y/n' : 'y/N';
  const raw = (await ask(`${label} [${fallbackText}]: `)).trim().toLowerCase();

  if (raw === '') return fallback;
  if (['y', 'yes', '1', 'true', 'on'].includes(raw)) return true;
  if (['n', 'no', '0', 'false', 'off'].includes(raw)) return false;

  throw new Error(`Invalid value for ${label}: expected yes/no`);
}

async function askEnum<T extends string>(
  ask: (prompt: string) => Promise<string>,
  label: string,
  values: readonly T[],
  fallback: T
): Promise<T> {
  const raw = (await ask(`${label} (${values.join('/')}) [${fallback}]: `)).trim();
  if (raw === '') return fallback;

  if ((values as readonly string[]).includes(raw)) {
    return raw as T;
  }

  throw new Error(`Invalid value for ${label}: expected one of ${values.join(', ')}`);
}

async function promptConfig(ask: (prompt: string) => Promise<string>): Promise<SnipgrapherConfig> {
  const availableThemes = listThemes().map((theme) => theme.name);

  const theme = await askEnum(ask, 'Theme', availableThemes, defaultConfig.theme);
  const format = await askEnum<OutputFormat>(ask, 'Output format', ['svg', 'png', 'webp'], 'svg');
  const fontFamily = await askString(ask, 'Font family', defaultConfig.fontFamily);
  const fontSize = await askNumber(ask, 'Font size', defaultConfig.fontSize, 8, 64);
  const padding = await askNumber(ask, 'Padding', defaultConfig.padding, 0, 256);
  const lineNumbers = await askBoolean(ask, 'Show line numbers', defaultConfig.lineNumbers);
  const windowControls = await askBoolean(
    ask,
    'Show macOS window controls',
    defaultConfig.windowControls
  );
  const shadow = await askBoolean(ask, 'Enable shadow', defaultConfig.shadow);
  const backgroundStyle = await askEnum<BackgroundStyle>(
    ask,
    'Background style',
    ['solid', 'gradient'],
    defaultConfig.backgroundStyle
  );
  const scale = await askNumber(ask, 'PNG render scale', defaultConfig.scale, 1, 4);
  const watermark = await askString(ask, 'Watermark (empty to disable)', defaultConfig.watermark ?? '');

  return {
    theme,
    format,
    fontFamily,
    fontSize,
    padding,
    lineNumbers,
    windowControls,
    shadow,
    backgroundStyle,
    scale,
    watermark
  };
}

export async function runInit(cwd = process.cwd()): Promise<void> {
  const target = resolve(cwd, 'snipgrapher.config.json');

  try {
    await access(target);
    throw new Error(`Config already exists: ${target}`);
  } catch (error) {
    if (error instanceof Error && !error.message.includes('ENOENT')) {
      throw error;
    }
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('init requires an interactive terminal (stdin/stdout must be TTY)');
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    console.log('snipgrapher init wizard');
    console.log('Press Enter to accept defaults.\n');

    const config = await promptConfig((prompt) => rl.question(prompt));
    validateConfig(config, 'config');

    const template: SnipgrapherConfigFile = {
      ...config,
      defaultProfile: 'default',
      profiles: {
        default: {},
        social: {
          fontSize: 16,
          padding: 48,
          lineNumbers: false,
          watermark: 'snipgrapher'
        }
      }
    };

    await writeFile(target, `${JSON.stringify(template, null, 2)}\n`, 'utf8');
    console.log(`\nCreated ${target}`);
  } finally {
    rl.close();
  }
}
