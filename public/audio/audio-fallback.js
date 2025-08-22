// Audio Fallback System using Web Audio API
class AudioFallback {
  constructor() {
    this.audioContext = null
    this.initAudioContext()
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported')
    }
  }

  // Generate a simple tone
  generateTone(frequency = 440, duration = 2, type = 'sine') {
    if (!this.audioContext) return null

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
    
    return oscillator
  }

  // Generate rain-like sound
  generateRain() {
    if (!this.audioContext) return null
    
    const bufferSize = this.audioContext.sampleRate * 2
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const output = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }
    
    const noise = this.audioContext.createBufferSource()
    noise.buffer = buffer
    noise.loop = true
    
    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime)
    
    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    
    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    noise.start()
    return { source: noise, gain: gainNode }
  }

  // Generate wind-like sound
  generateWind() {
    if (!this.audioContext) return null
    
    const bufferSize = this.audioContext.sampleRate * 3
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const output = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      // Create wind-like noise with varying intensity
      const windIntensity = 0.3 + 0.2 * Math.sin(i / 1000) + 0.1 * Math.sin(i / 500)
      output[i] = (Math.random() * 2 - 1) * windIntensity
    }
    
    const wind = this.audioContext.createBufferSource()
    wind.buffer = buffer
    wind.loop = true
    
    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime)
    
    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime)
    
    wind.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    wind.start()
    return { source: wind, gain: gainNode }
  }

  // Generate fire-like crackling
  generateFire() {
    if (!this.audioContext) return null
    
    const bufferSize = this.audioContext.sampleRate * 0.5
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const output = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1))
    }
    
    const crackle = this.audioContext.createBufferSource()
    crackle.buffer = buffer
    crackle.loop = true
    
    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime)
    filter.Q.setValueAtTime(10, this.audioContext.currentTime)
    
    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime)
    
    crackle.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    crackle.start()
    return { source: crackle, gain: gainNode }
  }

  // Generate kitchen ambience
  generateKitchen() {
    if (!this.audioContext) return null
    
    const bufferSize = this.audioContext.sampleRate * 1
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const output = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 0.5 - 0.25
    }
    
    const ambience = this.audioContext.createBufferSource()
    ambience.buffer = buffer
    ambience.loop = true
    
    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(500, this.audioContext.currentTime)
    
    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(0.03, this.audioContext.currentTime)
    
    ambience.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    ambience.start()
    return { source: ambience, gain: gainNode }
  }

  // Generate vinyl crackle
  generateVinyl() {
    if (!this.audioContext) return null
    
    const bufferSize = this.audioContext.sampleRate * 0.2
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const output = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 0.3 - 0.15
    }
    
    const crackle = this.audioContext.createBufferSource()
    crackle.buffer = buffer
    crackle.loop = true
    
    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(3000, this.audioContext.currentTime)
    
    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime)
    
    crackle.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    crackle.start()
    return { source: crackle, gain: gainNode }
  }

  // Generate clock ticking
  generateClock() {
    if (!this.audioContext) return null
    
    const tick = () => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.1)
    }
    
    // Tick every second
    const interval = setInterval(tick, 1000)
    tick() // Initial tick
    
    return { interval, stop: () => clearInterval(interval) }
  }

  // Generate birds chirping
  generateBirds() {
    if (!this.audioContext) return null
    
    const chirp = () => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      const frequency = 2000 + Math.random() * 1000
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.3)
    }
    
    // Chirp every 2-4 seconds
    const interval = setInterval(chirp, 2000 + Math.random() * 2000)
    chirp() // Initial chirp
    
    return { interval, stop: () => clearInterval(interval) }
  }

  // Generate simple music (chord progression)
  generateMusic(type = 'jazz') {
    if (!this.audioContext) return null
    
    const chords = type === 'jazz' 
      ? [[261.63, 329.63, 392.00], [293.66, 349.23, 440.00], [329.63, 415.30, 493.88]] // C major, D minor, E minor
      : [[261.63, 293.66, 329.63], [293.66, 329.63, 349.23], [329.63, 349.23, 392.00]] // Classical progression
    
    let currentChord = 0
    
    const playChord = () => {
      const chord = chords[currentChord]
      chord.forEach(frequency => {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.03, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2)
        
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 2)
      })
      
      currentChord = (currentChord + 1) % chords.length
    }
    
    const interval = setInterval(playChord, 2000)
    playChord() // Initial chord
    
    return { interval, stop: () => clearInterval(interval) }
  }
}

// Export for use in components
window.AudioFallback = AudioFallback
