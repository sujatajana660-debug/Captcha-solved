import React, { useState } from 'react';
import { ExternalLink, Info, ShieldCheck, X } from 'lucide-react';

interface PropellerBannerAdProps {
  zoneId?: string;
  size?: 'leaderboard' | 'rectangle' | 'slim' | 'responsive';
  className?: string;
}

interface BannerCreative {
  title: string;
  subtitle: string;
  sponsor: string;
  ctaText: string;
  tag: string;
  gradient: string;
}

const creatives: BannerCreative[] = [
  {
    title: 'Speed Booster & Cleaner Pro',
    subtitle: 'Boost device speed, clear system cache & optimize performance in 1-click.',
    sponsor: 'CleanMaster Labs',
    ctaText: 'Install Free',
    tag: 'RECOMMENDED',
    gradient: 'from-amber-500/10 via-amber-50 to-orange-50',
  },
  {
    title: 'Play Fantasy Arena Mobile',
    subtitle: 'Join 5,000,000 players worldwide. Claim 10 free hero summons today!',
    sponsor: 'Mythic Play Games',
    ctaText: 'Play Free',
    tag: 'FEATURED',
    gradient: 'from-emerald-500/10 via-emerald-50 to-teal-50',
  },
  {
    title: 'Ultra High-Speed Cloud VPN',
    subtitle: 'Military-grade encryption with ultra-fast servers across 90+ countries.',
    sponsor: 'Nordic Shield VPN',
    ctaText: 'Try 30 Days Free',
    tag: 'RECOMMENDED',
    gradient: 'from-blue-500/10 via-blue-50 to-indigo-50',
  },
];

export const PropellerBannerAd: React.FC<PropellerBannerAdProps> = ({
  zoneId = '8492015',
  size = 'responsive',
  className = '',
}) => {
  const [adIndex] = useState(() => Math.floor(Math.random() * creatives.length));
  const [showInfo, setShowInfo] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const current = creatives[adIndex];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-all hover:border-slate-300 ${className}`}
      data-propeller-zone={zoneId}
    >
      {/* Top attribution bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-3 py-1 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">PropellerAds</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-[10px] text-slate-400">Zone #{zoneId}</span>
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="text-slate-400 hover:text-slate-600 focus-visible:outline-hidden"
            title="Ad Choices & Info"
          >
            <Info className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-600 focus-visible:outline-hidden"
            title="Close this ad"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="border-b border-amber-100 bg-amber-50/90 px-3 py-1.5 text-xs text-amber-900">
          Ads delivered via PropellerAds Publisher Network. Advertisements help keep Captcha solved free for all users.
        </div>
      )}

      {/* Main Banner Body */}
      {size === 'slim' ? (
        <div className={`flex items-center justify-between gap-3 bg-gradient-to-r ${current.gradient} px-4 py-2`}>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 truncate">{current.title}</span>
              <span className="text-[10px] text-slate-500">by {current.sponsor}</span>
            </div>
            <p className="text-[11px] text-slate-600 truncate">{current.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => window.open('https://propellerads.com', '_blank', 'noopener,noreferrer')}
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            <span>{current.ctaText}</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r ${current.gradient} p-3 sm:p-4`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="text-slate-800 font-semibold">{current.sponsor}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">{current.tag}</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {current.title}
            </h4>
            <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
              {current.subtitle}
            </p>
          </div>
          <div className="shrink-0 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => window.open('https://propellerads.com', '_blank', 'noopener,noreferrer')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 active:scale-98 transition-all"
            >
              <span>{current.ctaText}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
