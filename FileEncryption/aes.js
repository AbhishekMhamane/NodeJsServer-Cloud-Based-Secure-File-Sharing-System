const fs = require('fs');
const encrypt = require('./en');
const decrypt = require('./de');

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

var file='demo.msi';
var password='password';
encrypt(file,password);

console.log("Hello");
sleep(20000).then(() => {
    console.log("In sleep");
    decrypt('demo.msi.enc','password');
});


console.log("after sleep");



    
 

// const crypto = require('crypto');
// const fs = require('fs');
// const path = require('path');
// const zlib = require('zlib');

// const AppendInitVect = require('./appendInitVect');

// // var file='resume.pdf';
// // var password='password';

// // const initVect = crypto.randomBytes(16);
  
// // // Generate a cipher key from the password.
// // const CIPHER_KEY = crypto.createHash('sha256').update(password).digest();
// // const readStream = fs.createReadStream(file);
// // const gzip = zlib.createGzip();
// // const cipher = crypto.createCipheriv('aes-256-ctr', CIPHER_KEY, initVect);
// // const appendInitVect = new AppendInitVect(initVect);
// // // Create a write stream with a different file extension.
// // const writeStream = fs.createWriteStream(path.join(file + ".enc"));

// // readStream
// //   .pipe(gzip)
// //   .pipe(cipher)
// //   .pipe(appendInitVect)
// //   .pipe(writeStream);

// //decryption 

// var file2='resume.pdf.enc';
// var password2='password';

// const readInitVect = fs.createReadStream(file2, { end: 15 });

// let initVect;
// readInitVect.on('data', (chunk) => {
//   initVect = chunk;
// });

// // Once we’ve got the initialization vector, we can decrypt the file.
// readInitVect.on('close', () => {
//   const cipherKey = crypto.createHash('sha256').update(password2).digest();
//   const readStream = fs.createReadStream(file2, { start: 16 });
//   const decipher = crypto.createDecipheriv('aes-256-ctr', cipherKey, initVect);
//   const unzip = zlib.createUnzip();
//   const writeStream = fs.createWriteStream(file2 + ".unenc");

//   readStream
//     .pipe(decipher)
//     .pipe(unzip)
//     .pipe(writeStream);
// });

// setTimeout(() => {

//   fs.rename('resume.pdf.enc.unenc','resume.pdf',()=>{
//     console.log("solved");
// });

// }, 2000);
