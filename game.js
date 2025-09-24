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

const GAME_STATES = {
    IDLE: 'idle',
    CHARGING: 'charging',
    CASTING: 'casting',
    SINKING: 'sinking',
    WAITING: 'waiting',
    HOOKED: 'hooked',
    REELING: 'reeling'
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
    constructor(x, y, type, sprite, baseSpeed, points) {
        super(x, y, type, sprite);
        this.baseSpeed = baseSpeed;
        this.speed = baseSpeed;
        this.points = points;
        this.direction = baseSpeed > 0 ? 1 : -1;
        this.targetY = y;
        this.wanderTimer = 0;
        this.wanderInterval = 60 + Math.random() * 60;
        this.state = 'wandering';
        this.biteDistance = 35;
        this.chaseSpeed = 1.5;
        this.hooked = false;
        this.baseY = y;
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

        this.state = GAME_STATES.IDLE;
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

        this.waterLevel = 48;
        this.boatX = 85;
        this.boatY = 38;

        this.frameCount = 0;
        this.lastFishSpawn = 0;
        this.fishSpawnInterval = 140;

        this.mouseDown = false;
        this.canCast = true;
        this.isReeling = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateSeaweed();
        this.spawnInitialFishes();
        this.updateUI();
        this.gameLoop();
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
        if (this.state === GAME_STATES.IDLE && this.canCast) {
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
            }
        });
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
            this.score += this.hookedFish.points;
            const fishIndex = this.fishes.indexOf(this.hookedFish);
            if (fishIndex > -1) {
                this.fishes.splice(fishIndex, 1);
            }
            this.hookedFish = null;
            this.createBigSplash(this.lineX, this.waterLevel);
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
        const types = [
            { sprite: 'fish1', speed: 0.5, points: 10 },
            { sprite: 'fish2', speed: 0.7, points: 20 },
            { sprite: 'fish3', speed: 0.9, points: 30 }
        ];

        const type = types[Math.floor(Math.random() * types.length)];
        const fromLeft = Math.random() < 0.65;

        const fish = new Fish(
            fromLeft ? -20 : 276,
            this.waterLevel + 30 + Math.random() * 70,
            type.sprite,
            this.renderer.sprites[type.sprite],
            fromLeft ? type.speed : -type.speed,
            type.points
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

    update() {
        this.frameCount++;

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

    drawPowerMeter() {
        if (this.state === GAME_STATES.CHARGING) {
            const meterX = this.boatX - 22;
            const meterY = this.boatY - 26;
            const meterWidth = 44;
            const meterHeight = 5;

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(meterX - 1, meterY - 1, meterWidth + 2, meterHeight + 2);

            const fillWidth = (this.powerCharge / this.maxPower) * meterWidth;
            const hue = (1 - this.powerCharge / this.maxPower) * 120;
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
            this.boatY
        );

        this.renderer.drawSprite(
            this.ctx,
            this.renderer.sprites.fisher,
            this.boatX - 8,
            this.boatY - 16
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

        if (this.state === GAME_STATES.IDLE) {
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