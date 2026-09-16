// Web Audio API Synthesizer & Visualizer Engine for Sound Design Portfolio

class SoundEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private stemGains: Record<string, GainNode> = {};
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying: boolean = false;
  private currentTrackType: string = 'action';
  
  // Oscillators and sound nodes
  private activeOscillators: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private ambientInterval: number | null = null;

  // Master parameters
  private masterVolume: number = 0.8;
  private cutoffFreq: number = 5000;
  private pitchShift: number = 1.0;

  public initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.85;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(this.cutoffFreq, this.ctx.currentTime);

      // Connect graph: Stem Gains -> Lowpass Filter -> Master Gain -> Analyser -> Destination
      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Initialize 4 stems: dialogue, foley, sfx, music
      ['dialogue', 'foley', 'sfx', 'music'].forEach(stem => {
        if (this.ctx && this.filterNode) {
          const g = this.ctx.createGain();
          g.gain.setValueAtTime(0.75, this.ctx.currentTime);
          g.connect(this.filterNode);
          this.stemGains[stem] = g;
        }
      });
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMasterVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public setStemVolume(stem: string, volume: number) {
    if (this.stemGains[stem] && this.ctx) {
      const vol = Math.max(0, Math.min(1, volume));
      this.stemGains[stem].gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05);
    }
  }

  public setFilterFrequency(freq: number) {
    this.cutoffFreq = Math.max(100, Math.min(20000, freq));
    if (this.filterNode && this.ctx) {
      this.filterNode.frequency.setTargetAtTime(this.cutoffFreq, this.ctx.currentTime, 0.05);
    }
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(128);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public getTimeDomainData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(128);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  // Generate synthetic cinematic soundscapes based on track type
  public startTrack(trackType: 'action' | 'sci-fi' | 'horror' | 'foley' | 'drama') {
    this.initContext();
    this.stopTrack();
    this.currentTrackType = trackType;
    this.isPlaying = true;

    if (!this.ctx) return;

    // Create synthetic sound loop tailored to track type
    const now = this.ctx.currentTime;

    if (trackType === 'action') {
      // Sub-bass rumble + rhythm pulse + impact SFX
      this.createSubBassPulse(now);
      this.createRhythmicHiHats(now);
    } else if (trackType === 'sci-fi') {
      // Ambient synth drone + frequency sweeps
      this.createSciFiDrone(now);
    } else if (trackType === 'horror') {
      // Dissonant tension cluster + metallic scrape simulation
      this.createTensionCluster(now);
    } else if (trackType === 'foley') {
      // Organic rain / footsteps noise synthesis
      this.createFoleyNoise(now);
    } else if (trackType === 'drama') {
      // Warm orchestral pad chord (C minor 9)
      this.createWarmPad(now);
    }
  }

  private createSubBassPulse(startTime: number) {
    if (!this.ctx || !this.stemGains['sfx']) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, startTime); // A1 note
    osc.frequency.exponentialRampToValueAtTime(32.7, startTime + 1.5); // C1 drop

    gain.gain.setValueAtTime(0.6, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.8);

    osc.connect(gain);
    gain.connect(this.stemGains['sfx']);

    osc.start(startTime);
    osc.stop(startTime + 2.0);
    this.activeOscillators.push(osc);

    // Loop interval
    if (this.isPlaying) {
      this.ambientInterval = window.setInterval(() => {
        if (this.isPlaying && this.ctx) {
          const t = this.ctx.currentTime;
          this.createSubBassPulse(t);
        }
      }, 2000);
    }
  }

  private createSciFiDrone(startTime: number) {
    if (!this.ctx || !this.stemGains['music']) return;
    const freqs = [110, 164.81, 220, 329.63]; // A minor chord
    freqs.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(f * this.pitchShift, startTime);

      // LFO modulation for cosmic shimmer
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.1, startTime);
      lfoGain.gain.setValueAtTime(5, startTime);
      lfo.connect(osc.frequency);
      lfo.start(startTime);
      this.activeOscillators.push(lfo);

      gain.gain.setValueAtTime(0.15, startTime);

      osc.connect(gain);
      gain.connect(this.stemGains['music']);

      osc.start(startTime);
      this.activeOscillators.push(osc);
    });
  }

  private createTensionCluster(startTime: number) {
    if (!this.ctx || !this.stemGains['sfx']) return;
    const freqs = [220, 233.08, 311.13, 329.63]; // Microtonal cluster
    freqs.forEach(f => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.08, startTime);

      osc.connect(gain);
      gain.connect(this.stemGains['sfx']);

      osc.start(startTime);
      this.activeOscillators.push(osc);
    });
  }

  private createFoleyNoise(startTime: number) {
    if (!this.ctx || !this.stemGains['foley']) return;
    // Generate pink noise buffer for rain/wind foley
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, startTime);

    noise.connect(gain);
    gain.connect(this.stemGains['foley']);

    noise.start(startTime);
    this.noiseNode = noise;
  }

  private createWarmPad(startTime: number) {
    if (!this.ctx || !this.stemGains['music']) return;
    const chord = [130.81, 164.81, 196.00, 246.94, 293.66]; // Cmaj9 pad
    chord.forEach(f => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.12, startTime);

      osc.connect(gain);
      gain.connect(this.stemGains['music']);

      osc.start(startTime);
      this.activeOscillators.push(osc);
    });
  }

  private createRhythmicHiHats(startTime: number) {
    if (!this.ctx || !this.stemGains['foley']) return;
    // Metallic impact hit
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, startTime);
    osc.frequency.exponentialRampToValueAtTime(100, startTime + 0.15);
    gain.gain.setValueAtTime(0.4, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

    osc.connect(gain);
    gain.connect(this.stemGains['foley']);
    osc.start(startTime);
    osc.stop(startTime + 0.2);
    this.activeOscillators.push(osc);
  }

  // Play a quick one-shot SFX preview (e.g. gun recoil, laser, foley step, tube warm-up)
  public triggerOneShot(type: 'recoil' | 'laser' | 'foley_step' | 'tube_warm') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'recoil') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    } else if (type === 'laser') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    } else if (type === 'foley_step') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    } else if (type === 'tube_warm') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.5);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  public stopTrack() {
    this.isPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore already stopped oscillators
      }
    });
    this.activeOscillators = [];

    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrackType(): string {
    return this.currentTrackType;
  }
}

export const soundEngine = new SoundEngine();
