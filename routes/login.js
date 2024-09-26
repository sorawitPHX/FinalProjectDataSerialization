const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const router = express.Router();

// ตัวอย่างข้อมูลผู้ใช้ที่มีการเก็บ password เป็น hash ด้วย bcrypt
const users = [
    { username: 'user1', email: 'user1@example.com', password: bcrypt.hashSync('password1', 10) },
    { username: 'user2', email: 'user2@example.com', password: bcrypt.hashSync('password2', 10) }
];

// ฟังก์ชันส่งอีเมลสำหรับรีเซ็ตรหัสผ่าน
const sendResetPasswordEmail = (email, resetToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // ใช้ Gmail สำหรับส่งอีเมล
        auth: {
            user: process.env.EMAIL_USER, // ดึงข้อมูลอีเมลจาก environment variable
            pass: process.env.EMAIL_PASS // ดึงรหัสผ่านจาก environment variable
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // ผู้ส่งอีเมล
        to: email, // ส่งถึงอีเมลที่ระบุ
        subject: 'Reset Password', // หัวข้ออีเมล
        text: `Click the following link to reset your password: http://localhost:3000/login/reset-password/${resetToken}` // เนื้อหาในอีเมล
    };

    return transporter.sendMail(mailOptions); // ส่งอีเมล
};

// POST login route
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    // ค้นหาผู้ใช้จากอีเมล
    const user = users.find(u => u.email === email);

    // ตรวจสอบรหัสผ่านโดยใช้ bcrypt เปรียบเทียบ hash
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user; // เก็บข้อมูลผู้ใช้ใน session
        res.redirect('/dashboard'); // ถ้าสำเร็จให้ไปที่หน้าหลักของระบบ
    } else {
        res.render('login', { error: 'Invalid email or password' }); // ถ้าล็อกอินไม่สำเร็จ ให้แจ้งเตือน
    }
});

// POST forgot password route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // ค้นหาผู้ใช้จากอีเมล
    const user = users.find(u => u.email === email);

    if (user) {
        const resetToken = crypto.randomBytes(32).toString('hex'); // สร้างโทเค็นสำหรับรีเซ็ตรหัสผ่าน
        try {
            await sendResetPasswordEmail(user.email, resetToken); // เรียกใช้ฟังก์ชันส่งอีเมล
            res.render('login', { message: 'Reset password link sent to your email.' }); // แจ้งเตือนว่าลิงค์รีเซ็ตรหัสผ่านถูกส่งแล้ว
        } catch (error) {
            console.error('Error sending email:', error); // ถ้ามีปัญหาการส่งอีเมล ให้แสดงข้อผิดพลาดใน console
            res.render('forgot-password', { error: 'Failed to send reset link. Please try again later.' }); // แจ้งเตือนว่าล้มเหลวในการส่งอีเมล
        }
    } else {
        res.render('forgot-password', { error: 'Email not found.' }); // ถ้าไม่พบอีเมลในระบบ ให้แจ้งเตือน
    }
});

module.exports = router;
