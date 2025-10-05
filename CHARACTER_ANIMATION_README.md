# Character Animation System

## Overview
This animation system brings your Mandarin learning game to life with animated sprite-based characters that walk across the menu screen canvas.

## Features

### 🎨 Sprite-Based Animation
- Uses 128x128 sprite sheets with 5 rows of animations (20 frames each)
- **Row 1**: Idle animation
- **Row 2**: Walk animation
- **Row 3**: Jump animation
- **Row 4**: Fly animation
- **Row 5**: Stunned animation

### 🐾 Available Animals
The system randomly selects from:
- 🐰 Bunny
- 🐧 Penguin
- 🐱 Cat
- 🐷 Pig
- 🐼 Panda

Each animal has 15 character variations (Character01 - Character15)

### 🎮 Animation Behaviors
1. **Random Character Selection**: 5 random characters are spawned with different animals and variations
2. **Walking**: Characters automatically walk across the canvas at random speeds
3. **Direction Change**: Characters bounce off edges and change direction
4. **Obstacle Avoidance**: Characters jump over randomly placed stones
5. **Smooth Animation**: 60 FPS canvas-based rendering

### 🪨 Interactive Obstacles
- 3 randomly placed stones on the canvas using `cave_rock5.png` sprite
- Characters detect stones ahead and jump over them
- Stone positions and sizes randomize on each initialization
- Realistic shadows and scaling for variety

## File Structure

### `characterAnimation.js`
The main animation system containing:
- `CharacterAnimationSystem` class: Handles all animation logic
- Sprite loading and caching (character sprites + rock image)
- Physics simulation (jumping, gravity)
- Collision detection with obstacles
- Canvas rendering with image-based obstacles

### Integration Points

#### `index.html`
```html
<canvas id="charactersCanvas" width="800" height="150"></canvas>
<script src="characterAnimation.js"></script>
```

#### `script.js`
```javascript
// Initialize on page load
if (typeof initCharacterAnimation === 'function') {
    initCharacterAnimation();
}

// Restart when returning to menu
function showMenu() {
    // ... existing code ...
    initCharacterAnimation();
}
```

#### `styles.css`
Custom styling for the canvas container with:
- Translucent background
- Rounded corners
- Responsive sizing
- Pixelated rendering for crisp sprites

## Technical Details

### Sprite Configuration
```javascript
{
    frameWidth: 128,
    frameHeight: 128,
    framesPerRow: 20,
    rows: 5
}
```

### Animation States
- **Walk**: Default state, cycles through walk animation
- **Jump**: Triggered when approaching obstacles
- **Idle**: Reserved for future enhancements
- **Fly**: Reserved for future enhancements
- **Stunned**: Reserved for future enhancements

### Performance
- 60 FPS target frame rate
- Efficient sprite sheet rendering
- Optimized collision detection
- Hardware-accelerated canvas rendering

## Customization

### Adjust Character Count
```javascript
await this.createRandomCharacters(5); // Change number here
```

### Modify Stone Count
```javascript
this.generateStones(3); // Change number here
```

### Change Animation Speed
```javascript
speed: 0.5 + Math.random() * 1.5 // Adjust multipliers
```

### Adjust Jump Height
```javascript
maxJumpHeight: 40 // Change this value
```

## Browser Compatibility
- Modern browsers with Canvas 2D API support
- Tested on Chrome, Firefox, Edge, Safari
- Mobile-responsive design

## Future Enhancements
- Add more animation states (idle when stopped, fly over obstacles)
- Interactive character clicking
- Particle effects
- Sound effects for jumps
- Collection system integration
- Character unlocking based on game progress

