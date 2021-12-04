//requiring packages
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const helmet=require('helmet');
const router=require('./routes/route');

//initializing app
const app=module.exports=express();

//using profile for hiding upload folder 
app.use('/files',express.static('./upload'));

//config dotenv
require('dotenv').config();
const port=process.env.PORT || 3000;

//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//configuring 
app.use(cors());
app.use(helmet());
//mongoose connection
mongoose.connect("mongodb://localhost:27017/FileHandling",{useNewUrlParser:true,useUnifiedTopology: true});


//routes
app.use('/',router);

//listen on port
app.listen(port,()=>`Server is running on port ${port} 🔥`);

