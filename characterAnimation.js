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
        this.animationFrameId = null;
        this.isRunning = false;
        this.rockImage = null;
        this.rockImageLoaded = false;
        
        // Rain system
        this.isRaining = false;
        this.rainParticles = [];
        this.rainTimer = 0;
        this.rainDuration = 0;
        this.nextRainCheck = 300; // Check for rain every 5 seconds at 60fps
        this.rainIntensity = 100; // Number of rain drops
        
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
        
        // Load rock image
        // await this.loadRockImage();
        
        // Generate random stones
        // this.generateStones(3);
        
        // Create 5 random characters
        await this.createRandomCharacters(5);
        
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
        
        // Check collision with characters
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
            }
        });
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

    // Load rock image
    loadRockImage() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.rockImage = img;
                this.rockImageLoaded = true;
                resolve();
            };
            img.onerror = () => {
                console.error('Failed to load rock image');
                this.rockImageLoaded = false;
                resolve();
            };
            img.src = 'assets/cave_rock5.png';
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
    
    // Generate random stones on the canvas
    generateStones(count) {
        this.stones = [];
        const canvasWidth = this.canvas.width;
        const spacing = canvasWidth / (count + 1);
        
        for (let i = 0; i < count; i++) {
            const baseSize = 20 + Math.random() * 10;
            const stone = {
                x: spacing * (i + 1) + (Math.random() - 0.5) * 100,
                y: this.canvas.height - 25, // Ground level
                width: baseSize,
                height: baseSize,
                scale: 0.5
            };
            
            // Make sure stones don't go off screen
            stone.x = Math.max(50, Math.min(stone.x, canvasWidth - 50));
            
            this.stones.push(stone);
        }
        
        // Sort stones by x position for efficient collision detection
        this.stones.sort((a, b) => a.x - b.x);
    }
    
    // Create random characters
    async createRandomCharacters(count) {
        const promises = [];
        
        for (let i = 0; i < count; i++) {
            // Random animal type
            const animalType = this.animalTypes[Math.floor(Math.random() * this.animalTypes.length)];
            
            // Random character variation (1-15)
            const charNum = Math.floor(Math.random() * this.characterVariations) + 1;
            const charVariation = String(charNum).padStart(2, '0');
            
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
                personality: personality
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
            
            // Check for rain events
            this.checkRainEvent();
            
            // Update rain particles
            this.updateRain();
            
            // Update and draw characters
            this.updateCharacters();
            this.drawCharacters();
            
            // Draw rain on top of everything
            this.drawRain();
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
    
    // Initialize rain particles
    initRain() {
        this.rainParticles = [];
        for (let i = 0; i < this.rainIntensity; i++) {
            this.rainParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                length: 10 + Math.random() * 20,
                speed: 8 + Math.random() * 4,
                opacity: 0.1 + Math.random() * 0.3,
                width: 1 + Math.random() * 2
            });
        }
    }
    
    // Update rain particles
    updateRain() {
        if (!this.isRaining) return;
        
        this.rainParticles.forEach(particle => {
            particle.y += particle.speed;
            
            // Reset particle when it goes off screen
            if (particle.y > this.canvas.height) {
                particle.y = -particle.length;
                particle.x = Math.random() * this.canvas.width;
            }
        });
    }
    
    // Draw rain
    drawRain() {
        if (!this.isRaining) return;
        
        this.ctx.save();
        
        this.rainParticles.forEach(particle => {
            // Create gradient for rain drop
            const gradient = this.ctx.createLinearGradient(
                particle.x, particle.y,
                particle.x, particle.y + particle.length
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${particle.opacity})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = particle.width;
            this.ctx.lineCap = 'round';
            
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(particle.x, particle.y + particle.length);
            this.ctx.stroke();
        });
        
        // Add rain atmosphere overlay
        this.ctx.fillStyle = 'rgba(100, 100, 150, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.restore();
    }
    
    // Check and handle rain events
    checkRainEvent() {
        this.rainTimer++;
        
        // Check for new rain event
        if (!this.isRaining && this.rainTimer >= this.nextRainCheck) {
            // Rare chance of rain (3% chance every 5 seconds)
            if (Math.random() < 0.03) {
                this.startRain();
            }
            this.rainTimer = 0;
            // Randomize next check time (5-15 seconds)
            this.nextRainCheck = 300 + Math.floor(Math.random() * 600);
        }
        
        // Handle ongoing rain
        if (this.isRaining) {
            this.rainDuration--;
            if (this.rainDuration <= 0) {
                this.stopRain();
            }
        }
    }
    
    // Start rain event
    startRain() {
        this.isRaining = true;
        this.rainDuration = 300 + Math.floor(Math.random() * 300); // 5-10 seconds of rain
        this.initRain();
        
        // Add visual feedback to canvas container
        const canvasContainer = this.canvas.parentElement;
        if (canvasContainer && canvasContainer.classList.contains('canvas-container')) {
            canvasContainer.classList.add('raining');
        }
        
        // Show rain notification
        this.showRainNotification();
        
        // Update all characters for rain
        this.characters.forEach(char => {
            // Store pre-rain state
            char.preRainAnimation = char.currentAnimation;
            char.preRainSpeed = char.speed;
            
            // Stop walking and switch to umbrella if idle
            if (char.currentAnimation === 'idle' || char.isIdle) {
                char.currentAnimation = 'umbrella';
            }
            
            // Stop all movement during rain
            char.speed = 0;
            char.isWalkingInRain = false;
        });
        
        console.log('🌧️ Rain started! Duration:', this.rainDuration / 60, 'seconds');
    }
    
    // Stop rain event
    stopRain() {
        this.isRaining = false;
        this.rainParticles = [];
        
        // Remove visual feedback from canvas container
        const canvasContainer = this.canvas.parentElement;
        if (canvasContainer && canvasContainer.classList.contains('canvas-container')) {
            canvasContainer.classList.remove('raining');
        }
        
        // Hide rain notification
        this.hideRainNotification();
        
        // Restore character states
        this.characters.forEach(char => {
            // Only restore if not stunned or flying
            if (!char.isStunned && !char.isFlying && !char.isDragging) {
                if (char.currentAnimation === 'umbrella') {
                    char.currentAnimation = char.isIdle ? 'idle' : 'walk';
                }
                
                // Restore movement speed
                if (!char.isIdle) {
                    char.speed = char.originalSpeed;
                }
            }
        });
        
        console.log('☀️ Rain stopped!');
    }
    
    // Show rain notification
    showRainNotification() {
        // Check if notification already exists
        let notification = document.getElementById('rainNotification');
        
        if (!notification) {
            // Create notification element
            notification = document.createElement('div');
            notification.id = 'rainNotification';
            notification.className = 'rain-notification';
            notification.textContent = 'It\'s raining! Characters are taking shelter with umbrellas ☔';
            document.body.appendChild(notification);
        }
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Hide rain notification
    hideRainNotification() {
        const notification = document.getElementById('rainNotification');
        if (notification) {
            notification.classList.remove('show');
            // Remove element after animation completes
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 500);
        }
    }
    
    // Draw stones
    drawStones() {
        if (!this.rockImageLoaded || !this.rockImage) {
            // Fallback to simple shapes if image not loaded
            this.stones.forEach(stone => {
                this.ctx.save();
                this.ctx.fillStyle = '#666666';
                this.ctx.beginPath();
                this.ctx.arc(stone.x + stone.width / 2, stone.y + stone.height / 2, stone.width / 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
            return;
        }
        
        this.stones.forEach(stone => {
            this.ctx.save();
            
            // Shadow
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            this.ctx.shadowBlur = 8;
            this.ctx.shadowOffsetY = 3;
            
            // Draw rock image
            const drawWidth = stone.width * stone.scale;
            const drawHeight = stone.height * stone.scale;
            const drawX = stone.x - (drawWidth - stone.width) / 2;
            const drawY = stone.y - (drawHeight - stone.height) / 2;
            
            this.ctx.drawImage(
                this.rockImage,
                drawX,
                drawY,
                drawWidth,
                drawHeight
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
            
            // Handle rain state - characters stop and use umbrellas
            if (this.isRaining && !char.isStunned && !char.isFlying) {
                // Ensure characters stay still during rain
                char.speed = 0;
                
                // Switch idle characters to umbrella animation
                if (char.isIdle || char.currentAnimation === 'idle') {
                    char.currentAnimation = 'umbrella';
                } else if (char.currentAnimation === 'walk') {
                    // Walking characters become idle with umbrella
                    char.currentAnimation = 'umbrella';
                    char.isIdle = true;
                }
                
                // Update frame animation for umbrella
                char.frameTimer++;
                if (char.frameTimer >= char.frameDelay) {
                    char.frameTimer = 0;
                    char.currentFrame = (char.currentFrame + 1) % this.spriteConfig.animations[char.currentAnimation].frameCount;
                }
                
                // Skip normal movement logic during rain
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
            
            // Random animation system (only if not stunned and not raining)
            if (!char.isStunned && !this.isRaining) {
                this.handleRandomAnimations(char);
            }
            
            // Update frame animation
            char.frameTimer++;
            if (char.frameTimer >= char.frameDelay) {
                char.frameTimer = 0;
                char.currentFrame = (char.currentFrame + 1) % this.spriteConfig.animations[char.currentAnimation].frameCount;
            }
            
            // Handle jumping (only if not stunned and not raining)
            if (char.isJumping && !char.isStunned && !this.isRaining) {
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
            } else if (!char.isStunned && !this.isRaining) {
                // Check for stone collision ahead (only if not stunned and not raining)
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
            
            // Move character (only if not stunned, not idle, and not raining)
            if (!char.isStunned && !char.isIdle && !this.isRaining) {
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

// Manual rain trigger for testing (can be called from console)
function triggerRain() {
    if (characterAnimSystem && !characterAnimSystem.isRaining) {
        characterAnimSystem.startRain();
        console.log('🌧️ Rain manually triggered!');
    } else if (characterAnimSystem && characterAnimSystem.isRaining) {
        console.log('☔ It\'s already raining!');
    } else {
        console.log('❌ Animation system not initialized');
    }
}

// Stop rain manually (for testing)
function stopRain() {
    if (characterAnimSystem && characterAnimSystem.isRaining) {
        characterAnimSystem.stopRain();
        console.log('☀️ Rain manually stopped!');
    } else if (characterAnimSystem && !characterAnimSystem.isRaining) {
        console.log('☀️ It\'s not raining!');
    } else {
        console.log('❌ Animation system not initialized');
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CharacterAnimationSystem, initCharacterAnimation, triggerRain, stopRain };
}

// Make functions available globally for testing
if (typeof window !== 'undefined') {
    window.triggerRain = triggerRain;
    window.stopRain = stopRain;
}

