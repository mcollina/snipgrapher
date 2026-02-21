import { access, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import inquirer from 'inquirer';

import { defaultConfig } from '../config/defaults.ts';
import { validateConfig } from '../config/validate-config.ts';
import { listFontFamilies } from '../fonts/fonts.ts';
import { listThemes } from '../theme/themes.ts';
import type {
  BackgroundStyle,
  OutputFormat,
  SnipgrapherConfig,
  SnipgrapherConfigFile
} from '../types.ts';

const customFontChoice = 'Custom (enter manually)';

interface InitWizardAnswers {
  theme: string;
  format: OutputFormat;
  fontFamily?: string;
  fontFamilyChoice?: string;
  customFontFamily?: string;
  fontSize: string;
  padding: string;
  lineNumbers: boolean;
  windowControls: boolean;
  shadow: boolean;
  backgroundStyle: BackgroundStyle;
  scale: string;
  watermark: string;
}

function numberValidator(label: string, min: number, max: number) {
  return (value: string): true | string => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
      return `${label} must be a number between ${min} and ${max}`;
    }

    return true;
  };
}

function parseNumber(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid value for ${label}: expected a number`);
  }

  return parsed;
}

function resolveFontFamily(answers: InitWizardAnswers): string {
  if (answers.fontFamily && answers.fontFamily.trim().length > 0) {
    return answers.fontFamily.trim();
  }

  if (answers.fontFamilyChoice && answers.fontFamilyChoice !== customFontChoice) {
    return answers.fontFamilyChoice;
  }

  const customFontFamily = answers.customFontFamily?.trim();
  if (customFontFamily) {
    return customFontFamily;
  }

  return defaultConfig.fontFamily;
}

async function promptConfig(): Promise<SnipgrapherConfig> {
  const availableThemes = listThemes().map((theme) => theme.name);
  const availableFontFamilies = listFontFamilies();

  const answers = (await inquirer.prompt([
    {
      type: 'list',
      name: 'theme',
      message: 'Choose a theme',
      choices: availableThemes,
      default: defaultConfig.theme
    },
    {
      type: 'list',
      name: 'format',
      message: 'Default output format',
      choices: ['svg', 'png', 'webp'],
      default: defaultConfig.format
    },
    {
      type: 'list',
      name: 'fontFamilyChoice',
      message: 'Choose a font family',
      choices: [...availableFontFamilies, customFontChoice],
      default: availableFontFamilies.includes(defaultConfig.fontFamily)
        ? defaultConfig.fontFamily
        : customFontChoice
    },
    {
      type: 'input',
      name: 'customFontFamily',
      message: 'Custom font family',
      when: (answers: InitWizardAnswers) => answers.fontFamilyChoice === customFontChoice,
      validate: (value: string) => (value.trim().length > 0 ? true : 'Font family cannot be empty')
    },
    {
      type: 'input',
      name: 'fontSize',
      message: 'Font size',
      default: String(defaultConfig.fontSize),
      validate: numberValidator('fontSize', 8, 64)
    },
    {
      type: 'input',
      name: 'padding',
      message: 'Padding',
      default: String(defaultConfig.padding),
      validate: numberValidator('padding', 0, 256)
    },
    {
      type: 'confirm',
      name: 'lineNumbers',
      message: 'Show line numbers?',
      default: defaultConfig.lineNumbers
    },
    {
      type: 'confirm',
      name: 'windowControls',
      message: 'Show macOS window controls?',
      default: defaultConfig.windowControls
    },
    {
      type: 'confirm',
      name: 'shadow',
      message: 'Enable drop shadow?',
      default: defaultConfig.shadow
    },
    {
      type: 'list',
      name: 'backgroundStyle',
      message: 'Background style',
      choices: ['solid', 'gradient'],
      default: defaultConfig.backgroundStyle
    },
    {
      type: 'input',
      name: 'scale',
      message: 'PNG render scale',
      default: String(defaultConfig.scale),
      validate: numberValidator('scale', 1, 4)
    },
    {
      type: 'input',
      name: 'watermark',
      message: 'Watermark text (leave empty for none)',
      default: defaultConfig.watermark ?? ''
    }
  ] as any)) as InitWizardAnswers;

  return {
    theme: answers.theme,
    format: answers.format,
    fontFamily: resolveFontFamily(answers),
    fontSize: parseNumber(answers.fontSize, 'fontSize'),
    padding: parseNumber(answers.padding, 'padding'),
    lineNumbers: answers.lineNumbers,
    windowControls: answers.windowControls,
    shadow: answers.shadow,
    backgroundStyle: answers.backgroundStyle,
    scale: parseNumber(answers.scale, 'scale'),
    watermark: answers.watermark
  };
}

export interface InitCommandOptions {
  force?: boolean;
}

export async function runInit(
  cwd = process.cwd(),
  options: InitCommandOptions = {}
): Promise<void> {
  const target = resolve(cwd, 'snipgrapher.config.json');

  try {
    await access(target);

    if (!options.force) {
      throw new Error(`Config already exists: ${target}. Use --force to overwrite.`);
    }
  } catch (error) {
    if (error instanceof Error && !error.message.includes('ENOENT')) {
      throw error;
    }
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('init requires an interactive terminal (stdin/stdout must be TTY)');
  }

  console.log('snipgrapher init wizard');

  const config = await promptConfig();
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
  console.log(`Created ${target}`);
}
