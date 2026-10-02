import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Calendar,
  Coins,
  History,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Award,
  Hash,
  Image as ImageIcon,
  Sliders,
  ChevronLeft,
} from 'lucide-react';
import { UserStats, WithdrawalRequest } from '../../types';
import { PropellerBannerAd } from '../ads/PropellerBannerAd';
import { sound } from '../../utils/sound';

interface ProfileViewProps {
  stats: UserStats;
  withdrawals: WithdrawalRequest[];
  onOpenAdConfig: () => void;
  onBackToHub?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  stats,
  withdrawals,
  onOpenAdConfig,
  onBackToHub,
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredWithdrawals = withdrawals.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return item.status === 'Completed';
    if (filter === 'pending') return item.status === 'Pending' || item.status === 'Processing';
    return true;
  });

  return (
    <div className="space-y-6">
      {onBackToHub && (
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onBackToHub();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>← Back to Main Hub</span>
        </button>
      )}

      {/* Top Banner Ad as requested */}
      <PropellerBannerAd zoneId="8492028" size="slim" />

      {/* 1. User Profile Details Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-amber-400 font-extrabold text-xl shadow-md">
              <User className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{stats.username}</h2>
                <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Solver
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                <span>ID: <strong className="font-mono text-slate-700">{stats.userId}</strong></span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {stats.joinedDate}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenAdConfig();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors self-start sm:self-auto"
          >
            <Sliders className="h-4 w-4" />
            <span>PropellerAds Zones</span>
          </button>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <span className="text-[11px] font-semibold text-slate-500">Current Balance</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-xl font-bold tabular-nums text-slate-900">
                {stats.coins.toLocaleString()}
              </span>
              <span className="text-xs text-amber-700 font-bold">Coins</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <span className="text-[11px] font-semibold text-slate-500">Lifetime Earned</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-xl font-bold tabular-nums text-emerald-600">
                {stats.totalEarned.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">Coins</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <span className="text-[11px] font-semibold text-slate-500">Total Withdrawn</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-xl font-bold tabular-nums text-slate-700">
                {stats.totalWithdrawn.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">Coins</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <span className="text-[11px] font-semibold text-slate-500">Total Tasks Solved</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-xl font-bold tabular-nums text-indigo-600">
                {stats.captchasSolved + stats.numberPuzzlesSolved + stats.imagePuzzlesSolved}
              </span>
              <span className="text-xs text-slate-500">Tasks</span>
            </div>
          </div>
        </div>

        {/* Task Breakdown details */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-800">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="text-xs">
              <span className="text-slate-500">Captchas Solved:</span>
              <p className="font-mono font-bold text-slate-900">{stats.captchasSolved} completed</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-800">
              <Hash className="h-4 w-4" />
            </div>
            <div className="text-xs">
              <span className="text-slate-500">10-Digit Numbers:</span>
              <p className="font-mono font-bold text-slate-900">{stats.numberPuzzlesSolved} completed</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-rose-100 bg-rose-50/50 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-800">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div className="text-xs">
              <span className="text-slate-500">Image Jumbles:</span>
              <p className="font-mono font-bold text-slate-900">{stats.imagePuzzlesSolved} completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Withdrawal History Section (Requested: "withdraw history ok") */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Withdrawal History</h3>
              <p className="text-xs text-slate-500">Past payout requests and confirmation timestamps</p>
            </div>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setFilter('all');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({withdrawals.length})
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setFilter('completed');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filter === 'completed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setFilter('pending');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filter === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Withdrawal List */}
        {filteredWithdrawals.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <History className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No withdrawal records found</p>
            <p className="text-xs text-slate-400">
              Solve captchas and puzzles in the Solve tab to request your first cashout!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredWithdrawals.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.methodLabel}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500">{item.country}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-bold ${
                        item.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {item.status === 'Completed' ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 truncate max-w-md font-mono">
                    Account: {item.accountDetails}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{item.createdAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">Ref: {item.transactionRef}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-slate-900">
                    {item.amountFormatted}
                  </div>
                  <div className="text-xs font-medium text-amber-800">
                    -{item.coins.toLocaleString()} Coins
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Banner Ad as requested: "Profile only banner ads lagano thakbe ok" */}
      <PropellerBannerAd zoneId="8492029" size="responsive" />
    </div>
  );
};
