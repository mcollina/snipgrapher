import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import type { SnipgrapherConfig } from '../types.ts';
import { defaultConfig } from './defaults.ts';

export async function loadConfig(cwd = process.cwd()): Promise<SnipgrapherConfig> {
  const configPath = resolve(cwd, 'snipgrapher.config.json');

  try {
    await access(configPath);
    const raw = await readFile(configPath, 'utf8');
    const userConfig = JSON.parse(raw) as Partial<SnipgrapherConfig>;

    return {
      ...defaultConfig,
      ...userConfig
    };
  } catch {
    return defaultConfig;
  }
}
