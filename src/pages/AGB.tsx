import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { LOGO_PATH } from "../lib/branding";

const SECTIONS = [
  {
    id: "1",
    title: "Geltungsbereich",
    content: [
      "Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Softwareplattform Solvary sowie für alle damit verbundenen Dienstleistungen.",
      "Mit der Registrierung oder Nutzung unserer Plattform akzeptieren Sie diese AGB in vollem Umfang. Abweichende Bedingungen des Nutzers werden nicht anerkannt.",
      "Solvary ist eine Softwarelösung zur Lead-Erfassung, Angebots- und Projektmanagement für Installateure und Projektentwickler im Bereich erneuerbare Energien.",
    ],
  },
  {
    id: "2",
    title: "Vertragsschluss & Registrierung",
    content: [
      "Die Registrierung auf Solvary ist kostenlos und erfolgt durch Angabe einer gültigen E-Mail-Adresse und Erstellung eines Passworts.",
      "Der Vertrag kommt mit erfolgreicher Registrierung zustande. Es besteht kein Anspruch auf Abschluss eines Vertrags.",
      "Jeder Nutzer ist verpflichtet, wahrheitsgemäße Angaben zu machen und diese bei Änderungen zeitnah zu aktualisieren.",
      "Die Übertragung von Zugangsdaten an Dritte ist untersagt. Jeder Nutzer haftet für die sichere Aufbewahrung seiner Anmeldedaten.",
    ],
  },
  {
    id: "3",
    title: "Leistungsbeschreibung",
    content: [
      "Solvary stellt eine cloudbasierte Softwareplattform zur Verfügung, die folgende Funktionen umfasst: Lead-Management, Kalender & Terminplanung, Angebots- und Rechnungsgenerierung, Teamverwaltung, Reporting sowie einen öffentlichen Solar-Konfigurator.",
      "Die Verfügbarkeit der Plattform wird mit 99,5% pro Monat angestrebt. Wartungsarbeiten werden möglichst außerhalb der Geschäftszeiten durchgeführt und im Voraus angekündigt.",
      "Solvary befindet sich in aktiver Weiterentwicklung. Wir behalten uns das Recht vor, Funktionen zu erweitern, zu ändern oder einzustellen, sofern dies die vertragsgemäße Nutzung nicht wesentlich beeinträchtigt.",
    ],
  },
  {
    id: "4",
    title: "Preise & Zahlungsbedingungen",
    content: [
      "Die Nutzung von Solvary erfolgt auf Basis der gewählten Tarife (Starter, Professional, Enterprise). Alle Preise verstehen sich monatlich in Euro zuzüglich der gesetzlich geltenden Umsatzsteuer.",
      "Die Abrechnung erfolgt monatlich im Voraus. Bei Vertragsbeginn wird der anteilige Betrag für den laufenden Monat berechnet.",
      "Die Zahlung erfolgt per SEPA-Lastschrift oder Überweisung auf das von Solvary angegebene Konto innerhalb von 14 Tagen nach Rechnungsstellung.",
      "Bei Zahlungsverzug nach erfolgter Mahnung behält sich Solvary vor, den Zugang zur Plattform vorübergehend zu sperren.",
    ],
  },
  {
    id: "5",
    title: "Datenschutz & Datensicherheit",
    content: [
      "Die Erhebung, Verarbeitung und Nutzung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den geltenden Datenschutzgesetzen (DSGVO).",
      "Solvary ergreift angemessene technische und organisatorische Maßnahmen zum Schutz der gespeicherten Daten vor Verlust, Manipulation und unbefugtem Zugriff.",
      "Nutzerdaten werden ausschließlich auf Servern innerhalb der EU gespeichert. Eine Datenweitergabe an Dritte erfolgt nur im gesetzlich erlaubten Rahmen oder mit ausdrücklicher Einwilligung des Nutzers.",
    ],
  },
  {
    id: "6",
    title: "Rechte & Pflichten des Nutzers",
    content: [
      "Der Nutzer erhält ein nicht übertragbares, zeitlich auf die Vertragslaufzeit beschränktes Nutzungsrecht an der Plattform.",
      "Es ist untersagt, die Plattform für rechtswidrige Zwecke zu nutzen, Viren oder schädliche Software hochzuladen oder die Sicherheit der Plattform zu gefährden.",
      "Der Nutzer ist verantwortlich für die von ihm eingegebenen Inhalte (Kundendaten, Angebote, Rechnungen) und stellt Solvary von entsprechenden Drittforderungen frei.",
      "Eine automatisierte oder manuelle Datenerfassung (Scraping) der Plattform ist ohne ausdrückliche Genehmigung untersagt.",
    ],
  },
  {
    id: "7",
    title: "Haftung",
    content: [
      "Solvary haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit, sowie für die Verletzung des Lebens, des Körpers oder der Gesundheit.",
      "Bei leichter Fahrlässigkeit haftet Solvary nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten). Die Haftung ist in diesem Fall auf den vorhersehbaren, typischerweise eintretenden Schaden begrenzt.",
      "Solvary übernimmt keine Haftung für die Richtigkeit von Berechnungen des Solar-Konfigurators. Alle Angaben zu Ersparnis, Amortisation und Gewinn sind Prognosen auf Basis von Standardannahmen.",
      "Eine Haftung für Datenverlust ist auf die Kosten einer angemessenen Datenwiederherstellung beschränkt, sofern der Verlust nicht vorsätzlich oder grob fahrlässig verursacht wurde.",
    ],
  },
  {
    id: "8",
    title: "Vertragslaufzeit & Kündigung",
    content: [
      "Der Vertrag läuft auf unbestimmte Zeit und kann von beiden Parteien jederzeit zum Ende des laufenden Abrechnungszeitraums gekündigt werden.",
      "Die Kündigung erfolgt schriftlich per E-Mail an kontakt@solvary.de oder über die Kündigungsfunktion in den Account-Einstellungen.",
      "Nach Kündigung werden die Nutzerdaten 90 Tage aufbewahrt und anschließend DSGVO-konform gelöscht. Der Nutzer ist für einen rechtzeitigen Export seiner Daten verantwortlich.",
      "Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.",
    ],
  },
  {
    id: "9",
    title: "Änderung der AGB",
    content: [
      "Solvary behält sich das Recht vor, diese AGB jederzeit zu ändern. Änderungen werden dem Nutzer per E-Mail mitgeteilt und gelten als akzeptiert, sofern der Nutzer nicht innerhalb von 14 Tagen widerspricht.",
      "Bei wesentlichen Änderungen wird der Nutzer gesondert auf das Widerspruchsrecht hingewiesen.",
    ],
  },
  {
    id: "10",
    title: "Schlussbestimmungen",
    content: [
      "Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.",
      "Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist der Geschäftssitz des Betreibers von Solvary, sofern der Nutzer Kaufmann ist.",
      "Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt der Vertrag im Übrigen wirksam. Die unwirksame Bestimmung wird durch eine wirksame ersetzt, die dem wirtschaftlichen Zweck möglichst nahekommt.",
    ],
  },
];

export default function AGB() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_PATH} alt="Solvary" className="h-7 w-auto" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[800px] mx-auto px-6 py-12">
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 bg-brand-secondary/10 text-brand-secondary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <FileText className="w-3.5 h-3.5" />
            Rechtliches
          </span>
          <h1 className="text-3xl font-bold text-brand-secondary mb-2">
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="text-gray-500 text-sm">
            Stand: September 2026 · Solvary
          </p>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.id} id={`section-${section.id}`}>
              <h2 className="text-lg font-bold text-brand-secondary mb-3">
                § {section.id} {section.title}
              </h2>
              <div className="space-y-2">
                {section.content.map((paragraph, i) => (
                  <p key={i} className="text-sm text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h2 className="text-lg font-bold text-brand-secondary mb-3">
            Kontakt
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            Bei Fragen zu diesen AGB können Sie uns jederzeit kontaktieren:
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-brand-secondary space-y-1">
            <p>
              <strong className="font-bold">Solvary</strong>
            </p>
            <p>Van Anh Kasem</p>
            <p>Auf dem Gleichen 18</p>
            <p>65934 Frankfurt am Main</p>
            <p className="pt-1">
              E-Mail:{" "}
              <a
                href="mailto:kontakt@solvary.de"
                className="font-semibold text-brand-secondary underline decoration-brand-primary decoration-2 underline-offset-2 hover:decoration-4"
              >
                kontakt@solvary.de
              </a>
            </p>
            <p>
              Web:{" "}
              <a
                href="https://solvary.de"
                className="font-semibold text-brand-secondary underline decoration-brand-primary decoration-2 underline-offset-2 hover:decoration-4"
              >
                solvary.de
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-6">
        <div className="max-w-[800px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 Solvary. Alle Rechte vorbehalten.</p>
          <div className="flex gap-4">
            <Link
              to="/datenschutz"
              className="hover:text-brand-secondary transition-colors"
            >
              Datenschutz
            </Link>
            <Link
              to="/impressum"
              className="hover:text-brand-secondary transition-colors"
            >
              Impressum
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
