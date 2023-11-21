const mongoose = require('mongoose');
const multer = require('multer');

const  imgpath = "/uploads";
const path = require("path")

const Students = mongoose.Schema({
         name :{
                type : String,
                required :true
         },
         age :{
            type : Number,
            required :true
     },
     gender :  {
       type : String,
       required : true
   },
   hobby : {
       type : Array,
       required : true
   },
   citys : {
       type : String,
       required : true
   },
   adminimg : {
        type : String,
        required : true

     }
               
     
    });

const storage = multer.diskStorage({
         destination : function(req,file,cb){
               cb(null,path.join(__dirname,"..",imgpath))
         },
         filename:function (req , file , cb) {
              cb(null,file.fieldname+"-"+Date.now())
         }

})  
    
Students.statics.uploadimg = multer({storage : storage}).single('addimage')
Students.statics.imgmodelpath = imgpath;

const Student = mongoose.model('student',Students);
module.exports = Student;
