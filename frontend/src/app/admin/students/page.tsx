'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/students').then((r) => setStudents(r.data.students)).finally(() => setIsLoading(false));
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Student Management</h1>
          <p className="text-slate-500 mt-1">{students.length} registered students</p>
        </div>
        <div className="relative">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..." className="input pl-9 text-sm w-64" id="student-search" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-16" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-100">
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Enrolled Courses</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="badge badge-indigo">{student.enrollmentCount} courses</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(student.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
