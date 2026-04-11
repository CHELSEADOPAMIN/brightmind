export type AppLanguage = 'en' | 'zh' | 'ne' | 'es';

export type MembershipTier = 'free' | 'premium';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  credits: number;
  membership: MembershipTier;
  referralCode: string;
  language: AppLanguage;
  createdAt: string;
};

export type ReferralRecord = {
  id: string;
  name: string;
  creditsGiven: number;
  createdAt: string;
};

export type BookingRecord = {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  slot: string;
  note: string;
  createdAt: string;
};
