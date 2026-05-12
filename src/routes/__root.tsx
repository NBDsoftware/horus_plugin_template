import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../styles.css";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<MantineProvider>
			<Outlet />
			<TanStackRouterDevtools />
		</MantineProvider>
	);
}
