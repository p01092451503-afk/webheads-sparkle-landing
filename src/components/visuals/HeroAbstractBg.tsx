/**
 * Abstract, metaphysical SVG background patterns for hero sections.
 * Each variant is unique per service page, inspired by Elice-style flowing shapes with depth.
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
          <stop offset="0%" stopColor="hsl(255,75%,65%)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="hsl(220,90%,60%)" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="lms-blob1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(255,75%,65%)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="hsl(220,90%,60%)" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="lms-rg2" cx="55%" cy="15%">
          <stop offset="0%" stopColor="hsl(240,80%,70%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(220,70%,60%)" stopOpacity="0" />
        </radialGradient>
        <filter id="lms-blur1"><feGaussianBlur stdDeviation="50" /></filter>
        <filter id="lms-blur2"><feGaussianBlur stdDeviation="30" /></filter>
      </defs>
      {/* Large depth blobs */}
      <ellipse cx="1100" cy="180" rx="450" ry="320" fill="url(#lms-blob1)" filter="url(#lms-blur1)" />
      <ellipse cx="50" cy="700" rx="380" ry="280" fill="hsl(255,60%,70%)" fillOpacity="0.22" filter="url(#lms-blur1)" />
      <ellipse cx="750" cy="80" rx="300" ry="180" fill="url(#lms-rg2)" filter="url(#lms-blur2)" />
      <ellipse cx="400" cy="500" rx="200" ry="150" fill="hsl(220,80%,65%)" fillOpacity="0.12" filter="url(#lms-blur1)" />
      {/* Orbital rings */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
        <ellipse
          key={`tr-${i}`}
          cx={1100 + i * 8}
          cy={120 + i * 6}
          rx={180 + i * 28}
          ry={100 + i * 18}
          stroke="url(#lms-g1)"
          strokeWidth={2.5 - i * 0.1}
          fill="none"
          transform={`rotate(${-25 + i * 2}, ${1100 + i * 8}, ${120 + i * 6})`}
          opacity={0.8 - i * 0.04}
        />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <circle
          key={`bl-${i}`}
          cx={-60}
          cy={780}
          r={120 + i * 50}
          stroke="hsl(255,60%,70%)"
          strokeWidth={1.8}
          fill="none"
          opacity={0.4 - i * 0.03}
        />
      ))}
    </svg>
  );
}

/* Expanding concentric circles + flowing data streams */
function HostingPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      <defs>
        <radialGradient id="host-rg1" cx="15%" cy="20%">
          <stop offset="0%" stopColor="hsl(195,70%,55%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(200,65%,50%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="host-blob" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(195,80%,60%)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(205,70%,50%)" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="host-rg2" cx="50%" cy="60%">
          <stop offset="0%" stopColor="hsl(200,75%,58%)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(195,60%,50%)" stopOpacity="0" />
        </radialGradient>
        <filter id="host-blur"><feGaussianBlur stdDeviation="45" /></filter>
        <filter id="host-blur2"><feGaussianBlur stdDeviation="30" /></filter>
      </defs>
      {/* Large depth blobs */}
      <circle cx="200" cy="150" r="420" fill="url(#host-rg1)" />
      <ellipse cx="1050" cy="550" rx="400" ry="300" fill="url(#host-blob)" filter="url(#host-blur)" />
      <ellipse cx="600" cy="30" rx="320" ry="200" fill="hsl(195,65%,55%)" fillOpacity="0.15" filter="url(#host-blur2)" />
      <ellipse cx="900" cy="300" rx="220" ry="160" fill="url(#host-rg2)" filter="url(#host-blur)" />
      {/* Concentric circles */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
        <circle
          key={`c-${i}`}
          cx={200}
          cy={150}
          r={60 + i * 45}
          stroke="hsl(195,70%,50%)"
          strokeWidth={2.2 - i * 0.1}
          fill="none"
          opacity={0.55 - i * 0.035}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <path
          key={`w-${i}`}
          d={`M 900 ${600 + i * 25} Q 1050 ${560 + i * 25}, 1200 ${620 + i * 25} T 1500 ${580 + i * 25}`}
          stroke="hsl(200,65%,55%)"
          strokeWidth={2.2 - i * 0.15}
          fill="none"
          opacity={0.5 - i * 0.05}
        />
      ))}
    </svg>
  );
}

/* Rotating geometric arcs + diagnostic scan lines */
function MaintenancePattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="mnt-blob1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(210,50%,60%)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(215,45%,50%)" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="mnt-rg1" cx="80%" cy="35%">
          <stop offset="0%" stopColor="hsl(210,55%,58%)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(215,40%,55%)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mnt-rg2" cx="50%" cy="50%">
          <stop offset="0%" stopColor="hsl(210,60%,62%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(215,50%,55%)" stopOpacity="0" />
        </radialGradient>
        <filter id="mnt-blur"><feGaussianBlur stdDeviation="45" /></filter>
        <filter id="mnt-blur2"><feGaussianBlur stdDeviation="25" /></filter>
      </defs>
      {/* Large depth blobs */}
      <ellipse cx="1200" cy="280" rx="420" ry="300" fill="url(#mnt-rg1)" />
      <ellipse cx="150" cy="650" rx="380" ry="260" fill="url(#mnt-blob1)" filter="url(#mnt-blur)" />
      <ellipse cx="720" cy="80" rx="300" ry="160" fill="hsl(210,50%,60%)" fillOpacity="0.15" filter="url(#mnt-blur2)" />
      <ellipse cx="500" cy="450" rx="200" ry="150" fill="url(#mnt-rg2)" filter="url(#mnt-blur)" />
      {/* Arcs */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <path
          key={`a-${i}`}
          d={`M ${1200 + Math.cos(i * 1.05) * 200} ${300 + Math.sin(i * 1.05) * 150} A 200 150 0 0 1 ${1200 + Math.cos(i * 1.05 + 0.8) * 200} ${300 + Math.sin(i * 1.05 + 0.8) * 150}`}
          stroke="hsl(210,45%,55%)"
          strokeWidth={2.8 - i * 0.2}
          fill="none"
          opacity={0.55 - i * 0.05}
        />
      ))}
      {/* Scan lines */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
        <line
          key={`l-${i}`}
          x1={-50 + i * 35}
          y1={500}
          x2={100 + i * 35}
          y2={850}
          stroke="hsl(215,40%,55%)"
          strokeWidth={1.4}
          opacity={0.3}
        />
      ))}
      {/* Dashed circles */}
      {[0, 1, 2, 3].map(i => (
        <circle
          key={`mc-${i}`}
          cx={720}
          cy={400}
          r={250 + i * 60}
          stroke="hsl(210,35%,60%)"
          strokeWidth={1.4}
          fill="none"
          opacity={0.28}
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
        <linearGradient id="chat-blob1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(190,80%,55%)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(185,70%,45%)" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="chat-rg" cx="75%" cy="15%">
          <stop offset="0%" stopColor="hsl(190,70%,55%)" stopOpacity="0.38" />
          <stop offset="100%" stopColor="hsl(195,60%,50%)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="chat-rg2" cx="40%" cy="70%">
          <stop offset="0%" stopColor="hsl(185,75%,52%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(190,60%,48%)" stopOpacity="0" />
        </radialGradient>
        <filter id="chat-blur"><feGaussianBlur stdDeviation="50" /></filter>
        <filter id="chat-blur2"><feGaussianBlur stdDeviation="30" /></filter>
      </defs>
      {/* Large depth blobs */}
      <ellipse cx="1150" cy="160" rx="420" ry="300" fill="url(#chat-rg)" />
      <ellipse cx="150" cy="650" rx="360" ry="250" fill="url(#chat-blob1)" filter="url(#chat-blur)" />
      <ellipse cx="700" cy="30" rx="280" ry="160" fill="hsl(190,65%,55%)" fillOpacity="0.15" filter="url(#chat-blur2)" />
      <ellipse cx="500" cy="400" rx="220" ry="160" fill="url(#chat-rg2)" filter="url(#chat-blur)" />
      {/* Neural loops with fill */}
      <path d="M 1100 80 C 1200 40, 1350 120, 1400 250 C 1450 380, 1300 420, 1180 380 C 1060 340, 1000 200, 1100 80 Z" stroke="hsl(190,70%,50%)" strokeWidth={2.5} fill="hsl(190,70%,50%)" fillOpacity="0.08" opacity={0.5} />
      <path d="M 1080 60 C 1190 10, 1380 100, 1430 260 C 1480 420, 1310 470, 1160 410 C 1010 350, 960 180, 1080 60 Z" stroke="hsl(185,65%,55%)" strokeWidth={2} fill="hsl(185,65%,55%)" fillOpacity="0.05" opacity={0.38} />
      <path d="M 1060 40 C 1180 -20, 1410 80, 1460 270 C 1510 460, 1320 520, 1140 440 C 960 360, 920 160, 1060 40 Z" stroke="hsl(195,60%,50%)" strokeWidth={1.6} fill="none" opacity={0.25} />
      {/* Bottom waves */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <path
          key={`s-${i}`}
          d={`M ${-20 + i * 10} ${650 + i * 15} C ${100 + i * 30} ${600 + i * 10}, ${200 + i * 20} ${700 + i * 8}, ${350 + i * 15} ${670 + i * 12}`}
          stroke="hsl(190,60%,55%)"
          strokeWidth={2 - i * 0.1}
          fill="none"
          opacity={0.42 - i * 0.03}
        />
      ))}
      {/* Nodes with bigger glow */}
      {[
        [1150, 180], [1250, 300], [1100, 350], [1300, 150], [1350, 380],
        [100, 680], [200, 720], [300, 660], [150, 750]
      ].map(([cx, cy], i) => (
        <g key={`d-${i}`}>
          <circle cx={cx} cy={cy} r={14} fill="hsl(190,70%,55%)" opacity={0.15} />
          <circle cx={cx} cy={cy} r={4.5} fill="hsl(190,70%,55%)" opacity={0.6} />
        </g>
      ))}
    </svg>
  );
}

/* Möbius / infinity flowing ribbon lines */
function AppDevPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="app-blob1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(170,60%,50%)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(165,55%,40%)" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="app-rg" cx="30%" cy="15%">
          <stop offset="0%" stopColor="hsl(170,65%,52%)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="hsl(165,55%,45%)" stopOpacity="0" />
        </radialGradient>
        <filter id="app-blur"><feGaussianBlur stdDeviation="50" /></filter>
        <filter id="app-blur2"><feGaussianBlur stdDeviation="25" /></filter>
      </defs>
      {/* Large depth blobs */}
      <ellipse cx="350" cy="80" rx="450" ry="230" fill="url(#app-rg)" />
      <ellipse cx="1200" cy="600" rx="380" ry="280" fill="url(#app-blob1)" filter="url(#app-blur)" />
      <ellipse cx="850" cy="350" rx="250" ry="180" fill="hsl(170,50%,50%)" fillOpacity="0.12" filter="url(#app-blur2)" />
      <ellipse cx="100" cy="500" rx="200" ry="150" fill="hsl(165,55%,48%)" fillOpacity="0.15" filter="url(#app-blur)" />
      {/* Ribbon lines */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <path
          key={`r-${i}`}
          d={`M -50 ${80 + i * 18} C 300 ${30 + i * 18}, 500 ${160 + i * 18}, 750 ${100 + i * 18} S 1100 ${180 + i * 18}, 1500 ${90 + i * 18}`}
          stroke="hsl(170,55%,48%)"
          strokeWidth={2.2 - i * 0.1}
          fill="none"
          opacity={0.5 - i * 0.03}
        />
      ))}
      {/* Diamonds with subtle fill */}
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
            strokeWidth={1.8 - i * 0.1}
            fill={i < 2 ? "hsl(165,50%,50%)" : "none"}
            fillOpacity={i === 0 ? 0.1 : i === 1 ? 0.05 : 0}
            transform={`rotate(45, ${cx}, ${cy})`}
            opacity={0.42 - i * 0.04}
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
      <defs>
        <linearGradient id="drm-blob1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(225,70%,62%)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(230,60%,50%)" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="drm-rg" cx="85%" cy="15%">
          <stop offset="0%" stopColor="hsl(225,65%,60%)" stopOpacity="0.38" />
          <stop offset="100%" stopColor="hsl(230,55%,55%)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="drm-rg2" cx="20%" cy="80%">
          <stop offset="0%" stopColor="hsl(225,60%,58%)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="hsl(230,50%,50%)" stopOpacity="0" />
        </radialGradient>
        <filter id="drm-blur"><feGaussianBlur stdDeviation="45" /></filter>
        <filter id="drm-blur2"><feGaussianBlur stdDeviation="28" /></filter>
      </defs>
      {/* Large depth blobs */}
      <ellipse cx="1200" cy="180" rx="400" ry="300" fill="url(#drm-rg)" />
      <ellipse cx="120" cy="620" rx="360" ry="260" fill="url(#drm-blob1)" filter="url(#drm-blur)" />
      <ellipse cx="700" cy="400" rx="250" ry="180" fill="url(#drm-rg2)" filter="url(#drm-blur2)" />
      {/* Shield arcs */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <path
          key={`sh-${i}`}
          d={`M ${1300 - i * 30} ${-20 + i * 10} Q ${1350 - i * 15} ${200 + i * 20}, ${1200 - i * 25} ${400 + i * 15}`}
          stroke="hsl(225,65%,58%)"
          strokeWidth={2.5 - i * 0.12}
          fill="none"
          opacity={0.55 - i * 0.04}
        />
      ))}
      {/* Hexagons with subtle fill */}
      {[0, 1, 2, 3, 4].map(row =>
        [0, 1, 2, 3].map(col => {
          const cx = col * 80 + (row % 2) * 40 - 20;
          const cy = 580 + row * 50;
          const points = [0, 1, 2, 3, 4, 5].map(k => {
            const angle = (Math.PI / 3) * k - Math.PI / 6;
            return `${cx + 22 * Math.cos(angle)},${cy + 22 * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon
              key={`h-${row}-${col}`}
              points={points}
              stroke="hsl(230,55%,55%)"
              strokeWidth={1.6}
              fill={row < 2 ? "hsl(230,55%,55%)" : "none"}
              fillOpacity={row === 0 ? 0.08 : row === 1 ? 0.04 : 0}
              opacity={0.35}
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
      <defs>
        <radialGradient id="ch-rg" cx="90%" cy="12%">
          <stop offset="0%" stopColor="hsl(155,60%,50%)" stopOpacity="0.38" />
          <stop offset="100%" stopColor="hsl(160,55%,45%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ch-blob" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(155,55%,52%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(160,50%,40%)" stopOpacity="0.06" />
        </linearGradient>
        <radialGradient id="ch-rg2" cx="40%" cy="50%">
          <stop offset="0%" stopColor="hsl(155,65%,52%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(160,55%,45%)" stopOpacity="0" />
        </radialGradient>
        <filter id="ch-blur"><feGaussianBlur stdDeviation="50" /></filter>
        <filter id="ch-blur2"><feGaussianBlur stdDeviation="28" /></filter>
      </defs>
      {/* Large depth blobs */}
      <ellipse cx="1250" cy="80" rx="450" ry="320" fill="url(#ch-rg)" />
      <ellipse cx="200" cy="620" rx="380" ry="260" fill="url(#ch-blob)" filter="url(#ch-blur)" />
      <ellipse cx="700" cy="350" rx="250" ry="180" fill="url(#ch-rg2)" filter="url(#ch-blur2)" />
      {/* Ripple rings */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
        <ellipse
          key={`rp-${i}`}
          cx={1300}
          cy={100}
          rx={80 + i * 55}
          ry={50 + i * 35}
          stroke="hsl(155,55%,48%)"
          strokeWidth={2.2 - i * 0.1}
          fill="none"
          opacity={0.55 - i * 0.035}
          transform={`rotate(-10, 1300, 100)`}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <path
          key={`fc-${i}`}
          d={`M -30 ${620 + i * 22} Q 200 ${580 + i * 22}, 400 ${640 + i * 22} T 800 ${610 + i * 22}`}
          stroke="hsl(160,50%,50%)"
          strokeWidth={2 - i * 0.15}
          fill="none"
          opacity={0.42 - i * 0.04}
        />
      ))}
    </svg>
  );
}

/* Flowing transaction stream lines + geometric frames */
function PgPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="pg-blob1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(240,65%,62%)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(235,60%,50%)" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="pg-rg" cx="30%" cy="10%">
          <stop offset="0%" stopColor="hsl(240,60%,60%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(240,55%,55%)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pg-rg2" cx="80%" cy="70%">
          <stop offset="0%" stopColor="hsl(235,60%,58%)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="hsl(240,50%,52%)" stopOpacity="0" />
        </radialGradient>
        <filter id="pg-blur"><feGaussianBlur stdDeviation="45" /></filter>
        <filter id="pg-blur2"><feGaussianBlur stdDeviation="28" /></filter>
      </defs>
      {/* Large depth blobs */}
      <ellipse cx="380" cy="60" rx="450" ry="230" fill="url(#pg-rg)" />
      <ellipse cx="1150" cy="560" rx="380" ry="280" fill="url(#pg-blob1)" filter="url(#pg-blur)" />
      <ellipse cx="800" cy="350" rx="250" ry="180" fill="url(#pg-rg2)" filter="url(#pg-blur2)" />
      {/* Stream lines */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
        <path
          key={`pc-${i}`}
          d={`M -50 ${60 + i * 22} C 350 ${20 + i * 22}, 500 ${120 + i * 22}, 850 ${50 + i * 22} S 1200 ${130 + i * 22}, 1500 ${70 + i * 22}`}
          stroke="hsl(240,60%,58%)"
          strokeWidth={2 - i * 0.08}
          fill="none"
          opacity={0.5 - i * 0.03}
        />
      ))}
      {/* Rounded rects with fill */}
      {[0, 1, 2, 3].map(i => (
        <rect
          key={`rf-${i}`}
          x={1100 - i * 40}
          y={550 - i * 30}
          width={280 + i * 80}
          height={180 + i * 60}
          rx={30 + i * 10}
          stroke="hsl(235,55%,55%)"
          strokeWidth={1.8 - i * 0.15}
          fill={i < 2 ? "hsl(235,55%,55%)" : "none"}
          fillOpacity={i === 0 ? 0.08 : i === 1 ? 0.04 : 0}
          opacity={0.42 - i * 0.06}
        />
      ))}
    </svg>
  );
}

/* Spiral / golden ratio flowing curves */
function ContentPattern() {
  return (
    <svg viewBox="0 0 1440 800" fill="none" className="w-full h-full">
      <defs>
        <radialGradient id="cnt-rg" cx="80%" cy="25%">
          <stop offset="0%" stopColor="hsl(30,65%,55%)" stopOpacity="0.38" />
          <stop offset="100%" stopColor="hsl(25,60%,45%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cnt-blob" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(30,60%,55%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(35,55%,45%)" stopOpacity="0.06" />
        </linearGradient>
        <radialGradient id="cnt-rg2" cx="50%" cy="50%">
          <stop offset="0%" stopColor="hsl(28,65%,52%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(32,55%,48%)" stopOpacity="0" />
        </radialGradient>
        <filter id="cnt-blur"><feGaussianBlur stdDeviation="48" /></filter>
        <filter id="cnt-blur2"><feGaussianBlur stdDeviation="28" /></filter>
      </defs>
      {/* Large depth blobs */}
      <ellipse cx="1150" cy="180" rx="400" ry="300" fill="url(#cnt-rg)" />
      <ellipse cx="180" cy="580" rx="360" ry="250" fill="url(#cnt-blob)" filter="url(#cnt-blur)" />
      <ellipse cx="700" cy="60" rx="280" ry="160" fill="hsl(30,55%,55%)" fillOpacity="0.14" filter="url(#cnt-blur2)" />
      <ellipse cx="500" cy="400" rx="220" ry="160" fill="url(#cnt-rg2)" filter="url(#cnt-blur)" />
      {/* Spiral arcs */}
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
            strokeWidth={2.5 - i * 0.12}
            fill="none"
            opacity={0.55 - i * 0.05}
          />
        );
      })}
      {/* Bottom curves */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <path
          key={`oc-${i}`}
          d={`M -40 ${580 + i * 20} C 150 ${540 + i * 20}, 280 ${620 + i * 20}, 500 ${570 + i * 20}`}
          stroke="hsl(25,55%,55%)"
          strokeWidth={2 - i * 0.1}
          fill="none"
          opacity={0.42 - i * 0.03}
        />
      ))}
      {/* Nodes with bigger glow */}
      {[
        [1150, 120], [1280, 280], [1100, 320], [1320, 160], [1250, 380],
      ].map(([cx, cy], i) => (
        <g key={`sc-${i}`}>
          <circle cx={cx} cy={cy} r={14} fill="hsl(30,55%,55%)" opacity={0.12} />
          <circle cx={cx} cy={cy} r={5} fill="hsl(30,55%,55%)" opacity={0.5} />
        </g>
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
