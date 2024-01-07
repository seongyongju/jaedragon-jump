import Phaser from 'phaser';
export default class Buds extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.setScale(0.2);
  }

  preload() {
    this.load.image('buds', 'assets/buds.png');
  }
}
