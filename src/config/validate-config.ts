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

export function validateConfig(config: Partial<SnipgrapherConfig>): void {
  if (config.format && config.format !== 'svg' && config.format !== 'png') {
    throw new Error("Invalid config: 'format' must be 'svg' or 'png'");
  }

  if (config.backgroundStyle && config.backgroundStyle !== 'solid' && config.backgroundStyle !== 'gradient') {
    throw new Error("Invalid config: 'backgroundStyle' must be 'solid' or 'gradient'");
  }

  if (config.theme !== undefined && !isString(config.theme)) {
    throw new Error("Invalid config: 'theme' must be a string");
  }

  if (config.fontFamily !== undefined && !isString(config.fontFamily)) {
    throw new Error("Invalid config: 'fontFamily' must be a string");
  }

  if (config.fontSize !== undefined && (!isNumber(config.fontSize) || config.fontSize < 8 || config.fontSize > 64)) {
    throw new Error("Invalid config: 'fontSize' must be a number between 8 and 64");
  }

  if (config.padding !== undefined && (!isNumber(config.padding) || config.padding < 0 || config.padding > 256)) {
    throw new Error("Invalid config: 'padding' must be a number between 0 and 256");
  }

  if (config.lineNumbers !== undefined && !isBoolean(config.lineNumbers)) {
    throw new Error("Invalid config: 'lineNumbers' must be a boolean");
  }

  if (config.windowControls !== undefined && !isBoolean(config.windowControls)) {
    throw new Error("Invalid config: 'windowControls' must be a boolean");
  }

  if (config.shadow !== undefined && !isBoolean(config.shadow)) {
    throw new Error("Invalid config: 'shadow' must be a boolean");
  }

  if (config.watermark !== undefined && !isString(config.watermark)) {
    throw new Error("Invalid config: 'watermark' must be a string");
  }
}
