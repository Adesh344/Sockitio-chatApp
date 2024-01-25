const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://adesh:12345@cluster0.2oki501.mongodb.net/Chatapp")
.then(()=>{
    console.log("Mongodb connected");
})
.catch(()=>{
    console.log("Connection error");
});

module.exports=mongoose;