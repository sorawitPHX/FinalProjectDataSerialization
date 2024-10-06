// middleware.js
const jwt = require('jsonwebtoken');

// Middleware ตรวจสอบการยืนยันตัวตน
const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken; // หรือ req.headers.authorization

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                // ลบ token ที่หมดอายุจาก cookies
                console.log(err)
                res.clearCookie('authToken'); 
                return res.redirect('/'); // Forbidden
            }
            // if (err) return res.redirect('/auth/logout'); // Forbidden
            res.locals.user = user; // เก็บข้อมูลผู้ใช้
            paths = ['/auth/login/', '/auth/login', 'auth/register', 'auth/register/']
            if(paths.includes(req.path)) {
                return res.redirect('/')
            }
            next();
        });
    } else {
        // ถ้าไม่พบ token ให้ redirect ไปยังหน้า login
        paths = ['/insertNews/', '/insertNews']
        if ( paths.includes(req.path) && (req.method === 'GET' || req.method === 'POST')) {
            return res.redirect('/auth/login');
        }
        next();
    }
};

module.exports = authenticateToken;
