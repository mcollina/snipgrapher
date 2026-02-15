import { access, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { defaultConfig } from '../config/defaults.ts';

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

  const template = {
    ...defaultConfig,
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
  console.log(`Created ${target}`);
}
