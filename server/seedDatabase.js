const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const GhostCard = require('./models/GhostCard');
require('dotenv').config();

const users = [
  { username: 'alexdev', email: 'alex@example.com', profilepic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
  { username: 'sarahcode', email: 'sarah@example.com', profilepic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
  { username: 'mikejs', email: 'mike@example.com', profilepic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
  { username: 'emmatech', email: 'emma@example.com', profilepic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
  { username: 'davidweb', email: 'david@example.com', profilepic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
  { username: 'lisaui', email: 'lisa@example.com', profilepic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' },
  { username: 'tomfull', email: 'tom@example.com', profilepic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
  { username: 'annapy', email: 'anna@example.com', profilepic: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face' },
  { username: 'jakenode', email: 'jake@example.com', profilepic: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face' }
];

const projectTemplates = [
  { title: 'E-commerce Platform', description: 'Full-stack online store with payment integration', type: 'Web App', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop' },
  { title: 'Task Management App', description: 'Productivity app with team collaboration features', type: 'Mobile App', image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop' },
  { title: 'Weather Dashboard', description: 'Real-time weather data visualization', type: 'Web App', image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=300&fit=crop' },
  { title: 'Chat Application', description: 'Real-time messaging with WebSocket', type: 'Web App', image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&h=300&fit=crop' },
  { title: 'Portfolio Website', description: 'Personal portfolio with animations', type: 'Website', image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop' },
  { title: 'Recipe Finder', description: 'Search and save favorite recipes', type: 'Mobile App', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' },
  { title: 'Expense Tracker', description: 'Personal finance management tool', type: 'Web App', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop' },
  { title: 'Music Player', description: 'Streaming music player with playlists', type: 'Desktop App', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop' },
  { title: 'Blog Platform', description: 'Content management system for bloggers', type: 'Web App', image: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=400&h=300&fit=crop' },
  { title: 'Fitness Tracker', description: 'Workout logging and progress tracking', type: 'Mobile App', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
  { title: 'Social Media Dashboard', description: 'Analytics for multiple social platforms', type: 'Web App', image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop' },
  { title: 'Learning Management System', description: 'Online course platform with video streaming', type: 'Web App', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop' },
  { title: 'Inventory Management', description: 'Stock tracking for small businesses', type: 'Desktop App', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop' },
  { title: 'Event Booking System', description: 'Ticket booking and event management', type: 'Web App', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop' },
  { title: 'Photo Gallery', description: 'Image sharing with filters and effects', type: 'Mobile App', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop' },
  { title: 'Code Editor', description: 'Lightweight IDE with syntax highlighting', type: 'Desktop App', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop' },
  { title: 'Travel Planner', description: 'Trip planning with budget tracking', type: 'Mobile App', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop' },
  { title: 'CRM System', description: 'Customer relationship management tool', type: 'Web App', image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop' },
  { title: 'Game Engine', description: '2D game development framework', type: 'Library', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop' },
  { title: 'API Gateway', description: 'Microservices routing and authentication', type: 'Backend', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop' }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await GhostCard.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
    }
    console.log('Created 9 users');

    // Create projects
    let projectCount = 0;
    for (let i = 0; i < 20; i++) {
      const template = projectTemplates[i];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      await GhostCard.create({
        title: template.title,
        description: template.description,
        type: template.type,
        image: template.image,
        creatorId: randomUser._id,
        status: Math.random() > 0.3 ? 'buried' : 'revived',
        revivedBy: Math.random() > 0.5 ? createdUsers[Math.floor(Math.random() * createdUsers.length)]._id : null
      });
      projectCount++;
    }
    console.log(`Created ${projectCount} projects`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();