import { createHighlighter } from 'shiki';

import { getTheme } from '../theme/themes.ts';
import type { Theme } from '../types.ts';
import { colorizeCode, type Segment } from './tokenize.ts';

type SupportedLanguage =
  | 'txt'
  | 'typescript'
  | 'javascript'
  | 'json'
  | 'markdown'
  | 'html'
  | 'css'
  | 'python'
  | 'rust'
  | 'go'
  | 'tsx'
  | 'jsx';

const SUPPORTED_LANGUAGES: Set<SupportedLanguage> = new Set([
  'txt',
  'typescript',
  'javascript',
  'json',
  'markdown',
  'html',
  'css',
  'python',
  'rust',
  'go',
  'tsx',
  'jsx'
]);

const themeMap: Record<string, string> = {
  dracula: 'dracula',
  nord: 'nord',
  githubDark: 'github-dark'
};

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function toShikiTheme(theme: Theme): string {
  return themeMap[theme.name] ?? 'dracula';
}

function normalizeLanguage(language: string | undefined): SupportedLanguage {
  if (!language) return 'txt';

  const normalized = language.toLowerCase() as SupportedLanguage;
  return SUPPORTED_LANGUAGES.has(normalized) ? normalized : 'txt';
}

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['dracula', 'nord', 'github-dark'],
      langs: [...SUPPORTED_LANGUAGES]
    });
  }

  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  themeName: string,
  language: string | undefined
): Promise<Segment[][]> {
  const theme = getTheme(themeName);

  try {
    const highlighter = await getHighlighter();
    const tokens = highlighter.codeToTokens(code.replaceAll('\t', '  '), {
      theme: toShikiTheme(theme),
      lang: normalizeLanguage(language)
    });

    return tokens.tokens.map((line) => {
      if (line.length === 0) {
        return [{ text: ' ', color: theme.foreground }];
      }

      return line.map((token) => ({
        text: token.content,
        color: token.color || theme.foreground
      }));
    });
  } catch {
    return colorizeCode(code, theme);
  }
}
