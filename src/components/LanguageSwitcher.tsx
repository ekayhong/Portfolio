"use client";

type Props = {
  locale: "fr" | "en";
};

export function LanguageSwitcher({ locale }: Props) {
  const next = locale === "fr" ? "en" : "fr";

  const updateLocale = () => {
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={updateLocale}
      title={next === "en" ? "Switch to English" : "Passer en français"}
      aria-label={next === "en" ? "Switch to English" : "Passer en français"}
    >
      <span className={locale === "fr" ? "lang-toggle__item is-active" : "lang-toggle__item"}>FR</span>
      <span className="lang-toggle__sep" />
      <span className={locale === "en" ? "lang-toggle__item is-active" : "lang-toggle__item"}>EN</span>
    </button>
  );
}
