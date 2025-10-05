// Character Animation System for Mandarin Learning Game
// Handles sprite-based canvas animations with walking characters and obstacles

class CharacterAnimationSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id "${canvasId}" not found`);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.characters = [];
        this.stones = [];
        this.fallingRocks = [];
        this.animationFrameId = null;
        this.isRunning = false;
        this.rockImage = null;
        this.rockImageLoaded = false;
        this.environmentImages = [];
        this.environmentImagesLoaded = false;
        
        // Sprite configuration
        this.spriteConfig = {
            frameWidth: 128,
            frameHeight: 128,
            framesPerRow: 20,
            rows: 5,
            animations: {
                idle: { row: 0, frameCount: 20 },
                walk: { row: 1, frameCount: 20 },
                jump: { row: 2, frameCount: 20 },
                fly: { row: 3, frameCount: 20 },
                umbrella: { row: 3, frameCount: 20 },
                stunned: { row: 4, frameCount: 20 }
            }
        };
        
        // Available animals and their character variations
        this.animalTypes = ['bunny', 'penguin', 'cat', 'pig', 'panda'];
        this.characterVariations = 15; // Character01 to Character15
        
        // Performance tracking
        this.lastFrameTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
    }
    
    // Initialize the animation system
    async init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Add click event listener for user interaction
        this.canvas.addEventListener('click', (event) => this.handleCanvasClick(event));
        
        // Add drag and drop event listeners
        this.canvas.addEventListener('mousedown', (event) => this.handleDragStart(event));
        this.canvas.addEventListener('mousemove', (event) => this.handleDragMove(event));
        this.canvas.addEventListener('mouseup', (event) => this.handleDragEnd(event));
        this.canvas.addEventListener('mouseleave', (event) => this.handleDragEnd(event));
        
        // Add hover effect for cursor
        this.canvas.addEventListener('mousemove', (event) => this.updateCursor(event));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (event) => this.handleDragStart(event));
        this.canvas.addEventListener('touchmove', (event) => this.handleDragMove(event));
        this.canvas.addEventListener('touchend', (event) => this.handleDragEnd(event));
        
        // Drag state
        this.draggedCharacter = null;
        this.dragOffset = { x: 0, y: 0 };
        this.wasDragging = false; // Track if a drag operation occurred
        
        // Load environment images for falling rocks
        await this.loadEnvironmentImages();
        
        // Create characters from collected characters
        await this.createCollectedCharacters();
        
        // Start animation
        this.start();
    }
    
    // Handle canvas click events
    handleCanvasClick(event) {
        // Don't handle click if we just finished dragging
        if (this.wasDragging) {
            this.wasDragging = false;
            return;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        // Check if click is on empty space (not on characters)
        let clickedOnCharacter = false;
        this.characters.forEach(char => {
            if (char.isStunned) return; // Don't stun already stunned characters
            
            const charWidth = this.spriteConfig.frameWidth * char.scale;
            const charHeight = this.spriteConfig.frameHeight * char.scale;
            const charX = char.x;
            const charY = char.y + char.jumpHeight;
            
            // Check if click is within character bounds
            if (clickX >= charX && clickX <= charX + charWidth &&
                clickY >= charY && clickY <= charY + charHeight) {
                // Character clicked! Stun this specific character
                this.stunCharacter(char);
                clickedOnCharacter = true;
            }
        });
        
        // If clicked on empty space, drop a rock
        if (!clickedOnCharacter) {
            this.dropRock(clickX);
        }
    }
    
    // Stun a specific character
    stunCharacter(char) {
        // Stun the specific character
        char.currentAnimation = 'stunned';
        char.isStunned = true;
        char.stunTimer = 0;
        char.stunDuration = 120; // 2 seconds at 60fps
        char.speed = 0; // Stop movement
        
        // Play sound effect
        if (typeof soundSystem !== 'undefined') {
            soundSystem.play('incorrect'); // Use existing sound for character hit
        }
        
        // Add a small visual feedback - make the character briefly flash
        char.flashTimer = 0;
        char.flashDuration = 10; // Brief flash effect
    }
    
    // Handle drag start
    handleDragStart(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        
        // Check if mouse is over a character
        for (let i = this.characters.length - 1; i >= 0; i--) {
            const char = this.characters[i];
            const charWidth = this.spriteConfig.frameWidth * char.scale;
            const charHeight = this.spriteConfig.frameHeight * char.scale;
            const charX = char.x;
            const charY = char.y + char.jumpHeight;
            
            if (mouseX >= charX && mouseX <= charX + charWidth &&
                mouseY >= charY && mouseY <= charY + charHeight) {
                // Start dragging this character
                this.draggedCharacter = char;
                this.dragOffset.x = mouseX - charX;
                this.dragOffset.y = mouseY - charY;
                
                // Store original position
                char.originalY = char.y;
                char.isDragging = true;
                char.isFlying = false;
                char.speed = 0; // Stop movement while dragging
                
                // Change to idle animation while dragging
                char.currentAnimation = 'idle';
                
                // Mark that we're starting a drag operation
                this.wasDragging = false; // Reset drag flag
                
                break;
            }
        }
    }
    
    // Handle drag move
    handleDragMove(event) {
        if (!this.draggedCharacter) return;
        
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        
        // Update character position
        this.draggedCharacter.x = mouseX - this.dragOffset.x;
        this.draggedCharacter.y = mouseY - this.dragOffset.y;
        
        // Keep character within canvas bounds
        const charWidth = this.spriteConfig.frameWidth * this.draggedCharacter.scale;
        const charHeight = this.spriteConfig.frameHeight * this.draggedCharacter.scale;
        
        this.draggedCharacter.x = Math.max(0, Math.min(this.draggedCharacter.x, this.canvas.width - charWidth));
        this.draggedCharacter.y = Math.max(-charHeight / 2, Math.min(this.draggedCharacter.y, this.canvas.height - charHeight / 2));
        
        // Mark that we're actively dragging
        this.wasDragging = true;
    }
    
    // Handle drag end
    handleDragEnd(event) {
        if (!this.draggedCharacter) return;
        
        event.preventDefault();
        const char = this.draggedCharacter;
        
        // Check if character is above original position (dropped below canvas top)
        if (char.y < char.originalY) {
            // Start flying animation - character was dropped above original position
            char.isFlying = true;
            char.isDragging = false;
            char.currentAnimation = 'fly';
            char.flyVelocity = 0;
        } else {
            // Character is at or below original position, just reset
            char.y = char.originalY;
            char.isDragging = false;
            char.currentAnimation = 'walk';
            char.speed = char.originalSpeed;
        }
        
        this.draggedCharacter = null;
        this.dragOffset = { x: 0, y: 0 };
        // Keep wasDragging flag true to prevent click event from firing
        this.wasDragging = true;
    }
    
    // Update cursor style when hovering over characters
    updateCursor(event) {
        if (this.draggedCharacter) {
            this.canvas.style.cursor = 'grabbing';
            return;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Check if mouse is over any character
        let overCharacter = false;
        for (let i = this.characters.length - 1; i >= 0; i--) {
            const char = this.characters[i];
            const charWidth = this.spriteConfig.frameWidth * char.scale;
            const charHeight = this.spriteConfig.frameHeight * char.scale;
            const charX = char.x;
            const charY = char.y + char.jumpHeight;
            
            if (mouseX >= charX && mouseX <= charX + charWidth &&
                mouseY >= charY && mouseY <= charY + charHeight) {
                overCharacter = true;
                break;
            }
        }
        
        this.canvas.style.cursor = overCharacter ? 'grab' : 'default';
    }
    
    // Drop a rock from the top at the specified x position
    dropRock(x) {
        if (!this.environmentImagesLoaded || this.environmentImages.length === 0) {
            console.warn('Environment images not loaded yet');
            return;
        }
        
        // Select a random environment image
        const randomImage = this.environmentImages[Math.floor(Math.random() * this.environmentImages.length)];
        
        // Create falling rock object
        const rock = {
            x: x - 15, // Center the rock on the click position
            y: -30, // Start above the canvas
            width: 30,
            height: 30,
            velocityY: 0,
            gravity: 0.5,
            image: randomImage.image,
            filename: randomImage.filename,
            rotation: Math.random() * Math.PI * 2, // Random initial rotation
            rotationSpeed: (Math.random() - 0.5) * 0.2, // Random rotation speed
            scale: 0.7,
            life: 300 // Frames before auto-removal
        };
        
        this.fallingRocks.push(rock);
        
        // Play sound effect
        if (typeof soundSystem !== 'undefined') {
            soundSystem.play('click');
        }
    }

    // Load environment images for falling rocks
    loadEnvironmentImages() {
        return new Promise((resolve) => {
            const environmentFiles = [
                'canyon_rock5.png',
                'cave_rock5.png', 
                'desert_rock5.png'
            ];
            
            let loadedCount = 0;
            const totalImages = environmentFiles.length;
            
            if (totalImages === 0) {
                this.environmentImagesLoaded = true;
                resolve();
                return;
            }
            
            environmentFiles.forEach(filename => {
                const img = new Image();
                img.onload = () => {
                    this.environmentImages.push({
                        image: img,
                        filename: filename
                    });
                    loadedCount++;
                    
                    if (loadedCount === totalImages) {
                        this.environmentImagesLoaded = true;
                        resolve();
                    }
                };
                img.onerror = () => {
                    console.error(`Failed to load environment image: ${filename}`);
                    loadedCount++;
                    
                    if (loadedCount === totalImages) {
                        this.environmentImagesLoaded = true;
                        resolve();
                    }
                };
                img.src = `assets/environments/${filename}`;
            });
        });
    }
    
    // Resize canvas to fit container
    resizeCanvas() {
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.clientWidth || 800;
            this.canvas.height = container.clientHeight || 150;
        }
    }
    
    // Create characters from collected characters
    async createCollectedCharacters() {
        const promises = [];
        
        // Check if collectedCharacters exists and has items
        if (!window.collectedCharacters || window.collectedCharacters.length === 0) {
            // Show no characters message if no characters collected
            const noCharactersMessage = document.getElementById('noCharactersMessage');
            if (noCharactersMessage) {
                noCharactersMessage.style.display = 'block';
            }
            return;
        }
        
        // Hide no characters message
        const noCharactersMessage = document.getElementById('noCharactersMessage');
        if (noCharactersMessage) {
            noCharactersMessage.style.display = 'none';
        }
        
        // Determine which characters to show
        let charactersToShow;
        if (window.collectedCharacters.length > 5) {
            // User has more than 5 characters
            if (window.selectedCharacters && window.selectedCharacters.length === 5) {
                // Use selected characters if user has made a selection
                charactersToShow = window.selectedCharacters;
            } else {
                // Default to first 5 if no selection made
                charactersToShow = window.collectedCharacters.slice(0, 5);
                // Initialize selectedCharacters with first 5 for convenience
                if (!window.selectedCharacters || window.selectedCharacters.length === 0) {
                    window.selectedCharacters = [...charactersToShow];
                    localStorage.setItem('selectedCharacters', JSON.stringify(window.selectedCharacters));
                }
            }
        } else {
            // User has 5 or fewer characters - show all
            charactersToShow = window.collectedCharacters.slice(0, 5);
        }
        
        for (let i = 0; i < charactersToShow.length; i++) {
            const collectedChar = charactersToShow[i];
            
            // Parse character info from collected character
            const animalType = collectedChar.type;
            const charVariation = String(collectedChar.number).padStart(2, '0');
            
            // Build sprite path
            const spritePath = `spritesheets/${animalType}/${animalType}_Character${charVariation}.png`;
            
            // Assign personality based on animal type
            const personality = this.getAnimalPersonality(animalType);
            
            // Random starting position and speed
            const groundY = this.canvas.height - 80; // Ground level - same for all characters
            const character = {
                animal: animalType,
                variation: charVariation,
                spritePath: spritePath,
                sprite: null,
                spriteLoaded: false,
                x: Math.random() * this.canvas.width,
                y: groundY,
                originalY: groundY, // Store original Y position for drag and drop
                speed: 0.5 + Math.random() * 1.5, // Pixels per frame
                scale: 0.6, // Fixed scale for all characters
                currentAnimation: 'walk',
                currentFrame: Math.floor(Math.random() * 20),
                frameTimer: 0,
                frameDelay: 3 + Math.floor(Math.random() * 3), // Frames between sprite updates
                direction: 1, // 1 for right, -1 for left
                isJumping: false,
                jumpVelocity: 0,
                jumpHeight: 0,
                maxJumpHeight: 80,
                isStunned: false,
                stunTimer: 0,
                stunDuration: 0,
                originalSpeed: 0.5 + Math.random() * 1.5, // Store original speed for recovery
                flashTimer: 0,
                flashDuration: 0,
                // Drag and drop properties
                isDragging: false,
                isFlying: false,
                flyVelocity: 0,
                // Random animation system
                idleTimer: 0,
                idleDuration: 0,
                randomJumpTimer: 0,
                randomJumpInterval: 0,
                jumpThreshold: 0,
                isIdle: false,
                lastIdleTime: 0,
                lastJumpTime: 0,
                // Pre-assigned personality
                personality: personality,
                // Store collected character info
                collectedInfo: collectedChar
            };
            
            // Load sprite image
            const loadPromise = this.loadSprite(character);
            promises.push(loadPromise);
            
            this.characters.push(character);
        }
        
        // Wait for all sprites to load
        await Promise.all(promises);
    }
    
    // Get personality traits based on animal type
    getAnimalPersonality(animalType) {
        const personalities = {
            bunny: {
                // 🐰 Bunnies are energetic, playful, curious, and bouncy
                energy: 0.8 + Math.random() * 0.2, // 0.8-1.0 (very energetic)
                curiosity: 0.7 + Math.random() * 0.3, // 0.7-1.0 (very curious)
                playfulness: 0.8 + Math.random() * 0.2, // 0.8-1.0 (very playful)
                patience: 0.2 + Math.random() * 0.3, // 0.2-0.5 (impatient)
                boldness: 0.6 + Math.random() * 0.3 // 0.6-0.9 (quite bold)
            },
            penguin: {
                // 🐧 Penguins are patient, bold, less energetic, but determined
                energy: 0.3 + Math.random() * 0.3, // 0.3-0.6 (low energy)
                curiosity: 0.4 + Math.random() * 0.3, // 0.4-0.7 (moderate curiosity)
                playfulness: 0.3 + Math.random() * 0.4, // 0.3-0.7 (moderate playfulness)
                patience: 0.7 + Math.random() * 0.3, // 0.7-1.0 (very patient)
                boldness: 0.8 + Math.random() * 0.2 // 0.8-1.0 (very bold)
            },
            cat: {
                // 🐱 Cats are independent, patient, selective, and mysterious
                energy: 0.4 + Math.random() * 0.4, // 0.4-0.8 (moderate energy)
                curiosity: 0.5 + Math.random() * 0.3, // 0.5-0.8 (moderate curiosity)
                playfulness: 0.3 + Math.random() * 0.4, // 0.3-0.7 (selective playfulness)
                patience: 0.6 + Math.random() * 0.3, // 0.6-0.9 (patient)
                boldness: 0.4 + Math.random() * 0.4 // 0.4-0.8 (moderate boldness)
            },
            pig: {
                // 🐷 Pigs are playful, energetic, curious, and social
                energy: 0.7 + Math.random() * 0.2, // 0.7-0.9 (high energy)
                curiosity: 0.6 + Math.random() * 0.3, // 0.6-0.9 (curious)
                playfulness: 0.7 + Math.random() * 0.2, // 0.7-0.9 (very playful)
                patience: 0.3 + Math.random() * 0.4, // 0.3-0.7 (moderate patience)
                boldness: 0.5 + Math.random() * 0.3 // 0.5-0.8 (moderate boldness)
            },
            panda: {
                // 🐼 Pandas are calm, patient, less playful, and peaceful
                energy: 0.2 + Math.random() * 0.3, // 0.2-0.5 (low energy)
                curiosity: 0.3 + Math.random() * 0.3, // 0.3-0.6 (low curiosity)
                playfulness: 0.2 + Math.random() * 0.3, // 0.2-0.5 (low playfulness)
                patience: 0.8 + Math.random() * 0.2, // 0.8-1.0 (very patient)
                boldness: 0.3 + Math.random() * 0.3 // 0.3-0.6 (low boldness)
            }
        };
        
        return personalities[animalType] || {
            // Default personality if animal type not found
            energy: 0.5 + Math.random() * 0.5,
            curiosity: 0.5 + Math.random() * 0.5,
            playfulness: 0.5 + Math.random() * 0.5,
            patience: 0.5 + Math.random() * 0.5,
            boldness: 0.5 + Math.random() * 0.5
        };
    }

    // Load sprite image
    loadSprite(character) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                character.sprite = img;
                character.spriteLoaded = true;
                resolve();
            };
            img.onerror = () => {
                console.error(`Failed to load sprite: ${character.spritePath}`);
                // Create fallback colored rectangle
                character.spriteLoaded = false;
                resolve();
            };
            img.src = character.spritePath;
        });
    }
    
    // Main animation loop
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.animate();
    }
    
    // Stop animation
    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    // Reset and restart animation
    restart() {
        this.stop();
        this.characters = [];
        this.stones = [];
        this.fallingRocks = [];
        this.init();
    }
    
    // Animation loop
    animate(currentTime = 0) {
        if (!this.isRunning) return;
        
        // Frame rate control
        const deltaTime = currentTime - this.lastFrameTime;
        
        if (deltaTime >= this.frameInterval) {
            this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw ground line
            this.drawGround();
            
            // Draw stones
            this.drawStones();
            
            // Update and draw falling rocks
            this.updateFallingRocks();
            this.drawFallingRocks();
            
            // Update and draw characters
            this.updateCharacters();
            this.drawCharacters();
        }
        
        this.animationFrameId = requestAnimationFrame((time) => this.animate(time));
    }
    
    // Draw ground line
    drawGround() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - 60);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - 60);
        this.ctx.stroke();
    }
    
    // Draw stones
    drawStones() {
        this.stones.forEach(stone => {
            this.ctx.save();
            
            // Shadow
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            this.ctx.shadowBlur = 8;
            this.ctx.shadowOffsetY = 3;
            
            if (stone.image && stone.isPermanent) {
                // Draw environment image stone (converted from falling rock)
                this.ctx.translate(stone.x + stone.width / 2, stone.y + stone.height / 2);
                this.ctx.rotate(stone.rotation);
                this.ctx.scale(stone.scale, stone.scale);
                
                this.ctx.drawImage(
                    stone.image,
                    -stone.width / 2,
                    -stone.height / 2,
                    stone.width,
                    stone.height
                );
            } else if (this.rockImageLoaded && this.rockImage) {
                // Draw original rock image for old stones
                const drawWidth = stone.width * (stone.scale || 1);
                const drawHeight = stone.height * (stone.scale || 1);
                const drawX = stone.x - (drawWidth - stone.width) / 2;
                const drawY = stone.y - (drawHeight - stone.height) / 2;
                
                this.ctx.drawImage(
                    this.rockImage,
                    drawX,
                    drawY,
                    drawWidth,
                    drawHeight
                );
            } else {
                // Fallback to simple shapes if no image loaded
                this.ctx.fillStyle = '#666666';
                this.ctx.beginPath();
                this.ctx.arc(stone.x + stone.width / 2, stone.y + stone.height / 2, stone.width / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }
    
    // Update falling rocks
    updateFallingRocks() {
        for (let i = this.fallingRocks.length - 1; i >= 0; i--) {
            const rock = this.fallingRocks[i];
            
            // Apply gravity
            rock.velocityY += rock.gravity;
            rock.y += rock.velocityY;
            
            // Update rotation
            rock.rotation += rock.rotationSpeed;
            
            // Decrease life
            rock.life--;
            
            // Check if rock hit the ground
            const groundY = this.canvas.height - 0;
            if (rock.y + rock.height * rock.scale >= groundY) {
                // Rock hit the ground - create a small impact effect
                rock.y = groundY - rock.height * rock.scale;
                rock.velocityY = 0;
                
                // Check for character collisions
                this.checkRockCharacterCollisions(rock);
                
                // Convert falling rock to permanent stone
                this.convertRockToStone(rock);
                
                // Remove the falling rock
                this.fallingRocks.splice(i, 1);
            } else if (rock.y > this.canvas.height + 50 || rock.life <= 0) {
                // Remove rock if it falls off screen or life expires
                this.fallingRocks.splice(i, 1);
            }
        }
    }
    
    // Check for collisions between falling rocks and characters
    checkRockCharacterCollisions(rock) {
        this.characters.forEach(char => {
            if (char.isStunned) return; // Don't stun already stunned characters
            
            const charWidth = this.spriteConfig.frameWidth * char.scale;
            const charHeight = this.spriteConfig.frameHeight * char.scale;
            const charX = char.x;
            const charY = char.y + char.jumpHeight;
            
            const rockWidth = rock.width * rock.scale;
            const rockHeight = rock.height * rock.scale;
            
            // Check collision
            if (rock.x < charX + charWidth &&
                rock.x + rockWidth > charX &&
                rock.y < charY + charHeight &&
                rock.y + rockHeight > charY) {
                
                // Rock hit character - stun the character
                this.stunCharacter(char);
                
                // Add a small bounce to the rock
                rock.velocityY = -2;
            }
        });
    }
    
    // Convert a falling rock to a permanent stone
    convertRockToStone(rock) {
        // Limit to maximum 3 stones - remove oldest if we're at the limit
        if (this.stones.length >= 3) {
            this.stones.shift(); // Remove the first (oldest) stone
        }
        
        const stone = {
            x: rock.x,
            y: this.canvas.height - 20, // Ground level
            width: rock.width * rock.scale,
            height: rock.height * rock.scale,
            scale: rock.scale,
            image: rock.image,
            filename: rock.filename,
            rotation: rock.rotation,
            // Stone properties
            isPermanent: true,
            id: Date.now() + Math.random() // Unique ID for this stone
        };
        
        this.stones.push(stone);
        
        // Play a different sound for stone landing
        if (typeof soundSystem !== 'undefined') {
            soundSystem.play('correct'); // Use a more satisfying sound for stone landing
        }
    }
    
    // Draw falling rocks
    drawFallingRocks() {
        this.fallingRocks.forEach(rock => {
            this.ctx.save();
            
            // Apply rotation and scaling
            this.ctx.translate(rock.x + rock.width * rock.scale / 2, rock.y + rock.height * rock.scale / 2);
            this.ctx.rotate(rock.rotation);
            this.ctx.scale(rock.scale, rock.scale);
            
            // Draw shadow
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            this.ctx.shadowBlur = 8;
            this.ctx.shadowOffsetY = 3;
            
            // Draw rock image
            this.ctx.drawImage(
                rock.image,
                -rock.width / 2,
                -rock.height / 2,
                rock.width,
                rock.height
            );
            
            this.ctx.restore();
        });
    }
    
    // Update character positions and states
    updateCharacters() {
        this.characters.forEach(char => {
            // Skip updates for dragged characters (except flash effect)
            if (char.isDragging) {
                return;
            }
            
            // Handle flying state (character dropping back to original position)
            if (char.isFlying) {
                char.flyVelocity += 0.2; // Slower gravity for more gentle drop
                char.y += char.flyVelocity;
                
                // Check if character reached original position
                if (char.y >= char.originalY) {
                    char.y = char.originalY;
                    char.isFlying = false;
                    char.flyVelocity = 0;
                    char.currentAnimation = 'walk';
                    char.speed = char.originalSpeed;
                    
                    // Add a small bounce effect
                    char.jumpHeight = -5; // Small upward bounce
                    char.jumpVelocity = -2;
                    char.isJumping = true;
                    
                    // Remove any stun state when landing
                    if (char.isStunned) {
                        char.isStunned = false;
                        char.stunTimer = 0;
                        char.stunDuration = 0;
                    }
                }
                return;
            }
            
            // Handle flash effect
            if (char.flashTimer > 0) {
                char.flashTimer++;
                if (char.flashTimer >= char.flashDuration) {
                    char.flashTimer = 0;
                    char.flashDuration = 0;
                }
            }
            
            // Handle stunned state
            if (char.isStunned) {
                char.stunTimer++;
                if (char.stunTimer >= char.stunDuration) {
                    // Stun duration over, recover
                    char.isStunned = false;
                    char.stunTimer = 0;
                    char.speed = char.originalSpeed;
                    char.currentAnimation = 'walk';
                }
            }
            
            // Random animation system (only if not stunned)
            if (!char.isStunned) {
                this.handleRandomAnimations(char);
            }
            
            // Update frame animation
            char.frameTimer++;
            if (char.frameTimer >= char.frameDelay) {
                char.frameTimer = 0;
                char.currentFrame = (char.currentFrame + 1) % this.spriteConfig.animations[char.currentAnimation].frameCount;
            }
            
            // Handle jumping (only if not stunned)
            if (char.isJumping && !char.isStunned) {
                char.jumpHeight += char.jumpVelocity;
                char.jumpVelocity += 0.4; // Gravity (reduced for higher jumps)
                
                if (char.jumpHeight >= 0) {
                    char.jumpHeight = 0;
                    char.isJumping = false;
                    char.jumpVelocity = 0;
                    // Return to appropriate animation based on state
                    if (char.isIdle) {
                        char.currentAnimation = 'idle';
                    } else {
                        char.currentAnimation = 'walk';
                    }
                }
            } else if (!char.isStunned) {
                // Check for stone collision ahead (only if not stunned)
                const charCenterX = char.x + (this.spriteConfig.frameWidth * char.scale) / 2;
                const lookAheadDistance = 20;
                
                this.stones.forEach(stone => {
                    const distanceToStone = (stone.x + stone.width / 2) - charCenterX;
                    
                    if (char.direction > 0 && distanceToStone > 0 && distanceToStone < lookAheadDistance) {
                        // Stone ahead, jump!
                        if (!char.isJumping) {
                            char.isJumping = true;
                            char.jumpVelocity = -5;
                            char.currentAnimation = 'jump';
                        }
                    } else if (char.direction < 0 && distanceToStone < 0 && Math.abs(distanceToStone) < lookAheadDistance) {
                        // Stone ahead (walking left), jump!
                        if (!char.isJumping) {
                            char.isJumping = true;
                            char.jumpVelocity = -5;
                            char.currentAnimation = 'jump';
                        }
                    }
                });
            }
            
            // Move character (only if not stunned and not idle)
            if (!char.isStunned && !char.isIdle) {
                char.x += char.speed * char.direction;
                
                // Bounce off edges
                const charWidth = this.spriteConfig.frameWidth * char.scale;
                if (char.x <= 0) {
                    char.x = 0;
                    char.direction = 1;
                } else if (char.x + charWidth >= this.canvas.width) {
                    char.x = this.canvas.width - charWidth;
                    char.direction = -1;
                }
            }
        });
    }
    
    // Handle random idle and jump animations
    handleRandomAnimations(char) {
        const currentTime = performance.now();
                
        // Initialize random intervals if not set
        if (char.idleDuration === 0) {
            // Idle duration based on patience (more patient = longer walking periods)
            const baseIdleTime = 3000 + Math.random() * 5000;
            char.idleDuration = baseIdleTime * (1 + char.personality.patience);
            char.randomJumpInterval = 4000 + Math.random() * 6000;
        }
        
        // Random direction changes (based on curiosity)
        if (!char.isIdle && !char.isJumping && char.currentAnimation === 'walk' && Math.random() < 0.001 * char.personality.curiosity) {
            char.direction *= -1; // Reverse direction
            char.directionChangeTimer = 0;
        }
        
        // Random speed variations (based on energy)
        if (!char.isIdle && !char.isJumping && char.currentAnimation === 'walk') {
            if (!char.speedVariationTimer) char.speedVariationTimer = 0;
            char.speedVariationTimer++;
            
            if (char.speedVariationTimer >= 180 + Math.random() * 300) { // 3-8 seconds
                // Random speed change based on energy level
                const speedVariation = 0.5 + Math.random() * 1.5; // 0.5x to 2x speed
                const energyMultiplier = 0.5 + char.personality.energy; // 0.8x to 1.5x based on energy
                char.speed = char.originalSpeed * speedVariation * energyMultiplier;
                char.speedVariationTimer = 0;
            }
        }
        
        // Random idle behavior (based on patience and energy)
        if (!char.isIdle && !char.isJumping && char.currentAnimation === 'walk') {
            char.idleTimer++;
            // More energetic characters idle less frequently
            const idleChance = (180 + Math.random() * 120) * (2 - char.personality.energy);
            if (char.idleTimer >= idleChance) {
                // Start idle animation
                char.isIdle = true;
                char.currentAnimation = 'idle';
                char.speed = 0; // Stop movement
                char.idleTimer = 0;
                // Idle duration based on patience (more patient = longer idle)
                char.idleDuration = (120 + Math.random() * 180) * (1 + char.personality.patience);
                char.lastIdleTime = currentTime;
            }
        }
        
        // Handle idle duration
        if (char.isIdle) {
            char.idleTimer++;
            if (char.idleTimer >= char.idleDuration) {
                // End idle, resume walking with random speed
                char.isIdle = false;
                char.currentAnimation = 'walk';
                char.speed = char.originalSpeed * (0.8 + Math.random() * 0.4); // 80%-120% of original speed
                char.idleTimer = 0;
                // Reset idle duration with more variation
                char.idleDuration = (3000 + Math.random() * 5000) * (1 + char.personality.patience);
            }
        }
        
        // Random jump behavior (based on playfulness and energy)
        if (!char.isIdle && !char.isJumping && char.currentAnimation === 'walk') {
            char.randomJumpTimer++;
            // Initialize jump threshold if not set
            if (!char.jumpThreshold) {
                // More playful characters jump more frequently
                const baseJumpTime = 240 + Math.floor(Math.random() * 360);
                char.jumpThreshold = baseJumpTime * (2 - char.personality.playfulness);
            }
            
            if (char.randomJumpTimer >= char.jumpThreshold) {
                // Jump chance based on playfulness and energy
                const jumpChance = 0.2 + (char.personality.playfulness * 0.3) + (char.personality.energy * 0.2);
                if (Math.random() < jumpChance) {
                    char.isJumping = true;
                    // Jump height based on energy and boldness
                    const baseJumpVelocity = -6 + Math.random() * 2;
                    const energyMultiplier = 0.8 + char.personality.energy * 0.4; // 0.8x to 1.2x
                    const boldnessMultiplier = 0.9 + char.personality.boldness * 0.2; // 0.9x to 1.1x
                    char.jumpVelocity = baseJumpVelocity * energyMultiplier * boldnessMultiplier;
                    char.currentAnimation = 'jump';
                    char.randomJumpTimer = 0;
                    // Reset threshold with more variation
                    const baseJumpTime = 240 + Math.floor(Math.random() * 360);
                    char.jumpThreshold = baseJumpTime * (2 - char.personality.playfulness);
                    char.lastJumpTime = currentTime;
                } else {
                    char.randomJumpTimer = 0; // Reset timer if didn't jump
                    const baseJumpTime = 240 + Math.floor(Math.random() * 360);
                    char.jumpThreshold = baseJumpTime * (2 - char.personality.playfulness);
                }
            }
        }
        
        // Random animation switching (rare but adds unpredictability)
        if (!char.isIdle && !char.isJumping && Math.random() < 0.0005) { // Very rare chance
            const animations = ['walk', 'idle'];
            const randomAnim = animations[Math.floor(Math.random() * animations.length)];
            if (randomAnim === 'idle') {
                char.isIdle = true;
                char.currentAnimation = 'idle';
                char.speed = 0;
                char.idleTimer = 0;
                char.idleDuration = 60 + Math.random() * 120; // Short random idle
            }
        }
        
        // Random "excitement" bursts (characters occasionally get more active)
        if (!char.excitementTimer) char.excitementTimer = 0;
        char.excitementTimer++;
        
        if (char.excitementTimer >= 1800 + Math.random() * 3600) { // 30-90 seconds
            if (Math.random() < 0.3) { // 30% chance of excitement burst
                char.excitementBurst = true;
                char.excitementTimer = 0;
                char.excitementDuration = 180 + Math.random() * 300; // 3-8 seconds
                char.excitementSpeedMultiplier = 1.5 + Math.random() * 1.0; // 1.5x to 2.5x speed
            }
        }
        
        // Apply excitement burst effects
        if (char.excitementBurst && char.excitementDuration > 0) {
            char.speed = char.originalSpeed * char.excitementSpeedMultiplier;
            char.excitementDuration--;
            if (char.excitementDuration <= 0) {
                char.excitementBurst = false;
                char.speed = char.originalSpeed;
            }
        }
    }
    
    // Draw characters
    drawCharacters() {
        this.characters.forEach(char => {
            if (!char.spriteLoaded || !char.sprite) {
                // Draw fallback rectangle
                this.ctx.fillStyle = '#FF69B4';
                this.ctx.fillRect(
                    char.x,
                    char.y + char.jumpHeight,
                    this.spriteConfig.frameWidth * char.scale,
                    this.spriteConfig.frameHeight * char.scale
                );
                return;
            }
            
            const anim = this.spriteConfig.animations[char.currentAnimation];
            const sourceX = char.currentFrame * this.spriteConfig.frameWidth;
            const sourceY = anim.row * this.spriteConfig.frameHeight;
            
            const drawWidth = this.spriteConfig.frameWidth * char.scale;
            const drawHeight = this.spriteConfig.frameHeight * char.scale;
            const drawY = char.y + char.jumpHeight;
            
            this.ctx.save();
            
            // Apply flash effect
            if (char.flashTimer > 0) {
                // Bright white flash effect
                this.ctx.filter = 'brightness(2) saturate(0)';
            }
            
            // Apply stunned visual effect
            if (char.isStunned) {
                // Add a slight red tint and shake effect
                this.ctx.filter = 'hue-rotate(0deg) saturate(1.5) brightness(1.2)';
                
                // Add shake effect
                const shakeX = (Math.random() - 0.5) * 2;
                const shakeY = (Math.random() - 0.5) * 2;
                this.ctx.translate(shakeX, shakeY);
            }
            
            // Flip sprite based on direction
            if (char.direction < 0) {
                this.ctx.translate(char.x + drawWidth, drawY);
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(
                    char.sprite,
                    sourceX, sourceY,
                    this.spriteConfig.frameWidth, this.spriteConfig.frameHeight,
                    0, 0,
                    drawWidth, drawHeight
                );
            } else {
                this.ctx.drawImage(
                    char.sprite,
                    sourceX, sourceY,
                    this.spriteConfig.frameWidth, this.spriteConfig.frameHeight,
                    char.x, drawY,
                    drawWidth, drawHeight
                );
            }
            
            this.ctx.restore();
            
            // Draw stunned effects
            if (char.isStunned) {
                // this.drawStunnedEffects(char, drawWidth, drawHeight, drawY);
            }
            
            // Draw shadow
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.beginPath();
            this.ctx.ellipse(
                char.x + drawWidth / 2,
                char.y + drawHeight - 10,
                drawWidth / 3,
                drawHeight / 8,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    // Draw stunned visual effects
    drawStunnedEffects(char, drawWidth, drawHeight, drawY) {
        this.ctx.save();
        
        // Draw spinning stars around the character
        const centerX = char.x + drawWidth / 2;
        const centerY = char.y + drawHeight / 2;
        const starRadius = 30 + Math.sin(char.stunTimer * 0.2) * 10;
        const starCount = 6;
        
        for (let i = 0; i < starCount; i++) {
            const angle = (char.stunTimer * 0.1 + (i / starCount) * Math.PI * 2) % (Math.PI * 2);
            const starX = centerX + Math.cos(angle) * starRadius;
            const starY = centerY + Math.sin(angle) * starRadius;
            
            // Draw star
            this.ctx.fillStyle = `rgba(255, 255, 0, ${0.8 - (char.stunTimer / char.stunDuration) * 0.5})`;
            this.ctx.beginPath();
            this.ctx.translate(starX, starY);
            this.ctx.rotate(angle);
            
            // Draw 5-pointed star
            for (let j = 0; j < 5; j++) {
                const starAngle = (j * Math.PI * 2) / 5;
                const outerRadius = 8;
                const innerRadius = 4;
                const x1 = Math.cos(starAngle) * outerRadius;
                const y1 = Math.sin(starAngle) * outerRadius;
                const x2 = Math.cos(starAngle + Math.PI / 5) * innerRadius;
                const y2 = Math.sin(starAngle + Math.PI / 5) * innerRadius;
                
                if (j === 0) {
                    this.ctx.moveTo(x1, y1);
                } else {
                    this.ctx.lineTo(x1, y1);
                }
                this.ctx.lineTo(x2, y2);
            }
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        }
        
        // Draw "Z" symbols above character
        this.ctx.fillStyle = `rgba(255, 0, 0, ${0.9 - (char.stunTimer / char.stunDuration) * 0.5})`;
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        
        this.ctx.restore();
    }
}

// Initialize the animation system when DOM is ready
let characterAnimSystem = null;

function initCharacterAnimation() {
    if (characterAnimSystem) {
        characterAnimSystem.stop();
    }
    
    characterAnimSystem = new CharacterAnimationSystem('charactersCanvas');
    characterAnimSystem.init();
}

// Make sure the function is available globally immediately
window.initCharacterAnimation = initCharacterAnimation;

// Also try to initialize immediately if DOM is already ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Small delay to ensure other scripts have loaded
        setTimeout(() => {
            if (typeof window.initCharacterAnimation === 'function') {
                window.initCharacterAnimation();
            }
        }, 50);
    });
} else {
    // DOM is already ready, initialize immediately
    setTimeout(() => {
        if (typeof window.initCharacterAnimation === 'function') {
            window.initCharacterAnimation();
        }
    }, 50);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CharacterAnimationSystem, initCharacterAnimation };
}

