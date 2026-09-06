import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Building2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { signUpCustomer, signUpInstaller } from '../services/auth';
import { LOGO_PATH } from '../lib/branding';
import { COLORS } from '../lib/theme';
import SEO from '../components/seo/SEO';

type Role = 'customer' | 'installer';

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [role, setRole] = useState<Role>('customer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError(t('register.errors.passwordMismatch'));
      return;
    }
    if (password.length < 6) {
      setError(t('register.errors.passwordLength'));
      return;
    }
    if (!agreeTerms) {
      setError(t('register.errors.termsRequired'));
      return;
    }

    setIsLoading(true);
    try {
      if (role === 'customer') {
        const fullName = `${firstName} ${lastName}`.trim();
        await signUpCustomer(email, password, fullName);
      } else {
        const fullName = companyName || `${firstName} ${lastName}`.trim();
        await signUpInstaller(email, password, fullName, zip, phone || undefined);
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('register.errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title={t('register.seo.title')} description={t('register.seo.description')} canonical="/register" noindex />
      <div className="min-h-screen flex">
      {/* LEFT - Register Form */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-between p-8 md:p-12 lg:p-16 bg-white">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-12">
          <img src={LOGO_PATH} alt={t('register.logoAlt')} className="h-7 w-auto" />
        </Link>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px] mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-semibold text-brand-secondary mb-3">{t('register.title')}</h1>
          <p className="text-gray-500 text-sm mb-8">{t('register.subtitle')}</p>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle className="w-14 h-14 text-green-500" />
              <h2 className="text-xl font-bold text-brand-secondary">{t('register.success.title')}</h2>
              <p className="text-gray-500 text-sm">
                {role === 'customer'
                  ? t('register.success.customerMessage')
                  : t('register.success.installerMessage')}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 bg-brand-secondary text-white font-medium px-6 py-3 rounded-xl hover:bg-brand-secondary-hover transition-colors"
              >
                {t('register.success.loginButton')}
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Role Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">{t('register.role.label')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      role === 'customer'
                        ? 'border-brand-secondary bg-brand-secondary/5 text-brand-secondary'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    {t('register.role.customer')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('installer')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      role === 'installer'
                        ? 'border-brand-secondary bg-brand-secondary/5 text-brand-secondary'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    {t('register.role.installer')}
                  </button>
                </div>
              </div>

              {/* Customer Fields */}
              {role === 'customer' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-700">{t('register.fields.firstName')}</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Max"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-700">{t('register.fields.lastName')}</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Mustermann"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Installer Fields */}
              {role === 'installer' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-700">{t('register.fields.companyName')}</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Dein Unternehmen GmbH"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-700">{t('register.fields.zip')}</label>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="12345"
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-700">{t('register.fields.phone')}</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+49 171 1234567"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">{t('register.fields.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@voltify.com"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">{t('register.fields.password')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('register.placeholders.password')}
                    required
                    minLength={6}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">{t('register.fields.confirmPassword')}</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('register.placeholders.confirmPassword')}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm text-brand-secondary placeholder:text-gray-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"
                />
                <span className="text-xs text-gray-500">
                  {t('register.terms.prefix')}{' '}
                  <Link to="/agb" className="text-brand-secondary font-medium hover:underline">{t('register.terms.agb')}</Link>
                  {' '}{t('register.terms.middle')}{' '}
                  <Link to="/datenschutz" className="text-brand-secondary font-medium hover:underline">{t('register.terms.privacy')}</Link>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-secondary text-white font-medium py-3 rounded-xl hover:bg-brand-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? t('register.submit.loading') : t('register.submit.create')}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>

        {/* Bottom */}
        <p className="text-center text-sm text-gray-500 mt-8">
          {t('register.footer.alreadyHaveAccount')} <Link to="/login" className="text-brand-secondary font-medium hover:underline">{t('register.footer.login')}</Link>
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
            {t('register.hero.titleLine1')}<br />{t('register.hero.titleLine2')}
          </h2>
          <p className="text-white/60 text-sm mb-8">{t('register.hero.subtitle')}</p>

          {/* Dashboard Mockup */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-2xl">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-white/60 mb-1">{t('register.dashboard.roiPotential')}</p>
                <p className="text-lg font-bold text-white">24.5%</p>
                <span className="text-[10px] text-brand-primary">{t('register.dashboard.roiChange')}</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-white/60 mb-1">{t('register.dashboard.panelEfficiency')}</p>
                <p className="text-lg font-bold text-white">21.8%</p>
                <span className="text-[10px] text-brand-primary">{t('register.dashboard.panelTier')}</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-white/60 mb-1">{t('register.dashboard.paybackTime')}</p>
                <p className="text-lg font-bold text-white">7.2 yrs</p>
                <span className="text-[10px] text-brand-primary">{t('register.dashboard.paybackLabel')}</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white font-medium">{t('register.dashboard.savingsProjection')}</span>
                <div className="flex gap-1">
                  <span className="text-[10px] text-white/40 px-2 py-0.5 rounded bg-white/10">{t('register.dashboard.yearly')}</span>
                  <span className="text-[10px] text-white/40 px-2 py-0.5">{t('register.dashboard.monthly')}</span>
                </div>
              </div>
              <svg viewBox="0 0 400 120" className="w-full h-24">
                <defs>
                  <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.3"/>
                    <stop offset="100%" stopColor={COLORS.primary} stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 110 Q50 90 100 75 T200 45 T300 35 T400 15 L400 120 L0 120 Z" fill="url(#chartGrad2)" />
                <path d="M0 110 Q50 90 100 75 T200 45 T300 35 T400 15" fill="none" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="0" cy="110" r="4" fill={COLORS.primary} />
                <circle cx="100" cy="75" r="4" fill={COLORS.primary} />
                <circle cx="200" cy="45" r="4" fill={COLORS.primary} />
                <circle cx="300" cy="35" r="4" fill={COLORS.primary} />
                <circle cx="400" cy="15" r="4" fill={COLORS.primary} />
              </svg>
            </div>

            {/* Bottom Cards */}
            <div className="flex gap-3">
              <div className="flex-1 bg-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={COLORS.primary} strokeWidth="8" strokeLinecap="round" strokeDasharray="175 251" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-white">70%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white font-medium">{t('register.dashboard.carbonOffset')}</p>
                  <p className="text-[10px] text-white/50">{t('register.dashboard.carbonTarget')}</p>
                </div>
              </div>
              <div className="w-[140px] bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-white/60 mb-1">{t('register.dashboard.configurations')}</p>
                <p className="text-2xl font-bold text-white">3</p>
                <div className="flex gap-1 mt-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">{t('register.dashboard.saved', { count: 2 })}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">{t('register.dashboard.draft', { count: 1 })}</span>
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
