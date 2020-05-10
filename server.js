 const express =require('express');
 const dotenv=require('dotenv')
 const morgan=require('morgan')
 const connectDB= require('./config/db')
 const colors=require('colors')
 const errorHandler  = require('./middleware/error');

dotenv.config({ path: './config/config.env'})

//Connect to db
connectDB();


//Route Files
const  bootcamps=require('./routes/bootcamps.js')
const  courses=require('./routes/courses.js')
const app =express();

app.use(express.json())

//Dev Logging middleware
if(process.env.NODE_ENV ==='development')
[
    app.use(morgan('dev'))
]

 

 const PORT =process.env.PORT || 7000;

 const server=app.listen(
     PORT,
     console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)     
 )
  
//handle unhandled promise rejections
process.on('unhandledRejection', (err,promise)=>{
    console.log(`Error: ${err.message}`.red);
    //close serverr and exit process
    server.close(() => process.exit(1));
})