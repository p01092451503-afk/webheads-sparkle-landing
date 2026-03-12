import React from 'react';
import { useTranslation } from 'react-i18next';

import SEO from '@/components/SEO';
import { BASE_URL } from '@/constant';
import Faq from '@/components/Faq';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Bg from '@/public/images/bg/bg-maintenance.png';
import { MaintenanceFaq as faqs } from '@/data/faq';

const MaintenancePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t('maintenance.seo.title')} description={t('maintenance.seo.description')} keywords={t('maintenance.seo.keywords')} path="/maintenance" breadcrumb={[{ name: t('maintenance.seo.title'), url: `${BASE_URL}/maintenance` }]} jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": `${t('maintenance.seo.title')} - Webheads`, "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" }, "description": t('maintenance.seo.description'), "areaServed": "KR", "serviceType": t('maintenance.seo.title'), "url": `${BASE_URL}/maintenance`, "additionalProperty": { "@type": "PropertyValue", "name": "clientCount", "value": "300" } }} faqJsonLd={faqs} />

      {/* Hero */}
      <Hero
        title={t('maintenance.hero.title')}
        subtitle={t('maintenance.hero.subtitle')}
        image={Bg}
        bgColor="bg-primary"
      />

      {/* Section */}
      <Section title={t('maintenance.section1.title')} description={t('maintenance.section1.description')} />

      {/* Faq */}
      <Faq data={faqs} />
    </div>
  );
};

export default MaintenancePage;
