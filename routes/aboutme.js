var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project'); // เพิ่มการนำเข้า Model ของ Project

/* GET about page. */
router.get('/', async function (req, res, next) {
    let loggedUser = undefined
    if (typeof res.locals.user !== 'undefined') {
        loggedUser = await User.findOne({ _id: res.locals.user.userId })
    }
    try {
        // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const user = await User.findOne(); // ปรับเปลี่ยนตามความต้องการ
        if (!user) {
            return res.status(404).send({ message: 'ไม่พบข้อมูลผู้ใช้' });
        }

        // ดึงข้อมูลโปรเจ็กต์จากฐานข้อมูล
        const projects = await Project.find(); // หรือสามารถกรองตามเงื่อนไขที่ต้องการได้

        res.render('aboutme', { user, projects, loggedUser }); // ส่งข้อมูล user และ projects ไปยัง View
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
});

// ส่วนที่เกี่ยวข้องกับการอัปเดตผู้ใช้
router.post('/update-user/:id', async function (req, res, next) {
    try {
        const userId = req.params.id; // ดึง id ของผู้ใช้จาก URL
        const newData = req.body; // ข้อมูลใหม่ที่ส่งมาจาก Client

        // อัปเดตข้อมูลผู้ใช้
        const updatedUser = await User.updateOne(
            { _id: userId }, // ค้นหาผู้ใช้ด้วย _id
            { $set: newData } // ข้อมูลใหม่ที่ต้องการอัปเดต
        );

        if (updatedUser.modifiedCount > 0) {
            res.status(200).send({ message: 'อัปเดตข้อมูลสำเร็จ' });
        } else {
            res.status(404).send({ message: 'ไม่พบผู้ใช้หรือไม่มีการอัปเดตข้อมูล' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    }
});

module.exports = router;
