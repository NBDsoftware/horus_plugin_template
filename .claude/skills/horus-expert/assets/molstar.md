# Molstar (Mol*) — Templates & Snippets

## Load a structure — cartoon representation

```python
from HorusAPI import MolstarAPI
from horus.extensions.molstar.model import MolstarThemeOptions, MolRepresentations

structure_path = block.inputs[structure_var.id]
structure_label = "myProtein"   # define once, reuse everywhere

MolstarAPI().addMolecule(
    structure_path,
    label=structure_label,
    theme=MolstarThemeOptions(
        representation=MolRepresentations.CARTOON,
    ),
)
```

## Load a structure — spacefill coloured by element

```python
from horus.extensions.molstar.model import ColorTheme

MolstarAPI().addMolecule(
    structure_path,
    label=structure_label,
    theme=MolstarThemeOptions(
        representation=MolRepresentations.SPACEFILL,
        color=ColorTheme.element_symbol,
    ),
)
```

## Highlight a specific residue — ball-and-stick in red

```python
from horus.extensions.molstar.model import MolecularSelection, ColorTheme, SizeTheme

MolstarAPI().addComponent(
    structure_label,
    "active_site_res_42",
    selection=MolecularSelection(chain_and_residue={"chain": "A", "residue": 42}),
    theme=MolstarThemeOptions(
        representation=MolRepresentations.BALL_AND_STICK,
        color=ColorTheme.uniform,
        colorParams={"value": "red"},   # X11 color name or HEX (#FF0000)
        size=SizeTheme.physical,
        sizeParams={"scale": 1.5},
    ),
)
```

## Highlight a residue range — molecular surface

```python
from horus.extensions.molstar.model import SelectionLanguage

MolstarAPI().addComponent(
    structure_label,
    "binding_pocket",
    selection=MolecularSelection(script="resid 10 to 50", language=SelectionLanguage.VMD),
    theme=MolstarThemeOptions(
        representation=MolRepresentations.MOLECULAR_SURFACE,
        color=ColorTheme.uncertainty,
        colorParams={"domain": [-15, 15]},
        size=SizeTheme.physical,
        sizeParams={"scale": 1.0},
    ),
)
```

## Highlight by chain — cartoon coloured by chain ID

```python
MolstarAPI().addComponent(
    structure_label,
    "chain_A",
    selection=MolecularSelection(chain="A"),
    theme=MolstarThemeOptions(
        representation=MolRepresentations.CARTOON,
        color=ColorTheme.chain_id,
    ),
)
```

## Highlight ligand — ball-and-stick

```python
MolstarAPI().addComponent(
    structure_label,
    "ligand",
    selection=MolecularSelection(type="ligand"),
    theme=MolstarThemeOptions(
        representation=MolRepresentations.BALL_AND_STICK,
        color=ColorTheme.element_symbol,
    ),
)
```

## Select atoms within distance of a residue (proximity)

```python
MolstarAPI().addComponent(
    structure_label,
    "residues_near_ligand",
    selection=MolecularSelection(
        within_distance={
            "radius": 5.0,
            "target": MolecularSelection(type="ligand"),
        }
    ),
    theme=MolstarThemeOptions(
        representation=MolRepresentations.BALL_AND_STICK,
        color=ColorTheme.hydrophobicity,
    ),
)
```

## Select secondary structure

```python
MolstarAPI().addComponent(
    structure_label,
    "helices",
    selection=MolecularSelection(secondary_structure="helix"),
    theme=MolstarThemeOptions(
        representation=MolRepresentations.CARTOON,
        color=ColorTheme.uniform,
        colorParams={"value": "#4488FF"},
    ),
)
```

## Focus on a residue

```python
MolstarAPI().focusResidue(
    residue=block.inputs[residue_var.id]["index"],
    structureLabel=structure_label,
    chain=block.inputs[residue_var.id]["structure"]["id"],
    nearRadius=5,
)
```

## Load a trajectory

```python
MolstarAPI().loadTrajectory(
    topology=block.inputs[topology_var.id],
    trajectory=block.inputs[trajectory_var.id],
    label="simulation_run",
)
```

## Add a sphere to the scene

```python
MolstarAPI().addSphere(
    center=[10.5, 20.3, 5.8],   # [x, y, z] in Angstroms
    radius=3.0,
    color="#FF8800",
    opacity=0.6,
)
```

## Add a box to the scene

```python
box_data = block.inputs[box_var.id]   # VariableTypes.BOX returns a dict
MolstarAPI().addBox(
    center=[box_data["metrics"]["x0"], box_data["metrics"]["y0"], box_data["metrics"]["z0"]],
    sides=[5.0, 5.0, 5.0],
    lineSize=1,
    color="#0088FF",
    opacity=0.4,
)
```

## Scene utilities

```python
# Set background colour
MolstarAPI().setBackgroundColor("#1A1A2E")

# Start spinning
MolstarAPI().setSpin(speed=1)

# Stop spinning
MolstarAPI().setSpin(speed=0)

# Reset viewer to empty state
MolstarAPI().reset()
```

## Full workflow — load, highlight, focus

```python
from HorusAPI import MolstarAPI, PluginBlock
from horus.extensions.molstar.model import (
    MolstarThemeOptions, MolRepresentations, MolecularSelection,
    ColorTheme, SizeTheme, SelectionLanguage,
)

def action(block: PluginBlock):
    pdb_path = block.inputs[pdb_var.id]
    active_residue = block.variables[active_site_var.id]
    structure_label = "protein"

    # Load the structure
    MolstarAPI().addMolecule(
        pdb_path,
        label=structure_label,
        theme=MolstarThemeOptions(representation=MolRepresentations.CARTOON),
    )

    # Highlight the active site
    MolstarAPI().addComponent(
        structure_label,
        "active_site",
        selection=MolecularSelection(chain_and_residue={"chain": "A", "residue": active_residue}),
        theme=MolstarThemeOptions(
            representation=MolRepresentations.BALL_AND_STICK,
            color=ColorTheme.uniform,
            colorParams={"value": "#FF4400"},
            size=SizeTheme.physical,
            sizeParams={"scale": 2},
        ),
    )

    # Focus on it
    MolstarAPI().focusResidue(
        residue=active_residue,
        structureLabel=structure_label,
        chain="A",
        nearRadius=8,
    )
```
