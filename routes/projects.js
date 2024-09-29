const express = require('express');
const router = express.Router();
const Project = require('../models/Project')

// ตัวอย่างข้อมูลเริ่มต้น
let storyContent = "This is งานวิจัยและโครงงาน";

// เส้นทางสำหรับหน้า About
router.get('/', async (req, res) => {
    let projects = await Project.find({})
    res.render('project', { title: 'งานวิจัยและโครงงาน', activePage: 'project', projects });
});

// เส้นทางสำหรับการอัปเดตข้อมูล
router.post('/update', (req, res) => {
    storyContent = req.body.story; // อัปเดตเนื้อหาของ storyContent
    res.redirect('/aboutme'); // เปลี่ยนเส้นทางกลับไปยังหน้า About Me
});

router.get('/insert', async (req, res) => {
    let userId = '66f8787f12e39808b3f050fc'
    let sampleProject = {
        project_name: "My New Project2",
        project_img_path: "/img/project.png",
        project_desc: "Lorem",
        project_link: "http://example.com",
        added_user: userId  // userId ต้องเป็น _id ของ User ที่ทำการ insert
    }
    let newProject = new Project(sampleProject)
    await newProject.save()
    res.redirect('/project')
})

module.exports = router;
