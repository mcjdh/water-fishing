export class GameObject {
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
