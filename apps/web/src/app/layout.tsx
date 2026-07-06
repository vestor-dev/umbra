import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";
import { AppShell } from "@/components/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Umbra — confidential tokens, out of the shadows",
  description:
    "Browse every ERC-20 ↔ ERC-7984 pair in the Zama Wrappers Registry, then wrap, unwrap, send, and decrypt confidential balances on Sepolia.",
  icons: { icon: "/umbra-mark.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <Providers>
          <TooltipProvider delayDuration={150} skipDelayDuration={300}>
            <AppShell>{children}</AppShell>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
