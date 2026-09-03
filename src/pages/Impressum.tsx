import { Link } from "react-router-dom";
import { Mail, ExternalLink } from "lucide-react";
import { LOGO_PATH } from "../lib/branding";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_PATH} alt="Solvary" className="h-7 w-auto" />
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-brand-secondary transition-colors"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 bg-brand-secondary/10 text-brand-secondary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            Rechtliches
          </span>
          <h1 className="text-3xl font-bold text-brand-secondary mb-3">
            Impressum
          </h1>
          <p className="text-gray-500">Angaben gemäß § 5 DDG</p>
        </div>

        <div className="space-y-10">
          {/* Angaben gemäß § 5 DDG */}
          <section>
            <h2 className="text-xl font-bold text-brand-secondary mb-4">
              Betreiber der Website
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-brand-secondary">
              <p className="font-bold text-lg">Solvary</p>
              <p className="mb-2">Van Anh Kasem</p>
              <p>Auf dem Gleichen 18</p>
              <p>65934 Frankfurt am Main</p>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-secondary" />
                  <a
                    href="mailto:kontakt@solvary.de"
                    className="font-semibold text-brand-secondary underline decoration-brand-primary decoration-2 underline-offset-2 hover:decoration-4"
                  >
                    kontakt@solvary.de
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Verantwortlich für Inhalte */}
          <section>
            <h2 className="text-xl font-bold text-brand-secondary mb-4">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-brand-secondary">
              <p className="font-medium">Van Anh Kasem</p>
              <p>Auf dem Gleichen 18</p>
              <p>65934 Frankfurt am Main</p>
            </div>
          </section>

          {/* Streitschlichtung */}
          <section>
            <h2 className="text-xl font-bold text-brand-secondary mb-4">
              Streitschlichtung
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:
            </p>
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-brand-secondary underline decoration-brand-primary decoration-2 underline-offset-2 hover:decoration-4 mt-2"
            >
              https://ec.europa.eu/consumers/odr{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-gray-600 leading-relaxed mt-3">
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </section>

          {/* Haftung für Inhalte */}
          <section>
            <h2 className="text-xl font-bold text-brand-secondary mb-4">
              Haftung für Inhalte
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die
              auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon
              unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
              Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
              Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
              diese Inhalte umgehend entfernen.
            </p>
          </section>

          {/* Haftung für Links */}
          <section>
            <h2 className="text-xl font-bold text-brand-secondary mb-4">
              Haftung für Links
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
              wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
              überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar.
            </p>
          </section>

          {/* Urheberrecht */}
          <section>
            <h2 className="text-xl font-bold text-brand-secondary mb-4">
              Urheberrecht
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht
              kommerziellen Gebrauch gestattet.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
          <p>© 2026 Solvary</p>
          <div className="flex items-center gap-4">
            <Link
              to="/impressum"
              className="hover:text-brand-secondary transition-colors"
            >
              Impressum
            </Link>
            <Link
              to="/datenschutz"
              className="hover:text-brand-secondary transition-colors"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
