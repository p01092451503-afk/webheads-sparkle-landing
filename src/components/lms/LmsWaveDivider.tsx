/**
 * Wave-shaped section divider unique to LMS page.
 * Other service pages use flat section transitions.
 */
interface LmsWaveDividerProps {
  flip?: boolean;
  colorFrom?: string;
  colorTo?: string;
}

export default function LmsWaveDivider({
  flip = false,
  colorFrom = "hsl(var(--background))",
  colorTo = "transparent",
}: LmsWaveDividerProps) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 60,
        marginTop: flip ? 0 : -1,
        marginBottom: flip ? -1 : 0,
        transform: flip ? "scaleY(-1)" : undefined,
      }}
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M0,20 C360,55 720,0 1080,35 C1260,50 1380,20 1440,25 L1440,60 L0,60 Z"
          fill={colorFrom}
        />
      </svg>
    </div>
  );
}
