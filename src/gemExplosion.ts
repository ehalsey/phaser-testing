/**
 * Gem Shard Explosion Effect
 * Creates 5 geometric shards that fly out and fall with gravity
 */

export interface GemExplosionOptions {
    /** X position of the explosion */
    x: number;
    /** Y position of the explosion */
    y: number;
    /** Color of the shards (hex number, e.g., 0xff44ff for pink) */
    color?: number;
    /** Screen shake intensity (0-1) */
    shakeIntensity?: number;
    /** Duration of the animation in milliseconds */
    duration?: number;
    /** How far shards spread out */
    spreadDistance?: number;
    /** How far shards fall */
    fallDistance?: number;
}

/**
 * Create a shard explosion effect at the specified position
 * @param scene - The Phaser scene
 * @param options - Explosion configuration options
 */
export function createGemExplosion(scene: Phaser.Scene, options: GemExplosionOptions): void {
    const {
        x,
        y,
        color = 0x4488ff, // Default blue
        shakeIntensity = 0.008,
        duration = 1200,
        spreadDistance = 60,
        fallDistance = 300
    } = options;

    // Light screen shake
    if (shakeIntensity > 0) {
        scene.cameras.main.shake(150, shakeIntensity);
    }

    // Define 5 polygon shards with different shapes
    const shardShapes = [
        // Left-top triangle
        { points: [0, -25, -20, 18, 10, 12], offsetX: -spreadDistance, offsetY: -20, angle: -90 },
        // Left-bottom triangle
        { points: [-18, -15, 5, 12, -22, 20], offsetX: -spreadDistance, offsetY: 20, angle: -120 },
        // Center diamond
        { points: [0, -30, 18, 0, 0, 30, -18, 0], offsetX: 0, offsetY: 30, angle: 180 },
        // Right-top triangle
        { points: [0, -25, 20, 18, -10, 12], offsetX: spreadDistance, offsetY: -20, angle: 90 },
        // Right-bottom triangle
        { points: [18, -15, -5, 12, 22, 20], offsetX: spreadDistance, offsetY: 20, angle: 120 }
    ];

    const shards: Phaser.GameObjects.Graphics[] = [];

    shardShapes.forEach((shard) => {
        // Create a graphic shard with irregular triangle shape
        const graphic = scene.add.graphics();
        graphic.fillStyle(color, 0.95);

        // Draw polygon from points array
        const poly = new Phaser.Geom.Polygon(shard.points);
        graphic.fillPoints(poly.points, true);

        // Add white outline
        graphic.lineStyle(2, 0xffffff, 0.9);
        graphic.strokePoints(poly.points, true);

        graphic.setPosition(x, y);
        graphic.setDepth(10);
        shards.push(graphic);

        // Animate each shard - horizontal and vertical movement
        scene.tweens.add({
            targets: graphic,
            x: x + shard.offsetX,
            y: y + shard.offsetY,
            rotation: (shard.angle * Math.PI) / 180,
            alpha: 0,
            duration: duration,
            ease: 'Power2.out'
        });

        // Add gravity effect - falls down further
        scene.tweens.add({
            targets: graphic,
            y: y + shard.offsetY + fallDistance,
            duration: duration,
            ease: 'Quad.in'
        });

        // Remove shard after animation
        scene.time.delayedCall(duration, () => graphic.destroy());
    });
}
