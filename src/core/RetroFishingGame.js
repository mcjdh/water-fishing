import { COLORS, GAME_STATES, GAME_DIMENSIONS, BOAT_POSITION, MAX_FISH_ON_SCREEN } from '../config/constants.js';
import { AUDIO_CUES } from '../config/audioCues.js';
import { FISH_TYPES } from '../config/fishTypes.js';
import { TUNING } from '../config/tuning.js';
import { clamp, randomRange, TWO_PI } from '../utils/math.js';
import { SpriteRenderer } from '../rendering/SpriteRenderer.js';
import { GameObject } from '../entities/GameObject.js';
import { Fish } from '../entities/Fish.js';
import { Bubble } from '../entities/Bubble.js';
import { AudioSystem } from '../systems/audio.js';
import { UISystem } from '../systems/ui.js';
import { stateHandlers } from '../states/stateHandlers.js';

export class RetroFishingGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.dimensions = GAME_DIMENSIONS;
        this.canvas.width = this.dimensions.WIDTH;
        this.canvas.height = this.dimensions.HEIGHT;
        this.ctx.imageSmoothingEnabled = false;

        this.renderer = new SpriteRenderer();
        this.audio = new AudioSystem();
        this.ui = new UISystem();

        this.score = 0;
        this.depth = 0;
        this.lives = 3;
        this.combo = 0;
        this.comboTimer = 0;
        this.comboTimeout = 180;
        this.highScore = parseInt(localStorage.getItem('fishingHighScore') || '0', 10);

        this.state = GAME_STATES.TITLE;
        this.powerCharge = 0;
        this.maxPower = 100;
        this.powerChargeSpeed = TUNING.chargingPowerStep;

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
        this.stars = [];

        this.waterLevel = this.dimensions.WATER_LINE;
        this.boatX = BOAT_POSITION.X;
        this.boatY = BOAT_POSITION.Y;

        this.frameCount = 0;
        this.lastFishSpawn = 0;
        this.fishSpawnInterval = 140;
        this.baseFishSpawnInterval = 140;
        this.difficultyLevel = 1;

        this.mouseDown = false;
        this.canCast = true;
        this.isReeling = false;

        this.tension = 0;
        this.tensionSafeMin = 35;
        this.tensionSafeMax = 65;
        this.tensionDangerTimer = 0;
        this.tensionBreakWindow = 110;
        this.fightStartDepth = 0;
        this.fightDepthLimit = 0;
        this.fishSurgePhase = randomRange(0, TWO_PI);
        this.wasTensionSafe = true;

        this.stateHandlers = stateHandlers;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateStars();
        this.generateClouds();
        this.generateSeaweed();
        this.spawnInitialFishes();
        this.updateUI();
        this.resetLine();
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

    ensureAudio() {
        this.audio.ensureContext();
    }

    playCue(name, overrides = {}) {
        const cue = AUDIO_CUES[name];
        if (!cue) return;
        const payload = { ...cue, ...overrides };
        this.audio.playTone(payload);
    }

    setState(newState) {
        this.state = newState;
    }

    handleInputStart() {
        this.ensureAudio();

        if (this.state === GAME_STATES.TITLE) {
            this.startGame();
        } else if (this.state === GAME_STATES.GAME_OVER) {
            this.restartGame();
        } else if (this.state === GAME_STATES.IDLE && this.canCast) {
            this.setState(GAME_STATES.CHARGING);
            this.powerCharge = 0;
            this.mouseDown = true;
        } else if (
            this.state === GAME_STATES.SINKING ||
            this.state === GAME_STATES.WAITING ||
            this.state === GAME_STATES.HOOKED
        ) {
            this.startReeling();
        }
    }

    handleInputEnd() {
        if (this.state === GAME_STATES.CHARGING && this.mouseDown) {
            this.castLine();
        } else if (this.state === GAME_STATES.REELING) {
            this.stopReeling();
        }
        this.mouseDown = false;
    }

    castLine() {
        this.setState(GAME_STATES.CASTING);
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
        this.setState(GAME_STATES.REELING);
        this.isReeling = true;
    }

    stopReeling() {
        if (this.state === GAME_STATES.REELING) {
            this.setState(this.hookedFish ? GAME_STATES.HOOKED : GAME_STATES.WAITING);
            this.isReeling = false;
        }
    }

    resetLine() {
        this.depth = 0;
        this.lineX = this.boatX;
        this.lineY = this.waterLevel;
        this.lineVelocityX = 0;
        this.lineVelocityY = 0;
        this.isReeling = false;
    }

    generateClouds() {
        for (let i = 0; i < 4; i++) {
            this.clouds.push(new GameObject(
                randomRange(-10, this.dimensions.WIDTH - 26),
                randomRange(8, 28),
                'cloud',
                this.renderer.sprites.cloud
            ));
        }
    }

    generateStars() {
        const starCount = 42;
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: randomRange(2, this.dimensions.WIDTH - 2),
                y: randomRange(4, this.waterLevel - 6),
                baseAlpha: randomRange(0.35, 0.75),
                radius: Math.random() < 0.2 ? 2 : 1,
                phase: randomRange(0, TWO_PI)
            });
        }
    }

    generateSeaweed() {
        const positions = [35, 100, 165, 230];
        positions.forEach((x) => {
            const seaweed = new GameObject(
                x + randomRange(-7.5, 7.5),
                randomRange(165, 180),
                'seaweed',
                this.renderer.sprites.seaweed
            );
            seaweed.animSpeed = randomRange(...TUNING.seaweedAnimRange);
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
        const type = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
        const fromLeft = Math.random() < 0.5;

        const spawnX = fromLeft ? -20 : this.dimensions.WIDTH + 20;
        const spawnY = randomRange(this.waterLevel + 30, this.waterLevel + 100);
        const directionSpeed = type.baseSpeed * speedMultiplier * (fromLeft ? 1 : -1);

        const fish = new Fish(
            spawnX,
            spawnY,
            type.sprite,
            this.renderer.sprites[type.sprite],
            directionSpeed,
            type.points,
            type.biteDistance,
            type.struggle
        );

        this.fishes.push(fish);
    }

    spawnTreasure() {
        if (this.treasures.length < 1 && Math.random() < 0.0015) {
            const treasure = new GameObject(
                randomRange(110, 220),
                randomRange(145, 175),
                'treasure',
                this.renderer.sprites.treasure
            );
            this.treasures.push(treasure);
        }
    }

    startGame() {
        this.setState(GAME_STATES.IDLE);
        this.score = 0;
        this.lives = 3;
        this.combo = 0;
        this.comboTimer = 0;
        this.difficultyLevel = 1;
        this.fishSpawnInterval = this.baseFishSpawnInterval;
        this.fishes = [];
        this.treasures = [];
        this.hookedFish = null;
        this.tension = 0;
        this.tensionDangerTimer = 0;
        this.spawnInitialFishes();
        this.updateUI();
        this.resetLine();
        this.canCast = TUNING.idleCastReady;
    }

    restartGame() {
        this.startGame();
    }

    loseLife() {
        this.lives--;
        this.combo = 0;
        this.updateUI();
        this.createBigSplash(this.boatX, this.waterLevel);
        this.playCue('lifeLost');

        if (this.lives <= 0) {
            this.setState(GAME_STATES.GAME_OVER);
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('fishingHighScore', this.score.toString());
            }
        }
    }

    setHighScore(score) {
        this.highScore = score;
        localStorage.setItem('fishingHighScore', score.toString());
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
            this.fishes.forEach((fish) => fish.updateWander());
            this.bubbles = this.bubbles.filter((bubble) => bubble.update());
            this.seaweeds.forEach((seaweed) => seaweed.update());
            return;
        }

        if (this.combo > 0) {
            this.comboTimer++;
            if (this.comboTimer > this.comboTimeout) {
                this.combo = 0;
            }
        }

        this.canCast = false;
        const handler = this.stateHandlers[this.state];
        if (handler) {
            handler(this);
        }

        this.updateFish();
        this.checkFishBite();
        this.checkTreasureCollection();

        if (this.frameCount - this.lastFishSpawn > this.fishSpawnInterval) {
            if (this.fishes.length < MAX_FISH_ON_SCREEN) {
                this.spawnFish();
                this.lastFishSpawn = this.frameCount;
            }
        }

        this.spawnTreasure();

        this.fishes = this.fishes.filter((fish) => (fish.x > -30 && fish.x < this.dimensions.WIDTH + 30) || fish.hooked);

        this.bubbles = this.bubbles.filter((bubble) => bubble.update());
        this.seaweeds.forEach((seaweed) => seaweed.update());

        this.ui.updateDepth(this.depth);
    }

    updateFish() {
        this.fishes.forEach((fish) => {
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
        fish.updateDirectionFromSpeed && fish.updateDirectionFromSpeed();
        if (this.hookedFish === fish) {
            this.hookedFish = null;
            this.setState(GAME_STATES.WAITING);
        }
        setTimeout(() => {
            fish.state = 'wandering';
            fish.speed = fish.baseSpeed;
            fish.updateDirectionFromSpeed && fish.updateDirectionFromSpeed();
        }, 1500);
        this.createBigSplash(this.lineX, this.lineY);
    }

    checkFishBite() {
        if (this.hookedFish) return;

        const isHookActive =
            this.state === GAME_STATES.SINKING ||
            this.state === GAME_STATES.WAITING ||
            this.state === GAME_STATES.REELING;

        if (!isHookActive) return;

        const fishDistances = this.fishes
            .map((fish) => {
                const dx = fish.x - this.lineX;
                const dy = fish.y - this.lineY;
                return {
                    fish,
                    distance: Math.sqrt(dx * dx + dy * dy)
                };
            })
            .sort((a, b) => a.distance - b.distance);

        if (fishDistances.length > 0 && fishDistances[0].distance < 45) {
            const closestFish = fishDistances[0].fish;
            const caught = closestFish.tryBite(this.lineX, this.lineY);

            if (caught && !this.hookedFish) {
                this.prepareFishFight(closestFish);
            }
        }
    }

    prepareFishFight(fish) {
        this.hookedFish = fish;
        this.setState(GAME_STATES.HOOKED);
        fish.hooked = true;
        fish.direction = this.boatX >= fish.x ? 1 : -1;

        this.fightStartDepth = this.lineY;
        this.fightDepthLimit = Math.min(this.waterLevel + 128, this.lineY + 32 + fish.struggleStrength * 12);

        const baseBand = 46 - fish.struggleStrength * 12;
        const band = Math.max(26, baseBand);
        const halfBand = band / 2;
        const center = 52 + randomRange(-5, 5);
        this.tensionSafeMin = Math.max(16, center - halfBand);
        this.tensionSafeMax = Math.min(84, center + halfBand);
        this.tensionDangerTimer = 0;
        this.fishSurgePhase = randomRange(0, TWO_PI);
        this.wasTensionSafe = true;

        const safeMid = (this.tensionSafeMin + this.tensionSafeMax) / 2;
        this.tension = clamp(safeMid + randomRange(-band * 0.15, band * 0.15), 0, 100);

        this.createBiteEffect();
        this.playCue('bite', {
            frequency: AUDIO_CUES.bite.frequency + fish.struggleStrength * (AUDIO_CUES.bite.scale || 0)
        });
    }

    checkTreasureCollection() {
        if (
            this.state !== GAME_STATES.SINKING &&
            this.state !== GAME_STATES.WAITING &&
            this.state !== GAME_STATES.REELING
        )
            return;

        this.treasures = this.treasures.filter((treasure) => {
            const dx = treasure.x - this.lineX;
            const dy = treasure.y - this.lineY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20) {
                this.score += 100;
                this.createBigSplash(treasure.x, treasure.y);
                this.playCue('treasure');
                this.updateUI();
                return false;
            }
            return true;
        });
    }

    createBiteEffect() {
        for (let i = 0; i < 10; i++) {
            const angle = (TWO_PI / 10) * i;
            this.bubbles.push(new Bubble(
                this.lineX + Math.cos(angle) * 12,
                this.lineY + Math.sin(angle) * 12
            ));
        }
    }

    createSplash(x, y) {
        for (let i = 0; i < 4; i++) {
            this.bubbles.push(new Bubble(x + randomRange(-TUNING.splashSmallOffset, TUNING.splashSmallOffset), y));
        }
    }

    createBigSplash(x, y) {
        for (let i = 0; i < 12; i++) {
            this.bubbles.push(new Bubble(x + randomRange(-TUNING.splashLargeOffset, TUNING.splashLargeOffset), y));
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
            this.playCue('land');
        }
    }

    loseFishToTension() {
        if (this.hookedFish) {
            this.fishEscaped(this.hookedFish);
            this.combo = 0;
            this.tensionDangerTimer = 0;
            this.tension = 0;
            this.isReeling = false;
            this.fightStartDepth = 0;
            this.fightDepthLimit = 0;
            this.playCue('escape');
        }
    }

    updateFishFight() {
        if (!this.hookedFish) {
            this.setState(GAME_STATES.WAITING);
            this.isReeling = false;
            return;
        }

        const fish = this.hookedFish;
        const surge = Math.sin(this.frameCount * 0.1 + this.fishSurgePhase);
        const surgeForce = surge * (0.45 + fish.struggleStrength * 0.55);
        const surgeInfluence = this.isReeling ? 0.45 : 0.28;
        const randomJerk = (Math.random() - 0.5) * fish.struggleStrength * 0.45;
        const reliefBase = 0.28 + fish.struggleStrength * 0.22;
        const pullStrength = 0.65 + fish.struggleStrength * 0.28;

        if (this.isReeling) {
            this.tension += pullStrength;
        } else {
            let reliefFactor = 1.3;
            if (this.tension > this.tensionSafeMax) {
                reliefFactor = 2.5;
            } else if (this.tension < this.tensionSafeMin) {
                reliefFactor = 0.8;
            }
            this.tension -= reliefBase * reliefFactor;

            const safeMid = (this.tensionSafeMin + this.tensionSafeMax) / 2;
            this.tension += (safeMid - this.tension) * 0.04;
        }

        this.tension += surgeForce * surgeInfluence + randomJerk;
        this.tension = clamp(this.tension, 0, 100);

        const inSafe = this.tension >= this.tensionSafeMin && this.tension <= this.tensionSafeMax;
        let verticalChange = 0;

        if (this.isReeling) {
            if (inSafe) {
                const tensionRange = Math.max(12, this.tensionSafeMax - this.tensionSafeMin);
                const proximity = (this.tension - this.tensionSafeMin) / tensionRange;
                const lift = this.lineReelSpeed * (0.55 + proximity * 0.35);
                verticalChange = -lift;
                this.lineX += (this.boatX - this.lineX) * 0.15;
            } else {
                verticalChange = reliefBase * 0.45;
                this.lineX += (this.boatX - this.lineX) * 0.08;
            }
        } else {
            if (this.tension > this.tensionSafeMax) {
                verticalChange = reliefBase * 1.3;
            } else if (this.tension < this.tensionSafeMin) {
                verticalChange = -reliefBase * 0.3;
            } else {
                verticalChange = reliefBase * 0.2;
            }
            this.lineX += (this.boatX - this.lineX) * 0.04;
        }

        this.lineY += verticalChange;
        this.lineY = clamp(this.lineY, this.waterLevel + 4, this.fightDepthLimit);
        this.depth = Math.floor(Math.max(0, this.lineY - this.waterLevel));

        const wiggle = Math.sin(this.frameCount * 0.18) * (3 + fish.struggleStrength * 1.4);
        fish.x = this.lineX + wiggle;
        fish.y = this.lineY + Math.cos(this.frameCount * 0.14) * (2 + fish.struggleStrength);
        fish.direction = this.boatX >= fish.x ? 1 : -1;

        if (Math.random() < 0.08) {
            this.bubbles.push(new Bubble(
                this.lineX + (Math.random() - 0.5) * 10,
                this.lineY
            ));
        }

        if (inSafe) {
            this.tensionDangerTimer = Math.max(0, this.tensionDangerTimer - 4);
            if (!this.wasTensionSafe) {
                this.playCue('tensionEnterSafe');
            }
        } else {
            this.tensionDangerTimer++;
            if (this.wasTensionSafe) {
                this.playCue('tensionLeaveSafe');
            }
            if (this.tensionDangerTimer === Math.ceil(this.tensionBreakWindow * 0.5)) {
                this.playCue('tensionMidWarning');
            }
            if (this.tensionDangerTimer > this.tensionBreakWindow) {
                this.loseFishToTension();
                return;
            }
        }

        this.wasTensionSafe = inSafe;

        if (this.lineY <= this.waterLevel + 6) {
            this.landFish();
            this.resetAfterCatch();
        }
    }

    resetAfterCatch() {
        this.setState(GAME_STATES.IDLE);
        this.resetLine();
        this.tension = 0;
        this.tensionDangerTimer = 0;
        this.fightStartDepth = 0;
        this.fightDepthLimit = 0;
        this.wasTensionSafe = true;
    }

    drawBackground() {
        for (let y = 0; y < this.waterLevel; y++) {
            const gradient = y / this.waterLevel;
            const colorIndex = Math.floor(gradient * (COLORS.SKY.length - 1));
            this.ctx.fillStyle = COLORS.SKY[colorIndex];
            this.ctx.fillRect(0, y, this.dimensions.WIDTH, 1);
        }

        this.stars.forEach((star) => {
            const pulse = (Math.sin(this.frameCount * 0.05 + star.phase) + 1) / 2;
            const alpha = Math.min(1, star.baseAlpha + pulse * 0.4);
            this.ctx.fillStyle = `rgba(255, 244, 225, ${alpha})`;
            this.ctx.fillRect(star.x, star.y, star.radius, star.radius);
            if (star.radius > 1) {
                this.ctx.fillStyle = `rgba(255, 210, 235, ${alpha * 0.6})`;
                this.ctx.fillRect(star.x - 1, star.y, 1, 1);
                this.ctx.fillRect(star.x + star.radius, star.y, 1, 1);
            }
        });

        this.clouds.forEach((cloud) => {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            cloud.x += 0.08;
            if (cloud.x > this.dimensions.WIDTH + 4) cloud.x = -20;
            this.renderer.drawSprite(this.ctx, cloud.sprite, cloud.x, cloud.y);
        });

        for (let y = this.waterLevel; y < this.dimensions.HEIGHT; y++) {
            const gradient = (y - this.waterLevel) / (this.dimensions.HEIGHT - this.waterLevel);
            const colorIndex = Math.floor(gradient * (COLORS.WATER.length - 1));
            this.ctx.fillStyle = COLORS.WATER[colorIndex];
            this.ctx.fillRect(0, y, this.dimensions.WIDTH, 1);
        }

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let i = 0; i < 5; i++) {
            const waveY = this.waterLevel + Math.sin(this.frameCount * 0.03 + i * 1.5) * 1.5;
            this.ctx.fillRect(0, waveY + i * 2, this.dimensions.WIDTH, 1);
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
        this.seaweeds.forEach((seaweed) => {
            this.renderer.drawSprite(this.ctx, seaweed.getCurrentSprite(), seaweed.x, seaweed.y);
        });

        this.treasures.forEach((treasure) => {
            this.renderer.drawSprite(this.ctx, treasure.sprite, treasure.x, treasure.y);
        });

        this.fishes.forEach((fish) => {
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

        this.bubbles.forEach((bubble) => {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.renderer.drawSprite(this.ctx, this.renderer.sprites.boat, this.boatX - 10, this.boatY + 2);
        this.renderer.drawSprite(this.ctx, this.renderer.sprites.fisher, this.boatX - 8, this.boatY - 10);

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

            this.renderer.drawSprite(this.ctx, this.renderer.sprites.hook, this.lineX - 2, this.lineY);
        }

        this.drawPowerMeter();

        if (this.combo > 1) {
            this.ctx.fillStyle = COLORS.YELLOW;
            this.ctx.font = 'bold 10px monospace';
            const comboText = `COMBO x${this.combo}!`;
            this.ctx.fillText(comboText, 128 - comboText.length * 3, 20);
        }

        this.drawFightUI();

        this.drawOverlays();
    }

    drawFightUI() {
        if (
            !this.hookedFish ||
            (this.state !== GAME_STATES.HOOKED && this.state !== GAME_STATES.REELING)
        ) {
            return;
        }

        const meterWidth = 92;
        const meterHeight = 10;
        const meterX = 128 - meterWidth / 2;
        const meterY = 10;

        this.ctx.fillStyle = 'rgba(12, 18, 30, 0.55)';
        this.ctx.fillRect(meterX - 3, meterY - 3, meterWidth + 6, meterHeight + 6);

        const safeStartRaw = meterX + (Math.max(0, this.tensionSafeMin) / 100) * meterWidth;
        const safeEndRaw = meterX + (Math.min(100, this.tensionSafeMax) / 100) * meterWidth;
        const safeStart = clamp(safeStartRaw, meterX, meterX + meterWidth);
        const safeEnd = clamp(safeEndRaw, meterX, meterX + meterWidth);
        const safeRectX = Math.min(safeStart, safeEnd);
        const safeRectWidth = Math.max(2, Math.abs(safeEnd - safeStart));

        this.ctx.fillStyle = 'rgba(80, 210, 160, 0.35)';
        this.ctx.fillRect(safeRectX, meterY, safeRectWidth, meterHeight);

        this.ctx.strokeStyle = 'rgba(140, 255, 200, 0.8)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(safeStart, meterY - 2);
        this.ctx.lineTo(safeStart, meterY + meterHeight + 2);
        this.ctx.moveTo(safeEnd, meterY - 2);
        this.ctx.lineTo(safeEnd, meterY + meterHeight + 2);
        this.ctx.stroke();

        const clampedTension = clamp(this.tension, 0, 100);
        const tensionWidth = Math.max(2, (clampedTension / 100) * meterWidth);
        const pointerX = meterX + (clampedTension / 100) * meterWidth;
        const pointerClamp = clamp(pointerX, meterX, meterX + meterWidth);
        const hue = 40 + (this.tension / 100) * 40;
        this.ctx.fillStyle = `hsl(${hue}, 90%, 55%)`;
        this.ctx.fillRect(meterX, meterY, tensionWidth, meterHeight);

        this.ctx.strokeStyle = COLORS.WHITE;
        this.ctx.lineWidth = 1.2;
        this.ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);

        this.ctx.fillStyle = COLORS.WHITE;
        this.ctx.beginPath();
        this.ctx.moveTo(pointerClamp, meterY - 4);
        this.ctx.lineTo(pointerClamp - 3, meterY - 8);
        this.ctx.lineTo(pointerClamp + 3, meterY - 8);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillRect(pointerClamp - 1, meterY, 2, meterHeight);

        if (this.tensionDangerTimer > this.tensionBreakWindow * 0.6) {
            this.ctx.fillStyle = COLORS.RED;
            this.ctx.font = 'bold 8px monospace';
            this.ctx.fillText('LINE STRAIN!', meterX + meterWidth / 2 - 32, meterY - 4);
        }

        this.ctx.fillStyle = COLORS.YELLOW;
        this.ctx.font = '7px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('TENSION', meterX + meterWidth / 2, meterY + meterHeight + 11);

        const tip = this.isReeling ? 'EASE OFF IF IT REDLINES' : 'WAIT FOR A TUG';
        this.ctx.fillStyle = 'rgba(240,240,255,0.85)';
        this.ctx.font = '7px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(tip, meterX + meterWidth + 8, meterY + meterHeight - 1);
        this.ctx.textAlign = 'left';
    }

    drawOverlays() {
        if (this.state === GAME_STATES.TITLE) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.75)';
            this.ctx.fillRect(0, 0, this.dimensions.WIDTH, this.dimensions.HEIGHT);

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
            this.ctx.fillRect(0, 0, this.dimensions.WIDTH, this.dimensions.HEIGHT);

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
        } else if (this.state === GAME_STATES.SINKING) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = '7px monospace';
            this.ctx.fillText('DROP THE LINE...', 6, 186);
        } else if (this.state === GAME_STATES.WAITING) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = '7px monospace';
            this.ctx.fillText('HOLD TO REEL UP', 6, 186);
        } else if (this.state === GAME_STATES.HOOKED) {
            this.ctx.fillStyle = 'rgba(255,255,0,0.85)';
            this.ctx.font = '7px monospace';
            this.ctx.fillText('TAP TO KEEP TENSION', 6, 186);
        } else if (this.state === GAME_STATES.REELING) {
            this.ctx.fillStyle = 'rgba(255,255,0,0.85)';
            this.ctx.font = '7px monospace';
            this.ctx.fillText('PULL CAREFULLY...', 6, 186);
        }
    }

    updateUI() {
        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
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
