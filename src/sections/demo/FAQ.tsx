import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const { t } = useTranslation();
  const faqs = t('demoPage.faq.items', { returnObjects: true }) as { q: string; a: string }[];
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-img', { scale: 0.92, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      });
      gsap.fromTo('.faq-item', { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-[#F5F5F5]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image */}
          <div className="relative">
            <div className="faq-img rounded-2xl overflow-hidden opacity-0">
              <img
                src="/images/faq-image.jpg"
                alt={t('demoPage.faq.imageAlt')}
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            {/* Experience Badge */}
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-4 shadow-lg">
              <div className="text-3xl font-semibold text-black">{t('demoPage.faq.experienceBadge.value')}</div>
              <div className="text-xs text-black/80">{t('demoPage.faq.experienceBadge.label')}</div>
            </div>
          </div>

          {/* Right - FAQ */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-black" />
              <span className="text-xs font-semibold uppercase tracking-widest text-black">{t('demoPage.faq.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-medium text-black leading-tight tracking-tight mb-8">
              {t('demoPage.faq.heading')}
            </h2>

            <div className="flex flex-col">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="faq-item border-b border-gray-200 opacity-0"
                >
                  <button
                    className="w-full flex items-center justify-between py-5 text-left"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    <span className="text-base font-medium text-black pr-4">{faq.q}</span>
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                      {openIndex === i ? (
                        <Minus className="w-5 h-5 text-black" />
                      ) : (
                        <Plus className="w-5 h-5 text-black" />
                      )}
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openIndex === i ? '200px' : '0' }}
                  >
                    <p className="text-sm text-gray-600 leading-relaxed pb-5">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
