import Phaser from 'phaser';
import MainMenu from './scenes/MainMenu';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#dddddd',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
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
  scene: [MainMenu, Game, GameOver],
};
window.addEventListener('load', () => {
  new Phaser.Game(config);
});
