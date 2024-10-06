const express = require('express');
const router = express.Router();
const News = require('../models/news');
const User = require('../models/User');

// Route สำหรับแสดงรายละเอียดข่าว
router.get('/:id', async (req, res) => {
    try {
        let loggedUser = undefined
        if (typeof res.locals.user !== 'undefined') {
            loggedUser = await User.findOne({ _id: res.locals.user.userId })
        }
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).send('ข่าวไม่พบ');
        }
        res.render('newsDetail', { title:news.title, news, loggedUser });
    } catch (err) {
        console.error(err);
        res.status(500).send('เกิดข้อผิดพลาดในการค้นหาข่าว');
    }
});

module.exports = router;