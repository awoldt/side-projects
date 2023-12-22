import NavBar from "@/components/NavBar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <div className="content-container">{children}</div>
    </>
  );
}
