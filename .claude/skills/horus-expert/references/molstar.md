# Molstar (Mol*)

Molstar is the molecular visualizer bundled with Horus. Mol* is an open-source molecular visualizer written in TypeScript and WebGL. See [molstar.org](https://molstar.org) for tutorials, documentation, and source code.

To control Mol* from Horus, use the `MolstarAPI` — a bridge for communicating Blocks with the molecular visualizer.

## MolstarAPI

`MolstarAPI` is a library for creating and manipulating molecular structures in the embedded Mol* visualizer inside Horus. Import it and call the desired methods within a Block action.

```python
from HorusAPI import MolstarAPI

# Load a structure
MolstarAPI().addPDB("/path/to/1crn.pdb", "1crn crystal structure")

# Load a trajectory
MolstarAPI().loadTrajectory("/path/to/topology", "/path/to/trajectory")
```

Mol* actions are stored in the flow and applied to the canvas in the order they were invoked. If the flow is not yet open, actions queue and execute once it opens. The flow is saved with the updated Mol* state.

## Selections and Theming

### MolecularSelection

```python
class MolecularSelection(
    *,
    script: str | None = None,
    language: SelectionLanguage | None = SelectionLanguage.VMD,
    chain: str | None = None,
    auth_chain: str | None = None,
    entity: str | None = None,
    residue: int | None = None,
    auth_residue: int | None = None,
    residue_range: dict | None = None,
    auth_residue_range: dict | None = None,
    atom_name: str | None = None,
    auth_atom_name: str | None = None,
    element_symbol: str | None = None,
    atom_id: int | None = None,
    atom_index: int | None = None,
    insertion_code: str | None = None,
    chain_and_residue: dict | None = None,
    auth_chain_and_residue: dict | None = None,
    secondary_structure: Literal['helix', 'sheet', 'coil'] | None = None,
    type: Literal['all', 'polymer', 'protein', 'nucleic', 'water', 'ion',
                  'lipid', 'branched', 'ligand', 'non-standard', 'coarse'] | None = None,
    within_distance: dict | None = None,
)
```

Selections can be made using different scripting languages:

```python
# Script-based selection (VMD, PyMOL, Jmol, MolScript)
selection = MolecularSelection(script="resid 50 to 100", language=SelectionLanguage.VMD)

# Structured selection
selection = MolecularSelection(chain="A", residue_range={"start": 50, "end": 100})
```

### SelectionLanguage

| Value | Enum |
|---|---|
| `'vmd'` | `SelectionLanguage.VMD` |
| `'pymol'` | `SelectionLanguage.PYMOL` |
| `'jmol'` | `SelectionLanguage.JMOL` |
| `'mol-script'` | `SelectionLanguage.MOL_SCRIPT` |

### Proximity Selections

Select all atoms within a certain distance from a target selection:

```python
near_ligand = MolecularSelection(
    within_distance={
        "radius": 5.0,
        "target": MolecularSelection(residue=150),
    }
)
```

### MolstarThemeOptions

```python
class MolstarThemeOptions(
    *,
    representation: MolRepresentations = MolRepresentations.CARTOON,
    representationParams: dict[str, Any] | None = None,
    color: ColorTheme | str | None = None,
    colorParams: dict[str, Any] | None = None,
    size: SizeTheme | str | None = None,
    sizeParams: Dict[str, Any] | None = None,
)
```

Example — cartoon representation coloured by chain ID:

```python
theme = MolstarThemeOptions(
    representation=MolRepresentations.CARTOON,
    color=ColorTheme.chain_id,
    size=SizeTheme.uniform,
)
```

### MolRepresentations

| Enum | Value |
|---|---|
| `BACKBONE` | `'backbone'` |
| `BALL_AND_STICK` | `'ball-and-stick'` |
| `CARBOHYDRATE` | `'carbohydrate'` |
| `CARTOON` | `'cartoon'` |
| `ELLIPSOID` | `'ellipsoid'` |
| `GAUSSIAN_SURFACE` | `'gaussian-surface'` |
| `GAUSSIAN_VOLUME` | `'gaussian-volume'` |
| `LABEL` | `'label'` |
| `LINE` | `'line'` |
| `MOLECULAR_SURFACE` | `'molecular-surface'` |
| `ORIENTATION` | `'orientation'` |
| `PLANE` | `'plane'` |
| `POINT` | `'point'` |
| `PUTTY` | `'putty'` |
| `SPACEFILL` | `'spacefill'` |

### ColorTheme

| Enum | Value |
|---|---|
| `atom_id` | `'atom-id'` |
| `carbohydrate_symbol` | `'carbohydrate-symbol'` |
| `cartoon` | `'cartoon'` |
| `chain_id` | `'chain-id'` |
| `default` | `'default'` |
| `element_index` | `'element-index'` |
| `element_symbol` | `'element-symbol'` |
| `entity_id` | `'entity-id'` |
| `entity_source` | `'entity-source'` |
| `formal_charge` | `'formal-charge'` |
| `hydrophobicity` | `'hydrophobicity'` |
| `illustrative` | `'illustrative'` |
| `model_index` | `'model-index'` |
| `molecule_type` | `'molecule-type'` |
| `occupancy` | `'occupancy'` |
| `partial_charge` | `'partial-charge'` |
| `polymer_id` | `'polymer-id'` |
| `polymer_index` | `'polymer-index'` |
| `residue_name` | `'residue-name'` |
| `secondary_structure` | `'secondary-structure'` |
| `sequence_id` | `'sequence-id'` |
| `uncertainty` | `'uncertainty'` |
| `uniform` | `'uniform'` |
| `unit_index` | `'unit-index'` |
| `volume_segment` | `'volume-segment'` |
| `volume_value` | `'volume-value'` |

### SizeTheme

| Enum | Value |
|---|---|
| `default` | `'default'` |
| `physical` | `'physical'` |
| `shape_group` | `'shape-group'` |
| `uncertainty` | `'uncertainty'` |
| `uniform` | `'uniform'` |
| `volume_value` | `'volume-value'` |

## API Methods

### `MolstarAPI().addMolecule(filePath, label=None, theme=None)`

Adds a molecule file to Mol*.

- **filePath** – Path to the molecule file.
- **label** – Label for the molecule (defaults to filename).
- **theme** – `MolstarThemeOptions` to apply.

### `MolstarAPI().addComponent(label, selectionLabel, selection, theme=None)`

Adds a component (sub-selection) to an existing structure.

- **label** – Label of the already-loaded structure.
- **selectionLabel** – Label for the new component.
- **selection** – `MolecularSelection` specifying what to select.
- **theme** – `MolstarThemeOptions` to apply.

### `MolstarAPI().loadTrajectory(topology, trajectory, label=None)`

Loads a trajectory from topology and coordinates files.

- **topology** – Path to the topology file.
- **trajectory** – Path to the trajectory file.
- **label** – Label (defaults to filename).

### `MolstarAPI().focusResidue(residue, structureLabel=None, chain=None, nearRadius=5)`

Focuses on a specific residue.

- **residue** – Sequence number of the residue.
- **structureLabel** – Label of the structure.
- **chain** – Chain ID of the residue.
- **nearRadius** – Radius around the residue to display nearby residues.

### `MolstarAPI().addSphere(center, radius, color=None, opacity=1)`

Adds a sphere to the scene.

- **center** – `[x, y, z]` coordinates in Angstroms.
- **radius** – Radius in Angstroms.
- **color** – RGB hex string (e.g. `#0000FF`). Defaults to random.
- **opacity** – 0.0–1.0.

### `MolstarAPI().addBox(center, sides=None, lineSize=1, color=None, opacity=1)`

Adds a box to the scene.

- **center** – `[x, y, z]` coordinates.
- **sides** – `[a, b, c]` side lengths (defaults to `[1, 1, 1]`).
- **lineSize** – Line width (default 1).
- **color** – RGB hex string. Defaults to random.
- **opacity** – 0.0–1.0.

### `MolstarAPI().setBackgroundColor(color)`

Sets the background color.

- **color** – RGB hex string (e.g. `#0000FF`).

### `MolstarAPI().setSpin(speed=1)`

Sets the molecule spin speed. Set `speed=0` to stop spinning.

### `MolstarAPI().reset()`

Resets the visualizer.

## Full Example

```python
from HorusAPI import MolstarAPI
from horus.extensions.molstar.model import (
    MolstarThemeOptions,
    MolRepresentations,
    MolecularSelection,
    ColorTheme,
    SizeTheme,
    SelectionLanguage,
)

label = "1abc"
filePath = "/path/to/1abc.pdb"

# Load with cartoon representation
MolstarAPI().addMolecule(
    filePath,
    label=label,
    theme=MolstarThemeOptions(
        representation=MolRepresentations.CARTOON,
    ),
)

# Highlight a specific residue with ball-and-stick
MolstarAPI().addComponent(
    label,
    "Very cool residue",
    selection=MolecularSelection(chain_and_residue={"chain": "A", "residue": 25}),
    theme=MolstarThemeOptions(
        representation=MolRepresentations.BALL_AND_STICK,
        color=ColorTheme.uniform,
        colorParams={"value": "red"},  # X11 name or HEX (e.g. #FF0000)
        size=SizeTheme.physical,
        sizeParams={"scale": 2},
    ),
)

# Highlight a residue range with a surface and uncertainty coloring
MolstarAPI().addComponent(
    label,
    "A range of cool residues",
    selection=MolecularSelection(script="resid 10 to 22", language=SelectionLanguage.VMD),
    theme=MolstarThemeOptions(
        representation=MolRepresentations.MOLECULAR_SURFACE,
        color=ColorTheme.uncertainty,
        colorParams={"domain": [-15, 15]},
        size=SizeTheme.physical,
        sizeParams={"scale": 1.5},
    ),
)
```
