'use client';
import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseCard from '@/components/ui/CourseCard';
import { Course } from '@/types';
import api from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

const categories = ['All', 'Web Development', 'Data Science', 'UI/UX Design', 'Mobile Dev', 'AI & ML', 'DevOps', 'Marketing'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [level, setLevel] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (level !== 'All') params.level = level;
      const res = await api.get('/courses', { params });
      setCourses(res.data.courses);
      setPagination(res.data.pagination);
    } catch (e) { /* silent */ } finally { setIsLoading(false); }
  }, [search, category, level, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        {/* Header */}
        <section className="hero-bg dot-grid py-16">
          <div className="page-container text-center">
            <h1 className="text-4xl lg:text-5xl font-black mb-4">Explore All Courses</h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8">Discover your next skill with 200+ expert-led courses.</p>
            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-xl mx-auto">
              <div className="flex-1 relative">
                <input
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses, instructors..."
                  className="input pl-10 text-sm" id="course-search-input"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button type="submit" className="btn-primary" id="course-search-btn">Search</button>
            </form>
          </div>
        </section>

        <div className="page-container py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="card p-5 sticky top-24">
                <h3 className="font-semibold text-slate-900 mb-4">Category</h3>
                <div className="space-y-1 mb-6">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        category === cat ? 'bg-violet-100 text-violet-600 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      id={`cat-${cat}`}
                    >{cat}</button>
                  ))}
                </div>
                <h3 className="font-semibold text-slate-900 mb-4">Level</h3>
                <div className="space-y-1">
                  {levels.map((lvl) => (
                    <button key={lvl} onClick={() => { setLevel(lvl); setPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        level === lvl ? 'bg-violet-100 text-violet-600 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      id={`lvl-${lvl}`}
                    >{lvl}</button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Course Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-slate-500 text-sm">{pagination.total} courses found</p>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-80" />)}
                </div>
              ) : courses.length === 0 ? (
                <div className="card p-16 text-center">
                  <p className="text-4xl mb-4">🔍</p>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses found</h3>
                  <p className="text-slate-500 text-sm">Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((course) => <CourseCard key={course._id} course={course} />)}
                  </div>
                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button disabled={page === 1} onClick={() => setPage(page - 1)}
                        className="btn-secondary disabled:opacity-40">← Prev</button>
                      <span className="text-slate-500 text-sm">Page {page} of {pagination.pages}</span>
                      <button disabled={page === pagination.pages} onClick={() => setPage(page + 1)}
                        className="btn-secondary disabled:opacity-40">Next →</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CoursesPage() {
  return (
    <Suspense>
      <CoursesContent />
    </Suspense>
  );
}
