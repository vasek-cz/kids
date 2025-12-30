class MathGame {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.currentQuestion = null;
        this.currentMode = 'multiplication';
        this.roundingType = 10;
        this.progress = this.loadProgress();
        this.roundingProgress = this.loadRoundingProgress();
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateNewQuestion();
        this.updateProgressDisplay();
    }

    initializeElements() {
        // Common elements
        this.gameTitle = document.getElementById('game-title');
        this.scoreElement = document.getElementById('score');
        this.streakElement = document.getElementById('streak');
        this.progressTitle = document.getElementById('progress-title');
        
        // Mode buttons
        this.multiplicationModeBtn = document.getElementById('multiplication-mode');
        this.roundingModeBtn = document.getElementById('rounding-mode');
        
        // Multiplication elements
        this.multiplicationGame = document.getElementById('multiplication-game');
        this.num1Element = document.getElementById('num1');
        this.num2Element = document.getElementById('num2');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.feedbackElement = document.getElementById('feedback');
        this.newQuestionBtn = document.getElementById('new-question-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.progressGrid = document.getElementById('progress-grid');
        
        // Rounding elements
        this.roundingGame = document.getElementById('rounding-game');
        this.roundingTypeSelect = document.getElementById('rounding-type');
        this.roundNumberElement = document.getElementById('round-number');
        this.roundToElement = document.getElementById('round-to');
        this.roundingAnswerInput = document.getElementById('rounding-answer-input');
        this.roundingSubmitBtn = document.getElementById('rounding-submit-btn');
        this.roundingFeedbackElement = document.getElementById('rounding-feedback');
        this.roundingNewQuestionBtn = document.getElementById('rounding-new-question-btn');
        this.roundingResetBtn = document.getElementById('rounding-reset-btn');
        this.roundingProgress = document.getElementById('rounding-progress');
        this.tensAccuracy = document.getElementById('tens-accuracy');
        this.hundredsAccuracy = document.getElementById('hundreds-accuracy');
        this.thousandsAccuracy = document.getElementById('thousands-accuracy');
    }

    setupEventListeners() {
        // Mode switching
        this.multiplicationModeBtn.addEventListener('click', () => this.switchMode('multiplication'));
        this.roundingModeBtn.addEventListener('click', () => this.switchMode('rounding'));
        
        // Multiplication mode
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.newQuestionBtn.addEventListener('click', () => this.generateNewQuestion());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });

        this.answerInput.addEventListener('input', () => {
            this.feedbackElement.textContent = '';
            this.feedbackElement.className = 'feedback';
        });
        
        // Rounding mode
        this.roundingTypeSelect.addEventListener('change', (e) => {
            this.roundingType = parseInt(e.target.value);
            this.generateNewQuestion();
        });
        
        this.roundingSubmitBtn.addEventListener('click', () => this.checkRoundingAnswer());
        this.roundingNewQuestionBtn.addEventListener('click', () => this.generateNewQuestion());
        this.roundingResetBtn.addEventListener('click', () => this.resetGame());
        
        this.roundingAnswerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkRoundingAnswer();
            }
        });

        this.roundingAnswerInput.addEventListener('input', () => {
            this.roundingFeedbackElement.textContent = '';
            this.roundingFeedbackElement.className = 'feedback';
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        this.multiplicationModeBtn.classList.toggle('active', mode === 'multiplication');
        this.roundingModeBtn.classList.toggle('active', mode === 'rounding');
        
        // Show/hide game modes
        this.multiplicationGame.style.display = mode === 'multiplication' ? 'block' : 'none';
        this.roundingGame.style.display = mode === 'rounding' ? 'block' : 'none';
        
        // Update title and progress display
        if (mode === 'multiplication') {
            this.gameTitle.textContent = '🎯 Multiplication Fun!';
            this.progressTitle.textContent = 'Your Progress';
            this.progressGrid.style.display = 'grid';
            this.roundingProgress.style.display = 'none';
        } else {
            this.gameTitle.textContent = '🔢 Rounding Fun!';
            this.progressTitle.textContent = 'Rounding Progress';
            this.progressGrid.style.display = 'none';
            this.roundingProgress.style.display = 'block';
        }
        
        this.generateNewQuestion();
        this.updateProgressDisplay();
    }

    generateNewQuestion() {
        if (this.currentMode === 'multiplication') {
            this.generateMultiplicationQuestion();
        } else {
            this.generateRoundingQuestion();
        }
    }

    generateMultiplicationQuestion() {
        const num1 = Math.floor(Math.random() * 9) + 1;
        const num2 = Math.floor(Math.random() * 9) + 1;
        
        this.currentQuestion = {
            num1: num1,
            num2: num2,
            answer: num1 * num2
        };

        this.num1Element.textContent = num1;
        this.num2Element.textContent = num2;
        this.answerInput.value = '';
        this.answerInput.focus();
        
        this.feedbackElement.textContent = '';
        this.feedbackElement.className = 'feedback';
    }

    generateRoundingQuestion() {
        let number;
        
        // Generate appropriate numbers based on rounding type
        switch (this.roundingType) {
            case 10:
                number = Math.floor(Math.random() * 990) + 10; // 10-999
                break;
            case 100:
                number = Math.floor(Math.random() * 9900) + 100; // 100-9999
                break;
            case 1000:
                number = Math.floor(Math.random() * 99000) + 1000; // 1000-99999
                break;
        }
        
        this.currentQuestion = {
            number: number,
            roundTo: this.roundingType,
            answer: this.roundNumber(number, this.roundingType)
        };

        this.roundNumberElement.textContent = number.toLocaleString();
        this.roundToElement.textContent = this.roundingType === 10 ? '10' : 
                                         this.roundingType === 100 ? '100' : '1000';
        this.roundingAnswerInput.value = '';
        this.roundingAnswerInput.focus();
        
        this.roundingFeedbackElement.textContent = '';
        this.roundingFeedbackElement.className = 'feedback';
    }

    roundNumber(num, roundTo) {
        return Math.round(num / roundTo) * roundTo;
    }

    checkAnswer() {
        const userAnswer = parseInt(this.answerInput.value);
        
        if (isNaN(userAnswer)) {
            this.showFeedback('Please enter a number! 🤔', 'incorrect');
            return;
        }

        const isCorrect = userAnswer === this.currentQuestion.answer;
        const questionKey = `${this.currentQuestion.num1}x${this.currentQuestion.num2}`;

        if (isCorrect) {
            this.score += 10;
            this.streak += 1;
            this.updateProgress(questionKey, true);
            
            const encouragements = [
                'Awesome! 🎉', 'Great job! ⭐', 'Perfect! 🌟', 
                'You rock! 🚀', 'Fantastic! 🎊', 'Well done! 👏'
            ];
            const message = encouragements[Math.floor(Math.random() * encouragements.length)];
            this.showFeedback(message, 'correct');
            
            setTimeout(() => this.generateNewQuestion(), 1500);
        } else {
            this.streak = 0;
            this.updateProgress(questionKey, false);
            this.showFeedback(`Not quite! The answer is ${this.currentQuestion.answer} 💪`, 'incorrect');
        }

        this.updateDisplay();
        this.saveProgress();
    }

    checkRoundingAnswer() {
        const userAnswer = parseInt(this.roundingAnswerInput.value);
        
        if (isNaN(userAnswer)) {
            this.showRoundingFeedback('Please enter a number! 🤔', 'incorrect');
            return;
        }

        const isCorrect = userAnswer === this.currentQuestion.answer;
        const roundingKey = this.roundingType.toString();

        if (isCorrect) {
            this.score += 10;
            this.streak += 1;
            this.updateRoundingProgress(roundingKey, true);
            
            const encouragements = [
                'Perfect rounding! 🎯', 'Great job! ⭐', 'Excellent! 🌟', 
                'You nailed it! 🚀', 'Fantastic! 🎊', 'Well done! 👏'
            ];
            const message = encouragements[Math.floor(Math.random() * encouragements.length)];
            this.showRoundingFeedback(message, 'correct');
            
            setTimeout(() => this.generateNewQuestion(), 1500);
        } else {
            this.streak = 0;
            this.updateRoundingProgress(roundingKey, false);
            this.showRoundingFeedback(`Not quite! ${this.currentQuestion.number.toLocaleString()} rounds to ${this.currentQuestion.answer.toLocaleString()} 💪`, 'incorrect');
        }

        this.updateDisplay();
        this.saveProgress();
    }

    updateProgress(questionKey, isCorrect) {
        if (!this.progress[questionKey]) {
            this.progress[questionKey] = { attempts: 0, correct: 0 };
        }
        
        this.progress[questionKey].attempts += 1;
        if (isCorrect) {
            this.progress[questionKey].correct += 1;
        }
        
        this.updateProgressGrid();
    }

    updateRoundingProgress(roundingKey, isCorrect) {
        if (!this.roundingProgress[roundingKey]) {
            this.roundingProgress[roundingKey] = { attempts: 0, correct: 0 };
        }
        
        this.roundingProgress[roundingKey].attempts += 1;
        if (isCorrect) {
            this.roundingProgress[roundingKey].correct += 1;
        }
        
        this.updateRoundingStats();
    }

    updateProgressDisplay() {
        if (this.currentMode === 'multiplication') {
            this.updateProgressGrid();
        } else {
            this.updateRoundingStats();
        }
    }

    updateProgressGrid() {
        this.progressGrid.innerHTML = '';
        
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                const questionKey = `${i}x${j}`;
                const progressItem = document.createElement('div');
                progressItem.className = 'progress-item';
                progressItem.textContent = questionKey;
                
                const stats = this.progress[questionKey];
                if (stats) {
                    const accuracy = stats.correct / stats.attempts;
                    if (stats.correct >= 3 && accuracy >= 0.8) {
                        progressItem.classList.add('mastered');
                    } else if (stats.attempts > 0) {
                        progressItem.classList.add('practiced');
                    }
                }
                
                this.progressGrid.appendChild(progressItem);
            }
        }
    }

    updateRoundingStats() {
        const stats = {
            '10': this.roundingProgress['10'] || { attempts: 0, correct: 0 },
            '100': this.roundingProgress['100'] || { attempts: 0, correct: 0 },
            '1000': this.roundingProgress['1000'] || { attempts: 0, correct: 0 }
        };

        this.tensAccuracy.textContent = stats['10'].attempts > 0 ? 
            Math.round((stats['10'].correct / stats['10'].attempts) * 100) + '%' : '0%';
        this.hundredsAccuracy.textContent = stats['100'].attempts > 0 ? 
            Math.round((stats['100'].correct / stats['100'].attempts) * 100) + '%' : '0%';
        this.thousandsAccuracy.textContent = stats['1000'].attempts > 0 ? 
            Math.round((stats['1000'].correct / stats['1000'].attempts) * 100) + '%' : '0%';
    }

    showFeedback(message, type) {
        this.feedbackElement.textContent = message;
        this.feedbackElement.className = `feedback ${type}`;
    }

    showRoundingFeedback(message, type) {
        this.roundingFeedbackElement.textContent = message;
        this.roundingFeedbackElement.className = `feedback ${type}`;
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.streakElement.textContent = this.streak;
    }

    resetGame() {
        if (confirm('Are you sure you want to reset your progress? This will clear your score and learning progress.')) {
            this.score = 0;
            this.streak = 0;
            this.progress = {};
            this.roundingProgress = {};
            this.updateDisplay();
            this.updateProgressDisplay();
            this.saveProgress();
            this.generateNewQuestion();
            
            const message = 'Fresh start! Let\'s learn! 🌱';
            if (this.currentMode === 'multiplication') {
                this.showFeedback(message, 'correct');
            } else {
                this.showRoundingFeedback(message, 'correct');
            }
        }
    }

    loadProgress() {
        const saved = localStorage.getItem('multiplicationProgress');
        return saved ? JSON.parse(saved) : {};
    }

    loadRoundingProgress() {
        const saved = localStorage.getItem('roundingProgress');
        return saved ? JSON.parse(saved) : {};
    }

    saveProgress() {
        localStorage.setItem('multiplicationProgress', JSON.stringify(this.progress));
        localStorage.setItem('roundingProgress', JSON.stringify(this.roundingProgress));
        localStorage.setItem('multiplicationScore', this.score.toString());
        localStorage.setItem('multiplicationStreak', this.streak.toString());
    }

    loadScore() {
        const savedScore = localStorage.getItem('multiplicationScore');
        const savedStreak = localStorage.getItem('multiplicationStreak');
        
        if (savedScore) this.score = parseInt(savedScore);
        if (savedStreak) this.streak = parseInt(savedStreak);
        
        this.updateDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new MathGame();
    game.loadScore();
});