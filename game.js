/* Rail · Le designer en 2030
   Une journée de Harith, designer de design system, en 5 moments (07:45 → 16:30) + épilogue.
   Chaque moment : une BD de 3 cases, une décision unique, sa conséquence pour les voyageurs,
   la meilleure option expliquée et le principe de design. Pas de « réessayer » : on apprend de chaque choix.
   Musique générée en direct (Web Audio), qui change selon l'ambiance. Interface bilingue FR / ID. */

const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Langue ---------- */
let LANG = 'fr';
try { const q = new URLSearchParams(location.search).get('lang'); LANG = q === 'id' || q === 'fr' ? q : (localStorage.getItem('rail-lang') || 'fr'); } catch (e) {}
const nb = t => typeof t === 'string' ? t.replace(/ ([?!;:»])/g, '\u202f$1').replace(/« /g, '«\u202f') : t; // espaces insécables à la française
const tx = (fr, id) => LANG === 'id' ? id : nb(fr);
const L = o => (o && typeof o === 'object' && 'fr' in o) ? (LANG === 'id' ? o.id : nb(o.fr)) : o;

/* ---------- Icônes ---------- */
const I = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m23 9-6 6M17 9l6 6"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V4.5M9 7h7"/></svg>',
  redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.5 7 .8-5.2 4.8 1.5 7L12 17.6 5.7 21l1.5-7L2 9.3l7-.8z"/></svg>'
};

/* =====================================================================
   PERSONNAGES (même construction dans toutes les cases, animations légères)
   ===================================================================== */
const INK = '#2A2536';
const CAST = {
  harith: { skin: '#B8794E', hair: '#2A2536', top: '#7C3AED', glasses: true, phones: true },
  ines:   { skin: '#F1C7A3', hair: '#B45309', top: '#10B981', bun: true },
  lina:   { skin: '#8D5A3B', hair: '#3B2A20', top: '#FBBF24', scarf: true }
};
const ROLE = {
  harith: { fr: 'Designer de design system chez Ligne. Il écrit les règles que suivent les agents.', id: 'Desainer design system di Ligne. Ia menulis aturan yang diikuti para agen.' },
  ines: { fr: 'Product owner. Elle reçoit les plaintes des voyageurs et fixe les délais.', id: 'Product owner. Ia menerima keluhan penumpang dan menentukan tenggat.' },
  lina: { fr: 'Voyageuse, elle prend le tram T2 tous les jours. Elle vit les conséquences.', id: 'Penumpang yang naik trem T2 setiap hari. Ia merasakan dampaknya.' },
  pixel: { fr: 'Agent IA. Il fabrique les écrans très vite… et suit les consignes à la lettre.', id: 'Agen AI. Ia membuat layar dengan sangat cepat… dan menuruti perintah secara harfiah.' }
};
const NAME = { harith: 'Harith', ines: 'Inès', lina: 'Lina', pixel: 'Pixel' };
function face(m, glasses) {
  const eyes = m === 'happy' ? '<path d="M21 31 q3 -3 6 0 M35 31 q3 -3 6 0" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    : `<g class="eyes"><circle cx="24" cy="31" r="${m === 'surprised' ? 3 : 2.4}" fill="#2A2536"/><circle cx="38" cy="31" r="${m === 'surprised' ? 3 : 2.4}" fill="#2A2536"/></g>`;
  const brows = m === 'worried' ? '<path d="M19 24 l8 2 M43 24 l-8 2" stroke="#2A2536" stroke-width="2.5" stroke-linecap="round"/>'
    : m === 'surprised' ? '<path d="M19 22 q5 -3 9 0 M34 22 q5 -3 9 0" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    : m === 'think' ? '<path d="M19 25 h8 M35 23 l8 1" stroke="#2A2536" stroke-width="2.5" stroke-linecap="round"/>' : '';
  const mouth = m === 'happy' ? '<path d="M24 39 Q31 47 38 39 Z" fill="#2A2536"/>'
    : m === 'worried' ? '<path d="M25 44 Q31 39 37 44" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    : m === 'surprised' ? '<ellipse cx="31" cy="43" rx="3.2" ry="4" fill="#2A2536"/>'
    : m === 'think' ? '<path d="M27 42 h8" stroke="#2A2536" stroke-width="2.5" stroke-linecap="round"/>'
    : '<path d="M25 40 Q31 44 37 40" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  const cheeks = m === 'happy' ? '<circle cx="19" cy="38" r="3.5" fill="#F472B6" opacity=".45"/><circle cx="43" cy="38" r="3.5" fill="#F472B6" opacity=".45"/>' : '';
  const g = glasses ? '<circle cx="24" cy="31" r="6" fill="#fff" fill-opacity=".25" stroke="#2A2536" stroke-width="2.4"/><circle cx="38" cy="31" r="6" fill="#fff" fill-opacity=".25" stroke="#2A2536" stroke-width="2.4"/><path d="M30 31h2" stroke="#2A2536" stroke-width="2.4"/>' : '';
  const sweat = m === 'worried' ? '<path class="drip" d="M50 18 q3 5 0 7 q-3 -2 0 -7z" fill="#7DD3FC" stroke="#2A2536" stroke-width="1.5"/>' : '';
  const thought = m === 'think' ? '<g class="pulse"><circle cx="56" cy="8" r="2.5" fill="#fff" stroke="#2A2536" stroke-width="1.5"/><circle cx="62" cy="1" r="3.5" fill="#fff" stroke="#2A2536" stroke-width="1.5"/></g>' : '';
  return brows + eyes + g + cheeks + mouth + sweat + thought;
}
/* who : 'harith' | 'ines' | 'lina' ; o : { mood, arms: 'down'|'up'|'point'|'hold'|'chin'|'eyes', item: 'coffee'|'phone'|'tablet', flip } */
function person(who, x, y, s, o = {}) {
  const c = CAST[who], m = o.mood || 'neutral';
  const arm = (d) => `<path d="${d}" stroke="${INK}" stroke-width="13" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${c.top}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
  const hand = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="5" fill="${c.skin}" stroke="${INK}" stroke-width="2"/>`;
  let arms = '';
  if (o.arms === 'up') arms = `<g class="wave">${arm('M12 66 L2 42') + hand(2, 40)}</g>` + arm('M50 66 L60 42') + hand(60, 40);
  else if (o.arms === 'point') arms = arm('M12 68 L8 92') + arm('M50 66 L72 60') + hand(8, 94) + hand(75, 59);
  else if (o.arms === 'hold') arms = arm('M12 68 L24 84') + arm('M50 68 L40 84') + hand(26, 86) + hand(38, 86);
  else if (o.arms === 'chin') arms = arm('M12 68 L8 94') + arm('M50 66 L40 50') + hand(8, 96) + hand(38, 49);
  else if (o.arms === 'eyes') arms = arm('M12 66 L20 34') + arm('M50 66 L42 34') + hand(21, 32) + hand(41, 32);
  else arms = arm('M12 68 L6 94') + arm('M50 68 L56 94') + hand(6, 96) + hand(56, 96);
  let item = '';
  if (o.item === 'coffee') item = '<rect x="30" y="78" width="14" height="16" rx="3" fill="#fff" stroke="#2A2536" stroke-width="2.5"/><path d="M44 82 q6 0 6 5 q0 5 -6 5" fill="none" stroke="#2A2536" stroke-width="2.5"/><path class="steam" d="M34 72 q2 -4 0 -7 M40 72 q2 -4 0 -7" stroke="#A78BFA" stroke-width="2" fill="none" stroke-linecap="round"/>';
  if (o.item === 'phone') item = '<rect x="24" y="74" width="16" height="24" rx="3" fill="#2E1065" stroke="#2A2536" stroke-width="2.5"/><rect class="glow" x="27" y="78" width="10" height="14" rx="1" fill="#E0F2FE"/>';
  if (o.item === 'tablet') item = '<rect x="18" y="76" width="30" height="22" rx="4" fill="#fff" stroke="#2A2536" stroke-width="2.5"/><path d="M23 83h18M23 89h12" stroke="#7C3AED" stroke-width="2.4" stroke-linecap="round"/>';
  const hair = c.bun ? '<circle cx="31" cy="7" r="8" fill="' + c.hair + '" stroke="#2A2536" stroke-width="2.5"/><path d="M12 30 Q11 9 31 9 Q51 9 50 30 Q44 17 31 17 Q19 17 12 30Z" fill="' + c.hair + '"/>'
    : '<path d="M12 28 Q12 8 31 8 Q50 8 50 26 Q42 16 28 18 Q18 19 12 28Z" fill="' + c.hair + '"/><path d="M20 15 q8 -5 16 -3" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  const scarf = c.scarf ? '<path d="M17 56 Q31 66 45 56 L45 62 Q31 72 17 62Z" fill="#DB2777" stroke="#2A2536" stroke-width="2"/><path d="M38 62 l4 14 l-7 -2z" fill="#DB2777" stroke="#2A2536" stroke-width="2"/>' : '';
  const phones = c.phones ? '<path d="M11 32 Q11 5 31 5 Q51 5 51 32" fill="none" stroke="#10B981" stroke-width="4"/><rect x="6" y="27" width="9" height="13" rx="4" fill="#10B981" stroke="#2A2536" stroke-width="2"/><rect x="47" y="27" width="9" height="13" rx="4" fill="#10B981" stroke="#2A2536" stroke-width="2"/>' : '';
  const flip = o.flip ? ` translate(62 0) scale(-1 1)` : '';
  return `<g transform="translate(${x} ${y}) scale(${s})${flip}">
    <ellipse cx="31" cy="141" rx="28" ry="5" fill="#2A2536" opacity=".12"/>
    <g class="idle">
    <rect x="18" y="98" width="11" height="40" rx="5" fill="#2E1065"/><rect x="33" y="98" width="11" height="40" rx="5" fill="#2E1065"/>
    <ellipse cx="23" cy="139" rx="9" ry="5" fill="#2A2536"/><ellipse cx="39" cy="139" rx="9" ry="5" fill="#2A2536"/>
    <path d="M8 106 Q6 62 31 56 Q56 62 54 106 Z" fill="${c.top}" stroke="#2A2536" stroke-width="3"/>
    <path d="M31 62 V104" stroke="#2A2536" stroke-opacity=".18" stroke-width="2"/>
    ${scarf}${arms}${item}
    <rect x="27" y="44" width="9" height="14" fill="${c.skin}"/>
    <circle cx="31" cy="30" r="19" fill="${c.skin}" stroke="#2A2536" stroke-width="3"/>
    ${hair}${face(m, c.glasses)}${phones}
    </g>
  </g>`;
}
/* Pixel, l'agent IA : 'ok' | 'happy' | 'error' */
function bot(x, y, s, mood = 'ok', body = '#A7F3D0', cls = 'bob') {
  const eyes = mood === 'error' ? '<path d="M12 19 l6 6 M18 19 l-6 6 M22 19 l6 6 M28 19 l-6 6" stroke="#F87171" stroke-width="2.4" stroke-linecap="round"/>'
    : mood === 'happy' ? '<path d="M12 24 q3 -4 6 0 M22 24 q3 -4 6 0" stroke="#A7F3D0" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    : '<g class="eyes"><circle cx="15" cy="22" r="2.6" fill="#A7F3D0"/><circle cx="25" cy="22" r="2.6" fill="#A7F3D0"/></g>';
  const mouth = mood === 'error' ? '<path d="M14 33 q6 -4 12 0" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>' : '<path d="M14 32 q6 4 12 0" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="20" cy="50" rx="14" ry="3.5" fill="#2A2536" opacity=".12"/><g class="${mood === 'error' ? 'shake' : cls}">
    <line x1="20" y1="2" x2="20" y2="10" stroke="#2A2536" stroke-width="3" stroke-linecap="round"/><circle class="${mood === 'error' ? 'alarm' : 'pulse'}" cx="20" cy="3" r="3.5" fill="${mood === 'error' ? '#F87171' : '#DB2777'}" stroke="#2A2536" stroke-width="2"/>
    <rect x="3" y="10" width="34" height="28" rx="11" fill="${mood === 'error' ? '#E5E7EB' : body}" stroke="#2A2536" stroke-width="3"/>
    <rect x="8" y="15" width="24" height="13" rx="6" fill="#2E1065"/>${eyes}${mouth}
    <path d="M3 24 h-4 M37 24 h4" stroke="#2A2536" stroke-width="3" stroke-linecap="round"/></g></g>`;
}
const spark = (x, y) => `<g class="pop" transform="translate(${x} ${y})" stroke="#2A2536" stroke-width="2.5" stroke-linecap="round"><path d="M0 -10 v-6 M8 -6 l4 -4 M-8 -6 l-4 -4"/></g>`;
const sparkles = (pts) => pts.map(([x, y], i) => `<g transform="translate(${x} ${y})"><path class="twinkle t${i % 3}" d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z" fill="#FDE68A" stroke="#2A2536" stroke-width="1.5"/></g>`).join('');
const bang = (x, y) => `<g transform="translate(${x} ${y})"><g class="pop"><circle r="13" fill="#F87171" stroke="#2A2536" stroke-width="2.5"/><path d="M0 -6 v6 M0 5 v.5" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></g></g>`;
const ask = (x, y) => `<g transform="translate(${x} ${y})"><g class="pop"><circle r="13" fill="#FDE68A" stroke="#2A2536" stroke-width="2.5"/><path d="M-4 -4 q0 -5 4 -5 q4 0 4 4 q0 3 -4 4 v2 M0 6 v.5" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/></g></g>`;

/* ---------- Décors ---------- */
const W = 320, H = 220;
function clock(t, x, y) {
  const [h, m] = t.split(':').map(Number);
  return `<g transform="translate(${x} ${y})"><circle r="13" fill="#fff" stroke="#2A2536" stroke-width="2.5"/><path d="M0 0 V-8" stroke="#2A2536" stroke-width="2.2" stroke-linecap="round" transform="rotate(${m * 6})"/><path d="M0 0 V-5.5" stroke="#7C3AED" stroke-width="3" stroke-linecap="round" transform="rotate(${(h % 12) * 30 + m / 2})"/><circle r="1.5" fill="#2A2536"/></g>`;
}
function office(screen = '', o = {}) {
  const light = o.light || '#EDE8F8', sky = o.night ? '#4C1D95' : '#DBEAFE';
  return `<rect width="${W}" height="${H}" fill="${light}"/>
    <rect x="18" y="16" width="120" height="78" rx="10" fill="${sky}" stroke="#2A2536" stroke-width="3"/>
    ${o.night ? '<circle cx="118" cy="32" r="7" fill="#FDE68A"/><circle cx="40" cy="28" r="1.5" fill="#fff"/><circle cx="70" cy="24" r="1.2" fill="#fff"/>' : '<g class="drift"><ellipse cx="44" cy="30" rx="12" ry="5" fill="#fff"/><ellipse cx="104" cy="38" rx="10" ry="4" fill="#fff"/></g>'}
    <g fill="#C4B5FD" stroke="#2A2536" stroke-width="2"><rect x="30" y="54" width="18" height="40"/><path d="M58 94 V40 Q65 28 72 40 V94Z" fill="#A78BFA"/><rect x="82" y="62" width="22" height="32"/><rect x="110" y="70" width="16" height="24"/></g>
    <path d="M78 16 V94 M18 55 H138" stroke="#2A2536" stroke-width="2.5"/>
    ${clock(o.time || '07:45', 296, 30)}
    <path d="M240 0 V18" stroke="#2A2536" stroke-width="2"/><path d="M226 30 Q240 12 254 30Z" fill="#FDE68A" stroke="#2A2536" stroke-width="2.5"/><ellipse class="pulse" cx="240" cy="40" rx="20" ry="6" fill="#FDE68A" opacity=".35"/>
    <rect y="168" width="${W}" height="52" fill="#DDD6FE"/><path d="M0 168 H${W}" stroke="#2A2536" stroke-width="2" stroke-opacity=".25"/>
    <g transform="translate(148 112)"><g class="sway"><path d="M8 38 Q-4 20 2 8 M8 38 Q10 14 20 4 M8 38 Q22 24 26 16" stroke="#047857" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="2" cy="10" rx="5" ry="8" fill="#34D399" stroke="#2A2536" stroke-width="2" transform="rotate(-20 2 10)"/><ellipse cx="20" cy="6" rx="5" ry="8" fill="#34D399" stroke="#2A2536" stroke-width="2" transform="rotate(25 20 6)"/><ellipse cx="25" cy="18" rx="4" ry="7" fill="#6EE7B7" stroke="#2A2536" stroke-width="2" transform="rotate(50 25 18)"/></g><path d="M0 38 h18 l-3 14 h-12z" fill="#F9A8D4" stroke="#2A2536" stroke-width="2.5"/></g>
    <rect x="172" y="150" width="140" height="12" rx="4" fill="#C4B5FD" stroke="#2A2536" stroke-width="3"/>
    <rect class="${o.alarm ? 'alarm' : 'glow'}" x="178" y="66" width="112" height="80" rx="14" fill="${o.alarm ? '#F87171' : '#A78BFA'}" opacity=".25"/>
    <rect x="182" y="72" width="104" height="72" rx="10" fill="#2E1065" stroke="#2A2536" stroke-width="3"/>
    <rect x="228" y="144" width="12" height="8" fill="#2A2536"/>
    <g transform="translate(190 80)">${screen}</g>`;
}
function tramInside() {
  const city = Array.from({ length: 16 }, (_, i) => `<rect x="${i * 40}" y="${60 + (i * 37) % 30}" width="${22 + (i * 13) % 14}" height="${50 - (i * 37) % 30}" rx="3" fill="${['#C4B5FD', '#A78BFA', '#DDD6FE'][i % 3]}"/>`).join('');
  return `<rect width="${W}" height="${H}" fill="#D1FAE5"/>
    <rect y="36" width="${W}" height="76" fill="#BAE6FD"/>
    <g class="scroll">${city}<g transform="translate(640 0)"></g></g>
    <path fill="#D1FAE5" fill-rule="evenodd" d="M0 26 H${W} V114 H0Z M16 40 h86 v64 h-86Z M118 40 h86 v64 h-86Z M220 40 h86 v64 h-86Z"/>
    <path d="M16 40 h86 v64 h-86Z M118 40 h86 v64 h-86Z M220 40 h86 v64 h-86Z" fill="none" stroke="#2A2536" stroke-width="3" stroke-linejoin="round"/>
    <rect x="0" y="0" width="${W}" height="26" fill="#10B981" stroke="#2A2536" stroke-width="3"/>
    <path d="M0 13 H${W}" stroke="#047857" stroke-width="4"/>
    <g class="swing" style="transform-origin:110px 13px"><path d="M110 13 V34" stroke="#2A2536" stroke-width="2.5"/><circle cx="110" cy="40" r="6" fill="none" stroke="#2A2536" stroke-width="3"/></g>
    <g class="swing s2" style="transform-origin:212px 13px"><path d="M212 13 V34" stroke="#2A2536" stroke-width="2.5"/><circle cx="212" cy="40" r="6" fill="none" stroke="#2A2536" stroke-width="3"/></g>
    <path d="M64 26 V220 M262 26 V220" stroke="#047857" stroke-width="6"/>
    <rect y="186" width="${W}" height="34" fill="#A7F3D0"/><path d="M0 186 H${W}" stroke="#2A2536" stroke-width="2" stroke-opacity=".25"/>`;
}
function station(screenContent, o = {}) {
  return `<rect width="${W}" height="${H}" fill="#E0F2FE"/>
    <g class="drift"><ellipse cx="60" cy="26" rx="16" ry="6" fill="#fff"/><ellipse cx="250" cy="18" rx="12" ry="5" fill="#fff"/></g>
    <g fill="#DDD6FE" stroke="#2A2536" stroke-width="1.5" stroke-opacity=".4"><rect x="10" y="70" width="30" height="80"/><rect x="44" y="90" width="24" height="60"/><path d="M80 150 V60 Q90 44 100 60 V150Z"/><rect x="108" y="96" width="30" height="54"/></g>
    ${o.tram ? `<g class="tramIn"><rect x="0" y="118" width="150" height="50" rx="18" fill="#10B981" stroke="#2A2536" stroke-width="3"/>${[14, 50, 86].map(x => `<rect x="${x}" y="128" width="26" height="18" rx="5" fill="#E0F2FE" stroke="#2A2536" stroke-width="2"/>`).join('')}</g>` : ''}
    <rect y="168" width="${W}" height="52" fill="#C7F0DD"/><path d="M0 170 H${W}" stroke="#FBBF24" stroke-width="6" stroke-dasharray="14 10"/><path d="M0 178 H${W}" stroke="#2A2536" stroke-width="3"/>
    <rect x="150" y="30" width="150" height="80" rx="12" fill="#2E1065" stroke="#2A2536" stroke-width="3"/>
    <rect x="218" y="110" width="12" height="60" fill="#2A2536"/>
    ${o.time ? clock(o.time, 288, 130) : ''}
    <g transform="translate(160 40)">${screenContent}</g>`;
}
/* Gros plan sur un téléphone tenu en main */
function phoneScene(ui, tapX, tapY, o = {}) {
  return `<rect width="${W}" height="${H}" fill="${o.bg || '#EDE8F8'}"/>
    <circle cx="60" cy="60" r="34" fill="#fff" opacity=".5"/><circle cx="270" cy="170" r="44" fill="#fff" opacity=".4"/>
    <rect x="110" y="16" width="100" height="196" rx="18" fill="#2E1065" stroke="#2A2536" stroke-width="3"/>
    <rect x="118" y="30" width="84" height="168" rx="8" fill="#fff"/>
    <rect x="142" y="21" width="36" height="5" rx="2.5" fill="#4C1D95"/>
    <g transform="translate(118 30)">${ui}</g>
    <g transform="translate(${tapX} ${tapY}) rotate(-28)"><g class="${o.shake ? 'shake' : 'tap'}"><rect x="-14" y="30" width="36" height="46" rx="14" fill="#8D5A3B" stroke="#2A2536" stroke-width="2.5"/><rect x="-6.5" y="-2" width="13" height="44" rx="6.5" fill="#8D5A3B" stroke="#2A2536" stroke-width="2.5"/><path d="M-3 4 h6" stroke="#F1C7A3" stroke-width="2" stroke-linecap="round" opacity=".7"/>${o.shake ? '' : '<circle class="pulse" r="9" fill="none" stroke="#7C3AED" stroke-width="2.5"/>'}</g></g>`;
}
const uiRow = (y, w, c = '#C4B5FD') => `<rect x="0" y="${y}" width="${w}" height="8" rx="4" fill="${c}"/>`;
const pill = (x, y, w, h, fill, label, stroke = 'none', tc = '#fff') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="${x + w / 2}" y="${y + h / 2 + 3.5}" text-anchor="middle" font-size="9.5" font-weight="700" fill="${tc}" font-family="Sk Modernist, sans-serif">${label}</text>`;
const appHead = `<rect x="0" y="0" width="84" height="22" fill="#7C3AED"/><text x="8" y="15" font-size="10" font-weight="700" fill="#fff" font-family="Sk Modernist, sans-serif">Ligne</text><g transform="translate(8 32)">${uiRow(0, 60)}${uiRow(14, 44, '#DDD6FE')}</g>`;

/* =====================================================================
   PRINCIPES (carnet)
   ===================================================================== */
const PR = {
  atomic: { ref: 'Atomic design · Brad Frost (2016)', url: 'https://atomicdesign.bradfrost.com/',
    title: { fr: 'Construire avec des briques', id: 'Membangun dengan balok' },
    text: { fr: 'On crée de petits éléments (bouton, champ) puis on les assemble. Un seul composant réutilisé partout évite des centaines de copies différentes.', id: 'Buat elemen kecil (tombol, kolom isian) lalu rangkai. Satu komponen yang dipakai di mana-mana mencegah ratusan salinan yang berbeda-beda.' } },
  tokens: { ref: 'Design tokens · W3C DTCG 2025.10', url: 'https://www.designtokens.org/',
    title: { fr: 'Un nom qui dit à quoi sert la couleur', id: 'Nama yang menjelaskan fungsi warna' },
    text: { fr: 'Un token comme alert.critical porte un sens. Les agents l’appliquent partout de la même façon, et il s’adapte tout seul au thème sombre.', id: 'Token seperti alert.critical membawa makna. Para agen menerapkannya dengan cara yang sama di mana pun, dan otomatis menyesuaikan tema gelap.' } },
  color: { ref: { fr: 'WCAG 2.2 · 1.4.1 · RGAA critère 3.1', id: 'WCAG 2.2 · 1.4.1 · RGAA kriteria 3.1' }, url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html',
    title: { fr: 'Jamais la couleur seule', id: 'Jangan hanya mengandalkan warna' },
    text: { fr: 'Ajoutez une icône et un mot. Une personne daltonienne doit comprendre l’alerte sans voir le rouge.', id: 'Tambahkan ikon dan kata. Penyandang buta warna harus tetap paham peringatannya tanpa melihat warna merah.' } },
  spec: { ref: 'Specification gaming · DeepMind 2020', url: 'https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/',
    title: { fr: 'L’IA fait ce qu’on dit, pas ce qu’on veut dire', id: 'AI melakukan apa yang dikatakan, bukan yang dimaksud' },
    text: { fr: 'Une consigne vague (« plus visible ») laisse l’agent deviner. C’est l’écart entre visée initiale et visée interprétée vu en cours.', id: 'Perintah yang kabur (« lebih terlihat ») membuat agen menebak-nebak. Inilah jarak antara maksud awal dan maksud yang ditafsirkan, seperti di kuliah.' } },
  fitts: { ref: { fr: 'Loi de Fitts · WCAG 2.2 · 2.5.8', id: 'Hukum Fitts · WCAG 2.2 · 2.5.8' }, url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html',
    title: { fr: 'Des cibles faciles à toucher', id: 'Target yang mudah disentuh' },
    text: { fr: 'Plus une cible est grande, plus elle est rapide à atteindre. WCAG 2.2 demande au moins 24 × 24 px ; 44 px est plus confortable, surtout dans un tram qui bouge.', id: 'Makin besar target, makin cepat dijangkau. WCAG 2.2 mensyaratkan minimal 24 × 24 px; 44 px lebih nyaman, apalagi di trem yang bergoyang.' } },
  hick: { ref: { fr: 'Loi de Hick', id: 'Hukum Hick' }, url: 'https://lawsofux.com/hicks-law/',
    title: { fr: 'Moins de choix, décision plus rapide', id: 'Sedikit pilihan, keputusan lebih cepat' },
    text: { fr: 'Plus il y a d’options à l’écran, plus on met de temps à choisir. Mieux vaut un seul bouton clair.', id: 'Makin banyak pilihan di layar, makin lama orang memutuskan. Lebih baik satu tombol yang jelas.' } },
  basics: { ref: { fr: 'Nielsen · 10 heuristiques', id: 'Nielsen · 10 heuristik' }, url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    title: { fr: 'Les fondamentaux ne tombent pas en panne', id: 'Dasar-dasar desain tidak pernah mati' },
    text: { fr: 'Quand l’IA s’arrête, un designer qui connaît ses composants et sait évaluer une interface peut continuer à travailler.', id: 'Saat AI berhenti, desainer yang menguasai komponennya dan bisa mengevaluasi antarmuka tetap bisa bekerja.' } },
  dt: { ref: { fr: 'Design thinking · tester avec 5 usagers', id: 'Design thinking · uji dengan 5 pengguna' }, url: 'https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/',
    title: { fr: 'Tester avant de produire', id: 'Uji dulu sebelum produksi' },
    text: { fr: 'Comprendre, prototyper, tester, puis itérer. Cinq usagers suffisent souvent à révéler la plupart des problèmes, pour un coût minime.', id: 'Pahami, buat prototipe, uji, lalu ulangi. Lima pengguna sering cukup untuk menemukan sebagian besar masalah, dengan biaya kecil.' } }
};

/* =====================================================================
   LES 5 MOMENTS DE LA JOURNÉE
   Chaque choix a sa conséquence pour les voyageurs ; la meilleure option est toujours montrée.
   ===================================================================== */
const btns214 = () => [0, 1, 2, 3, 4, 5].map(i => `<rect class="jitter j${i % 3}" x="${(i % 3) * 30}" y="${Math.floor(i / 3) * 22 + 4}" width="${[24, 18, 26, 20, 14, 22][i]}" height="${[12, 16, 10, 14, 12, 18][i]}" rx="${[2, 8, 0, 5, 7, 3][i]}" fill="${['#F87171', '#60A5FA', '#FBBF24', '#34D399', '#F472B6', '#A78BFA'][i]}"/>`).join('');
const btnsClean = () => [0, 1, 2].map(i => `<rect x="4" y="${i * 17 + 4}" width="76" height="12" rx="6" fill="${['#7C3AED', '#fff', 'transparent'][i]}" stroke="${i ? '#C4B5FD' : 'none'}" stroke-width="2"/>`).join('');
const redScreen = (icon = true) => `<rect class="alarm" x="0" y="0" width="88" height="56" rx="4" fill="#7F1D1D"/>${icon ? '<path d="M30 14 l14 26 h-28z" fill="none" stroke="#FCA5A5" stroke-width="3" stroke-linejoin="round"/><path d="M44 24 v8 M44 36 v.5" stroke="#FCA5A5" stroke-width="3" stroke-linecap="round" transform="translate(-14 0)"/>' : ''}`;
const alertBox = (bg, icon, word, blink) => `<g class="${blink ? 'svgblink' : ''}"><rect x="0" y="22" width="130" height="26" rx="8" fill="${bg}"/>${icon ? '<path d="M10 42 l7 -13 l7 13z" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>' : ''}${word ? `<text x="${icon ? 30 : 10}" y="39" font-size="11" font-weight="700" fill="#fff" font-family="Sk Modernist, sans-serif">${word}</text>` : `<rect x="10" y="31" width="60" height="8" rx="4" fill="#fff"/>`}</g>
  <text x="0" y="12" font-size="10" font-weight="700" fill="#C4B5FD" font-family="Sk Modernist, sans-serif">T2 · Perrache</text>`;
const boardRows = (bad) => `<text x="0" y="12" font-size="10" font-weight="700" fill="#C4B5FD" font-family="Sk Modernist, sans-serif">T2</text>${[0, 1, 2].map(i => `<text x="0" y="${30 + i * 15}" font-size="10" fill="#fff" font-family="Sk Modernist, sans-serif">${['17:04', '17:12', '17:20'][i]}</text><text x="40" y="${30 + i * 15}" font-size="10" font-weight="700" fill="${bad && i === 0 ? '#FCA5A5' : '#A7F3D0'}" font-family="Sk Modernist, sans-serif">${bad && i === 0 ? tx('à l’heure ?', 'tepat waktu?') : tx('à l’heure', 'tepat waktu')}</text>`).join('')}`;

const LEVELS = [
  { time: '07:45', mood: 'calm', key: 'atomic', srcs: 'S13 · S27',
    title: { fr: '214 boutons', id: '214 tombol' },
    panels: [
      { tags: ['harith'], art: () => office(`${uiRow(0, 60, '#7C3AED')}${uiRow(14, 80)}${uiRow(28, 50)}`, { time: '07:45' }) + person('harith', 70, 76, .95, { mood: 'happy', item: 'coffee' }),
        cap: { fr: '07:45. Harith arrive chez Ligne, l’appli des transports de Lyon.', id: '07:45. Harith tiba di kantor Ligne, aplikasi transportasi kota Lyon.' } },
      { tags: ['pixel'], art: () => office(btns214(), { time: '07:46' }) + bot(70, 96, 1.5, 'happy'),
        who: 'Pixel', say: { fr: 'Cette nuit, j’ai créé 214 boutons pour les nouveaux écrans !', id: 'Semalam aku membuat 214 tombol untuk layar-layar baru!' } },
      { tags: ['harith'], art: () => office(btns214(), { time: '07:47' }) + person('harith', 70, 76, .95, { mood: 'surprised', arms: 'up' }) + spark(100, 72),
        who: 'Harith', say: { fr: '214 boutons… et chacun a son propre style !', id: '214 tombol… dan gayanya beda-beda semua!' } }
    ],
    q: { fr: 'Que doit faire Harith ?', id: 'Apa yang sebaiknya dilakukan Harith?' },
    choices: [
      { label: { fr: 'Corriger les 214 boutons à la main, un par un.', id: 'Memperbaiki 214 tombol itu satu per satu secara manual.' },
        art: () => office(btns214(), { time: '23:10', night: true, light: '#D9CFF3' }) + person('harith', 40, 76, .95, { mood: 'worried', arms: 'chin' }) + bot(120, 110, 1.2, 'happy'),
        what: { fr: 'Harith y passe sa journée. Cette nuit, Pixel crée 200 nouveaux boutons : tout est à refaire demain.', id: 'Harith menghabiskan seharian. Malamnya Pixel membuat 200 tombol baru: besok semuanya harus diulang.' } },
      { label: { fr: 'Demander à Pixel de « rendre tous les boutons pareils ».', id: 'Meminta Pixel « membuat semua tombol sama ».' },
        art: () => phoneScene(appHead + pill(8, 96, 68, 22, '#7C3AED', tx('Payer', 'Bayar')) + pill(8, 126, 68, 22, '#7C3AED', tx('Annuler', 'Batal')), 186, 170, { shake: true }) + bang(240, 60),
        what: { fr: 'Pixel choisit un style au hasard. « Annuler » ressemble maintenant à « Payer » : Lina annule son billet sans le vouloir.', id: 'Pixel memilih gaya secara acak. « Batal » kini mirip « Bayar »: Lina tak sengaja membatalkan tiketnya.' } },
      { good: true, label: { fr: 'Créer un seul composant Bouton, avec 3 variantes, que tous les agents réutilisent.', id: 'Membuat satu komponen Tombol dengan 3 varian, yang dipakai ulang oleh semua agen.' },
        art: () => phoneScene(appHead + pill(8, 96, 68, 22, '#7C3AED', tx('Payer', 'Bayar')) + pill(8, 126, 68, 22, '#fff', tx('Annuler', 'Batal'), '#C4B5FD', '#5B21B6'), 186, 140) + sparkles([[240, 50], [70, 150], [262, 120]]),
        what: { fr: 'Tous les agents utilisent le même bouton. Lina reconnaît « Payer » du premier coup et achète son billet en une seconde.', id: 'Semua agen memakai tombol yang sama. Lina langsung mengenali « Bayar » dan membeli tiket dalam sekejap.' } }
    ],
    why: { fr: 'Un composant réutilisable règle le problème à la source : les agents ne réinventent plus le bouton à chaque écran. Une simple consigne, elle, laisse l’agent deviner.', id: 'Komponen yang bisa dipakai ulang menyelesaikan masalah dari akarnya: agen tidak lagi menciptakan tombol baru di setiap layar. Sedangkan perintah biasa membuat agen menebak-nebak.' } },

  { time: '08:30', mood: 'tension', key: 'tokens', also: ['color', 'spec'], srcs: 'S08 · S15 · S27',
    title: { fr: 'L’alerte que personne ne voit', id: 'Peringatan yang tak terlihat' },
    panels: [
      { tags: ['ines'], art: () => office(`${uiRow(0, 70)}${uiRow(14, 50)}`, { time: '08:30' }) + person('ines', 60, 76, .95, { mood: 'worried', item: 'phone' }),
        who: 'Inès', say: { fr: 'Les voyageurs ne voient pas l’alerte de retard. Tu peux la rendre plus visible ?', id: 'Penumpang tidak melihat peringatan keterlambatan. Bisa dibuat lebih terlihat?' } },
      { tags: ['pixel'], art: () => office(`<g transform="scale(.66)">${alertBox('#3D7BFF', false, '', true).replace('T2 · Perrache', tx('9 écrans', '9 layar'))}</g>`, { time: '08:31' }) + bot(70, 96, 1.5, 'happy'),
        who: 'Pixel', say: { fr: 'Consigne reçue : « plus visible ». J’ai mis du bleu qui clignote sur les 9 écrans !', id: 'Perintah diterima: « lebih terlihat ». Aku pasang warna biru berkedip di 9 layar!' } },
      { tags: ['lina'], art: () => station(alertBox('#3D7BFF', false, '', true)) + person('lina', 50, 72, .95, { mood: 'think', arms: 'chin' }),
        cap: { fr: 'Station Perrache. Lina voit un bandeau bleu qui clignote, sans comprendre qu’il annonce un retard.', id: 'Halte Perrache. Lina melihat pita biru yang berkedip, tanpa paham bahwa itu pemberitahuan keterlambatan.' } }
    ],
    q: { fr: 'Quelle règle Harith donne-t-il aux agents ?', id: 'Aturan apa yang diberikan Harith kepada para agen?' },
    choices: [
      { label: { fr: '« Mets du rouge vif qui clignote partout. »', id: '« Pakai merah terang yang berkedip di mana-mana. »' },
        art: () => station(alertBox('#F43F5E', false, '', true)) + person('lina', 50, 72, .95, { mood: 'worried', arms: 'eyes' }) + bang(118, 70),
        what: { fr: 'Le clignotement agresse les yeux. Et un voyageur daltonien ne distingue pas ce rouge du reste de l’écran.', id: 'Kedipannya menyilaukan mata. Penumpang buta warna juga tidak bisa membedakan merah itu dari bagian layar lainnya.' } },
      { good: true, label: { fr: '« Utilise le token alert.critical, une icône et le mot Retard. »', id: '« Pakai token alert.critical, sebuah ikon, dan kata Terlambat. »' },
        art: () => station(alertBox('#B42318', true, tx('Retard 8 min', 'Terlambat 8 mnt'), false), { tram: true }) + person('lina', 50, 72, .95, { mood: 'happy', arms: 'point' }) + sparkles([[30, 60], [128, 40]]),
        what: { fr: 'Les 9 écrans affichent la même alerte, lisible même sans voir les couleurs. Lina change de ligne à temps.', id: 'Kesembilan layar menampilkan peringatan yang sama, tetap terbaca tanpa melihat warna. Lina sempat pindah jalur.' } },
      { label: { fr: '« Fais au mieux, tu sais ce qui marche. »', id: '« Atur saja, kamu tahu yang terbaik. »' },
        art: () => station(alertBox('#3D7BFF', false, '', true), { time: '08:52' }) + person('lina', 50, 72, .95, { mood: 'worried', item: 'phone' }) + ask(118, 70),
        what: { fr: 'Pixel garde son bleu clignotant. Lina attend 20 minutes un tram qui ne viendra pas.', id: 'Pixel tetap memakai biru berkedip. Lina menunggu 20 menit untuk trem yang tidak akan datang.' } }
    ],
    why: { fr: 'Une couleur seule ne suffit pas. Il faut un nom qui porte le sens (le token) et un indice qui ne dépend pas de la couleur (icône + mot). Une consigne vague laisse l’agent deviner.', id: 'Warna saja tidak cukup. Perlu nama yang membawa makna (token) dan petunjuk yang tidak bergantung pada warna (ikon + kata). Perintah yang kabur membuat agen menebak.' } },

  { time: '11:00', mood: 'calm', key: 'fitts', also: ['hick'], srcs: 'WCAG 2.2 · Fitts · Hick',
    title: { fr: 'Le bouton trop petit', id: 'Tombol yang terlalu kecil' },
    panels: [
      { tags: ['lina'], art: () => tramInside() + person('lina', 120, 70, 1, { mood: 'neutral', item: 'phone' }),
        cap: { fr: '11:00, tram T2. Lina veut changer d’itinéraire pendant que le tram roule.', id: '11:00, trem T2. Lina ingin mengganti rute saat trem sedang melaju.' } },
      { tags: ['lina'], art: () => phoneScene(appHead + `<rect x="58" y="140" width="14" height="9" rx="2" fill="#7C3AED"/><rect x="40" y="140" width="14" height="9" rx="2" fill="#C4B5FD"/>`, 183, 176, { shake: true, bg: '#D1FAE5' }),
        who: 'Lina', say: { fr: 'Ce bouton est minuscule, mon doigt tombe à côté !', id: 'Tombolnya kecil sekali, jariku meleset terus!' } },
      { tags: ['harith', 'ines'], art: () => office(`${uiRow(0, 80, '#F87171')}${uiRow(14, 80, '#F87171')}${uiRow(28, 60, '#F87171')}`, { time: '11:20' }) + person('harith', 40, 76, .95, { mood: 'worried', arms: 'chin' }) + person('ines', 110, 80, .9, { mood: 'neutral', item: 'tablet', flip: true }),
        who: 'Inès', say: { fr: '37 réclamations ce matin pour le même bouton.', id: 'Pagi ini ada 37 keluhan soal tombol yang sama.' } }
    ],
    q: { fr: 'Comment Harith corrige-t-il le bouton « Itinéraire » ?', id: 'Bagaimana Harith memperbaiki tombol « Rute »?' },
    choices: [
      { label: { fr: 'Garder la même taille, mais écrire le texte en gras.', id: 'Ukurannya tetap, tapi teksnya ditebalkan.' },
        art: () => phoneScene(appHead + `<rect x="58" y="140" width="14" height="9" rx="2" fill="#7C3AED"/><rect x="40" y="140" width="14" height="9" rx="2" fill="#F87171"/>`, 165, 176, { shake: true, bg: '#D1FAE5' }) + bang(240, 70),
        what: { fr: 'Le texte se lit mieux, mais la zone à toucher n’a pas grandi. Lina touche « Terminus » à côté et part dans la mauvaise direction.', id: 'Teksnya lebih jelas, tapi area sentuhnya tidak membesar. Lina menyentuh « Terminal » di sebelahnya dan berangkat ke arah yang salah.' } },
      { good: true, label: { fr: 'Agrandir la zone à toucher (au moins 44 px) et laisser de l’espace autour.', id: 'Memperbesar area sentuh (minimal 44 px) dan memberi ruang di sekelilingnya.' },
        art: () => phoneScene(appHead + pill(8, 120, 68, 30, '#7C3AED', tx('Itinéraire', 'Rute')), 186, 168, { bg: '#D1FAE5' }) + sparkles([[244, 60], [70, 150], [258, 140]]),
        what: { fr: 'Même avec les secousses du tram, Lina touche le bon bouton du premier coup.', id: 'Meski trem berguncang, Lina langsung menekan tombol yang benar.' } },
      { label: { fr: 'Ajouter 10 grands boutons pour couvrir tous les cas.', id: 'Menambahkan 10 tombol besar untuk semua kemungkinan.' },
        art: () => phoneScene(`<rect width="84" height="22" fill="#7C3AED"/>` + Array.from({ length: 10 }, (_, i) => `<rect x="${6 + (i % 2) * 38}" y="${28 + Math.floor(i / 2) * 27}" width="34" height="22" rx="6" fill="${['#7C3AED', '#A78BFA', '#C4B5FD'][i % 3]}"/>`).join(''), 160, 142, { bg: '#D1FAE5' }) + ask(240, 70),
        what: { fr: 'Trop de choix : Lina hésite, rate son arrêt et descend une station trop loin.', id: 'Terlalu banyak pilihan: Lina ragu, melewatkan haltenya, dan turun satu halte terlalu jauh.' } }
    ],
    why: { fr: 'Plus une cible est grande, plus on l’atteint vite et sans erreur (loi de Fitts). WCAG 2.2 exige au moins 24 × 24 px ; 44 px est plus sûr en mouvement. Et moins il y a de choix, plus on décide vite (loi de Hick).', id: 'Makin besar target, makin cepat dan tepat dijangkau (hukum Fitts). WCAG 2.2 mensyaratkan minimal 24 × 24 px; 44 px lebih aman saat bergerak. Makin sedikit pilihan, makin cepat orang memutuskan (hukum Hick).' } },

  { time: '14:00', mood: 'tension', key: 'basics', srcs: 'S21 · S27',
    title: { fr: 'La panne', id: 'Server mati' },
    panels: [
      { tags: ['pixel'], art: () => office(redScreen(), { time: '14:00', light: '#F3E8FF', alarm: true }) + bot(70, 100, 1.5, 'error'),
        cap: { fr: '14:00. Le service d’IA est en panne dans toute l’Europe.', id: '14:00. Layanan AI mati di seluruh Eropa.' } },
      { tags: ['pixel'], art: () => office(redScreen(false), { time: '14:02', light: '#F3E8FF', alarm: true }) + bot(70, 100, 1.5, 'error'),
        who: 'Pixel', say: { fr: 'Erreur 503. Je ne peux plus rien créer.', id: 'Error 503. Aku tidak bisa membuat apa pun.' } },
      { tags: ['ines', 'harith'], art: () => office(redScreen(false), { time: '14:05', light: '#F3E8FF', alarm: true }) + person('ines', 40, 76, .95, { mood: 'worried', arms: 'up' }) + person('harith', 112, 76, .95, { mood: 'think', arms: 'chin', flip: true }),
        who: 'Inès', say: { fr: 'Les nouveaux horaires doivent être en ligne à 17:00. On fait comment ?', id: 'Jadwal baru harus tayang jam 17:00. Bagaimana caranya?' } }
    ],
    q: { fr: 'Que fait Harith ?', id: 'Apa yang dilakukan Harith?' },
    choices: [
      { label: { fr: 'Attendre que le service revienne.', id: 'Menunggu sampai layanannya pulih.' },
        art: () => station(boardRows(true), { time: '17:15' }) + person('lina', 50, 72, .95, { mood: 'worried', item: 'phone' }) + bang(118, 70),
        what: { fr: 'Le service revient à 19:00. L’appli affiche encore les anciens horaires : des voyageurs attendent un tram supprimé.', id: 'Layanan baru pulih jam 19:00. Aplikasi masih menampilkan jadwal lama: penumpang menunggu trem yang sudah dibatalkan.' } },
      { good: true, label: { fr: 'Ouvrir le design system et terminer à la main avec les composants existants.', id: 'Membuka design system dan menyelesaikannya manual dengan komponen yang sudah ada.' },
        art: () => office(btnsClean(), { time: '16:50', light: '#F3E8FF' }) + person('harith', 70, 76, .95, { mood: 'happy', item: 'tablet' }) + bot(14, 120, 1.1, 'error') + sparkles([[150, 50], [160, 120]]),
        what: { fr: 'À 16:50, les nouveaux horaires sont en ligne. Les voyageurs voient les bons trams.', id: 'Jam 16:50 jadwal baru sudah tayang. Penumpang melihat trem yang benar.' } },
      { label: { fr: 'Copier les écrans d’une autre appli de transport.', id: 'Menyalin layar dari aplikasi transportasi lain.' },
        art: () => phoneScene(`<rect width="84" height="22" fill="#EA580C"/><text x="8" y="15" font-size="10" font-weight="700" fill="#fff" font-family="Sk Modernist, sans-serif">???</text>` + pill(8, 120, 68, 22, '#EA580C', tx('Payer', 'Bayar')), 186, 164) + ask(240, 70),
        what: { fr: 'Les écrans ne ressemblent plus à Ligne. Des voyageurs croient à une fausse appli et n’osent plus payer.', id: 'Layarnya tidak lagi mirip Ligne. Penumpang mengira itu aplikasi palsu dan tidak berani membayar.' } }
    ],
    why: { fr: 'Quand l’IA s’arrête, il reste vos composants, vos règles et votre capacité à juger une interface. Le design system sert de filet de sécurité.', id: 'Saat AI berhenti, yang tersisa adalah komponen, aturan, dan kemampuanmu menilai antarmuka. Design system menjadi jaring pengaman.' } },

  { time: '16:30', mood: 'think', key: 'dt', srcs: 'S22 · S23',
    title: { fr: 'Le prix des tokens', id: 'Harga token' },
    panels: [
      { tags: ['harith'], art: () => office(`<rect x="0" y="0" width="88" height="56" rx="4" fill="#fff"/><text x="10" y="36" font-size="22" font-weight="700" fill="#DC2626" font-family="Sk Modernist, sans-serif">+40 %</text>`, { time: '16:30' }) + person('harith', 70, 76, .95, { mood: 'surprised' }),
        cap: { fr: '16:30. Un e-mail tombe : le prix des tokens d’IA augmente de 40 % ce mois-ci.', id: '16:30. Email masuk: harga token AI naik 40% bulan ini.' } },
      { tags: ['pixel'], art: () => office(btns214(), { time: '16:32' }) + bot(70, 96, 1.5, 'happy'),
        who: 'Pixel', say: { fr: 'Je peux générer 50 versions de la page d’accueil. Coût : tout le budget du mois.', id: 'Aku bisa membuat 50 versi halaman beranda. Biayanya: seluruh anggaran bulan ini.' } },
      { tags: ['ines', 'harith'], art: () => office('', { time: '16:35' }) + person('ines', 40, 76, .95, { mood: 'think', arms: 'chin' }) + person('harith', 112, 76, .95, { mood: 'think', flip: true }),
        who: 'Inès', say: { fr: 'Et comment saura-t-on laquelle est la bonne ?', id: 'Lalu bagaimana kita tahu mana yang tepat?' } }
    ],
    q: { fr: 'Que décide Harith ?', id: 'Apa keputusan Harith?' },
    choices: [
      { label: { fr: 'Générer les 50 versions et garder la plus belle.', id: 'Membuat 50 versi lalu memilih yang paling bagus.' },
        art: () => office(`<rect x="0" y="0" width="88" height="56" rx="4" fill="#fff"/><rect x="8" y="22" width="72" height="10" rx="5" fill="none" stroke="#2A2536" stroke-width="2"/><text x="8" y="16" font-size="9" font-weight="700" fill="#DC2626" font-family="Sk Modernist, sans-serif">Budget 0 %</text>`, { time: '18:00' }) + person('ines', 60, 76, .95, { mood: 'worried', arms: 'up' }) + bang(140, 70),
        what: { fr: 'Le budget est vide. La plus belle version cache le bouton « Acheter un billet » : les ventes chutent.', id: 'Anggaran habis. Versi paling bagus itu justru menyembunyikan tombol « Beli tiket »: penjualan turun.' } },
      { good: true, label: { fr: 'Tester 2 versions avec 5 voyageurs, puis ne générer que ce qui fonctionne.', id: 'Menguji 2 versi dengan 5 penumpang, lalu hanya membuat yang terbukti berhasil.' },
        art: () => office(btnsClean(), { time: '17:30' }) + person('harith', 30, 76, .95, { mood: 'happy', item: 'tablet' }) + person('lina', 108, 78, .92, { mood: 'happy', item: 'phone', flip: true }) + sparkles([[160, 60], [96, 70]]),
        what: { fr: 'Lina et 4 autres voyageurs testent les maquettes. Le problème est repéré avant le lancement, pour une petite partie du budget.', id: 'Lina dan 4 penumpang lain mencoba rancangannya. Masalah ditemukan sebelum rilis, dengan sebagian kecil anggaran.' } },
      { label: { fr: 'Tout annuler pour économiser.', id: 'Membatalkan semuanya demi berhemat.' },
        art: () => station(`<rect x="0" y="0" width="130" height="60" fill="#fff" opacity=".9"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${4 + i * 25}" y="${6 + (i % 2) * 22}" width="20" height="14" fill="#9CA3AF"/>`).join('')}`) + person('lina', 50, 72, .95, { mood: 'worried', item: 'phone' }) + ask(118, 70),
        what: { fr: 'Rien ne change. L’ancienne page, difficile à utiliser, continue de décourager les voyageurs.', id: 'Tidak ada yang berubah. Halaman lama yang sulit dipakai terus membuat penumpang kesal.' } }
    ],
    why: { fr: 'Tester tôt avec quelques vraies personnes coûte peu et évite de payer pour des solutions inutiles. C’est le cœur du design thinking : comprendre, prototyper, tester, puis seulement produire.', id: 'Menguji lebih awal dengan beberapa orang nyata itu murah dan mencegah membayar solusi yang tidak berguna. Inilah inti design thinking: pahami, buat prototipe, uji, baru produksi.' } }
];

/* =====================================================================
   SON : musique adaptative, chaleureuse et curieuse (Web Audio, rien à télécharger)
   Bus séparés (musique / effets), réverbération à réponse impulsionnelle générée,
   couches qui montent ou descendent selon la situation, changement d'harmonie
   sur la mesure suivante, effets légèrement variés et musique qui s'efface sous les effets.
   ===================================================================== */
const Sound = (() => {
  let ctx = null, master, musicBus, duck, sfxBus, revIn, mRevIn, dlyIn, noise, airSrc = null;
  let on = true, timer = null, step = 0, nextT = 0, mood = null, P = null, pending = null, walk = 4, started = false;
  const LY = {};
  try { on = localStorage.getItem('rail-sound') !== 'off'; } catch (e) {}
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const BPM = 80, S16 = 60 / BPM / 4;

  /* Harmonie, gamme et dosage des couches pour chaque situation (même tempo partout : les couches restent alignées) */
  const MOODS = {
    calm:    { chords: [[62, 66, 69, 73, 76], [59, 62, 66, 69, 73], [55, 59, 62, 66, 69], [57, 61, 64, 69, 71]], roots: [38, 35, 43, 45],
               scale: [62, 64, 66, 69, 71, 74, 76, 78, 81], mix: { keys: .8, pad: .55, bell: .35, pluck: .3, perc: .25, air: .4 },
               keysAt: [0, 10], pluckAt: [0, 7, 10], shaker: 2, bellP: .22, cut: 1800 },
    think:   { chords: [[60, 64, 66, 71], [62, 64, 66, 69], [64, 67, 71, 74], [57, 60, 64, 67, 71]], roots: [36, 36, 40, 33],
               scale: [60, 62, 64, 66, 67, 71, 72, 74, 76, 78], mix: { keys: .35, pad: .7, bell: .75, pluck: 0, perc: .12, air: .5 },
               keysAt: [0], pluckAt: [], shaker: 4, bellP: .3, cut: 1400 },
    tension: { chords: [[57, 60, 64, 71], [53, 57, 60, 64, 71], [50, 53, 57, 60, 64], [52, 57, 59, 62]], roots: [33, 29, 38, 40],
               scale: [57, 60, 62, 64, 67, 69, 72, 74], mix: { keys: .3, pad: .45, bell: .2, pluck: .8, perc: .6, air: .3 },
               keysAt: [0, 12], pluckAt: [0, 2, 4, 6, 8, 10, 12, 14], shaker: 1, bellP: .1, cut: 900, kick: [0, 8], wood: [12] },
    win:     { chords: [[62, 66, 69, 73, 76], [55, 59, 62, 66, 69], [52, 55, 59, 62, 66], [57, 61, 64, 66, 71]], roots: [38, 43, 40, 45],
               scale: [62, 64, 66, 69, 71, 74, 76, 78, 81, 83], mix: { keys: .7, pad: .45, bell: .8, pluck: .5, perc: .55, air: .2 },
               keysAt: [0, 6, 10], pluckAt: [0, 6, 8, 14], shaker: 1, bellP: .42, cut: 2400, kick: [0, 8], wood: [4, 12] },
    oops:    { chords: [[59, 62, 66, 69, 73], [55, 59, 62, 66], [52, 55, 59, 62], [54, 59, 61, 64]], roots: [35, 43, 40, 42],
               scale: [59, 62, 64, 66, 69, 71, 74], mix: { keys: .55, pad: .6, bell: .3, pluck: 0, perc: 0, air: .5 },
               keysAt: [0], pluckAt: [], shaker: 0, bellP: .12, cut: 1100 },
    dusk:    { chords: [[55, 59, 62, 66, 69], [54, 57, 61, 64], [52, 55, 59, 62, 66], [57, 59, 64, 66, 69]], roots: [43, 42, 40, 45],
               scale: [55, 57, 59, 62, 64, 67, 69, 71, 74], mix: { keys: .8, pad: .7, bell: .3, pluck: .15, perc: .1, air: .5 },
               keysAt: [0, 10], pluckAt: [0, 8], shaker: 4, bellP: .16, cut: 1600 }
  };

  function impulse(sec, decay) {
    const n = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c); let lp = 0;
      for (let i = 0; i < n; i++) { const t = i / n, k = .25 + t * .7; lp = lp * k + (Math.random() * 2 - 1) * (1 - k); d[i] = lp * Math.pow(1 - t, decay) * 2.2; }
    }
    return b;
  }
  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ctx = new AC();
      const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -8; lim.ratio.value = 12; lim.attack.value = .003; lim.release.value = .25;
      master = ctx.createGain(); master.gain.value = 1.3; master.connect(lim); lim.connect(ctx.destination);
      duck = ctx.createGain(); duck.connect(master);
      musicBus = ctx.createGain(); musicBus.gain.value = 0; const mhp = ctx.createBiquadFilter(); mhp.type = 'highpass'; mhp.frequency.value = 60; musicBus.connect(mhp); mhp.connect(duck);
      sfxBus = ctx.createGain(); sfxBus.gain.value = .9; sfxBus.connect(master);
      const ir = impulse(3.2, 3);
      const rev = ctx.createConvolver(); rev.buffer = ir; revIn = ctx.createGain(); revIn.gain.value = .55; revIn.connect(rev); rev.connect(master); // réverbération des effets
      const mRev = ctx.createConvolver(); mRev.buffer = ir; mRevIn = ctx.createGain(); mRevIn.gain.value = .6; mRevIn.connect(mRev); mRev.connect(musicBus); // réverbération de la musique
      const dly = ctx.createDelay(1.5), fb = ctx.createGain(), dlp = ctx.createBiquadFilter(), dOut = ctx.createGain();
      dly.delayTime.value = S16 * 3; fb.gain.value = .33; dlp.type = 'lowpass'; dlp.frequency.value = 2400; dOut.gain.value = .4;
      dlyIn = ctx.createGain(); dlyIn.connect(dly); dly.connect(dlp); dlp.connect(fb); fb.connect(dly); dlp.connect(dOut); dOut.connect(musicBus); dOut.connect(mRevIn);
      const REV = { keys: .35, pad: .5, bell: .6, pluck: .08, perc: .1, air: 0 }, DLY = { bell: .35, keys: .08 };
      Object.keys(REV).forEach(k => { // chaque couche : son direct + départs réverbération et écho, tous coupés avec la couche
        LY[k] = ctx.createGain(); LY[k].gain.value = 0; LY[k].connect(musicBus);
        if (REV[k]) { const g = ctx.createGain(); g.gain.value = REV[k]; LY[k].connect(g); g.connect(mRevIn); }
        if (DLY[k]) { const g = ctx.createGain(); g.gain.value = DLY[k]; LY[k].connect(g); g.connect(dlyIn); }
      });
      const n = ctx.sampleRate * 2; noise = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = noise.getChannelData(0); let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; b0 = .99765 * b0 + w * .099; b1 = .963 * b1 + w * .2965; b2 = .57 * b2 + w * 1.0526; d[i] = (b0 + b1 + b2 + w * .1848) * .2; } // bruit rose
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }
  const pan = (node, p) => { if (!ctx.createStereoPanner) return node; const s = ctx.createStereoPanner(); s.pan.value = p; node.connect(s); return s; };
  function send(node, dest, rev = 0) { // la musique passe par les départs de sa couche ; les effets ont leur propre réverbération
    node.connect(dest);
    if (dest === sfxBus && rev) { const g = ctx.createGain(); g.gain.value = rev; node.connect(g); g.connect(revIn); }
  }

  /* ---------- Instruments ---------- */
  function epiano(m, t, vel, dest, len = 2.6) { // piano électrique (FM douce)
    const f = mtof(m), c = ctx.createOscillator(), md = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
    c.frequency.value = f; md.frequency.value = f; c.detune.value = rnd(-4, 4);
    mg.gain.setValueAtTime(f * 1.4 * vel, t); mg.gain.exponentialRampToValueAtTime(f * .12, t + .7);
    md.connect(mg); mg.connect(c.frequency);
    const tine = ctx.createOscillator(), tg = ctx.createGain(); tine.frequency.value = f * 4; tg.gain.setValueAtTime(.12 * vel, t); tg.gain.exponentialRampToValueAtTime(.0001, t + .25);
    tine.connect(tg); tg.connect(g);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.16 * vel, t + .006); g.gain.exponentialRampToValueAtTime(.06 * vel, t + .4); g.gain.exponentialRampToValueAtTime(.0001, t + len);
    c.connect(g); send(pan(g, rnd(-.25, .25)), dest, .35, .08);
    [c, md, tine].forEach(o => { o.start(t); o.stop(t + len + .1); });
  }
  function pad(m, t, dur, cut, dest) { // nappe : deux triangles désaccordés, filtre qui respire
    const g = ctx.createGain(), f = ctx.createBiquadFilter(), hp = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = .7; hp.type = 'highpass'; hp.frequency.value = 220;
    f.frequency.setValueAtTime(cut * .6, t); f.frequency.linearRampToValueAtTime(cut, t + dur * .5); f.frequency.linearRampToValueAtTime(cut * .7, t + dur);
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.028, t + 1.4); g.gain.setValueAtTime(.028, t + dur - .2); g.gain.linearRampToValueAtTime(.0001, t + dur + 1.8);
    [-7, 7].forEach(dt => { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = mtof(m); o.detune.value = dt; o.connect(f); o.start(t); o.stop(t + dur + 2); });
    f.connect(hp); hp.connect(g); send(g, dest, .5);
  }
  function bell(m, t, vel, dest) { // verre et marimba : la petite voix curieuse
    const f = mtof(m), c = ctx.createOscillator(), md = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
    c.frequency.value = f; md.frequency.value = f * 3.5;
    mg.gain.setValueAtTime(f * 2 * vel, t); mg.gain.exponentialRampToValueAtTime(f * .05, t + .35);
    md.connect(mg); mg.connect(c.frequency);
    const wood = ctx.createOscillator(), wg = ctx.createGain(); wood.frequency.value = f * 4.02; wg.gain.setValueAtTime(.05 * vel, t); wg.gain.exponentialRampToValueAtTime(.0001, t + .08);
    wood.connect(wg); wg.connect(g);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.09 * vel, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + 1.8);
    c.connect(g); send(pan(g, rnd(-.45, .45)), dest, .6, .35);
    [c, md, wood].forEach(o => { o.start(t); o.stop(t + 1.9); });
  }
  function pluck(m, t, vel, dest) { // basse pincée, feutrée
    const o = ctx.createOscillator(), s = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = mtof(m); s.frequency.value = mtof(m + 12); s.detune.value = rnd(-6, 6);
    f.type = 'lowpass'; f.Q.value = 3; f.frequency.setValueAtTime(1300 * vel, t); f.frequency.exponentialRampToValueAtTime(220, t + .22);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.2 * vel, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + .5);
    o.connect(f); s.connect(f); f.connect(g); send(g, dest, .08);
    [o, s].forEach(x => { x.start(t); x.stop(t + .55); });
  }
  function noiseHit(t, type, freq, q, dur, vol, dest, p = 0, rev = .15) {
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noise; src.playbackRate.value = rnd(.9, 1.1); f.type = type; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    src.connect(f); f.connect(g); send(pan(g, p), dest, rev);
    src.start(t, rnd(0, 1.5)); src.stop(t + dur + .05);
  }
  function kick(t, dest) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(55, t + .12);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.13, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + .3);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + .35);
  }
  function woodblock(t, dest) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = rnd(1650, 1850);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.05, t + .002); g.gain.exponentialRampToValueAtTime(.0001, t + .07);
    o.connect(g); send(pan(g, .3), dest, .25); o.start(t); o.stop(t + .1);
  }
  function startAir() { // souffle d'air : un lit de bruit rose filtré qui bouge lentement
    if (airSrc) return;
    airSrc = ctx.createBufferSource(); airSrc.buffer = noise; airSrc.loop = true;
    const bp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain(), g = ctx.createGain();
    bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = .5; lfo.frequency.value = .05; lg.gain.value = 900;
    lfo.connect(lg); lg.connect(bp.frequency); g.gain.value = .22;
    airSrc.connect(bp); bp.connect(g); g.connect(LY.air); airSrc.start(); lfo.start();
  }

  /* ---------- Séquenceur ---------- */
  function applyMix(p, sec = 1.2) {
    const t = ctx.currentTime;
    Object.keys(LY).forEach(k => { LY[k].gain.cancelScheduledValues(t); LY[k].gain.setTargetAtTime(p.mix[k] || 0, t, sec / 3); });
  }
  function schedule() {
    while (nextT < ctx.currentTime + .25) {
      const s = step % 16;
      if (s === 0 && pending) { P = pending; pending = null; } // l'harmonie change sur la mesure suivante
      const bar = Math.floor(step / 16) % 4, ch = P.chords[bar], root = P.roots[bar];
      const swing = s % 2 ? S16 * .14 : 0, t = nextT + swing;
      if (s === 0) { ch.forEach(n => pad(n, t, S16 * 16, P.cut * 1.6, LY.pad)); }
      if (P.keysAt.includes(s)) {
        const notes = s === 0 ? ch : ch.filter((_, i) => i % 2 === 1);
        notes.forEach((n, i) => epiano(n, t + i * rnd(.012, .03), s === 0 ? rnd(.75, .95) : rnd(.45, .6), LY.keys));
      }
      if (P.pluckAt.includes(s)) pluck(root + (s === 10 || s === 14 ? 7 : 0), t, s % 4 === 0 ? rnd(.85, 1) : rnd(.5, .7), LY.pluck);
      if (P.shaker && s % P.shaker === 0) noiseHit(t, 'bandpass', rnd(6500, 8500), 2, .05, s % 4 === 2 ? .05 : .025, LY.perc, rnd(-.3, .3), .05);
      if (P.kick && P.kick.includes(s)) kick(t, LY.perc);
      if (P.wood && P.wood.includes(s)) woodblock(t, LY.perc);
      if (s % 2 === 0 && Math.random() < P.bellP) { // marche aléatoire dans la gamme : une phrase qui cherche, puis remonte comme une question
        walk = Math.max(0, Math.min(P.scale.length - 1, walk + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)] + (bar % 2 && s >= 12 ? 1 : 0)));
        bell(P.scale[walk], t, rnd(.55, .9), LY.bell);
      }
      nextT += S16; step++;
    }
  }
  function setMood(m) {
    if (!on || !ensure() || m === mood) return;
    mood = m; const p = MOODS[m];
    if (!started) {
      started = true; P = p; step = 0; nextT = ctx.currentTime + .08; startAir(); applyMix(p, .1);
      musicBus.gain.cancelScheduledValues(ctx.currentTime); musicBus.gain.setValueAtTime(0, ctx.currentTime); musicBus.gain.linearRampToValueAtTime(.9, ctx.currentTime + 2.5);
      clearInterval(timer); timer = setInterval(schedule, 50);
    } else { pending = p; applyMix(p); }
  }
  function stop() {
    if (!ctx) return; mood = null; started = false; const t = ctx.currentTime;
    musicBus.gain.cancelScheduledValues(t); musicBus.gain.setValueAtTime(musicBus.gain.value, t); musicBus.gain.linearRampToValueAtTime(0, t + .5);
    setTimeout(() => { if (!started) { clearInterval(timer); if (airSrc) { airSrc.stop(); airSrc = null; } } }, 600);
  }
  function duckMusic() { // la musique s'efface un instant sous chaque effet
    const t = ctx.currentTime; duck.gain.cancelScheduledValues(t);
    duck.gain.setTargetAtTime(.55, t, .01); duck.gain.setTargetAtTime(1, t + .15, .15);
  }

  /* ---------- Effets (toujours légèrement différents) ---------- */
  const fx = {
    tap() { const t = ctx.currentTime; noiseHit(t, 'highpass', 3000, .7, .02, .05, sfxBus, 0, .05); const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = rnd(1250, 1450);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.09, t + .002); g.gain.exponentialRampToValueAtTime(.0001, t + .06); o.connect(g); send(g, sfxBus, .15); o.start(t); o.stop(t + .08); },
    page() { const t = ctx.currentTime, src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); src.buffer = noise;
      f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(700, t); f.frequency.exponentialRampToValueAtTime(rnd(2800, 3600), t + .2);
      g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.12, t + .06); g.gain.exponentialRampToValueAtTime(.0001, t + .26);
      src.connect(f); f.connect(g); send(g, sfxBus, .2); src.start(t, rnd(0, 1)); src.stop(t + .3); },
    right() { const t = ctx.currentTime, up = Math.random() < .5 ? 0 : 2; [74, 78, 81, 86].forEach((n, i) => bell(n + up, t + i * .075, .95 - i * .1, sfxBus)); epiano(62 + up, t, .7, sfxBus, 2); epiano(69 + up, t + .02, .6, sfxBus, 2); },
    wrong() { const t = ctx.currentTime; [[64, 0], [61, .16]].forEach(([n, d]) => { epiano(n, t + d, .7, sfxBus, 1.6); }); pluck(40, t + .16, .8, sfxBus); }
  };
  let wanted = null;
  return {
    get on() { return on; },
    mood(m) { wanted = m; setMood(m); },
    sfx(n) { if (on && ensure()) { duckMusic(); fx[n](); } },
    toggle() {
      on = !on; try { localStorage.setItem('rail-sound', on ? 'on' : 'off'); } catch (e) {}
      if (on && wanted) { mood = null; setMood(wanted); } else stop();
      return on;
    }
  };
})();

/* =====================================================================
   ÉTAT ET INTERFACE
   ===================================================================== */
const S = { res: {}, carnet: new Set(), lvl: 0 };
try { const saved = JSON.parse(localStorage.getItem('rail-v4') || 'null'); if (saved) { S.res = saved.res || {}; (saved.carnet || []).forEach(k => S.carnet.add(k)); } } catch (e) {}
const save = () => { try { localStorage.setItem('rail-v4', JSON.stringify({ res: S.res, carnet: [...S.carnet] })); } catch (e) {} };
const doneCount = () => Object.keys(S.res).length;
const isGood = i => S.res[i] !== undefined && !!LEVELS[i].choices[S.res[i]].good;
const bestIdx = lv => lv.choices.findIndex(c => c.good);
let current = () => screenTitle();

function renderSoundBtn() {
  const b = $('#soundBtn');
  b.setAttribute('aria-pressed', String(Sound.on));
  b.innerHTML = `${Sound.on ? I.note : I.mute}<span class="t">${tx('Musique', 'Musik')}</span>`;
  b.setAttribute('aria-label', Sound.on ? tx('Couper la musique et les sons', 'Matikan musik dan suara') : tx('Activer la musique et les sons', 'Nyalakan musik dan suara'));
}
function renderChrome() {
  document.documentElement.lang = LANG;
  document.title = tx('Rail · Le designer en 2030', 'Rail · Desainer di 2030');
  $('.brand-sub').textContent = tx('Le designer en 2030', 'Desainer di 2030');
  $('#budgetLabel').textContent = tx('Journée', 'Hari ini');
  $('#budgetBar').setAttribute('aria-label', tx('Progression de la journée', 'Kemajuan hari ini'));
  $('#carnetBtn .t').textContent = tx('Carnet', 'Catatan');
  $('#carnetTitle').textContent = tx('Carnet de principes', 'Catatan prinsip');
  $('#carnetClose').textContent = tx('Fermer', 'Tutup');
  $('.carnet-intro').textContent = tx('Chaque principe rencontré pendant la journée s’ajoute ici, avec sa source officielle.', 'Setiap prinsip yang muncul sepanjang hari masuk ke sini, lengkap dengan sumber resminya.');
  document.querySelectorAll('#langSwitch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
  $('#langSwitch').setAttribute('aria-label', tx('Langue', 'Bahasa'));
  $('#carnetCount').textContent = `(${S.carnet.size})`;
  renderSoundBtn();
}
function setHud(on, clock) {
  $('#hud').hidden = !on;
  if (!on) return;
  const n = doneCount();
  $('#clock').textContent = clock || '07:45';
  $('#budgetFill').style.width = (n / LEVELS.length * 100) + '%';
  $('#budgetText').textContent = `${n}/${LEVELS.length}`;
  $('#budgetBar').setAttribute('aria-valuenow', String(Math.round(n / LEVELS.length * 100)));
}
function toast(t) {
  document.querySelectorAll('.toast').forEach(x => x.remove());
  const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; d.setAttribute('role', 'status');
  document.body.appendChild(d); setTimeout(() => d.remove(), 2600);
}
function unlock(keys) {
  let added = 0;
  keys.forEach(k => { if (!S.carnet.has(k)) { S.carnet.add(k); added++; } });
  $('#carnetCount').textContent = `(${S.carnet.size})`;
  if (added) toast(tx(`${added} principe${added > 1 ? 's' : ''} ajouté${added > 1 ? 's' : ''} au carnet`, `${added} prinsip masuk ke catatan`));
  save();
}
const esc = s => String(s).replace(/"/g, '&quot;');
const svgPanel = (art, label) => `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">${art}</svg>`;
const goTop = () => { if (!REDUCED) window.scrollTo({ top: 0, behavior: 'smooth' }); else window.scrollTo(0, 0); };

/* ---------- Les personnages ---------- */
const portrait = who => who === 'pixel'
  ? `<svg viewBox="-2 -2 46 56" aria-hidden="true">${bot(1, 0, 1, 'happy')}</svg>`
  : `<svg viewBox="-4 -8 70 74" aria-hidden="true">${person(who, 0, 0, 1, { mood: 'happy' })}</svg>`;
const nameTag = who => `<span class="ntag n-${who}" title="${esc(L(ROLE[who]))}">${NAME[who]}</span>`;
function castCards(list, compact) {
  return `<ul class="cast ${compact ? 'compact' : ''}">${list.map(w => `<li class="castc n-${w}"><span class="pic">${portrait(w)}</span><span><b>${NAME[w]}</b><span>${L(ROLE[w])}</span></span></li>`).join('')}</ul>`;
}
const levelCast = lv => { const s = []; lv.panels.forEach(p => (p.tags || []).forEach(t => { if (!s.includes(t)) s.push(t); })); return s; };

function comicPanel(p, i, delay) {
  const text = p.say ? `<div class="say"><b>${p.who}</b>${L(p.say)}</div>` : `<div class="cap">${L(p.cap)}</div>`;
  const label = p.say ? `${p.who} : ${L(p.say)}` : L(p.cap);
  const tags = (p.tags || []).length ? `<span class="ptags">${p.tags.map(nameTag).join('')}</span>` : '';
  return `<figure class="panel" style="--d:${delay && !REDUCED ? i * 280 : 0}ms"><span class="pn">${i + 1}</span>${tags}${svgPanel(p.art(), label)}<figcaption>${text}</figcaption></figure>`;
}

/* ---------- Écran titre ---------- */
function heroScene() {
  return `<svg viewBox="0 0 560 400" role="img" aria-label="${tx('Harith, Inès, Lina et Pixel l’agent IA devant un tram de Lyon', 'Harith, Inès, Lina, dan Pixel si agen AI di depan trem Lyon')}">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9E1FF"/><stop offset="1" stop-color="#F7F5FD"/></linearGradient></defs>
    <rect width="560" height="400" fill="url(#sky)"/>
    <circle class="pulse" cx="470" cy="80" r="52" fill="#FDE68A" opacity=".35"/><circle cx="470" cy="80" r="40" fill="#FDE68A" stroke="#2A2536" stroke-width="3"/>
    <g class="drift"><ellipse cx="120" cy="60" rx="34" ry="11" fill="#fff"/><ellipse cx="330" cy="44" rx="26" ry="9" fill="#fff"/></g>
    <path d="M0 238 Q110 168 236 212 T560 196 V400 H0Z" fill="#DDD6FE"/>
    <g fill="#C4B5FD" stroke="#2A2536" stroke-width="2.5"><path d="M104 196 h64 v-26 l-32 -18 l-32 18z"/><rect x="108" y="140" width="10" height="34"/><rect x="154" y="140" width="10" height="34"/></g>
    <g stroke="#2A2536" stroke-width="2.5"><rect x="250" y="150" width="34" height="92" rx="6" fill="#A78BFA"/><path d="M300 242 V122 Q314 92 328 122 V242Z" fill="#8B5CF6"/><rect x="342" y="170" width="44" height="72" rx="6" fill="#A78BFA"/></g>
    <rect y="306" width="560" height="94" fill="#C7F0DD"/><path d="M0 330 H560 M0 342 H560" stroke="#2A2536" stroke-width="3"/>
    <g class="tram"><path d="M110 210 L130 188 L158 210" fill="none" stroke="#2A2536" stroke-width="3" stroke-linejoin="round"/>
      <rect x="20" y="210" width="300" height="110" rx="34" fill="#10B981" stroke="#2A2536" stroke-width="3"/><rect x="20" y="290" width="300" height="12" fill="#047857"/>
      ${[50, 102, 154, 206].map(x => `<rect x="${x}" y="232" width="40" height="34" rx="8" fill="#E0F2FE" stroke="#2A2536" stroke-width="2.5"/>`).join('')}
      <rect x="264" y="226" width="40" height="50" rx="12" fill="#E0F2FE" stroke="#2A2536" stroke-width="2.5"/>
      <text x="62" y="284" font-size="18" font-weight="700" fill="#fff" font-family="Sk Modernist, sans-serif">T2</text>
      <circle cx="80" cy="324" r="13" fill="#2A2536"/><circle cx="270" cy="324" r="13" fill="#2A2536"/></g>
    ${person('ines', 330, 178, .95, { mood: 'happy', item: 'tablet' })}
    ${person('harith', 400, 172, 1.02, { mood: 'happy', arms: 'up' })}
    ${person('lina', 470, 180, .92, { mood: 'happy', item: 'phone', flip: true })}
    ${bot(190, 60, 1.4, 'happy', '#A7F3D0', 'bob')}${bot(100, 90, .9, 'ok', '#FDE68A', 'bob b2')}${bot(280, 74, 1, 'ok', '#FBCFE8', 'bob b3')}
    ${sparkles([[236, 50], [150, 120], [520, 150]])}
  </svg>`;
}
function screenTitle() {
  current = screenTitle; setHud(false); Sound.mood('calm');
  const started = doneCount() > 0;
  app.innerHTML = `<section class="screen hero">
    <div>
      <div class="kicker">ICX3 · Designing for the Internet of Agents</div>
      <h1 class="title">Rail <span>2030</span></h1>
      <p class="lead">${tx('Lyon, 2030. Chez Ligne, l’appli des transports, des agents IA fabriquent les écrans jour et nuit. Harith, designer, est là pour les décisions qu’ils ne savent pas prendre.', 'Lyon, 2030. Di Ligne, aplikasi transportasi kota ini, agen AI membuat layar siang dan malam. Harith, sang desainer, hadir untuk keputusan yang tidak bisa mereka ambil.')}</p>
      <p class="sub">${tx('Mardi 14 mai. Cinq décisions, et des milliers de voyageurs au bout de chacune.', 'Selasa, 14 Mei. Lima keputusan, dan ribuan penumpang merasakan akibat masing-masing.')}</p>
      <button class="btn" id="go">${I.play}${started ? tx('Reprendre la journée', 'Lanjutkan hari ini') : tx('Commencer la journée', 'Mulai hari ini')}</button>
    </div>
    <div class="illus">${heroScene()}</div>
  </section>
  <section class="screen cast-wrap">
    <h2 class="h small">${tx('Les personnages', 'Para tokoh')}</h2>
    ${castCards(['harith', 'ines', 'lina', 'pixel'])}
  </section>`;
  $('#go').onclick = () => { Sound.sfx('tap'); screenMap(); };
}

/* ---------- Carte de la journée ---------- */
function screenMap() {
  current = screenMap;
  const next = LEVELS.findIndex((_, i) => S.res[i] === undefined);
  setHud(true, LEVELS[next === -1 ? LEVELS.length - 1 : next].time); Sound.mood('calm');
  const cards = LEVELS.map((lv, i) => {
    const done = S.res[i] !== undefined, good = isGood(i), open = done || i === next;
    const state = done ? `<span class="out ${good ? 'good' : 'bad'}">${good ? I.check + tx('Bonne décision', 'Keputusan tepat') : I.x + tx('Décision risquée', 'Keputusan berisiko')}</span>`
      : i === next ? tx('À jouer', 'Mainkan') : I.lock + tx('Plus tard', 'Nanti');
    return `<li><button class="stop ${done ? (good ? 'done' : 'done bad') : ''} ${i === next ? 'now' : ''}" data-l="${i}" ${open ? '' : 'disabled'}>
      <span class="time">${lv.time}</span>
      <span class="thumb">${svgPanel(lv.panels[0].art(), '')}</span>
      <span class="st">${L(lv.title)}</span>
      <span class="state">${state}</span>
    </button></li>`;
  }).join('');
  const all = next === -1;
  app.innerHTML = `<section class="screen">
    <div class="kicker">${tx('Mardi 14 mai 2030', 'Selasa, 14 Mei 2030')}</div>
    <h2 class="h">${tx('La journée de Harith', 'Hari Harith')}</h2>
    <p class="lead">${all ? tx('La journée est finie. Voyons ce que vos décisions ont changé pour les voyageurs.', 'Hari sudah selesai. Mari lihat apa yang diubah keputusanmu bagi para penumpang.') : tx('Du matin au soir, chaque décision de Harith finit sur le téléphone de Lina et des autres voyageurs.', 'Dari pagi sampai sore, setiap keputusan Harith berakhir di ponsel Lina dan penumpang lainnya.')}</p>
    <ol class="day">${cards}</ol>
    <div class="row-btns">
      ${all ? `<button class="btn" id="end">${I.star}${tx('Voir le bilan de la journée', 'Lihat rangkuman hari ini')}</button>` : `<button class="btn" id="play">${I.play}${next === 0 ? tx('Commencer', 'Mulai') : tx('Continuer', 'Lanjut')} · ${LEVELS[next].time}</button>`}
      ${doneCount() ? `<button class="btn ghost" id="reset">${I.redo}${tx('Recommencer la journée', 'Ulangi dari awal')}</button>` : ''}
    </div>
  </section>`;
  app.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { Sound.sfx('tap'); startLevel(+b.dataset.l); });
  if ($('#play')) $('#play').onclick = () => { Sound.sfx('tap'); startLevel(next); };
  if ($('#end')) $('#end').onclick = () => { Sound.sfx('tap'); screenEnd(); };
  if ($('#reset')) $('#reset').onclick = resetDay;
}
function resetDay() { S.res = {}; save(); Sound.sfx('tap'); screenMap(); }

/* ---------- Un moment : BD + décision + conséquence ---------- */
let animateComic = true;
function startLevel(i) { S.lvl = i; animateComic = true; goTop(); screenLevel(); }
function levelHead(lv, i) {
  return `<div class="level-head"><div><div class="kicker">${lv.time} · ${tx('Moment', 'Momen')} ${i + 1}/${LEVELS.length}</div><h2 class="h" style="margin:0">${L(lv.title)}</h2></div>
    <button class="btn ghost small" id="toMap">${I.map}${tx('Journée', 'Hari ini')}</button></div>`;
}
function conseqFig(c, cls) {
  return `<figure class="conseq ${cls}">${svgPanel(c.art(), L(c.what))}<figcaption>${L(c.what)}</figcaption></figure>`;
}
function screenLevel() {
  current = screenLevel;
  const i = S.lvl, lv = LEVELS[i], picked = S.res[i], answered = picked !== undefined, b = bestIdx(lv);
  setHud(true, lv.time);
  const comic = `<div class="comic">${lv.panels.map((p, k) => comicPanel(p, k, animateComic)).join('')}</div>`;
  animateComic = false;
  const choices = `<h3 class="q" id="q">${L(lv.q)}</h3>
    <div class="choices ${answered ? 'answered' : ''}">${lv.choices.map((c, k) => {
      const cls = answered ? (k === picked ? (c.good ? 'picked good' : 'picked bad') : (k === b ? 'best' : 'muted')) : '';
      const badge = answered && k === picked ? `<span class="cbadge">${tx('Votre choix', 'Pilihanmu')}</span>` : answered && k === b ? `<span class="cbadge g">${tx('Meilleur choix', 'Pilihan terbaik')}</span>` : '';
      return `<button class="choice ${cls}" data-c="${k}" ${answered ? 'disabled aria-disabled="true"' : ''}><span class="letter">${'ABC'[k]}</span><span>${L(c.label)}${badge}</span></button>`;
    }).join('')}</div>`;
  let result = '';
  if (answered) {
    const c = lv.choices[picked], good = !!c.good, best = lv.choices[b], p = PR[lv.key];
    result = `<div class="outcome ${good ? 'single' : ''}" id="outcome" role="status">
      <div class="out-col">
        <div class="tag ${good ? 'ok' : 'ko'}">${good ? I.check + tx('Bonne décision', 'Keputusan tepat') : I.x + tx('Décision risquée', 'Keputusan berisiko')}</div>
        <div class="label sm">${tx('Ce qui arrive aux voyageurs', 'Yang dialami penumpang')}</div>
        ${conseqFig(c, good ? 'ok' : 'ko')}
      </div>
      ${good ? '' : `<div class="out-col">
        <div class="tag ok">${I.check}${tx('Ce qu’il aurait fallu faire', 'Yang seharusnya dilakukan')}</div>
        <div class="label sm">${L(best.label)}</div>
        ${conseqFig(best, 'ok')}
      </div>`}
      <div class="why ${good ? 'wide' : ''}"><div class="label sm">${tx('Pourquoi', 'Mengapa')}</div><p>${L(lv.why)}</p></div>
    </div>
    <div class="principle"><div class="label">${tx('Le principe à retenir', 'Prinsip yang perlu diingat')}</div><h4>${L(p.title)}</h4><p>${L(p.text)}</p>
      <p class="ref">${L(p.ref)} · <a href="${p.url}" target="_blank" rel="noopener">${tx('Source', 'Sumber')}</a> · Board ${lv.srcs}</p></div>
    <div class="row-btns">${i < LEVELS.length - 1 ? `<button class="btn" id="nextL">${tx('Moment suivant', 'Momen berikutnya')} · ${LEVELS[i + 1].time}${I.next}</button>` : `<button class="btn" id="endB">${I.star}${tx('Fin de journée', 'Akhir hari')}</button>`}
      <button class="btn ghost" id="toMap2">${I.map}${tx('Voir la journée', 'Lihat hari ini')}</button></div>`;
  }
  app.innerHTML = `<section class="screen">${levelHead(lv, i)}
    <div class="in-scene"><span class="label sm">${tx('Dans ce moment', 'Di momen ini')}</span>${castCards(levelCast(lv), true)}</div>
    ${comic}${choices}${result}</section>`;
  Sound.mood(answered ? (isGood(i) ? 'win' : 'oops') : lv.mood);
  $('#toMap').onclick = () => { Sound.sfx('tap'); screenMap(); };
  if (!answered) app.querySelectorAll('[data-c]').forEach(btn => btn.onclick = () => pick(+btn.dataset.c));
  if ($('#nextL')) $('#nextL').onclick = () => { Sound.sfx('tap'); startLevel(i + 1); };
  if ($('#endB')) $('#endB').onclick = () => { Sound.sfx('tap'); screenEnd(); };
  if ($('#toMap2')) $('#toMap2').onclick = () => { Sound.sfx('tap'); screenMap(); };
}
function pick(k) {
  const lv = LEVELS[S.lvl];
  if (S.res[S.lvl] !== undefined) return;
  S.res[S.lvl] = k; save();
  Sound.sfx(lv.choices[k].good ? 'right' : 'wrong');
  screenLevel(); unlock([lv.key, ...(lv.also || [])]);
  const o = $('#outcome'); if (o) o.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
}

/* ---------- Épilogue ---------- */
function screenEnd() {
  current = screenEnd; goTop(); setHud(true, '18:30'); Sound.mood('dusk');
  const n = LEVELS.filter((_, i) => isGood(i)).length;
  const prof = n === 5 ? { t: { fr: 'Architecte du jugement', id: 'Arsitek penilaian' }, d: { fr: 'Les cinq décisions ont protégé les voyageurs. Vous donnez aux agents des règles claires et vous gardez la main sur l’essentiel.', id: 'Kelima keputusan melindungi penumpang. Kamu memberi agen aturan yang jelas dan tetap memegang hal terpenting.' } }
    : n >= 3 ? { t: { fr: 'Designer augmenté', id: 'Desainer yang diperkuat AI' }, d: { fr: 'La plupart de vos décisions ont aidé les voyageurs. Les principes du carnet couvrent celles qui ont dérapé.', id: 'Sebagian besar keputusanmu membantu penumpang. Prinsip di catatan menjelaskan keputusan yang meleset.' } }
    : { t: { fr: 'Apprenti en route', id: 'Pembelajar yang sedang berproses' }, d: { fr: 'Les voyageurs ont eu une journée difficile, mais chaque erreur est expliquée dans le carnet. Rejouez avec ces principes en tête.', id: 'Penumpang mengalami hari yang sulit, tapi setiap kesalahan dijelaskan di catatan. Mainkan lagi dengan prinsip-prinsip itu.' } };
  const art = `<svg viewBox="0 0 560 300" role="img" aria-label="${tx('Harith rentre en tram au coucher du soleil', 'Harith pulang naik trem saat matahari terbenam')}">
    <defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C4B5FD"/><stop offset="1" stop-color="#FBCFE8"/></linearGradient></defs>
    <rect width="560" height="300" fill="url(#dusk)"/><circle class="pulse" cx="420" cy="170" r="70" fill="#FDE68A" opacity=".35"/><circle cx="420" cy="170" r="54" fill="#FDE68A" stroke="#2A2536" stroke-width="3"/>
    <path d="M0 200 Q140 150 280 190 T560 180 V300 H0Z" fill="#A78BFA"/>
    <g class="tram"><rect x="40" y="120" width="420" height="140" rx="40" fill="#10B981" stroke="#2A2536" stroke-width="3"/>
    ${[70, 170, 270].map(x => `<rect x="${x}" y="140" width="80" height="64" rx="12" fill="#E0F2FE" stroke="#2A2536" stroke-width="3"/>`).join('')}
    <clipPath id="win2"><rect x="170" y="140" width="80" height="64" rx="12"/></clipPath><g clip-path="url(#win2)">${person('harith', 178, 146, .82, { mood: 'happy', item: 'phone' })}</g>
    <clipPath id="win3"><rect x="70" y="140" width="80" height="64" rx="12"/></clipPath><g clip-path="url(#win3)">${person('lina', 82, 150, .78, { mood: 'happy' })}</g>
    ${bot(300, 154, .9, 'happy')}</g>
    ${sparkles([[120, 60], [330, 90], [500, 60]])}
    <rect y="262" width="560" height="38" fill="#7C3AED"/></svg>`;
  const rows = LEVELS.map((lv, i) => {
    const g = isGood(i), best = lv.choices[bestIdx(lv)];
    return `<li class="${g ? 'good' : 'bad'}"><span class="ico">${g ? I.check : I.x}</span><span><b>${lv.time} · ${L(lv.title)}</b><span>${g ? L(best.what) : tx('À retenir : ', 'Ingat: ') + L(best.label)}</span></span></li>`;
  }).join('');
  app.innerHTML = `<section class="screen">
    <div class="kicker">18:30 · ${tx('Épilogue', 'Epilog')}</div>
    <h2 class="h">${tx('Les agents ont produit. Harith a décidé.', 'Para agen yang membuat. Harith yang memutuskan.')}</h2>
    <div class="debrief">
      <div class="card"><div class="illus" style="box-shadow:none;margin-bottom:1rem">${art}</div>
        <div class="label">${tx('Votre profil', 'Profilmu')}</div><div class="score-big">${L(prof.t)}</div>
        <p>${L(prof.d)}</p><p class="tally"><b>${n} / ${LEVELS.length}</b> ${tx('bonnes décisions', 'keputusan tepat')}</p></div>
      <div class="card tint">
        <div class="label" style="margin-bottom:.6rem">${tx('Vos cinq décisions', 'Lima keputusanmu')}</div>
        <ul class="recap-list">${rows}</ul>
        <div class="label" style="margin:1rem 0 .6rem">${tx('Qui fait quoi en 2030', 'Siapa mengerjakan apa di 2030')}</div>
        <div class="split">
          <div class="row"><span class="badge" style="background:var(--role-auto)">${tx('Automatisé', 'Otomatis')}</span><div>${tx('Produire des variantes, appliquer une règle à 9 écrans.', 'Membuat varian, menerapkan aturan ke 9 layar.')}</div></div>
          <div class="row"><span class="badge" style="background:var(--role-aug)">${tx('Augmenté', 'Diperkuat AI')}</span><div>${tx('Mesurer, repérer les écarts, proposer des options.', 'Mengukur, menemukan penyimpangan, mengusulkan pilihan.')}</div></div>
          <div class="row"><span class="badge" style="background:var(--role-human)">${tx('Jugement humain', 'Penilaian manusia')}</span><div>${tx('Écrire des règles claires, protéger les voyageurs, décider quand l’IA s’arrête ou coûte trop cher.', 'Menulis aturan yang jelas, melindungi penumpang, memutuskan saat AI mati atau terlalu mahal.')}</div></div>
        </div>
        <p class="hint">${tx('Les codes S## renvoient aux sources du board FigJam.', 'Kode S## merujuk ke sumber di board FigJam.')}</p>
        <div class="row-btns"><button class="btn" id="carnet2">${I.book}${tx('Ouvrir le carnet', 'Buka catatan')} (${S.carnet.size})</button><button class="btn ghost" id="again">${I.redo}${tx('Rejouer la journée', 'Main lagi')}</button></div>
      </div>
    </div>
  </section>`;
  $('#carnet2').onclick = openCarnet;
  $('#again').onclick = resetDay;
}

/* ---------- Carnet ---------- */
function openCarnet() {
  Sound.sfx('tap');
  const list = Object.keys(PR).filter(k => S.carnet.has(k)).map(k => {
    const p = PR[k];
    return `<div class="entry"><div class="ref">${L(p.ref)}</div><h4>${L(p.title)}</h4><div>${L(p.text)}</div><div style="margin-top:.4rem"><a href="${p.url}" target="_blank" rel="noopener">${tx('Source officielle', 'Sumber resmi')}</a></div></div>`;
  }).join('');
  $('#carnetList').innerHTML = list || `<p class="empty">${tx('Le carnet est encore vide. Il se remplit à chaque décision de la journée.', 'Catatan masih kosong. Isinya bertambah di setiap keputusan sepanjang hari.')}</p>`;
  if (!$('#carnet').open) $('#carnet').showModal();
}

/* ---------- Branchements ---------- */
$('#soundBtn').onclick = () => { Sound.toggle(); renderSoundBtn(); };
$('#carnetBtn').onclick = openCarnet;
$('#carnetClose').onclick = () => $('#carnet').close();
document.querySelectorAll('#langSwitch button').forEach(b => b.onclick = () => {
  if (b.dataset.lang === LANG) return;
  LANG = b.dataset.lang; try { localStorage.setItem('rail-lang', LANG); } catch (e) {}
  Sound.sfx('tap'); renderChrome(); current();
  if ($('#carnet').open) openCarnet();
});
renderChrome();
screenTitle();
