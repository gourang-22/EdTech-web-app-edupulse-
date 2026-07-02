import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';
import Module from '../models/Module';
import Lesson from '../models/Lesson';
import User from '../models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edupulse';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing dummy data if any
    await Course.deleteMany({ title: { $in: [
      'Full-Stack Web Development Bootcamp',
      'Introduction to UI/UX Design',
      'Advanced Data Science with Python'
    ] } });
    console.log('Cleared old dummy courses');

    // Create a dummy admin user if none exists
    let admin = await User.findOne({ email: 'admin@edupulse.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@edupulse.com',
        password: 'password123', // In a real app this should be hashed, but it's just for reference
        role: 'admin',
        isVerified: true
      });
      console.log('Created dummy admin user');
    }

    const videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const thumbnailUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80';
    const thumbnailDesignUrl = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80';
    const thumbnailDataUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80';

    const coursesData = [
      {
        title: 'Full-Stack Web Development Bootcamp',
        description: 'Master React, Node.js, Express, and MongoDB. Build production-ready web applications from scratch.',
        price: 4999,
        thumbnail: thumbnailUrl,
        instructor: 'Sarah Jenkins',
        category: 'Web Development',
        level: 'Intermediate',
        language: 'English',
        duration: '40 hours',
        totalLessons: 3,
        learningOutcomes: ['Build full-stack React apps', 'Master MongoDB', 'Deploy to AWS'],
        requirements: ['Basic HTML/CSS knowledge', 'JavaScript fundamentals'],
        tags: ['React', 'Node.js', 'Web Dev'],
        rating: 4.8,
        totalReviews: 124,
        totalStudents: 4500,
        isPublished: true,
        createdBy: admin._id,
      },
      {
        title: 'Introduction to UI/UX Design',
        description: 'Learn the principles of beautiful and functional design using Figma.',
        price: 0,
        thumbnail: thumbnailDesignUrl,
        instructor: 'Alex Rivera',
        category: 'Design',
        level: 'Beginner',
        language: 'English',
        duration: '12 hours',
        totalLessons: 2,
        learningOutcomes: ['Master Figma', 'Understand color theory', 'Create wireframes'],
        requirements: ['No prior experience required'],
        tags: ['Figma', 'UI/UX', 'Design'],
        rating: 4.9,
        totalReviews: 312,
        totalStudents: 8200,
        isPublished: true,
        createdBy: admin._id,
      },
      {
        title: 'Advanced Data Science with Python',
        description: 'Dive deep into machine learning, pandas, and neural networks.',
        price: 3499,
        thumbnail: thumbnailDataUrl,
        instructor: 'Dr. Emily Chen',
        category: 'Data Science',
        level: 'Advanced',
        language: 'English',
        duration: '25 hours',
        totalLessons: 2,
        learningOutcomes: ['Train ML models', 'Analyze big data', 'Deep learning basics'],
        requirements: ['Python proficiency', 'Basic statistics'],
        tags: ['Python', 'Machine Learning', 'Data Science'],
        rating: 4.7,
        totalReviews: 89,
        totalStudents: 1200,
        isPublished: true,
        createdBy: admin._id,
      }
    ];

    for (const data of coursesData) {
      const course = await Course.create(data);
      console.log(`Created course: ${course.title}`);

      // Create Module 1
      const module1 = await Module.create({
        courseId: course._id,
        title: 'Module 1: Introduction',
        order: 1
      });

      await Lesson.create({
        moduleId: module1._id,
        title: 'Lesson 1: Getting Started',
        videoUrl,
        order: 1,
        duration: 596, // seconds (Big Buck Bunny length)
        isPreview: true,
        resources: [
          { name: 'Course Slides', url: '#', type: 'pdf' }
        ]
      });

      await Lesson.create({
        moduleId: module1._id,
        title: 'Lesson 2: Core Concepts',
        videoUrl,
        order: 2,
        duration: 596,
        isPreview: false,
        resources: []
      });

      // For the web dev course, add an extra module
      if (course.title.includes('Web')) {
        const module2 = await Module.create({
          courseId: course._id,
          title: 'Module 2: Advanced Topics',
          order: 2
        });

        await Lesson.create({
          moduleId: module2._id,
          title: 'Lesson 3: Putting it together',
          videoUrl,
          order: 1,
          duration: 596,
          isPreview: false,
          resources: []
        });
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
