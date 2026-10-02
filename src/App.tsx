import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  UserStats,
  PointBoostState,
  WithdrawalRequest,
  PropellerConfig,
  MainTab,
} from './types';
import {
  getStoredStats,
  saveStoredStats,
  getStoredWithdrawals,
  saveStoredWithdrawals,
  getStoredPropellerConfig,
} from './utils/storage';
import { sound } from './utils/sound';

// Components
import { WelcomeView } from './components/welcome/WelcomeView';
import { HeaderBar } from './components/common/HeaderBar';
import { MainHubView } from './components/main/MainHubView';
import { SolveSection } from './components/solve/SolveSection';
import { WalletView } from './components/wallet/WalletView';
import { ProfileView } from './components/profile/ProfileView';

// Ads
import { PropellerBannerAd } from './components/ads/PropellerBannerAd';
import { PropellerInterstitialAd } from './components/ads/PropellerInterstitialAd';
import { PropellerClickInPagePush } from './components/ads/PropellerClickInPagePush';
import { PropellerPushNotificationPrompt } from './components/ads/PropellerPushNotificationPrompt';
import { PropellerPopunderSim } from './components/ads/PropellerPopunderSim';
import { PropellerConfigModal } from './components/ads/PropellerConfigModal';

export default function App() {
  // Screen state: default to 'main' so the Main UI Hub opens immediately!
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'main'>('main');
  const [currentTab, setCurrentTab] = useState<MainTab>('hub');
  const [selectedSolveTask, setSelectedSolveTask] = useState<'captcha' | 'number' | 'image'>('captcha');

  // Persistence State
  const [stats, setStats] = useState<UserStats>(() => getStoredStats());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => getStoredWithdrawals());
  const [propellerConfig, setPropellerConfig] = useState<PropellerConfig>(() => getStoredPropellerConfig());

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // 2-Minute Point Boost State
  const [boostState, setBoostState] = useState<PointBoostState>({
    isActive: false,
    expiresAt: null,
  });
  const [boostRemainingSeconds, setBoostRemainingSeconds] = useState<number>(0);

  // Interstitial Ad Modal State
  const [interstitialOpen, setInterstitialOpen] = useState(false);
  const [interstitialActionTitle, setInterstitialActionTitle] = useState('Completing Request...');
  const pendingActionRef = useRef<(() => void) | null>(null);

  // Popunder Simulation State (triggered when opening Wallet)
  const [popunderTriggered, setPopunderTriggered] = useState(false);

  // Config modal
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Ensure page title is always Captcha solved
  useEffect(() => {
    document.title = 'Captcha solved';
  }, []);

  // Save changes to storage
  useEffect(() => {
    saveStoredStats(stats);
  }, [stats]);

  useEffect(() => {
    saveStoredWithdrawals(withdrawals);
  }, [withdrawals]);

  // Point Boost Countdown Timer (2 minutes = 120s)
  useEffect(() => {
    if (!boostState.isActive || !boostState.expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((boostState.expiresAt! - now) / 1000));
      setBoostRemainingSeconds(diff);

      if (diff <= 0) {
        setBoostState({ isActive: false, expiresAt: null });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [boostState]);

  // Trigger Interstitial Ad with a pending callback
  const triggerInterstitialWithCallback = (actionTitle: string, callback: () => void) => {
    setInterstitialActionTitle(actionTitle);
    pendingActionRef.current = callback;
    setInterstitialOpen(true);
  };

  const handleInterstitialClose = () => {
    setInterstitialOpen(false);
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action();
    }
  };

  // 1. Welcome -> Start Button click
  // "users start batten click kore mane ui te jabe ... start batten click korle Interstitial ads asbe ok"
  const handleStartFromWelcome = () => {
    triggerInterstitialWithCallback('Entering Main Dashboard...', () => {
      setCurrentScreen('main');
      sound.playSuccess();
    });
  };

  // 2. Activate 2-Minute Point Boost
  // "point boost takbe jeta niar jonno akta full screen ads dhete hobe or point boost active thabe 2 minutes"
  const handleActivateBoost = () => {
    triggerInterstitialWithCallback('Activating 2-Minute Point Boost (+2 Coins)...', () => {
      const expires = Date.now() + 120 * 1000;
      setBoostState({
        isActive: true,
        expiresAt: expires,
      });
      setBoostRemainingSeconds(120);
      sound.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    });
  };

  // 3. Task Points Claim (Captcha, Number, Image)
  // "Puzzle ba captcha solved hole clime kor te clime batten click korte hobe or clime batten click korle full screen ads coleusbe ok"
  const handleClaimTaskPoints = (earnedPoints: number, taskType: string) => {
    triggerInterstitialWithCallback(`Claiming ${earnedPoints} Coins for ${taskType}...`, () => {
      sound.playCoin();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.5 },
      });

      setStats((prev) => {
        let captchas = prev.captchasSolved;
        let numbers = prev.numberPuzzlesSolved;
        let images = prev.imagePuzzlesSolved;

        if (taskType.includes('Captcha')) captchas += 1;
        else if (taskType.includes('Number')) numbers += 1;
        else if (taskType.includes('Image')) images += 1;

        return {
          ...prev,
          coins: prev.coins + earnedPoints,
          totalEarned: prev.totalEarned + earnedPoints,
          captchasSolved: captchas,
          numberPuzzlesSolved: numbers,
          imagePuzzlesSolved: images,
        };
      });
    });
  };

  // 4. Tab Navigation with Wallet Popunder trigger
  // "wallet :- banner ads or Popunder ads tekhabe jokhon users wallet batten click korbe ok"
  const handleTabChange = (newTab: MainTab) => {
    setCurrentTab(newTab);
    if (newTab === 'wallet') {
      // Trigger popunder simulation
      setPopunderTriggered(true);
    }
  };

  // 5. Withdrawal Submission
  // "or withdraw summit click korar por Interstitial ads dekhabe or withdraw summit hobe ok"
  const handleRequestWithdrawal = (withdrawalData: {
    coins: number;
    amountFormatted: string;
    paymentMethod: any;
    methodLabel: string;
    accountDetails: string;
    country: string;
  }) => {
    triggerInterstitialWithCallback('Verifying & Submitting Withdrawal...', () => {
      sound.playSuccess();

      const newTxn: WithdrawalRequest = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        coins: withdrawalData.coins,
        amountFormatted: withdrawalData.amountFormatted,
        paymentMethod: withdrawalData.paymentMethod,
        methodLabel: withdrawalData.methodLabel,
        accountDetails: withdrawalData.accountDetails,
        country: withdrawalData.country,
        status: 'Pending',
        createdAt: 'Just now',
        transactionRef: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      };

      setWithdrawals((prev) => [newTxn, ...prev]);
      setStats((prev) => ({
        ...prev,
        coins: Math.max(0, prev.coins - withdrawalData.coins),
        totalWithdrawn: prev.totalWithdrawn + withdrawalData.coins,
      }));
    });
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-900 flex flex-col font-sans">
      {/* 1. If on Welcome UI screen */}
      {currentScreen === 'welcome' ? (
        <WelcomeView onStartClick={handleStartFromWelcome} />
      ) : (
        /* 2. Main Professional White UI */
        <div className="flex-1 flex flex-col">
          {/* Top Header & Balance Bar */}
          <HeaderBar
            currentTab={currentTab}
            onTabChange={handleTabChange}
            coins={stats.coins}
            boostState={boostState}
            boostRemainingSeconds={boostRemainingSeconds}
            onOpenAdConfig={() => setIsConfigModalOpen(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />

          {/* Main Content Arena */}
          <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
            {/* Push Notifications prompt as requested: "Push Notifications ads thakbe ok" */}
            <PropellerPushNotificationPrompt />

            {/* Active Tab View */}
            {currentTab === 'hub' && (
              <MainHubView
                stats={stats}
                boostState={boostState}
                boostRemainingSeconds={boostRemainingSeconds}
                onActivateBoost={handleActivateBoost}
                onOpenTask={(task) => {
                  setSelectedSolveTask(task);
                  setCurrentTab('solve');
                }}
                onOpenWallet={() => {
                  setPopunderTriggered(true);
                  setCurrentTab('wallet');
                }}
                onOpenProfile={() => setCurrentTab('profile')}
              />
            )}

            {currentTab === 'solve' && (
              <SolveSection
                boostState={boostState}
                boostRemainingSeconds={boostRemainingSeconds}
                selectedTask={selectedSolveTask}
                onActivateBoost={handleActivateBoost}
                onClaimTaskPoints={handleClaimTaskPoints}
                onBackToHub={() => setCurrentTab('hub')}
              />
            )}

            {currentTab === 'wallet' && (
              <WalletView
                currentCoins={stats.coins}
                onRequestWithdrawal={handleRequestWithdrawal}
                onBackToHub={() => setCurrentTab('hub')}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView
                stats={stats}
                withdrawals={withdrawals}
                onOpenAdConfig={() => setIsConfigModalOpen(true)}
                onBackToHub={() => setCurrentTab('hub')}
              />
            )}

            {/* Bottom Banner Ad as requested: "1 ta banner ads sobar niche thakbe" */}
            <div className="pt-4">
              <PropellerBannerAd zoneId={propellerConfig.bannerZoneId} size="responsive" />
            </div>
          </main>

          {/* Quiet Footer */}
          <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>Captcha solved Platform © 2026</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('welcome')}
                  className="hover:text-slate-700 underline underline-offset-2"
                >
                  View Welcome Screen
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(true)}
                  className="hover:text-slate-700 underline underline-offset-2"
                >
                  PropellerAds Network Settings
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* On-Click In-Page Push Ad */}
      <PropellerClickInPagePush zoneId={propellerConfig.inPagePushZoneId} />

      {/* Global Full-Screen Interstitial Ad Modal */}
      <PropellerInterstitialAd
        isOpen={interstitialOpen}
        onClose={handleInterstitialClose}
        actionTitle={interstitialActionTitle}
        zoneId={propellerConfig.interstitialZoneId}
      />

      {/* Popunder simulation trigger */}
      <PropellerPopunderSim
        triggered={popunderTriggered}
        onDismiss={() => setPopunderTriggered(false)}
        zoneId={propellerConfig.popunderZoneId}
      />

      {/* PropellerAds Publisher Settings Modal */}
      <PropellerConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={propellerConfig}
        onSave={(newCfg) => setPropellerConfig(newCfg)}
      />
    </div>
  );
}
