import Phaser from 'phaser';
import Game from './scenes/Game';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#dddddd',
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    width: 768,
    height: 1024,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 1500 },
    },
  },
  scene: [Game],
};
window.addEventListener('load', () => {
  new Phaser.Game(config);
});
