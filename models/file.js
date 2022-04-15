//requiring mongoose
const mongoose = require('mongoose');

//creating schema
const fileSchema = mongoose.Schema({
    userId: { type: String, required: true },
    parentFolderId:{type:String , required: true},
    fileName: { type: String, required: true },
    filePath: { type: String, required: true, unique: true },
    fileUrl: { type: String, required: true },
    fileExt: { type: String, required: true },
    starred: {type:Boolean, default: false},
    public : {type:Boolean , default:false },
    usersPermission:[{userId:{type:String } ,role: {type:String } }],
    // folderPath:{type:String,required:true},
});

//exporting mongoose model
module.exports = mongoose.model("File", fileSchema);