import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Container } from "react-bootstrap";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Container>
          {children}
          <ScrollRestoration />
          <Scripts />
        </Container>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
