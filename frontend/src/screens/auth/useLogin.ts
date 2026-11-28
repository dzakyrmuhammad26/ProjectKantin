'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useLogin() {
  const router = useRouter();
  const { loginWithPin } = useAuth();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuickPin, setActiveQuickPin] = useState<string | null>(null);

  const handleNumpadClick = (digit: string) => {
    if (isLoading) return;
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (isLoading) return;
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isLoading) return;
    setPin('');
  };

  const handleSubmit = async (pinToSubmit?: string, isQuick = false) => {
    if (isLoading) return;
    const targetPin = typeof pinToSubmit === 'string' ? pinToSubmit : pin;
    if (!targetPin || targetPin.length < 4) {
      setErrorMsg('Masukkan minimal 4 digit PIN');
      return;
    }

    try {
      setIsLoading(true);
      setActiveQuickPin(isQuick ? targetPin : null);
      setErrorMsg(null);
      const user = await loginWithPin(targetPin);
      if (user) {
        if (user.peran === 'superadmin') {
          router.push('/admin/dashboard');
        } else if (user.peran === 'kasir') {
          router.push('/cashier');
        } else if (user.peran === 'gerai') {
          router.push('/stall/queue');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'PIN salah atau tidak ditemukan');
      setPin('');
    } finally {
      setIsLoading(false);
      setActiveQuickPin(null);
    }
  };

  const handleQuickLogin = (quickPin: string) => {
    if (isLoading) return;
    setPin(quickPin);
    handleSubmit(quickPin, true);
  };

  return {
    pin,
    errorMsg,
    isLoading,
    activeQuickPin,
    handleNumpadClick,
    handleBackspace,
    handleClear,
    handleSubmit,
    handleQuickLogin,
  };
}
