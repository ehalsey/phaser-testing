import * as Phaser from 'phaser';

class MainScene extends Phaser.Scene {
    preload() {
        // YOUR BLUE GEM - Local asset
        this.load.image('blue-gem', 'assets/blue.png');
    }

    create() {
        // Spawn gem (32x32 size)
        const gem = this.add.image(400, 300, 'blue-gem').setScale(0.32).setDepth(5).setInteractive({ useHandCursor: true });

        this.input.setDefaultCursor('pointer');
        gem.on('pointerdown', () => explodeGem(this, gem));

        // UI
        this.add.text(10, 10, 'YOUR BLUE GEM EXPLOSION! 🔥\nClick to BOOM | R=Reset', 
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
    // 1. IMPACT: Screen shake
    self.cameras.main.shake(280, 0.012);

    // 2. Gem animation: wobble, spin, grow slightly, then vanish
    self.tweens.chain({
        targets: gem,
        tweens: [
            // Quick wobble
            {
                scaleX: 0.27,
                scaleY: 0.37,
                duration: 80,
                yoyo: true,
                repeat: 1,
                ease: 'Sine.inOut'
            },
            // Grow to about 2x size and spin
            {
                scale: 0.64,
                rotation: Math.PI * 2,
                duration: 400,
                ease: 'Back.easeOut',
                onComplete: () => {
                    // Explode particles RIGHT when gem finishes growing
                    const emitter = self.add.particles(0, 0, 'blue-gem', {
                        x: gem.x,
                        y: gem.y,
                        speed: { min: 200, max: 400 },
                        angle: { min: 0, max: 360 },
                        scale: { start: 0.25, end: 0 },
                        lifespan: 1200,
                        gravityY: 400,
                        quantity: 50,
                        frequency: -1,
                        blendMode: 'ADD'
                    });

                    emitter.explode(50);

                    // Destroy emitter after particles die
                    self.time.delayedCall(1500, () => emitter.destroy());
                }
            },
            // Shrink and fade out quickly (gem shatters)
            {
                alpha: 0,
                scale: 0,
                duration: 150,
                ease: 'Power2.in',
                onComplete: () => {
                    // Reset gem after particles finish
                    self.time.delayedCall(900, () => resetGem(gem));
                }
            }
        ]
    });
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