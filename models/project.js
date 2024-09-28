
const mongoose = require('mongoose');

// สร้าง Schema สำหรับข้อมูล
const projectSchema = new mongoose.Schema({
    project_name: {
        type: String,
        required: true,
        unique: true,
    },
    project_img_path: {
        type: String
    },
    project_desc: {
        type: String
    },
    project_link: {
        type: String
    }
}, {timestamps: true});

// สร้าง Model
const User = mongoose.model('Project', projectSchema);

module.exports = Project;
