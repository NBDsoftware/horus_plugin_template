# SMILES — Templates & Snippets

## Add a single SMILES string

```python
from HorusAPI import SmilesAPI, PluginBlock

def action(block: PluginBlock):
    smiles_string = block.inputs[smiles_var.id]   # VariableTypes.SMILES or STRING
    SmilesAPI().addSmiles(smiles_string)
```

## Add a SMILES string with group

```python
def action(block: PluginBlock):
    smiles_string = block.inputs[smiles_var.id]
    group_name = block.variables[group_var.id]
    SmilesAPI().addSmiles(smiles_string, group=group_name)
```

## Add molecules from a CSV file

```python
def action(block: PluginBlock):
    csv_path = block.inputs[csv_file_var.id]
    SmilesAPI().addCSV(csv_path)
```

## Add multiple SMILES with full metadata

```python
def action(block: PluginBlock):
    molecules = [
        {
            "smi": "CCO",
            "label": "Ethanol",
            "extraInfo": "Simple alcohol",
            "group": "Solvents",
            "props": {"MW": 46.07, "LogP": -0.31},
        },
        {
            "smi": "c1ccccc1",
            "label": "Benzene",
            "extraInfo": "Aromatic ring",
            "group": "Aromatics",
            "props": {"MW": 78.11, "LogP": 2.13},
        },
    ]
    SmilesAPI().addSmilesWithData(molecules)
```

## Add SMILES from block variable (VariableTypes.SMILES)

```python
def action(block: PluginBlock):
    # VariableTypes.SMILES returns a list of loaded SMILES from the JSME viewer
    smiles_list = block.inputs[smiles_var.id]

    for entry in smiles_list:
        SmilesAPI().addSmiles(entry, group="From JSME")
```

## Reset the SMILES viewer

```python
def action(block: PluginBlock):
    SmilesAPI().reset()
```

## Full workflow — load molecules and reset on re-run

```python
from HorusAPI import SmilesAPI, PluginBlock

def action(block: PluginBlock):
    if block.dirty:
        SmilesAPI().reset()   # clear viewer on re-runs

    csv_path = block.inputs[results_csv_var.id]
    group_label = block.variables[group_var.id]

    SmilesAPI().addCSV(csv_path, group=group_label)
```
