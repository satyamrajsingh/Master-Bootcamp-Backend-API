//asyncHandler isa wrapping function,for controller that reolves the middleware ,else calls on next in case of error
const asyncHandler = fn =>(req,res,next)=>
 Promise
    .resolve(fn(req,res,next))
    .catch(next)

module.exports = asyncHandler;
    