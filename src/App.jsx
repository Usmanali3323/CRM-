
import './App.css'


import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

// import EmployeeRecordPage from './pages/admin/employeeRecord'
// import ApprovalSystemPage from './pages/admin/approvalSystem'
import LoginPage from './pages/auth/login'
// import Home from './pages/home'
import SignUpPage from './pages/auth/signup'
import UserDashboard from './pages/user/userDashboard'
import AttendancePage from './pages/user/attendance'
import LeavePage from './pages/user/leavePage'
import EmployeeApprovalPage from './pages/hr/employeeApproval'
import AttendanceAdminPage from './pages/hr/attendancePage'
import LeaveAdminPage from './pages/hr/leavePage'
import TaskAdmin from './pages/hr/task'
import EmployeeAttendance from './pages/employeeAttendance'
import EmployeeAttendancePage from './pages/employeeAttendance'



function App() {
 

  return (
    <>
    <BrowserRouter>

    <Routes>
       <Route path='/signup' element={<SignUpPage/>}/>
      <Route path='/login' element={<LoginPage/>}/> 
      <Route path='/dashboard' element={<UserDashboard/>}/>
      <Route path='/employee/attendance' element={<AttendancePage/>}/>
       <Route path='/employee/leave-requests' element={<LeavePage/>}/>

   {/* HR Routes*/}
    <Route path='/hr/employee-approval' element={<EmployeeApprovalPage/>}/>   
    <Route path='hr/attendance' element={<AttendanceAdminPage/>}/>
     <Route path='hr/attendance/:empId' element={<EmployeeAttendancePage/>}/>
    <Route path='/hr/leave-requests' element={<LeaveAdminPage/>}/>
    <Route path='/hr/tasks' element={<TaskAdmin/>}/>

    </Routes>
    <Toaster/>
    </BrowserRouter>
    </>
  )
}

export default App
