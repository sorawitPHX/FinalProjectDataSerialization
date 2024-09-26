const express = require('express');
const router = express.Router();

// ตัวอย่างข้อมูลเริ่มต้น
let storyContent = "This is งานวิจัยและโครงงาน";

// เส้นทางสำหรับหน้า About
router.get('/', (req, res) => {
    res.render('project', { title: 'งานวิจัยและโครงงาน', content: storyContent, activePage: 'project' });
});

// เส้นทางสำหรับการอัปเดตข้อมูล
router.post('/update', (req, res) => {
    storyContent = req.body.story; // อัปเดตเนื้อหาของ storyContent
    res.redirect('/aboutme'); // เปลี่ยนเส้นทางกลับไปยังหน้า About Me
});

module.exports = router;
