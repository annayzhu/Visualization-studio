import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visualization Studio",
  description: "A browser-local, publication-ready scientific visualization workspace.",
  other: { google: "notranslate" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Studio translates interface labels itself; chart data and scientific terms must stay intact.
  return <html lang="en" translate="no" className="notranslate"><body>{children}</body></html>;
}
