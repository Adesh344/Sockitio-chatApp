const mongoose = require("../DBconnection/db");

const userSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    Active:{
        type:String,
        default:'0'
    },
});

const User = mongoose.model('users',userSchema);

module.exports = User;
