import Phaser from 'phaser';
import { gameConfig } from './game/config';
import './style.css';
import { QuizController } from './game/QuizController';

// เริ่มต้นเกม!
new Phaser.Game(gameConfig);

// Start UI Controller
new QuizController();
