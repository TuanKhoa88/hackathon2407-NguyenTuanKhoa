import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';


router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Get the failed posts!!"
            })
        }
        if (req.query.id) {
            let posts = JSON.parse(data)
            let post = posts.find(post => post.id == req.query.id)
            if (post) {
                return res.status(200).json({
                    message: "Get posts successfully",
                    data: post
                })
            } else {
                return res.status(500).json({
                    message: `Can't change the post with id ${req.query.id}`
                })
            }
        }
        return res.status(200).json({
            message: "Get posts successfully!",
            data: JSON.parse(data)
        })
    })
})

router.delete('/:postsId', (req, res) => {
    if (req.params.postsId) {
        fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Get the failed posts!"
                })
            }
            let posts = JSON.parse(data);
            posts = posts.filter(user => user.id != req.params.postsId);

            fs.writeFile(path.join(__dirname, "posts.json"), JSON.stringify(posts), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "File save failed!!"
                    })
                }
                return res.status(200).json({
                    message: "File deleted posts successfully"
                })
            })
        })
    } else {
        return res.status(500).json(
            {
                message: "Please pass postsId!!"
            }
        )
    }
})

router.post('/', (req, res) => {
    fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json(
                {
                    message: "Read data failed!"
                }
            )
        }
        let oldData = JSON.parse(data);
        let newPost = {
            id: Date.now(),
            ...req.body
        }
        oldData.unshift(newPost)
        fs.writeFile(path.join(__dirname, "posts.json"), JSON.stringify(oldData), (err) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: "File recording failed!"
                    }
                )
            }
            return res.status(200).json({
                message: "File recording successfully",
                data: newPost
            })

        })
    })

})


router.put('/:postId', (req, res) => {
    if (!req.params.postId) {
        return res.status(500).json({
            message: "Please transmit postId you want to update"
        })
    }
    let postId = req.params.postId;
    let body = req.body;

    //Update the post
    fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Getting posts failed"
            });
        }

        let posts = JSON.parse(data);
        let post = posts.find(post => post.id == postId);
        if (!post) {
            return res.status(500).json({
                message: "Can't change post with id" + postId
            });
        }
        //Update the post with the body data
        Object.assign(post, body);

        //Save the updated post
        fs.writeFile(path.join(__dirname, "posts.json"), JSON.stringify(posts), (err) => {
            if (err) {
                return res.status(500).json({
                    message: "File save failed!!"
                });
            }
            res.sendStatus(200);
        })
    })
})

router.delete('/', (req, res) => {
    fs.writeFile(path.join(__dirname, "posts.json"), "[]", (err) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to delete posts!"
            });
        }
        res.sendStatus(200);
    });
});


module.exports = router;