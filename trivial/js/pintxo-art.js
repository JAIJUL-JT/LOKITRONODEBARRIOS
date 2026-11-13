const TOPPINGS = [
  (c) => `
    <circle cx="24" cy="34" r="5" fill="${c}" stroke="#3a2410" stroke-width="1"/>
    <circle cx="38" cy="32" r="5" fill="${c}" stroke="#3a2410" stroke-width="1"/>
    <circle cx="31" cy="43" r="5" fill="${c}" stroke="#3a2410" stroke-width="1"/>`,
  (c) => `
    <path d="M18 38 Q26 24 34 34 T48 30" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
    <path d="M18 38 Q26 24 34 34 T48 30" fill="none" stroke="#3a2410" stroke-width="1" stroke-linecap="round"/>`,
  (c) => `
    <path d="M22 36 Q30 22 40 34 Q45 40 50 34" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="22" cy="36" r="2.5" fill="#3a2410"/>`,
  (c) => `
    <path d="M26 42 C20 34 26 24 34 26 C42 28 42 38 36 42 Z" fill="${c}" stroke="#3a2410" stroke-width="1"/>
    <path d="M36 42 Q42 44 44 36" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`,
  (c) => `
    <path d="M20 40 A12 12 0 0 1 44 40 Z" fill="${c}" stroke="#3a2410" stroke-width="1"/>
    <rect x="29" y="28" width="6" height="10" rx="3" fill="#f4e2c0" stroke="#3a2410" stroke-width="1"/>`,
  (c) => `
    <circle cx="32" cy="35" r="11" fill="#f7f0dc" stroke="#3a2410" stroke-width="1"/>
    <circle cx="32" cy="35" r="5" fill="${c}" stroke="#c98a2a" stroke-width="1"/>`,
];

const GARNISH = [
  (c) => `<circle cx="18" cy="26" r="1.4" fill="#fff3cf"/><circle cx="46" cy="27" r="1.2" fill="#fff3cf"/><circle cx="40" cy="18" r="1" fill="#fff3cf"/>`,
  (c) => `<path d="M44 20 Q50 14 54 20 Q48 22 44 20 Z" fill="#4f8a3d"/><path d="M47 22 Q52 26 50 30" fill="none" stroke="#4f8a3d" stroke-width="1.5"/>`,
  (c) => `<path d="M14 44 Q18 52 24 54" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/><circle cx="15" cy="43" r="2" fill="${c}"/>`,
  (c) => `<path d="M48 44 A8 8 0 0 1 56 36 L56 48 Z" fill="#f6d34d" opacity="0.85"/><path d="M48 44 A8 8 0 0 1 56 36" fill="none" stroke="#c9a227" stroke-width="1"/>`,
];

export function pintxoArt(index, barrio, { locked = false, size = 44 } = {}) {
  const color = locked ? '#6b6257' : (barrio?.pintxo?.color || '#e7c15a');
  const forma = barrio?.pintxo?.forma ?? index % 6;
  const garnish = index % GARNISH.length;
  const rotation = ((index * 17) % 21) - 10;

  return `<svg class="pintxo-svg" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <g transform="rotate(${rotation} 32 34)" opacity="${locked ? 0.55 : 1}">
      <rect x="14" y="40" width="36" height="12" rx="6" fill="#d9a05b" stroke="#7a4a1f" stroke-width="1.5"/>
      <rect x="18" y="43" width="28" height="5" rx="2.5" fill="#f3cf94" opacity="0.8"/>
      <line x1="32" y1="16" x2="32" y2="48" stroke="#c8a165" stroke-width="2" stroke-linecap="round"/>
      <circle cx="32" cy="15" r="2.6" fill="${color}" stroke="#3a2410" stroke-width="1"/>
      ${TOPPINGS[forma % TOPPINGS.length](color)}
      ${GARNISH[garnish](color)}
      <text x="32" y="60" text-anchor="middle" font-size="7" font-family="system-ui, sans-serif" font-weight="700" fill="${locked ? '#463f37' : '#3a2410'}" opacity="0.75">${index + 1}</text>
    </g>
    ${locked ? `<rect x="20" y="22" width="24" height="18" rx="4" fill="rgba(20,14,8,0.55)" stroke="#d9c37a" stroke-width="1"/><path d="M26 31 h12 M32 25 v-3 a5 5 0 0 1 10 0" fill="none" stroke="#d9c37a" stroke-width="1.5"/>` : ''}
  </svg>`;
}
