const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    specialization: { type: String }, //
    yearsOfExperience: { type: Number, min: 0 }, //
    availability: [{ type: String }], //
    address: { type: String },
    status: { type: String, default: 'Active' }, //
  }, { timestamps: true });
  

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
