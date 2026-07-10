import { useState } from 'react'

// Renders the AIX (AI Xplod) logo. Prefers a real raster
// (public/aix-logo.png full, public/aix-mark.png mark); the mark falls back to
// an inline SVG neural glyph if the raster is missing.
export default function BrandLogo({ variant = 'mark', className, alt = 'AIX — AI Xplod Systems Sdn. Bhd.' }) {
  const base = import.meta.env.BASE_URL // '/' in dev, '/eeipa-platform/' on Pages
  const png = base + (variant === 'full' ? 'aix-logo.png' : 'aix-mark.png')
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <svg className={className} viewBox="0 0 64 64" role="img" aria-label={alt}>
        <circle cx="32" cy="32" r="30" fill="#0a1020" />
        <path d="M26 14a12 14 0 1 0 0 36" fill="none" stroke="#3b74d6" strokeWidth="3" />
        <g stroke="#ff7a18" strokeWidth="2" strokeLinecap="round">
          <path d="M30 32 42 20M30 32 46 30M30 32 44 42M30 32 38 46M30 32 34 18" />
        </g>
        <g fill="#ffb347">
          <circle cx="42" cy="20" r="2.5" /><circle cx="46" cy="30" r="2.5" />
          <circle cx="44" cy="42" r="2.5" /><circle cx="38" cy="46" r="2.5" /><circle cx="34" cy="18" r="2.5" />
        </g>
      </svg>
    )
  }
  return <img src={png} alt={alt} className={className} onError={() => setFailed(true)} />
}
