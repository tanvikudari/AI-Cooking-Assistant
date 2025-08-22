import React, { useState } from 'react'
import { Float, Html, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import { PenTool, Camera, Mic, Smile } from 'lucide-react'
import './JournalEntry.css'

const JournalEntry: React.FC = () => {
  const [currentEntry, setCurrentEntry] = useState('')
  const [mood, setMood] = useState('happy')

  const moodOptions = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'excited', emoji: '🤩', label: 'Excited' },
    { id: 'frustrated', emoji: '😤', label: 'Frustrated' },
    { id: 'proud', emoji: '😌', label: 'Proud' },
    { id: 'tired', emoji: '😴', label: 'Tired' }
  ]

  const journalPrompts = [
    "What did you cook today?",
    "How did the recipe turn out?",
    "What would you do differently next time?",
    "What made you happy about cooking today?",
    "Share a cooking tip you learned!"
  ]

  return (
    <group>
      {/* Background Environment */}
      <group position={[0, -1, 0]}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>

        {/* Floating Books */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Float key={i} speed={1} rotationIntensity={0.5} floatIntensity={1}>
            <group position={[
              (Math.random() - 0.5) * 15,
              Math.random() * 3 + 1,
              (Math.random() - 0.5) * 15
            ]}>
              <mesh>
                <boxGeometry args={[0.8, 1.2, 0.1]} />
                <meshStandardMaterial color="#2d2d3a" />
              </mesh>
            </group>
          </Float>
        ))}
      </group>

      {/* Main Journal Interface */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[0, 2, 0]}>
          <Html center>
            <motion.div
              className="journal-interface visionos-glass"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="journal-header">
                <h2 className="visionos-heading">Today's Cooking Journal</h2>
                <div className="date">{new Date().toLocaleDateString()}</div>
              </div>

              {/* Mood Selector */}
              <div className="mood-section">
                <h3 className="visionos-subheading">How are you feeling?</h3>
                <div className="mood-options">
                  {moodOptions.map((moodOption) => (
                    <motion.button
                      key={moodOption.id}
                      className={`mood-button ${mood === moodOption.id ? 'selected' : ''}`}
                      onClick={() => setMood(moodOption.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mood-emoji">{moodOption.emoji}</span>
                      <span className="mood-label">{moodOption.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Journal Entry */}
              <div className="entry-section">
                <h3 className="visionos-subheading">Your Cooking Story</h3>
                <textarea
                  className="visionos-input journal-textarea"
                  placeholder="Write about your cooking experience today..."
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  rows={6}
                />
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <motion.button
                  className="action-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PenTool size={20} />
                  <span>Add Photo</span>
                </motion.button>
                <motion.button
                  className="action-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera size={20} />
                  <span>Take Photo</span>
                </motion.button>
                <motion.button
                  className="action-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic size={20} />
                  <span>Voice Note</span>
                </motion.button>
              </div>

              {/* Save Button */}
              <motion.button
                className="visionos-button save-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save Entry
              </motion.button>
            </motion.div>
          </Html>
        </group>
      </Float>

      {/* Floating Prompts */}
      {journalPrompts.map((prompt, index) => (
        <Float key={index} speed={2} rotationIntensity={1} floatIntensity={2}>
          <group position={[
            (Math.random() - 0.5) * 8,
            Math.random() * 4 + 2,
            (Math.random() - 0.5) * 8
          ]}>
            <Html center>
              <motion.div
                className="prompt-card visionos-glass"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <p>{prompt}</p>
              </motion.div>
            </Html>
          </group>
        </Float>
      ))}

      {/* Ambient Lighting */}
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#5856D6" />
      <pointLight position={[5, 3, 5]} intensity={0.2} color="#FF9500" />
      <pointLight position={[-5, 3, -5]} intensity={0.2} color="#34C759" />
    </group>
  )
}

export default JournalEntry
