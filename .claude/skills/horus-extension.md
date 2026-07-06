# Horus Plugin Extension Development

Use this skill whenever you are asked to add a new view (page, extension, or feature) to the `nostrum_suite_pro` Horus plugin.

---

## Architecture Overview

All views — whether block-launched or visible in the Extensions panel sidebar — use the **shared `index.html`** entry point and a `<Route>` in the `NBDRouter`. There is no dedicated per-page HTML file.

- `PluginPage(html="index.html", path="/#/my-view")`
- The component is a `<Route>` inside the shared `HashRouter` in `src/index.html`
- Set `hidden=True` if the page should NOT appear in the Extensions panel list; omit it (or set `hidden=False`) if it should be visible there
- **Horus path bug:** When Horus opens an Extensions-panel view from its Home page, it sometimes does not propagate the hash path to the iframe. `NBDRouter` already contains a `useEffect` workaround that reads `parent.location.href` to extract and navigate to the correct hash route — this applies to all routes automatically, no extra work needed.

```
src/
  index.html              ← single shared HTML entry point for all views
  Common/
    main.tsx              ← JS entry for index.html
    App.tsx               ← HashRouter + MantineProvider + NBDRouter
    Router/router.tsx     ← ROUTES const + NBDRouter <Routes> tree
```

---

## Adding a New View

### 1. Register the route in `router.tsx`

```tsx
export const ROUTES = {
  // … existing routes …
  MY_VIEW: "/my-view",
} as const;

export function NBDRouter() {
  // … existing useEffect workaround stays untouched …
  return (
    <Routes>
      {/* … existing routes … */}
      <Route path={ROUTES.MY_VIEW} element={<MyViewComponent />} />
    </Routes>
  );
}
```

### 2. Add a dev-mode navigation button in `App.tsx`

```tsx
// src/Common/App.tsx  — inside DevRouterMenu
<Button size="xs" onClick={() => navigate("/my-view")}>My View</Button>
```

### 3. Register the Horus page (Python)

```python
my_view_page = PluginPage(
    id="myview",
    name="My View Name",
    description="…",
    html="index.html",
    path="/#/my-view",    # matches ROUTES.MY_VIEW
    # hidden=True if the page should not appear in the Extensions panel
)
```

---

## Registering in `plugin.py`

```python
from Pages.my_view_endpoints import my_view_page
plugin.addPage(my_view_page)
```

---

## Vite Dev Server Proxy

Each page ID needs a proxy entry so the dev server can reach its endpoints:

```js
// vite.config.mjs  — inside server.proxy
"/myview": {
  target: `http://127.0.0.1:${process.env.HORUS_PORT ?? 3000}/plugins/pages/nostrum_suite_pro.myview`,
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/myview/, "/api/"),
},
```

> **Why:** `getApiPath` in dev mode does not append the `pageID` when the URL has no dot, so all requests land on `/api/…`. Each page that needs its own endpoint must add a proxy entry.

---

## Calling Backend Endpoints from the Frontend

```tsx
import { getApiPath, postData } from "@/Common/utils";

const url = getApiPath("/api/myEndpoint", { pageID: "myview" });
const response = await postData(url, { key: "value" });
```

---

## Mol* Atom Selection (Selection Mode)

Follow the exact pattern from `src/NostrumInputs/Components/MetricsConstraints/`:

**Key rule:** `selectionMode`, `granularity`, and the event listener must all be set/registered inside **the same `useEffect`** that depends on `[isSelecting]`. Never set `selectionMode` inside an async function after an `await` — Mol* state set after async continuations does not persist reliably.

```tsx
const [isSelecting, setIsSelecting] = useState(false);

useEffect(() => {
  if (isSelecting) parent.horus?.openPanel("molstar");

  const molstar = (parent as any).molstar;
  if (!molstar?.plugin) return;

  molstar.plugin.selectionMode = isSelecting;

  if (!isSelecting) {
    molstar.plugin.managers.interactivity.lociSelects.deselectAll();
    molstar.plugin.managers.interactivity.setProps({ granularity: "residue" });
    return;
  }

  molstar.plugin.managers.interactivity.setProps({ granularity: "element" });

  const handler = (e: Event) => {
    const atom = (e as CustomEvent).detail?.atom;
    if (!atom) return;
    molstar.plugin.managers.interactivity.lociSelects.deselectAll();
    // … record the atom …
  };

  parent.addEventListener("molstar-coordinates", handler);
  return () => parent.removeEventListener("molstar-coordinates", handler);
}, [isSelecting]);

async function toggleSelecting() {
  if (isSelecting) {
    setIsSelecting(false);
    return;
  }
  // … optional async work (e.g. load structure) …
  setIsSelecting(true);
}
```

**Event payload** (`e.detail.atom`):
```ts
{
  auth_atom_id: string;   // PDB atom name, e.g. "CA"
  auth_comp_id: string;   // residue name, e.g. "ALA"
  chainID: string;
  residue: number;
  atom_index: number;     // 0-based, matches mdtraj atom indices
  x: number; y: number; z: number;
}
```

---

## Component & Style Conventions

- Use **Mantine** components — already configured via `MantineProvider`
- Use **Tailwind** utility classes for layout
- `base.css` (Poppins font, CSS custom properties, `.floating-div`, `.blurred-squared-div`) must be linked in the HTML `<head>` — do NOT import it in JS
- For loading states, copy the `IconLoader2 animate-spin` pattern; for errors use `text-xs text-red-500`

---

## No `sys.path` manipulation in endpoint functions

Horus automatically sets `sys.path` when running a page endpoint. Never add `_add_deps_to_path()` or manual `sys.path.insert()` calls inside endpoint functions.

---

## Checklist

- [ ] Add `ROUTES.MY_VIEW` constant and `<Route>` in `router.tsx`
- [ ] Add dev navigation button in `App.tsx > DevRouterMenu`
- [ ] Create `src/MyView/` component tree
- [ ] Create endpoint file with `PluginPage(html="index.html", path="/#/my-view")` — add `hidden=True` only if it should not appear in the Extensions panel
- [ ] Register `plugin.addPage(my_view_page)` in `plugin.py`
- [ ] Add proxy entry in `vite.config.mjs`
- [ ] Use `getApiPath("/api/…", { pageID: "myview" })` for all fetch calls
