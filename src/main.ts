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
    // 1. IMPACT: Light screen shake
    self.cameras.main.shake(150, 0.008);

    // Hide the gem immediately
    gem.setAlpha(0);

    // Define 5 polygon shards with different shapes - MUCH LARGER
    const shardShapes = [
        // Left-top triangle
        { points: [0, -25, -20, 18, 10, 12], offsetX: -60, offsetY: -20, angle: -90 },
        // Left-bottom triangle
        { points: [-18, -15, 5, 12, -22, 20], offsetX: -60, offsetY: 20, angle: -120 },
        // Center diamond
        { points: [0, -30, 18, 0, 0, 30, -18, 0], offsetX: 0, offsetY: 30, angle: 180 },
        // Right-top triangle
        { points: [0, -25, 20, 18, -10, 12], offsetX: 60, offsetY: -20, angle: 90 },
        // Right-bottom triangle
        { points: [18, -15, -5, 12, 22, 20], offsetX: 60, offsetY: 20, angle: 120 }
    ];

    const shards: Phaser.GameObjects.Graphics[] = [];

    shardShapes.forEach((shard) => {
        // Create a graphic shard with irregular triangle shape
        const graphic = self.add.graphics();
        graphic.fillStyle(0x4488ff, 0.95); // Blue gem color

        // Draw polygon from points array
        const poly = new Phaser.Geom.Polygon(shard.points);
        graphic.fillPoints(poly.points, true);

        // Add white outline
        graphic.lineStyle(2, 0xffffff, 0.9);
        graphic.strokePoints(poly.points, true);

        graphic.setPosition(gem.x, gem.y);
        graphic.setDepth(10);
        shards.push(graphic);

        // Animate each shard - horizontal and vertical movement
        self.tweens.add({
            targets: graphic,
            x: gem.x + shard.offsetX,
            y: gem.y + shard.offsetY,
            rotation: (shard.angle * Math.PI) / 180,
            alpha: 0,
            duration: 1200,
            ease: 'Power2.out'
        });

        // Add gravity effect - falls down further
        self.tweens.add({
            targets: graphic,
            y: gem.y + shard.offsetY + 300,
            duration: 1200,
            ease: 'Quad.in'
        });

        // Remove shard after animation
        self.time.delayedCall(1200, () => graphic.destroy());
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