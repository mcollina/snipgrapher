# Snipgrapher CLI — Plan

## Goal
Build a fully fledged, scriptable CLI alternative to [carbon-app/carbon](https://github.com/carbon-app/carbon), focused on high-quality code snippet image generation for local and CI workflows.

## Principles
- **Feature parity first**, then CLI-first enhancements
- **Deterministic output** for CI and docs pipelines
- **Fast local feedback** (watch mode + low-latency rendering)
- **Composable architecture** (core engine + adapters)
- **Open-source friendly** (MIT licensing and clear attribution)

## Scope (v1)
1. Generate beautiful code snippet images from files/stdin
2. Themes, fonts, syntax highlighting, window controls, backgrounds, shadows
3. Export formats: PNG, SVG, WebP (optional PDF later)
4. Config support (`snipgrapher.config.*`, JSON/YAML/TOML)
5. Batch rendering + glob inputs
6. Stdin and piping support for shell usage
7. Watch mode for iterative editing
8. Stable API + reproducible rendering in CI

## Non-goals (initial)
- Browser-hosted editor UI parity in v1
- Team collaboration features
- Cloud rendering service

## Product Requirements

### CLI UX
- `snipgrapher render <input>`: single render
- `snipgrapher batch <glob>`: bulk render
- `snipgrapher watch <input|glob>`: live re-render
- `snipgrapher themes [list|preview]`
- `snipgrapher doctor`: environment diagnostics
- `snipgrapher init`: bootstrap config

### Inputs
- File path(s)
- Stdin (`cat a.ts | snipgrapher render --stdin`)
- Raw string (`--code`)

### Outputs
- Output file or directory
- stdout metadata (`--json`) for automation
- Optional manifest file for batch jobs

### Config/Flags
- Global config + per-command override
- Precedence: CLI flags > env vars > config file > defaults
- Validation with actionable error messages

## Technical Architecture

### 1) Core Rendering Engine
- `@snipgrapher/core`: render pipeline
- `@snipgrapher/theme`: theme + token mapping
- `@snipgrapher/layout`: code frame/window/background/layout logic
- `@snipgrapher/export`: raster/vector exporters

### 2) Syntax Highlighting Layer
- Start with Shiki-compatible tokenization for high language coverage
- Token cache and theme cache for performance
- Fallback language detection heuristics

### 3) Rendering Backend
- Evaluate options:
  - **Satori + Resvg** (deterministic SVG/PNG, server-friendly)
  - **Headless browser** fallback path for edge typography
- Keep backend abstracted behind an interface for pluggability

### 4) CLI App
- `@snipgrapher/cli` with subcommands and shared options
- Rich terminal output (spinners, progress, errors)
- Strict exit codes for CI reliability

### 5) Performance & Reliability
- Worker pool for batch rendering
- Caching for tokenization/fonts/templates
- Snapshot tests for rendering regressions
- Golden-image comparison in CI

## Phased Delivery

### Phase 0 — Foundation (Week 1)
- Initialize monorepo/package layout
- Define command surface and config schema
- Implement `doctor` and `init` commands
- Set up lint, format, test, typecheck, CI

### Phase 1 — Minimal Render Path (Weeks 1-2)
- `render` command from file/stdin/raw code
- Basic syntax highlighting + 2-3 themes
- PNG output support
- Deterministic snapshots for core examples

### Phase 2 — Carbon Parity Core (Weeks 2-4)
- Theme/background/window controls
- Line numbers, padding, shadows, watermark toggle
- Syntax language auto-detect + manual override
- Batch rendering with globs

### Phase 3 — Advanced CLI Workflow (Weeks 4-5)
- Watch mode
- JSON output and manifest mode
- Config profiles + presets
- SVG/WebP output

### Phase 4 — Quality + OSS Hardening (Weeks 5-6)
- Improve docs and examples
- Benchmarks and performance tuning
- Accessibility/readability defaults
- Backward compatibility policy for CLI flags

### Phase 5 — Public OSS Launch (when ready)
- Switch repo visibility to public
- Publish npm packages
- Add contribution guide + code of conduct
- Announce roadmap and first stable release

## Testing Strategy
- Unit tests for parsers/layout calculations
- Integration tests for command workflows
- Golden-image snapshot tests across themes/languages
- Cross-platform CI (Linux/macOS/Windows)
- Fuzz/robustness tests for malformed inputs

## Security & Supply Chain
- Pin and audit critical dependencies
- Generate SBOM
- Dependabot/Renovate automation
- Trusted publishing pipeline for npm

## Licensing and Attribution
- Project license: MIT
- Include upstream Carbon MIT license text in this repository
- Maintain third-party attribution in `THIRD_PARTY_LICENSES/`
- Track lifted/ported code paths with source references in comments/NOTICE

## Backlog (post-v1)
- Animated exports (GIF/MP4)
- Terminal frame presets (iTerm, Warp, Windows Terminal)
- Plugin system for custom themes and templates
- Markdown integration (`md -> rendered assets`)
- Optional web UI companion
