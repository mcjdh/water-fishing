import { GameObject } from './GameObject.js';
import { randomRange } from '../utils/math.js';
import { TUNING } from '../config/tuning.js';

export class Bubble extends GameObject {
    constructor(x, y) {
        super(x, y, 'bubble', null);
        this.size = 1;
        this.riseSpeed = randomRange(...TUNING.bubbleRiseRange);
        this.wobble = randomRange(0, Math.PI * 2);
        this.wobbleSpeed = 0.1;
        this.lifetime = randomRange(...TUNING.bubbleLifetimeRange);
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
