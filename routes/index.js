var express = require('express');
var router = express.Router();
var News = require('../models/news');
var Comment = require('../models/comment');
const multer = require('multer');
const path = require('path');
const User = require('../models/User')

const storage = multer.diskStorage({
    destination: './public/uploads/comment/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage }).single('commentImg'); // รับเฉพาะไฟล์เดียวจากฟิลด์ 'commentImg'

const users = { username: 'Anonymous', pImg: 'img/profile.png' }

function formatLikes(likes) {
    if (likes >= 1000000) {
        return (likes / 1000000).toFixed(1) + 'M';
    } else if (likes >= 1000) {
        return (likes / 1000).toFixed(1) + 'K';
    } else {
        return likes;
    }
}
router.get('/', async function (req, res, next) {
    try {
        let loggedUser = undefined
        if(typeof res.locals.user !== 'undefined') {
            loggedUser = await User.findOne({ _id: res.locals.user.userId })
            
        }
        const status = req.query.status;
        const msg = req.query.msg;
        const newsList = await News.aggregate([{ $sample: { size: 3 } }]);
        const commentList = await Comment.find().sort({ date: -1 }).limit(10);

        // ส่งข้อมูลไปยัง View
        res.render('index', {
            title: 'Ngamnij Arch-int',
            activePage: 'index',
            newsList,
            commentList,
            users,
            status,
            msg,
            loggedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching comments");
    }
});

router.post('/insertComment', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send({ err });
        } else {
            let imagePath = req.file ? `uploads/comment/${req.file.filename}` : `img/no_image.jpg`;

            let postComment = new Comment({
                username: req.body.username,
                content: req.body.content,
                PImg: req.body.Puser,
                image: imagePath
            });
            console.log('Post to save:', postComment);

            postComment.save()
                .then(() => {
                    let [res_status, res_msg] = ['success', 'Post Successfully']
                    res.redirect(`/?status=${res_status}&msg=${res_msg}`)
                }).catch((err) => {
                    let [res_status, res_msg] = ['error', err]
                    res.redirect(`/?status=${res_status}&msg=${res_msg}`)
                    console.log(err)
                })
        }
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
            res.redirect('/');
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
        res.redirect('/')
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting the Comments');
    }
});

module.exports = router;
