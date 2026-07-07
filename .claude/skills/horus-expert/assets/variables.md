# Variables — Templates & Snippets

## PluginVariable — one of each common type

```python
from HorusAPI import PluginVariable, VariableTypes

# String input
string_var = PluginVariable(
    id="stringVar", name="Text", description="A text value",
    type=VariableTypes.STRING,
)

# Integer input
integer_var = PluginVariable(
    id="intVar", name="Count", description="An integer value",
    type=VariableTypes.INTEGER, defaultValue=1,
)

# Float input
float_var = PluginVariable(
    id="floatVar", name="Threshold", description="A float value",
    type=VariableTypes.FLOAT, defaultValue=0.5,
)

# Boolean checkbox
bool_var = PluginVariable(
    id="boolVar", name="Enable", description="Toggle this option",
    type=VariableTypes.BOOLEAN, defaultValue=False,
)

# File picker
file_var = PluginVariable(
    id="fileVar", name="Input File", description="Select a file",
    type=VariableTypes.FILE,
)

# Folder picker
folder_var = PluginVariable(
    id="folderVar", name="Output Folder", description="Select a folder",
    type=VariableTypes.FOLDER,
)

# Single structure from Mol*
structure_var = PluginVariable(
    id="structureVar", name="Structure", description="Select a molecular structure from Mol*",
    type=VariableTypes.STRUCTURE,
)

# Multiple structures from Mol*
multi_structure_var = PluginVariable(
    id="multiStructureVar", name="Structures", description="Select one or more structures",
    type=VariableTypes.MULTIPLE_STRUCTURE,
)

# Pass-through (any type, no UI)
any_var = PluginVariable(
    id="anyVar", name="Data", description="Any type of data",
    type=VariableTypes.ANY,
)

# Large text area
text_area_var = PluginVariable(
    id="textAreaVar", name="Notes", description="Multi-line text",
    type=VariableTypes.TEXT_AREA,
)

# Password field
password_var = PluginVariable(
    id="passwordVar", name="API Key", description="Secret key",
    type=VariableTypes.PASSWORD,
)

# JSON object (code editor)
object_var = PluginVariable(
    id="objectVar", name="Config", description="Configuration object",
    type=VariableTypes.OBJECT,
)

# Code editor (specify language via allowedValues)
code_var = PluginVariable(
    id="codeVar", name="Script", description="Python script",
    type=VariableTypes.CODE, allowedValues=["python"],
)
```

## PluginVariable — selection types

```python
# Dropdown with fixed options
dropdown_var = PluginVariable(
    id="colorVar", name="Color", description="Pick a color",
    type=VariableTypes.STRING_LIST,
    allowedValues=["Red", "Green", "Blue"],
)

# Radio buttons (single selection)
radio_var = PluginVariable(
    id="modeVar", name="Mode", description="Select mode",
    type=VariableTypes.RADIO,
    allowedValues=["Fast", "Accurate", "Balanced"],
)

# Checkboxes (multi-selection)
checkbox_var = PluginVariable(
    id="chainsVar", name="Chains", description="Select chains to process",
    type=VariableTypes.CHECKBOX,
    allowedValues=["A", "B", "C"],
)

# Number list dropdown
number_list_var = PluginVariable(
    id="framesVar", name="Frames", description="Select frame indices",
    type=VariableTypes.NUMBER_LIST,
    allowedValues=[1, 10, 100, 1000],
)

# Number range slider
range_var = PluginVariable(
    id="rangeVar", name="Range", description="Select a value in range",
    type=VariableTypes.NUMBER_RANGE,
    allowedValues=[0, 100, 1],   # [min, max, step]
)

# Dual-handle constrained range slider
constrained_range_var = PluginVariable(
    id="windowVar", name="Window", description="Select a range window",
    type=VariableTypes.CONSTRAINED_NUMBER_RANGE,
    allowedValues=[0, 100, 1],   # [min, max, step]
)
```

## PluginVariable — molecular selection types

```python
# Atom selection (ball-and-stick picker in Mol*)
atom_var = PluginVariable(
    id="atomVar", name="Atom", description="Select an atom",
    type=VariableTypes.ATOM,
)

# Chain dropdown
chain_var = PluginVariable(
    id="chainVar", name="Chain", description="Select a chain",
    type=VariableTypes.CHAIN,
)

# Interactive chain click in Mol*
chain_interactive_var = PluginVariable(
    id="chainInteractiveVar", name="Chain", description="Click to select a chain in Mol*",
    type=VariableTypes.CHAIN_INTERACTIVE,
)

# Standard residue dropdown
stdres_var = PluginVariable(
    id="stdresVar", name="Residue", description="Select a standard residue",
    type=VariableTypes.STDRES,
)

# Hetero residue
heterores_var = PluginVariable(
    id="heteroresVar", name="Ligand", description="Select a hetero residue",
    type=VariableTypes.HETERORES,
)

# Any residue (standard or non-standard)
residue_var = PluginVariable(
    id="residueVar", name="Residue", description="Select a residue",
    type=VariableTypes.RESIDUE,
)

# Residue range
residue_range_var = PluginVariable(
    id="residueRangeVar", name="Residue Range", description="Select a range of residues",
    type=VariableTypes.RESIDUE_RANGE,
)

# Interactive box in Mol*
box_var = PluginVariable(
    id="boxVar", name="Docking Box", description="Define a docking box in Mol*",
    type=VariableTypes.BOX,
)

# Interactive sphere in Mol*
sphere_var = PluginVariable(
    id="sphereVar", name="Sphere", description="Define a sphere in Mol*",
    type=VariableTypes.SPHERE,
)

# SMILES from JSME viewer
smiles_var = PluginVariable(
    id="smilesVar", name="Ligand SMILES", description="Draw or select a SMILES molecule",
    type=VariableTypes.SMILES,
)
```

## PluginVariable — list type

```python
# Simple list (strings by default)
list_var = PluginVariable(
    id="listVar", name="Items", description="A list of items",
    type=VariableTypes.LIST,
)

# Typed list (numbers)
number_list_typed_var = PluginVariable(
    id="numberListVar", name="Indices", description="List of residue indices",
    type=VariableTypes.LIST,
    allowedValues=[VariableTypes.NUMBER],
)
```

## PluginVariable — required, disabled, showInCanvas

```python
required_var = PluginVariable(
    id="requiredVar", name="PDB File", description="Required input",
    type=VariableTypes.FILE,
    required=True,
)

canvas_var = PluginVariable(
    id="canvasVar", name="Label", description="Shown on the block body",
    type=VariableTypes.STRING,
    showInCanvas=True,
    defaultValue="My Block",
)
```

## VariableGroup — alternative input sets

```python
from HorusAPI import VariableGroup

# Define shared variables
system_pdb = PluginVariable(id="systemPdb", name="System PDB", description="...", type=VariableTypes.FILE)
ligand_pdb = PluginVariable(id="ligandPdb", name="Ligand PDB", description="...", type=VariableTypes.FILE)
complex_pdb = PluginVariable(id="complexPdb", name="Complex PDB", description="...", type=VariableTypes.FILE)
ligand_sel = PluginVariable(id="ligandSel", name="Ligand Selection", description="...", type=VariableTypes.STRING)

separate_input = VariableGroup(
    id="separateInput",
    name="Separate files",
    description="Provide system and ligand separately",
    variables=[system_pdb, ligand_pdb],
)

complex_input = VariableGroup(
    id="complexInput",
    name="Complex file",
    description="Provide the full complex and select the ligand",
    variables=[complex_pdb, ligand_sel],
)

# Use in a block
def action(block):
    if block.selectedInputGroup == separate_input.id:
        sys = block.inputs[system_pdb.id]
        lig = block.inputs[ligand_pdb.id]
    else:
        cpx = block.inputs[complex_pdb.id]
        sel = block.inputs[ligand_sel.id]
```

## VariableList — multi-row typed table

```python
from HorusAPI import VariableList

row_structure = PluginVariable(id="rowStructure", name="Structure", description="...", type=VariableTypes.STRUCTURE)
row_chain = PluginVariable(id="rowChain", name="Chain", description="...", type=VariableTypes.STRING)

multi_row_var = VariableList(
    id="multiRowVar",
    name="Structure-Chain pairs",
    description="Add one or more structure/chain pairs",
    prototypes=[row_structure, row_chain],
)

def action(block: PluginBlock):
    rows = block.variables[multi_row_var.id]
    # rows is a list of dicts: [{"rowStructure": ..., "rowChain": ...}, ...]
    for row in rows:
        structure = row[row_structure.id]
        chain = row[row_chain.id]
```

## CustomVariable — custom renderer via PluginPage

```python
from HorusAPI import Plugin, PluginPage, CustomVariable, VariableTypes

plugin = Plugin()

custom_page = PluginPage(
    id="customRendererPage",
    name="Custom Renderer",
    description="Custom variable renderer",
    html="customrender.html",
    hidden=True,
)
plugin.addPage(custom_page)   # must be added before use

custom_var = CustomVariable(
    id="customVar",
    name="Custom Input",
    description="Opens a custom configuration view",
    customPage=custom_page,         # pass the object, not its ID
    type=VariableTypes.NUMBER,      # determines connection compatibility
    category="Custom",
)
```

## CustomVariable — JavaScript API (inside customrender.html)

```javascript
// Read the current variable value
const variable = window.horusVariable.getVariable();

// Write a new value back
window.horusVariable.setVariable(42);

// Read the current flow
const flow = window.horusVariable.getFlow();

// Write flow changes
flow.title = "Updated title";
window.horus.setFlow(flow);

// Listen for flow changes (attach to PARENT — extensions run in iframes)
parent.addEventListener("flowChanged", (event) => {
    const updatedFlow = event.detail;
    console.log("Flow changed:", updatedFlow);
});

// Programmatically execute the flow
await window.horus.executeFlow({
    placedID: 1,          // ID of the block to execute (required)
    resetFlow: true,      // optional — reset before executing
    continueSlurm: false, // optional — continue Slurm execution
});
```
