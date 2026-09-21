import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import api from '../../api/axios'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNotifications = useCallback(async () => {
    try {
      setError('')

      const response = await api.get('/notifications')

      const data = Array.isArray(response.data)
        ? response.data
        : []

      setNotifications(data)

      setUnreadCount(
        data.filter(
          (notification) =>
            notification.readStatus === false,
        ).length,
      )
    } catch (error) {
      console.error(
        'Load notifications error:',
        error,
      )

      if (error.response?.status === 401) {
        setNotifications([])
        setUnreadCount(0)
        return
      }

      setError(
        error.response?.data?.message ||
          'Unable to load notifications.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        await api.put(
          `/notifications/${notificationId}/read`,
        )

        setNotifications((previous) =>
          previous.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  readStatus: true,
                }
              : notification,
          ),
        )

        setUnreadCount((previous) =>
          Math.max(previous - 1, 0),
        )
      } catch (error) {
        console.error(
          'Mark notification as read error:',
          error,
        )
      }
    },
    [],
  )

  const markAllAsRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all')

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          readStatus: true,
        })),
      )

      setUnreadCount(0)
    } catch (error) {
      console.error(
        'Mark all notifications as read error:',
        error,
      )
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}