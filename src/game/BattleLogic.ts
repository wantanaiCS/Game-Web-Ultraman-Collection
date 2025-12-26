
import { gameState, GamePhase } from './GameState';

export class BattleLogic {
    
    constructor() {}
    
    // Process an answer
    // Returns true if the answer was correct, false otherwise
    submitAnswer(_questionId: number, _answerIndex: number): boolean {
        // Mock implementation for now, should call QuizManager
        return false; 
    }
    
    // Better approach: Scene handles "User clicked Answer X".
    // Scene checks QuizManager.checkAnswer(q, x).
    // If correct -> BattleLogic.onCorrectAnswer()
    // If wrong -> BattleLogic.onWrongAnswer()
    
    onCorrectAnswer() {
        if (gameState.phase === GamePhase.FINISHER_READY) {
            // Finisher executed successfully!
            gameState.phase = GamePhase.FINISHER_EXECUTE;
            gameState.isFinisherAvailable = false;
            // logic to kill enemy happens after animation usually, but we can set it here
            gameState.enemyHP = 0;
            return;
        }

        gameState.combo++;
        
        // Check if combo is enough to attack
        if (gameState.combo >= gameState.requiredCombo) {
            // Trigger Player Attack
            gameState.phase = GamePhase.PLAYER_ATTACK;
            // Reset combo after attack?? Or keep it?
            // "Combo to Charge" usually means you fill a bar. Let's say 2 answers fill the bar.
            // Then you attack.
            gameState.combo = 0; // Consumption of charge
        } else {
            // Just charged up a bit
            // Maybe play a sound or show visual cue
        }
    }
    
    onWrongAnswer() {
        gameState.combo = 0; // Reset combo/charge
        // Enemy might attack immediately?
        // Or we just lose turn?
        gameState.phase = GamePhase.ENEMY_ATTACK;
    }
    
    resolvePlayerAttack() {
        // Calculate Damage
        const damage = 20; // Fixed for now
        gameState.takeDamage('enemy', damage);
        
        if (gameState.isEnemyLowHealth()) {
            gameState.phase = GamePhase.FINISHER_READY;
            gameState.isFinisherAvailable = true;
        } else if (gameState.enemyHP <= 0) {
            gameState.phase = GamePhase.WIN;
        } else {
            // Back to Question? Or Enemy turn?
            // Let's say after Player Attack, it goes back to Question (Player advantage)
            // UNLESS we want turn-based. 
            // The prompt says "Answer correctly continuously to charge".
            // So if you keep answering right, the enemy might not get to attack?
            // Or maybe Enemy attacks on timer?
            // Let's stick to: Correct -> Charge -> Attack. Wrong -> Enemy Attack.
            gameState.phase = GamePhase.QUESTION; 
        }
    }
    
    resolveEnemyAttack() {
        const damage = 10;
        gameState.takeDamage('player', damage);
        
        if (gameState.playerHP <= 0) {
            gameState.phase = GamePhase.LOSE;
        } else {
            gameState.phase = GamePhase.QUESTION;
        }
    }
}

export const battleLogic = new BattleLogic();
