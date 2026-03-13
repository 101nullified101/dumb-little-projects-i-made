/**
 * NEON DASH: ULTIMATE EDITION
 * Features: Fullscreen, High Score, Leveling, and WASD Controls
 */

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 450
    },
    physics: { 
        default: 'arcade', 
        arcade: { gravity: { y: 1600 }, debug: false } 
    },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

// Variables
let player, enemy, keys, scoreText, fsButton;
let score = 0;
let lastLevelScore = 0;
let highScore = localStorage.getItem('neonDashHighScore') || 0;

function preload() {
    // No external plugins needed for this build to stay stable
}

function create() {
    // 1. Keyboard Setup (A, D, Space)
    keys = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // 2. The Player (Neon Cyan)
    player = this.add.rectangle(100, 300, 40, 40, 0x00ffff);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);

    // 3. The Enemy (Neon Pink)
    enemy = this.add.rectangle(850, 400, 30, 30, 0xff0055);
    this.physics.add.existing(enemy);
    enemy.body.setAllowGravity(false);
    enemy.body.setVelocityX(-350);

    // 4. UI: Score & High Score
    scoreText = this.add.text(20, 20, `SCORE: 0\nHIGH: ${highScore}`, { 
        fontSize: '22px', 
        fill: '#00ffff', 
        fontStyle: 'bold',
        lineSpacing: 8
    });

    // 5. Fullscreen Toggle (Top Right)
    fsButton = this.add.text(780, 20, '⛶', { 
        fontSize: '32px', 
        fill: '#ffffff' 
    })
    .setOrigin(1, 0)
    .setInteractive();

    fsButton.on('pointerdown', () => {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
        } else {
            this.scale.startFullscreen();
        }
    });

    // 6. Collision Logic
    this.physics.add.overlap(player, enemy, () => {
        // Shake the screen and restart
        this.cameras.main.shake(200, 0.02);
        this.time.delayedCall(200, () => {
            score = 0;
            lastLevelScore = 0;
            this.scene.restart();
        });
    });
}

function update() {
    // Movement: A and D keys
    if (keys.left.isDown) {
        player.body.setVelocityX(-300);
    } else if (keys.right.isDown) {
        player.body.setVelocityX(300);
    } else {
        player.body.setVelocityX(0);
    }

    // Jump: Spacebar
    if (keys.space.isDown && player.body.blocked.down) {
        player.body.setVelocityY(-700);
    }

    // Enemy Looping and Scoring
    if (enemy.x < -50) {
        enemy.x = 850;
        score += 1;

        // Update High Score if needed
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('neonDashHighScore', highScore);
        }

        scoreText.setText(`SCORE: ${score}\nHIGH: ${highScore}`);
        
        // Increase Difficulty (Speed up enemy)
        enemy.body.setVelocityX(-350 - (score * 12));

        // Visual Feedback: Flash every 5 points
        if (score % 5 === 0 && score !== lastLevelScore) {
            lastLevelScore = score;
            this.cameras.main.flash(300, 0, 255, 255);
            
            // Randomly change background for "Level Up" feel
            const bgColors = [0x000000, 0x0a001a, 0x000a1a];
            this.cameras.main.setBackgroundColor(Phaser.Utils.Array.GetRandom(bgColors));
        }
    }
}