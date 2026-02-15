import process from 'node:process';

import { listThemes } from '../theme/themes.ts';

export async function runDoctor(): Promise<void> {
  const report = {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    cwd: process.cwd(),
    themes: listThemes().map((theme) => theme.name),
    hasResvg: false
  };

  try {
    await import('@resvg/resvg-js');
    report.hasResvg = true;
  } catch {
    report.hasResvg = false;
  }

  console.log(JSON.stringify(report, null, 2));
}
