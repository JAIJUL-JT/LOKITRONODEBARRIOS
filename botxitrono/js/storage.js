// Persistencia local del progreso de Aritza. Sin backend, sin red.

const STORAGE_KEY = 'aritza_reino_v1';

export const DEFAULT_PROFILE = {
  bestScore: 0,
  bestLevel: 1,
  totalCoins: 0,
  totalRuns: 0,
  muted: false,
  reducedMotion: false,
  heroId: 'aritza',
};

function getStorage() {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  } catch (_) {
    return null;
  }
}

export function loadProfile() {
  const storage = getStorage();
  if (!storage) return { ...DEFAULT_PROFILE };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      bestScore: Number(parsed.bestScore) || 0,
      bestLevel: Math.max(1, Number(parsed.bestLevel) || 1),
      totalCoins: Number(parsed.totalCoins) || 0,
      totalRuns: Number(parsed.totalRuns) || 0,
      muted: Boolean(parsed.muted),
      reducedMotion: Boolean(parsed.reducedMotion),
    };
  } catch (_) {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile) {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch (_) {
    return false;
  }
}

// Registra el resultado de una aventura y devuelve el perfil actualizado más
// información sobre si se ha batido el récord.
export function recordRun(profile, run) {
  const updated = { ...profile };
  const isBestScore = run.score > profile.bestScore;
  const isBestLevel = run.level > profile.bestLevel;

  if (isBestScore) updated.bestScore = run.score;
  if (isBestLevel) updated.bestLevel = Math.max(1, run.level);
  updated.totalCoins =
    (profile.totalCoins || 0) + (run.coinsCollected ?? run.coins ?? 0);
  updated.totalRuns = (profile.totalRuns || 0) + 1;

  return { profile: updated, isBestScore, isBestLevel };
}
