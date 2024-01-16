import Phaser from 'phaser';
import WebFontFile from '../files/WebFontFile';
import Buds from '../game/buds';
import Note7 from '../game/Note7';

export default class Game extends Phaser.Scene {
  재용;
  background;
  platforms;
  cursors;
  platform_max_y;
  platform_keys = ['laundry', 'refri', 's1', 's2', 's21', 's22'];
  score = 0;
  scoreText;
  constructor() {
    super({
      key: 'Game',
    });
  }
  preload() {
    const elem = document.getElementById('asset-base-url');
    if (elem) {
      this.load.setBaseURL(elem.dataset.assetBaseUrl);
    }
    this.load.image('character', 'assets/character.png');
    this.load.image('background', 'assets/Clouds.png');
    this.load.image('rocket', 'assets/rocket.png');

    this.load.image('buds', 'assets/buds.png');
    //platforms
    this.load.image('laundry', 'assets/laundry.png');
    this.load.image('refri', 'assets/refri.png');
    this.load.image('s1', 'assets/s1.png');
    this.load.image('s2', 'assets/s2.png');
    this.load.image('s21', 'assets/s21.png');
    this.load.image('s22', 'assets/s22.png');
    this.load.image('note7', 'assets/note7.png');
    this.load.addFile(new WebFontFile(this.load, 'Jua'));
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create(data) {
    this.score = 0;
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
    this.physics.add.collider(
      this.platforms,
      this.재용,
      this.onPlatformCollision,
      null,
      this,
    );
    this.cameras.main.startFollow(this.재용);
    this.cameras.main.setDeadzone(this.scale.width * 1.5);
    this.scoreText = this.add
      .text(16, 16, 'SAMSUNG: 0 KRW', {
        fontFamily: 'Jua',
        fontSize: '32px',
        fill: '#000',
      })
      .setDepth(10)
      .setScrollFactor(0, 0);

    this.budsGroup = this.physics.add.staticGroup({
      classType: Buds,
    });
    this.physics.add.overlap(
      this.재용,
      this.budsGroup,
      this.handCollectBuds,
      undefined,
      this,
    );

    this.note7Group = this.physics.add.staticGroup({
      classType: Note7,
    });
    this.physics.add.overlap(
      this.재용,
      this.note7Group,
      this.handCollectNote7,
      undefined,
      this,
    );

    //클릭(터치) 이벤트 처리
    window.addEventListener(
      'deviceorientation',
      this.handleOrientation.bind(this),
    );
    this.halfWidth = this.sys.game.config.width / 2;
    this.input.on('pointerdown', (_pointer) => {
      this.pointer = _pointer;
      if (this.pointer.x < this.halfWidth) {
        this.재용.setFlipX(true);
      } else {
        this.재용.setFlipX(false);
      }
    });
    // 포인터가 화면에서 떨어질 때의 이벤트를 처리합니다.
    this.input.on('pointerup', () => {
      this.pointer = null;
      this.재용.setVelocityX(0);
    });
  }

  update(t, dt) {
    if (this.재용.body.velocity.y > 2000) {
      this.scene.start('GameOver', { score: this.score });
    }
    this.platforms.children.iterate((child) => {
      const platform = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + this.scale.height + 200) {
        platform.destroy();
        const new_x = Phaser.Math.Between(0, this.scale.width - 200);
        const new_y = this.platform_max_y - Phaser.Math.Between(300, 480);
        const new_platform_key = Phaser.Math.RND.pick(this.platform_keys);
        const new_platform = this.platforms
          .create(new_x, new_y, new_platform_key)
          .setOrigin(0);
        new_platform.scale = 0.25;

        const body = new_platform.body;
        this.platform_max_y = new_platform.y;
        body.updateFromGameObject();
        this.score += 1000;
        this.scoreText.setText(`SAMSUNG: ${this.score}krw`);
        if (Math.random() < 0.1 && this.재용.body.velocity.y > -1225) {
          this.budsGroup.get(
            Phaser.Math.Between(0, this.scale.width - 200),
            new_y - Phaser.Math.Between(600, 1000),
            'buds',
          );
        }
        if (Math.random() < 0.1 && this.재용.body.velocity.y > -1225) {
          this.note7Group.get(
            Phaser.Math.Between(0, this.scale.width - 200),
            new_y - Phaser.Math.Between(600, 1000),
            'note7',
          );
        }
      }
    });
    this.background.setTilePosition(0, this.cameras.main.scrollY);

    if (Math.abs(this.재용.body.velocity.x) > 20) {
      this.재용.setFlipX(this.재용.body.velocity.x < 0);
    }

    const touchingDown = this.재용.body.touching.down;
    if (this.cursors.left.isDown && !touchingDown) {
      this.재용.setVelocityX(-700);
      this.재용.setFlipX(true);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.재용.setVelocityX(700);
      this.재용.setFlipX(false);
    } else if (this.pointer && this.pointer.isDown) {
      // 포인터가 화면에 닿아 있는 경우, 포인터 입력을 처리합니다.
      if (this.pointer.x < this.halfWidth) {
        this.재용.setVelocityX(-700);
        this.재용.setFlipX(true);
      } else {
        this.재용.setVelocityX(700);
        this.재용.setFlipX(false);
      }
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
  onPlatformCollision(player, platform) {
    const isOnPlatform = player.body.touching.down;

    if (isOnPlatform) {
      this.재용.setVelocityY(-1225);
    }
    if (platform.texture.key === 'laundry') {
      if (isOnPlatform) {
        const tween = this.tweens.add({
          targets: this.cameras.main,
          rotation: 2 * Math.PI,
          duration: 500,
          ease: 'Linear',
          onComplete: () => {
            this.cameras.main.rotation = 0;
          },
        });
      }
    }
  }
  handCollectBuds(player, buds) {
    buds.destroy();
    player.setTexture('rocket');
    player.body.setAllowGravity(false);
    player.setVelocityY(-3500);

    this.time.delayedCall(3000, () => {
      player.setTexture('character');
    });
    this.time.delayedCall(1000, () => {
      player.body.setAllowGravity(true);
    });
  }

  handCollectNote7(player, note7) {
    note7.destroy();
    this.scene.start('GameOver', { score: this.score });
  }
  handleOrientation(e) {
    const x = e.gamma; // x 축 기울기
    if (this.재용) {
      this.재용.setVelocityX(x * 70);
    }
  }
}
