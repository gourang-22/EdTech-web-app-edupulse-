'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Enrollment } from '@/types';
import api from '@/lib/api';

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my-courses').then((r) => setEnrollments(r.data.enrollments)).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900">My Courses</h1>
        <p className="text-slate-500 mt-1 whitespace-nowrap">{enrollments.length} enrolled course{enrollments.length !== 1 ? 's' : ''}</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-72" />)}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-5xl mb-4">📚</p>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No enrolled courses yet</h3>
          <p className="text-slate-500 mb-6">Start learning by enrolling in a course today!</p>
          <Link href="/courses" className="btn-primary px-8">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => {
            const course = enrollment.courseId as any;
            return (
              <div key={enrollment._id} className="card card-hover overflow-hidden flex flex-col">
                <div className="relative h-40 overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16162A]/80 to-transparent" />
                  {enrollment.isCompleted && (
                    <div className="absolute top-3 right-3 badge badge-green">✓ Completed</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">{course.instructor}</p>
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                      <span>Progress</span>
                      <span className="text-violet-600 font-semibold">{enrollment.progressPercent}%</span>
                    </div>
                    <div className="progress-bar mb-4">
                      <div className="progress-fill" style={{ width: `${enrollment.progressPercent}%` }} />
                    </div>
                    <Link
                      href={`/dashboard/learn/${enrollment._id}`}
                      className="w-full btn-primary text-sm text-center block"
                      id={`continue-course-${enrollment._id}`}
                    >
                      {enrollment.progressPercent === 0 ? '▶ Start Course' : enrollment.isCompleted ? '↺ Review' : '▶ Continue'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
