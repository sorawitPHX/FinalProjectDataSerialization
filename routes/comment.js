var express = require('express');
var router = express.Router();
const User = require('../models/User');
var Comment = require('../models/comment');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './public/uploads/comment/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage }).single('commentImg'); // รับเฉพาะไฟล์เดียวจากฟิลด์ 'commentImg'
  
  const users = { username: 'Anonymous', pImg: 'img/profile.png' }


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

    const allcomment = await Comment.find();
    const commentList = await Comment.find(searchOptions).sort({ date: -1 });

    res.render('comments', {
        // user,
        title: 'ความคิดเห็น',
        activePage: 'index',
        search,
        commentList,
        allcomment,
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

  router.post('/updateComment', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).send({ err })
        } else {
            let path = ''
            if (req.file == undefined) {
                if (req.body.comment_img_path) {
                    path = req.body.comment_img_path
                } else {
                    res.status(400).send({ msg: 'No any img path' })
                }
            } else {
                path = `uploads/comment/${req.file.filename}`
            }
            try {
                const updatedComment = await Comment.findByIdAndUpdate(
                    req.body.id,
                    {
                        content: req.body.content,
                        image: path,
                    },
                    { new: true } // Return the updated document
                );

                if (!updatedComment) {
                    return res.status(404).send('News not found');
                }
                res.redirect('/comments');
            } catch (err) {
                console.error(err);
                res.status(500).send('Error updating the News');
            }
        }
    });
});



module.exports = router;