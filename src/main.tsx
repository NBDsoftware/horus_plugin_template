import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { getRouter } from "./router";

const root = document.getElementById("root");

if (!root) {
	throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(<RouterProvider router={getRouter()} />);
