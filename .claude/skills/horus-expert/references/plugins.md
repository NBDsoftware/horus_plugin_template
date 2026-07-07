# Plugins

Plugins are the way to extend Horus functionality. They are loaded when the app launches
and can be used to add new blocks, extensions or predefined flows to the app.

## Automatic plugin creation

The easiest way to create a plugin is to use the `create-horus-plugin` command provided
by the HorusAPI. This command will create a plugin folder with the basic structure, along with a build script
to create the plugin package. To create a plugin, activate the python environment where the HorusAPI is installed
and run the following command:

```bash
create-horus-plugin
```

## Manually creating a plugin

To manually create a plugin, first create a folder with the name of the plugin and inside
it, add a file called `plugin.meta`. This file contains the metadata of the plugin in JSON format and it's
used by Horus to load the plugin. Here's an example of a plugin metadata file:

```json
{
    "id": "horus",
    "name": "Horus",
    "description": "Base plugin for Horus",
    "author": "Horus",
    "version": "0.0.1",
    "pluginFile": "Horus.py",
    "dependencies": [],
    "pluginRequires": [],
}
```

This is a JSON object that represents a plugin for the Horus app. The object contains the following properties:

- `id`: The unique ID of the plugin.
- `name`: The name of the plugin.
- `description`: The description of your plugin.
- `author`: The author of the plugin.
- `version`: The version of the plugin.
- `pluginFile`: The entry point of the plugin. This file must be located in the root of the plugin folder.
- `minHorusVersion`: The minimum Horus version required in order to run the plugin (optional).
- `maxHorusVersion`: The maximum Horus version required in order to run the plugin (optional).
- `platforms`: A list of the platforms where this plugin runs. Allowed values are `"universal"`, `"linux"`, `"macos_intel"` and `"macos_arm"`. Defaults to `"universal"` if not specified (optional).
- `externalURL`: A URL that links to the Plugin's webpage or documentation (optional).
- `dependencies`: An array of strings that contains the PyPI dependencies of the plugin. Dependencies can be declared as `DEPENDENCY==VERSION`, or using the `--no-deps` flag (`DEPENDENCY==VERSION --no-deps`) to install without sub-dependencies, or the `--isolated` flag (`DEPENDENCY==VERSION --isolated`) to install separately from others (optional).
- `pluginRequires`: A list of Plugin IDs used as dependencies for this plugin. The plugins listed here will share the `deps` / `Include` folders (optional).

### Dependencies of plugins

Horus runs a Python backend, which allows plugins to execute arbitrary Python code. You can include any Python library required for your Plugin to work by adding it to the `dependencies` array of the plugin metadata file. For example:

```json
{
    "id": "my_unique_id",
    "name": "My Plugin",
    "description": "A custom plugin",
    "author": "Foo",
    "version": "0.0.1",
    "pluginFile": "main.py",
    "dependencies": ["pandas", "matplotlib"]
}
```

When the plugin is loaded, Horus will install the dependencies using pip. If the dependencies are already installed, Horus will skip the installation. The machine running Horus must have a valid Python interpreter installed.

**Deps folder:** Some libraries are not available on pip or are private. In this case, you can embed the library pre-installed with the plugin by installing the package manually into the `Include` folder of the plugin. The `Include` folder is located in the root of the plugin folder and is appended to `PYTHONPATH` when the plugin is loaded, allowing imports to work.

You can also import from other plugins, as the plugins directory is automatically included in `PYTHONPATH`. Make sure to add the dependency plugin ID to `pluginRequires` in your plugin meta if you intend to import from other plugins.

> **Warning:** When importing a library in your Python Plugin code, make sure to always import inside scoped functions. Libraries imported at top level may not work, as the plugin gets automatically unloaded when not in use. This may result in the library being unloaded and the plugin not working as expected.

> **Note:** Additionally, `preinst.sh` and `postinst.sh` files can be provided in the plugin folder to declare pre-install and post-install scripts. These execute before and after the plugin install process, respectively. `prerm.sh` and `postrm.sh` can be provided for the same functionality when uninstalling the plugin. These scripts allow custom actions such as copying files, installing environments, and more.

### Code organization

The code of the plugin should be located in the root of the plugin folder, though this is not mandatory. You can organise some code inside an `Include` folder. The only requirement is that the entry point must be located in the root of the plugin folder and named as specified by the `pluginFile` property. When running the plugin, the `Include` folder is appended to `PYTHONPATH`. You can also specify a logo by including a `logo.png` image in the root of the plugin.

A more complex plugin folder structure can look like:

```
MyPlugin
├── Include
│   ├── __init__.py
│   └── mymodule.py
├── deps
│   └── ... # Installed by Horus
├── plugin.meta
├── main.py
└── logo.png
```

Then you can import `mymodule.py` from `main.py` as:

```python
from mymodule import MyModule
```

## Coding the plugin

To create a plugin you need to use the `Plugin` class from the `HorusAPI` module. The plugin object must be instantiated to a global `plugin` variable:

```python
from HorusAPI import Plugin

plugin = Plugin()
```

Or from a function that returns the plugin object:

```python
from HorusAPI import Plugin

def get_plugin():
    return Plugin()

plugin = get_plugin()
```

Once you have instantiated your `Plugin` object, you can start adding blocks and extensions to it.

## Live development

When developing a plugin, you can use the **development mode** setting in the Settings section of the app to reload the plugin without restarting Horus. When enabled, a new button in the Blocks sidebar appears that allows you to reload the plugin on demand.

For advanced debugging capabilities, including breakpoints and step-by-step execution, see the Debugging Plugins section, which explains how to use Python's `debugpy` adapter.

It is recommended to create a symlink of your plugin development folder in the Horus Plugins folder:

```bash
# Linux
ln -s /absolute/path/to/your/plugin /home/<user>/.local/share/horus/Plugins

# macOS
ln -s /absolute/path/to/your/plugin /Users/<user>/Library/Application\ Support/horus/Plugins
```

You can also change the folder where Horus looks for installed plugins using the `HORUS_PLUGINS_DIR` or `HORUS_DEV_PLUGINS_FOLDERS` environment variables.

> **Note:** Plugins are imported in the following order:
> 1. Development plugins
> 2. Installed plugins
> 3. Default plugins

> **Warning:** Make sure the symlink is correctly created. The folder containing the `*.py` entry (and all plugin files) must be inside the Plugins folder. For example:
>
> ```
> # Linux
> /home/<user>/.local/share/com.bsc.horus/Plugins/MyPlugin/main.py
>
> # macOS
> /Users/<user>/Library/Application Support/com.bsc.horus/Plugins/MyPlugin/main.py
> ```

> **Note:** You can modify the AppSupport directory of a Horus instance by setting:
>
> ```bash
> export HORUS_APP_SUPPORT_DIR="/my/app/support/dir/folder"
> ```

## Distributing plugins

Once your plugin is ready, create a zip file with the contents of the plugin folder and rename the `.zip` extension to `.hp`. Plugins can be installed in Horus using the **Install plugin** button in the Plugins section of the app.
