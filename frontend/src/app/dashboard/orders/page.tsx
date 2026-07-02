'use client';
import { useEffect, useState } from 'react';
import { Order } from '@/types';
import api from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders').then((r) => setOrders(r.data.orders)).finally(() => setIsLoading(false));
  }, []);

  const statusColor = { completed: 'badge-green', pending: 'badge-yellow', failed: 'badge-red', refunded: 'badge-indigo' };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Order History</h1>
        <p className="text-slate-500 mt-1 whitespace-nowrap">{orders.length} total transaction{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
      ) : orders.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-5xl mb-4">🧾</p>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-500 mb-6">Your purchase history will appear here.</p>
          <a href="/courses" className="btn-primary px-8">Browse Courses</a>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-100">
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const course = order.courseId as any;
                  return (
                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {course.thumbnail && (
                            <img src={course.thumbnail} alt={course.title} className="w-10 h-8 object-cover rounded-lg flex-shrink-0" />
                          )}
                          <span className="text-sm text-slate-900 font-medium line-clamp-1">{course.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {order.amount === 0 ? <span className="text-emerald-400">Free</span> : `₹${order.amount.toLocaleString()}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${statusColor[order.paymentStatus] || 'badge-indigo'}`}>{order.paymentStatus}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 capitalize">{order.paymentGateway}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono">{order.transactionId || order.razorpayOrderId || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
