////requiring packages
const express = require('express');
const fs = require('fs');
const File = require('../models/file');
const Folder = require('../models/folder');
const User = require('../models/user');
const aes256 = require('aes256');
const userKeys = require('../models/userKey');
const PRE = require('../Proxy-Reecnryption/pre');

require('dotenv').config();
const key = process.env.ENCRYPTION_KEY;

const router = express.Router();

//proxy re-encryption
router.route('/:uid/:id')
   .post(async function (req, res) {

      const pk = req.body.pk;

      // const A = await PRE.init({ g: "The generator for G1", h: "The generator for G2", returnHex: false }).then(params => {
      //    const A = PRE.keyGenInG1(params, { returnHex: true });
      //    return new Promise((resolve, reject) => {
      //       console.log("Proxy keys genereted");
      //       resolve(A);
      //    });
      // });

      File.find({ _id: req.params.id }, async (err, data) => {

         //res.sendFile(data[0].filePath);

     

            userKeys.find({ userId: data[0].userId }, async (err, userkey) => {


               let encryptedKey = userkey[0].userKey;
               let decryptedKey = aes256.decrypt(key, encryptedKey);
               //let decryptedKey = '4aed0b236004da9c8570160c774ffd96';
               //let decryptedKey = "e686f279613c8fab8a2f2c5fee6f532c6b88e827e2a81742d9e89e159ce08824";
               console.log("userKey");
               console.log(userkey[0]);
               console.log("decrypted ",decryptedKey);

               const encryptedData = await PRE.init({ g: "The generator for G1", h: "The generator for G2", returnHex: false }).then(params => {

                  const plain = PRE.randomGen();

                  const plainRandom = decryptedKey + plain.substring(32);
                  
                  console.log(plainRandom);

                  const A = PRE.keyGenInG1(params, { returnHex: true });

                  const encrypted = PRE.enc(plainRandom, A.pk, params, { returnHex: true });

                  const reKey = PRE.rekeyGen(A.sk, pk, { returnHex: true });

                  const reEncypted = PRE.reEnc(encrypted, reKey, {returnHex: true});

                 // const reDecrypted = PRE.reDec(reEncypted, B.sk);

                  return new Promise((resolve, reject) => {
                     console.log("Generated Reencryption keys");
                     resolve(reEncypted);
                  });

               }).catch(err => {
                  console.log(err)
               });

               console.log(encryptedData);

               res.status(200).send(encryptedData);

            });

         
      });

   });

module.exports = router;