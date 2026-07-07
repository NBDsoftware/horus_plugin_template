# Flows — Templates & Snippets

## Predefined flows folder structure

```
MyPlugin/
├── Flows/
│   ├── my_workflow.json        # predefined flow — appears in GUI
│   └── another_workflow.json
├── plugin.meta
└── main.py
```

Horus scans the `Flows/` folder at plugin load time and lists every `.json` file as a predefined flow in the GUI. No additional code registration is needed.
