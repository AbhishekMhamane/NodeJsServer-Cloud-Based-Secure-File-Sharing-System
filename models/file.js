//requiring mongoose
const mongoose=require('mongoose');

//creating schema
const fileSchema=mongoose.Schema({
    fileName:String,
    filePath:String,
    fileUrl:String,
    fileExt:String
});

//exporting mongoose model
module.exports=mongoose.model("File",fileSchema);