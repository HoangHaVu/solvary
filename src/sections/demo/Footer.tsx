import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Dribbble, ArrowRight } from 'lucide-react';
import { LOGO_WHITE_PATH } from '../../lib/branding';

export default function Footer() {
  const { t } = useTranslation();
  const usefulLinks = t('demoPage.footer.usefulLinks', { returnObjects: true }) as { label: string; href: string }[];
  const bottomLinks = t('demoPage.footer.bottomLinks', { returnObjects: true }) as { label: string; href: string }[];
  const [email, setEmail] = useState('');

  return (
    <footer id="contact" className="bg-gradient-to-b from-[#0F172A] to-black pt-16 md:pt-20 pb-8">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Top Row - Logo + Contact Boxes */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16">
          {/* Logo */}
          <div className="flex items-center gap-2 lg:mr-auto">
            <img src={LOGO_WHITE_PATH} alt="Solvary" className="h-12 w-auto" />
          </div>

          {/* Contact Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 max-w-[700px]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-brand-secondary" />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">{t('demoPage.footer.phoneLabel')}</div>
                <div className="text-sm text-white">+123-456-7890</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-brand-secondary" />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">{t('demoPage.footer.emailLabel')}</div>
                <div className="text-sm text-white">info@solvary.de</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-brand-secondary" />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">{t('demoPage.footer.addressLabel')}</div>
                <div className="text-sm text-white">East Street, USA 550</div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row - 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h4 className="text-base font-medium text-white mb-4">{t('demoPage.footer.aboutTitle')}</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('demoPage.footer.aboutText')}
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-base font-medium text-white mb-4">{t('demoPage.footer.linksTitle')}</h4>
            <div className="flex flex-col gap-3">
              {usefulLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-medium text-white mb-4">{t('demoPage.footer.contactTitle')}</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <span className="text-sm text-gray-400">kontakt@solvary.de</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <span className="text-sm text-gray-400">+49 89 12345678</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-base font-medium text-white mb-4">{t('demoPage.footer.newsletterTitle')}</h4>
            <p className="text-sm text-gray-400 mb-4">
              {t('demoPage.footer.newsletterSub')}
            </p>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('demoPage.footer.emailPlaceholder')}
                className="flex-1 bg-transparent border border-gray-700 rounded-l-full px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-primary"
              />
              <button className="bg-brand-primary text-brand-secondary text-sm font-medium px-5 py-2.5 rounded-r-full hover:bg-brand-primary-hover transition-colors flex items-center gap-1">
                {t('demoPage.footer.subscribe')}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-xs text-gray-500">
            {t('demoPage.footer.copyright')}
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Dribbble className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
