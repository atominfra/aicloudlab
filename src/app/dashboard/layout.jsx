import ProtectedRoute from '../../components/protectedRoute'

export default function DashboardLayout({ children }) {
  return <>
     {/* <ProtectedRoute> */}
      <div>
        <main>{children}</main>
      </div>
    {/* </ProtectedRoute> */}
    </>
  
}