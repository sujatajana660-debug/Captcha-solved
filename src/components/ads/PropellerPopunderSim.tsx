import React, { useState, useEffect } from 'react';
import { ExternalLink, Layers, Sparkles, X } from 'lucide-react';

interface PropellerPopunderSimProps {
  triggered: boolean;
  onDismiss: () => void;
  zoneId?: string;
}

export const PropellerPopunderSim: React.FC<PropellerPopunderSimProps> = ({
  triggered,
  onDismiss,
  zoneId = '8492018',
}) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (triggered) {
      setActive(true);
      const timer = setTimeout(() => {
        setActive(false);
        onDismiss();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [triggered, onDismiss]);

  if (!active) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm rounded-xl border border-indigo-200 bg-slate-900 text-white p-3.5 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
          <Layers className="h-5 w-5" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-300">
            <Sparkles className="h-3 w-3" />
            <span>PropellerAds Popunder Active</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-[10px] text-slate-400">Zone #{zoneId}</span>
          </div>
          <p className="text-xs font-bold text-white truncate">
            Sponsor Portal Opened in Background
          </p>
          <p className="text-[11px] text-slate-300">
            Enjoy premium rates! Popunder sponsored session verified for your wallet access.
          </p>
          <div className="pt-1.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.open('https://propellerads.com', '_blank', 'noopener,noreferrer')}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
            >
              <span>View Sponsor Offer</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setActive(false);
            onDismiss();
          }}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
