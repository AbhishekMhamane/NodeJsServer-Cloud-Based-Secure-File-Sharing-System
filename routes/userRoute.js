const express = require('express');
const fs = require('fs');

const User = require('../models/user');

require('dotenv').config();
const storageURL = process.env.FILE_STORAGE_URL;
const USER_SPACE_PATH = process.env.USER_SPACE_PATH;

let router = express.Router();

router.route('/')
    .get(function (req, res) {
        User.find({}, (err, users) => {
            if (!err) {
                res.status(200).send(users);
            }
            else {
                console.log(err);
            }
        });
    })
    .post((req, res) => {

        var userid = req.body.userId;
        var username = req.body.userName;
        var usermob = req.body.userMob;
        var userpath = "";
        var uid;

        var user = new User({
            userId: userid,
            userName: username,
            userMob: usermob,
            userPath: userpath
        });

        user.save((err, data) => {
            if (err) {
                res.send(err);
            }
            else {

                userpath = USER_SPACE_PATH + '/' + data.id;

                if (!fs.existsSync(userpath)) {
                    fs.mkdirSync(userpath);
                }
                else {
                    res.status(401).json({ msg: "user is already present" });
                }

                User.updateOne({ _id: data.id },
                    { $set: { userPath: userpath } },
                    { overwrite: true },
                    function (err, data) {
                        if (!err) {
                            res.status(201).json({ isSuccess: "true" });
                        }
                        else {
                            res.status(401).json({ isSuccess: "false" });

                        }
                    });

            }
        });
    });

router.route('/:id')

    .get((req, res) => {

        User.find({ userId: req.params.id }, (err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                res.status(200).send(data);
            }
        });

    })
    .put((req, res) => {

        User.updateOne({ _id: req.params.id },
            { $set: { userName: req.body.userName, userMob: req.body.userMob } },
            { overwrite: true },
            function (err, data) {
                if (!err) {
                    res.status(200).send(data);
                }
            });
    })
    .delete((req, res) => {

        User.findByIdAndRemove({ _id: req.params.id }, (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).json({ isSuccess: "true" });
            }
        });

    });

module.exports = router;