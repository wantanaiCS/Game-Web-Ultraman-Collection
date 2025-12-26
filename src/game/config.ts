import Phaser from 'phaser';

// ตั้งค่าความกว้างสูงของเกม (อิงตามขนาดมือถือแนวตั้ง หรือ Retro size)
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // ให้เลือกอัตโนมัติระหว่าง WebGL หรือ Canvas
  parent: 'game-container', // ชื่อ ID ของ HTML div ที่จะใส่เกมลงไป
  backgroundColor: '#2d2d2d', // สีพื้นหลังเกม
  
  // สำคัญมากสำหรับเกมแนว Pixel Art / Look-Kid Soft
  pixelArt: true, // ทำให้ภาพไม่เบลอเวลาขยาย
  
  scale: {
    mode: Phaser.Scale.FIT, // ยืดให้เต็มจอโดยรักษาสัดส่วน
    autoCenter: Phaser.Scale.CENTER_BOTH, // จัดกึ่งกลางจอเสมอ
    width: 360, // ความกว้างฐาน (Resolution ต่ำๆ จะได้ฟีล Retro)
    height: 640,
  },
  
  physics: {
    default: 'arcade', // ระบบฟิสิกส์พื้นฐาน
    arcade: {
      gravity: { x: 0, y: 0 }, // แรงโน้มถ่วง (ปรับเป็น 0 ก่อน)
      debug: false // เปลี่ยนเป็น true ถ้าอยากเห็นกรอบ Hitbox
    }
  },
  
  // เดี๋ยวเราจะมาใส่ชื่อ Scene (ฉากเกม) ตรงนี้ทีหลัง
  scene: [CharacterSelectionScene, BattleScene]
};

import { CharacterSelectionScene } from './scenes/CharacterSelectionScene';
import { BattleScene } from './scenes/BattleScene';