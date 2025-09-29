import React, { useState } from 'react';
import '../styles/FollowingSection.css';

const FollowingSection = ({ highlights, embedToken, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Function to enhance embed code with embed token
  const enhanceEmbedWithToken = (embed, token) => {
    // Just return the original embed - Scorebat v3 embeds already contain the proper token
    return embed;
  };
  
  // TODO: Get user's favorite teams from authentication context
  const favoriteTeams = ['Manchester United', 'Real Madrid', 'Barcelona', 'Liverpool'];
  
  // Filter highlights for favorite teams
  const followingHighlights = highlights.filter(highlight => {
    return favoriteTeams.some(team => 
      highlight.teams.home.includes(team) || 
      highlight.teams.away.includes(team)
    );
  });

  if (loading) {
    return (
      <div className="following-section">
        <div className="following-header">
          <div className="following-title">
            <span className="star-icon">⭐</span>
            <span>Following</span>
          </div>
          <div className="loading-spinner-small"></div>
        </div>
      </div>
    );
  }

  if (followingHighlights.length === 0) {
    return null; // Don't show section if no following highlights
  }

  return (
    <div className="following-section">
      <div className="following-header" 
           tabIndex={-1}
           onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             setIsExpanded(!isExpanded);
           }}
           onMouseDown={(e) => {
             e.preventDefault();
           }}>
        <div className="following-title">
          <span className="star-icon">⭐</span>
          <span>Following</span>
        </div>
        <div className={`expand-chevron ${isExpanded ? 'expanded' : ''}`}>
          <span>▲</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="following-content">
          <div className="following-highlights">
            {followingHighlights.slice(0, 3).map((highlight, index) => (
              <HighlightCard 
                key={highlight.id || index} 
                highlight={highlight}
                embedToken={embedToken}
                enhanceEmbedWithToken={enhanceEmbedWithToken}
              />
            ))}
          </div>
          
          {followingHighlights.length > 3 && (
            <div className="view-more">
              <button className="view-more-button">
                View {followingHighlights.length - 3} more highlights
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Highlight Card Component (simplified version for following section)
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

  return (
    <div className="highlight-card-following">
      <div className="highlight-video-container">
        {highlight.embed ? (
          <div 
            className="video-embed"
            dangerouslySetInnerHTML={{__html: enhanceEmbedWithToken(highlight.embed, embedToken)}}
          />
        ) : (
          <div className="highlight-thumbnail" onClick={handlePlay}>
            {highlight.thumbnail ? (
              <img src={highlight.thumbnail} alt={highlight.title} />
            ) : (
              <div className="thumbnail-placeholder">
                <div className="team-logos">
                  <div className="team-logo home-team">🏠</div>
                  <div className="score">2-1</div>
                  <div className="team-logo away-team">🏠</div>
                </div>
              </div>
            )}
            <div className="play-button">▶️</div>
          </div>
        )}
      </div>
      
      <div className="highlight-info">
        <div className="highlight-title">{highlight.title}</div>
      </div>
    </div>
  );
};

export default FollowingSection;
