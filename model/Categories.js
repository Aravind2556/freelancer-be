const mongoose = require('mongoose')

const categoriesSchema = new mongoose.Schema({
    Id : {type : Number , required : true , unique : true},
    Jobname : {type : String , required : true , unique : true},
    Jobdescription : {type : String , required : true },
},{ timestamps: true });

const categoriesmodel = mongoose.model('categories',categoriesSchema)

module.exports = categoriesmodel

    




