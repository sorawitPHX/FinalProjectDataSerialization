const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
    username: { type: String, required: true },
    PImg: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const CommentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    PImg: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    replies: [ReplySchema] 
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
