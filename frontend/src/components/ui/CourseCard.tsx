import Link from 'next/link';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  progressPercent?: number;
  enrollmentId?: string;
}

const levelColors = {
  Beginner: 'badge-green',
  Intermediate: 'badge-yellow',
  Advanced: 'badge-red',
};

export default function CourseCard({ course, showProgress, progressPercent = 0, enrollmentId }: CourseCardProps) {
  return (
    <div className="card card-hover overflow-hidden flex flex-col group">
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-44">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80'}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16162A]/80 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`badge ${levelColors[course.level] || 'badge-indigo'}`}>{course.level}</span>
        </div>
        {course.price === 0 && (
          <div className="absolute top-3 right-3">
            <span className="badge badge-green">Free</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-indigo text-xs">{course.category}</span>
        </div>
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2 mb-1 group-hover:text-violet-500 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-1.5 mb-3 text-xs text-slate-500">
          <span>👨‍🏫</span>
          <span>{course.instructor}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            ⭐ <span className="text-amber-400 font-medium">{course.rating.toFixed(1)}</span>
          </span>
          <span>👥 {course.totalStudents.toLocaleString()}</span>
          {course.totalLessons && <span>📖 {course.totalLessons} lessons</span>}
        </div>

        {/* Progress bar if enrolled */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Progress</span>
              <span className="font-medium text-violet-600">{progressPercent}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            {course.price === 0 ? (
              <span className="text-emerald-400 font-bold text-lg">Free</span>
            ) : (
              <span className="text-slate-900 font-bold text-xl">₹{course.price.toLocaleString()}</span>
            )}
          </div>
          {showProgress && enrollmentId ? (
            <Link href={`/dashboard/learn/${enrollmentId}`} className="btn-primary">
              {progressPercent > 0 ? 'Continue' : 'Start'}
            </Link>
          ) : (
            <Link href={`/courses/${course._id}`} className="btn-primary">
              View Course
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
