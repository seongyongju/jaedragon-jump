import Phaser from 'phaser';
import WebFontFile from '../files/WebFontFile';

export default class Game extends Phaser.Scene {
  재용;
  background;
  platforms;
  cursors;
  platform_max_y;
  platform_keys = ['laundry', 'note7', 'refri', 's1', 's2', 's21', 's22'];
  score = 0;
  scoreText;
  constructor() {
    super({
      key: 'Game',
    });
  }

  preload() {
    this.load.image('character', 'assets/character.png');
    this.load.image('background', 'assets/Clouds.png');

    this.load.image('buds', 'assets/buds.png');
    //platforms
    this.load.image('laundry', 'assets/laundry.png');
    this.load.image('note7', 'assets/note7.png');
    this.load.image('refri', 'assets/refri.png');
    this.load.image('s1', 'assets/s1.png');
    this.load.image('s2', 'assets/s2.png');
    this.load.image('s21', 'assets/s21.png');
    this.load.image('s22', 'assets/s22.png');
    this.load.addFile(new WebFontFile(this.load, 'Jua'));
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.background = this.add
      .tileSprite(0, 0, width, height, 'background')
      .setOrigin(0)
      .setScrollFactor(0, 0);

    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(width / 2 - 50, width / 2 + 50);
      const y = 250 * i;

      const platform = this.platforms
        .create(x, y, Phaser.Math.RND.pick(this.platform_keys))
        .setOrigin(0);
      platform.scale = 0.25;

      const body = platform.body;
      body.updateFromGameObject();
    }
    this.platform_max_y = 0;
    //this.add.image(400, 300, 'character').setScale(0.1);
    this.재용 = this.physics.add
      .image(width / 2, 750, 'character')
      .setOrigin(0.5)
      .setScale(0.1);
    this.재용.body.checkCollision.up = false;
    this.재용.body.checkCollision.left = false;
    this.재용.body.checkCollision.right = false;
    this.재용.depth = 10;
    this.physics.add.collider(this.platforms, this.재용);
    this.cameras.main.startFollow(this.재용);
    this.cameras.main.setDeadzone(this.scale.width * 1.5);
    this.scoreText = this.add
      .text(16, 16, 'SAMSUNG: 0krw', {
        fontFamily: 'Jua',
        fontSize: '32px',
        fill: '#000',
      })
      .setScrollFactor(0, 0);
  }

  update(t, dt) {
    this.platforms.children.iterate((child) => {
      let platform = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + this.scale.height + 200) {
        platform.destroy();
        const new_x = Phaser.Math.Between(0, this.scale.width - 200);
        const new_y = this.platform_max_y - Phaser.Math.Between(300, 480);
        platform = this.platforms
          .create(new_x, new_y, Phaser.Math.RND.pick(this.platform_keys))
          .setOrigin(0);
        platform.scale = 0.25;

        const body = platform.body;
        this.platform_max_y = platform.y;
        body.updateFromGameObject();
      }
    });
    // this.background.setTilePosition(0, this.cameras.main.scrollY);
    const touchingDown = this.재용.body.touching.down;
    if (touchingDown) {
      this.재용.setVelocityY(-1225);
    }

    if (this.cursors.left.isDown && !touchingDown) {
      this.재용.setVelocityX(-700);
      this.재용.setFlipX(true);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.재용.setVelocityX(700);
      this.재용.setFlipX(false);
    } else {
      this.재용.setVelocityX(0);
    }
    this.horizontalWrap(this.재용);
  }
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth / 2;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }
}
