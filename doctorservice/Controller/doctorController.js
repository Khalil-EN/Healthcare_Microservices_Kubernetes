const Doctor = require('../Model/Doctor.js');



const getDoctors = async (req, res) => {
   const doctors = await Doctor.find().sort({createdAt: -1});
   console.log(doctors);
   res.status(200).json(doctors);
}

const getDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found' });
        }
    
        res.json(doctor); 

      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch doctor', error });
      }
    
}

const addDoctor = async (req, res) => {
    const newDoctor = req.body;
    console.log(newDoctor);
    try {
        const doctor = await Doctor.create(newDoctor);
        res.status(201).json(doctor);  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateDoctor = async (req, res) => {
    const modifs = req.body;
    try{
        const doctorId = req.params.id;
        const doctor = await Doctor.findByIdAndUpdate(doctorId, modifs, { new: true });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(doctor); 
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
}

const deleteDoctor = async (req, res) => {
    try{
        const doctorId = req.params.id;
        await Doctor.findByIdAndDelete(doctorId);  
        res.json({ message: 'Doctor deleted successfully'});   
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getDoctors,
    getDoctor,
    addDoctor,
    updateDoctor,
    deleteDoctor
}
