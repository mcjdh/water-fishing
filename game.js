const COLORS = {
    SKY: ['#FF6B9D', '#FF8BA7', '#FFA5B8', '#FFB5C5'],
    WATER: ['#1a4d5c', '#266b7a', '#2d8299', '#3d98b0'],
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

const GAME_STATES = {
    TITLE: 'title',
    IDLE: 'idle',
    CHARGING: 'charging',
    CASTING: 'casting',
    SINKING: 'sinking',
    WAITING: 'waiting',
    HOOKED: 'hooked',
    REELING: 'reeling',
    GAME_OVER: 'gameover'
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
                '           ',
                '           ',
                '  .......  ',
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
                ' . ',
                '.W.',
                ' . '
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
            ],
            cloud: [
                '  .....  ',
                ' ....... ',
                '.........'
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
    constructor(x, y, type, sprite, baseSpeed, points, biteDistance = 35, struggleStrength = 0) {
        super(x, y, type, sprite);
        this.baseSpeed = baseSpeed;
        this.speed = baseSpeed;
        this.points = points;
        this.direction = baseSpeed > 0 ? 1 : -1;
        this.targetY = y;
        this.wanderTimer = 0;
        this.wanderInterval = 60 + Math.random() * 60;
        this.state = 'wandering';
        this.biteDistance = biteDistance;
        this.chaseSpeed = 1.5;
        this.hooked = false;
        this.baseY = y;
        this.struggleStrength = struggleStrength;
        this.struggleTimer = 0;
    }

    updateWander() {
        super.update();

        if (this.hooked) {
            return;
        }

        this.x += this.speed;

        this.wanderTimer++;
        if (this.wanderTimer > this.wanderInterval) {
            this.wanderTimer = 0;
            this.wanderInterval = 60 + Math.random() * 60;
            this.targetY = this.baseY + (Math.random() - 0.5) * 25;
            this.targetY = Math.max(65, Math.min(170, this.targetY));
        }

        const yDiff = this.targetY - this.y;
        this.y += yDiff * 0.02;
    }

    tryBite(hookX, hookY) {
        if (this.hooked) {
            return false;
        }

        const dx = hookX - this.x;
        const dy = hookY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.biteDistance && this.state !== 'fleeing') {
            this.state = 'chasing';

            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * this.chaseSpeed;
            this.y += Math.sin(angle) * this.chaseSpeed;

            this.direction = dx > 0 ? 1 : -1;

            if (distance < 15) {
                return true;
            }
        } else if (this.state === 'chasing') {
            this.state = 'fleeing';
            this.speed = this.baseSpeed * 1.8;
            setTimeout(() => {
                this.state = 'wandering';
                this.speed = this.baseSpeed;
            }, 1200);
        }

        return false;
    }

    updateStruggle() {
        if (this.hooked && this.struggleStrength > 0) {
            this.struggleTimer++;
            if (this.struggleTimer > 40 && Math.random() < this.struggleStrength * 0.008) {
                return true;
            }
        }
        return false;
    }
}

class Bubble extends GameObject {
    constructor(x, y) {
        super(x, y, 'bubble', null);
        this.size = 1;
        this.riseSpeed = 0.3 + Math.random() * 0.3;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.1;
        this.lifetime = 150 + Math.random() * 50;
        this.age = 0;
    }

    update() {
        this.y -= this.riseSpeed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.2;
        this.age++;

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
        this.depth = 0;
        this.lives = 3;
        this.combo = 0;
        this.comboTimer = 0;
        this.comboTimeout = 180;
        this.highScore = parseInt(localStorage.getItem('fishingHighScore') || '0');

        this.state = GAME_STATES.TITLE;
        this.powerCharge = 0;
        this.maxPower = 100;
        this.powerChargeSpeed = 2.0;

        this.lineX = 0;
        this.lineY = 0;
        this.lineVelocityX = 0;
        this.lineVelocityY = 0;
        this.lineSinkSpeed = 1.0;
        this.lineReelSpeed = 2.2;
        this.gravity = 0.2;

        this.fishes = [];
        this.hookedFish = null;
        this.bubbles = [];
        this.seaweeds = [];
        this.treasures = [];
        this.clouds = [];

        this.waterLevel = 48;
        this.boatX = 85;
        this.boatY = 38;

        this.frameCount = 0;
        this.lastFishSpawn = 0;
        this.fishSpawnInterval = 140;
        this.baseFishSpawnInterval = 140;
        this.difficultyLevel = 1;

        this.mouseDown = false;
        this.canCast = true;
        this.isReeling = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateClouds();
        this.generateSeaweed();
        this.spawnInitialFishes();
        this.updateUI();
        this.gameLoop();
    }

    generateClouds() {
        for (let i = 0; i < 4; i++) {
            this.clouds.push(new GameObject(
                Math.random() * 230,
                8 + Math.random() * 20,
                'cloud',
                this.renderer.sprites.cloud
            ));
        }
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleInputStart(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleInputEnd(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleInputEnd(e));

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInputStart(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleInputEnd();
        });
    }

    handleInputStart(e) {
        if (this.state === GAME_STATES.TITLE) {
            this.startGame();
        } else if (this.state === GAME_STATES.GAME_OVER) {
            this.restartGame();
        } else if (this.state === GAME_STATES.IDLE && this.canCast) {
            this.state = GAME_STATES.CHARGING;
            this.powerCharge = 0;
            this.mouseDown = true;
        } else if (this.state === GAME_STATES.SINKING || this.state === GAME_STATES.WAITING || this.state === GAME_STATES.HOOKED) {
            this.startReeling();
        }
    }

    handleInputEnd(e) {
        if (this.state === GAME_STATES.CHARGING && this.mouseDown) {
            this.castLine();
        } else if (this.state === GAME_STATES.REELING) {
            this.stopReeling();
        }
        this.mouseDown = false;
    }

    castLine() {
        this.state = GAME_STATES.CASTING;
        this.canCast = false;

        const power = Math.min(this.powerCharge, this.maxPower) / this.maxPower;
        const baseAngle = -Math.PI / 5.5;
        const angleVariation = power * (Math.PI / 15);
        const angle = baseAngle - angleVariation;

        const minVelocity = 3;
        const maxVelocity = 5.5;
        const velocity = minVelocity + power * (maxVelocity - minVelocity);

        this.lineX = this.boatX;
        this.lineY = this.waterLevel;
        this.lineVelocityX = Math.cos(angle) * velocity;
        this.lineVelocityY = Math.sin(angle) * velocity;

        this.createSplash(this.lineX, this.waterLevel);
        this.powerCharge = 0;
    }

    startReeling() {
        this.state = GAME_STATES.REELING;
        this.isReeling = true;
    }

    stopReeling() {
        if (this.state === GAME_STATES.REELING) {
            this.state = this.hookedFish ? GAME_STATES.HOOKED : GAME_STATES.WAITING;
            this.isReeling = false;
        }
    }

    updateFish() {
        this.fishes.forEach(fish => {
            if (!fish.hooked) {
                fish.updateWander();
            } else if (fish.updateStruggle()) {
                this.fishEscaped(fish);
            }
        });
    }

    fishEscaped(fish) {
        fish.hooked = false;
        fish.state = 'fleeing';
        fish.speed = fish.baseSpeed * 2.2;
        if (this.hookedFish === fish) {
            this.hookedFish = null;
            this.state = GAME_STATES.WAITING;
        }
        setTimeout(() => {
            fish.state = 'wandering';
            fish.speed = fish.baseSpeed;
        }, 1500);
        this.createBigSplash(this.lineX, this.lineY);
    }

    checkFishBite() {
        if (this.hookedFish) return;

        const isHookActive = this.state === GAME_STATES.SINKING ||
                            this.state === GAME_STATES.WAITING ||
                            this.state === GAME_STATES.REELING;

        if (!isHookActive) return;

        const fishDistances = this.fishes.map(fish => {
            const dx = fish.x - this.lineX;
            const dy = fish.y - this.lineY;
            return {
                fish: fish,
                distance: Math.sqrt(dx * dx + dy * dy)
            };
        }).sort((a, b) => a.distance - b.distance);

        if (fishDistances.length > 0 && fishDistances[0].distance < 45) {
            const closestFish = fishDistances[0].fish;
            const caught = closestFish.tryBite(this.lineX, this.lineY);

            if (caught && !this.hookedFish) {
                this.hookedFish = closestFish;
                this.state = GAME_STATES.HOOKED;
                closestFish.hooked = true;
                this.createBiteEffect();
            }
        }
    }

    checkTreasureCollection() {
        if (this.state !== GAME_STATES.SINKING &&
            this.state !== GAME_STATES.WAITING &&
            this.state !== GAME_STATES.REELING) return;

        this.treasures = this.treasures.filter(treasure => {
            const dx = treasure.x - this.lineX;
            const dy = treasure.y - this.lineY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20) {
                this.score += 100;
                this.createBigSplash(treasure.x, treasure.y);
                this.updateUI();
                return false;
            }
            return true;
        });
    }

    createBiteEffect() {
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 / 10) * i;
            this.bubbles.push(new Bubble(
                this.lineX + Math.cos(angle) * 12,
                this.lineY + Math.sin(angle) * 12
            ));
        }
    }

    landFish() {
        if (this.hookedFish) {
            const comboMultiplier = Math.min(1 + this.combo * 0.5, 3);
            this.score += Math.floor(this.hookedFish.points * comboMultiplier);
            this.combo++;
            this.comboTimer = 0;

            const fishIndex = this.fishes.indexOf(this.hookedFish);
            if (fishIndex > -1) {
                this.fishes.splice(fishIndex, 1);
            }
            this.hookedFish = null;
            this.createBigSplash(this.lineX, this.waterLevel);
            this.updateDifficulty();
            this.updateUI();
        }
    }

    createSplash(x, y) {
        for (let i = 0; i < 4; i++) {
            this.bubbles.push(new Bubble(x + Math.random() * 12 - 6, y));
        }
    }

    createBigSplash(x, y) {
        for (let i = 0; i < 12; i++) {
            this.bubbles.push(new Bubble(x + Math.random() * 24 - 12, y));
        }
    }

    generateSeaweed() {
        const positions = [35, 100, 165, 230];
        positions.forEach(x => {
            const seaweed = new GameObject(
                x + Math.random() * 15 - 7.5,
                165 + Math.random() * 15,
                'seaweed',
                this.renderer.sprites.seaweed
            );
            seaweed.animSpeed = 15 + Math.random() * 10;
            this.seaweeds.push(seaweed);
        });
    }

    spawnInitialFishes() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.spawnFish(), i * 800);
        }
    }

    spawnFish() {
        const speedMultiplier = 1 + (this.difficultyLevel - 1) * 0.15;
        const types = [
            { sprite: 'fish1', speed: 0.5 * speedMultiplier, points: 10, biteDistance: 40, struggle: 0.3 },
            { sprite: 'fish2', speed: 0.7 * speedMultiplier, points: 20, biteDistance: 35, struggle: 0.6 },
            { sprite: 'fish3', speed: 0.9 * speedMultiplier, points: 30, biteDistance: 30, struggle: 0.9 }
        ];

        const type = types[Math.floor(Math.random() * types.length)];
        const fromLeft = Math.random() < 0.5;

        const fish = new Fish(
            fromLeft ? -20 : 276,
            this.waterLevel + 30 + Math.random() * 70,
            type.sprite,
            this.renderer.sprites[type.sprite],
            fromLeft ? type.speed : -type.speed,
            type.points,
            type.biteDistance,
            type.struggle
        );

        this.fishes.push(fish);
    }

    spawnTreasure() {
        if (this.treasures.length < 1 && Math.random() < 0.0015) {
            const treasure = new GameObject(
                110 + Math.random() * 110,
                145 + Math.random() * 30,
                'treasure',
                this.renderer.sprites.treasure
            );
            this.treasures.push(treasure);
        }
    }

    startGame() {
        this.state = GAME_STATES.IDLE;
        this.score = 0;
        this.lives = 3;
        this.combo = 0;
        this.comboTimer = 0;
        this.difficultyLevel = 1;
        this.fishSpawnInterval = this.baseFishSpawnInterval;
        this.fishes = [];
        this.treasures = [];
        this.hookedFish = null;
        this.spawnInitialFishes();
        this.updateUI();
    }

    restartGame() {
        this.startGame();
    }

    loseLife() {
        this.lives--;
        this.combo = 0;
        this.updateUI();
        this.createBigSplash(this.boatX, this.waterLevel);

        if (this.lives <= 0) {
            this.state = GAME_STATES.GAME_OVER;
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('fishingHighScore', this.score.toString());
            }
        }
    }

    updateDifficulty() {
        const oldLevel = this.difficultyLevel;
        this.difficultyLevel = Math.floor(this.score / 100) + 1;

        if (this.difficultyLevel !== oldLevel) {
            this.fishSpawnInterval = Math.max(60, this.baseFishSpawnInterval - (this.difficultyLevel - 1) * 12);
        }
    }

    update() {
        this.frameCount++;

        if (this.state === GAME_STATES.TITLE || this.state === GAME_STATES.GAME_OVER) {
            this.fishes.forEach(fish => fish.updateWander());
            this.bubbles = this.bubbles.filter(bubble => bubble.update());
            this.seaweeds.forEach(seaweed => seaweed.update());
            return;
        }

        if (this.combo > 0) {
            this.comboTimer++;
            if (this.comboTimer > this.comboTimeout) {
                this.combo = 0;
            }
        }

        switch(this.state) {
            case GAME_STATES.IDLE:
                this.canCast = true;
                break;

            case GAME_STATES.CHARGING:
                if (this.mouseDown && this.powerCharge < this.maxPower) {
                    this.powerCharge += this.powerChargeSpeed;
                }
                break;

            case GAME_STATES.CASTING:
                this.lineVelocityY += this.gravity;
                this.lineX += this.lineVelocityX;
                this.lineY += this.lineVelocityY;

                this.lineX = Math.max(25, Math.min(245, this.lineX));

                if (this.lineY >= this.waterLevel) {
                    this.lineY = this.waterLevel;
                    this.state = GAME_STATES.SINKING;
                    this.createSplash(this.lineX, this.waterLevel);
                }
                break;

            case GAME_STATES.SINKING:
                if (this.lineY < 168) {
                    this.lineY += this.lineSinkSpeed;
                    this.depth = Math.floor(this.lineY - this.waterLevel);

                    if (Math.random() < 0.02) {
                        this.bubbles.push(new Bubble(this.lineX, this.lineY));
                    }
                } else {
                    this.state = GAME_STATES.WAITING;
                }
                break;

            case GAME_STATES.WAITING:
                if (this.frameCount % 50 === 0) {
                    this.bubbles.push(new Bubble(
                        this.lineX + Math.random() * 6 - 3,
                        this.lineY
                    ));
                }
                break;

            case GAME_STATES.HOOKED:
                if (this.hookedFish) {
                    this.hookedFish.x = this.lineX + Math.sin(this.frameCount * 0.15) * 3;
                    this.hookedFish.y = this.lineY + Math.cos(this.frameCount * 0.12) * 2;

                    if (Math.random() < 0.07) {
                        this.bubbles.push(new Bubble(
                            this.lineX + (Math.random() - 0.5) * 10,
                            this.lineY
                        ));
                    }
                }
                break;

            case GAME_STATES.REELING:
                if (this.lineY > this.waterLevel + 6) {
                    this.lineY -= this.lineReelSpeed;
                    this.depth = Math.floor(Math.max(0, this.lineY - this.waterLevel));

                    const targetX = this.boatX;
                    const pullStrength = 0.1;
                    this.lineX += (targetX - this.lineX) * pullStrength;

                    if (this.hookedFish) {
                        this.hookedFish.x = this.lineX;
                        this.hookedFish.y = this.lineY;
                    }

                    if (Math.random() < 0.12) {
                        this.bubbles.push(new Bubble(
                            this.lineX + Math.random() * 8 - 4,
                            this.lineY
                        ));
                    }
                } else {
                    if (this.hookedFish) {
                        this.landFish();
                    } else {
                        this.loseLife();
                    }
                    this.state = GAME_STATES.IDLE;
                    this.depth = 0;
                    this.lineX = this.boatX;
                    this.lineY = this.waterLevel;
                    this.isReeling = false;
                }
                break;
        }

        this.updateFish();
        this.checkFishBite();
        this.checkTreasureCollection();

        if (this.frameCount - this.lastFishSpawn > this.fishSpawnInterval) {
            if (this.fishes.length < 5) {
                this.spawnFish();
                this.lastFishSpawn = this.frameCount;
            }
        }

        this.spawnTreasure();

        this.fishes = this.fishes.filter(fish =>
            (fish.x > -30 && fish.x < 286) || fish.hooked
        );

        this.bubbles = this.bubbles.filter(bubble => bubble.update());
        this.seaweeds.forEach(seaweed => seaweed.update());

        document.getElementById('depth').textContent = this.depth;
    }

    drawBackground() {
        for (let y = 0; y < this.waterLevel; y++) {
            const gradient = y / this.waterLevel;
            const colorIndex = Math.floor(gradient * (COLORS.SKY.length - 1));
            this.ctx.fillStyle = COLORS.SKY[colorIndex];
            this.ctx.fillRect(0, y, 256, 1);
        }

        this.clouds.forEach(cloud => {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            cloud.x += 0.08;
            if (cloud.x > 260) cloud.x = -20;
            this.renderer.drawSprite(
                this.ctx,
                cloud.sprite,
                cloud.x,
                cloud.y
            );
        });

        for (let y = this.waterLevel; y < 192; y++) {
            const gradient = (y - this.waterLevel) / (192 - this.waterLevel);
            const colorIndex = Math.floor(gradient * (COLORS.WATER.length - 1));
            this.ctx.fillStyle = COLORS.WATER[colorIndex];
            this.ctx.fillRect(0, y, 256, 1);
        }

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let i = 0; i < 5; i++) {
            const waveY = this.waterLevel + Math.sin(this.frameCount * 0.03 + i * 1.5) * 1.5;
            this.ctx.fillRect(0, waveY + i * 2, 256, 1);
        }
    }

    drawPowerMeter() {
        if (this.state === GAME_STATES.CHARGING) {
            const meterX = this.boatX - 22;
            const meterY = this.boatY - 26;
            const meterWidth = 44;
            const meterHeight = 5;

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(meterX - 1, meterY - 1, meterWidth + 2, meterHeight + 2);

            const fillWidth = (this.powerCharge / this.maxPower) * meterWidth;
            const hue = (this.powerCharge / this.maxPower) * 120;
            this.ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            this.ctx.fillRect(meterX, meterY, fillWidth, meterHeight);

            this.ctx.strokeStyle = COLORS.WHITE;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);

            for (let i = 1; i < 3; i++) {
                const x = meterX + (meterWidth / 3) * i;
                this.ctx.beginPath();
                this.ctx.moveTo(x, meterY);
                this.ctx.lineTo(x, meterY + meterHeight);
                this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
                this.ctx.stroke();
            }
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
            if (!fish.hooked) {
                this.renderer.drawSprite(
                    this.ctx,
                    fish.getCurrentSprite(),
                    fish.x,
                    fish.y,
                    fish.direction < 0
                );
            }
        });

        if (this.hookedFish) {
            this.renderer.drawSprite(
                this.ctx,
                this.hookedFish.getCurrentSprite(),
                this.hookedFish.x,
                this.hookedFish.y,
                this.hookedFish.direction < 0
            );
        }

        this.bubbles.forEach(bubble => {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.renderer.drawSprite(
            this.ctx,
            this.renderer.sprites.boat,
            this.boatX - 10,
            this.boatY + 2
        );

        this.renderer.drawSprite(
            this.ctx,
            this.renderer.sprites.fisher,
            this.boatX - 8,
            this.boatY - 10
        );

        if (this.state !== GAME_STATES.IDLE && this.state !== GAME_STATES.CHARGING) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.boatX, this.boatY);

            if (this.state === GAME_STATES.CASTING) {
                this.ctx.quadraticCurveTo(
                    (this.boatX + this.lineX) / 2,
                    Math.min(this.lineY, this.boatY) - 16,
                    this.lineX,
                    this.lineY
                );
            } else {
                this.ctx.lineTo(this.lineX, this.lineY);
            }
            this.ctx.stroke();

            this.renderer.drawSprite(
                this.ctx,
                this.renderer.sprites.hook,
                this.lineX - 2,
                this.lineY
            );
        }

        this.drawPowerMeter();

        if (this.state === GAME_STATES.HOOKED) {
            this.ctx.fillStyle = COLORS.YELLOW;
            this.ctx.font = 'bold 8px monospace';
            this.ctx.fillText('HOOKED!', this.lineX - 22, this.lineY - 12);
        }

        if (this.combo > 1) {
            this.ctx.fillStyle = COLORS.YELLOW;
            this.ctx.font = 'bold 10px monospace';
            const comboText = `COMBO x${this.combo}!`;
            this.ctx.fillText(comboText, 128 - comboText.length * 3, 20);
        }

        if (this.state === GAME_STATES.TITLE) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.75)';
            this.ctx.fillRect(0, 0, 256, 192);

            this.ctx.fillStyle = COLORS.YELLOW;
            this.ctx.font = 'bold 16px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('8-BIT FISHING', 128, 70);

            this.ctx.fillStyle = COLORS.WHITE;
            this.ctx.font = '8px monospace';
            this.ctx.fillText('CLICK TO START', 128, 110);

            if (this.highScore > 0) {
                this.ctx.fillStyle = COLORS.GREEN;
                this.ctx.font = '7px monospace';
                this.ctx.fillText(`HIGH SCORE: ${this.highScore}`, 128, 135);
            }
            this.ctx.textAlign = 'left';
        } else if (this.state === GAME_STATES.GAME_OVER) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.75)';
            this.ctx.fillRect(0, 0, 256, 192);

            this.ctx.fillStyle = COLORS.RED;
            this.ctx.font = 'bold 16px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', 128, 70);

            this.ctx.fillStyle = COLORS.YELLOW;
            this.ctx.font = '10px monospace';
            this.ctx.fillText(`SCORE: ${this.score}`, 128, 95);

            if (this.score === this.highScore && this.score > 0) {
                this.ctx.fillStyle = COLORS.GREEN;
                this.ctx.font = '8px monospace';
                this.ctx.fillText('NEW HIGH SCORE!', 128, 115);
            } else if (this.highScore > 0) {
                this.ctx.fillStyle = COLORS.WHITE;
                this.ctx.font = '8px monospace';
                this.ctx.fillText(`HIGH: ${this.highScore}`, 128, 115);
            }

            this.ctx.fillStyle = COLORS.WHITE;
            this.ctx.font = '7px monospace';
            this.ctx.fillText('CLICK TO RESTART', 128, 145);
            this.ctx.textAlign = 'left';
        } else if (this.state === GAME_STATES.IDLE) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = '7px monospace';
            this.ctx.fillText('HOLD TO CAST', 6, 186);
        } else if (this.state === GAME_STATES.SINKING || this.state === GAME_STATES.WAITING || this.state === GAME_STATES.HOOKED) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = '7px monospace';
            this.ctx.fillText('HOLD TO REEL', 6, 186);
        } else if (this.state === GAME_STATES.REELING) {
            this.ctx.fillStyle = 'rgba(255,255,0,0.85)';
            this.ctx.font = '7px monospace';
            this.ctx.fillText('REELING...', 6, 186);
        }
    }

    updateUI() {
        const scoreStr = String(this.score).padStart(5, '0');
        document.getElementById('score').textContent = scoreStr;

        const livesStr = '♥'.repeat(this.lives) + '♡'.repeat(Math.max(0, 3 - this.lives));
        document.getElementById('lives').textContent = livesStr;
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