const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1/harsh");
const db = mongoose.connection;

db.once('open',function(err){
     if(err){
         console.log("db is not conect");
     }
     console.log(`db is conected`);

})
module.exports =db;