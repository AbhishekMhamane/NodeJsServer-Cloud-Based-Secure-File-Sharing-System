//requiring mongoose
const mongoose = require('mongoose');

//creating schema
const fileSchema = mongoose.Schema({
    userId: { type: String, required: true },
    parentFolderId:{type:String , required: true},
    folderPath:{type:String,required:true},
    fileName: { type: String, required: true },
    filePath: { type: String, required: true, unique: true },
    fileUrl: { type: String, required: true },
    fileExt: { type: String, required: true },
    view : {type:String , default:"private" },
    usersPermission:[{userId:{type:String } ,role: {type:String } }],
});

//exporting mongoose model
module.exports = mongoose.model("File", fileSchema);