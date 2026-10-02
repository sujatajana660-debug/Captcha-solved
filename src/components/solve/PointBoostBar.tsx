import React from 'react';
import { Zap, Play, Timer, Sparkles, CheckCircle2 } from 'lucide-react';
import { PointBoostState } from '../../types';
import { sound } from '../../utils/sound';

interface PointBoostBarProps {
  boostState: PointBoostState;
  remainingSeconds: number;
  onActivateBoost: () => void;
}

export const PointBoostBar: React.FC<PointBoostBarProps> = ({
  boostState,
  remainingSeconds,
  onActivateBoost,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const isBoostActive = boostState.isActive && remainingSeconds > 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all ${
        isBoostActive
          ? 'border-amber-300 bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 shadow-md ring-2 ring-amber-400/30'
          : 'border-slate-200 bg-gradient-to-r from-slate-50 via-white to-amber-50/40 shadow-xs'
      } p-4 sm:p-5`}
    >
      {/* Decorative background glow */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Info */}
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

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Special Multiplier
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                · +2 Bonus Coins
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {isBoostActive ? '2X Point Boost Active (2 Minutes)' : 'Activate 2-Minute Point Boost'}
            </h3>

            <p className="text-xs text-slate-600 max-w-md">
              {isBoostActive ? (
                <span className="text-amber-900 font-medium">
                  Enjoying boost rates: Captcha (8 pts), Number (10 pts), Image (12 pts)!
                </span>
              ) : (
                'Watch a full-screen sponsor ad to boost your task rewards for 2 full minutes.'
              )}
            </p>
          </div>
        </div>

        {/* Right CTA / Timer */}
        <div className="shrink-0 flex items-center gap-3 self-end sm:self-center">
          {isBoostActive ? (
            <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-white/90 px-4 py-2.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-amber-700">
                <Timer className="h-5 w-5 animate-spin text-amber-600" style={{ animationDuration: '6s' }} />
                <span className="text-xs font-bold uppercase">Time Left:</span>
              </div>
              <span className="font-mono text-lg font-extrabold tabular-nums text-slate-900">
                {formatTime(remainingSeconds)}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onActivateBoost();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-sm hover:bg-amber-400 active:scale-98 transition-all"
            >
              <Play className="h-4 w-4 fill-slate-950" />
              <span>Watch Ad to Boost</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
