import { RetroFishingGame } from './core/RetroFishingGame.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        new RetroFishingGame(canvas);
    }
});
