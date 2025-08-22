import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Play, Pause, RotateCcw, Music } from 'lucide-react'
import './AudioManager.css'

interface AudioTrack {
  id: string
  name: string
  description: string
  volume: number
  isPlaying: boolean
  loop: boolean
}

const AudioManager: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [masterVolume, setMasterVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [activeTracks, setActiveTracks] = useState<AudioTrack[]>([])
  const [audioErrors, setAudioErrors] = useState<{ [key: string]: string }>({})
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})
  const [showSpotifyConnect, setShowSpotifyConnect] = useState(false)
  
  // Fallback audio system
  const audioFallback = useRef<any>(null)
  const fallbackSources = useRef<{ [key: string]: any }>({})

  // Simple default audio tracks - only gentle rain
  const availableTracks: AudioTrack[] = [
    {
      id: 'rain',
      name: 'Gentle Rain',
      description: 'Soft rain sounds for cozy cooking',
      volume: 0.5,
      isPlaying: true, // Start playing by default
      loop: true
    }
  ]

  // Initialize audio elements with error handling
  useEffect(() => {
    // Initialize fallback audio system
    if (window.AudioFallback) {
      audioFallback.current = new window.AudioFallback()
    }

    availableTracks.forEach(track => {
      const audio = new Audio()
      audio.loop = track.loop
      audio.volume = track.volume * masterVolume
      audio.preload = 'metadata'
      
      // Error handling for audio loading
      audio.onerror = () => {
        console.warn(`Failed to load audio: ${track.name}, using fallback`)
        setAudioErrors(prev => ({ ...prev, [track.id]: 'Using generated audio' }))
      }
      
      audio.oncanplaythrough = () => {
        // Clear error if audio loads successfully
        setAudioErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[track.id]
          return newErrors
        })
        
        // Start playing rain by default
        if (track.id === 'rain' && track.isPlaying) {
          audio.play().catch(error => {
            console.warn('Could not autoplay rain audio:', error)
            // Use fallback if autoplay fails
            if (audioFallback.current) {
              const fallbackSource = audioFallback.current.generateRain()
              fallbackSources.current[track.id] = fallbackSource
              setActiveTracks([{ ...track, isPlaying: true }])
            }
          })
          setActiveTracks([{ ...track, isPlaying: true }])
        }
      }
      
      // Set source after setting up event handlers
      audio.src = track.url
      audioRefs.current[track.id] = audio
    })

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause()
        audio.src = ''
      })
      // Cleanup fallback sources
      Object.values(fallbackSources.current).forEach(source => {
        if (source && source.stop) {
          source.stop()
        }
      })
    }
  }, [])

  // Update master volume for all tracks
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      const trackId = Object.keys(audioRefs.current).find(key => audioRefs.current[key] === audio)
      const track = activeTracks.find(t => t.id === trackId)
      if (track) {
        audio.volume = track.volume * masterVolume * (isMuted ? 0 : 1)
      }
    })
  }, [masterVolume, isMuted, activeTracks])

  const toggleTrack = async (trackId: string) => {
    const track = availableTracks.find(t => t.id === trackId)
    
    if (!track) return

    // Check if we're using fallback audio
    const isUsingFallback = audioErrors[trackId] === 'Using generated audio'
    
    if (isUsingFallback) {
      // Use fallback audio system
      if (fallbackSources.current[trackId]) {
        // Stop fallback audio
        if (fallbackSources.current[trackId].stop) {
          fallbackSources.current[trackId].stop()
        } else if (fallbackSources.current[trackId].gain) {
          fallbackSources.current[trackId].gain.gain.setValueAtTime(0, audioFallback.current?.audioContext?.currentTime || 0)
        }
        delete fallbackSources.current[trackId]
        setActiveTracks(prev => prev.filter(t => t.id !== trackId))
      } else {
        // Start fallback audio
        if (audioFallback.current) {
          let fallbackSource
          switch (trackId) {
            case 'rain':
              fallbackSource = audioFallback.current.generateRain()
              break
            default:
              fallbackSource = audioFallback.current.generateTone(440, 2)
          }
          fallbackSources.current[trackId] = fallbackSource
          setActiveTracks(prev => [...prev, { ...track, isPlaying: true }])
        }
      }
      return
    }

    // Use regular audio
    const audio = audioRefs.current[trackId]
    if (!audio) return

    try {
      if (audio.paused) {
        // Ensure audio is loaded before playing
        if (audio.readyState < 2) {
          await audio.load()
        }
        
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          await playPromise
          setActiveTracks(prev => [...prev, { ...track, isPlaying: true }])
        }
      } else {
        audio.pause()
        setActiveTracks(prev => prev.filter(t => t.id !== trackId))
      }
    } catch (error) {
      console.error(`Error playing ${track.name}:`, error)
      setAudioErrors(prev => ({ ...prev, [trackId]: 'Failed to play audio' }))
    }
  }

  const connectSpotify = () => {
    setShowSpotifyConnect(true)
    // In a real implementation, this would redirect to Spotify OAuth
    console.log('Connecting to Spotify...')
  }

  const updateTrackVolume = (trackId: string, volume: number) => {
    const audio = audioRefs.current[trackId]
    if (audio) {
      audio.volume = volume * masterVolume * (isMuted ? 0 : 1)
    }
    
    setActiveTracks(prev => 
      prev.map(track => 
        track.id === trackId 
          ? { ...track, volume } 
          : track
      )
    )
  }

  const stopAllTracks = () => {
    // Stop regular audio
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
    
    // Stop fallback audio
    Object.values(fallbackSources.current).forEach(source => {
      if (source && source.stop) {
        source.stop()
      } else if (source && source.gain) {
        source.gain.gain.setValueAtTime(0, audioFallback.current?.audioContext?.currentTime || 0)
      }
    })
    fallbackSources.current = {}
    
    setActiveTracks([])
  }

  const getTrackIcon = (trackId: string) => {
    switch (trackId) {
      case 'rain': return '🌧️'
      default: return '🔊'
    }
  }

  return (
    <>
      {/* Audio Toggle Button */}
      <button 
        className="audio-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Audio Settings"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Audio Panel */}
      {isVisible && (
        <div className="audio-panel">
          <div className="audio-header">
            <h3>Nostalgic Audio</h3>
            <div className="master-controls">
              <button 
                className="control-button"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button 
                className="control-button"
                onClick={stopAllTracks}
                title="Stop All"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Master Volume */}
          <div className="master-volume">
            <label>Master Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
            <span>{Math.round(masterVolume * 100)}%</span>
          </div>

          {/* Audio Tracks */}
          <div className="audio-tracks">
            <h4>🌿 Ambient Sounds</h4>
            <div className="track-list">
              {availableTracks.map(track => {
                const isActive = activeTracks.some(t => t.id === track.id)
                const hasError = audioErrors[track.id]
                return (
                  <div key={track.id} className={`track-item ${hasError ? 'error' : ''}`}>
                    <div className="track-info">
                      <button
                        className={`track-toggle ${isActive ? 'active' : ''} ${hasError ? 'disabled' : ''}`}
                        onClick={() => toggleTrack(track.id)}
                        title={hasError ? `Error: ${hasError}` : track.description}
                        disabled={!!hasError}
                      >
                        {hasError ? <VolumeX size={14} /> : isActive ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <span className="track-icon">{getTrackIcon(track.id)}</span>
                      <span className="track-name">{track.name}</span>
                      {hasError && <span className="error-indicator">⚠️</span>}
                    </div>
                    
                    {isActive && !hasError && (
                      <div className="track-volume">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={activeTracks.find(t => t.id === track.id)?.volume || 0.5}
                          onChange={(e) => updateTrackVolume(track.id, parseFloat(e.target.value))}
                          className="volume-slider small"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Spotify Connection */}
          <div className="spotify-section">
            <h4>🎵 Connect Spotify</h4>
            <p className="spotify-description">Listen to your favorite music while cooking</p>
            <button 
              className="spotify-connect-button"
              onClick={connectSpotify}
            >
              <Music size={20} />
              Connect Spotify
            </button>
          </div>

          {/* Quick Presets */}
          <div className="audio-presets">
            <h4>🎭 Quick Moods</h4>
            <div className="preset-buttons">
              <button 
                className="preset-button"
                onClick={() => {
                  stopAllTracks()
                  toggleTrack('rain')
                }}
              >
                Rainy Day
              </button>
              <button 
                className="preset-button"
                onClick={() => {
                  stopAllTracks()
                  toggleTrack('wind')
                }}
              >
                Gentle Breeze
              </button>
              <button 
                className="preset-button"
                onClick={() => {
                  stopAllTracks()
                  toggleTrack('rain')
                  toggleTrack('wind')
                }}
              >
                Nature Ambience
              </button>
            </div>
          </div>

          {/* Audio Status */}
          {Object.keys(audioErrors).length > 0 && (
            <div className="audio-status">
              <p className="status-message">
                ⚠️ Using generated ambient sounds for better experience.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Spotify Connect Modal */}
      {showSpotifyConnect && (
        <div className="spotify-modal-overlay">
          <div className="spotify-modal">
            <h3>Connect to Spotify</h3>
            <p>Listen to your favorite music while cooking</p>
            <div className="spotify-features">
              <div className="feature">
                <Music size={20} />
                <span>Play your playlists</span>
              </div>
              <div className="feature">
                <Music size={20} />
                <span>Control playback</span>
              </div>
              <div className="feature">
                <Music size={20} />
                <span>Discover new music</span>
              </div>
            </div>
            <div className="spotify-actions">
              <button 
                className="spotify-connect-btn"
                onClick={() => {
                  // In real implementation, redirect to Spotify OAuth
                  window.open('https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-private,user-read-email,playlist-read-private,user-modify-playback-state', '_blank')
                  setShowSpotifyConnect(false)
                }}
              >
                Connect Spotify Account
              </button>
              <button 
                className="spotify-cancel-btn"
                onClick={() => setShowSpotifyConnect(false)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AudioManager
