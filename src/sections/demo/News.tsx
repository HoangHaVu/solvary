import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { User, MessageCircle, ArrowRight, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function News() {
  const { t } = useTranslation();
  const posts = t('demoPage.news.posts', { returnObjects: true }) as { img: string; author: string; readTime: string; title: string }[];
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.news-card', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });
      gsap.fromTo('.news-btn', { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, delay: 0.5,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="news" ref={sectionRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-black" />
            <span className="text-xs font-semibold uppercase tracking-widest text-black">{t('demoPage.news.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-black leading-tight tracking-tight mb-4">
            {t('demoPage.news.heading')}
          </h2>
          <p className="text-gray-500 text-base max-w-[560px] mx-auto leading-relaxed">
            {t('demoPage.news.sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {posts.map((post, i) => (
            <article
              key={i}
              className="news-card group cursor-pointer opacity-0"
            >
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Author badge strip */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-brand-secondary via-brand-secondary-hover to-black px-4 py-2 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-medium text-white">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-medium text-white">{post.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-medium text-black leading-snug mb-3 group-hover:text-gray-700 transition-colors">
                {post.title}
              </h3>
              <span className="inline-flex items-center gap-2 text-sm text-black font-medium group-hover:gap-3 transition-all">
                {t('demoPage.news.readMore')} <ArrowRight className="w-4 h-4" />
              </span>
            </article>
          ))}
        </div>

        {/* More news button */}
        <div className="text-center">
          <a
            href="#news"
            className="news-btn inline-flex items-center gap-2 bg-brand-primary text-brand-secondary text-sm font-medium px-6 py-3.5 rounded-full hover:bg-brand-primary-hover transition-all duration-250 hover:scale-[1.02] group opacity-0"
          >
            {t('demoPage.news.moreNews')}
            <span className="w-7 h-7 bg-brand-secondary rounded-full flex items-center justify-center group-hover:bg-brand-secondary-hover transition-colors group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
