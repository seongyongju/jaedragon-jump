import "phaser";
import Game from "./scenes/Game";

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scale: {
        parent: 'game',
        mode: Phaser.Scale.FIT,
        width: 768,
        height: 1024,
    },
    
    scene: [Game],

}
window.addEventListener('load', ()=> {
    new Phaser.Game(config);
});