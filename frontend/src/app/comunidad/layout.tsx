import type { Metadata } from "next";
import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Comunidad - Penguin AI",
  description: "Únete a nuestra comunidad de aprendizaje y colaboración.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#020617',
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 