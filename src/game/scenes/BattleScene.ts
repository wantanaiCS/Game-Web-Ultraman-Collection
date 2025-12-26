
import Phaser from 'phaser';
import { gameState, GamePhase } from '../GameState';
import { battleLogic } from '../BattleLogic';

export class BattleScene extends Phaser.Scene {
    private playerSprite!: Phaser.GameObjects.Rectangle; // Placeholder
    private enemySprite!: Phaser.GameObjects.Rectangle; // Placeholder
    private playerHPText!: Phaser.GameObjects.Text;
    private enemyHPText!: Phaser.GameObjects.Text;
    private comboText!: Phaser.GameObjects.Text;
    
    constructor() {
        super('BattleScene');
    }
    
    create() {
        // Validation
        if (!gameState.selectedCharacter) {
            this.scene.start('CharacterSelectionScene');
            return;
        }
        
        // Background
        this.cameras.main.setBackgroundColor('#87CEEB'); // Sky blue ish
        
        // Player
        // Use the color from selection
        const playerColor = parseInt(gameState.selectedCharacter.color.replace('#', '0x'));
        this.playerSprite = this.add.rectangle(80, 400, 60, 100, playerColor);
        this.add.text(50, 460, gameState.selectedCharacter.name, { fontSize: '16px', color: '#000' });
        
        // Enemy
        this.enemySprite = this.add.rectangle(280, 400, 80, 120, 0x000000); // Black monster
        this.add.text(260, 470, 'Monster', { fontSize: '16px', color: '#000' });
        
        // HUD
        this.playerHPText = this.add.text(20, 20, `HP: ${gameState.playerHP}`, { fontSize: '20px', color: '#000', backgroundColor: '#fff' });
        this.enemyHPText = this.add.text(240, 20, `HP: ${gameState.enemyHP}`, { fontSize: '20px', color: '#000', backgroundColor: '#fff' });
        this.comboText = this.add.text(140, 50, `Combo: 0`, { fontSize: '24px', color: '#ff0000' });
        
        // Initial Logic Trigger
        gameState.phase = GamePhase.QUESTION;
        
        // Listen for visual updates required
        // In a real app we might use EventEmitters
    }
    
    update() {
        // Sync UI
        this.playerHPText.setText(`HP: ${gameState.playerHP}/${gameState.maxPlayerHP}`);
        this.enemyHPText.setText(`HP: ${gameState.enemyHP}/${gameState.maxEnemyHP}`);
        this.comboText.setText(`Combo: ${gameState.combo}/${gameState.requiredCombo}`);
        
        this.handlePhaseAnimations();
    }
    
    handlePhaseAnimations() {
        if (gameState.phase === GamePhase.PLAYER_ATTACK) {
            this.animateAttack(this.playerSprite, this.enemySprite, () => {
                battleLogic.resolvePlayerAttack(); // Apply damage logic after anim
            });
            gameState.phase = GamePhase.IDLE; // Lock until anim done
        } else if (gameState.phase === GamePhase.ENEMY_ATTACK) {
            this.animateAttack(this.enemySprite, this.playerSprite, () => {
                battleLogic.resolveEnemyAttack();
            });
            gameState.phase = GamePhase.IDLE;
        } else if (gameState.phase === GamePhase.FINISHER_EXECUTE) {
             this.playFinisherAnim();
             gameState.phase = GamePhase.IDLE; // Lock
        } else if (gameState.phase === GamePhase.WIN) {
             this.add.text(180, 300, 'YOU WIN!', { fontSize: '48px', color: '#ffff00', backgroundColor: '#000' }).setOrigin(0.5);
             this.scene.pause();
        } else if (gameState.phase === GamePhase.LOSE) {
             this.add.text(180, 300, 'GAME OVER', { fontSize: '48px', color: '#ff0000', backgroundColor: '#000' }).setOrigin(0.5);
             this.scene.pause();
        }
    }
    
    animateAttack(attacker: Phaser.GameObjects.Rectangle, target: Phaser.GameObjects.Rectangle, onComplete: () => void) {
        // Move forward
        this.tweens.add({
            targets: attacker,
            x: attacker.x + (attacker === this.playerSprite ? 50 : -50),
            duration: 200,
            yoyo: true,
            onYoyo: () => {
                // Hit effect
                this.cameras.main.shake(100, 0.01);
                target.setAlpha(0.5);
                this.time.delayedCall(100, () => target.setAlpha(1));
            },
            onComplete: onComplete
        });
    }
    
    playFinisherAnim() {
        // Beam Animation
        const beam = this.add.rectangle(this.playerSprite.x + 20, this.playerSprite.y, 10, 10, 0x00ffff);
        this.tweens.add({
            targets: beam,
            width: 300, 
            height: 50,
            duration: 500,
            onComplete: () => {
                beam.destroy();
                // Explosion on enemy
                this.cameras.main.shake(500, 0.05);
                this.enemySprite.setVisible(false); // Die
                
                // Win
                gameState.phase = GamePhase.WIN;
            }
        });
    }
}
