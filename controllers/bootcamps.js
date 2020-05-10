const Bootcamp=require('../models/Bootcamp')


//@desc    get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps =async (req,res,next) =>{

 try {
     const bootcamps= await Bootcamp.find();
     res.status(200).json({success: true,count: bootcamps.length,data: bootcamps});
 } catch (error) {
    res.status(400).json({
        success: false,
        err: error
    })
 }

}

//@desc     get single bootcamp
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp =async (req,res,next) =>{
    try {
        const bootcamp= await Bootcamp.findById(req.params.id);
        res.status(200).json({success: true,data: bootcamp});

        //in case there is tinker with the id
       if(!bootcamp)
       {
           res.status(400).json({success: false})
       }

    } catch (error) {
    //    res.status(400).json({
    //        success: false,
    //        err: error
    //    })
     next(err)
    }
}

//@desc     Create new Bootcamp
//@route    POST /api/v1/bootcamps
//@access   Public
exports.createBootcamp =async (req,res,next) =>{   
    //every mongoose method returns a promise
    try {
        const bootcamp=await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            err: error
        })
    }
   
}

//@desc     update Bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Public
exports.updateBootcamp =async (req,res,next) =>{
    try {
        const bootcamp= await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        });     
       if(!bootcamp)
       {
           res.status(400).json({success: false})
       }

       res.status(200).json({success: true,data: bootcamp});

    } catch (error) {
       res.status(400).json({
           success: false,
           err: error
       })
    }
}


//@desc     Delete Bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Public
exports.deleteBootcamp =async (req,res,next) =>{
    try {
        const bootcamp= await Bootcamp.findByIdAndDelete(req.params.id);     
       if(!bootcamp)
       {
           res.status(400).json({success: false})
       }
       bootcamp.remove()
       res.status(200).json({success: true,data: {}});

    } catch (error) {
       res.status(400).json({
           success: false,
           err: error
       })
    }
}
