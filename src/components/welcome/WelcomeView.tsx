import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Zap, Coins, CheckCircle2, Gift } from 'lucide-react';
import { PropellerBannerAd } from '../ads/PropellerBannerAd';
import { PropellerInPagePushAd } from '../ads/PropellerInPagePushAd';
import { sound } from '../../utils/sound';
import welcomeHeroBanner from '../../assets/images/welcome_banner_finance_1790938751475.jpg';

interface WelcomeViewProps {
  onStartClick: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStartClick }) => {
  const handleStart = () => {
    sound.playClick();
    onStartClick();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* 1. Top Banner Ad as requested: "2 to banner ads upre ar sobar niche" */}
        <PropellerBannerAd zoneId="8492010" size="slim" />

        {/* 2. Main Professional White Welcome Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm text-center">
          {/* Subtle ambient background glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

          {/* Brand header */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-700 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>PropellerAds Verified Publisher Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-2xl mx-auto leading-tight">
            Solve Captchas & Puzzles, Earn Real Rewards
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Complete high-difficulty security captchas, 10-digit number puzzles, and photo tile jumbles. Redeem your coins directly via UPI, PayPal, Google Play codes, or Amazon gift cards.
          </p>

          {/* Hero Banner Visual Asset */}
          <div className="my-6 max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
            <img
              src={welcomeHeroBanner}
              alt="Captcha Solved Platform"
              className="w-full h-44 sm:h-52 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Task Rate Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8 text-left">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">TASK 1</span>
                <span className="font-mono text-xs font-bold text-amber-600">6 - 8 Coins</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Herd Text Captcha</h4>
              <p className="text-[11px] text-slate-500">
                Wavy distorted letters and numbers security test.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">TASK 2</span>
                <span className="font-mono text-xs font-bold text-blue-600">8 - 10 Coins</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">10-Digit Sequence</h4>
              <p className="text-[11px] text-slate-500">
                Speed anti-copy 10-digit code input challenge.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">TASK 3</span>
                <span className="font-mono text-xs font-bold text-rose-600">10 - 12 Coins</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">3x3 Photo Jumble</h4>
              <p className="text-[11px] text-slate-500">
                High-difficulty picture tile arrangement puzzle.
              </p>
            </div>
          </div>

          {/* Prominent Start Button (Requested: "users start batten click kore mane ui te jabe") */}
          <div className="max-w-sm mx-auto space-y-2">
            <button
              type="button"
              onClick={handleStart}
              className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-amber-500 py-4 px-8 text-base font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 hover:bg-amber-400 active:scale-98 transition-all animate-pulse"
            >
              <span>START SOLVING & EARN</span>
              <ArrowRight className="h-5 w-5 stroke-[2.5]" />
            </button>
            <p className="text-[11px] text-slate-400">
              Instant entry · Watch quick sponsor interstitial to enter Main UI
            </p>
          </div>
        </div>

        {/* 3. In-Page Push Ad at the bottom as requested: "In-Page Push ads ta niche lagane ok" */}
        <PropellerInPagePushAd position="bottom" zoneId="8492011" />

        {/* 4. Bottom Banner Ad as requested: "sobar niche" */}
        <PropellerBannerAd zoneId="8492012" size="responsive" />
      </div>

      {/* Quiet Footer */}
      <footer className="mt-8 text-center text-xs text-slate-400">
        Captcha solved © 2026 · Powered by PropellerAds Monetization Network
      </footer>
    </div>
  );
};
