const Bootcamp=require('../models/Bootcamp')
const ErrorResponse =require('../utils/errorResponse')
const asyncHandler=require('../middleware/async')
const geocoder= require('../utils/geocoder')
//@desc    get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps =asyncHandler(async (req,res,next) =>{

     let query;
    
     //copy req.query
     const reqQuery ={ ...req.query}

     //fields to exclude
     const removeFields = ['select','sort','page','limit']

    //loop over removeFields and delete them from reqQuery
      removeFields.forEach(param =>delete reqQuery[param])

    

 //Note-> reqQuery ka select and sort wala param delete kiye h,but req.query me abi b h

    //Create queryString(bacha hua params k lyeh ye)
     let queryStr=JSON.stringify(reqQuery);
          
    //create operators($gt,$gte etc) 
     queryStr= queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    
     //finding resource
     query= Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    //  console.log(`query=${(query)}`)

     //select Fields
     if(req.query.select)
     {
         //, hata k usk fields ko normal space wala bnae
         const fields =req.query.select.split(',').join(' ');
         //query will now be modified to contn only the fields present in select field
         query=query.select(fields)
     }

     //sort
     if(req.query.sort)
     {
         const sortBy = req.query.sort.split(',').join(' ')
         query=query.sort(sortBy);
     }else{
         query=query.sort('-createdAt')
     }
      
     //Pagination
     const page= parseInt(req.query.page,10)||1
     const limit =parseInt(req.query.limit,10)||1
     const startIndex=(page-1)*limit
     const endIndex=page*limit
     const total= await Bootcamp.countDocuments()
        console.log(`total=${total}`)
 
      query=query.skip(startIndex).limit(limit)

     //executing query
     const bootcamps= await query;

     console.log(bootcamps);

     //pagination result
      const pagination={}

      if(endIndex < total)
      {
          pagination.next = {
              page:page+1,
              limit
          }
      }

      if(startIndex > 0)
      {
          pagination.prev={
              page:page-1,
              limit
          }
      }

    
     res.status(200).json({success: true,count: bootcamps.length,pagination,data: bootcamps});

 })



//@desc     get single bootcamp
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp =asyncHandler(async (req,res,next) =>{
    
       const bootcamp= await Bootcamp.findById(req.params.id);
       res.status(200).json({success: true,data: bootcamp});

        //in case there is tinker with the id
       if(!bootcamp)
       {
          return  next(new ErrorResponse(`Bootcamp was not found with id of ${req.params.id}`,404))
       }  
})

//@desc     Create new Bootcamp
//@route    POST /api/v1/bootcamps
//@access   Public
exports.createBootcamp =asyncHandler(async (req,res,next) =>{   
    //every mongoose method returns a promise
  
        const bootcamp=await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp
        });
 
})

//@desc     update Bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Public
exports.updateBootcamp =asyncHandler(async (req,res,next) =>{
  
       const bootcamp= await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        });     
       if(!bootcamp)
       {
        return  next(new ErrorResponse(`Bootcamp was not found with id of ${req.params.id}`,404))
       }

       res.status(200).json({success: true,data: bootcamp});
   
})


//@desc     Delete Bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Public
exports.deleteBootcamp =asyncHandler(async (req,res,next) =>{
  
        const bootcamp= await Bootcamp.findById(req.params.id);     
       if(!bootcamp)
       {  
           return  next(new ErrorResponse(`Bootcamp was not found with id of ${req.params.id}`,404))
       }
       bootcamp.remove()
       res.status(200).json({success: true,data: {}});
})



//@desc     Get Bootcamps within a radius
//@route    DELETE /api/v1/bootcamps/:zipcode/:distance
//@access   Private
exports.getBootcampsInRadius=asyncHandler(async (req,res,next) =>{
    const {zipcode,distance} =req.params
     
    //get lat/lng from geocoder
    const loc= await geocoder.geocode(zipcode);
    const lat=loc[0].latitude
    const lng=loc[0].longitude

    //Calc radius using radians
    //divide dist/radius of earth
    //Earths r=3963 miles||6,378km
    const radius = distance / 3963

    const bootcamps= await Bootcamp.find({
        location: { $geoWithin : {$centerSphere: [[lng,lat],radius]}}
    })
   
   res.status(200).json({
       success: true,
       count: bootcamps.length,
       data: bootcamps
    });
})