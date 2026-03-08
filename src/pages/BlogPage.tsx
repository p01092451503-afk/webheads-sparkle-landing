import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { BookOpen, TrendingUp, Lightbulb, ArrowRight, Calendar, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost, blogPostsKo, blogPostsEn, categoryConfigKo, categoryConfigEn, blogPostsJa, categoryConfigJa } from "@/data/blogPosts";

const POSTS_PER_PAGE = 10;

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

function BlogCard({ post, isExpanded, onToggle, lang }: { post: BlogPost; isExpanded: boolean; onToggle: () => void; lang: string }) {
  const catConfig = lang === "en" ? categoryConfigEn : categoryConfigKo;
  const label = catConfig[post.category].label;
  const Icon = categoryIcons[post.category];
  const color = categoryColors[post.category];

  return (
    <article className="group rounded-2xl border border-border bg-card overflow-hidden transition-shadow duration-300 hover:shadow-lg" itemScope itemType="https://schema.org/Article">
      <div className="h-1" style={{ backgroundColor: color }} />
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: color }}>
            <Icon className="w-3.5 h-3.5" />{label}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" /><time itemProp="datePublished" dateTime={post.date}>{post.date}</time>
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />{post.readTime} {lang === "en" ? "read" : "읽기"}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-tight" itemProp="headline" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{post.title}</h2>
        <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-4" itemProp="description" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{post.summary}</p>
        {isExpanded && (
          <div className="space-y-4 mb-5 pt-4 border-t border-border">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-sm md:text-[15px] text-foreground/80 leading-[1.8]" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }} itemProp="articleBody">{paragraph}</p>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.keywords.map((kw) => (
            <span key={kw} className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground" itemProp="keywords">#{kw}</span>
          ))}
        </div>
        <button onClick={onToggle} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-2 transition-colors">
          {isExpanded ? (lang === "en" ? "Collapse" : "접기") : (lang === "en" ? "Read more" : "자세히 읽기")}
          <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </button>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const lang = i18n.language?.startsWith("en") ? "en" : i18n.language?.startsWith("ja") ? "ja" : "ko";
  const blogPosts = lang === "en" ? blogPostsEn : lang === "ja" ? blogPostsJa : blogPostsKo;

  const filteredPosts = useMemo(() => {
    let posts = blogPosts;
    if (activeCategory !== "all") {
      posts = posts.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
    }
    // Sort by date descending (newest first)
    posts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return posts;
  }, [blogPosts, searchQuery, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleToggle = (id: string) => setExpandedId(expandedId === id ? null : id);
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setExpandedId(null);
  };
  const handleCategoryChange = (cat: Category | "all") => {
    setActiveCategory(cat);
    setCurrentPage(1);
    setExpandedId(null);
  };

  const catConfig = lang === "en" ? categoryConfigEn : categoryConfigKo;
  const allCategories: (Category | "all")[] = ["all", "guide", "trend", "tip"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: lang === "en" ? "WEBHEADS LMS Insights" : "웹헤즈 LMS 인사이트",
    description: lang === "en" ? "LMS adoption guides, e-learning trends, and AI education insights from WEBHEADS" : "LMS 도입 가이드, 이러닝 트렌드, AI 교육 솔루션 인사이트를 제공하는 웹헤즈 블로그",
    url: "https://service.webheads.co.kr/blog",
    publisher: { "@type": "Organization", name: "Webheads", url: "https://service.webheads.co.kr" },
    blogPost: blogPosts.map((p) => ({
      "@type": "BlogPosting", headline: p.title, description: p.summary, datePublished: p.date, keywords: p.keywords.join(", "), author: { "@type": "Organization", name: "Webheads" },
    })),
  };

  return (
    <>
      <SEO
        title={lang === "en" ? "LMS Insights | E-Learning Trends & Guides — WEBHEADS" : "LMS 인사이트 | 이러닝 트렌드 · 도입 가이드 — 웹헤즈"}
        description={lang === "en" ? "LMS adoption checklists, AI-based learning trends, e-learning platform cost guides and more professional insights for corporate training managers." : "LMS 도입 체크리스트, AI 기반 학습관리 트렌드, 이러닝 플랫폼 비용 가이드 등 기업교육 담당자를 위한 전문 인사이트를 제공합니다."}
        keywords="LMS, e-learning, AI LMS, learning management system, education platform"
        path="/blog"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative pt-24 pb-12 md:pt-28 md:pb-14 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-5 rounded-full text-xs font-semibold tracking-wider uppercase bg-foreground text-background">Blog & Insights</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-4" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif", letterSpacing: "-0.02em" }}>
            {lang === "en" ? "WEBHEADS LMS Insights" : "웹헤즈 LMS 인사이트"}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
            {lang === "en" ? (<>From e-learning adoption to AI learning trends,<br className="hidden md:block" />professional guides for corporate training managers.</>)
              : (<>이러닝 솔루션 도입부터 AI 학습관리 트렌드까지,<br className="hidden md:block" />기업교육 담당자를 위한 전문 가이드를 제공합니다.</>)}
          </p>
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={lang === "en" ? "Search by keyword, title, or tag..." : "키워드, 제목, 태그로 검색..."}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
            {searchQuery && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {filteredPosts.length}{lang === "en" ? " results" : "건"}
              </span>
            )}
          </div>
          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {allCategories.map((cat) => {
              const isActive = activeCategory === cat;
              const Icon = cat === "all" ? null : categoryIcons[cat];
              const label = cat === "all" ? (lang === "en" ? "All" : "전체") : catConfig[cat].label;
              const color = cat === "all" ? "hsl(var(--primary))" : categoryColors[cat];
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                    isActive
                      ? "text-white border-transparent shadow-md"
                      : "bg-card text-muted-foreground border-border hover:border-muted-foreground/40"
                  }`}
                  style={isActive ? { backgroundColor: color } : undefined}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {paginatedPosts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">{lang === "en" ? "No results found" : "검색 결과가 없습니다"}</p>
              <p className="text-muted-foreground/60 text-sm mt-1">{lang === "en" ? "Try different keywords" : "다른 키워드로 검색해보세요"}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.id} post={post} isExpanded={expandedId === post.id} onToggle={() => handleToggle(post.id)} lang={lang} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                    page === currentPage
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
              {lang === "en" ? "Not sure where to start with LMS adoption?" : "LMS 도입, 어디서부터 시작해야 할지 모르겠다면?"}
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {lang === "en" ? "Get a free consultation from WEBHEADS experts with 16 years of experience." : "16년 경험의 웹헤즈 전문 컨설턴트가 무료로 상담해드립니다."}
            </p>
            <Link to="/lms#contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-md">
              {lang === "en" ? "Request Free Consultation" : "무료 상담 신청하기"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
