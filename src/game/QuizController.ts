
import { gameState, GamePhase } from './GameState';
import { quizManager } from './QuizManager';
import { battleLogic } from './BattleLogic';

export class QuizController {
    private questionText: HTMLElement;
    private choicesContainer: HTMLElement;
    private uiLayer: HTMLElement;
    private messageOverlay: HTMLElement;
    private messageText: HTMLElement;

    private currentQuestionId: number | null = null;
    private isWaiting: boolean = false;

    constructor() {
        this.questionText = document.getElementById('question-text')!;
        this.choicesContainer = document.getElementById('choices-container')!;
        this.uiLayer = document.getElementById('ui-layer')!;
        this.messageOverlay = document.getElementById('message-overlay')!;
        this.messageText = document.getElementById('message-text')!;

        this.startLoop();
    }

    startLoop() {
        const loop = () => {
            this.update();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update() {
        // Visibility Check
        // Show UI only if in relevant phases AND Character is selected (Battle Started)
        if (!gameState.selectedCharacter) {
            this.uiLayer.classList.add('hidden');
            return;
        } else {
            this.uiLayer.classList.remove('hidden');
        }

        // Phase Check
        if (gameState.phase === GamePhase.QUESTION) {
            this.showQuestionUI();
            this.messageOverlay.classList.add('hidden');
        } else if (gameState.phase === GamePhase.FINISHER_READY) {
             this.showFinisherUI();
        } else if (gameState.phase === GamePhase.WIN) {
             this.uiLayer.classList.add('hidden');
             // Maybe show specific Win UI
        } else {
            // Attack phases, etc.
            // Hide choices, show status?
            // For now, keep question visible but disabled? Or just hide?
            // Let's hide the choices to prevent double clicking
            this.choicesContainer.innerHTML = '';
            this.questionText.innerText = 'Battle in progress...';
            
            this.messageOverlay.classList.add('hidden');
        }
    }

    showQuestionUI() {
        if (this.isWaiting) return; // Already showing a question
        
        const question = quizManager.getRandomQuestion();
        this.currentQuestionId = question.id;
        
        this.renderQuestion(question);
        this.isWaiting = true; 
    }
    
    showFinisherUI() {
        if (this.isWaiting && this.currentQuestionId === 99) return; // Already showing finisher
        
        this.messageOverlay.classList.remove('hidden');
        this.messageText.innerText = "FINISH HIM! Answer Correctly!";
        
        const question = quizManager.getFinisherQuestion();
        this.currentQuestionId = question.id;
        
        this.renderQuestion(question);
        this.isWaiting = true;
    }

    renderQuestion(question: any) {
        this.questionText.innerText = question.text;
        this.choicesContainer.innerHTML = '';

        question.choices.forEach((choice: string, index: number) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = choice;
            btn.onclick = () => this.handleAnswer(question, index);
            this.choicesContainer.appendChild(btn);
        });
    }

    handleAnswer(question: any, index: number) {
        const isCorrect = quizManager.checkAnswer(question, index);
        
        if (isCorrect) {
            battleLogic.onCorrectAnswer();
            // Flash Green?
        } else {
            battleLogic.onWrongAnswer();
            // Flash Red?
        }
        
        // Reset wait state so loop picks up next state change
        // But logic changes state immediately, so loop will see new phase
        this.isWaiting = false; 
    }
}
