import { cn } from "@/lib/utils"

/**
 * Decorative compass rose used as a low-opacity watermark behind the child hero.
 * Purely ornamental — hidden from assistive tech, and the slow rotation is
 * disabled by the prefers-reduced-motion block in globals.css.
 */
export function CompassRose({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 200 200"
      className={cn("pointer-events-none select-none text-accent", className)}
      fill="none"
      stroke="currentColor"
    >
      <circle cx="100" cy="100" r="96" strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="74" strokeWidth="0.75" opacity="0.35" />
      <circle cx="100" cy="100" r="46" strokeWidth="0.75" opacity="0.35" />

      {/* Tick marks every 15° around the outer ring */}
      <g opacity="0.4" strokeWidth="1">
        {Array.from({ length: 24 }, (_, i) => i * 15).map((deg) => (
          <line
            key={deg}
            x1="100"
            y1="6"
            x2="100"
            y2={deg % 90 === 0 ? 20 : 14}
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </g>

      {/* Four-point star: cardinal points filled, intercardinals outlined */}
      <g>
        <path
          d="M100 18 L112 88 L100 100 L88 88 Z M100 182 L112 112 L100 100 L88 112 Z"
          fill="currentColor"
          fillOpacity="0.55"
          strokeWidth="0.5"
        />
        <path
          d="M18 100 L88 112 L100 100 L88 88 Z M182 100 L112 112 L100 100 L112 88 Z"
          fill="currentColor"
          fillOpacity="0.3"
          strokeWidth="0.5"
        />
        <path
          d="M100 100 L142 58 M100 100 L142 142 M100 100 L58 142 M100 100 L58 58"
          strokeWidth="0.75"
          opacity="0.35"
        />
      </g>

      <circle cx="100" cy="100" r="4" fill="currentColor" fillOpacity="0.6" strokeWidth="0" />
    </svg>
  )
}
