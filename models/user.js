const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    userPass: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);