/**
 * Abstract, metaphysical SVG background patterns for hero sections.
 * Each variant is unique per service page, inspired by Elice-style flowing lines.
 */

interface HeroAbstractBgProps {
  variant: "lms" | "hosting" | "maintenance" | "chatbot" | "appdev" | "drm" | "channel" | "pg" | "content";
}

/* Flowing orbital rings — concentric wavy curves */
function LmsPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="lms-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(255,75%,65%)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="hsl(220,90%,60%)" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
        <ellipse
          key={`tr-${i}`}
          cx={1100 + i * 8}
          cy={120 + i * 6}
          rx={180 + i * 28}
          ry={100 + i * 18}
          stroke="url(#lms-g1)"
          strokeWidth={2}
          fill="none"
          transform={`rotate(${-25 + i * 2}, ${1100 + i * 8}, ${120 + i * 6})`}
          opacity={0.7 - i * 0.04}
        />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <circle
          key={`bl-${i}`}
          cx={-60}
          cy={780}
          r={120 + i * 50}
          stroke="hsl(255,60%,70%)"
          strokeWidth={1.5}
          fill="none"
          opacity={0.35 - i * 0.03}
        />
      ))}
    </svg>
  );
}

/* Expanding concentric circles + flowing data streams */
function HostingPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
        <circle
          key={`c-${i}`}
          cx={200}
          cy={150}
          r={60 + i * 45}
          stroke="hsl(195,70%,50%)"
          strokeWidth={1.5}
          fill="none"
          opacity={0.4 - i * 0.03}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <path
          key={`w-${i}`}
          d={`M 900 ${600 + i * 25} Q 1050 ${560 + i * 25}, 1200 ${620 + i * 25} T 1500 ${580 + i * 25}`}
          stroke="hsl(200,65%,55%)"
          strokeWidth={1.8}
          fill="none"
          opacity={0.35 - i * 0.04}
        />
      ))}
    </svg>
  );
}

/* Rotating geometric arcs + diagnostic scan lines */
function MaintenancePattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <path
          key={`a-${i}`}
          d={`M ${1200 + Math.cos(i * 1.05) * 200} ${300 + Math.sin(i * 1.05) * 150} A 200 150 0 0 1 ${1200 + Math.cos(i * 1.05 + 0.8) * 200} ${300 + Math.sin(i * 1.05 + 0.8) * 150}`}
          stroke="hsl(210,45%,55%)"
          strokeWidth={2.2}
          fill="none"
          opacity={0.4 - i * 0.04}
        />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
        <line
          key={`l-${i}`}
          x1={-50 + i * 35}
          y1={500}
          x2={100 + i * 35}
          y2={850}
          stroke="hsl(215,40%,55%)"
          strokeWidth={1.2}
          opacity={0.25}
        />
      ))}
      {[0, 1, 2, 3].map(i => (
        <circle
          key={`mc-${i}`}
          cx={720}
          cy={400}
          r={250 + i * 60}
          stroke="hsl(210,35%,60%)"
          strokeWidth={1}
          fill="none"
          opacity={0.2}
          strokeDasharray="8 12"
        />
      ))}
    </svg>
  );
}

/* Neural network connected curves + bezier nodes */
function ChatbotPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="chat-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(190,80%,45%)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(220,75%,55%)" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* Large organic blobs - top right */}
      <path d="M 1100 80 C 1200 40, 1350 120, 1400 250 C 1450 380, 1300 420, 1180 380 C 1060 340, 1000 200, 1100 80 Z" stroke="url(#chat-g1)" strokeWidth={3} fill="none" opacity={0.6} />
      <path d="M 1080 60 C 1190 10, 1380 100, 1430 260 C 1480 420, 1310 470, 1160 410 C 1010 350, 960 180, 1080 60 Z" stroke="hsl(185,70%,50%)" strokeWidth={2.5} fill="none" opacity={0.5} />
      <path d="M 1060 40 C 1180 -20, 1410 80, 1460 270 C 1510 460, 1320 520, 1140 440 C 960 360, 920 160, 1060 40 Z" stroke="hsl(195,65%,48%)" strokeWidth={2} fill="none" opacity={0.4} />
      <path d="M 1040 20 C 1170 -50, 1440 60, 1490 280 C 1540 500, 1330 570, 1120 470 C 910 370, 880 140, 1040 20 Z" stroke="hsl(200,60%,52%)" strokeWidth={1.6} fill="none" opacity={0.3} />
      {/* Flowing wave lines - bottom left */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
        <path
          key={`s-${i}`}
          d={`M ${-40 + i * 8} ${600 + i * 18} C ${120 + i * 25} ${550 + i * 12}, ${240 + i * 18} ${660 + i * 10}, ${400 + i * 12} ${620 + i * 14} S ${550 + i * 10} ${680 + i * 8}, ${700 + i * 8} ${640 + i * 12}`}
          stroke="hsl(190,65%,50%)"
          strokeWidth={2.2 - i * 0.1}
          fill="none"
          opacity={0.6 - i * 0.04}
        />
      ))}
      {/* Concentric arcs - mid area */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <circle
          key={`cc-${i}`}
          cx={180}
          cy={200}
          r={80 + i * 50}
          stroke="hsl(195,70%,50%)"
          strokeWidth={1.8}
          fill="none"
          opacity={0.5 - i * 0.06}
          strokeDasharray={i % 2 === 0 ? "none" : "12 8"}
        />
      ))}
      {/* Floating nodes */}
      {[
        [1150, 180, 6], [1250, 300, 5], [1100, 350, 4], [1300, 150, 7], [1350, 380, 5],
        [100, 680, 5], [220, 720, 4], [330, 660, 6], [150, 750, 3], [1200, 200, 4],
        [80, 300, 3], [250, 150, 4]
      ].map(([cx, cy, r], i) => (
        <circle key={`d-${i}`} cx={cx} cy={cy} r={r} fill="hsl(190,75%,50%)" opacity={0.55} />
      ))}
      {/* Connection lines between nodes */}
      {[
        [1150, 180, 1250, 300], [1250, 300, 1350, 380], [1100, 350, 1300, 150],
        [100, 680, 220, 720], [220, 720, 330, 660]
      ].map(([x1, y1, x2, y2], i) => (
        <line key={`ln-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(190,65%,55%)" strokeWidth={1.5} opacity={0.35} />
      ))}
    </svg>
  );
}

/* Möbius / infinity flowing ribbon lines */
function AppDevPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <path
          key={`r-${i}`}
          d={`M -50 ${80 + i * 18} C 300 ${30 + i * 18}, 500 ${160 + i * 18}, 750 ${100 + i * 18} S 1100 ${180 + i * 18}, 1500 ${90 + i * 18}`}
          stroke="hsl(170,55%,48%)"
          strokeWidth={1.8}
          fill="none"
          opacity={0.35 - i * 0.025}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const s = 80 + i * 40;
        const cx = 1250, cy = 650;
        return (
          <rect
            key={`d-${i}`}
            x={cx - s / 2}
            y={cy - s / 2}
            width={s}
            height={s}
            stroke="hsl(165,50%,50%)"
            strokeWidth={1.4}
            fill="none"
            transform={`rotate(45, ${cx}, ${cy})`}
            opacity={0.3 - i * 0.035}
          />
        );
      })}
    </svg>
  );
}

/* Shield-like geometric arcs + encryption grid */
function DrmPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <path
          key={`sh-${i}`}
          d={`M ${1300 - i * 30} ${-20 + i * 10} Q ${1350 - i * 15} ${200 + i * 20}, ${1200 - i * 25} ${400 + i * 15}`}
          stroke="hsl(225,65%,58%)"
          strokeWidth={2}
          fill="none"
          opacity={0.4 - i * 0.035}
        />
      ))}
      {[0, 1, 2, 3, 4].map(row =>
        [0, 1, 2, 3].map(col => {
          const cx = col * 80 + (row % 2) * 40 - 20;
          const cy = 580 + row * 50;
          return (
            <polygon
              key={`h-${row}-${col}`}
              points={[0, 1, 2, 3, 4, 5].map(k => {
                const angle = (Math.PI / 3) * k - Math.PI / 6;
                return `${cx + 22 * Math.cos(angle)},${cy + 22 * Math.sin(angle)}`;
              }).join(" ")}
              stroke="hsl(230,55%,55%)"
              strokeWidth={1.2}
              fill="none"
              opacity={0.25}
            />
          );
        })
      )}
    </svg>
  );
}

/* Wave propagation ripple rings */
function ChannelPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
        <ellipse
          key={`rp-${i}`}
          cx={1300}
          cy={100}
          rx={80 + i * 55}
          ry={50 + i * 35}
          stroke="hsl(155,55%,48%)"
          strokeWidth={1.8}
          fill="none"
          opacity={0.4 - i * 0.03}
          transform={`rotate(-10, 1300, 100)`}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <path
          key={`fc-${i}`}
          d={`M -30 ${620 + i * 22} Q 200 ${580 + i * 22}, 400 ${640 + i * 22} T 800 ${610 + i * 22}`}
          stroke="hsl(160,50%,50%)"
          strokeWidth={1.5}
          fill="none"
          opacity={0.3 - i * 0.035}
        />
      ))}
    </svg>
  );
}

/* Flowing transaction stream lines + geometric frames */
function PgPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
        <path
          key={`pc-${i}`}
          d={`M -50 ${60 + i * 22} C 350 ${20 + i * 22}, 500 ${120 + i * 22}, 850 ${50 + i * 22} S 1200 ${130 + i * 22}, 1500 ${70 + i * 22}`}
          stroke="hsl(240,60%,58%)"
          strokeWidth={1.6}
          fill="none"
          opacity={0.35 - i * 0.025}
        />
      ))}
      {[0, 1, 2, 3].map(i => (
        <rect
          key={`rf-${i}`}
          x={1100 - i * 40}
          y={550 - i * 30}
          width={280 + i * 80}
          height={180 + i * 60}
          rx={30 + i * 10}
          stroke="hsl(235,55%,55%)"
          strokeWidth={1.4}
          fill="none"
          opacity={0.3 - i * 0.05}
        />
      ))}
    </svg>
  );
}

/* Spiral / golden ratio flowing curves */
function ContentPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      {[0, 1, 2, 3, 4, 5, 6].map(i => {
        const r = 60 + i * 50;
        const startAngle = i * 0.6;
        const endAngle = startAngle + 2.2;
        const cx = 1200, cy = 200;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        return (
          <path
            key={`sp-${i}`}
            d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
            stroke="hsl(30,60%,50%)"
            strokeWidth={2}
            fill="none"
            opacity={0.4 - i * 0.04}
          />
        );
      })}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <path
          key={`oc-${i}`}
          d={`M -40 ${580 + i * 20} C 150 ${540 + i * 20}, 280 ${620 + i * 20}, 500 ${570 + i * 20}`}
          stroke="hsl(25,55%,55%)"
          strokeWidth={1.5}
          fill="none"
          opacity={0.3 - i * 0.025}
        />
      ))}
      {[
        [1150, 120], [1280, 280], [1100, 320], [1320, 160], [1250, 380],
      ].map(([cx, cy], i) => (
        <circle key={`sc-${i}`} cx={cx} cy={cy} r={4} fill="hsl(30,55%,55%)" opacity={0.35} />
      ))}
    </svg>
  );
}

const patterns: Record<HeroAbstractBgProps["variant"], () => JSX.Element> = {
  lms: LmsPattern,
  hosting: HostingPattern,
  maintenance: MaintenancePattern,
  chatbot: ChatbotPattern,
  appdev: AppDevPattern,
  drm: DrmPattern,
  channel: ChannelPattern,
  pg: PgPattern,
  content: ContentPattern,
};

export default function HeroAbstractBg({ variant }: HeroAbstractBgProps) {
  const Pattern = patterns[variant];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Pattern />
    </div>
  );
}
