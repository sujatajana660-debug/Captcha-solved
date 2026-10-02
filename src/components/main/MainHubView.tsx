import React from 'react';
import {
  Coins,
  ShieldCheck,
  Hash,
  Image as ImageIcon,
  Zap,
  CreditCard,
  User,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Gift,
  Smartphone,
  CheckCircle2,
  Clock,
  Play,
} from 'lucide-react';
import { UserStats, PointBoostState } from '../../types';
import { PropellerBannerAd } from '../ads/PropellerBannerAd';
import { sound } from '../../utils/sound';

interface MainHubViewProps {
  stats: UserStats;
  boostState: PointBoostState;
  boostRemainingSeconds: number;
  onActivateBoost: () => void;
  onOpenTask: (task: 'captcha' | 'number' | 'image') => void;
  onOpenWallet: () => void;
  onOpenProfile: () => void;
}

export const MainHubView: React.FC<MainHubViewProps> = ({
  stats,
  boostState,
  boostRemainingSeconds,
  onActivateBoost,
  onOpenTask,
  onOpenWallet,
  onOpenProfile,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const isBoostActive = boostState.isActive && boostRemainingSeconds > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Point Boost Bar at top of tasks */}
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all ${
          isBoostActive
            ? 'border-amber-300 bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 shadow-md ring-2 ring-amber-400/30'
            : 'border-slate-200 bg-gradient-to-r from-slate-50 via-white to-amber-50/40 shadow-xs'
        } p-4 sm:p-5`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isBoostActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 animate-pulse'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Zap className="h-6 w-6 fill-current" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  2X Point Boost
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  · Active for 2 Minutes
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {isBoostActive
                  ? `Boost Active: +2 Extra Coins on Every Puzzle!`
                  : `Earn More with 2-Minute Point Boost`}
              </h3>
              <p className="text-xs text-slate-600">
                {isBoostActive
                  ? 'Active rates: Captcha (8 pts), Number (10 pts), Image (12 pts)'
                  : 'Watch a full-screen sponsor ad to boost your earnings for 2 minutes.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3 self-end sm:self-center">
            {isBoostActive ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-amber-300 bg-white/90 px-4 py-2 shadow-xs">
                <span className="text-xs font-bold text-amber-800 uppercase">Time Left:</span>
                <span className="font-mono text-base font-extrabold tabular-nums text-slate-900">
                  {formatTime(boostRemainingSeconds)}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onActivateBoost();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-xs hover:bg-amber-400 active:scale-98 transition-all"
              >
                <Play className="h-4 w-4 fill-slate-950" />
                <span>Watch Ad to Boost</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Solve Captcha Section Hub (3 Options) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white text-xs font-black">
                1
              </span>
              Solve Captcha & Puzzles
            </h2>
            <p className="text-xs text-slate-500">
              Pick any of the 3 tasks below to solve and claim instant coin rewards.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600">3 Tasks Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Option 1: Text Captcha */}
          <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                  <Sparkles className="h-3 w-3" />
                  <span>{isBoostActive ? '8 Coins' : '6 Coins'}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  1. Herd Text Captcha
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Solve 6-digit wavy distorted alphanumeric security captcha on canvas.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-100 p-2 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Solved so far:</span>
                <span className="font-mono font-bold text-slate-900">{stats.captchasSolved} times</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenTask('captcha');
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-98 transition-all"
              >
                <span>Solve Text Captcha</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Option 2: Number Puzzle */}
          <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-800">
                  <Hash className="h-5 w-5" />
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-900">
                  <Sparkles className="h-3 w-3" />
                  <span>{isBoostActive ? '10 Coins' : '8 Coins'}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  2. 10-Digit Number
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Inspect security 10-digit sequence and type with speed and precision.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-100 p-2 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Solved so far:</span>
                <span className="font-mono font-bold text-slate-900">{stats.numberPuzzlesSolved} times</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenTask('number');
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-98 transition-all"
              >
                <span>Solve 10-Digit Puzzle</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Option 3: Image Puzzle */}
          <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-rose-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-800">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-900">
                  <Sparkles className="h-3 w-3" />
                  <span>{isBoostActive ? '12 Coins' : '10 Coins'}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                  3. 3x3 Image Puzzle
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Very hard challenge: Arrange scrambled photographic tiles into order.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-100 p-2 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Solved so far:</span>
                <span className="font-mono font-bold text-slate-900">{stats.imagePuzzlesSolved} times</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenTask('image');
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-98 transition-all"
              >
                <span>Play Image Puzzle</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Wallet & Cashout Hub */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white text-xs font-black">
                2
              </span>
              <h2 className="text-lg font-bold text-slate-900">Wallet & Withdrawal Hub</h2>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                Instant Processing
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Withdraw your coins to UPI (Google Pay, PhonePe, Paytm), Google Play Redeem Code, Amazon Gift Card, or PayPal.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                UPI Transfer
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                <Gift className="h-3.5 w-3.5 text-blue-600" />
                Google Play Code
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                <Gift className="h-3.5 w-3.5 text-amber-600" />
                Amazon Gift Card
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                <CreditCard className="h-3.5 w-3.5 text-indigo-600" />
                PayPal (Global)
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:items-end gap-2">
            <div className="text-xs text-slate-500">
              Balance: <strong className="text-slate-900 font-mono text-sm">{stats.coins.toLocaleString()} Coins</strong>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenWallet();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 px-6 text-xs sm:text-sm font-bold text-slate-950 shadow-xs hover:bg-amber-400 active:scale-98 transition-all"
            >
              <CreditCard className="h-4 w-4" />
              <span>Open Wallet & Cashout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Profile & History Hub */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white text-xs font-black">
                3
              </span>
              <h2 className="text-lg font-bold text-slate-900">Profile & Withdrawal History</h2>
              <span className="text-xs text-slate-500 font-mono">ID: {stats.userId}</span>
            </div>
            <p className="text-xs text-slate-500">
              Check your member ranking, lifetime earned stats, and trace all previous payout transactions.
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs text-slate-600">
              <span>Lifetime: <strong className="font-mono text-emerald-600">{stats.totalEarned.toLocaleString()} Coins</strong></span>
              <span aria-hidden="true">·</span>
              <span>Withdrawn: <strong className="font-mono text-slate-700">{stats.totalWithdrawn.toLocaleString()} Coins</strong></span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenProfile();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <User className="h-4 w-4" />
              <span>View Profile & History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
