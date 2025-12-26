
export const GamePhase = {
    IDLE: 0,
    QUESTION: 1,
    PLAYER_ATTACK: 2,
    ENEMY_ATTACK: 3,
    FINISHER_READY: 4, // Enemy HP is low, waiting for finisher question
    FINISHER_EXECUTE: 5, // Performing the finisher
    WIN: 6,
    LOSE: 7
} as const;

export type GamePhase = typeof GamePhase[keyof typeof GamePhase];

export interface Character {
    id: string;
    name: string;
    image: string; // Key for the sprite/image
    color: string;
}

export class GameState {
    public playerHP: number = 100;
    public maxPlayerHP: number = 100;
    public enemyHP: number = 100;
    public maxEnemyHP: number = 100;
    public combo: number = 0; // Current correct answer streak
    public requiredCombo: number = 2; // Questions needed to attack
    public phase: GamePhase = GamePhase.IDLE;
    
    // Selected character
    public selectedCharacter: Character | null = null;
    
    // Finisher
    public isFinisherAvailable: boolean = false;
    
    constructor() {
        this.reset();
    }
    
    reset() {
        this.playerHP = 100;
        this.enemyHP = 100;
        this.combo = 0;
        this.phase = GamePhase.IDLE;
        this.isFinisherAvailable = false;
    }
    
    takeDamage(target: 'player' | 'enemy', amount: number) {
        if (target === 'player') {
            this.playerHP = Math.max(0, this.playerHP - amount);
        } else {
            this.enemyHP = Math.max(0, this.enemyHP - amount);
        }
    }
    
    isEnemyLowHealth(): boolean {
        // Trigger finisher logic if Enemy HP is <= 20%
        return this.enemyHP <= 20 && this.enemyHP > 0;
    }
}

export const gameState = new GameState();
