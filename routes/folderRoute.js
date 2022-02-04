const express = require('express');
const fs = require('fs');
const Folder = require('../models/folder');

require('dotenv').config();
const storageURL = process.env.FILE_STORAGE_URL;
const test_url = process.env.test_url;

let router = express.Router();

//folders route
router.route('/')
   .get((req, res) => {

      var userid = req.body.userId;
      var path = req.body.folderPath;

      Folder.find({ userId: userid, folderPath: path }, (err, data) => {
         if (err) {
            console.log(err);
         }
         else {

            res.status(200).send(data);
         }

      });
   })
   .post(function (req, res) {

      // var folderpath = storageURL + '/' + req.body.folderName;
      var userid = req.body.userId;
      var foldername = req.body.folderName;
      var folderpath = req.body.folderPath;
      var createFolder = req.body.folderPath + '/' + req.body.folderName;
      // var folderpath = req.body.folderpath;

      console.log(req.body);

      try {
         if (!fs.existsSync(createFolder)) {
            fs.mkdirSync(createFolder);

            var folder = new Folder({
               userId: userid,
               folderName: foldername,
               folderPath: folderpath,
            });

            folder.save((err) => {
               if (err) {
                  console.log(err);
               }
            });

            res.json({
               isCreated: "true"
            });

         }
         else {
            res.json({
               isCreated: "false"
            });
         }
      }
      catch (err) {
         res.send(err);
      }

   });

   router.route('/:id')
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

      Folder.findByIdAndRemove(folderid, function (err, data) {
         if (err) {
            console.log(err);
         }
         else {

            folderpath = data.folderPath + '/' + data.folderName;
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


//exproting router
module.exports = router;


