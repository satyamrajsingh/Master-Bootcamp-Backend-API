const ErrorResponse=require('../utils/errorResponse')

const errorHandler =(err, req,res,next)=>{
   //creating copy of error
    let error= {...err} 
    error.message= err.message

    //log to console for dev
    console.log(err);

    //mongoose bad object id
   if(err.name === 'CastError'){
       const message =`Bootcamp was not found with id of ${err.value}`
       //asssign value of error = the one exported by errorResponse
       error=new ErrorResponse(message,404)
   }
    //mongoose duplicate key
    if(err.code === 11000)
    {
        const message= 'Duplicate field value entered'
        error=new ErrorResponse(message,400)
    }

    if(err.name === 'ValidationError')
    {
        const message=Object.values(err.errors).map(val => val.message)
        error =new ErrorResponse(message,400)
    }

    res.status(error.statusCode || 500).json({
        success:false,
        error: error.message || 'Server Error'
    })
}

module.exports =errorHandler;

