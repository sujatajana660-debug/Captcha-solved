import React from 'react';
import { Coins, Zap, Settings, Volume2, VolumeX, ShieldCheck, Sparkles, LayoutDashboard } from 'lucide-react';
import { MainTab, PointBoostState } from '../../types';
import { sound } from '../../utils/sound';

interface HeaderBarProps {
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  coins: number;
  boostState: PointBoostState;
  boostRemainingSeconds: number;
  onOpenAdConfig: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentTab,
  onTabChange,
  coins,
  boostState,
  boostRemainingSeconds,
  onOpenAdConfig,
  isMuted,
  onToggleMute,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      {/* Upper Status & Balance Bar */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-2">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => {
              sound.playClick();
              onTabChange('hub');
            }}
          >
            <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold shadow-xs">
                C
              </span>
              Captcha solved
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium ml-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Verified Rewards Hub
            </span>
          </div>

          {/* Right Status Actions & Balance */}
          <div className="flex items-center gap-3">
            {/* Boost Active Indicator */}
            {boostState.isActive && boostRemainingSeconds > 0 && (
              <div className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-gradient-to-r from-amber-100 to-orange-100 px-2.5 py-1 text-xs font-bold text-amber-900 shadow-xs animate-pulse">
                <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-600" />
                <span className="hidden xs:inline">2X Boost:</span>
                <span className="font-mono tabular-nums">{formatTime(boostRemainingSeconds)}</span>
              </div>
            )}

            {/* Coins Balance Chip */}
            <div className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-amber-100/70 px-3.5 py-1.5 shadow-xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-inner">
                <Coins className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800/80 leading-none">
                  Balance
                </span>
                <span className="font-mono text-sm sm:text-base font-extrabold tabular-nums text-slate-900 leading-tight">
                  {coins.toLocaleString()} <span className="text-xs font-medium text-amber-800">Coins</span>
                </span>
              </div>
            </div>

            {/* Sound toggle & Config */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onToggleMute}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 transition-colors"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={onOpenAdConfig}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 transition-colors"
                title="PropellerAds Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Segmented Control */}
      <div className="px-4 py-2 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <nav className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onTabChange('hub');
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                currentTab === 'hub'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Main Hub</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onTabChange('solve');
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                currentTab === 'solve'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>1. Solve Captcha</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onTabChange('wallet');
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                currentTab === 'wallet'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Coins className="h-4 w-4 text-amber-400" />
              <span>2. Wallet & Withdraw</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onTabChange('profile');
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                currentTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>3. Profile & History</span>
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span>PropellerAds Monitored</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-emerald-600">Instant Credit</span>
          </div>
        </div>
      </div>
    </header>
  );
};
