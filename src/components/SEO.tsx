import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  jsonLd?: object;
  faqJsonLd?: { q: string; a: string }[];
  breadcrumb?: { name: string; url: string }[];
}

export const BASE_URL = "https://service.webheads.co.kr";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

const LOCALE_MAP: Record<string, { og: string; siteName: string; suffix: string }> = {
  ko: { og: "ko_KR", siteName: "웹헤즈", suffix: "웹헤즈" },
  en: { og: "en_US", siteName: "Webheads", suffix: "Webheads" },
  ja: { og: "ja_JP", siteName: "ウェブヘッズ", suffix: "Webheads" },
  zh: { og: "zh_CN", siteName: "Webheads", suffix: "Webheads" },
};

export default function SEO({ title, description, keywords, path = "", jsonLd, faqJsonLd, breadcrumb }: SEOProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.substring(0, 2) || "ko";
  const locale = LOCALE_MAP[lang] || LOCALE_MAP.ko;

  const fullTitle = `${title} | ${locale.suffix}`;
  const canonicalUrl = `${BASE_URL}${path}`;

  const faqSchema = faqJsonLd && faqJsonLd.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqJsonLd.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": { "@type": "Answer", "text": faq.a },
        })),
      }
    : null;

  const breadcrumbSchema = breadcrumb && breadcrumb.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": BASE_URL },
      ...breadcrumb.map((item, i) => ({
        "@type": "ListItem",
        "position": i + 2,
        "name": item.name,
        "item": item.url
      }))
    ]
  } : null;

  return (
    <Helmet>
      <html lang={lang} />
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:locale" content={locale.og} />
      <meta property="og:site_name" content={locale.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
}
