// db.js
const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async () => {
  try {
    // uvQtjHLU4p3vWbUb
    // แทนที่ <username>, <password>, และ <cluster-url> ด้วยค่าจริงของคุณ
    const connect_url = process.env.MONGODB_ATLAS
    await mongoose.connect(connect_url, {});
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
