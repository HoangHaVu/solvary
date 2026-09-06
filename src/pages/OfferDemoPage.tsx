// PROJECT: Voltify | PURPOSE: Öffentlicher, voll editierbarer Demo-Flow des Angebotskonfigurators
// Bildet src/pages/OfferBuilderPage.tsx + den Vorlagen-Tab aus AdminSettings nach — ohne Backend.
// Verlinkt von der "Angebotskonfigurator"-Kachel auf /produkte (ProductsStackSection).
// Helles Styling analog zum Solar-Konfigurator (/konfigurator).

import { useMemo, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  ArrowRight,
  Plus,
  Trash2,
  Save,
  Send,
  FileText,
  CheckCircle,
  Loader2,
  Percent,
  Tag,
  Package,
  ChevronDown,
  Zap,
  BatteryCharging,
  Wrench,
  Cable,
  HardHat,
  Car,
  GripVertical,
  Eye,
  ClipboardList,
  Coins,
  Mail,
} from "lucide-react";
import SEO from "../components/seo/SEO";
import { SectionTag } from "../components/ui/SectionTag";
import { PillButton } from "../components/ui/PillButton";
import { LOGO_PATH } from "../lib/branding";
import { COLORS } from "../lib/theme";
import OfferPdfDocument, {
  type CompanySettings,
} from "../components/pdf/OfferPdfDocument";
import type { Lead, OfferDraft, OfferLineItem } from "../services/data";
import {
  buildDefaultLineItems,
  CATEGORY_LABELS,
  interpolateTemplate,
  DEFAULT_OFFER_TEXT_TEMPLATE,
  DEFAULT_EMAIL_TEMPLATE,
  generateOfferNumber,
  type OfferTextTemplate,
  type EmailTemplate,
} from "../services/offers";

// ─── Demo-Stammdaten ──────────────────────────────────────────────────

const DEMO_LEAD = {
  id: "demo-lead-0001",
  first_name: "Familie",
  last_name: "Berger",
  email: "familie.berger@example.de",
  phone: "+49 711 1234567",
  zip: "70173",
  kwp: 9.8,
  roof_area: 62,
  roof_orientation: "Süd",
  has_battery: true,
  has_e_car: true,
  has_heat_pump: false,
  annual_savings: 2100,
  autarky: 71,
  amortization: null,
  profit_20_years: null,
  investment: null,
  final_price: null,
  discount_code: null,
  discount_percentage: null,
} as unknown as Lead;

const DEMO_COMPANY: CompanySettings = {
  firmenname: "Solar Muster GmbH",
  slogan: "Ihre Solaranlage — ehrlich gerechnet.",
  logoDataUrl: "",
  primaryColor: COLORS.secondary,
  accentColor: COLORS.primary,
  iban: "DE12 3456 7890 1234 5678 90",
  zahlungsziel: "14",
  steuernummer: "93815/12345",
  adresse: "Musterstraße 12",
  ort: "70173 Stuttgart",
  geschaeftsfuehrer: "Sabine Muster",
  rechnungskreis: "RE",
  panelHersteller: "Meyer Burger",
  wechselrichterHersteller: "Fronius",
};

const DEMO_DISCOUNT_CODES = [
  { id: "c1", code: "SOLAR5", percentage: 5 },
  { id: "c2", code: "SOLAR10", percentage: 10 },
  { id: "c3", code: "NEUKUNDE", percentage: 8 },
];

// ─── Kleine Helfer (aus OfferBuilderPage übernommen) ──────────────────

const CATEGORY_ICONS: Record<OfferLineItem["category"], React.ElementType> = {
  module: Zap,
  inverter: Zap,
  storage: BatteryCharging,
  mounting: HardHat,
  electrical: Cable,
  scaffolding: Wrench,
  travel: Car,
  other: Package,
};

const STATUS_COLORS: Record<OfferDraft["status"], string> = {
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  sent: "bg-blue-50 text-blue-600 border-blue-200",
  accepted: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

// Shared input styling (light)
const INPUT =
  "bg-white border border-gray-200 text-brand-secondary rounded-lg outline-none focus:border-gray-400 focus:ring-2 focus:ring-brand-secondary/10 placeholder:text-gray-400";

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "0 €";
  return value.toLocaleString("de-DE") + " €";
}

function createDemoItem(sortOrder: number): OfferLineItem {
  return {
    id: crypto.randomUUID(),
    offer_draft_id: "demo",
    category: "other",
    description: "",
    quantity: 1,
    unit: "Stk",
    unit_price: 0,
    total_price: 0,
    is_optional: false,
    sort_order: sortOrder,
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────

interface DemoState {
  status: OfferDraft["status"];
  notes: string;
  discountPercentage: number;
  discountAmount: number;
  discountCode: string | null;
  lineItems: OfferLineItem[];
  textTemplate: OfferTextTemplate;
  emailTemplate: EmailTemplate;
}

type DemoAction =
  | { type: "ADD_ITEM" }
  | {
      type: "UPDATE_ITEM";
      id: string;
      field: keyof OfferLineItem;
      value: string | number | boolean;
    }
  | { type: "DELETE_ITEM"; id: string }
  | { type: "REORDER"; items: OfferLineItem[] }
  | { type: "APPLY_CODE"; code: string; percentage: number }
  | { type: "APPLY_MANUAL"; percentage: number; amount: number }
  | { type: "REMOVE_DISCOUNT" }
  | { type: "SET_NOTES"; value: string }
  | {
      type: "SET_TEXT";
      field: keyof OfferTextTemplate;
      value: string | boolean;
    }
  | { type: "SET_EMAIL"; field: keyof EmailTemplate; value: string }
  | { type: "MARK_SENT" };

function withTotal(item: OfferLineItem): OfferLineItem {
  return {
    ...item,
    total_price: Math.round((item.quantity || 0) * (item.unit_price || 0)),
  };
}

function initState(): DemoState {
  const lineItems = buildDefaultLineItems(DEMO_LEAD).map((item, i) => ({
    ...item,
    id: crypto.randomUUID(),
    offer_draft_id: "demo",
    sort_order: i + 1,
  }));
  return {
    status: "draft",
    notes: "",
    discountPercentage: 0,
    discountAmount: 0,
    discountCode: null,
    lineItems,
    textTemplate: { ...DEFAULT_OFFER_TEXT_TEMPLATE },
    emailTemplate: { ...DEFAULT_EMAIL_TEMPLATE },
  };
}

function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        lineItems: [
          ...state.lineItems,
          createDemoItem(state.lineItems.length + 1),
        ],
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        lineItems: state.lineItems.map((i) =>
          i.id === action.id
            ? withTotal({ ...i, [action.field]: action.value })
            : i,
        ),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        lineItems: state.lineItems.filter((i) => i.id !== action.id),
      };
    case "REORDER":
      return {
        ...state,
        lineItems: action.items.map((i, idx) => ({
          ...i,
          sort_order: idx + 1,
        })),
      };
    case "APPLY_CODE":
      return {
        ...state,
        discountCode: action.code,
        discountPercentage: action.percentage,
        discountAmount: 0,
      };
    case "APPLY_MANUAL":
      return {
        ...state,
        discountCode: null,
        discountPercentage: action.percentage,
        discountAmount: action.amount,
      };
    case "REMOVE_DISCOUNT":
      return {
        ...state,
        discountCode: null,
        discountPercentage: 0,
        discountAmount: 0,
      };
    case "SET_NOTES":
      return { ...state, notes: action.value };
    case "SET_TEXT":
      return {
        ...state,
        textTemplate: { ...state.textTemplate, [action.field]: action.value },
      };
    case "SET_EMAIL":
      return {
        ...state,
        emailTemplate: { ...state.emailTemplate, [action.field]: action.value },
      };
    case "MARK_SENT":
      return { ...state, status: "sent" };
    default:
      return state;
  }
}

// ─── Teaser-Kopf ──────────────────────────────────────────────────────

const PROCESS_STEP_ICONS = [ClipboardList, Package, Coins, Mail];

function DemoTeaser() {
  const { t } = useTranslation();
  const processSteps = t('offerDemo.processSteps', { returnObjects: true }) as string[];
  const featureChips = t('offerDemo.featureChips', { returnObjects: true }) as string[];
  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <SectionTag>{t('offerDemo.teaser.tag')}</SectionTag>
          <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-500">
            <Eye className="h-3.5 w-3.5 shrink-0" />
            {t('offerDemo.teaser.badge')}
          </span>
        </div>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold text-brand-secondary tracking-tight">
          {t('offerDemo.teaser.headline')}
        </h1>
        <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-500 leading-relaxed">
          {t('offerDemo.teaser.body')}
        </p>

        {/* Prozessleiste */}
        <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
          {PROCESS_STEP_ICONS.map((StepIcon, i) => (
            <div key={processSteps[i]} className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-black text-brand-secondary">
                  {i + 1}
                </span>
                <StepIcon className="h-3.5 w-3.5 text-brand-secondary" />
                <span className="text-xs font-bold text-gray-700">
                  {processSteps[i]}
                </span>
              </div>
              {i < PROCESS_STEP_ICONS.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* Feature-Chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {featureChips.map((chip) => (
            <span
              key={chip}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600"
            >
              {chip}
            </span>
          ))}
        </div>

        <p className="mt-5 flex items-center gap-2 text-[11px] text-gray-400">
          <Eye className="h-3.5 w-3.5" />
          {t('offerDemo.teaser.disclaimer')}
        </p>
      </div>
    </div>
  );
}

// ─── Hauptseite ───────────────────────────────────────────────────────

export default function OfferDemoPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [state, dispatch] = useReducer(reducer, undefined, initState);
  const offerNumber = useMemo(() => generateOfferNumber(DEMO_LEAD), []);

  const [savedFlash, setSavedFlash] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);

  // Rabatt-Eingaben
  const [selectedCodeId, setSelectedCodeId] = useState("");
  const [manualDiscountPct, setManualDiscountPct] = useState("");
  const [manualDiscountAmount, setManualDiscountAmount] = useState("");

  // Drag & Drop
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Sende-Modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendEmail, setSendEmail] = useState(DEMO_LEAD.email);
  const [sendSubject, setSendSubject] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const vatRate = 0;

  // ── Live-Berechnung (Formel wie OfferBuilderPage) ──
  const calculated = useMemo(() => {
    const subtotal = state.lineItems.reduce(
      (sum, item) => sum + (item.total_price || 0),
      0,
    );
    const discount =
      state.discountPercentage > 0
        ? Math.round(subtotal * (state.discountPercentage / 100))
        : state.discountAmount || 0;
    const net = Math.max(0, subtotal - discount);
    const vat = Math.round((net * vatRate) / 100);
    return { subtotal, discount, vat, total: net + vat };
  }, [state.lineItems, state.discountPercentage, state.discountAmount]);

  const roiImpact = useMemo(() => {
    const investment = calculated.total;
    const savings = DEMO_LEAD.annual_savings;
    if (!savings || savings <= 0 || investment <= 0) return null;
    const amortization = parseFloat((investment / savings).toFixed(1));
    const profit20 = Math.round(savings * 20 - investment);
    return {
      amortization,
      annualSavings: savings,
      profit20,
      autarky: DEMO_LEAD.autarky,
      kwp: DEMO_LEAD.kwp,
    };
  }, [calculated.total]);

  // ── PDF-Draft ──
  const draftForPdf: OfferDraft = useMemo(() => {
    const now = new Date().toISOString();
    return {
      id: "demo",
      lead_id: DEMO_LEAD.id,
      created_by: "demo",
      status: state.status,
      subtotal: calculated.subtotal,
      discount_amount: calculated.discount,
      discount_percentage: state.discountPercentage,
      discount_code: state.discountCode,
      discount_note: null,
      vat_rate: vatRate,
      vat_amount: calculated.vat,
      total: calculated.total,
      notes: state.notes,
      offer_number: offerNumber,
      sent_at: state.status === "sent" ? now : null,
      accepted_at: null,
      rejected_at: null,
      created_at: now,
      updated_at: now,
      line_items: state.lineItems,
    };
  }, [state, calculated, offerNumber]);

  // ── Vorlagen-Variablen für den Sende-Dialog ──
  function templateVars(): Record<string, string> {
    return {
      vorname: DEMO_LEAD.first_name,
      nachname: DEMO_LEAD.last_name,
      angebotsnummer: offerNumber,
      firmenname: DEMO_COMPANY.firmenname,
      datum: new Date().toLocaleDateString("de-DE"),
      gueltig_bis: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString("de-DE"),
      zahlungsziel: DEMO_COMPANY.zahlungsziel || "14",
    };
  }

  function openSendModal() {
    const vars = templateVars();
    setSendSubject(interpolateTemplate(state.emailTemplate.betreff, vars));
    setSendMessage(interpolateTemplate(state.emailTemplate.nachricht, vars));
    setSendSuccess(false);
    setShowSendModal(true);
  }

  function handleSimulatedSend() {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSendSuccess(true);
      dispatch({ type: "MARK_SENT" });
      setTimeout(() => setShowSendModal(false), 2200);
    }, 1200);
  }

  function handleSaveFlash() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  }

  // ── Rabatt-Handler ──
  function applyCode() {
    const code = DEMO_DISCOUNT_CODES.find((c) => c.id === selectedCodeId);
    if (!code) return;
    dispatch({
      type: "APPLY_CODE",
      code: code.code,
      percentage: code.percentage,
    });
    setSelectedCodeId("");
    setManualDiscountPct("");
    setManualDiscountAmount("");
  }

  function applyManual() {
    const pct = manualDiscountPct ? Number(manualDiscountPct) : 0;
    const amount = manualDiscountAmount ? Number(manualDiscountAmount) : 0;
    dispatch({ type: "APPLY_MANUAL", percentage: pct, amount });
  }

  function removeDiscount() {
    dispatch({ type: "REMOVE_DISCOUNT" });
    setManualDiscountPct("");
    setManualDiscountAmount("");
    setSelectedCodeId("");
  }

  // ── Drag & Drop ──
  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const items = [...state.lineItems];
    const [moved] = items.splice(dragIndex, 1);
    items.splice(targetIndex, 0, moved);
    dispatch({ type: "REORDER", items });
    setDragIndex(null);
    setDragOverIndex(null);
  }

  const hasDiscount = calculated.discount > 0;

  return (
    <div className="min-h-screen bg-brand-bg-alt text-brand-secondary">
      <SEO
        title={t('offerDemo.seo.title')}
        description={t('offerDemo.seo.description')}
        canonical="/angebot-demo"
        og={{ type: "website" }}
      />

      {/* Top-Bar mit Logo */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center">
            <img src={LOGO_PATH} alt="Solvary" className="h-8 w-auto" />
          </Link>
          <PillButton variant="primary" onClick={() => navigate("/beta")}>
            {t('offerDemo.topCta')}
          </PillButton>
        </div>
      </header>

      <DemoTeaser />

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-secondary">
                {t('offerDemo.title')}
              </h2>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${STATUS_COLORS[state.status]}`}
              >
                {t(`offerDemo.status.${state.status}`)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {DEMO_LEAD.first_name} {DEMO_LEAD.last_name} · {DEMO_LEAD.email} ·{" "}
              {DEMO_LEAD.zip}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveFlash}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-brand-secondary font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              {savedFlash ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {savedFlash ? t('offerDemo.saved') : t('offerDemo.saveDraft')}
            </button>
            {state.status === "draft" && (
              <button
                onClick={openSendModal}
                className="flex items-center gap-2 bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
                {t('offerDemo.sendOffer')}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Linke Spalte: Positionen */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  {t('offerDemo.positions.title')}
                </h3>
                <button
                  onClick={() => dispatch({ type: "ADD_ITEM" })}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-secondary hover:opacity-60 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t('offerDemo.positions.add')}
                </button>
              </div>

              {/* Spalten-Header */}
              <div
                className="grid items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50"
                style={{
                  gridTemplateColumns:
                    "36px minmax(160px, 1.5fr) 80px 76px 110px 100px 40px",
                }}
              >
                <div className="pl-3 py-3" />
                <div className="px-3 py-3">{t('offerDemo.columns.category')}</div>
                <div className="px-3 py-3 text-right">{t('offerDemo.columns.quantity')}</div>
                <div className="px-3 py-3">{t('offerDemo.columns.unit')}</div>
                <div className="px-3 py-3 text-right">{t('offerDemo.columns.unitPrice')}</div>
                <div className="px-3 py-3 text-right">{t('offerDemo.columns.total')}</div>
                <div className="pr-3 py-3" />
              </div>

              {state.lineItems.map((item, index) => {
                const Icon = CATEGORY_ICONS[item.category];
                const isDragging = dragIndex === index;
                const isDragOver =
                  dragOverIndex === index && dragIndex !== index;
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverIndex(index);
                    }}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    className={[
                      "border-b border-gray-100 transition-colors",
                      isDragging ? "opacity-40" : "hover:bg-gray-50",
                      isDragOver
                        ? "ring-1 ring-inset ring-brand-primary/60 bg-brand-primary/[0.06]"
                        : "",
                    ].join(" ")}
                  >
                    <div
                      className="grid items-center pt-3 pb-1"
                      style={{
                        gridTemplateColumns:
                          "36px minmax(160px, 1.5fr) 80px 76px 110px 100px 40px",
                      }}
                    >
                      <div className="pl-3 flex items-center">
                        <GripVertical className="w-4 h-4 text-gray-300 cursor-grab active:cursor-grabbing" />
                      </div>
                      <div className="px-3">
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-4 h-4 text-brand-secondary shrink-0" />
                          <select
                            value={item.category}
                            onChange={(e) =>
                              dispatch({
                                type: "UPDATE_ITEM",
                                id: item.id,
                                field: "category",
                                value: e.target.value,
                              })
                            }
                            className={`w-full text-xs px-2 py-1.5 ${INPUT}`}
                          >
                            {Object.entries(CATEGORY_LABELS).map(
                              ([key]) => (
                                <option key={key} value={key}>
                                  {t(`offerDemo.categories.${key}`)}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </div>
                      <div className="px-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_ITEM",
                              id: item.id,
                              field: "quantity",
                              value: Number(e.target.value),
                            })
                          }
                          className={`w-full text-xs px-2 py-1.5 text-right ${INPUT}`}
                          min={0}
                          step="0.01"
                        />
                      </div>
                      <div className="px-3">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_ITEM",
                              id: item.id,
                              field: "unit",
                              value: e.target.value,
                            })
                          }
                          className={`w-full text-xs px-2 py-1.5 ${INPUT}`}
                        />
                      </div>
                      <div className="px-3">
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_ITEM",
                              id: item.id,
                              field: "unit_price",
                              value: Number(e.target.value),
                            })
                          }
                          className={`w-full text-xs px-2 py-1.5 text-right ${INPUT}`}
                          min={0}
                          step="1"
                        />
                      </div>
                      <div className="px-3 text-right font-bold text-brand-secondary whitespace-nowrap text-sm">
                        {formatCurrency(item.total_price)}
                      </div>
                      <div className="pr-3 flex items-center justify-center">
                        <button
                          onClick={() =>
                            dispatch({ type: "DELETE_ITEM", id: item.id })
                          }
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title={t('offerDemo.item.deleteTitle')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div
                      className="pb-3"
                      style={{ paddingLeft: "70px", paddingRight: "52px" }}
                    >
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_ITEM",
                            id: item.id,
                            field: "description",
                            value: e.target.value,
                          })
                        }
                        placeholder={t('offerDemo.item.placeholder')}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-lg px-3 py-2 outline-none focus:border-gray-400 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                );
              })}

              {state.lineItems.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">{t('offerDemo.positions.empty.title')}</p>
                  <button
                    onClick={() => dispatch({ type: "ADD_ITEM" })}
                    className="mt-3 text-xs font-bold text-brand-secondary hover:opacity-60 transition-opacity"
                  >
                    {t('offerDemo.positions.empty.addFirst')}
                  </button>
                </div>
              )}
            </div>

            {/* Notizen */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                {t('offerDemo.notes.title')}
              </h3>
              <textarea
                value={state.notes}
                onChange={(e) =>
                  dispatch({ type: "SET_NOTES", value: e.target.value })
                }
                rows={3}
                className={`w-full text-sm px-4 py-3 resize-none ${INPUT}`}
                placeholder={t('offerDemo.notes.placeholder')}
              />
            </div>

            {/* Textbausteine-Panel (aus den Einstellungen) */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setTemplatesOpen((o) => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-brand-secondary" />
                  <div>
                    <h3 className="text-sm font-bold text-brand-secondary">
                      {t('offerDemo.templates.title')}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {t('offerDemo.templates.subtitle')}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${templatesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {templatesOpen && (
                <div className="px-5 pb-6 space-y-5 border-t border-gray-100 pt-5">
                  {/* Platzhalter */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                      {t('offerDemo.templates.placeholdersTitle')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(t('offerDemo.templates.placeholders', { returnObjects: true }) as { token: string; label: string }[]).map(({ token, label }) => (
                        <div
                          key={token}
                          className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1"
                        >
                          <code className="text-[10px] text-brand-secondary font-mono">
                            {token}
                          </code>
                          <span className="text-[10px] text-gray-400">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <TemplateField
                    label={t('offerDemo.templates.anschreibenLabel')}
                    hint={t('offerDemo.templates.anschreibenHint')}
                    value={state.textTemplate.anschreiben}
                    onChange={(v) =>
                      dispatch({
                        type: "SET_TEXT",
                        field: "anschreiben",
                        value: v,
                      })
                    }
                    rows={4}
                  />
                  <TemplateField
                    label={t('offerDemo.templates.zahlungsbedingungenLabel')}
                    value={state.textTemplate.zahlungsbedingungen}
                    onChange={(v) =>
                      dispatch({
                        type: "SET_TEXT",
                        field: "zahlungsbedingungen",
                        value: v,
                      })
                    }
                    rows={4}
                  />
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-xs font-medium text-gray-600">
                      <input
                        type="checkbox"
                        checked={state.textTemplate.showFolgekosten}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_TEXT",
                            field: "showFolgekosten",
                            value: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 accent-brand-secondary"
                      />
                      {t('offerDemo.templates.folgekostenLabel')}
                    </label>
                    {state.textTemplate.showFolgekosten && (
                      <textarea
                        value={state.textTemplate.folgekostenHinweis}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_TEXT",
                            field: "folgekostenHinweis",
                            value: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs text-brand-secondary focus:outline-none focus:border-gray-400 resize-y font-mono"
                      />
                    )}
                  </div>
                  <TemplateField
                    label={t('offerDemo.templates.schlusstextLabel')}
                    hint={t('offerDemo.templates.schlusstextHint')}
                    value={state.textTemplate.schlusstext}
                    onChange={(v) =>
                      dispatch({
                        type: "SET_TEXT",
                        field: "schlusstext",
                        value: v,
                      })
                    }
                    rows={3}
                  />

                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-brand-secondary" />
                      <h4 className="text-sm font-semibold text-brand-secondary">
                        {t('offerDemo.templates.emailTitle')}
                      </h4>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600">
                        {t('offerDemo.templates.subjectLabel')}
                      </label>
                      <input
                        type="text"
                        value={state.emailTemplate.betreff}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_EMAIL",
                            field: "betreff",
                            value: e.target.value,
                          })
                        }
                        className={`w-full text-sm px-4 py-2.5 ${INPUT}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600">
                        {t('offerDemo.templates.messageLabel')}
                      </label>
                      <textarea
                        value={state.emailTemplate.nachricht}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_EMAIL",
                            field: "nachricht",
                            value: e.target.value,
                          })
                        }
                        rows={6}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs text-brand-secondary focus:outline-none focus:border-gray-400 resize-y font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rechte Spalte: Zusammenfassung */}
          <div className="lg:col-span-1">
            <div className="sticky top-16 bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                {t('offerDemo.summary.title')}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('offerDemo.summary.subtotal')}</span>
                  <span className="font-bold text-brand-secondary">
                    {formatCurrency(calculated.subtotal)}
                  </span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {t('offerDemo.summary.discount')}
                      {state.discountPercentage
                        ? ` (${state.discountPercentage}%)`
                        : ""}
                      {state.discountCode ? ` · ${state.discountCode}` : ""}
                    </span>
                    <span className="font-bold text-red-500">
                      - {formatCurrency(calculated.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('offerDemo.summary.vat', { vatRate })}</span>
                  <span className="font-bold text-brand-secondary">
                    {formatCurrency(calculated.vat)}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-base font-bold text-brand-secondary">
                    {t('offerDemo.summary.total')}
                  </span>
                  <span className="text-2xl font-black text-brand-secondary">
                    {formatCurrency(calculated.total)}
                  </span>
                </div>
              </div>

              {roiImpact && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {t('offerDemo.summary.impactTitle')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className={`rounded-lg px-3 py-2.5 border ${roiImpact.amortization < 10 ? "bg-green-50 border-green-200" : roiImpact.amortization < 15 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">
                        {t('offerDemo.impact.amortization')}
                      </p>
                      <p
                        className={`text-base font-black ${roiImpact.amortization < 10 ? "text-green-600" : roiImpact.amortization < 15 ? "text-amber-600" : "text-red-600"}`}
                      >
                        {t('offerDemo.impact.years', { years: roiImpact.amortization })}
                      </p>
                    </div>
                    <div className="rounded-lg px-3 py-2.5 bg-gray-50 border border-gray-200">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">
                        {t('offerDemo.impact.savingsPerYear')}
                      </p>
                      <p className="text-base font-black text-green-600">
                        {formatCurrency(roiImpact.annualSavings)}
                      </p>
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2.5 border ${roiImpact.profit20 >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">
                        {t('offerDemo.impact.profit20')}
                      </p>
                      <p
                        className={`text-base font-black ${roiImpact.profit20 >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {roiImpact.profit20 >= 0 ? "+" : ""}
                        {formatCurrency(roiImpact.profit20)}
                      </p>
                    </div>
                    <div className="rounded-lg px-3 py-2.5 bg-gray-50 border border-gray-200">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">
                        {t('offerDemo.impact.autarky')}
                      </p>
                      <p className="text-base font-black text-blue-600">
                        {roiImpact.autarky}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rabatt-Code */}
              {state.status === "draft" && (
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Tag className="w-3.5 h-3.5" />
                    {t('offerDemo.discount.codeTitle')}
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedCodeId}
                      onChange={(e) => setSelectedCodeId(e.target.value)}
                      className={`flex-1 text-xs px-3 py-2 ${INPUT}`}
                    >
                      <option value="">{t('offerDemo.discount.codePlaceholder')}</option>
                      {DEMO_DISCOUNT_CODES.map((code) => (
                        <option key={code.id} value={code.id}>
                          {code.code} ({code.percentage}%)
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={applyCode}
                      disabled={!selectedCodeId}
                      className="bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 text-brand-secondary font-bold text-xs px-3 py-2 rounded-lg transition-colors"
                    >
                      {t('offerDemo.discount.apply')}
                    </button>
                  </div>
                </div>
              )}

              {/* Manueller Rabatt */}
              {state.status === "draft" && (
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Percent className="w-3.5 h-3.5" />
                    {t('offerDemo.discount.manualTitle')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={manualDiscountPct}
                      onChange={(e) => {
                        setManualDiscountPct(e.target.value);
                        if (e.target.value) setManualDiscountAmount("");
                      }}
                      placeholder={t('offerDemo.discount.percentPlaceholder')}
                      className={`w-20 text-xs px-3 py-2 ${INPUT}`}
                    />
                    <input
                      type="number"
                      value={manualDiscountAmount}
                      onChange={(e) => {
                        setManualDiscountAmount(e.target.value);
                        if (e.target.value) setManualDiscountPct("");
                      }}
                      placeholder={t('offerDemo.discount.amountPlaceholder')}
                      className={`flex-1 text-xs px-3 py-2 ${INPUT}`}
                    />
                    <button
                      onClick={applyManual}
                      disabled={!manualDiscountPct && !manualDiscountAmount}
                      className="bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-brand-secondary font-bold text-xs px-3 py-2 rounded-lg transition-colors"
                    >
                      {t('offerDemo.discount.ok')}
                    </button>
                  </div>
                  {hasDiscount && (
                    <button
                      onClick={removeDiscount}
                      className="text-xs text-red-500 hover:text-red-600 transition-colors"
                    >
                      {t('offerDemo.discount.remove')}
                    </button>
                  )}
                </div>
              )}

              {/* Aktionen */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <PDFDownloadLink
                  document={
                    <OfferPdfDocument
                      lead={DEMO_LEAD}
                      company={DEMO_COMPANY}
                      offerNumber={offerNumber}
                      offerDraft={draftForPdf}
                      textTemplate={state.textTemplate}
                    />
                  }
                  fileName={t('offerDemo.pdf.fileName', { offerNumber })}
                  className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 hover:bg-gray-50 text-brand-secondary font-bold text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  {({ loading: pdfLoading }) => (
                    <>
                      {pdfLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      {pdfLoading ? t('offerDemo.pdf.creating') : t('offerDemo.pdf.download')}
                    </>
                  )}
                </PDFDownloadLink>

                {state.status === "draft" && (
                  <button
                    onClick={openSendModal}
                    className="flex items-center justify-center gap-2 w-full bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {t('offerDemo.sendOffer')}
                  </button>
                )}
              </div>

              <div className="text-[10px] text-gray-400 space-y-1">
                <p>{t('offerDemo.summary.offerNumberLabel', { offerNumber })}</p>
                <p>
                  {t('offerDemo.summary.lastSaved')}{" "}
                  {new Date().toLocaleDateString(i18n.language === "en" ? "en-GB" : "de-DE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Abschluss-CTA */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h3 className="text-xl font-bold text-brand-secondary">
            {t('offerDemo.cta.title')}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {t('offerDemo.cta.sub')}
          </p>
          <div className="mt-5 flex justify-center">
            <PillButton variant="primary" onClick={() => navigate("/beta")}>
              {t('offerDemo.cta.button')}
            </PillButton>
          </div>
        </div>
      </main>

      {/* Send-Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Send className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-brand-secondary">
                {t('offerDemo.send.modalTitle')}
              </h3>
            </div>

            {sendSuccess ? (
              <div className="flex items-center gap-3 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold text-sm">
                    {t('offerDemo.send.successTitle')}
                  </p>
                  <p className="text-xs text-green-600/80">
                    {t('offerDemo.send.successDemo', { email: sendEmail })}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  {t('offerDemo.send.body')}
                  <span className="text-gray-400">
                    {" "}
                    {t('offerDemo.send.demoNote')}
                  </span>
                </p>

                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  {t('offerDemo.send.emailLabel')}
                </label>
                <input
                  type="email"
                  value={sendEmail}
                  onChange={(e) => setSendEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary focus:outline-none focus:border-gray-400 mb-3"
                />

                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  {t('offerDemo.send.subjectLabel')}
                </label>
                <input
                  type="text"
                  value={sendSubject}
                  onChange={(e) => setSendSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary focus:outline-none focus:border-gray-400 mb-3"
                />

                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  {t('offerDemo.send.messageLabel')}
                </label>
                <textarea
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary focus:outline-none focus:border-gray-400 mb-3 resize-none"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSendModal(false)}
                    className="flex-1 border border-gray-200 text-gray-600 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {t('offerDemo.send.cancel')}
                  </button>
                  <button
                    onClick={handleSimulatedSend}
                    disabled={!sendEmail.trim() || sending}
                    className="flex-1 bg-brand-secondary hover:bg-brand-secondary-hover disabled:opacity-40 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {sending ? t('offerDemo.send.sending') : t('offerDemo.send.submit')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-Komponente: Textbaustein-Feld ───────────────────────────────

function TemplateField({
  label,
  hint,
  value,
  onChange,
  rows,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs text-brand-secondary focus:outline-none focus:border-gray-400 resize-y font-mono"
      />
    </div>
  );
}
