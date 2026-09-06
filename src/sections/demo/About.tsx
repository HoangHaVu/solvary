import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Plug, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const statIcons = [TrendingUp, Plug];

export default function About() {
  const { t } = useTranslation();
  const stats = t('demoPage.about.stats', { returnObjects: true }) as { label: string; sub: string; value: string }[];
  const cards = t('demoPage.about.cards', { returnObjects: true }) as { title: string; desc: string }[];
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.au-badge', { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
      gsap.fromTo('.au-heading', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, delay: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
      gsap.fromTo('.au-sub', { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, delay: 0.2,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
      gsap.fromTo('.au-left', { x: -30, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.7,
        scrollTrigger: { trigger: '.au-split', start: 'top 75%' }
      });
      gsap.fromTo('.au-right', { x: 30, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.7, delay: 0.15,
        scrollTrigger: { trigger: '.au-split', start: 'top 75%' }
      });
      gsap.fromTo('.au-card', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.15,
        scrollTrigger: { trigger: '.au-cards', start: 'top 80%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="au-badge flex items-center justify-center gap-2 mb-4 opacity-0">
            <Zap className="w-4 h-4 text-black" />
            <span className="text-xs font-semibold uppercase tracking-widest text-black">{t('demoPage.about.badge')}</span>
          </div>
          <h2 className="au-heading text-4xl md:text-5xl font-medium text-black leading-tight tracking-tight opacity-0">
            {t('demoPage.about.heading')}
          </h2>
          <p className="au-sub text-gray-500 text-base max-w-[560px] mx-auto mt-4 leading-relaxed opacity-0">
            {t('demoPage.about.sub')}
          </p>
        </div>

        {/* Split Layout */}
        <div className="au-split grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 mb-16">
          {/* Left */}
          <div className="au-left bg-[#F5F5F5] rounded-l-2xl p-10 md:p-14 flex flex-col justify-center opacity-0">
            <h3 className="text-4xl md:text-5xl font-medium text-black leading-tight tracking-tight mb-8">
              {t('demoPage.about.leftHeading')}
            </h3>
            <div className="w-24 h-px bg-gray-300 mb-8" />
            <p className="text-gray-600 text-base leading-relaxed max-w-[400px]">
              {t('demoPage.about.leftBody')}
            </p>
          </div>

          {/* Right */}
          <div className="au-right bg-black rounded-r-2xl p-10 md:p-14 flex flex-col justify-center gap-4 opacity-0">
            {stats.map((s, i) => {
              const Icon = statIcons[i];
              return (
                <div key={i} className="bg-white rounded-xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.sub}</p>
                  </div>
                  <span className="text-2xl font-medium text-[#4ade80]">{s.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="au-cards grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="au-card bg-[#F5F5F5] rounded-2xl p-8 opacity-0 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black" />
                </div>
                <h4 className="text-2xl font-medium text-black">{c.title}</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-auto">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
