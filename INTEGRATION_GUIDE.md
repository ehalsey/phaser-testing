# Gem Explosion Effect - Integration Guide

This guide shows how to integrate the gem explosion effect into your gem-match-wolf project.

## Step 1: Copy the Required File

Copy `src/gemExplosion.ts` from this project to your gem-match-wolf project:

```bash
# From Windows Command Prompt or PowerShell
copy C:\source\phaser-testing\src\gemExplosion.ts C:\source\gem-match-wolf\src\
```

Or manually:
1. Open `C:\source\phaser-testing\src\gemExplosion.ts`
2. Copy the entire file contents
3. Create `C:\source\gem-match-wolf\src\gemExplosion.ts`
4. Paste the contents

## Step 2: Import in Your Scene

In your gem-match scene file, add the import at the top:

```typescript
import { createGemExplosion } from './gemExplosion';
```

## Step 3: Use When Gems Are Destroyed

### Example 1: Single Gem Match

```typescript
// When a gem is clicked/matched:
destroyGem(gem: Phaser.GameObjects.Image) {
    // Hide the gem sprite
    gem.setVisible(false);

    // Create explosion effect
    createGemExplosion(this, {
        x: gem.x,
        y: gem.y,
        color: this.getGemColor(gem), // Get color based on gem type
        shakeIntensity: 0.005,
        duration: 1000
    });

    // Destroy the gem object after animation
    this.time.delayedCall(1000, () => gem.destroy());
}

// Helper to get color based on gem type
getGemColor(gem: any): number {
    switch(gem.texture.key) {
        case 'blue-gem': return 0x4488ff;
        case 'pink-gem': return 0xff44ff;
        case 'green-gem': return 0x44ff88;
        case 'red-gem': return 0xff4444;
        case 'yellow-gem': return 0xffff44;
        default: return 0x4488ff;
    }
}
```

### Example 2: Multiple Gems Matched

```typescript
// When multiple gems match:
destroyMatchedGems(gems: Phaser.GameObjects.Image[]) {
    gems.forEach((gem, index) => {
        // Stagger the explosions slightly
        this.time.delayedCall(index * 100, () => {
            gem.setVisible(false);

            createGemExplosion(this, {
                x: gem.x,
                y: gem.y,
                color: this.getGemColor(gem),
                shakeIntensity: 0.003, // Less shake for multiple
                duration: 1000
            });
        });
    });

    // Clean up after all animations
    this.time.delayedCall(gems.length * 100 + 1000, () => {
        gems.forEach(gem => gem.destroy());
    });
}
```

### Example 3: Chain Reaction

```typescript
// For cascade/combo effects:
triggerComboExplosion(gems: Phaser.GameObjects.Image[], comboLevel: number) {
    gems.forEach((gem, index) => {
        const delay = index * 150;

        this.time.delayedCall(delay, () => {
            gem.setVisible(false);

            createGemExplosion(this, {
                x: gem.x,
                y: gem.y,
                color: this.getGemColor(gem),
                shakeIntensity: 0.01 + (comboLevel * 0.002), // More shake for higher combos
                duration: 800,
                spreadDistance: 60 + (comboLevel * 10), // Bigger explosion for combos
                fallDistance: 300 + (comboLevel * 20)
            });
        });
    });
}
```

## Step 4: Color Mapping for Your Gems

Create a color mapping based on your gem types:

```typescript
class GemMatchScene extends Phaser.Scene {
    private gemColors: Map<string, number> = new Map([
        ['blue', 0x4488ff],
        ['pink', 0xff44ff],
        ['green', 0x44ff88],
        ['red', 0xff4444],
        ['yellow', 0xffff44],
        ['purple', 0x8844ff],
        ['orange', 0xffaa44]
    ]);

    getColorForGem(gemType: string): number {
        return this.gemColors.get(gemType) || 0x4488ff;
    }
}
```

## Step 5: Customization Options

### Subtle Effect (for frequent matches)
```typescript
createGemExplosion(this, {
    x: gem.x,
    y: gem.y,
    color: 0xff44ff,
    shakeIntensity: 0,        // No screen shake
    duration: 800,            // Faster
    spreadDistance: 40,       // Tighter
    fallDistance: 200         // Shorter fall
});
```

### Dramatic Effect (for special combos)
```typescript
createGemExplosion(this, {
    x: gem.x,
    y: gem.y,
    color: 0xff44ff,
    shakeIntensity: 0.015,    // Strong shake
    duration: 1500,           // Slower
    spreadDistance: 80,       // Wide spread
    fallDistance: 400         // Long fall
});
```

### No Screen Shake (for mobile)
```typescript
createGemExplosion(this, {
    x: gem.x,
    y: gem.y,
    color: 0xff44ff,
    shakeIntensity: 0         // Disable shake entirely
});
```

## Step 6: Performance Considerations

### For Many Simultaneous Explosions

If you're exploding many gems at once:

```typescript
// Option 1: Disable shake for all but the first
gems.forEach((gem, index) => {
    createGemExplosion(this, {
        x: gem.x,
        y: gem.y,
        color: this.getGemColor(gem),
        shakeIntensity: index === 0 ? 0.008 : 0, // Only shake once
        duration: 800
    });
});

// Option 2: Use a single shake for all explosions
this.cameras.main.shake(200, 0.01);
gems.forEach(gem => {
    createGemExplosion(this, {
        x: gem.x,
        y: gem.y,
        color: this.getGemColor(gem),
        shakeIntensity: 0, // Already shaking
        duration: 800
    });
});
```

## Common Integration Points

### Grid-Based Match-3 Game

```typescript
class Match3Scene extends Phaser.Scene {
    clearMatches(matches: GridPosition[]) {
        matches.forEach(pos => {
            const gem = this.grid[pos.row][pos.col];

            if (gem) {
                createGemExplosion(this, {
                    x: gem.x,
                    y: gem.y,
                    color: this.getGemColor(gem.getData('type'))
                });

                gem.destroy();
                this.grid[pos.row][pos.col] = null;
            }
        });
    }
}
```

### Bejeweled-Style Click Handler

```typescript
onGemClick(gem: Phaser.GameObjects.Image) {
    if (this.canDestroyGem(gem)) {
        createGemExplosion(this, {
            x: gem.x,
            y: gem.y,
            color: this.getColorByTexture(gem.texture.key),
            shakeIntensity: 0.005
        });

        this.score += 10;
        this.updateScore();
        gem.destroy();
        this.refillGrid();
    }
}
```

## Troubleshooting

### Explosions Not Appearing
- Check that you imported the function correctly
- Verify the scene is active when calling the function
- Ensure x/y coordinates are valid

### Colors Look Wrong
- Colors are in hex format: `0xRRGGBB`
- Example: Red = `0xff0000`, Green = `0x00ff00`, Blue = `0x0000ff`
- Use a color picker to get exact hex values

### Too Much Screen Shake
- Reduce `shakeIntensity` (default is 0.008)
- Set to 0 to disable: `shakeIntensity: 0`

### Performance Issues
- Reduce `duration` for faster animations
- Disable shake for multiple simultaneous explosions
- Limit the number of concurrent explosions

## Complete Example Scene

```typescript
import Phaser from 'phaser';
import { createGemExplosion } from './gemExplosion';

export class GameScene extends Phaser.Scene {
    private gems: Phaser.GameObjects.Image[] = [];

    create() {
        // Create some test gems
        const colors = [0x4488ff, 0xff44ff, 0x44ff88, 0xff4444, 0xffff44];

        for (let i = 0; i < 5; i++) {
            const gem = this.add.image(150 + i * 100, 300, 'gem');
            gem.setData('color', colors[i]);
            gem.setInteractive();

            gem.on('pointerdown', () => {
                gem.setVisible(false);

                createGemExplosion(this, {
                    x: gem.x,
                    y: gem.y,
                    color: gem.getData('color'),
                    shakeIntensity: 0.008
                });

                // Respawn after 2 seconds
                this.time.delayedCall(2000, () => {
                    gem.setVisible(true);
                });
            });

            this.gems.push(gem);
        }
    }
}
```

## Next Steps

1. Copy `gemExplosion.ts` to your project
2. Import it in your game scene
3. Call `createGemExplosion()` when gems are destroyed
4. Customize colors and parameters to match your game
5. Test with different gem types and match scenarios

For more details on the API, see `EXPLOSION_USAGE.md`.
