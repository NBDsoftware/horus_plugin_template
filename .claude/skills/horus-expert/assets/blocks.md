# Blocks — Templates & Snippets

## InputBlock — pass-through (no action)

```python
from HorusAPI import Plugin, PluginVariable, InputBlock, VariableTypes

plugin = Plugin()

string_input = PluginVariable(
    id="stringInput", name="String", description="A string to pass to the flow",
    type=VariableTypes.STRING,
)

string_block = InputBlock(
    name="String Input",
    description="Passes a string value into the flow",
    variable=string_input,
    action=None,   # output is set automatically to the variable value
)

plugin.addBlock(string_block)
```

## InputBlock — with parsing action

```python
from HorusAPI import Plugin, PluginVariable, InputBlock, VariableTypes

plugin = Plugin()

raw_input = PluginVariable(
    id="rawInput", name="Raw Path", description="File path as text",
    type=VariableTypes.STRING,
)

parsed_output = PluginVariable(
    id="parsedOutput", name="Parsed Path", description="Validated file path",
    type=VariableTypes.FILE,
)

def parse_path(block: InputBlock):
    import os
    raw = block.variables[raw_input.id]
    if not os.path.exists(raw):
        raise FileNotFoundError(f"Path does not exist: {raw}")
    block.setOutput(parsed_output.id, raw)

path_block = InputBlock(
    name="File Path Input",
    description="Validates and passes a file path",
    variable=raw_input,
    output=parsed_output,
    action=parse_path,
)

plugin.addBlock(path_block)
```

## PluginBlock — minimal

```python
from HorusAPI import Plugin, PluginVariable, PluginBlock, VariableTypes

plugin = Plugin()

input_var = PluginVariable(
    id="inputVar", name="Input", description="Input data",
    type=VariableTypes.ANY,
)
output_var = PluginVariable(
    id="outputVar", name="Output", description="Output data",
    type=VariableTypes.ANY,
)

def action(block: PluginBlock):
    value = block.inputs[input_var.id]
    block.setOutput(output_var.id, value)

my_block = PluginBlock(
    name="Pass Through",
    description="Passes the input to the output unchanged",
    action=action,
    inputs=[input_var],
    outputs=[output_var],
)

plugin.addBlock(my_block)
```

## PluginBlock — accessing variables, inputs and config

```python
def action(block: PluginBlock):
    # Variables: user-configured values (shown in the block settings panel)
    setting = block.variables[setting_var.id]

    # Inputs: values connected from other blocks
    data_file = block.inputs[input_file_var.id]

    # Config: plugin-level permanent configuration
    api_key = block.config[api_key_config.id]
```

## PluginBlock — with extraData and dirty flag

```python
def action(block: PluginBlock):
    if not block.dirty:
        # First run or after reset — initialise persistent state
        block.extraData.clear()
        block.extraData["run_count"] = 0

    block.extraData["run_count"] += 1
    print(f"This block has run {block.extraData['run_count']} time(s)")
```

## PluginBlock — unique block directory

```python
def action(block: PluginBlock):
    input_file = block.inputs[input_var.id]

    if block.remote.isLocal:
        work_dir = block.unique_block_dir_local
    else:
        work_dir = block.unique_block_dir_remote

    block.remote.sendData(input_file, work_dir)
    block.remote.command(f"process.sh {work_dir}")
    block.setOutput(output_var.id, work_dir)
```

## PluginBlock — accessing flow properties

```python
def action(block: PluginBlock):
    flow = block.flow
    print(f"Flow name: {flow.name}")
    print(f"Flow ID: {flow.savedID}")

    # Flow-level persistent storage (shared across all blocks)
    flow.extraData["global_key"] = "global_value"
```

## PluginBlock — with VariableGroup (alternative inputs)

```python
from HorusAPI import PluginBlock, VariableGroup

file_a = PluginVariable(id="fileA", name="File A", description="...", type=VariableTypes.FILE)
file_b = PluginVariable(id="fileB", name="File B", description="...", type=VariableTypes.FILE)
complex_file = PluginVariable(id="complexFile", name="Complex", description="...", type=VariableTypes.FILE)

group_separate = VariableGroup(id="groupSeparate", name="Separate", description="...", variables=[file_a, file_b])
group_complex = VariableGroup(id="groupComplex", name="Complex", description="...", variables=[complex_file])

def action(block: PluginBlock):
    if block.selectedInputGroup == group_separate.id:
        a = block.inputs[file_a.id]
        b = block.inputs[file_b.id]
    elif block.selectedInputGroup == group_complex.id:
        c = block.inputs[complex_file.id]

my_block = PluginBlock(
    name="Flexible Input",
    description="Accepts either separate files or a combined file",
    action=action,
    inputGroups=[group_separate, group_complex],
)
```

## PluginConfig — permanent plugin-level settings

```python
from HorusAPI import PluginConfig, PluginVariable, VariableTypes

plugin = Plugin()

api_key_var = PluginVariable(
    id="apiKey", name="API Key", description="Your service API key",
    type=VariableTypes.PASSWORD,
)

def validate_config(block):
    key = block.variables[api_key_var.id]
    if not key:
        raise ValueError("API key must not be empty")

my_config = PluginConfig(
    name="My Plugin Settings",
    description="Plugin-level configuration",
    action=validate_config,
    variables=[api_key_var],
)

plugin.addConfig(my_config)

# Access in any block action:
def action(block: PluginBlock):
    key = block.config[api_key_var.id]
```

## SlurmBlock — full template

```python
from HorusAPI import Plugin, PluginVariable, SlurmBlock, VariableTypes

plugin = Plugin()

input_file = PluginVariable(
    id="inputFile", name="Input File", description="File to process on the cluster",
    type=VariableTypes.FILE,
)
partition_var = PluginVariable(
    id="partition", name="Partition", description="Slurm partition",
    type=VariableTypes.STRING, defaultValue="main",
)
output_file = PluginVariable(
    id="outputFile", name="Output File", description="Result file from the cluster",
    type=VariableTypes.FILE,
)

REMOTE_WORKDIR = "horus_jobs/my_job"

def initial_action(block: SlurmBlock):
    import os

    local_input = block.inputs[input_file.id]
    partition = block.variables[partition_var.id]

    # Upload input
    remote_input = block.remote.sendData(local_input, f"{REMOTE_WORKDIR}/input.dat")

    # Generate Slurm script
    script_path = f"{REMOTE_WORKDIR}/job.sh"
    script_content = f"""#!/bin/bash
#SBATCH --partition={partition}
#SBATCH --job-name=my_job

cd {REMOTE_WORKDIR}
my_program input.dat > output.dat
"""
    with block.remote.cd(REMOTE_WORKDIR):
        block.remote.command(f"mkdir -p {REMOTE_WORKDIR}")
        block.remote.command(f"cat > {script_path} << 'EOF'\n{script_content}\nEOF")

    job_id = block.remote.submitJob(script_path, arguments=[f"--partition={partition}"])
    print(f"Submitted job {job_id}")

    # Persist remote paths for finalAction
    block.extraData["remote_workdir"] = REMOTE_WORKDIR

def final_action(block: SlurmBlock):
    remote_workdir = block.extraData["remote_workdir"]

    local_output = block.remote.getData(f"{remote_workdir}/output.dat", "output.dat")
    block.setOutput(output_file.id, local_output)

slurm_block = SlurmBlock(
    name="Run Cluster Job",
    description="Uploads input, submits a Slurm job, and downloads the result",
    initialAction=initial_action,
    finalAction=final_action,
    variables=[partition_var],
    inputs=[input_file],
    outputs=[output_file],
    failOnSlurmError=True,
)

plugin.addBlock(slurm_block)
```

## SlurmBlock — submit multiple jobs

```python
def initial_action(block: SlurmBlock):
    scripts = [
        block.remote.sendData("job_a.sh", "remote/job_a.sh"),
        block.remote.sendData("job_b.sh", "remote/job_b.sh"),
    ]
    # All jobs must share the same Slurm specifications
    job_ids = block.remote.submitJob(scripts)
    block.extraData["job_ids"] = job_ids
```

## Extensions result — load file/image/plot from block action

```python
from HorusAPI import Extensions

def action(block: PluginBlock):
    output_csv = block.inputs[result_file.id]

    # Open immediately
    Extensions().loadCSV(output_csv, title="Results Table", store=False)

    # Or store for later (shows button on block)
    Extensions().loadPlot(output_csv, title="Results Plot", store=True)
    Extensions().loadImage("/path/to/figure.png", title="Figure", store=True)
    Extensions().loadFile("/path/to/report.txt", title="Report", store=True, readOnly=True)
```
