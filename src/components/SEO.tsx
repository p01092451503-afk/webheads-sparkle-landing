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
  ogImage?: string;
}

export const BASE_URL = "https://service.webheads.co.kr";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

const LOCALE_MAP: Record<string, { og: string; siteName: string; suffix: string }> = {
  ko: { og: "ko_KR", siteName: "웹헤즈", suffix: "웹헤즈" },
  en: { og: "en_US", siteName: "WEBHEADS", suffix: "WEBHEADS" },
  ja: { og: "ja_JP", siteName: "WEBHEADS", suffix: "WEBHEADS" },
  "zh-CN": { og: "zh_CN", siteName: "WEBHEADS", suffix: "WEBHEADS" },
  "zh-TW": { og: "zh_TW", siteName: "WEBHEADS", suffix: "WEBHEADS" },
};

export default function SEO({ title, description, keywords, path = "", jsonLd, faqJsonLd, breadcrumb, ogImage }: SEOProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language || "ko";
  const locale = LOCALE_MAP[lang] || LOCALE_MAP.ko;

  const fullTitle = `${title} | ${locale.suffix}`;
  const canonicalUrl = `${BASE_URL}${path}`;
  const koUrl = `${BASE_URL}${path}`;
  const enUrl = `${BASE_URL}${path}?lang=en`;
  const jaUrl = `${BASE_URL}${path}?lang=ja`;
  const zhCnUrl = `${BASE_URL}${path}?lang=zh-CN`;
  const zhTwUrl = `${BASE_URL}${path}?lang=zh-TW`;
  const ogImageUrl = ogImage ? `${BASE_URL}${ogImage}` : OG_IMAGE;

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
      <link rel="alternate" hrefLang="ko" href={koUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="ja" href={jaUrl} />
      <link rel="alternate" hrefLang="zh-CN" href={zhCnUrl} />
      <link rel="alternate" hrefLang="zh-TW" href={zhTwUrl} />
      <link rel="alternate" hrefLang="x-default" href={koUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${fullTitle} 대표 이미지`} />
      <meta property="og:locale" content={locale.og} />
      <meta property="og:site_name" content={locale.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={`${fullTitle} 대표 이미지`} />

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
