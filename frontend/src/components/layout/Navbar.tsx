'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="page-container flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9"/>
              <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Edu<span className="text-violet-600">Pulse</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? 'text-violet-600 bg-indigo-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
                id="user-menu-btn"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-800">{user.name.split(' ')[0]}</span>
                <svg className={`w-4 h-4 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 card border border-slate-200 shadow-2xl overflow-hidden animate-fade-in-up">
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    {user.role === 'admin' ? (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all">
                        <span>⚡</span> Admin Panel
                      </Link>
                    ) : (
                      <>
                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all">
                          <span>📊</span> Dashboard
                        </Link>
                        <Link href="/dashboard/my-courses" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all">
                          <span>📚</span> My Courses
                        </Link>
                        <Link href="/dashboard/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all">
                          <span>🧾</span> Orders
                        </Link>
                        <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all">
                          <span>👤</span> Profile
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="p-1.5 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                      id="logout-btn"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Sign In</Link>
              <Link href="/signup" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-all"
          id="mobile-menu-btn"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-white transition-all ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-0.5 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="page-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all">
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileOpen(false)}
                    className="btn-secondary w-full">
                    {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                  <button onClick={handleLogout} className="btn-danger w-full">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full">Sign In</Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary w-full">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
