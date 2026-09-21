 import AppLayout from './AppLayout'
import { NotificationProvider } from './NotificationContext'

function Layout() {
  return (
    <NotificationProvider>
      <AppLayout />
    </NotificationProvider>
  )
}

export default Layout