import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  ChefHat, 
  Clock, 
  Heart, 
  Settings, 
  Plus,
  Search,
  Filter,
  FileText,
  StickyNote,
  Mic,
  Volume2,
  Share,
  Bookmark,
  X,
  Users,
  Camera,
  Star,
  MessageCircle,
  Home,
  PenTool
} from 'lucide-react'
import './SidePanel.css'

interface SidePanelProps {}

const SidePanel: React.FC<SidePanelProps> = () => {
  const [showFullRecipe, setShowFullRecipe] = useState(false)
  const [stickyNotes, setStickyNotes] = useState<string[]>([
    'Remember to call Mom about her pasta recipe',
    'Take photos of the cooking process',
    'Share this memory with Grandma'
  ])
  const [newNote, setNewNote] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const familyRecipes = [
    { 
      id: 'grandma-sauce', 
      name: "Grandma's Sunday Sauce", 
      person: "Grandma Maria",
      emotion: "Nostalgic",
      time: '3 hours', 
      rating: 5,
      story: "Passed down through 3 generations"
    },
    { 
      id: 'dad-sushi', 
      name: "Dad's Sushi Adventure", 
      person: "Dad",
      emotion: "Amused",
      time: '2 hours', 
      rating: 4,
      story: "His first attempt was a beautiful disaster"
    },
    { 
      id: 'mom-cake', 
      name: "Mom's Birthday Cake", 
      person: "Mom",
      emotion: "Joyful",
      time: '4 hours', 
      rating: 5,
      story: "The cake collapsed but we laughed for hours"
    }
  ]

  const lovedOnes = [
    { id: 1, name: "Grandma", relationship: "Grandmother", memories: 23, avatar: "🧑🏽" },
    { id: 2, name: "Amma", relationship: "Mother", memories: 45, avatar: "🧑🏽" },
    { id: 3, name: "Appa", relationship: "Father", memories: 18, avatar: "🧑🏽" },
    { id: 4, name: "Sister", relationship: "Sister", memories: 32, avatar: "🧑🏽" }
  ]

  const journalEntries = [
    { 
      id: 1, 
      title: 'The Day We Made Grandma\'s Sauce', 
      date: '2024-01-15', 
      mood: 'Nostalgic', 
      people: ['Grandma Maria', 'Mom'],
      notes: 'Grandma taught me the secret ingredient - love. She says cooking is how we show love to our family.' 
    },
    { 
      id: 2, 
      title: 'Dad\'s Sushi Disaster', 
      date: '2024-01-12', 
      mood: 'Amused', 
      people: ['Dad', 'Me'],
      notes: 'Rice was everywhere! But his determination to learn something new was inspiring.' 
    },
    { 
      id: 3, 
      title: 'Perfect Family Dinner', 
      date: '2024-01-10', 
      mood: 'Joyful', 
      people: ['Mom', 'Dad', 'Sister'],
      notes: 'Everyone was together, laughing, sharing stories. This is what cooking is really about.' 
    }
  ]

  const addStickyNote = () => {
    if (newNote.trim()) {
      setStickyNotes([...stickyNotes, newNote])
      setNewNote('')
    }
  }

  const removeStickyNote = (index: number) => {
    setStickyNotes(stickyNotes.filter((_, i) => i !== index))
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', section: 'home' },
    { id: 'family', icon: Users, label: 'Family', section: 'family' },
    { id: 'memories', icon: Heart, label: 'Memories', section: 'memories' },
    { id: 'notes', icon: StickyNote, label: 'Notes', section: 'notes' },
    { id: 'settings', icon: Settings, label: 'Settings', section: 'settings' }
  ]

  return (
    <div className="side-panel-container">
      {/* Thin Icon Bar */}
      <motion.div 
        className="icon-bar visionos-glass"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            className={`icon-button ${activeSection === item.section ? 'active' : ''}`}
            onClick={() => toggleSection(item.section)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={item.label}
          >
            <item.icon size={20} />
          </motion.button>
        ))}
      </motion.div>

      {/* Expandable Content Panel */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            className="content-panel visionos-glass"
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {/* Header */}
            <div className="panel-header">
              <h2 className="visionos-heading">
                {activeSection === 'home' && 'Cooking Memories'}
                {activeSection === 'family' && 'Loved Ones'}
                {activeSection === 'memories' && 'Family Recipes'}
                {activeSection === 'notes' && 'Memory Notes'}
                {activeSection === 'settings' && 'Settings'}
              </h2>
              <button 
                className="close-button"
                onClick={() => setActiveSection(null)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="panel-content">
              {activeSection === 'home' && (
                <div className="home-section">
                  <div className="welcome-card visionos-card">
                    <h3>Welcome to Your Kitchen</h3>
                    <p>Where every meal tells a story and every recipe holds a memory.</p>
                    <div className="stats-grid">
                      <button 
                        className="stat-button"
                        onClick={() => toggleSection('memories')}
                      >
                        <div className="stat-content">
                          <Heart size={20} />
                          <span>47 Memories</span>
                        </div>
                        <div className="stat-plate">
                          <span className="plate-icon">📝</span>
                          <span className="plate-status">Memories</span>
                        </div>
                      </button>
                      <button 
                        className="stat-button"
                        onClick={() => toggleSection('family')}
                      >
                        <div className="stat-content">
                          <Users size={20} />
                          <span>12 Loved Ones</span>
                        </div>
                        <div className="stat-plate">
                          <span className="plate-icon">❤️</span>
                          <span className="plate-status">Family</span>
                        </div>
                      </button>
                      <button 
                        className="stat-button"
                        onClick={() => toggleSection('notes')}
                      >
                        <div className="stat-content">
                          <Star size={20} />
                          <span>156 Stories</span>
                        </div>
                        <div className="stat-plate">
                          <span className="plate-icon">📖</span>
                          <span className="plate-status">Stories</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'family' && (
                <div className="family-section">
                  <div className="loved-ones-grid">
                    {lovedOnes.map((person) => (
                      <motion.div
                        key={person.id}
                        className="person-card"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="person-avatar">{person.avatar}</div>
                        <div className="person-header">
                          <h4 className="person-name">{person.name}</h4>
                        </div>
                        <span className="relationship">{person.relationship}</span>
                        <div className="memories-count">
                          <Heart size={14} />
                          <span>{person.memories} memories</span>
                        </div>
                        <div className="person-plate">
                          <span className="plate-icon">👥</span>
                          <span className="plate-status">Family Member</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'memories' && (
                <div className="memories-section">
                  {/* Recent Memories */}
                  <div className="memory-category">
                    <h3 className="category-title">📅 Recent Memories</h3>
                    <div className="category-content">
                      {familyRecipes.slice(0, 2).map((recipe) => (
                        <motion.div
                          key={recipe.id}
                          className="memory-card"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="memory-header">
                            <h4 className="memory-title">{recipe.name}</h4>
                            <div className="memory-emotion">
                              <span className="emotion-text">{recipe.emotion}</span>
                            </div>
                          </div>
                          <div className="memory-person">
                            <span className="person-emoji">👨‍👩‍👧‍👦</span>
                            <span className="person-name">{recipe.person}</span>
                          </div>
                          <p className="memory-story">{recipe.story}</p>
                          <div className="memory-plate">
                            <span className="plate-icon">🍽️</span>
                            <span className="plate-status">Ready to Cook</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Family Traditions */}
                  <div className="memory-category">
                    <h3 className="category-title">🏠 Family Traditions</h3>
                    <div className="category-content">
                      {familyRecipes.slice(2, 4).map((recipe) => (
                        <motion.div
                          key={recipe.id}
                          className="memory-card"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="memory-header">
                            <h4 className="memory-title">{recipe.name}</h4>
                            <div className="memory-emotion">
                              <span className="emotion-text">{recipe.emotion}</span>
                            </div>
                          </div>
                          <div className="memory-person">
                            <span className="person-emoji">👵</span>
                            <span className="person-name">{recipe.person}</span>
                          </div>
                          <p className="memory-story">{recipe.story}</p>
                          <div className="memory-plate">
                            <span className="plate-icon">🥘</span>
                            <span className="plate-status">Traditional</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Special Occasions */}
                  <div className="memory-category">
                    <h3 className="category-title">🎉 Special Occasions</h3>
                    <div className="category-content">
                      {familyRecipes.slice(4).map((recipe) => (
                        <motion.div
                          key={recipe.id}
                          className="memory-card"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="memory-header">
                            <h4 className="memory-title">{recipe.name}</h4>
                            <div className="memory-emotion">
                              <span className="emotion-text">{recipe.emotion}</span>
                            </div>
                          </div>
                          <div className="memory-person">
                            <span className="person-emoji">👨‍👩‍👧‍👦</span>
                            <span className="person-name">{recipe.person}</span>
                          </div>
                          <p className="memory-story">{recipe.story}</p>
                          <div className="memory-plate">
                            <span className="plate-icon">🎂</span>
                            <span className="plate-status">Celebration</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notes' && (
                <div className="notes-section">
                  <div className="notes-input">
                    <input
                      type="text"
                      placeholder="Add a memory note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="visionos-input"
                      onKeyPress={(e) => e.key === 'Enter' && addStickyNote()}
                      aria-label="Enter a new memory note"
                    />
                    <button 
                      className="add-note-button" 
                      onClick={addStickyNote}
                      aria-label="Add new memory note"
                      type="button"
                    >
                      <Plus size={16} aria-hidden="true" />
                      <span className="sr-only">Add Note</span>
                    </button>
                  </div>
                  
                  <ul className="notes-list" role="list" aria-label="Memory notes">
                    {stickyNotes.map((note, index) => (
                      <motion.li
                        key={index}
                        className="note-item visionos-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="note-text">{note}</span>
                        <button 
                          className="delete-btn"
                          onClick={() => removeStickyNote(index)}
                          aria-label={`Delete memory note: ${note}`}
                          type="button"
                        >
                          <span aria-hidden="true">×</span>
                          <span className="sr-only">Delete</span>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {activeSection === 'voice' && (
                <div className="voice-section">
                  <motion.button
                    className={`voice-record-button ${isRecording ? 'recording' : ''}`}
                    onClick={toggleRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isRecording ? (
                      <>
                        <div className="recording-indicator" />
                        <span>Stop Recording</span>
                      </>
                    ) : (
                      <>
                        <Mic size={20} />
                        <span>Record a Story</span>
                      </>
                    )}
                  </motion.button>
                  
                  <div className="voice-stories">
                    <h3>Recent Stories</h3>
                    <div className="story-item">
                      <Volume2 size={16} />
                      <span>Grandma's Cooking Tips - 3:45</span>
                      <span className="story-date">Today</span>
                    </div>
                    <div className="story-item">
                      <Volume2 size={16} />
                      <span>Dad's Sushi Story - 2:12</span>
                      <span className="story-date">Yesterday</span>
                    </div>
                  </div>
                </div>
              )}



              {activeSection === 'settings' && (
                <div className="settings-section">
                  <div className="setting-item">
                    <h3>Theme</h3>
                    <select className="visionos-input">
                      <option>Warm Memories</option>
                      <option>Cozy Kitchen</option>
                      <option>Family Time</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <h3>Memory Reminders</h3>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="setting-item">
                    <h3>Share with Family</h3>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SidePanel

