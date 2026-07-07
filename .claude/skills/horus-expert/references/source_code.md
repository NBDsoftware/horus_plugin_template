# API Reference (Source Code)

Complete class and method reference for the HorusAPI. For conceptual documentation and usage examples, see the individual topic files in this `references/` folder.

---

## Plugins

### Variables

#### `PluginVariable`

```python
class PluginVariable(
    id: str,
    name: str,
    description: str,
    type: VariableTypes | str,
    defaultValue: Any | None = None,
    allowedValues: List[Any] | None = None,
    category: str | None = None,
    disabled: bool = False,
    required: bool = False,
    placeholder: str | None = None,
    showInCanvas: bool = False,
)
```

Class that defines a variable that can be used in a `PluginBlock`.

Parameters:

- **id** – The ID of the variable.
- **name** – The name of the variable.
- **description** – A description of the variable.
- **type** – The type of the variable. Assign using `VariableTypes`.
- **defaultValue** – The default value of the variable.
- **allowedValues** – A list of allowed values for the variable.
- **category** – The category of the variable.
- **disabled** – Whether the variable is disabled.
- **required** – Whether the variable is required. Shows the variable in orange when not connected.
- **placeholder** – The placeholder of the input field.
- **showInCanvas** – Whether the variable is part of the body of the block.

---

#### `VariableGroup`

```python
class VariableGroup(
    id: str,
    name: str,
    description: str,
    variables: List[PluginVariable],
    allowedValues: List[Any] | None = None,
    category: str | None = None,
    disabled: bool = False,
    required: bool = False,
    showInCanvas: bool = False,
)
```

A group of variables to be used together as input.

Parameters:

- **id** – The ID of the variable group (must be unique).
- **name** – The name of the variable group.
- **description** – A description of the variable group.
- **variables** – The list of variables in the group.
- **allowedValues** – Groups with the same `allowedValues` can be connected in the GUI.
- **disabled** – Sets all variables under the group as disabled.

---

#### `VariableTypes`

All available variable types. See [variables.md](variables.md) for full descriptions and UI rendering behaviour.

| Enum | Value | Description |
|---|---|---|
| `ANY` | `'any'` | Any type; no input rendered; used for block-to-block connections |
| `ATOM` | `'atom'` | Atom selection from a loaded structure (ball-and-stick in Mol\*) |
| `BOOLEAN` | `'boolean'` | True/False checkbox |
| `BOX` | `'box'` | Interactive box in Mol\*; returns metrics dict |
| `CHAIN` | `'chain'` | Chain dropdown; returns dict with index, name, residues, structure |
| `CHAIN_INTERACTIVE` | `'chain_interactive'` | Click-to-select chain in Mol\* |
| `CHECKBOX` | `'checkbox'` | Multi-select list of checkboxes; options via `allowedValues` |
| `CODE` | `'code'` | Code editor; language via `allowedValues` |
| `CONSTRAINED_NUMBER_RANGE` | `'[number, number, number, constrain]'` | Dual-handle slider; `allowedValues=[min, max, step]` |
| `CUSTOM` | `'custom'` | Custom type; connectable only to matching `allowedValues` |
| `FILE` | `'file'` | File picker (server explorer or desktop OS picker) |
| `FLOAT` | `'float'` | Float number input |
| `FOLDER` | `'folder'` | Folder picker |
| `HETERORES` | `'heterores'` | Hetero residue list; returns dict with index, name, atoms, structure |
| `INTEGER` | `'integer'` | Integer number input |
| `LIST` | `'list'` | Dynamic table; element type via `allowedValues[0]` |
| `MULTIPLE_STRUCTURE` | `'multiple_structure'` | Multi-select structure checkboxes; returns list of dicts |
| `NUMBER` | `'number'` | Generic number input |
| `NUMBER_LIST` | `'number[]'` | Number list dropdown |
| `NUMBER_RANGE` | `'[number, number, number]'` | Single-handle slider; `allowedValues=[min, max, step]` |
| `OBJECT` | `'object'` | Code editor; returns JSON-serialisable Python dict |
| `PASSWORD` | `'password'` | Password input; returns string |
| `RADIO` | `'radio'` | Radio buttons; single selection; options via `allowedValues` |
| `RESIDUE` | `'residue'` | Standard or non-standard residue selection |
| `RESIDUE_RANGE` | `'residue_range'` | Two-residue range selection visualised in Mol\* |
| `SMILES` | `'smiles'` | SMILES strings from JSME viewer |
| `SPHERE` | `'sphere'` | Interactive sphere in Mol\*; returns `{center: [x,y,z], radius: float}` |
| `STDRES` | `'stdres'` | Standard residue dropdown; returns dict with index, name, atoms, structure |
| `STRING` | `'string'` | Text input |
| `STRING_LIST` | `'string[]'` | String list dropdown |
| `STRUCTURE` | `'structure'` | Single structure radio buttons; returns dict with id, name, type, structure |
| `TEXT_AREA` | `'text_area'` | Multi-line text area |

`VariableTypes.getTypes()` — returns a list of all available types.

---

### Blocks

#### `PluginBlock`

```python
class PluginBlock(
    name: str,
    description: str,
    action: Callable | None = None,
    variables: List[PluginVariable] = [],
    inputs: List[PluginVariable] = [],
    inputGroups: List[VariableGroup] = [],
    outputs: List[PluginVariable] = [],
    blockType: PluginBlockTypes = PluginBlockTypes.BASE,
    id: str | None = None,
    externalURL: str | None = None,
    category: str | None = None,
)
```

The base block class for Horus. Not to be used directly — use `PluginBlock`, `InputBlock`, or `SlurmBlock`.

**Properties and attributes:**

| Name | Type | Description |
|---|---|---|
| `action` | `Callable` | The action the block performs |
| `blockLogs` | `str` | Logs of the block (default `''`) |
| `category` | `str \| None` | Category inside the plugin (default `None`) |
| `config` | `dict` | Configuration of the plugin hosting this block |
| `dirty` | `bool` | `False` on first run or after reset; `True` on subsequent runs |
| `error` | `bool` | Whether the block has an error |
| `externalURL` | `str` | External URL for documentation |
| `extraData` | `Dict[str, Any]` | Persistent data store across runs; never auto-reset |
| `flow` | `Flow` | The current flow (available during action execution) |
| `id` | `str` | Composed from plugin ID + block ID |
| `inputs` *(property)* | `dict` | `{inputID: value}` — updated input values |
| `isCustom` | `bool` | Whether the block was created with the block editor UI |
| `name` | `str` | The name of the block |
| `outputs` *(property)* | `dict` | `{outputID: value}` — output values |
| `pluginDir` | `str` | Local path to the plugin installation |
| `remote` | `PluginRemote` | The RemoteAPI for this block |
| `selectedInputGroup` | `str` | ID of the selected input group (default `'default'`) |
| `selectedRemote` | `str` | Name of the selected remote (default `'Local'`) |
| `time` | `float` | Execution time of the block |
| `unique_block_dir_local` *(property)* | `str` | Unique local directory per execution |
| `unique_block_dir_remote` *(property)* | `str` | Unique remote directory per execution |
| `variables` *(property)* | `dict` | `{variableID: value}` — updated variable values |

**Methods:**

- `setOutput(id: str, value: Any)` — Sets the value of an output variable.
- `copy()` — Returns a deep copy of the block.

---

#### `InputBlock`

```python
class InputBlock(
    name,
    description,
    variable: PluginVariable,
    output: PluginVariable | None = None,
    action: Callable | None = None,
    id: str | None = None,
    externalURL: str | None = None,
    category: str | None = None,
)
```

Bases: `PluginBlock`

A special block that gets input from the user. If no `action` is defined, the block outputs the variable value directly. If parsing is needed, define `action` and `output`.

Parameters:

- **name** – The name of the block.
- **description** – The description of the block.
- **variable** – The variable of the block.
- **output** – The output variable (required if `action` is defined).
- **action** – Runs when storing the config.
- **id** – The id of the block.
- **externalURL** – External URL for documentation.
- **category** – Category inside the plugin.

---

#### `SlurmBlock`

```python
class SlurmBlock(
    name: str,
    description: str,
    initialAction: Callable | None,
    finalAction: Callable | None,
    variables: List[PluginVariable] = [],
    inputs: List[PluginVariable] = [],
    inputGroups: List[VariableGroup] = [],
    outputs: List[PluginVariable] = [],
    id: str | None = None,
    failOnSlurmError: bool = True,
    externalURL: str | None = None,
    category: str | None = None,
)
```

Bases: `PluginBlock`

A block that runs two actions: `initialAction` before the Slurm job is submitted, and `finalAction` after it completes.

Parameters:

- **name** – The name of the block.
- **description** – The description of the block.
- **initialAction** – Action before the job is submitted.
- **finalAction** – Action after the job is completed.
- **variables** – Block configuration variables.
- **inputs** – Input variables.
- **inputGroups** – Input variable groups.
- **outputs** – Output variables.
- **id** – The id of the block.
- **failOnSlurmError** – Whether to fail the block if the Slurm job fails.
- **externalURL** – External URL for documentation.

---

### Plugin

#### `Plugin`

```python
class Plugin(
    id: str | None = None,
    noMetaLoad: bool = False,
)
```

Base class for all plugins.

**Attributes:**

| Name | Type | Description |
|---|---|---|
| `id` | `str` | Unique plugin ID; auto-assigned from `plugin.meta` |
| `logo` | `str \| None` | Path to the plugin logo |
| `pluginMeta` | `PluginMetaModel` | The metadata of the plugin |
| `default` | `bool` | Whether this is a default plugin |
| `dev` | `bool` | Whether the plugin comes from a development folder |
| `actions` | `List[Callable] \| None` | Functions callable from the GUI (WIP) |
| `config` *(property)* | `dict` | Configuration dict of the plugin |
| `blocks` *(property)* | `list` | All blocks in the plugin |
| `pages` *(property)* | `list` | All pages in the plugin |

**Methods:**

- `addBlock(block: PluginBlock)` — Adds a block to the plugin.
- `addConfig(config: PluginConfig)` — Adds a config to the plugin.
- `addPage(page: PluginPage)` — Adds a page to the plugin.
- `getBlock(id)` — Returns a block by ID.
- `getBlocks()` — Returns all blocks.
- `getPage(id)` — Returns a page by ID.
- `getPages()` — Returns all pages.
- `loadPluginMeta()` — Loads plugin metadata from `plugin.meta` (name, version, author, description, dependencies).

---

## RemoteAPI

### `PluginRemote`

```python
class PluginRemote(remote: RemotesAPI, block: PluginBlock)
```

Remote interface for blocks. Accessed via `block.remote` inside a Block action.

**Properties:**

| Property | Type | Description |
|---|---|---|
| `host` | `str` | Host address of the remote |
| `isLocal` | `bool` | Whether the remote is local |
| `name` | `str` | Name of the remote |
| `userHome` | `str` | Expanded user home directory on the remote |
| `workDir` | `str` | Horus working directory on the remote (or flow directory if local) |

**Methods:**

#### `command(command, timeout=None, forceLocal=False, mergeStdErr=True, env=None)`

Executes a command on the remote (or locally if `forceLocal=True`). Returns the command output.

- **command** – The command string to execute.
- **timeout** – Timeout in seconds (`None` for no timeout).
- **forceLocal** – If `True`, runs locally regardless of the selected remote.
- **mergeStdErr** – If `True` (default), appends stderr to the output.
- **env** – Dict of environment variables to set.

#### `sendData(source, destination) → str`

Sends a file to the remote. Returns the final absolute path on the remote.

#### `getData(source, destination) → str`

Downloads a file from the remote. Returns the final absolute local path.

#### `cd(path)`

Context manager to change the working directory on the remote. Works with `command`, `submitJob`, `sendData`, and `getData`.

#### `submitJob(script, changeDir=True, arguments=None, env=None) → str | list[str]`

Submits one or more Slurm jobs.

- **script** – Absolute path to the Slurm script, or a list of paths to submit multiple jobs at once.
- **arguments** – List of SBATCH arguments (e.g. `["--partition=short", "--time=01:00:00"]`).
- **env** – Dict of environment variables for the job.
- **changeDir** – Automatically `cd` to the script's folder (default `True`). Disable when using the `cd` context manager.

Returns the job ID (or list of IDs). If submitting a list and any one fails during submission, none are registered in Horus.

---

## MolstarAPI

### `MolstarAPI`

API for interacting with the Mol\* visualizer inside Horus. See [molstar.md](molstar.md) for full usage and enum references.

#### `addMolecule(filePath, label=None, theme=None)`

Adds a molecule file to Mol\*.

- **filePath** – Path to the molecule file.
- **label** – Label (defaults to filename).
- **theme** – `MolstarThemeOptions`.

#### `addComponent(label, selectionLabel, selection, theme=None)`

Adds a component (sub-selection) to an existing loaded structure.

- **label** – Label of the loaded structure.
- **selectionLabel** – Label for the new component.
- **selection** – `MolecularSelection`.
- **theme** – `MolstarThemeOptions`.

#### `loadTrajectory(topology, trajectory, label=None)`

Loads a trajectory. Defaults label to filename.

#### `focusResidue(residue, structureLabel=None, chain=None, nearRadius=5)`

Focuses on a specific residue. `nearRadius` controls how many nearby residues are shown.

#### `addSphere(center, radius, color=None, opacity=1)`

Adds a sphere. `center` is `[x, y, z]`; color is an RGB hex string (e.g. `#0000FF`).

#### `addBox(center, sides=None, lineSize=1, color=None, opacity=1)`

Adds a box. `center` is `[x, y, z]`; `sides` is `[a, b, c]` (defaults to `[1, 1, 1]`).

#### `setBackgroundColor(color)`

Sets background color. `color` is an RGB hex string.

#### `setSpin(speed=1)`

Sets molecule spin speed. Pass `speed=0` to stop.

#### `reset()`

Resets the visualizer.

---

## SmilesAPI

### `SmilesAPI`

API for interacting with the SMILES manager inside Horus. See [smiles.md](smiles.md) for usage.

#### `addSmiles(smiles, group=None)`

Adds a SMILES string to the manager.

#### `addCSV(csv, group=None)`

Adds a CSV file path to the manager.

#### `addSmilesWithData(smiles)`

Adds a list of full SMILES objects. Each dict must contain:

- `smi` *(str)* — SMILES string.
- `label` *(str)* — Display label.
- `extraInfo` *(str)* — Extra info.
- `group` *(str)* — Group name.
- `props` *(dict, optional)* — Additional properties.

#### `reset()`

Resets the SMILES visualizer.

---

## ExtensionsAPI

### `Extensions`

API for displaying results from Block actions. See [extensions.md](extensions.md) for usage.

#### `open(pluginID, pageID, data=None, title='Extension')`

Opens a `PluginPage` extension and passes data to it.

- **pluginID** – ID of the plugin that contains the `PluginPage`.
- **pageID** – ID of the `PluginPage`.
- **data** – Dict of data to pass to the extension.

#### `storeExtensionResults(pluginID, pageID, data=None, title='Results')`

Stores results in the flow; shows an "Extensions" button on the block. Opening the button loads the extension with the stored data.

#### `loadFile(filePath, title, store=True, readOnly=False, format=None)`

Loads a file into the Horus File Editor as a result.

- **filePath** – Path to the file.
- **title** – Display title on the block.
- **store** – If `True`, stores as results; if `False`, opens immediately.
- **readOnly** – Whether to open in read-only mode.
- **format** – File format (`"text"`, `"json"`, `"csv"`, `"shell"`, etc.); inferred from extension if `None`.

#### `loadHTML(html, title, store=True)`

Loads an HTML file as a result.

#### `loadImage(image, title, store=True)`

Loads an image (`png`, `jpg`, `gif`) as a result.

#### `loadPDF(pdf, title, store=True)`

Loads a PDF file as a result.

#### `loadCSV(csv, title, store=True)`

Loads a CSV file as a result (table view).

#### `loadPlot(plotCSV, title, store=True)`

Loads a CSV file as a plot result.

#### `loadText(text, title, store=True)`

Loads a text string as a result.

---

## Utils

#### `TempFile(name, folder=None)`

Temporary file stored in user dirs. If `folder` is `None`, stored in the system tmp folder.

- `read()` — Returns the file contents as a string.
- `write(content)` — Writes content to the file.
- `delete()` — Deletes the file.
- `deleteTmpFolder()` — Deletes the tmp folder.

#### `get_unique_dir_name(block, base_name) → str`

Returns a unique directory name that does not exist in either local or remote context for the given block.

#### `get_unique_path(block, path) → str`

Returns a unique path for the block context. Appends a numeric suffix if the path already exists. For files, the suffix is inserted before the extension.

#### `path_exists(block, path) → bool`

Checks whether a path exists wherever the block is running (locally or remotely).

#### `path_exists_local(path) → bool`

Checks whether a path exists locally.

#### `path_exists_remote(block, path) → bool`

Checks whether a path exists on the remote.

#### `dir_name_exists_in_both_contexts(block, dir_name) → bool`

Checks if a directory name exists in both the local and remote parent directories.

#### `structureToFile(structure, filePathToWrite=None) → str`

Saves one Mol\* structure dict to a file in the correct format.

#### `multipleStructuresToFolder(structureList, path=None) → str`

Saves multiple Mol\* structure dicts into a folder.

#### `getUserFolder() → str`

Returns the current logged-in user's folder.

#### `sanitizePath(path)`

Replaces any invalid characters in a path.

#### `initPlugin()`

Creates the basic folder structure for a new Horus plugin.

#### `ResetRemoteException`

Exception raised when the remote server is reset.
