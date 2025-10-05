// Reward System for Mandarin Learning Game
// Handles slot-style character reveal animations

class RewardSystem {
    constructor() {
        this.animalTypes = ['bunny', 'cat', 'panda', 'penguin', 'pig'];
        this.charactersPerAnimal = 15;
        this.slotDuration = 5000; // 5 seconds of animation
        this.slotSpeed = 100; // Initial speed in ms between character changes
        this.currentCharacter = null;
        this.isAnimating = false;
        this.lastShownType = null; // Track last shown animal type to prevent consecutive
        
        // Initialize collected characters from localStorage
        this.loadCollectedCharacters();
    }
    
    loadCollectedCharacters() {
        // Load from localStorage or initialize empty array
        const stored = localStorage.getItem('collectedCharacters');
        if (!window.collectedCharacters) {
            window.collectedCharacters = stored ? JSON.parse(stored) : [];
        }
    }
    
    saveCollectedCharacters() {
        // Save to localStorage
        localStorage.setItem('collectedCharacters', JSON.stringify(window.collectedCharacters));
    }
    
    getRandomCharacter(excludeType = null) {
        // Get a random character, excluding the specified type
        let availableTypes = [...this.animalTypes];
        if (excludeType) {
            availableTypes = availableTypes.filter(type => type !== excludeType);
        }
        
        const animalType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        const characterNum = Math.floor(Math.random() * this.charactersPerAnimal) + 1;
        const characterId = `${animalType}_Character${String(characterNum).padStart(2, '0')}`;
        
        return {
            id: characterId,
            type: animalType,
            number: characterNum,
            displayName: this.getCharacterDisplayName(animalType, characterNum),
            thumbnailPath: `assets/thumbnails/${animalType}/${animalType.charAt(0).toUpperCase() + animalType.slice(1)}_Character${String(characterNum).padStart(2, '0')}_thumbnail.png`
        };
    }
    
    getCharacterDisplayName(type, number) {
        const typeNames = {
            'bunny': 'Kelinci',
            'cat': 'Kucing',
            'panda': 'Panda',
            'penguin': 'Penguin',
            'pig': 'Babi'
        };
        return `${typeNames[type]} #${number}`;
    }
    
    createRewardPopup() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'reward-overlay';
        overlay.id = 'rewardOverlay';
        
        // Create popup container
        const popup = document.createElement('div');
        popup.className = 'reward-popup';
        popup.innerHTML = `
            <div class="reward-header">
                <h2>🎉 Selamat! Kamu Mendapatkan Hewan Baru! 🎉</h2>
            </div>
            <div class="slot-container">
                <div class="slot-machine">
                    <div class="slot-window">
                        <img id="slotImage" class="slot-image silhouette" src="" alt="Character">
                        <div class="slot-glow"></div>
                    </div>
                    <div class="slot-info">
                        <p id="slotStatus">Memutar...</p>
                        <div class="slot-spinner"></div>
                    </div>
                </div>
            </div>
            <div class="reward-footer" style="display: none;">
                <h3 id="characterName"></h3>
                <p>Telah ditambahkan ke koleksi kamu!</p>
                <button id="collectRewardBtn" class="collect-btn">Kumpulkan!</button>
            </div>
        `;
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        
        // Add styles
        this.addStyles();
        
        return overlay;
    }
    
    addStyles() {
        if (document.getElementById('rewardStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'rewardStyles';
        style.textContent = `
            .reward-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.5s ease;
            }
            
            .reward-popup {
                background: linear-gradient(145deg, #667eea 0%, #764ba2 100%);
                border-radius: 30px;
                padding: 40px;
                text-align: center;
                color: white;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                max-width: 500px;
                width: 90%;
                animation: popIn 0.5s ease;
            }
            
            .reward-header h2 {
                font-size: 1.8rem;
                margin-bottom: 30px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .slot-container {
                margin: 30px 0;
            }
            
            .slot-machine {
                background: linear-gradient(145deg, #1e3c72, #2a5298);
                border-radius: 20px;
                padding: 30px;
                box-shadow: inset 0 5px 15px rgba(0, 0, 0, 0.3);
                transition: transform 0.1s ease;
            }
            
            .slot-machine.spinning {
                animation: machineVibrate 0.1s infinite;
            }
            
            .slot-window {
                width: 200px;
                height: 200px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                position: relative;
                overflow: hidden;
                box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
            }
            
            .slot-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
                padding: 20px;
                transition: all 0.1s ease;
            }
            
            .slot-image.silhouette {
                filter: brightness(0) invert(0.2);
            }
            
            .slot-image.spinning {
                animation: slotSpin 0.1s infinite, slotShake 0.05s infinite;
            }
            
            .slot-image.revealed {
                filter: none;
                animation: revealBounce 0.8s ease, revealGlow 1s ease;
            }
            
            .slot-glow {
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
                opacity: 0;
                animation: glowPulse 2s ease infinite;
                pointer-events: none;
            }
            
            .slot-glow.active {
                opacity: 1;
            }
            
            .slot-info {
                margin-top: 20px;
            }
            
            .slot-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
                margin: 20px auto;
                animation: spin 1s linear infinite;
            }
            
            .slot-spinner.hidden {
                display: none;
            }
            
            .reward-footer {
                margin-top: 30px;
                animation: slideUp 0.5s ease;
            }
            
            .reward-footer h3 {
                font-size: 1.5rem;
                margin: 15px 0;
                color: #FFD700;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .collect-btn {
                background: linear-gradient(145deg, #FFD700, #FFA500);
                color: #333;
                border: none;
                padding: 15px 40px;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                margin-top: 20px;
                box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4);
                transition: all 0.3s ease;
            }
            
            .collect-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 8px 25px rgba(255, 193, 7, 0.6);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes popIn {
                from { transform: scale(0.5); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            @keyframes slotSpin {
                0% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0); }
            }
            
            @keyframes slotShake {
                0% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
                100% { transform: translateX(0); }
            }
            
            @keyframes revealBounce {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            @keyframes revealGlow {
                0% { 
                    box-shadow: 0 0 0 rgba(255, 215, 0, 0);
                    filter: brightness(1);
                }
                50% { 
                    box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
                    filter: brightness(1.3);
                }
                100% { 
                    box-shadow: 0 0 0 rgba(255, 215, 0, 0);
                    filter: brightness(1);
                }
            }
            
            @keyframes machineVibrate {
                0% { transform: translateX(0) translateY(0); }
                25% { transform: translateX(-1px) translateY(-1px); }
                75% { transform: translateX(1px) translateY(1px); }
                100% { transform: translateX(0) translateY(0); }
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes glowPulse {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                background: #FFD700;
                animation: confettiFall 3s linear forwards;
                pointer-events: none;
            }
            
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    async showReward(score) {
        // Only show reward if score > 50
        if (score <= 50) return null;
        
        if (this.isAnimating) return null;
        this.isAnimating = true;
        
        // Create popup
        const overlay = this.createRewardPopup();
        const slotImage = document.getElementById('slotImage');
        const slotStatus = document.getElementById('slotStatus');
        const slotSpinner = document.querySelector('.slot-spinner');
        const characterName = document.getElementById('characterName');
        const rewardFooter = document.querySelector('.reward-footer');
        const collectBtn = document.getElementById('collectRewardBtn');
        const slotGlow = document.querySelector('.slot-glow');
        
        // Play initial slot sound
        if (window.soundSystem && window.soundSystem.play) {
            window.soundSystem.play('slot');
        }
        
        // Start slot animation
        let animationTime = 0;
        let currentSpeed = this.slotSpeed;
        let speedIncrement = 5; // Speed will slow down gradually
        let currentCharacter = null;
        
        slotImage.classList.add('spinning');
        
        // Add spinning class to slot machine for vibration effect
        const slotMachine = document.querySelector('.slot-machine');
        if (slotMachine) {
            slotMachine.classList.add('spinning');
        }
        
        const slotInterval = setInterval(() => {
            // Get random character, avoiding consecutive same types
            currentCharacter = this.getRandomCharacter(this.lastShownType);
            this.lastShownType = currentCharacter.type;
            
            // Update image
            slotImage.src = currentCharacter.thumbnailPath;
            
            // Play speed-based sound effect
            if (window.soundSystem && window.soundSystem.play) {
                const speedMultiplier = Math.max(0.5, 1 - (animationTime / this.slotDuration));
                window.soundSystem.play('slotSpeed', speedMultiplier);
            }
            
            // Gradually slow down
            animationTime += currentSpeed;
            if (animationTime < this.slotDuration - 2000) {
                // Keep spinning fast for first 5 seconds
                currentSpeed = this.slotSpeed;
            } else {
                // Slow down in last 2 seconds
                currentSpeed += speedIncrement;
                speedIncrement += 2;
            }
            
            if (animationTime >= this.slotDuration) {
                clearInterval(slotInterval);
                this.revealCharacter(currentCharacter, slotImage, slotStatus, slotSpinner, characterName, rewardFooter, slotGlow);
            }
        }, currentSpeed);
        
        // Handle collect button
        collectBtn.addEventListener('click', () => {
            this.collectCharacter(overlay);
        });
        
        this.currentCharacter = currentCharacter;
        return currentCharacter;
    }
    
    revealCharacter(character, slotImage, slotStatus, slotSpinner, characterName, rewardFooter, slotGlow) {
        // Stop spinning and reveal
        slotImage.classList.remove('spinning', 'silhouette');
        slotImage.classList.add('revealed');
        slotGlow.classList.add('active');
        
        // Remove spinning class from slot machine
        const slotMachine = document.querySelector('.slot-machine');
        if (slotMachine) {
            slotMachine.classList.remove('spinning');
        }
        
        // Update status
        slotStatus.textContent = 'Kamu mendapatkan...';
        slotSpinner.classList.add('hidden');
        
        // Show character info
        characterName.textContent = character.displayName;
        rewardFooter.style.display = 'block';
        
        // Add to collected characters
        if (!window.collectedCharacters.some(c => c.id === character.id)) {
            window.collectedCharacters.push({
                id: character.id,
                type: character.type,
                number: character.number,
                displayName: character.displayName,
                collectedAt: new Date().toISOString()
            });
            this.saveCollectedCharacters();
        }
        
        // Play reveal sound first
        if (window.soundSystem && window.soundSystem.play) {
            window.soundSystem.play('reveal');
        }
        
        // Then play reward sound after a short delay
        setTimeout(() => {
            if (window.soundSystem && window.soundSystem.play) {
                window.soundSystem.play('reward');
            }
        }, 500);
        
        // Create confetti
        this.createConfetti();
        
        this.isAnimating = false;
    }
    
    collectCharacter(overlay) {
        // Play enhanced collect sound
        if (window.soundSystem && window.soundSystem.play) {
            window.soundSystem.play('collect');
        }
        
        // Animate out and remove
        overlay.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            overlay.remove();
            // Reload character animation if on menu to show new collected character
            if (typeof initCharacterAnimation === 'function' && document.getElementById('menuScreen').style.display !== 'none') {
                initCharacterAnimation();
            }
            // Update character picker button visibility
            if (typeof updateCharacterPickerButton === 'function') {
                updateCharacterPickerButton();
            }
        }, 500);
        
        // Add fadeOut animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        setTimeout(() => style.remove(), 1000);
    }
    
    createConfetti() {
        const confettiCount = 50;
        const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FDCB6E', '#6C5CE7'];
        const overlay = document.querySelector('.reward-overlay');
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '0px';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            overlay.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => confetti.remove(), 5000);
        }
    }
}

// Initialize global reward system
window.rewardSystem = new RewardSystem();

// Initialize global collectedCharacters if not exists
if (!window.collectedCharacters) {
    window.collectedCharacters = [];
}

// Add manual trigger for testing reward system
window.triggerReward = function(score = 80) {
    console.log('🎰 Triggering reward with score:', score);
    
    // Ensure sound system is initialized
    if (!window.soundSystem) {
        console.error('Sound system not found. Make sure script.js is loaded first.');
        return;
    }
    
    if (!window.soundSystem.audioContext) {
        console.log('Initializing sound system...');
        window.soundSystem.init();
    }
    
    if (window.rewardSystem) {
        window.rewardSystem.showReward(score);
    } else {
        console.error('Reward system not initialized');
    }
};

// Add manual trigger for testing different score levels
window.testRewardSounds = function() {
    console.log('🎵 Testing reward sounds...');
    
    // Ensure sound system is initialized
    if (!window.soundSystem) {
        console.error('Sound system not found. Make sure script.js is loaded first.');
        return;
    }
    
    if (!window.soundSystem.audioContext) {
        console.log('Initializing sound system...');
        window.soundSystem.init();
    }
    
    if (window.soundSystem.enabled && window.soundSystem.audioContext) {
        console.log('Playing slot sound...');
        window.soundSystem.play('slot');
        
        setTimeout(() => {
            console.log('Playing slot speed sound...');
            window.soundSystem.play('slotSpeed', 0.8);
        }, 1000);
        
        setTimeout(() => {
            console.log('Playing reveal sound...');
            window.soundSystem.play('reveal');
        }, 2000);
        
        setTimeout(() => {
            console.log('Playing reward sound...');
            window.soundSystem.play('reward');
        }, 3000);
        
        setTimeout(() => {
            console.log('Playing collect sound...');
            window.soundSystem.play('collect');
        }, 4000);
    } else {
        console.error('Sound system not properly initialized or disabled');
    }
};

// Add initialization check function
window.checkSystems = function() {
    console.log('🔍 Checking system status...');
    console.log('Reward System:', window.rewardSystem ? '✅ Initialized' : '❌ Not found');
    console.log('Sound System:', window.soundSystem ? '✅ Found' : '❌ Not found');
    if (window.soundSystem) {
        console.log('Audio Context:', window.soundSystem.audioContext ? '✅ Ready' : '❌ Not initialized');
        console.log('Sound System Enabled:', window.soundSystem.enabled ? '✅ Yes' : '❌ No');
    }
};

// Add console help
console.log('🎮 Reward System Console Commands:');
console.log('• triggerReward(score) - Trigger reward with specific score (default: 80)');
console.log('• testRewardSounds() - Test all reward-related sounds');
console.log('• checkSystems() - Check system initialization status');
console.log('• window.rewardSystem - Access reward system directly');
console.log('• window.soundSystem - Access sound system directly');
