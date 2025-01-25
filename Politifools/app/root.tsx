import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "@mantine/core/styles.css";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import {
  AppShell,
  Burger,
  Button,
  Container,
  createTheme,
  Group,
  MantineProvider,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import SearchBar from "./components/SearchBar";

const theme = createTheme({
  primaryColor: "blue",
  primaryShade: 6,
  colors: {
    blue: [
      "#ffffff", // Very light blue/white
      "white",
      "#e9f1f7", // Lighter blue
      "#90caf9", // Light blue
      "#64b5f6", // Moderate blue
      "#42a5f5", // Main blue
      "#1e88e5", // Darker blue (primaryShade: 6)
      "#1565c0", // Much darker blue
      "#0d47a1", // Even darker blue
      "#002171", // Darkest blue
    ],
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <AppShell
            header={{ height: 60 }}
            navbar={{
              width: 300,
              breakpoint: "sm",
              collapsed: { desktop: true, mobile: !opened },
            }}
            footer={{ height: 60 }}
            bg="blue.1"
          >
            <AppShell.Header bg="blue.6">
              <Group h="100%" px="md">
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                  color="white"
                />
                <Group justify="space-between" style={{ flex: 1 }}>
                  {/* Logo/Title */}
                  <Text fw={700} size="lg" c="white">
                    <a
                      href="/"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      PolitiFools
                    </a>
                  </Text>

                  {/* Wider SearchBar */}
                  <div
                    style={{
                      flex: 1,
                      marginLeft: "2rem",
                      marginRight: "2rem",
                    }}
                  >
                    <SearchBar />
                  </div>

                  {/* Desktop Navigation Links */}
                  <Group ml="xl" gap="lg" visibleFrom="sm">
                    <a href="/account" style={{ textDecoration: "none" }}>
                      <Button size="sm" color="white" variant="outline">
                        Account
                      </Button>
                    </a>
                    <a
                      href="/browse"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      <Text fw={500} size="sm">
                        Browse
                      </Text>
                    </a>
                  </Group>
                </Group>
              </Group>
            </AppShell.Header>

            {/* Collapsible Navbar */}
            <AppShell.Navbar
              hidden={!opened}
              py="md"
              px={25}
              bg="blue.6"
              hiddenFrom="sm"
            >
              <Stack>
                {/* Account Section */}
                <a href="/account" style={{ textDecoration: "none" }}>
                  <Button size="sm" color="white" variant="outline">
                    Account
                  </Button>
                </a>

                {/* Browse Link */}
                <a
                  href="/browse"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <Text fw={500} size="sm">
                    Browse
                  </Text>
                </a>
              </Stack>
            </AppShell.Navbar>

            <AppShell.Main>
              <Container mt={25}>{children}</Container>
            </AppShell.Main>

            <AppShell.Footer>
              <Group justify="end" h="100%" p={10}>
                <a
                  href="/privacy"
                  style={{ color: "grey", textDecoration: "none" }}
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  style={{ color: "grey", textDecoration: "none" }}
                >
                  Terms
                </a>
              </Group>
            </AppShell.Footer>
          </AppShell>
        </MantineProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
