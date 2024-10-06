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
        const search = req.query.search || '';
        const searchOptions = search
        
            ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } }, // ค้นหาแบบไม่สนใจตัวพิมพ์ใหญ่เล็ก
                    { content: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const startIndex = (page - 1) * limit;

        const newsList = await News.find(searchOptions)
            .sort({ date: -1 })
            .skip(startIndex)
            .limit(limit);

        const totalNews = await News.countDocuments(searchOptions);
        const totalPages = Math.ceil(totalNews / limit);

        // ส่งข้อมูลไปยัง view รวมถึงคำค้นหา
        res.render('insertNews', {
            title: 'เพิ่มข่าวสาร',
            activePage: 'insertNews',
            status,
            msg,
            search,
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

router.get('/delete/:id', async (req, res) => {
    try {
        const deletedNews = await News.findByIdAndDelete(req.params.id);
        if (!deletedNews) {
            return res.status(404).send('News not found');
        }
        res.redirect('/insertNews')
        // res.status(200).send('Project deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting the news');
    }
});

router.post('/updateNews', async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).send({ err })
        } else {
            let path = ''
            if (req.file == undefined) {
                if (req.body.News_img_path) {
                    path = req.body.News_img_path
                } else {
                    res.status(400).send({ msg: 'No any img path' })
                }
            } else {
                path = `uploads/news/${req.file.filename}`
            }
            try {
                const updatedNews = await News.findByIdAndUpdate(
                    req.body.id,
                    {
                        title: req.body.new_title,
                        content: req.body.new_content,
                        image: path,
                    },
                    { new: true } // Return the updated document
                );

                if (!updatedNews) {
                    return res.status(404).send('News not found');
                }
                res.redirect('/insertNews');
            } catch (err) {
                console.error(err);
                res.status(500).send('Error updating the News');
            }
        }
    })
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
