import type { Theme } from '../types.ts';

const themes: Record<string, Theme> = {
  dracula: {
    name: 'dracula',
    background: '#282a36',
    foreground: '#f8f8f2',
    keyword: '#ff79c6',
    string: '#f1fa8c',
    comment: '#6272a4',
    number: '#bd93f9',
    lineNumber: '#6272a4'
  },
  nord: {
    name: 'nord',
    background: '#2e3440',
    foreground: '#d8dee9',
    keyword: '#81a1c1',
    string: '#a3be8c',
    comment: '#4c566a',
    number: '#b48ead',
    lineNumber: '#4c566a'
  },
  githubDark: {
    name: 'githubDark',
    background: '#0d1117',
    foreground: '#c9d1d9',
    keyword: '#ff7b72',
    string: '#a5d6ff',
    comment: '#8b949e',
    number: '#79c0ff',
    lineNumber: '#6e7681'
  }
};

export function listThemes(): Theme[] {
  return Object.values(themes);
}

export function getTheme(name: string): Theme {
  return themes[name] ?? themes.dracula;
}
