const express = require('express');

const port = 8002;
const app = express();

const path = require('path')


const mongoose = require('mongoose');
mongoose.connect(
    'mongodb+srv://dodiyaharsh99:dodiyaharsh@cluster0.zqnwysw.mongodb.net/harsh',
    {useNewUrlParser:true})
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch(()=>{
        console.log("Couldn't connect to MongoDB");
  })

const student =require('./models/Student');

const fs = require('fs');
app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));
app.use("/uploads",express.static(path.join(__dirname,'uploads')));

app.use(express.urlencoded());

app.get("/",function(req,res){
      return res.render('add_details');
})

app.post("/addstudent",student.uploadimg,async function(req,res){
    // return res.render(res.body);
     console.log(req.file)
     console.log(req.body)

     var imgpath = '';
     if(req.file){
        imgpath = student.imgmodelpath+"/"+req.file.filename;
     }
        req.body.adminimg =imgpath;
    let data = await student.create(req.body);
    if(data){
         console.log("record insert")
         return res.redirect('back');
    }
    else{
          console.log("something wrong");
          return res.redirect('back')
    }

})

app.get("/view_details", async function(req,res){
     let data = await student.find({});
     console.log(data);
     return res.render('view_details',{
         stdata : data,
     })
})

app.get("/deletestudent/:id",async function(req,res){
        // console.log(req.params.id)
        let olddata = await student.findById(req.params.id);
        var fullpath = '';
         if(olddata.adminimg){
              fullpath =path.join(__dirname,olddata.adminimg);
            //  console.log(fullpath);
            await fs.unlinkSync(fullpath);
         }
        await student.findByIdAndDelete(req.params.id);
        return res.redirect("back");

});

app.get("/updatestudent/:id", async function(req,res){
      let record = await student.findById(req.params.id);
      return res.render("update_details",{
         oldst : record,
      })
})

app.post("/editestudent",student.uploadimg ,async function(req,res){

          
      if(req.file){
        let olddata =await student.findById(req.body.id); 
        var fullpath = '';
        if(olddata.adminimg){
             fullpath =path.join(__dirname,olddata.adminimg);
           //  console.log(fullpath);
           await fs.unlinkSync(fullpath);

           var imgpath  ;
           imgpath = student.imgmodelpath+"/"+req.file.filename;
           req.body.adminimg =imgpath;

           await student.findByIdAndUpdate(req.body.id,req.body);
           return res.redirect("/view_details");

      }
      else{
        let olddata =await student.findById(req.body.id);
        req.body.adminimg =olddata.adminimg;
      await student.findByIdAndUpdate(req.body.id,req.body);
        return res.redirect("/view_details");
      }
     
    // await student.findByIdAndUpdate(req.body.id,req.body);
    // return res.redirect("/view_details");
      }
    })
app.listen(port, function (err) {
    if (err) {
        console.log("something wrong")
        return false;
    }
    console.log(`connected....${port}`);
});