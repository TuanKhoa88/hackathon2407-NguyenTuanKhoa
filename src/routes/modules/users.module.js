import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';


router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Get the failed users!!"
            })
        }
        if (req.query.id) {
            let users = JSON.parse(data)
            let user = users.find(user => user.id == req.query.id)
            if (user) {
                return res.status(200).json({
                    message: "Get users successfully",
                    data: user
                })
            } else {
                return res.status(500).json({
                    message: `Khong tim thay user co id ${req.query.id}`
                })
            }
        }
        return res.status(200).json({
            message: "Get users successfully!",
            data: JSON.parse(data)
        })
    })
})

router.delete('/:usersId', (req, res) => {
    if (req.params.usersId) {
        fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Get the failed users!"
                })
            }
            let users = JSON.parse(data);
            users = users.filter(user => user.id != req.params.usersId);

            fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(users), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "File save failed!!"
                    })
                }
                return res.status(200).json({
                    message: "File deleted users successfully"
                })
            })
        })
    } else {
        return res.status(500).json(
            {
                message: "Please pass usersId!!"
            }
        )
    }
})

router.post('/', (req, res) => {
    fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json(
                {
                    message: "Read data failed!"
                }
            )
        }
        let oldData = JSON.parse(data);
        let newUser = {
            id: Date.now(),
            ...req.body
        }
        oldData.unshift(newUser)
        fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(oldData), (err) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: "File recording failed!"
                    }
                )
            }
            return res.status(200).json({
                message: "File recording successfully",
                data: newUser
            })

        })
    })

})

router.put('/:usersId', (req, res) => {
    if (!req.params.usersId) {
        return res.status(500).json({
            message: "Please transmit usersId you want to update"
        })
    }
    let usersId = req.params.usersId;
    let body = req.body;

    //Update the user
    fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Getting users failed"
            });
        }

        let users = JSON.parse(data);
        let user = users.find(user => user.id == usersId);
        if (!user) {
            return res.status(500).json({
                message: "Can't change user with id" + usersId
            });
        }
        //Update the user with the body data
        Object.assign(user, body);

        //Save the updated user
        fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(users), (err) => {
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
    fs.writeFile(path.join(__dirname, "users.json"), "[]", (err) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to delete users!"
            });
        }
        res.sendStatus(200);
    });
});


module.exports = router;