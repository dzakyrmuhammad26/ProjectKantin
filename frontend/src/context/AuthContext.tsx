'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Pengguna } from '@/models/pengguna';
import authController from '@/controllers/authController';

export interface AuthContextType {
  currentUser: Pengguna | null;
  loginWithPin: (pin: string) => Promise<Pengguna | null>;
  logout: () => Promise<void>;
  setCurrentUser: (user: Pengguna | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<Pengguna | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const user = await authController.getCurrentUser();
        setCurrentUserState(user);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const loginWithPin = useCallback(async (pin: string): Promise<Pengguna | null> => {
    const user = await authController.loginDenganPin(pin);
    setCurrentUserState(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await authController.logout();
    setCurrentUserState(null);
  }, []);

  const setCurrentUser = useCallback((user: Pengguna | null) => {
    setCurrentUserState(user);
  }, []);

  const contextValue = useMemo(
    () => ({
      currentUser,
      loginWithPin,
      logout,
      setCurrentUser,
      isLoading,
    }),
    [currentUser, loginWithPin, logout, setCurrentUser, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
