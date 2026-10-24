"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserProfile {
  companyOrName: string;
  iinBin: string;
  email: string;
  phone: string;
  telegram: string;
  payoutWallet: string;
  defaultCollabName: string;
  defaultCollabWallet: string;
  defaultCollabPct: number;
}

const defaultProfile: UserProfile = {
  companyOrName: "ИП Смагулов А.Б.",
  iinBin: "940512301824",
  email: "freelance@steppeinvoice.app",
  phone: "+7 777 123 4567",
  telegram: "@nomad_dev",
  payoutWallet: "",
  defaultCollabName: "UI/UX Дизайнер",
  defaultCollabWallet: "",
  defaultCollabPct: 15,
};

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  saveProfile: (p: UserProfile) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  updateProfile: () => {},
  saveProfile: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("steppe_user_profile");
      if (saved) {
        setProfile((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      // fallback
    }
  }, []);

  const saveProfile = (next: UserProfile) => {
    setProfile(next);
    localStorage.setItem("steppe_user_profile", JSON.stringify(next));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("steppe_user_profile", JSON.stringify(next));
      return next;
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
