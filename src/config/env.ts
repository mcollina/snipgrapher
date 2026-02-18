import type { BackgroundStyle, OutputFormat, SnipgrapherConfig } from '../types.ts';
import { validateConfig } from './validate-config.ts';

export interface EnvConfigResult {
  profile?: string;
  overrides: Partial<SnipgrapherConfig>;
}

function readString(env: NodeJS.ProcessEnv, name: string): string | undefined {
  const value = env[name];
  if (value === undefined || value === '') return undefined;
  return value;
}

function readNumber(env: NodeJS.ProcessEnv, name: string): number | undefined {
  const value = readString(env, name);
  if (value === undefined) return undefined;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid environment variable ${name}: expected a number`);
  }

  return parsed;
}

function readBoolean(env: NodeJS.ProcessEnv, name: string): boolean | undefined {
  const value = readString(env, name)?.toLowerCase();
  if (value === undefined) return undefined;

  if (['1', 'true', 'yes', 'on'].includes(value)) return true;
  if (['0', 'false', 'no', 'off'].includes(value)) return false;

  throw new Error(`Invalid environment variable ${name}: expected boolean (true/false)`);
}

function readEnum<T extends string>(
  env: NodeJS.ProcessEnv,
  name: string,
  allowed: readonly T[]
): T | undefined {
  const value = readString(env, name);
  if (value === undefined) return undefined;

  if ((allowed as readonly string[]).includes(value)) {
    return value as T;
  }

  throw new Error(`Invalid environment variable ${name}: expected one of ${allowed.join(', ')}`);
}

export function loadEnvConfig(env: NodeJS.ProcessEnv = process.env): EnvConfigResult {
  const profile = readString(env, 'SNIPGRAPHER_PROFILE');

  const overrides: Partial<SnipgrapherConfig> = {
    theme: readString(env, 'SNIPGRAPHER_THEME'),
    fontFamily: readString(env, 'SNIPGRAPHER_FONT_FAMILY'),
    fontSize: readNumber(env, 'SNIPGRAPHER_FONT_SIZE'),
    padding: readNumber(env, 'SNIPGRAPHER_PADDING'),
    lineNumbers: readBoolean(env, 'SNIPGRAPHER_LINE_NUMBERS'),
    windowControls: readBoolean(env, 'SNIPGRAPHER_WINDOW_CONTROLS'),
    shadow: readBoolean(env, 'SNIPGRAPHER_SHADOW'),
    backgroundStyle: readEnum<BackgroundStyle>(env, 'SNIPGRAPHER_BACKGROUND_STYLE', [
      'solid',
      'gradient'
    ]),
    watermark: readString(env, 'SNIPGRAPHER_WATERMARK'),
    format: readEnum<OutputFormat>(env, 'SNIPGRAPHER_FORMAT', ['svg', 'png', 'webp'])
  };

  validateConfig(overrides, 'environment');

  return {
    profile,
    overrides
  };
}
