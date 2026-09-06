import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { Zap, ArrowRight, Sun, Battery, Banknote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const icons = [Sun, Battery, Banknote];

export default function ExcellentServices() {
  const { t } = useTranslation();
  const services = t('demoPage.excellentServices.services', { returnObjects: true }) as { title: string; desc: string }[];
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.es-left', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });
      gsap.fromTo('.es-item', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.2,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-24 bg-gradient-to-br from-brand-secondary via-brand-secondary-hover to-black">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="es-left lg:w-[45%] opacity-0">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/80">{t('demoPage.excellentServices.label')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-white leading-tight tracking-tight mb-8">
            {t('demoPage.excellentServices.heading')}
          </h2>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-brand-primary text-brand-secondary text-sm font-medium px-6 py-3.5 rounded-full hover:bg-brand-primary-hover transition-all duration-250 hover:scale-[1.02] group"
          >
            {t('demoPage.excellentServices.cta')}
            <span className="w-7 h-7 bg-brand-secondary rounded-full flex items-center justify-center group-hover:bg-brand-secondary-hover transition-colors">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </span>
          </a>
        </div>

        {/* Right Column */}
        <div className="lg:w-[55%] flex flex-col gap-8">
          {services.map((s, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="es-item flex gap-5 opacity-0">
                <div className="w-12 h-12 flex-shrink-0">
                  <Icon className="w-12 h-12 text-white stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
