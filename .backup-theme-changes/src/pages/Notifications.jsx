import { useNotifications } from '../components/navigation/NotificationContext'

function formatNotificationType(type) {
  if (!type) {
    return 'Notification'
  }

  return type
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function Notifications() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications()

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            Loading notifications...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View your latest MediConnect notifications.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* EMPTY STATE */}

      {!error && notifications.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <div className="mb-3 text-4xl">
            🔔
          </div>

          <h2 className="font-semibold text-slate-900">
            No notifications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            You don't have any notifications yet.
          </p>
        </div>
      )}

      {/* NOTIFICATIONS */}

      {notifications.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-b border-slate-100 p-5 last:border-b-0 ${
                notification.readStatus
                  ? 'bg-white'
                  : 'bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* ICON */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  {notification.readStatus ? '🔔' : '🔵'}
                </div>

                {/* CONTENT */}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-slate-900">
                      {formatNotificationType(
                        notification.type,
                      )}
                    </h3>

                    {!notification.readStatus && (
                      <span className="text-xs font-semibold text-blue-600">
                        Unread
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    {notification.message}
                  </p>

                  {notification.createdAt && (
                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(
                        notification.createdAt,
                      ).toLocaleString()}
                    </p>
                  )}

                  {!notification.readStatus && (
                    <button
                      type="button"
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                      className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications