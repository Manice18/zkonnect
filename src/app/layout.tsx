import { Inter as FontSans } from "next/font/google";
import dynamic from "next/dynamic";

import { Toaster } from "sonner";

import { cn } from "@/lib/utils";
import { constructMetaData } from "@/lib/metadata";
import "./globals.css";

const WalletMultiButtonDynamic = dynamic(
  async () => await import("../contexts/WalletContextProvider"),
  { ssr: false },
);

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = constructMetaData();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <WalletMultiButtonDynamic>
          <Toaster position="bottom-center" richColors />
          {children}
        </WalletMultiButtonDynamic>
      </body>
    </html>
  );
}
