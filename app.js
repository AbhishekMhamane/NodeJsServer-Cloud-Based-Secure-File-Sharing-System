//requiring packages
const express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const ngrok = require('ngrok');
const nodemon = require("nodemon");


const fileRoute = require('./routes/fileRoute');
const userRoute = require('./routes/userRoute');
const folderRoute = require('./routes/folderRoute');
const proxyreRoute = require('./routes/proxyreRoute');

//initializing app
const app = express();
//config dotenv
require('dotenv').config();
const port = process.env.PORT || 5000;
const mongoDB_URL = process.env.MONGODB_URL;

const USER_SPACE_PATH = exports = process.env.USER_SPACE_PATH;
//using profile for hiding upload folder 
//app.use('/files',express.static(USER_SPACE_PATH));
//app.use('/static', express.static('C:\\Users\\abhim\\OneDrive\\Desktop\\upload\\620127cbd5fd607a2321d36b'));



//middlewares
app.use(express.urlencoded({ extended: true }))

app.use(express.json())

//configuring 
app.use(cors({
    "Access-Control-Allow-Origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  }));
 
app.use(helmet());

app.use(morgan('dev'));
//mongoose connection
mongoose.connect(mongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true });


//routes
app.use('/files', fileRoute);
app.use('/users',userRoute);
app.use('/folders',folderRoute);
app.use('/proxy', proxyreRoute);

//main app path to modify current server path
app.post('/modifypath',(req,res)=>{
    var path = req.body.path;
    app.use('/view',express.static(path));
    console.log("modified");
    res.send("modified path : "+path);
});

//listen on port
app.listen(port, () => `Server is running on port ${port} 🔥`);

//ngrok connection

// ngrok
//   .connect({
//     proto: "http",
//     addr: "3000",
//   })
//   .then((url) => {
//     console.log(`ngrok tunnel opened at: ${url}`);
//     console.log("Open the ngrok dashboard at: https://localhost:4040\n");

//     nodemon({
//       script: "./bin/www",
//       exec: `NGROK_URL=${url} node`,
//     }).on("start", () => {
//       console.log("The application has started");
//     }).on("restart", files => {
//       console.group("Application restarted due to:")
//       files.forEach(file => console.log(file));
//       console.groupEnd();
//     }).on("quit", () => {
//       console.log("The application has quit, closing ngrok tunnel");
//       ngrok.kill().then(() => process.exit(0));
//     });
//   })
//   .catch((error) => {
//     console.error("Error opening ngrok tunnel: ", error);
//     process.exitCode = 1;
//   });

module.exports.app = app;

