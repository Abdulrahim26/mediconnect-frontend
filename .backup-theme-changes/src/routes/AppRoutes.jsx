import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Unauthorized from '../pages/Unauthorized'
import Notifications from '../pages/Notifications'
import ProtectedRoute from '../components/ProtectedRoute'
import Layout from '../components/navigation/Layout'

import PatientDashboard from '../dashboards/PatientDashboard'
import DoctorDashboard from '../dashboards/DoctorDashboard'
import ReceptionistAppointments from '../dashboards/ReceptionistAppointments'
import ReceptionistDashboard from '../dashboards/ReceptionistDashboard'
import AdminDashboard from '../dashboards/AdminDashboard'
import SuperAdminDashboard from '../dashboards/SuperAdminDashboard'

import Doctors from '../pages/patient/Doctors'
import DoctorSearch from '../pages/patient/DoctorSearch'
import BookAppointment from '../pages/patient/BookAppointment'
import PatientAppointments from '../pages/patient/PatientAppointments'
import MedicalRecords from '../pages/patient/MedicalRecords'
import MedicalRecordDetails from '../pages/patient/MedicalRecordDetails'
import PatientVerification from '../pages/patient/PatientVerification'

import DoctorAppointments from '../pages/doctor/DoctorAppointments'
import DoctorWaitingQueue from '../pages/doctor/DoctorWaitingQueue'
import DoctorProfile from '../pages/doctor/DoctorProfile'
import DoctorMedicalRecords from '../pages/doctor/DoctorMedicalRecords'
import DoctorMedicalRecordDetails from '../pages/doctor/DoctorMedicalRecordDetails'
import CreateMedicalRecord from '../pages/doctor/CreateMedicalRecord'
import EditMedicalRecord from '../pages/doctor/EditMedicalRecord'

import AdminDoctors from '../pages/admin/Doctors'
import AdminDepartments from '../pages/admin/AdminDepartments'

import Hospitals from '../pages/super-admin/Hospitals'
import CreateHospital from '../pages/super-admin/CreateHospital'
import EditHospital from '../pages/super-admin/EditHospital'
import HospitalAdmins from '../pages/super-admin/HospitalAdmins'
import CreateHospitalAdmin from '../pages/super-admin/CreateHospitalAdmin'
import HospitalAdminDetails from '../pages/super-admin/HospitalAdminDetails'
import EditHospitalAdmin from '../pages/super-admin/EditHospitalAdmin'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


        {/* SHARED AUTHENTICATED ROUTES */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                'PATIENT',
                'DOCTOR',
                'RECEPTIONIST',
                'HOSPITAL_ADMIN',
                'SUPER_ADMIN',
              ]}
            >
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/notifications"
            element={<Notifications />}
          />
        </Route>


        {/* PATIENT */}

        <Route
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <Layout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/patient/dashboard"
            element={<PatientDashboard />}
          />

          <Route
            path="/patient/doctors"
            element={<Doctors />}
          />

          <Route
            path="/patient/doctors/details"
            element={<DoctorSearch />}
          />

          <Route
            path="/patient/book-appointment"
            element={<BookAppointment />}
          />

          <Route
            path="/patient/appointments"
            element={<PatientAppointments />}
          />

          <Route
            path="/patient/medical-records"
            element={<MedicalRecords />}
          />

          <Route
            path="/patient/medical-records/:id"
            element={<MedicalRecordDetails />}
          />

          <Route
            path="/patient/verification"
            element={<PatientVerification />}
          />

        </Route>


        {/* DOCTOR */}

        <Route
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <Layout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/doctor/dashboard"
            element={<DoctorDashboard />}
          />

          <Route
            path="/doctor/appointments"
            element={<DoctorAppointments />}
          />

          <Route
            path="/doctor/waiting"
            element={<DoctorWaitingQueue />}
          />

          <Route
            path="/doctor/profile"
            element={<DoctorProfile />}
          />

          <Route
            path="/doctor/medical-records"
            element={<DoctorMedicalRecords />}
          />

          <Route
            path="/doctor/medical-records/:id"
            element={<DoctorMedicalRecordDetails />}
          />

          <Route
            path="/doctor/medical-records/create"
            element={<CreateMedicalRecord />}
          />

          <Route
            path="/doctor/medical-records/:id/edit"
            element={<EditMedicalRecord />}
          />

        </Route>


        {/* RECEPTIONIST */}

        <Route
          element={
            <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
              <Layout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/receptionist/dashboard"
            element={<ReceptionistDashboard />}
          />

          <Route
            path="/receptionist/appointments"
            element={<ReceptionistAppointments />}
          />

        </Route>


        {/* HOSPITAL ADMIN */}

        <Route
          element={
            <ProtectedRoute allowedRoles={['HOSPITAL_ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/doctors"
            element={<AdminDoctors />}
          />

          <Route
            path="/admin/departments"
            element={<AdminDepartments />}
          />

        </Route>


        {/* SYSTEM ADMIN */}

        <Route
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/super-admin/dashboard"
            element={<SuperAdminDashboard />}
          />

          <Route
            path="/super-admin/hospitals"
            element={<Hospitals />}
          />

          <Route
            path="/super-admin/hospitals/create"
            element={<CreateHospital />}
          />

          <Route
            path="/super-admin/hospitals/:id/edit"
            element={<EditHospital />}
          />

          <Route
            path="/super-admin/hospital-admins"
            element={<HospitalAdmins />}
          />

          <Route
            path="/super-admin/hospital-admins/create"
            element={<CreateHospitalAdmin />}
          />

          <Route
            path="/super-admin/hospital-admins/:id/edit"
            element={<EditHospitalAdmin />}
          />

          <Route
            path="/super-admin/hospital-admins/:id"
            element={<HospitalAdminDetails />}
          />
        </Route>


        {/* DEFAULT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes