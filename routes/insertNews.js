var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('insertNews', { title: 'เพิ่มข่าวสาร', activePage: 'insertNews' });
});

module.exports = router;
