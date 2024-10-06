const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');

// GET about page
router.get('/', async function (req, res, next) {
    let loggedUser = undefined
    if (typeof res.locals.user !== 'undefined') {
        loggedUser = await User.findOne({ _id: res.locals.user.userId })
    }
    try {
        const user = await User.findOne(); // ดึงข้อมูลผู้ใช้
        if (!user) {
            return res.status(404).send({ message: 'ไม่พบข้อมูลผู้ใช้' });
        }

        // ดึงข้อมูลโปรเจ็กต์จากฐานข้อมูล
        const projects = await Project.find(); // หรือสามารถกรองตามเงื่อนไขที่ต้องการได้

        res.render('aboutme', { title:'เกี่ยวกับเรา',activePage: 'aboutme', user, projects, loggedUser }); // ส่งข้อมูล user และ projects ไปยัง View
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
});

// Route สำหรับการอัปเดตผู้ใช้
router.post('/update-user/:id', async function (req, res, next) {
    try {
        const userId = req.params.id;
        const newData = req.body;

        // อัปเดตข้อมูลผู้ใช้
        const updatedUser = await User.updateOne(
            { _id: userId },
            { $set: newData }
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

// Route สำหรับการลบข้อมูล
router.delete('/delete-item/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { type, index } = req.body; // รับ type และ index จาก body

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้' });
        }

        if (type === 'expertIns') {
            user.expertIns.splice(index, 1); // ลบข้อมูลใน expertIns
        } else if (type === 'rewards') {
            user.rewards.splice(index, 1); // ลบข้อมูลใน rewards
        } else {
            return res.status(400).json({ success: false, message: 'Invalid type' });
        }

        await user.save(); // บันทึกการเปลี่ยนแปลง
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/update-education/:userId/:index', async function (req, res, next) {
    try {
        const userId = req.params.userId;
        const index = req.params.index;
        const newData = req.body; // ข้อมูลใหม่ที่มาจากฟอร์ม

        // ค้นหาผู้ใช้และอัปเดตข้อมูลการศึกษา
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'ไม่พบผู้ใช้' });
        }

        // อัปเดตข้อมูลการศึกษาในตำแหน่งที่กำหนด
        user.educations[index] = newData;

        // บันทึกข้อมูลที่อัปเดตลงใน MongoDB
        await user.save();

        res.redirect('/aboutme'); // กลับไปยังหน้าเกี่ยวกับฉัน
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลการศึกษา' });
    }
});


module.exports = router;
