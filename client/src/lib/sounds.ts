/**
 * Sound effects utility for CIA/Military UI
 * Uses Web Audio API to generate synthetic sound effects
 */

class SoundEffects {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Hover sound - subtle high-pitched beep
  hover() {
    this.playTone(1200, 0.05, 'sine', 0.05);
  }

  // Click sound - tactical beep
  click() {
    this.playTone(800, 0.08, 'square', 0.08);
  }

  // Select sound - confirmation tone
  select() {
    if (!this.enabled || !this.audioContext) return;
    
    // Two-tone confirmation
    this.playTone(600, 0.06, 'sine', 0.1);
    setTimeout(() => this.playTone(900, 0.06, 'sine', 0.1), 60);
  }

  // Error sound - warning beep
  error() {
    if (!this.enabled || !this.audioContext) return;
    
    this.playTone(300, 0.15, 'sawtooth', 0.15);
  }

  // Success sound - positive confirmation
  success() {
    if (!this.enabled || !this.audioContext) return;
    
    // Rising tone
    this.playTone(600, 0.08, 'sine', 0.1);
    setTimeout(() => this.playTone(800, 0.08, 'sine', 0.1), 80);
    setTimeout(() => this.playTone(1000, 0.1, 'sine', 0.1), 160);
  }

  // Scan sound - data processing
  scan() {
    if (!this.enabled || !this.audioContext) return;
    
    // Sweeping frequency
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // Timeline tick - event marker
  tick() {
    this.playTone(1500, 0.03, 'square', 0.06);
  }

  // Map pin drop
  pinDrop() {
    if (!this.enabled || !this.audioContext) return;
    
    // Descending tone
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }
}

// Singleton instance
export const soundEffects = new SoundEffects();
