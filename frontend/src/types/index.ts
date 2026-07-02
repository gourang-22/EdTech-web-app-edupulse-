export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructor: string;
  instructorBio?: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  duration?: string;
  totalLessons?: number;
  learningOutcomes: string[];
  requirements: string[];
  tags: string[];
  rating: number;
  totalReviews: number;
  totalStudents: number;
  isPublished: boolean;
  createdBy: string | User;
  createdAt: string;
}

export interface Module {
  _id: string;
  courseId: string;
  title: string;
  order: number;
  lessons?: Lesson[];
}

export interface Resource {
  name: string;
  url: string;
  type: 'pdf' | 'video' | 'link' | 'other';
}

export interface Lesson {
  _id: string;
  moduleId: string;
  title: string;
  videoUrl: string;
  resources: Resource[];
  order: number;
  duration?: number;
  isPreview: boolean;
}

export interface Enrollment {
  _id: string;
  userId: string | User;
  courseId: string | Course;
  completedLessons: string[];
  lastWatchedLesson?: string;
  progressPercent: number;
  isCompleted: boolean;
  purchasedAt: string;
}

export interface Order {
  _id: string;
  userId: string | User;
  courseId: string | Course;
  amount: number;
  currency: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentGateway: 'razorpay' | 'free';
  razorpayOrderId?: string;
  transactionId?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  courses: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  activeEnrollments: number;
}

export interface RevenueChartData {
  _id: { month: number; year: number };
  revenue: number;
  count: number;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color?: string };
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open(): void;
  on(event: string, callback: (response: { error: { description: string } }) => void): void;
}
