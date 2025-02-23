const mongoose = require('mongoose');

const otpStoreSchema = new mongoose.Schema({
    Id: { type: Number, required: true, unique: true }, // Unique identifier for the OTP
    Email: { type: String, required: true, lowercase: true, trim: true }, // User's email
    Otp: { type: String, required: true }, // The OTP value
    createdAt: { type: Date, default: Date.now, expires: 300 } // Expires after 5 minutes (300 seconds)
});

// Create a Mongoose model
const saveotptemp = mongoose.model('Resetotp', otpStoreSchema);

module.exports = saveotptemp;