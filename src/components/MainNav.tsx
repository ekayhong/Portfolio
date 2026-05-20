"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/content/profile";
import { usePathname } from "next/navigation";

type Props = {
  locale: Locale;
  labels: {
    portfolio: string;
    availability: string;
    privacy: string;
  };
};

export function MainNav({ locale, labels }: Props) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: labels.portfolio },
    { href: "/disponibilites", label: labels.availability },
    { href: "/privacy", label: labels.privacy },
  ];

  return (
    <header className="topbar">
      <nav className="container topbar__inner">
        <Link href="/" className="topbar__brand">Eric Kay Hong</Link>
        <LanguageSwitcher locale={locale} />
        <div className="topbar__links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`topbar__link${pathname === link.href ? " is-active" : ""}`}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
