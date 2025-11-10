# Gem Explosion Effect - Usage Guide

This is a reusable gem shard explosion effect for Phaser 3 games.

## Installation

Copy `gemExplosion.ts` to your Phaser project's source directory.

## Usage

```typescript
import { createGemExplosion } from './gemExplosion';

// In your Phaser scene:
createGemExplosion(this, {
    x: 400,              // X position
    y: 300,              // Y position
    color: 0xff44ff,     // Pink color (hex)
    shakeIntensity: 0.008,  // Optional: screen shake (0-1)
    duration: 1200,      // Optional: animation duration (ms)
    spreadDistance: 60,  // Optional: how far shards spread
    fallDistance: 300    // Optional: how far shards fall
});
```

## Color Examples

```typescript
// Blue gem
createGemExplosion(this, { x: 100, y: 100, color: 0x4488ff });

// Pink gem
createGemExplosion(this, { x: 200, y: 100, color: 0xff44ff });

// Green gem
createGemExplosion(this, { x: 300, y: 100, color: 0x44ff88 });

// Red gem
createGemExplosion(this, { x: 400, y: 100, color: 0xff4444 });

// Yellow gem
createGemExplosion(this, { x: 500, y: 100, color: 0xffff44 });
```

## Complete Example

```typescript
class GameScene extends Phaser.Scene {
    create() {
        // Create a gem sprite
        const gem = this.add.image(400, 300, 'gem-sprite');
        gem.setInteractive();

        // Explode on click
        gem.on('pointerdown', () => {
            gem.setVisible(false); // Hide the gem

            createGemExplosion(this, {
                x: gem.x,
                y: gem.y,
                color: 0xff44ff
            });

            // Re-show gem after 1.5 seconds
            this.time.delayedCall(1500, () => {
                gem.setVisible(true);
            });
        });
    }
}
```

## Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `x` | number | *required* | X position of explosion |
| `y` | number | *required* | Y position of explosion |
| `color` | number | `0x4488ff` | Hex color for shards (e.g., 0xff44ff) |
| `shakeIntensity` | number | `0.008` | Screen shake intensity (0 = none, 1 = max) |
| `duration` | number | `1200` | Animation duration in milliseconds |
| `spreadDistance` | number | `60` | How far shards spread horizontally |
| `fallDistance` | number | `300` | How far shards fall vertically |

## Effect Details

- Creates 5 geometric shards (2 left, 2 right, 1 center)
- Left shards fly left, right shards fly right, center falls down
- Each shard rotates and fades as it falls
- Shards are destroyed automatically after animation completes
