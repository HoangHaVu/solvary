// PROJECT: Voltify | PURPOSE: Gemeinsamer Landing-/Marketing-Header (Scroll-Shrink-Kapsel) — genutzt von LandingPage und PricingPage

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LOGO_PATH } from "../lib/branding";

export interface NavLink {
  label: string;
  /** In-Page-Anker (`/#services`) oder Route (`/preise`). */
  href: string;
}

function useNavLinks(): NavLink[] {
  const { t } = useTranslation();
  return [
    { label: t("nav.products"), href: "/produkte" },
    { label: t("nav.solutionCheck"), href: "/check" },
    { label: t("nav.pricing"), href: "/preise" },
  ];
}

/** In-Page-Anker (`/#…`) als natives `<a>` (weiches CSS-Scrollen), echte Routen als SPA-`<Link>`. */
function NavItem({
  link,
  className,
  onClick,
}: {
  link: NavLink;
  className?: string;
  onClick?: () => void;
}) {
  if (link.href.startsWith("/#")) {
    return (
      <a href={link.href} onClick={onClick} className={className}>
        {link.label}
      </a>
    );
  }
  return (
    <Link to={link.href} onClick={onClick} className={className}>
      {link.label}
    </Link>
  );
}

function LanguageSwitcher({ className, "data-testid": testId }: { className?: string; "data-testid"?: string }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const setLang = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className ?? ""}`} data-testid={testId}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("language.switch")}
        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors"
      >
        <Globe className="w-5 h-5 text-gray-600" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1">
          <button
            onClick={() => setLang("de")}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
              i18n.language === "de" ? "font-semibold text-brand-secondary" : "text-gray-600"
            }`}
          >
            {t("language.de")}
          </button>
          <button
            onClick={() => setLang("en")}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
              i18n.language === "en" ? "font-semibold text-brand-secondary" : "text-gray-600"
            }`}
          >
            {t("language.en")}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const navLinks = useNavLinks();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6">
        <div
          className="mx-auto flex items-center justify-between"
          style={{
            maxWidth: scrolled ? "760px" : "1120px",
            height: "64px",
            padding: "0 12px",
            borderRadius: "999px",
            backgroundColor: scrolled
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(255, 255, 255, 0.35)",
            border: scrolled
              ? "1px solid rgba(17, 17, 17, 0.06)"
              : "1px solid rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(12px)",
            boxShadow: scrolled
              ? "0 8px 24px rgba(17, 17, 17, 0.06)"
              : "0 4px 16px rgba(17, 17, 17, 0.04)",
            transition:
              "max-width 0.85s cubic-bezier(0.16, 1, 0.3, 1), " +
              "background-color 0.85s cubic-bezier(0.16, 1, 0.3, 1), " +
              "border-color 0.85s cubic-bezier(0.16, 1, 0.3, 1), " +
              "box-shadow 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={LOGO_PATH} alt="Solvary" className="h-7 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center"
            style={{
              gap: scrolled ? "20px" : "28px",
              transition: "gap 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {navLinks.map((l) => (
              <NavItem
                key={l.href}
                link={l}
                className="text-sm font-medium text-gray-600 hover:text-brand-secondary transition-colors"
              />
            ))}
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5 text-brand-secondary" />
            </button>
          </div>

          {/* CTA + Language */}
          <div className="hidden md:flex items-center gap-1">
            <LanguageSwitcher data-testid="language-switcher-desktop" />
            <button
              onClick={() => navigate("/beta")}
              className="inline-flex items-center bg-brand-secondary text-white text-sm font-bold px-5 py-3.5 rounded-full hover:bg-brand-secondary-hover transition-all"
            >
              {t("nav.cta")}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-white">
          <div className="flex justify-end p-6">
            <button onClick={() => setMobileOpen(false)}>
              <X className="w-6 h-6 text-black" />
            </button>
          </div>
          <nav className="flex flex-col items-center gap-6 pt-8">
            {navLinks.map((l) => (
              <NavItem
                key={l.href}
                link={l}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-medium text-brand-secondary"
              />
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/beta");
              }}
              className="mt-4 flex items-center bg-brand-primary text-brand-secondary text-sm font-bold px-6 py-3 rounded-full"
            >
              {t("nav.cta")}
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
