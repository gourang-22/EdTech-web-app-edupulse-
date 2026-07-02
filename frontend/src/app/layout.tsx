import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'EduPulse — Learn Without Limits',
  description: 'Discover world-class online courses. Learn from expert instructors, track your progress, and advance your career.',
  keywords: 'online learning, courses, edtech, education, programming, design',
  openGraph: {
    title: 'EduPulse — Learn Without Limits',
    description: 'Discover world-class online courses from expert instructors.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0A0F] text-slate-900 antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#16162A',
                color: '#F1F1F8',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#16162A' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#16162A' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
