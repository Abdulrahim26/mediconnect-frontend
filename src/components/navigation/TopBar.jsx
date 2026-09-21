import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { useNotifications } from './NotificationContext'

function TopBar({ onMenuClick }) {
  const navigate = useNavigate()
  const { user, role, logout } = useAuth()
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications()

  const [showNotifications, setShowNotifications] = useState(false)

  const getRoleName = () => {
    switch (role) {
      case 'PATIENT':
        return 'Patient'

      case 'DOCTOR':
        return 'Doctor'

      case 'RECEPTIONIST':
        return 'Receptionist'

      case 'HOSPITAL_ADMIN':
        return 'Hospital Administrator'

      case 'SUPER_ADMIN':
        return 'System Administrator'

      default:
        return 'User'
    }
  }

  const getUserName = () => {
    if (user?.fullName) {
      return user.fullName
    }

    if (user?.name) {
      return user.name
    }

    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim()
    }

    if (user?.username) {
      return user.username
    }

    if (user?.email) {
      return user.email
    }

    return 'User'
  }

  const getInitials = () => {
    const name = getUserName()

    if (!name) {
      return 'U'
    }

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean)

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase()
    }

    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
      .toUpperCase()
  }

  const formatNotificationType = (type) => {
    if (!type) {
      return 'Notification'
    }

    return type
      .toString()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase())
  }

  const recentNotifications = notifications.slice(0, 5)

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id)
    }

    setShowNotifications(false)
    navigate('/notifications')
  }

  const handleViewAllNotifications = () => {
    setShowNotifications(false)
    navigate('/notifications')
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleLogout = () => {
    const confirmed = window.confirm(
      'Are you sure you want to log out of MediConnect?',
    )

    if (!confirmed) {
      return
    }

    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-blue-100 bg-white">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* MOBILE MENU + BRAND */}

        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-700 transition hover:bg-blue-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            ☰
          </button>

          <div className="min-w-0 lg:hidden">
            <p className="truncate text-base font-bold text-slate-900">
              MediConnect
            </p>

            <p className="truncate text-xs font-medium text-blue-600">
              Healthcare Management
            </p>
          </div>
        </div>

        {/* DESKTOP PAGE CONTEXT */}

        <div className="hidden min-w-0 flex-1 lg:block">
          <p className="text-sm font-semibold text-blue-600">
            MediConnect
          </p>

          <p className="truncate text-xs text-slate-500">
            Healthcare Management System
          </p>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* NOTIFICATIONS */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowNotifications((previous) => !previous)
              }
              className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg text-blue-700 transition hover:bg-blue-100"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              🔔

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/60 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Notifications
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {unreadCount > 0
                        ? `${unreadCount} unread notification${
                            unreadCount === 1 ? '' : 's'
                          }`
                        : 'You are all caught up'}
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-xs font-semibold text-blue-600 transition hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {recentNotifications.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-lg">
                      🔔
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      New notifications will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {recentNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                        className={`w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-blue-50 ${
                          notification.read
                            ? 'bg-white'
                            : 'bg-blue-50/40'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-700">
                            🔵
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-xs font-semibold text-blue-700">
                                {formatNotificationType(
                                  notification.type,
                                )}
                              </p>

                              {!notification.read && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                              )}
                            </div>

                            <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-800">
                              {notification.title ||
                                notification.message ||
                                'New notification'}
                            </p>

                            {notification.title &&
                              notification.message && (
                                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                  {notification.message}
                                </p>
                              )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="border-t border-blue-100 bg-slate-50 px-4 py-3">
                  <button
                    type="button"
                    onClick={handleViewAllNotifications}
                    className="w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* USER */}

          <div className="hidden items-center gap-3 border-l border-blue-100 pl-3 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {getInitials()}
            </div>

            <div className="hidden min-w-0 xl:block">
              <p className="max-w-48 truncate text-sm font-semibold text-slate-900">
                {getUserName()}
              </p>

              <p className="max-w-48 truncate text-xs font-medium text-blue-600">
                {getRoleName()}
              </p>
            </div>
          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <span className="text-base">↪</span>

            <span className="hidden md:inline">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopBar