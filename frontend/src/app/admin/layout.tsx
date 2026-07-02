'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/courses', label: 'Courses', icon: '📚' },
  { href: '/admin/students', label: 'Students', icon: '👥' },
  { href: '/admin/orders', label: 'Orders', icon: '🧾' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (user?.role !== 'admin') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 flex">
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-white/[0.06] bg-slate-50 sticky top-20 h-[calc(100vh-5rem)]">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Admin Panel</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-violet-100 text-violet-600 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  id={`admin-nav-${link.label.toLowerCase()}`}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-100">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
              <span>🏠</span> View Site
            </Link>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </>
  );
}
