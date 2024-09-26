const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const router = express.Router();

const users = [
    { username: 'user1', email: 'user1@example.com', password: bcrypt.hashSync('password1', 10) },
    { username: 'user2', email: 'user2@example.com', password: bcrypt.hashSync('password2', 10) }
];

// Function to send reset password email
const sendResetPasswordEmail = (email, resetToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Password',
        text: `Click the following link to reset your password: http://localhost:3000/login/reset-password/${resetToken}`
    };

    return transporter.sendMail(mailOptions);
};

// POST login
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid email or password' });
    }
});

// POST forgot password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);

    if (user) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        try {
            await sendResetPasswordEmail(user.email, resetToken);
            res.render('login', { message: 'Reset password link sent to your email.' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.render('forgot-password', { error: 'Failed to send reset link. Please try again later.' });
        }
    } else {
        res.render('forgot-password', { error: 'Email not found.' });
    }
});

module.exports = router;
