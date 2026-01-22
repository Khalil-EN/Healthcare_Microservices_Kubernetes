const Appointment = require('../Model/Appointment');


const { validateDoctor, validatePatient } = require('../kafka/validators');


const getAppointments = async (req, res) => {
   const appointments = await Appointment.find().sort({createdAt: -1});
   res.status(200).json(appointments);
}

const getAppointment = async (req, res) => {
    try {
        const AppointmentId = req.params.id;
        const appointment = await Appointment.findById(AppointmentId);
        if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
        }
    
        res.json(appointment); 

      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Appointment', error });
      }
    
}

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, patientName, doctorName, specialization, date, time } = req.body;

    const doctorValid = await validateDoctor(doctorId);
    if (!doctorValid){
      return res.status(400).json({ message: "Invalid doctor ID" });
    } 

    const patientValid = await validatePatient(patientId);
    if (!patientValid){
      return res.status(400).json({ message: "Invalid patient ID" });
    } 

    const existingAppointment = await Appointment.findOne({ doctorId, patientId, date });
    if (existingAppointment) {
      return res.status(400).json({ message: "Appointment already exists for this doctor, patient, and date." });
    }

    const appointment = await Appointment.create({ patientId, doctorId, patientName, doctorName,
      specialization, date, time,});

    res.status(201).json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateAppointment = async (req, res) => {
    const updates = req.body;
    try{
        const AppointmentId = req.params.id;
        const appointment = await Appointment.findByIdAndUpdate(AppointmentId, updates, { new: true });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment); 
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
}

const deleteAppointment = async (req, res) => {
    try{
        const appointmentId = req.params.id;
        await Appointment.findByIdAndDelete(appointmentId);  
        res.json({ message: 'Appointment deleted successfully'});   
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment
}
