import { useParams, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO, { BASE_URL } from "@/components/SEO";
import { BlogPost, blogPostsKo, blogPostsEn, blogPostsJa, categoryConfigKo, categoryConfigEn, categoryConfigJa } from "@/data/blogPosts";
import { ArrowLeft, ArrowRight, Calendar, Clock, BookOpen, TrendingUp, Lightbulb } from "lucide-react";

type Category = "guide" | "trend" | "tip";

const categoryIcons: Record<Category, typeof BookOpen> = {
  guide: BookOpen,
  trend: TrendingUp,
  tip: Lightbulb,
};

const categoryColors: Record<Category, string> = {
  guide: "hsl(250,55%,52%)",
  trend: "hsl(192,50%,42%)",
  tip: "hsl(40,80%,50%)",
};

export default function BlogPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : i18n.language?.startsWith("ja") ? "ja" : "ko";
  const blogPosts = lang === "en" ? blogPostsEn : lang === "ja" ? blogPostsJa : blogPostsKo;
  const catConfig = lang === "en" ? categoryConfigEn : lang === "ja" ? categoryConfigJa : categoryConfigKo;

  const post = blogPosts.find((p) => p.id === postId);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const Icon = categoryIcons[post.category];
  const color = categoryColors[post.category];
  const label = catConfig[post.category].label;

  // Related posts: same category, exclude current, max 3
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: { "@type": "Organization", name: "웹헤즈" },
    publisher: {
      "@type": "Organization",
      name: "웹헤즈",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/images/webheads-logo.png` },
    },
    url: `${BASE_URL}/blog/${post.id}`,
    keywords: post.keywords.join(", "),
  };

  const breadcrumb = [
    { name: lang === "en" ? "Blog" : lang === "ja" ? "ブログ" : "블로그", url: `${BASE_URL}/blog` },
    { name: post.title, url: `${BASE_URL}/blog/${post.id}` },
  ];

  return (
    <>
      <SEO
        title={post.title}
        description={post.summary}
        keywords={post.keywords.join(", ")}
        path={`/blog/${post.id}`}
        jsonLd={articleJsonLd}
        breadcrumb={breadcrumb}
      />

      <section className="relative pt-24 pb-8 md:pt-28 md:pb-10 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {lang === "en" ? "Back to Blog" : lang === "ja" ? "ブログに戻る" : "블로그로 돌아가기"}
          </Link>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: color }}>
              <Icon className="w-3.5 h-3.5" />{label}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" /><time dateTime={post.date}>{post.date}</time>
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />{post.readTime} {lang === "en" ? "read" : lang === "ja" ? "読み" : "읽기"}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-foreground leading-tight mb-4" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif", letterSpacing: "-0.02em" }}>
            {post.title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
            {post.summary}
          </p>
        </div>
      </section>

      <article className="pb-16 md:pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-5 mb-8">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-sm md:text-[15px] text-foreground/85 leading-[1.9]" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-6 border-t border-border">
            {post.keywords.map((kw) => (
              <span key={kw} className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground">#{kw}</span>
            ))}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-20 md:pb-28">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
              {lang === "en" ? "Related Articles" : lang === "ja" ? "関連記事" : "관련 포스트"}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.map((rp) => {
                const RpIcon = categoryIcons[rp.category];
                const rpColor = categoryColors[rp.category];
                const rpLabel = catConfig[rp.category].label;
                return (
                  <Link key={rp.id} to={`/blog/${rp.id}`} className="group rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
                    <div className="h-0.5 rounded-full mb-3" style={{ backgroundColor: rpColor }} />
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white mb-2" style={{ backgroundColor: rpColor }}>
                      <RpIcon className="w-3 h-3" />{rpLabel}
                    </span>
                    <h3 className="text-sm font-bold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
                      {rp.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">{rp.date}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
