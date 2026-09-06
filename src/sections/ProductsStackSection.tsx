import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { PillButton } from "../components/ui/PillButton";
import { SectionTag } from "../components/ui/SectionTag";

const STICKY_TOP = 96; // px – unter der 64px-Navbar + Puffer
const SCALE_STEP = 0.06;

interface ProductItem {
  title: string;
  desc: string;
  features: string[];
  link: string;
  linkLabel: string;
  image: string;
}

const PRODUCT_META = [
  { link: "/konfigurator?demo=1", image: "/images/configurator-bg.jpg" },
  { link: "/angebot-demo", image: "/images/about-image.jpg" },
  { link: "/login", image: "/images/dashboard-bg.jpg" },
  { link: "/demo", image: "/images/hero-island.jpg" },
];

function useProducts(): ProductItem[] {
  const { t } = useTranslation();
  return PRODUCT_META.map((meta, i) => ({
    ...meta,
    title: t(`sections.productsStack.products.${i}.title`),
    desc: t(`sections.productsStack.products.${i}.desc`),
    features: t(`sections.productsStack.products.${i}.features`, {
      returnObjects: true,
    }) as unknown as string[],
    linkLabel: t(`sections.productsStack.products.${i}.linkLabel`),
  }));
}

interface ProductCardProps {
  product: ProductItem;
  index: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
}

function ProductCard({
  product,
  index,
  totalCards,
  scrollYProgress,
}: ProductCardProps) {
  const navigate = useNavigate();
  const isTopCard = index === totalCards - 1;
  const targetScale = isTopCard ? 1 : 1 - SCALE_STEP;
  const num = String(index + 1).padStart(3, "0");

  const scale = useTransform(
    scrollYProgress,
    [index / totalCards, (index + 1) / totalCards],
    [1, targetScale],
  );

  return (
    <motion.div
      className="sticky"
      style={{
        top: STICKY_TOP,
        zIndex: index + 1,
        scale,
        transformOrigin: "center top",
        willChange: "transform",
      }}
    >
      <div className="bg-brand-bg-alt rounded-2xl p-8 md:p-10 lg:p-12 border border-gray-100">
        {/* Nummer */}
        <div className="flex items-center gap-2 mb-8">
          <Plus className="w-4 h-4 text-brand-primary" strokeWidth={3} />
          <span className="text-sm font-semibold text-brand-secondary tracking-[0.3em]">
            {num}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Links: Titel + Bild */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-brand-secondary tracking-tight leading-[1.05] [overflow-wrap:anywhere]">
              {product.title}
            </h3>
            <div className="mt-8 rounded-xl overflow-hidden bg-brand-secondary-hover">
              <img
                src={product.image}
                alt={product.title}
                className="w-full object-cover aspect-[16/11]"
              />
            </div>
          </div>

          {/* Rechts: Beschreibung + Button + Tags */}
          <div className="flex flex-col">
            <p className="text-sm md:text-base font-medium text-gray-500 leading-relaxed max-w-md">
              {product.desc}
            </p>
            <div className="mt-6">
              <PillButton
                variant="white"
                onClick={() => navigate(product.link)}
              >
                {product.linkLabel}
              </PillButton>
            </div>
            <div className="mt-auto pt-12 flex flex-wrap gap-2">
              {product.features.map((feature) => (
                <span
                  key={feature}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductsStackSection({
  showHeader = true,
}: {
  /** Auf der ProductsPage bringt die Seite ihren eigenen Kopf mit. */
  showHeader?: boolean;
}) {
  const { t } = useTranslation();
  const products = useProducts();
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="services" className="py-20 md:py-28 bg-white scroll-mt-24">
      <div className="max-w-[1280px] mx-auto px-6">
        {showHeader && (
          <div className="text-center mb-16">
            <SectionTag>{t('sections.productsStack.tag')}</SectionTag>
            <h2 className="text-4xl md:text-5xl font-semibold text-brand-secondary mt-4 tracking-tight">
              {t('sections.productsStack.heading1')}
              <br />
              {t('sections.productsStack.heading2')}
            </h2>
            <p className="text-gray-500 text-base max-w-[600px] mx-auto mt-4 leading-relaxed">
              {t('sections.productsStack.sub')}
            </p>
          </div>
        )}
        <div ref={listRef} className="space-y-16">
          {products.map((product, index) => (
            <ProductCard
              key={product.title}
              product={product}
              index={index}
              totalCards={products.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
