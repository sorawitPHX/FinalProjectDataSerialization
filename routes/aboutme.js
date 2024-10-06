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


router.get('/insert', async function (req, res, next) {
    const sampleUserData = {
        email: "ngamnij" + "@kku.ac.th",
        password: "ngamnijpassword123", // ในการใช้งานจริงควรใช้การเข้ารหัส password ด้วย bcrypt
        prefix_th: "รศ.ดร.",
        firstname_th: "งามนิจ",
        lastname_th: "อาจอินทร์",
        description_th: "รศ.ดร. งามนิจ อาจอินทร์ ได้รับปริญญาเอกในสาขาวิทยาการคอมพิวเตอร์จากจุฬาลงกรณ์มหาวิทยาลัย หลังจากสำเร็จการศึกษาปริญญาโทด้านสถิติประยุกต์จากสถาบันบัณฑิตพัฒนบริหารศาสตร์และปริญญาตรีด้านสถิติจากมหาวิทยาลัยเกษตรศาสตร์ ตั้งแต่ปี 2531 ถึงปัจจุบันเขาทำงานในตำแหน่งรองศาสตราจารย์ มีความเชี่ยวชาญในด้าน Semantic Web และ OntologyEngineering รวมถึงการบูรณาการข้อมูลที่อิงตามออนโทโลยีและการวิเคราะห์ความรู้สึกเชิงบริบทเขามีผลงานวิจัยที่เกี่ยวข้องกับการพัฒนาและการประยุกต์ใช้เทคโนโลยีที่เกี่ยวข้องกับข้อมูลเชิงความหมายในหลากหลายสาขาเช่น การประยุกต์ใช้ในการวิเคราะห์ข้อมูลและการประสานข้อมูลจากแหล่งต่าง ๆ",
        prefix_en: "Assoc. Prof. Dr.",
        firstname_en: "Ngamnit",
        lastname_en: "Atjin",
        description_en: "Associate Professor Dr. Ngamnij Aajin holds a Ph.D. in Computer Science from Chulalongkorn University. She completed her Master's degree in Applied Statistics from the National Institute of Development Administration and her Bachelor's degree in Statistics from Kasetsart University. Since 1988, she has been working as an Associate Professor, specializing in Semantic Web and Ontology Engineering, as well as ontology-based data integration and contextual sentiment analysis. She has conducted research related to the development and application of technologies concerning semantic data across various fields, such as data analysis and data integration from different sources.",
        role: 'Associate Professor Dr.',
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
        ],
        expertise: "ความเชี่ยวชาญ",
        expertIns: [
            "Semantic Web and Ontology Engineering",
            "Ontology-based Data Integration",
            "Semantic Sentiment Analysis"
        ],
    };

    let newUser = new User(sampleUserData);
    await newUser.save();
    res.status(200).send(newUser);
});

module.exports = router;
