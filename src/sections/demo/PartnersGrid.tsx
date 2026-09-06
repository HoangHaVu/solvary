import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { Zap, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Simple placeholder logos
function PL({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-xl h-20 flex items-center justify-center">
      <span className="text-gray-400 font-bold text-sm tracking-wider">{text}</span>
    </div>
  );
}

const logos = ['LOCO', 'logoipsum', 'LOGO IPSUM', 'logoipsum', 'Logoipsum', 'LOGO IPSUM', 'LogoIpsum', 'LOGOIPSUM', 'logoipsum', 'Logoipsum'];

export default function PartnersGrid() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pg-header', { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
      gsap.fromTo('.pg-logo', { opacity: 0 }, {
        opacity: 1, duration: 0.4, stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="pg-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 opacity-0">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-black" />
              <span className="text-xs font-semibold uppercase tracking-widest text-black">{t('demoPage.partnersGrid.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-black leading-tight tracking-tight max-w-[600px]">
              {t('demoPage.partnersGrid.heading')}
            </h2>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-brand-primary text-brand-secondary text-sm font-medium px-6 py-3.5 rounded-full hover:bg-brand-primary-hover transition-all duration-250 hover:scale-[1.02] group w-fit"
          >
            {t('demoPage.partnersGrid.cta')}
            <span className="w-7 h-7 bg-brand-secondary rounded-full flex items-center justify-center group-hover:bg-brand-secondary-hover transition-colors group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </span>
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {logos.map((logo, i) => (
            <div key={i} className="pg-logo opacity-0">
              <PL text={logo} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
