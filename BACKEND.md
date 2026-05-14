# Backend

This repository contains a Horus plugin. The backend development workflow is simple: sync your Python dependencies and plugin code with `uv`, then launch Horus with the plugin loaded.

## Getting Started

Install and sync the project (development dependencies included):

```bash
uv sync --dev
```

This installs dev dependencies and ensures that during development you will have autocompletions and type checking for Horus APIs. Those dependencies need to be sync with the `plugin.meta` dependencies for them to work in production.

## Run Horus with the plugin

After running `uv sync --dev`, start Horus so it loads the plugin. You have two common options:

- Press F5 in VS Code to start the debugger (if a debug configuration is present).
- Select from the debugger "Debug Plugin Load" configuration and start it.

Alternatively you can start Horus from the terminal:

```bash
./devtools/run-horus-debug.sh
```

The `debug-horus` task runs the same script and waits for the debugger to be ready in order to setup breakpoints and other debug features.

## Linting & tests (CI parity)

You can run the same checks used in CI locally via `uv`:

```bash
uv run ruff check my_plugin/
uv run mypy my_plugin/
```
