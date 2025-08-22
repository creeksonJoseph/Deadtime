import React, { createContext, useContext, useState } from 'react';

const CacheContext = createContext();

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

export const CacheProvider = ({ children }) => {
  const [cache, setCache] = useState({
    projects: {},
    users: {},
    leaderboard: null,
    userStats: {},
    projectNotes: {}
  });

  const getCachedData = (key, subKey = null) => {
    if (subKey) {
      return cache[key]?.[subKey];
    }
    return cache[key];
  };

  const setCachedData = (key, data, subKey = null) => {
    setCache(prev => {
      if (subKey) {
        return {
          ...prev,
          [key]: {
            ...prev[key],
            [subKey]: data
          }
        };
      }
      return {
        ...prev,
        [key]: data
      };
    });
  };

  const invalidateCache = (key, subKey = null) => {
    setCache(prev => {
      if (subKey) {
        const newKeyData = { ...prev[key] };
        delete newKeyData[subKey];
        return {
          ...prev,
          [key]: newKeyData
        };
      }
      return {
        ...prev,
        [key]: key === 'projects' ? {} : key === 'users' ? {} : key === 'userStats' ? {} : key === 'projectNotes' ? {} : null
      };
    });
  };

  const clearCache = () => {
    setCache({
      projects: {},
      users: {},
      leaderboard: null,
      userStats: {},
      projectNotes: {}
    });
  };

  return (
    <CacheContext.Provider value={{
      getCachedData,
      setCachedData,
      invalidateCache,
      clearCache
    }}>
      {children}
    </CacheContext.Provider>
  );
};