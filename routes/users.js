var express = require('express');
var router = express.Router();
const User = require('../models/User')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/insert', async function (req, res, next) {
  const sampleUserData = {
    email: "john.doe" + Math.floor(Math.random() * 100) + "@example.com",
    password: "hashedpassword123", // ในการใช้งานจริงควรใช้การเข้ารหัส password ด้วย bcrypt
    prefix_th: "นาย",
    firstname_th: "จอห์น",
    lastname_th: "โด",
    description_th: "ผู้เชี่ยวชาญด้านซอฟต์แวร์และระบบสารสนเทศ",
    prefix_en: "Mr.",
    firstname_en: "John",
    lastname_en: "Doe",
    description_en: "Software and Information Systems Expert",
    rewards: [
      "Best Paper Award at IMECS 2019",
      "Excellence in Research Award 2021"
    ],
    educations: [
      {
        level: "ปริญญาเอก",
        degree: "วศ.ด. (วิศวกรรมคอมพิวเตอร์)",
        institution: "จุฬาลงกรณ์มหาวิทยาลัย",
        graduationYear: 2562
      },
      {
        level: "ปริญญาโท",
        degree: "วท.ม. (วิศวกรรมซอฟต์แวร์)",
        institution: "จุฬาลงกรณ์มหาวิทยาลัย",
        graduationYear: 2554
      },
      {
        level: "ปริญญาตรี",
        degree: "วท.บ. (ระบบสารสนเทศคอมพิวเตอร์)",
        institution: "มหาวิทยาลัยบูรพา",
        graduationYear: 2551
      }
    ],
    experiences: [
      {
        startYear: 2565,
        endYear: null, // ปัจจุบัน
        position: "ผู้ช่วยศาสตราจารย์",
        institution: "วิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น"
      },
      {
        startYear: 2564,
        endYear: 2565,
        position: "อาจารย์",
        institution: "วิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น"
      },
      {
        startYear: 2562,
        endYear: 2565,
        position: "นักวิจัยหลังปริญญาเอก",
        institution: "คณะวิศวกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย"
      }
    ]
  };

  let newUser = new User(sampleUserData)
  await newUser.save()
  res.status(200).send(newUser)
})
module.exports = router;
