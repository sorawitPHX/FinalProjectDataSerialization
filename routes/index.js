var express = require('express');
var router = express.Router();
var News = require('../models/news');

router.get('/', async function(req, res, next) {
  try {
    const newsList = await News.aggregate([{ $sample: { size: 3 } }]);

    // ส่งข้อมูลไปยัง View
    res.render('index', { 
      title: 'Ngamnij Arch-int', 
      activePage: 'index', 
      newsList // ส่งข่าวสารไปที่ view
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching news");
  }
});

module.exports = router;
