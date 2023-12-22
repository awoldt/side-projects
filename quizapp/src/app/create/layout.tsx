import NavBar from "@/components/NavBar";
import { ReactNode } from "react";

export const metadata = {
  title: "Create a Free Online Quiz",
  description:
    "Easily create a quiz to share with friends and family. Give your quiz a name, add multiple choice questions, and then share to the world.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <div className="content-container">{children}</div>
    </>
  );
}
