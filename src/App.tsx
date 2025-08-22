import React, { useState } from 'react'
import SidePanel from './components/SidePanel'
import CookingScene from './components/CookingScene'
import { AudioProvider } from './components/AudioContext'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState<'scene' | 'journal'>('scene')
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null)

  return (
    <AudioProvider>
      <div className="app">
        <div className="visionos-simulation">
          <div className="visionos-frame">
            <div className="visionos-screen">
              {/* Main Cooking Scene */}
              <CookingScene />

              {/* Side Panel */}
              <SidePanel 
                currentView={currentView}
                onViewChange={setCurrentView}
                selectedRecipe={selectedRecipe}
                onRecipeSelect={setSelectedRecipe}
              />
            </div>
          </div>
        </div>
      </div>
    </AudioProvider>
  )
}

export default App
