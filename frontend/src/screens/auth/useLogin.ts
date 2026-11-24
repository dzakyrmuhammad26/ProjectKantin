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

  const handleNumpadClick = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handleSubmit = async (pinToSubmit?: string) => {
    const targetPin = pinToSubmit || pin;
    if (!targetPin || targetPin.length < 4) {
      setErrorMsg('Masukkan minimal 4 digit PIN');
      return;
    }

    try {
      setIsLoading(true);
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
    }
  };

  const handleQuickLogin = (quickPin: string) => {
    setPin(quickPin);
    handleSubmit(quickPin);
  };

  return {
    pin,
    errorMsg,
    isLoading,
    handleNumpadClick,
    handleBackspace,
    handleClear,
    handleSubmit,
    handleQuickLogin,
  };
}
