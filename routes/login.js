const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session'); // ใช้ session ในการจัดการ session ของผู้ใช้
const router = express.Router();

router.use(express.json()); // เพิ่ม middleware นี้เพื่อตรวจสอบการรับ JSON

// ตัวอย่างข้อมูลผู้ใช้
const users = [
    { username: 'user1', email: 'user1@example.com', password: bcrypt.hashSync('password1', 10) },
    { username: 'user2', email: 'user2@example.com', password: bcrypt.hashSync('password2', 10) }
];

// GET Login Page
router.get('/', (req, res) => {
    res.render('loginPage', { error: null });
});

// POST Login
router.post('/', async (req, res) => {
    const { email, password, rememberMe } = req.body;

    // ค้นหาผู้ใช้ตามอีเมล
    const user = users.find(u => u.email === email);

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;

        // หากเลือก "Remember me"
        if (rememberMe) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // จดจำ 30 วัน
        } else {
            req.session.cookie.expires = false; // Session นี้หมดอายุเมื่อปิด browser
        }

        res.json({ success: true, message: "เข้าสู่ระบบสำเร็จ" });
    } else {
        res.json({ success: false, message: 'Invalid email or password' });
    }
});

module.exports = router;
