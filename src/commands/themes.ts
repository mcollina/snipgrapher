import { getTheme, listThemes } from '../theme/themes.ts';

export function runThemesList(): void {
  for (const theme of listThemes()) {
    console.log(`${theme.name}\tbg=${theme.background}\tfg=${theme.foreground}`);
  }
}

export function runThemesPreview(themeName: string): void {
  const theme = getTheme(themeName);
  console.log(JSON.stringify(theme, null, 2));
}
