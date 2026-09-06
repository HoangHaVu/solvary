import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Zap,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Phone,
  Mail,
  Building2,
  MapPin,
  MessageSquare,
  User,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { BETA } from "../lib/betaConfig";
import { LOGO_PATH } from "../lib/branding";
import SEO from "../components/seo/SEO";

interface BenefitItem {
  icon: string;
  title: string;
  text: string;
}

interface BenefitStat {
  value: string;
  label: string;
}

export default function BetaSignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  const benefitItems = t("betaPage.benefits.items", {
    returnObjects: true,
  }) as BenefitItem[];
  const benefitStats = t("betaPage.benefits.stats", {
    returnObjects: true,
  }) as BenefitStat[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase.from("beta_requests").insert({
        company_name: companyName.trim(),
        contact_name: contactName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        zip: zip.trim() || null,
        message: message.trim() || null,
      });

      if (dbError) throw new Error(dbError.message);

      // E-Mail-Benachrichtigung fire-and-forget
      supabase.functions
        .invoke("notify-beta", {
          body: {
            company_name: companyName,
            contact_name: contactName,
            email,
            phone,
            zip,
            message,
          },
        })
        .catch(() => {
          /* ignorieren — Daten sind in DB */
        });

      // Calendly Modal öffnen statt success-screen
      setShowCalendly(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : t("betaPage.form.errorFallback"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendly Script laden, wenn Modal sichtbar
  useEffect(() => {
    if (!showCalendly) return;

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [showCalendly]);

  return (
    <>
      <SEO
        title={t("betaPage.seo.title")}
        description={t("betaPage.seo.description")}
        canonical="/beta"
        noindex
      />
      <div className="min-h-screen flex">
        {/* LEFT — Beta Formular */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-between p-8 md:p-12 lg:p-16 bg-white">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-12 cursor-pointer"
          >
            <img src={LOGO_PATH} alt="Solvary" className="h-7 w-auto" />
          </button>

          {/* Form */}
          <div className="flex-1 flex flex-col justify-center max-w-[420px] mx-auto w-full">
            {success ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-brand-secondary">
                  {t("betaPage.form.successTitle")}
                </h2>
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                  {t("betaPage.form.successText")}
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 bg-brand-secondary text-white font-medium px-6 py-3 rounded-xl hover:bg-brand-secondary-hover transition-colors"
                >
                  {t("betaPage.form.successCta")}
                </button>
              </div>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 bg-brand-primary/10 text-brand-secondary text-xs font-bold px-3 py-1 rounded-full mb-3">
                  🚀 {t("betaPage.form.tag", { spots: BETA.spotsLeft })}
                </span>
                <h1 className="text-3xl md:text-4xl font-semibold text-brand-secondary mb-3">
                  {t("betaPage.form.title")}
                </h1>
                <p className="text-gray-500 text-sm mb-8">
                  {t("betaPage.form.sub", {
                    freeMonths: BETA.freeMonths,
                    discount: BETA.discountPercent,
                  })}
                </p>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-700">
                        {t("betaPage.form.company")}
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder={t("betaPage.form.placeholder.company")}
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-700">
                        {t("betaPage.form.name")}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder={t("betaPage.form.placeholder.name")}
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-700">
                      {t("betaPage.form.phone")}{" "}
                      <span className="text-brand-secondary font-bold">
                        {t("betaPage.form.phoneHint")}
                      </span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t("betaPage.form.placeholder.phone")}
                        className="w-full border-2 border-brand-primary/30 rounded-xl pl-9 pr-3 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-700">
                        {t("betaPage.form.email")}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t("betaPage.form.placeholder.email")}
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-700">
                        {t("betaPage.form.zip")}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          placeholder={t("betaPage.form.placeholder.zip")}
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-700">
                      {t("betaPage.form.message")}{" "}
                      <span className="font-normal text-gray-400">
                        {t("betaPage.form.messageHint")}
                      </span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t("betaPage.form.placeholder.message")}
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-secondary text-white font-bold py-3.5 rounded-full hover:bg-brand-secondary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Zap className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {t("betaPage.form.submit")}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    {t("betaPage.form.disclaimer")}
                  </p>
                </form>
              </>
            )}
          </div>

          {/* Bottom */}
          <p className="text-center text-sm text-gray-500 mt-8">
            {t("betaPage.form.login")}{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-brand-secondary font-medium hover:underline cursor-pointer"
            >
              {t("betaPage.form.loginCta")}
            </button>
          </p>
        </div>

        {/* RIGHT — Beta Benefits */}
        <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] bg-gradient-to-br from-brand-secondary via-brand-secondary-hover to-black items-center justify-center p-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-secondary/40 rounded-full blur-3xl" />

          <div className="relative max-w-[540px] w-full">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 bg-brand-primary/20 border border-brand-primary/30 rounded-full px-3 py-1 text-xs font-bold text-brand-primary uppercase tracking-widest mb-6">
              ⭐ {t("betaPage.benefits.tag", { spots: BETA.spotsLeft })}
            </div>
            <h2 className="text-3xl font-semibold text-white mb-2 leading-snug">
              {t("betaPage.benefits.title", { spots: BETA.spotsLeft })}
            </h2>
            <p className="text-white/60 text-sm mb-8">
              {t("betaPage.benefits.sub", {
                freeMonths: BETA.freeMonths,
                discount: BETA.discountPercent,
              })}
            </p>

            {/* Benefits Cards */}
            <div className="space-y-4">
              {benefitItems.map((item) => (
                <div
                  key={item.title}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-start gap-4"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-white text-sm">{item.title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {benefitStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 rounded-xl p-3 text-center"
                >
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendly Modal Overlay */}
        {showCalendly && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-brand-secondary">
                    {t("betaPage.calendly.title")}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("betaPage.calendly.sub")}
                  </p>
                </div>
                <button
                  onClick={() => setShowCalendly(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label={t("betaPage.calendly.close")}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Calendly Widget */}
              <div className="flex-1 overflow-y-auto p-6">
                <div
                  className="calendly-inline-widget"
                  data-url={BETA.calendlyUrl}
                  style={{ minWidth: "320px", height: "630px" }}
                />
              </div>

              {/* Footer Info */}
              <div className="border-t border-gray-200 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 p-4 text-center">
                <p className="text-xs text-gray-600 font-medium">
                  {t("betaPage.calendly.footer1")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t("betaPage.calendly.footer2", { freeMonths: BETA.freeMonths })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
