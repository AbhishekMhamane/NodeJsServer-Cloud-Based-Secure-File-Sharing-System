const express = require('express');
const fs = require('fs');
const md5 = require('md5');
const aes256 = require('aes256');
const User = require('../models/user');
const userKeys = require('../models/userKey');

require('dotenv').config();
const USER_SPACE_PATH = process.env.USER_SPACE_PATH;
const key = process.env.ENCRYPTION_KEY;

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

                User.updateOne({ _id: userId.id },
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
                console.log(err);
            }
            else if(!data.length)
            {
                let userid = req.params.id;
                let userpath = USER_SPACE_PATH + '/' + userid;

                if (!fs.existsSync(userpath)) {
                    fs.mkdirSync(userpath);
                }
                else {
                    console.log("user space already exists");
                }

                var user = new User({
                    userId: userid,
                    userName: userid,
                    userPath: userpath
                });

                user.save((err,newuser)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        let userkey = Math.random().toString(36).substring(7) + userid;
                        let md5hash = md5(userkey);
                        const encrypted = aes256.encrypt(key, md5hash);
                        
                        var newuserKey = userKeys({
                            userId : userid, 
                            userKey : encrypted
                        });

                        newuserKey.save((err)=>{
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                console.log("user key created successfully");
                            }
                        });

                        res.status(201).send(newuser);
                    }
                });

                
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
                res.status(200).json({ msg: "user deleted" });
            }
        });

    });

module.exports = router;