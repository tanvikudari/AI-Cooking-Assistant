# Cooking Journal - visionOS Style

A 3D interface for visionOS using Apple's design system components, built for web showcasing. This is a journaling app through the medium of cooking with an interactive side panel for relevant options.

## Features

### 🍳 3D Cooking Scene
- Interactive kitchen environment with floating elements
- Clickable kitchen items (stove, sink, counter, fridge)
- Floating UI cards with cooking tips and information
- Ambient particles and lighting effects
- Smooth animations and transitions

### 📝 Journaling Interface
- Mood tracking with emoji selection
- Rich text entry for cooking experiences
- Photo and voice note integration
- Floating journal prompts for inspiration
- Beautiful 3D book environment

### 🎨 visionOS Design System
- Glass morphism effects with backdrop blur
- Apple's color palette and typography
- Smooth animations and micro-interactions
- Responsive design for different screen sizes
- Floating action buttons and cards

### 📱 Side Panel
- Recipe browsing with ratings and difficulty
- Search and filter functionality
- Journal entry history
- Quick access to settings
- Smooth transitions between views

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Three.js** - 3D graphics and rendering
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cooking-journal-visionos
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── CookingScene.tsx      # 3D kitchen environment
│   ├── CookingScene.css      # 3D scene styles
│   ├── JournalEntry.tsx      # Journal interface
│   ├── JournalEntry.css      # Journal styles
│   ├── SidePanel.tsx         # Side panel component
│   └── SidePanel.css         # Side panel styles
├── App.tsx                   # Main app component
├── App.css                   # App styles
├── main.tsx                  # React entry point
└── index.css                 # Global styles
```

## Design System

### Colors
- Primary: `#007AFF` (Apple Blue)
- Secondary: `#5856D6` (Purple)
- Success: `#34C759` (Green)
- Warning: `#FF9500` (Orange)
- Error: `#FF3B30` (Red)

### Glass Morphism
- Background: `rgba(255, 255, 255, 0.1)`
- Backdrop Filter: `blur(20px)`
- Border: `rgba(255, 255, 255, 0.1)`

### Typography
- Font Family: `-apple-system, BlinkMacSystemFont, 'SF Pro Display'`
- Headings: Bold weights with gradient text
- Body: Regular weight with proper line height

## Usage

### Cooking Scene
1. Navigate through the 3D kitchen environment
2. Click on kitchen items to select them
3. View floating cards for tips and information
4. Use the floating action button to switch to journal mode

### Journaling
1. Select your mood using the emoji buttons
2. Write about your cooking experience
3. Add photos or voice notes
4. Save your entry to track your progress

### Side Panel
1. Browse recipes with ratings and difficulty
2. Search for specific recipes
3. View your journal history
4. Access settings and preferences

## Customization

### Adding New Recipes
Edit the `recipes` array in `SidePanel.tsx`:

```typescript
const recipes = [
  { 
    id: 'new-recipe', 
    name: 'New Recipe', 
    time: '30 min', 
    difficulty: 'Medium', 
    rating: 4.5 
  }
]
```

### Modifying 3D Scene
Update the `kitchenItems` array in `CookingScene.tsx`:

```typescript
const kitchenItems = [
  { 
    id: 'new-item', 
    name: 'New Item', 
    position: [0, 0, 0], 
    icon: '🔧' 
  }
]
```

### Changing Colors
Modify the CSS custom properties in `index.css`:

```css
:root {
  --visionos-primary: #your-color;
  --visionos-secondary: #your-color;
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Optimized 3D rendering with React Three Fiber
- Efficient state management
- Lazy loading of components
- Smooth 60fps animations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Apple for the visionOS design inspiration
- Three.js community for 3D graphics
- React Three Fiber team for the amazing React integration
- Framer Motion for smooth animations
