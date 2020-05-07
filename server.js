 const express =require('express');
 const dotenv=require('dotenv')
 const morgan=require('morgan')
//Route Files
const  bootcamps=require('./routes/bootcamps.js')


 //Load env vars
 dotenv.config({ path: './config/config.env'})

 const app =express();

//Dev Logging middleware
if(process.env.NODE_ENV ==='development')
[
    app.use(morgan('dev'))
]

 //Mount Routers
app.use('/api/v1/bootcamps',bootcamps)

 const PORT =process.env.PORT || 7000;

 app.listen(
     PORT,
     console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)     
 )
  