import React from 'react';
import '../styles/CompetitionSection.css';

const CompetitionSection = ({ 
  competition, 
  highlights, 
  embedToken,
  isExpanded, 
  onToggle, 
  loading,
  isSubCompetition = false
}) => {
  // Function to enhance embed code with embed token
  const enhanceEmbedWithToken = (embed, token) => {
    // Just return the original embed - Scorebat v3 embeds already contain the proper token
    return embed;
  };

  const getCompetitionFlag = (competition) => {
    const flags = {
      'EUROPE: Champions League': '🏆',
      'EUROPE: Europa League': '🏆',
      'EUROPE: Europa Conference League': '🏆',
      'ENGLAND: Premier League': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'SPAIN: La Liga': '🇪🇸',
      'ITALY: Serie A': '🇮🇹',
      'GERMANY: Bundesliga': '🇩🇪',
      'FRANCE: Ligue 1': '🇫🇷',
      'GREECE: Super League 1': '🇬🇷',
      'PORTUGAL: Liga Portugal': '🇵🇹',
      'NETHERLANDS: Eredivisie': '🇳🇱',
      'BELGIUM: Belgian Pro League': '🇧🇪',
      'AUSTRIA: Austrian Bundesliga': '🇦🇹',
      'SWITZERLAND: Swiss Super League': '🇨🇭',
      'USA: MLS': '🇺🇸',
      'BRAZIL: Brasileirao': '🇧🇷',
      'ARGENTINA: Argentine Primera': '🇦🇷',
      'MEXICO: Liga MX': '🇲🇽',
      'COLOMBIA: Colombian Primera A': '🇨🇴',
      'PERU: Peruvian Primera División': '🇵🇪',
      'CHILE: Primera Division': '🇨🇱',
      'URUGUAY: Uruguayan Primera División': '🇺🇾',
      'PARAGUAY: Paraguayan Primera División': '🇵🇾',
      'ECUADOR: Ecuadorian Serie A': '🇪🇨',
      'VENEZUELA: Venezolana Primera División': '🇻🇪',
      'SERBIA: Super Liga': '🇷🇸',
      'NORWAY: Eliteserien': '🇳🇴',
      'TURKEY: Super Lig': '🇹🇷',
    };
    return flags[competition] || '⚽️';
  };

  const getCompetitionName = (competition) => {
    const names = {
      'Premier League': 'England - Premier League',
      'La Liga': 'Spain - LaLiga',
      'Serie A': 'Italy - Serie A',
      'Bundesliga': 'Germany - Bundesliga',
      'Ligue 1': 'France - Ligue 1'
    };
    return names[competition] || competition;
  };

  if (loading) {
    return (
      <div className="competition-section">
        <div className="competition-header">
          <div className="competition-info">
            <span className="competition-flag">🏆</span>
            <span className="competition-name">Loading...</span>
          </div>
          <div className="loading-spinner-small"></div>
        </div>
      </div>
    );
  }

  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <div className={`competition-section ${isSubCompetition ? 'sub-competition' : ''}`}>
      <div className="competition-header" 
           tabIndex={-1}
           onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             onToggle();
           }}
           onMouseDown={(e) => {
             e.preventDefault();
           }}>
        <div className="competition-info">
          {!isSubCompetition && (
            <span className="competition-flag">{getCompetitionFlag(competition)}</span>
          )}
          <span className="competition-name">{getCompetitionName(competition)}</span>
        </div>
        <div className="competition-meta">
          <span className="highlight-count">{highlights.length}</span>
          <div className={`expand-chevron ${isExpanded ? 'expanded' : ''}`}>
            <span>▼</span>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="competition-content">
          <div className="competition-highlights">
            {highlights.map((highlight, index) => (
              <HighlightCard 
                key={highlight.id || index} 
                highlight={highlight}
                embedToken={embedToken}
                enhanceEmbedWithToken={enhanceEmbedWithToken}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Highlight Card Component (matches the design from the image)
  const HighlightCard = ({ highlight, embedToken, enhanceEmbedWithToken }) => {
  const handlePlay = () => {
    // TODO: Implement video playback
  };

  const handleCopyEmbed = () => {
    if (highlight.embed) {
      navigator.clipboard.writeText(highlight.embed);
      // TODO: Show success toast
    }
  };

  // Extract team names and scores from title
  const extractMatchInfo = (title) => {
    const parts = title.split(' - ');
    if (parts.length >= 2) {
      return {
        homeTeam: parts[0].trim(),
        awayTeam: parts[1].trim()
      };
    }
    return {
      homeTeam: 'Team A',
      awayTeam: 'Team B'
    };
  };

  const matchInfo = extractMatchInfo(highlight.title);

  return (
    <div className="highlight-card-competition">
      <div className="highlight-video-container-large">
        {highlight.embed ? (
          <div 
            className="video-embed-large"
            dangerouslySetInnerHTML={{__html: enhanceEmbedWithToken(highlight.embed, embedToken)}}
          />
        ) : (
          <div className="highlight-thumbnail-large" onClick={handlePlay}>
            <div className="match-info">
              <div className="team-logos-section">
                <div className="team-logo home-team">
                  <span>🏠</span>
                </div>
                <div className="team-logo away-team">
                  <span>🏠</span>
                </div>
              </div>
              <div className="score-section">
                <div className="score home-score">2</div>
                <div className="score away-score">1</div>
              </div>
            </div>
            <div className="highlight-type">5/26 HIGHLIGHTS</div>
            <div className="player-image">
              <div className="player-placeholder">
                <span>⚽</span>
              </div>
              <div className="play-button-large">▶️</div>
            </div>
          </div>
        )}
      </div>
      <div className="highlight-details">
        <div className="teams">
            {matchInfo.homeTeam} vs {matchInfo.awayTeam}
        </div>
      </div>
    </div>
  );
};

export default CompetitionSection;
