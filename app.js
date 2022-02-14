//requiring packages
const express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const fileRoute = require('./routes/fileRoute');
const userRoute = require('./routes/userRoute');
const folderRoute = require('./routes/folderRoute');
//initializing app
const app = express();
//config dotenv
require('dotenv').config();
const port = process.env.PORT || 3000;
const mongoDB_URL = process.env.MONGODB_URL;

const USER_SPACE_PATH = exports = process.env.USER_SPACE_PATH;
//using profile for hiding upload folder 
//app.use('/files',express.static(USER_SPACE_PATH));
//app.use('/static', express.static('C:\\Users\\abhim\\OneDrive\\Desktop\\upload\\620127cbd5fd607a2321d36b'));



//middlewares
app.use(express.urlencoded({ extended: true }))

app.use(express.json())

//configuring 
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
//mongoose connection
mongoose.connect(mongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true });


//routes
app.use('/files', fileRoute);
app.use('/users',userRoute);
app.use('/folder',folderRoute);

//main app path to modify current server path
app.post('/modifypath',(req,res)=>{
    var path = req.body.path;
    app.use('/view',express.static(path));
    console.log("modified");
    res.send("modified path : "+path);
});

//listen on port
app.listen(port, () => `Server is running on port ${port} 🔥`);

module.exports.app = app;

