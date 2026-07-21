# Working with Claude in this repo

This repo ships a Claude Code [skill](skills/horus-expert/SKILL.md) that turns Claude into a senior
HorusAPI / Horus plugin developer. It knows the plugin/block/variable/extension/remote/Mol*/SMILES
APIs and writes idiomatic HorusAPI code instead of guessing from general Python knowledge.

## Prerequisites

- [Claude Code](https://claude.com/product/claude-code) installed and running inside this repository
  (skills are discovered automatically from `.claude/skills/`).

## Invoking the skill

**Automatic** — just ask your question naturally. The skill triggers on keywords like
`PluginVariable`, `PluginBlock`, `SlurmBlock`, `VariableTypes`, `Extensions`, `MolstarAPI`,
`SmilesAPI`, `RemoteAPI`, `plugin.meta`, `HorusAPI`, etc. (case-insensitive, split words included).

**Explicit** — force it with the slash form if you want to be sure it's active:


## Example prompts

### Indirect (skill triggers automatically)

The skill activates whenever your prompt mentions a HorusAPI concept, even without naming the
skill — no need to remember it exists:

- `Add a new PluginVariable of type FLOAT with a default value and allowedValues`
- `Why is my SlurmBlock's finalAction not seeing the data I saved in initialAction?`
- `Create a PluginPage with a React extension that shows a results table`
- `Use MolstarAPI to highlight the active site residues of a loaded structure`
- `Add a SMILES input to this block using SmilesAPI's JSME viewer`
- `My plugin.meta is missing a dependency, can you check the folder structure?`

### Direct (explicit `/horus-expert` invocation)

Useful when your prompt doesn't happen to contain a trigger keyword, or you just want to be
certain the skill (not general Python knowledge) answers:

- `/horus-expert I need a block that submits a job to a remote cluster and retrieves the output`
- `/horus-expert Review this file for HorusAPI anti-patterns`
- `/horus-expert Explain how block.remote.sendData and getData differ from local execution`
- `/horus-expert Add an endpoint to my PluginPage that returns JSON to the frontend`

## What it does

1. **Loads context first.** Before answering, it reads the relevant reference/asset pairs from
   [skills/horus-expert/references/](skills/horus-expert/references/) (full API docs) and
   [skills/horus-expert/assets/](skills/horus-expert/assets/) (ready-to-use code templates) based on the
   topic — plugins, variables, blocks, Slurm/remote execution, extensions/pages, flows, Mol*, or SMILES.
2. **Writes complete, runnable code** (imports, variables, action function, block/plugin wiring) rather
   than fragments, and always derives IDs from object attributes (e.g. `my_var.id`) instead of hardcoding
   string literals.
3. **Cites the source reference** for any behavior it explains, so you can verify against the actual docs.
4. **Flags known pitfalls proactively** — e.g. top-level imports breaking plugin unloading, `submitJob`
   list-submission semantics, `extraData` usage between `initialAction`/`finalAction`.

## Extending the skill

Reference/asset pairs live under `skills/horus-expert/references/` and `skills/horus-expert/assets/`,
one topic per file (`blocks.md`, `variables.md`, `remotes.md`, `extensions.md`, `molstar.md`, `smiles.md`,
`flows.md`, `source_code.md`, `reference.md`). Add or update a topic there, then wire it into the
**Context Loading** table in [SKILL.md](skills/horus-expert/SKILL.md) so Claude knows when to load it.
