const express = require('express');
const router = express.Router();
const Project = require('../models/Project')
const multer = require('multer')
const path = require('path')

// Define variable
let userId = '66f8787f12e39808b3f050fc'

// Set up Multer storage
const storage = multer.diskStorage({
    destination: './public/uploads/', // Where to store uploaded files
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('project_img'); // 'project_img' is the name attribute in the form

// Check file type function
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// เส้นทางสำหรับหน้า About
router.get('/', async (req, res) => {
    try {
        const search = req.query.search || ''
        const status = req.query.status;

        const searchOptions = search
            ? {
                $or: [
                    { project_name: { $regex: search, $options: 'i' } },
                    { project_desc: { $regex: search, $options: 'i' } }
                ]
            } // ใช้ regex ค้นหาที่ชื่อโปรเจค
            : {};

        const msg = req.query.msg;
        const limit = parseInt(req.query.limit) || 12
        const page = parseInt(req.query.page) || 1
        const skip = (page - 1) * limit
        const projectCount = await Project.countDocuments(searchOptions)
        const totalPage = Math.ceil(projectCount / limit)
        let projects = await Project.find(searchOptions).skip(skip).limit(limit)
        res.render('project', { title: 'งานวิจัยและโครงงาน', activePage: 'project', projects, status, msg, projectCount, totalPage, page, limit, search });
    } catch (error) {
        res.send({ error })
        console.log(error)
    }
});

// เส้นทางสำหรับการอัปเดตข้อมูล
router.put('/update', (req, res) => {
    storyContent = req.body.story; // อัปเดตเนื้อหาของ storyContent
    res.redirect('/project'); // เปลี่ยนเส้นทางกลับไปยังหน้า About Me
});

router.delete('/delete', (req, res) => {
    res.redirect('project')
})


router.post('/insert', async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send({ err })
        } else {
            let path = ''
            if (req.file == undefined) {
                path = `img/no_image.jpg`
                // res.status(400).send({ msg: 'No file uploaded' })

                // let [res_status, res_msg] = ['error', 'No file uploaded']
                // res.redirect(`/project?status=${res_status}&msg=${res_msg}`)
            } else {
                path = `uploads/${req.file.filename}`
            }
            let newProject = new Project({
                project_name: req.body.project_name,
                project_desc: req.body.project_desc,
                project_link: req.body.project_link,
                project_img_path: path,
                added_user: userId  // userId ต้องเป็น _id ของ User ที่ทำการ insert
            })
            newProject.save().then(() => {
                let [res_status, res_msg] = ['success', 'Inserted New Project']
                res.redirect(`/project?status=${res_status}&msg=${res_msg}`)
            }).catch((err) => {
                let [res_status, res_msg] = ['error', err]
                res.redirect(`/project?status=${res_status}&msg=${res_msg}`)
            })
        }
    })
})

// Update Project by ID
router.post('/update', async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).send({ err })
        } else {
            let path = ''
            if (req.file == undefined) {
                if (req.body.project_img_path) {
                    path = req.body.project_img_path
                } else {
                    res.status(400).send({ msg: 'No any img path' })
                }
            } else {
                path = `uploads/${req.file.filename}`
            }
            try {
                const updatedProject = await Project.findByIdAndUpdate(
                    req.body.id,
                    {
                        project_name: req.body.project_name,
                        project_desc: req.body.project_desc,
                        project_link: req.body.project_link,
                        project_img_path: path,
                    },
                    { new: true } // Return the updated document
                );

                if (!updatedProject) {
                    return res.status(404).send('Project not found');
                }
                res.redirect('/project');
            } catch (err) {
                console.error(err);
                res.status(500).send('Error updating the project');
            }
        }
    })

});

// Delete Project by ID
router.get('/delete/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).send('Project not found');
        }
        res.redirect('/project')
        // res.status(200).send('Project deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting the project');
    }
});

// Delete Multiple Projects by IDs
router.post('/deletes', async (req, res) => {
    const { ids } = req.body; // รับค่า ids จาก body
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).send('Invalid request: No project IDs provided or not an array');
    }

    try {
        const deletedProjects = await Project.deleteMany({ _id: { $in: ids } });
        if (deletedProjects.deletedCount === 0) {
            return res.status(404).send('No projects found for the provided IDs');
        }

        // res.redirect('/project')
        res.status(200).send(`${deletedProjects.deletedCount} project(s) deleted successfully`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting projects');
    }
});


module.exports = router;
