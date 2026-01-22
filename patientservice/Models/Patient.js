const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female'] },
    bloodType: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    lastVisit: { type: Date, required: true },
    phase: { type: String, required: true, enum: ['consulting', 'treatment', 'diagnosis', 'follow-up'] },
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
