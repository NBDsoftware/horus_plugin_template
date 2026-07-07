# Blocks

Blocks are the most important part of the HorusAPI. Blocks execute Python code based on the provided `PluginVariable`. To build a Block, you first need to instantiate some `PluginVariable` and define the Action that the block will perform.

> **Warning:** The `PluginVariable` instances are only used to model the variables of the block. To access the updated values at runtime, use `block.variables` or `block.inputs`.

## Defining the Block

The first step is to instantiate a Block class. There are three kinds of blocks depending on the action they perform: regular blocks (`PluginBlock`), input blocks (`InputBlock`), and Slurm blocks (`SlurmBlock`).

### PluginBlock

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

The base block class for Horus. Executes a single Python function locally on the machine.

### InputBlock

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

A special block that gets input from the user. It only shows its `PluginVariable`. If no action is defined, the block outputs directly the value of the variable. If parsing is needed, define an `action` and an `output` variable.

Parameters:

- **name** – The name of the block.
- **description** – The description of the block.
- **variable** – The variable of the block.
- **output** – The output of the block.
- **action** – The action of the block. Runs when storing the config.
- **id** – The id of the block.
- **externalURL** – External URL for documentation purposes.
- **category** – The category of the block inside the plugin.

### SlurmBlock

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

A block that runs an action on a remote server. It has two actions: one before the job is submitted (`initialAction`) and one after the job is completed (`finalAction`).

Parameters:

- **name** – The name of the block.
- **description** – The description of the block.
- **initialAction** – The action before the job is submitted.
- **finalAction** – The action after the job is completed.
- **variables** – The variables of the block.
- **inputs** – The inputs of the block.
- **inputGroups** – The input groups of the block.
- **outputs** – The outputs of the block.
- **id** – The id of the block.
- **failOnSlurmError** – Whether to fail the block if the Slurm job fails.
- **externalURL** – External URL for documentation purposes.

## Setting the action of the block

The action is defined as a Python function that always takes the block parameter with its respective block type. If any error is raised inside the action, the block is marked as failed and the error message is displayed in the GUI.

## Accessing variables

To access updated variable values inside a Block Action, use the `block.variables`, `block.inputs`, or `block.config` dictionaries — not the `PluginVariable` objects themselves. Keys are the variable IDs.

```python
def myCustomAction(block: PluginBlock):
    # Accessing variable value (from block configuration)
    inputStringValue = block.variables["stringVariableID"]

    # Accessing input value (connected from another block)
    inputFilePath = block.inputs["fileID"]

    # Accessing config value
    configValue = block.config["configID"]
```

## Setting outputs

Set output values using `block.setOutput()` with the output variable ID:

```python
def myCustomAction(block: PluginBlock):
    block.setOutput("outputVariableID", variableValue)
```

## Examples

### Input blocks

```python
from HorusAPI import PluginVariable, InputBlock, VariableTypes

inputString = PluginVariable(
    name="String",
    id="string",
    description="A string to be used as an input.",
    type=VariableTypes.STRING,
)

stringBlock = InputBlock(
    name="String",
    description="A string to be used as an input.",
    action=None,
    variable=inputString,
)
```

If the input requires no preparation, `action` can be `None`.

### Regular blocks

```python
from HorusAPI import PluginVariable, PluginBlock, VariableTypes

inputVariable = PluginVariable(
    name="Input",
    id="inputID",
    description="A variable to be used as an input.",
    type=VariableTypes.ANY,
)

outputVariable = PluginVariable(
    name="Output variable",
    id="outputID",
    description="The same variable as the input.",
    type=VariableTypes.ANY,
)

def myCustomAction(block: PluginBlock):
    inputValue = block.inputs["inputID"]
    print(inputValue)
    block.setOutput("outputID", inputValue)

printVariableBlock = PluginBlock(
    name="Print variable",
    description="Prints a given variable.",
    action=myCustomAction,
    inputs=[inputVariable],
    outputs=[outputVariable],
)
```

### Slurm blocks

```python
from HorusAPI import PluginVariable, SlurmBlock, VariableTypes

inputFile = PluginVariable(
    name="File",
    id="fileID",
    description="A file to upload to a remote server.",
    type=VariableTypes.FILE,
)

outputFile = PluginVariable(
    name="Output file",
    id="outputFile",
    description="The file downloaded from the remote server after the job is finished.",
    type=VariableTypes.FILE,
)

regularVariable = PluginVariable(
    name="Regular variable",
    id="regularVariable",
    description="A regular variable.",
    type=VariableTypes.STRING,
)

def myCustomActionBefore(block: SlurmBlock):
    regularVariableValue = block.variables["regularVariable"]
    inputFilePath = block.inputs["fileID"]
    block.remote.sendData(inputFilePath, "/path/in/remote/server")
    jobID = block.remote.submitJob("/path/in/remote/server")
    print("Job submitted with ID:", jobID)

def myCustomActionAfter(block: SlurmBlock):
    block.remote.getData("/path/in/remote/server", "/path/in/local/machine")
    block.setOutput("outputFile", "/path/in/local/machine")

sendJobBlock = SlurmBlock(
    name="Send a job",
    description="Submits a job to the remote and downloads the results",
    initialAction=myCustomActionBefore,
    finalAction=myCustomActionAfter,
    variables=[regularVariable],
    inputs=[inputFile],
    outputs=[outputFile],
)
```

## Adding Blocks to a Plugin

```python
plugin.addBlock(myBlock)
```

## Configurations

You can add permanent variables to a Block using `PluginConfig`. These variables are available under the Plugin configuration button and have the same value on every run. `PluginConfig` is a subclass of `PluginBlock` and can define an action for configuration validation.

```python
plugin.addConfig(myConfig)

# Access config in the block action:
myConfigValue = block.config["myConfigID"]
```

## Storing data on blocks or flows

Use `block.extraData` (a dictionary) to store persistent data across runs of the same block. Use `block.flow.extraData` for flow-level persistence.

> **Warning:** `extraData` is never automatically reset. It is the developer's responsibility to clear or overwrite stored values.

```python
# Store data on the block
block.extraData["value_to_store"] = "myValue"

# Store data on the flow
block.flow.extraData["my_key"] = "my_value"
```

## Verifying if the flow was reset

`block.dirty` is a boolean flag indicating whether a block is being re-executed within a flow.

- `False` — the block runs for the first time, or after the flow was manually reset.
- `True` — the block is running again without a reset.

```python
if block.dirty:
    print("This block has been run multiple times without a reset...")
else:
    block.extraData.clear()
    print("Running the block for the first time or after reset!")
```

## Accessing the flow inside the block

The block has access to the `Flow` instance it is being executed in via `block.flow`. This gives access to the list of blocks, the flow name, the flow ID, and other properties.

## Creating a unique folder for the block

Use `block.unique_block_dir_local` and `block.unique_block_dir_remote` to get unique, per-execution directories. The unique name is generated from the block's internal ID and placement ID, preventing naming collisions across runs.

```python
def my_block_action(block: PluginBlock):
    input_file = block.inputs.get("input_data")

    if block.remote.isLocal:
        unique_dir = block.unique_block_dir_local
    else:
        unique_dir = block.unique_block_dir_remote

    block.remote.sendData(input_file, unique_dir)
```

If you need the unique directory path in `finalAction`, save it to `block.extraData` in `initialAction`.
