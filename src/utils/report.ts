import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function writeJsonFile(path: string, payload: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

export function printJson(payload: unknown): void {
  console.log(JSON.stringify(payload, null, 2));
}
