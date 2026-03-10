interface KHCrestProps {
  size?: number;
  className?: string;
}

export default function KHCrest({ size = 200, className = "" }: KHCrestProps) {
  const r = size / 2;
  const innerR = r * 0.75;
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
        {/* Elegant Gold Gradient */}
        <linearGradient id={`goldGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6C068" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8942C" />
        </linearGradient>

        {/* Soft Background */}
        <radialGradient id={`sealBg-${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2E2A27" opacity="0.95" />
          <stop offset="100%" stopColor="#1A1816" opacity="1" />
        </radialGradient>

        {/* Subtle Shadow */}
        <filter id={`softShadow-${size}`}>
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
          <feOffset dx="0" dy="1" result="offsetblur" />
          <feFlood floodColor="#000000" floodOpacity="0.3" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <path
          id={`topArc-${size}`}
          d={`M ${r - textR},${r} A ${textR},${textR} 0 0,1 ${r + textR},${r}`}
        />
        <path
          id={`bottomArc-${size}`}
          d={`M ${r + textR},${r} A ${textR},${textR} 0 0,1 ${r - textR},${r}`}
        />
      </defs>

      {/* Background Circle */}
      <circle
        cx={r}
        cy={r}
        r={r - 3}
        fill={`url(#sealBg-${size})`}
        stroke={`url(#goldGrad-${size})`}
        strokeWidth="2.5"
      />

      {/* Inner decorative ring */}
      <circle
        cx={r}
        cy={r}
        r={innerR}
        fill="none"
        stroke={`url(#goldGrad-${size})`}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Delicate dots around the ring */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const dotR = r * 0.88;
        return (
          <circle
            key={angle}
            cx={r + dotR * Math.cos(rad)}
            cy={r + dotR * Math.sin(rad)}
            r={1.2}
            fill={`url(#goldGrad-${size})`}
            opacity="0.7"
          />
        );
      })}

      {/* Top text - Names */}
      <text
        fill={`url(#goldGrad-${size})`}
        fontSize={size * 0.065}
        fontFamily="'Playfair Display', serif"
        letterSpacing="3.5"
        fontWeight="400"
      >
        <textPath href={`#topArc-${size}`} startOffset="50%" textAnchor="middle">
          KAUSTAV &amp; HIMASREE
        </textPath>
      </text>

      {/* Bottom text - Date */}
      <text
        fill={`url(#goldGrad-${size})`}
        fontSize={size * 0.055}
        fontFamily="'Playfair Display', serif"
        letterSpacing="4"
        fontWeight="300"
        opacity="0.85"
      >
        <textPath href={`#bottomArc-${size}`} startOffset="50%" textAnchor="middle">
          EST. 2026
        </textPath>
      </text>

      {/* Elegant Interwoven Monogram */}
      <g filter={`url(#softShadow-${size})`}>
        {/* H */}
        <text
          x={r - size * 0.06}
          y={r + size * 0.11}
          textAnchor="middle"
          fill={`url(#goldGrad-${size})`}
          fontSize={size * 0.35}
          fontFamily="'Playfair Display', serif"
          fontWeight="500"
          fontStyle="italic"
        >
          H
        </text>

        {/* K */}
        <text
          x={r + size * 0.06}
          y={r + size * 0.11}
          textAnchor="middle"
          fill={`url(#goldGrad-${size})`}
          fontSize={size * 0.35}
          fontFamily="'Playfair Display', serif"
          fontWeight="500"
          fontStyle="italic"
        >
          K
        </text>
      </g>

      {/* Decorative heart or ampersand accent */}
      <g opacity="0.6">
        <path
          d={`M ${r} ${r - size * 0.15} 
              Q ${r - size * 0.04} ${r - size * 0.18}, ${r - size * 0.07} ${r - size * 0.13}
              Q ${r - size * 0.09} ${r - size * 0.10}, ${r} ${r - size * 0.06}
              Q ${r + size * 0.09} ${r - size * 0.10}, ${r + size * 0.07} ${r - size * 0.13}
              Q ${r + size * 0.04} ${r - size * 0.18}, ${r} ${r - size * 0.15} Z`}
          fill={`url(#goldGrad-${size})`}
          opacity="0.5"
        />
      </g>
    </svg>
  );
}
