const express = require('express');
const User = require('../models/user');

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

        var user = new User({
            userId: userid,
            userName: username,
            userMob: usermob
        });

        user.save((err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(201).json({ isSuccess: "true" });
            }
        });
    });

router.route('/:id')

    .get((req, res) => {

        User.find({ _id: req.params.id }, (err, data) => {
            if (err) {
                console.log(err);
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