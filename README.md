# snipgrapher

CLI to generate image snippets from code files, stdin, or inline source.
Uses Shiki-based syntax highlighting with a built-in fallback tokenizer.

## Install

```bash
npm i -g snipgrapher
```

## Usage

```bash
snipgrapher render src/index.ts -o snippet.svg
snipgrapher render src/index.ts -o snippet.webp --format webp
cat src/index.ts | snipgrapher render --stdin -o snippet.svg
cat src/index.ts | snipgrapher render -o snippet.svg
snipgrapher render src/index.ts --background-style gradient --window-controls --shadow
snipgrapher render src/index.ts --watermark "snipgrapher" --language typescript
snipgrapher render src/index.ts --profile social --json
snipgrapher batch "src/**/*.ts" --out-dir snippets --concurrency 6
snipgrapher batch "src/**/*.ts" --json --manifest snippets/manifest.json
snipgrapher watch src/index.ts -o snippet.svg --profile social
snipgrapher themes list
snipgrapher doctor
snipgrapher init
npm run bench
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
