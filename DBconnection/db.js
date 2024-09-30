const mongoose = require("mongoose");

mongoose.connect("Add Your Key here")
.then(()=>{
    console.log("Mongodb connected");
})
.catch(()=>{
    console.log("Connection error");
});

module.exports=mongoose;
