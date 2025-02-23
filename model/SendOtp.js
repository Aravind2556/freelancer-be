const mongoose = require('mongoose')

const otpStoreSchema = new mongoose.Schema({

   Id : {type : Number , required : true , unique: true},
    Email : { type: String, required: true , lowercase: true, trim: true },
    Otp: { type: String, required: true },

    createdAt: { type: Date, default: Date.now, expires: 3600 }, // Expires in 5 minutes
});

const saveotptemp = mongoose.model('Registerotp',otpStoreSchema)

module.exports = saveotptemp  