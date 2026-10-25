// Sistema de temas estacionales LokiTrono de Barrios
// Aplica temas según fecha/época

const SEASONAL_THEMES = {
  halloween: {
    name: 'Halloween',
    startMonth: 10, startDay: 15,
    endMonth: 11, endDay: 2,
    cssClass: 'theme-halloween',
    colors: { primary: '#ff6b1c', accent: '#a855f7', bg: '#0a0a0a' }
  },
  navidad: {
    name: 'Navidad',
    startMonth: 12, startDay: 1,
    endMonth: 12, endDay: 31,
    cssClass: 'theme-navidad',
    colors: { primary: '#dc2626', accent: '#22c55e', bg: '#0f172a' }
  },
  invierno: {
    name: 'Invierno',
    startMonth: 12, startDay: 21,
    endMonth: 2, endDay: 28,
    cssClass: 'theme-invierno',
    colors: { primary: '#93c5fd', accent: '#e0f2fe', bg: '#020617' }
  },
  solsticio_invierno: {
    name: 'Solsticio de Invierno',
    startMonth: 12, startDay: 21,
    endMonth: 12, endDay: 22,
    cssClass: 'theme-solsticio-invierno',
    colors: { primary: '#cbd5e1', accent: '#f1f5f9', bg: '#0f172a' }
  },
  carnavales: {
    name: 'Carnavales',
    startMonth: 2, startDay: 1,
    endMonth: 2, endDay: 28, // Aproximado, se puede ajustar
    cssClass: 'theme-carnavales',
    colors: { primary: '#ec4899', accent: '#f59e0b', bg: '#1e1b4b' }
  },
  primavera: {
    name: 'Primavera',
    startMonth: 3, startDay: 20,
    endMonth: 6, endDay: 20,
    cssClass: 'theme-primavera',
    colors: { primary: '#22c55e', accent: '#fbbf24', bg: '#064e3b' }
  },
  verano: {
    name: 'Verano',
    startMonth: 6, startDay: 21,
    endMonth: 9, endDay: 22,
    cssClass: 'theme-verano',
    colors: { primary: '#f59e0b', accent: '#06b6d4', bg: '#78350f' }
  },
  solsticio_verano: {
    name: 'Solsticio de Verano',
    startMonth: 6, startDay: 20,
    endMonth: 6, endDay: 21,
    cssClass: 'theme-solsticio-verano',
    colors: { primary: '#fbbf24', accent: '#fef3c7', bg: '#92400e' }
  },
  otono: {
    name: 'Otoño',
    startMonth: 9, startDay: 23,
    endMonth: 12, endDay: 20,
    cssClass: 'theme-otono',
    colors: { primary: '#ea580c', accent: '#a16207', bg: '#431407' }
  }
};

function getActiveSeasonalTheme() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // Comprobar temas con prioridad
  for (const [key, theme] of Object.entries(SEASONAL_THEMES)) {
    if (isDateInRange(month, day, theme.startMonth, theme.startDay, theme.endMonth, theme.endDay)) {
      return { key, ...theme };
    }
  }
  return null;
}

function isDateInRange(m, d, sm, sd, em, ed) {
  if (sm === em) {
    return m === sm && d >= sd && d <= ed;
  }
  if (sm < em) {
    // Mismo año
    if (m < sm || m > em) return false;
    if (m === sm && d < sd) return false;
    if (m === em && d > ed) return false;
    return true;
  } else {
    // Cruza año (ej invierno)
    if (m > sm || m < em) return true;
    if (m === sm && d >= sd) return true;
    if (m === em && d <= ed) return true;
    return false;
  }
}

function applySeasonalTheme() {
  const theme = getActiveSeasonalTheme();
  if (!theme) {
    document.body.classList.remove(...Object.values(SEASONAL_THEMES).map(t => t.cssClass));
    return;
  }
  
  // Remover temas anteriores
  Object.values(SEASONAL_THEMES).forEach(t => {
    document.body.classList.remove(t.cssClass);
  });
  
  document.body.classList.add(theme.cssClass);
  document.documentElement.style.setProperty('--seasonal-primary', theme.colors.primary);
  document.documentElement.style.setProperty('--seasonal-accent', theme.colors.accent);
  
  console.log(`🎨 Tema estacional aplicado: ${theme.name}`);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applySeasonalTheme);
} else {
  applySeasonalTheme();
}

// Aplicar cada hora
setInterval(applySeasonalTheme, 3600000);

window.applySeasonalTheme = applySeasonalTheme;
window.getActiveSeasonalTheme = getActiveSeasonalTheme;
