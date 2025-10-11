import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMatches } from '../hooks/useMatches';
import { useTeams } from '../hooks/useTeams';
import apiService from '../services/api';
import '../styles/Home.css';
import DateNavigation from './DateNavigation';
import MatchCard from './MatchCard';

function Home() {
  const [selectedDate, setSelectedDate] = useState('today');
  const [expandedCompetitions, setExpandedCompetitions] = useState({});
  const [favoriteMatches, setFavoriteMatches] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const { user, session } = useAuth();
  
  // Matches data and functions
  const {
    matches,
    loading: matchesLoading,
    error: matchesError,
    fetchMatches
  } = useMatches();

  // Teams data and functions (keeping for future use)
  const {
    getTeamsByCountry,
    getTeamsByLeague,
    fetchTeams
  } = useTeams();

  // Fetch favorite team matches
  const fetchFavoriteMatches = useCallback(async () => {
    if (!user || !session?.access_token) {
      setFavoriteMatches([]);
      return;
    }

    setLoadingFavorites(true);
    try {
      const matches = await apiService.getFavoriteTeamMatches(session.access_token, 50);
      setFavoriteMatches(matches || []);
    } catch (error) {
      console.error('Error fetching favorite team matches:', error);
      setFavoriteMatches([]);
    } finally {
      setLoadingFavorites(false);
    }
  }, [user, session]);

  // Load favorite matches when user logs in
  useEffect(() => {
    if (user && session) {
      fetchFavoriteMatches();
    } else {
      setFavoriteMatches([]);
    }
  }, [user, session, fetchFavoriteMatches]);

  // Filter matches by selected date
  const filterMatchesByDate = (matches, selectedDate) => {
    if (!selectedDate) {
      return matches;
    }

    const today = new Date();
    let targetDate;

    if (selectedDate === 'today') {
      // Today
      targetDate = new Date(today);
    } else if (selectedDate.startsWith('day-')) {
      // Extract day number from selectedDate (e.g., "day-5" -> 5)
      const dayNumber = parseInt(selectedDate.split('-')[1]);
      if (!isNaN(dayNumber)) {
        targetDate = new Date(today);
        targetDate.setDate(today.getDate() - dayNumber);
      }
    }

    if (!targetDate) {
      return matches;
    }

    // Filter matches by date
    return matches.filter(match => {
      if (!match.match_date) return false;
      
      const matchDate = new Date(match.match_date);
      
      // Convert both dates to YYYY-MM-DD format for comparison using local timezone
      // This ensures we compare the actual calendar dates, not UTC dates
      const matchDateStr = matchDate.getFullYear() + '-' + 
        String(matchDate.getMonth() + 1).padStart(2, '0') + '-' + 
        String(matchDate.getDate()).padStart(2, '0');
      
      const targetDateStr = targetDate.getFullYear() + '-' + 
        String(targetDate.getMonth() + 1).padStart(2, '0') + '-' + 
        String(targetDate.getDate()).padStart(2, '0');
      
      return matchDateStr === targetDateStr;
    });
  };

  // Filter matches by selected date first
  const filteredMatches = filterMatchesByDate(matches, selectedDate);
  

  // Group matches hierarchically by competition
  const groupedMatches = filteredMatches.reduce((acc, match) => {
    const competitionName = match.competition_name;
    if (!competitionName) {
      return acc;
    }
    
    // Initialize competition group if it doesn't exist
    if (!acc[competitionName]) {
      acc[competitionName] = {
        name: competitionName,
        matches: []
      };
    }
    
    acc[competitionName].matches.push(match);
    return acc;
  }, {});

  // Define priority order for competitions
  const competitionPriority = {
    'Premier League': 1,
    'La Liga': 2,
    'Primera Division': 2,
    'Serie A': 3,
    'Bundesliga': 4,
    'Ligue 1': 5,
    'Champions League': 6,
    'UEFA Champions League': 6,
    'Europa League': 7,
    'Conference League': 8,
    'FA Cup': 9,
    'Copa del Rey': 10,
    'Coppa Italia': 11,
    'DFB-Pokal': 12,
    'Coupe de France': 13,
    'EFL Cup': 14,
    'Super Cup': 15
  };

  // Sort competitions by priority
  const sortedCompetitions = Object.keys(groupedMatches).sort((a, b) => {
    return (competitionPriority[a] || 999) - (competitionPriority[b] || 999);
  });

  // Function to get display name for competition (maps backend names to frontend display names)
  const getCompetitionDisplayName = (competitionName) => {
    const displayNames = {
      'Primera Division': 'La Liga',
      'UEFA Champions League': 'Champions League',
      // Add more mappings as needed
    };
    return displayNames[competitionName] || competitionName;
  };

  // Function to get flag for competition
  const getCompetitionFlag = (competitionName) => {
  const flags = {
    'Premier League': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'La Liga': '🇪🇸',
    'Primera Division': '🇪🇸',
    'Serie A': '🇮🇹',
    'Bundesliga': '🇩🇪',
    'Ligue 1': '🇫🇷',
    'Champions League': '🏆',
    'UEFA Champions League': '🏆',
    'Europa League': '🏆',
    'Conference League': '🏆',
    'FA Cup': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Copa del Rey': '🇪🇸',
    'Coppa Italia': '🇮🇹',
    'DFB-Pokal': '🇩🇪',
    'Coupe de France': '🇫🇷',
    'EFL Cup': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Super Cup': '🏆'
  };
    return flags[competitionName] || '⚽️';
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const toggleCompetition = (competitionName) => {
    setExpandedCompetitions(prev => ({
      ...prev,
      [competitionName]: !prev[competitionName]
    }));
  };

  // Handler functions (keeping for future use)
  const handleTeamsCountryFilter = async (country) => {
    if (country) {
      await getTeamsByCountry(country);
    } else {
      await fetchTeams();
    }
  };

  const handleTeamsLeagueFilter = async (league) => {
    if (league) {
      await getTeamsByLeague(league);
    } else {
      await fetchTeams();
    }
  };

  return (
    <div className="home">
      {/* Favorite Teams Section (only if logged in and has favorites) */}
      {user && favoriteMatches.length > 0 && (
        <div className="favorites-section">
          <div className="favorites-header">
            <h2>⭐ Your Favorite Teams</h2>
            <p className="favorites-subtitle">Latest matches from teams you follow</p>
          </div>
          
          {loadingFavorites ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading favorite team matches...</p>
            </div>
          ) : (
            <div className="favorites-matches-grid">
              {favoriteMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  showHighlights={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Date Navigation */}
      <DateNavigation 
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      {/* Competition Sections */}
      <div className="competitions-container">
        {sortedCompetitions.map(competitionName => {
          const competition = groupedMatches[competitionName];
          
          return (
            <div key={competitionName} className="competition-group">
              <div 
                className="competition-header"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCompetition(competitionName);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="competition-info">
                  <span className="competition-flag">
                    {getCompetitionFlag(competitionName)}
                  </span>
                  <span className="competition-name">
                    {getCompetitionDisplayName(competitionName)}
                  </span>
                  <span className="match-count">
                    ({competition.matches.length} matches)
                  </span>
                </div>
                <span className="expand-icon">
                  {expandedCompetitions[competitionName] ? '▼' : '▶'}
                </span>
              </div>
              
              {expandedCompetitions[competitionName] && (
                <div className="competition-content">
                  <div className="matches-grid">
                    {competition.matches.map(match => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        showHighlights={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {matchesLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading matches...</p>
        </div>
      )}

      {matchesError && (
        <div className="error-container">
          <h3>⚠️ Error Loading Matches</h3>
          <p>{matchesError}</p>
          <button onClick={fetchMatches} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {filteredMatches.length === 0 && !matchesLoading && (
        <div className="no-matches">
          <h3>No matches found</h3>
          <p>Try selecting a different date or check back later for new matches.</p>
        </div>
      )}
    </div>
  );
}

export default Home;