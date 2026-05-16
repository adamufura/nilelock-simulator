type Props = { locked: boolean; className?: string };

/** Wall-panel padlock: shackle lifts when unlocked (CSS transition). */
export function PadlockSvg({ locked, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 100 118"
      className={`text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] ${className}`}
      aria-hidden
    >
      <rect
        x="22"
        y="56"
        width="56"
        height="52"
        rx="10"
        fill="currentColor"
        opacity={0.95}
      />
      <circle cx="50" cy="82" r="6" fill="rgba(0,0,0,0.25)" />
      <g
        style={{
          transform: locked ? "translateY(0px)" : "translateY(-18px)",
          transformOrigin: "50px 56px",
          transition: "transform 0.4s ease",
        }}
      >
        <path
          d="M 32 58 L 32 34 Q 50 12 68 34 L 68 58"
          fill="none"
          stroke="currentColor"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
