const mongoose = require("../DBconnection/db");

const groupSchema = mongoose.Schema({
    groupname:{
        type:String,
        required:true,
        unique:true
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }]
});

const Group = mongoose.model('groups',groupSchema);
module.exports = Group;