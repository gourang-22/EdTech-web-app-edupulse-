'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Course, Module, Enrollment } from '@/types';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [openModule, setOpenModule] = useState<number | null>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data.course);
        if (isAuthenticated) {
          const [modRes, enrollRes] = await Promise.all([
            api.get(`/modules/course/${id}`).catch(() => ({ data: { modules: [] } })),
            api.get(`/enrollments/check/${id}`).catch(() => ({ data: { enrolled: false } })),
          ]);
          setModules(modRes.data.modules);
          if (enrollRes.data.enrolled) setEnrollment(enrollRes.data.enrollment);
        }
      } catch { toast.error('Course not found.'); router.push('/courses'); }
      finally { setIsLoading(false); }
    };
    if (id) load();
  }, [id, isAuthenticated, router]);

  const handleBuy = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!course) return;
    if (course.price === 0) {
      setBuying(true);
      try {
        const res = await api.post('/orders/create', { courseId: id });
        if (res.data.free) { toast.success('Enrolled successfully! 🎉'); router.push('/dashboard/my-courses'); }
      } catch (e: any) { toast.error(e.response?.data?.message || 'Enrollment failed.'); }
      finally { setBuying(false); }
      return;
    }
    router.push(`/checkout/${id}`);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 page-container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="skeleton h-10 w-3/4" /><div className="skeleton h-6 w-full" /><div className="skeleton h-64" />
            </div>
            <div className="skeleton h-96" />
          </div>
        </div>
        <Footer />
      </>
    );
  }
  if (!course) return null;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        {/* Hero */}
        <div className="hero-bg dot-grid py-14 border-b border-white/[0.06]">
          <div className="page-container">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <a href="/courses" className="hover:text-violet-600 transition-colors">Courses</a>
              <span>/</span>
              <span className="text-violet-600">{course.category}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left */}
              <div className="lg:col-span-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-indigo">{course.category}</span>
                  <span className="badge badge-yellow">{course.level}</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-black mb-4">{course.title}</h1>
                <p className="text-slate-500 text-lg mb-6 leading-relaxed">{course.description}</p>
                <div className="flex flex-wrap gap-5 text-sm text-slate-500">
                  <span>👨‍🏫 {course.instructor}</span>
                  <span>⭐ {course.rating.toFixed(1)} ({course.totalReviews} reviews)</span>
                  <span>👥 {course.totalStudents.toLocaleString()} students</span>
                  {course.totalLessons && <span>📖 {course.totalLessons} lessons</span>}
                  {course.duration && <span>⏱ {course.duration}</span>}
                  <span>🌐 {course.language}</span>
                </div>
              </div>
              {/* Right — Purchase card (hidden on mobile, shown below) */}
              <div className="hidden lg:block" />
            </div>
          </div>
        </div>

        <div className="page-container py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Learning Outcomes */}
              {course.learningOutcomes?.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-xl font-bold mb-5">What You'll Learn</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.learningOutcomes.map((outcome, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                        {outcome}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum */}
              {modules.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-xl font-bold mb-5">Course Curriculum</h2>
                  <div className="space-y-3">
                    {modules.map((mod, i) => (
                      <div key={mod._id} className="border border-slate-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenModule(openModule === i ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                          id={`module-${i}`}
                        >
                          <span className="font-medium text-slate-900">{mod.title}</span>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span>{(mod.lessons || []).length} lessons</span>
                            <svg className={`w-4 h-4 transition-transform ${openModule === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        {openModule === i && (mod.lessons || []).length > 0 && (
                          <div className="border-t border-slate-100 divide-y divide-white/5">
                            {(mod.lessons || []).map((lesson) => (
                              <div key={lesson._id} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500">
                                <span className="text-violet-600">▶</span>
                                <span className="flex-1">{lesson.title}</span>
                                {lesson.duration && <span>{Math.floor(lesson.duration / 60)}m</span>}
                                {lesson.isPreview && <span className="badge badge-green text-xs">Preview</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {course.requirements?.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-xl font-bold mb-5">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="text-violet-600 mt-0.5">•</span>{req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructor */}
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-5">About the Instructor</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{course.instructor}</h3>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                      {course.instructorBio || 'Expert instructor with years of industry experience.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase card */}
            <div>
              <div className="card p-6 sticky top-24 glow-indigo">
                <div className="rounded-xl overflow-hidden mb-5 h-44">
                  <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80'} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="mb-4">
                  {course.price === 0 ? (
                    <span className="text-3xl font-black text-emerald-400">Free</span>
                  ) : (
                    <span className="text-3xl font-black text-slate-900">₹{course.price.toLocaleString()}</span>
                  )}
                </div>
                {enrollment ? (
                  <button
                    onClick={() => router.push(`/dashboard/learn/${enrollment._id}`)}
                    className="w-full btn-primary py-3.5 mb-4"
                    id="go-to-course-btn"
                  >
                    Go to Course →
                  </button>
                ) : (
                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="w-full btn-primary py-3.5 mb-4"
                    id="buy-now-btn"
                  >
                    {buying ? 'Processing...' : course.price === 0 ? 'Enroll Free' : 'Buy Now'}
                  </button>
                )}
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2"><span>✓</span> Lifetime access</div>
                  <div className="flex items-center gap-2"><span>✓</span> Certificate of completion</div>
                  <div className="flex items-center gap-2"><span>✓</span> 30-day money-back guarantee</div>
                  <div className="flex items-center gap-2"><span>✓</span> Downloadable resources</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
