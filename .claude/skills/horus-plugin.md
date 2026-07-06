---
name: horus-plugin
description: >-
  Build legacy Horus plugins using the HorusAPI plugin system.
  Covers plugin.meta, plugin_entrypoint.py, Include/plugin.py,
  Blocks, Config, Pages, SlurmBlock, PluginBlock, PluginConfig,
  PluginPage, PluginVariable, PluginEndpoint and plugin registration.

  Triggers:
  - horus plugin
  - HorusAPI plugin
  - plugin.meta
  - SlurmBlock
  - PluginBlock
  - build a Horus plugin
---

# Horus Plugin Skill

Use this skill whenever the user is creating, modifying or debugging a Horus
plugin built on the HorusAPI plugin framework.

Primary documentation:
https://horus.bsc.es/docs/

## Core conventions

Always follow these conventions unless the user explicitly requests otherwise.

### Imports

The entire `Include/` directory is automatically added to `sys.path`.

Therefore always write imports like:

```python
from Blocks.prepare import prepare_block
from Blocks.run import run_block
from Config.settings import plugin_config
from Pages.viewer import viewer_page
```

Never write:

```python
from Include.Blocks.prepare import ...
```

or manipulate `sys.path`.

### Dependencies

Never create a `requirements.txt`.

Python dependencies belong in:

```json
{
  "dependencies": [
    "numpy",
    "biopython>=1.85",
    "requests"
  ]
}
```

inside `plugin.meta`.

## Recommended layout

```
plugin.meta
plugin_entrypoint.py

Include/
    plugin.py

    Blocks/
        prepare.py
        run.py
        analysis.py

    Config/
        config.py

    Pages/
        page.py

    Assets/
```

Each file should have a single responsibility.

## Plugin initialization

`Include/plugin.py` should only register objects.

Typical pattern:

```python
from Blocks.prepare import prepare_block
from Blocks.run import run_block
from Config.config import plugin_config
from Pages.page import plugin_page

def initialize_plugin(plugin):
    plugin.addBlock(prepare_block)
    plugin.addBlock(run_block)

    plugin.addConfig(plugin_config)
    plugin.addPage(plugin_page)

    return plugin
```

Avoid defining blocks directly inside `plugin.py`.

## Blocks

Prefer one block per file.

Each file exports a block instance:

```python
my_block = PluginBlock(...)
```

or

```python
my_block = SlurmBlock(...)
```

The plugin imports the instance and registers it.

## Slurm blocks

Use `SlurmBlock` whenever work executes through SLURM.

Keep:

- initialAction
    - prepare files
    - upload inputs
    - submit job

- finalAction
    - retrieve outputs
    - parse results
    - populate outputs

Avoid putting all logic in a single function.

## Configuration

Plugin-wide settings belong in `PluginConfig`.

Per-block runtime values belong in block variables.

Do not hardcode configurable paths.

## Pages

UI pages should only implement visualization and interaction.

Business logic belongs inside blocks.

## Variables

Use `PluginVariable` with the appropriate `VariableTypes`.

Mark required inputs as required.

Use sensible defaults whenever possible.

Use `VariableGroup` when multiple inputs belong together.

## Registration

Always register objects through:

```python
plugin.addBlock(...)
plugin.addConfig(...)
plugin.addPage(...)
```

Never mutate internal plugin collections directly.

## Good practices

- Keep blocks independent.
- Keep actions small.
- Prefer multiple focused blocks over one giant block.
- Put reusable utilities in separate helper modules.
- Use descriptive IDs.
- Separate UI, execution and configuration.
- Return the plugin from `initialize_plugin`.
- Keep plugin.py as a registry, not an implementation file.

## When generating plugins

Unless the user requests otherwise:

- create the complete plugin structure
- include plugin.meta
- include plugin_entrypoint.py
- create Include/plugin.py
- split blocks into separate files
- register every block/config/page
- place pip dependencies in plugin.meta
- use imports relative to Include (e.g. `from Blocks.foo import bar`)