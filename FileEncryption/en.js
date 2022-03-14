const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const AppendInitVect = require('./appendInitVect');
const getCipherKey = require('./getCipherKey');

const encrypt = function (file,password) {

    // Generate a secure, pseudo random initialization vector.
    const initVect = crypto.randomBytes(16);
    
    // Generate a cipher key from the password.
    const CIPHER_KEY = getCipherKey(password);
    const readStream = fs.createReadStream(file);
    const gzip = zlib.createGzip();
    const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
    const appendInitVect = new AppendInitVect(initVect);
    // Create a write stream with a different file extension.
    const writeStream = fs.createWriteStream(path.join(file + ".enc"));
    
    return new Promise((resolve, reject) => {
      readStream
      .pipe(gzip)
      .pipe(cipher)
      .pipe(appendInitVect)
      .pipe(writeStream).on('finish',()=>{
       
          resolve(file +'.enc');
  
      })
    })
  }

  module.exports = encrypt;