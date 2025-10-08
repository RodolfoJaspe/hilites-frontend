import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAIDiscovery } from '../hooks/useAIDiscovery';
import '../styles/MatchCard.css';

const MatchCard = ({ match, showHighlights = true }) => {
  const [highlights, setHighlights] = useState([]);
  const [hasHighlights, setHasHighlights] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const hasCheckedForHighlightsRef = useRef(false);

  // Function to get display name for competition (maps backend names to frontend display names)
  const getCompetitionDisplayName = (competitionName) => {
    const displayNames = {
      'Primera Division': 'La Liga',
      'UEFA Champions League': 'Champions League',
      // Add more mappings as needed
    };
    return displayNames[competitionName] || competitionName;
  };
  
  const {
    discovering,
    discoveryError,
    discoverHighlights,
    getAIDiscoveredHighlights,
    clearDiscoveryError
  } = useAIDiscovery();

  const checkForHighlights = useCallback(async () => {
    try {
      console.log('🔍 Checking for highlights for match:', match.id);
      const response = await getAIDiscoveredHighlights(match.id);
      console.log('📊 Highlights response:', response);
      if (response.success && response.data.length > 0) {
        setHighlights(response.data);
        setHasHighlights(true);
        console.log('✅ Found highlights:', response.data.length);
        
        // Auto-play the first video found
        if (response.data.length > 0) {
          console.log('🎬 Auto-playing first video:', response.data[0].title);
          setSelectedVideo(response.data[0]);
        }
      } else {
        setHasHighlights(false);
        console.log('❌ No highlights found');
      }
    } catch (error) {
      console.error('Error checking for highlights:', error);
      setHasHighlights(false);
    }
  }, [getAIDiscoveredHighlights, match.id]);

  const handleDiscoverHighlights = useCallback(async () => {
    clearDiscoveryError();
    const result = await discoverHighlights(match.id);
    
    if (result.success) {
      // Refresh highlights after discovery - this will auto-play the first video
      await checkForHighlights();
    }
  }, [clearDiscoveryError, discoverHighlights, match.id, checkForHighlights]);

  // Auto-discover highlights when card expands (run only once per expansion)
  useEffect(() => {
    if (isExpanded && showHighlights && match.id && !hasCheckedForHighlightsRef.current) {
      hasCheckedForHighlightsRef.current = true;
      
      // First check if highlights already exist
      checkForHighlights().then(() => {
        // If no highlights found, then discover new ones
        if (!hasHighlights) {
          handleDiscoverHighlights();
        }
      });
    }
    
    // Reset the flag when card is collapsed
    if (!isExpanded) {
      hasCheckedForHighlightsRef.current = false;
    }
    // We only want this to run when the card expands/collapses, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePlayVideo = (highlight) => {
    console.log('🎬 Playing video:', highlight.title);
    console.log('🔗 YouTube URL:', highlight.youtube_url);
    setSelectedVideo(highlight);
  };

  const handleShowAllVideos = () => {
    console.log('📋 Showing all videos');
    setSelectedVideo(null);
  };

  const getYouTubeEmbedUrl = (youtubeUrl) => {
    // Extract video ID from YouTube URL
    const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId[1]}?autoplay=1&rel=0&modestbranding=1`;
    }
    return youtubeUrl;
  };


  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`match-card ${isExpanded ? 'expanded' : 'collapsed'}`} onClick={handleCardClick}>
      {/* Collapsed State - Just teams and competition */}
      {!isExpanded && (
        <>
        <div className="match-competition">
          {getCompetitionDisplayName(match.competition_name)}
        </div>
          <div className="match-teams-collapsed">
            <div className="team-collapsed">
              <span className="team-name-small">{match.home_team?.name || 'N/A'}</span>
            </div>
            <span className="vs-text">vs</span>
            <div className="team-collapsed">
              <span className="team-name-small">{match.away_team?.name || 'N/A'}</span>
            </div>
          </div>
        </>
      )}

      {/* Expanded State - Full match details and video */}
      {isExpanded && (
        <>
        <div className="match-competition">
          {getCompetitionDisplayName(match.competition_name)}
        </div>
          
          <div className="match-teams-expanded">
            <div className="team-expanded">
              <span className="team-name-large">{match.home_team?.name || 'N/A'}</span>
            </div>
            <span className="vs-text-large">vs</span>
            <div className="team-expanded">
              <span className="team-name-large">{match.away_team?.name || 'N/A'}</span>
            </div>
          </div>

          {/* Video Section */}
          {showHighlights && match.status === 'finished' && (
            <div className="video-section">
              {discovering && !hasHighlights && (
                <div className="discovering-state">
                  <div className="loading-spinner"></div>
                  <p>🤖 Finding highlights...</p>
                </div>
              )}

              {discoveryError && (
                <div className="discovery-error">
                  ⚠️ {discoveryError}
                  <button onClick={clearDiscoveryError} className="clear-error">✕</button>
                </div>
              )}

              {hasHighlights && highlights.length > 0 && (
                <div className="video-container">
                  {selectedVideo ? (
                    // Show video player
                    <div className="video-player">
                      <iframe
                        src={getYouTubeEmbedUrl(selectedVideo.youtube_url)}
                        title={selectedVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="video-iframe-inline"
                      />
                      <div className="video-info-inline">
                        <div className="video-header">
                          <h4>{selectedVideo.title}</h4>
                          {highlights.length > 1 && (
                            <button 
                              onClick={handleShowAllVideos}
                              className="show-all-videos-btn"
                            >
                              📋 Show All Videos ({highlights.length})
                            </button>
                          )}
                        </div>
                        <div className="video-meta">
                          <span>📺 {selectedVideo.channel_name}</span>
                          <span>👀 {selectedVideo.view_count?.toLocaleString() || 'N/A'}</span>
                          {selectedVideo.duration_seconds && (
                            <span>⏱️ {formatDuration(selectedVideo.duration_seconds)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Show thumbnail with play button
                    <div className="video-thumbnail-container">
                      {highlights.map((highlight, index) => (
                        <div key={highlight.id || index} className="video-thumbnail" onClick={(e) => {
                          e.stopPropagation();
                          handlePlayVideo(highlight);
                        }}>
                          {highlight.thumbnail_url ? (
                            <img src={highlight.thumbnail_url} alt={highlight.title} />
                          ) : (
                            <div className="thumbnail-placeholder">🎥</div>
                          )}
                          <div className="play-overlay">
                            <div className="play-button-overlay">▶️</div>
                          </div>
                          <div className="video-title-overlay">
                            <h5>{highlight.title}</h5>
                            <span>📺 {highlight.channel_name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!hasHighlights && !discovering && !discoveryError && (
                <div className="no-highlights">
                  <p>No highlights found for this match.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MatchCard;
