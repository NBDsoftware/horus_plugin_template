# SMILES

SMILES (Simplified Molecular Input Line Entry System) is a notation for representing chemical structures in 2D notation. Horus supports SMILES via the `SmilesAPI`.

## SmilesAPI

`SmilesAPI` is a library for creating and manipulating molecular structures using SMILES notation in Horus. It is designed to be used within Blocks. Import it and call the desired methods within a Block action.

```python
from HorusAPI import SmilesAPI

my_smiles = "CCCO"
SmilesAPI().addSmiles(my_smiles)
```

SMILES actions are applied in the same manner as Mol* actions — they queue if the panel is not open and execute once it opens.

## Methods

### `SmilesAPI().addSmiles(smiles, group=None)`

Adds a SMILES string to the SMILES manager.

- **smiles** – The SMILES string to add.
- **group** – Optional group name to organise the molecule.

### `SmilesAPI().addCSV(csv, group=None)`

Adds a CSV file to the SMILES manager.

- **csv** – The CSV file path to add.
- **group** – Optional group name.

### `SmilesAPI().addSmilesWithData(smiles)`

Adds a list of full SMILES objects to the SMILES manager.

- **smiles** – A list of dicts, each with the following keys:
  - `smi` *(string)* — SMILES string.
  - `label` *(string)* — Label to display.
  - `extraInfo` *(string)* — Extra info to display.
  - `group` *(string)* — Group to add the molecule to.
  - `props` *(dict)* — Optional properties to attach to the molecule.

### `SmilesAPI().reset()`

Resets the SMILES visualizer.
