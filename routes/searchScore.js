var express = require('express');
var router = express.Router();
const User = require('../models/User')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let loggedUser = undefined
  if (typeof res.locals.user !== 'undefined') {
    loggedUser = await User.findOne({ _id: res.locals.user.userId })
  }
  res.render('searchScore', { title:'ตรวจสอบคะแนน',activePage: 'searchScore', loggedUser });
});


module.exports = router;
