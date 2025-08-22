import React, { useState, useEffect, useRef } from 'react'
import { Search, Clock, ChefHat, Star, ExternalLink, Heart, BookOpen } from 'lucide-react'
import './RecipeSearch.css'

interface Recipe {
  id: string
  title: string
  source: string
  url: string
  image?: string
  time?: string
  difficulty?: string
  rating?: number
  ingredients?: string[]
  description?: string
}

interface RecipeSearchProps {
  onRecipeSelect: (recipe: Recipe) => void
  onClose: () => void
  initialQuery?: string
}

const RecipeSearch: React.FC<RecipeSearchProps> = ({ 
  onRecipeSelect, 
  onClose, 
  initialQuery = '' 
}) => {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Popular recipe categories
  const categories = [
    { id: 'all', name: 'All Recipes', icon: '🍽️' },
    { id: 'comfort', name: 'Comfort Food', icon: '🥘' },
    { id: 'quick', name: 'Quick & Easy', icon: '⚡' },
    { id: 'healthy', name: 'Healthy', icon: '🥗' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' },
    { id: 'traditional', name: 'Traditional', icon: '🏠' },
    { id: 'vegetarian', name: 'Vegetarian', icon: '🥬' }
  ]

  // Mock API call - in real implementation, this would call actual recipe APIs
  const searchRecipes = async (searchQuery: string, category: string = 'all') => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock recipe data based on search query
    const mockRecipes: Recipe[] = generateMockRecipes(searchQuery, category)
    
    setResults(mockRecipes)
    setIsLoading(false)
  }

  // Generate mock recipe data based on search query
  const generateMockRecipes = (searchQuery: string, category: string): Recipe[] => {
    const queryLower = searchQuery.toLowerCase()
    const baseRecipes = [
      {
        id: '1',
        title: 'Mom\'s Comfort Rasam',
        source: 'AllRecipes',
        url: 'https://allrecipes.com/recipe/moms-rasam',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
        time: '25 min',
        difficulty: 'Easy',
        rating: 4.8,
        ingredients: ['tomatoes', 'tamarind', 'rasam powder', 'curry leaves'],
        description: 'A comforting South Indian soup that warms the soul'
      },
      {
        id: '2',
        title: 'Homestyle Chicken Curry',
        source: 'Food Network',
        url: 'https://foodnetwork.com/recipe/chicken-curry',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
        time: '45 min',
        difficulty: 'Medium',
        rating: 4.6,
        ingredients: ['chicken', 'onions', 'tomatoes', 'spices'],
        description: 'Rich and aromatic curry with tender chicken pieces'
      },
      {
        id: '3',
        title: 'Grandma\'s Apple Pie',
        source: 'Taste of Home',
        url: 'https://tasteofhome.com/recipe/apple-pie',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
        time: '90 min',
        difficulty: 'Hard',
        rating: 4.9,
        ingredients: ['apples', 'flour', 'butter', 'cinnamon'],
        description: 'Classic American dessert with flaky crust and sweet filling'
      },
      {
        id: '4',
        title: 'Cozy Vegetable Soup',
        source: 'BBC Good Food',
        url: 'https://bbcgoodfood.com/recipe/vegetable-soup',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
        time: '35 min',
        difficulty: 'Easy',
        rating: 4.4,
        ingredients: ['carrots', 'celery', 'onions', 'vegetable broth'],
        description: 'Nourishing soup perfect for cold days'
      },
      {
        id: '5',
        title: 'Quick Pasta Carbonara',
        source: 'Bon Appétit',
        url: 'https://bonappetit.com/recipe/carbonara',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
        time: '20 min',
        difficulty: 'Easy',
        rating: 4.7,
        ingredients: ['pasta', 'eggs', 'bacon', 'parmesan'],
        description: 'Creamy Italian pasta dish ready in minutes'
      },
      {
        id: '6',
        title: 'Traditional Beef Stew',
        source: 'Epicurious',
        url: 'https://epicurious.com/recipe/beef-stew',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
        time: '120 min',
        difficulty: 'Medium',
        rating: 4.5,
        ingredients: ['beef', 'potatoes', 'carrots', 'red wine'],
        description: 'Hearty stew that simmers to perfection'
      }
    ]

    // Filter recipes based on search query and category
    return baseRecipes.filter(recipe => {
      const matchesQuery = recipe.title.toLowerCase().includes(queryLower) ||
                          recipe.description?.toLowerCase().includes(queryLower) ||
                          recipe.ingredients?.some(ing => ing.toLowerCase().includes(queryLower))
      
      const matchesCategory = category === 'all' || 
                             (category === 'comfort' && (recipe.title.includes('Comfort') || recipe.title.includes('Stew'))) ||
                             (category === 'quick' && recipe.time && parseInt(recipe.time) <= 30) ||
                             (category === 'healthy' && recipe.title.includes('Vegetable')) ||
                             (category === 'dessert' && recipe.title.includes('Pie')) ||
                             (category === 'traditional' && (recipe.title.includes('Traditional') || recipe.title.includes('Grandma'))) ||
                             (category === 'vegetarian' && recipe.title.includes('Vegetable'))

      return matchesQuery && matchesCategory
    })
  }

  // Handle search input with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (query.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchRecipes(query, selectedCategory)
        // Add to search history
        if (!searchHistory.includes(query)) {
          setSearchHistory(prev => [query, ...prev.slice(0, 4)])
        }
      }, 500)
    } else {
      setResults([])
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query, selectedCategory])

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    if (query.trim()) {
      searchRecipes(query, categoryId)
    }
  }

  // Handle recipe selection
  const handleRecipeSelect = (recipe: Recipe) => {
    onRecipeSelect(recipe)
    onClose()
  }

  // Handle search history click
  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery)
  }

  return (
    <div className="recipe-search-overlay">
      <div className="recipe-search-modal">
        {/* Header */}
        <div className="search-header">
          <h2>Find Your Perfect Recipe</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Search Input */}
        <div className="search-input-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for recipes, ingredients, or cooking styles..."
              className="search-input"
              autoFocus
            />
            {isLoading && <div className="loading-spinner" />}
          </div>
        </div>

        {/* Categories */}
        <div className="search-categories">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && !query && (
          <div className="search-history">
            <h4>Recent Searches</h4>
            <div className="history-items">
              {searchHistory.map((historyQuery, index) => (
                <button
                  key={index}
                  className="history-item"
                  onClick={() => handleHistoryClick(historyQuery)}
                >
                  <Search size={14} />
                  {historyQuery}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="search-results">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner large" />
              <p>Searching for the perfect recipe...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="results-header">
                <h3>Found {results.length} recipes</h3>
              </div>
              <div className="results-grid">
                {results.map(recipe => (
                  <div key={recipe.id} className="recipe-card">
                    <div className="recipe-image">
                      <img src={recipe.image} alt={recipe.title} />
                      <div className="recipe-overlay">
                        <button 
                          className="select-recipe-btn"
                          onClick={() => handleRecipeSelect(recipe)}
                        >
                          <Heart size={16} />
                          Choose Recipe
                        </button>
                      </div>
                    </div>
                    <div className="recipe-info">
                      <h4 className="recipe-title">{recipe.title}</h4>
                      <p className="recipe-description">{recipe.description}</p>
                      <div className="recipe-meta">
                        <div className="meta-item">
                          <Clock size={14} />
                          <span>{recipe.time}</span>
                        </div>
                        <div className="meta-item">
                          <ChefHat size={14} />
                          <span>{recipe.difficulty}</span>
                        </div>
                        {recipe.rating && (
                          <div className="meta-item">
                            <Star size={14} />
                            <span>{recipe.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="recipe-source">
                        <BookOpen size={12} />
                        <span>{recipe.source}</span>
                        <a 
                          href={recipe.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="external-link"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : query ? (
            <div className="no-results">
              <Search size={48} />
              <h3>No recipes found</h3>
              <p>Try adjusting your search terms or browse different categories</p>
            </div>
          ) : (
            <div className="search-suggestions">
              <h3>Popular Searches</h3>
              <div className="suggestion-tags">
                {['comfort food', 'quick dinner', 'healthy meals', 'desserts', 'traditional recipes'].map(suggestion => (
                  <button
                    key={suggestion}
                    className="suggestion-tag"
                    onClick={() => setQuery(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeSearch
