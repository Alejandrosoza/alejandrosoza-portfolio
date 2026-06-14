import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

const descriptions: Record<string, string> = {
  en: "Portfolio of Alejandro Soza, emerging film director based in Whitehorse, Yukon, Canada.",
  es: "Portafolio de Alejandro Soza, director de cine emergente radicado en Whitehorse, Yukón, Canadá.",
  fr: "Portfolio d'Alejandro Soza, réalisateur émergent basé à Whitehorse, au Yukon, Canada.",
};

const ogLocales: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_CA",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = descriptions[locale] ?? descriptions.en;

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://alejandrosoza.ca"
    ),
    title: {
      template: "%s | Alejandro Soza",
      default: "Alejandro Soza — Film Director",
    },
    description,
    openGraph: {
      type: "website",
      siteName: "Alejandro Soza",
      locale: ogLocales[locale] ?? ogLocales.en,
      title: "Alejandro Soza — Film Director",
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: "Alejandro Soza — Film Director",
      description,
    },
    alternates: {
      languages: {
        en: "/en",
        es: "/es",
        fr: "/fr",
        "x-default": "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
