import ProtectedRoute from '../components/ProtectedRoute'

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex">
        <main className="flex-1 p-4">{children}</main>
      </div>
    </ProtectedRoute>
  )
}