import Phaser from "phaser";
import { gameState, type Character } from "../GameState";

export class CharacterSelectionScene extends Phaser.Scene {
  private characters: Character[] = [
    // Using colors/placeholders for now if assets aren't loaded
    { id: "ultra1", name: "Ultraman", image: "char_1", color: "#ff0000" },
    { id: "ultra2", name: "Tiga", image: "char_2", color: "#8800ff" },
    { id: "ultra3", name: "Taro", image: "char_3", color: "#ff0000" },
    { id: "ultra4", name: "Zero", image: "char_4", color: "#0000ff" },
  ];

  constructor() {
    super("CharacterSelectionScene");
  }

  preload() {
    // Load placeholder assets or real ones if available
  }

  create() {
    const width = this.cameras.main.width;

    this.add
      .text(width / 2, 50, "เลือกตัวละคร", {
        fontSize: "32px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Create 2x2 Grid
    const startX = width / 4;
    const startY = 150;
    const gapX = width / 2;
    const gapY = 150;

    this.characters.forEach((char, index) => {
      const posX = startX + (index % 2) * gapX;
      const posY = startY + Math.floor(index / 2) * gapY;

      this.createCharacterButton(posX, posY, char);
    });
  }

  createCharacterButton(x: number, y: number, char: Character) {
    // Background for card
    const card = this.add.rectangle(
      x,
      y,
      140,
      120,
      parseInt(char.color.replace("#", "0x"))
    );
    card.setInteractive();

    // Name
    this.add
      .text(x, y, char.name, {
        fontSize: "20px",
        color: "#000000",
      })
      .setOrigin(0.5);

    card.on("pointerdown", () => {
      this.selectCharacter(char);
    });

    // Hover effect
    card.on("pointerover", () => {
      card.setScale(1.1);
    });
    card.on("pointerout", () => {
      card.setScale(1);
    });
  }

  selectCharacter(char: Character) {
    gameState.selectedCharacter = char;
    console.log("Selected:", char.name);
    // Start Battle Scenario
    this.scene.start("BattleScene");
  }
}
