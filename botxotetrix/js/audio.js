// audio.js — Efectos sintetizados con WebAudio. Sin ficheros externos.
// Se inicializa de forma perezosa tras un gesto del usuario.

export function createAudio(initialMuted = false) {
  let ctx = null;
  let muted = Boolean(initialMuted);

  function ensureContext() {
    if (ctx) return ctx;
    const AudioCtor =
      typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (!AudioCtor) return null;
    try {
      ctx = new AudioCtor();
    } catch (_) {
      ctx = null;
    }
    return ctx;
  }

  function resume() {
    const c = ensureContext();
    if (c && c.state === 'suspended') c.resume().catch(() => {});
  }

  function tone(freq, duration = 0.1, type = 'square', gainVal = 0.05, when = 0) {
    if (muted) return;
    const c = ensureContext();
    if (!c) return;
    const t0 = c.currentTime + when;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainVal, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function noise(duration = 0.15, gainVal = 0.08) {
    if (muted) return;
    const c = ensureContext();
    if (!c) return;
    const len = Math.floor(c.sampleRate * duration);
    const buffer = c.createBuffer(1, len, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buffer;
    const gain = c.createGain();
    gain.gain.value = gainVal;
    src.connect(gain);
    gain.connect(c.destination);
    src.start();
  }

  return {
    resume,
    get muted() { return muted; },
    setMuted(v) { muted = Boolean(v); },
    toggleMuted() { muted = !muted; return muted; },

    move() {
      tone(220, 0.04, 'square', 0.03);
    },
    rotate() {
      tone(440, 0.07, 'triangle', 0.05);
      tone(660, 0.06, 'triangle', 0.04, 0.05);
    },
    softDrop() {
      tone(160, 0.04, 'sine', 0.03);
    },
    hardDrop() {
      noise(0.12, 0.1);
      tone(90, 0.12, 'square', 0.06);
    },
    lock() {
      tone(120, 0.08, 'square', 0.04);
    },
    lineClear(count = 1) {
      const base = 392;
      for (let i = 0; i < count + 1; i++) {
        tone(base * Math.pow(1.25, i), 0.12, 'triangle', 0.06, i * 0.07);
      }
      if (count >= 4) {
        tone(880, 0.25, 'sawtooth', 0.05, 0.3);
        tone(1174, 0.3, 'triangle', 0.05, 0.38);
      }
    },
    levelUp() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.14, 'triangle', 0.06, i * 0.09));
    },
    gameOver() {
      [440, 370, 311, 261].forEach((f, i) => tone(f, 0.28, 'sawtooth', 0.05, i * 0.16));
      noise(0.4, 0.06);
    },
    ui() {
      tone(520, 0.05, 'triangle', 0.04);
    },
  };
}
