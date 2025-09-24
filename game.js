const COLORS = {
    SKY: ['#5C94FC', '#6CA6FC', '#7CB8FC', '#8CC2FC'],
    WATER: ['#003F7F', '#0050A0', '#0060C0', '#0070E0'],
    SAND: '#C9A876',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    RED: '#FF0044',
    YELLOW: '#FFD700',
    GREEN: '#00FF00',
    BLUE: '#0080FF',
    PURPLE: '#B040FF',
    ORANGE: '#FF8800'
};

class SpriteRenderer {
    constructor() {
        this.pixelSize = 2;
        this.sprites = this.defineSprites();
    }

    defineSprites() {
        return {
            fish1: [
                [
                    '  ....  ',
                    ' .RRRR. ',
                    '.RRRRRR.',
                    '.RWRRRR>',
                    '.RRRRRR>',
                    ' .RRRR. ',
                    '  ....  '
                ],
                [
                    '  ....  ',
                    ' .RRRR. ',
                    '.RRRRRR>',
                    '.RWRRRR.',
                    '.RRRRRR>',
                    ' .RRRR. ',
                    '  ....  '
                ],
                [
                    '  ....  ',
                    ' .RRRR.>',
                    '.RRRRRR.',
                    '.RWRRRR>',
                    '.RRRRRR.',
                    ' .RRRR.>',
                    '  ....  '
                ]
            ],
            fish2: [
                [
                    '   ...   ',
                    '  .YYY.  ',
                    ' .YYYYY. ',
                    '.YWYYYYY>',
                    ' .YYYYY. ',
                    '  .YYY.  ',
                    '   ...   '
                ],
                [
                    '   ...   ',
                    '  .YYY.  ',
                    ' .YYYYY.>',
                    '.YWYYYYY.',
                    ' .YYYYY.>',
                    '  .YYY.  ',
                    '   ...   '
                ],
                [
                    '   ...   ',
                    '  .YYY.  ',
                    ' .YYYYY. ',
                    '.YWYYYYY>',
                    ' .YYYYY. ',
                    '  .YYY.  ',
                    '   ...   '
                ]
            ],
            fish3: [
                [
                    '  .....  ',
                    ' .PPPPP. ',
                    '.PPPPPPP.',
                    '.PWPPPPPP>',
                    '.PPPPPPP>',
                    ' .PPPPP. ',
                    '  .....  '
                ],
                [
                    '  .....  ',
                    ' .PPPPP. ',
                    '.PPPPPPP>',
                    '.PWPPPPPP.',
                    '.PPPPPPP>',
                    ' .PPPPP. ',
                    '  .....  '
                ],
                [
                    '  .....  ',
                    ' .PPPPP.>',
                    '.PPPPPPP.',
                    '.PWPPPPPP>',
                    '.PPPPPPP.',
                    ' .PPPPP.>',
                    '  .....  '
                ]
            ],
            treasure: [
                '  .....  ',
                ' .YYYYY. ',
                '.Y.Y.Y.Y.',
                '.YYYYYYY.',
                '.Y.YYY.Y.',
                '.YYYYYYY.',
                ' ....... '
            ],
            boat: [
                '    .W.    ',
                '   .WWW.   ',
                '  .WWWWW.  ',
                '  ...B...  ',
                ' .BBBBBBB. ',
                '.BBBBBBBBB.',
                ' ......... '
            ],
            fisher: [
                '  .OOO.  ',
                '  .OOO.  ',
                '  .OOO.  ',
                ' ..RRR.. ',
                '.R.RRR.R.',
                '  .RRR.  ',
                '  .B.B.  ',
                '  .B.B.  '
            ],
            hook: [
                '.W.',
                '.W.',
                '.W.',
                ' . '
            ],
            bubble: [
                [
                    ' . ',
                    '.W.',
                    ' . '
                ],
                [
                    ' .. ',
                    '.WW.',
                    '.WW.',
                    ' .. '
                ],
                [
                    '  ..  ',
                    ' .WW. ',
                    '.WWWW.',
                    '.WWWW.',
                    ' .WW. ',
                    '  ..  '
                ]
            ],
            seaweed: [
                [
                    '  .G.  ',
                    '  .G.  ',
                    ' .GGG. ',
                    '  .G.  ',
                    ' .GGG. ',
                    '  .G.  ',
                    '.GGGGG.',
                    '  .G.  '
                ],
                [
                    '  .G.  ',
                    ' .GG.  ',
                    '  .G.  ',
                    ' .GGG. ',
                    '  .G.  ',
                    ' .GGG. ',
                    '.GGGGG.',
                    '  .G.  '
                ],
                [
                    '  .G.  ',
                    '  .GG. ',
                    '  .G.  ',
                    ' .GGG. ',
                    '  .G.  ',
                    ' .GGG. ',
                    '.GGGGG.',
                    '  .G.  '
                ]
            ]
        };
    }

    drawSprite(ctx, sprite, x, y, flip = false, scale = 1) {
        const pixels = Array.isArray(sprite[0]) ? sprite[0] : sprite;

        ctx.save();
        if (flip) {
            ctx.translate(x + pixels[0].length * this.pixelSize * scale, y);
            ctx.scale(-1, 1);
            x = 0;
            y = 0;
        }

        pixels.forEach((row, py) => {
            for (let px = 0; px < row.length; px++) {
                const pixel = row[px];
                if (pixel !== ' ' && pixel !== '.') {
                    ctx.fillStyle = this.getColor(pixel);
                    ctx.fillRect(
                        x + px * this.pixelSize * scale,
                        y + py * this.pixelSize * scale,
                        this.pixelSize * scale,
                        this.pixelSize * scale
                    );
                }
            }
        });

        ctx.restore();
    }

    getColor(code) {
        const colorMap = {
            'W': COLORS.WHITE,
            'B': COLORS.BLACK,
            'R': COLORS.RED,
            'Y': COLORS.YELLOW,
            'G': COLORS.GREEN,
            'b': COLORS.BLUE,
            'P': COLORS.PURPLE,
            'O': COLORS.ORANGE,
            '>': '#CC3366',
            '.': 'rgba(0,0,0,0.3)'
        };
        return colorMap[code] || COLORS.BLACK;
    }
}

class GameObject {
    constructor(x, y, type, sprite) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.sprite = sprite;
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 8;
    }

    update() {
        this.animTimer++;
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            if (Array.isArray(this.sprite[0])) {
                this.animFrame = (this.animFrame + 1) % this.sprite.length;
            }
        }
    }

    getCurrentSprite() {
        if (Array.isArray(this.sprite[0])) {
            return this.sprite[this.animFrame];
        }
        return this.sprite;
    }
}

class Fish extends GameObject {
    constructor(x, y, type, sprite, speed, points) {
        super(x, y, type, sprite);
        this.speed = speed;
        this.points = points;
        this.direction = speed > 0 ? 1 : -1;
        this.verticalOffset = 0;
        this.wavePhase = Math.random() * Math.PI * 2;
        this.waveSpeed = 0.05 + Math.random() * 0.05;
        this.waveAmplitude = 10 + Math.random() * 10;
    }

    update() {
        super.update();
        this.x += this.speed;
        this.verticalOffset = Math.sin(Date.now() * this.waveSpeed + this.wavePhase) * this.waveAmplitude;
    }
}

class Bubble extends GameObject {
    constructor(x, y) {
        super(x, y, 'bubble', null);
        this.size = 0;
        this.maxSize = 2;
        this.riseSpeed = 0.5 + Math.random() * 0.5;
        this.wobble = 0;
        this.wobbleSpeed = 0.1;
        this.lifetime = 200 + Math.random() * 100;
        this.age = 0;
    }

    update() {
        this.y -= this.riseSpeed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.3;
        this.age++;

        if (this.size < this.maxSize && this.age < 30) {
            this.size = Math.min(this.maxSize, this.age / 30 * this.maxSize);
        }

        return this.age < this.lifetime && this.y > -10;
    }
}

class RetroFishingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 256;
        this.canvas.height = 192;

        this.ctx.imageSmoothingEnabled = false;

        this.renderer = new SpriteRenderer();
        this.score = 0;
        this.lives = 3;
        this.depth = 0;
        this.maxDepth = 120;

        this.lineY = 0;
        this.lineX = 128;
        this.isLineCast = false;
        this.lineSpeed = 2;
        this.hookCatchRadius = 12;

        this.fishes = [];
        this.bubbles = [];
        this.seaweeds = [];
        this.treasures = [];

        this.waterLevel = 48;
        this.boatX = 128;
        this.boatY = 40;

        this.frameCount = 0;
        this.lastFishSpawn = 0;
        this.fishSpawnInterval = 60;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateSeaweed();
        this.spawnInitialFishes();
        this.gameLoop();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleInput());
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInput();
        });
    }

    handleInput() {
        if (!this.isLineCast) {
            this.castLine();
        } else {
            this.reelIn();
        }
    }

    castLine() {
        this.isLineCast = true;
        this.lineY = this.waterLevel;
        this.lineX = this.boatX;
        this.createSplash(this.lineX, this.waterLevel);
    }

    reelIn() {
        const caught = this.checkCatch();
        this.isLineCast = false;
        this.lineY = 0;
        this.depth = 0;
        document.getElementById('depth').textContent = '0';

        if (caught) {
            this.createBigSplash(this.lineX, this.waterLevel);
        }
    }

    checkCatch() {
        let caughtSomething = false;

        for (let i = this.fishes.length - 1; i >= 0; i--) {
            const fish = this.fishes[i];
            const dx = Math.abs(fish.x - this.lineX);
            const dy = Math.abs((fish.y + fish.verticalOffset) - this.lineY);

            if (dx < this.hookCatchRadius && dy < this.hookCatchRadius) {
                this.score += fish.points;
                this.updateScore();
                this.fishes.splice(i, 1);
                caughtSomething = true;
                this.createCatchEffect(fish.x, fish.y);
                break;
            }
        }

        for (let i = this.treasures.length - 1; i >= 0; i--) {
            const treasure = this.treasures[i];
            const dx = Math.abs(treasure.x - this.lineX);
            const dy = Math.abs(treasure.y - this.lineY);

            if (dx < this.hookCatchRadius && dy < this.hookCatchRadius) {
                this.score += 100;
                this.updateScore();
                this.treasures.splice(i, 1);
                caughtSomething = true;
                this.createCatchEffect(treasure.x, treasure.y);
                break;
            }
        }

        return caughtSomething;
    }

    createSplash(x, y) {
        for (let i = 0; i < 3; i++) {
            this.bubbles.push(new Bubble(x + Math.random() * 10 - 5, y));
        }
    }

    createBigSplash(x, y) {
        for (let i = 0; i < 8; i++) {
            this.bubbles.push(new Bubble(x + Math.random() * 20 - 10, y));
        }
    }

    createCatchEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            this.bubbles.push(new Bubble(x + Math.random() * 15 - 7.5, y));
        }
    }

    generateSeaweed() {
        for (let i = 0; i < 5; i++) {
            const seaweed = new GameObject(
                30 + i * 50 + Math.random() * 20,
                160 + Math.random() * 20,
                'seaweed',
                this.renderer.sprites.seaweed
            );
            seaweed.animSpeed = 15 + Math.random() * 10;
            this.seaweeds.push(seaweed);
        }
    }

    spawnInitialFishes() {
        for (let i = 0; i < 3; i++) {
            this.spawnFish();
        }
    }

    spawnFish() {
        const types = [
            { sprite: 'fish1', speed: 0.5, points: 10 },
            { sprite: 'fish2', speed: 0.8, points: 20 },
            { sprite: 'fish3', speed: 1.2, points: 30 }
        ];

        const type = types[Math.floor(Math.random() * types.length)];
        const fromLeft = Math.random() < 0.5;

        const fish = new Fish(
            fromLeft ? -20 : 276,
            this.waterLevel + 10 + Math.random() * 100,
            type.sprite,
            this.renderer.sprites[type.sprite],
            fromLeft ? type.speed : -type.speed,
            type.points
        );

        this.fishes.push(fish);
    }

    spawnTreasure() {
        if (this.treasures.length < 1 && Math.random() < 0.01) {
            const treasure = new GameObject(
                50 + Math.random() * 156,
                140 + Math.random() * 40,
                'treasure',
                this.renderer.sprites.treasure
            );
            this.treasures.push(treasure);
        }
    }

    update() {
        this.frameCount++;

        if (this.frameCount - this.lastFishSpawn > this.fishSpawnInterval) {
            if (this.fishes.length < 6) {
                this.spawnFish();
                this.lastFishSpawn = this.frameCount;
            }
        }

        this.spawnTreasure();

        this.fishes.forEach(fish => fish.update());
        this.fishes = this.fishes.filter(fish => fish.x > -30 && fish.x < 286);

        this.bubbles.forEach(bubble => bubble.update());
        this.bubbles = this.bubbles.filter(bubble => bubble.update());

        this.seaweeds.forEach(seaweed => seaweed.update());

        if (this.isLineCast) {
            if (this.lineY < this.waterLevel + this.maxDepth) {
                this.lineY += this.lineSpeed;
                this.depth = Math.floor(this.lineY - this.waterLevel);
                document.getElementById('depth').textContent = this.depth;
            }

            if (Math.random() < 0.02) {
                this.bubbles.push(new Bubble(this.lineX, this.lineY));
            }
        }
    }

    drawBackground() {
        for (let y = 0; y < this.waterLevel; y++) {
            const gradient = y / this.waterLevel;
            const colorIndex = Math.floor(gradient * (COLORS.SKY.length - 1));
            this.ctx.fillStyle = COLORS.SKY[colorIndex];
            this.ctx.fillRect(0, y, 256, 1);
        }

        for (let y = this.waterLevel; y < 192; y++) {
            const gradient = (y - this.waterLevel) / (192 - this.waterLevel);
            const colorIndex = Math.floor(gradient * (COLORS.WATER.length - 1));
            this.ctx.fillStyle = COLORS.WATER[colorIndex];
            this.ctx.fillRect(0, y, 256, 1);
        }

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < 3; i++) {
            const waveY = this.waterLevel + Math.sin(this.frameCount * 0.02 + i * 2) * 2;
            this.ctx.fillRect(0, waveY + i * 3, 256, 1);
        }
    }

    drawGameObjects() {
        this.seaweeds.forEach(seaweed => {
            this.renderer.drawSprite(
                this.ctx,
                seaweed.getCurrentSprite(),
                seaweed.x,
                seaweed.y
            );
        });

        this.treasures.forEach(treasure => {
            this.renderer.drawSprite(
                this.ctx,
                treasure.sprite,
                treasure.x,
                treasure.y
            );
        });

        this.fishes.forEach(fish => {
            this.renderer.drawSprite(
                this.ctx,
                fish.getCurrentSprite(),
                fish.x,
                fish.y + fish.verticalOffset,
                fish.direction < 0
            );
        });

        this.bubbles.forEach(bubble => {
            if (bubble.size > 0) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                this.ctx.beginPath();
                this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        this.renderer.drawSprite(
            this.ctx,
            this.renderer.sprites.boat,
            this.boatX - 10,
            this.boatY
        );

        this.renderer.drawSprite(
            this.ctx,
            this.renderer.sprites.fisher,
            this.boatX - 8,
            this.boatY - 16
        );

        if (this.isLineCast) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.boatX, this.boatY);
            this.ctx.lineTo(this.lineX, this.lineY);
            this.ctx.stroke();

            this.renderer.drawSprite(
                this.ctx,
                this.renderer.sprites.hook,
                this.lineX - 2,
                this.lineY
            );
        }
    }

    updateScore() {
        const scoreStr = String(this.score).padStart(5, '0');
        document.getElementById('score').textContent = scoreStr;
    }

    updateLives() {
        let hearts = '';
        for (let i = 0; i < this.lives; i++) {
            hearts += '♥';
        }
        document.getElementById('lives').textContent = hearts;
    }

    render() {
        this.drawBackground();
        this.drawGameObjects();
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RetroFishingGame();
});