import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Users, Clock, Star, MessageCircle, Camera, Settings, Plus, Save, X, 
  Link, Share2, ChefHat, BookOpen, Sparkles, Mic, Edit3, ArrowRight, 
  CheckCircle, Search, ShoppingCart, Timer, Utensils, Home, Phone, Mail, PenTool,
  HelpCircle
} from 'lucide-react'
import AudioManager from './AudioManager'
import RecipeSearch from './RecipeSearch'
import VoiceRecognition from './VoiceRecognition'
import './CookingScene.css'

// Block Types for the complete flow
type BlockType = 'block1' | 'block2' | 'block3' | 'block4' | 'block5'

interface CookingSession {
  emotionalIntent: string
  recipe: string
  ingredients: string[]
  missingIngredients: string[]
  cookingSteps: string[]
  memories: string[]
  sharedWith: string[]
  completed: boolean
}

const CookingScene: React.FC = () => {
  // Main state
  const [currentBlock, setCurrentBlock] = useState<BlockType>('block1')
  const [session, setSession] = useState<CookingSession>({
    emotionalIntent: '',
    recipe: '',
    ingredients: [],
    missingIngredients: [],
    cookingSteps: [],
    memories: [],
    sharedWith: [],
    completed: false
  })

  // Block 1: Emotional Intent Discovery
  const [inputText, setInputText] = useState('')
  const [selectedModality, setSelectedModality] = useState<'speak' | 'type' | null>(null)
  const [showRecipeSearch, setShowRecipeSearch] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [isListening, setIsListening] = useState(false)
  const [voiceError, setVoiceError] = useState<string>('')

  // Block 2: Ingredient Discovery
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([
    'tomatoes', 'onions', 'garlic', 'ginger', 'curry leaves', 'mustard seeds',
    'cumin seeds', 'black pepper', 'salt', 'oil', 'water'
  ])
  const [pantryItems, setPantryItems] = useState<string[]>([
    'tomatoes', 'onions', 'garlic', 'ginger', 'curry leaves', 'mustard seeds',
    'cumin seeds', 'black pepper', 'salt', 'oil', 'water'
  ])
  const [neededIngredients, setNeededIngredients] = useState<string[]>([
    'tamarind', 'rasam powder', 'coriander leaves'
  ])

  // Block 3: Recipe Adaptation
  const [adaptedRecipe, setAdaptedRecipe] = useState<any>(null)
  const [cookingProgress, setCookingProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  // Block 4: Memory Integration
  const [memoryNotes, setMemoryNotes] = useState('')
  const [photoTaken, setPhotoTaken] = useState(false)

  // Block 5: Sharing & Reflection
  const [sharePlatform, setSharePlatform] = useState<string>('')
  const [reflectionNotes, setReflectionNotes] = useState('')

  // Journaling Prompts during cooking downtime
  const [showJournalingPrompt, setShowJournalingPrompt] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [promptTimer, setPromptTimer] = useState<number | null>(null)
  const [userEngaged, setUserEngaged] = useState(false)

  // Collapsible step functionality
  const [isStepCollapsed, setIsStepCollapsed] = useState(false)

  // Help functionality
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [helpType, setHelpType] = useState<'error' | 'general' | null>(null)

  // Memory animation state
  const [showMemoryAnimation, setShowMemoryAnimation] = useState(false)
  const [showCelebrationAnimation, setShowCelebrationAnimation] = useState(false)
  const [promptsDisabled, setPromptsDisabled] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)

  // Journaling prompts for cooking downtime
  const journalingPrompts = [
    "What memory does this dish bring back?",
    "Who taught you to make this recipe?",
    "When was the last time you had this dish?",
    "What does this dish remind you of?",
    "Who would you love to share this meal with?",
    "What's your favorite memory of eating this dish?",
    "What does this dish mean to your family?",
    "What's the story behind this recipe?",
    "How does this dish make you feel today?",
    "What makes cooking this dish special today?"
  ]

  // Auto-collapse current step when journaling prompt appears
  useEffect(() => {
    if (showJournalingPrompt && !isStepCollapsed) {
      setIsStepCollapsed(true)
    }
  }, [showJournalingPrompt, isStepCollapsed])

  // Example flow for "I miss mom's rasam"
  const handleBlock1Complete = () => {
    const emotionalIntent = inputText || "I miss mom's rasam"
    setSession(prev => ({ ...prev, emotionalIntent }))
    
    // AI Analysis: Understands this is about comfort, nostalgia, maternal cooking
    console.log('Block 1 Complete - Emotional Intent:', emotionalIntent)
    console.log('AI Analysis: Comfort food, maternal connection, traditional recipe')
    
    // If user mentioned a specific recipe, show recipe search
    if (emotionalIntent.toLowerCase().includes('recipe') || 
        emotionalIntent.toLowerCase().includes('cook') ||
        emotionalIntent.toLowerCase().includes('make')) {
      setShowRecipeSearch(true)
    } else {
      setCurrentBlock('block2')
    }
  }

  const handleRecipeSelect = (recipe: any) => {
    setSelectedRecipe(recipe)
    setSession(prev => ({ 
      ...prev, 
      recipe: recipe.title,
      emotionalIntent: `${prev.emotionalIntent} - Found recipe: ${recipe.title}`
    }))
    setCurrentBlock('block2')
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInputText(transcript)
  }

  const handleVoiceError = (error: string) => {
    setVoiceError(error)
    // Clear error after 5 seconds
    setTimeout(() => setVoiceError(''), 5000)
  }

  const handleIngredientToggle = (ingredient: string, isAvailable: boolean, toggleToSelected: boolean) => {
    if (isAvailable) {
      if (!toggleToSelected) {
        // Moving from available to needed (when unchecked)
        setAvailableIngredients(prev => prev.filter(item => item !== ingredient))
        setNeededIngredients(prev => [...prev, ingredient])
      }
    } else {
      if (toggleToSelected) {
        // Moving from needed to available (when checked)
        setNeededIngredients(prev => prev.filter(item => item !== ingredient))
        setAvailableIngredients(prev => [...prev, ingredient])
      }
    }
  }

  const handleBlock2Complete = () => {
    // AI suggests Rasam recipe and checks available ingredients
    const rasamIngredients = [
      'tomatoes', 'tamarind', 'rasam powder', 'curry leaves', 'mustard seeds',
      'cumin seeds', 'garlic', 'ginger', 'onions', 'coriander leaves'
    ]
    
    const missing = rasamIngredients.filter(ing => !pantryItems.includes(ing))
    const available = rasamIngredients.filter(ing => pantryItems.includes(ing))
    
    setSession(prev => ({
      ...prev,
      recipe: "Mom's Comfort Rasam",
      ingredients: available,
      missingIngredients: missing
    }))
    
    console.log('Block 2 Complete - Ingredient Analysis:')
    console.log('Available:', available)
    console.log('Missing:', missing)
    console.log('AI Suggestion: Use available ingredients, substitute missing ones')
    
    setCurrentBlock('block3')
    console.log('Moving to block 3...')
  }

  const handleBlock3Complete = () => {
    // AI adapts recipe based on available ingredients
    const adaptedSteps = [
      "1. Heat oil in a pan, add mustard seeds and cumin seeds",
      "2. Add chopped onions, garlic, and ginger",
      "3. Add chopped tomatoes and cook until soft",
      "4. Add water, salt, and black pepper",
      "5. Simmer for 10 minutes until flavors blend",
      "6. Garnish with curry leaves and serve hot"
    ]
    
    setAdaptedRecipe({
      title: "Adapted Mom's Rasam",
      steps: adaptedSteps,
      time: "20 minutes",
      difficulty: "Easy"
    })
    
    setSession(prev => ({ ...prev, cookingSteps: adaptedSteps }))
    
    console.log('Block 3 Complete - Recipe Adaptation:')
    console.log('Adapted for available ingredients')
    console.log('Simplified for comfort cooking')
    
    setCurrentBlock('block4')
    
    // Start journaling prompt timer for the cooking session
    startJournalingPromptTimer()
  }

  // Journaling prompt functions
  const startJournalingPromptTimer = () => {
    // Don't show prompts if disabled
    if (promptsDisabled) {
      return
    }
    
    // Clear any existing timer
    if (promptTimer) {
      clearTimeout(promptTimer)
    }
    
    // For demonstration: show prompt immediately when step 3 is opened
    if (currentStep === 2) { // Step 3 (0-indexed)
      const randomPrompt = journalingPrompts[Math.floor(Math.random() * journalingPrompts.length)]
      setCurrentPrompt(randomPrompt)
      setShowJournalingPrompt(true)
      return
    }
    
    // Show prompt after 30 seconds of cooking (simulating downtime) for other steps
    const timer = setTimeout(() => {
      if (!userEngaged && !promptsDisabled) {
        const randomPrompt = journalingPrompts[Math.floor(Math.random() * journalingPrompts.length)]
        setCurrentPrompt(randomPrompt)
        setShowJournalingPrompt(true)
      }
    }, 30000) // 30 seconds
    
    setPromptTimer(timer)
  }

  const handlePromptEngage = () => {
    setShowVoiceInput(true)
  }

  const handlePromptDismiss = () => {
    setShowJournalingPrompt(false)
    setPromptsDisabled(true)
    // Don't show any more prompts
  }

  const handlePromptSkip = () => {
    setShowJournalingPrompt(false)
    setPromptsDisabled(true)
    // Don't show any more prompts
  }

  const handleVoiceSave = () => {
    setShowVoiceInput(false)
    setShowJournalingPrompt(false)
    setPromptsDisabled(true)
    // Save the reflection and prompt
    console.log('Saved reflection for prompt:', currentPrompt)
  }

  const handleVoiceSkip = () => {
    setShowVoiceInput(false)
    setShowJournalingPrompt(false)
    setPromptsDisabled(true)
  }

  const toggleStepCollapse = () => {
    setIsStepCollapsed(!isStepCollapsed)
  }

  const handleHelpClick = () => {
    setHelpType('general')
    setShowHelpModal(true)
  }

  const handleErrorReport = () => {
    setHelpType('error')
    setShowHelpModal(true)
  }

  const closeHelpModal = () => {
    setShowHelpModal(false)
    setHelpType(null)
  }

  const handleSkipMemory = () => {
    setCurrentBlock('block5')
  }

  const handleSaveMemory = () => {
    setShowMemoryAnimation(true)
    // Hide animation after 2 seconds and proceed
    setTimeout(() => {
      setShowMemoryAnimation(false)
      handleBlock4Complete()
    }, 2000)
  }

  const handleCompleteJourney = () => {
    // Show celebratory animation
    setShowCelebrationAnimation(true)
    
    // After animation, navigate to a completion state
    setTimeout(() => {
      setShowCelebrationAnimation(false)
      // Set to a completion block that shows the journey summary
      setCurrentBlock('block1')
      // Reset only the cooking progress, keep session data
      setCurrentStep(0)
      setCookingProgress(0)
      setShowJournalingPrompt(false)
      setPromptsDisabled(false)
      setShowVoiceInput(false)
      setCurrentPrompt('')
      setUserEngaged(false)
      setIsStepCollapsed(false)
      // Clear input text to show fresh start
      setInputText('')
      setSelectedModality(null)
    }, 2000)
  }

  const handleNextStep = () => {
    if (currentStep < 4) { // 5 steps total (0-4)
      setCurrentStep(currentStep + 1)
      setCookingProgress(((currentStep + 1) / 5) * 100)
      // Reopen the step when moving to next step
      setIsStepCollapsed(false)
      // Start journaling prompt timer for this step
      startJournalingPromptTimer()
    } else {
      handleBlock3Complete()
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setCookingProgress(((currentStep - 1) / 6) * 100)
    }
  }

  const getCurrentInstruction = () => {
    if (!adaptedRecipe) return "Loading recipe..."
    
    const step = currentStep
    switch (step) {
      case 0:
        return "Turn on the stove to start cooking"
      case 1:
        return "Add oil to the pan and wait for it to heat up"
      case 2:
        return "Add mustard seeds and cumin seeds to the hot oil"
      case 3:
        return "Add chopped onions, garlic, and ginger"
      case 4:
        return "Add chopped tomatoes and cook until soft"
      case 5:
        return "Add water, salt, and black pepper"
      case 6:
        return "Simmer for 10 minutes until flavors blend"
      default:
        return "Cooking complete! Time to garnish and serve"
    }
  }



  const handleBlock4Complete = () => {
    // Memory integration during cooking
    const memories = [
      "Mom always made this when I was sick",
      "The smell reminds me of home",
      "She used to say 'rasam heals everything'"
    ]
    
    setSession(prev => ({ ...prev, memories }))
    
    console.log('Block 4 Complete - Memory Integration:')
    console.log('Memories captured during cooking process')
    console.log('Emotional connection strengthened')
    
    setCurrentBlock('block5')
  }

  const handleBlock5Complete = () => {
    // Sharing and reflection
    setSession(prev => ({ 
      ...prev, 
      sharedWith: ['Mom'],
      completed: true 
    }))
    
    console.log('Block 5 Complete - Sharing & Reflection:')
    console.log('Recipe shared with Mom')
    console.log('Emotional cooking journey completed')
  }

  const handleShare = (platform: string) => {
    setSharePlatform(platform)
    setSession(prev => ({ ...prev, sharedWith: [...prev.sharedWith, platform] }))
  }

  // Render Block 1: Emotional Intent Discovery
  const renderBlock1 = () => (
    <motion.div 
      className="block-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className={`block-header ${selectedModality === 'type' ? 'compact' : ''}`}>
        <h1 className="block-title">What brought you to the kitchen today?</h1>
        <p className="block-subtitle">Share your mood, craving, or what's on your mind</p>
      </div>

      {!selectedModality ? (
        <div className="modality-choice">
          <button 
            className="modality-button voice-hero"
            onClick={() => setSelectedModality('speak')}
          >
            <Mic size={32} />
            <span>Voice</span>
          </button>
          <div className="modality-row">
            <button 
              className="modality-button"
              onClick={() => setSelectedModality('type')}
            >
              <Edit3 size={24} />
              <span>Text</span>
            </button>
            <button 
              className="modality-button search-button"
              onClick={() => setShowRecipeSearch(true)}
            >
              <Search size={24} />
              <span>Search</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="input-section">
          {selectedModality === 'type' ? (
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tell me what's on your mind... (e.g., 'I want to make mom's comfort food' or 'Looking for a quick dinner recipe')"
              className="text-input"
              autoFocus
            />
          ) : (
            <VoiceRecognition
              onTranscript={handleVoiceTranscript}
              onError={handleVoiceError}
              isListening={isListening}
              onListeningChange={setIsListening}
            />
          )}
          
          <div className="input-actions">
            <button 
              className="secondary-button"
              onClick={() => setSelectedModality(null)}
            >
              Change method
            </button>
            <button 
              className="primary-button"
              onClick={handleBlock1Complete}
              disabled={!inputText.trim()}
            >
              Continue
              <ArrowRight size={16} />
            </button>
          </div>
          
          {voiceError && (
            <div className="voice-error">
              <p>{voiceError}</p>
            </div>
          )}
        </div>
      )}


    </motion.div>
  )

  // Render Block 2: Ingredient Discovery
  const renderBlock2 = () => (
    <motion.div 
      className="block-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="block-header">
        <h1 className="block-title">What's in your kitchen?</h1>
        <p className="block-subtitle-secondary">Let's create something special with what you have</p>
      </div>

      <div className="ingredient-analysis" role="region" aria-label="Ingredient Selection">
        <div className="analysis-section">
          <h3 id="available-ingredients-heading">Available in your pantry:</h3>
          <div 
            className="ingredient-grid" 
            role="group" 
            aria-labelledby="available-ingredients-heading"
            aria-describedby="available-instructions"
          >
            <div id="available-instructions" className="sr-only">
              Use Tab to navigate through ingredients. Press Space or Enter to select or deselect.
            </div>
            {availableIngredients.map(item => (
              <button
                key={item}
                className="ingredient-item available"
                type="button"
                role="checkbox"
                aria-pressed="true"
                aria-label={`${item} - Selected`}
                onClick={() => handleIngredientToggle(item, true, false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleIngredientToggle(item, true, false);
                  }
                }}
              >
                <CheckCircle size={18} className="check-icon" aria-hidden="true" />
                <span className="ingredient-text">{item}</span>
                <span className="sr-only">Selected</span>
              </button>
            ))}
          </div>
        </div>

        <div className="analysis-section">
          <h3 id="needed-ingredients-heading">For perfect rasam, you might need:</h3>
          <div 
            className="ingredient-grid" 
            role="group" 
            aria-labelledby="needed-ingredients-heading"
            aria-describedby="needed-instructions"
          >
            <div id="needed-instructions" className="sr-only">
              Use Tab to navigate through ingredients. Press Space or Enter to select or deselect.
            </div>
            {neededIngredients.map(item => (
              <button
                key={item}
                className="ingredient-item missing"
                type="button"
                role="checkbox"
                aria-pressed="false"
                aria-label={`${item} - Not selected`}
                onClick={() => handleIngredientToggle(item, false, true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleIngredientToggle(item, false, true);
                  }
                }}
              >
                <div className="unchecked-icon" aria-hidden="true" />
                <span className="ingredient-text">{item}</span>
                <span className="sr-only">Not selected</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ai-suggestion">
          <Sparkles size={20} />
          <p>I can adapt the recipe to work with what you have!</p>
        </div>

        <div className="cta-section">
          <button 
            className="primary-button cta-button"
            onClick={handleBlock2Complete}
            aria-describedby="cta-description"
          >
            <Sparkles size={20} aria-hidden="true" />
            Adapt Recipe for Me
            <ArrowRight size={20} aria-hidden="true" />
          </button>
          <p id="cta-description" className="cta-hint">Click to continue to the virtual kitchen</p>
        </div>
      </div>
    </motion.div>
  )

  // Render Block 3: Recipe Adaptation
  const renderBlock3 = () => (
    <motion.div 
      className="block-container cooking-session"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Current Step Header or Journaling Prompt */}
      <AnimatePresence mode="wait">
        {showJournalingPrompt ? (
          <motion.div 
            className="journaling-prompt-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="journaling-prompt-card">
              <div className="prompt-header">
                <span className="prompt-icon">💭</span>
                <span className="prompt-label">OPTIONAL REFLECTION</span>
              </div>
              <p className="prompt-text">{currentPrompt}</p>
              <div className="prompt-actions">
                {!showVoiceInput ? (
                  <>
                    <button 
                      className="prompt-btn engage-btn"
                      onClick={handlePromptEngage}
                      aria-label="Engage with this reflection prompt"
                    >
                      <PenTool size={16} />
                      <span>Reflect</span>
                    </button>
                    <button 
                      className="prompt-btn dismiss-btn"
                      onClick={handlePromptDismiss}
                      aria-label="Dismiss this prompt"
                    >
                      <X size={16} />
                      <span>Dismiss</span>
                    </button>
                    <button 
                      className="prompt-btn skip-btn"
                      onClick={handlePromptSkip}
                      aria-label="Skip this prompt"
                    >
                      <span>Skip</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="prompt-btn voice-btn"
                      aria-label="Start voice recording"
                    >
                      <Mic size={20} />
                      <span>Start Speaking</span>
                    </button>
                    <button 
                      className="prompt-btn save-btn"
                      onClick={handleVoiceSave}
                      aria-label="Save reflection"
                    >
                      <Save size={16} />
                      <span>Save</span>
                    </button>
                    <button 
                      className="prompt-btn skip-btn"
                      onClick={handleVoiceSkip}
                      aria-label="Skip voice recording"
                    >
                      <span>Skip</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className={`current-step-header ${isStepCollapsed ? 'collapsed' : ''}`}>
            <div className="step-header-content">
              <div className="step-info">
                <h2 className="step-title">Step {currentStep + 1} of 5</h2>
                <AnimatePresence>
                  {isStepCollapsed && (
                    <motion.div 
                      className="collapsed-indicator"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="indicator-icon">🥘</span>
                      <span className="indicator-text">Step details hidden</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button 
                className="collapse-toggle-btn"
                onClick={toggleStepCollapse}
                aria-label={isStepCollapsed ? "Expand step details" : "Collapse step details"}
                aria-expanded={!isStepCollapsed}
              >
                <motion.div
                  animate={{ rotate: isStepCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  ▼
                </motion.div>
              </button>
            </div>
            <AnimatePresence>
              {!isStepCollapsed && (
                <motion.div 
                  className="step-description-container"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <div 
                    className="step-description" 
                    aria-live="polite" 
                    aria-label="Loading recipe, please wait"
                  >
                    {getCurrentInstruction()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area - Empty for cooking focus */}
      <div className="cooking-main-area">
        <div className="cooking-focus">
          <div 
            className="focus-icon" 
            role="img" 
            aria-label="Chef cooking step indicator"
          >
            👨‍🍳
          </div>
          <p className="focus-text">Focus on cooking step {currentStep + 1}</p>
        </div>
      </div>

      {/* Bottom Progress Bar - visionOS Style */}
      <div className="bottom-progress-bar">
        <div className="left-section">
          <button 
            className="nav-button prev"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            aria-label="Go to previous step"
          >
            ← Prev
          </button>
        </div>
        
        <div className="progress-section">
          <div 
            className="progress-indicator"
            role="progressbar" 
            aria-valuenow={currentStep + 1} 
            aria-valuemin={1} 
            aria-valuemax={5} 
            aria-label={`Step ${currentStep + 1} of 5`}
          >
            <div className="progress-dots">
              {[0, 1, 2, 3, 4].map(step => (
                <button
                  key={step}
                  className={`progress-dot ${step <= currentStep ? 'completed' : ''} ${step === currentStep ? 'current' : ''}`}
                  aria-label={`Step ${step + 1}${step === currentStep ? ' - Current step' : step < currentStep ? ' - Completed' : ' - Not started'}`}
                  onClick={() => setCurrentStep(step)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setCurrentStep(step);
                    }
                  }}
                />
              ))}
            </div>
            <span className="progress-text" aria-hidden="true">{currentStep + 1}/5</span>
          </div>
        </div>
        
        <div className="right-section">
          <div className="action-buttons">
            <button 
              className="action-btn voice-btn"
              aria-label="Record voice note for this step"
            >
              <Mic size={20} aria-hidden="true" />
            </button>
            <button 
              className="action-btn camera-btn"
              aria-label="Take photo or upload image for this step"
            >
              <Camera size={20} aria-hidden="true" />
            </button>
            <button 
              className="action-btn help-btn"
              onClick={handleHelpClick}
              aria-label="Get help or report errors for this step"
              title="Help & Error Report"
            >
              <HelpCircle size={20} aria-hidden="true" />
            </button>
          </div>
          
          <button 
            className="nav-button next"
            onClick={handleNextStep}
            aria-label={currentStep < 4 ? "Go to next step" : "Complete recipe"}
          >
            {currentStep < 4 ? 'Next →' : 'Complete'}
          </button>
        </div>
      </div>



      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div 
            className="help-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="help-modal-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="help-modal-header">
                <div className="help-icon">
                  {helpType === 'error' ? '⚠️' : '❓'}
                </div>
                <h3 className="help-title">
                  {helpType === 'error' ? 'Report an Error' : 'Need Help?'}
                </h3>
                <button 
                  className="help-close-btn"
                  onClick={closeHelpModal}
                  aria-label="Close help modal"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="help-content">
                {helpType === 'error' ? (
                  <div className="error-help">
                    <p className="help-description">
                      Something went wrong with this step? Let us know what happened so we can help you fix it.
                    </p>
                    <div className="help-options">
                      <button className="help-option-btn error-option">
                        <span className="option-icon">🔥</span>
                        <span className="option-text">Food burned or overcooked</span>
                      </button>
                      <button className="help-option-btn error-option">
                        <span className="option-icon">💧</span>
                        <span className="option-text">Too watery or runny</span>
                      </button>
                      <button className="help-option-btn error-option">
                        <span className="option-icon">🧂</span>
                        <span className="option-text">Too salty or bland</span>
                      </button>
                      <button className="help-option-btn error-option">
                        <span className="option-icon">❓</span>
                        <span className="option-text">Something else went wrong</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="general-help">
                    <p className="help-description">
                      Need assistance with this cooking step? We're here to help!
                    </p>
                    <div className="help-options">
                      <button className="help-option-btn general-option">
                        <span className="option-icon">📖</span>
                        <span className="option-text">Show step instructions again</span>
                      </button>
                      <button className="help-option-btn general-option">
                        <span className="option-icon">⏱️</span>
                        <span className="option-text">How long should this take?</span>
                      </button>
                      <button className="help-option-btn general-option">
                        <span className="option-icon">👨‍🍳</span>
                        <span className="option-text">Cooking tips for this step</span>
                      </button>
                      <button className="help-option-btn general-option">
                        <span className="option-icon">🔄</span>
                        <span className="option-text">Start this step over</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="help-actions">
                <button 
                  className="help-action-btn secondary"
                  onClick={closeHelpModal}
                >
                  Cancel
                </button>
                <button 
                  className="help-action-btn primary"
                  onClick={closeHelpModal}
                >
                  {helpType === 'error' ? 'Report Issue' : 'Get Help'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  // Render Block 4: Memory Integration
  const renderBlock4 = () => (
    <motion.div 
      className="block-container memory-block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="block-header">
        <h1 className="block-title">Capture the memories</h1>
        <p className="block-subtitle">What does this cooking moment remind you of?</p>
      </div>

      <div className="memory-section">
        {/* Memory prompt card */}
        <div className="memory-card">
          <div className="memory-header">
            <div className="memory-header-left">
              <Heart size={20} />
              <h3>Share a cooking memory</h3>
            </div>
            <button className="camera-icon-btn" aria-label="Capture this moment">
              <Camera size={20} />
            </button>
          </div>
          <p className="memory-prompt">
            While the rasam simmers, share a memory about your mom's cooking...
          </p>
          <div className="memory-textarea-container">
            <textarea
              value={memoryNotes}
              onChange={(e) => setMemoryNotes(e.target.value)}
              placeholder="Amma used to make this when I was sick..."
              className="memory-textarea"
            />
            <button 
              className="memory-voice-btn"
              onClick={() => {
                // Handle voice recording for memory notes
                console.log('Start voice recording for memory')
              }}
              aria-label="Record voice memory"
            >
              <Mic size={18} />
            </button>
          </div>
          <div className="memory-actions">
            <button 
              className="skip-button"
              onClick={handleSkipMemory}
            >
              Skip for now
            </button>
            <button 
              className="save-memory-button"
              onClick={handleSaveMemory}
            >
              Save Memory
            </button>
          </div>
        </div>
      </div>

      {/* Memory Animation */}
      <AnimatePresence>
        {showMemoryAnimation && (
          <motion.div 
            className="memory-animation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="memory-animation-card"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ 
                scale: [0.8, 1.2, 1],
                rotate: [-10, 5, 0],
                y: [0, -20, 0]
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                duration: 1.5,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            >
              <div className="animation-content">
                <motion.div 
                  className="memory-icon"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 360, 720]
                  }}
                  transition={{ 
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                >
                  💝
                </motion.div>
                <motion.h3 
                  className="animation-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Memory Saved!
                </motion.h3>
                <motion.p 
                  className="animation-subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Your cooking memory has been preserved
                </motion.p>
                <motion.div 
                  className="celebration-particles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  <span className="particle">✨</span>
                  <span className="particle">🎉</span>
                  <span className="particle">💫</span>
                  <span className="particle">🌟</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebrationAnimation && (
          <motion.div 
            className="celebration-animation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="celebration-animation-card"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ 
                scale: [0.8, 1.2, 1],
                rotate: [-10, 5, 0],
                y: [0, -20, 0]
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                duration: 1.5,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            >
              <div className="animation-content">
                <motion.div 
                  className="celebration-icon"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 360, 720]
                  }}
                  transition={{ 
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                >
                  🎉
                </motion.div>
                <motion.h3 
                  className="animation-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Journey Complete!
                </motion.h3>
                <motion.p 
                  className="animation-subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Your cooking adventure has been saved
                </motion.p>
                <motion.div 
                  className="celebration-particles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  <span className="particle">✨</span>
                  <span className="particle">🎉</span>
                  <span className="particle">💫</span>
                  <span className="particle">🌟</span>
                  <span className="particle">🏆</span>
                  <span className="particle">🎊</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  // Render Block 5: Sharing & Reflection
  const renderBlock5 = () => (
    <motion.div 
      className="block-container sharing-block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="block-header">
        <h1 className="block-title">Your Cooking Journey Summary</h1>
        <p className="block-subtitle">Review your captured memories and moments</p>
      </div>

      <div className="sharing-section">

        {/* Cooking Journey Summary */}
        <div className="journey-summary-card">
          {/* Call Mom and Share with Mom buttons */}
          <div className="summary-actions">
            <button 
              className="summary-action-btn call-btn"
              onClick={() => handleShare('Call')}
              aria-label="Call Mom"
            >
              <Phone size={20} />
              <span>Call Mom</span>
            </button>
            
            <button 
              className="summary-action-btn share-btn"
              onClick={() => handleShare('Share')}
              aria-label="Share with Mom"
            >
              <Share2 size={20} />
              <span>Share with Mom</span>
            </button>
          </div>

          <div className="summary-content">
            <div className="summary-section">
              <div className="summary-header">
                <Heart size={20} />
                <span>Memory Notes</span>
              </div>
              <p className="summary-text">
                {memoryNotes || "No memory notes captured yet"}
                {currentPrompt && (
                  <>
                    <br />
                    <br />
                    <strong>Journaling Prompt:</strong> "{currentPrompt}"
                  </>
                )}
              </p>
            </div>
            
            <div className="summary-section">
              <div className="summary-header">
                <Mic size={20} />
                <span>Voice Messages</span>
              </div>
              <p className="summary-text">
                {session.memories.length > 0 
                  ? session.memories.join(', ') 
                  : "No voice messages recorded yet"}
              </p>
            </div>
            

            
            <div className="summary-section">
              <div className="summary-header">
                <Camera size={20} />
                <span>Photos Captured</span>
              </div>
              <p className="summary-text">
                {photoTaken ? "1 photo captured during cooking" : "No photos captured yet"}
              </p>
            </div>
          </div>
        </div>

        {/* Complete Journey button outside panel */}
        <button 
          className="complete-journey-btn-outside"
          onClick={handleCompleteJourney}
        >
          Complete Journey
          <span className="sparkle">✨</span>
          <span className="sparkle">✨</span>
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="cooking-scene">
      <AnimatePresence mode="wait">
        {currentBlock === 'block1' && renderBlock1()}
        {currentBlock === 'block2' && renderBlock2()}
        {currentBlock === 'block3' && renderBlock3()}
        {currentBlock === 'block4' && renderBlock4()}
        {currentBlock === 'block5' && renderBlock5()}
      </AnimatePresence>



      {/* Audio Manager */}
      <AudioManager />

      {/* Recipe Search Modal */}
      {showRecipeSearch && (
        <RecipeSearch
          onRecipeSelect={handleRecipeSelect}
          onClose={() => setShowRecipeSearch(false)}
          initialQuery={inputText}
        />
      )}
    </div>
  )
}

export default CookingScene
