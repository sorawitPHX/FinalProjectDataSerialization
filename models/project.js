// models/User.js
const mongoose = require('mongoose');

// สร้าง Schema สำหรับข้อมูล
const projectSchema = new mongoose.Schema({
    position: {
        type: Number,
    },
    title: {
        type: String
    },
    result_id: {
        type: String
    },
    link: {
        type: String
    },
    snippet: {
        type: String
    },
    publication_info: {
        type: Object
    },
    resources: {
        type: Array
    },
    inline_links: {
        type: Object
    },
    
}, {timestamps: true});

// สร้าง Model
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
