import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Shield, Lock, ArrowLeft, AlertCircle, LogIn, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onSuccess }) => {
  const { loginWithGoogle, loginWithPasscode, currentUser, isAdmin } = usePortfolio();
  const [passcode, setPasscode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        onSuccess();
      } else {
        setError('Authentication was cancelled or failed.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const ok = await loginWithPasscode(passcode);
      if (ok) {
        onSuccess();
      } else {
        setError('Invalid administrative passcode. Access denied.');
      }
    } catch {
      setError('Server verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#15171C] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </button>

        <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-8 shadow-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#635BFF]/15 text-[#635BFF] mb-6">
            <Shield className="h-6 w-6 text-[#B9F45A]" />
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            Content Management Access
          </h1>
          <p className="mt-2 text-xs text-[#737783] leading-relaxed">
            Authorized administrator portal for portfolio works, media uploads, hero background mode, and client inquiries.
          </p>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Method: Google Sign In */}
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-white hover:bg-white/90 text-[#15171C] py-3.5 px-4 text-xs font-bold shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google (Owner Account)</span>
            </button>
          </div>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2B2E38]" />
            </div>
            <span className="relative bg-[#1C1F26] px-3 text-[11px] font-mono uppercase text-[#737783]">
              or server admin key
            </span>
          </div>

          {/* Secondary Method: Secure Admin Key */}
          <form onSubmit={handlePasscodeLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#C5CAD4] mb-1.5 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-[#B9F45A]" />
                <span>Admin Passcode</span>
              </label>
              <input
                type="password"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] px-4 py-3 text-sm text-white placeholder-[#737783] outline-none focus:border-[#635BFF] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !passcode}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] text-white py-3 px-4 text-xs font-bold transition-all disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              <span>Verify & Enter Dashboard</span>
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-[#737783]">
            Owner email configured: <strong className="text-white">tesfukebe000@gmail.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
