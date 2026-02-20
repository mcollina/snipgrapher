import { readFile } from 'node:fs/promises';

export async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf8');
}

export function shouldUseStdin(args: { input?: string; stdin?: boolean; code?: string }): boolean {
  return Boolean(args.stdin || (!args.code && !args.input && !process.stdin.isTTY));
}

export async function resolveCodeInput(args: {
  input?: string;
  stdin?: boolean;
  code?: string;
}): Promise<{ code: string; title?: string }> {
  if (args.code) {
    return { code: args.code, title: 'inline input' };
  }

  if (shouldUseStdin(args)) {
    return { code: await readStdin(), title: 'stdin' };
  }

  if (!args.input) {
    throw new Error('Missing input: provide a file, pipe to stdin, pass --stdin, or use --code');
  }

  return {
    code: await readFile(args.input, 'utf8'),
    title: args.input
  };
}
