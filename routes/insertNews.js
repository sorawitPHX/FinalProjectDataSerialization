var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const News = require('../models/news')

router.use(express.static('public'));

const storage = multer.diskStorage({
    destination: './public/uploads/news/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('image'); // รับเฉพาะไฟล์เดียวจากฟิลด์ 'image'

router.get('/', async function (req, res, next) {
    try {
        const status = req.query.status;
        const msg = req.query.msg;

        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const startIndex = (page - 1) * limit;

        const newsList = await News.find()
            .sort({ date: -1 })
            .skip(startIndex)
            .limit(limit);

        const totalNews = await News.countDocuments();
        const totalPages = Math.ceil(totalNews / limit);

        // ส่งข้อมูลไปยัง view
        res.render('insertNews', {
            title: 'เพิ่มข่าวสาร',
            activePage: 'insertNews',
            status,
            msg,
            newsList,
            currentPage: page,
            totalPages
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
});

router.post('/insert', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send({ err });
        } else {
            let imagePath = req.file ? `uploads/news/${req.file.filename}` : `img/no_image.jpg`;

            let postNews = new News({
                title: req.body.title,
                content: req.body.content,
                image: imagePath
            });
            // เพิ่มการแสดงค่า postNews ก่อนบันทึก
            console.log('Post to save:', postNews);

            postNews.save()
                .then(() => {
                    let [res_status, res_msg] = ['success', 'Inserted New']
                    res.redirect(`/insertNews?status=${res_status}&msg=${res_msg}`)
                }).catch((err) => {
                    let [res_status, res_msg] = ['error', err]
                    res.redirect(`/insertNews?status=${res_status}&msg=${res_msg}`)
                })
        }
    });
});

// router.post('/updateNews/:id', async (req, res) => {
//     const newsId = req.params.id;
//     const { news_title, news_content, news_image } = req.body;

//     try {
//         // อัปเดตข้อมูลข่าวสารในฐานข้อมูล
//         await News.findByIdAndUpdate(newsId, {
//             title: news_title,
//             content: news_content,
//             image: news_image
//         });
//         let [res_status, res_msg] = ['success', 'Inserted New']
//         res.redirect(`/insertNews?status=${res_status}&msg=${res_msg}`)
//     } catch (err) {
//         let [res_status, res_msg] = ['error', err]
//         res.redirect(`/insertNews?status=${res_status}&msg=${res_msg}`)
//     }
// });






module.exports = router;
