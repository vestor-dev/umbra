import type { Metadata } from "next";
import { Instrument_Serif, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppShell } from "@/components/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";

// High-contrast editorial serif — the display voice.
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
// Humanist grotesque — UI body.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});
// Mono — labels, amounts, addresses, ciphertext.
const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${instrument.variable} ${hanken.variable} ${jbmono.variable}`}
    >
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
