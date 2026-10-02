import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Zap, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';

interface PropellerInterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
  zoneId?: string;
  actionTitle?: string;
}

interface InterstitialCreative {
  title: string;
  tagline: string;
  sponsor: string;
  features: string[];
  ctaText: string;
  bgColor: string;
  badge: string;
}

const interstitialAds: InterstitialCreative[] = [
  {
    title: 'Kingdom Quest: Heroes Arena',
    tagline: 'Build your empire, conquer mythical dungeons & earn weekly tournament prize chests.',
    sponsor: 'Aether Studios',
    features: ['Instant hero rewards', 'No download required', 'Play on any device'],
    ctaText: 'Play Instantly Now',
    bgColor: 'from-slate-900 via-indigo-950 to-slate-950',
    badge: 'TOP TRENDING GAME',
  },
  {
    title: 'Ultra High-Speed Cloud VPN',
    tagline: 'Protect your identity, stop tracking & unlock high-speed worldwide streaming.',
    sponsor: 'CyberShield Labs',
    features: ['Kill-switch protection', '10 Gbps servers', '30-day money back guarantee'],
    ctaText: 'Get 85% Discount',
    bgColor: 'from-slate-950 via-blue-950 to-slate-900',
    badge: 'VERIFIED SECURITY',
  },
  {
    title: 'TaskFlow Productivity Suite',
    tagline: 'Organize your schedule, track goals & boost daily productivity effortlessly.',
    sponsor: 'TaskFlow Global',
    features: ['Cloud backup sync', 'Cross-platform apps', 'Free starter plan'],
    ctaText: 'Try Free Today',
    bgColor: 'from-slate-950 via-slate-900 to-emerald-950',
    badge: 'FEATURED APP',
  },
];

export const PropellerInterstitialAd: React.FC<PropellerInterstitialAdProps> = ({
  isOpen,
  onClose,
  zoneId = '8492016',
  actionTitle = 'Completing Reward...',
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [creativeIndex, setCreativeIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(5);
      setCanSkip(false);
      setCreativeIndex(Math.floor(Math.random() * interstitialAds.length));

      const interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const current = interstitialAds[creativeIndex];
  const progressPercent = ((5 - secondsRemaining) / 5) * 100;

  const handleClose = () => {
    if (canSkip) {
      sound.playClick();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 text-white shadow-2xl">
        {/* Progress indicator bar */}
        <div className="h-1.5 w-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Top Header Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-sm bg-slate-800 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-amber-400">
              <Sparkles className="h-3 w-3" />
              PropellerAds Interstitial
            </span>
            <span className="text-[10px] text-slate-400">Zone #{zoneId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                sound.setMuted(nextMuted);
              }}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {canSkip ? (
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950 shadow-sm hover:bg-amber-400 active:scale-95 transition-all"
              >
                <span>Continue</span>
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300">
                <span className="inline-block h-2 w-2 animate-ping rounded-full bg-amber-400" />
                <span>Skip in {secondsRemaining}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Sponsored Creative Body */}
        <div className={`bg-gradient-to-b ${current.bgColor} p-6 sm:p-8 space-y-5 text-center`}>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300">
            <Zap className="h-3 w-3 fill-amber-300" />
            {current.badge}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              {current.tagline}
            </p>
          </div>

          {/* Value propositions */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs text-slate-200">
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex items-center justify-center gap-1.5 py-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                window.open('https://propellerads.com', '_blank', 'noopener,noreferrer');
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-98 transition-all"
            >
              <span>{current.ctaText}</span>
              <ExternalLink className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <span>Sponsor: {current.sponsor}</span>
              <span aria-hidden="true">·</span>
              <span>PropellerAds Network</span>
            </div>
          </div>
        </div>

        {/* Footer info & status */}
        <div className="border-t border-slate-800 bg-slate-900/90 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate font-medium text-slate-300">{actionTitle}</span>
          <span className="text-[11px]">
            {canSkip ? 'Reward Ready' : 'Please wait 5 seconds'}
          </span>
        </div>
      </div>
    </div>
  );
};
