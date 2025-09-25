import { GameObject } from './GameObject.js';
import { clamp, randomRange } from '../utils/math.js';

export class Fish extends GameObject {
    constructor(x, y, type, sprite, baseSpeed, points, biteDistance = 35, struggleStrength = 0) {
        super(x, y, type, sprite);
        this.baseSpeed = baseSpeed;
        this.speed = baseSpeed;
        this.points = points;
        this.direction = baseSpeed > 0 ? 1 : -1;
        this.targetY = y;
        this.wanderTimer = 0;
        this.wanderInterval = randomRange(60, 120);
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
            this.wanderInterval = randomRange(60, 120);
            this.targetY = this.baseY + randomRange(-12.5, 12.5);
            this.targetY = clamp(this.targetY, 65, 170);
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
