import { access, readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

import { parse as parseToml } from '@iarna/toml';
import YAML from 'yaml';

import type { SnipgrapherConfig, SnipgrapherConfigFile } from '../types.ts';
import { defaultConfig } from './defaults.ts';
import { validateConfig } from './validate-config.ts';

const CONFIG_CANDIDATES = [
  'snipgrapher.config.json',
  'snipgrapher.config.yaml',
  'snipgrapher.config.yml',
  'snipgrapher.config.toml'
];

function pickRootConfig(config: SnipgrapherConfigFile): Partial<SnipgrapherConfig> {
  const {
    theme,
    fontFamily,
    fontSize,
    padding,
    lineNumbers,
    windowControls,
    shadow,
    backgroundStyle,
    scale,
    watermark,
    format
  } = config;

  return {
    theme,
    fontFamily,
    fontSize,
    padding,
    lineNumbers,
    windowControls,
    shadow,
    backgroundStyle,
    scale,
    watermark,
    format
  };
}

async function findConfigPath(cwd: string): Promise<string | undefined> {
  for (const name of CONFIG_CANDIDATES) {
    const path = resolve(cwd, name);

    try {
      await access(path);
      return path;
    } catch {
      // Continue.
    }
  }

  return undefined;
}

function parseConfig(raw: string, path: string): SnipgrapherConfigFile {
  const ext = extname(path).toLowerCase();

  try {
    if (ext === '.json') {
      return JSON.parse(raw) as SnipgrapherConfigFile;
    }

    if (ext === '.yaml' || ext === '.yml') {
      return YAML.parse(raw) as SnipgrapherConfigFile;
    }

    if (ext === '.toml') {
      return parseToml(raw) as SnipgrapherConfigFile;
    }

    throw new Error(`Unsupported config extension: ${ext}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid config: failed to parse ${path} (${reason})`);
  }
}

export async function loadConfig(
  cwd = process.cwd(),
  profile?: string
): Promise<SnipgrapherConfig> {
  const configPath = await findConfigPath(cwd);

  if (!configPath) {
    return defaultConfig;
  }

  const raw = await readFile(configPath, 'utf8');
  const userConfig = parseConfig(raw, configPath);

  const rootConfig = pickRootConfig(userConfig);
  validateConfig(rootConfig, 'config');

  const selectedProfile = profile ?? userConfig.defaultProfile;

  if (userConfig.profiles) {
    for (const [name, profileConfig] of Object.entries(userConfig.profiles)) {
      validateConfig(profileConfig, `profile '${name}'`);
    }
  }

  const profileConfig = selectedProfile ? userConfig.profiles?.[selectedProfile] : undefined;

  if (selectedProfile && !profileConfig) {
    throw new Error(`Invalid config: unknown profile '${selectedProfile}'`);
  }

  return {
    ...defaultConfig,
    ...rootConfig,
    ...profileConfig
  };
}
