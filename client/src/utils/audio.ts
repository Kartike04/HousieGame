// Web Audio API & Viral Instagram Reels Meme Sound Engine

const REELS_MEME_DIALOGUES = [
  {
    tag: 'BAHUT JALDI HAI AAPKO!',
    speech: 'Bahut jaldi hai aapko! Bahut jaldi hai aapko boss! Pehle ticket to complete karo!',
    soundType: 'fail',
  },
  {
    tag: 'CHEATING!',
    speech: 'Cheating karta hai tu! Cheating, cheating, cheating! Jaldi 5 nahi hua hai bhai!',
    soundType: 'boing',
  },
  {
    tag: 'AREY BHAI BHAI BHAI!',
    speech: 'Arey bhai bhai bhai! Kya kar raha hai tu? Arey koi sambhalo isko!',
    soundType: 'bruh',
  },
  {
    tag: 'YE SAB DOGLAPAN HAI!',
    speech: 'Ye sab doglapan hai! Ticket check nahi kiya aur claim kar diya!',
    soundType: 'fail',
  },
  {
    tag: 'SAMAJH RAHE HO?',
    speech: 'Jaldi 5 nahi hua hai... samajh rahe ho? Samajh rahe ho aap?',
    soundType: 'wheeze',
  },
  {
    tag: 'KAHAN SE AATE HAIN YE LOG?',
    speech: 'Kahan se aate hain ye log? Kon hain ye log? Pehle number to suno!',
    soundType: 'boing',
  },
  {
    tag: 'WAH KYA ACTING KAR RAHA HAI!',
    speech: 'Wah! Kya acting kar raha hai! Jaldi 5 to hua hi nahi hai boss!',
    soundType: 'fail',
  },
];

const MEME_BOGUS_MESSAGES = [
  'Bahut jaldi hai aapko! Pehle ticket ke numbers to milne do boss!',
  'Arey bhai bhai bhai! Kya kar raha hai tu? Jaldi 5 nahi hua hai!',
  'Bogus claim! Jaldi 5 nahi hua hai boss! Sabar karo!',
  'Kahan se aate hain yeh log? Pehle number to suno bhai!',
  'Arey galat claim kar diya! Thoda dhyan se dekho ticket!',
  'Sabar ka phal meetha hota hai! Jaldi mat machao!',
];

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechEnabled: boolean = true;

  private initCtx() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public toggleSound(enabled?: boolean): boolean {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    return this.soundEnabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // Tactile wood stamp sound for marking ticket numbers
  public playClickSound() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.07);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Audio fallback
    }
  }

  // Bingo draw chime
  public playDrawSound() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(739.99, now);
      osc2.frequency.exponentialRampToValueAtTime(1479.98, now + 0.15);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch {
      // Audio fallback
    }
  }

  // Victory fanfare
  public playWinFanfare() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const startTime = now + idx * 0.12;
        const duration = idx === notes.length - 1 ? 0.8 : 0.18;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Audio fallback
    }
  }

  // Pataka firecrackers sound
  public playFirecrackerSound() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      [0, 0.15, 0.35, 0.5, 0.7].forEach((delay) => {
        if (!this.audioCtx) return;
        const startTime = now + delay;
        
        const bufferSize = this.audioCtx.sampleRate * 0.25;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, startTime);
        filter.frequency.exponentialRampToValueAtTime(80, startTime + 0.2);

        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.8, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        noise.start(startTime);
        noise.stop(startTime + 0.2);
      });
    } catch {
      // Audio fallback
    }
  }

  // Viral Instagram Reels Meme Sound Effects
  public playReelsMemeSound(): { tag: string; speech: string } {
    const selectedMeme = REELS_MEME_DIALOGUES[Math.floor(Math.random() * REELS_MEME_DIALOGUES.length)];

    if (!this.soundEnabled) return selectedMeme;

    try {
      this.initCtx();
      if (this.audioCtx) {
        const now = this.audioCtx.currentTime;

        if (selectedMeme.soundType === 'boing') {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);

          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 0.3);
        } else if (selectedMeme.soundType === 'bruh') {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.4);

          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 0.4);
        } else if (selectedMeme.soundType === 'wheeze') {
          [0, 0.08, 0.16, 0.24].forEach((d, i) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const t = now + d;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(500 + i * 100, t);

            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(t);
            osc.stop(t + 0.06);
          });
        } else {
          // Slide tone
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.3);

          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 0.3);
        }
      }

      if ('speechSynthesis' in window) {
        setTimeout(() => {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(selectedMeme.speech);
          utterance.rate = 1.05;
          utterance.pitch = 1.25;
          utterance.lang = 'hi-IN';

          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            const preferredVoice = voices.find(
              (v) => v.lang.startsWith('hi') || v.lang.startsWith('en-IN')
            );
            if (preferredVoice) {
              utterance.voice = preferredVoice;
            }
          }

          window.speechSynthesis.speak(utterance);
        }, 200);
      }
    } catch {
      // Audio fallback
    }

    return selectedMeme;
  }

  // Soft error sound
  public playErrorSound() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio fallback
    }
  }

  // Speech announcer
  public announceNumber(num: number) {
    if (!this.soundEnabled || !this.speechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();

      let textToSay = `Number ${num}!`;
      if (num < 10) {
        textToSay = `Single digit ${num}, Number ${num}!`;
      } else {
        const d1 = Math.floor(num / 10);
        const d2 = num % 10;
        if (d2 === 0) {
          textToSay = `Blind ${num}, Number ${num}!`;
        } else {
          textToSay = `${d1} and ${d2}, Number ${num}!`;
        }
      }

      const utterance = new SpeechSynthesisUtterance(textToSay);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice = voices.find(
          (v) => v.lang.startsWith('en') || v.lang.startsWith('hi')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech fallback
    }
  }
}

export const soundManager = new SoundEngine();
