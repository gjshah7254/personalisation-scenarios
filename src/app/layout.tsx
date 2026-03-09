import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { HeaderFallback } from "@/app/components/HeaderFallback";
import { HeaderWithUsers } from "@/app/components/HeaderWithUsers";

export const metadata: Metadata = {
  title: "Next.js & Vercel Personalisation Scenarios",
  description: "Demo of 5 personalisation patterns with Next.js and Vercel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
          <Suspense fallback={<HeaderFallback />}>
            <HeaderWithUsers />
          </Suspense>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
