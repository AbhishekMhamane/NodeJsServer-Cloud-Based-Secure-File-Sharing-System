const express=require('express');
const fs = require('fs');

require('dotenv').config();
const storageURL=process.env.FILE_STORAGE_URL;

let router=express.Router();

//folders route
router.route('/')
   .post(function (req, res) {

      var folder = storageURL + '/' + req.body.folderName;

      console.log(req.body.folderName);

      try {
         if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
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

   })

   .put(function (req, res) {

      var folder = storageURL + '/' + req.body.folderName;
      var newName = storageURL + '/' + req.body.newName;
      try {
         fs.renameSync(folder, newName);
         res.json({
            isSuccess: "true"
         });
      } catch (err) {
         res.send(err);
      }
   })

   .delete(function (req, res) {
      var folder = storageURL + '/' + req.body.folderName;
      console.log(folder);

      fs.rmdirSync(folder);

      res.json({
         isSuccess: "true"
      });

   });


//exproting router
module.exports = router;


