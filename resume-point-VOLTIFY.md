# Voltify — Resume Point

<!-- Zuletzt aktualisiert: 2026-09-04 — Auth & Konfiguratoren vollständig übersetzt -->

## Status: MVP-INFRASTRUKTUR KOMPLETT ✅

## Session 2026-09-04 — Auth & Konfiguratoren auf EN übersetzt

- **Ziel:** Beim Sprachwechsel über die Navbar sollen Solar-Konfigurator, Angebots-Demo-Konfigurator, Login und Sign-Up ebenfalls auf Englisch wechseln.
- **Login:** `src/pages/Login.tsx` komplett auf `useTranslation`/`login`-Namespace umgestellt (Hero, Formular, Quick-Login, Test-Accounts).
- **Register:** `src/pages/Register.tsx` finalisiert und vollständig übersetzt (`register`-Namespace).
- **Angebots-Demo-Konfigurator:** `src/pages/OfferDemoPage.tsx` komplett auf `useTranslation`/`offerDemo`-Namespace umgestellt (Teaser, Builder, Positionen, Rabatt, Textbausteine, PDF, Sende-Flow, CTA).
- **Solar-Konfigurator:** `src/pages/Configurator.tsx` und alle Schritt-Komponenten in `src/sections/configurator/*.tsx` auf `useTranslation`/`configurator`-Namespace umgestellt (Steps 0–9, Förderungen, Wirtschaftlichkeitsanalyse, Kontakt, Thank-You).
- **Übersetzungsdateien:** `src/i18n/locales/de.json` + `en.json` um Namespaces `login`, `register`, `offerDemo` und `configurator` ergänzt (inkl. Grant-Übersetzungen und Array-Daten).
- **Qualität:** `npm run build` 0 TS-Fehler ✅ · 116/122 Tests grün. Die 6 roten Tests bleiben `tests/contexts/AuthContext.test.tsx` (`emitAuth` Mock-Problem, vorbestehend).

## Session 2026-09-03/04 — Navbar Sprachswitcher DE/EN + komplette Marketing-Übersetzung

- **i18n-Infrastruktur:** `i18next` + `react-i18next` + `i18next-browser-languagedetector` installiert. `src/i18n/index.ts` mit `de`/`en` Ressourcen, Fallback `de`, Speicherung in `localStorage`.
- **`src/sections/SiteHeader.tsx`:** Nav-Links und CTA über `useTranslation`. Neben dem CTA-Button neuer `LanguageSwitcher` mit `Globe`-Icon — Dropdown `Deutsch` / `English`, sofortiger Sprachwechsel. Auch im Mobile-Menü verfügbar.
- **Marketing-Seiten komplett übersetzt:** LandingPage, PricingPage, ProductsPage, BetaSignupPage, SolutionCheck, DemoPage (`src/sections/demo/*`), DemoBanner sowie geteilte Sektionen FeaturesSection, StatsBentoSection, MilestonesSection, PricingSection, PricingTiers, FaqSection, CtaFooterSection, ProductsStackSection. Daten-Dateien `src/lib/pricingData.ts` und `src/lib/solutionCheck.ts` in übersetzte Hooks (`useSaasTiers`, `useAgencyTiers`, `useIdentityQuestion`, `useInstallerQuestions`, etc.) überführt.
- **Auth-Bereich begonnen:** `src/pages/Register.tsx` vollständig auf `useTranslation`/`register`-Namespace umgestellt.
- **Übersetzungsdateien:** `src/i18n/locales/de.json` + `en.json` mit Namespaces `nav`, `language`, `landing`, `sections.*`, `pricingPage`, `productsPage`, `pricingData`, `betaPage`, `check`, `solutionCheckData`, `demoPage` (Ergänzungen für `register` separat dokumentiert).
- **Tests:** `tests/setup.ts` setzt Testsprache auf `de` (bestehende deutsche Assertions bleiben stabil). Veralteter FAQ-Test `Was kostet Voltify?` → `Was kostet Solvary?` korrigiert. Neue `tests/sections/SiteHeader.test.tsx` (2 Tests: Rendering DE + Sprachwechsel EN).
- **Qualität:** `npm run build` 0 TS-Fehler ✅ · 116/122 Tests grün. Die 6 roten Tests sind weiterhin `tests/contexts/AuthContext.test.tsx` (`emitAuth` Mock-Problem, vorbestehend).

## Session 2026-09-02 (Teil 3 — Angebotskonfigurator Demo-Flow)

- **Neue öffentliche Route `/angebot-demo`** (`src/App.tsx`, ohne `ProtectedRoute`, neben `/konfigurator`).
- **Kopf:** eigene sticky Top-Bar (`bg-white/90 backdrop-blur`, Solvary-Logo links → `/`, `PillButton` „Für mein Geschäft holen" → `/beta`) statt `DemoBanner`. Der „Demo-Modus …"-Satz steht jetzt mit `Eye`-Icon rechts neben dem `SectionTag` im Teaser.
- **`src/pages/OfferDemoPage.tsx`** (neu, ~900 Z.) — voll editierbarer, backend-freier Nachbau von `OfferBuilderPage.tsx` + dem `vorlagen`-Tab aus `AdminSettings.tsx`. **Helles Styling analog Solar-Konfigurator** (`bg-brand-bg-alt`, weisse Karten `border-gray-200`, `text-brand-secondary`, gelbe Akzent-Buttons, dunkle CTA-Buttons; `INPUT`-Konstante als geteiltes helles Feld-Styling). Aufbau: `DemoBanner` → Teaser-Kopf (`SectionTag`, 4-Schritt-Prozessleiste Lead-Daten → Positionen & Preise → Rabatt & Textbausteine → PDF & E-Mail, Feature-Chips) → Builder (Positionen add/edit/delete/drag, Rabatt-Code SOLAR5/SOLAR10/NEUKUNDE + manueller Rabatt, ROI-Impact-Panel, `PDFDownloadLink` mit echtem `OfferPdfDocument`, simulierter Sende-Dialog mit interpoliertem Betreff/Text → Status „Versendet") → aufklappbares Textbausteine-Panel (Anschreiben/Zahlungsbedingungen/Folgekosten/Schlusstext + E-Mail-Vorlage, fließt live ins PDF) → Abschluss-CTA `/beta`.
- **State:** ein `useReducer` (`lineItems`, `discount*`, `textTemplate`, `emailTemplate`, `status`), Mock-Lead „Familie Berger, 9,8 kWp", Mock-Company „Solar Muster GmbH". Domänen-Logik wiederverwendet aus `src/services/offers.ts` (`buildDefaultLineItems`, `generateOfferNumber`, `CATEGORY_LABELS`, `interpolateTemplate`, Default-Templates) — nichts neu gebaut. `OfferBuilderPage.tsx` **nicht angefasst** (Ladehänger-Thema bleibt separat).
- **`src/sections/ProductsStackSection.tsx`** — Kachel „Angebotskonfigurator": Link `/login` → `/angebot-demo`, Label „Im Demo-Account ansehen" → „Jetzt live testen".
- **Qualität:** `npm run build` 0 TS-Fehler ✅ · `tests/lib/offers.test.ts` + `tests/pages/LandingPage.test.tsx` 16/16 ✅ · Browser-Smoke auf :3000 (Positionen, Rabatt+ROI-Recalc, Templates-Panel, PDF-Blob, Sende-Flow → „Versendet", Kachel-Navigation) alles grün, Konsole fehlerfrei.

## Session 2026-09-03 (Teil 2) — Go-Live-Vorbereitung solvary.de + Push

- **Commit `6448de2` → `origin/main` gepusht** (137 Dateien, ~9.6k Insertions). Vercel Git-Integration deployt `main` automatisch → `voltify-app.vercel.app` ist mit dem neuen Stand live (verifiziert: neue `index.html` + `/agb` HTTP 200).
- **Rebrand-Anzeige-Strings** (keine Identifier): `SEO.tsx` SITE_NAME/SITE_URL → Solvary / `https://solvary.de`, JSON-LD bereinigt (fiktive Telefonnr./LinkedIn raus). `index.html` Titel+Description, `lang=de`. `FaqSection`, `DemoBanner`-Default, `useTenantBranding` VOLTIFY_DEFAULTS.firmenname, `Step8_Contact`/`Step7_Analysis`/`OfferPreviewCard`-Defaults, komplette Demo-Website `src/sections/demo/*` (inkl. `© 2026 Solvary`, `kontakt@solvary.de`/`info@solvary.de`).
- **Edge Functions**: Absendername `Voltify <noreply@vu-studio.de>` → `Solvary <…>`, Links `voltify.de`/`voltify-app.vercel.app` → `solvary.de`, `kontakt@voltify.de` → `kontakt@solvary.de`. **NOCH NICHT DEPLOYT** — `supabase functions deploy` nötig (siehe unten).
- **NICHT geändert (Identifier, Verträge nach außen):** `voltify_settings_v1` (localStorage), `voltify:resize` (postMessage), `X-Voltify-Signature` + `User-Agent: Voltify-Webhook/1.0` (forward-lead). → Rebrand-Plan Phase 2 in `tasks-VOLTIFY.md`.
- **`.gitignore`** ergänzt: `.playwright-mcp/`, `.serena/`, `.kimi-code/`, `/*.png`, `/Berechnungsnachweis-Demo.pdf`.

### OFFENE Go-Live-Schritte für solvary.de (manuell — Reihenfolge einhalten)

1. **Vercel → Project `voltify-app` → Settings → Domains:** `solvary.de` + `www.solvary.de` hinzufügen. Vercel zeigt die nötigen DNS-Records.
2. **IONOS DNS (NICHT Nameserver wechseln — sonst brechen die Google-Workspace-MX-Records!):** nur die Records für Vercel setzen:
   - Apex `solvary.de` → **A** `76.76.21.21`
   - `www` → **CNAME** `cname.vercel-dns.com`
   - MX/SPF/DKIM für Google Workspace bleiben unangetastet.
3. Auf Domain-Verification + automatisches SSL in Vercel warten. `www` → Redirect auf Apex (oder umgekehrt) in Vercel einstellen.
4. **Supabase → Authentication → URL Configuration:** Site URL auf `https://solvary.de`, Redirect-Allow-List um `https://solvary.de/**` erweitern (sonst brechen Bestätigungs-/Reset-Mails).
5. **Google Cloud Console → APIs → Credentials → Maps-API-Key → Application restrictions (HTTP referrers):** `https://solvary.de/*` und `https://*.solvary.de/*` ergänzen (sonst ist die Karte im InstallerPlanner tot). Alten `voltify-app.vercel.app`-Eintrag vorerst lassen.
6. **Supabase Edge Functions neu deployen** (Absendernamen/Links): `supabase functions deploy --project-ref ecsqbsgbfmvqaqnryvwf` (alle) — betrifft send-offer, notify-signature, notify-beta, notify-partner, notify-agency, notify-payment-due, notify-offer-expiry, partner-respond.
7. **Vercel Env-Var** `APP_URL` (falls gesetzt) auf `https://solvary.de` prüfen; sonst nutzt `partner-respond` den neuen Fallback im Code.
8. **Optional (branded Absender):** eigene Domain `solvary.de` bzw. `send.solvary.de` in **Resend** verifizieren (DKIM/Return-Path als CNAME bei IONOS), dann in den Edge Functions `noreply@vu-studio.de` → `noreply@solvary.de`. Bis dahin läuft der Versand weiter über die verifizierte `vu-studio.de`.
9. Nach Domain-Live: `git grep` auf Rest-`voltify` im UI (z. B. FAQ-Preis „149 €/Monat" ist noch **nicht** freigegeben zu ändern — widerspricht 179/379/799).

### Rollback

Vercel → Deployments → vorheriges Prod-Deployment (`9197864`) → „Promote to Production".

### Naming (Stand 2026-09-03)

- **GitHub-Repo umbenannt:** `HoangHaVu/voltify` → **`HoangHaVu/solvary`** (`gh repo rename`). Lokales `origin` automatisch aktualisiert, alte URL 301-Redirect aktiv. Keine Repo-URL-Referenzen im Code.
- **Vercel-Projekt:** vom User umbenannt (`voltify-app` → solvary). Lokale `.vercel/project.json` hat noch `"projectName":"voltify-app"` gecacht — egal, `projectId` stabil; re-synct beim nächsten `vercel`-Befehl. `Vercel → Settings → Git` kurz prüfen, dass es auf `HoangHaVu/solvary` zeigt.
- **Supabase-Projekt** (`Solar Konfigurator` → `Solvary`): **nur im Dashboard** (Settings → General → Project name) — keine MCP/API-Unterstützung. Ref `ecsqbsgbfmvqaqnryvwf` + URL bleiben, reines Label.
- **Lokaler Ordner** `~/myprojects/Voltify` → `~/myprojects/Solvary`: weiterhin offen, separater Schritt (`tasks-VOLTIFY.md:52`).
- **www.solvary.de**: funktioniert (User hat www als connected domain + Redirect ergänzt).
- **Favicon** (Commit `9457dab`): `public/favicon.{ico,png}`, `favicon-{16,32}x32.png`, `apple-touch-icon.png` (Solvary-S-Mark aus `~/Documents/Vu Studio/Projects/Solvary/Logo/Logo Icon.png`, transparenter Hintergrund), `<link>`-Tags + `<meta name="theme-color" content="#FAEE00">` in `index.html`. Live auf `solvary.de` verifiziert (korrekte content-types).

## Session 2026-09-03 — AGB hell + Firmierung

- **`src/pages/AGB.tsx`** von Dark-Theme (`bg-brand-secondary-hover`) auf hell umgestellt — gleiches Muster wie `Impressum.tsx` / `Datenschutz.tsx` (`bg-white`, „RECHTLICHES"-Badge, `text-brand-secondary`-Headings, `text-gray-600` Fließtext, Kontakt-Box `bg-gray-50 border-gray-200`, Links dunkel mit gelbem Underline-Akzent).
- **Firmierung:** alle „Voltify" / „Voltify GmbH" → **„Solvary"** (Einzelunternehmen, keine GmbH). Kontakt-Box: „Solvary · Einzelunternehmen". `kontakt@voltify.de`→`kontakt@solvary.de`, `voltify.de`→`solvary.de`. § 10 Gerichtsstand: „Sitz von Voltify GmbH" → „Geschäftssitz des Betreibers von Solvary". Stand: September 2026. Footer „© 2026 Solvary".
- **`src/pages/Impressum.tsx` + `src/pages/Datenschutz.tsx`** (und AGB-Kontaktbox) auf Solvary umgestellt:
  - Betreiber / Verantwortlicher: **Solvary · Van Anh Kasem · Auf dem Gleichen 18 · 65934 Frankfurt am Main**. Kein „Einzelunternehmen"-Label (Gewerbe noch nicht angemeldet — bewusst nur die natürliche Person genannt, das ist die korrekte Minimalform nach § 5 DDG). „Verantwortlich für den Inhalt" (Impressum) = „Van Anh Kasem" + Adresse.
  - **Einheitliche E-Mail überall: `kontakt@solvary.de`** (auch im Datenschutz statt eigener `datenschutz@`-Adresse — auf User-Wunsch). Footer alle „© 2026 Solvary".
  - Impressum: fiktive Daten raus (HRB/Registergericht, USt-ID `DE123456789`, „Max Mustermann/Geschäftsführer", e-recht24-Quelle-Zeile). Paragraphen aktualisiert: § 5 TMG → **§ 5 DDG**, § 55 Abs. 2 RStV → **§ 18 Abs. 2 MStV**, § 7/§§ 8–10 TMG → DDG.
  - Datenschutz § 8: Aufsichtsbehörde Bayern (BayLDA/Ansbach) → **Hessen (Der Hessische Beauftragte für Datenschutz und Informationsfreiheit, Postfach 3163, 65021 Wiesbaden, datenschutz.hessen.de)**. Stand → September 2026.
  - Link-Styling in beiden auf das lesbare AGB-Muster gebracht (dunkler Text + gelber Underline statt `text-brand-primary`).
- **Noch nicht geliefert für Impressum/Datenschutz:** USt-IdNr. (aktuell weggelassen, da „sofern vorhanden"), Telefonnummer. **Gewerbeanmeldung steht noch aus** — sobald angemeldet ggf. „Einzelunternehmen"/Rechtsform + USt-ID nachtragen.
- **Restlicher Rebrand** (Footer/SEO/E-Mail-Templates/`useTenantBranding` etc.) weiterhin offen — Rebrand-Plan Phase 1 in `tasks-VOLTIFY.md`.
- **`src/sections/CtaFooterSection.tsx`** — CTA-`PillButton` (`Jetzt Beta-Partner werden`) hatte ein `icon={<ArrowRight …>}`-Override → statischer Pfeil ohne Hover-Rotation, anders als der Hero-Button. `icon`-Prop + `ArrowRight`-Import entfernt → nutzt jetzt den Default-`ArrowUpRight` mit `group-hover:rotate-45`, identisches Hover-Verhalten wie Hero (Farb-Sweep + Pfeil-Rotation). Nur der `variant` (primary=gelb vs. Hero white) bleibt bewusst unterschiedlich. Wirkt auch auf `PricingPage` (nutzt dieselbe Sektion).

### Nächster Schritt

- App-/Auth-Bereiche übersetzen (Login ✅ erledigt, Register ✅ erledigt, Konfigurator-Steps ✅ erledigt, Angebots-Demo ✅ erledigt; offen: Dashboard, Admin/Agentur-Seiten, AGB/Impressum/Datenschutz) — falls EN-Modus dort ebenfalls gewünscht ist.
- Optional: gemeinsame Präsentations-Komponenten (`OfferPositionsTable`, `OfferSummaryPanel`) aus `OfferBuilderPage` + `OfferDemoPage` extrahieren, um die ~250 Z. duplizierte Tabellen-JSX zu vereinen.
- Separat offen: gemeldeter Ladehänger auf `/lead/:id/offer` beim echten Inhaber-Account (mit `inhaber@test.de` nicht reproduzierbar → account-/datenspezifisch; Konsolen-`FrameDoesNotExistError` sind Browser-Extension-Rauschen, nicht die App).

## Session 2026-09-01 (Teil 3 — LandingPage: Onboarding-Prozess, FAQ, Footer)

- **Prozess-Sektion umgedeutet** — `MilestonesSection` in `LandingPage.tsx` mit neuem Daten-Array `journey` (war `steps`): Tag „Und was jetzt?", Heading „In wenigen Tagen / auf deiner Webseite", 5 Schritte (Kontakt → Demo & Beratung → Module wählen → Integration in die Webseite → Live). Beschreibt jetzt die B2B-Kaufreise des Solarteurs statt des Endkunden-Konfigurators.
- **Neue FAQ-Sektion** — `src/sections/FaqSection.tsx`, weisser Hintergrund, `id="faq"`, 2-Spalten-Accordion (8 B2B-Fragen), Plus-Icon rotiert zu ×, `grid-template-rows`-Transition. In `LandingPage` nach dem Prozess eingebunden. Nav-Link „FAQ" ergänzt.
- **CTA + Footer zusammengelegt** — eine `<section>` mit gemeinsamem `hero-island.jpg`-Hintergrund (nur oben ein Weiss-Fade, keine Vollflächen-Maske). CTA behält Beta-Badge + `PillButton` „Jetzt Beta-Partner werden" (Live-Demo-Button entfernt). Footer = Glas-Karte (`bg-white/75 backdrop-blur-2xl`), Newsletter-Box raus, 4 Spalten (Marke / Produkt / Unternehmen / Rechtliches) + Instagram/LinkedIn, Copyright „© 2026 Solvary · Designed by VU Studio".
- **Tests** — 2 obsolete „Live-Demo ansehen (CTA/Hero)"-Cases in `tests/pages/LandingPage.test.tsx` durch einen FAQ-Render-Test ersetzt. `npm run build` 0 TS-Fehler ✅ · LandingPage-Tests 8/8 ✅
- **Einheitliches Sektion-Label** — neue Komponente `src/components/ui/SectionTag.tsx` (dunkle Pille, gelber Punkt, optionales `icon`). Ersetzt die alten Uppercase-`<span>`-Labels in ProductsStackSection, Features (LandingPage), StatsBentoSection, MilestonesSection, FaqSection und CTA (dort mit Zap-Icon). Hero + Footer bleiben ohne.
- **StatsBentoSection** — `StatCard` an die mittlere Logo-Kachel angeglichen: hellgraue Außenbox (`bg-brand-bg-alt`), weisse Innenbox (`bg-white`), Icon jeweils in einem gelben Kreis (`rounded-full bg-brand-primary` + Blur-Glow), Zahlen/„Sofort" bleiben `text-brand-secondary` (dunkelgrau). `Accent`-Typ + `glowByAccent`-Map entfernt (nicht mehr gebraucht).
- **ProductsStackSection** — `uppercase` von Produkt-Headline (`h3`) und Subtitle (`p`) entfernt (+ überflüssiges `tracking-wide`), jetzt normale Schreibweise.
- **Neue Preise-Sektion** — `src/sections/PricingSection.tsx`, weisser Hintergrund, `id="pricing"`, SectionTag „Preise", 3 Tiers aus `PricingPage` (Starter 179 / Professional 379 / Enterprise 799), Beta-Rabatt korrekt aus `BETA.discountPercent` (30%) berechnet + angezeigt (`≈ €X / Monat als Beta-Partner`). Icon im gelben Kreis wie StatsBentoSection, „Beliebt"-Badge auf Professional, Link zu `/preise` für den vollen Vergleich. In `LandingPage` zwischen Prozess und FAQ eingebunden, Nav-Link „Preise" ergänzt. FaqSection bekam `border-t border-gray-100` als Trennung zweier weisser Sektionen.
- **Test-Fix** — `rendert die 3 Produkt-Kacheln` nutzt jetzt `getByRole("heading", …)` (Feature „Solar-Konfigurator" in PricingSection kollidierte mit dem Kachel-Titel).
- **PillButton** — dritte Variante `dark` ergänzt (dunkle Pille `bg-brand-secondary-hover` + `border-white/10`, weisse Schrift, gelber Kreis); Ternary-Ketten im JSX durch `VARIANTS`-Map ersetzt.
- **PricingSection v2** — CTA-Buttons sind jetzt `PillButton` wie in der Hero (`variant="white"`); mittlere Karte („Professional") dunkelgrau (`bg-brand-secondary`), weisse Schrift, gelbe Check-Icons, `PillButton variant="dark"`. Karten-Hintergrund einheitlich hellgrau (`bg-brand-bg-alt`), `border-t` an der FaqSection wieder entfernt → nahtloser Weiss-Übergang Preise→FAQ.
- **PricingSection v3 (final Landing)** — CTA-Buttons: kein PillButton mehr, sondern Navbar-Stil (`rounded-full`, full-width). Helle Karten `bg-brand-secondary text-white`, dunkle Karte (Professional) `bg-white text-brand-secondary`. PillButton-`dark`-Variante wieder entfernt → `PillButton.tsx` ist wieder Original (primary/white).

## Session 2026-09-02 (PricingPage → Landing-Styling + geteilte Sektionen)

- **Geteilte Marketing-Sektionen extrahiert:**
  - `src/sections/SiteHeader.tsx` — Scroll-Shrink-Kapsel-Header (Logo links, Nav, „Kostenlos testen"), `navLinks`-Prop (Default zeigt auf `/#…`), Mobile-Menü inklusive. In-Page-Links sind jetzt native `<a href="/#…">` (CSS `scroll-behavior: smooth`), kein `scrollTo`-Handler mehr.
  - `src/sections/CtaFooterSection.tsx` — die kombinierte Beta-CTA + Glas-Footer-Karte (Bild-Hintergrund `hero-island.jpg`).
  - `src/lib/pricingData.ts` — Single Source of Truth: `saasTiers`, `agencyTiers` (Shape `PricingTier` mit `seat`-Feld), `betaPrice()`.
  - `src/sections/PricingTiers.tsx` — wiederverwendbares 3-Karten-Grid (helle/dunkle Kachel, Navbar-Button), `tiers`- + `showBeta`-Prop.
- **`LandingPage.tsx`** nutzt jetzt `<SiteHeader />` + `<CtaFooterSection />` statt Inline-Markup (~200 Zeilen raus); `PricingSection` nutzt `PricingTiers` + `saasTiers`.
- **Navbar gekürzt** — `SiteHeader` DEFAULT_LINKS jetzt nur noch: Produkte (`/produkte`), „Was brauche ich?" (`/check` — derselbe Funnel wie der Hero-Button „Welche Lösung passt zu mir?"), Preise (`/preise`). Funktionen / „Und was jetzt?" / FAQ raus. Neuer `NavItem`-Helper: `/#…` → natives `<a>`, echte Routen → SPA-`<Link>`.

## Session 2026-09-02 (Teil 2 — ProductsPage)

- **`src/sections/FeaturesSection.tsx`** — Funktionen-Sektion (6 Karten + Daten) aus `LandingPage` extrahiert, eigener gsap-Reveal (`.feature-reveal`). LandingPage nutzt jetzt `<FeaturesSection />` (Inline-Markup + `features`-Array + Icon-Imports raus).
- **`ProductsStackSection`** — neues Prop `showHeader` (Default `true`); `scroll-mt-24` ergänzt.
- **`src/pages/ProductsPage.tsx`** (neu) — helles Landing-Styling: `SiteHeader`, eigener Hero (SectionTag „Produkte"), `<ProductsStackSection showHeader={false} />`, `<FeaturesSection />`, `<FaqSection />`, `<CtaFooterSection />`. Route `/produkte` in `App.tsx`.
- **Navbar „Produkte"** zeigt jetzt auf `/produkte` (statt `/#services`). `CtaFooterSection`-Footer „Produkt"-Spalte: Produkte (`/produkte`), Was brauche ich? (`/check`), Preise (`/preise`), FAQ (`/#faq`) — Route-Links als `<Link>`, Anker als `<a>`.
- `npm run build` 0 TS-Fehler ✅ · LandingPage-Tests 8/8 ✅
- **Hero (Landing)** — die zwei Stat-Blöcke unten (50%+ / 20 Min) entfernt.
- **CtaFooterSection-Footer** — Instagram/LinkedIn-Icons raus; „VU Studio" im Copyright ist jetzt ein Link auf `https://www.vu-studio.de/` (neuer Tab).
- **BetaSignupPage** — im linken Formular-Panel die gelbe fette Schrift (`text-brand-primary`) auf `text-brand-secondary` (dunkelgrau) umgestellt: Plätze-Badge, „kostenlos", „30% Gründerrabatt", „— für Rückruf (empfohlen)". Rechtes Dark-Panel + Phone-Icon/-Border unverändert gelb.
- **SolutionCheck (Funnel /check)** — beide dunklen Buttons (E-Mail-Gate „Auswertung anzeigen" + Demo-Link auf dem Ergebnis-Screen) auf den Navbar-CTA-Stil gebracht: `bg-brand-secondary text-white font-bold rounded-full hover:bg-brand-secondary-hover transition-all`.
- **BetaSignupPage** — Submit-Button „Anfragen" von Gelb (`bg-brand-primary`) auf denselben Navbar-CTA-Stil (`bg-brand-secondary text-white … rounded-full hover:bg-brand-secondary-hover`).
- **Dashboard-Logo** — Text „Solvary" oben links in `AdminSidebar.tsx` (Admin + Agentur) und im Inline-Sidebar von `Dashboard.tsx` (Installateur) ersetzt durch `<img src={LOGO_WHITE_PATH} className="h-9 w-auto" />`.
- **Sidebar sticky** — `aside` in `AdminSidebar.tsx` + `Dashboard.tsx` → `self-start sticky top-0 h-screen` (nav hatte schon `flex-1 overflow-y-auto`, konnte ohne feste Höhe aber nicht greifen). Verbesserung, war aber NICHT die Ursache des Fehlklick-Bugs.
- **Sidebar-Fehlklick-Bug (echte Ursache, GEFIXT)** — Tab-Items (`Rabatte`, `Pipeline`, `Projekte`, `Reports`) haben `path: "/admin"` + `tab: "discounts"` etc. Auf Unterseiten (`/admin/calendar`, `/admin/messages`, `/admin/completed`, `/admin/team`) wird `<AdminSidebar />` **ohne** `onTabChange` gerendert → Fallback-Zweig `<Link to={item.path}>` = `/admin`, die `item.tab` fiel komplett weg. `AdminDashboard` startete mit `useState('dashboard')` → immer Dashboard-Tab.
  - Fix 1 `AdminSidebar.tsx`: `to={item.tab ? \`${item.path}?tab=${item.tab}\` : item.path}`.
  - Fix 2 `AdminDashboard.tsx`: `activeTab` kommt jetzt aus der URL (`useSearchParams`, `?tab=`), `setActiveTab` schreibt sie per `replace` zurück (Tab überlebt Reload + Zurück-Button).
- **Nachrichten-Tab entfernt** — die 6 identischen `messages`-Einträge aus allen NAV-Arrays in `AdminSidebar.tsx` raus (+ ungenutzter `MessageSquare`-Import). Route `/admin/messages` und `MessagesPage.tsx` existieren noch, sind nur nicht mehr verlinkt.
- **Login entschlackt** — „Angemeldet bleiben"-Checkbox (inkl. `rememberMe`-State, war nie an `login()` angebunden) und „Passwort vergessen?"-Link (zeigte auf die nicht existierende Route `/forgot`) entfernt. Test `hat Passwort-vergessen Link` → `zeigt weder Passwort-vergessen noch Angemeldet-bleiben`.
- **ErrorBoundary ergänzt** — `src/components/layout/ErrorBoundary.tsx`, in `main.tsx` um `<App />` gelegt (innerhalb `AuthProvider`). Vorher gab es **keine einzige** ErrorBoundary im Projekt: ein Render-Fehler warf den kompletten React-Baum weg → Seite blieb im letzten Frame stehen, Logout/Navigation tot. Jetzt: Fehlermeldung + `componentStack` sichtbar, Buttons „Nochmal versuchen" / „Zum Dashboard" / „Zum Login", plus `console.error("[ErrorBoundary]", …)`.
- **Freeze NICHT reproduzierbar** — mit `inhaber@test.de` auf :3000 durchgespielt: Dashboard→Abgeschlossen, Klick während des Ladens (Main-Thread-Watchdog: max. 51 ms Timer-Drift = kein Blockieren), Kalender→Rabatte. Alles sauber, keine 400er in der Konsole. Die 400er des Users sind also account-/datenspezifisch. Nächster Schritt beim Auftreten: Konsole auf `[ErrorBoundary]` prüfen.
- **Tab-Fix verifiziert** — Kalender → „Rabatte" landet auf `/admin?tab=discounts`, nur „Rabatte" ist markiert.
- **OFFEN (nicht gefixt):** Auf `/admin/calendar` 400er in der Konsole von `fetchInstallerLeads` (`leads?...&order=created_at.desc`) — Query/RLS-Problem, wird per `.catch(() => {})` verschluckt. Das gemeldete „hängt sich auf" ist damit noch nicht erklärt: `useAppointments` setzt `isLoading` im `finally` immer auf false.
- **`PricingPage.tsx` komplett neu, hell:** `bg-white`, `SiteHeader`, Hero mit SectionTag „Preise", SaaS-`PricingTiers`, heller Funktions-Vergleich, Agentur-Sektion (`PricingTiers tiers={agencyTiers} showBeta={false}`), dann geteilte `FaqSection` + `CtaFooterSection`. Kein Dark-Theme, kein eigener Header/Footer mehr.
- **Test-Fix:** —. `npm run build` 0 TS-Fehler ✅ · LandingPage-Tests 8/8 ✅ (AuthContext 6 rot = vorbestehend, `emitAuth`-Mock).
- **OFFEN/Inkonsistenz:** FAQ-Antwort „Was kostet Voltify?" nennt noch „149 €/Monat" — widerspricht der Preise-Sektion/-Seite (179/379/799). Vom User noch nicht freigegeben zu ändern.

## Session 2026-09-01 (Teil 2 — LandingPage-Redesign)

- **CRM-Sektion („Der Überblick, den Sie brauchen")** — von Feature-Liste auf Tab-Navigation umgebaut (à la „How I Can Help You"): 4 Tabs (Lead-Pipeline / Terminplanung / Team-Verwaltung / Dokumente & Rechnungen), je Tab ein Panel mit Bild links + `//0X`-Nummer, Titel, Text, Pill-CTA + Kreis-Arrow rechts. State `crmTab` in `LandingPage.tsx`, Daten-Array `crmFeatures`. Alle 4 Tab-Bilder nutzen noch `dashboard-bg.jpg` (Platzhalter — echte Screenshots je Feature einbauen).
- **Produkte-Sektion (`ProductsStackSection.tsx`)** — Kacheln neu im Referenz-Layout: `+ 00X`-Nummer, großer Uppercase-Titel + Bild links, Uppercase-Beschreibung + `PillButton` (variant „white", wie Hero) + Feature-Chips rechts. Sticky-Stack-Scaling bleibt.
- **Neue 4. Kachel „Angebotskonfigurator"** (Position 002) — Positionen/Rabatte/Vorlagen/PDF-Versand/ROI-Panel, Link `/login`.
- **Bugfix (pre-existing):** `steps`-Array in `LandingPage.tsx` nutzte `desc:` statt `description:` → `MilestonesSection`-Typfehler behob den Build. Umbenannt. Test-Mock `tests/pages/LandingPage.test.tsx`: gsap-Mock um `default`-Export ergänzt (MilestonesSection nutzt Default-Import).
- **Qualität:** `npm run build` 0 TS-Fehler ✅ · `tests/pages/LandingPage.test.tsx` 9/9 ✅

## Session 2026-09-01

- **Sections-Ordner aufgeräumt** — alle `CustomerLandingPage`-Sections (nun DemoPage) nach `src/sections/demo/` verschoben.
- **CustomerLandingPage → DemoPage** umbenannt (`src/pages/DemoPage.tsx`, Export `DemoPage`, Route `/demo` unverändert).
- **DemoBanner-Button** (`/konfigurator`) im Stil der LandingPage-Hero-CTA, gleiche Größe: Normalzustand gelber Hintergrund (`brand-primary`) mit dunkler Schrift, weißer Pfeil-Kreis; Hover invertiert zu weißem Hintergrund.
- **Sticky-Stack Products-Sektion** — `src/sections/ProductsStackSection.tsx` mit Framer-Motion-Sticky-Stack für die 3 Produkte (Solar-Konfigurator, CRM & Dashboard, Digitaler Auftritt); in `LandingPage.tsx` eingebunden.
- **Qualität:** `npm run build` 0 TS-Fehler ✅; `tests/pages/LandingPage.test.tsx` ✅; AuthContext-Tests haben vorher bestehende `emitAuth`-Mock-Probleme.

## Nächster Schritt (2026-09-01)

- Weiter mit ursprünglicher Roadmap: E2E-Smoke-Test Agency oder 3 Beta-Tester onboarden.

---

## Status: MVP-INFRASTRUKTUR KOMPLETT ✅

Letzter Stand (Code): 121/121 Tests, 0 TypeScript-Fehler
Session 2026-05-31: Batteriekosten-Fix, Step-7-Verbesserungen, 8-Schritt-Konfigurator, PLZ in Step 1
Session 2026-06-01:

- Step 3 gesplittet → 9-Schritt-Konfigurator (Step 3=Stromverbrauch, Step 4=Ausstattung & Pläne)
- Google Maps API Key live (Vercel + .env.local, Quota 200/Tag, Budget-Alert €20)
- Migrationen 030+032+033+034a+034b+035 in Supabase deployed
- Edge Functions: notify-signature deployed, send-offer + notify-signature auf noreply@vu-studio.de
  Session 2026-06-05 (Teil 1):
- **Digitale Unterschrift komplett** ✅ (signing_token in LEAD_SELECT + Link in E-Mail)
- **Calendly-Integration** ✅ Beta-Formular → Demo-Call-Modal (contact-vu-studio/30min)
- **Funnel-Umbau (Demo-as-Trojan-Horse)** ✅ — betaConfig.ts, Step9 demoMode, DemoBanner, ExitIntentModal, FloatingBetaCTA
- CRM-Kachel → /login (Demo-Accounts für Prospects) · 113/113 Tests grün

Session 2026-06-05 (Teil 2):

- **Funnel-Tracking** ✅ — `funnel_events` Tabelle (Migrationen 036–038), fire-and-forget Events
- **Step0_EmailGate** ✅ — E-Mail-Capture vor Konfigurator (nur Live-Modus, Skip-Option)
- **Demo-Modus via ?demo=1** ✅ — URL-Param trennt Demo (Banner, kein Gate) von Live (Gate, kein Banner)
- **UTM-Persistenz** ✅ — `cacheFunnelSourceFromUrl()` auf Landing; sl_email + utm_* überleben Navigation
- **Scoutly-Integration** ✅ — VoltifyPanel in Scoutly IntegrationsPage, funnel_events_public View
- **Smartlead P.S.-Link** ✅ — `?sl_email={{email}}&utm_source=scoutly&utm_campaign=...`
- **Vercel Build-Fix** ✅ — Promise.resolve() wrapper + CalculationPdfDocument.tsx committed
- Letzter Commit: `543decf` · 113/113 Tests grün · 0 TypeScript-Fehler

Session 2026-06-09 (Agency-Rollensystem + Kalender + Einstellungen):

- **`agency_agent`-Rolle (Vertriebler)** ✅ — `resolveAgencyId`, `isAgencyAdmin/Agent`, Sidebar-Nav, App-Routing
- **`AgencyCalendarPage`** ✅ — 2 Typen (Beratung mit Lead, Partner-Meeting), eigener Kalender für Agenturen
- **`AgencyTeamPage`** ✅ — Vertriebler einladen, Blur-Passwort, Copy-Buttons
- **`AgencySettingsPage`** ✅ — Firmenprofil, Standard-Provision, Benachrichtigungs-Toggle, Team-Shortcut
- **Team-Filter** ✅ — Dashboard (Meine Leads) + CommissionsPage nach Vertriebler filterbar
- **`vertriebler@test.de`** ✅ — Migration 042 + Login-Seite 2-Button-Grid
- **Migrationen 042–044** ✅ deployed — agency_agent CHECK-Constraint, assigned_by, Agency-Settings-Spalten
- 2 Commits gepusht + Vercel deployed: https://voltify-app.vercel.app

Session 2026-06-08 (Teil 2 — Agency-Blocker):

- **Migration 039** ✅ DEPLOYED — `partners`, `lead_assignments`, `commissions` + RLS live
- **Migration 040** ✅ DEPLOYED — 3 SECURITY DEFINER RPCs (`get_partner_by_token`, `get_partner_assignments`, `partner_update_assignment`), `sales_agency` im Role-CHECK-Constraint, `profiles.agency_slug`, Leads-RLS für Agenturen, `resolve_agency_slug`
- **A1 — Portal-RLS-Fix** ✅ — Portal läuft jetzt über RPCs (anon-safe), Commission-Automatik bei `converted` ist transaktional im RPC
- **A2 — Funnel-Verdrahtung** ✅ — `?a=<slug>` → sessionStorage → `resolve_agency_slug` → `agency_id` im Lead-Insert; `LeadRouterPage` lädt echte Agency-Leads
- **A3 — Commission-Automatik** ✅ — im `partner_update_assignment` RPC integriert (idempotent, fixed + percentage)
- **Edge Functions** ✅ DEPLOYED — `notify-partner` + `notify-agency` ACTIVE
- 113/113 Tests grün · 0 TypeScript-Fehler

Session 2026-06-23 (Angebots-Konfigurator + Vorlagen + White-Label + PDF-Vorschau):

- **Angebots-Konfigurator** ✅ — `OfferBuilderPage.tsx`, `offers.ts`, Drag-Drop Positionen, Rabatt, PDF & E-Mail aus Draft
- **Default-Preise aus Einstellungen** ✅ — Kalkulations-Settings (Modul/WR/Montage/Elektro) → Draft-Übernahme
- **ROI-Impact-Panel** ✅ — Live Amortisation / Jahresersparnis / Gewinn 20J. / Autarkie aus aktuellem Draft-Total (Ampel-Farben)
- **Vorlagen-System** ✅ — Migration `048_offer_templates.sql`, Anschreiben/Zahlungsbedingungen/Folgekosten/Schlusstext + E-Mail-Vorlage, `{{Platzhalter}}`-Interpolation, AdminSettings Vorlagen-Tab
- **DIN A4 PDF-Vorschau** ✅ — `PDFViewer` mit echtem `OfferPdfDocument` in Einstellungen, Mock-Positionen aus Kalkulations-Settings, Template-Texte sichtbar, automatische Seitenumbrüche
- **White-Label WL1** ✅ — Migration `049_installer_branding.sql`, `installer_slug` + `branding` JSONB in profiles, `useTenantBranding` Hook, `?i=<slug>` URL-Param, Konfigurator in Installer-Farben + Logo + "Powered by Voltify"
- **Preise angehoben** ✅ — Installer 179/379/799€, Agency 199/399/699€, White-Label Addon +79€/Mo (Vollpreise)
- Migrationen 045–049 deployed · 0 TypeScript-Fehler · Commit `dfaf713` · Vercel-Deploy ausgelöst

Session 2026-06-25 (Embed-Go-Live + Installer-Attribution + einstellbare ROI):

- **Erster Test-Kunde onboardet** ✅ — `ag@sunwinwin.de` (Ali Galioglu, Firma sunwinwin), Rolle `owner`, `installer_slug = sunwinwin`. Login: https://voltify-app.vercel.app/login (PW `Voltify2026!`, sollte geändert werden)
- **Installer-Lead-Attribution** ✅ — RPC `resolve_installer_slug` (Migration `050`); `Configurator.tsx` übergibt echte `installerId` statt `undefined`. `?i=sunwinwin`-Leads landen automatisch in Alis CRM (E2E gegen DB getestet)
- **White-Label-Embed (iframe)** ✅ — `useEmbedAutoResize` postet Inhaltshöhe per `postMessage`; `min-h-screen` nur im Vollbild (kein Loop im iframe). Snippet: `docs/embed/voltify-embed.md`
- **Konfigurator-ROI-Annahmen pro Installateur (Stufe 1+2)** ✅ — Spalte `profiles.calc_assumptions` + RPC `get_installer_calc_assumptions` (Migration `051`). `calculateROI(data, assumptions={})` rückwärtskompatibel: Richtpreis €/kWp, Strompreis-Default, Einspeisevergütung, Wartung einstellbar. Hook `useInstallerCalcAssumptions`, in Step7 + Submit verdrahtet, AdminSettings-Tab „Konfigurator-Annahmen (ROI)"
- 2 Commits gepusht (`344a3ed`, `d6a2e66`) → `main` → Vercel-Deploy ausgelöst · 121/121 Tests · 0 TS-Fehler
- **E2E-Browser-Smoke-Test** ✅ — Konfigurator `?i=sunwinwin` komplett durchgeklickt (Playwright), Lead landete mit `installer_id` in Alis CRM (danach aufgeräumt). Branding-Test: grünes Test-Branding gesetzt → Header zeigte „sunwinwin Solar" + grüne Seitenleiste → bestätigt, danach zurückgesetzt.
- **WL2 — Company-Settings in DB** ✅ — Migration `052` (`profiles.company_settings`), `src/services/companySettings.ts`, `AuthContext` hydratisiert localStorage-Cache bei Login aus DB, `AdminSettings`+`AdminDashboard` lesen/schreiben Settings in DB. Behebt Multi-Device-Überschreib-Bug. Commit `08ad08d`.
- **Geführter Lösungs-Check (B2B-Funnel)** ✅ — `/check`: Schmerz-Diagnose (Installateur-Pfad) → Hero-Modul (Priorität) + ehrliche Begründung + Zeitersparnis + passende Demo + Calendly-Call. `src/lib/solutionCheck.ts` (Logik), `src/pages/SolutionCheck.tsx` (Funnel), Migration `053` (`solution_check_responses` = Founder-Learning + Pipeline, anon-insert). LandingPage-Hero: Check = primärer CTA, Live-Demo = Fluchtweg. E2E-Browser-Test bestanden (Flow + Auswertung + DB-Persistenz). Commit `bbefb85`. **Strategie-Entscheidung: Voltify = eine Plattform (kein Einzelprodukt-Verkauf); Module = Schmerz-Einstiegsrampen; Agentur-Pfad später.**
- **DSGVO-Löschung (Art. 17)** ✅ — Migration `054`: `erase_lead(p_lead_id)` RPC (SECURITY DEFINER + Autorisierung). Löscht PII über ALLE Tabellen (appointments, webhook_logs, funnel_events per E-Mail + Lead-Cascade); `commissions` werden anonymisiert (Aufbewahrungspflicht § 147 AO → `lead_id` nullable). `eraseLead`-Service + Bestätigungs-Modal in `LeadDetailsPage`. **Doppelt verifiziert:** SQL-Dry-Run (alle PII=0, Provision erhalten) + echter UI-Auth-Pfad (Login → Löschen → Lead weg). Commit `1fe3ae8`. **OFFEN (kein Code): AVV/Auftragsverarbeitungsvertrag + Datenschutzerklärung für Kunden; Datenexport Art. 20.**
- ✅ **Code/DB-Drift behoben (2026-06-29):** Migrationen 042–044, 048, 049 als idempotente Dateien aus dem Live-Schema nachgezogen (042=agency_agent-Role-Constraint, 043=lead_assignments.assigned_by, 044=Agency-Settings-Spalten, 048=offer_text_template+email_template JSONB auf profiles [KEINE eigene Tabelle!], 049=installer_slug+branding+get_installer_branding). Migrations-Ordner jetzt lückenlos 030–054 (031 war nie vergeben). Frisches `db push` ist reproduzierbar.

---

## Was ist neu? (2026-05-29) — Strategie-Pivot

### Wettbewerbsanalyse vs. Reonic durchgeführt

- **Niche-Positionierung** klar festgelegt: **Solo-Solarteure + 1–5-Mann-Familienbetriebe in DACH** — bewusst NICHT die Reonic-Klientel (5+ Mitarbeiter)
- **Flywheel-Modell** dokumentiert: Scoutly (CAC-Maschine) → Voltify (LTV-Maschine) → AI-Dev (Velocity-Multiplikator)
- **DNA-Sektion 9** ergänzt: Buyer-Persona, Wettbewerbsmatrix, 90-Tage-Plan, "Wir-tun-das-NICHT"-Liste, Risiken, KPIs, Stop-Loss-Bedingungen
- **Realistische Erfolgs-Szenarien**: €300k–800k ARR-Pfad realistisch (~35–45 %), "Reonic-Killer" unrealistisch (<15 %)

### Feature-Roadmap aus Reonic-Analyse (in tasks-VOLTIFY.md)

- **Tier 1** Quick-Wins (1–2 Wochen): Digitale Unterschrift, Angebots-Varianten A/B/C, Magic-Link-Portal hochziehen, Lead-Scoring AI ausbauen
- **Tier 2** Strategisch (2–6 Wochen): **Solar-Planer (2D-Satellit Google Maps)** statt 3D, PWA für Monteure
- **Tier 3** Differenzierung (selektiv): WhatsApp-Integration, Förder-Datenbank, Netzanmeldungs-Pre-Fill-PDF
- **Meeting-/Call-Notizen mit Whisper bewusst ausgeklammert**

### Solar-Planer: 3D → 2D-Pivot

- **Vorher**: React Three Fiber, generische 3D-Box, ~2–3 Wochen Aufwand
- **Jetzt**: Google Maps Satellite + Canvas-Modul-Overlay (à la Reonic), ~1–2 Wochen Aufwand
- **Begründung**: Realer Wow-Faktor (Kunde sieht **sein** Haus), mobile-stabil (kein WebGL), trivialer PDF-Export
- **Map-Provider entschieden**: Google Maps (beste DE-Qualität, Domain-Restriction Pflicht)
- **Adress-Eingabe bleibt in Step 8** → Visualizer erscheint in Step 9 (Thank-You)

---

## Was ist drin? (MVP-Stand vor Pivot)

### Live & Deployed

- Live auf Vercel ✅
- 94/94 Tests grün ✅
- 9-Schritt-Konfigurator mit ROI-Berechnung
- Admin-CRM mit Kanban-Pipelines (Leads + Projekte)
- Angebots-PDF + 3 Rechnungs-PDFs mit dynamischem Branding
- Rabatt-System mit Codes + Live-Vorschau
- Pipeline-Spalte "Vor Ort" + Site-Visit-Termine
- Lead-Scoring (Heiß/Warm/Kalt — statisch)
- E-Mail-Versand via Resend (`send-offer` Edge Function)
- Multi-Role-System (8 Rollen) + Team-Verwaltung

---

## Was ist neu? (2026-05-31) — Konfigurator-Polish

### Wirtschaftlichkeitsanalyse (Step 6, war Step 7)

- **Batteriekosten proportional**: `500 * kWh + 2.000€` statt flat 6.000€ — passt zu Step-4-Preisen
- **Batterie-Ersatz** ebenfalls skaliert: `500 * kWh + 1.000€` (gibt 6.000€ für 10 kWh = stabil)
- **Gewinn-20J-Kachel** ersetzt Systemleistung — wichtigste Zahl prominent sichtbar (grün/rot)
- **Optimierungshinweis** bei Amortisation > 16 J. — personalisiert (kein E-Auto/WP → konkreter Tipp)
- **analysisKey** war definiert aber nie als `key`-Prop gesetzt — jetzt korrekt angewendet

### Konfigurator-Flow (9 → 8 Schritte)

- **Step 3 + Step 5 gemergt** → "Stromverbrauch & Zukunftspläne" (Verbrauch + E-Auto/WP/Wallbox/Notstrom)
- **PLZ in Step 1** → Analyse ab Step 6 vollständig PLZ-personalisiert (Einstrahlung + Förderungen)
- **PLZ aus Step 8 entfernt** (Kontakt) — nur Ort bleibt dort
- Alle `/9`-Referenzen auf `/8` aktualisiert, Step-7/8/9-Buttons auf Step-6/7/8 gesetzt

---

## Was ist neu? (2026-06-18) — Angebots-Konfigurator

### Angebots-Erstellung komplett überarbeitet

- **Neue Seite** `/lead/:id/offer` (`OfferBuilderPage.tsx`) — Installateur/Inhaber kann Angebotspositionen frei definieren, Preise ändern und Dienstleistungen hinzufügen.
- **Neue Tabellen** `offer_drafts` + `offer_line_items` (Migration `045_offer_drafts.sql`) — echte Persistenz, trennt Kunden-Konfigurator-Ergebnis vom finalen Angebot.
- **Vorausfüllung aus Lead-Daten** — Module, Wechselrichter, Speicher, Montage, Elektro werden automatisch aus `lead.kwp` / `lead.has_battery` generiert.
- **Flexible Preisgestaltung** — Menge, Einheit, Einzelpreis pro Position editierbar; Rabatt-Code oder manueller Rabatt; Live-Zwischensumme/Gesamtsumme.
- **LeadDetailsPage umgebaut** — Boxen „Angebots-Management" und „Rabatt & Preis" ersetzt durch einfachen CTA „Angebot erstellen / bearbeiten".
- **PDF & E-Mail** — `OfferPdfDocument` rendert jetzt detaillierte Angebotspositionen aus dem Draft; E-Mail-Versand komplett aus dem Builder heraus.
- **Status-Workflow** — Entwurf → Gesendet → Angenommen/Abgelehnt, synchronisiert mit `leads.offer_status`.
- **Default-Preise aus Einstellungen** — `AdminSettings` → Tab „Kalkulation" → Standard-Angebotspreise (Module, Wechselrichter, Speicher, Montage, Elektro, Gerüst, Anfahrt, MwSt) werden in `localStorage` gespeichert und beim Erstellen eines Drafts übernommen.

### Qualität

- `npm run build`: 0 TypeScript-Fehler ✅
- `npm test`: 121/121 Tests grün (113 bestehende + 8 neue `tests/lib/offers.test.ts`) ✅

## Was ist neu? (2026-06-18, Teil 2) — Agency Phase B + C1

### B1 — Agency-Tier-Schema

- **Migration `046_agency_tiers.sql`** — `profiles.agency_tier` (`start`/`pro`/`scale`) + `profiles.agency_partner_limit` int, Default `start`/5 für `sales_agency`.
- **TypeScript-Typen** — `Profile` in `src/services/auth.ts` und `AuthUser` in `src/contexts/AuthContext.tsx` um `agencyTier` und `agencyPartnerLimit` erweitert.

### B2 — Partner-Limit-Gating

- **`src/services/agency.ts`** — `countActivePartners()` + Limit-Check in `createPartner()`; eigener Fehler-Code `PARTNER_LIMIT_REACHED`.
- **`src/pages/agency/PartnersPage.tsx`** — Limit-Banner, deaktivierter „Partner hinzufügen"-Button, Upgrade-CTA zu `/pricing`.
- **Migration `047_partner_limit_check.sql`** — Datenbank-Trigger `partner_limit_trigger` + `check_partner_limit()` als harte Absicherung.

### B3 — Agency-Tiers auf PricingPage

- **`src/pages/PricingPage.tsx`** — Neuer Block „Für Vertriebsagenturen" mit Start (5 Partner), Pro (20 Partner), Scale (unbegrenzt + Auto-Routing).

### C1 — PLZ-basiertes Auto-Routing

- **`src/pages/agency/LeadRouterPage.tsx`** — „Auto-Routing"-Button nur für `scale`-Tier; weist alle offenen Leads automatisch an passende Partner zu (PLZ-Match + fairste Verteilung nach letzter Zuweisung).

### Bugfix: AdminDashboard-Drawer

- **`src/pages/AdminDashboard.tsx`** — Der Lead-Drawer zeigte noch das alte „Angebots-Management" + „Rabatt & Preis". Beide Boxen wurden durch eine einzige „Angebot"-Karte ersetzt: lädt den Entwurf, zeigt Status + Summe und leitet mit „Angebot konfigurieren / bearbeiten / ansehen" zu `/lead/:id/offer` weiter (statt direkt PDF zu generieren).

### Qualität

- `npm run build`: 0 TypeScript-Fehler ✅
- `npm test`: 121/121 Tests grün ✅

## Aktueller Blocker (Stand 2026-06-18)

### 🟡 Migrationen 045–047 müssen deployed werden

- **Fehler auf `/lead/:id/offer`:** `Could not find the table 'public.offer_drafts' in the schema cache`
- **Ursache:** Migration 045 (`offer_drafts` + `offer_line_items`) ist lokal vorhanden, aber noch nicht auf Supabase ausgeführt.
- **Fix:** `npx supabase link --project-ref ecsqbsgbfmvqaqnryvwf` → DB-Passwort eingeben → `npx supabase db push`
- **Mit einem Push werden gleich 045, 046 und 047 deployed.**

## Nächster Schritt (Stand 2026-06-25)

### ← JETZT DRAN: sunwinwin live bringen

1. ~~**Vercel-Deploy abwarten/prüfen**~~ ✅ — Live-Stand 2026-08-27, HTTP 200 (geprüft 2026-08-31).
2. **Ali Zugang geben** — Login-Daten weitergeben, Passwort-Wechsel empfehlen.
3. **Branding + ROI-Annahmen mit Ali befüllen** — AdminSettings → Profil & Branding (Logo/Farben) + Tab „Konfigurator-Annahmen (ROI)" (Richtpreis €/kWp nahe seiner realen Kalkulation).
4. **Embed-Snippet übergeben** — `docs/embed/voltify-embed.md` (sunwinwin-Variante), in „Custom HTML"-Block seiner Seite.
5. **Browser-Smoke-Test** — `?i=sunwinwin` live durchklicken → Lead muss in Alis CRM erscheinen (noch ausstehend).

### ← WEITERE CODE-SCHRITTE (nach Wahl)

- **E2E-Smoke-Test Agency** — Lead via `?a=solar-vertrieb-gmbh` → Zuweisen → Portal (Inkognito) → annehmen → converted → Commission prüfen.
- **C2 — Annahme-Frist + Auto-Reassignment** — 24h-Timeout für `pending` Assignments (Cron-Job oder Edge Function).
- **C3 — Partner-Self-Onboarding** — Einladungs-Link für Partner-Registrierung.
- **C5 — Partner-Scorecard** — Conversion-Rate & Reaktionszeit pro Partner.
- **Cron Jobs** — `notify-offer-expiry` + `notify-payment-due` täglich 08:00.
- ~~**WL2** — Company-Settings in DB~~ ✅ erledigt (2026-06-25, Commit `08ad08d`)

### ← NÄCHSTER VERTRIEBS-SCHRITT

- 3 Beta-Tester onboarden → White-Label-Slug vergeben + eigenes Branding testen
- Scoutly-Kampagne 1: 200 Solo-Solarteure DE, A/B-Hypothese mit `?i=<slug>` Tracking

### Alles Erledigte (Code, 2026-06-23)

1. ~~Google Maps API Key~~ ✅
2. ~~Migrationen 030–049~~ ✅
3. ~~Edge Functions + Resend~~ ✅
4. ~~Digitale Unterschrift~~ ✅
5. ~~Funnel-Tracking + Lead-Gate + Scoutly-Integration~~ ✅
6. ~~Partner-Modul MVP (Rolle, CRUD, Portal, E-Mail)~~ ✅
7. ~~Agency-Modul Blocker A1/A2/A3~~ ✅ — RLS-RPCs, Funnel-Verdrahtung, Commission-Automatik
8. ~~Migrationen 039+040 deployed~~ ✅ — Role-Constraint, agency_slug, RPCs, Leads-RLS
9. ~~notify-partner + notify-agency ACTIVE~~ ✅
10. ~~Test-Account `agentur@test.de`~~ ✅ — Solar Vertrieb GmbH, slug `solar-vertrieb-gmbh`, 2 Partner, 1 Lead
11. ~~Login-Toggle Installateur/Agentur + Test-Agentur-Button~~ ✅
12. ~~`agency_agent`-Rolle + `resolveAgencyId`~~ ✅ — Vertriebler-Hierarchie analog zu Installateur/Inhaber
13. ~~`AgencyCalendarPage`~~ ✅ — Beratung mit Lead + Partner-Meeting, ohne Installateur-Typen
14. ~~`AgencyTeamPage`~~ ✅ — Vertriebler einladen, Zugangsdaten anzeigen
15. ~~`AgencySettingsPage`~~ ✅ — Firmenprofil, Standard-Provision, Benachrichtigungs-Toggle
16. ~~Team-Filter in Dashboard + CommissionsPage~~ ✅ — `assigned_by`-Feld + Dropdown für Agentur-Inhaber
17. ~~Angebots-Konfigurator~~ ✅ — `OfferBuilderPage`, `offers.ts`, Drag-Drop, Rabatt, PDF & E-Mail aus Draft
18. ~~Vorlagen-System~~ ✅ — Anschreiben/AGB/E-Mail-Vorlage mit `{{Platzhalter}}`-Interpolation
19. ~~ROI-Impact-Panel im Konfigurator~~ ✅ — Live-Amortisation aus Draft-Total
20. ~~DIN A4 PDF-Vorschau in Einstellungen~~ ✅ — `PDFViewer` mit echtem Dokument + Template-Texten
21. ~~White-Label WL1~~ ✅ — `?i=<slug>`, branding JSONB, `useTenantBranding`, Konfigurator branded
22. ~~Preisanhebung~~ ✅ — Installer 179/379/799€, Agency 199/399/699€
23. ~~Vertriebler-Test-Account `vertriebler@test.de`~~ ✅ — Migration 042
24. ~~Migrationen 042–044 deployed~~ ✅ — agency_agent-Constraint, assigned_by, Agency-Settings-Spalten

### Optional offen

- E2E-Smoke-Test manuell: Login → Router → zuweisen → Portal (Inkognito) → annehmen → converted → Commission
- Conversion-Webhook: `VITE_SCOUTLY_WEBHOOK_URL` in Vercel (Make.com)

### Vertriebs-Prioritäten (kritisch!)

3. **3 Beta-Tester onboarden** mit **Pricing-Conversation in Woche 2** (Conversion-Risiko früh adressieren)
4. **Scoutly-Kampagne 1** für Voltify: 200 Solo-Solarteure DE, klare A/B-Test-Hypothese, Tracking
5. **Erfolgs-KPI**: 50 Discovery-Calls in 60 Tagen, 1 zahlender Kunde vor Tag 60

---

## Wichtige Pfade & Befehle

- Dev-Server: `npm run dev` (Port 5173)
- Build: `npm run build` (0 TypeScript-Fehler)
- Tests: `npm test` (121/121 passing)
- Strategie: `Voltify-DNA.md` → Sektion 9 + 10
- Feature-Roadmap: `tasks-VOLTIFY.md` → "🎯 Wettbewerbsanalyse Reonic"
- Partner-Modul: `src/pages/agency/`, `src/services/agency.ts`, `supabase/migrations/039_partner_module.sql`
- Auth: `src/contexts/AuthContext.tsx`
- Services: `src/services/`
- PDF: `src/components/pdf/`
- Edge Functions: `supabase/functions/`

---

## Datenbank

- **Supabase Projekt-Ref:** `ecsqbsgbfmvqaqnryvwf`
- **Migrationen 018–044:** ✅ Ausgeführt
  - 039: `partners`, `lead_assignments`, `commissions` + RLS
  - 040: SECURITY DEFINER RPCs, `agency_slug`, Sales-Agency Role-Constraint
  - 041: (vorherige Session)
  - 042: `agency_agent` Role-Constraint + Vertriebler-Test-Account
  - 043: `lead_assignments.assigned_by` (uuid, nullable, FK → profiles)
  - 044: `profiles.agency_default_commission_type/value`, `agency_notify_on_response`, `agency_website`
- **Migrationen 045–054:** ✅ Ausgeführt (alle live)
  - 045: `offer_drafts` + `offer_line_items` — Angebots-Konfigurator
  - 046: `profiles.agency_tier` + `profiles.agency_partner_limit` — Agency-Tiers
  - 047: `partner_limit_trigger` — harte Partner-Limit-Absicherung
  - 048: `offer_templates` — Vorlagen als JSONB-Spalten `offer_text_template`+`email_template` auf profiles (KEINE eigene Tabelle); Datei nachgezogen ✅
  - 049: `installer_branding` (`installer_slug` + `branding`, `get_installer_branding`) — Datei nachgezogen ✅
  - 050: `resolve_installer_slug` — `?i=<slug>` → installer_id (Datei im Repo ✅)
  - 051: `installer_calc_assumptions` (`profiles.calc_assumptions` + `get_installer_calc_assumptions`) (Datei im Repo ✅)
  - 052: `company_settings_db` (`profiles.company_settings`) — WL2 (Datei im Repo ✅)
  - 053: `solution_check_responses` (Lösungs-Check-Antworten, anon-insert RLS) (Datei im Repo ✅)
  - 054: `erase_lead` RPC (DSGVO Art. 17) + `commissions.lead_id` nullable (Datei im Repo ✅)
- **✅ Drift behoben (2026-06-29):** 042–044, 048, 049 als idempotente Dateien aus dem Live-Schema nachgezogen. Migrations-Ordner lückenlos 030–054 (031 nie vergeben).

## Test-Accounts

| E-Mail               | Rolle          | Passwort     | Hinweis                                                                                    |
| -------------------- | -------------- | ------------ | ------------------------------------------------------------------------------------------ |
| installateur@test.de | super_employee | Test123456   |                                                                                            |
| inhaber@test.de      | owner          | Test123456   |                                                                                            |
| agentur@test.de      | sales_agency   | Test123456   | Solar Vertrieb GmbH, slug `solar-vertrieb-gmbh`                                            |
| vertriebler@test.de  | agency_agent   | Test123456   | owner_id = agentur@test.de                                                                 |
| ag@sunwinwin.de      | owner          | Voltify2026! | **ERSTER ECHTER TEST-KUNDE** — Ali Galioglu, Firma sunwinwin, `installer_slug = sunwinwin` |

---

## Stop-Loss-Datum: 2026-11-25 (Tag 180)

Wenn dann: < 3 zahlende Kunden ODER Beta-zu-Paid < 10 % ODER Scoutly-Response < 1 %
→ Ehrliche Retro + Pivot-Entscheidung (Konfigurator-als-Service, adjacent Vertikale, oder Pause).

---

## Aktive Map

`docs/maps/map-seitenbaum.md`
