# RemoteAPI

To manage the remote to which the user is connected, use the `RemoteAPI` within a Block execution. It is automatically instantiated and assigned to the current running block, accessible via `block.remote`.

```python
def mySlurmBlockInitialAction(block: SlurmBlock):

    # Access remote metadata
    remoteName = block.remote.name
    remoteHost = block.remote.host
    remoteWorkDir = block.remote.workDir

    # Execute commands on the remote (or locally)
    block.remote.command('ls -l')

    # Upload a file to the remote
    remoteUploadedPath = block.remote.sendData('myFile.txt', 'my/Destination/path/in/remote.txt')

    # Download a file from the remote
    finalDownloadedPath = block.remote.getData('my/Destination/path/in/remote.txt', 'myFile.txt')

    # Change the remote working directory using the cd context manager
    with block.remote.cd('my/remote/path'):
        output = block.remote.command('ls -l')
        print("Output of ls -l in my/remote/path:", output)

    # Submit a single Slurm job
    jobID = block.remote.submitJob('path/to/slurm/script.sh')

    # Submit multiple Slurm jobs at once
    jobIDs = block.remote.submitJob([
        'path/to/slurm/script.sh',
        'path/to/another/slurm/script.sh',
    ])
```

> **Warning:** When passing a list of paths to `submitJob`, Horus submits all jobs at once. If any one of them fails during the submission phase (e.g. a specified queue does not exist), all jobs are submitted but none are registered in Horus. To avoid this, ensure all jobs in a single `submitJob` call share the same specifications.

## Executing commands

Use `block.remote.command()` to run commands on the selected remote. To force execution locally regardless of the selected remote, set `forceLocal=True`:

```python
# Runs on the remote
block.remote.command("mkdir myFolder")

# Runs on the local machine
block.remote.command("mkdir myFolder", forceLocal=True)
```

## Methods

The full `RemoteAPI` method reference is available in the HorusAPI source code documentation.
