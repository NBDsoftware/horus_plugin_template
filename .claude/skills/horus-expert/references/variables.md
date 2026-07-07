# Variables

Using variables in your Blocks is very easy. Variables allow for the interchange of information between the Flow and the Action of the blocks. Consider variables as parameters that the user can modify during the build of the Flow.

## PluginVariable

In order to define a variable that can be used in the Flow builder you need to instantiate the `PluginVariable` class. This class has the following parameters:

```python
class PluginVariable(
    id: str,
    name: str,
    description: str,
    type: VariableTypes | str,
    defaultValue: Any | None = None,
    allowedValues: List[Any] | None = None,
    category: str | None = None,
    disabled: bool = False,
    required: bool = False,
    placeholder: str | None = None,
    showInCanvas: bool = False
)
```

Class that defines a variable that can be used in a `PluginBlock`.

Parameters:

- **id** – The ID of the variable.
- **name** – The name of the variable.
- **description** – A description of the variable.
- **type** – The type of the variable. Assign it using the `VariableTypes` class.
- **defaultValue** – The default value of the variable.
- **allowedValues** – A list of allowed values for the variable.
- **category** – The category of the variable (optional).
- **disabled** – Whether the variable is disabled or not.
- **required** – Whether the variable is required or not. This will show the variable in orange when not connected.
- **placeholder** – The placeholder of the input field.
- **showInCanvas** – Indicates whether the variable is part of the body of the block.

For example, one may want to define a variable that allows the user to select a PDB structure from the Mol\* visualizer:

```python
structureVariable = PluginVariable(
    name="Structure",
    id="structure",
    description="Select a molecular structure from Mol*",
    type=VariableTypes.STRUCTURE,
)
```

## VariableTypes

It is important to correctly define the type of our `PluginVariables`. The available types are defined in the `VariableTypes` class:

### ANY = `'any'`

Any type of variable. This type will not render anything, as it is meant to be used as a connection between blocks.

### ATOM = `'atom'`

An atom to be selected from a loaded structure. Will enable ball-and-stick visualization in Mol\* to select the atom.

### BOOLEAN = `'boolean'`

A boolean value. True or False. Will render as a checkbox.

### BOX = `'box'`

A box to be rendered in Mol\*. Will render as an interactive box viewer. The user can select the center and the size of each side of the box.

This variable returns a dictionary with the following keys:

```json
{
    "metrics": {
        "x0": 0, "x1": 5, "x2": 0, "x3": 0,
        "y0": 0, "y1": 0, "y2": 5, "y3": 0,
        "z0": 0, "z1": 0, "z2": 0, "z3": 5
    },
    "radialSegments": 2,
    "radiusScale": 5
}
```

### CHAIN = `'chain'`

A chain to be selected from a loaded structure. Will render as a dropdown with the list of chains. The variable returns a dictionary with the following keys:

- `index`: The index of the chain in the structure.
- `name`: The name of the chain.
- `residues`: The list of residues in the chain.
- `structure`: The structure object variable where the atom is located (contains the properties of the STRUCTURE variable).

### CHAIN_INTERACTIVE = `'chain_interactive'`

A chain to be selected from a loaded structure via Mol\*. The user can click directly on the loaded structure to select a chain, which will be highlighted.

### CHECKBOX = `'checkbox'`

A checkbox variable. Renders as a list of checkboxes; multiple can be selected at the same time. Set the `allowedValues` parameter to define the list of options, e.g. `["A", "B", "C"]`.

### CODE = `'code'`

A code variable. Rendered as a code editor; the resulting value is a code snippet string. Select the language with `allowedValues`, e.g. `allowedValues = ["python"]`.

### CONSTRAINED_NUMBER_RANGE = `'[number, number, number, constrain]'`

A range of numbers (can be integer or float depending on the step). Renders as a slider with two dragging handles. Use `allowedValues` to define `[min, max, step]`. Returns two numbers, one for each handle.

### CUSTOM = `'custom'`

A custom variable that can contain any type of data but allows connections only from other custom variables that share the same strings in `allowedValues`. Like `ANY`, it does not render an input field.

Example: a custom variable with `allowedValues = ["A", "B", "C"]` can be connected to another with `allowedValues = ["B"]`.

### FILE = `'file'`

A file picker.
- On the server: opens the server file explorer.
- On the desktop: renders as a system file picker.

### FLOAT = `'float'`

A floating-point number (e.g. 1.0, 2.5, 3.1415). Renders as a number input with increment/decrement buttons; accepts only floats.

### FOLDER = `'folder'`

A folder picker.
- On the server: opens the server file explorer.
- On the desktop: renders as a system folder picker.

### HETERORES = `'heterores'`

A hetero residue to be selected from a loaded structure. Renders as a list of hetero residues. The variable returns a dictionary with the following keys:

- `index`: The index of the residue in the structure.
- `name`: The name of the residue.
- `atoms`: The list of atoms in the residue.
- `structure`: The structure object variable where the atom is located.

### INTEGER = `'integer'`

An integer number (e.g. 1, 2, 3). Renders as a number input with increment/decrement buttons; accepts only integers.

### LIST = `'list'`

`VariableList` will be automatically converted to a list of variables. Renders as a table with an input field and an add button.

### MULTIPLE_STRUCTURE = `'multiple_structure'`

Multiple molecular structures to be selected from Mol\*. Renders as a list of checkboxes with the loaded structures. The variable returns a list of dicts with:

- `id`: The ID of the structure.
- `name`: The name of the structure.
- `type`: The type of the structure (CIF, PDB…).
- `structure`: The structure file contents (CIF, PDB… string).

### NUMBER = `'number'`

A number (e.g. 1, 2.5, 3.1415). Renders as a number input with increment/decrement buttons.

### NUMBER_LIST = `'number[]'`

A list of numbers (e.g. `[1, 2.4, 3.1415]`). Renders as a dropdown.

### NUMBER_RANGE = `'[number, number, number]'`

A range of numbers (integer or float depending on the step). Renders as a slider. Use `allowedValues` to define `[min, max, step]`.

### OBJECT = `'object'`

An object variable. Rendered as a code editor; the resulting value is a Python dictionary. Must be JSON serializable.

### PASSWORD = `'password'`

A password variable. Renders as a password input field; the resulting value is a string.

### RADIO = `'radio'`

A radio variable. Renders as a list of radio buttons; only one can be selected at a time. Set `allowedValues` to define options, e.g. `["A", "B", "C"]`.

### RESIDUE = `'residue'`

A residue to be selected from a loaded structure. Either a standard or non-standard residue.

### RESIDUE_RANGE = `'residue_range'`

A residue range to be selected from a loaded structure. Two residues must be selected (start and end); the range is automatically selected and visualised in Mol\*.

### SMILES = `'smiles'`

A list of molecule SMILES strings. Uses the loaded molecules in the JSME viewer.

### SPHERE = `'sphere'`

A sphere to be rendered in Mol\*. Renders as an interactive sphere viewer. The variable returns a dictionary with the following keys:

- `center`: The center of the sphere as a list of floats `[x, y, z]`.
- `radius`: The radius of the sphere as a float.

### STDRES = `'stdres'`

A standard residue to be selected from a loaded structure. Renders as a dropdown with the list of standard residues. The variable returns a dictionary with the following keys:

- `index`: The index of the residue in the structure.
- `name`: The name of the residue.
- `atoms`: The list of atoms in the residue.
- `structure`: The structure object variable where the atom is located.

### STRING = `'string'`

A regular string (e.g. `"Hello world"`). Renders as a text input.

### STRING_LIST = `'string[]'`

A list of strings (e.g. `["Hello", "World"]`). Renders as a dropdown.

### STRUCTURE = `'structure'`

A single molecular structure to be selected from Mol\*. Renders as a list of radio buttons with the loaded structures. The variable returns a dict with:

- `id`: The ID of the structure.
- `name`: The name of the structure.
- `type`: The type of the structure (CIF, PDB…).
- `structure`: The structure file contents (CIF, PDB… string).

### TEXT_AREA = `'text_area'`

A large text that can contain multiple lines (e.g. `"Hello world \n Hello planet"`). Renders as a text area input.

---

For array types such as `STRING_LIST` (dropdown), specify the allowed values in `allowedValues`:

```python
favoriteColor = PluginVariable(
    name="Favorite color",
    id="favcolor",
    description="Select your favorite color",
    type=VariableTypes.STRING_LIST,
    allowedValues=["Red", "Green", "Blue"],
)
```

For the `LIST` type, you can specify the element type using `allowedValues` (only the first value is used; if none provided, falls back to `VariableTypes.STRING`):

```python
inputlistWithAllowedValues = PluginVariable(
    name="Residue indices",
    id="values",
    description="A list with numbers to be used as an input.",
    type=VariableTypes.LIST,
    allowedValues=[VariableTypes.NUMBER],
)
```

This renders a table in the Flow builder with a dynamic number of elements of the specified type. The variable returns an array of the form `[value1, value2, ...]`.

## VariableGroup

Variables can be grouped together using the `VariableGroup` class. This is intended for Blocks that work with different sets of inputs.

```python
class VariableGroup(
    id: str,
    name: str,
    description: str,
    variables: List[PluginVariable],
    allowedValues: List[Any] | None = None,
    category: str | None = None,
    disabled: bool = False,
    required: bool = False,
    showInCanvas: bool = False
)
```

Parameters:

- **id** – The ID of the variable group (must be unique).
- **name** – The name of the variable group.
- **description** – A description of the variable group.
- **variables** – The list of variables in the group.
- **allowedValues** – Groups with the same `allowedValues` can be connected in the GUI.
- **disabled** – Sets all variables under the group as disabled.

For example, a PELE simulation may require protein and ligand input data, which can be grouped as a complex or separated into their respective files:

```python
ligandFileInput = VariableGroup(
    id="ligandFileInput",
    variables=[
        system_data_input,
        ligand_data_input_file,
    ],
)

ligandSelectionInput = VariableGroup(
    id="ligandSelectionInput",
    variables=[
        complex_data_input,
        complex_ligand_selection_input,
    ],
)
```

The `VariableGroup` is then assigned to the `inputGroup` parameter of a Block. When running a Block action, the selected group is accessible via `block.selectedInputGroup`:

```python
def blockAction(block: SlurmBlock):
    selectedGroup = block.selectedInputGroup  # Either "ligandFileInput" or "ligandSelectionInput"
```

`VariableGroup` can also be assigned to a regular Block variable. In this case, the returned value is a dictionary with variable IDs as keys:

```python
myObjectVariable = VariableGroup(
    id="myObjectVariable",
    name="My object variable",
    description="A variable that contains a group of variables",
    variables=[
        complex_data_input,
        complex_ligand_selection_input,
    ],
)

def blockAction(block: SlurmBlock):
    value = block.variables["myObjectVariable"]
    # {"complex_data_input": "complex.pdb", "complex_ligand_selection_input": "LIG"}
```

On render, variable groups appear as regular `PluginVariable` but with the inner variables grouped together.

## VariableList

Besides the simple `VariableTypes.LIST` type, there is also the `VariableList` class.

```python
class VariableList(
    id: str,
    name: str,
    description: str,
    prototypes: List[PluginVariable],
    defaultValue: list[dict] | None = None,
    allowedValues: List[Any] | None = None,
    category: str | None = None,
    disabled: bool = False,
    required: bool = False,
    showInCanvas: bool = False
)
```

Parameters:

- **id** – The ID of the variable.
- **name** – The name of the variable.
- **description** – A description of the variable.
- **prototypes** – The list of variables in each row of the list.
- **allowedValues** – Matching `allowedValues` in other variables will indicate in the GUI which variables can be connected.
- **disabled** – Sets all variables under the list as disabled.
- **required** – Sets all variables under the list as required.

`VariableList` offers more flexibility than `VariableTypes.LIST`. While `LIST` only supports string values with an optional dropdown, `VariableList` allows a list of variables of any type:

```python
myListVariable = VariableList(
    id="myListVariable",
    name="My list variable",
    description="A variable that contains a list of variables",
    prototypes=[
        complex_data_input,          # VariableTypes.STRUCTURE
        complex_ligand_selection_input,  # VariableTypes.STRING
    ],
)
```

The `prototypes` parameter defines the variables used in each row of the list.

## Custom variables

If more customisation is needed, the `CustomVariable` class allows for a custom renderer for a variable. This is useful when a block requires extensive preparation that is not possible in the Flow builder — for example, selecting residues to mutate or choosing a set of residues from a model folder.

The `type` parameter determines which other variables the custom variable can be connected to in the Flow builder, just like a regular `PluginVariable`:

```python
customRenderPage = PluginPage(
    id="custom_render_page",
    name="Custom render page",
    description="Custom render page",
    html="customrender.html",
    hidden=True,
)

plugin.addPage(customRenderPage)

# Setting type to NUMBER so that the output can be connected to 'Number' variables
customVariable = CustomVariable(
    id="custom_variable",
    name="Custom variable",
    description="Custom variable",
    customPage=customRenderPage,
    type=VariableTypes.NUMBER,
    category="Custom variables",
)
```

The variable renders as a **Configure** button that opens the specified `PluginPage`. For more information about `PluginPage`, refer to the Extensions section.

Inside the custom view, the variable and the flow can be accessed in JavaScript using the `window.horusVariable` object:

```javascript
// Get the current state of the variable which opened the custom view
const variable = window.horusVariable.getVariable();

// Set a new value for the variable
window.horusVariable.setVariable("new_value");

// Get the current state of the flow
const newFlow = window.horusVariable.getFlow();

// Modify and set a new value for the flow
newFlow.title = "New title";
window.horus.setFlow(newFlow);

// Obtain an updated value from the flow when it is modified
// Attach the listener to the PARENT window (extensions run inside iframes)
parent.addEventListener("flowChanged", (event) => {
    const flow = event.detail;
    console.log("Flow changed", flow);
});

// Execute the flow
await window.horus.executeFlow({
    placedID: 1,        // Mandatory: the ID of the block to be executed
    resetFlow: true,    // Optional: whether to reset the flow before executing
    continueSlurm: false, // Optional: whether to continue the Slurm execution
});
```

> **Warning:** The `window.horusVariable` object is only available inside the view of a `CustomVariable`. For the `flowChanged` event, attach the listener to the **parent** window, not the current one, since extensions run inside iframes and the event is only dispatched on the parent window.
