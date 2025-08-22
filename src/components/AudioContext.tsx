import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AudioContextType {
  // Audio state
  isAudioEnabled: boolean
  masterVolume: number
  activeTracks: string[]
  
  // Audio suggestions based on cooking context
  suggestAudioForBlock: (blockId: string) => string[]
  suggestAudioForEmotion: (emotion: string) => string[]
  suggestAudioForTime: () => string[]
  
  // Audio controls
  toggleAudio: () => void
  setMasterVolume: (volume: number) => void
  playTrack: (trackId: string) => void
  stopTrack: (trackId: string) => void
  playPreset: (presetName: string) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

interface AudioProviderProps {
  children: ReactNode
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [masterVolume, setMasterVolume] = useState(0.7)
  const [activeTracks, setActiveTracks] = useState<string[]>([])

  // Audio suggestions based on cooking blocks
  const blockAudioSuggestions = {
    'block1': ['birds', 'classical'], // Calm, reflective sounds for emotional input
    'block2': ['kitchen', 'chopping'], // Kitchen sounds for ingredient discovery
    'block3': ['sizzle', 'boiling'], // Cooking sounds for recipe execution
    'block4': ['vinyl', 'clock'], // Nostalgic sounds for memory capture
    'block5': ['jazz', 'fireplace'] // Warm, celebratory sounds for sharing
  }

  // Audio suggestions based on emotions
  const emotionAudioSuggestions = {
    'nostalgic': ['vinyl', 'clock', 'birds'],
    'comforting': ['fireplace', 'rain', 'classical'],
    'energetic': ['kitchen', 'chopping', 'jazz'],
    'peaceful': ['rain', 'birds', 'classical'],
    'cozy': ['fireplace', 'vinyl', 'jazz'],
    'focused': ['kitchen', 'sizzle', 'boiling']
  }

  // Audio suggestions based on time of day
  const timeAudioSuggestions = {
    'morning': ['birds', 'classical'],
    'afternoon': ['kitchen', 'jazz'],
    'evening': ['fireplace', 'vinyl'],
    'night': ['rain', 'clock']
  }

  const suggestAudioForBlock = (blockId: string): string[] => {
    return blockAudioSuggestions[blockId as keyof typeof blockAudioSuggestions] || []
  }

  const suggestAudioForEmotion = (emotion: string): string[] => {
    const emotionKey = emotion.toLowerCase()
    for (const [key, tracks] of Object.entries(emotionAudioSuggestions)) {
      if (emotionKey.includes(key)) {
        return tracks
      }
    }
    return ['classical'] // Default fallback
  }

  const suggestAudioForTime = (): string[] => {
    const hour = new Date().getHours()
    let timeOfDay: keyof typeof timeAudioSuggestions
    
    if (hour < 12) timeOfDay = 'morning'
    else if (hour < 17) timeOfDay = 'afternoon'
    else if (hour < 21) timeOfDay = 'evening'
    else timeOfDay = 'night'
    
    return timeAudioSuggestions[timeOfDay]
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
  }

  const playTrack = (trackId: string) => {
    if (!activeTracks.includes(trackId)) {
      setActiveTracks(prev => [...prev, trackId])
    }
  }

  const stopTrack = (trackId: string) => {
    setActiveTracks(prev => prev.filter(id => id !== trackId))
  }

  const playPreset = (presetName: string) => {
    const presets = {
      'cozy-evening': ['rain', 'jazz'],
      'cooking-time': ['kitchen', 'chopping'],
      'nostalgic-memories': ['fireplace', 'vinyl'],
      'morning-cooking': ['birds', 'classical'],
      'evening-comfort': ['fireplace', 'clock']
    }
    
    const tracks = presets[presetName as keyof typeof presets] || []
    setActiveTracks(tracks)
  }

  const value: AudioContextType = {
    isAudioEnabled,
    masterVolume,
    activeTracks,
    suggestAudioForBlock,
    suggestAudioForEmotion,
    suggestAudioForTime,
    toggleAudio,
    setMasterVolume,
    playTrack,
    stopTrack,
    playPreset
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}

export default AudioContext
