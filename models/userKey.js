const mongoose = require('mongoose');

const userKeySchema = mongoose.Schema({
    userId : {type : String, required: true},
    userKey : {type : String, required: true}
});

module.exports = mongoose.model('userKeys' , userKeySchema);