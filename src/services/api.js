// API service for communicating with the Hilites backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

console.log('API_BASE_URL:', API_BASE_URL);


class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.lastRequestTime = 0;
    this.requestDelay = 100; // 100ms delay between requests
  }

  // Generic request method
  async request(endpoint, options = {}) {
    // Throttle requests to prevent rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.requestDelay) {
      await new Promise(resolve => setTimeout(resolve, this.requestDelay - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();

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
        // Handle 429 (Too Many Requests) specially
        if (response.status === 429) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || 'YouTube API quota exceeded. Please try again later.');
        }
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

  // Match data methods (new AI-powered system)
  async getMatches(params = {}) {
    return this.get('/matches', params);
  }

  async getMatchById(id) {
    return this.get(`/matches/${id}`);
  }

  async getUpcomingMatches(params = {}) {
    return this.get('/matches/upcoming', params);
  }

  // AI Discovery methods
  async getMatchesWithoutHighlights(params = {}) {
    return this.get('/ai-discovery/matches-without-highlights', params);
  }

  async discoverHighlights(matchId) {
    return this.post('/ai-discovery/process', { matchId });
  }

  async getAIDiscoveredHighlights(matchId) {
    return this.get(`/ai-discovery/highlights/${matchId}`);
  }

  async getAIDiscoveryStatus() {
    return this.get('/ai-discovery/status');
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

  // New Favorite Teams methods (with Supabase auth)
  async getFavoriteTeamsAuth(accessToken) {
    return this.request('/favorite-teams', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async addFavoriteTeamAuth(accessToken, teamId) {
    return this.request('/favorite-teams', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ teamId }),
    });
  }

  async removeFavoriteTeamAuth(accessToken, teamId) {
    return this.request(`/favorite-teams/${teamId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async getFavoriteTeamMatches(accessToken, limit = 50) {
    return this.request(`/favorite-teams/matches?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
