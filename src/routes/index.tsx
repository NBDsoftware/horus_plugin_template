import { Center, Container, Stack, Text, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<Container size="lg" py={80} style={{ position: "relative" }}>
			<Center>
				<Stack gap={64}>
					{/* Header */}
					<Stack gap={16}>
						<Title order={1}>My Plugin</Title>
					</Stack>

					{/* Footer line */}
					<Text
						size="xs"
						style={{
							color: "#2a4a5a",
							fontFamily: "monospace",
							letterSpacing: "0.08em",
						}}
					>
						Nostrum Biodiscovery
					</Text>
				</Stack>
			</Center>
		</Container>
	);
}
