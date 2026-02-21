#!/usr/bin/env node

import { Command } from 'commander';

import { runBatch } from './commands/batch.ts';
import { runDoctor } from './commands/doctor.ts';
import { runInit } from './commands/init.ts';
import { runRender } from './commands/render.ts';
import { runThemesList, runThemesPreview } from './commands/themes.ts';
import { runWatch } from './commands/watch.ts';
import type { BackgroundStyle, OutputFormat } from './types.ts';
import { printError } from './utils/errors.ts';
import { printJson, writeJsonFile } from './utils/report.ts';

function optionalBoolean(
  command: Command,
  name: string,
  value: boolean | undefined
): boolean | undefined {
  return command.getOptionValueSource(name) === 'default' ? undefined : value;
}

const program = new Command();

program.name('snipgrapher').description('Render code snippets to images').version('0.1.0');

program
  .command('render')
  .argument('[input]', 'Input file path')
  .option('-o, --output <file>', 'Output file path')
  .option('-f, --format <format>', 'Output format: svg|png|webp')
  .option('--theme <theme>', 'Theme name')
  .option('--font-family <fontFamily>', 'Font family')
  .option('--font-size <fontSize>', 'Font size', Number)
  .option('--padding <padding>', 'Frame padding', Number)
  .option('--line-numbers', 'Enable line numbers')
  .option('--window-controls', 'Enable macOS-style traffic lights')
  .option('--shadow', 'Enable card shadow')
  .option('--background-style <style>', 'Background style: solid|gradient')
  .option('--scale <factor>', 'PNG render scale (1-4, default: 2)', Number)
  .option('--watermark <text>', 'Add watermark text')
  .option('--language <language>', 'Language hint (or auto)')
  .option('--border-radius <radius>', 'Border radius (default: 14)', Number)
  .option('--profile <name>', 'Config profile name')
  .option('--stdin', 'Read code from stdin')
  .option('--code <code>', 'Inline code')
  .option('--json', 'Print machine-readable JSON result')
  .action(async (input: string | undefined, options, command: Command) => {
    if (options.json && !options.output && !process.stdout.isTTY) {
      throw new Error(
        'Cannot combine --json with redirected render output. Use --output to write the image.'
      );
    }

    const result = await runRender(input, {
      output: options.output,
      format: options.format as OutputFormat | undefined,
      theme: options.theme,
      fontFamily: options.fontFamily,
      fontSize: options.fontSize,
      padding: options.padding,
      lineNumbers: optionalBoolean(command, 'lineNumbers', options.lineNumbers),
      windowControls: optionalBoolean(command, 'windowControls', options.windowControls),
      shadow: optionalBoolean(command, 'shadow', options.shadow),
      backgroundStyle: options.backgroundStyle as BackgroundStyle | undefined,
      scale: options.scale,
      watermark: options.watermark,
      language: options.language,
      borderRadius: options.borderRadius,
      profile: options.profile,
      stdin: options.stdin,
      code: options.code
    });

    if (options.json) {
      printJson(result);
      return;
    }

    if (result.outputFile !== 'stdout') {
      console.log(`Rendered ${result.outputFile}`);
    }
  });

program
  .command('batch')
  .argument('<glob>', 'Glob pattern (e.g. src/**/*.ts)')
  .option('--out-dir <dir>', 'Output directory', 'snippets')
  .option('-f, --format <format>', 'Output format: svg|png|webp')
  .option('--theme <theme>', 'Theme name')
  .option('--line-numbers', 'Enable line numbers')
  .option('--window-controls', 'Enable macOS-style traffic lights')
  .option('--shadow', 'Enable card shadow')
  .option('--background-style <style>', 'Background style: solid|gradient')
  .option('--scale <factor>', 'PNG render scale (1-4, default: 2)', Number)
  .option('--watermark <text>', 'Add watermark text')
  .option('--language <language>', 'Language hint (or auto)')
  .option('--border-radius <radius>', 'Border radius (default: 14)', Number)
  .option('--profile <name>', 'Config profile name')
  .option('--concurrency <n>', 'Batch render concurrency (default: 4)', Number)
  .option('--json', 'Print machine-readable JSON result')
  .option('--manifest <file>', 'Write JSON manifest to file')
  .action(async (glob: string, options, command: Command) => {
    const results = await runBatch(glob, {
      outDir: options.outDir,
      format: options.format as OutputFormat | undefined,
      theme: options.theme,
      lineNumbers: optionalBoolean(command, 'lineNumbers', options.lineNumbers),
      windowControls: optionalBoolean(command, 'windowControls', options.windowControls),
      shadow: optionalBoolean(command, 'shadow', options.shadow),
      backgroundStyle: options.backgroundStyle as BackgroundStyle | undefined,
      scale: options.scale,
      watermark: options.watermark,
      language: options.language,
      borderRadius: options.borderRadius,
      profile: options.profile,
      concurrency: options.concurrency
    });

    if (options.manifest) {
      await writeJsonFile(options.manifest, {
        count: results.length,
        files: results
      });
    }

    if (options.json) {
      printJson({ count: results.length, files: results });
      return;
    }

    for (const result of results) {
      console.log(`Rendered ${result.outputFile}`);
    }
  });

program
  .command('watch')
  .argument('<input>', 'Input file to watch')
  .option('-o, --output <file>', 'Output file path')
  .option('-f, --format <format>', 'Output format: svg|png|webp')
  .option('--theme <theme>', 'Theme name')
  .option('--line-numbers', 'Enable line numbers')
  .option('--window-controls', 'Enable macOS-style traffic lights')
  .option('--shadow', 'Enable card shadow')
  .option('--background-style <style>', 'Background style: solid|gradient')
  .option('--scale <factor>', 'PNG render scale (1-4, default: 2)', Number)
  .option('--watermark <text>', 'Add watermark text')
  .option('--language <language>', 'Language hint (or auto)')
  .option('--border-radius <radius>', 'Border radius (default: 14)', Number)
  .option('--profile <name>', 'Config profile name')
  .action(async (input: string, options, command: Command) => {
    await runWatch(input, {
      output: options.output,
      format: options.format as OutputFormat | undefined,
      theme: options.theme,
      lineNumbers: optionalBoolean(command, 'lineNumbers', options.lineNumbers),
      windowControls: optionalBoolean(command, 'windowControls', options.windowControls),
      shadow: optionalBoolean(command, 'shadow', options.shadow),
      backgroundStyle: options.backgroundStyle as BackgroundStyle | undefined,
      scale: options.scale,
      watermark: options.watermark,
      language: options.language,
      borderRadius: options.borderRadius,
      profile: options.profile
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
