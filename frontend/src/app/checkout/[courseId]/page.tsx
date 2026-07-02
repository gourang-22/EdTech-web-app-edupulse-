'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Course } from '@/types';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    api.get(`/courses/${courseId}`).then((r) => setCourse(r.data.course)).finally(() => setIsLoading(false));
  }, [courseId, isAuthenticated, router]);

  const handlePayment = async () => {
    if (!course || !user) return;
    setIsPaying(true);
    try {
      const orderRes = await api.post('/orders/create', { courseId });
      if (orderRes.data.free) {
        toast.success('Enrolled for free! 🎉');
        router.push('/dashboard/my-courses');
        return;
      }
      
      const { order, razorpayOrder } = orderRes.data;
      
      // Simulate mock payment verification
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s artificial delay
      
      await api.post('/orders/verify', {
        razorpayOrderId: razorpayOrder.id,
        razorpayPaymentId: `mock_pay_${Date.now()}`,
        orderId: order._id,
      });
      
      toast.success('Mock payment successful! Welcome to the course 🎉');
      router.push('/dashboard/my-courses');
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment failed. Try again.');
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) return <div className="min-h-screen hero-bg flex items-center justify-center"><div className="skeleton w-96 h-64" /></div>;
  if (!course) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen hero-bg dot-grid pt-28 px-4">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-3xl font-black mb-8">Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-5 text-slate-900">Order Summary</h2>
              <div className="flex gap-4 mb-6">
                <img src={course.thumbnail} alt={course.title} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{course.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{course.instructor} • {course.level}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-400">
                    {'★'.repeat(Math.round(course.rating))} <span className="text-slate-500">{course.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Original Price</span><span>₹{course.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Discount</span><span className="text-emerald-400">—</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-100 pt-3 text-lg">
                  <span>Total</span><span>₹{course.price.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                <span>🛡</span> 30-day money-back guarantee
              </div>
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-5 text-slate-900">Payment Details</h2>
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6">
                <div className="flex items-center gap-2 text-sm text-violet-500 mb-1">
                  <span>💳</span> Secure payment via Mock Gateway
                </div>
                <p className="text-xs text-slate-500">All major cards, UPI, net banking & wallets accepted.</p>
              </div>
              <div className="space-y-3 text-sm text-slate-500 mb-6">
                <div className="flex items-center gap-2"><span>✓</span> Secure 256-bit SSL encryption</div>
                <div className="flex items-center gap-2"><span>✓</span> Instant access after payment</div>
                <div className="flex items-center gap-2"><span>✓</span> Lifetime access included</div>
              </div>
              <button
                onClick={handlePayment}
                disabled={isPaying}
                className="w-full btn-primary py-4 text-lg font-bold"
                id="pay-now-btn"
              >
                {isPaying ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing...
                  </span>
                ) : `Pay ₹${course.price.toLocaleString()}`}
              </button>
              <button onClick={() => router.back()} className="w-full btn-ghost text-center mt-3 text-sm">← Go Back</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
