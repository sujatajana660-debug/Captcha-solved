import React, { useState } from 'react';
import { X, Check, Globe, HelpCircle, Save, Sparkles, Layers } from 'lucide-react';
import { PropellerConfig } from '../../types';
import { saveStoredPropellerConfig } from '../../utils/storage';
import { sound } from '../../utils/sound';

interface PropellerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PropellerConfig;
  onSave: (config: PropellerConfig) => void;
}

export const PropellerConfigModal: React.FC<PropellerConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [formData, setFormData] = useState<PropellerConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    saveStoredPropellerConfig(formData);
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">PropellerAds Ad Network Settings</h3>
              <p className="text-xs text-slate-500">Manage Zone IDs & Monetization Formats</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {savedSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>PropellerAds zone configurations saved successfully!</span>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="sim-mode" className="text-xs font-bold text-slate-900 cursor-pointer">
                Simulation & Demo Mode
              </label>
              <input
                id="sim-mode"
                type="checkbox"
                checked={formData.simulationMode}
                onChange={(e) => setFormData({ ...formData, simulationMode: e.target.checked })}
                className="h-4 w-4 rounded-sm border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When checked, high-fidelity PropellerAds ad units are simulated with instant response, countdown timers, and full-screen interstitials. Uncheck when placing into production with live external scripts.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PropellerAds Publisher ID
              </label>
              <input
                type="text"
                value={formData.publisherId}
                onChange={(e) => setFormData({ ...formData, publisherId: e.target.value })}
                placeholder="e.g. 7193245"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banner Ad Zone ID
                </label>
                <input
                  type="text"
                  value={formData.bannerZoneId}
                  onChange={(e) => setFormData({ ...formData, bannerZoneId: e.target.value })}
                  placeholder="8492015"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interstitial Ad Zone ID
                </label>
                <input
                  type="text"
                  value={formData.interstitialZoneId}
                  onChange={(e) => setFormData({ ...formData, interstitialZoneId: e.target.value })}
                  placeholder="8492016"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  In-Page Push Zone ID
                </label>
                <input
                  type="text"
                  value={formData.inPagePushZoneId}
                  onChange={(e) => setFormData({ ...formData, inPagePushZoneId: e.target.value })}
                  placeholder="8492017"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Popunder Zone ID
                </label>
                <input
                  type="text"
                  value={formData.popunderZoneId}
                  onChange={(e) => setFormData({ ...formData, popunderZoneId: e.target.value })}
                  placeholder="8492018"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200/70 p-3 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>Configured PropellerAds Formats:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
              <li>Welcome UI: 2 Banners + In-Page Push + Interstitial on Start</li>
              <li>Main UI: Bottom Banner + Top In-Page Push + Push Notification prompt</li>
              <li>Solve Tasks: Banner Ad + Interstitial on Claim button</li>
              <li>Wallet: Banner Ad + Popunder trigger on tab open + Interstitial on Submit</li>
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-sm hover:bg-amber-400 active:scale-95 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Zone Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
