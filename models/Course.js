const mongoose =require('mongoose');

const CourseSchema= new mongoose.Schema({
    title:{
        type: String,
        trim:true,
        required: [true, 'Please add a course title']
    },
    description: {
        type:String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type:String,
        required:[true, 'Please add no. of weeks']
    },
    tuition: {
        type:Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner','intermediate','advanced']
    },
    scholarshipAvailable:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type:Date,
        default: Date.now
    },

     bootcamp: {
         //objectId of Bootcamp schema
         type: mongoose.Schema.ObjectId,
         //refers Bootcamp schema
         ref: 'Bootcamp',
         required:true
     }
})
//static method for average of course tuition
CourseSchema.statics.getAverageCost =async function(bootcampId){
    console.log('Calculating avg cost..'.blue)
   
    const obj = await this.aggregate([
          {
              $match: {bootcamp: bootcampId}
          },
          {
              $group:{
                  _id: '$bootcamp',
                  averageCost: {
                      $avg: '$tuition'
                  }
              }
          }
    ])

//     console.log(obj)

  //  put in db
  try {
     await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
         averageCost: Math.ceil(obj[0].averageCost/10)*10
     }) 
  } catch (err) {
      console.log(err)
  }

}


//Call getAverageCost after save
 CourseSchema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp)
 })

 //Call getAverageCost before remove
 CourseSchema.pre('remove', function(){
    this.constructor.getAverageCost(this.bootcamp)
})


module.exports = mongoose.model('Course', CourseSchema)