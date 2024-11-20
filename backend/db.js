const mongoose = require('mongoose');

// MongoDB connection URI
const uri = 'mongodb+srv://ratnawatmanish031:phnMNTB42uYQtKqW@cluster0.4h889.mongodb.net/tinnytones?retryWrites=true&w=majority&appName=Cluster0';

// Connection function
const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectDB;
