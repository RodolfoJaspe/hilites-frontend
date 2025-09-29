import React, { useState } from 'react';
import '../styles/HighlightsList.css';

const HighlightsList = ({ highlights, loading, error, onSearch, onFilterByCompetition }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleCompetitionFilter = (competition) => {
    setSelectedCompetition(competition);
    onFilterByCompetition(competition);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="highlights-container">
        <div className="highlights-loading">
          <div className="loading-spinner"></div>
          <p>Loading highlights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="highlights-container">
        <div className="highlights-error">
          <h3>⚠️ Error Loading Highlights</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="highlights-container">
      {/* Search and Filter Controls */}
      <div className="highlights-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search highlights by team name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍 Search
          </button>
        </form>

        <div className="competition-filters">
          <button
            className={`filter-button ${selectedCompetition === '' ? 'active' : ''}`}
            onClick={() => handleCompetitionFilter('')}
          >
            All
          </button>
          {['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Champions League'].map(comp => (
            <button
              key={comp}
              className={`filter-button ${selectedCompetition === comp ? 'active' : ''}`}
              onClick={() => handleCompetitionFilter(comp)}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="highlights-grid">
        {highlights.map((highlight) => (
          <div key={highlight.id} className="highlight-card">
            <div className="highlight-thumbnail">
              {highlight.thumbnail ? (
                <img src={highlight.thumbnail} alt={highlight.title} />
              ) : (
                <div className="thumbnail-placeholder">
                  ⚽
                </div>
              )}
              <div className="highlight-overlay">
                <div className="highlight-duration">
                  {formatDuration(highlight.duration)}
                </div>
              </div>
            </div>

            <div className="highlight-content">
              <h3 className="highlight-title">{highlight.title}</h3>
              
              <div className="highlight-meta">
                <div className="highlight-teams">
                  <span className="home-team">{highlight.teams.home}</span>
                  <span className="vs">vs</span>
                  <span className="away-team">{highlight.teams.away}</span>
                </div>
                
                <div className="highlight-competition">
                  🏆 {highlight.competition}
                </div>
                
                <div className="highlight-date">
                  📅 {formatDate(highlight.date)}
                </div>
              </div>

              <div className="highlight-actions">
                <button 
                  className="watch-button"
                  onClick={() => {
                    // Handle video playback
                  }}
                >
                  ▶️ Watch Highlights
                </button>
                
                <div className="highlight-stats">
                  <span>👀 {highlight.views || 0}</span>
                  <span>👍 {highlight.likes || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {highlights.length === 0 && (
        <div className="no-highlights">
          <h3>No highlights found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default HighlightsList;
