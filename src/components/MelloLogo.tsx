import React, { useState } from 'react';

interface MelloLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  useImageOnly?: boolean;
}

export const MelloLogo: React.FC<MelloLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
  useImageOnly = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const dimensionMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-28 h-28',
    xl: 'w-44 h-44',
  };

  const textScaleMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
    xl: 'text-3xl',
  };

  // If user uploaded or static logo.png exists and works
  if (useImageOnly && !imgError) {
    return (
      <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
        <img
          src="/logo.png"
          alt="Mello TV News Logo"
          className={`${dimensionMap[size]} object-contain filter drop-shadow-lg transition-transform duration-300 hover:scale-105`}
          onError={() => setImgError(true)}
        />
        {showSubtitle && (
          <span className={`font-display font-bold tracking-tight text-white ${textScaleMap[size]} mt-2`}>
            MELLO TV <span className="text-red-500">NEWS</span>
          </span>
        )}
      </div>
    );
  }

  // 3D Vector SVG Logo reproducing the exact Mello TV News graphic layout
  return (
    <div className={`relative inline-flex flex-col items-center justify-center shrink-0 ${className}`}>
      <div className={`relative ${dimensionMap[size]} transition-transform duration-300 hover:scale-105 group`}>
        {/* Outer 3D Glow Effect */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 via-red-600 to-amber-500 opacity-75 blur-sm group-hover:opacity-100 transition duration-300"></div>

        <svg
          viewBox="0 0 400 400"
          className="relative w-full h-full drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic Silver Outer Ring Gradient */}
            <linearGradient id="chromeRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="25%" stopColor="#94A3B8" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* Deep Globe Radial Gradient */}
            <radialGradient id="globeBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="70%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            {/* "MELLO TV" Blue Badge Gradient */}
            <linearGradient id="melloBlue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="30%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>

            {/* "NEWS" 3D Red Badge Gradient */}
            <linearGradient id="newsRed" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="45%" stopColor="#DC2626" />
              <stop offset="80%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>

            {/* Silver Metallic Text Gradient for "NEWS" */}
            <linearGradient id="silverText" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F1F5F9" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            {/* Yellow Gold LIVE Badge Gradient */}
            <linearGradient id="liveGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            {/* Lens Flare Glow */}
            <radialGradient id="flareGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </radialGradient>

            <filter id="dropShadow3D" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Outer Chrome Metallic Rim */}
          <circle cx="200" cy="200" r="180" fill="url(#chromeRing)" filter="url(#dropShadow3D)" />
          <circle cx="200" cy="200" r="152" fill="#0B1329" />

          {/* Globe Navy Background */}
          <circle cx="200" cy="200" r="148" fill="url(#globeBg)" />

          {/* World Map / Latitude-Longitude Grid Lines */}
          <path
            d="M 60,200 Q 200,120 340,200 M 60,200 Q 200,280 340,200 M 200,52 L 200,348 M 80,130 Q 200,70 320,130 M 80,270 Q 200,330 320,270"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeOpacity="0.35"
            fill="none"
          />
          {/* Continent Silhouettes */}
          <path
            d="M 120,130 Q 150,110 180,140 Q 190,170 160,190 Q 130,170 120,130 Z M 220,120 Q 270,100 300,140 Q 280,180 230,160 Z M 210,220 Q 260,210 280,260 Q 240,300 200,260 Z"
            fill="#1D4ED8"
            fillOpacity="0.25"
          />

          {/* Upper Blue Pill Badge: MELLO TV */}
          <rect
            x="110"
            y="125"
            width="180"
            height="46"
            rx="12"
            fill="url(#melloBlue)"
            stroke="#60A5FA"
            strokeWidth="2.5"
            filter="url(#dropShadow3D)"
          />
          <text
            x="200"
            y="157"
            fontFamily="'Syne', 'Arial Black', sans-serif"
            fontWeight="800"
            fontSize="26"
            fill="#FFFFFF"
            textAnchor="middle"
            letterSpacing="2"
          >
            MELLO TV
          </text>

          {/* Main Center 3D Red Pill Badge: NEWS */}
          <rect
            x="50"
            y="170"
            width="300"
            height="86"
            rx="43"
            fill="url(#newsRed)"
            stroke="#F87171"
            strokeWidth="3.5"
            filter="url(#dropShadow3D)"
          />
          {/* Highlights on top of Red Badge */}
          <path
            d="M 90,178 Q 200,172 310,178 Q 320,195 300,195 Q 200,186 100,195 Q 80,195 90,178 Z"
            fill="#FFFFFF"
            fillOpacity="0.25"
          />

          {/* 3D Bold "NEWS" Metallic Text */}
          <text
            x="200"
            y="235"
            fontFamily="'Syne', 'Impact', sans-serif"
            fontWeight="900"
            fontSize="68"
            fill="url(#silverText)"
            textAnchor="middle"
            letterSpacing="4"
            stroke="#334155"
            strokeWidth="2"
          >
            NEWS
          </text>

          {/* Bottom Right Yellow/Gold Diagonal Badge: LIVE */}
          <g filter="url(#dropShadow3D)">
            <polygon points="180,245 315,245 295,285 160,285" fill="url(#liveGold)" />
            <polygon points="180,245 315,245 312,248 183,248" fill="#FEF08A" />
            <text
              x="238"
              y="275"
              fontFamily="'Plus Jakarta Sans', 'Arial', sans-serif"
              fontWeight="900"
              fontStyle="italic"
              fontSize="24"
              fill="#0F172A"
              textAnchor="middle"
              letterSpacing="3"
            >
              LIVE
            </text>
          </g>

          {/* Sparkle Lens Flare */}
          <circle cx="180" cy="270" r="28" fill="url(#flareGlow)" />
          <path d="M 180,250 L 180,290 M 160,270 L 200,270" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {showSubtitle && (
        <div className="mt-3 text-center">
          <h2 className="font-display font-extrabold text-white tracking-wider text-xl">
            MELLO TV <span className="text-red-500">NEWS</span>
          </h2>
          <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mt-0.5">
            PORTAL MEDIA TERPERCAYA
          </p>
        </div>
      )}
    </div>
  );
};
