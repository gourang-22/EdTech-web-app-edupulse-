'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    api.get('/courses/admin/all').then((r) => setCourses(r.data.courses)).finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/courses/${deleteId}`);
      toast.success('Course deleted.');
      setDeleteId(null);
      load();
    } catch { toast.error('Failed to delete course.'); }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Course Management</h1>
          <p className="text-slate-500 mt-1">{courses.length} total courses</p>
        </div>
        <Link href="/admin/courses/create" className="btn-primary flex items-center gap-2" id="create-course-btn">
          <span>+</span> Create Course
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
      ) : courses.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-5xl mb-4">📚</p>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No courses yet</h3>
          <p className="text-slate-500 mb-6">Create your first course to get started.</p>
          <Link href="/admin/courses/create" className="btn-primary px-8">Create Course</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-100">
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Students</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={course.thumbnail} alt={course.title} className="w-12 h-9 object-cover rounded-lg flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 line-clamp-1">{course.title}</p>
                          <p className="text-xs text-slate-500">{course.instructor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{course.category}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {course.price === 0 ? <span className="text-emerald-400">Free</span> : `₹${course.price.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{course.totalStudents}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${course.isPublished ? 'badge-green' : 'badge-yellow'}`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/courses/${course._id}/edit`}
                          className="px-3 py-1.5 bg-indigo-500/10 text-violet-600 rounded-lg text-xs hover:bg-violet-100 transition-all font-medium"
                          id={`edit-course-${course._id}`}>Edit</Link>
                        <button onClick={() => setDeleteId(course._id)}
                          className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-all font-medium"
                          id={`delete-course-${course._id}`}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Course" size="sm">
        <p className="text-slate-600 text-sm mb-6">Are you sure you want to delete this course? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleDelete} className="btn-danger flex-1" id="confirm-delete-btn">Delete Course</button>
        </div>
      </Modal>
    </div>
  );
}
