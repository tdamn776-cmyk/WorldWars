class SynthAudio {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.bgmPlaying = false;
    this.bgmOsc = null;
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.value = 0.3;
    this.masterVolume.connect(this.ctx.destination);
  }

  playTone(freq, type, duration, vol, slideFreq = null) {
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideFreq, this.ctx.currentTime + duration);
    }
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.masterVolume);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  noise(duration, vol) {
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    // lowpass filter for explosion sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);
    
    noise.start();
  }

  play(soundName) {
    switch(soundName) {
      case 'buttonClick':
        this.playTone(800, 'sine', 0.1, 0.5, 1200);
        break;
      case 'chestOpen':
        this.playTone(300, 'square', 0.2, 0.4, 600);
        setTimeout(() => this.playTone(400, 'square', 0.4, 0.5, 800), 200);
        break;
      case 'shootShell':
        this.noise(0.4, 0.8);
        this.playTone(150, 'sawtooth', 0.3, 0.8, 40);
        break;
      case 'shootLaser':
        this.playTone(880, 'square', 0.2, 0.3, 220);
        break;
      case 'explosionSm':
        this.noise(0.6, 0.8);
        break;
      case 'explosionLg':
        this.noise(1.2, 1.5);
        this.playTone(100, 'sawtooth', 1.0, 1.0, 20);
        break;
    }
  }
}

const audioSystem = new SynthAudio();

export const playSound = (soundName) => {
  audioSystem.play(soundName);
};

export const toggleBgm = () => {
  // Synthesized BGM can be complex, skipping for mobile performance, leaving SFX only
};

export const setMasterVolume = (vol) => {
  audioSystem.masterVolume.gain.value = vol;
};
