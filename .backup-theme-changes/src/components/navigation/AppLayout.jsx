import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const location = useLocation()

  // ======================================================
  // CLOSE MOBILE SIDEBAR WHEN ROUTE CHANGES
  // ======================================================

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // ======================================================
  // PREVENT BODY SCROLL WHEN MOBILE SIDEBAR IS OPEN
  // ======================================================

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // ======================================================
  // OPEN MOBILE SIDEBAR
  // ======================================================

  const handleOpenMenu = () => {
    setMobileOpen(true)
  }

  // ======================================================
  // CLOSE MOBILE SIDEBAR
  // ======================================================

  const handleCloseMenu = () => {
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="flex">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <Sidebar
          mobileOpen={mobileOpen}
          onClose={handleCloseMenu}
        />

        {/* ==================================================
            MAIN APPLICATION AREA
        ================================================== */}

        <div className="flex min-w-0 flex-1 flex-col">

          {/* ==================================================
              TOP BAR
          ================================================== */}

          <TopBar
            onMenuClick={handleOpenMenu}
          />

          {/* ==================================================
              PAGE CONTENT
          ================================================== */}

          <main className="min-w-0 flex-1">

            <Outlet />

          </main>

        </div>

      </div>

    </div>
  )
}

export default AppLayout
