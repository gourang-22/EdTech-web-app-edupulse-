# EduPulse - Full-Stack EdTech Platform

A production-ready full-stack educational platform built with Next.js 15, React, Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with Role-Based Access Control (Student vs Admin).
- **Course Management**: Admins can create, edit, and publish courses, modules, and lessons.
- **Video Playback**: Custom video player with progress tracking and YouTube embed support.
- **Payments**: Integrated Razorpay checkout for purchasing courses.
- **Progress Tracking**: Tracks student progress through courses and lessons.
- **Admin Dashboard**: Comprehensive analytics, revenue charts, and management tools.
- **Responsive Design**: Premium dark-themed UI built with Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Zustand, Chart.js.
- **Backend**: Node.js, Express.js, TypeScript, MongoDB Atlas (Mongoose).
- **Storage & Media**: Cloudinary (for thumbnails and video uploads).
- **Payments**: Razorpay.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay account

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (use legacy peer deps due to multer-storage-cloudinary):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Fill in the required environment variables in `backend/.env`.
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
4. Update the `NEXT_PUBLIC_RAZORPAY_KEY_ID` in `frontend/.env.local`.
5. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Development

- The backend API runs on `http://localhost:5000` by default.
- The frontend app runs on `http://localhost:3000` by default.

## Admin Access
To access the admin panel, register a new user, then manually update their role to `admin` in your MongoDB database.
