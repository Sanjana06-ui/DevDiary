import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing   from './pages/Landing/Landing.jsx'
import Login     from './pages/Login/Login.jsx'
import Register  from './pages/Register/Register.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import AddEntry  from './pages/AddEntry/AddEntry.jsx'
import EditEntry from './pages/EditEntry/EditEntry.jsx'
import Profile   from './pages/Profile/Profile.jsx'
import NotFound  from './pages/NotFound/NotFound.jsx'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/"            element={<Landing />}   />
      <Route path="/login"       element={<Login />}     />
      <Route path="/register"    element={<Register />}  />
      <Route path="/dashboard"   element={<Dashboard />} />
      <Route path="/entries"     element={<Dashboard />} />
      <Route path="/add-entry"   element={<AddEntry />}  />
      <Route path="/edit-entry/:id" element={<EditEntry />} />
      <Route path="/profile"     element={<Profile />}   />
      <Route path="*"            element={<NotFound />}  />
    </Routes>
  )
}

export default AppRoutes
