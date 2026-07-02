import { create } from 'zustand';
import { Course } from '@/types';
import api from '@/lib/api';

interface CourseState {
  courses: Course[];
  featuredCourses: Course[];
  isLoading: boolean;
  isFeaturedLoading: boolean;
  pagination: { page: number; limit: number; total: number; pages: number } | null;
  fetchCourses: (params?: { search?: string; category?: string; level?: string; page?: number }) => Promise<void>;
  fetchFeatured: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  featuredCourses: [],
  isLoading: false,
  isFeaturedLoading: true,
  pagination: null,

  fetchCourses: async (params = {}) => {
    set({ isLoading: true });
    try {
      const res = await api.get('/courses', { params });
      set({ courses: res.data.courses, pagination: res.data.pagination, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchFeatured: async () => {
    set({ isFeaturedLoading: true });
    try {
      const res = await api.get('/courses', { params: { limit: 6 } });
      set({ featuredCourses: res.data.courses, isFeaturedLoading: false });
    } catch {
      set({ isFeaturedLoading: false });
    }
  },
}));
