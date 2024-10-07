const mongoose = require("mongoose");

// สร้าง Schema สำหรับตำรา หนังสือ และเอกสารประกอบการสอน
const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },  // ชื่อหนังสือ
    author: { type: String, required: true }, // ผู้เขียน
    description: { type: String },  // คำอธิบายเนื้อหา
    image: { type: String },  // รูปปกหนังสือ
    category: { type: String },  // หมวดหมู่
    publisher: { type: String },  // สำนักพิมพ์
    pages: { type: Number },  // จำนวนหน้า
    date: { type: Date, default: Date.now }  // วันที่เพิ่มเข้าระบบ
});

// สร้างโมเดลสำหรับตำรา หนังสือ และเอกสารประกอบการสอน
const Book = mongoose.model('Book', BookSchema);

// ส่งออกโมเดล
module.exports = Book;
