// models/User.js
const mongoose = require('mongoose');

// สร้าง Schema สำหรับข้อมูล
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    prefix_th: {
        type: String,
        required: false,
    },
    firstname_th: {
        type: String,
        required: false,
    },
    lastname_th: {
        type: String,
        required: false,
    },
    description_th: {
        type: String,
        required: false,
    },
    prefix_en: {
        type: String,
        required: false,
    },
    firstname_en: {
        type: String,
        required: false,
    },
    lastname_en: {
        type: String,
        required: false,
    },
    description_en: {
        type: String,
        required: false,
    },
    rewards : Array,
    educations: Array,
    experiences: Array,
    
}, {timestamps: true});

// สร้าง Model
const User = mongoose.model('User', userSchema);

module.exports = User;
