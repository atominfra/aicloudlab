import ProtectedRoute from '../components/protectedRoute'

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="">
        <main className="">{children}</main>
      </div>
    </ProtectedRoute>
  )
}