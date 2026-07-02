'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { Enrollment, Module, Lesson } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function LearnPage() {
  const { enrollmentId } = useParams();
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/enrollments/${enrollmentId}`);
      setEnrollment(res.data.enrollment);
      setCurriculum(res.data.curriculum);
      setCompletedIds(res.data.enrollment.completedLessons || []);
      // Set first lesson as active
      const firstModule = res.data.curriculum[0];
      const lastWatched = res.data.enrollment.lastWatchedLesson;
      if (lastWatched) {
        for (const mod of res.data.curriculum) {
          const found = (mod.lessons || []).find((l: Lesson) => l._id === lastWatched);
          if (found) { setActiveLesson(found); break; }
        }
      } else if (firstModule?.lessons?.[0]) {
        setActiveLesson(firstModule.lessons[0]);
      }
    } catch { toast.error('Failed to load course.'); router.push('/dashboard/my-courses'); }
    finally { setIsLoading(false); }
  }, [enrollmentId, router]);

  useEffect(() => { load(); }, [load]);

  const markComplete = async () => {
    if (!activeLesson || !enrollment) return;
    if (completedIds.includes(activeLesson._id)) { toast('Already completed!'); return; }
    try {
      const res = await api.put(`/enrollments/${enrollmentId}/complete-lesson`, { lessonId: activeLesson._id });
      setCompletedIds(res.data.enrollment.completedLessons);
      setEnrollment(res.data.enrollment);
      toast.success('Lesson marked as complete! ✓');
    } catch { toast.error('Failed to mark lesson.'); }
  };

  const totalLessons = curriculum.reduce((s, m) => s + (m.lessons?.length || 0), 0);
  const course = enrollment?.courseId as any;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-5rem)]">
        <div className="flex-1 flex items-center justify-center"><div className="skeleton w-full max-w-3xl h-96 m-8" /></div>
        <div className="w-80 border-l border-slate-100 p-4 space-y-2">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-10" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col overflow-auto bg-[#08080F]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push('/dashboard/my-courses')} className="text-slate-500 hover:text-slate-900 transition-colors" id="back-to-courses-btn">
              ← Back
            </button>
            <span className="text-slate-900/20">|</span>
            <h1 className="text-sm font-semibold text-slate-900 truncate">{course?.title}</h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span>{completedIds.length}</span>/<span>{totalLessons}</span> lessons
            </div>
            <div className="w-24 progress-bar">
              <div className="progress-fill" style={{ width: `${enrollment?.progressPercent || 0}%` }} />
            </div>
            <span className="text-xs text-violet-600">{enrollment?.progressPercent || 0}%</span>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-900 transition-colors text-sm" id="toggle-sidebar-btn">
              ☰
            </button>
          </div>
        </div>

        {/* Video */}
        <div className="flex-1 p-6">
          {activeLesson ? (
            <>
              <VideoPlayer videoUrl={activeLesson.videoUrl} title={activeLesson.title} onEnded={markComplete} />
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{activeLesson.title}</h2>
                  {activeLesson.duration && (
                    <p className="text-sm text-slate-500 mt-1">Duration: {Math.floor(activeLesson.duration / 60)}m {activeLesson.duration % 60}s</p>
                  )}
                </div>
                <button
                  onClick={markComplete}
                  disabled={completedIds.includes(activeLesson._id)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    completedIds.includes(activeLesson._id)
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                  id="mark-complete-btn"
                >
                  {completedIds.includes(activeLesson._id) ? '✓ Completed' : 'Mark Complete'}
                </button>
              </div>

              {/* Resources */}
              {activeLesson.resources?.length > 0 && (
                <div className="mt-8 card p-5">
                  <h3 className="font-bold text-slate-900 mb-4">📎 Lesson Resources</h3>
                  <div className="space-y-2">
                    {activeLesson.resources.map((res, i) => (
                      <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-600 hover:text-slate-900">
                        <span>{res.type === 'pdf' ? '📄' : res.type === 'video' ? '🎥' : '🔗'}</span>
                        <span>{res.name}</span>
                        <span className="ml-auto text-violet-600 text-xs">Download ↓</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-4xl mb-4">▶️</p>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Select a lesson to start</h3>
                <p className="text-slate-500 text-sm">Choose a lesson from the sidebar to begin learning.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Curriculum */}
      {sidebarOpen && (
        <aside className="w-80 flex-shrink-0 border-l border-slate-100 bg-slate-50 overflow-y-auto">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Course Content</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {curriculum.map((mod) => (
              <div key={mod._id}>
                <div className="px-4 py-3 bg-slate-50">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{mod.title}</p>
                </div>
                {(mod.lessons || []).map((lesson) => {
                  const isActive = activeLesson?._id === lesson._id;
                  const isDone = completedIds.includes(lesson._id);
                  return (
                    <button
                      key={lesson._id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                        isActive ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : 'hover:bg-slate-50 border-l-2 border-transparent'
                      }`}
                      id={`lesson-${lesson._id}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs transition-all ${
                        isDone ? 'bg-emerald-500/20 text-emerald-400' : isActive ? 'bg-violet-100 text-violet-600' : 'bg-slate-200 text-slate-400'
                      }`}>
                        {isDone ? '✓' : '▶'}
                      </div>
                      <span className={`text-xs leading-snug flex-1 ${isActive ? 'text-violet-500 font-medium' : isDone ? 'text-slate-500' : 'text-slate-600'}`}>
                        {lesson.title}
                      </span>
                      {lesson.duration && <span className="text-xs text-slate-400">{Math.floor(lesson.duration / 60)}m</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
