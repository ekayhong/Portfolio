import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, Newsreader } from "next/font/google";
import "./_init"; // Initialize shutdown handlers
import "./globals.css";
import { MainNav } from "@/components/MainNav";
import { resolveLocale, siteContent } from "@/content/siteContent";
import { ContactBar } from "@/components/ContactBar";

const editorialFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-display-font",
});

const modernFont = Inter({
  subsets: ["latin"],
  variable: "--font-body-font",
});

const BASE_URL = "https://www.kayhong.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Eric Kay Hong — Développeur .NET Senior & Tech Lead",
    template: "%s | Eric Kay Hong",
  },
  description:
    "Portfolio d'Eric Kay Hong, développeur .NET Senior avec 23+ ans d'expérience. Spécialisé C#, ASP.NET Core, Azure, DDD. Disponible à Monaco, Nice et en remote.",
  keywords: [
    "développeur .NET",
    "Tech Lead",
    "C#",
    "ASP.NET Core",
    "Azure",
    "freelance Monaco",
    "freelance Nice",
    "DDD",
    "senior developer",
  ],
  authors: [{ name: "Eric Kay Hong", url: BASE_URL }],
  creator: "Eric Kay Hong",
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Eric Kay Hong",
    title: "Eric Kay Hong — Développeur .NET Senior & Tech Lead",
    description:
      "23+ ans d'expérience en développement .NET, architecture et Tech Lead. Disponible à Monaco, Nice et en remote.",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eric Kay Hong — Développeur .NET Senior & Tech Lead",
    description:
      "23+ ans d'expérience en développement .NET, architecture et Tech Lead. Disponible à Monaco, Nice et en remote.",
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = resolveLocale((await cookies()).get("locale")?.value);
  const copy = siteContent[locale];

  return (
    <html lang={locale}>
      <body
        className={`${editorialFont.variable} ${modernFont.variable}`}
      >
        <MainNav
          locale={locale}
          labels={{
            portfolio: copy.nav.portfolio,
            availability: copy.nav.availability,
            privacy: copy.nav.privacy,
          }}
        />
        <main>{children}</main>
        <ContactBar locale={locale} />
      </body>
    </html>
  );
}
