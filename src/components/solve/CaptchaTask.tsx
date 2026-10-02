import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, CheckCircle, ShieldAlert, ArrowRight, Sparkles, Check } from 'lucide-react';
import { PropellerBannerAd } from '../ads/PropellerBannerAd';
import { sound } from '../../utils/sound';

interface CaptchaTaskProps {
  isBoostActive: boolean;
  onClaim: (coins: number) => void;
}

export const CaptchaTask: React.FC<CaptchaTaskProps> = ({
  isBoostActive,
  onClaim,
}) => {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const pointsToEarn = isBoostActive ? 8 : 6;

  // Generate a random hard captcha code
  const generateCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Draw distorted hard captcha on canvas
  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#f8fafc');
    bgGradient.addColorStop(0.5, '#f1f5f9');
    bgGradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Random noise lines
    for (let i = 0; i < 7; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, 0.45)`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.bezierCurveTo(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
      ctx.stroke();
    }

    // Noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, 0.35)`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw characters with distinct rotations and fonts
    const charSpacing = canvas.width / (code.length + 1);
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      ctx.save();
      const x = charSpacing * (i + 0.8) + (Math.random() * 4 - 2);
      const y = canvas.height / 2 + (Math.random() * 8 - 4) + 6;
      ctx.translate(x, y);
      const angle = (Math.random() * 40 - 20) * (Math.PI / 180);
      ctx.rotate(angle);

      // Random color
      const hue = Math.floor(Math.random() * 360);
      ctx.fillStyle = `hsl(${hue}, 60%, 25%)`;
      ctx.font = `bold ${Math.floor(Math.random() * 6 + 26)}px 'JetBrains Mono', monospace`;
      ctx.fillText(char, -10, 0);
      ctx.restore();
    }
  };

  const handleRefresh = () => {
    sound.playClick();
    const newCode = generateCode();
    setCaptchaCode(newCode);
    setUserInput('');
    setIsSolved(false);
    setHasError(false);
    setErrorMessage('');
    drawCaptcha(newCode);
  };

  useEffect(() => {
    const code = generateCode();
    setCaptchaCode(code);
    setIsSolved(false);
    setUserInput('');
    setHasError(false);
    setTimeout(() => drawCaptcha(code), 50);
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === captchaCode) {
      sound.playSuccess();
      setIsSolved(true);
      setHasError(false);
      setErrorMessage('');
    } else {
      sound.playError();
      setHasError(true);
      setErrorMessage('Captcha does not match! Please check case sensitivity.');
    }
  };

  const handleClaimPoints = () => {
    sound.playClick();
    onClaim(pointsToEarn);
    // Reset for next puzzle
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Ad as requested */}
      <PropellerBannerAd zoneId="8492020" size="slim" />

      {/* Main Captcha Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">TASK 1</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-xs font-semibold text-amber-700">Hard Distortion Level</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Security Text Captcha</h2>
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

        {/* Captcha Box */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative rounded-xl border border-slate-300/80 overflow-hidden shadow-xs bg-slate-100">
              <canvas
                ref={canvasRef}
                width={260}
                height={75}
                className="block select-none"
              />
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:rotate-180 transition-all shadow-xs"
              title="Generate New Captcha"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          <p className="text-center text-xs text-slate-500">
            Type the 6 distorted case-sensitive characters shown in the box above.
          </p>

          {!isSolved ? (
            <form onSubmit={handleVerify} className="space-y-3 pt-2">
              <div>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => {
                    setUserInput(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="Enter captcha text..."
                  maxLength={6}
                  className="w-full text-center font-mono text-lg font-bold tracking-widest uppercase rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
                  autoFocus
                />
              </div>

              {hasError && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 animate-shake">
                  <ShieldAlert className="h-4 w-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!userInput.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 px-4 text-sm font-bold text-white shadow-xs hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none active:scale-98 transition-all"
              >
                <span>Verify Captcha</span>
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
                  Captcha Successfully Solved!
                </h4>
                <p className="text-xs text-emerald-700">
                  Click the claim button below to view the sponsor ad & credit {pointsToEarn} coins to your balance.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClaimPoints}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 px-6 text-sm font-black text-slate-950 shadow-md shadow-amber-500/25 hover:bg-amber-400 active:scale-98 transition-all animate-bounce"
              >
                <Sparkles className="h-4 w-4 fill-slate-950" />
                <span>Claim {pointsToEarn} Coins Now</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Ad in Solve Section */}
      <PropellerBannerAd zoneId="8492021" size="responsive" />
    </div>
  );
};
