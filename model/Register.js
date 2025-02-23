const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
    Id: { type: Number, required: true, unique: true  },
    Name: { type: String, required: true, trim: true },
    Role: { type: String, enum: ["Admin", "Freelancer", "Company"], required: true },
    Contact: { type: String, required: true, trim: true },
    Email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    Password: { type: String, required: true },
    Qualification : {type : String},
    Skills : {type : String},
    Experience : {type : String},
    Linkedin : {type : String},
    Company : {type : String},
    Ratings : [{type: Number}],
    CompletedJobs : [{type : Number , default : 0}]


}, { timestamps: true });



const RegisterModel = mongoose.model("Register", RegisterSchema);

module.exports = RegisterModel;



