# Contributing

Thanks for contributing to snipgrapher.

## Local setup

```bash
npm install
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```

## Development workflow

1. Create a branch from `main`.
2. Keep commits focused and small.
3. Add/adjust tests for behavior changes.
4. Run the full local validation suite before pushing.

## Commit conventions

Use conventional prefixes where possible:

- `feat:` new functionality
- `fix:` bug fixes
- `docs:` documentation
- `ci:` workflow changes
- `chore:` maintenance

## Snapshot changes

If render output intentionally changes, update golden snapshots and include rationale in the commit message.
