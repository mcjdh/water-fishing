export class UISystem {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.depthElement = document.getElementById('depth');
        this.livesElement = document.getElementById('lives');
    }

    updateScore(score) {
        if (this.scoreElement) {
            const scoreStr = String(score).padStart(5, '0');
            this.scoreElement.textContent = scoreStr;
        }
    }

    updateDepth(depth) {
        if (this.depthElement) {
            this.depthElement.textContent = depth;
        }
    }

    updateLives(lives) {
        if (this.livesElement) {
            const livesStr = '♥'.repeat(lives) + '♡'.repeat(Math.max(0, 3 - lives));
            this.livesElement.textContent = livesStr;
        }
    }
}
