export interface UserStats {
  coins: number;
  totalEarned: number;
  totalWithdrawn: number;
  captchasSolved: number;
  numberPuzzlesSolved: number;
  imagePuzzlesSolved: number;
  username: string;
  userId: string;
  joinedDate: string;
}

export interface PointBoostState {
  isActive: boolean;
  expiresAt: number | null; // Unix timestamp in ms
}

export type PaymentMethodType = 'upi' | 'paypal' | 'google_play' | 'amazon_code';

export interface WithdrawalRequest {
  id: string;
  coins: number;
  amountFormatted: string;
  paymentMethod: PaymentMethodType;
  methodLabel: string;
  accountDetails: string;
  country: string;
  status: 'Completed' | 'Processing' | 'Pending';
  createdAt: string;
  transactionRef: string;
}

export interface PropellerConfig {
  simulationMode: boolean;
  bannerZoneId: string;
  interstitialZoneId: string;
  inPagePushZoneId: string;
  popunderZoneId: string;
  publisherId: string;
}

export type MainTab = 'hub' | 'solve' | 'wallet' | 'profile';
export type SolveTab = 'captcha' | 'number' | 'image';
