import SEO from '../components/seo/SEO';
import FloatingBetaCTA from '../components/layout/FloatingBetaCTA';
import Header from '../sections/demo/Header';
import Hero from '../sections/demo/Hero';
import Partners from '../sections/demo/Partners';
import ExcellentServices from '../sections/demo/ExcellentServices';
import OurServices from '../sections/demo/OurServices';
import USP from '../sections/demo/USP';
import FurtherServices from '../sections/demo/FurtherServices';
import Team from '../sections/demo/Team';
import ExploreSection from '../sections/demo/ExploreSection';
import Marquee from '../sections/demo/Marquee';
import About from '../sections/demo/About';
import PartnersGrid from '../sections/demo/PartnersGrid';
import News from '../sections/demo/News';
import FAQ from '../sections/demo/FAQ';
import Footer from '../sections/demo/Footer';

export default function DemoPage() {
  return (
    <>
      <SEO
        title="Solar-Konfigurator"
        description="Berechnen Sie die Wirtschaftlichkeit Ihrer Photovoltaik-Anlage in wenigen Minuten. Inkl. Foerderungen, ROI-Analyse und persoenlichem Angebot."
        canonical="/demo"
        og={{ type: 'website' }}
      />
      <main className="min-h-screen">
        <Header />
        <Hero />
        <Partners />
        <ExcellentServices />
        <OurServices />
        <USP />
        <FurtherServices />
        <Marquee />
        <ExploreSection />
        <About />
        <Team />
        <PartnersGrid />
        <News />
        <FAQ />
        <Footer />
      </main>
      {/* Demo-Framing: Pfad zurück zur Beta für Installateure */}
      <FloatingBetaCTA />
    </>
  );
}
