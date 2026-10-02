import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight, X, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { sound } from '../../utils/sound';

interface PropellerClickInPagePushProps {
  zoneId?: string;
}

interface InPageCreative {
  title: string;
  desc: string;
  sponsor: string;
  ctaText: string;
  iconBg: string;
}

const creatives: InPageCreative[] = [
  {
    title: 'Fantasy Hero Legend Mobile',
    desc: 'Join 5,000,000 players worldwide. Claim 10 free summons today!',
    sponsor: 'Mythic Play Games',
    ctaText: 'Play Free',
    iconBg: 'from-amber-400 to-amber-600',
  },
  {
    title: 'Ultra High-Speed Cloud VPN',
    desc: 'Secure 1-click connection with ultra-fast servers across 90+ countries.',
    sponsor: 'Nordic Shield VPN',
    ctaText: 'Get 85% Off',
    iconBg: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Speed Cleaner & Booster Pro',
    desc: 'Clean background cache and speed up phone performance instantly.',
    sponsor: 'CleanMaster Labs',
    ctaText: 'Free Install',
    iconBg: 'from-emerald-400 to-teal-600',
  },
  {
    title: 'Daily Solver Mystery Chest',
    desc: 'Special sponsor bonus unlocked for active solvers! Claim before expiry.',
    sponsor: 'Propeller Network',
    ctaText: 'Claim Bonus',
    iconBg: 'from-purple-500 to-pink-600',
  },
];

export const PropellerClickInPagePush: React.FC<PropellerClickInPagePushProps> = ({
  zoneId = '11941468',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [creativeIdx, setCreativeIdx] = useState(0);

  // Trigger floating In-Page Push on clicks (with smart debounce so it doesn't spam every single millisecond)
  useEffect(() => {
    let lastTrigger = 0;

    const handleGlobalClick = (e: MouseEvent) => {
      // Don't re-trigger if clicking inside the ad itself
      const target = e.target as HTMLElement;
      if (target.closest('[data-propeller-inpage-push="true"]')) return;

      const now = Date.now();
      // Show every 3500ms on click if not already open or update creative
      if (now - lastTrigger > 3500) {
        lastTrigger = now;
        setCreativeIdx((prev) => (prev + 1) % creatives.length);
        setIsVisible(true);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  if (!isVisible) return null;

  const current = creatives[creativeIdx];

  const handleCta = () => {
    sound.playClick();
    window.open('https://propellerads.com', '_blank', 'noopener,noreferrer');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setIsVisible(false);
  };

  return (
    <div
      data-propeller-inpage-push="true"
      className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-96 rounded-2xl border border-amber-300 bg-white/95 backdrop-blur-md p-3.5 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 ring-1 ring-amber-400/20"
    >
      <div className="flex items-start gap-3">
        {/* Animated Bell Icon */}
        <div
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${current.iconBg} text-white shadow-md`}
        >
          <Bell className="h-5 w-5 animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        </div>

        {/* Ad Copy */}
        <div className="min-w-0 flex-1 cursor-pointer" onClick={handleCta}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="text-amber-700 font-extrabold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              PropellerAds In-Page Push
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Zone #{zoneId}</span>
          </div>

          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug mt-0.5 truncate">
            {current.title}
          </h4>

          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
            {current.desc}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCta}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition-all"
            >
              <span>{current.ctaText}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] text-slate-400">by {current.sponsor}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title="Close In-Page Push"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
