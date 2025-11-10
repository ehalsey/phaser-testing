import * as Phaser from 'phaser';
import { createGemExplosion } from './gemExplosion';

class MainScene extends Phaser.Scene {
    preload() {
        // PINK GEM - Local asset
        this.load.image('pink-gem', 'assets/pink.png');
    }

    create() {
        // Spawn gem (32x32 size)
        const gem = this.add.image(400, 300, 'pink-gem').setScale(0.32).setDepth(5).setInteractive({ useHandCursor: true });

        this.input.setDefaultCursor('pointer');
        gem.on('pointerdown', () => explodeGem(this, gem));

        // UI
        this.add.text(10, 10, 'PINK GEM EXPLOSION! 🔥\nClick to BOOM | R=Reset', 
            { fontSize: '20px', color: '#fff', stroke: '#000', strokeThickness: 4 })
            .setDepth(10);

        // Keyboard reset
        this.input.keyboard!.on('keydown-R', () => resetGem(gem));
    }
}

function resetGem(gem: Phaser.GameObjects.Image) {
    gem.setScale(0.32).setAlpha(1).setRotation(0).setPosition(400, 300);
}

function explodeGem(self: Phaser.Scene, gem: Phaser.GameObjects.Image) {
    // Hide the gem immediately
    gem.setAlpha(0);

    // Use the reusable explosion function
    createGemExplosion(self, {
        x: gem.x,
        y: gem.y,
        color: 0xff44ff, // Pink
        shakeIntensity: 0.008,
        duration: 1200,
        spreadDistance: 60,
        fallDistance: 300
    });

    // Reset gem after shards settle
    self.time.delayedCall(1300, () => resetGem(gem));
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#182d3b',
    parent: 'game',
    scene: MainScene
};

new Phaser.Game(config);