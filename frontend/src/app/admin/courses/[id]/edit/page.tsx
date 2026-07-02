'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Course, Module, Lesson } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

const categories = ['Web Development', 'Data Science', 'UI/UX Design', 'Mobile Dev', 'AI & ML', 'DevOps', 'Marketing', 'Business'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // New module/lesson modals
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [lessonForm, setLessonForm] = useState({ title: '', videoUrl: '', isPreview: false, order: 0 });
  const [videoUploading, setVideoUploading] = useState(false);

  const load = useCallback(async () => {
    const [cRes, mRes] = await Promise.all([api.get(`/courses/${id}`), api.get(`/modules/course/${id}`)]);
    setCourse(cRes.data.course);
    setModules(mRes.data.modules);
    setIsLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setIsSaving(true);
    try {
      await api.put(`/courses/${id}`, course);
      toast.success('Course updated!');
    } catch { toast.error('Failed to update course.'); }
    finally { setIsSaving(false); }
  };

  const addModule = async () => {
    if (!moduleTitle.trim()) return;
    try {
      await api.post('/modules', { courseId: id, title: moduleTitle, order: modules.length });
      toast.success('Module added!');
      setModuleTitle(''); setShowModuleModal(false);
      load();
    } catch { toast.error('Failed to add module.'); }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await api.post('/upload/video', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLessonForm((f) => ({ ...f, videoUrl: res.data.url }));
      toast.success('Video uploaded!');
    } catch { toast.error('Video upload failed.'); }
    finally { setVideoUploading(false); }
  };

  const addLesson = async () => {
    if (!lessonForm.title || !lessonForm.videoUrl) { toast.error('Title and video are required.'); return; }
    const mod = modules.find((m) => m._id === selectedModuleId);
    try {
      await api.post('/lessons', { ...lessonForm, moduleId: selectedModuleId, order: (mod?.lessons?.length || 0) });
      toast.success('Lesson added!');
      setLessonForm({ title: '', videoUrl: '', isPreview: false, order: 0 });
      setShowLessonModal(false);
      load();
    } catch { toast.error('Failed to add lesson.'); }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Delete this module and all its lessons?')) return;
    try { await api.delete(`/modules/${moduleId}`); toast.success('Module deleted.'); load(); }
    catch { toast.error('Failed to delete module.'); }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    try { await api.delete(`/lessons/${lessonId}`); toast.success('Lesson deleted.'); load(); }
    catch { toast.error('Failed to delete lesson.'); }
  };

  if (isLoading || !course) return <div className="p-8 space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16" />)}</div>;

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 text-sm mb-6">← Back to Courses</button>
      <h1 className="text-2xl font-black text-slate-900 mb-8">Edit Course</h1>

      {/* Course form */}
      <form onSubmit={handleSave} className="card p-6 space-y-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900">Basic Info</h2>
        <div>
          <label className="label">Title</label>
          <input value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} className="input" required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} className="input min-h-[100px] resize-y" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Price (₹)</label>
            <input type="number" min={0} value={course.price} onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })} className="input" />
          </div>
          <div>
            <label className="label">Level</label>
            <select value={course.level} onChange={(e) => setCourse({ ...course, level: e.target.value as any })} className="input">
              {levels.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
          <span className="text-sm font-medium text-slate-900">Published</span>
          <button type="button" onClick={() => setCourse({ ...course, isPublished: !course.isPublished })}
            className={`relative w-11 h-6 rounded-full transition-colors ${course.isPublished ? 'bg-indigo-500' : 'bg-slate-200'}`}>
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${course.isPublished ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        <button type="submit" disabled={isSaving} className="btn-primary px-6" id="save-course-btn">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Curriculum */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">Curriculum</h2>
          <button onClick={() => setShowModuleModal(true)} className="btn-secondary text-sm px-4 py-2" id="add-module-btn">+ Add Module</button>
        </div>

        {modules.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No modules yet. Add your first module!</p>
        ) : (
          <div className="space-y-4">
            {modules.map((mod) => (
              <div key={mod._id} className="border border-slate-100 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-white/[0.03]">
                  <span className="font-semibold text-slate-900 text-sm">{mod.title}</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedModuleId(mod._id); setShowLessonModal(true); }}
                      className="text-xs text-violet-600 hover:text-violet-500 px-3 py-1.5 bg-indigo-500/10 rounded-lg" id={`add-lesson-${mod._id}`}>
                      + Add Lesson
                    </button>
                    <button onClick={() => deleteModule(mod._id)} className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 bg-red-500/10 rounded-lg">Delete</button>
                  </div>
                </div>
                {(mod.lessons || []).length === 0 ? (
                  <p className="px-4 py-3 text-xs text-slate-400">No lessons yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {(mod.lessons || []).map((lesson) => (
                      <div key={lesson._id} className="flex items-center gap-3 px-4 py-3">
                        <span className="text-violet-600 text-xs">▶</span>
                        <span className="text-sm text-slate-700 flex-1">{lesson.title}</span>
                        {lesson.isPreview && <span className="badge badge-green text-xs">Preview</span>}
                        <button onClick={() => deleteLesson(lesson._id)} className="text-xs text-red-400 hover:text-red-300">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Module Modal */}
      <Modal isOpen={showModuleModal} onClose={() => setShowModuleModal(false)} title="Add Module">
        <div className="space-y-4">
          <div>
            <label className="label">Module Title</label>
            <input type="text" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} className="input" placeholder="e.g. Getting Started" id="module-title-input" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowModuleModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={addModule} className="btn-primary flex-1" id="save-module-btn">Add Module</button>
          </div>
        </div>
      </Modal>

      {/* Add Lesson Modal */}
      <Modal isOpen={showLessonModal} onClose={() => setShowLessonModal(false)} title="Add Lesson" size="lg">
        <div className="space-y-4">
          <div>
            <label className="label">Lesson Title</label>
            <input type="text" value={lessonForm.title} onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
              className="input" placeholder="e.g. Introduction to React" id="lesson-title-input" />
          </div>
          <div>
            <label className="label">Video URL or Upload</label>
            {lessonForm.videoUrl ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between">
                <span className="text-emerald-400 text-sm">✓ Video ready</span>
                <button onClick={() => setLessonForm((f) => ({ ...f, videoUrl: '' }))} className="text-xs text-red-400">Remove</button>
              </div>
            ) : (
              <div className="space-y-2">
                <input type="text" value={lessonForm.videoUrl} onChange={(e) => setLessonForm((f) => ({ ...f, videoUrl: e.target.value }))}
                  className="input" placeholder="Paste YouTube URL or video URL..." id="video-url-input" />
                <div className="text-center text-slate-400 text-xs">— or —</div>
                <label className="block">
                  <span className="btn-secondary text-sm text-center w-full block cursor-pointer">
                    {videoUploading ? 'Uploading...' : '⬆ Upload Video File'}
                  </span>
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" disabled={videoUploading} />
                </label>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setLessonForm((f) => ({ ...f, isPreview: !f.isPreview }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${lessonForm.isPreview ? 'bg-indigo-500' : 'bg-slate-200'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${lessonForm.isPreview ? 'left-5' : 'left-0.5'}`} />
            </button>
            <span className="text-sm text-slate-600">Free preview lesson</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowLessonModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={addLesson} disabled={videoUploading} className="btn-primary flex-1" id="save-lesson-btn">Add Lesson</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
