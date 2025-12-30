class MultiplicationGame {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.currentQuestion = null;
        this.progress = this.loadProgress();
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateNewQuestion();
        this.updateProgressGrid();
    }

    initializeElements() {
        this.num1Element = document.getElementById('num1');
        this.num2Element = document.getElementById('num2');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.feedbackElement = document.getElementById('feedback');
        this.scoreElement = document.getElementById('score');
        this.streakElement = document.getElementById('streak');
        this.newQuestionBtn = document.getElementById('new-question-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.progressGrid = document.getElementById('progress-grid');
    }

    setupEventListeners() {
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
    }

    generateNewQuestion() {
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

    showFeedback(message, type) {
        this.feedbackElement.textContent = message;
        this.feedbackElement.className = `feedback ${type}`;
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
            this.updateDisplay();
            this.updateProgressGrid();
            this.saveProgress();
            this.generateNewQuestion();
            this.showFeedback('Fresh start! Let\'s learn! 🌱', 'correct');
        }
    }

    loadProgress() {
        const saved = localStorage.getItem('multiplicationProgress');
        return saved ? JSON.parse(saved) : {};
    }

    saveProgress() {
        localStorage.setItem('multiplicationProgress', JSON.stringify(this.progress));
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
    const game = new MultiplicationGame();
    game.loadScore();
});