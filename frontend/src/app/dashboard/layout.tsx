'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/my-courses', label: 'My Courses', icon: '📚' },
  { href: '/dashboard/orders', label: 'Orders', icon: '🧾' },
  { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (user?.role === 'admin') router.push('/admin');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role === 'admin') return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-white/[0.06] bg-slate-50 sticky top-20 h-[calc(100vh-5rem)]">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                <p className="text-xs text-slate-500">Student</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-100 text-violet-600 border border-indigo-500/20'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  id={`sidebar-${link.label.toLowerCase().replace(' ', '-')}`}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-100">
            <Link href="/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
              <span>🔍</span> Browse Courses
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
}
