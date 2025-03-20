import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Raptor AI",
  description: "Goto project management app for developers",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <Toaster richColors />
          <SessionProvider>
            <TooltipProvider>
            {children}
            </TooltipProvider>
            </SessionProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
