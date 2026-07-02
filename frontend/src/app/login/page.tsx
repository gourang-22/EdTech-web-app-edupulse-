'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields.'); return; }
    try {
      await login(email, password);
      toast.success('Welcome back! 👋');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen hero-bg dot-grid flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9"/>
              </svg>
            </div>
            <h1 className="text-3xl font-black text-slate-900">Welcome back</h1>
            <p className="text-slate-500 mt-2">Sign in to continue your learning journey</p>
          </div>

          <div className="card p-8 border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="label text-left w-full">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                  <label htmlFor="login-password" className="label !mb-0 text-left w-full">Password</label>
                  <a href="#" className="text-xs text-violet-600 hover:text-violet-500 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input pr-10"
                    autoComplete="current-password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs"
                    id="toggle-password-btn">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3.5"
                id="login-submit-btn"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link href="/signup" className="text-violet-600 hover:text-violet-500 font-medium transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
