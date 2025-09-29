import { useCallback, useEffect, useState } from 'react';
import apiService from '../services/api';

export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({
    countries: [],
    leagues: [],
    confederations: []
  });

  const fetchTeams = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getTeams(params);
      
      if (response.teams) {
        setTeams(response.teams);
        return { success: true, data: response.teams, pagination: response.pagination };
      } else {
        throw new Error('Failed to fetch teams');
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(err.message || 'Failed to fetch teams');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeamById = useCallback(async (id) => {
    try {
      const response = await apiService.getTeamById(id);
      
      if (response.team) {
        return { success: true, data: response.team };
      } else {
        throw new Error('Team not found');
      }
    } catch (err) {
      console.error('Error fetching team:', err);
      return { success: false, message: err.message };
    }
  }, []);

  const getTeamsByCountry = useCallback(async (country) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getTeamsByCountry(country);
      
      if (response.teams) {
        setTeams(response.teams);
        return { success: true, data: response.teams };
      } else {
        throw new Error('Failed to fetch teams by country');
      }
    } catch (err) {
      console.error('Error fetching teams by country:', err);
      setError(err.message || 'Failed to fetch teams by country');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeamsByLeague = useCallback(async (league) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getTeamsByLeague(league);
      
      if (response.teams) {
        setTeams(response.teams);
        return { success: true, data: response.teams };
      } else {
        throw new Error('Failed to fetch teams by league');
      }
    } catch (err) {
      console.error('Error fetching teams by league:', err);
      setError(err.message || 'Failed to fetch teams by league');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeamsByConfederation = useCallback(async (confederation) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getTeamsByConfederation(confederation);
      
      if (response.teams) {
        setTeams(response.teams);
        return { success: true, data: response.teams };
      } else {
        throw new Error('Failed to fetch teams by confederation');
      }
    } catch (err) {
      console.error('Error fetching teams by confederation:', err);
      setError(err.message || 'Failed to fetch teams by confederation');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMeta = useCallback(async () => {
    try {
      const [countriesRes, leaguesRes, confederationsRes] = await Promise.all([
        apiService.getCountries(),
        apiService.getLeagues(),
        apiService.getConfederations()
      ]);

      setMeta({
        countries: countriesRes.countries || [],
        leagues: leaguesRes.leagues || [],
        confederations: confederationsRes.confederations || []
      });

      return {
        success: true,
        countries: countriesRes.countries || [],
        leagues: leaguesRes.leagues || [],
        confederations: confederationsRes.confederations || []
      };
    } catch (err) {
      console.error('Error fetching teams meta:', err);
      return { success: false, message: err.message };
    }
  }, []);

  // Load teams and meta on mount
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchTeams(),
        fetchMeta()
      ]);
    };

    loadInitialData();
  }, [fetchTeams, fetchMeta]);

  return {
    teams,
    loading,
    error,
    meta,
    fetchTeams,
    getTeamById,
    getTeamsByCountry,
    getTeamsByLeague,
    getTeamsByConfederation,
    fetchMeta
  };
};

