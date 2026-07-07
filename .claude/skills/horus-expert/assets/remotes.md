# RemoteAPI — Templates & Snippets

## block.remote — full usage in SlurmBlock.initialAction

```python
def initial_action(block: SlurmBlock):
    # Remote metadata
    print("Remote name:", block.remote.name)
    print("Remote host:", block.remote.host)
    print("Remote workdir:", block.remote.workDir)
    print("Is local:", block.remote.isLocal)
    print("User home:", block.remote.userHome)

    # Upload a file to the remote
    remote_path = block.remote.sendData(
        block.inputs[input_file.id],
        "horus_jobs/my_job/input.dat",
    )

    # Run a command on the remote
    output = block.remote.command("ls -lh horus_jobs/my_job/")
    print(output)

    # Change directory context for subsequent commands
    with block.remote.cd("horus_jobs/my_job"):
        result = block.remote.command("wc -l input.dat")
        print("Line count:", result)

    # Submit a Slurm job
    job_id = block.remote.submitJob("horus_jobs/my_job/job.sh")
    print("Job ID:", job_id)

    # Persist remote path for finalAction
    block.extraData["remote_job_dir"] = "horus_jobs/my_job"
```

## block.remote — download results in SlurmBlock.finalAction

```python
def final_action(block: SlurmBlock):
    remote_dir = block.extraData["remote_job_dir"]

    local_path = block.remote.getData(
        f"{remote_dir}/output.dat",
        "output.dat",
    )
    block.setOutput(output_file.id, local_path)
```

## block.remote — force local execution

```python
def action(block: PluginBlock):
    # Even if a remote is selected, this runs locally
    block.remote.command("mkdir -p local_results", forceLocal=True)
    block.remote.command("cp template.sh local_results/", forceLocal=True)
```

## block.remote — command with environment variables

```python
def action(block: PluginBlock):
    output = block.remote.command(
        "python process.py",
        env={"MY_PARAM": block.variables[param_var.id], "NUM_THREADS": "4"},
        timeout=3600,
        mergeStdErr=True,
    )
    print(output)
```

## block.remote — submit multiple Slurm jobs

```python
def initial_action(block: SlurmBlock):
    # Upload scripts first
    scripts = []
    for i, input_path in enumerate(block.inputs[input_list.id]):
        remote_script = f"jobs/job_{i}/run.sh"
        block.remote.sendData(input_path, f"jobs/job_{i}/input.dat")
        block.remote.sendData("run_template.sh", remote_script)
        scripts.append(remote_script)

    # All scripts must share the same Slurm specifications
    job_ids = block.remote.submitJob(
        scripts,
        arguments=["--partition=main", "--time=02:00:00"],
        env={"MY_ENV": "value"},
    )
    block.extraData["job_ids"] = job_ids
    block.extraData["num_jobs"] = len(scripts)
```

## block.remote — cd context manager

```python
def initial_action(block: SlurmBlock):
    with block.remote.cd("project/simulations"):
        # All commands inside run relative to this path
        block.remote.command("mkdir -p run_01")
        block.remote.command("cp ../template.inp run_01/input.inp")
        block.remote.sendData("local_params.dat", "run_01/params.dat")
        job_id = block.remote.submitJob(
            "run_01/submit.sh",
            changeDir=False,   # cd context manager is already handling this
        )
```

## block.remote — conditional local vs remote path

```python
def action(block: PluginBlock):
    input_path = block.inputs[input_file.id]

    if block.remote.isLocal:
        work_dir = block.unique_block_dir_local
    else:
        work_dir = block.unique_block_dir_remote

    block.remote.sendData(input_path, work_dir)
    block.remote.command(f"process.sh {work_dir}/input.dat")

    output = f"{work_dir}/output.dat"
    if not block.remote.isLocal:
        output = block.remote.getData(output, "output.dat")

    block.setOutput(output_var.id, output)
```
