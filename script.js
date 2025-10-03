// Vocabulary data with all provided Mandarin words
const vocabulary = [
    { chinese: "规则", pinyin: "guī zé", english: "aturan" },
    { chinese: "交通", pinyin: "jiāo tōng", english: "lalu lintas" },
    { chinese: "车祸", pinyin: "chē huò", english: "kecelakaan mobil" },
    { chinese: "救", pinyin: "jiù", english: "menyelamatkan" },
    { chinese: "指挥", pinyin: "zhǐ huī", english: "memerintah, mengarahkan" },
    { chinese: "另", pinyin: "lìng", english: "lain" },
    { chinese: "巨大", pinyin: "jù dà", english: "sangat besar, raksasa" },
    { chinese: "照顾", pinyin: "zhào gù", english: "merawat" },
    { chinese: "到达", pinyin: "dào dá", english: "tiba" },
    { chinese: "司机", pinyin: "sī jī", english: "sopir" },
    { chinese: "顺利", pinyin: "shùn lì", english: "dengan lancar" },
    { chinese: "被困", pinyin: "bèi kùn", english: "terperangkap" },
    { chinese: "采访", pinyin: "cǎi fǎng", english: "wawancara" },
    { chinese: "流血", pinyin: "liú xiě", english: "berdarah" },
    { chinese: "标题", pinyin: "biāo tí", english: "judul" },
    { chinese: "遵守", pinyin: "zūn shǒu", english: "mematuhi, menaati" },
    { chinese: "见义勇为", pinyin: "jiàn yì yǒng wéi", english: "bertindak berani untuk tujuan yang benar" },
    { chinese: "获得", pinyin: "huò dé", english: "mendapatkan, memperoleh" },
    { chinese: "表扬", pinyin: "biǎo yáng", english: "memuji" },
    { chinese: "包扎", pinyin: "bāo zā", english: "membalut" },
    { chinese: "受伤", pinyin: "shòu shāng", english: "terluka" }
];

// Cute animal characters with sprite sheet properties
const animals = {
    beaver: { 
        name: "Berang-berang", 
        color: "#8B7355", 
        sprite: "beaver.png",
        frameWidth: 64,
        frameHeight: 64,
        frames: 12, // 3 rows × 4 frames = 12 total frames
        fps: 8,
        // Animation frame mappings for different actions
        animations: {
            walk: { startFrame: 0, frameCount: 4 },    // Row 1: frames 0-3
            jump: { startFrame: 4, frameCount: 4 },    // Row 2: frames 4-7  
            sleep: { startFrame: 8, frameCount: 4 }    // Row 3: frames 8-11
        }
    },
    seaOtter: { 
        name: "Berang-berang Laut", 
        color: "#8B6331", 
        sprite: "sea_otter.png",
        frameWidth: 64,
        frameHeight: 64,
        frames: 12, // 3 rows × 4 frames = 12 total frames
        fps: 6,
        // Animation frame mappings for different actions
        animations: {
            walk: { startFrame: 0, frameCount: 4 },    // Row 1: frames 0-3
            jump: { startFrame: 4, frameCount: 4 },    // Row 2: frames 4-7  
            sleep: { startFrame: 8, frameCount: 4 }    // Row 3: frames 8-11
        }
    },
    elephant: { 
        name: "Gajah", 
        color: "#808080", 
        sprite: "elephant.png",
        frameWidth: 240,
        frameHeight: 240,
        frames: 12, // 3 rows × 4 frames = 12 total frames
        fps: 2,
        // Animation frame mappings for different actions
        animations: {
            walk: { startFrame: 0, frameCount: 4 },    // Row 1: frames 0-3
            jump: { startFrame: 4, frameCount: 4 },    // Row 2: frames 4-7  
            sleep: { startFrame: 8, frameCount: 4 }    // Row 3: frames 8-11
        }
    },
    penguin: { 
        name: "Penguin", 
        color: "#2C3E50", 
        sprite: "penguin.png",
        frameWidth: 64,
        frameHeight: 64,
        frames: 12, // 3 rows × 4 frames = 12 total frames
        fps: 10,
        // Animation frame mappings for different actions
        animations: {
            walk: { startFrame: 0, frameCount: 4 },    // Row 1: frames 0-3
            jump: { startFrame: 4, frameCount: 4 },    // Row 2: frames 4-7  
            sleep: { startFrame: 8, frameCount: 4 }    // Row 3: frames 8-11
        }
    },
    panda: { 
        name: "Panda", 
        color: "#000000", 
        sprite: "panda.png",
        frameWidth: 64,
        frameHeight: 64,
        frames: 12, // 3 rows × 4 frames = 12 total frames
        fps: 7,
        // Animation frame mappings for different actions
        animations: {
            walk: { startFrame: 0, frameCount: 4 },    // Row 1: frames 0-3
            jump: { startFrame: 4, frameCount: 4 },    // Row 2: frames 4-7  
            sleep: { startFrame: 8, frameCount: 4 }    // Row 3: frames 8-11
        }
    },
    koala: { 
        name: "Koala", 
        color: "#696969", 
        sprite: "koala.png",
        frameWidth: 187,
        frameHeight: 187,
        frames: 12, // 3 rows × 4 frames = 12 total frames
        fps: 6,
        // Animation frame mappings for different actions
        animations: {
            walk: { startFrame: 0, frameCount: 4 },    // Row 1: frames 0-3
            jump: { startFrame: 4, frameCount: 4 },    // Row 2: frames 4-7  
            sleep: { startFrame: 8, frameCount: 4 }    // Row 3: frames 8-11
        }
    },
    hamster: { 
        name: "Hamster", 
        color: "#D2691E", 
        sprite: "hamster.png",
        frameWidth: 64,
        frameHeight: 64,
        frames: 12, // 3 rows × 4 frames = 12 total frames
        fps: 12,
        // Animation frame mappings for different actions
        animations: {
            walk: { startFrame: 0, frameCount: 4 },    // Row 1: frames 0-3
            jump: { startFrame: 4, frameCount: 4 },    // Row 2: frames 4-7  
            sleep: { startFrame: 8, frameCount: 4 }    // Row 3: frames 8-11
        }
    },
    rabbit: { 
        name: "Kelinci", 
        color: "#FFC0CB", 
        sprite: "rabbit.png",
        frameWidth: 64,
        frameHeight: 64,
        frames: 12, // 3 rows × 4 frames = 12 total frames
        fps: 9,
        // Animation frame mappings for different actions
        animations: {
            walk: { startFrame: 0, frameCount: 4 },    // Row 1: frames 0-3
            jump: { startFrame: 4, frameCount: 4 },    // Row 2: frames 4-7  
            sleep: { startFrame: 8, frameCount: 4 }    // Row 3: frames 8-11
        }
    }
};

const encouragements = [
    "Mantap! 🎉",
    "Hebat! ⭐",
    "Teruskan! 💪",
    "Fantastis! 🌟",
    "Luar biasa! 🎊",
    "Sempurna! 👏",
    "Kamu bintang 5! ✨",
    "Juara! 🏆"
];

// Game state
let gameState = {
    currentMode: null,
    score: 0,
    level: 1,
    lives: 3,
    currentQuestionIndex: 0,
    selectedWords: [],
    gameWords: [],
    correctAnswers: 0,
    totalQuestions: 0,
    // collectedAnimals: JSON.parse(localStorage.getItem('collectedAnimals') || '[]')
    collectedAnimals: ['elephant']
};

// TTS system
const ttsSystem = {
    enabled: true,
    
    initTTS() {
        // Initialize TTS to always use browser Speech API
        this.ttsClient = {
            speak: async (text, language = 'zh-TW') => {
                this.useBrowserTTS(text, language);
            }
        };
    },
    
    useBrowserTTS(text, language) {
        if (!this.enabled || !('speechSynthesis' in window)) {
            return;
        }
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        
        // Try to find a Taiwanese Chinese voice first, then fallback to any Chinese voice
        const voices = window.speechSynthesis.getVoices();
        const taiwanVoice = voices.find(voice => 
            voice.lang.includes('zh-TW') || voice.lang.includes('zh-Hant-TW')
        );
        const chineseVoice = voices.find(voice => 
            voice.lang.includes('zh') || voice.lang.includes('CN')
        );
        
        if (taiwanVoice) {
            utterance.voice = taiwanVoice;
        } else if (chineseVoice) {
            utterance.voice = chineseVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    },
    
    playSound(text) {
        if (this.ttsClient) {
            this.ttsClient.speak(text, 'zh-TW');
        }
    },
    
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
};

// Sound system
const soundSystem = {
    audioContext: null,
    sounds: {},
    enabled: true,
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (e) {
            console.log('Web Audio API tidak didukung');
            this.enabled = false;
        }
    },
    
    createSounds() {
        // Suara jawaban benar - dentang yang menyenangkan
        this.sounds.correct = this.createTone([523.25, 659.25, 783.99], [0.3, 0.2, 0.1], 0.8);
        
        // Suara jawaban salah - dengung lembut
        this.sounds.incorrect = this.createTone([200, 150], [0.1, 0.1], 0.3);
        
        // Suara klik tombol - pop lembut
        this.sounds.click = this.createTone([800], [0.05], 0.2);
        
        // Suara balik kartu - whoosh cepat
        this.sounds.flip = this.createTone([400, 600], [0.05, 0.05], 0.15);
        
        // Suara naik level - tangga nada naik
        this.sounds.levelUp = this.createTone([261.63, 329.63, 392.00, 523.25], [0.2, 0.2, 0.2, 0.3], 0.6);
        
        // Suara game over - nada turun
        this.sounds.gameOver = this.createTone([523.25, 392.00, 261.63], [0.3, 0.3, 0.4], 0.7);
        
        // Suara cocok - dentang sukses
        this.sounds.match = this.createTone([659.25, 783.99, 1046.50], [0.2, 0.2, 0.3], 0.5);
        
        // Suara mengetik - tekan tombol lembut
        this.sounds.typing = this.createTone([1000], [0.02], 0.1);
        
        // Suara perayaan - cheers dan applause untuk skor tinggi (>70)
        this.sounds.celebration = this.createTone([523.25, 659.25, 783.99, 1046.50, 1318.51], [0.3, 0.2, 0.2, 0.2, 0.4], 0.8);
        
        // Suara confetti - suara gembira untuk skor sedang (50-70)
        this.sounds.confetti = this.createTone([392.00, 523.25, 659.25, 783.99], [0.2, 0.2, 0.2, 0.3], 0.6);
        
        // Suara kegagalan - nada turun untuk skor rendah (<50)
        this.sounds.failure = this.createTone([440, 392, 349, 294], [0.3, 0.3, 0.3, 0.5], 0.7);
        
        // Suara reward - magical chime untuk mendapat hewan
        this.sounds.reward = this.createTone([523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98], [0.2, 0.2, 0.2, 0.3, 0.3, 0.4], 0.9);
        
        // Suara slot machine - spinning sound untuk countdown reward
        this.sounds.slot = this.createTone([200, 300, 400, 500, 600, 700, 800, 900, 1000], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2], 0.4);
    },
    
    createTone(frequencies, durations, volume = 0.5) {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + durations[index]);
                
                oscillator.start(this.audioContext.currentTime + index * 0.1);
                oscillator.stop(this.audioContext.currentTime + durations[index] + index * 0.1);
            });
        };
    },
    
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    },
    
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
};

// Canvas Animation System with Sprite Sheet Animation
const canvasAnimationSystem = {
    canvas: null,
    ctx: null,
    animationId: null,
    sprites: {},
    animatedSprites: [],
    lastTime: 0,
    
    init() {
        this.canvas = document.getElementById('animalsCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false; // Crisp pixel art
        this.loadSprites();
        this.setupCanvas();
        this.bindEvents();
        this.start();
    },
    
    setupCanvas() {
        // Set up high DPI canvas
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.imageSmoothingEnabled = false; // Reapply after scaling
    },
    
    loadSprites() {
        const animalKeys = Object.keys(animals);
        let loadedCount = 0;
        
        animalKeys.forEach(key => {
            const animal = animals[key];
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === animalKeys.length) {
                    this.updateAnimatedSprites();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load sprite: ${animal.sprite}`);
                loadedCount++;
                if (loadedCount === animalKeys.length) {
                    this.updateAnimatedSprites();
                }
            };
            img.src = animal.sprite;
            this.sprites[key] = img;
        });
    },
    
    getRandomAnimation(animal) {
        if (!animal.animations) return null;
        const animationKeys = Object.keys(animal.animations);
        return animationKeys[Math.floor(Math.random() * animationKeys.length)];
    },
    
    updateAnimatedSprites() {
        this.animatedSprites = [];
        
        gameState.collectedAnimals.forEach((animalKey, index) => {
            if (!animals[animalKey]) return;
            
            const animal = animals[animalKey];
            const sprite = {
                key: animalKey,
                animal: animal,
                image: this.sprites[animalKey],
                x: 200 + Math.random() * 400, // Random X position in center area
                y: 20, // Random Y position in center area
                width: 80,
                height: 80,
                scale: 1,
                isHovered: false,
                // Frame animation properties
                frameIndex: 0, // Start at frame 0
                frameAccumulator: 0,
                frameStep: 1 / animal.fps,
                // Animation properties for multi-row sprites
                currentAnimation: animal.animations ? this.getRandomAnimation(animal) : null,
                animationTime: 0,
                animationDuration: 2 + Math.random() * 3, // Random duration 2-5 seconds
                // Movement properties
                velocityX: (Math.random() - 0.5) * 40, // Random horizontal speed
                direction: Math.random() > 0.5 ? 1 : -1, // Random initial direction
                minX: 200, // Start of center area
                maxX: 600, // End of center area (200 + 400)
                // Additional animation properties
                bounceOffset: 0,
                bounceTime: Math.random() * Math.PI * 2, // Random phase
                clickScale: 1,
                clickTime: 0
            };
            
            this.animatedSprites.push(sprite);
        });
    },
    
    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.handleClick({ offsetX: x, offsetY: y });
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.setupCanvas(), 250);
        });
    },
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.offsetX || (e.clientX - rect.left);
        const y = e.offsetY || (e.clientY - rect.top);
        
        this.animatedSprites.forEach(sprite => {
            if (this.isPointInSprite(x, y, sprite)) {
                soundSystem.play('click');
                this.showAnimalInfo(sprite.key, sprite.animal);
                
                // Add click animation
                sprite.clickScale = 1.3;
                sprite.clickTime = 0.2; // Animation duration
            }
        });
    },
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.offsetX || (e.clientX - rect.left);
        const y = e.offsetY || (e.clientY - rect.top);
        
        let hovered = false;
        this.animatedSprites.forEach(sprite => {
            const wasHovered = sprite.isHovered;
            sprite.isHovered = this.isPointInSprite(x, y, sprite);
            
            if (sprite.isHovered) {
                hovered = true;
            }
        });
        
        this.canvas.style.cursor = hovered ? 'pointer' : 'default';
    },
    
    handleMouseLeave() {
        this.animatedSprites.forEach(sprite => {
            sprite.isHovered = false;
        });
        this.canvas.style.cursor = 'default';
    },
    
    isPointInSprite(x, y, sprite) {
        return x >= sprite.x && x <= sprite.x + sprite.width &&
               y >= sprite.y && y <= sprite.y + sprite.height;
    },
    
    showAnimalInfo(animalKey, animal) {
        // Use the existing showAnimalInfo function
        if (typeof showAnimalInfo === 'function') {
            showAnimalInfo(animalKey, animal);
        }
    },
    
    animate(currentTime) {
        if (!this.ctx) return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        // Clear canvas
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Show no animals message if no collected animals
        if (gameState.collectedAnimals.length === 0) {
            this.drawNoAnimalsMessage();
        } else {
            // Update and draw sprites
            this.animatedSprites.forEach(sprite => {
                this.updateSprite(sprite, deltaTime);
                this.drawSprite(sprite);
            });
        }
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    },
    
    updateSprite(sprite, deltaTime) {
        // Update movement
        if (sprite.animal.animations && sprite.currentAnimation) {
            // Only move during walk animation
            if (sprite.currentAnimation === 'walk') {
                sprite.x += sprite.velocityX * deltaTime;
                
                // Bounce off screen edges
                if (sprite.x <= sprite.minX || sprite.x >= sprite.maxX) {
                    sprite.velocityX *= -1;
                    sprite.direction *= -1;
                    sprite.x = Math.max(sprite.minX, Math.min(sprite.maxX, sprite.x));
                }
            }
        }
        
        // Update animation switching for multi-row sprites
        if (sprite.animal.animations && sprite.currentAnimation) {
            sprite.animationTime += deltaTime;
            if (sprite.animationTime >= sprite.animationDuration) {
                // Randomly choose next animation
                sprite.currentAnimation = this.getRandomAnimation(sprite.animal);
                sprite.animationTime = 0;
                sprite.animationDuration = 2 + Math.random() * 3; // Random duration 2-5 seconds
                sprite.frameIndex = 0; // Reset frame when switching animations
                
                // Adjust movement based on animation
                if (sprite.currentAnimation === 'walk') {
                    sprite.velocityX = (Math.random() - 0.5) * 40; // Random speed
                    sprite.direction = Math.random() > 0.5 ? 1 : -1;
                    sprite.velocityX *= sprite.direction;
                } else {
                    sprite.velocityX = 0; // Stop moving for jump/sleep
                }
            }
        }
        
        // Update frame animation
        sprite.frameAccumulator += deltaTime;
        const maxFrames = sprite.animal.animations && sprite.currentAnimation 
            ? sprite.animal.animations[sprite.currentAnimation].frameCount 
            : sprite.animal.frames;
            
        while (sprite.frameAccumulator >= sprite.frameStep) {
            sprite.frameIndex = (sprite.frameIndex + 1) % maxFrames;
            sprite.frameAccumulator -= sprite.frameStep;
        }
        
        // Update bounce animation for Y offset (only during walk)
        if (!sprite.animal.animations || sprite.currentAnimation === 'walk') {
            sprite.bounceTime += deltaTime * 2; // Bounce speed
            sprite.bounceOffset = Math.sin(sprite.bounceTime) * 8; // Bounce height
        } else {
            sprite.bounceOffset = 0; // No bounce during jump/sleep
        }
        
        // Update click animation
        if (sprite.clickTime > 0) {
            sprite.clickTime -= deltaTime;
            if (sprite.clickTime <= 0) {
                sprite.clickScale = 1;
                sprite.clickTime = 0;
            }
        }
        
        // Calculate final scale (base scale + hover + click effects)
        const hoverScale = sprite.isHovered ? 1.1 : 1.0;
        sprite.scale = hoverScale * sprite.clickScale;
    },
    
    drawSprite(sprite) {
        if (!sprite.image || !sprite.image.complete) {
            // Skip drawing if sprite not loaded
            return;
        }
        
        this.ctx.save();
        
        const centerX = sprite.x + sprite.width / 2;
        const centerY = sprite.y + sprite.height / 2;
        
        // Apply transformations
        this.ctx.translate(centerX, centerY - sprite.bounceOffset);
        this.ctx.scale(sprite.scale * sprite.direction, sprite.scale); // Flip horizontally based on direction
        
        // Draw shadow
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(-sprite.width/2 + 2, -sprite.height/2 + 2, sprite.width, sprite.height);
        
        // Draw sprite frame
        this.ctx.globalAlpha = 1;
        
        // Calculate source position for multi-row sprite sheets
        let sx, sy;
        if (sprite.animal.animations) {
            // For animals with multiple animation rows (like panda)
            const currentAnimation = sprite.currentAnimation || 'walk';
            const animData = sprite.animal.animations[currentAnimation];
            const localFrameIndex = sprite.frameIndex % animData.frameCount;
            sx = localFrameIndex * sprite.animal.frameWidth;
            sy = Math.floor(animData.startFrame / 4) * sprite.animal.frameHeight;
        } else {
            // For single-row sprite sheets (other animals)
            sx = sprite.frameIndex * sprite.animal.frameWidth;
            sy = 0;
        }
        
        this.ctx.drawImage(
            sprite.image,
            sx, sy, sprite.animal.frameWidth, sprite.animal.frameHeight, // Source
            -sprite.width/2, -sprite.height/2, sprite.width, sprite.height // Destination
        );
        
        // Draw name on hover
        if (sprite.isHovered) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.fillRect(-40, sprite.height/2 + 5, 80, 20);
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Nunito, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(sprite.animal.name, 0, sprite.height/2 + 18);
        }
        
        this.ctx.restore();
    },
    
    drawNoAnimalsMessage() {
        const message = "Mainkan game untuk mengumpulkan hewan lucu! 🎮";
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '18px Nunito, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        
        this.ctx.fillText(message, canvasWidth / 2, canvasHeight / 2);
    },
    
    start() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.lastTime = performance.now();
        this.animate(this.lastTime);
    },
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    refresh() {
        this.updateAnimatedSprites();
    }
};

// DOM elements
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const resultsScreen = document.getElementById('resultsScreen');
const gameContent = document.getElementById('gameContent');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const livesElement = document.getElementById('livesCount');
const progressFill = document.getElementById('progressFill');
const animalFriend = document.getElementById('animalFriend');
const encouragementElement = document.getElementById('encouragement');
const soundToggle = document.getElementById('soundToggle');
const ttsToggle = document.getElementById('ttsToggle');
const ttsToggleGame = document.getElementById('ttsToggleGame');

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    soundSystem.init();
    ttsSystem.initTTS();
    canvasAnimationSystem.init();
    initializeEventListeners();
    showRandomAnimal();
    
    // Add some demo animals if none exist (for testing)
    if (gameState.collectedAnimals.length === 0) {
        // Add a couple of animals for demonstration
        gameState.collectedAnimals = ['beaver', 'penguin'];
        localStorage.setItem('collectedAnimals', JSON.stringify(gameState.collectedAnimals));
    }
    
    initMenuAnimals();
});

function initializeEventListeners() {
    // Game mode buttons
    document.querySelectorAll('.game-mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            soundSystem.play('click');
            const mode = this.getAttribute('data-mode');
            startGame(mode);
        });
    });

    // Navigation buttons
    document.getElementById('backBtn').addEventListener('click', function() {
        soundSystem.play('click');
        showMenu();
    });
    document.getElementById('playAgainBtn').addEventListener('click', function() {
        soundSystem.play('click');
        startGame(gameState.currentMode);
    });
    document.getElementById('menuBtn').addEventListener('click', function() {
        soundSystem.play('click');
        showMenu();
    });
    
    // Tombol toggle suara
    soundToggle.addEventListener('click', function() {
        const isEnabled = soundSystem.toggle();
        this.textContent = isEnabled ? '🔊' : '🔇';
        this.title = isEnabled ? 'Efek Suara Aktif' : 'Efek Suara Mati';
    });
    
    // Tombol toggle TTS
    if (ttsToggle) {
        ttsToggle.addEventListener('click', function() {
            const isEnabled = ttsSystem.toggle();
            this.textContent = isEnabled ? '🔊' : '🔇';
            this.title = isEnabled ? 'TTS Aktif' : 'TTS Mati';
        });
    }
    
    if (ttsToggleGame) {
        ttsToggleGame.addEventListener('click', function() {
            const isEnabled = ttsSystem.toggle();
            this.textContent = isEnabled ? '🔊' : '🔇';
            this.title = isEnabled ? 'TTS Aktif' : 'TTS Mati';
        });
    }
}

function showMenu() {
    menuScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    resultsScreen.style.display = 'none';
    resetGameState();
    showRandomAnimal();
    updateMenuAnimals();
    canvasAnimationSystem.refresh();
}

function startGame(mode) {
    gameState.currentMode = mode;
    menuScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    resultsScreen.style.display = 'none';
    
    resetGameState();
    updateUI();
    
    switch(mode) {
        case 'matching':
            initMatchingGame();
            break;
        case 'quiz':
            initQuizGame();
            break;
        case 'memory':
            initMemoryGame();
            break;
        case 'typing':
            initTypingGame();
            break;
    }
}

function resetGameState() {
    gameState.score = 0;
    gameState.level = 1;
    // Set lives based on game mode
    gameState.lives = gameState.currentMode === 'memory' ? 8 : 3;
    gameState.currentQuestionIndex = 0;
    gameState.selectedWords = [];
    gameState.correctAnswers = 0;
    gameState.totalQuestions = 0;
    updateUI();
}

function updateUI() {
    scoreElement.textContent = gameState.score;
    levelElement.textContent = gameState.level;
    livesElement.textContent = '❤️'.repeat(gameState.lives);
    
    const progress = (gameState.currentQuestionIndex / Math.max(gameState.totalQuestions, 1)) * 100;
    progressFill.style.width = progress + '%';
}

function showRandomAnimal() {
    const animalKeys = Object.keys(animals);
    const randomKey = animalKeys[Math.floor(Math.random() * animalKeys.length)];
    const randomAnimal = animals[randomKey];
    // Use a generic animal emoji since we don't have individual emojis anymore
    const animalEmojis = ["🦫", "🦦", "🐘", "🐧", "🐼", "🐨", "🐹", "🐰"];
    const randomEmoji = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
    animalFriend.textContent = randomEmoji;
}

function showEncouragement() {
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    encouragementElement.textContent = randomEncouragement;
    
    setTimeout(() => {
        encouragementElement.textContent = '';
    }, 2000);
}

// Matching Game
function initMatchingGame() {
    gameState.totalQuestions = 6;
    gameState.gameWords = getRandomWords(6);
    createMatchingInterface();
}

function createMatchingInterface() {
    const chineseWords = [...gameState.gameWords];
    const englishWords = [...gameState.gameWords];
    
    // Acak array
    shuffleArray(chineseWords);
    shuffleArray(englishWords);
    
    gameContent.innerHTML = `
        <div class="matching-container">
            <div class="word-column" id="chineseColumn">
                <h3>Karakter Mandarin</h3>
                ${chineseWords.map((word, index) => 
                    `<div class="word-card" data-type="chinese" data-word="${word.chinese}" data-pinyin="${word.pinyin}" data-index="${index}">
                        <div>${word.chinese}</div>
                        <small>${word.pinyin}</small>
                    </div>`
                ).join('')}
            </div>
            <div class="word-column" id="englishColumn">
                <h3>Arti dalam Bahasa Indonesia</h3>
                ${englishWords.map((word, index) => 
                    `<div class="word-card" data-type="english" data-word="${word.english}" data-index="${index}">
                        ${word.english}
                    </div>`
                ).join('')}
            </div>
        </div>
    `;
    
    // Tambahkan listener klik ke kartu kata
    document.querySelectorAll('.word-card').forEach(card => {
        card.addEventListener('click', handleMatchingCardClick);
    });
}

function handleMatchingCardClick(event) {
    const card = event.currentTarget;
    const type = card.getAttribute('data-type');
    const word = card.getAttribute('data-word');
    const pinyin = card.getAttribute('data-pinyin');
    
    // Play TTS for Chinese characters
    if (type === 'chinese' && word) {
        ttsSystem.playSound(word);
    }
    
    // Remove previous selections of the same type
    document.querySelectorAll(`.word-card[data-type="${type}"]`).forEach(c => {
        c.classList.remove('selected');
    });
    
    // Select current card
    card.classList.add('selected');
    
    // Update selected words
    if (type === 'chinese') {
        gameState.selectedWords[0] = word;
    } else {
        gameState.selectedWords[1] = word;
    }
    
    // Check if both words are selected
    if (gameState.selectedWords.length >= 2 && gameState.selectedWords[0] && gameState.selectedWords[1]) {
        checkMatch();
    }
}

function checkMatch() {
    const chineseWord = gameState.selectedWords[0];
    const englishWord = gameState.selectedWords[1];
    
    // Find the matching word object
    const matchingWord = vocabulary.find(word => 
        word.chinese === chineseWord && word.english === englishWord
    );
    
    const selectedCards = document.querySelectorAll('.word-card.selected');
    
    if (matchingWord) {
        // Correct match
        soundSystem.play('match');
        selectedCards.forEach(card => {
            card.classList.add('correct');
            card.classList.remove('selected');
            card.style.pointerEvents = 'none';
        });
        
        gameState.score += 10;
        gameState.correctAnswers++;
        showEncouragement();
        showRandomAnimal();
    } else {
        // Incorrect match
        soundSystem.play('incorrect');
        selectedCards.forEach(card => {
            card.classList.add('incorrect');
            setTimeout(() => {
                card.classList.remove('selected', 'incorrect');
            }, 1000);
        });
        
        gameState.lives--;
        if (gameState.lives <= 0) {
            endGame();
            return;
        }
    }
    
    // Reset pilihan
    gameState.selectedWords = [];
    updateUI();
    
    // Periksa apakah semua kecocokan ditemukan
    const correctCards = document.querySelectorAll('.word-card.correct');
    if (correctCards.length === gameState.gameWords.length * 2) {
        setTimeout(() => {
            if (gameState.level < 3) {
                gameState.level++;
                soundSystem.play('levelUp');
                initMatchingGame();
            } else {
                endGame();
            }
        }, 1500);
    }
}

// Quiz Game
function initQuizGame() {
    gameState.totalQuestions = 10;
    gameState.gameWords = getRandomWords(10);
    gameState.currentQuestionIndex = 0;
    showQuizQuestion();
}

function showQuizQuestion() {
    if (gameState.currentQuestionIndex >= gameState.totalQuestions) {
        endGame();
        return;
    }
    
    const currentWord = gameState.gameWords[gameState.currentQuestionIndex];
    const wrongAnswers = getRandomWords(3, [currentWord]);
    const allOptions = [currentWord, ...wrongAnswers];
    shuffleArray(allOptions);
    
    gameContent.innerHTML = `
        <div class="quiz-container">
            <div class="question">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">${currentWord.chinese}</div>
                <div style="font-size: 1.2rem; opacity: 0.8;">${currentWord.pinyin}</div>
                <button class="tts-button" onclick="ttsSystem.playSound('${currentWord.chinese}')" title="Dengarkan pengucapan">🔊</button>
            </div>
            <div class="quiz-options">
                ${allOptions.map((option, index) => 
                    `<button class="quiz-option" data-answer="${option.english}" data-correct="${option.english === currentWord.english}">
                        ${option.english}
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
    
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', handleQuizAnswer);
    });
    
    // Auto-play TTS when question appears
    setTimeout(() => {
        ttsSystem.playSound(currentWord.chinese);
    }, 500);
    
    updateUI();
}

function handleQuizAnswer(event) {
    const button = event.currentTarget;
    const isCorrect = button.getAttribute('data-correct') === 'true';
    
    // Nonaktifkan semua tombol
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.style.pointerEvents = 'none';
        if (btn.getAttribute('data-correct') === 'true') {
            btn.style.background = 'linear-gradient(145deg, #a8edea 0%, #fed6e3 100%)';
        } else if (btn === button && !isCorrect) {
            btn.style.background = 'linear-gradient(145deg, #ff9a9e 0%, #fecfef 100%)';
        }
    });
    
    if (isCorrect) {
        soundSystem.play('correct');
        gameState.score += 10;
        gameState.correctAnswers++;
        showEncouragement();
        showRandomAnimal();
    } else {
        soundSystem.play('incorrect');
        gameState.lives--;
        if (gameState.lives <= 0) {
            setTimeout(endGame, 1500);
            return;
        }
    }
    
    gameState.currentQuestionIndex++;
    updateUI();
    
    setTimeout(() => {
        showQuizQuestion();
    }, 1500);
}

// Memory Game
function initMemoryGame() {
    const wordPairs = getRandomWords(8);
    gameState.gameWords = [...wordPairs, ...wordPairs]; // Duplicate for pairs
    gameState.totalQuestions = wordPairs.length;
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.lives = 11;
    createMemoryGrid();
}

function createMemoryGrid() {
    // Buat pasangan kartu (Mandarin + Indonesia untuk setiap kata)
    const cards = [];
    gameState.gameWords.slice(0, gameState.totalQuestions).forEach(word => {
        cards.push({ type: 'chinese', content: word.chinese, word: word });
        cards.push({ type: 'english', content: word.english, word: word });
    });
    
    shuffleArray(cards);
    
    gameContent.innerHTML = `
        <div class="memory-grid">
            ${cards.map((card, index) => 
                `<div class="memory-card" data-index="${index}" data-type="${card.type}" data-word="${card.word.chinese}" data-pinyin="${card.word.pinyin}">
                    <div class="card-back">?</div>
                    <div class="card-front" style="display: none;">
                        ${card.content}
                        ${card.type === 'chinese' ? `<button class="tts-button-small" onclick="ttsSystem.playSound('${card.word.chinese}')" title="Dengarkan">🔊</button>` : ''}
                    </div>
                </div>`
            ).join('')}
        </div>
    `;
    
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', handleMemoryCardClick);
    });
}

function handleMemoryCardClick(event) {
    const card = event.currentTarget;
    
    if (card.classList.contains('flipped') || card.classList.contains('matched') || gameState.flippedCards.length >= 2) {
        return;
    }
    
    // Balik kartu
    soundSystem.play('flip');
    card.classList.add('flipped');
    card.querySelector('.card-back').style.display = 'none';
    card.querySelector('.card-front').style.display = 'block';
    
    gameState.flippedCards.push(card);
    
    if (gameState.flippedCards.length === 2) {
        setTimeout(checkMemoryMatch, 1000);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = gameState.flippedCards;
    const word1 = card1.getAttribute('data-word');
    const word2 = card2.getAttribute('data-word');
    const type1 = card1.getAttribute('data-type');
    const type2 = card2.getAttribute('data-type');
    
    if (word1 === word2 && type1 !== type2) {
        // Match found
        soundSystem.play('match');
        card1.classList.add('matched');
        card2.classList.add('matched');
        gameState.score += 15;
        gameState.matchedPairs++;
        showEncouragement();
        showRandomAnimal();
        
        if (gameState.matchedPairs === gameState.totalQuestions) {
            setTimeout(endGame, 1500);
        }
    } else {
        // No match
        soundSystem.play('incorrect');
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.querySelector('.card-back').style.display = 'block';
        card1.querySelector('.card-front').style.display = 'none';
        card2.querySelector('.card-back').style.display = 'block';
        card2.querySelector('.card-front').style.display = 'none';
        
        gameState.lives--;
        if (gameState.lives <= 0) {
            setTimeout(endGame, 500);
            return;
        }
    }
    
    gameState.flippedCards = [];
    updateUI();
}

// Typing Game
function initTypingGame() {
    gameState.totalQuestions = 8;
    gameState.gameWords = getRandomWords(8);
    gameState.currentQuestionIndex = 0;
    showTypingQuestion();
}

function showTypingQuestion() {
    if (gameState.currentQuestionIndex >= gameState.totalQuestions) {
        endGame();
        return;
    }
    
    const currentWord = gameState.gameWords[gameState.currentQuestionIndex];
    
    gameContent.innerHTML = `
        <div class="typing-container">
            <div class="character-display">
                <div style="font-size: 3rem; margin-bottom: 15px;">${currentWord.chinese}</div>
                <div style="font-size: 1.2rem; opacity: 0.7;">${currentWord.english}</div>
                <button class="tts-button" onclick="ttsSystem.playSound('${currentWord.chinese}')" title="Dengarkan pengucapan">🔊 Dengarkan</button>
            </div>
            <input type="text" class="typing-input" placeholder="Ketik pinyin..." autocomplete="off" id="typingInput">
            <div style="margin-top: 20px; font-size: 1rem; opacity: 0.8;">
                Ketik pengucapan pinyin (dengan nada)
            </div>
        </div>
    `;
    
    const input = document.getElementById('typingInput');
    input.focus();
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkTypingAnswer();
        } else {
            soundSystem.play('typing');
        }
    });
    
    // Auto-play TTS when question appears
    setTimeout(() => {
        ttsSystem.playSound(currentWord.chinese);
    }, 500);
    
    updateUI();
}

function checkTypingAnswer() {
    const input = document.getElementById('typingInput');
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = gameState.gameWords[gameState.currentQuestionIndex].pinyin.toLowerCase();
    
    input.disabled = true;
    
    if (userAnswer === correctAnswer) {
        soundSystem.play('correct');
        gameState.score += 15;
        gameState.correctAnswers++;
        input.style.background = 'linear-gradient(145deg, #a8edea 0%, #fed6e3 100%)';
        showEncouragement();
        showRandomAnimal();
    } else {
        soundSystem.play('incorrect');
        gameState.lives--;
        input.style.background = 'linear-gradient(145deg, #ff9a9e 0%, #fecfef 100%)';
        input.value = `Benar: ${gameState.gameWords[gameState.currentQuestionIndex].pinyin}`;
        
        if (gameState.lives <= 0) {
            setTimeout(endGame, 2000);
            return;
        }
    }
    
    gameState.currentQuestionIndex++;
    updateUI();
    
    setTimeout(() => {
        showTypingQuestion();
    }, 2000);
}

// Utility functions
function getRandomWords(count, exclude = []) {
    const availableWords = vocabulary.filter(word => !exclude.includes(word));
    const selected = [];
    
    for (let i = 0; i < count && i < availableWords.length; i++) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const word = availableWords.splice(randomIndex, 1)[0];
        selected.push(word);
    }
    
    return selected;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function endGame() {
    // Play appropriate sound based on score
    if (gameState.score > 70) {
        soundSystem.play('celebration'); // Cheers and applause for high score
    } else if (gameState.score >= 50) {
        soundSystem.play('confetti'); // Confetti and cheers for medium score
    } else {
        soundSystem.play('failure'); // Failure sound for low score
    }
    
    gameScreen.style.display = 'none';
    resultsScreen.style.display = 'block';
    
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('wordsLearned').textContent = gameState.correctAnswers;
    
    // Show animal reward
    showAnimalReward();
}

// Show animal reward with silhouette reveal
function showAnimalReward() {
    // Get a random animal that hasn't been collected yet
    const uncollectedAnimals = Object.keys(animals).filter(key => !gameState.collectedAnimals.includes(key));
    
    let selectedAnimalKey;
    if (uncollectedAnimals.length > 0) {
        selectedAnimalKey = uncollectedAnimals[Math.floor(Math.random() * uncollectedAnimals.length)];
    } else {
        // If all animals are collected, pick a random one
        const animalKeys = Object.keys(animals);
        selectedAnimalKey = animalKeys[Math.floor(Math.random() * animalKeys.length)];
    }
    
    const selectedAnimal = animals[selectedAnimalKey];
    
    // Create reward container
    const rewardContainer = document.createElement('div');
    rewardContainer.className = 'animal-reward-container';
    rewardContainer.innerHTML = `
        <div class="reward-overlay">
            <div class="reward-content">
                <h2>Kamu mendapat hewan baru!</h2>
                <div class="animal-silhouette" id="animalSilhouette">
                    <div class="silhouette-emoji" id="silhouetteEmoji">🦫</div>
                </div>
                <div class="animal-name" id="animalName" style="opacity: 0;">${selectedAnimal.name}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(rewardContainer);
    
    // Cycle through all animals during countdown
    const allAnimalKeys = Object.keys(animals);
    let currentAnimalIndex = 0;
    
    // Start with first animal
    const silhouetteEmoji = document.getElementById('silhouetteEmoji');
    const animalEmojis = ["🦫", "🦦", "🐘", "🐧", "🐼", "🐨", "🐹", "🐰"];
    silhouetteEmoji.textContent = animalEmojis[currentAnimalIndex % animalEmojis.length];
    
    // Fast cycling through animals for 8 seconds
    let cycleCount = 0;
    const totalCycles = 25; // 5 seconds * 5 cycles per second (200ms interval)
    
    const fastCycleInterval = setInterval(() => {
        cycleCount++;
        
        // Play slot sound on every cycle for spinning effect
        soundSystem.play('slot');
        
        // Cycle to next animal silhouette every 200ms
        currentAnimalIndex = (currentAnimalIndex + 1) % allAnimalKeys.length;
        
        // Trigger animation by removing and re-adding the class
        silhouetteEmoji.style.animation = 'none';
        silhouetteEmoji.offsetHeight; // Trigger reflow
        silhouetteEmoji.style.animation = 'silhouetteCycle 0.2s ease-in-out';
        
        silhouetteEmoji.textContent = animalEmojis[currentAnimalIndex % animalEmojis.length];
        
        // Stop after 8 seconds (40 cycles)
        if (cycleCount >= totalCycles) {
            clearInterval(fastCycleInterval);
            // Set the final selected animal emoji
            const selectedIndex = allAnimalKeys.indexOf(selectedAnimalKey);
            silhouetteEmoji.textContent = animalEmojis[selectedIndex % animalEmojis.length];
            revealAnimal(selectedAnimalKey, selectedAnimal);
        }
    }, 200);
}

function revealAnimal(animalKey, animal) {
    const silhouette = document.getElementById('animalSilhouette');
    const animalName = document.getElementById('animalName');
    
    // Reveal the animal
    silhouette.classList.add('reveal');
    animalName.style.opacity = '1';
    
    // Play reward sound
    soundSystem.play('reward');
    
    // Play cheers sound for the reveal
    soundSystem.play('celebration');
    
    // Add confetti effect
    createConfetti();
    
    // Add to collected animals if not already there
    if (!gameState.collectedAnimals.includes(animalKey)) {
        gameState.collectedAnimals.push(animalKey);
        localStorage.setItem('collectedAnimals', JSON.stringify(gameState.collectedAnimals));
        // Update the canvas display for when user returns to menu
        setTimeout(() => canvasAnimationSystem.refresh(), 100);
    }
    
    // Show final result screen after delay
    setTimeout(() => {
        document.querySelector('.animal-reward-container').remove();
        const animalEmojis = ["🦫", "🦦", "🐘", "🐧", "🐼", "🐨", "🐹", "🐰"];
        const allAnimalKeys = Object.keys(animals);
        const selectedIndex = allAnimalKeys.indexOf(animalKey);
        document.querySelector('.final-animal').textContent = animalEmojis[selectedIndex % animalEmojis.length];
    }, 3000);
}

function createConfetti() {
    const confettiCount = 100;
    const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FDCB6E', '#6C5CE7'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '0px'; // Start from the very top
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.querySelector('.reward-overlay').appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Initialize and manage menu animals
function initMenuAnimals() {
    // Create container for animated animals on menu screen (background)
    const animalsContainer = document.createElement('div');
    animalsContainer.className = 'menu-animals-container';
    animalsContainer.id = 'menuAnimalsContainer';
    menuScreen.appendChild(animalsContainer);
    
    updateMenuAnimals();
    updateCollectedAnimalsDisplay();
}

function updateMenuAnimals() {
    const container = document.getElementById('menuAnimalsContainer');
    if (!container) return;
    
    // Clear existing animals
    container.innerHTML = '';
    
    // Add some background animated animals (fewer than before)
    const backgroundAnimals = gameState.collectedAnimals.slice(0, 3); // Show max 3 in background
    backgroundAnimals.forEach((animalKey, index) => {
        const animal = animals[animalKey];
        if (!animal) return;
        
        const animalElement = document.createElement('div');
        animalElement.className = 'menu-animal';
        const animalEmojis = ["🦫", "🦦", "🐘", "🐧", "🐼", "🐨", "🐹", "🐰"];
        const allAnimalKeys = Object.keys(animals);
        const animalIndex = allAnimalKeys.indexOf(animalKey);
        const emoji = animalEmojis[animalIndex % animalEmojis.length];
        
        animalElement.innerHTML = `
            <span class="menu-animal-emoji">${emoji}</span>
            <span class="menu-animal-name">${animal.name}</span>
        `;
        
        // Random initial position
        animalElement.style.left = Math.random() * 90 + '%';
        animalElement.style.top = Math.random() * 80 + '%';
        
        // Apply random animation
        const animations = ['walk', 'jump', 'wiggle'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        animalElement.classList.add(`animal-${randomAnimation}`);
        
        // Random animation delay
        animalElement.style.animationDelay = Math.random() * 5 + 's';
        
        // Add movement across screen for walking animals
        if (randomAnimation === 'walk') {
            animateWalkingAnimal(animalElement);
        }
        
        container.appendChild(animalElement);
    });
}

// Updated function to work with canvas system - now just refreshes the canvas
function updateCollectedAnimalsDisplay() {
    // Canvas system handles the display now
    if (canvasAnimationSystem && canvasAnimationSystem.refresh) {
        canvasAnimationSystem.refresh();
    }
}

// Show animal information when clicked
function showAnimalInfo(animalKey, animal) {
    soundSystem.play('click');
    
    // Create a temporary info popup
    const popup = document.createElement('div');
    popup.className = 'animal-info-popup';
    popup.innerHTML = `
        <div class="animal-info-content">
            <div class="animal-info-emoji">${animal.emoji}</div>
            <h3>${animal.name}</h3>
            <p>Hewan yang lucu dan menggemaskan!</p>
            <p style="color: ${animal.color};">Warna favorit: ${animal.color}</p>
            <button class="close-popup-btn">Tutup</button>
        </div>
    `;
    
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = popup.querySelector('.animal-info-content');
    content.style.cssText = `
        background: linear-gradient(145deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 30px;
        text-align: center;
        color: white;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        transform: scale(0.8);
        animation: popIn 0.3s ease forwards;
    `;
    
    const closeBtn = popup.querySelector('.close-popup-btn');
    closeBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 10px 20px;
        border-radius: 15px;
        cursor: pointer;
        margin-top: 15px;
        font-weight: 600;
        transition: all 0.3s ease;
    `;
    
    closeBtn.addEventListener('click', () => {
        soundSystem.play('click');
        popup.remove();
    });
    
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
        }
    });
    
    document.body.appendChild(popup);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes popIn {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animal-info-emoji {
            font-size: 4rem;
            margin-bottom: 15px;
            animation: bounce 2s infinite;
        }
        .close-popup-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
    
    // Remove style after popup is closed
    setTimeout(() => {
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 10000);
}

function animateWalkingAnimal(element) {
    let position = parseFloat(element.style.left);
    let direction = Math.random() > 0.5 ? 1 : -1;
    let speed = 0.5 + Math.random() * 1;
    
    const moveInterval = setInterval(() => {
        position += direction * speed;
        
        // Reverse direction at boundaries
        if (position <= 0 || position >= 90) {
            direction *= -1;
            // Flip the animal horizontally
            element.style.transform = direction > 0 ? 'scaleX(1)' : 'scaleX(-1)';
        }
        
        element.style.left = position + '%';
        
        // Stop animation if element is removed
        if (!document.body.contains(element)) {
            clearInterval(moveInterval);
        }
    }, 50);
}

// Dukungan sentuh untuk perangkat mobile
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, { passive: true });
}

