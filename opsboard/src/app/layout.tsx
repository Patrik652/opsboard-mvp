import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opsboard",
  description: "Operational command center MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
