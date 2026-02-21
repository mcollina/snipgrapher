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
  },
  '3024-night': {
    name: '3024-night',
    background: '#090300',
    foreground: '#d6d5d4',
    keyword: '#db2d20',
    string: '#fded02',
    comment: '#cdab53',
    number: '#a16a94',
    lineNumber: '#cdab53'
  },
  'a11y-dark': {
    name: 'a11y-dark',
    background: '#2b2b2b',
    foreground: '#f8f8f2',
    keyword: '#ffa07a',
    string: '#ffd700',
    comment: '#d4d0ab',
    number: '#dcc6e0',
    lineNumber: '#d4d0ab'
  },
  blackboard: {
    name: 'blackboard',
    background: '#0C1021',
    foreground: '#F8F8F8',
    keyword: '#FBDE2D',
    string: '#61CE3C',
    comment: '#AEAEAE',
    number: '#D8FA3C',
    lineNumber: '#AEAEAE'
  },
  'base16-dark': {
    name: 'base16-dark',
    background: '#151515',
    foreground: '#e0e0e0',
    keyword: '#ac4142',
    string: '#f4bf75',
    comment: '#8f5536',
    number: '#aa759f',
    lineNumber: '#8f5536'
  },
  'base16-light': {
    name: 'base16-light',
    background: '#f5f5f5',
    foreground: '#202020',
    keyword: '#ac4142',
    string: '#f4bf75',
    comment: '#8f5536',
    number: '#aa759f',
    lineNumber: '#8f5536'
  },
  cobalt: {
    name: 'cobalt',
    background: '#002240',
    foreground: '#fff',
    keyword: '#ffee80',
    string: '#3ad900',
    comment: '#08f',
    number: '#ff80e1',
    lineNumber: '#08f'
  },
  'duotone-dark': {
    name: 'duotone-dark',
    background: '#2a2734',
    foreground: '#6c6783',
    keyword: '#ffcc99',
    string: '#ffb870',
    comment: '#6c6783',
    number: '#ffcc99',
    lineNumber: '#6c6783'
  },
  hopscotch: {
    name: 'hopscotch',
    background: '#322931',
    foreground: '#d5d3d5',
    keyword: '#dd464c',
    string: '#fdcc59',
    comment: '#b33508',
    number: '#c85e7c',
    lineNumber: '#b33508'
  },
  lucario: {
    name: 'lucario',
    background: '#2b3e50',
    foreground: '#f8f8f2',
    keyword: '#ff6541',
    string: '#E6DB74',
    comment: '#5c98cd',
    number: '#ca94ff',
    lineNumber: '#5c98cd'
  },
  material: {
    name: 'material',
    background: '#263238',
    foreground: 'rgba(233, 237, 237, 1)',
    keyword: 'rgba(199, 146, 234, 1)',
    string: '#C3E88D',
    comment: '#546E7A',
    number: '#F77669',
    lineNumber: '#546E7A'
  },
  monokai: {
    name: 'monokai',
    background: '#272822',
    foreground: '#f8f8f2',
    keyword: '#f92672',
    string: '#e6db74',
    comment: '#75715e',
    number: '#ae81ff',
    lineNumber: '#75715e'
  },
  'night-owl': {
    name: 'night-owl',
    background: '#011627',
    foreground: '#abb2bf',
    keyword: '#c792ea',
    string: '#ecc48d',
    comment: '#5c6370',
    number: '#F78C6C',
    lineNumber: '#5c6370'
  },
  'oceanic-next': {
    name: 'oceanic-next',
    background: '#304148',
    foreground: '#f8f8f2',
    keyword: '#C594C5',
    string: '#99C794',
    comment: '#65737E',
    number: '#F99157',
    lineNumber: '#65737E'
  },
  'one-light': {
    name: 'one-light',
    background: '#fafafa',
    foreground: '#383a42',
    keyword: '#a626a4',
    string: '#50a14f',
    comment: '#a0a1a7',
    number: '#986801',
    lineNumber: '#a0a1a7'
  },
  'one-dark': {
    name: 'one-dark',
    background: '#282c34',
    foreground: '#abb2bf',
    keyword: '#c678dd',
    string: '#98c379',
    comment: '#5c6370',
    number: '#d19a66',
    lineNumber: '#5c6370'
  },
  'panda-syntax': {
    name: 'panda-syntax',
    background: '#292A2B',
    foreground: '#E6E6E6',
    keyword: '#FF75B5',
    string: '#19F9D8',
    comment: '#676B79',
    number: '#FFB86C',
    lineNumber: '#676B79'
  },
  'paraiso-dark': {
    name: 'paraiso-dark',
    background: '#2f1e2e',
    foreground: '#b9b6b0',
    keyword: '#ef6155',
    string: '#fec418',
    comment: '#e96ba8',
    number: '#815ba4',
    lineNumber: '#e96ba8'
  },
  seti: {
    name: 'seti',
    background: '#151718',
    foreground: '#CFD2D1',
    keyword: '#e6cd69',
    string: '#55b5db',
    comment: '#41535b',
    number: '#cd3f45',
    lineNumber: '#41535b'
  },
  'shades-of-purple': {
    name: 'shades-of-purple',
    background: '#2D2B55',
    foreground: '#FFFFFF',
    keyword: '#FF9D00',
    string: '#A5FF90',
    comment: '#B362FF',
    number: '#FF628C',
    lineNumber: '#B362FF'
  },
  'solarized dark': {
    name: 'solarized dark',
    background: '#002b36',
    foreground: '#839496',
    keyword: '#cb4b16',
    string: '#859900',
    comment: '#586e75',
    number: '#d33682',
    lineNumber: '#586e75'
  },
  'solarized light': {
    name: 'solarized light',
    background: '#fdf6e3',
    foreground: '#657b83',
    keyword: '#cb4b16',
    string: '#859900',
    comment: '#586e75',
    number: '#d33682',
    lineNumber: '#586e75'
  },
  'solarized-dark': {
    name: 'solarized-dark',
    background: '#002b36',
    foreground: '#839496',
    keyword: '#cb4b16',
    string: '#859900',
    comment: '#586e75',
    number: '#d33682',
    lineNumber: '#586e75'
  },
  'solarized-light': {
    name: 'solarized-light',
    background: '#fdf6e3',
    foreground: '#657b83',
    keyword: '#cb4b16',
    string: '#859900',
    comment: '#586e75',
    number: '#d33682',
    lineNumber: '#586e75'
  },
  'synthwave-84': {
    name: 'synthwave-84',
    background: '#2b213a',
    foreground: '#b6b1b1',
    keyword: '#f4eee4',
    string: '#ff8b39',
    comment: '#6d77b3',
    number: '#f97e72',
    lineNumber: '#6d77b3'
  },
  verminal: {
    name: 'verminal',
    background: 'rgba(0, 0, 0, 0.85)',
    foreground: '#fff',
    keyword: '#9AE1FF',
    string: '#98c379',
    comment: '#5c6370',
    number: '#d19a66',
    lineNumber: '#5c6370'
  },
  vscode: {
    name: 'vscode',
    background: '#1E1E1E',
    foreground: '#D4D4D4',
    keyword: '#C586C0',
    string: '#CE9178',
    comment: '#6A9955',
    number: '#B5CEA8',
    lineNumber: '#6A9955'
  },
  yeti: {
    name: 'yeti',
    background: '#ECEAE8',
    foreground: '#d1c9c0',
    keyword: '#9fb96e',
    string: '#96c0d8',
    comment: '#d4c8be',
    number: '#a074c4',
    lineNumber: '#d4c8be'
  },
  zenburn: {
    name: 'zenburn',
    background: '#3f3f3f',
    foreground: '#dcdccc',
    keyword: '#f0dfaf',
    string: '#cc9393',
    comment: '#7f9f7f',
    number: '#dcdccc',
    lineNumber: '#7f9f7f'
  }
};

export function listThemes(): Theme[] {
  return Object.values(themes);
}

export function getTheme(name: string): Theme {
  return themes[name] ?? themes.dracula;
}
