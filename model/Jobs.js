const mongoose = require('mongoose');

const JobsSchema = new mongoose.Schema({

    Id : {type : Number , required : true , unique : true},
    Title : {type : String , required : true },
    Description : {type : String , required : true},
    CategoryId : {type : Number , required : true},
    Price : {type : Number , required : true},
    CreaterId : {type : Number , require : true},
    AssignedTo : {type : Number},   
    Interests : [{type: Number}],
    Status : {type : String , default : "Open" },
}, {timestamps : true})

const modelJobs = mongoose.model("Job",JobsSchema)

module.exports = modelJobs
