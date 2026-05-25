'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageSquare, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { COUNTRY_CODES } from '@/app/api/auth/send-code/route';

interface PhoneLoginProps {
  onSuccess?: (user: any) => void;
  onClose?: () => void;
}

export default function PhoneLogin({ onSuccess, onClose }: PhoneLoginProps) {
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [countryCode, setCountryCode] = useState('+86');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    if (!phone || phone.length < 6) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, countryCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send code');
      }

      setStep('verify');
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const fullCode = codeDigits.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, countryCode, code: fullCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.(data.user);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value.slice(-1);
    setCodeDigits(newDigits);
    setCode(newDigits.join(''));

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
          <Phone className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">
          {step === 'phone' ? '手机号登录' : '输入验证码'}
        </h3>
        <p className="text-sm text-foreground/60 mt-1">
          {step === 'phone'
            ? '输入您的手机号码，我们将发送验证码'
            : `验证码已发送至 ${countryCode} ${phone}`}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-500 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          验证成功！正在登录...
        </div>
      )}

      {/* Phone Input Step */}
      {step === 'phone' && (
        <div className="space-y-4">
          {/* Country Code Selector */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">
              国家/地区
            </label>
            <div className="relative">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full rounded-xl border border-border/40 bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
              >
                {COUNTRY_CODES.map((cc) => (
                  <option key={cc.code} value={cc.code}>
                    {cc.code} {cc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">
              手机号
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="138 0000 0000"
                className="w-full rounded-xl border border-border/40 bg-background px-4 py-2.5 pl-12 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            </div>
          </div>

          <button
            onClick={handleSendCode}
            disabled={loading || !phone}
            className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                发送验证码
              </>
            )}
          </button>
        </div>
      )}

      {/* Verification Code Step */}
      {step === 'verify' && (
        <div className="space-y-4">
          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">
              验证码
            </label>
            <div className="flex gap-2 justify-center">
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="tel"
                  value={digit}
                  onChange={(e) => handleCodeInput(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  className="w-12 h-12 rounded-xl border border-border/40 bg-background text-center text-xl font-semibold text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || code.length !== 6}
            className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              '验证并登录'
            )}
          </button>

          {/* Resend */}
          <div className="text-center text-sm text-foreground/60">
            {countdown > 0 ? (
              <span>重新发送 ({countdown}s)</span>
            ) : (
              <button
                onClick={handleSendCode}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                重新发送验证码
              </button>
            )}
          </div>

          {/* Back to phone */}
          <div className="text-center">
            <button
              onClick={() => setStep('phone')}
              className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors"
            >
              修改手机号
            </button>
          </div>
        </div>
      )}

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/40 hover:text-foreground/60 transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
}