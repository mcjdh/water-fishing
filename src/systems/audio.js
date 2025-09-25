export class AudioSystem {
    constructor() {
        this.audioCtx = null;
    }

    ensureContext() {
        if (this.audioCtx) {
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            return this.audioCtx;
        }

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            return null;
        }

        this.audioCtx = new AudioContext();
        return this.audioCtx;
    }

    playTone({ frequency, duration, waveform = 'sine', volume = 0.18 }) {
        const ctx = this.ensureContext();
        if (!ctx) {
            return;
        }

        const now = ctx.currentTime;
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type = waveform;
        oscillator.frequency.setValueAtTime(frequency, now);

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }
}
