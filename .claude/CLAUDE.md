# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A template for a **Horus plugin**: a Python backend (`my_plugin/`) built on `HorusAPI`, paired with a React frontend (`src/`) that gets built and embedded as the plugin's page. New plugins are created by using this repo as a GitHub template, then renaming every `my_plugin` occurrence (folder, `pyproject.toml`, `plugin.meta`, imports) to the new plugin's name.

## Commands

### Backend (Python, managed with `uv`)

```bash
uv sync --dev                        # install deps (needed for type checking/autocompletion of Horus APIs)
uv run ruff check my_plugin/         # lint
uv run ruff format --check my_plugin/  # format check (CI); drop --check to auto-format
uv run mypy my_plugin/               # strict type check
uv run pytest tests/backend/path_to_test.py::TestClass::test_name  # single test
```

Tests live under `tests/backend` (files `test_*.py`/`*_test.py`, classes `Test*`, functions `test_*`); coverage is enforced at 90% for `my_plugin` (`pyproject.toml`).

### Frontend (React/TanStack, managed with `bun`)

```bash
bun install
bun --bun run dev      # dev server on :3000, proxies /api to the local Horus instance
bun --bun run build    # builds into my_plugin/Pages/ (consumed by plugin.py at runtime)
bun --bun run test     # vitest
bun --bun run lint / format / check   # biome
```

### Running/debugging the plugin inside Horus

```bash
./devtools/run-horus-debug.sh   # launches Horus with HORUS_PLUGINS_DIR set, debugpy listening on :5678
```

Equivalently, press F5 in VS Code or run the "Debug Plugin Load" launch config (`.vscode/launch.json`), which runs the `debug-horus` task first and waits for the debugger port to open. "Auto-attach Flow Process" attaches to a Flow subprocess on port `:5679` when one spawns.

### Building/packaging the distributable plugin

```bash
bash devtools/build-plugin.sh   # bun run build, then zips my_plugin/ into my_plugin.zip
```

The `Build and Upload Plugin` GitHub workflow (manual `workflow_dispatch`) bumps the version in `my_plugin/plugin.meta`, runs this build, and uploads the resulting `.hp` file to the internal plugin repository — it needs a `plugin_version` input.

## Architecture

- **`my_plugin/plugin.py`** is the plugin entry point: it instantiates `Plugin`/`PluginBlock`/`PluginPage` objects from `HorusAPI` and registers them. `my_plugin/plugin.meta` holds the plugin's metadata (id, version, `minHorusVersion`, `dependencies`, `pluginRequires`) — keep the `id`/name in sync with the folder name and with `pyproject.toml`'s `[project].name`.
- **Frontend build output is not a separate deployable** — Vite (`vite.config.ts`) builds `src/` straight into `my_plugin/Pages/`, and `plugin.py` wires a `PluginPage(html="index.html")` pointing at that build output. Vite's `base` differs between dev (`/`) and production (`./`); the dev server proxies `/api` to `http://127.0.0.1:3000/plugins/pages/<plugin_id>.<plugin_id>-api/` — update that path when renaming the plugin.
- **`plugin_dependencies/`** holds git submodules for external plugin dependencies. `plugin_dependencies/horus` is the Horus app + `HorusAPI` source itself, pulled in purely so the editor/mypy can resolve HorusAPI types during development (the runtime dependency comes from the `horusapi` PyPI package in `pyproject.toml`). When this plugin depends on another plugin at a pinned version, add it the same way: `git submodule add <url> plugin_dependencies/<name>`.
- **`HORUS_PLUGINS_DIR/`** is where symlinks to this plugin (and its plugin dependencies, not the `plugin_dependencies` submodules themselves) go so a locally-running Horus can load them in development mode; `run-horus-debug.sh` points `HORUS_PLUGINS_DIR` at this folder.
- **CI** (`.github/workflows/lint.yml`) runs ruff+mypy on `my_plugin/` and biome `check` on the frontend for every PR; `.pre-commit-config.yaml` mirrors the same checks locally.

## Claude Code skill

This repo ships the `horus-expert` skill (`.claude/skills/horus-expert/`), which triggers automatically on HorusAPI concepts (`PluginVariable`, `PluginBlock`, `SlurmBlock`, `RemoteAPI`, `MolstarAPI`, `SmilesAPI`, `plugin.meta`, etc.) and loads the matching reference/asset pair before answering — prefer letting it handle Horus-specific code rather than writing HorusAPI code from general knowledge. See `.claude/README.md` for details.
