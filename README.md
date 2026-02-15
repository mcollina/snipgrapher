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
snipgrapher render src/index.ts --background-style gradient --window-controls --shadow
snipgrapher render src/index.ts --watermark "snipgrapher" --language typescript
snipgrapher render src/index.ts --profile social --json
snipgrapher batch "src/**/*.ts" --out-dir snippets --concurrency 6
snipgrapher batch "src/**/*.ts" --json --manifest snippets/manifest.json
snipgrapher watch src/index.ts -o snippet.svg --profile social
snipgrapher themes list
snipgrapher doctor
snipgrapher init
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
