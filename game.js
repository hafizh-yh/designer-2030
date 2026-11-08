/* Rail · Le designer en 2030
   Une journée de Harith, designer de design system, en 5 moments (07:45 → 16:30) + épilogue.
   Chaque moment : une BD de 3 cases, une décision à 3 choix, une réaction et un principe.
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
   PERSONNAGES (même construction dans toutes les cases)
   ===================================================================== */
const INK = '#2A2536';
const CAST = {
  harith: { skin: '#B8794E', hair: '#2A2536', top: '#7C3AED', glasses: true, phones: true },
  ines:   { skin: '#F1C7A3', hair: '#B45309', top: '#10B981', bun: true },
  lina:   { skin: '#8D5A3B', hair: '#3B2A20', top: '#FBBF24', scarf: true }
};
function face(m, glasses) {
  const eyes = m === 'happy' ? '<path d="M21 31 q3 -3 6 0 M35 31 q3 -3 6 0" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    : m === 'surprised' ? '<circle cx="24" cy="31" r="3" fill="#2A2536"/><circle cx="38" cy="31" r="3" fill="#2A2536"/>'
    : '<circle cx="24" cy="31" r="2.4" fill="#2A2536"/><circle cx="38" cy="31" r="2.4" fill="#2A2536"/>';
  const brows = m === 'worried' ? '<path d="M19 24 l8 2 M43 24 l-8 2" stroke="#2A2536" stroke-width="2.5" stroke-linecap="round"/>'
    : m === 'surprised' ? '<path d="M19 22 q5 -3 9 0 M34 22 q5 -3 9 0" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    : m === 'think' ? '<path d="M19 25 h8 M35 23 l8 1" stroke="#2A2536" stroke-width="2.5" stroke-linecap="round"/>' : '';
  const mouth = m === 'happy' ? '<path d="M24 39 Q31 47 38 39 Z" fill="#2A2536"/>'
    : m === 'worried' ? '<path d="M25 44 Q31 39 37 44" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    : m === 'surprised' ? '<ellipse cx="31" cy="43" rx="3.2" ry="4" fill="#2A2536"/>'
    : m === 'think' ? '<path d="M27 42 h8" stroke="#2A2536" stroke-width="2.5" stroke-linecap="round"/>'
    : '<path d="M25 40 Q31 44 37 40" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  const g = glasses ? '<circle cx="24" cy="31" r="6" fill="none" stroke="#2A2536" stroke-width="2.4"/><circle cx="38" cy="31" r="6" fill="none" stroke="#2A2536" stroke-width="2.4"/><path d="M30 31h2" stroke="#2A2536" stroke-width="2.4"/>' : '';
  const sweat = m === 'worried' ? '<path d="M50 18 q3 5 0 7 q-3 -2 0 -7z" fill="#7DD3FC" stroke="#2A2536" stroke-width="1.5"/>' : '';
  return brows + eyes + g + mouth + sweat;
}
/* who : 'harith' | 'ines' | 'lina' ; o : { mood, arms: 'down'|'up'|'point'|'hold', item: 'coffee'|'phone'|'tablet', flip } */
function person(who, x, y, s, o = {}) {
  const c = CAST[who], m = o.mood || 'neutral';
  const arm = (d) => `<path d="${d}" stroke="${INK}" stroke-width="13" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${c.top}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
  const hand = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="5" fill="${c.skin}" stroke="${INK}" stroke-width="2"/>`;
  let arms = '';
  if (o.arms === 'up') arms = arm('M12 66 L2 42') + arm('M50 66 L60 42') + hand(2, 40) + hand(60, 40);
  else if (o.arms === 'point') arms = arm('M12 68 L8 92') + arm('M50 66 L72 60') + hand(8, 94) + hand(75, 59);
  else if (o.arms === 'hold') arms = arm('M12 68 L24 84') + arm('M50 68 L40 84') + hand(26, 86) + hand(38, 86);
  else if (o.arms === 'chin') arms = arm('M12 68 L8 94') + arm('M50 66 L40 50') + hand(8, 96) + hand(38, 49);
  else arms = arm('M12 68 L6 94') + arm('M50 68 L56 94') + hand(6, 96) + hand(56, 96);
  let item = '';
  if (o.item === 'coffee') item = '<rect x="30" y="78" width="14" height="16" rx="3" fill="#fff" stroke="#2A2536" stroke-width="2.5"/><path d="M44 82 q6 0 6 5 q0 5 -6 5" fill="none" stroke="#2A2536" stroke-width="2.5"/><path d="M34 72 q2 -4 0 -7 M40 72 q2 -4 0 -7" stroke="#C4B5FD" stroke-width="2" fill="none" stroke-linecap="round"/>';
  if (o.item === 'phone') item = '<rect x="24" y="74" width="16" height="24" rx="3" fill="#2E1065" stroke="#2A2536" stroke-width="2.5"/><rect x="27" y="78" width="10" height="14" rx="1" fill="#E0F2FE"/>';
  if (o.item === 'tablet') item = '<rect x="18" y="76" width="30" height="22" rx="4" fill="#fff" stroke="#2A2536" stroke-width="2.5"/><path d="M23 83h18M23 89h12" stroke="#7C3AED" stroke-width="2.4" stroke-linecap="round"/>';
  const hair = c.bun ? '<circle cx="31" cy="7" r="8" fill="' + c.hair + '" stroke="#2A2536" stroke-width="2.5"/><path d="M12 30 Q11 9 31 9 Q51 9 50 30 Q44 17 31 17 Q19 17 12 30Z" fill="' + c.hair + '"/>'
    : '<path d="M12 28 Q12 8 31 8 Q50 8 50 26 Q42 16 28 18 Q18 19 12 28Z" fill="' + c.hair + '"/>';
  const scarf = c.scarf ? '<path d="M17 56 Q31 66 45 56 L45 62 Q31 72 17 62Z" fill="#DB2777" stroke="#2A2536" stroke-width="2"/>' : '';
  const phones = c.phones ? '<path d="M11 32 Q11 5 31 5 Q51 5 51 32" fill="none" stroke="#10B981" stroke-width="4"/><rect x="6" y="27" width="9" height="13" rx="4" fill="#10B981" stroke="#2A2536" stroke-width="2"/><rect x="47" y="27" width="9" height="13" rx="4" fill="#10B981" stroke="#2A2536" stroke-width="2"/>' : '';
  const flip = o.flip ? ` translate(62 0) scale(-1 1)` : '';
  return `<g transform="translate(${x} ${y}) scale(${s})${flip}">
    <rect x="18" y="98" width="11" height="40" rx="5" fill="#2E1065"/><rect x="33" y="98" width="11" height="40" rx="5" fill="#2E1065"/>
    <ellipse cx="23" cy="139" rx="9" ry="5" fill="#2A2536"/><ellipse cx="39" cy="139" rx="9" ry="5" fill="#2A2536"/>
    <path d="M8 106 Q6 62 31 56 Q56 62 54 106 Z" fill="${c.top}" stroke="#2A2536" stroke-width="3"/>
    ${scarf}${arms}${item}
    <rect x="27" y="44" width="9" height="14" fill="${c.skin}"/>
    <circle cx="31" cy="30" r="19" fill="${c.skin}" stroke="#2A2536" stroke-width="3"/>
    ${hair}${face(m, c.glasses)}${phones}
  </g>`;
}
/* Pixel, l'agent IA : 'ok' | 'happy' | 'error' */
function bot(x, y, s, mood = 'ok', body = '#A7F3D0', cls = '') {
  const eyes = mood === 'error' ? '<path d="M12 19 l6 6 M18 19 l-6 6 M22 19 l6 6 M28 19 l-6 6" stroke="#F87171" stroke-width="2.4" stroke-linecap="round"/>'
    : mood === 'happy' ? '<path d="M12 24 q3 -4 6 0 M22 24 q3 -4 6 0" stroke="#A7F3D0" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    : '<circle cx="15" cy="22" r="2.6" fill="#A7F3D0"/><circle cx="25" cy="22" r="2.6" fill="#A7F3D0"/>';
  const mouth = mood === 'error' ? '<path d="M14 33 q6 -4 12 0" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>' : '<path d="M14 32 q6 4 12 0" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  return `<g class="${cls}" style="transform-box:fill-box;transform-origin:center"><g transform="translate(${x} ${y}) scale(${s})">
    <line x1="20" y1="2" x2="20" y2="10" stroke="#2A2536" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="3" r="3.5" fill="${mood === 'error' ? '#F87171' : '#DB2777'}" stroke="#2A2536" stroke-width="2"/>
    <rect x="3" y="10" width="34" height="28" rx="11" fill="${mood === 'error' ? '#E5E7EB' : body}" stroke="#2A2536" stroke-width="3"/>
    <rect x="8" y="15" width="24" height="13" rx="6" fill="#2E1065"/>${eyes}${mouth}</g></g>`;
}
/* Bulle de pensée/parole dessinée (sans texte : le texte est sous la case) */
const spark = (x, y) => `<g transform="translate(${x} ${y})" stroke="#2A2536" stroke-width="2.5" stroke-linecap="round"><path d="M0 -10 v-6 M8 -6 l4 -4 M-8 -6 l-4 -4"/></g>`;

/* ---------- Décors ---------- */
const W = 320, H = 220;
function office(screen = '', light = '#E9E1FF') {
  return `<rect width="${W}" height="${H}" fill="${light}"/>
    <rect x="18" y="16" width="120" height="78" rx="10" fill="#E0F2FE" stroke="#2A2536" stroke-width="3"/>
    <g fill="#C4B5FD" stroke="#2A2536" stroke-width="2"><rect x="30" y="54" width="18" height="40"/><path d="M58 94 V40 Q65 28 72 40 V94Z" fill="#A78BFA"/><rect x="82" y="62" width="22" height="32"/><rect x="110" y="70" width="16" height="24"/></g>
    <path d="M78 16 V94 M18 55 H138" stroke="#2A2536" stroke-width="2.5"/>
    <rect y="168" width="${W}" height="52" fill="#DDD6FE"/>
    <rect x="150" y="150" width="160" height="12" rx="4" fill="#C4B5FD" stroke="#2A2536" stroke-width="3"/>
    <rect x="182" y="72" width="104" height="72" rx="10" fill="#2E1065" stroke="#2A2536" stroke-width="3"/>
    <rect x="228" y="144" width="12" height="8" fill="#2A2536"/>
    <g transform="translate(190 80)">${screen}</g>`;
}
function tramInside() {
  return `<rect width="${W}" height="${H}" fill="#D1FAE5"/>
    <rect x="0" y="0" width="${W}" height="26" fill="#10B981" stroke="#2A2536" stroke-width="3"/>
    <rect x="16" y="40" width="86" height="64" rx="14" fill="#E0F2FE" stroke="#2A2536" stroke-width="3"/>
    <rect x="118" y="40" width="86" height="64" rx="14" fill="#E0F2FE" stroke="#2A2536" stroke-width="3"/>
    <rect x="220" y="40" width="86" height="64" rx="14" fill="#E0F2FE" stroke="#2A2536" stroke-width="3"/>
    <path d="M24 92 h20 M130 86 h30 M236 94 h24" stroke="#A78BFA" stroke-width="5" stroke-linecap="round"/>
    <path d="M64 26 V220 M262 26 V220" stroke="#047857" stroke-width="6"/>
    <rect y="186" width="${W}" height="34" fill="#A7F3D0"/>`;
}
function station(screenContent) {
  return `<rect width="${W}" height="${H}" fill="#EDE8F8"/>
    <rect y="170" width="${W}" height="50" fill="#C7F0DD"/><path d="M0 180 H${W}" stroke="#2A2536" stroke-width="3"/>
    <rect x="150" y="30" width="150" height="80" rx="12" fill="#2E1065" stroke="#2A2536" stroke-width="3"/>
    <rect x="218" y="110" width="12" height="62" fill="#2A2536"/>
    <g transform="translate(160 40)">${screenContent}</g>`;
}
const uiRow = (y, w, c = '#C4B5FD') => `<rect x="0" y="${y}" width="${w}" height="8" rx="4" fill="${c}"/>`;

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
   ===================================================================== */
const btns214 = () => [0, 1, 2, 3, 4, 5].map(i => `<rect x="${(i % 3) * 30}" y="${Math.floor(i / 3) * 22 + 4}" width="${[24, 18, 26, 20, 14, 22][i]}" height="${[12, 16, 10, 14, 12, 18][i]}" rx="${[2, 8, 0, 5, 7, 3][i]}" fill="${['#F87171', '#60A5FA', '#FBBF24', '#34D399', '#F472B6', '#A78BFA'][i]}"/>`).join('');
const btnsClean = () => [0, 1, 2].map(i => `<rect x="4" y="${i * 17 + 4}" width="76" height="12" rx="6" fill="${['#7C3AED', '#fff', 'transparent'][i]}" stroke="${i ? '#C4B5FD' : 'none'}" stroke-width="2"/>`).join('');
const alertBox = (bg, icon, label, blink) => `<g class="${blink ? 'svgblink' : ''}"><rect x="0" y="22" width="130" height="26" rx="8" fill="${bg}"/>${icon ? '<path d="M12 42 l7 -13 l7 13z" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>' : ''}<rect x="${icon ? 32 : 10}" y="31" width="${label}" height="8" rx="4" fill="#fff"/></g>`;
const phoneBig = (btn) => `<rect x="110" y="20" width="100" height="180" rx="16" fill="#2E1065" stroke="#2A2536" stroke-width="3"/><rect x="118" y="34" width="84" height="150" rx="6" fill="#fff"/>${uiRow(0, 0)}<g transform="translate(126 46)">${uiRow(0, 60)}${uiRow(14, 44, '#DDD6FE')}${uiRow(28, 52, '#DDD6FE')}</g>${btn}`;

const LEVELS = [
  { time: '07:45', mood: 'calm', key: 'atomic', srcs: 'S13 · S27',
    title: { fr: '214 boutons', id: '214 tombol' },
    panels: [
      { art: () => office(`${uiRow(0, 60, '#7C3AED')}${uiRow(14, 80)}${uiRow(28, 50)}`) + person('harith', 70, 76, .95, { mood: 'happy', item: 'coffee' }),
        cap: { fr: 'Lyon, mardi 14 mai 2030, 07:45. Harith arrive chez Ligne, l’appli des transports de la ville.', id: 'Lyon, Selasa 14 Mei 2030, 07:45. Harith tiba di kantor Ligne, aplikasi transportasi kota.' } },
      { art: () => office(btns214()) + bot(70, 96, 1.5, 'happy', '#A7F3D0', 'bob'),
        who: 'Pixel', say: { fr: 'Cette nuit, j’ai créé 214 boutons pour les nouveaux écrans !', id: 'Semalam aku membuat 214 tombol untuk layar-layar baru!' } },
      { art: () => office(btns214()) + person('harith', 70, 76, .95, { mood: 'surprised', arms: 'up' }) + spark(100, 72),
        who: 'Harith', say: { fr: '214 boutons… et pas deux pareils.', id: '214 tombol… dan tidak ada dua yang sama.' } }
    ],
    q: { fr: 'Que fait Harith ?', id: 'Apa yang dilakukan Harith?' },
    choices: [
      { ok: false, label: { fr: 'Corriger les 214 boutons un par un', id: 'Memperbaiki 214 tombol satu per satu' },
        why: { fr: 'Il y en a pour des jours, et cette nuit les agents en recréeront d’autres. Le problème revient.', id: 'Butuh berhari-hari, dan malam ini para agen akan membuat tombol baru lagi. Masalahnya kembali.' } },
      { ok: false, label: { fr: 'Dire à l’agent : « rends-les cohérents »', id: 'Bilang ke agen: « buat semuanya seragam »' },
        why: { fr: '« Cohérent » est vague : l’agent invente un style au hasard. Il fait ce qu’on dit, pas ce qu’on veut dire.', id: '« Seragam » itu kabur: agen mengarang gaya secara acak. Ia melakukan apa yang dikatakan, bukan yang dimaksud.' } },
      { ok: true, label: { fr: 'Créer UN composant Bouton (3 variantes) que tous les agents réutilisent', id: 'Membuat SATU komponen Tombol (3 varian) yang dipakai ulang semua agen' },
        why: { fr: 'Un seul composant, réutilisé partout : c’est l’atomic design. Les agents piochent tous dans la même boîte de briques.', id: 'Satu komponen, dipakai di mana-mana: itulah atomic design. Semua agen mengambil dari kotak balok yang sama.' } }
    ],
    win: () => office(btnsClean()) + person('harith', 60, 76, .95, { mood: 'happy', arms: 'point' }) + bot(10, 120, 1.1, 'happy'),
    lose: () => office(btns214()) + person('harith', 70, 76, .95, { mood: 'worried', arms: 'chin' }) },

  { time: '08:30', mood: 'tension', key: 'tokens', also: ['color', 'spec'], srcs: 'S08 · S15 · S27',
    title: { fr: 'Le bleu qui n’existait pas', id: 'Biru yang tidak pernah ada' },
    panels: [
      { art: () => office(`${uiRow(0, 70)}${uiRow(14, 50)}`) + person('ines', 60, 76, .95, { mood: 'worried', item: 'phone' }),
        who: 'Inès', say: { fr: 'Les usagers ratent l’alerte de retard. Tu peux la rendre plus visible ?', id: 'Penumpang sering melewatkan peringatan keterlambatan. Bisa dibuat lebih terlihat?' } },
      { art: () => office(alertBox('#3D7BFF', false, 60, true)) + bot(70, 96, 1.5, 'happy', '#A7F3D0', 'bob'),
        who: 'Pixel', say: { fr: 'Consigne « plus visible » reçue : j’ai mis un bleu qui clignote sur 9 écrans !', id: 'Perintah « lebih terlihat » diterima: aku pasang warna biru berkedip di 9 layar!' } },
      { art: () => station(alertBox('#3D7BFF', false, 60, true)) + person('lina', 50, 72, .95, { mood: 'think', arms: 'chin' }),
        cap: { fr: 'À la station Perrache, Lina ne comprend pas que ce bleu veut dire « retard ».', id: 'Di halte Perrache, Lina tidak paham bahwa warna biru itu artinya « terlambat ».' } }
    ],
    q: { fr: 'Quelle règle Harith écrit-il pour les agents ?', id: 'Aturan apa yang ditulis Harith untuk para agen?' },
    choices: [
      { ok: false, label: { fr: 'Du rouge vif qui clignote partout', id: 'Merah terang yang berkedip di mana-mana' },
        why: { fr: 'Le clignotement fatigue et peut gêner (WCAG 2.2.2). Et une personne daltonienne ne distingue pas toujours le rouge.', id: 'Kedipan melelahkan dan bisa mengganggu (WCAG 2.2.2). Penyandang buta warna juga tidak selalu bisa membedakan merah.' } },
      { ok: true, label: { fr: 'Le token alert.critical + une icône + le mot « Retard »', id: 'Token alert.critical + ikon + kata « Terlambat »' },
        why: { fr: 'Le token donne la même couleur sur les 9 écrans, même en thème sombre. L’icône et le mot rendent l’alerte claire sans compter sur la couleur.', id: 'Token memberi warna yang sama di 9 layar, bahkan di tema gelap. Ikon dan kata membuat peringatan jelas tanpa bergantung pada warna.' } },
      { ok: false, label: { fr: 'Laisser l’agent décider, il sait mieux', id: 'Biarkan agen yang memutuskan, ia lebih tahu' },
        why: { fr: 'C’est exactement ce qui a produit le bleu. Sans règle précise, l’agent devine.', id: 'Justru itu yang menghasilkan warna biru tadi. Tanpa aturan yang jelas, agen hanya menebak.' } }
    ],
    win: () => station(alertBox('#B42318', true, 70, false)) + person('lina', 50, 72, .95, { mood: 'happy', arms: 'point' }),
    lose: () => station(alertBox('#F43F5E', false, 60, true)) + person('lina', 50, 72, .95, { mood: 'worried', arms: 'chin' }) },

  { time: '11:00', mood: 'calm', key: 'fitts', also: ['hick'], srcs: 'WCAG 2.2 · Fitts · Hick',
    title: { fr: 'Le bouton trop petit', id: 'Tombol yang terlalu kecil' },
    panels: [
      { art: () => tramInside() + person('lina', 120, 70, 1, { mood: 'neutral', item: 'phone' }),
        cap: { fr: '11:00, dans le tram T2. Lina veut changer d’itinéraire pendant que le tram roule.', id: '11:00, di trem T2. Lina ingin mengganti rute saat trem sedang melaju.' } },
      { art: () => `<rect width="${W}" height="${H}" fill="#D1FAE5"/>` + phoneBig('<rect x="182" y="168" width="14" height="8" rx="2" fill="#7C3AED"/>') + '<circle cx="168" cy="178" r="13" fill="#8D5A3B" stroke="#2A2536" stroke-width="3" opacity=".9"/>',
        who: 'Lina', say: { fr: 'Impossible d’appuyer sur ce bouton minuscule !', id: 'Tombol sekecil ini tidak bisa ditekan!' } },
      { art: () => office(`${uiRow(0, 80, '#F87171')}${uiRow(14, 80, '#F87171')}${uiRow(28, 60, '#F87171')}`) + person('harith', 40, 76, .95, { mood: 'worried', arms: 'chin' }) + person('ines', 110, 80, .9, { mood: 'neutral', item: 'tablet', flip: true }),
        who: 'Inès', say: { fr: '37 plaintes ce matin : « bouton impossible à toucher ».', id: '37 keluhan pagi ini: « tombolnya tidak bisa disentuh ».' } }
    ],
    q: { fr: 'Comment Harith corrige-t-il le bouton « Itinéraire » ?', id: 'Bagaimana Harith memperbaiki tombol « Rute »?' },
    choices: [
      { ok: false, label: { fr: 'Le garder petit mais l’écrire en gras', id: 'Tetap kecil tapi tulisannya ditebalkan' },
        why: { fr: 'Le gras ne change pas la zone à toucher. Le doigt rate toujours la cible.', id: 'Huruf tebal tidak mengubah area sentuh. Jari tetap meleset.' } },
      { ok: true, label: { fr: 'Agrandir la zone tactile (au moins 24 px, idéalement 44 px) avec de l’espace autour', id: 'Perbesar area sentuh (minimal 24 px, idealnya 44 px) dengan ruang di sekitarnya' },
        why: { fr: 'Loi de Fitts : une cible plus grande est plus rapide à atteindre. WCAG 2.2 demande au moins 24 × 24 px.', id: 'Hukum Fitts: target yang lebih besar lebih cepat dijangkau. WCAG 2.2 mensyaratkan minimal 24 × 24 px.' } },
      { ok: false, label: { fr: 'Mettre 10 gros boutons partout sur l’écran', id: 'Pasang 10 tombol besar di seluruh layar' },
        why: { fr: 'Trop de choix ralentit la décision (loi de Hick) et l’écran devient illisible.', id: 'Terlalu banyak pilihan memperlambat keputusan (hukum Hick) dan layar jadi sulit dibaca.' } }
    ],
    win: () => tramInside() + person('lina', 120, 70, 1, { mood: 'happy', item: 'phone' }) + spark(152, 70),
    lose: () => tramInside() + person('lina', 120, 70, 1, { mood: 'worried', item: 'phone' }) },

  { time: '14:00', mood: 'tension', key: 'basics', srcs: 'S21 · S27',
    title: { fr: 'La panne', id: 'Server mati' },
    panels: [
      { art: () => office(`<rect x="0" y="0" width="88" height="56" rx="4" fill="#7F1D1D"/><path d="M30 14 l14 26 h-28z" fill="none" stroke="#FCA5A5" stroke-width="3" stroke-linejoin="round"/>`, '#F3E8FF') + bot(70, 100, 1.5, 'error'),
        cap: { fr: '14:00. Le service d’IA tombe en panne dans toute l’Europe.', id: '14:00. Layanan AI mati di seluruh Eropa.' } },
      { art: () => office(`<rect x="0" y="0" width="88" height="56" rx="4" fill="#7F1D1D"/>`, '#F3E8FF') + bot(70, 100, 1.5, 'error'),
        who: 'Pixel', say: { fr: 'Erreur 503… Je ne peux plus rien générer.', id: 'Error 503… Aku tidak bisa membuat apa-apa lagi.' } },
      { art: () => office(`<rect x="0" y="0" width="88" height="56" rx="4" fill="#7F1D1D"/>`, '#F3E8FF') + person('ines', 40, 76, .95, { mood: 'worried', arms: 'up' }) + person('harith', 112, 76, .95, { mood: 'think', arms: 'chin', flip: true }),
        who: 'Inès', say: { fr: 'La mise à jour doit sortir à 17:00. On fait quoi ?', id: 'Pembaruan harus rilis jam 17:00. Kita harus bagaimana?' } }
    ],
    q: { fr: 'Que fait Harith ?', id: 'Apa yang dilakukan Harith?' },
    choices: [
      { ok: false, label: { fr: 'Attendre que le service revienne', id: 'Menunggu sampai layanannya kembali' },
        why: { fr: 'Personne ne sait quand il reviendra. La mise à jour sera en retard, et les usagers avec.', id: 'Tidak ada yang tahu kapan kembali. Pembaruan akan terlambat, penumpang juga ikut dirugikan.' } },
      { ok: true, label: { fr: 'Ouvrir le design system et finir à la main avec les composants existants', id: 'Membuka design system dan menyelesaikannya manual dengan komponen yang ada' },
        why: { fr: 'Les composants, les règles et l’évaluation heuristique ne tombent pas en panne. Le design system sert de filet de sécurité.', id: 'Komponen, aturan, dan evaluasi heuristik tidak bisa mati. Design system menjadi jaring pengaman.' } },
      { ok: false, label: { fr: 'Copier les écrans d’une autre appli', id: 'Menyalin layar dari aplikasi lain' },
        why: { fr: 'Ils ne suivent ni vos règles ni votre marque : vous créez de nouvelles incohérences.', id: 'Layar itu tidak mengikuti aturan maupun merek kalian: muncul ketidakkonsistenan baru.' } }
    ],
    win: () => office(btnsClean(), '#F3E8FF') + person('harith', 70, 76, .95, { mood: 'happy', item: 'tablet' }) + bot(14, 120, 1.1, 'error'),
    lose: () => office(`<rect x="0" y="0" width="88" height="56" rx="4" fill="#7F1D1D"/>`, '#F3E8FF') + person('harith', 70, 76, .95, { mood: 'worried', arms: 'chin' }) },

  { time: '16:30', mood: 'think', key: 'dt', srcs: 'S22 · S23',
    title: { fr: 'Le prix des tokens', id: 'Harga token' },
    panels: [
      { art: () => office(`<rect x="0" y="0" width="88" height="56" rx="4" fill="#fff"/><text x="10" y="36" font-size="22" font-weight="700" fill="#DC2626" font-family="Sk Modernist, sans-serif">+40 %</text>`) + person('harith', 70, 76, .95, { mood: 'surprised' }),
        cap: { fr: '16:30. Un e-mail tombe : le prix des tokens d’IA augmente de 40 % ce mois-ci.', id: '16:30. Ada email masuk: harga token AI naik 40% bulan ini.' } },
      { art: () => office(btns214()) + bot(70, 96, 1.5, 'happy', '#A7F3D0', 'bob'),
        who: 'Pixel', say: { fr: 'Je peux générer 50 versions du nouvel écran d’accueil ! Coût : tout le budget du mois.', id: 'Aku bisa membuat 50 versi layar beranda baru! Biayanya: seluruh anggaran bulan ini.' } },
      { art: () => office('') + person('ines', 40, 76, .95, { mood: 'think', arms: 'chin' }) + person('harith', 112, 76, .95, { mood: 'think', flip: true }),
        who: 'Inès', say: { fr: 'Et comment on saura laquelle est la bonne ?', id: 'Lalu bagaimana kita tahu mana yang benar?' } }
    ],
    q: { fr: 'Que décide Harith ?', id: 'Apa keputusan Harith?' },
    choices: [
      { ok: false, label: { fr: 'Générer les 50 versions et garder la plus jolie', id: 'Membuat 50 versi lalu pilih yang paling cantik' },
        why: { fr: 'Tout le budget part sans savoir ce que veulent les usagers. Joli ne veut pas dire utile.', id: 'Seluruh anggaran habis tanpa tahu apa yang dibutuhkan pengguna. Cantik belum tentu berguna.' } },
      { ok: true, label: { fr: 'Tester 2 versions avec 5 usagers, puis générer seulement ce qui marche', id: 'Uji 2 versi dengan 5 pengguna, lalu buat hanya yang berhasil' },
        why: { fr: 'C’est le design thinking : comprendre, prototyper, tester, itérer. Cinq usagers révèlent déjà la plupart des problèmes.', id: 'Itulah design thinking: pahami, buat prototipe, uji, ulangi. Lima pengguna sudah cukup menemukan sebagian besar masalah.' } },
      { ok: false, label: { fr: 'Annuler toute amélioration ce mois-ci', id: 'Batalkan semua perbaikan bulan ini' },
        why: { fr: 'Économiser ne doit pas bloquer le progrès : il faut dépenser au bon endroit.', id: 'Berhemat tidak boleh menghentikan kemajuan: belanjakan di tempat yang tepat.' } }
    ],
    win: () => office(btnsClean()) + person('harith', 40, 76, .95, { mood: 'happy', item: 'tablet' }) + person('lina', 116, 78, .92, { mood: 'happy', arms: 'point', flip: true }),
    lose: () => office(btns214()) + person('harith', 70, 76, .95, { mood: 'worried', arms: 'chin' }) }
];

/* =====================================================================
   SON : une ambiance par situation (Web Audio, rien à télécharger)
   ===================================================================== */
const Sound = (() => {
  let ctx = null, master = null, bus = null, noise = null, on = true, timer = null, step = 0, nextT = 0, mood = null, P = null;
  try { on = localStorage.getItem('rail-sound') !== 'off'; } catch (e) {}
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const MOODS = {
    calm:    { bpm: 86,  chords: [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]], pad: 'sine', arp: 'triangle', arpEvery: 2, kick: [0, 8], hat: [4, 12], bass: [0, 10], vol: .9 },
    tension: { bpm: 104, chords: [[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]], pad: 'sawtooth', arp: null, kick: [0, 6, 8], hat: [2, 6, 10, 14], bass: [0, 2, 4, 6, 8, 10, 12, 14], vol: .7 },
    think:   { bpm: 72,  chords: [[50, 53, 57, 60, 64], [46, 50, 53, 57], [43, 46, 50, 53, 57], [45, 50, 52, 55]], pad: 'sine', arp: 'sine', arpEvery: 4, kick: [], hat: [8], bass: [0], vol: .85 },
    win:     { bpm: 120, chords: [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], pad: 'triangle', arp: 'square', arpEvery: 1, kick: [0, 4, 8, 12], hat: [2, 6, 10, 14], bass: [0, 8], vol: .55 },
    dusk:    { bpm: 78,  chords: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [55, 58, 62, 65]], pad: 'sine', arp: 'triangle', arpEvery: 2, kick: [0], hat: [8], bass: [0, 8], vol: .9 }
  };
  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ctx = new AC(); master = ctx.createGain(); master.gain.value = .8;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
      master.connect(lp); lp.connect(ctx.destination);
      bus = ctx.createGain(); bus.gain.value = 0; bus.connect(master);
      const len = ctx.sampleRate * .2; noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = noise.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }
  function tone(f, t, dur, type, vol, dest, cut) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    if (cut) { const f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = cut; o.connect(f2); f2.connect(g); } else o.connect(g);
    g.connect(dest || master); o.start(t); o.stop(t + dur + .05);
  }
  function hat(t, vol) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; f.type = 'highpass'; f.frequency.value = 7000;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + .06);
    s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + .08);
  }
  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + .18);
    g.gain.setValueAtTime(.32, t); g.gain.exponentialRampToValueAtTime(.0001, t + .25);
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + .3);
  }
  function schedule() {
    const s16 = 60 / P.bpm / 4;
    while (nextT < ctx.currentTime + .3) {
      const bar = Math.floor(step / 16) % 4, s = step % 16, ch = P.chords[bar];
      if (s === 0) ch.forEach(n => tone(mtof(n - 12), nextT, s16 * 15.5, P.pad, P.pad === 'sawtooth' ? .018 : .04, bus, P.pad === 'sawtooth' ? 900 : 0));
      if (P.bass.includes(s)) tone(mtof(ch[0] - 24), nextT, P.bass.length > 4 ? s16 * 1.6 : s16 * 6, P.bass.length > 4 ? 'sawtooth' : 'triangle', P.bass.length > 4 ? .05 : .12, bus, 500);
      if (P.arp && s % P.arpEvery === 0 && (step * 7) % 5 !== 0) { const arp = [0, 2, 1, 3, 2, 1, 3, 2]; tone(mtof(ch[arp[(s / P.arpEvery) % 8] % ch.length] + 12), nextT, P.arpEvery === 1 ? .12 : .35, P.arp, P.arp === 'square' ? .018 : .03, bus); }
      if (P.kick.includes(s)) kick(nextT);
      if (P.hat.includes(s)) hat(nextT, .035);
      nextT += s16; step++;
    }
  }
  function setMood(m) {
    if (!on || !ensure() || m === mood) return;
    mood = m; P = MOODS[m];
    const t = ctx.currentTime;
    bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(bus.gain.value, t); bus.gain.linearRampToValueAtTime(0, t + .35);
    clearInterval(timer);
    setTimeout(() => {
      if (mood !== m) return;
      step = 0; nextT = ctx.currentTime + .05;
      bus.gain.cancelScheduledValues(ctx.currentTime); bus.gain.setValueAtTime(0, ctx.currentTime); bus.gain.linearRampToValueAtTime(P.vol, ctx.currentTime + 1.2);
      timer = setInterval(schedule, 60);
    }, 380);
  }
  function stop() {
    if (!ctx) return; mood = null; const t = ctx.currentTime;
    bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(bus.gain.value, t); bus.gain.linearRampToValueAtTime(0, t + .4);
    setTimeout(() => clearInterval(timer), 450);
  }
  const fx = {
    tap() { tone(880, ctx.currentTime, .09, 'triangle', .08); },
    right() { [72, 76, 79, 84].forEach((n, i) => tone(mtof(n), ctx.currentTime + i * .09, .6, 'triangle', .09)); },
    wrong() { tone(mtof(52), ctx.currentTime, .25, 'sawtooth', .04, null, 1200); tone(mtof(47), ctx.currentTime + .18, .4, 'sawtooth', .04, null, 1200); },
    page() { tone(mtof(79), ctx.currentTime, .12, 'sine', .05); tone(mtof(84), ctx.currentTime + .06, .14, 'sine', .04); }
  };
  let wanted = null;
  return {
    get on() { return on; },
    mood(m) { wanted = m; setMood(m); },
    sfx(n) { if (on && ensure()) fx[n](); },
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
const S = { done: {}, carnet: new Set(), lvl: 0, stage: 'story', tried: [], firstTry: {} };
try { const saved = JSON.parse(localStorage.getItem('rail-progress') || 'null'); if (saved) { S.done = saved.done || {}; S.firstTry = saved.firstTry || {}; (saved.carnet || []).forEach(k => S.carnet.add(k)); } } catch (e) {}
const save = () => { try { localStorage.setItem('rail-progress', JSON.stringify({ done: S.done, firstTry: S.firstTry, carnet: [...S.carnet] })); } catch (e) {} };
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
  $('.carnet-intro').textContent = tx('Chaque principe découvert s’ajoute ici, avec sa source officielle.', 'Setiap prinsip yang kamu temukan masuk ke sini, lengkap dengan sumber resminya.');
  document.querySelectorAll('#langSwitch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
  $('#langSwitch').setAttribute('aria-label', tx('Langue', 'Bahasa'));
  $('#carnetCount').textContent = `(${S.carnet.size})`;
  renderSoundBtn();
}
function setHud(on, clock) {
  $('#hud').hidden = !on;
  if (!on) return;
  const n = Object.keys(S.done).length;
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
const svgPanel = (art, label) => `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${art}</svg>`;
function comicPanel(p, i, delay = true) {
  const text = p.say ? `<div class="say"><b>${p.who}</b>${L(p.say)}</div>` : `<div class="cap">${L(p.cap)}</div>`;
  const label = p.say ? `${p.who} : ${L(p.say)}` : L(p.cap);
  return `<figure class="panel" style="--d:${delay && !REDUCED ? i * 280 : 0}ms"><span class="pn">${i + 1}</span>${svgPanel(p.art(), label.replace(/"/g, '&quot;'))}<figcaption>${text}</figcaption></figure>`;
}
const goTop = () => { if (!REDUCED) window.scrollTo({ top: 0, behavior: 'smooth' }); else window.scrollTo(0, 0); };

/* ---------- Écran titre ---------- */
function heroScene() {
  return `<svg viewBox="0 0 560 400" role="img" aria-label="${tx('Harith, Inès, Lina et Pixel l’agent IA devant un tram de Lyon', 'Harith, Inès, Lina, dan Pixel si agen AI di depan trem Lyon')}">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9E1FF"/><stop offset="1" stop-color="#F7F5FD"/></linearGradient></defs>
    <rect width="560" height="400" fill="url(#sky)"/>
    <circle cx="470" cy="80" r="40" fill="#FDE68A" stroke="#2A2536" stroke-width="3"/>
    <path d="M0 238 Q110 168 236 212 T560 196 V400 H0Z" fill="#DDD6FE"/>
    <g fill="#C4B5FD" stroke="#2A2536" stroke-width="2.5"><path d="M104 196 h64 v-26 l-32 -18 l-32 18z"/><rect x="108" y="140" width="10" height="34"/><rect x="154" y="140" width="10" height="34"/></g>
    <g stroke="#2A2536" stroke-width="2.5"><rect x="250" y="150" width="34" height="92" rx="6" fill="#A78BFA"/><path d="M300 242 V122 Q314 92 328 122 V242Z" fill="#8B5CF6"/><rect x="342" y="170" width="44" height="72" rx="6" fill="#A78BFA"/></g>
    <rect y="306" width="560" height="94" fill="#C7F0DD"/><path d="M0 330 H560 M0 342 H560" stroke="#2A2536" stroke-width="3"/>
    <g class="tram"><path d="M110 210 L130 188 L158 210" fill="none" stroke="#2A2536" stroke-width="3" stroke-linejoin="round"/>
      <rect x="20" y="210" width="300" height="110" rx="34" fill="#10B981" stroke="#2A2536" stroke-width="3"/><rect x="20" y="290" width="300" height="12" fill="#047857"/>
      ${[50, 102, 154, 206].map(x => `<rect x="${x}" y="232" width="40" height="34" rx="8" fill="#E0F2FE" stroke="#2A2536" stroke-width="2.5"/>`).join('')}
      <rect x="264" y="226" width="40" height="50" rx="12" fill="#E0F2FE" stroke="#2A2536" stroke-width="2.5"/>
      <circle cx="80" cy="324" r="13" fill="#2A2536"/><circle cx="270" cy="324" r="13" fill="#2A2536"/></g>
    ${person('ines', 330, 178, .95, { mood: 'happy', item: 'tablet' })}
    ${person('harith', 400, 172, 1.02, { mood: 'happy', arms: 'up' })}
    ${person('lina', 470, 180, .92, { mood: 'happy', item: 'phone', flip: true })}
    ${bot(190, 60, 1.4, 'happy', '#A7F3D0', 'bob')}${bot(100, 90, .9, 'ok', '#FDE68A', 'bob b2')}${bot(280, 74, 1, 'ok', '#FBCFE8', 'bob b3')}
  </svg>`;
}
function screenTitle() {
  current = screenTitle; setHud(false); Sound.mood('calm');
  app.innerHTML = `<section class="screen hero">
    <div>
      <div class="kicker">ICX3 · Designing for the Internet of Agents</div>
      <h1 class="title">Rail <span>2030</span></h1>
      <p class="lead">${tx('Une journée dans la peau de Harith, designer chez Ligne, l’appli des transports de Lyon. Des agents IA fabriquent les écrans ; vous prenez les décisions qu’ils ne savent pas prendre.', 'Satu hari sebagai Harith, desainer di Ligne, aplikasi transportasi Lyon. Agen AI membuat layar-layarnya; kamu mengambil keputusan yang tidak bisa mereka ambil.')}</p>
      <ul class="howto">
        <li><b>1</b>${tx('Lisez la BD : un vrai problème arrive.', 'Baca komiknya: muncul masalah nyata.')}</li>
        <li><b>2</b>${tx('Choisissez la meilleure réponse parmi 3.', 'Pilih jawaban terbaik dari 3 pilihan.')}</li>
        <li><b>3</b>${tx('Découvrez le principe de design derrière.', 'Temukan prinsip desain di baliknya.')}</li>
      </ul>
      <button class="btn" id="go">${I.play}${Object.keys(S.done).length ? tx('Reprendre la journée', 'Lanjutkan hari ini') : tx('Commencer la journée', 'Mulai hari ini')}</button>
      <p class="hint">${tx('5 moments, environ 5 minutes. La musique change selon la situation ; le bouton « Musique » la coupe.', '5 momen, sekitar 5 menit. Musik berganti sesuai situasi; tombol « Musik » untuk mematikannya.')}</p>
    </div>
    <div class="illus">${heroScene()}</div>
  </section>`;
  $('#go').onclick = () => { Sound.mood('calm'); Sound.sfx('tap'); screenMap(); };
}

/* ---------- Carte de la journée ---------- */
const levelIcon = (i) => svgPanel(LEVELS[i].panels[0].art(), '');
function screenMap() {
  current = screenMap; setHud(true, LEVELS[Math.min(Object.keys(S.done).length, LEVELS.length - 1)].time); Sound.mood('calm');
  const next = LEVELS.findIndex((_, i) => !S.done[i]);
  const cards = LEVELS.map((lv, i) => {
    const done = !!S.done[i], open = done || i === next || (next === -1);
    const stars = done ? `<span class="stars" aria-label="${S.firstTry[i] ? tx('trouvé du premier coup', 'benar di percobaan pertama') : tx('trouvé', 'berhasil')}">${I.star}${S.firstTry[i] ? I.star : ''}</span>` : '';
    return `<li><button class="stop ${done ? 'done' : ''} ${i === next ? 'now' : ''}" data-l="${i}" ${open ? '' : 'disabled'}>
      <span class="time">${lv.time}</span>
      <span class="thumb">${levelIcon(i)}</span>
      <span class="st">${L(lv.title)}</span>
      <span class="state">${done ? tx('Terminé', 'Selesai') : i === next ? tx('À jouer', 'Mainkan') : open ? '' : I.lock + tx('Verrouillé', 'Terkunci')}</span>${stars}
    </button></li>`;
  }).join('');
  const all = next === -1;
  app.innerHTML = `<section class="screen">
    <div class="kicker">${tx('Mardi 14 mai 2030', 'Selasa, 14 Mei 2030')}</div>
    <h2 class="h">${tx('La journée de Harith', 'Hari Harith')}</h2>
    <p class="lead">${all ? tx('Journée terminée ! Rejouez un moment ou découvrez votre profil.', 'Hari selesai! Mainkan ulang sebuah momen atau lihat profilmu.') : tx('Chaque moment est un problème réel de designer en 2030. Ils se débloquent dans l’ordre.', 'Setiap momen adalah masalah nyata desainer di 2030. Momen terbuka secara berurutan.')}</p>
    <ol class="day">${cards}</ol>
    <div class="row-btns">
      ${all ? `<button class="btn" id="end">${I.star}${tx('Voir mon profil de designer', 'Lihat profil desainerku')}</button>` : `<button class="btn" id="play">${I.play}${tx('Jouer', 'Main')} ${LEVELS[next].time}</button>`}
      ${Object.keys(S.done).length ? `<button class="btn ghost" id="reset">${I.redo}${tx('Recommencer la journée', 'Ulangi dari awal')}</button>` : ''}
    </div>
  </section>`;
  app.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { Sound.sfx('tap'); startLevel(+b.dataset.l); });
  if ($('#play')) $('#play').onclick = () => { Sound.sfx('tap'); startLevel(next); };
  if ($('#end')) $('#end').onclick = () => { Sound.sfx('tap'); screenEnd(); };
  if ($('#reset')) $('#reset').onclick = () => { S.done = {}; S.firstTry = {}; save(); Sound.sfx('tap'); screenMap(); };
}

/* ---------- Un moment : BD → choix → réaction ---------- */
function startLevel(i) { S.lvl = i; S.stage = 'story'; S.tried = []; goTop(); screenLevel(); }
function levelHead(lv, i) {
  return `<div class="level-head"><div><div class="kicker">${lv.time} · ${tx('Moment', 'Momen')} ${i + 1}/${LEVELS.length}</div><h2 class="h" style="margin:0">${L(lv.title)}</h2></div>
    <button class="btn ghost small" id="toMap">${I.map}${tx('Journée', 'Hari ini')}</button></div>`;
}
function screenLevel() {
  current = screenLevel;
  const i = S.lvl, lv = LEVELS[i];
  setHud(true, lv.time);
  const story = `<div class="comic">${lv.panels.map((p, k) => comicPanel(p, k, S.stage === 'story')).join('')}</div>`;
  let body = '';
  if (S.stage === 'story') {
    Sound.mood(lv.mood);
    body = `<div class="cta"><button class="btn" id="toChoice">${tx('Que doit faire Harith ?', 'Apa yang harus dilakukan Harith?')}${I.next}</button></div>`;
  } else if (S.stage === 'choice') {
    Sound.mood('think');
    const last = S.tried.length ? lv.choices[S.tried[S.tried.length - 1]] : null;
    body = `${last ? `<div class="result ko" role="status">${svgPanel(lv.lose(), tx('Harith est embêté', 'Harith kebingungan'))}<div><div class="tag ko">${I.x}${tx('Pas tout à fait', 'Belum tepat')}</div><p>${L(last.why)}</p><p class="hint">${tx('Essayez une autre réponse.', 'Coba jawaban lain.')}</p></div></div>` : ''}
      <h3 class="q">${L(lv.q)}</h3>
      <div class="choices">${lv.choices.map((c, k) => `<button class="choice" data-c="${k}" ${S.tried.includes(k) ? 'disabled' : ''}><span class="letter">${'ABC'[k]}</span><span>${L(c.label)}</span></button>`).join('')}</div>`;
  } else {
    Sound.mood('win');
    const c = lv.choices.find(x => x.ok), p = PR[lv.key];
    body = `<div class="result ok" role="status">${svgPanel(lv.win(), tx('Harith a trouvé la solution', 'Harith menemukan solusinya'))}<div>
        <div class="tag ok">${I.check}${S.tried.length ? tx('Bien joué', 'Bagus') : tx('Du premier coup !', 'Langsung benar!')}</div>
        <p class="answer">${L(c.label)}</p><p>${L(c.why)}</p></div></div>
      <div class="principle"><div class="label">${tx('Le principe à retenir', 'Prinsip yang perlu diingat')}</div><h4>${L(p.title)}</h4><p>${L(p.text)}</p>
        <p class="ref">${L(p.ref)} · <a href="${p.url}" target="_blank" rel="noopener">${tx('Source', 'Sumber')}</a> · ${tx('Board', 'Board')} ${lv.srcs}</p></div>
      <div class="row-btns">${i < LEVELS.length - 1 ? `<button class="btn" id="nextL">${tx('Moment suivant', 'Momen berikutnya')} · ${LEVELS[i + 1].time}${I.next}</button>` : `<button class="btn" id="endB">${I.star}${tx('Fin de journée', 'Akhir hari')}</button>`}
        <button class="btn ghost" id="toMap2">${I.map}${tx('Voir la journée', 'Lihat hari ini')}</button></div>`;
  }
  app.innerHTML = `<section class="screen">${levelHead(lv, i)}${S.stage === 'story' ? story : `<details class="recap"><summary>${tx('Revoir la BD', 'Lihat lagi komiknya')}</summary>${story}</details>`}${body}</section>`;
  $('#toMap').onclick = () => { Sound.sfx('tap'); screenMap(); };
  if ($('#toChoice')) $('#toChoice').onclick = () => { Sound.sfx('page'); S.stage = 'choice'; screenLevel(); $('.q').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' }); };
  app.querySelectorAll('[data-c]').forEach(b => b.onclick = () => pick(+b.dataset.c));
  if ($('#nextL')) $('#nextL').onclick = () => { Sound.sfx('tap'); startLevel(i + 1); };
  if ($('#endB')) $('#endB').onclick = () => { Sound.sfx('tap'); screenEnd(); };
  if ($('#toMap2')) $('#toMap2').onclick = () => { Sound.sfx('tap'); screenMap(); };
}
function pick(k) {
  const lv = LEVELS[S.lvl];
  if (lv.choices[k].ok) {
    Sound.sfx('right');
    if (!S.done[S.lvl]) S.firstTry[S.lvl] = S.tried.length === 0;
    S.done[S.lvl] = true; S.stage = 'result';
    screenLevel(); unlock([lv.key, ...(lv.also || [])]);
    $('.result').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  } else {
    Sound.sfx('wrong'); S.tried.push(k); screenLevel();
    $('.result').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  }
}

/* ---------- Épilogue ---------- */
function screenEnd() {
  current = screenEnd; goTop(); setHud(true, '18:30'); Sound.mood('dusk');
  const n = LEVELS.filter((_, i) => S.firstTry[i]).length;
  const prof = n === 5 ? { t: { fr: 'Architecte du jugement', id: 'Arsitek penilaian' }, d: { fr: 'Vous donnez aux agents des règles claires et vous gardez la main sur ce qui compte : le sens, les usagers, les choix.', id: 'Kamu memberi agen aturan yang jelas dan tetap memegang kendali atas hal penting: makna, pengguna, dan keputusan.' } }
    : n >= 3 ? { t: { fr: 'Designer augmenté', id: 'Desainer yang diperkuat AI' }, d: { fr: 'Vous savez travailler avec les agents. Encore quelques réflexes, et ils ne pourront plus vous surprendre.', id: 'Kamu sudah bisa bekerja dengan agen. Sedikit lagi latihan, dan mereka tidak akan bisa mengejutkanmu.' } }
    : { t: { fr: 'Apprenti en route', id: 'Pembelajar yang sedang berproses' }, d: { fr: 'Chaque erreur vous a appris un principe. Rejouez la journée : les fondamentaux s’ancrent par la pratique.', id: 'Setiap kesalahan mengajarkan satu prinsip. Mainkan lagi: dasar-dasar desain melekat lewat latihan.' } };
  const art = `<svg viewBox="0 0 560 300" role="img" aria-label="${tx('Harith rentre en tram au coucher du soleil', 'Harith pulang naik trem saat matahari terbenam')}">
    <defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C4B5FD"/><stop offset="1" stop-color="#FBCFE8"/></linearGradient></defs>
    <rect width="560" height="300" fill="url(#dusk)"/><circle cx="420" cy="170" r="54" fill="#FDE68A" stroke="#2A2536" stroke-width="3"/>
    <path d="M0 200 Q140 150 280 190 T560 180 V300 H0Z" fill="#A78BFA"/>
    <rect x="40" y="120" width="420" height="140" rx="40" fill="#10B981" stroke="#2A2536" stroke-width="3"/>
    ${[70, 170, 270].map(x => `<rect x="${x}" y="140" width="80" height="64" rx="12" fill="#E0F2FE" stroke="#2A2536" stroke-width="3"/>`).join('')}
    <g transform="translate(0 0)"><clipPath id="win2"><rect x="170" y="140" width="80" height="64" rx="12"/></clipPath><g clip-path="url(#win2)">${person('harith', 178, 146, .82, { mood: 'happy', item: 'phone' })}</g></g>
    ${bot(300, 154, .9, 'happy')}
    <rect y="262" width="560" height="38" fill="#7C3AED"/></svg>`;
  app.innerHTML = `<section class="screen">
    <div class="kicker">18:30 · ${tx('Épilogue', 'Epilog')}</div>
    <h2 class="h">${tx('Les agents ont produit. Harith a décidé.', 'Para agen yang membuat. Harith yang memutuskan.')}</h2>
    <div class="debrief">
      <div class="card"><div class="illus" style="box-shadow:none;margin-bottom:1rem">${art}</div>
        <div class="label">${tx('Votre profil', 'Profilmu')}</div><div class="score-big">${L(prof.t)}</div>
        <p>${L(prof.d)}</p><p class="hint">${tx(`Trouvé du premier coup : ${n} / ${LEVELS.length}`, `Benar di percobaan pertama: ${n} / ${LEVELS.length}`)}</p></div>
      <div class="card tint">
        <div class="label" style="margin-bottom:.6rem">${tx('Ce que la journée montre', 'Yang ditunjukkan hari ini')}</div>
        <div class="split">
          <div class="row"><span class="badge" style="background:var(--role-auto)">${tx('Automatisé', 'Otomatis')}</span><div>${tx('Produire des variantes, appliquer une règle à 9 écrans.', 'Membuat varian, menerapkan aturan ke 9 layar.')}</div></div>
          <div class="row"><span class="badge" style="background:var(--role-aug)">${tx('Augmenté', 'Diperkuat AI')}</span><div>${tx('Mesurer, repérer les écarts, proposer des options.', 'Mengukur, menemukan penyimpangan, mengusulkan pilihan.')}</div></div>
          <div class="row"><span class="badge" style="background:var(--role-human)">${tx('Jugement humain', 'Penilaian manusia')}</span><div>${tx('Écrire des règles claires, protéger les usagers, décider quand l’IA s’arrête ou coûte trop cher.', 'Menulis aturan yang jelas, melindungi pengguna, memutuskan saat AI mati atau terlalu mahal.')}</div></div>
        </div>
        <p class="hint">${tx('Sources (codes S##) : voir le document d’accompagnement sur le board FigJam.', 'Sumber (kode S##): lihat dokumen pendamping di board FigJam.')}</p>
        <div class="row-btns"><button class="btn" id="carnet2">${I.book}${tx('Ouvrir le carnet', 'Buka catatan')} (${S.carnet.size})</button><button class="btn ghost" id="again">${I.redo}${tx('Rejouer la journée', 'Main lagi')}</button></div>
      </div>
    </div>
  </section>`;
  $('#carnet2').onclick = openCarnet;
  $('#again').onclick = () => { S.done = {}; S.firstTry = {}; save(); Sound.sfx('tap'); screenMap(); };
}

/* ---------- Carnet ---------- */
function openCarnet() {
  Sound.sfx('tap');
  const list = Object.keys(PR).filter(k => S.carnet.has(k)).map(k => {
    const p = PR[k];
    return `<div class="entry"><div class="ref">${L(p.ref)}</div><h4>${L(p.title)}</h4><div>${L(p.text)}</div><div style="margin-top:.4rem"><a href="${p.url}" target="_blank" rel="noopener">${tx('Source officielle', 'Sumber resmi')}</a></div></div>`;
  }).join('');
  $('#carnetList').innerHTML = list || `<p class="empty">${tx('Aucun principe pour l’instant. Jouez un moment pour en découvrir.', 'Belum ada prinsip. Mainkan satu momen untuk menemukannya.')}</p>`;
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
