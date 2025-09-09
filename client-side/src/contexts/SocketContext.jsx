import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('🔌 Connected to server');
      });

      // Listen for project revival notifications
      newSocket.on('projectRevived', (data) => {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'revival',
          ...data,
          timestamp: new Date()
        }]);
      });

      // Listen for new comments
      newSocket.on('newComment', (data) => {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'comment',
          ...data,
          timestamp: new Date()
        }]);
      });

      // Listen for leaderboard updates
      newSocket.on('leaderboardUpdate', (data) => {
        // Trigger leaderboard refresh
        window.dispatchEvent(new CustomEvent('leaderboardUpdate', { detail: data }));
      });

      // Listen for admin notifications
      if (user.role === 'admin') {
        newSocket.on('adminNotification', (data) => {
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'admin',
            ...data,
            timestamp: new Date()
          }]);
        });
      }

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{
      socket,
      notifications,
      clearNotification,
      clearAllNotifications
    }}>
      {children}
    </SocketContext.Provider>
  );
};