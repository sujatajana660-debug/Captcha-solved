import { UserStats, WithdrawalRequest, PropellerConfig } from '../types';

const STATS_KEY = 'coinsolve_user_stats';
const WITHDRAWALS_KEY = 'coinsolve_withdrawals';
const PROPELLER_KEY = 'coinsolve_propeller_config';

const defaultStats: UserStats = {
  coins: 120, // Initial welcome starter coins
  totalEarned: 120,
  totalWithdrawn: 0,
  captchasSolved: 4,
  numberPuzzlesSolved: 3,
  imagePuzzlesSolved: 1,
  username: 'Alex_Hunter',
  userId: 'CS-92841',
  joinedDate: 'October 2026',
};

const defaultWithdrawals: WithdrawalRequest[] = [
  {
    id: 'TXN-984102',
    coins: 500,
    amountFormatted: '$0.50 USD',
    paymentMethod: 'paypal',
    methodLabel: 'PayPal Express',
    accountDetails: 'user.reward@example.com',
    country: 'United States',
    status: 'Completed',
    createdAt: 'Yesterday, 04:15 PM',
    transactionRef: 'PP-88294172B',
  },
];

const defaultPropellerConfig: PropellerConfig = {
  simulationMode: true,
  bannerZoneId: '8492015',
  interstitialZoneId: '8492016',
  inPagePushZoneId: '11941382',
  popunderZoneId: '8492018',
  publisherId: 'PROP-71932',
};

export const getStoredStats = (): UserStats => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats;
    return JSON.parse(raw);
  } catch {
    return defaultStats;
  }
};

export const saveStoredStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage quota or private mode
  }
};

export const getStoredWithdrawals = (): WithdrawalRequest[] => {
  try {
    const raw = localStorage.getItem(WITHDRAWALS_KEY);
    if (!raw) return defaultWithdrawals;
    return JSON.parse(raw);
  } catch {
    return defaultWithdrawals;
  }
};

export const saveStoredWithdrawals = (withdrawals: WithdrawalRequest[]): void => {
  try {
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(withdrawals));
  } catch {
    // ignore
  }
};

export const getStoredPropellerConfig = (): PropellerConfig => {
  try {
    const raw = localStorage.getItem(PROPELLER_KEY);
    if (!raw) return defaultPropellerConfig;
    return JSON.parse(raw);
  } catch {
    return defaultPropellerConfig;
  }
};

export const saveStoredPropellerConfig = (config: PropellerConfig): void => {
  try {
    localStorage.setItem(PROPELLER_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
};
