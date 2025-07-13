const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@quizapp.com' });
    
    if (!adminUser) {
      console.log('Admin user not found!');
      return;
    }

    console.log('Admin user found:');
    console.log('ID:', adminUser._id);
    console.log('Username:', adminUser.username);
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('Created:', adminUser.createdAt);

    // Check if role is properly set
    if (adminUser.role !== 'admin') {
      console.log('⚠️  WARNING: Admin user role is not "admin"!');
      console.log('Current role:', adminUser.role);
      
      // Fix the role
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('✅ Fixed admin role');
    } else {
      console.log('✅ Admin role is correct');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking admin:', error);
    process.exit(1);
  }
};

checkAdmin(); 