import React, { useState, useEffect } from 'react';
import { ShieldCheck, Hash, Image as ImageIcon, Zap, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { SolveTab, PointBoostState } from '../../types';
import { PointBoostBar } from './PointBoostBar';
import { CaptchaTask } from './CaptchaTask';
import { NumberPuzzleTask } from './NumberPuzzleTask';
import { ImagePuzzleTask } from './ImagePuzzleTask';
import { sound } from '../../utils/sound';

interface SolveSectionProps {
  boostState: PointBoostState;
  boostRemainingSeconds: number;
  selectedTask?: SolveTab;
  onActivateBoost: () => void;
  onClaimTaskPoints: (coins: number, taskType: string) => void;
  onBackToHub?: () => void;
}

export const SolveSection: React.FC<SolveSectionProps> = ({
  boostState,
  boostRemainingSeconds,
  selectedTask = 'captcha',
  onActivateBoost,
  onClaimTaskPoints,
  onBackToHub,
}) => {
  const [activeTab, setActiveTab] = useState<SolveTab>(selectedTask);

  useEffect(() => {
    if (selectedTask) {
      setActiveTab(selectedTask);
    }
  }, [selectedTask]);

  return (
    <div className="space-y-6">
      {onBackToHub && (
        <div className="flex items-center justify-between">
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
          <span className="text-xs text-slate-400">Current Task: {activeTab.toUpperCase()}</span>
        </div>
      )}

      {/* 1. Point Boost Bar at the very top of solve section */}
      <PointBoostBar
        boostState={boostState}
        remainingSeconds={boostRemainingSeconds}
        onActivateBoost={onActivateBoost}
      />

      {/* 2. Sub-tabs / 3 Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-fit">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('captcha');
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'captcha'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-amber-500" />
            <span>1. Text Captcha</span>
            <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[10px] font-mono text-amber-900">
              {boostState.isActive ? '8 pts' : '6 pts'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('number');
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'number'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hash className="h-4 w-4 text-blue-500" />
            <span>2. Number 10-Digit</span>
            <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-mono text-blue-900">
              {boostState.isActive ? '10 pts' : '8 pts'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('image');
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="h-4 w-4 text-rose-500" />
            <span>3. Image Puzzle</span>
            <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[10px] font-mono text-rose-900">
              {boostState.isActive ? '12 pts' : '10 pts'}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>Ad Sponsored Rewards</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-slate-700">Unlimited Solves</span>
        </div>
      </div>

      {/* 3. Sub-Task Body */}
      {activeTab === 'captcha' && (
        <CaptchaTask
          isBoostActive={boostState.isActive}
          onClaim={(pts) => onClaimTaskPoints(pts, 'Captcha Solved')}
        />
      )}

      {activeTab === 'number' && (
        <NumberPuzzleTask
          isBoostActive={boostState.isActive}
          onClaim={(pts) => onClaimTaskPoints(pts, '10-Digit Number Solved')}
        />
      )}

      {activeTab === 'image' && (
        <ImagePuzzleTask
          isBoostActive={boostState.isActive}
          onClaim={(pts) => onClaimTaskPoints(pts, 'Image Jumble Solved')}
        />
      )}
    </div>
  );
};
