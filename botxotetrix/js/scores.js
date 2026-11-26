// scores.js — Puntuaciones Supabase en tiempo real + fallback localStorage.

const LOCAL_STORAGE_SCORES_KEY = 'botxotetrix_local_scores_v1';

let supabaseClient = null;
let realtimeChannel = null;

export function getSupabaseScoresClient() {
  if (supabaseClient) return supabaseClient;
  const config = (typeof window !== 'undefined' && window.__APP_CONFIG__) || {};
  const url = config.SUPABASE_URL || 'https://uswikdckptzivsurzrlc.supabase.co';
  const key = config.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzd2lrZGNrcHR6aXZzdXJ6cmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5ODAwNTEsImV4cCI6MjEwNjU1NjA1MX0.3kovmMBfC_JCGKyJ_1s5iyxtkKyqVMIt77CfHnytLzI';

  if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(url, key);
      return supabaseClient;
    } catch (e) {
      console.warn('No se pudo inicializar cliente de Supabase:', e);
    }
  }
  return null;
}

export function getLocalScores() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SCORES_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (_) {
    return [];
  }
}

export function saveLocalScore(entry) {
  try {
    const current = getLocalScores();
    current.push(entry);
    current.sort((a, b) => b.score - a.score);
    const top = current.slice(0, 30);
    localStorage.setItem(LOCAL_STORAGE_SCORES_KEY, JSON.stringify(top));
    return top;
  } catch (_) {
    return [];
  }
}

export async function fetchTopScores(limit = 25) {
  const client = getSupabaseScoresClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('botxotetrix_scores')
        .select('*')
        .order('score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && Array.isArray(data)) {
        return { isLive: true, scores: data };
      }
    } catch (err) {
      console.warn('Error obteniendo puntuaciones remotas:', err);
    }
  }

  const local = getLocalScores().slice(0, limit);
  return { isLive: false, scores: local };
}

export async function submitScore({ playerName, score, lines, level }) {
  const cleanName = (playerName || 'Maestre anónimo').trim().slice(0, 25);
  const entry = {
    player_name: cleanName,
    score: Math.max(0, Math.floor(score || 0)),
    lines: Math.max(0, Math.floor(lines || 0)),
    level: Math.max(1, Math.floor(level || 1)),
    created_at: new Date().toISOString(),
  };

  saveLocalScore(entry);

  const client = getSupabaseScoresClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('botxotetrix_scores')
        .insert([{
          player_name: entry.player_name,
          score: entry.score,
          lines: entry.lines,
          level: entry.level,
        }])
        .select();

      if (!error) {
        return { success: true, isLive: true, entry: data?.[0] || entry };
      }
    } catch (err) {
      console.warn('Error guardando en Supabase:', err);
    }
  }

  return { success: true, isLive: false, entry };
}

export function subscribeToScores(callback) {
  const client = getSupabaseScoresClient();
  if (!client) return null;

  try {
    if (realtimeChannel) {
      client.removeChannel(realtimeChannel);
    }

    realtimeChannel = client
      .channel('public:botxotetrix_scores')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'botxotetrix_scores' },
        (payload) => {
          if (typeof callback === 'function') {
            callback(payload.new);
          }
        }
      )
      .subscribe();

    return realtimeChannel;
  } catch (e) {
    console.warn('Error suscribiendo a realtime:', e);
    return null;
  }
}

export function getBestLocalScore() {
  const list = getLocalScores();
  if (!list.length) return 0;
  return list.reduce((max, e) => Math.max(max, e.score || 0), 0);
}
