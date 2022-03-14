//requiring packages
const express = require('express');
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const Folder = require('../models/folder');
const User = require('../models/user');
const fs = require('fs');
const fs1 = require('fs-extra');

const encrypt = require('../FileEncryption/en');
const decrypt = require('../FileEncryption/de.js');

require('dotenv').config();
const storageURL = process.env.FILE_STORAGE_URL;
const USER_SPACE_PATH = process.env.USER_SPACE_PATH;

//storage engine
const storage = multer.diskStorage({
   destination: storageURL,
   filename: function (req, file, cb) {
      // return cb(null, file.originalname)
      return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
   }
});

//initializing upload
const upload = multer({
   storage: storage
})

//using express router
let router = express.Router();

// router.post('/test', async (req, res) => {
//    console.log(req.body);
//    res.send("got");
// });


function sleep(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}
//routes 
//return all files of indiviual user using user id nothing but email id
router.route('/:id')
   .get(function (req, res) {

      var userid = req.params.id;
      File.find({ userId: userid }, function (err, files) {

         if (err) {
            console.log(err);
         }
         else {
            res.status(200).send(files);
         }
      })

   });

router.route('/')
   .post(upload.array('files', 4), (req, res) => {

      var data = req.files;
      //console.log(req.body.userId);
      // var userId = req.userid;
      // var folderpath = req.userpath;
      console.log("form userid " + req.body.userid);
      console.log("form userpath " + req.body.userpath);
      console.log("form folderid " + req.body.parentfolderid);

      var userId = req.body.userid;
      var folderpath = req.body.userpath;
      var folderid = req.body.parentfolderid;

      User.find({ userId: userId }, async (err, user) => {
         if (err) {
            console.log(err);
         }
         else {

            console.log(user);
            console.log(user[0].userPath);

            for (var i in data) {
               console.log("uploaded file " + data[i]);

               var x = folderpath + '/' + data[i].filename;
               var url = `http://localhost:3000/view/${data[i].filename}`;
               var ext = path.extname(data[i].filename);

               var file = new File({
                  userId: user[0].userId,
                  parentFolderId: folderid,
                  folderPath: folderpath,
                  fileName: data[i].originalname,
                  filePath: x,
                  fileUrl: url,
                  fileExt: ext
               });

               file.save((err) => {
                  if (err) {
                     console.log(err);
                  }
               });
            }

            for (var i in data) {
               console.log("encryption file " + data[i]);

               var file = storageURL + '/' + data[i].filename;
               var password = 'password';
               const originalfile = await encrypt(file, password);

               if (originalfile) {

                  console.log(originalfile);

                 
                  if (fs.existsSync(originalfile)) {
                     console.log("file present");
                     //res.sendFile(originalfile);
                     var x = storageURL + '/' + data[i].filename + '.enc';

                     console.log("moving file ");
                     console.log(x);
                     console.log(folderpath + '/' + data[i].filename + '.enc');

                     fs1.move(x,
                        folderpath + '/' + data[i].filename + '.enc'
                        , function (err) {
                           if (err) { console.log(err); }
                           else {
                              console.log("file moved");
                              fs.unlink(file, function (err) {
                                 if (err) {
                                    console.log(err);
                                 }
                                 else {
                                    console.log("original file deleted")
                                 }
                              });

                           }
                        });

                     res.status(201).json({ isfileCreated: "true" });
                  }

               }
            }
         }

      });
   });

//route for sending file to user by id
router.route('/file/:id')
   .get(async function (req, res) {


      File.find({ _id: req.params.id }, async (err, data) => {

         //res.sendFile(data[0].filePath);

         if (fs.existsSync(data[0].filePath)) {
            res.sendFile(data[0].filePath);
         }
         else {
            const originalfile = await decrypt(data[0].filePath + '.enc', data[0].filePath, 'password');

            if (originalfile) {
               console.log("promise fullfiled");
               console.log(originalfile);


               var setv = 100;
               sleep(setv).then(() => {
                  if (fs.existsSync(originalfile)) {
                     console.log("file present");
                     res.sendFile(originalfile);

                     // sleep(2000).then(() => {
                     //    fs.unlink(originalfile, (err, data) => {
                     //       if (!err) {
                     //          console.log("decrypted file removed");
                     //       }
                     //    });
                     // });

                  }
                  else {
                     setv += 50;
                  }
               })
            }
         }
      });

   })
   .put(function (req, res) {

      console.log("in the war");
      File.find({ id: req.params.id }, (err, data) => {
         if (err) {
            console.log(err);
         }
         else {
            var fileExt = data[0].fileExt;
            var fileName = req.body.fileName;
            var Starred = req.body.starred;
            var View = req.body.view;

            var ext = '';

            if(!fileName)
            { 
               fileName = data[0].fileName;
            }

           
            ext = path.extname(fileName);

            if (ext !== '') {
               ext = fileExt;
            }
            else {
               ext = fileExt;
               fileName = fileName + ext;
            }

            File.updateOne({ _id: req.params.id },
               { $set: { fileName: fileName ,starred : Starred, view : View } },
               { overwrite: true },
               function (err) {
                  if (!err) {
                     res.status(200).json({ isSuccess: "true" });
                  }
               });

         }

      });

   })

   .delete(function (req, res) {

      File.findByIdAndRemove(req.params.id, function (err, data) {
         if (err) {
            console.log(err);
         }
         else {

            fs.unlink(data.filePath + '.enc', function (err) {
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


router.get('/file/download/:id', (req, res) => {

   File.find({ _id: req.params.id }, async (err, data) => {
      if (err) {
         console.log(err);
      }
      else {

         const originalfile = await decrypt(data[0].filePath + '.enc', data[0].filePath, 'password');

         if (originalfile) {
            console.log(originalfile);

            var setv = 100;
            sleep(setv).then(() => {

               if (fs.existsSync(originalfile)) {
                  console.log("file present");
                  res.status(200).download(originalfile, data[0].fileName);

                  sleep(10 * 60 * 1000).then(() => {
                     fs.unlink(originalfile, (err, data) => {
                        if (!err) {
                           console.log("decrypted file removed");
                        }
                     });
                  });

               }
               else {
                  setv += 50;
               }
            })
         }

         // send files and display on web page
         // var fileUrl=data[0].fileUrl;
         // res.send(`
         // <iframe
         // src=${fileUrl}
         // frameBorder="0"
         // scrolling="auto"
         // height="100%"
         // width="100%"></iframe>
         // `);

      }
   });

});


//route for the move files

router.route('/move/file')
   .put(function (req, res) {

      var destfolderid = req.body.destFolderId;
      var fileid = req.body.fileId;

      Folder.find({ _id: destfolderid }, function (err, folder) {

         File.find({ _id: fileid }, function (err, file) {

            var destpath = folder[0].folderPath + '/' + file[0].fileName;

            fs1.move(file[0].filePath, destpath, function (err) {
               if (err) {
                  res.send(err);
               } else {
                  console.log("Successfully moved the file!");
               }
            });

            File.updateOne({ _id: fileid },
               { $set: { parentFolderId: destfolderid, filePath: destpath } },
               { overwrite: true },
               function (err) {
                  if (!err) {
                     res.status(200).json({ isSuccess: "true" });
                  }
               });
         });

      });


   });

//starred files api
router.get('/starred/:userid',(req,res)=>{

   var userid = req.params.userid;
   console.log(userid);
  

   File.find({userId : userid , starred : true},(err,files)=>{
      if(!err)
      {
         res.status(200).send(files);
      }
      else
      {
         console.log(err);
      }
   });

});

//public search files
router.get('/public/files',(req,res)=>{

   File.find({ view : 'public'},(err,files)=>{
      if(!err)
      {
         res.status(200).send(files);
      }
      else
      {
         console.log(err);
      }
   });

});

//exproting router
module.exports = router;


