import {
	createHashHistory,
	createRouter as createTanStackRouter,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function NotFound() {
	return <div>404 — Page not found</div>;
}
const history = createHashHistory();

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		history,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultNotFoundComponent: NotFound,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
