'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/orders').then((r) => setOrders(r.data.orders)).finally(() => setIsLoading(false));
  }, []);

  const totalRevenue = orders.filter((o) => o.paymentStatus === 'completed').reduce((s, o) => s + o.amount, 0);
  const statusColor: Record<string, string> = { completed: 'badge-green', pending: 'badge-yellow', failed: 'badge-red', refunded: 'badge-indigo' };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Orders Management</h1>
        <p className="text-slate-500 mt-1">{orders.length} total transactions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 bg-gradient-to-br from-emerald-500/20 to-transparent">
          <div className="text-2xl mb-2">💰</div>
          <div className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Total Revenue</div>
        </div>
        <div className="card p-5 bg-gradient-to-br from-violet-500/20 to-transparent">
          <div className="text-2xl mb-2">🧾</div>
          <div className="text-2xl font-black text-slate-900">{orders.length}</div>
          <div className="text-xs text-slate-500 mt-1">Total Orders</div>
        </div>
        <div className="card p-5 bg-gradient-to-br from-green-500/20 to-transparent">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-2xl font-black text-slate-900">{orders.filter((o) => o.paymentStatus === 'completed').length}</div>
          <div className="text-xs text-slate-500 mt-1">Completed</div>
        </div>
        <div className="card p-5 bg-gradient-to-br from-amber-500/20 to-transparent">
          <div className="text-2xl mb-2">⏳</div>
          <div className="text-2xl font-black text-slate-900">{orders.filter((o) => o.paymentStatus === 'pending').length}</div>
          <div className="text-xs text-slate-500 mt-1">Pending</div>
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
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Gateway</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const user = order.userId;
                  const course = order.courseId;
                  return (
                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-slate-900 font-medium">{user?.name}</p>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-[180px] truncate">{course?.title}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {order.amount === 0 ? <span className="text-emerald-400">Free</span> : `₹${order.amount.toLocaleString()}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${statusColor[order.paymentStatus] || 'badge-indigo'}`}>{order.paymentStatus}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 capitalize">{order.paymentGateway}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono max-w-[120px] truncate">
                        {order.transactionId || order.razorpayOrderId || '—'}
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
