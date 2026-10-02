import React, { useState } from 'react';
import { Bell, ChevronRight, X } from 'lucide-react';
import { sound } from '../../utils/sound';

interface PropellerInPagePushAdProps {
  position?: 'top' | 'bottom';
  className?: string;
  zoneId?: string;
}

export const PropellerInPagePushAd: React.FC<PropellerInPagePushAdProps> = ({
  position = 'bottom',
  className = '',
  zoneId = '8492017',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClick = () => {
    sound.playClick();
    window.open('https://propellerads.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-amber-200/90 bg-gradient-to-r from-amber-50 via-white to-amber-50/70 p-3 shadow-sm hover:shadow-md transition-all ${className}`}
      data-propeller-zone={zoneId}
    >
      <div className="flex items-center gap-3">
        {/* Bell badge icon */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-xs">
          <Bell className="h-5 w-5 animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 cursor-pointer" onClick={handleClick}>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-900">
            <span>PropellerAds In-Page Push</span>
            <span aria-hidden="true" className="text-amber-300">·</span>
            <span className="text-[10px] text-amber-700/80">Zone #{zoneId}</span>
          </div>
          <p className="text-xs font-bold text-slate-900 truncate">
            Sponsored Offer: Claim Daily Solver Booster Pack!
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            Tap to claim promotional booster pass for active solvers.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition-all"
          >
            <span>Claim</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              setIsVisible(false);
            }}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="Dismiss in-page push"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
