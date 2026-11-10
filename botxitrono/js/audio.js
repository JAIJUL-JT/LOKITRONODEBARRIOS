// Sonido y música sintetizados con WebAudio. Sin ficheros externos.
// Se inicializa de forma perezosa tras un gesto del usuario.

// Melodía en modo dórico sobre Re. Cada paso es una corchea; null es silencio.
const MELODY = [
  293.66, null, 349.23, null, 440.0, 392.0, 349.23, null,
  293.66, null, 349.23, 392.0, 440.0, null, 392.0, 349.23,
  329.63, null, 392.0, null, 493.88, 440.0, 392.0, 349.23,
  329.63, 293.66, 329.63, 349.23, 440.0, 392.0, 349.23, null,
];
const MUSIC_STEP = 0.28;
const DRONE_D = 73.42;
const DRONE_A = 110.0;

export function createAudio(initialMuted = false) {
  let ctx = null;
  let muted = Boolean(initialMuted);

  let musicBus = null;
  let musicDelay = null;
  let noise = null;
  let musicTimer = null;
  let musicOn = false;
  let musicStep = 0;
  let nextNoteTime = 0;
  let drones = [];

  function ensureContext() {
    if (ctx) return ctx;
    const AudioCtor =
      typeof window !== 'undefined' &&
      (window.AudioContext || window.webkitAudioContext);
    if (!AudioCtor) return null;
    try {
      ctx = new AudioCtor();
    } catch (_) {
      ctx = null;
    }
    return ctx;
  }

  function resume() {
    const context = ensureContext();
    if (!context) return;
    if (context.state === 'suspended') {
      context.resume().catch(() => {});
    }
  }

  function ensureMusicBus() {
    const context = ensureContext();
    if (!context) return null;
    if (musicBus) return musicBus;

    musicBus = context.createGain();
    musicBus.gain.value = 0.0001;
    musicBus.connect(context.destination);

    // Eco suave para dar aire de sala / laúd.
    musicDelay = context.createDelay(0.6);
    musicDelay.delayTime.value = 0.22;
    const feedback = context.createGain();
    feedback.gain.value = 0.24;
    const wet = context.createGain();
    wet.gain.value = 0.22;
    musicDelay.connect(feedback);
    feedback.connect(musicDelay);
    musicDelay.connect(wet);
    wet.connect(musicBus);

    return musicBus;
  }

  function ensureNoise(context) {
    if (noise) return noise;
    const length = Math.max(1, Math.floor(context.sampleRate * 0.2));
    noise = context.createBuffer(1, length, context.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }
    return noise;
  }

  function tone({
    freq = 440,
    duration = 0.12,
    type = 'square',
    gain = 0.05,
    slideTo = null,
    delay = 0,
  }) {
    if (muted) return;
    const context = ensureContext();
    if (!context) return;
    const start = context.currentTime + delay;
    const osc = context.createOscillator();
    const env = context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), start + duration);
    }
    env.gain.setValueAtTime(0.0001, start);
    env.gain.exponentialRampToValueAtTime(gain, start + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(env).connect(context.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  function playPluck(freq, when, duration, gain) {
    if (muted) return;
    const context = ensureContext();
    const bus = ensureMusicBus();
    if (!context || !bus) return;

    const osc = context.createOscillator();
    const filter = context.createBiquadFilter();
    const env = context.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, when);

    filter.type = 'lowpass';
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(2400, when);
    filter.frequency.exponentialRampToValueAtTime(1100, when + duration);

    env.gain.setValueAtTime(0.0001, when);
    env.gain.exponentialRampToValueAtTime(gain, when + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    osc.connect(filter);
    filter.connect(env);
    env.connect(bus);
    if (musicDelay) env.connect(musicDelay);

    osc.start(when);
    osc.stop(when + duration + 0.05);
  }

  function playDrum(when, gain) {
    if (muted) return;
    const context = ensureContext();
    const bus = ensureMusicBus();
    if (!context || !bus) return;

    const src = context.createBufferSource();
    src.buffer = ensureNoise(context);

    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(620, when);

    const env = context.createGain();
    env.gain.setValueAtTime(0.0001, when);
    env.gain.exponentialRampToValueAtTime(gain, when + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, when + 0.16);

    src.connect(filter);
    filter.connect(env);
    env.connect(bus);

    src.start(when);
    src.stop(when + 0.2);
  }

  function scheduleMusic() {
    const context = ensureContext();
    if (!context || !musicOn) return;

    const now = context.currentTime;
    if (nextNoteTime < now) nextNoteTime = now + 0.05;

    while (nextNoteTime < now + 0.5) {
      const freq = MELODY[musicStep % MELODY.length];
      if (freq) {
        playPluck(freq, nextNoteTime, 0.95, 0.03);
        if (musicStep % 8 === 0) playPluck(freq * 0.5, nextNoteTime, 1.3, 0.014);
      }
      if (musicStep % 8 === 0) playDrum(nextNoteTime, 0.045);
      else if (musicStep % 8 === 4) playDrum(nextNoteTime, 0.022);

      nextNoteTime += MUSIC_STEP;
      musicStep = (musicStep + 1) % MELODY.length;
    }
  }

  function startDrones(when) {
    if (drones.length) return;
    const context = ensureContext();
    const bus = ensureMusicBus();
    if (!context || !bus) return;

    const a = context.createOscillator();
    const b = context.createOscillator();
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    a.type = 'sine';
    a.frequency.value = DRONE_D;
    b.type = 'triangle';
    b.frequency.value = DRONE_A;

    lfo.type = 'sine';
    lfo.frequency.value = 0.11;
    lfoGain.gain.value = 0.008;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    filter.type = 'lowpass';
    filter.frequency.value = 340;
    gain.gain.value = 0.022;

    a.connect(filter);
    b.connect(filter);
    filter.connect(gain);
    gain.connect(bus);

    a.start(when);
    b.start(when);
    lfo.start(when);
    drones = [a, b, lfo];
  }

  function stopDrones(when) {
    for (const node of drones) {
      try {
        node.stop(when);
      } catch (_) {
        /* ignorar */
      }
    }
    drones = [];
  }

  function startMusic() {
    if (muted) return;
    const context = ensureContext();
    const bus = ensureMusicBus();
    if (!context || !bus) return;
    if (musicOn) return;

    musicOn = true;
    musicStep = 0;
    nextNoteTime = context.currentTime + 0.12;
    bus.gain.cancelScheduledValues(context.currentTime);
    bus.gain.setTargetAtTime(0.72, context.currentTime, 0.25);

    startDrones(context.currentTime);
    scheduleMusic();
    musicTimer = setInterval(scheduleMusic, 140);
  }

  function stopMusic() {
    if (!musicOn) return;
    musicOn = false;
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
    const context = ensureContext();
    if (!context || !musicBus) return;
    const now = context.currentTime;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setTargetAtTime(0.0001, now, 0.12);
    stopDrones(now + 0.35);
  }

  const api = {
    resume,
    startMusic,
    stopMusic,
    isMusicPlaying() {
      return musicOn;
    },
    getContextState() {
      return ctx ? ctx.state : 'none';
    },
    setMuted(value) {
      muted = Boolean(value);
      if (muted) stopMusic();
    },
    isMuted() {
      return muted;
    },
    jump() {
      tone({ freq: 460, slideTo: 760, duration: 0.14, type: 'triangle', gain: 0.05 });
    },
    coin() {
      tone({ freq: 980, duration: 0.07, type: 'square', gain: 0.035 });
      tone({ freq: 1480, duration: 0.1, type: 'square', gain: 0.03, delay: 0.055 });
    },
    stomp() {
      tone({ freq: 320, slideTo: 120, duration: 0.16, type: 'square', gain: 0.05 });
      tone({ freq: 720, duration: 0.08, type: 'triangle', gain: 0.035, delay: 0.03 });
    },
    hurt() {
      tone({ freq: 260, slideTo: 90, duration: 0.28, type: 'sawtooth', gain: 0.06 });
    },
    goal() {
      tone({ freq: 523, duration: 0.14, type: 'sine', gain: 0.05 });
      tone({ freq: 659, duration: 0.14, type: 'sine', gain: 0.05, delay: 0.13 });
      tone({ freq: 784, duration: 0.16, type: 'sine', gain: 0.05, delay: 0.26 });
      tone({ freq: 1046, duration: 0.28, type: 'sine', gain: 0.05, delay: 0.4 });
    },
    gameOver() {
      tone({ freq: 400, duration: 0.18, type: 'triangle', gain: 0.05 });
      tone({ freq: 300, duration: 0.18, type: 'triangle', gain: 0.05, delay: 0.16 });
      tone({ freq: 200, duration: 0.35, type: 'triangle', gain: 0.05, delay: 0.32 });
    },
    airjump() {
      tone({ freq: 520, slideTo: 860, duration: 0.12, type: 'sine', gain: 0.04 });
      tone({ freq: 780, duration: 0.08, type: 'triangle', gain: 0.025, delay: 0.04 });
    },
    dash() {
      tone({ freq: 180, slideTo: 620, duration: 0.16, type: 'sawtooth', gain: 0.04 });
    },
    slash() {
      tone({ freq: 340, slideTo: 150, duration: 0.12, type: 'sawtooth', gain: 0.045 });
      tone({ freq: 880, duration: 0.06, type: 'square', gain: 0.02, delay: 0.02 });
    },
    shoot(weapon = 'bow') {
      if (weapon === 'daggers') {
        tone({ freq: 1200, slideTo: 700, duration: 0.08, type: 'square', gain: 0.028 });
      } else {
        tone({ freq: 640, slideTo: 320, duration: 0.14, type: 'triangle', gain: 0.04 });
      }
    },
    bow() {
      tone({ freq: 420, slideTo: 220, duration: 0.15, type: 'triangle', gain: 0.03 });
    },
    shieldblock() {
      tone({ freq: 900, slideTo: 520, duration: 0.09, type: 'square', gain: 0.04 });
      tone({ freq: 1440, duration: 0.1, type: 'sine', gain: 0.025, delay: 0.02 });
    },
    enemyhit() {
      tone({ freq: 260, slideTo: 180, duration: 0.08, type: 'square', gain: 0.035 });
    },
    enemydeath(enemy = 'goblin') {
      const base = enemy === 'golem' ? 120 : enemy === 'archer' ? 220 : 300;
      tone({ freq: base, slideTo: 70, duration: 0.22, type: 'sawtooth', gain: 0.045 });
    },
    revive() {
      tone({ freq: 330, duration: 0.16, type: 'sine', gain: 0.05 });
      tone({ freq: 494, duration: 0.16, type: 'sine', gain: 0.05, delay: 0.14 });
      tone({ freq: 660, duration: 0.24, type: 'sine', gain: 0.05, delay: 0.28 });
    },
    heal() {
      tone({ freq: 660, duration: 0.14, type: 'sine', gain: 0.04 });
      tone({ freq: 880, duration: 0.18, type: 'sine', gain: 0.04, delay: 0.12 });
    },
    denda() {
      tone({ freq: 392, duration: 0.12, type: 'triangle', gain: 0.04 });
      tone({ freq: 523, duration: 0.12, type: 'triangle', gain: 0.04, delay: 0.1 });
      tone({ freq: 659, duration: 0.2, type: 'triangle', gain: 0.04, delay: 0.2 });
    },
    buy() {
      tone({ freq: 988, duration: 0.07, type: 'square', gain: 0.032 });
      tone({ freq: 1318, duration: 0.12, type: 'square', gain: 0.03, delay: 0.06 });
    },
    ui() {
      tone({ freq: 620, duration: 0.06, type: 'square', gain: 0.03 });
    },
  };

  return api;
}
