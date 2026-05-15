import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Hired. — Find work that excites you",
  description: "Browse thousands of verified roles. Apply in one click with AI-matched scores.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-1 flex flex-col pt-16">{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}



