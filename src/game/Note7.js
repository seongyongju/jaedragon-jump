import Phaser from 'phaser';
export default class Note7 extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.setScale(0.5);
    this.setSize(50, 50);
  }

  preload() {
    this.load.image('note7', 'assets/note7.png');
  }
}
