import React, { useState } from 'react';
import { BellRing, CheckCircle2, Shield, X } from 'lucide-react';
import { sound } from '../../utils/sound';

interface PropellerPushNotificationPromptProps {
  onDismiss?: () => void;
}

export const PropellerPushNotificationPrompt: React.FC<PropellerPushNotificationPromptProps> = ({
  onDismiss,
}) => {
  const [status, setStatus] = useState<'prompt' | 'granted' | 'dismissed'>('prompt');

  if (status === 'dismissed') return null;

  const handleAllow = () => {
    sound.playSuccess();
    setStatus('granted');
    setTimeout(() => {
      setStatus('dismissed');
      onDismiss?.();
    }, 2500);
  };

  const handleBlock = () => {
    sound.playClick();
    setStatus('dismissed');
    onDismiss?.();
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all">
      {status === 'prompt' ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <BellRing className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Enable Push Notifications & Payout Alerts
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-500">
                  <Shield className="h-3 w-3 text-emerald-500" />
                  PropellerAds WebPush
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Receive instant alerts for 2X Point Boost hours, new captchas, and withdrawal processing updates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={handleBlock}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Later
            </button>
            <button
              type="button"
              onClick={handleAllow}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Allow Notifications</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 text-emerald-700 py-1">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-xs font-semibold">
            Push notifications enabled! You will be alerted when new reward bonuses drop.
          </span>
        </div>
      )}
    </div>
  );
};
