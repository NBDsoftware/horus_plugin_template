# Extensions — Templates & Snippets

## PluginPage + PluginEndpoint — minimal Flask endpoint

```python
from flask import request
from HorusAPI import Plugin, PluginPage, PluginEndpoint

plugin = Plugin()

results_page = PluginPage(
    id="resultsView",
    name="Results",
    description="View your results",
    html="index.html",
)

def handle_data():
    data = request.json
    if data is None:
        return {"ok": False, "msg": "No data provided."}
    print("Received:", data)
    return {"ok": True}

data_endpoint = PluginEndpoint(
    url="/submitData",
    methods=["POST"],
    function=handle_data,
)

results_page.addEndpoint(data_endpoint)   # attach endpoint to page via object
plugin.addPage(results_page)              # register page via object
```

## PluginPage — multiple pages sharing one React app (HashRouter)

```python
main_page = PluginPage(
    id="mainView",
    name="Main",
    description="Main plugin view",
    html="index.html",
    path="/#/main",
)

settings_page = PluginPage(
    id="settingsView",
    name="Settings",
    description="Plugin settings",
    html="index.html",
    path="/#/settings",
)

plugin.addPage(main_page)
plugin.addPage(settings_page)
```

## PluginPage — hidden page for CustomVariable renderer

```python
custom_renderer = PluginPage(
    id="customRenderer",
    name="Custom Renderer",
    description="Custom input configuration view",
    html="customrender.html",
    hidden=True,
)
plugin.addPage(custom_renderer)
```

## PluginPage — as block externalURL (documentation)

```python
docs_page = PluginPage(
    id="blockDocs",
    name="Block Documentation",
    description="Documentation for My Block",
    html="index.html",
)
plugin.addPage(docs_page)   # must add before using docs_page.id

my_block = PluginBlock(
    name="My Block",
    description="...",
    action=my_action,
    externalURL=f"/{docs_page.id}/index.html",  # derived from object
)
```

## Extensions class — open view from block action

```python
from HorusAPI import Extensions

def action(block: PluginBlock):
    result_data = {"scores": [1.2, 3.4, 5.6], "labels": ["A", "B", "C"]}

    # Open the extension view immediately and pass data
    Extensions().open(
        pluginID=plugin.id,
        pageID=results_page.id,   # derived from object
        data=result_data,
        title="View Scores",
    )

    # OR: store results for later (shows "View Scores" button on block)
    Extensions().storeExtensionResults(
        pluginID=plugin.id,
        pageID=results_page.id,
        data=result_data,
        title="View Scores",
    )
```

## Extensions class — built-in result viewers

```python
from HorusAPI import Extensions

def action(block: PluginBlock):
    # Display a file in the Horus File Editor
    Extensions().loadFile("/path/to/output.log", title="Job Log", readOnly=True)

    # Display an HTML report
    Extensions().loadHTML("/path/to/report.html", title="Report")

    # Display an image
    Extensions().loadImage("/path/to/figure.png", title="Figure")

    # Display a PDF
    Extensions().loadPDF("/path/to/report.pdf", title="PDF Report")

    # Display a CSV as a table
    Extensions().loadCSV("/path/to/results.csv", title="Results Table")

    # Display a CSV as a plot
    Extensions().loadPlot("/path/to/plot_data.csv", title="Plot")

    # Display plain text
    Extensions().loadText("Job completed successfully.", title="Status")
```

## JavaScript — compute correct API URL (HashRouter safe)

```javascript
export function getAPIUrl(endpoint) {
    // Strip the hash fragment — API calls go to the base URL only
    const base = window.location.href.split('#')[0];
    return endpoint ? `${base}${endpoint}` : base;
}

// Usage
fetch(getAPIUrl("/submitData"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: "value" }),
});
```

## JavaScript — read data injected from Extensions().open()

```javascript
// Data passed via Extensions().open(data={...}) is available on window
const data = window.extensionData;
console.log(data.scores);
```

## JavaScript — file picker

```javascript
// Basic — opens file picker, logs selected path
parent.horus.openExtensionFilePicker({
    onFileConfirm: (filePath) => {
        console.log("Selected:", filePath);
    },
});

// With extension filter
parent.horus.openExtensionFilePicker({
    allowedExtensions: ["pdb", "mol2", "sdf"],
    onFileConfirm: (filePath) => {
        sendPathToBackend(filePath);
    },
});

// Folder picker
parent.horus.openExtensionFilePicker({
    openFolder: true,
    onFileConfirm: (folderPath) => {
        console.log("Folder:", folderPath);
    },
});
```

## JavaScript — save a file from the extension

```javascript
// 'file' must be a File instance
const blob = new Blob(["file contents"], { type: "text/plain" });
const file = new File([blob], "output.txt");
parent.horus.saveFile(file);
```

## JavaScript — read a file from the server

```javascript
// Returns a Blob; use absolute paths
const blob = await parent.horus.getFile("/absolute/path/to/file.pdb");
const text = await blob.text();
console.log(text);
```

## JavaScript — open the Horus File Editor

```javascript
parent.horus.openFileInEditor({
    filePath: "/path/to/my/script.py",
    name: "My Script",  // optional tab label
    readOnly: false,
    format: "python",   // optional; inferred from extension if omitted
});
```

## JavaScript — manage tabs and panels

```javascript
// Rename/close the current tab
window.horus.setTabTitle("My Results");
window.horus.closeTab();

// Open built-in panels
window.horus.openPanel("molstar");
window.horus.openPanel("flow");
window.horus.openPanel("smiles");

// Open a custom extension panel
window.horus.openPanel("extensions", "panel_id_1", {
    name: "My Results",
    plugin: plugin.id,       // use the plugin ID
    id: results_page.id,     // use the page ID
    data: { key: "value" },
});

// Close a panel by its ID
window.horus.closePanel("panel_id_1");
```

## JavaScript — flow extra data

```javascript
// Store arbitrary data in the current flow
window.horus.setExtraData("my_key", { scores: [1, 2, 3] });

// Retrieve it
const stored = window.horus.getExtraData("my_key");
console.log(stored.scores);
```

## JavaScript — Mol* and SMILES from extension (guard first)

```javascript
if (window.molstar) {
    window.molstar.reset();
    window.molstar.loadMoleculeFile(file, { label: "myStructure" });
    window.molstar.listStructures();
    window.molstar.listChains("myStructure");
}

if (window.smiles) {
    const list = window.smiles.getSmilesList();
    window.smiles.loadSmilesString("CCO", { label: "Ethanol", group: "Solvents" });
}
```
