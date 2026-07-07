# Source Code Utilities — Templates & Snippets

## TempFile — write, read, delete

```python
from HorusAPI import TempFile

def action(block: PluginBlock):
    # Create a temp file in the system tmp folder
    tmp = TempFile(name="intermediate.dat")

    # Write content
    tmp.write("line1\nline2\nline3")

    # Read content back
    content = tmp.read()
    print(content)

    # Pass the path somewhere
    block.remote.sendData(tmp.name, "remote/intermediate.dat")

    # Clean up
    tmp.delete()
```

## TempFile — in a specific folder

```python
tmp = TempFile(name="params.json", folder="/tmp/my_plugin_run")
tmp.write('{"key": "value"}')
```

## path_exists — check before accessing

```python
from HorusAPI import path_exists, path_exists_local, path_exists_remote

def action(block: PluginBlock):
    output_path = "results/output.dat"

    # Checks wherever the block is running (local or remote)
    if not path_exists(block, output_path):
        raise FileNotFoundError(f"Expected output not found: {output_path}")

    block.setOutput(output_var.id, output_path)
```

## path_exists_local / path_exists_remote — explicit context

```python
def action(block: PluginBlock):
    local_file = block.inputs[input_var.id]

    if not path_exists_local(local_file):
        raise FileNotFoundError(f"Local file missing: {local_file}")

    block.remote.sendData(local_file, "remote/input.dat")

    if not path_exists_remote(block, "remote/output.dat"):
        raise RuntimeError("Remote output was not produced")
```

## get_unique_dir_name — collision-safe directory naming

```python
from HorusAPI import get_unique_dir_name

def initial_action(block: SlurmBlock):
    base = "simulation_run"
    unique_name = get_unique_dir_name(block, base)
    # e.g. "simulation_run_2" if "simulation_run" and "simulation_run_1" exist
    block.extraData["run_dir"] = unique_name
    block.remote.command(f"mkdir -p {unique_name}")
```

## get_unique_path — collision-safe file path

```python
from HorusAPI import get_unique_path

def action(block: PluginBlock):
    desired = "results/output.pdb"
    safe_path = get_unique_path(block, desired)
    # e.g. "results/output_1.pdb" if "results/output.pdb" already exists
    block.setOutput(output_var.id, safe_path)
```

## structureToFile — save a Mol* structure dict to a file

```python
from HorusAPI import structureToFile

def action(block: PluginBlock):
    # VariableTypes.STRUCTURE returns a dict with 'structure', 'type', etc.
    structure = block.inputs[structure_var.id]

    output_path = structureToFile(structure, filePathToWrite="output/structure.pdb")
    block.setOutput(output_var.id, output_path)
```

## multipleStructuresToFolder — save several structures

```python
from HorusAPI import multipleStructuresToFolder

def action(block: PluginBlock):
    # VariableTypes.MULTIPLE_STRUCTURE returns a list of structure dicts
    structures = block.inputs[multi_structure_var.id]

    folder = multipleStructuresToFolder(structures, path="output/structures/")
    block.setOutput(output_folder_var.id, folder)
```

## getUserFolder — user's Horus data folder

```python
from HorusAPI import getUserFolder

def action(block: PluginBlock):
    user_folder = getUserFolder()
    cache_path = f"{user_folder}/my_plugin_cache"
    block.remote.command(f"mkdir -p {cache_path}", forceLocal=True)
```

## sanitizePath — clean a user-supplied path

```python
from HorusAPI import sanitizePath

def action(block: PluginBlock):
    raw_name = block.variables[name_var.id]
    safe_name = sanitizePath(raw_name)   # replaces invalid characters
    output_path = f"results/{safe_name}.pdb"
    block.setOutput(output_var.id, output_path)
```

## ResetRemoteException — handle remote resets gracefully

```python
from HorusAPI import ResetRemoteException

def initial_action(block: SlurmBlock):
    try:
        block.remote.command("heavy_setup_command.sh")
    except ResetRemoteException:
        # Remote was reset mid-execution — clean up and re-raise
        block.extraData.clear()
        raise
```

## Plugin.getBlock / Plugin.getPage — look up registered objects

```python
plugin = Plugin()

# After adding blocks and pages...
retrieved_block = plugin.getBlock(my_block.id)
retrieved_page = plugin.getPage(results_page.id)

all_blocks = plugin.getBlocks()
all_pages = plugin.getPages()
```

## Plugin.loadPluginMeta — access plugin metadata at runtime

```python
plugin = Plugin()
plugin.loadPluginMeta()

print(plugin.pluginMeta.name)
print(plugin.pluginMeta.version)
print(plugin.pluginMeta.author)
print(plugin.pluginMeta.description)
print(plugin.pluginMeta.dependencies)
```

## PluginBlock.copy — duplicate a block definition

```python
# Useful when you need the same block logic with different configurations
base_block = PluginBlock(name="Base", description="...", action=my_action, inputs=[input_var])
variant_block = base_block.copy()
variant_block.name = "Variant"

plugin.addBlock(base_block)
plugin.addBlock(variant_block)
```
