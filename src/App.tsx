import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Transactions from './pages/Transactions'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <TopBar />
        <Routes>
          <Route path="/" element={<Navigate to="/transactions" replace />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/home" element={<Placeholder title="Home" />} />
          <Route path="/cards" element={<Placeholder title="Cards" />} />
          <Route
            path="/payments/scheduled"
            element={<Placeholder title="Scheduled" />}
          />
          <Route
            path="/payments/direct-debits"
            element={<Placeholder title="Direct Debits" />}
          />
          <Route
            path="/payments/recurring-card"
            element={<Placeholder title="Recurring card payments" />}
          />
          <Route
            path="/payments/requests"
            element={<Placeholder title="Payment requests" />}
          />
          <Route
            path="/payments/bill-splits"
            element={<Placeholder title="Bill splits" />}
          />
          <Route path="/recipients" element={<Placeholder title="Recipients" />} />
          <Route path="/insights" element={<Placeholder title="Insights" />} />
          <Route path="*" element={<Navigate to="/transactions" replace />} />
        </Routes>
      </main>
    </div>
  )
}
