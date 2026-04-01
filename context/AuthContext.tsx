'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api, setToken, removeToken, getToken } from '@/lib/api';

interface PrisonerInfo {
  prisonerKeyId: number;
  prisonerId: number;
  prisonerNumber: string;
  lastName: string;
  firstName: string;
  stateRegNumber: string;
}

interface AuthContextType {
  prisoner: PrisonerInfo | null;
  isLoading: boolean;
  login: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [prisoner, setPrisoner] = useState<PrisonerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      api('/prisoner-code-auth/profile')
        .then((data) => {
          if (data && (data.PRISONER_KEY_ID || data.prisonerKeyId)) {
            setPrisoner({
              prisonerKeyId: data.PRISONER_KEY_ID || data.prisonerKeyId,
              prisonerId: data.PRISONER_ID || data.prisonerId,
              prisonerNumber: data.PRISONER_NUMBER || data.prisonerNumber,
              lastName: data.LAST_NAME || data.lastName,
              firstName: data.FIRST_NAME || data.firstName,
              stateRegNumber: data.STATE_REG_NUMBER || data.stateRegNumber,
            });
          }
        })
        .catch(() => {
          removeToken();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (code: string) => {
    const res = await api('/prisoner-code-auth/login', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });

    setToken(res.access_token);
    setPrisoner(res.info);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setPrisoner(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ prisoner, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
