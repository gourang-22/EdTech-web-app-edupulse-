'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseCard from '@/components/ui/CourseCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCourseStore } from '@/store/courseStore';
import { useAuthStore } from '@/store/authStore';

const stats = [
  { value: '50,000+', label: 'Active Learners' },
  { value: '200+', label: 'Expert Courses' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '150+', label: 'Expert Instructors' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Frontend Developer', avatar: 'P', text: 'EduPulse transformed my career. The courses are incredibly well-structured and the instructors are world-class. I got my dream job within 3 months!', rating: 5 },
  { name: 'Rahul Verma', role: 'Data Scientist', avatar: 'R', text: 'The project-based learning approach is amazing. I applied everything I learned directly to real-world problems. Highly recommend!', rating: 5 },
  { name: 'Ananya Patel', role: 'UX Designer', avatar: 'A', text: 'The UI/UX design course completely changed how I approach design thinking. The community support is fantastic too.', rating: 5 },
];

const faqs = [
  { q: 'How do I access my purchased courses?', a: 'After purchase, courses appear in your Dashboard under "My Courses". You can access them anytime, from any device.' },
  { q: 'Do courses have an expiry date?', a: 'No! Once you purchase a course, you have lifetime access including all future updates.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and wallets through Mock Payments.' },
  { q: 'Can I get a refund?', a: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with a course.' },
  { q: 'Are certificates provided?', a: 'Yes! You receive a certificate of completion for every course you finish, shareable on LinkedIn.' },
];

const categories = [
  { name: 'Web Development', icon: '💻', count: '45 Courses' },
  { name: 'Data Science', icon: '📊', count: '32 Courses' },
  { name: 'UI/UX Design', icon: '🎨', count: '28 Courses' },
  { name: 'Mobile Dev', icon: '📱', count: '24 Courses' },
  { name: 'AI & ML', icon: '🤖', count: '19 Courses' },
  { name: 'DevOps', icon: '⚙️', count: '15 Courses' },
];

export default function HomePage() {
  const { featuredCourses, fetchFeatured, isFeaturedLoading } = useCourseStore();
  const { isAuthenticated } = useAuthStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { fetchFeatured(); }, [fetchFeatured]);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="hero-bg dot-grid min-h-screen flex items-center pt-20">
          <div className="page-container py-20 lg:py-28">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 text-sm text-violet-600 mb-8 animate-fade-in-up">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                New courses added every week
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Learn Skills That<br />
                <span className="gradient-text">Shape the Future</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Join 50,000+ learners mastering in-demand skills through expert-led courses, hands-on projects, and a thriving community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                {isAuthenticated ? (
                  <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
                ) : (
                  <>
                    <Link href="/signup" id="hero-cta-btn" className="btn-primary">Start Learning Free</Link>
                    <Link href="/courses" className="btn-secondary">Browse Courses</Link>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <span className="flex items-center gap-2"><span className="text-emerald-400">✓</span> No credit card required</span>
                <span className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Lifetime access</span>
                <span className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Certificate of completion</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-white/[0.06] bg-slate-50 py-12">
          <div className="page-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl lg:text-4xl font-black gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="section">
          <div className="page-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Browse by Category</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Explore our curated selection of top courses across every field.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link key={cat.name} href={`/courses?category=${encodeURIComponent(cat.name)}`}
                  className="card card-hover p-5 text-center group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <div className="text-sm font-semibold text-slate-900 mb-1">{cat.name}</div>
                  <div className="text-xs text-slate-400">{cat.count}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="section bg-slate-50">
          <div className="page-container">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-2">Featured Courses</h2>
                <p className="text-slate-500">Hand-picked by our expert team</p>
              </div>
              <Link href="/courses" className="btn-secondary hidden md:flex">
                View All <span>→</span>
              </Link>
            </div>
            {isFeaturedLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton h-80" />
                ))}
              </div>
            ) : featuredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.slice(0, 6).map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-3xl border border-white/[0.05]">
                <div className="text-6xl mb-4 opacity-50">🚀</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">New courses arriving soon</h3>
                <p className="text-slate-500 max-w-sm">Our expert instructors are crafting amazing new content. Check back later!</p>
              </div>
            )}
            <div className="text-center mt-10 md:hidden">
              <Link href="/courses" className="btn-secondary">View All Courses</Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section">
          <div className="page-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Learners Say</h2>
              <p className="text-slate-500">Real stories from real people who transformed their careers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="card p-6 flex flex-col gap-4">
                  <div className="flex">
                    {[...Array(t.rating)].map((_, i) => <span key={i} className="text-amber-400">★</span>)}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section bg-slate-50">
          <div className="page-container max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-500">Everything you need to know about EduPulse.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    id={`faq-${i}`}
                  >
                    <span className="font-medium text-slate-900">{faq.q}</span>
                    <svg className={`w-5 h-5 text-violet-600 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="page-container">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-pink-500/10 border border-slate-200 p-12 lg:p-20 text-center">
              <div className="absolute inset-0 dot-grid opacity-30" />
              <div className="relative">
                <h2 className="text-4xl lg:text-5xl font-black mb-4">
                  Ready to Start Learning?
                </h2>
                <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8">
                  Join thousands of learners already advancing their careers on EduPulse.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup" className="btn-primary">Get Started Free</Link>
                  <Link href="/courses" className="btn-secondary">Browse Courses</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
