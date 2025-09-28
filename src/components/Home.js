import React, { useState } from 'react';
import { useHighlights } from '../hooks/useHighlights';
import { useTeams } from '../hooks/useTeams';
import '../styles/Home.css';
import CompetitionSection from './CompetitionSection';
import DateNavigation from './DateNavigation';
import FollowingSection from './FollowingSection';

function Home() {
  const [selectedDate, setSelectedDate] = useState('today');
  const [expandedCompetitions, setExpandedCompetitions] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Get from auth context
  
  // Highlights data and functions
  const {
    highlights,
    leagues,
    embedToken,
    loading: highlightsLoading,
    error: highlightsError,
    searchHighlights,
    getHighlightsByCompetition,
    refreshHighlights
  } = useHighlights();

  // Teams data and functions
  const {
    meta: teamsMeta,
    getTeamsByCountry,
    getTeamsByLeague,
    fetchTeams
  } = useTeams();

  // Filter highlights by selected date
  const filterHighlightsByDate = (highlights, selectedDate) => {
    if (!selectedDate) {
      return highlights;
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
      return highlights;
    }

    // Filter highlights by date
    return highlights.filter(highlight => {
      if (!highlight.date) return false;
      
      const highlightDate = new Date(highlight.date);
      
      // Convert both dates to YYYY-MM-DD format for comparison (UTC)
      const highlightDateStr = highlightDate.toISOString().split('T')[0];
      const targetDateStr = targetDate.toISOString().split('T')[0];
      
      return highlightDateStr === targetDateStr;
    });
  };

  // Filter highlights by selected date first
  const filteredHighlights = filterHighlightsByDate(highlights, selectedDate);
  
  // Debug logging
  console.log('Date filtering debug:', {
    selectedDate,
    totalHighlights: highlights.length,
    filteredHighlights: filteredHighlights.length,
    today: new Date().toISOString().split('T')[0]
  });

  // Group highlights hierarchically by country/continent, then by competition
  const groupedHighlights = filteredHighlights.reduce((acc, highlight) => {
    const competition = highlight.competition;
    if (!competition || !competition.id) {
      return acc;
    }
    
    const competitionName = competition.name;
    const [countryOrContinent, specificCompetition] = competitionName.split(': ');
    
    if (!countryOrContinent) {
      return acc;
    }
    
    // Initialize country/continent group if it doesn't exist
    if (!acc[countryOrContinent]) {
      acc[countryOrContinent] = {};
    }
    
    // Initialize specific competition within the country/continent
    if (!acc[countryOrContinent][competition.id]) {
      acc[countryOrContinent][competition.id] = {
        name: specificCompetition || competitionName,
        highlights: []
      };
    }
    
    acc[countryOrContinent][competition.id].highlights.push(highlight);
    return acc;
  }, {});

  // Define priority order for countries/continents
  const countryContinentPriority = {
    'EUROPE': 1,
    'ENGLAND': 2,
    'SPAIN': 3,
    'ITALY': 4,
    'GERMANY': 5,
    'FRANCE': 6,
    'NETHERLANDS': 7,
    'PORTUGAL': 8,
    'BELGIUM': 9,
    'AUSTRIA': 10,
    'SWITZERLAND': 11,
    'TURKEY': 12,
    'GREECE': 13,
    'SERBIA': 14,
    'NORWAY': 15,
    'USA': 16,
    'BRAZIL': 17,
    'ARGENTINA': 18,
    'MEXICO': 19,
    'COLOMBIA': 20,
    'PERU': 21,
    'CHILE': 22,
    'URUGUAY': 23,
    'PARAGUAY': 24,
    'ECUADOR': 25,
    'VENEZUELA': 26,
    'AFRICA': 27,
    'ASIA': 28,
    'OCEANIA': 29,
    'NORTH AMERICA': 30,
    'SOUTH AMERICA': 31,
    'CENTRAL AMERICA': 32
  };

  // Sort countries/continents by priority
  const sortedCountryGroups = Object.keys(groupedHighlights).sort((a, b) => {
    return (countryContinentPriority[a] || 999) - (countryContinentPriority[b] || 999);
  });

  // Debug competition grouping
  console.log('Competition grouping debug:', {
    sampleCompetitionNames: filteredHighlights.slice(0, 5).map(h => h.competition?.name),
    groupedHighlightsKeys: Object.keys(groupedHighlights),
    sortedCountryGroups,
    totalGroupedHighlights: Object.keys(groupedHighlights).length
  });

  // Function to get flag for country/continent
  const getCountryContinentFlag = (countryOrContinent) => {
    const flags = {
      'EUROPE': '🏆',
      'ENGLAND': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'SPAIN': '🇪🇸',
      'ITALY': '🇮🇹',
      'GERMANY': '🇩🇪',
      'FRANCE': '🇫🇷',
      'NETHERLANDS': '🇳🇱',
      'PORTUGAL': '🇵🇹',
      'BELGIUM': '🇧🇪',
      'AUSTRIA': '🇦🇹',
      'SWITZERLAND': '🇨🇭',
      'TURKEY': '🇹🇷',
      'GREECE': '🇬🇷',
      'SERBIA': '🇷🇸',
      'NORWAY': '🇳🇴',
      'USA': '🇺🇸',
      'BRAZIL': '🇧🇷',
      'ARGENTINA': '🇦🇷',
      'MEXICO': '🇲🇽',
      'COLOMBIA': '🇨🇴',
      'PERU': '🇵🇪',
      'CHILE': '🇨🇱',
      'URUGUAY': '🇺🇾',
      'PARAGUAY': '🇵🇾',
      'ECUADOR': '🇪🇨',
      'VENEZUELA': '🇻🇪',
      'AFRICA': '🌍',
      'ASIA': '🌏',
      'OCEANIA': '🌏',
      'NORTH AMERICA': '🌎',
      'SOUTH AMERICA': '🌎',
      'CENTRAL AMERICA': '🌎'
    };
    return flags[countryOrContinent] || '⚽️';
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log('Date changed to:', date);
  };

  const toggleCompetition = (countryOrContinent, competitionId = null) => {
    if (competitionId) {
      // Toggle specific competition within a country/continent
      const key = `${countryOrContinent}-${competitionId}`;
      setExpandedCompetitions(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    } else {
      // Toggle entire country/continent group
      setExpandedCompetitions(prev => ({
        ...prev,
        [countryOrContinent]: !prev[countryOrContinent]
      }));
    }
  };

  const handleHighlightsSearch = async (query) => {
    await searchHighlights(query);
  };

  const handleHighlightsCompetitionFilter = async (competition) => {
    if (competition) {
      await getHighlightsByCompetition(competition);
    } else {
      // Reset to all highlights
      window.location.reload();
    }
  };

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
      {/* Date Navigation */}
      <DateNavigation 
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      {/* Following Section (only if logged in) */}
      {isLoggedIn && (
        <FollowingSection 
          highlights={filteredHighlights}
          embedToken={embedToken}
          loading={highlightsLoading}
        />
      )}

      {/* Competition Sections - Hierarchical by Country/Continent */}
      <div className="competitions-container">
        {sortedCountryGroups.map(countryOrContinent => {
          const countryGroup = groupedHighlights[countryOrContinent];
          const competitions = Object.keys(countryGroup);
          
          return (
            <div key={countryOrContinent} className="country-continent-group">
              <div 
                className="country-continent-header"
                onClick={() => toggleCompetition(countryOrContinent)}
              >
                <div className="country-continent-info">
                  <span className="country-continent-flag">
                    {getCountryContinentFlag(countryOrContinent)}
                  </span>
                  <span className="country-continent-name">
                    {countryOrContinent} 
                  </span>
                </div>
                <span className="expand-icon">
                  {expandedCompetitions[countryOrContinent] ? '▼' : '▶'}
                </span>
              </div>
              
              {expandedCompetitions[countryOrContinent] && (
                <div className="country-continent-content">
                  {competitions.map(competitionId => {
                    const competition = countryGroup[competitionId];
                    
                    return (
                      <CompetitionSection
                        key={`${countryOrContinent}-${competitionId}`}
                        competition={competition.name}
                        highlights={competition.highlights}
                        embedToken={embedToken}
                        isExpanded={expandedCompetitions[`${countryOrContinent}-${competitionId}`]}
                        onToggle={() => toggleCompetition(countryOrContinent, competitionId)}
                        loading={highlightsLoading}
                        isSubCompetition={true}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {highlightsLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading highlights...</p>
        </div>
      )}

      {highlightsError && (
        <div className="error-container">
          <h3>⚠️ Error Loading Highlights</h3>
          <p>{highlightsError}</p>
          <button onClick={refreshHighlights} className="retry-button">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;