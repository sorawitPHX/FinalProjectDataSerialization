const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); 

// ฟังก์ชันที่ใช้สร้าง Token
function generateToken(user) {
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

router.get('/', (req, res)=>{
    res.send(req.cookies)
})

router.get('/login', (req, res) => {
    res.render('loginPage', {title: 'เข้าสู่ระบบ'});
});

router.get('/register', (req, res) => {
    res.render('loginPage');
});

// Signup route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send('Error registering user');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send({error: 'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send({error: 'Wrong Password'});

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true }); // ส่ง token กลับมาเป็น cookie
        res.json({ token });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/')
});

router.get('/test', authenticateToken, (req, res) => {
    res.send(res.locals.user)
    res.send(`Hello ${res.locals.user   }, welcome to the protected route!`);
});

module.exports = router;
