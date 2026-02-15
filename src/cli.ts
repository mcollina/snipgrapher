#!/usr/bin/env node

import { Command } from 'commander';

import { runBatch } from './commands/batch.ts';
import { runDoctor } from './commands/doctor.ts';
import { runInit } from './commands/init.ts';
import { runRender } from './commands/render.ts';
import { runThemesList, runThemesPreview } from './commands/themes.ts';
import { runWatch } from './commands/watch.ts';
import type { OutputFormat } from './types.ts';
import { printError } from './utils/errors.ts';

const program = new Command();

program.name('snipgrapher').description('Render code snippets to images').version('0.1.0');

program
  .command('render')
  .argument('[input]', 'Input file path')
  .option('-o, --output <file>', 'Output file path')
  .option('-f, --format <format>', 'Output format: svg|png')
  .option('--theme <theme>', 'Theme name')
  .option('--font-family <fontFamily>', 'Font family')
  .option('--font-size <fontSize>', 'Font size', Number)
  .option('--padding <padding>', 'Frame padding', Number)
  .option('--line-numbers', 'Enable line numbers')
  .option('--stdin', 'Read code from stdin')
  .option('--code <code>', 'Inline code')
  .action(async (input: string | undefined, options) => {
    await runRender(input, {
      output: options.output,
      format: options.format as OutputFormat | undefined,
      theme: options.theme,
      fontFamily: options.fontFamily,
      fontSize: options.fontSize,
      padding: options.padding,
      lineNumbers: options.lineNumbers,
      stdin: options.stdin,
      code: options.code
    });
  });

program
  .command('batch')
  .argument('<glob>', 'Glob pattern (e.g. src/**/*.ts)')
  .option('--out-dir <dir>', 'Output directory', 'snippets')
  .option('-f, --format <format>', 'Output format: svg|png')
  .option('--theme <theme>', 'Theme name')
  .option('--line-numbers', 'Enable line numbers')
  .action(async (glob: string, options) => {
    await runBatch(glob, {
      outDir: options.outDir,
      format: options.format as OutputFormat | undefined,
      theme: options.theme,
      lineNumbers: options.lineNumbers
    });
  });

program
  .command('watch')
  .argument('<input>', 'Input file to watch')
  .option('-o, --output <file>', 'Output file path')
  .option('-f, --format <format>', 'Output format: svg|png')
  .option('--theme <theme>', 'Theme name')
  .option('--line-numbers', 'Enable line numbers')
  .action(async (input: string, options) => {
    await runWatch(input, {
      output: options.output,
      format: options.format as OutputFormat | undefined,
      theme: options.theme,
      lineNumbers: options.lineNumbers
    });
  });

program
  .command('themes')
  .argument('[mode]', 'list|preview', 'list')
  .argument('[theme]', 'Theme name for preview')
  .action((mode: string, theme: string | undefined) => {
    if (mode === 'preview') {
      if (!theme) {
        throw new Error('Provide a theme name for preview');
      }

      runThemesPreview(theme);
      return;
    }

    runThemesList();
  });

program.command('doctor').action(async () => {
  await runDoctor();
});

program.command('init').action(async () => {
  await runInit();
});

program.parseAsync(process.argv).catch((error) => {
  printError(error);
  process.exitCode = 1;
});
