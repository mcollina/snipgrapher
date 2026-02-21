import { execFile } from 'node:child_process';
import { platform } from 'node:os';
import { promisify } from 'node:util';

import { listCuratedFonts } from './fonts.ts';

const execFileAsync = promisify(execFile);

export type FontAvailability = 'bundled' | 'installed' | 'generic' | 'unavailable';

export interface FontWithAvailability {
  family: string;
  availability: FontAvailability;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replaceAll('"', '')
    .replaceAll("'", '')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

function extractFamilies(text: string): Set<string> {
  const families = new Set<string>();

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    for (const candidate of trimmed.split(',')) {
      const normalized = normalize(candidate);
      if (normalized) {
        families.add(normalized);
      }
    }
  }

  return families;
}

async function detectWithFcList(): Promise<Set<string> | null> {
  try {
    const { stdout } = await execFileAsync('fc-list', ['--format', '%{family}\n']);
    return extractFamilies(stdout);
  } catch {
    return null;
  }
}

async function detectWithSystemProfiler(): Promise<Set<string> | null> {
  try {
    const { stdout } = await execFileAsync('system_profiler', ['SPFontsDataType', '-json']);
    const parsed = JSON.parse(stdout) as Record<string, Array<Record<string, unknown>>>;
    const entries = parsed.SPFontsDataType ?? [];
    const families = new Set<string>();

    for (const entry of entries) {
      const candidates = [entry.family, entry.full_name, entry._name];
      for (const candidate of candidates) {
        if (typeof candidate !== 'string') {
          continue;
        }

        const normalized = normalize(candidate);
        if (normalized) {
          families.add(normalized);
        }
      }
    }

    return families;
  } catch {
    return null;
  }
}

async function detectWithPowerShell(): Promise<Set<string> | null> {
  try {
    const { stdout } = await execFileAsync('powershell', [
      '-NoProfile',
      '-Command',
      "[void][Reflection.Assembly]::LoadWithPartialName('System.Drawing'); (New-Object System.Drawing.Text.InstalledFontCollection).Families | ForEach-Object { $_.Name }"
    ]);

    return extractFamilies(stdout);
  } catch {
    return null;
  }
}

async function detectInstalledFonts(): Promise<Set<string>> {
  const fromFontConfig = await detectWithFcList();
  if (fromFontConfig) {
    return fromFontConfig;
  }

  if (platform() === 'darwin') {
    return (await detectWithSystemProfiler()) ?? new Set<string>();
  }

  if (platform() === 'win32') {
    return (await detectWithPowerShell()) ?? new Set<string>();
  }

  return new Set<string>();
}

let fontAvailabilityPromise: Promise<FontWithAvailability[]> | undefined;

export async function listFontsWithAvailability(): Promise<FontWithAvailability[]> {
  if (fontAvailabilityPromise) {
    return fontAvailabilityPromise;
  }

  fontAvailabilityPromise = (async () => {
    const installed = await detectInstalledFonts();

    return listCuratedFonts().map((font) => {
      if (font.source === 'bundled') {
        return { family: font.family, availability: 'bundled' as const };
      }

      if (font.source === 'generic') {
        return { family: font.family, availability: 'generic' as const };
      }

      return {
        family: font.family,
        availability: installed.has(normalize(font.family)) ? ('installed' as const) : ('unavailable' as const)
      };
    });
  })();

  return fontAvailabilityPromise;
}
