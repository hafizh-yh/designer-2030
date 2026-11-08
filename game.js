/* Rail · Le designer en 2030 · prototype, niveau 08:30
   Le joueur écrit la règle du token alert.critical avec des tuiles. Neuf agents l'appliquent
   à neuf écrans ; l'audit vérifie la règle avec de vrais critères (design tokens, WCAG 2.2, RGAA 4.1.2).
   Musique et sons générés en direct (Web Audio), ilustrations en SVG. */

const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Icônes (SVG, pas d'emoji) ---------- */
const I = {
  alert: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m23 9-6 6M17 9l6 6"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V4.5M9 7h7"/></svg>',
  redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>'
};

/* ---------- Ilustrations (SVG maison) ---------- */
function bot(x, y, s, body, cls = '') {
  return `<g class="${cls}" style="transform-box:fill-box;transform-origin:center"><g transform="translate(${x} ${y}) scale(${s})">
    <line x1="20" y1="2" x2="20" y2="10" stroke="#2A2536" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="3" r="3.5" fill="#DB2777" stroke="#2A2536" stroke-width="2"/>
    <rect x="3" y="10" width="34" height="27" rx="11" fill="${body}" stroke="#2A2536" stroke-width="3"/>
    <rect x="9" y="16" width="22" height="12" rx="6" fill="#2E1065"/>
    <circle cx="15" cy="22" r="2.6" fill="#A7F3D0"/><circle cx="25" cy="22" r="2.6" fill="#A7F3D0"/>
    <path d="M14 32 h12" stroke="#2A2536" stroke-width="2.5" stroke-linecap="round"/></g></g>`;
}
function person(x, y, s, o = {}) {
  const skin = o.skin || '#B8794E', hair = o.hair || '#2A2536', top = o.top || '#7C3AED';
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="18" y="96" width="11" height="44" rx="5" fill="#2E1065"/><rect x="33" y="96" width="11" height="44" rx="5" fill="#2E1065"/>
    <ellipse cx="23" cy="141" rx="9" ry="5" fill="#2A2536"/><ellipse cx="39" cy="141" rx="9" ry="5" fill="#2A2536"/>
    <path d="M8 104 Q6 62 31 56 Q56 62 54 104 Z" fill="${top}" stroke="#2A2536" stroke-width="3"/>
    <rect x="27" y="44" width="9" height="14" fill="${skin}"/>
    <circle cx="31" cy="30" r="19" fill="${skin}" stroke="#2A2536" stroke-width="3"/>
    <path d="M12 28 Q12 8 31 8 Q50 8 50 26 Q42 16 28 18 Q18 19 12 28Z" fill="${hair}"/>
    ${o.glasses ? '<circle cx="24" cy="31" r="5.5" fill="none" stroke="#2A2536" stroke-width="2.5"/><circle cx="38" cy="31" r="5.5" fill="none" stroke="#2A2536" stroke-width="2.5"/><path d="M29.5 31h3" stroke="#2A2536" stroke-width="2.5"/>' : '<circle cx="24" cy="31" r="2.4" fill="#2A2536"/><circle cx="38" cy="31" r="2.4" fill="#2A2536"/>'}
    <path d="M25 40 Q31 44 37 40" stroke="#2A2536" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    ${o.phones ? '<path d="M11 32 Q11 6 31 6 Q51 6 51 32" fill="none" stroke="#10B981" stroke-width="4"/><rect x="6" y="27" width="9" height="13" rx="4" fill="#10B981" stroke="#2A2536" stroke-width="2"/><rect x="47" y="27" width="9" height="13" rx="4" fill="#10B981" stroke="#2A2536" stroke-width="2"/>' : ''}
    ${o.tablet ? '<rect x="40" y="70" width="30" height="22" rx="4" fill="#fff" stroke="#2A2536" stroke-width="3" transform="rotate(-12 55 81)"/><path d="M46 78h14M46 84h9" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round" transform="rotate(-12 55 81)"/>' : ''}
  </g>`;
}
function avatar(kind) {
  const o = kind === 'harith' ? { skin: '#B8794E', hair: '#2A2536', top: '#7C3AED', phones: true, glasses: true }
    : { skin: '#F1C7A3', hair: '#B45309', top: '#10B981' };
  return `<svg class="avatar" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="${kind === 'harith' ? '#DDD6FE' : '#D1FAE5'}" stroke="#2A2536" stroke-width="3"/>
    <clipPath id="cp-${kind}"><circle cx="32" cy="32" r="28.5"/></clipPath><g clip-path="url(#cp-${kind})">${person(1, 12, 1, o)}</g></svg>`;
}
function heroScene() {
  const win = (x) => `<rect x="${x}" y="246" width="40" height="30" rx="8" fill="#E0F2FE" stroke="#2A2536" stroke-width="2.5"/>`;
  return `<svg viewBox="0 0 560 400" role="img" aria-label="Harith, designer, devant un tram de Lyon entouré de petits agents IA">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9E1FF"/><stop offset="1" stop-color="#F7F5FD"/></linearGradient></defs>
    <rect width="560" height="400" fill="url(#sky)"/>
    <circle cx="455" cy="86" r="44" fill="#FDE68A" stroke="#2A2536" stroke-width="3"/>
    <path d="M0 238 Q110 168 236 212 T560 196 V400 H0Z" fill="#DDD6FE"/>
    <g fill="#C4B5FD" stroke="#2A2536" stroke-width="2.5"><path d="M104 196 h64 v-26 l-32 -18 l-32 18z"/><rect x="108" y="140" width="10" height="34"/><rect x="154" y="140" width="10" height="34"/></g>
    <g stroke="#2A2536" stroke-width="2.5"><rect x="250" y="150" width="34" height="92" rx="6" fill="#A78BFA"/><path d="M300 242 V122 Q314 92 328 122 V242Z" fill="#8B5CF6"/><rect x="342" y="170" width="44" height="72" rx="6" fill="#A78BFA"/><rect x="396" y="188" width="30" height="54" rx="6" fill="#C4B5FD"/></g>
    <g fill="#EDE9FE"><rect x="258" y="162" width="7" height="7"/><rect x="270" y="162" width="7" height="7"/><rect x="258" y="178" width="7" height="7"/><rect x="270" y="194" width="7" height="7"/><rect x="350" y="182" width="8" height="8"/><rect x="366" y="198" width="8" height="8"/></g>
    <rect y="306" width="560" height="94" fill="#C7F0DD"/>
    <path d="M0 330 H560 M0 342 H560" stroke="#2A2536" stroke-width="3"/>
    <g class="tram">
      <path d="M150 226 L170 204 L198 226" fill="none" stroke="#2A2536" stroke-width="3" stroke-linejoin="round"/>
      <rect x="34" y="226" width="340" height="96" rx="34" fill="#10B981" stroke="#2A2536" stroke-width="3"/>
      <rect x="34" y="292" width="340" height="12" fill="#047857"/>
      ${win(66)}${win(118)}${win(170)}${win(222)}${win(274)}
      <rect x="326" y="240" width="34" height="44" rx="12" fill="#E0F2FE" stroke="#2A2536" stroke-width="2.5"/>
      <rect x="60" y="232" width="56" height="9" rx="4" fill="#2E1065"/><text x="88" y="239.5" text-anchor="middle" font-size="7.5" font-weight="700" fill="#A7F3D0" font-family="Sk Modernist, sans-serif">T2 · PERRACHE</text>
      <circle cx="96" cy="326" r="13" fill="#2A2536"/><circle cx="310" cy="326" r="13" fill="#2A2536"/><circle cx="96" cy="326" r="5" fill="#C4B5FD"/><circle cx="310" cy="326" r="5" fill="#C4B5FD"/>
    </g>
    ${person(420, 186, 1.02, { skin: '#B8794E', top: '#7C3AED', phones: true, glasses: true, tablet: true })}
    ${bot(60, 70, 1.15, '#A7F3D0', 'bob')}${bot(196, 40, .95, '#FDE68A', 'bob b2')}${bot(330, 64, 1.05, '#FBCFE8', 'bob b3')}
    <path d="M110 128 Q180 168 238 92 M236 90 Q300 130 368 112" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-dasharray="5 7" stroke-linecap="round"/>
  </svg>`;
}
function celebrate() {
  return `<svg viewBox="0 0 420 240" role="img" aria-label="Harith fête la règle validée, les agents sont alignés">
    <rect width="420" height="240" fill="#F4F1FA"/>
    <g stroke="#2A2536" stroke-width="2"><rect x="30" y="40" width="8" height="14" fill="#FDE68A" transform="rotate(20 34 47)"/><rect x="370" y="30" width="8" height="14" fill="#A7F3D0" transform="rotate(-25 374 37)"/><circle cx="330" cy="70" r="5" fill="#FBCFE8"/><circle cx="90" cy="26" r="5" fill="#C4B5FD"/><rect x="250" y="20" width="8" height="14" fill="#C4B5FD" transform="rotate(40 254 27)"/></g>
    ${person(160, 64, 1.05, { skin: '#B8794E', top: '#7C3AED', phones: true, glasses: true })}
    <path d="M168 128 L140 92 M224 128 L252 92" stroke="#7C3AED" stroke-width="12" stroke-linecap="round"/>
    ${bot(30, 170, .9, '#A7F3D0')}${bot(78, 170, .9, '#A7F3D0')}${bot(300, 170, .9, '#A7F3D0')}${bot(348, 170, .9, '#A7F3D0')}
  </svg>`;
}
function sleepyBot() {
  return `<svg viewBox="0 0 200 160" role="img" aria-label="Un agent à court de batterie"><rect width="200" height="160" fill="#F4F1FA"/>
    ${bot(52, 40, 2.2, '#DDD6FE')}<rect x="150" y="70" width="34" height="56" rx="8" fill="#fff" stroke="#2A2536" stroke-width="3"/><rect x="160" y="62" width="14" height="8" rx="2" fill="#2A2536"/><rect x="156" y="112" width="22" height="8" rx="2" fill="#DC2626"/>
    <text x="140" y="40" font-size="22" font-weight="700" fill="#7C3AED" font-family="Sk Modernist, sans-serif">z z</text></svg>`;
}
const SCREEN_ICON = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>',
  board: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="2" y="4" width="20" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
  web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4"/></svg>',
  tram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="4" y="5" width="16" height="13" rx="4"/><path d="M4 12h16M8 21l2-3M16 21l-2-3M9 2h6"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
};

/* ---------- Son : musique et effets (Web Audio, rien à télécharger) ---------- */
const Sound = (() => {
  let ctx = null, master = null, musicBus = null, on = true, playing = false, timer = null, step = 0, nextT = 0, noise = null;
  try { on = localStorage.getItem('rail-sound') !== 'off'; } catch (e) {}
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const CHORDS = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]]; // Cmaj7 Am7 Fmaj7 G7
  const S16 = 60 / 86 / 4;
  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ctx = new AC(); master = ctx.createGain(); master.gain.value = .8;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
      master.connect(lp); lp.connect(ctx.destination);
      musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(master);
      const len = ctx.sampleRate * .2; noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = noise.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }
  function tone(f, t, dur, type, vol, dest) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + dur + .05);
  }
  function hat(t, vol) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; f.type = 'highpass'; f.frequency.value = 7000;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + .06);
    s.connect(f); f.connect(g); g.connect(musicBus); s.start(t); s.stop(t + .08);
  }
  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + .18);
    g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(.0001, t + .25);
    o.connect(g); g.connect(musicBus); o.start(t); o.stop(t + .3);
  }
  function schedule() {
    while (nextT < ctx.currentTime + .3) {
      const bar = Math.floor(step / 16) % 4, s = step % 16, ch = CHORDS[bar];
      if (s === 0) ch.forEach(n => tone(mtof(n - 12), nextT, S16 * 15.5, 'sine', .045, musicBus));
      if (s === 0 || s === 10) tone(mtof(ch[0] - 24), nextT, S16 * 6, 'triangle', .12, musicBus);
      if (s % 2 === 0 && (step * 7) % 5 !== 0) { const arp = [0, 2, 1, 3, 2, 1, 3, 2]; tone(mtof(ch[arp[(s / 2) % 8]] + 12), nextT, .32, 'triangle', .03, musicBus); }
      if (s === 0 || s === 8) kick(nextT);
      if (s === 4 || s === 12) hat(nextT, .05);
      if (s % 4 === 2) hat(nextT, .018);
      nextT += S16; step++;
    }
  }
  function startMusic() {
    if (!on || playing || !ensure()) return;
    playing = true; nextT = ctx.currentTime + .1;
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setValueAtTime(0, ctx.currentTime); musicBus.gain.linearRampToValueAtTime(.9, ctx.currentTime + 2);
    timer = setInterval(schedule, 60);
  }
  function stopMusic() {
    if (!playing) return; playing = false;
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime); musicBus.gain.linearRampToValueAtTime(0, ctx.currentTime + .4);
    setTimeout(() => clearInterval(timer), 450);
  }
  const fx = {
    tap() { tone(880, ctx.currentTime, .09, 'triangle', .08); },
    remove() { tone(520, ctx.currentTime, .1, 'triangle', .07); },
    run() { [60, 64, 67, 72].forEach((n, i) => tone(mtof(n + 12), ctx.currentTime + i * .07, .22, 'square', .035)); },
    win() { [72, 76, 79, 84].forEach((n, i) => tone(mtof(n), ctx.currentTime + i * .1, .7, 'triangle', .09)); },
    fail() { tone(mtof(52), ctx.currentTime, .25, 'sawtooth', .04); tone(mtof(47), ctx.currentTime + .18, .35, 'sawtooth', .04); }
  };
  return {
    get on() { return on; },
    sfx(name) { if (on && ensure()) fx[name](); },
    start: startMusic,
    toggle() {
      on = !on; try { localStorage.setItem('rail-sound', on ? 'on' : 'off'); } catch (e) {}
      if (on) startMusic(); else stopMusic();
      return on;
    }
  };
})();
function renderSoundBtn() {
  const b = $('#soundBtn');
  b.setAttribute('aria-pressed', String(Sound.on));
  b.innerHTML = `${Sound.on ? I.note : I.mute}<span class="t">Musique</span>`;
  b.setAttribute('aria-label', Sound.on ? 'Couper la musique et les sons' : 'Activer la musique et les sons');
}
$('#soundBtn').onclick = () => { Sound.toggle(); renderSoundBtn(); };

/* ---------- Principes (carnet) ---------- */
const PRINCIPLES = {
  spec: {
    ref: 'Specification gaming · DeepMind 2020',
    title: 'La machine fait ce qu’on dit, pas ce qu’on veut dire',
    text: 'Un système peut satisfaire une consigne à la lettre sans atteindre le but voulu. C’est l’écart entre visée initiale et visée interprétée vu en cours (F. Levillain).',
    url: 'https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/'
  },
  tokens: {
    ref: 'Design tokens · W3C DTCG 2025.10',
    title: 'Un token sémantique, pas une valeur brute',
    text: 'Un token sémantique (color.alert.critical) dit à quoi sert une couleur. Une valeur brute (#E5482D) ne dit rien : elle ne s’adapte pas au thème sombre et chaque outil peut la réinterpréter. Le format standard des tokens est stable depuis octobre 2025.',
    url: 'https://www.designtokens.org/'
  },
  contrast: {
    ref: 'WCAG 2.2 · 1.4.3 (AA) · RGAA 4.1.2 · critère 3.2',
    title: 'Contraste du texte : au moins 4,5:1',
    text: 'Le texte de taille normale doit avoir un contraste d’au moins 4,5:1 avec son arrière-plan.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'
  },
  color: {
    ref: 'WCAG 2.2 · 1.4.1 (A) · RGAA 4.1.2 · critère 3.1',
    title: 'Jamais la couleur seule',
    text: 'Une information ne doit pas être transmise uniquement par la couleur. Pour une personne daltonienne, une alerte rouge sans icône ni texte explicite peut passer inaperçue.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html'
  },
  motion: {
    ref: 'WCAG 2.2 · 2.2.2 (A) · RGAA 4.1.2 · critère 13.8',
    title: 'Ce qui clignote doit pouvoir s’arrêter',
    text: 'Un contenu qui clignote ou bouge plus de 5 secondes doit pouvoir être mis en pause, arrêté ou masqué. Le clignotement attire l’œil, mais il peut aussi angoisser ou distraire.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html'
  },
  target: {
    ref: 'WCAG 2.2 · 2.5.8 (AA) · loi de Fitts',
    title: 'Une cible d’au moins 24 × 24 px',
    text: 'Les cibles tactiles doivent mesurer au moins 24 × 24 pixels CSS (sauf exceptions). La loi de Fitts le rappelle : plus une cible est petite, plus elle est lente et difficile à atteindre, surtout dans un bus qui roule.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html'
  },
  coherence: {
    ref: 'Design system · cohérence',
    title: 'Une règle, un seul résultat',
    text: 'Quand une règle est floue, chaque agent la complète à sa façon : neuf écrans, neuf alertes différentes. Une bonne règle produit le même résultat partout.',
    url: 'https://zeroheight.com/resources/state-of-ai-in-design-systems/'
  }
};
const RGAA_URL = 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/';

/* ---------- Tuiles ---------- */
const KIND_COLOR = { couleur: '#FBCFE8', effet: '#FDE68A', contenu: '#A7F3D0', texte: '#C4B5FD', bouton: '#BAE6FD' };
const TILES = [
  { id: 'TOKEN',    k: 'couleur', label: 'token color.alert.critical' },
  { id: 'HEX',      k: 'couleur', label: '#E5482D (valeur brute)' },
  { id: 'VIVE',     k: 'couleur', label: 'une couleur « bien vive »' },
  { id: 'VISIBLE',  k: 'effet',   label: '« plus visible »' },
  { id: 'BLINK',    k: 'effet',   label: 'clignoter pour attirer l’œil' },
  { id: 'ICON',     k: 'contenu', label: 'icône + texte, jamais la couleur seule' },
  { id: 'CONTRAST', k: 'texte',   label: 'contraste du texte ≥ 4,5:1' },
  { id: 'TARGET',   k: 'bouton',  label: 'bouton « Itinéraire » ≥ 24 × 24 px' }
];
const MAX_SLOTS = 4, COST = 25, START_BUDGET = 100;

const SCREENS = [
  { lab: 'Appli mobile', line: 'C3 · Perrache', ic: 'phone' },
  { lab: 'Écran de quai', line: 'Tram T2 · Perrache', ic: 'board' },
  { lab: 'Borne gare', line: 'Bus 31 · Part-Dieu', ic: 'board' },
  { lab: 'Site web', line: 'Ligne C3 · trajet', ic: 'web' },
  { lab: 'Widget', line: 'Mes trajets', ic: 'phone' },
  { lab: 'Notification', line: 'Ligne C3', ic: 'bell' },
  { lab: 'Écran du tram', line: 'Prochain arrêt', ic: 'tram' },
  { lab: 'Vision daltonienne', line: 'C3 · Perrache', gray: true, ic: 'eye' },
  { lab: 'Thème sombre', line: 'C3 · Perrache', dark: true, ic: 'moon' }
];
const TOKEN_VALUES = { light: { bg: '#B42318', fg: '#FFFFFF' }, dark: { bg: '#FF8A80', fg: '#1A1A1A' } };
const VIVID = ['#3D7BFF', '#FF2D55', '#FF9500', '#AF52DE', '#00B8D9', '#34C759'];

/* ---------- État ---------- */
const S = { slots: [], budget: START_BUDGET, runs: 0, carnet: new Set(), history: [], specs: null, checks: null, justRan: false };

/* ---------- Utilitaires couleur ---------- */
function lum(hex) {
  const c = hex.replace('#', '').match(/../g).map(h => parseInt(h, 16) / 255)
    .map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a, b) { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); }
function darken(hex, f) {
  return '#' + hex.replace('#', '').match(/../g).map(h => Math.round(parseInt(h, 16) * f).toString(16).padStart(2, '0')).join('').toUpperCase();
}
function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
const fmt = r => r.toFixed(2).replace('.', ',');

/* ---------- Interprétation par les agents ---------- */
function interpret(rule, i, rand) {
  const scr = SCREENS[i];
  const has = id => rule.includes(id);
  const spec = { bg: '#3D7BFF', fg: '#FFFFFF', icon: false, blink: false, btn: 20, fx: '' };
  if (has('TOKEN')) {
    Object.assign(spec, scr.dark ? TOKEN_VALUES.dark : TOKEN_VALUES.light);
  } else if (has('HEX')) {
    spec.bg = '#E5482D';
    if (has('CONTRAST')) { // chaque agent « corrige » à sa façon
      let f = 0.92 - rand() * 0.08;
      while (ratio(spec.bg, '#FFFFFF') < 4.5) { spec.bg = darken('#E5482D', f); f -= 0.03 + rand() * 0.05; }
    }
  } else {
    spec.bg = has('VIVE') ? VIVID[Math.floor(rand() * VIVID.length)] : (rand() < 0.6 ? '#3D7BFF' : VIVID[Math.floor(rand() * VIVID.length)]);
    if (has('CONTRAST')) {
      const w = ratio(spec.bg, '#FFFFFF'), k = ratio(spec.bg, '#161616');
      spec.fg = w >= k ? '#FFFFFF' : '#161616';
      if (Math.max(w, k) < 4.5) spec.bg = darken(spec.bg, 0.7);
    }
  }
  if (has('VISIBLE')) spec.fx = ['blink', 'huge', 'caps', 'glow'][Math.floor(rand() * 4)];
  if (has('BLINK') || spec.fx === 'blink') spec.blink = true;
  if (has('ICON')) spec.icon = true;
  if (has('TARGET')) spec.btn = 32;
  spec.ratio = ratio(spec.bg, spec.fg);
  return spec;
}

function audit(rule, specs) {
  const same = specs.every(s => s.bg === specs[0].bg && s.fx === specs[0].fx) ||
    (rule.includes('TOKEN') && specs.slice(0, 8).every(s => s.bg === specs[0].bg && s.fx === specs[0].fx));
  const minR = Math.min(...specs.map(s => s.ratio));
  const worst = specs.findIndex(s => s.ratio === minR);
  const blinkN = specs.filter(s => s.blink).length;
  const FXN = { blink: 'clignotement', glow: 'halo', huge: 'taille XXL', caps: 'majuscules' };
  const fx = new Set(specs.map(s => s.fx).filter(Boolean).map(f => FXN[f]));
  const colors = new Set(specs.map(s => s.bg)).size;
  return [
    { key: 'coherence', name: 'Cohérence entre les 9 écrans', ok: same,
      why: same ? 'Les neuf agents ont produit la même alerte.' :
        `Règle floue : ${colors} couleurs différentes${fx.size ? ' et des effets improvisés (' + [...fx].join(', ') + ')' : ''}. Chaque agent a complété la règle à sa façon.` },
    { key: 'tokens', name: 'Source de vérité : token sémantique', ok: rule.includes('TOKEN'),
      why: rule.includes('TOKEN') ? 'Le token porte le sens et s’adapte au thème sombre.' :
        rule.includes('HEX') ? 'Une valeur brute ne s’adapte pas au thème sombre et ne dit pas à quoi sert la couleur.' : 'Aucune couleur imposée : les agents en ont inventé une.' },
    { key: 'contrast', name: 'Contraste du texte ≥ 4,5:1', ok: minR >= 4.5,
      why: minR >= 4.5 ? `Contraste minimum mesuré : ${fmt(minR)}:1.` : `Écran « ${SCREENS[worst].lab} » : ${fmt(minR)}:1 seulement.` },
    { key: 'color', name: 'Information pas uniquement par la couleur', ok: specs.every(s => s.icon),
      why: specs.every(s => s.icon) ? 'Icône et texte explicite : l’alerte reste lisible en vision daltonienne.' : 'En vision daltonienne, l’alerte se confond avec le reste de l’écran.' },
    { key: 'motion', name: 'Pas de clignotement imposé', ok: blinkN === 0,
      why: blinkN === 0 ? 'Aucune animation qui ne peut pas s’arrêter.' : `${blinkN} écran(s) font clignoter l’alerte sans moyen de l’arrêter.` },
    { key: 'target', name: 'Bouton « Itinéraire » ≥ 24 × 24 px', ok: specs.every(s => s.btn >= 24),
      why: specs.every(s => s.btn >= 24) ? 'Cible de 32 px : facile à toucher, même dans un bus.' : 'Par défaut, les agents ont fait un bouton compact de 20 px.' }
  ];
}

/* ---------- Rendu ---------- */
function setHud(on) { $('#hud').hidden = !on; }
function updateBudget() {
  $('#budgetFill').style.width = (S.budget / START_BUDGET * 100) + '%';
  $('#budgetText').textContent = S.budget;
  $('#budgetBar').setAttribute('aria-valuenow', S.budget);
}
function unlock(keys) {
  let added = 0;
  keys.forEach(k => { if (!S.carnet.has(k)) { S.carnet.add(k); added++; } });
  $('#carnetCount').textContent = `(${S.carnet.size})`;
  if (added) toast(`${added} principe${added > 1 ? 's' : ''} ajouté${added > 1 ? 's' : ''} au carnet`);
}
function toast(t) {
  document.querySelectorAll('.toast').forEach(x => x.remove());
  const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; d.setAttribute('role', 'status');
  document.body.appendChild(d); setTimeout(() => d.remove(), 2600);
}

function renderDevice(scr, spec, i, state, reveal) {
  const cls = ['dev', scr.dark ? 'dark' : '', scr.gray ? 'gray' : '', state || '', reveal ? 'reveal' : ''].join(' ');
  const head = `<div class="lab">${SCREEN_ICON[scr.ic]}<span>${scr.lab}</span><span class="n">${String(i + 1).padStart(2, '0')}</span></div>`;
  const d = reveal ? ` style="--d:${i * 90}ms"` : '';
  if (!spec) return `<div class="${cls}"${d}>${head}<div class="placeholder">${botSvg(['#A7F3D0', '#FDE68A', '#FBCFE8'][i % 3])}<span>agent ${String(i + 1).padStart(2, '0')} attend la règle</span></div></div>`;
  const a = ['alert', spec.blink ? 'blink' : '', spec.fx && spec.fx !== 'blink' ? spec.fx : ''].join(' ');
  const label = spec.icon ? 'Retard : 8 min' : '8 min';
  return `<div class="${cls}"${d}>${head}
  <div class="scr"><div class="line">${scr.line}</div><div class="sub">Prochain passage</div>
  <div class="${a}" style="background:${spec.bg};color:${spec.fg}">${spec.icon ? I.alert : ''}<span>${label}</span>
  <span class="go" style="height:${spec.btn}px;font-size:${spec.btn > 24 ? '.72rem' : '.6rem'}">Itinéraire</span></div>
  <div class="sub">contraste ${fmt(spec.ratio)}:1 · bouton ${spec.btn} px</div></div></div>`;
}
const botSvg = c => `<svg viewBox="0 0 40 40" aria-hidden="true">${bot(0, 0, 1, c)}</svg>`;

function screenTitle() {
  setHud(false);
  app.innerHTML = `<section class="screen hero">
    <div>
      <div class="kicker">ICX3 · Designing for the Internet of Agents</div>
      <h1 class="title">Rail <span>2030</span></h1>
      <p class="lead">Vous êtes Harith, designer de design system. Une quarantaine d’agents fabriquent chaque jour les écrans de Ligne, la plateforme de mobilité de la métropole de Lyon. Ils lisent vos règles. À la lettre.</p>
      <div class="legend">
        <span class="chip"><span class="dot" style="background:var(--role-human)"></span>Jugement humain</span>
        <span class="chip"><span class="dot" style="background:var(--role-aug)"></span>Augmenté</span>
        <span class="chip"><span class="dot" style="background:var(--role-auto)"></span>Automatisé</span>
      </div>
      <button class="btn" id="go">${I.play}Commencer la journée</button>
      <p class="hint">Avec musique. Le bouton « Musique » en haut la coupe à tout moment. Niveau jouable : 08:30.</p>
    </div>
    <div class="illus">${heroScene()}</div>
  </section>`;
  $('#go').onclick = () => { Sound.start(); Sound.sfx('tap'); screenBrief(); };
}

function screenBrief() {
  window.scrollTo(0, 0); setHud(true); updateBudget(); $('#clock').textContent = '08:30';
  const demo = [0, 1, 2].map(i => renderDevice(SCREENS[i], { bg: '#3D7BFF', fg: '#FFFFFF', icon: false, blink: false, btn: 20, fx: '', ratio: ratio('#3D7BFF', '#FFFFFF') }, i, 'fail')).join('');
  app.innerHTML = `<section class="screen brief">
    <div>
      <div class="kicker">Mardi 14 mai 2030 · 08:30</div>
      <h2 class="h">Le bleu qui n’existait pas</h2>
      <div class="msg">${avatar('po')}<div><span class="who">Équipe Produit · Appli Ligne</span><span class="when">hier, 18:42</span>
        <div class="bubble">Tu peux rendre l’alerte de retard plus visible ? Les usagers la ratent.</div></div></div>
      <div class="agentlog" aria-label="Journal de l’agent"><svg viewBox="0 0 40 40" aria-hidden="true">${bot(0, 0, 1, '#FBCFE8')}</svg><div>
        &gt; agent-produit-07 : consigne reçue « plus visible »<br>
        &gt; aucune règle trouvée pour alert.critical<br>
        &gt; création d’une couleur : <span class="warn">#3D7BFF</span><br>
        &gt; propagation : <span class="warn">9 écrans mis à jour</span></div>
      </div>
      <p class="lead" style="margin-top:1rem">L’agent a fait exactement ce qu’on lui a dit. Pas ce qu’on voulait dire. Votre rôle : <b>écrire la règle du token <code>alert.critical</code></b> pour que les agents l’appliquent partout sans la réinterpréter.</p>
      <div class="card tint" style="margin-top:1rem">
        <div class="label" style="margin-bottom:.3rem">Comment jouer</div>
        Choisissez jusqu’à ${MAX_SLOTS} tuiles pour composer la règle, puis lancez les agents. Chaque lancement coûte ${COST} tokens sur un budget de ${START_BUDGET}. L’audit vous dit ce qui ne va pas, et pourquoi.
      </div>
      <div style="margin-top:1.4rem"><button class="btn" id="go">${avatarMini()}Écrire la règle</button></div>
    </div>
    <div><div class="label" style="margin-bottom:.5rem">Ce matin, sur trois des neuf écrans</div><div class="grid9" style="grid-template-columns:1fr">${demo}</div></div>
  </section>`;
  unlock(['spec']);
  $('#go').onclick = () => { Sound.sfx('tap'); screenLevel(); };
}
const avatarMini = () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';

function screenLevel() {
  const rule = S.slots, reveal = S.justRan && !REDUCED; S.justRan = false;
  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => {
    const id = rule[i]; const t = TILES.find(x => x.id === id);
    return t ? `<button class="slot filled" data-rm="${i}" aria-label="Retirer : ${t.label}">${t.label}</button>`
             : `<div class="slot">emplacement ${i + 1} · vide</div>`;
  }).join('');
  const tray = TILES.map(t => `<button class="tile ${rule.includes(t.id) ? 'used' : ''}" data-add="${t.id}" ${rule.includes(t.id) ? 'disabled' : ''}><span class="k"><i style="background:${KIND_COLOR[t.k]}"></i>${t.k}</span>${t.label}</button>`).join('');
  const failing = S.checks ? failingScreens() : new Set();
  const devices = SCREENS.map((scr, i) => renderDevice(scr, S.specs && S.specs[i], i, S.specs ? (failing.has(i) ? 'fail' : 'pass') : '', reveal)).join('');
  const okN = S.checks ? S.checks.filter(c => c.ok).length : 0;
  const checks = S.checks ? S.checks.map(c => `<div class="check ${c.ok ? 'ok' : 'ko'}"><div class="st">${c.ok ? I.check : I.x}<span class="sr">${c.ok ? 'conforme' : 'non conforme'}</span></div>
      <div><div class="nm">${c.name}</div><div class="ref">${PRINCIPLES[c.key].ref}</div><div class="why">${c.why}</div></div></div>`).join('')
    : `<p class="empty">${botSvg('#DDD6FE')}Lancez les agents pour voir l’audit.</p>`;
  const canRun = rule.length > 0 && S.budget >= COST;

  app.innerHTML = `<section class="screen">
    <div class="level-head">
      <div><div class="kicker">08:30 · Le bleu qui n’existait pas</div><h2 class="h" style="margin:0">Écrire une règle qu’aucun agent ne peut mal lire</h2></div>
      <div class="roles"><span class="role h">Jugement humain · vous écrivez la règle</span><span class="role a">Automatisé · 9 agents l’appliquent</span><span class="role g">Augmenté · l’audit vous éclaire</span></div>
    </div>
    <div class="level">
      <div>
        <div class="card request">${avatar('po')}<div><div class="label">Demande de l’équipe Produit</div><div class="q">« Rendre l’alerte de retard plus visible. »</div></div></div>
        <div class="rule"><div class="rule-title">Règle · <code>alert.critical</code></div><div class="slots">${slots}</div></div>
        <div class="tray-title">Tuiles disponibles</div>
        <div class="tray">${tray}</div>
        <div class="run"><button class="btn" id="run" ${canRun ? '' : 'disabled'}>${I.play}Lancer les 9 agents</button><span class="cost">coût : ${COST} tokens · lancements : ${S.runs}</span></div>
        ${S.history.length ? `<div class="history">Essais : ${S.history.map((h, i) => `#${i + 1} ${h}/6`).join(' · ')}</div>` : ''}
      </div>
      <div>
        <div class="grid9">${devices}</div>
        <div class="card audit ${reveal ? 'reveal' : ''}" aria-live="polite"><h3>Audit ${S.checks ? `<span class="score">${okN}/6</span>` : ''}</h3>${checks}</div>
      </div>
    </div>
  </section>`;

  app.querySelectorAll('[data-add]').forEach(b => b.onclick = () => {
    if (S.slots.length >= MAX_SLOTS) { Sound.sfx('fail'); toast(`La règle est pleine (${MAX_SLOTS} tuiles). Retirez-en une.`); return; }
    Sound.sfx('tap'); S.slots.push(b.dataset.add); screenLevel();
  });
  app.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { Sound.sfx('remove'); S.slots.splice(+b.dataset.rm, 1); screenLevel(); });
  $('#run').onclick = runAgents;
}

function failingScreens() {
  const f = new Set();
  S.specs.forEach((s, i) => {
    if (s.ratio < 4.5 || s.blink || s.btn < 24 || (!s.icon && SCREENS[i].gray)) f.add(i);
  });
  return f;
}

function runAgents() {
  if (S.budget < COST) return;
  Sound.sfx('run');
  S.budget -= COST; S.runs++; updateBudget();
  const rand = rng(S.runs * 17 + S.slots.length * 7);
  const rule = [...S.slots];
  S.specs = SCREENS.map((_, i) => interpret(rule, i, rand));
  S.checks = audit(rule, S.specs);
  const okN = S.checks.filter(c => c.ok).length;
  S.history.push(okN);
  S.justRan = true;
  screenLevel();
  setTimeout(() => { Sound.sfx(okN === 6 ? 'win' : 'fail'); unlock(S.checks.map(c => c.key)); }, REDUCED ? 0 : 1000);
  if (window.innerWidth < 900) $('.grid9').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  if (okN === 6) setTimeout(screenDebrief, 2400);
  else if (S.budget < COST) setTimeout(screenOut, 2600);
}

function screenDebrief() {
  window.scrollTo(0, 0);
  $('#clock').textContent = '08:52';
  const spent = START_BUDGET - S.budget;
  const verdict = S.runs === 1 ? 'Du premier coup. Les agents n’avaient rien à interpréter.' :
    S.runs <= 2 ? 'Rapide et frugal : la règle était presque juste dès le départ.' :
    'Vous y êtes arrivé, mais chaque essai a coûté des tokens. En 2030, réfléchir avant de lancer les agents est aussi une compétence.';
  app.innerHTML = `<section class="screen">
    <div class="kicker">08:52 · Règle validée</div>
    <h2 class="h">Neuf écrans, une seule alerte.</h2>
    <div class="debrief">
      <div class="card">
        <div class="illus" style="margin-bottom:1rem;box-shadow:none">${celebrate()}</div>
        <div class="score-big">${S.runs} lancement${S.runs > 1 ? 's' : ''} · ${spent} tokens</div>
        <p>${verdict}</p>
        <div class="split">
          <div class="row"><span class="badge" style="background:var(--role-human)">Jugement humain</span><div>Traduire « plus visible » en règles vérifiables : un token qui porte le sens, une icône et un texte, une cible assez grande. Aucun agent ne pouvait décider ça à votre place.</div></div>
          <div class="row"><span class="badge" style="background:var(--role-auto)">Automatisé</span><div>Appliquer la règle aux neuf écrans, y compris le thème sombre et l’écran du tram. Une fois la règle claire, la machine est parfaite pour ça.</div></div>
          <div class="row"><span class="badge" style="background:var(--role-aug)">Augmenté</span><div>L’audit mesure le contraste et repère les écarts. Il vous éclaire ; c’est vous qui décidez quoi corriger.</div></div>
        </div>
      </div>
      <div class="card tint">
        <div class="label" style="margin-bottom:.5rem">D’où vient ce niveau</div>
        <p class="src"><b>S08</b> Krakovna et al., DeepMind (2020) : le « specification gaming ».<br>
        <b>S13</b> zeroheight (2026) : 59 % des équipes voient des interfaces contourner leur design system.<br>
        <b>S15</b> W3C (2025) : le format standard des design tokens.<br>
        <b>S27</b> Cours 5, F. Levillain : visée initiale et visée interprétée.<br>
        Règles d’accessibilité : <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener">WCAG 2.2</a> et <a href="${RGAA_URL}" target="_blank" rel="noopener">RGAA 4.1.2</a>.</p>
        <p class="hint">Codes S## : voir le document d’accompagnement (board FigJam).</p>
        <div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1rem">
          <button class="btn" id="carnet2">${I.book}Ouvrir le carnet (${S.carnet.size})</button>
          <button class="btn ghost" id="again">${I.redo}Rejouer le niveau</button>
        </div>
        <p class="hint">Prochain moment : 09:30 · un nouveau composant (bientôt)</p>
      </div>
    </div>
  </section>`;
  $('#carnet2').onclick = openCarnet;
  $('#again').onclick = reset;
}

function screenOut() {
  window.scrollTo(0, 0);
  app.innerHTML = `<section class="screen hero">
    <div>
      <div class="kicker">Budget épuisé</div>
      <h2 class="h">Plus de tokens pour aujourd’hui.</h2>
      <p class="lead">Les agents ne travaillent plus. Les écrans gardent l’alerte de votre dernier essai. En 2030, l’IA a un coût : chaque lancement à l’aveugle se paie. Relisez l’audit, ouvrez le carnet, et recommencez en écrivant la règle avant de lancer.</p>
      <div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1rem"><button class="btn" id="again">${I.redo}Recommencer 08:30</button><button class="btn ghost" id="carnet2">${I.book}Ouvrir le carnet</button></div>
    </div>
    <div class="illus">${sleepyBot()}</div>
  </section>`;
  $('#again').onclick = reset; $('#carnet2').onclick = openCarnet;
}

function reset() { Sound.sfx('tap'); Object.assign(S, { slots: [], budget: START_BUDGET, runs: 0, history: [], specs: null, checks: null, justRan: false }); updateBudget(); screenLevel(); }

/* ---------- Carnet ---------- */
function openCarnet() {
  Sound.sfx('tap');
  const list = [...S.carnet].map(k => {
    const p = PRINCIPLES[k];
    const rg = /RGAA/.test(p.ref) ? ` · <a href="${RGAA_URL}" target="_blank" rel="noopener">critères RGAA</a>` : '';
    return `<div class="entry"><div class="ref">${p.ref}</div><h4>${p.title}</h4><div>${p.text}</div><div style="margin-top:.4rem"><a href="${p.url}" target="_blank" rel="noopener">Source officielle</a>${rg}</div></div>`;
  }).join('');
  $('#carnetList').innerHTML = list || '<p class="empty">Aucun principe pour l’instant. Jouez pour en découvrir.</p>';
  $('#carnet').showModal();
}
$('#carnetBtn').onclick = openCarnet;
$('#carnetClose').onclick = () => $('#carnet').close();

renderSoundBtn();
screenTitle();
