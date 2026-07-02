'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const categories = ['Web Development', 'Data Science', 'UI/UX Design', 'Mobile Dev', 'AI & ML', 'DevOps', 'Marketing', 'Business'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: 0, thumbnail: '', instructor: '',
    instructorBio: '', category: 'Web Development', level: 'Beginner',
    language: 'English', duration: '', learningOutcomes: ['', '', ''],
    requirements: ['', ''], tags: '', isPublished: false,
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      set('thumbnail', res.data.url);
      toast.success('Thumbnail uploaded!');
    } catch { toast.error('Upload failed.'); }
    finally { setThumbnailUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.instructor || !form.thumbnail) {
      toast.error('Please fill all required fields and upload a thumbnail.');
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        learningOutcomes: form.learningOutcomes.filter(Boolean),
        requirements: form.requirements.filter(Boolean),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      await api.post('/courses', payload);
      toast.success('Course created successfully! 🎉');
      router.push('/admin/courses');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create course.');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 transition-colors text-sm mb-3">← Back</button>
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Create New Course</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
          <div>
            <label className="label">Course Title *</label>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className="input" placeholder="e.g. Complete React Developer Course" required id="course-title" />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className="input min-h-[120px] resize-y" placeholder="Describe what students will learn..." required id="course-desc" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input" id="course-category">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Level</label>
              <select value={form.level} onChange={(e) => set('level', e.target.value)} className="input" id="course-level">
                {levels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₹) — 0 for free</label>
              <input type="number" min={0} value={form.price} onChange={(e) => set('price', Number(e.target.value))} className="input" id="course-price" />
            </div>
            <div>
              <label className="label">Language</label>
              <input type="text" value={form.language} onChange={(e) => set('language', e.target.value)} className="input" id="course-language" />
            </div>
          </div>
          <div>
            <label className="label">Estimated Duration (e.g. "12 hours")</label>
            <input type="text" value={form.duration} onChange={(e) => set('duration', e.target.value)} className="input" placeholder="12 hours" id="course-duration" />
          </div>
        </div>

        {/* Instructor */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Instructor</h2>
          <div>
            <label className="label">Instructor Name *</label>
            <input type="text" value={form.instructor} onChange={(e) => set('instructor', e.target.value)} className="input" required id="course-instructor" />
          </div>
          <div>
            <label className="label">Instructor Bio</label>
            <textarea value={form.instructorBio} onChange={(e) => set('instructorBio', e.target.value)} className="input min-h-[80px] resize-y" id="course-bio" />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Course Thumbnail *</h2>
          {form.thumbnail ? (
            <div className="relative">
              <img src={form.thumbnail} alt="Thumbnail" className="w-full h-48 object-cover rounded-xl mb-3" />
              <button type="button" onClick={() => set('thumbnail', '')} className="btn-danger text-xs px-3 py-1.5">Remove</button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-200 hover:border-indigo-500/40 rounded-xl p-10 flex flex-col items-center gap-2 cursor-pointer transition-all">
              <span className="text-3xl">{thumbnailUploading ? '⏳' : '🖼'}</span>
              <span className="text-sm text-slate-500">{thumbnailUploading ? 'Uploading...' : 'Click to upload thumbnail'}</span>
              <span className="text-xs text-slate-400">JPG, PNG, WebP — recommended 1280×720</span>
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" disabled={thumbnailUploading} id="thumbnail-upload" />
            </label>
          )}
        </div>

        {/* Learning Outcomes */}
        <div className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Learning Outcomes</h2>
          {form.learningOutcomes.map((o, i) => (
            <input key={i} type="text" value={o} onChange={(e) => {
              const arr = [...form.learningOutcomes]; arr[i] = e.target.value; set('learningOutcomes', arr);
            }} className="input" placeholder={`Outcome ${i + 1}`} id={`outcome-${i}`} />
          ))}
          <button type="button" onClick={() => set('learningOutcomes', [...form.learningOutcomes, ''])}
            className="text-violet-600 text-sm hover:text-violet-500">+ Add more</button>
        </div>

        {/* Requirements */}
        <div className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Requirements</h2>
          {form.requirements.map((r, i) => (
            <input key={i} type="text" value={r} onChange={(e) => {
              const arr = [...form.requirements]; arr[i] = e.target.value; set('requirements', arr);
            }} className="input" placeholder={`Requirement ${i + 1}`} id={`req-${i}`} />
          ))}
          <button type="button" onClick={() => set('requirements', [...form.requirements, ''])}
            className="text-violet-600 text-sm hover:text-violet-500">+ Add more</button>
        </div>

        {/* Publish */}
        <div className="card p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">Publish Course</p>
            <p className="text-xs text-slate-500">Make this course visible to students</p>
          </div>
          <button type="button" onClick={() => set('isPublished', !form.isPublished)}
            className={`relative w-12 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-indigo-500' : 'bg-slate-200'}`}
            id="publish-toggle"
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isPublished ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-primary flex-1" id="submit-course-btn">
            {isLoading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
