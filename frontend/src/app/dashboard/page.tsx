'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Enrollment, Order } from '@/types';
import api from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/enrollments/my-courses'), api.get('/orders/my-orders')])
      .then(([envRes, ordRes]) => {
        setEnrollments(envRes.data.enrollments);
        setRecentOrders(ordRes.data.orders.slice(0, 3));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const inProgress = enrollments.filter((e) => e.progressPercent > 0 && !e.isCompleted);
  const completed = enrollments.filter((e) => e.isCompleted);

  const statCards = [
    { label: 'Enrolled Courses', value: enrollments.length, icon: '📚', color: 'from-violet-500/20 to-indigo-500/5' },
    { label: 'In Progress', value: inProgress.length, icon: '▶️', color: 'from-amber-500/20 to-amber-500/5' },
    { label: 'Completed', value: completed.length, icon: '🏆', color: 'from-emerald-500/20 to-emerald-500/5' },
    { label: 'Total Spent', value: `₹${recentOrders.filter(o => o.paymentStatus === 'completed').reduce((s, o) => s + o.amount, 0).toLocaleString()}`, icon: '💳', color: 'from-purple-500/20 to-purple-500/5' },
  ];

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-64" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900">
          Welcome back, {user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-500 mt-1">Track your learning progress and continue where you left off.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className={`card p-5 bg-gradient-to-br ${stat.color}`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-black text-slate-900 truncate">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1 truncate">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
            <Link href="/dashboard/my-courses" className="text-sm text-violet-600 hover:text-violet-500">View all →</Link>
          </div>
          {inProgress.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-3xl mb-3">📖</p>
              <h3 className="font-semibold text-slate-900 mb-2">No courses in progress</h3>
              <p className="text-slate-500 text-sm mb-4">Enroll in a course to start learning!</p>
              <Link href="/courses" className="btn-primary text-sm px-6">Browse Courses</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {inProgress.slice(0, 3).map((enrollment) => {
                const course = enrollment.courseId as any;
                return (
                  <div key={enrollment._id} className="card p-4 flex items-center gap-4 card-hover">
                    <img src={course.thumbnail} alt={course.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm truncate">{course.title}</h3>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Progress</span><span className="text-violet-600">{enrollment.progressPercent}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${enrollment.progressPercent}%` }} />
                        </div>
                      </div>
                    </div>
                    <Link href={`/dashboard/learn/${enrollment._id}`} className="btn-primary text-xs py-2 px-4 flex-shrink-0">Continue</Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-2xl mb-2">🧾</p>
              <p className="text-slate-500 text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const course = order.courseId as any;
                return (
                  <div key={order._id} className="card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900 truncate">{course.title}</p>
                      <span className={`badge text-xs flex-shrink-0 ${order.paymentStatus === 'completed' ? 'badge-green' : 'badge-yellow'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">₹{order.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                );
              })}
              <Link href="/dashboard/orders" className="block text-center text-sm text-violet-600 hover:text-violet-500 py-2">View all orders →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
