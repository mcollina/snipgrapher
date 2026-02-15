export type OutputFormat = 'svg' | 'png';

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
  title?: string;
}

export interface SnipgrapherConfig {
  theme: string;
  fontFamily: string;
  fontSize: number;
  padding: number;
  lineNumbers: boolean;
  format: OutputFormat;
}
