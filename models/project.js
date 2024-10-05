// models/User.js
const mongoose = require('mongoose');

// สร้าง Schema สำหรับข้อมูล
const projectSchema = new mongoose.Schema({
    project_name: {
        type: String,
        required: true,
    },
    project_img_path: {
        type: String
    },
    project_desc: {
        type: String
    },
    project_link: {
        type: String
    },
    added_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

// สร้าง Model
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
