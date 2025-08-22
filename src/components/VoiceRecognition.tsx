import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import './VoiceRecognition.css'

interface VoiceRecognitionProps {
  onTranscript: (transcript: string) => void
  onError: (error: string) => void
  isListening: boolean
  onListeningChange: (listening: boolean) => void
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({
  onTranscript,
  onError,
  isListening,
  onListeningChange
}) => {
  const [isSupported, setIsSupported] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      
      // Configure recognition settings
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      
      // Event handlers
      recognitionRef.current.onstart = () => {
        console.log('Voice recognition started')
        onListeningChange(true)
      }
      
      recognitionRef.current.onend = () => {
        console.log('Voice recognition ended')
        onListeningChange(false)
      }
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        if (finalTranscript) {
          onTranscript(finalTranscript)
        }
      }
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        let errorMessage = 'Voice recognition error'
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again.'
            break
          case 'audio-capture':
            errorMessage = 'Microphone not found. Please check your microphone permissions.'
            break
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access in your browser.'
            break
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.'
            break
          default:
            errorMessage = `Voice recognition error: ${event.error}`
        }
        
        onError(errorMessage)
        onListeningChange(false)
      }
    } else {
      setIsSupported(false)
      onError('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.')
    }
  }, [onTranscript, onError, onListeningChange])

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      try {
        recognitionRef.current.start()
        setIsPaused(false)
      } catch (error) {
        console.error('Error starting voice recognition:', error)
        onError('Failed to start voice recognition. Please try again.')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        setIsPaused(false)
      } catch (error) {
        console.error('Error stopping voice recognition:', error)
      }
    }
  }

  const pauseListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        setIsPaused(true)
      } catch (error) {
        console.error('Error pausing voice recognition:', error)
      }
    }
  }

  if (!isSupported) {
    return (
      <div className="voice-not-supported">
        <MicOff size={24} />
        <p>Voice recognition not supported</p>
        <p className="browser-hint">Please use Chrome, Edge, or Safari</p>
      </div>
    )
  }

  return (
    <div className="voice-recognition">
      <div className="voice-status">
        {isListening ? (
          <div className="listening-indicator">
            <div className="pulse-ring"></div>
            <Mic size={24} className="listening-icon" />
            <span>Listening...</span>
          </div>
        ) : (
          <div className="not-listening">
            <Mic size={24} />
            <span>Tap to start speaking</span>
          </div>
        )}
      </div>
      
      <div className="voice-controls">
        {!isListening && !isPaused ? (
          <button 
            className="voice-button start"
            onClick={startListening}
            title="Start listening"
          >
            <Mic size={20} />
            Start Voice Input
          </button>
        ) : isListening ? (
          <div className="voice-actions">
            <button 
              className="voice-button pause"
              onClick={pauseListening}
              title="Pause listening"
            >
              <VolumeX size={20} />
              Pause
            </button>
            <button 
              className="voice-button stop"
              onClick={stopListening}
              title="Stop listening"
            >
              <MicOff size={20} />
              Stop
            </button>
          </div>
        ) : (
          <button 
            className="voice-button resume"
            onClick={startListening}
            title="Resume listening"
          >
            <Volume2 size={20} />
            Resume
          </button>
        )}
      </div>
      
      <div className="voice-tips">
        <p>💡 Tips for better voice recognition:</p>
        <ul>
          <li>Speak clearly and at a normal pace</li>
          <li>Reduce background noise</li>
          <li>Keep the microphone close to your mouth</li>
          <li>Use natural language like "I want to make comfort food"</li>
        </ul>
      </div>
    </div>
  )
}

export default VoiceRecognition
