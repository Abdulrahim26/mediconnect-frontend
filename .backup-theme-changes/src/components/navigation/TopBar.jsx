import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { useNotifications } from './NotificationContext'

function getRoleName(role) {
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

function getUserName(user, role) {
  if (!user) {
    return getRoleName(role)
  }

  if (user.fullName) {
    return user.fullName
  }

  if (user.name) {
    return user.name
  }

  const fullName = [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(' ')

  if (fullName) {
    return fullName
  }

  if (user.username) {
    return user.username
  }

  if (user.email) {
    return user.email
  }

  return getRoleName(role)
}

function getInitials(user, role) {
  const name = getUserName(user, role)

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
  }

  return (
    words[0]?.substring(0, 2).toUpperCase() ||
    'U'
  )
}

function formatNotificationType(type) {
  if (!type) {
    return 'Notification'
  }

  return type
    .replaceAll('_', ' ')
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase(),
    )
}

function TopBar({ onMenuClick }) {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications()

  const [notificationOpen, setNotificationOpen] = useState(false)

  const userName = getUserName(user, role)
  const roleName = getRoleName(role)
  const initials = getInitials(user, role)

  const recentNotifications = notifications.slice(0, 5)

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
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-mc-100 bg-white px-4 py-3 md:px-6">

      {/* LEFT SIDE */}

      <div className="flex items-center gap-3">

        {/* MOBILE MENU */}

        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-mc-50 lg:hidden"
          aria-label="Open navigation"
        >
          ☰
        </button>

        {/* MOBILE BRAND */}

        <div className="lg:hidden">
          <p className="text-lg font-bold text-slate-900">
            MediConnect
          </p>

          <p className="hidden text-[10px] text-slate-400 sm:block">
            Healthcare Management
          </p>
        </div>

        {/* DESKTOP TITLE */}

        <div className="hidden lg:block">
          <p className="text-sm font-medium text-slate-500">
            MediConnect
          </p>

          <p className="text-xs text-slate-400">
            Healthcare Management
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center gap-2 sm:gap-3">

        {/* NOTIFICATION BELL */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setNotificationOpen(
                (previous) => !previous,
              )
            }
            className={`
                relative rounded-xl p-2.5
                transition
                ${
                  notificationOpen
                    ? 'bg-mc-50 text-mc-700'
                    : 'text-slate-600 hover:bg-mc-50'
                }
              `}
            aria-label="Notifications"
            aria-expanded={notificationOpen}
          >
            <span className="text-xl">
              🔔
            </span>

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9
                  ? '9+'
                  : unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN */}

          {notificationOpen && (
            <>
              <button
                type="button"
                aria-label="Close notifications"
                onClick={() =>
                  setNotificationOpen(false)
                }
                className="fixed inset-0 z-40 bg-transparent"
              />

              <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-mc-100 bg-white shadow-xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Notifications
                    </h3>

                    {unreadCount > 0 && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {unreadCount}{' '}
                        unread notification
                        {unreadCount !== 1
                          ? 's'
                          : ''}
                      </p>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-mc-600 transition hover:text-mc-700"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* NOTIFICATIONS */}

                <div className="max-h-80 overflow-y-auto">

                  {recentNotifications.length === 0 ? (
                    <div className="p-8 text-center">

                      <div className="mb-2 text-3xl">
                        🔔
                      </div>

                      <p className="text-sm font-medium text-slate-700">
                        No notifications yet
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        You're all caught up.
                      </p>

                    </div>
                  ) : (
                    recentNotifications.map(
                      (notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => {
                            if (
                              !notification.readStatus
                            ) {
                              markAsRead(
                                notification.id,
                              )
                            }
                          }}
                          className={`
                              w-full border-b border-slate-100
                              px-4 py-3 text-left
                              transition hover:bg-mc-50
                              ${
                                notification.readStatus
                                  ? 'bg-white'
                                  : 'bg-mc-50'
                              }
                            `}
                        >

                          <div className="flex items-start gap-3">

                            <span className="mt-0.5">
                              {notification.readStatus
                                ? '🔔'
                                : '🔵'}
                            </span>

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <p className="text-sm font-semibold text-slate-900">
                                  {formatNotificationType(
                                    notification.type,
                                  )}
                                </p>

                                {!notification.readStatus && (
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-mc-600" />
                                )}

                              </div>

                              <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                                {notification.message}
                              </p>

                              {notification.createdAt && (
                                <p className="mt-1 text-[11px] text-slate-400">
                                  {new Date(
                                    notification.createdAt,
                                  ).toLocaleString()}
                                </p>
                              )}

                            </div>

                          </div>

                        </button>
                      ),
                    )
                  )}

                </div>

                {/* FOOTER */}

                <div className="border-t border-slate-200 p-2">

                  <button
                    type="button"
                    onClick={() => {
                      setNotificationOpen(false)
                      navigate('/notifications')
                    }}
                    className="w-full rounded-lg bg-mc-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-mc-100"
                  >
                    View all notifications
                  </button>

                </div>

              </div>
            </>
          )}

        </div>

        {/* USER INFORMATION */}

        <div className="hidden text-right sm:block">

          <p className="max-w-48 truncate text-sm font-semibold text-slate-900">
            {userName}
          </p>

          <p className="text-xs text-slate-500">
            {roleName}
          </p>

        </div>

        {/* AVATAR */}

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700"
          title={userName}
        >
          {initials}
        </div>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4"
        >
          <span className="hidden sm:inline">
            Logout
          </span>

          <span className="sm:hidden">
            ↪
          </span>
        </button>

      </div>

    </header>
  )
}

export default TopBar