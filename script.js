// Vocabulary data with all provided Mandarin words
const vocabulary = [
    { chinese: "规则", pinyin: "guī zé", indonesian: "aturan" },
    { chinese: "交通", pinyin: "jiāo tōng", indonesian: "lalu lintas" },
    { chinese: "车祸", pinyin: "chē huò", indonesian: "kecelakaan mobil" },
    { chinese: "救", pinyin: "jiù", indonesian: "menyelamatkan" },
    { chinese: "指挥", pinyin: "zhǐ huī", indonesian: "memerintah, mengarahkan" },
    { chinese: "另", pinyin: "lìng", indonesian: "lain" },
    { chinese: "巨大", pinyin: "jù dà", indonesian: "sangat besar, raksasa" },
    { chinese: "照顾", pinyin: "zhào gù", indonesian: "merawat" },
    { chinese: "到达", pinyin: "dào dá", indonesian: "tiba" },
    { chinese: "司机", pinyin: "sī jī", indonesian: "sopir" },
    { chinese: "顺利", pinyin: "shùn lì", indonesian: "dengan lancar" },
    { chinese: "被困", pinyin: "bèi kùn", indonesian: "terperangkap" },
    { chinese: "采访", pinyin: "cǎi fǎng", indonesian: "wawancara" },
    { chinese: "流血", pinyin: "liú xiě", indonesian: "berdarah" },
    { chinese: "标题", pinyin: "biāo tí", indonesian: "judul" },
    { chinese: "遵守", pinyin: "zūn shǒu", indonesian: "mematuhi, menaati" },
    { chinese: "见义勇为", pinyin: "jiàn yì yǒng wéi", indonesian: "bertindak berani untuk tujuan yang benar" },
    { chinese: "获得", pinyin: "huò dé", indonesian: "mendapatkan, memperoleh" },
    { chinese: "表扬", pinyin: "biǎo yáng", indonesian: "memuji" },
    { chinese: "包扎", pinyin: "bāo zā", indonesian: "membalut" },
    { chinese: "受伤", pinyin: "shòu shāng", indonesian: "terluka" }
];

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
    totalQuestions: 0
};

// Global collected characters array
if (!window.collectedCharacters) {
    window.collectedCharacters = JSON.parse(localStorage.getItem('collectedCharacters') || '[]');
}

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
window.soundSystem = {
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
        
        // Suara reward - magical chime untuk mendapat hewan (enhanced)
        this.sounds.reward = this.createMagicalRewardSound();
        
        // Suara slot machine - spinning sound untuk countdown reward (enhanced)
        this.sounds.slot = this.createSlotMachineSound();
        
        // Suara slot speed - dynamic sound yang berubah dengan kecepatan
        this.sounds.slotSpeed = this.createSlotSpeedSound();
        
        // Suara reveal - special effect saat karakter terungkap
        this.sounds.reveal = this.createRevealSound();
        
        // Suara collect - enhanced feedback untuk tombol collect
        this.sounds.collect = this.createCollectSound();
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
    
    createMagicalRewardSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            const now = this.audioContext.currentTime;
            
            // Main magical chime sequence
            const mainFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 1760.00];
            const mainDurations = [0.3, 0.25, 0.25, 0.3, 0.3, 0.4, 0.5];
            
            mainFreqs.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, now + index * 0.15);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, now + index * 0.15);
                gainNode.gain.linearRampToValueAtTime(0.4, now + index * 0.15 + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.15 + mainDurations[index]);
                
                oscillator.start(now + index * 0.15);
                oscillator.stop(now + index * 0.15 + mainDurations[index]);
            });
            
            // Add sparkle effect with higher frequencies
            setTimeout(() => {
                const sparkleFreqs = [2000, 2500, 3000, 3500, 4000];
                sparkleFreqs.forEach((freq, index) => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.type = 'triangle';
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.2);
                });
            }, 500);
        };
    },
    
    createSlotMachineSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            const now = this.audioContext.currentTime;
            
            // Create mechanical spinning sound with multiple layers
            const baseFreqs = [150, 200, 250, 300, 350, 400, 450, 500];
            const durations = [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.1];
            
            baseFreqs.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();
                
                oscillator.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, now + index * 0.08);
                oscillator.type = 'sawtooth';
                
                // Add filter for mechanical sound
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, now + index * 0.08);
                
                gainNode.gain.setValueAtTime(0, now + index * 0.08);
                gainNode.gain.linearRampToValueAtTime(0.2, now + index * 0.08 + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + durations[index]);
                
                oscillator.start(now + index * 0.08);
                oscillator.stop(now + index * 0.08 + durations[index]);
            });
            
            // Add mechanical click sounds
            setTimeout(() => {
                for (let i = 0; i < 3; i++) {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(800 + i * 100, this.audioContext.currentTime);
                    oscillator.type = 'square';
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.05);
                }
            }, 200);
        };
    },
    
    createSlotSpeedSound() {
        return (speed = 1) => {
            if (!this.enabled || !this.audioContext) return;
            
            const now = this.audioContext.currentTime;
            const baseFreq = 200 + (speed * 100); // Higher speed = higher frequency
            const volume = 0.1 + (speed * 0.1); // Higher speed = louder
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(baseFreq, now);
            oscillator.type = 'sawtooth';
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600 + (speed * 200), now);
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            
            oscillator.start(now);
            oscillator.stop(now + 0.1);
        };
    },
    
    createRevealSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            const now = this.audioContext.currentTime;
            
            // Magical reveal sound with ascending frequencies
            const revealFreqs = [392.00, 523.25, 659.25, 783.99, 1046.50];
            const durations = [0.2, 0.2, 0.2, 0.3, 0.4];
            
            revealFreqs.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, now + index * 0.1);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, now + index * 0.1);
                gainNode.gain.linearRampToValueAtTime(0.3, now + index * 0.1 + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + durations[index]);
                
                oscillator.start(now + index * 0.1);
                oscillator.stop(now + index * 0.1 + durations[index]);
            });
            
            // Add magical sparkle
            setTimeout(() => {
                const sparkleFreqs = [1500, 2000, 2500, 3000];
                sparkleFreqs.forEach((freq, index) => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.type = 'triangle';
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.15);
                });
            }, 300);
        };
    },
    
    createCollectSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            const now = this.audioContext.currentTime;
            
            // Satisfying collect sound with multiple layers
            const collectFreqs = [523.25, 659.25, 783.99, 1046.50];
            const durations = [0.15, 0.15, 0.2, 0.25];
            
            collectFreqs.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, now + index * 0.05);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, now + index * 0.05);
                gainNode.gain.linearRampToValueAtTime(0.4, now + index * 0.05 + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.05 + durations[index]);
                
                oscillator.start(now + index * 0.05);
                oscillator.stop(now + index * 0.05 + durations[index]);
            });
            
            // Add satisfying click
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.08);
            }, 200);
        };
    },
    
    play(soundName, parameter = null) {
        if (this.sounds[soundName]) {
            if (parameter !== null) {
                this.sounds[soundName](parameter);
            } else {
                this.sounds[soundName]();
            }
        }
    },
    
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
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
    window.window.soundSystem.init();
    ttsSystem.initTTS();
    initializeEventListeners();
    showRandomEmoji();
    
    // Initialize character animations on canvas
    if (typeof initCharacterAnimation === 'function') {
        initCharacterAnimation();
    }
});

function initializeEventListeners() {
    // Game mode buttons
    document.querySelectorAll('.game-mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            window.window.soundSystem.play('click');
            const mode = this.getAttribute('data-mode');
            startGame(mode);
        });
    });

    // Navigation buttons
    document.getElementById('backBtn').addEventListener('click', function() {
        window.soundSystem.play('click');
        showMenu();
    });
    document.getElementById('playAgainBtn').addEventListener('click', function() {
        window.soundSystem.play('click');
        startGame(gameState.currentMode);
    });
    document.getElementById('menuBtn').addEventListener('click', function() {
        window.soundSystem.play('click');
        showMenu();
    });
    
    // Tombol toggle suara
    soundToggle.addEventListener('click', function() {
        const isEnabled = window.soundSystem.toggle();
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
    showRandomEmoji();
    
    // Restart character animation when returning to menu
    if (typeof initCharacterAnimation === 'function') {
        setTimeout(() => {
            initCharacterAnimation();
        }, 100);
    }
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

function showRandomEmoji() {
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
    const indonesianWords = [...gameState.gameWords];
    
    // Acak array
    shuffleArray(chineseWords);
    shuffleArray(indonesianWords);
    
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
            <div class="word-column" id="indonesianColumn">
                <h3>Arti dalam Bahasa Indonesia</h3>
                ${indonesianWords.map((word, index) => 
                    `<div class="word-card" data-type="indonesian" data-word="${word.indonesian}" data-index="${index}">
                        ${word.indonesian}
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
    const indonesianWord = gameState.selectedWords[1];
    
    // Find the matching word object
    const matchingWord = vocabulary.find(word => 
        word.chinese === chineseWord && word.indonesian === indonesianWord
    );
    
    const selectedCards = document.querySelectorAll('.word-card.selected');
    
    if (matchingWord) {
        // Correct match
        window.soundSystem.play('match');
        selectedCards.forEach(card => {
            card.classList.add('correct');
            card.classList.remove('selected');
            card.style.pointerEvents = 'none';
        });
        
        gameState.score += 10;
        gameState.correctAnswers++;
        showEncouragement();
        showRandomEmoji();
    } else {
        // Incorrect match
        window.soundSystem.play('incorrect');
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
                window.soundSystem.play('levelUp');
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
                    `<button class="quiz-option" data-answer="${option.indonesian}" data-correct="${option.indonesian === currentWord.indonesian}">
                        ${option.indonesian}
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
        window.soundSystem.play('correct');
        gameState.score += 10;
        gameState.correctAnswers++;
        showEncouragement();
        showRandomEmoji();
    } else {
        window.soundSystem.play('incorrect');
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
        cards.push({ type: 'indonesian', content: word.indonesian, word: word });
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
    window.soundSystem.play('flip');
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
        window.soundSystem.play('match');
        card1.classList.add('matched');
        card2.classList.add('matched');
        gameState.score += 15;
        gameState.matchedPairs++;
        showEncouragement();
        showRandomEmoji();
        
        if (gameState.matchedPairs === gameState.totalQuestions) {
            setTimeout(endGame, 1500);
        }
    } else {
        // No match
        window.soundSystem.play('incorrect');
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
                <div style="font-size: 1.2rem; opacity: 0.7;">${currentWord.indonesian}</div>
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
            window.soundSystem.play('typing');
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
        window.soundSystem.play('correct');
        gameState.score += 15;
        gameState.correctAnswers++;
        input.style.background = 'linear-gradient(145deg, #a8edea 0%, #fed6e3 100%)';
        showEncouragement();
        showRandomEmoji();
    } else {
        window.soundSystem.play('incorrect');
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
        window.soundSystem.play('celebration'); // Cheers and applause for high score
    } else if (gameState.score >= 50) {
        window.soundSystem.play('confetti'); // Confetti and cheers for medium score
    } else {
        window.soundSystem.play('failure'); // Failure sound for low score
    }
    
    gameScreen.style.display = 'none';
    resultsScreen.style.display = 'block';
    
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('wordsLearned').textContent = gameState.correctAnswers;
    
    // Show reward if score > 50 and reward system is available
    if (gameState.score > 50 && window.rewardSystem) {
        setTimeout(() => {
            window.rewardSystem.showReward(gameState.score);
        }, 1000); // Show reward after 1 second delay
    }
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
    const overlay = document.querySelector('.reward-overlay');
    if (!overlay) return;
    overlay.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Show animal information when clicked
function showAnimalInfo(animalKey, animal) {
    window.soundSystem.play('click');
    
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
        window.soundSystem.play('click');
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

