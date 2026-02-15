export type OutputFormat = 'svg' | 'png';
export type BackgroundStyle = 'solid' | 'gradient';

export interface Theme {
  name: string;
  background: string;
  foreground: string;
  keyword: string;
  string: string;
  comment: string;
  number: string;
  lineNumber: string;
}

export interface RenderOptions {
  code: string;
  outputFile: string;
  format: OutputFormat;
  theme: string;
  fontFamily: string;
  fontSize: number;
  padding: number;
  lineNumbers: boolean;
  windowControls: boolean;
  shadow: boolean;
  backgroundStyle: BackgroundStyle;
  watermark?: string;
  language?: string;
  title?: string;
}

export interface SnipgrapherConfig {
  theme: string;
  fontFamily: string;
  fontSize: number;
  padding: number;
  lineNumbers: boolean;
  windowControls: boolean;
  shadow: boolean;
  backgroundStyle: BackgroundStyle;
  watermark?: string;
  format: OutputFormat;
}

export interface RenderResult {
  input?: string;
  outputFile: string;
  format: OutputFormat;
  theme: string;
  language?: string;
}
