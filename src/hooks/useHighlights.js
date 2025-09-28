import { useCallback, useEffect, useState } from 'react';
import apiService from '../services/api';

export const useHighlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [embedToken, setEmbedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchHighlights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getHighlights();
      
      if (response.success) {
        setHighlights(response.data);
        setLeagues(response.leagues || []); // Backend should send leagues
        setEmbedToken(response.embedToken || null);
        setStats({
          count: response.count,
          lastUpdated: response.lastUpdated,
          cached: response.cached
        });
      } else {
        throw new Error(response.message || 'Failed to fetch highlights');
      }
    } catch (err) {
      console.error('Error fetching highlights:', err);
      setError(err.message || 'Failed to fetch highlights');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchHighlights = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      return { success: false, message: 'Search query must be at least 2 characters' };
    }

    try {
      setLoading(true);
      setError(null);
      
      // Filter highlights locally
      const filteredMatches = highlights.filter(match => 
        match.title.toLowerCase().includes(query.toLowerCase())
      );
      
      setHighlights(filteredMatches);
      setStats({
        count: filteredMatches.length,
        lastUpdated: new Date().toISOString(),
        query: query
      });
      
      return { success: true, data: filteredMatches };
      
    } catch (err) {
      console.error('Error searching highlights:', err);
      setError(err.message || 'Search failed');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [highlights]);

  const getHighlightsByCompetition = useCallback(async (competitionId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Filter highlights by competition ID
      const filteredMatches = highlights.filter(match => 
        match.competition.id === parseInt(competitionId)
      );
      
      setHighlights(filteredMatches);
      setStats({
        count: filteredMatches.length,
        lastUpdated: new Date().toISOString(),
        competition: competitionId
      });
      
      return { success: true, data: filteredMatches };
      
    } catch (err) {
      console.error('Error fetching competition highlights:', err);
      setError(err.message || 'Failed to fetch competition highlights');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [highlights]);

  const refreshHighlights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use backend refresh endpoint
      const response = await apiService.refreshHighlights();
      
      if (response.success) {
        setHighlights(response.data);
        setLeagues(response.leagues || []);
        setEmbedToken(response.embedToken || null);
        setStats({
          count: response.count,
          lastUpdated: response.lastUpdated
        });
        return { success: true, message: 'Highlights refreshed successfully' };
      } else {
        throw new Error(response.message || 'Failed to refresh highlights');
      }
      
    } catch (err) {
      console.error('Error refreshing highlights:', err);
      setError(err.message || 'Failed to refresh highlights');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Load highlights on mount
  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  return {
    highlights,
    leagues,
    embedToken,
    loading,
    error,
    stats,
    fetchHighlights,
    searchHighlights,
    getHighlightsByCompetition,
    refreshHighlights
  };
};
