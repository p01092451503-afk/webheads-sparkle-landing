import {
  Building2, Users, Calendar, MapPin, Phone, Mail, Globe,
  Award, Server, Bot, Smartphone, Film, ShieldCheck, Wrench,
  BookOpen, MonitorSmartphone, CreditCard, MessageCircle,
  ChevronRight, Briefcase, GraduationCap, Code2, Cloud,
  Shield, BarChart3, Zap
} from "lucide-react";
import ContactSection from "@/components/ContactSection";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";

const businessAreas = [
  {
    icon: BookOpen,
    title: "LMS Development & Supply",
    desc: "SI (custom build) and SaaS (rental) e-learning platforms for enterprises, government, universities, and academies.",
    tags: ["PHP", "Java", "React Native", "Flutter", "SaaS", "SI"],
  },
  {
    icon: Cloud,
    title: "IDC & Hosting Services",
    desc: "Web hosting, media hosting, CDN, AWS, and NCP cloud management with 24/7 monitoring and security.",
    tags: ["CDN", "AWS", "IDC", "NCP", "Backup"],
  },
  {
    icon: Bot,
    title: "AI Technology R&D",
    desc: "AI chatbot, AI tutor, and content recommendation engine — multilingual NLP-based systems integrated with LMS.",
    tags: ["AI Chatbot", "AI Tutor", "NLP", "Recommendation"],
  },
  {
    icon: ShieldCheck,
    title: "DRM & Content Security",
    desc: "Digital Rights Management solutions including ZonePlayer, Kollus, and StarPlayer integration.",
    tags: ["DRM", "Watermark", "Capture Prevention"],
  },
  {
    icon: Film,
    title: "Content Development",
    desc: "End-to-end e-learning content production — 4K video, interactive H5P, animation, and SCORM packaging.",
    tags: ["4K Video", "H5P", "SCORM", "Animation"],
  },
  {
    icon: CreditCard,
    title: "PG Payment Integration",
    desc: "Seamless integration with KG Inicis, Toss Payments, NicePay, and global gateways like Stripe and PayPal.",
    tags: ["Inicis", "Toss", "Stripe", "PayPal"],
  },
];

const orgTeams = [
  { icon: Briefcase, name: "CEO & Business", count: 1, detail: "Sales & Strategy" },
  { icon: Code2, name: "Solutions Team", count: 9, detail: "4 Senior · 4 Mid · 1 Junior" },
  { icon: Film, name: "Content Team", count: 2, detail: "2 Senior Engineers" },
  { icon: Server, name: "Hosting Team", count: 2, detail: "1 Senior · 1 Mid Engineer" },
  { icon: Users, name: "Business Support", count: 1, detail: "Operations & Admin" },
];

const majorClients = [
  { name: "Yanadoo", desc: "600K+ members · English video education", type: "SI Build & Delivery" },
  { name: "Weolbu", desc: "300K+ members · Real estate education", type: "SI Build · Hosting · Maintenance" },
  { name: "KAUAC", desc: "7K+ members · University admissions training", type: "SaaS · Content · Hosting" },
  { name: "KMAC", desc: "4M+ members · Corporate consulting & education", type: "SI Build · Hosting · Maintenance" },
];

const clientLogos = [
  "SK Hynix", "Pulmuone", "Incheon Airport", "Seoul Police",
  "Sungkyunkwan Univ.", "Korea Univ.", "Chung-Ang Univ.",
  "Catholic Univ.", "Kyungpook Univ.", "Sunmoon Univ.",
  "KG Eduwon", "Samyang Foods", "TransCosmos Korea",
  "Korea Appraisers Assoc.", "Gyeonggi Fire Dept.",
  "Korea Childcare Agency", "Thermofisher Scientific",
];

const lmsFeatures = [
  "Unified Admin Dashboard",
  "Unlimited Course Categories",
  "DRM Video Player Integration",
  "PG Auto-Integration (Card, Bank, Mobile)",
  "B2B Sales Management (CRM)",
  "Social Login (Google, Kakao, etc.)",
  "SMS & Email Notifications",
  "Completion Certificates",
  "PC & Mobile Sync Learning",
  "Live Video (Zoom, Kollus Live)",
  "AI Subtitle Generation",
  "Variable Speed Playback (0.5~2.0x)",
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Webheads"
        description="Webheads — 16 years of e-learning expertise. LMS development, hosting, AI, DRM, and content creation for 300+ enterprises."
        keywords="Webheads, about, e-learning company, LMS development, Korea"
        path="/about"
      />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(220,60%,8%) 0%, hsl(214,60%,18%) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(214 90% 52% / 0.2) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(192, 90%, 55%)" }}>ABOUT US</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                Building the Future<br />of <span style={{ color: "hsl(192, 90%, 55%)" }}>e-Learning</span>
              </h1>
              <p className="text-white/60 text-lg mt-6 max-w-lg leading-relaxed">
                Since 2010, Webheads has been delivering enterprise-grade LMS solutions, hosting, AI, and content services to 300+ organizations across Korea.
              </p>
            </div>
            <div className="flex gap-6">
              {[
                { value: "2010", label: "Founded" },
                { value: "300+", label: "Clients" },
                { value: "15", label: "Team Members" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="block text-3xl md:text-4xl font-black text-white">{s.value}</span>
                  <span className="block text-sm text-white/50 mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Company Overview ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">COMPANY OVERVIEW</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">Webheads Inc.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Building2, label: "Company", value: "Webheads Inc. (주식회사 웹헤즈)" },
              { icon: Calendar, label: "Established", value: "April 2, 2010 (16th year)" },
              { icon: MapPin, label: "Headquarters", value: "3F, 114 World Cup-ro, Mapo-gu, Seoul" },
              { icon: Server, label: "IDC Center", value: "LG U+ Gasan Digital Center, Geumcheon-gu" },
              { icon: Phone, label: "Contact", value: "02-540-4337 · Fax 02-6935-1004" },
              { icon: Globe, label: "Website", value: "www.webheads.co.kr" },
              { icon: Award, label: "Certification", value: "RCB Tech Assessment — Top Technology Company" },
              { icon: Shield, label: "Registration", value: "Package SW Development · Digital Content · DRM" },
              { icon: Mail, label: "Email", value: "34bus@webheads.co.kr" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/50 border border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Organization ── */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">ORGANIZATION</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">Our Team of 15 Experts</h2>
            <p className="text-muted-foreground mt-4 text-base">Specialized teams with an average of 15+ years of industry experience.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {orgTeams.map((team) => (
              <div key={team.name} className="rounded-2xl bg-background p-6 border border-border text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <team.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="block text-3xl font-black text-foreground">{team.count}</span>
                <h3 className="font-bold text-foreground text-sm mt-2">{team.name}</h3>
                <p className="text-muted-foreground text-xs mt-1">{team.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Business Areas ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">BUSINESS AREAS</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">Core Competencies</h2>
            <p className="text-muted-foreground mt-4 text-base">End-to-end e-learning services from platform development to infrastructure and content.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {businessAreas.map((area) => (
              <div key={area.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                  <area.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-base tracking-tight">{area.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{area.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {area.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LMS Features ── */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">LMS FEATURES</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">30+ Built-in Capabilities</h2>
            <p className="text-muted-foreground mt-4 text-base">Everything needed for online education, out of the box.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lmsFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Major Clients ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">CLIENTS</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">Trusted by 300+ Organizations</h2>
            <p className="text-muted-foreground mt-4 text-base">From startups to large enterprises and government agencies.</p>
          </div>

          {/* Featured Clients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {majorClients.map((client) => (
              <div key={client.name} className="rounded-2xl p-7 border border-border bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{client.name}</h3>
                    <p className="text-xs text-muted-foreground">{client.type}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{client.desc}</p>
              </div>
            ))}
          </div>

          {/* Client Logo Cloud */}
          <div className="rounded-2xl border border-border p-8 bg-secondary/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5 text-center">AND MANY MORE</p>
            <div className="flex flex-wrap justify-center gap-3">
              {clientLogos.map((name) => (
                <span key={name} className="text-xs px-4 py-2 rounded-full border border-border bg-background font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Maintenance Policy ── */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">SUPPORT</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">Maintenance & Support Policy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Free Maintenance",
                desc: "12 months of complimentary maintenance after system delivery. Bug fixes resolved within 3 hours of report.",
                tag: "Included",
              },
              {
                title: "Paid Maintenance",
                desc: "Feature additions, design changes, and extended development beyond the initial agreement scope.",
                tag: "Optional",
              },
              {
                title: "Rebuild / Re-dev",
                desc: "Full or partial system rebuild when requirements exceed maintenance scope. Includes expansion and enhancement.",
                tag: "Custom Quote",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-background p-7 border border-border">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{item.tag}</span>
                <h3 className="font-bold text-foreground text-lg mt-4 mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />
    </div>
  );
}
