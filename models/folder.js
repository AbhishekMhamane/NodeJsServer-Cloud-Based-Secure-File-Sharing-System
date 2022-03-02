//requiring mongoose
const mongoose = require('mongoose');

//creating schema
const folderSchema = mongoose.Schema({
    userId: { type: String, required: true },
    parentFolderId:{type:String , required: true},
    folderName: { type: String, required: true },
    folderPath: { type: String, required: true },
    usersPermission:[{userId:{type:String } ,role: {type:String } }],
    //folderUrl: { type: String, required: true },
    //fileExt: { type: String, required: true }
});

//exporting mongoose model
module.exports = mongoose.model("Folder", folderSchema);