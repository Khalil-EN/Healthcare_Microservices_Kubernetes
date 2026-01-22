import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Doctor Components
import DoctorList from './components/Doctors/DoctorList';
import AddDoctor from './components/Doctors/AddDoctor';
import EditDoctor from './components/Doctors/EditDoctor';
import DoctorDetails from './components/Doctors/DoctorDetails';

// Patient Components
import PatientList from './components/Patients/PatientList';
import AddPatient from './components/Patients/AddPatient';
import EditPatient from './components/Patients/EditPatient';
import PatientDetails from './components/Patients/PatientDetails';

// Appointment Components
import AppointmentList from './components/Appointments/AppointmentList';
import CreateAppointment from './components/Appointments/CreateAppointment';
import EditAppointment from './components/Appointments/EditAppointment';
import AppointmentDetails from './components/Appointments/AppointmentDetails';

import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <Routes>

      <Route path="/" element={<LandingPage />} />


        {/* Doctor Routes */}
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/doctors/add" element={<AddDoctor />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route path="/doctors/:id/edit" element={<EditDoctor />} />

        {/* Patient Routes */}
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/add" element={<AddPatient />} />
        <Route path="/patients/:id" element={<PatientDetails />} />
        <Route path="/patients/:id/edit" element={<EditPatient />} />

        {/* Appointment Routes */}
        <Route path="/appointments" element={<AppointmentList />} />
        <Route path="/appointments/add" element={<CreateAppointment />} />
        <Route path="/appointments/:id" element={<AppointmentDetails />} />
        <Route path="/appointments/:id/edit" element={<EditAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;

