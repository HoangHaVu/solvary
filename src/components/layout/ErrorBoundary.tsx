// PROJECT: Voltify | PURPOSE: Faengt Render-Fehler ab, damit die App nicht komplett tot ist (Logout/Navigation bleiben erreichbar)

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  info: ErrorInfo | null;
}

/**
 * Ohne ErrorBoundary wirft React bei einem Render-Fehler den kompletten Baum weg —
 * die Seite friert optisch im letzten Frame ein und selbst der Logout ist tot.
 * Diese Boundary zeigt stattdessen den echten Fehler + einen Ausweg.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Bleibt in der Konsole sichtbar, damit der Stack analysierbar ist.
    console.error("[ErrorBoundary]", error, info.componentStack);
    this.setState({ info });
  }

  render() {
    const { error, info } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] p-6 text-white">
        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-brand-secondary-hover p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary">
              <AlertTriangle className="h-5 w-5 text-brand-secondary" />
            </span>
            <div>
              <h1 className="text-lg font-bold">Da ist etwas schiefgelaufen</h1>
              <p className="text-sm text-gray-400">
                Die Ansicht konnte nicht geladen werden.
              </p>
            </div>
          </div>

          <pre className="mb-6 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-black/40 p-4 text-xs text-red-300">
            {error.message}
            {info?.componentStack}
          </pre>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => this.setState({ error: null, info: null })}
              className="rounded-full bg-white px-5 py-3 text-sm font-bold text-brand-secondary transition-all hover:bg-gray-100"
            >
              Nochmal versuchen
            </button>
            <a
              href="/admin"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-white/5"
            >
              Zum Dashboard
            </a>
            <a
              href="/login"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-white/5"
            >
              Zum Login
            </a>
          </div>
        </div>
      </div>
    );
  }
}
