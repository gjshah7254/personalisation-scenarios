import type { Metadata } from "next";
import "./globals.css";
import { getUsers } from "@/lib/users";
import { UserSwitcher } from "@/app/components/UserSwitcher";
import { MobileNavLink } from "@/app/components/MobileNavLink";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js & Vercel Personalisation Scenarios",
  description: "Demo of 5 personalisation patterns with Next.js and Vercel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const users = getUsers();

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-lg font-semibold text-white">
                Personalisation Scenarios
              </Link>
              <MobileNavLink />
            </div>
            <UserSwitcher users={users} />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
