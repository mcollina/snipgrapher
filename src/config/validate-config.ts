import type { SnipgrapherConfig } from '../types.ts';

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function validateConfig(config: Partial<SnipgrapherConfig>, label = 'config'): void {
  if (
    config.format &&
    config.format !== 'svg' &&
    config.format !== 'png' &&
    config.format !== 'webp'
  ) {
    throw new Error(`Invalid ${label}: 'format' must be 'svg', 'png', or 'webp'`);
  }

  if (
    config.backgroundStyle &&
    config.backgroundStyle !== 'solid' &&
    config.backgroundStyle !== 'gradient'
  ) {
    throw new Error(`Invalid ${label}: 'backgroundStyle' must be 'solid' or 'gradient'`);
  }

  if (config.theme !== undefined && !isString(config.theme)) {
    throw new Error(`Invalid ${label}: 'theme' must be a string`);
  }

  if (config.fontFamily !== undefined && !isString(config.fontFamily)) {
    throw new Error(`Invalid ${label}: 'fontFamily' must be a string`);
  }

  if (
    config.fontSize !== undefined &&
    (!isNumber(config.fontSize) || config.fontSize < 8 || config.fontSize > 64)
  ) {
    throw new Error(`Invalid ${label}: 'fontSize' must be a number between 8 and 64`);
  }

  if (
    config.padding !== undefined &&
    (!isNumber(config.padding) || config.padding < 0 || config.padding > 256)
  ) {
    throw new Error(`Invalid ${label}: 'padding' must be a number between 0 and 256`);
  }

  if (config.lineNumbers !== undefined && !isBoolean(config.lineNumbers)) {
    throw new Error(`Invalid ${label}: 'lineNumbers' must be a boolean`);
  }

  if (config.windowControls !== undefined && !isBoolean(config.windowControls)) {
    throw new Error(`Invalid ${label}: 'windowControls' must be a boolean`);
  }

  if (config.shadow !== undefined && !isBoolean(config.shadow)) {
    throw new Error(`Invalid ${label}: 'shadow' must be a boolean`);
  }

  if (config.watermark !== undefined && !isString(config.watermark)) {
    throw new Error(`Invalid ${label}: 'watermark' must be a string`);
  }
}
