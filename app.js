//requiring packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const router = require('./routes/route');
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//configuring 
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
//mongoose connection
mongoose.connect(mongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true });


//routes
app.use('/', router);

//listen on port
app.listen(port, () => `Server is running on port ${port} 🔥`);

