import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import ManagerLayout from './pages/manager/ManagerLayout'
import Dashboard from './pages/manager/Dashboard'
import Properties from './pages/manager/Properties'
import PropertyDetail from './pages/manager/PropertyDetail'
import Contractors from './pages/manager/Contractors'
import Tasks from './pages/manager/Tasks'
import Schedule from './pages/manager/Schedule'
import ProviderLayout from './pages/provider/ProviderLayout'
import ProviderHome from './pages/provider/ProviderHome'
import ProviderTasks from './pages/provider/ProviderTasks'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Property Manager portal */}
      <Route path="/manager" element={<ManagerLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="contractors" element={<Contractors />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="schedule" element={<Schedule />} />
      </Route>

      {/* Service Provider portal */}
      <Route path="/provider" element={<ProviderLayout />}>
        <Route index element={<ProviderHome />} />
        <Route path="tasks" element={<ProviderTasks />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
