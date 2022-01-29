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
const app = module.exports = express();
//config dotenv
require('dotenv').config();
const port = process.env.PORT || 3000;
const mongoDB_URL = process.env.MONGODB_URL;

const storageURl = exports = process.env.FILE_STORAGE_URL;
//using profile for hiding upload folder 
app.use('/files', express.static(storageURl));



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

//listen on port
app.listen(port, () => `Server is running on port ${port} 🔥`);

