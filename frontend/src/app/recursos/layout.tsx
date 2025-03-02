import type { Metadata } from "next";
import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Recursos - Penguin AI",
  description: "Accede a recursos educativos y herramientas para tu aprendizaje.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#020617',
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 