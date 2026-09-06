import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LandingPage from "@/pages/LandingPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

vi.mock("gsap", () => {
  const gsapMock = {
    registerPlugin: vi.fn(),
    from: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    context: vi.fn(() => ({
      revert: vi.fn(),
    })),
    utils: {
      toArray: vi.fn(() => []),
    },
  };
  return { gsap: gsapMock, default: gsapMock };
});

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
  },
}));

vi.mock("@/components/seo/SEO", () => ({
  default: () => null,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LandingPage", () => {
  it("rendert den Hero-Bereich mit Haupt-CTA", () => {
    render(<LandingPage />);

    expect(screen.getByText(/Solar-Angebote/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Jetzt Beta-Partner werden/i })
        .length,
    ).toBeGreaterThan(0);
  });

  it("navigiert zu /beta beim Klick auf Kostenlos testen (Hero)", () => {
    render(<LandingPage />);

    const ctaButton = screen.getAllByRole("button", {
      name: /Jetzt Beta-Partner werden/i,
    })[0];
    fireEvent.click(ctaButton);

    expect(mockNavigate).toHaveBeenCalledWith("/beta");
  });

  it("rendert die 3 Produkt-Kacheln", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: "Solar-Konfigurator" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "CRM & Dashboard" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Digitaler Auftritt" }),
    ).toBeInTheDocument();
  });

  it('navigiert zu /login beim Klick auf "Demo-Account testen" (CRM-Kachel)', () => {
    render(<LandingPage />);

    const crmButton = screen.getByRole("button", {
      name: /Demo-Account testen/i,
    });
    fireEvent.click(crmButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("rendert die FAQ-Sektion mit mindestens einer Frage", () => {
    render(<LandingPage />);

    expect(
      screen.getByText(/Häufige Fragen, klar beantwortet/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Was kostet Solvary\?/i)).toBeInTheDocument();
  });

  it("navigiert zu /demo beim Klick auf Demo-Webseite ansehen", () => {
    render(<LandingPage />);

    const demoButton = screen.getByRole("button", {
      name: /Demo-Webseite ansehen/i,
    });
    fireEvent.click(demoButton);

    expect(mockNavigate).toHaveBeenCalledWith("/demo");
  });

  it("rendert die Stats-Bar", () => {
    render(<LandingPage />);

    expect(screen.getByText("3 Monate")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getAllByText("50%+")[0]).toBeInTheDocument();
    expect(screen.getByText("Sofort")).toBeInTheDocument();
  });

  it("rendert den Footer mit rechtlichen Links", () => {
    render(<LandingPage />);

    expect(screen.getAllByText("Datenschutz").length).toBeGreaterThan(0);
    expect(screen.getByText("AGB")).toBeInTheDocument();
  });
});
