This file provides guidance to AI coding agents like Claude Code (claude.ai/code), Cursor AI, Codex, Gemini CLI, GitHub Copilot, and other AI coding assistants when working with code in this repository.

## Common commands

- Install deps: `npm install`
- Run CLI in dev mode (TypeScript entrypoint): `npm run dev -- <command>`
  - Example: `npm run dev -- render ./example.ts -o snippet.svg`
- Build distributable JS to `dist/`: `npm run build`
- Clean build output: `npm run clean`
- Lint: `npm run lint`
- Format check: `npm run format:check`
- Type-check only: `npm run typecheck`
- Full test suite: `npm test`
- Single test file: `node --test src/render/svg.test.ts`
- Single test case by name: `node --test --test-name-pattern="renderSvg escapes XML" src/render/svg.test.ts`
- Golden/snapshot regression test only: `npm run test:golden`
- Benchmark batch rendering (builds first): `npm run bench`

## Architecture (big picture)

### 1) CLI surface and command routing

- `src/cli.ts` is the only CLI entrypoint and defines stable commands:
  - `render`, `batch`, `watch`, `themes`, `doctor`, `init`
- Each command delegates to `src/commands/*.ts`.
- Errors are centralized through `printError` (`src/utils/errors.ts`) in `program.parseAsync(...).catch(...)`.

### 2) Configuration resolution and precedence

Config is assembled in layers; understanding this prevents subtle bugs:

1. Defaults from `src/config/defaults.ts`
2. Config file from project root (`snipgrapher.config.{json,yaml,yml,toml}`) via `src/config/load-config.ts`
3. Optional profile merge (`defaultProfile` or `--profile` / `SNIPGRAPHER_PROFILE`)
4. Environment overrides from `src/config/env.ts` (`SNIPGRAPHER_*`)
5. Command flags in each command handler

Effective precedence is **CLI flags > env > config file/profile > defaults**.

Validation happens in `src/config/validate-config.ts` for config files and env values; invalid values should fail fast with explicit errors.

### 3) Render pipeline

- `runRender` / `runBatch` / `runWatch` eventually call `renderToFile` (`src/render/pipeline.ts`).
- `renderToFile` always renders SVG first (`renderSvg`), then:
  - writes SVG directly, or
  - converts SVG → PNG using `@resvg/resvg-js` (`src/render/png.ts`), or
  - converts SVG → WebP using `sharp` (`src/render/webp.ts`).
- `renderSvg` (`src/render/svg.ts`) is layout-heavy logic:
  - computes dimensions from font metrics, padding, line numbers, header/footer options
  - supports gradient/solid background, traffic-light controls, watermark, title/language tags
  - escapes XML to avoid invalid output

### 4) Syntax highlighting strategy

- Primary highlighter: Shiki (`src/render/highlight.ts`) with a fixed language whitelist and theme mapping.
- Fallback highlighter: regex tokenizer (`src/render/tokenize.ts`) if Shiki fails.
- Theme data is local/static in `src/theme/themes.ts`; unknown theme names fall back to `dracula`.

### 5) Input, language, and output inference

- Input resolution (`src/utils/input.ts`): `--code` > stdin (explicit `--stdin` or piped input) > file path.
- Language detection (`src/utils/language.ts`) is extension-based unless explicit `--language` is provided (except `auto`).
- Output format inference (`src/utils/output.ts`) can come from output file extension; otherwise fallback format is used.

### 6) Batch/watch behavior details

- Batch mode (`src/commands/batch.ts`) uses `fast-glob`, clamps concurrency to `1..32`, and writes `<basename>.<format>` into `--out-dir`.
- Watch mode (`src/commands/watch.ts`) uses `chokidar` and re-renders on change; initial render happens before watch subscription output.

## Testing and compatibility constraints

- Tests are Node’s built-in test runner (`node --test`) against `src/**/*.test.ts`.
- Golden stability check: `src/render/golden.spec.ts` compares rendered output against `src/render/__snapshots__/typescript-card.png` with mismatch tolerance.
- If rendering output intentionally changes, update the golden snapshot and document why (see `CONTRIBUTING.md`).
- `BACKWARD_COMPATIBILITY.md` marks as stable:
  - command names and existing long options,
  - JSON output shape for `--json` / `--manifest`,
  - supported config keys.
    Treat changes here as breaking unless versioned accordingly.
