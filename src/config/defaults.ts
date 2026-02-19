import type { SnipgrapherConfig } from '../types.ts';

export const defaultConfig: SnipgrapherConfig = {
  theme: 'dracula',
  fontFamily: 'Fira Code',
  fontSize: 14,
  padding: 32,
  lineNumbers: false,
  windowControls: true,
  shadow: true,
  backgroundStyle: 'gradient',
  scale: 2,
  watermark: '',
  format: 'svg'
};
