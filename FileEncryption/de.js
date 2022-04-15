const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const getCipherKey = require('./getCipherKey');

const decrypt = function(file,originalfile,password){
    
    // First, get the initialization vector from the file.
    const readInitVect = fs.createReadStream(file, { end: 15 });
  
    let initVect;
    readInitVect.on('data', (chunk) => {
      initVect = chunk;
    });
  
    
    // Once we’ve got the initialization vector, we can decrypt the file.
    return new Promise((resolve, reject)=>{
      readInitVect.on('close', () => {
      const cipherKey = getCipherKey(password);
      const readStream = fs.createReadStream(file, { start: 16 });
      const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
      const unzip = zlib.createUnzip();
      // const writeStream = fs.createWriteStream(file + '.unenc');
      const writeStream = fs.createWriteStream(originalfile);

      readStream
        .pipe(decipher)
        .pipe(unzip)
        .pipe(writeStream).on('finish', () => {
          // console.log("finished");
          resolve(originalfile);
        });
    });
  });

    // readInitVect.on('end',()=>{
    //   console.log("finished decryptioin");
    //   return new Promise((resolve, reject)=>{
    //       resolve(originalfile);
    //     });
    // });

    // return new Promise((resolve, reject)=>{
    //   resolve(originalfile);
    // });


    // var set_Time = 100;

    // setTimeout(()=>{
    //   if (check === 1) 
    //   {
    //     console.log("In the setimemethod");
    //     return new Promise((resolve, reject)=>{
    //       resolve(originalfile);
    //     });
    //   }
    //   else
    //   {
    //     set_Time += 50;
    //   }
    // },set_Time);
    
  
   
    // setTimeout(()=>{
    //           fs.rename(file +'.unenc',originalfile,()=>{
    //                console.log("renamed solved");
    //                return originalfile;
    //           });
    // },2000);

}

module.exports = decrypt;