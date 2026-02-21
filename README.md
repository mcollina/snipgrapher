# snipgrapher

CLI to generate image snippets from code files, stdin, or inline source.
Uses Shiki-based syntax highlighting with a built-in fallback tokenizer.

## Install

```bash
npm i -g snipgrapher
```

## Usage

```bash
snipgrapher render ./example.ts -o snippet.svg
snipgrapher render ./example.ts -o snippet.webp --format webp
cat ./example.ts | snipgrapher render --stdin -o snippet.svg
cat ./example.ts | snipgrapher render -o snippet.svg
snipgrapher render ./example.ts > snippet.svg
snipgrapher render ./example.ts --format png > snippet.png
snipgrapher render ./example.ts --background-style gradient --window-controls --shadow
snipgrapher render ./example.ts --watermark "snipgrapher" --language typescript
snipgrapher render ./example.ts --profile social --json
snipgrapher batch "./snippets/**/*.ts" --out-dir rendered --concurrency 6
snipgrapher batch "./snippets/**/*.ts" --json --manifest rendered/manifest.json
snipgrapher watch ./example.ts -o snippet.svg --profile social
snipgrapher themes list
snipgrapher fonts
snipgrapher doctor
snipgrapher init
snipgrapher init --force
```

When `--output` is omitted and stdout is redirected (non-TTY), rendered image bytes are written to stdout.

`snipgrapher init` starts an interactive Inquirer-based wizard with selection prompts to generate `snipgrapher.config.json` (requires a TTY). Use `--force` to overwrite an existing config file.

Use `snipgrapher fonts` to browse the curated `fontFamily` values used by the init wizard.

Theme support now includes the full original Carbon theme set (run `snipgrapher themes list` to see all names).

### Font rendering notes (SVG/PNG/WebP)

snipgrapher always renders SVG first, then converts to PNG/WebP when requested.

- `fontFamily` is passed as CSS/SVG `font-family`.
- Named fonts (for example `Fira Code`, `JetBrains Mono`) must be installed on the host machine to render as intended.
- If a named font is missing, the renderer falls back to an available system font.
- Generic families like `ui-monospace` and `monospace` are the safest cross-platform choices.

## Programmatic usage

You can also use `snipgrapher` as a Node.js module:

```ts
import { renderToFile } from 'snipgrapher';

await renderToFile({
  code: 'export const greet = (name: string) => `Hello, ${name}!`;',
  outputFile: './snippet.png',
  format: 'png',
  theme: 'dracula',
  fontFamily: 'JetBrains Mono',
  fontSize: 14,
  padding: 32,
  lineNumbers: true,
  windowControls: true,
  shadow: true,
  backgroundStyle: 'gradient',
  scale: 2,
  language: 'typescript',
  title: 'example.ts',
  watermark: 'snipgrapher'
});
```

## Config

Supported config files (first match wins):

- `snipgrapher.config.json`
- `snipgrapher.config.yaml`
- `snipgrapher.config.yml`
- `snipgrapher.config.toml`

Example (`snipgrapher.config.json`):

```json
{
  "theme": "nord",
  "fontFamily": "Fira Code",
  "fontSize": 14,
  "padding": 32,
  "lineNumbers": true,
  "windowControls": true,
  "shadow": true,
  "backgroundStyle": "gradient",
  "watermark": "",
  "format": "svg",
  "defaultProfile": "default",
  "profiles": {
    "default": {},
    "social": {
      "padding": 48,
      "fontSize": 16,
      "watermark": "snipgrapher"
    }
  }
}
```

Invalid config values are rejected with actionable validation errors.

## Environment variables

You can override config via `SNIPGRAPHER_*` environment variables:

- `SNIPGRAPHER_PROFILE`
- `SNIPGRAPHER_THEME`
- `SNIPGRAPHER_FORMAT` (`svg|png|webp`)
- `SNIPGRAPHER_FONT_FAMILY`
- `SNIPGRAPHER_FONT_SIZE`
- `SNIPGRAPHER_PADDING`
- `SNIPGRAPHER_LINE_NUMBERS` (`true|false`)
- `SNIPGRAPHER_WINDOW_CONTROLS` (`true|false`)
- `SNIPGRAPHER_SHADOW` (`true|false`)
- `SNIPGRAPHER_BACKGROUND_STYLE` (`solid|gradient`)
- `SNIPGRAPHER_WATERMARK`

Precedence is: **CLI flags > environment variables > config file > defaults**.

## Quality checks

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run bench
```

## Project policies

- Contribution guide: `CONTRIBUTING.md`
- Code of conduct: `CODE_OF_CONDUCT.md`
- CLI compatibility policy: `BACKWARD_COMPATIBILITY.md`
