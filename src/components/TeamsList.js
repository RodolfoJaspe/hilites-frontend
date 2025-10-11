import React, { useState } from 'react';
import '../styles/TeamsList.css';

const TeamsList = ({ teams, loading, error, meta, onFilterByCountry, onFilterByLeague }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCountryFilter = (country) => {
    setSelectedCountry(country);
    setSelectedLeague(''); // Reset league filter
    onFilterByCountry(country);
  };

  const handleLeagueFilter = (league) => {
    setSelectedLeague(league);
    setSelectedCountry(''); // Reset country filter
    onFilterByLeague(league);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter teams based on search query
  const filteredTeams = teams.filter(team => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      team.name.toLowerCase().includes(query) ||
      team.short_name?.toLowerCase().includes(query) ||
      team.league.toLowerCase().includes(query) ||
      team.country.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="teams-container">
        <div className="teams-loading">
          <div className="loading-spinner"></div>
          <p>Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teams-container">
        <div className="teams-error">
          <h3>⚠️ Error Loading Teams</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="teams-container">
      {/* Search and Filter Controls */}
      <div className="teams-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filter-sections">
          {/* Country Filter */}
          <div className="filter-section">
            <h4>Filter by Country</h4>
            <div className="filter-buttons">
              <button
                className={`filter-button ${selectedCountry === '' ? 'active' : ''}`}
                onClick={() => handleCountryFilter('')}
              >
                All Countries
              </button>
              {meta.countries.slice(0, 10).map(country => (
                <button
                  key={country}
                  className={`filter-button ${selectedCountry === country ? 'active' : ''}`}
                  onClick={() => handleCountryFilter(country)}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>

          {/* League Filter */}
          <div className="filter-section">
            <h4>Filter by League</h4>
            <div className="filter-buttons">
              <button
                className={`filter-button ${selectedLeague === '' ? 'active' : ''}`}
                onClick={() => handleLeagueFilter('')}
              >
                All Leagues
              </button>
              {meta.leagues.map(league => (
                <button
                  key={league}
                  className={`filter-button ${selectedLeague === league ? 'active' : ''}`}
                  onClick={() => handleLeagueFilter(league)}
                >
                  {league}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="teams-grid">
        {filteredTeams.map((team) => (
          <div key={team.id} className="team-card">
            <div className="team-logo">
              {team.logo_url ? (
                <img src={team.logo_url} alt={`${team.name} logo`} />
              ) : (
                <div className="logo-placeholder">
                  ⚽
                </div>
              )}
            </div>

            <div className="team-info">
              <h3 className="team-name">{team.name}</h3>
              {team.short_name && (
                <p className="team-short-name">{team.short_name}</p>
              )}
              
              <div className="team-details">
                <div className="team-league">
                  🏆 {team.league}
                </div>
                <div className="team-country">
                  🌍 {team.country}
                </div>
                {team.continental_confederation && (
                  <div className="team-confederation">
                    🌐 {team.continental_confederation}
                  </div>
                )}
              </div>

              {team.venue_name && (
                <div className="team-venue">
                  <div className="venue-name">🏟️ {team.venue_name}</div>
                  {team.venue_city && (
                    <div className="venue-city">{team.venue_city}</div>
                  )}
                  {team.venue_capacity && (
                    <div className="venue-capacity">
                      Capacity: {team.venue_capacity.toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              <div className="team-actions">
                <button className="favorite-button">
                  ❤️ Add to Favorites
                </button>
                {team.website_url && (
                  <a 
                    href={team.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="website-button"
                  >
                    🌐 Website
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="no-teams">
          <h3>No teams found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {filteredTeams.length > 0 && (
        <div className="teams-summary">
          <p>Showing {filteredTeams.length} of {teams.length} teams</p>
        </div>
      )}
    </div>
  );
};

export default TeamsList;









