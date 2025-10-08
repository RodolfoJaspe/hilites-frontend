import React, { createContext, useCallback, useContext, useState } from 'react';

const HighlightsCacheContext = createContext();

export const useHighlightsCache = () => {
  const context = useContext(HighlightsCacheContext);
  if (!context) {
    throw new Error('useHighlightsCache must be used within HighlightsCacheProvider');
  }
  return context;
};

export const HighlightsCacheProvider = ({ children }) => {
  // Cache structure: { matchId: { highlights: [...], timestamp: Date, hasHighlights: boolean } }
  const [cache, setCache] = useState({});
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  
  // Cache expiry time: 10 minutes
  const CACHE_EXPIRY_MS = 10 * 60 * 1000;

  const getCachedHighlights = useCallback((matchId) => {
    const cached = cache[matchId];
    
    if (!cached) {
      return null;
    }

    // Check if cache is expired
    const now = Date.now();
    const cacheAge = now - cached.timestamp;
    
    if (cacheAge > CACHE_EXPIRY_MS) {
      // Cache expired, remove it
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[matchId];
        return newCache;
      });
      return null;
    }

    return {
      highlights: cached.highlights,
      hasHighlights: cached.hasHighlights
    };
  }, [cache]);

  const setCachedHighlights = useCallback((matchId, highlights, hasHighlights) => {
    setCache(prev => ({
      ...prev,
      [matchId]: {
        highlights,
        hasHighlights,
        timestamp: Date.now()
      }
    }));
  }, []);

  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  const clearCacheForMatch = useCallback((matchId) => {
    setCache(prev => {
      const newCache = { ...prev };
      delete newCache[matchId];
      return newCache;
    });
  }, []);

  const toggleExpandedMatch = useCallback((matchId) => {
    setExpandedMatchId(prev => prev === matchId ? null : matchId);
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedMatchId(null);
  }, []);

  const value = {
    // Cache methods
    getCachedHighlights,
    setCachedHighlights,
    clearCache,
    clearCacheForMatch,
    
    // Expansion methods
    expandedMatchId,
    toggleExpandedMatch,
    collapseAll,
    
    // Stats
    cacheSize: Object.keys(cache).length
  };

  return (
    <HighlightsCacheContext.Provider value={value}>
      {children}
    </HighlightsCacheContext.Provider>
  );
};

