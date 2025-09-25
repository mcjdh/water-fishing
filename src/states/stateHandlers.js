import { Bubble } from '../entities/Bubble.js';
import { randomRange, clamp } from '../utils/math.js';
import { GAME_STATES } from '../config/constants.js';
import { TUNING } from '../config/tuning.js';

export const stateHandlers = {
    [GAME_STATES.IDLE]: (game) => {
        game.canCast = TUNING.idleCastReady;
    },

    [GAME_STATES.CHARGING]: (game) => {
        if (game.mouseDown && game.powerCharge < game.maxPower) {
            game.powerCharge = clamp(game.powerCharge + game.powerChargeSpeed, 0, game.maxPower);
        }
    },

    [GAME_STATES.CASTING]: (game) => {
        game.lineVelocityY += game.gravity;
        game.lineX += game.lineVelocityX;
        game.lineY += game.lineVelocityY;

        game.lineX = clamp(game.lineX, 25, game.dimensions.WIDTH - TUNING.castingClampMargin);

        if (game.lineY >= game.waterLevel) {
            game.lineY = game.waterLevel;
            game.setState(GAME_STATES.SINKING);
            game.createSplash(game.lineX, game.waterLevel);
        }
    },

    [GAME_STATES.SINKING]: (game) => {
        if (game.lineY < TUNING.sinkDepthLimit) {
            game.lineY += game.lineSinkSpeed;
            game.depth = Math.floor(game.lineY - game.waterLevel);

            if (Math.random() < TUNING.sinkBubbleChance) {
                game.bubbles.push(new Bubble(game.lineX, game.lineY));
            }
        } else {
            game.setState(GAME_STATES.WAITING);
        }
    },

    [GAME_STATES.WAITING]: (game) => {
        if (game.frameCount % TUNING.waitBubbleInterval === 0) {
            game.bubbles.push(new Bubble(
                game.lineX + randomRange(-TUNING.waitBubbleOffset, TUNING.waitBubbleOffset),
                game.lineY
            ));
        }
    },

    [GAME_STATES.HOOKED]: (game) => {
        game.updateFishFight();
    },

    [GAME_STATES.REELING]: (game) => {
        if (game.hookedFish) {
            game.updateFishFight();
            return;
        }

        if (game.lineY > game.waterLevel + TUNING.reelReturnDepth) {
            game.lineY -= game.lineReelSpeed;
            game.depth = Math.floor(Math.max(0, game.lineY - game.waterLevel));

            const pullStrength = 0.1;
            game.lineX += (game.boatX - game.lineX) * pullStrength;

            if (Math.random() < TUNING.reelBubbleChance) {
                game.bubbles.push(new Bubble(
                    game.lineX + randomRange(-TUNING.reelBubbleOffset, TUNING.reelBubbleOffset),
                    game.lineY
                ));
            }
        } else {
            game.loseLife();
            game.resetLine();
            game.setState(GAME_STATES.IDLE);
        }
    }
};
