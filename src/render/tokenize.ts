import type { Theme } from '../types.ts';

interface Segment {
  text: string;
  color: string;
}

const KEYWORDS = /\b(await|async|break|case|catch|class|const|continue|default|else|export|extends|finally|for|function|if|import|let|new|return|switch|throw|try|while|yield|interface|type|implements)\b/g;
const STRINGS = /(['"`])(?:\\.|(?!\1).)*\1/g;
const COMMENTS = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
const NUMBERS = /\b\d+(?:\.\d+)?\b/g;

function applyRegex(
  line: string,
  regex: RegExp,
  color: string,
  slots: Array<string | null>
): void {
  for (const match of line.matchAll(regex)) {
    const start = match.index ?? 0;
    const text = match[0];

    for (let i = 0; i < text.length; i++) {
      if (slots[start + i] === null) {
        slots[start + i] = color;
      }
    }
  }
}

export function colorizeLine(line: string, theme: Theme): Segment[] {
  const slots: Array<string | null> = new Array(line.length).fill(null);

  applyRegex(line, COMMENTS, theme.comment, slots);
  applyRegex(line, STRINGS, theme.string, slots);
  applyRegex(line, KEYWORDS, theme.keyword, slots);
  applyRegex(line, NUMBERS, theme.number, slots);

  const segments: Segment[] = [];
  let currentColor = slots[0] ?? theme.foreground;
  let currentText = '';

  for (let i = 0; i < line.length; i++) {
    const color = slots[i] ?? theme.foreground;
    const char = line[i] ?? '';

    if (color !== currentColor) {
      segments.push({ text: currentText, color: currentColor });
      currentText = char;
      currentColor = color;
    } else {
      currentText += char;
    }
  }

  if (currentText.length > 0 || line.length === 0) {
    segments.push({ text: currentText || ' ', color: currentColor });
  }

  return segments;
}
