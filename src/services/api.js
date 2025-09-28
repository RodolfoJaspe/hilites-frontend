// API service for communicating with the Hilites backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // GET request helper
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request helper
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request helper
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request helper
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Authentication methods
  async signup(userData) {
    return this.post('/auth/signup', userData);
  }

  async signin(credentials) {
    return this.post('/auth/signin', credentials);
  }

  async signout() {
    return this.post('/auth/signout');
  }

  // Highlights methods
  async getHighlights() {
    return this.get('/highlights');
  }

  async searchHighlights(query) {
    return this.get('/highlights/search', { q: query });
  }

  async getHighlightsByCompetition(competition) {
    return this.get(`/highlights/competition/${encodeURIComponent(competition)}`);
  }

  async getHighlightsStats() {
    return this.get('/highlights/stats');
  }

  async refreshHighlights() {
    return this.get('/highlights/refresh');
  }

  // Teams methods
  async getTeams(params = {}) {
    return this.get('/teams', params);
  }

  async getTeamById(id) {
    return this.get(`/teams/${id}`);
  }

  async getTeamByExternalId(externalId) {
    return this.get(`/teams/external/${externalId}`);
  }

  async getTeamsByCountry(country) {
    return this.get(`/teams/country/${encodeURIComponent(country)}`);
  }

  async getTeamsByLeague(league) {
    return this.get(`/teams/league/${encodeURIComponent(league)}`);
  }

  async getTeamsByConfederation(confederation) {
    return this.get(`/teams/confederation/${encodeURIComponent(confederation)}`);
  }

  async getCountries() {
    return this.get('/teams/meta/countries');
  }

  async getLeagues() {
    return this.get('/teams/meta/leagues');
  }

  async getConfederations() {
    return this.get('/teams/meta/confederations');
  }

  // User preferences methods (requires authentication)
  async getUserPreferences(token) {
    return this.get('/preferences', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getFavoriteTeams(token) {
    return this.get('/preferences/teams', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async addFavoriteTeam(token, teamId) {
    return this.post('/preferences/teams', { team_id: teamId }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async removeFavoriteTeam(token, teamId) {
    return this.delete(`/preferences/teams/${teamId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getFavoritePlayers(token) {
    return this.get('/preferences/players', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async addFavoritePlayer(token, playerData) {
    return this.post('/preferences/players', playerData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async removeFavoritePlayer(token, playerId) {
    return this.delete(`/preferences/players/${playerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
