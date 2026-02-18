import { extname } from 'node:path';

const EXT_TO_LANGUAGE: Record<string, string> = {
  '.js': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.ts': 'typescript',
  '.mts': 'typescript',
  '.cts': 'typescript',
  '.tsx': 'tsx',
  '.jsx': 'jsx',
  '.json': 'json',
  '.md': 'markdown',
  '.html': 'html',
  '.css': 'css',
  '.py': 'python',
  '.rs': 'rust',
  '.go': 'go'
};

export function detectLanguage(
  input: string | undefined,
  explicitLanguage?: string
): string | undefined {
  if (explicitLanguage && explicitLanguage !== 'auto') {
    return explicitLanguage;
  }

  if (!input) {
    return undefined;
  }

  const ext = extname(input).toLowerCase();
  return EXT_TO_LANGUAGE[ext];
}
