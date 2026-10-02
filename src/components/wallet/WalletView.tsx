import React, { useState } from 'react';
import {
  Coins,
  Globe,
  CreditCard,
  Send,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Gift,
  ChevronLeft,
} from 'lucide-react';
import { PaymentMethodType, WithdrawalRequest } from '../../types';
import { PropellerBannerAd } from '../ads/PropellerBannerAd';
import { sound } from '../../utils/sound';

interface WalletViewProps {
  currentCoins: number;
  onRequestWithdrawal: (withdrawal: Omit<WithdrawalRequest, 'id' | 'createdAt' | 'status' | 'transactionRef'>) => void;
  onBackToHub?: () => void;
}

interface CountryOption {
  code: string;
  name: string;
  currency: string;
  ratePer1000: number; // in local currency
  currencySymbol: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 'IN', name: 'India', currency: 'INR', ratePer1000: 85, currencySymbol: '₹' },
  { code: 'US', name: 'United States', currency: 'USD', ratePer1000: 1.0, currencySymbol: '$' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT', ratePer1000: 120, currencySymbol: '৳' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', ratePer1000: 0.8, currencySymbol: '£' },
  { code: 'CA', name: 'Canada', currency: 'CAD', ratePer1000: 1.35, currencySymbol: 'CA$' },
  { code: 'PH', name: 'Philippines', currency: 'PHP', ratePer1000: 58, currencySymbol: '₱' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR', ratePer1000: 280, currencySymbol: 'Rs' },
  { code: 'GL', name: 'Global (All Other Countries)', currency: 'USD', ratePer1000: 1.0, currencySymbol: '$' },
];

export const WalletView: React.FC<WalletViewProps> = ({
  currentCoins,
  onRequestWithdrawal,
  onBackToHub,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('IN');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('upi');
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [accountDetails, setAccountDetails] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const currentCountry = COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];

  // Available payment methods based on country
  // "Payment method:- paypal all country ar jonno or India select korle google play redeem code or paypal or upi or Amazon code ok"
  const isIndia = currentCountry.code === 'IN';

  const availableMethods: { id: PaymentMethodType; name: string; desc: string; icon: React.ReactNode }[] = isIndia
    ? [
        {
          id: 'upi',
          name: 'UPI Transfer',
          desc: 'Instant direct to Google Pay, PhonePe, Paytm, BHIM',
          icon: <Smartphone className="h-5 w-5 text-emerald-600" />,
        },
        {
          id: 'google_play',
          name: 'Google Play Redeem Code',
          desc: 'Digital voucher code sent to your email/SMS',
          icon: <Gift className="h-5 w-5 text-blue-600" />,
        },
        {
          id: 'amazon_code',
          name: 'Amazon Gift Card (IN)',
          desc: 'Amazon Pay gift card claim code',
          icon: <Gift className="h-5 w-5 text-amber-600" />,
        },
        {
          id: 'paypal',
          name: 'PayPal International',
          desc: 'USD / INR payout to your verified PayPal email',
          icon: <CreditCard className="h-5 w-5 text-indigo-600" />,
        },
      ]
    : [
        {
          id: 'paypal',
          name: 'PayPal Express (Worldwide)',
          desc: 'Fast, secure payout to any country via PayPal',
          icon: <CreditCard className="h-5 w-5 text-indigo-600" />,
        },
        {
          id: 'google_play',
          name: 'Google Play Gift Card',
          desc: 'Digital store code for apps, games & subscriptions',
          icon: <Gift className="h-5 w-5 text-blue-600" />,
        },
        {
          id: 'amazon_code',
          name: 'Amazon Gift Card (Global)',
          desc: 'Amazon electronic gift card voucher code',
          icon: <Gift className="h-5 w-5 text-amber-600" />,
        },
      ];

  // Update selected method if previous method is not available in new country
  const handleCountryChange = (newCode: string) => {
    setSelectedCountryCode(newCode);
    if (newCode !== 'IN' && selectedMethod === 'upi') {
      setSelectedMethod('paypal');
    }
  };

  const finalAmountCoins = isCustom ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const localPayoutValue = (finalAmountCoins / 1000) * currentCountry.ratePer1000;
  const localPayoutFormatted = `${currentCountry.currencySymbol}${localPayoutValue.toFixed(2)} ${currentCountry.currency}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (finalAmountCoins < 500) {
      sound.playError();
      setErrorMessage('Minimum withdrawal amount is 500 Coins.');
      return;
    }

    if (finalAmountCoins > currentCoins) {
      sound.playError();
      setErrorMessage(`Insufficient coins. You currently have ${currentCoins.toLocaleString()} Coins.`);
      return;
    }

    if (!accountDetails.trim()) {
      sound.playError();
      setErrorMessage('Please enter your payout account details.');
      return;
    }

    // Call onRequestWithdrawal which triggers full-screen interstitial ad before committing
    const activeMethodObj = availableMethods.find((m) => m.id === selectedMethod);
    onRequestWithdrawal({
      coins: finalAmountCoins,
      amountFormatted: localPayoutFormatted,
      paymentMethod: selectedMethod,
      methodLabel: activeMethodObj ? activeMethodObj.name : selectedMethod,
      accountDetails: accountDetails.trim(),
      country: currentCountry.name,
    });

    setSubmittedSuccess(true);
    setAccountDetails('');
    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 4000);
  };

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

      {/* Top Banner Ad */}
      <PropellerBannerAd zoneId="8492026" size="slim" />

      {/* Main Wallet Form Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-6">
        {/* Header & Balance Breakdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">SECTION 2</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-xs font-semibold text-emerald-700">Instant PropellerAds Monetized</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Wallet & Withdrawal Center</h2>
            <p className="text-xs text-slate-500">
              Convert your earned puzzle coins into real money, UPI, PayPal, or redeem codes.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 shadow-xs min-w-[220px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Available For Withdrawal
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-2xl font-extrabold tabular-nums text-slate-900">
                {currentCoins.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-amber-800">Coins</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-600 font-medium">
              ≈ {currentCountry.currencySymbol}
              {((currentCoins / 1000) * currentCountry.ratePer1000).toFixed(2)} {currentCountry.currency}
            </div>
          </div>
        </div>

        {submittedSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-xs text-emerald-950 font-medium">
              <strong className="font-bold">Withdrawal Request Submitted!</strong> View transaction details in Profile tab.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Country Selection (Requested: "county select") */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Globe className="h-4 w-4 text-slate-500" />
              <span>Select Your Country / Region:</span>
            </label>
            <div className="relative">
              <select
                value={selectedCountryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} (1,000 Coins = {country.currencySymbol}
                    {country.ratePer1000} {country.currency})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                ▼
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Rate: 1,000 Coins = {currentCountry.currencySymbol}
              {currentCountry.ratePer1000} {currentCountry.currency}
            </p>
          </div>

          {/* 2. Payment Method (Requested: "India select korle google play redeem code or paypal or upi or Amazon code ok", "paypal all country") */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <CreditCard className="h-4 w-4 text-slate-500" />
              <span>Select Payment Method ({currentCountry.name}):</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableMethods.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedMethod(method.id);
                    }}
                    className={`flex items-start gap-3.5 rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">{method.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{method.name}</span>
                        {isSelected && (
                          <span className="rounded-full bg-amber-500 p-0.5 text-white">
                            <CheckCircle2 className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{method.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Coins Withdrawal Amount */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Coins className="h-4 w-4 text-amber-500" />
                <span>Withdrawal Amount:</span>
              </label>
              <span className="text-xs font-semibold text-emerald-700 font-mono tabular-nums">
                Payout: {localPayoutFormatted}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[500, 1000, 2500, 5000].map((amt) => {
                const isSelected = !isCustom && selectedAmount === amt;
                const value = (amt / 1000) * currentCountry.ratePer1000;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsCustom(false);
                      setSelectedAmount(amt);
                    }}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-mono text-base font-extrabold tabular-nums">
                      {amt.toLocaleString()}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                      Coins
                    </span>
                    <span className="mt-1 text-[11px] font-semibold">
                      {currentCountry.currencySymbol}
                      {value.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount toggle */}
            <div className="pt-1 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsCustom(!isCustom);
                  if (!isCustom && !customAmount) setCustomAmount('1000');
                }}
                className="text-amber-800 font-bold hover:underline"
              >
                {isCustom ? '← Pick preset coin amount' : '+ Enter custom coin amount'}
              </button>
              <span className="text-[11px] text-slate-500">Min: 500 Coins</span>
            </div>

            {isCustom && (
              <div className="pt-1">
                <input
                  type="number"
                  min="500"
                  max="100000"
                  step="50"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter custom coin amount (e.g. 1500)..."
                  className="w-full font-mono text-sm font-bold rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            )}
          </div>

          {/* 4. Account Details Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              {selectedMethod === 'upi'
                ? 'Your UPI ID (Google Pay / PhonePe / Paytm):'
                : selectedMethod === 'paypal'
                ? 'Your PayPal Email Address:'
                : selectedMethod === 'google_play'
                ? 'Email / Phone for Google Play Code Delivery:'
                : 'Email / Phone for Amazon Gift Card Claim Code:'}
            </label>
            <input
              type={selectedMethod === 'paypal' ? 'email' : 'text'}
              value={accountDetails}
              onChange={(e) => {
                setAccountDetails(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder={
                selectedMethod === 'upi'
                  ? 'e.g. mobile@paytm or yourname@okhdfcbank'
                  : selectedMethod === 'paypal'
                  ? 'e.g. your.paypal@example.com'
                  : 'e.g. name@example.com or +91 9876543210'
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
              required
            />
            <p className="text-[11px] text-slate-500">
              Double-check details carefully. Payouts are dispatched within 12–24 business hours.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 5. Submit Withdrawal Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={currentCoins < 500}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 px-6 text-sm font-bold text-white shadow-md hover:bg-slate-800 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <Send className="h-4 w-4 text-amber-400" />
              <span>Submit Withdrawal Request</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              (Viewing sponsor interstitial ad completes the security verification)
            </p>
          </div>
        </form>
      </div>

      {/* Bottom Banner Ad */}
      <PropellerBannerAd zoneId="8492027" size="responsive" />
    </div>
  );
};
