'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading, isAuthenticated } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) { toast.error('All fields are required.'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match.'); return; }
    try {
      await register(name, email, password);
      toast.success('Account created! Welcome to EduPulse 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed.');
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
            <h1 className="text-3xl font-black text-slate-900">Create your account</h1>
            <p className="text-slate-500 mt-2">Join 50,000+ learners on EduPulse</p>
          </div>

          <div className="card p-8 border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="signup-name" className="label text-left w-full">Full Name</label>
                <input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" className="input" autoComplete="name" required />
              </div>
              <div>
                <label htmlFor="signup-email" className="label text-left w-full">Email address</label>
                <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input" autoComplete="email" required />
              </div>
              <div>
                <label htmlFor="signup-password" className="label text-left w-full">Password</label>
                <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" className="input" autoComplete="new-password" required />
              </div>
              <div>
                <label htmlFor="signup-confirm" className="label">Confirm Password</label>
                <input id="signup-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password" className="input" autoComplete="new-password" required />
              </div>
              <button type="submit" disabled={isLoading} className="w-full btn-primary py-3.5" id="signup-submit-btn">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
            <p className="text-xs text-slate-400 text-center mt-4 break-words text-balance">
              By signing up, you agree to our{' '}
              <a href="#" className="text-violet-600 hover:text-violet-500">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-violet-600 hover:text-violet-500">Privacy Policy</a>.
            </p>
            <p className="text-center text-sm text-slate-500 mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-violet-600 hover:text-violet-500 font-medium transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
