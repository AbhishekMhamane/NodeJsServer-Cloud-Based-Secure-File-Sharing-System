const crypto = require('crypto');

const getCipherKey = function (password) {
    return crypto.createHash('sha256').update(password).digest();
  }

module.exports=getCipherKey;