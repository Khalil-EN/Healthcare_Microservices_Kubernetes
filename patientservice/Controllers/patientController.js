const Patient = require('../Models/Patient.js');



const getPatients = async (req, res) => {
   const patients = await Patient.find().sort({createdAt: -1});
   res.status(200).json(patients);
}

const getPatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const patient = await Patient.findById(patientId);
        if (!patient) {
          return res.status(404).json({ message: 'Patient not found' });
        }
    
        res.json(patient); 

      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch patient', error });
      }
    
}

const createPatient = async (req, res) => {
    const newPatient = req.body;
    try {
        const patient = await Patient.create(newPatient);
        res.status(201).json(patient);  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updatePatient = async (req, res) => {
    const updates = req.body;
    console.log(updates);
    try{
        const patientId = req.params.id;
        const patient = await Patient.findByIdAndUpdate(patientId, updates, { new: true });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json(patient); 
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
}

const deletePatient = async (req, res) => {
    try{
        const patientId = req.params.id;
        await Patient.findByIdAndDelete(patientId);  
        res.json({ message: 'Patient deleted successfully'});   
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient
}
