import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import { enUS, ruRU } from "@clerk/localizations";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

// Space Grotesk has no Cyrillic glyphs — globals.css falls back to Geist for them.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, tFooter, tGuide] = await Promise.all([
    getLocale(),
    getTranslations("Footer"),
    getTranslations("Guide"),
  ]);

  return (
    <ClerkProvider localization={locale === "ru" ? ruRU : enUS}>
      <html
        lang={locale}
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <NextIntlClientProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <footer className="mt-16 border-t">
              <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-6 text-sm text-muted-foreground">
                <span>{tFooter("tagline")}</span>
                <Link href="/guide" className="hover:text-foreground hover:underline">
                  {tGuide("title")}
                </Link>
              </div>
            </footer>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
