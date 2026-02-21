import { createHighlighter } from 'shiki';

import { getTheme } from '../theme/themes.ts';
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

const SHIKI_THEME_MAP: Record<string, string> = {
  dracula: 'dracula',
  nord: 'nord',
  githubDark: 'github-dark',
  monokai: 'monokai',
  'night-owl': 'night-owl',
  'one-light': 'one-light',
  'one-dark': 'one-dark-pro',
  material: 'material-theme',
  'solarized dark': 'solarized-dark',
  'solarized light': 'solarized-light',
  'solarized-dark': 'solarized-dark',
  'solarized-light': 'solarized-light',
  'synthwave-84': 'synthwave-84',
  vscode: 'dark-plus'
};

const SHIKI_THEMES = [...new Set(Object.values(SHIKI_THEME_MAP))];

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function toShikiThemeName(themeName: string): string | undefined {
  return SHIKI_THEME_MAP[themeName];
}

function normalizeLanguage(language: string | undefined): SupportedLanguage {
  if (!language) return 'txt';

  const normalized = language.toLowerCase() as SupportedLanguage;
  return SUPPORTED_LANGUAGES.has(normalized) ? normalized : 'txt';
}

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: SHIKI_THEMES,
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
  const shikiTheme = toShikiThemeName(theme.name);

  if (!shikiTheme) {
    return colorizeCode(code, theme);
  }

  try {
    const highlighter = await getHighlighter();
    const tokens = highlighter.codeToTokens(code.replaceAll('\t', '  '), {
      theme: shikiTheme,
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
