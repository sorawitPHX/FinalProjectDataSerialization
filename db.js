// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // uvQtjHLU4p3vWbUb
    // แทนที่ <username>, <password>, และ <cluster-url> ด้วยค่าจริงของคุณ
    await mongoose.connect('mongodb+srv://sorawitph:uvQtjHLU4p3vWbUb@cluster0.4bxhovs.mongodb.net/ngamnitDB', {});
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
