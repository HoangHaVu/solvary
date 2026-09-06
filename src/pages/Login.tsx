import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { LOGO_PATH } from "../lib/branding";
import { COLORS } from "../lib/theme";
import SEO from "../components/seo/SEO";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<"installateur" | "agentur">(
    "installateur",
  );

  // Navigation nach erfolgreichem Login
  useEffect(() => {
    if (user) {
      navigate(user.role === "customer" ? "/demo" : "/admin", {
        replace: true,
      });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      // login() kehrt nach signIn() zurück — Spinner bleibt bis useEffect navigiert.
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.form.errorFallback"));
      setIsLoading(false);
    }
    // Kein finally-setIsLoading(false): Spinner läuft bis Navigation abgeschlossen.
  };

  return (
    <>
      <SEO
        title={t("login.seo.title")}
        description={t("login.seo.description")}
        canonical="/login"
        noindex
      />
      <div className="min-h-screen flex">
        {/* LEFT - Login Form */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-between p-8 md:p-12 lg:p-16 bg-white">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <img src={LOGO_PATH} alt="Solvary" className="h-7 w-auto" />
          </Link>

          {/* Form */}
          <div className="flex-1 flex flex-col justify-center max-w-[420px] mx-auto w-full">
            <h1 className="text-3xl md:text-4xl font-semibold text-brand-secondary mb-3">
              {t("login.title")}
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              {t("login.subtitle")}
            </p>

            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">
                  {t("login.form.emailLabel")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@voltify.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">
                  {t("login.form.passwordLabel")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-secondary text-white font-medium py-3 rounded-xl hover:bg-brand-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("login.form.submitting") : t("login.form.submit")}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">{t("login.quickLogin")}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Toggle: Installateur / Agentur */}
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setLoginMode("installateur")}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    loginMode === "installateur"
                      ? "bg-white text-brand-secondary shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t("login.mode.installer")}
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode("agentur")}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    loginMode === "agentur"
                      ? "bg-white text-brand-secondary shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t("login.mode.agency")}
                </button>
              </div>

              {/* Test-Buttons je nach Modus */}
              {loginMode === "installateur" ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("installateur@test.de");
                      setPassword("Test123456");
                    }}
                    className="flex flex-col items-center justify-center gap-1 border border-gray-200 rounded-xl py-2.5 text-xs text-gray-600 hover:bg-gray-50 hover:border-brand-primary/50 transition-colors"
                  >
                    <span className="font-medium text-brand-secondary">
                      {t("login.testAccount.installer")}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      installateur@test.de
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("inhaber@test.de");
                      setPassword("Test123456");
                    }}
                    className="flex flex-col items-center justify-center gap-1 border border-gray-200 rounded-xl py-2.5 text-xs text-gray-600 hover:bg-gray-50 hover:border-brand-primary/50 transition-colors"
                  >
                    <span className="font-medium text-brand-secondary">
                      {t("login.testAccount.owner")}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      inhaber@test.de
                    </span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("agentur@test.de");
                      setPassword("Test123456");
                    }}
                    className="flex flex-col items-center justify-center gap-1 border border-gray-200 rounded-xl py-2.5 text-xs text-gray-600 hover:bg-gray-50 hover:border-brand-primary/50 transition-colors"
                  >
                    <span className="font-medium text-brand-secondary">
                      {t("login.testAccount.agencyOwner")}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      agentur@test.de
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("vertriebler@test.de");
                      setPassword("Test123456");
                    }}
                    className="flex flex-col items-center justify-center gap-1 border border-gray-200 rounded-xl py-2.5 text-xs text-gray-600 hover:bg-gray-50 hover:border-brand-primary/50 transition-colors"
                  >
                    <span className="font-medium text-brand-secondary">
                      {t("login.testAccount.salesperson")}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      vertriebler@test.de
                    </span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Bottom */}
          <p className="text-center text-sm text-gray-500 mt-8">
            {t("login.bottom.text")}{" "}
            <Link
              to="/beta"
              className="text-brand-secondary font-medium hover:underline"
            >
              {t("login.bottom.link")}
            </Link>
          </p>
        </div>

        {/* RIGHT - Dashboard Preview */}
        <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] bg-gradient-to-br from-brand-secondary via-brand-secondary-hover to-black items-center justify-center p-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-secondary/40 rounded-full blur-3xl" />

          <div className="relative max-w-[540px] w-full">
            {/* Tagline */}
            <h2 className="text-3xl font-semibold text-white mb-2 leading-snug">
              {t("login.hero.titleLine1")}
              <br />
              {t("login.hero.titleLine2")}
            </h2>
            <p className="text-white/60 text-sm mb-8">
              {t("login.hero.description")}
            </p>

            {/* Dashboard Mockup */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-2xl">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-white/60 mb-1">
                    Total Savings
                  </p>
                  <p className="text-lg font-bold text-white">€18,374</p>
                  <span className="text-[10px] text-brand-primary">
                    +12% this month
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-white/60 mb-1">
                    Energy Generated
                  </p>
                  <p className="text-lg font-bold text-white">4,248 kWh</p>
                  <span className="text-[10px] text-brand-primary">
                    +8% this month
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-white/60 mb-1">CO2 Saved</p>
                  <p className="text-lg font-bold text-white">2.1 tons</p>
                  <span className="text-[10px] text-brand-primary">
                    +15% this month
                  </span>
                </div>
              </div>

              {/* Chart Area */}
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white font-medium">
                    Energy Overview
                  </span>
                  <div className="flex gap-1">
                    <span className="text-[10px] text-white/40 px-2 py-0.5 rounded bg-white/10">
                      Monthly
                    </span>
                    <span className="text-[10px] text-white/40 px-2 py-0.5">
                      Weekly
                    </span>
                  </div>
                </div>
                {/* Simple SVG Chart */}
                <svg viewBox="0 0 400 120" className="w-full h-24">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={COLORS.primary}
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor={COLORS.primary}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 100 Q50 80 100 70 T200 50 T300 60 T400 30 L400 120 L0 120 Z"
                    fill="url(#chartGrad)"
                  />
                  <path
                    d="M0 100 Q50 80 100 70 T200 50 T300 60 T400 30"
                    fill="none"
                    stroke={COLORS.primary}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Data points */}
                  <circle cx="0" cy="100" r="4" fill={COLORS.primary} />
                  <circle cx="100" cy="70" r="4" fill={COLORS.primary} />
                  <circle cx="200" cy="50" r="4" fill={COLORS.primary} />
                  <circle cx="300" cy="60" r="4" fill={COLORS.primary} />
                  <circle cx="400" cy="30" r="4" fill={COLORS.primary} />
                </svg>
              </div>

              {/* Gauge */}
              <div className="flex gap-3">
                <div className="flex-1 bg-white/10 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-20 h-20 relative">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full -rotate-90"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={COLORS.primary}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="200 251"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-white">78%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white font-medium">
                      System Efficiency
                    </p>
                    <p className="text-[10px] text-white/50">Above average</p>
                  </div>
                </div>
                <div className="w-[140px] bg-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-white/60 mb-1">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold text-white">12</p>
                  <div className="flex gap-1 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                      8 Active
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                      4 Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
