import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";

// Editorial serif display face — carries the brand voice (variable: full range).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
// Humanist grotesque — calm, legible UI body.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});
// Mono — amounts, addresses, ciphertext.
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
      className={`${fraunces.variable} ${hanken.variable} ${jbmono.variable}`}
    >
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <Providers>
          <TooltipProvider delayDuration={150} skipDelayDuration={300}>
            <Header />
            {/* Flex wrapper pins the footer to the bottom on short pages. */}
            <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
