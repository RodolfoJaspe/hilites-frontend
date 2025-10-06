import { useCallback, useEffect, useState } from 'react';
import apiService from '../services/api';

export const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchMatches = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getMatches(params);
      
      if (response.success) {
        setMatches(response.data);
        setStats({
          count: response.count,
          lastUpdated: response.lastUpdated
        });
      } else {
        throw new Error(response.message || 'Failed to fetch matches');
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err.message || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchUpcomingMatches = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getUpcomingMatches(params);
      
      if (response.success) {
        setMatches(response.data);
        setStats({
          count: response.count,
          lastUpdated: response.lastUpdated
        });
      } else {
        throw new Error(response.message || 'Failed to fetch upcoming matches');
      }
    } catch (err) {
      console.error('Error fetching upcoming matches:', err);
      setError(err.message || 'Failed to fetch upcoming matches');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMatchesWithoutHighlights = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getMatchesWithoutHighlights(params);
      
      if (response.success) {
        setMatches(response.data);
        setStats({
          count: response.count,
          lastUpdated: response.lastUpdated
        });
      } else {
        throw new Error(response.message || 'Failed to fetch matches without highlights');
      }
    } catch (err) {
      console.error('Error fetching matches without highlights:', err);
      setError(err.message || 'Failed to fetch matches without highlights');
    } finally {
      setLoading(false);
    }
  }, []);

  const getMatchById = useCallback(async (id) => {
    try {
      const response = await apiService.getMatchById(id);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch match');
      }
    } catch (err) {
      console.error('Error fetching match:', err);
      throw err;
    }
  }, []);

  const searchMatches = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      return { success: false, message: 'Search query must be at least 2 characters' };
    }

    try {
      setLoading(true);
      setError(null);
      
      // Filter matches locally by team names
      const filteredMatches = matches.filter(match => {
        const homeTeam = match.home_team?.name?.toLowerCase() || '';
        const awayTeam = match.away_team?.name?.toLowerCase() || '';
        const competition = match.competition_name?.toLowerCase() || '';
        const searchTerm = query.toLowerCase();
        
        return homeTeam.includes(searchTerm) || 
               awayTeam.includes(searchTerm) || 
               competition.includes(searchTerm);
      });
      
      setMatches(filteredMatches);
      setStats({
        count: filteredMatches.length,
        lastUpdated: new Date().toISOString(),
        query: query
      });
      
      return { success: true, data: filteredMatches };
      
    } catch (err) {
      console.error('Error searching matches:', err);
      setError(err.message || 'Search failed');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [matches]);

  const filterMatchesByCompetition = useCallback(async (competitionId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Filter matches by competition ID
      const filteredMatches = matches.filter(match => 
        match.competition_id === competitionId
      );
      
      setMatches(filteredMatches);
      setStats({
        count: filteredMatches.length,
        lastUpdated: new Date().toISOString(),
        competition: competitionId
      });
      
      return { success: true, data: filteredMatches };
      
    } catch (err) {
      console.error('Error filtering matches by competition:', err);
      setError(err.message || 'Failed to filter matches by competition');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [matches]);

  const filterMatchesByStatus = useCallback(async (status) => {
    try {
      setLoading(true);
      setError(null);
      
      // Filter matches by status
      const filteredMatches = matches.filter(match => 
        match.status === status
      );
      
      setMatches(filteredMatches);
      setStats({
        count: filteredMatches.length,
        lastUpdated: new Date().toISOString(),
        status: status
      });
      
      return { success: true, data: filteredMatches };
      
    } catch (err) {
      console.error('Error filtering matches by status:', err);
      setError(err.message || 'Failed to filter matches by status');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [matches]);

  // Load matches on mount - Delay to prevent rate limiting conflicts
  useEffect(() => {
    const loadMatches = async () => {
      // Small delay to let teams load first
      await new Promise(resolve => setTimeout(resolve, 500));
      // Fetch finished matches to show highlights
      fetchMatches({ status: 'finished', limit: 100 });
    };
    
    loadMatches();
  }, [fetchMatches]);

  return {
    matches,
    loading,
    error,
    stats,
    fetchMatches,
    fetchUpcomingMatches,
    fetchMatchesWithoutHighlights,
    getMatchById,
    searchMatches,
    filterMatchesByCompetition,
    filterMatchesByStatus
  };
};
