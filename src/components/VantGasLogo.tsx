import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightMode?: boolean;
}

export const VantGasLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  lightMode = false,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* VantGas Brand Icon */}
      <svg
        viewBox="0 0 100 100"
        className={`${sizeMap[size]} shrink-0 drop-shadow-xs`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo VantGas"
      >
        <defs>
          <linearGradient id="vg-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0b3b60" />
          </linearGradient>
          <linearGradient id="vg-grad-accent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Shield / Geometric Container */}
        <rect x="6" y="6" width="88" height="88" rx="16" fill="url(#vg-grad-primary)" />
        
        {/* Dynamic Fuel Drop / 'V' Monogram */}
        <path
          d="M50 20 C50 20 68 44 68 58 C68 68 60 76 50 76 C40 76 32 68 32 58 C32 44 50 20 50 20 Z"
          fill="url(#vg-grad-accent)"
        />
        
        {/* Modern 'V' cut inside droplet */}
        <path
          d="M40 48 L50 64 L60 48"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Energy indicator */}
        <circle cx="50" cy="38" r="3.5" fill="#facc15" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`text-base sm:text-lg font-black tracking-tight ${lightMode ? 'text-white' : 'text-slate-900'}`}>
              Vant<span className="text-emerald-500">Gas</span>
            </span>
          </div>
          <span className={`text-[11px] font-medium ${lightMode ? 'text-blue-100/80' : 'text-slate-500'}`}>
            Gestão Integrada de Frotas & Abastecimentos
          </span>
        </div>
      )}
    </div>
  );
};
