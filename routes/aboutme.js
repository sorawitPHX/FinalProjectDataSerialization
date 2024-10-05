// routes/about.js
var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET about page. */
router.get('/', async function (req, res, next) {
    // สามารถดึงข้อมูลผู้ใช้จากฐานข้อมูลถ้าจำเป็น
    const user = await User.findOne(); // แก้ไขตามความจำเป็น
    res.render('aboutme', { user }); // ส่งข้อมูล user ไปยัง View
});
module.exports = router;
