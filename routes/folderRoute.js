const express = require('express');
const fs = require('fs');
const fs1 = require('fs-extra');



const Folder = require('../models/folder');

require('dotenv').config();
const storageURL = process.env.FILE_STORAGE_URL;

let router = express.Router();

//folders route
router.route('/')
   .post(function (req, res) {

      // var folderpath = storageURL + '/' + req.body.folderName;
      var userid = req.body.userId;
      var foldername = req.body.folderName;
      var folderpath = req.body.folderPath;
      var parentfolderid = req.body.parentFolderId;

      console.log({ userid, foldername,folderpath, parentfolderid });
      // var folderpath = req.body.folderpath;

            var newfolder = new Folder({
               userId: userid,
               parentFolderId: parentfolderid,
               folderName: foldername,
               folderPath: "",
            });

            newfolder.save((err, record) => {
               if (err) {
                  console.log(err);
               }
               else {

                  var createFolder = folderpath + '/' + record.folderName;

                  if (!fs.existsSync(createFolder)) {
                     fs.mkdirSync(createFolder);

                     Folder.updateOne({ _id: record.id },
                        { $set: { folderPath: createFolder } },
                        { overwrite: true },
                        function (err, data) {
                           if (!err) {
                              res.status(201).json({ msg: "folder has created" });
                           }
                           else {
                              res.status(401).json({ msg: "server has a error" });
                           }
                        });

                  }
                  else {
                     res.status(401).json({
                        msg: "server has a error"
                     });
                  }
               }

         });
      
   });

router.route('/folder/:id')
   //get all folders using folder id nothing but emailid
   .get((req, res) => {

      var id = req.params.id;
      //var path = req.body.folderPath;

      Folder.find({ _id: id }, (err, data) => {
         if (err) {
            console.log(err);
         }
         else {

            res.status(200).send(data);
         }

      });
   });

router.route('/:id')
   //get all folders using userid nothing but emailid
   .get((req, res) => {

      var userid = req.params.id;
      //var path = req.body.folderPath;

      Folder.find({ userId: userid }, (err, data) => {
         if (err) {
            console.log(err);
         }
         else {

            res.status(200).send(data);
         }

      });
   })
   .put(function (req, res) {

      var id = req.params.id;

      Folder.find({ id: id }, (err, data) => {
         if (err) {
            console.log(err);
         }
         else {
            var folder = data[0].folderPath + '/' + data[0].folderName;
            var newName = data[0].folderPath + '/' + req.body.newName;
            console.log(folder);
            console.log(newName);

            try {
               fs.renameSync(folder, newName);

               Folder.updateOne({ _id: id },
                  { $set: { folderName: req.body.newName } },
                  { overwrite: true },
                  function (err) {
                     if (!err) {
                        res.status(200).json({ isSuccess: "true" });
                     }
                  });

            } catch (err) {
               res.send(err);
            }

         }

      });



   })
   .delete(function (req, res) {

      // var folder = storageURL + '/' + req.body.folderName;
      // console.log(folder);

      var folderid = req.params.id;
      console.log(folderid);

      Folder.findByIdAndRemove(folderid, function (err, data) {
         if (err) {
            console.log(err);
         }
         else {

            folderpath = data.folderPath;
            //console.log(folderpath);
            //fs.rmdirSync(folderpath);

            if (fs.existsSync(folderpath)) {
               const files = fs.readdirSync(folderpath)

               if (files.length > 0) {
                  files.forEach(function (filename) {
                     if (fs.statSync(folderpath + "/" + filename).isDirectory()) {
                        removeDir(folderpath + "/" + filename)
                     } else {
                        fs.unlinkSync(folderpath + "/" + filename)
                     }
                  })
                  fs.rmdirSync(folderpath)
               } else {
                  fs.rmdirSync(folderpath)
               }
            } else {
               console.log("Directory path not found.")
            }

            res.status(200).json({ isSuccess: "true" });


         }
      });


      //fs.rmdirSync(test_url);


   });

//route for moving folders 

router.route('/move/folder')
   .put(function (req, res) {

      var folderid = req.body.folderId;
      var destfolderid = req.body.destFolderId;
      var folderpath = "";
      var destfolderpath = "";

      Folder.find({ _id: destfolderid }, function (err, folder) {
         destfolderpath = folder[0].folderPath;

         Folder.find({ _id: folderid }, function (err, folder2) {

            folderpath = folder2[0].folderPath;
            destfolderpath = destfolderpath + '/' + folder2[0].folderName;

            console.log(folderpath);
            console.log(destfolderpath);

            fs1.move(folderpath, destfolderpath, function (err) {
               if (err) {
                  res.send(err);
               } else {
                  console.log("Successfully moved the file!");
               }
            });

            Folder.updateOne({ _id: folderid },
               { $set: { parentFolderId: destfolderid, folderPath: destfolderpath } },
               { overwrite: true },
               function (err) {
                  if (!err) {
                     res.status(200).json({ isSuccess: "true" });
                  }
               });

         });

      });

   });

//exproting router
module.exports = router;


