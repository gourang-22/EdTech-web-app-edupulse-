'use client';
import { useEffect, useState, useRef } from 'react';
import { AdminStats, RevenueChartData, Order } from '@/types';
import api from '@/lib/api';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    api.get('/admin/stats').then((r) => {
      setStats(r.data.stats);
      setRevenueChart(r.data.revenueChart);
      setRecentOrders(r.data.recentOrders);
    }).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!chartRef.current || revenueChart.length === 0) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const labels = revenueChart.map((d) => `${MONTH_NAMES[d._id.month - 1]} ${d._id.year}`);
    const data = revenueChart.map((d) => d.revenue);
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Revenue (₹)',
          data,
          backgroundColor: 'rgba(99,102,241,0.6)',
          borderColor: '#6366F1',
          borderWidth: 2,
          borderRadius: 8,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#16162A', titleColor: '#fff', bodyColor: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1 } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } } },
        },
      },
    });
    return () => { chartInstance.current?.destroy(); };
  }, [revenueChart]);

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: '👥', color: 'from-blue-500/20' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'from-emerald-500/20' },
    { label: 'Total Courses', value: stats.totalCourses.toLocaleString(), icon: '📚', color: 'from-violet-500/20' },
    { label: 'Active Enrollments', value: stats.activeEnrollments.toLocaleString(), icon: '🎓', color: 'from-purple-500/20' },
  ] : [];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform overview and analytics</p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28" />)}</div>
          <div className="skeleton h-72" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className={`card p-5 bg-gradient-to-br ${stat.color} to-transparent`}>
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Revenue — Last 6 Months</h2>
            {revenueChart.length > 0 ? (
              <canvas ref={chartRef} className="max-h-64" />
            ) : (
              <div className="text-center text-slate-400 py-12 text-sm">No revenue data yet.</div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-100">
                  <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => {
                    const user = order.userId as any;
                    const course = order.courseId as any;
                    return (
                      <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-slate-900 font-medium">{user?.name}</p>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{course?.title}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{order.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`badge ${order.paymentStatus === 'completed' ? 'badge-green' : 'badge-yellow'}`}>{order.paymentStatus}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
