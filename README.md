# snipgrapher

CLI to generate image snippets from code files, stdin, or inline source.

## Install

```bash
npm i -g snipgrapher
```

## Usage

```bash
snipgrapher render src/index.ts -o snippet.svg
snipgrapher render src/index.ts -o snippet.png --format png
cat src/index.ts | snipgrapher render --stdin -o snippet.svg
snipgrapher render src/index.ts --background-style gradient --window-controls --shadow
snipgrapher render src/index.ts --watermark "snipgrapher" --language typescript
snipgrapher batch "src/**/*.ts" --out-dir snippets
snipgrapher watch src/index.ts -o snippet.svg
snipgrapher themes list
snipgrapher doctor
snipgrapher init
```

## Config

Create `snipgrapher.config.json`:

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
  "format": "svg"
}
```
