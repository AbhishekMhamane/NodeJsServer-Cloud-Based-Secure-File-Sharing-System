const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    userMob: { type: String , require : true , unique : true},
    userPath: { type: String, unique: true },
});

module.exports = mongoose.model('User', userSchema);