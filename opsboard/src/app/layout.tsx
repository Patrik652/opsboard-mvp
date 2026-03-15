import type { Metadata } from "next";
import { SessionProvider } from "@/features/session/SessionProvider";
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
      <body className="antialiased" suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
