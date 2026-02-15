import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import type { SnipgrapherConfig, SnipgrapherConfigFile } from '../types.ts';
import { defaultConfig } from './defaults.ts';
import { validateConfig } from './validate-config.ts';

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
    watermark,
    format
  };
}

export async function loadConfig(cwd = process.cwd(), profile?: string): Promise<SnipgrapherConfig> {
  const configPath = resolve(cwd, 'snipgrapher.config.json');

  try {
    await access(configPath);
    const raw = await readFile(configPath, 'utf8');
    const userConfig = JSON.parse(raw) as SnipgrapherConfigFile;

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
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Invalid')) {
      throw error;
    }

    return defaultConfig;
  }
}
