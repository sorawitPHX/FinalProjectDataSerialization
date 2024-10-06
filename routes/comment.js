var express = require('express');
var router = express.Router();
const User = require('../models/User');
var Comment = require('../models/comment');
const multer = require('multer');
const path = require('path');


const users = { username: 'notistz', pImg: 'uploads/news/image-1728110603224.jpeg' }


router.get('/', async function (req, res, next) {
    let loggedUser = undefined
    if (typeof res.locals.user !== 'undefined') {
        loggedUser = await User.findOne({ _id: res.locals.user.userId })
    }
    const search = req.query.search || '';
    const searchOptions = search
        ? {
            $or: [
                { content: { $regex: search, $options: 'i' } }
            ]
        }
        : {};


    const commentList = await Comment.find(searchOptions).sort({ date: -1 });

    res.render('comments', {
        // user,
        title: 'Ngamnij Arch-int',
        activePage: 'index',
        search,
        commentList,
        users,
        loggedUser
    });
});

router.post('/replyComment/:id', (req, res) => {
    const commentId = req.params.id;

    const newReply = {
        username: req.body.username,
        PImg: req.body.Puser,
        content: req.body.content
    };

    Comment.findById(commentId)
        .then(comment => {
            if (!comment) {
                return res.status(404).send("Comment not found");
            }
            comment.replies.push(newReply);

            return comment.save();
        })
        .then(() => {
            res.redirect('/comments');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error replying to comment");
        });
});


router.post('/likeComment/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).send("Comment not found");
        }
        comment.likes += 1;
        await comment.save();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error liking the comment");
    }
});

router.get('/commentDelete/:id', async (req, res) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
        if (!deletedComment) {
            return res.status(404).send('Comments not found');
        }
        res.redirect('/comments')
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting the Comments');
    }
});

module.exports = router;