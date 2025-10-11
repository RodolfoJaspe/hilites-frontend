import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import '../styles/Profile.css';

function Profile() {
  const { user, session, profile } = useAuth();
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DOMESTIC_LEAGUES = [
    'Premier League',
    'La Liga',
    'Bundesliga',
    'Serie A',
    'Ligue 1'
  ];

  // Fetch favorite teams
  const fetchFavoriteTeams = useCallback(async () => {
    if (!session?.access_token) return;

    try {
      const favorites = await apiService.getFavoriteTeamsAuth(session.access_token);
      setFavoriteTeams(favorites);
    } catch (error) {
      console.error('Error fetching favorite teams:', error);
      setError('Failed to load favorite teams');
    }
  }, [session]);

  // Fetch available teams (only from domestic leagues)
  const fetchAvailableTeams = useCallback(async () => {
    try {
      const response = await apiService.getTeams({ limit: 1000 });
      
      // Extract teams array from response
      const teams = response.teams || [];
      
      // Filter to only include teams from the 5 domestic leagues
      const domesticTeams = teams.filter(team => 
        DOMESTIC_LEAGUES.includes(team.league)
      );
      
      // Sort by league and then by name
      domesticTeams.sort((a, b) => {
        if (a.league !== b.league) {
          return DOMESTIC_LEAGUES.indexOf(a.league) - DOMESTIC_LEAGUES.indexOf(b.league);
        }
        return a.name.localeCompare(b.name);
      });
      
      setAvailableTeams(domesticTeams);
      setFilteredTeams(domesticTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter teams based on league and search
  useEffect(() => {
    let filtered = availableTeams;

    // Filter by league
    if (selectedLeague !== 'all') {
      filtered = filtered.filter(team => team.league === selectedLeague);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.short_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTeams(filtered);
  }, [selectedLeague, searchQuery, availableTeams]);

  // Add favorite team
  const handleAddFavorite = async (teamId) => {
    if (!session?.access_token) return;

    try {
      await apiService.addFavoriteTeamAuth(session.access_token, teamId);
      await fetchFavoriteTeams();
    } catch (error) {
      console.error('Error adding favorite team:', error);
      if (error.message.includes('409')) {
        alert('This team is already in your favorites');
      } else {
        alert('Failed to add team to favorites');
      }
    }
  };

  // Remove favorite team
  const handleRemoveFavorite = async (teamId) => {
    if (!session?.access_token) return;

    try {
      await apiService.removeFavoriteTeamAuth(session.access_token, teamId);
      await fetchFavoriteTeams();
    } catch (error) {
      console.error('Error removing favorite team:', error);
      alert('Failed to remove team from favorites');
    }
  };

  // Check if team is in favorites
  const isFavorite = (teamId) => {
    return favoriteTeams.some(fav => fav.id === teamId);
  };

  // Initial load
  useEffect(() => {
    if (user && session) {
      fetchFavoriteTeams();
      fetchAvailableTeams();
    }
  }, [user, session, fetchFavoriteTeams, fetchAvailableTeams]);

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Please sign in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" className="profile-avatar-large" />
          ) : (
            <div className="profile-avatar-placeholder-large">
              {profile?.full_name?.[0] || user.email[0]}
            </div>
          )}
          <div>
            <h1>{profile?.full_name || 'User'}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Favorite Teams Section */}
        <section className="profile-section">
          <h2>Your Favorite Teams ({favoriteTeams.length})</h2>
          {favoriteTeams.length === 0 ? (
            <p className="empty-message">No favorite teams yet. Add some below!</p>
          ) : (
            <div className="favorite-teams-grid">
              {favoriteTeams.map(team => (
                <div key={team.id} className="team-card favorite">
                  {team.logo_url && (
                    <img src={team.logo_url} alt={team.name} className="team-logo" />
                  )}
                  <div className="team-info">
                    <h3>{team.name}</h3>
                    <p className="team-league">{team.league}</p>
                  </div>
                  <button
                    className="remove-favorite-btn"
                    onClick={() => handleRemoveFavorite(team.id)}
                    title="Remove from favorites"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add Teams Section */}
        <section className="profile-section">
          <h2>Add Favorite Teams</h2>
          
          {/* Filters */}
          <div className="teams-filters">
            <div className="filter-group">
              <label htmlFor="league-filter">League:</label>
              <select
                id="league-filter"
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="league-select"
              >
                <option value="all">All Leagues</option>
                {DOMESTIC_LEAGUES.map(league => (
                  <option key={league} value={league}>{league}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="team-search">Search:</label>
              <input
                id="team-search"
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="team-search"
              />
            </div>
          </div>

          {/* Teams List */}
          {loading ? (
            <p className="loading-message">Loading teams...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="available-teams-grid">
              {filteredTeams.map(team => {
                const favorite = isFavorite(team.id);
                return (
                  <div
                    key={team.id}
                    className={`team-card ${favorite ? 'is-favorite' : ''}`}
                  >
                    {team.logo_url && (
                      <img src={team.logo_url} alt={team.name} className="team-logo" />
                    )}
                    <div className="team-info">
                      <h3>{team.name}</h3>
                      <p className="team-league">{team.league}</p>
                    </div>
                    <button
                      className={`favorite-toggle-btn ${favorite ? 'active' : ''}`}
                      onClick={() => favorite ? handleRemoveFavorite(team.id) : handleAddFavorite(team.id)}
                      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {favorite ? '★' : '☆'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {filteredTeams.length === 0 && !loading && (
            <p className="empty-message">No teams found matching your search.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;

