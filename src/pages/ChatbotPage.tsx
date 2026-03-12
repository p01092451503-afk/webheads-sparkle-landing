import React from 'react';
import { useTranslation } from 'react-i18next';

import SEO from '@/components/SEO';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Faq from '@/components/Faq';

import { BASE_URL } from '@/utils/constants';
import { chatbotFaqs as faqs } from '@/utils/faqs';

const ChatbotPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t("chatbot.seo.title")} description={t("chatbot.seo.description")} keywords={t("chatbot.seo.keywords")} path="/chatbot" breadcrumb={[{ name: t("chatbot.seo.title"), url: `${BASE_URL}/chatbot` }]} jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": `${t("chatbot.seo.title")} - Webheads`, "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" }, "description": t("chatbot.seo.description"), "areaServed": "KR", "serviceType": t("chatbot.seo.title"), "url": `${BASE_URL}/chatbot`, "additionalProperty": { "@type": "PropertyValue", "name": "clientCount", "value": "300" } }} faqJsonLd={faqs} />

      {/* Hero */}
      <Hero
        title={t('chatbot.hero.title')}
        description={t('chatbot.hero.description')}
        image="/images/chatbot-hero.png"
        imageAlt={t('chatbot.hero.imageAlt')}
      />

      {/* Section 1 */}
      <Section
        title={t('chatbot.section1.title')}
        description={t('chatbot.section1.description')}
        image="/images/chatbot-section1.png"
        imageAlt={t('chatbot.section1.imageAlt')}
        isReversed={false}
      />

      {/* Section 2 */}
      <Section
        title={t('chatbot.section2.title')}
        description={t('chatbot.section2.description')}
        image="/images/chatbot-section2.png"
        imageAlt={t('chatbot.section2.imageAlt')}
        isReversed={true}
      />

      {/* FAQ */}
      <Faq faqs={faqs} />
    </div>
  );
};

export default ChatbotPage;
