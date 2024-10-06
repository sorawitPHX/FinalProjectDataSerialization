// models/User.js
const mongoose = require('mongoose');

// สร้าง Schema สำหรับข้อมูล
const scholarSchema = new mongoose.Schema({
    search_metadata: {
        type: Object,
    },
    search_parameters: {
        type: Object,
    },
    search_information: {
        type: Object,
    },
    organic_results: {
        type: Array,
    },
    pagination: {
        type: Array,
    },
    serpapi_pagination: {
        type: Array,
    },
    
}, {timestamps: true});

// สร้าง Model
const Scholar = mongoose.model('scholar', scholarSchema);

module.exports = Scholar;
