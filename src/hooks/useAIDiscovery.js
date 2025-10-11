import { useCallback, useState } from 'react';
import apiService from '../services/api';

export const useAIDiscovery = () => {
  const [discovering, setDiscovering] = useState(false);
  const [discoveryError, setDiscoveryError] = useState(null);
  const [discoveryStatus, setDiscoveryStatus] = useState(null);

  const discoverHighlights = useCallback(async (matchId) => {
    try {
      setDiscovering(true);
      setDiscoveryError(null);
      
      const response = await apiService.discoverHighlights(matchId);
      
      if (response.success) {
        setDiscoveryStatus({
          match: response.data.match,
          videosFound: response.data.videosFound,
          highlightsStored: response.data.highlightsStored,
          bestVideos: response.data.bestVideos
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to discover highlights');
      }
    } catch (err) {
      console.error('Error discovering highlights:', err);
      setDiscoveryError(err.message || 'Failed to discover highlights');
      return { success: false, message: err.message };
    } finally {
      setDiscovering(false);
    }
  }, []);

  const getAIDiscoveredHighlights = useCallback(async (matchId) => {
    try {
      const response = await apiService.getAIDiscoveredHighlights(matchId);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get AI discovered highlights');
      }
    } catch (err) {
      console.error('Error getting AI discovered highlights:', err);
      return { success: false, message: err.message };
    }
  }, []);

  const getAIDiscoveryStatus = useCallback(async () => {
    try {
      const response = await apiService.getAIDiscoveryStatus();
      
      if (response.success) {
        setDiscoveryStatus(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to get AI discovery status');
      }
    } catch (err) {
      console.error('Error getting AI discovery status:', err);
      return { success: false, message: err.message };
    }
  }, []);

  const clearDiscoveryError = useCallback(() => {
    setDiscoveryError(null);
  }, []);

  const clearDiscoveryStatus = useCallback(() => {
    setDiscoveryStatus(null);
  }, []);

  return {
    discovering,
    discoveryError,
    discoveryStatus,
    discoverHighlights,
    getAIDiscoveredHighlights,
    getAIDiscoveryStatus,
    clearDiscoveryError,
    clearDiscoveryStatus
  };
};




