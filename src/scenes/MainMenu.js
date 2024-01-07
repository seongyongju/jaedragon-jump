import Phaser from 'phaser';
import WebFontFile from '../files/WebFontFile';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  preload() {
    const elem = document.getElementById('asset-base-url');
    if (elem) {
      this.load.setBaseURL(elem.dataset.assetBaseUrl);
    }
    this.load.addFile(new WebFontFile(this.load, 'Jua'));
    this.load.image('background', 'assets/Clouds.png');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.background = this.add
      .tileSprite(0, 0, width, height, 'background')
      .setOrigin(0);
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 100, 'JAEYONG JUMP', {
        fontFamily: 'Jua',
        fontSize: '60px',
        fill: '#000',
      })
      .setOrigin(0.5);

    const restartButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 10, 'START', {
        fontFamily: 'Jua',
        fontSize: '32px',
        fill: '#000',
      })
      .setOrigin(0.5);

    restartButton.setInteractive({ useHandCursor: true });
    restartButton.on('pointerover', () => {
      restartButton.setColor('#ff0000');
    });
    restartButton.on('pointerout', () => {
      restartButton.setColor('#000000');
    });

    // 텍스트 클릭 시 메인 게임 씬 재시작
    restartButton.on('pointerdown', () => {
      this.scene.start('Game');
    });
  }
}
