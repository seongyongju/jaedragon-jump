import Phaser from 'phaser';
import MainMenu from './scenes/MainMenu';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver';

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
  scene: [MainMenu, Game, GameOver],
};
window.addEventListener('load', () => {
  new Phaser.Game(config);
});
