# my_plugin plugin for Horus

This is a template for a Horus plugin that contains frontend and backend components and includes the development tooling used in this repository.

# Creating a new plugin from this template

To start a new Horus plugin based on this template repo:

1. On GitHub, create a new repository and select this repository as a template in the `2. Configuration` section, under `Start with a template`.
2. Choose an owner and a name for your new repository.
3. Set the visibility (public/private) as needed and click **Create repository**.
4. Clone your new repository locally.
5. Rename all occurrences of `my_plugin` (folders, files, and code references) to your plugin's name.
6. Update this README, the ``.claude/CLAUDE.md`` file, the ``pyproject.toml``, and the ``plugin.meta`` file to reflect your plugin's details.

# Working with Claude

Find more detailed information in the [Claude README](.claude/README.md) file.

# Backend
You can check the backend documentation in the [BACKEND.md](./BACKEND.md) file

# Frontend
You can check the frontend documentation in the [FRONTEND.md](./FRONTEND.md) file.

# Other Resources

## Loading plugins in development mode (HORUS_PLUGINS_DIR folder)

While developing your plugin, you will most likely need to add the plugin
folder to the list of development plugins within Horus.

Instead of adding the current plugin path, you can add at once the current plugin
and all its plugin dependencies by adding the folder path of ``HORUS_PLUGINS_DIR``.
**WARNING**: Make sure to add the symbolic links to the plugin backend folder (where
`Include` folder lives), not the repo root folder.

So, inside this folder, you need to add the symbolic links to the current plugin
being developed, and all its plugin dependencies (e.g. Slurm manager, etc.).

## Pin plugin dependencies

When your plugin requires another plugin to work properly, you will probably
need a given version of that external plugin pinned. Also for VSCode to
recognize properly the syntax of the external plugin.

To easily achieve this, inside the ``plugin_dependencies`` folder you should
place the external plugin dependencies as git submodules.

```
git submodule add <external_plugin_git_url> plugin_dependencies/<external_plugin_name>
```

See https://gist.github.com/gitaarik/8735255 for more information about git submodules.

Recall to add also the symlinks to these susbmodules into the ``HORUS_PLUGINS_DIR``
folder (NOT THE DEFAULT HORUS ONE), so that Horus can load them in development mode.
