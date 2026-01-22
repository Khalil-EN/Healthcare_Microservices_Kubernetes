const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String , required: true },
    doctorName: { type: String, required: true },
    specialization: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
  },
  { timestamps: true }
);

// Ensure uniqueness of doctor, patient, and date
appointmentSchema.index({ doctorId: 1, patientId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
