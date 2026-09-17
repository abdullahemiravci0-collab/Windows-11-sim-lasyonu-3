// Web Audio API Retro & System Sound Synthesizer

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private nyanLoopTimeout: number | null = null;
  private isNyanPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopNyanCat();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Windows 11 authentic startup chime
  public playStartup() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Warm low ambient pad swell (Bb major 9)
      const padNotes = [233.08, 349.23, 466.16, 587.33]; // Bb3, F4, Bb4, D5
      padNotes.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.05, now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 2.3);
      });

      // 2. Crystal sparkle bells (F5 -> Bb5 -> D6 -> F6)
      const bells = [
        { freq: 587.33, delay: 0.12, dur: 1.6, gainVal: 0.08 }, // D5
        { freq: 698.46, delay: 0.26, dur: 1.8, gainVal: 0.11 }, // F5
        { freq: 932.33, delay: 0.42, dur: 2.0, gainVal: 0.13 }, // Bb5
        { freq: 1174.66, delay: 0.58, dur: 2.2, gainVal: 0.14 }, // D6
        { freq: 1396.91, delay: 0.74, dur: 2.4, gainVal: 0.10 }, // F6
      ];

      bells.forEach(({ freq, delay, dur, gainVal }) => {
        const startTime = now + delay;
        // Primary fundamental
        const osc1 = this.ctx!.createOscillator();
        const gain1 = this.ctx!.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, startTime);
        gain1.gain.setValueAtTime(0.0001, startTime);
        gain1.gain.exponentialRampToValueAtTime(gainVal, startTime + 0.04);
        gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
        osc1.connect(gain1);
        gain1.connect(this.ctx!.destination);
        osc1.start(startTime);
        osc1.stop(startTime + dur + 0.05);

        // Soft shimmer overtone (2x)
        const osc2 = this.ctx!.createOscillator();
        const gain2 = this.ctx!.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, startTime);
        gain2.gain.setValueAtTime(0.0001, startTime);
        gain2.gain.exponentialRampToValueAtTime(gainVal * 0.25, startTime + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + dur * 0.5);
        osc2.connect(gain2);
        gain2.connect(this.ctx!.destination);
        osc2.start(startTime);
        osc2.stop(startTime + dur * 0.55);
      });
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  // Windows 11 authentic shutdown chime (gentle warm descending acoustic tones)
  public playShutdown() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Gentle descending chime tones: F5 -> D5 -> Bb4 -> F4 with soft bass
      const tones = [
        { freq: 698.46, delay: 0.00, dur: 1.2, vol: 0.09 }, // F5
        { freq: 587.33, delay: 0.18, dur: 1.3, vol: 0.10 }, // D5
        { freq: 466.16, delay: 0.38, dur: 1.5, vol: 0.11 }, // Bb4
        { freq: 349.23, delay: 0.58, dur: 1.8, vol: 0.12 }, // F4
        { freq: 233.08, delay: 0.62, dur: 2.0, vol: 0.08 }  // Bb3 deep warm bass
      ];

      tones.forEach(({ freq, delay, dur, vol }) => {
        const t = now + delay;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(vol, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + dur + 0.05);
      });
    } catch {}
  }

  // Windows 11 Notification chime
  public playNotification() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // High two-tone clean bell (B5 -> E6)
      const tones = [987.77, 1318.51];
      tones.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.001, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.65);
      });
    } catch {}
  }

  // Windows 11 Snap layout sound
  public playSnap() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  // Windows Recycle Bin item drop / trash crumple sound
  public playTrash() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Filtered noise burst for paper crumple
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch {}
  }

  // Windows Recycle Bin Emptying sound (paper crunch + woosh)
  public playEmptyBin() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Two sequential rustle crunches
      [0, 0.12, 0.22].forEach((offset, idx) => {
        const t = now + offset;
        const dur = 0.14;
        const bufferSize = Math.floor(this.ctx!.sampleRate * dur);
        const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const noise = this.ctx!.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1600 - idx * 300, t);
        filter.Q.setValueAtTime(2.5, t);

        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0.16 - idx * 0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);
        noise.start(t);
      });
    } catch {}
  }

  // Windows 11 soft click sound
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // Windows folder/app open sound
  public playFolderOpen() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.1, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  // Windows window maximize sound
  public playWindowMaximize() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // Windows exclamation / Warning beep
  public playWarning() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(740, now); // F#5
      osc.frequency.setValueAtTime(587.33, now + 0.1); // D5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  // Windows Error / Critical Stop
  public playError() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // MEMZ random glitch bleep
  public playMemzGlitch() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
      const freqs = [220, 330, 440, 554, 660, 880, 1200, 1760];
      const startFreq = freqs[Math.floor(Math.random() * freqs.length)];
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.linearRampToValueAtTime(startFreq * (Math.random() > 0.5 ? 1.5 : 0.6), now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  // Undertale heart damage sound
  public playHeartHurt() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  // Play Authentic 8-bit Nyan Cat melody loop!
  public startNyanCat() {
    if (this.isMuted || this.isNyanPlaying) return;
    this.initCtx();
    if (!this.ctx) return;
    this.isNyanPlaying = true;

    // Melody note frequencies (Hz) & durations
    // FS4=370, GS4=415, AS4=466, B4=493, CS5=554, D5=587, DS5=622, FS5=740, GS5=830, AS5=932, B5=987
    const FS4 = 370, GS4 = 415, B4 = 494, CS5 = 554, D5 = 587, DS5 = 622, FS5 = 740, GS5 = 830, AS5 = 932, B5 = 988;
    
    const notes: [number, number][] = [
      [FS5, 0.14], [GS5, 0.14],
      [DS5, 0.14], [DS5, 0.08], [B4, 0.14], [D5, 0.14], [CS5, 0.14], [B4, 0.14],
      [B4, 0.14], [CS5, 0.14], [D5, 0.14], [D5, 0.1], [CS5, 0.1], [B4, 0.1], [CS5, 0.1], [DS5, 0.14],
      [FS5, 0.14], [GS5, 0.14], [DS5, 0.14], [FS5, 0.14], [CS5, 0.14], [DS5, 0.14], [B4, 0.14], [CS5, 0.14], [B4, 0.14],
      [DS5, 0.14], [FS5, 0.14], [GS5, 0.14], [DS5, 0.14], [FS5, 0.14], [CS5, 0.14], [DS5, 0.14], [B4, 0.14], [D5, 0.14],
      [DS5, 0.14], [D5, 0.1], [CS5, 0.1], [B4, 0.1], [CS5, 0.14], [D5, 0.14], [B4, 0.14], [CS5, 0.14], [DS5, 0.14],
      [FS5, 0.14], [CS5, 0.14], [DS5, 0.14], [CS5, 0.14], [B4, 0.14], [CS5, 0.14], [B4, 0.2]
    ];

    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isNyanPlaying || this.isMuted || !this.ctx) return;
      const [freq, dur] = notes[noteIndex];
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.02);

      noteIndex = (noteIndex + 1) % notes.length;
      this.nyanLoopTimeout = window.setTimeout(playNextNote, dur * 1000 * 1.05);
    };

    playNextNote();
  }

  public stopNyanCat() {
    this.isNyanPlaying = false;
    if (this.nyanLoopTimeout) {
      clearTimeout(this.nyanLoopTimeout);
      this.nyanLoopTimeout = null;
    }
  }

  // Sans character speech voice blip
  public playSansVoice() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.setValueAtTime(95, now + 0.02);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.065);
    } catch {}
  }

  // Papyrus character speech blip (higher pitched clatter)
  public playPapyrusVoice() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.setValueAtTime(320, now + 0.02);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
    } catch {}
  }

  // Undyne spear block / deflect sound
  public playShieldBlock() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  // Bonetrousle (Papyrus theme) 8-bit melody player
  private bonetrousleTimeout: number | null = null;
  private isBonetrouslePlaying: boolean = false;

  public startBonetrousle() {
    if (this.isMuted || this.isBonetrouslePlaying) return;
    this.stopMegalovania();
    this.initCtx();
    if (!this.ctx) return;
    this.isBonetrouslePlaying = true;

    // Papyrus Bonetrousle Motif: C4, D4, D#4, F4, G4, G#4, A#4, C5
    const C4 = 261.63, D4 = 293.66, DS4 = 311.13, F4 = 349.23, G4 = 392.00, GS4 = 415.30, AS4 = 466.16, C5 = 523.25;
    const dur = 0.13;
    const notes: [number, number][] = [
      [C4, dur], [DS4, dur], [G4, dur], [C5, dur],
      [AS4, dur], [G4, dur], [F4, dur], [G4, dur],
      [C4, dur], [DS4, dur], [G4, dur], [GS4, dur],
      [G4, dur], [F4, dur], [DS4, dur], [D4, dur]
    ];

    let idx = 0;
    const playNote = () => {
      if (!this.isBonetrouslePlaying || this.isMuted || !this.ctx) return;
      const [freq, d] = notes[idx];
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + d * 0.9);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + d);

      idx = (idx + 1) % notes.length;
      this.bonetrousleTimeout = window.setTimeout(playNote, d * 1000);
    };
    playNote();
  }

  public stopBonetrousle() {
    this.isBonetrouslePlaying = false;
    if (this.bonetrousleTimeout) {
      clearTimeout(this.bonetrousleTimeout);
      this.bonetrousleTimeout = null;
    }
  }

  public stopAllUndertaleMusic() {
    this.stopMegalovania();
    this.stopBonetrousle();
  }

  // Knife slash sound for FIGHT button
  public playSlash() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  // Gaster Blaster laser firing sound
  public playGasterBlaster() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.35);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  // Soul gravity change / slam sound (Blue Soul)
  public playSoulModeChange() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  // Megalovania 8-bit theme song player
  private megalovaniaTimeout: number | null = null;
  private isMegalovaniaPlaying: boolean = false;

  public startMegalovania() {
    if (this.isMuted || this.isMegalovaniaPlaying) return;
    this.initCtx();
    if (!this.ctx) return;
    this.isMegalovaniaPlaying = true;

    // Frequencies:
    const D4 = 293.66, D5 = 587.33, A4 = 440.00, GS4 = 415.30, G4 = 392.00, F4 = 349.23;
    const C4 = 261.63, B3 = 246.94, BB3 = 233.08;
    const s = 0.125; // 16th note duration

    // 4 bars of iconic Megalovania riff
    const loopNotes: [number, number][] = [
      // Bar 1: D4 root
      [D4, s], [D4, s], [D5, s * 2], [A4, s * 2], [GS4, s], [G4, s], [F4, s * 2], [D4, s], [F4, s], [G4, s],
      // Bar 2: C4 root
      [C4, s], [C4, s], [D5, s * 2], [A4, s * 2], [GS4, s], [G4, s], [F4, s * 2], [D4, s], [F4, s], [G4, s],
      // Bar 3: B3 root
      [B3, s], [B3, s], [D5, s * 2], [A4, s * 2], [GS4, s], [G4, s], [F4, s * 2], [D4, s], [F4, s], [G4, s],
      // Bar 4: Bb3 root
      [BB3, s], [BB3, s], [D5, s * 2], [A4, s * 2], [GS4, s], [G4, s], [F4, s * 2], [D4, s], [F4, s], [G4, s]
    ];

    let nIdx = 0;
    const playNote = () => {
      if (!this.isMegalovaniaPlaying || this.isMuted || !this.ctx) return;
      const [freq, dur] = loopNotes[nIdx];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + dur);

      nIdx = (nIdx + 1) % loopNotes.length;
      this.megalovaniaTimeout = window.setTimeout(playNote, dur * 1000);
    };

    playNote();
  }

  public stopMegalovania() {
    this.isMegalovaniaPlaying = false;
    if (this.megalovaniaTimeout) {
      clearTimeout(this.megalovaniaTimeout);
      this.megalovaniaTimeout = null;
    }
  }

  public isMegalovaniaActive(): boolean {
    return this.isMegalovaniaPlaying;
  }

  // Windows 11 Recycle bin empty sound (paper / trash crumple)
  public playTrashEmpty() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Synthesize paper crunch with filtered noise bursts
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + 0.3);
      filter.Q.value = 2.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch {}
  }

  // Subtle drop / snap sound when releasing dragged icon
  public playDrop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.06);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.075);
    } catch {}
  }
}

export const sound = new SoundManager();
