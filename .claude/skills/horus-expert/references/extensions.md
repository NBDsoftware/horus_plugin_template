# Extensions

## Building an extension view

Extensions are embedded views coded in HTML, CSS and JavaScript. They can be used to add new interfaces for interacting with the results of your blocks. Web files must be placed inside the `Pages` folder of your plugin:

```
MyPlugin
├── Include/
├── deps/
├── Pages/         # Put here all your web files
├── plugin.meta
└── main.py
```

This folder acts as the root of the web page.

### PluginPage

Extensions are built using the `PluginPage` class.

```python
class PluginPage(
    id: str,
    name: str,
    description: str,
    html: str,
    hidden: bool = False,
    path: str = '/',
)
```

Parameters:

- **id** – The ID of the page.
- **name** – The name of the page.
- **description** – A description of the page.
- **html** – The name of the HTML file (e.g. `"my_page.html"`). Must be located in the `Pages` folder.
- **hidden** – Whether the page should be hidden from the extension menu (default: `False`).
- **path** – The path to the page (default: `"/"`).

### PluginEndpoint

Web pages contact the server through requests using the `PluginEndpoint` class. Horus runs a background Flask server, so extensions can be treated as part of a Flask app. The correct request URL can be computed using `window.location`:

```javascript
const href = window.location.href;
const postTo = href + "customEndpoint";
```

```python
class PluginEndpoint(
    url: str,
    methods: List[str],
    function: Callable,
)
```

Parameters:

- **url** – The URL of the endpoint.
- **methods** – The HTTP methods of the endpoint.
- **function** – The function called when the endpoint is accessed.

## Adding views to your Plugin

```python
plugin.addPage(myCustomViewPage)
```

If the extension is correctly defined, it will appear in the Extensions menu.

## Example

```python
# Define a results page
myCustomViewPage = PluginPage(
    id="customView",
    name="Custom view",
    description="View your results in a custom way",
    html="index.html",
)

# Define the endpoint function
def customEndpointFunction():
    data = request.json
    if data is None:
        return {"ok": False, "msg": "No data provided."}
    print(data)
    return {"ok": True}

# Add the endpoint to the PluginPage
customEndpoint = PluginEndpoint(
    url="/customEndpoint",
    methods=["POST"],
    function=customEndpointFunction,
)

myCustomViewPage.addEndpoint(customEndpoint)
```

## Plugin Pages with React Router (HashRouter)

> **Note:** When embedding a React application using **react-router**, use **HashRouter** instead of `BrowserRouter`. This ensures the plugin works under the Horus URL structure, where pages are always served under `/plugins/pages/`.

**Why HashRouter?**

- **Problem:** With `BrowserRouter`, React expects full URL path control. Since Horus serves plugins under a nested path (e.g. `/plugins/pages/my_plugin/`), routing fails with 404 errors unless a server-side fallback is configured for every subpath.
- **Solution:** `HashRouter` relies only on the URL fragment (after `#`), which is never sent to the server. Horus only needs to serve the same `index.html` regardless of the client-side route.

### Defining multiple Plugin Pages

Multiple pages can share the same HTML file but expose different entry routes:

```python
main_plugin_page = PluginPage(
    id="my_plugin",
    name="Main Plugin Page",
    description="Main entry point for the plugin",
    html="index.html",
    path="/#/main",
)

settings_plugin_page = PluginPage(
    id="my_plugin_settings",
    name="Plugin Settings",
    description="Settings and configuration for the plugin",
    html="index.html",
    path="/#/settings",
)
```

### Accessing API Endpoints

API calls should be built from the URL **before** the `#`:

```javascript
export function getAPIUrl(endpoint?: string): string {
    const strippedLocation = window.location.href.split('#')[0];
    return endpoint ? `${strippedLocation}${endpoint}` : strippedLocation;
}

// Usage
fetch(getAPIUrl("/api/update"), {
    method: "POST",
    body: JSON.stringify(payload),
});
```

## Extensions class

Use the `Extensions` class to open an extension view directly from a Block action:

```python
from HorusAPI import Extensions

# Open the extensions view and pass data to it
Extensions().open(pluginID="mypluginid", pageID="customView", data={"someData": data})

# Store results in the block (shows an "Extensions" button in the block view)
Extensions().storeExtensionResults(
    pluginID="mypluginid",
    pageID="customView",
    data={"someData": data},
    title="View results"
)
```

Access the passed data in JavaScript:

```javascript
const data = window.extensionData;
console.log(data.someData);
```

## File Picker inside an Extension

Open the Horus File Picker from JavaScript:

```javascript
parent.horus.openExtensionFilePicker()

// With options
parent.horus.openExtensionFilePicker({
    onFileConfirm: (filePath) => {
        console.log("Selected:", filePath);
    },
    allowedExtensions: ["pdb", "mol2"],
    openFolder: false,  // Set true to select a folder
})
```

Options type:

```typescript
type options = {
    openFolder?: boolean;
    allowedExtensions?: string[];
    onFileSelect?: (filePath: string) => void;
    onFileConfirm?: (filePath: string) => void;
}
```

## Saving files within an Extension

```javascript
// 'file' is an instance of the File class
parent.horus.saveFile(file)
```

In server/webapp mode this downloads the file from the browser. In desktop mode it opens the OS file picker.

## Getting files within an Extension

```javascript
// Returns a promise of a Blob with the file contents.
// Use absolute paths; relative paths are resolved from Horus's working directory.
const blob = await parent.horus.getFile("/path/to/my/file")
```

Paths are sanitised by Horus; accessing files without permission throws an error.

## Opening the Horus File Editor

```javascript
parent.horus.openFileInEditor({
    filePath: "/path/to/my/file",
    name: "My File",     // Optional tab name
    readOnly: false,     // Optional, default false
    format: "text"       // Optional; inferred from extension if omitted
})
```

## Managing tabs, panes and views

```javascript
// Rename or close the current tab
window.horus.setTabTitle("Modified!")
window.horus.closeTab()

// Open a panel: "molstar", "flow", "smiles" or "extensions"
window.horus.openPanel("molstar")

// Open an extensions panel with a specific ID and parameters
window.horus.openPanel("extensions", "results_1", {
    name: "My cool results",
    plugin: "horus",
    id: "html_loader",
    data: {
        html: "Hello results!",
    },
})

// Close a panel by ID
window.horus.closePanel("results_1")
```

## Storing data in the flow

```javascript
// Store a value with a unique key
window.horus.setExtraData("my_key", "my_value")

// Retrieve it
const value = window.horus.getExtraData("my_key")
```

## Managing SMILES and Mol* from an Extension

The Mol* and SMILES instances are exposed on `window` inside extensions.

> **Warning:** Mol* and SMILES instances may not be available if the panels are not open. Always check for their existence: `if (window.molstar) { doSomething() }`.

```javascript
// --- Mol* ---
window.molstar.reset();
window.molstar.setBackground(hexColor);
window.molstar.focus(structureLabel?, residueNumber?, chain?, surroundRadius?);
window.molstar.loadMoleculeFile(file, options?);
window.molstar.loadTrajectory({ topology: File, trajectory: File, label? });
window.molstar.listStructures();
window.molstar.listHeteroAtoms(label?);
window.molstar.listHeteroRes(label?);
window.molstar.listStandardRes(label?);
window.molstar.listChains(label?);
window.molstar.addSphere(position, radius, opacity?, color?);
window.molstar.addBox(position, radiusScale, radialSegments, opacity?, color?);

// --- SMILES ---
window.smiles.getSmilesList();
window.smiles.setSmilesList(newSmilesList);
window.smiles.reset();
window.smiles.loadFiles(file);
window.smiles.loadSmilesString(smiles, options?);
```

## Using an extension as a block's external URL

```python
plugin = Plugin()

docs = PluginPage(
    id="docs",
    name="Documentation",
    description="Documentation for my plugin",
    html="index.html",
)

# IMPORTANT: add the page before using its ID
plugin.addPage(docs)

my_block = PluginBlock(
    id="my_block",
    name="My Block",
    description="A block that uses the documentation page",
    externalURL=f"/{docs.id}/my_block_docs/index.html"
)
```
