interface KHCrestProps {
  size?: number;
  className?: string;
}

export default function KHCrest({ size = 200, className = "" }: KHCrestProps) {
  const r = size / 2;
  const innerR = r * 0.78;
  const textR = r * 0.88;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`kh-crest ${className}`}
      data-testid="kh-crest"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A843" />
          <stop offset="30%" stopColor="#F0D68A" />
          <stop offset="50%" stopColor="#B9975B" />
          <stop offset="70%" stopColor="#F0D68A" />
          <stop offset="100%" stopColor="#D4A843" />
        </linearGradient>
        <linearGradient id="goldGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B7340" />
          <stop offset="50%" stopColor="#B9975B" />
          <stop offset="100%" stopColor="#8B7340" />
        </linearGradient>
        <radialGradient id="sealBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3D3228" />
          <stop offset="100%" stopColor="#2E2A27" />
        </radialGradient>
        <filter id="innerShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feOffset dx="0" dy="1" result="offsetBlur" />
          <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
        </filter>
        <path
          id="topArc"
          d={`M ${r - textR},${r} A ${textR},${textR} 0 0,1 ${r + textR},${r}`}
        />
        <path
          id="bottomArc"
          d={`M ${r + textR},${r} A ${textR},${textR} 0 0,1 ${r - textR},${r}`}
        />
      </defs>

      <circle cx={r} cy={r} r={r - 2} fill="url(#sealBg)" stroke="url(#goldGrad)" strokeWidth="3" />
      <circle cx={r} cy={r} r={innerR} fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.6" />
      <circle cx={r} cy={r} r={r * 0.92} fill="none" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.4" />

      <text fill="url(#goldGrad)" fontSize={size * 0.065} fontFamily="'Cinzel', 'Playfair Display', serif" letterSpacing="3">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          KAUSTAV &amp; HIMASREE
        </textPath>
      </text>
      <text fill="url(#goldGrad)" fontSize={size * 0.055} fontFamily="'Cinzel', 'Playfair Display', serif" letterSpacing="4">
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          EST. 2026
        </textPath>
      </text>

      <text
        x={r}
        y={r + size * 0.06}
        textAnchor="middle"
        fill="url(#goldGrad)"
        fontSize={size * 0.28}
        fontFamily="'Playfair Display', serif"
        fontWeight="700"
        filter="url(#innerShadow)"
        className="kh-monogram"
      >
        KH
      </text>

      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const dotR = r * 0.85;
        return (
          <circle
            key={angle}
            cx={r + dotR * Math.cos(rad)}
            cy={r + dotR * Math.sin(rad)}
            r={1.5}
            fill="url(#goldGrad)"
            opacity="0.5"
          />
        );
      })}
    </svg>
  );
}
