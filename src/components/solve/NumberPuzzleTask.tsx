import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Check, ShieldAlert, ArrowRight, Sparkles, Hash } from 'lucide-react';
import { PropellerBannerAd } from '../ads/PropellerBannerAd';
import { sound } from '../../utils/sound';

interface NumberPuzzleTaskProps {
  isBoostActive: boolean;
  onClaim: (coins: number) => void;
}

export const NumberPuzzleTask: React.FC<NumberPuzzleTaskProps> = ({
  isBoostActive,
  onClaim,
}) => {
  const [targetNumber, setTargetNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const pointsToEarn = isBoostActive ? 10 : 8;

  // Generate 10-digit number
  const generate10DigitNumber = () => {
    let result = '';
    // Ensure first digit is not 0
    result += Math.floor(Math.random() * 9 + 1);
    for (let i = 1; i < 10; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  };

  // Render on security anti-copy canvas
  const drawNumberCanvas = (numStr: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle security pattern background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Watermark pattern
    ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
    ctx.font = "bold 14px 'JetBrains Mono', monospace";
    ctx.fillText('SECURITY CODE VERIFY', 40, 20);

    // Render digits in 2 grouped segments of 5 digits with high contrast
    const formatted = `${numStr.slice(0, 5)} · ${numStr.slice(5, 10)}`;
    ctx.font = "bold 24px 'JetBrains Mono', monospace";
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatted, canvas.width / 2, canvas.height / 2 + 2);
  };

  const handleRefresh = () => {
    sound.playClick();
    const newNum = generate10DigitNumber();
    setTargetNumber(newNum);
    setUserInput('');
    setIsSolved(false);
    setHasError(false);
    setErrorMessage('');
    drawNumberCanvas(newNum);
  };

  useEffect(() => {
    const num = generate10DigitNumber();
    setTargetNumber(num);
    setIsSolved(false);
    setUserInput('');
    setTimeout(() => drawNumberCanvas(num), 50);
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = userInput.replace(/[^0-9]/g, '');
    if (cleaned === targetNumber) {
      sound.playSuccess();
      setIsSolved(true);
      setHasError(false);
      setErrorMessage('');
    } else {
      sound.playError();
      setHasError(true);
      setErrorMessage(`Number mismatch! You typed ${cleaned.length}/10 digits.`);
    }
  };

  const handleClaim = () => {
    sound.playClick();
    onClaim(pointsToEarn);
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      <PropellerBannerAd zoneId="8492022" size="slim" />

      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">TASK 2</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-xs font-semibold text-blue-700">10-Digit Verification Challenge</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Number Sequence Puzzle</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Reward:</span>
            <div className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-900">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>{pointsToEarn} Coins</span>
              {isBoostActive && <span className="text-[10px] text-amber-700">(+2 Boosted)</span>}
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          {/* 10-Digit Canvas Display */}
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-xl border border-slate-800 overflow-hidden shadow-sm bg-slate-900">
              <canvas
                ref={canvasRef}
                width={280}
                height={75}
                className="block select-none"
              />
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:rotate-180 transition-all shadow-xs"
              title="Generate New 10-Digit Number"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          <p className="text-center text-xs text-slate-500">
            Carefully inspect the secure 10-digit sequence above and type it accurately below.
          </p>

          {!isSolved ? (
            <form onSubmit={handleVerify} className="space-y-3 pt-2">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Hash className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={userInput}
                  onChange={(e) => {
                    // Only allow digits
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setUserInput(val);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="Enter exactly 10 digits..."
                  maxLength={10}
                  className="w-full pl-9 pr-4 py-3 text-center font-mono text-xl font-bold tracking-widest rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
                  autoFocus
                />
              </div>

              {/* Digit counter pill */}
              <div className="flex justify-between items-center text-[11px] text-slate-500 px-1">
                <span>Digits entered:</span>
                <span className={`font-mono font-bold ${userInput.length === 10 ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {userInput.length} / 10
                </span>
              </div>

              {hasError && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 animate-shake">
                  <ShieldAlert className="h-4 w-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={userInput.length !== 10}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 px-4 text-sm font-bold text-white shadow-xs hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none active:scale-98 transition-all"
              >
                <span>Verify 10-Digit Code</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-4 pt-2 animate-in zoom-in-95 duration-200">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-center space-y-1">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs mb-1">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-950">
                  10-Digit Sequence Verified!
                </h4>
                <p className="text-xs text-emerald-700">
                  Click the claim button below to view the sponsor ad & add {pointsToEarn} coins to your balance.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClaim}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 px-6 text-sm font-black text-slate-950 shadow-md shadow-amber-500/25 hover:bg-amber-400 active:scale-98 transition-all animate-bounce"
              >
                <Sparkles className="h-4 w-4 fill-slate-950" />
                <span>Claim {pointsToEarn} Coins Now</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <PropellerBannerAd zoneId="8492023" size="responsive" />
    </div>
  );
};
