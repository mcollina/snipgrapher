# Backward Compatibility Policy

This policy defines CLI compatibility guarantees for `snipgrapher`.

## Stable surface

The following are considered stable in v1:

- Command names (`render`, `batch`, `watch`, `themes`, `doctor`, `init`)
- Existing long options and their semantics
- JSON output structure for `--json` and `--manifest`
- Supported config keys

## Deprecation policy

- Breaking changes require a major version bump.
- Deprecated flags remain available for at least one minor release with a warning.
- Removals are documented in release notes.

## Output determinism

- We aim for deterministic rendering for the same input + configuration + dependency versions.
- Golden snapshots are used in CI to detect regressions.

## Compatibility exceptions

Some output drift can happen due to:

- Font availability differences across systems
- Upstream rendering engine changes
- Platform-specific image encoding behavior

Such changes are tracked with updated snapshots and changelog notes.
