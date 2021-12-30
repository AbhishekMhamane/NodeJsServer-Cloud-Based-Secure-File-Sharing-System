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
        var userpass = req.body.userPass;
        var usermob = req.body.userMob;

        var user = new User({
            userId: userid,
            userPass: userpass,
            userMob : usermob 
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

router.route('/user')

    .get((req, res) => {

        User.find({ userName: req.body.userName }, (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send(data);
            }
        });
    })
    .put((req, res) => {

        User.updateOne({ userName: req.body.userName },
            { $set: { userPass: req.body.userPass ,userMob : req.body.userMob} },
            { overwrite: true },
            function (err, data) {
                if (!err) {
                    res.status(200).send(data);
                }
            });
    })
    .delete((req, res) => {


        User.find({ userName: req.body.userName }, (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                User.findByIdAndRemove({ _id: data[0].id }, (err, data) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.status(200).json({ isSuccess: "true" });
                    }
                });
            }
        });


    });

module.exports = router;