import type { Metadata } from "next";
import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Proyectos - Penguin AI",
  description: "Explora proyectos prácticos de IA y contribuye a la comunidad.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#020617',
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 