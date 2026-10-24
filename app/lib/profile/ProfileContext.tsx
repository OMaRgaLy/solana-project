"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export interface UserProfile {
  companyOrName: string;
  iinBin: string;
  legalAddress: string;
  iban: string;
  bic: string;
}

export const defaultProfile: UserProfile = {
  companyOrName: "ИП Смагулов А.Б.",
  iinBin: "940512301824",
  legalAddress: "г. Астана, ул. Достык, 18",
  iban: "KZ869261801234567890",
  bic: "KZKOKZ22",
};

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  saveProfile: (p: UserProfile) => void;
  isCustomProfile: boolean;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  updateProfile: () => {},
  saveProfile: () => {},
  isCustomProfile: false,
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isCustomProfile, setIsCustomProfile] = useState(false);

  const getStorageKey = useCallback(() => {
    return publicKey ? `steppe_profile_${publicKey.toBase58()}` : "steppe_user_profile";
  }, [publicKey]);

  useEffect(() => {
    try {
      const key = getStorageKey();
      const saved = localStorage.getItem(key);
      if (saved) {
        setProfile((prev) => ({ ...prev, ...JSON.parse(saved) }));
        setIsCustomProfile(true);
      } else {
        // Fallback to default
        setProfile(defaultProfile);
        setIsCustomProfile(false);
      }
    } catch {
      // fallback
    }
  }, [publicKey, getStorageKey]);

  const saveProfile = (next: UserProfile) => {
    setProfile(next);
    setIsCustomProfile(true);
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(next));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      const key = getStorageKey();
      localStorage.setItem(key, JSON.stringify(next));
      setIsCustomProfile(true);
      return next;
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveProfile, isCustomProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
