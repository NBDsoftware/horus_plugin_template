# Plugin Templates & Snippets

## plugin.meta — minimal

```json
{
    "id": "my_plugin",
    "name": "My Plugin",
    "description": "A custom Horus plugin",
    "author": "Author Name",
    "version": "0.0.1",
    "pluginFile": "main.py",
    "dependencies": [],
    "pluginRequires": []
}
```

## plugin.meta — full (all optional fields)

```json
{
    "id": "my_plugin",
    "name": "My Plugin",
    "description": "A custom Horus plugin",
    "author": "Author Name",
    "version": "0.0.1",
    "pluginFile": "main.py",
    "minHorusVersion": "0.8.0",
    "maxHorusVersion": "1.0.0",
    "platforms": ["universal"],
    "externalURL": "https://my-plugin-docs.example.com",
    "dependencies": ["pandas==2.0.0", "matplotlib"],
    "pluginRequires": ["other_plugin_id"]
}
```

Allowed `platforms` values: `"universal"`, `"linux"`, `"macos_intel"`, `"macos_arm"`.

Dependency flags: `"pandas==2.0.0 --no-deps"`, `"pandas==2.0.0 --isolated"`.

## Plugin folder structure — minimal

```
MyPlugin/
├── plugin.meta
└── main.py
```

## Plugin folder structure — full

```
MyPlugin/
├── Include/
│   ├── __init__.py
│   └── mymodule.py
├── deps/               # installed automatically by Horus
├── Pages/              # HTML/CSS/JS for extensions
├── Flows/              # predefined flow files
├── plugin.meta
├── main.py
└── logo.png
```

## main.py — minimal plugin entry point

```python
from HorusAPI import Plugin

plugin = Plugin()
```

## main.py — complete plugin boilerplate

```python
from HorusAPI import Plugin, PluginVariable, PluginBlock, VariableTypes

plugin = Plugin()

# --- Variables ---
input_var = PluginVariable(
    id="inputVar",
    name="Input",
    description="Input value",
    type=VariableTypes.STRING,
)

output_var = PluginVariable(
    id="outputVar",
    name="Output",
    description="Output value",
    type=VariableTypes.STRING,
)

# --- Action ---
def my_action(block: PluginBlock):
    # Always import third-party libs inside the function
    import some_library

    value = block.variables[input_var.id]
    block.setOutput(output_var.id, value)

# --- Block ---
my_block = PluginBlock(
    name="My Block",
    description="Does something useful",
    action=my_action,
    variables=[input_var],
    outputs=[output_var],
)

plugin.addBlock(my_block)
```

## Importing from the Include/ folder

```python
# In main.py — Include/ is auto-added to PYTHONPATH
def my_action(block: PluginBlock):
    from mymodule import MyModule   # import inside function scope
    result = MyModule().run()
    block.setOutput(output_var.id, result)
```

## Symlinking for live development

```bash
# Linux
ln -s /absolute/path/to/MyPlugin /home/<user>/.local/share/horus/Plugins

# macOS
ln -s /absolute/path/to/MyPlugin /Users/<user>/Library/Application\ Support/horus/Plugins
```

## Custom AppSupport directory

```bash
export HORUS_APP_SUPPORT_DIR="/my/app/support/dir"
```

## Distributing a plugin

Zip the plugin folder contents and rename the extension to `.hp`:

```bash
cd MyPlugin && zip -r ../MyPlugin.hp . && cd ..
```
