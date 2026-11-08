/* Rail · Le designer en 2030 — prototype, niveau 08:30
   Mécanique : le joueur écrit la règle du token alert.critical avec des tuiles.
   Neuf agents l'appliquent à neuf écrans ; l'audit vérifie la règle avec de vrais critères
   (design tokens, WCAG 2.2, RGAA 4.1.2). Les tuiles vagues sont interprétées différemment par chaque agent. */

const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');

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
    text: 'Un contenu qui clignote ou bouge plus de 5 secondes doit pouvoir être mis en pause, arrêté ou masqué. Le clignotement attire l’œil… et peut aussi angoisser ou distraire.',
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
  { lab: 'Appli mobile', line: 'C3 · Perrache' },
  { lab: 'Écran de quai', line: 'Tram T2 · Perrache' },
  { lab: 'Borne gare', line: 'Bus 31 · Part-Dieu' },
  { lab: 'Site web', line: 'Ligne C3 · trajet' },
  { lab: 'Widget', line: 'Mes trajets' },
  { lab: 'Notification', line: 'Ligne C3' },
  { lab: 'Écran dans le tram', line: 'Prochain arrêt' },
  { lab: 'Vision daltonienne', line: 'C3 · Perrache', gray: true },
  { lab: 'Thème sombre', line: 'C3 · Perrache', dark: true }
];
const TOKEN_VALUES = { light: { bg: '#B42318', fg: '#FFFFFF' }, dark: { bg: '#FF8A80', fg: '#1A1A1A' } };
const VIVID = ['#3D7BFF', '#FF2D55', '#FF9500', '#AF52DE', '#00B8D9', '#34C759'];

/* ---------- État ---------- */
const S = { slots: [], budget: START_BUDGET, runs: 0, carnet: new Set(), history: [], specs: null, checks: null, won: false };

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
}
function unlock(keys) {
  let added = 0;
  keys.forEach(k => { if (!S.carnet.has(k)) { S.carnet.add(k); added++; } });
  $('#carnetCount').textContent = `(${S.carnet.size})`;
  if (added) toast(`${added} principe${added > 1 ? 's' : ''} ajouté${added > 1 ? 's' : ''} au carnet`);
}
function toast(t) {
  const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; d.setAttribute('role', 'status');
  document.body.appendChild(d); setTimeout(() => d.remove(), 2600);
}

function renderDevice(scr, spec, i, failing) {
  const cls = ['dev', scr.dark ? 'dark' : '', scr.gray ? 'gray' : '', failing ? 'fail' : ''].join(' ');
  if (!spec) return `<div class="${cls}"><div class="lab"><span>${scr.lab}</span><span>${String(i + 1).padStart(2, '0')}</span></div><div class="placeholder">en attente de la règle</div></div>`;
  const a = ['alert', spec.blink ? 'blink' : '', spec.fx && spec.fx !== 'blink' ? spec.fx : ''].join(' ');
  const icon = spec.icon ? '<span class="ic" aria-hidden="true">⚠</span>' : '';
  const label = spec.icon ? 'Retard : 8 min' : '8 min';
  return `<div class="${cls}"><div class="lab"><span>${scr.lab}</span><span>${String(i + 1).padStart(2, '0')}</span></div>
  <div class="scr"><div class="line">${scr.line}</div><div class="sub">Prochain passage</div>
  <div class="${a}" style="background:${spec.bg};color:${spec.fg}">${icon}<span>${label}</span>
  <span class="go" style="height:${spec.btn}px;font-size:${spec.btn > 24 ? '.72rem' : '.6rem'}">Itinéraire</span></div>
  <div class="sub">contraste ${fmt(spec.ratio)}:1 · bouton ${spec.btn} px</div></div></div>`;
}

function screenTitle() {
  setHud(false);
  app.innerHTML = `<section class="screen hero">
    <div class="kicker">ICX3 · Designing for the Internet of Agents · prototype</div>
    <h1 class="title">Rail<br><em>2030</em></h1>
    <p class="lead">Vous êtes Harith, designer de design system. Une quarantaine d’agents fabriquent chaque jour les écrans de Ligne, la plateforme de mobilité de la métropole de Lyon. Ils lisent vos règles. À la lettre.</p>
    <div class="legend">
      <span class="chip"><span class="dot" style="background:var(--hum)"></span>Jugement humain</span>
      <span class="chip"><span class="dot" style="background:var(--aug)"></span>Augmenté</span>
      <span class="chip"><span class="dot" style="background:var(--auto)"></span>Automatisé</span>
    </div>
    <div><button class="btn" id="go">Commencer la journée</button></div>
    <p class="mono" style="color:var(--muted)">Niveau jouable : 08:30 · Les autres moments de la journée arrivent.</p>
  </section>`;
  $('#go').onclick = screenBrief;
}

function screenBrief() {
  setHud(true); updateBudget(); $('#clock').textContent = '08:30';
  const demo = [0, 1, 2].map(i => renderDevice(SCREENS[i], { bg: '#3D7BFF', fg: '#FFFFFF', icon: false, blink: false, btn: 20, fx: '', ratio: ratio('#3D7BFF', '#FFFFFF') }, i, true)).join('');
  app.innerHTML = `<section class="screen brief">
    <div>
      <div class="kicker">Mardi 14 mai 2030 · 08:30</div>
      <h2 class="h">Le bleu qui n’existait pas</h2>
      <div class="msg"><div class="avatar">PO</div><div><span class="who">Équipe Produit · Appli Ligne</span><span class="when">hier, 18:42</span>
        <div class="bubble">Tu peux rendre l’alerte de retard plus visible ? Les usagers la ratent.</div></div></div>
      <div class="agentlog" aria-label="Journal de l’agent">
        &gt; agent-produit-07 : consigne reçue « plus visible »<br>
        &gt; aucune règle trouvée pour alert.critical<br>
        &gt; création d’une couleur : <span class="warn">#3D7BFF</span><br>
        &gt; propagation : <span class="warn">9 écrans mis à jour</span> ✓
      </div>
      <p class="lead" style="margin-top:1rem">L’agent a fait exactement ce qu’on lui a dit. Pas ce qu’on voulait dire. Votre rôle : <b>écrire la règle du token <code>alert.critical</code></b> pour que les agents l’appliquent partout sans la réinterpréter.</p>
      <div class="card tom" style="margin-top:1rem">
        <div class="mono" style="margin-bottom:.4rem">Comment jouer</div>
        Choisissez jusqu’à ${MAX_SLOTS} tuiles pour composer la règle, puis lancez les agents. Chaque lancement coûte ${COST} tokens sur un budget de ${START_BUDGET}. L’audit vous dit ce qui ne va pas, et pourquoi.
      </div>
      <div style="margin-top:1.4rem"><button class="btn" id="go">Écrire la règle</button></div>
    </div>
    <div><div class="mono" style="margin-bottom:.5rem">Ce matin, sur trois des neuf écrans</div><div class="grid9" style="grid-template-columns:1fr">${demo}</div></div>
  </section>`;
  unlock(['spec']);
  $('#go').onclick = screenLevel;
}

function screenLevel() {
  const rule = S.slots;
  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => {
    const id = rule[i]; const t = TILES.find(x => x.id === id);
    return t ? `<button class="slot filled" data-rm="${i}" aria-label="Retirer : ${t.label}">${t.label}</button>`
             : `<div class="slot">emplacement ${i + 1} · vide</div>`;
  }).join('');
  const tray = TILES.map(t => `<button class="tile ${rule.includes(t.id) ? 'used' : ''}" data-add="${t.id}" ${rule.includes(t.id) ? 'disabled' : ''}><span class="k">${t.k}</span>${t.label}</button>`).join('');
  const failing = S.checks ? failingScreens() : new Set();
  const devices = SCREENS.map((scr, i) => renderDevice(scr, S.specs && S.specs[i], i, failing.has(i))).join('');
  const checks = S.checks ? S.checks.map(c => `<div class="check ${c.ok ? 'ok' : 'ko'}"><div class="st" aria-hidden="true">${c.ok ? '✓' : '✕'}</div>
      <div><div class="nm">${c.name}</div><div class="ref">${PRINCIPLES[c.key].ref}</div><div class="why">${c.why}</div></div></div>`).join('') : '<p class="empty">Lancez les agents pour voir l’audit.</p>';
  const canRun = rule.length > 0 && S.budget >= COST;

  app.innerHTML = `<section class="screen">
    <div class="level-head">
      <div><div class="kicker">08:30 · Le bleu qui n’existait pas</div><h2 class="h" style="margin:0">Écrire une règle qu’aucun agent ne peut mal lire</h2></div>
      <div class="roles"><span class="role h">Jugement humain · vous écrivez la règle</span><span class="role a">Automatisé · 9 agents l’appliquent</span><span class="role g">Augmenté · l’audit vous éclaire</span></div>
    </div>
    <div class="level">
      <div>
        <div class="card request"><div class="mono">Demande de l’équipe Produit</div><div class="q">« Rendre l’alerte de retard plus visible. »</div></div>
        <div class="rule"><div class="rule-title">Règle · <code>alert.critical</code></div><div class="slots">${slots}</div></div>
        <div class="tray-title">Tuiles disponibles</div>
        <div class="tray">${tray}</div>
        <div class="run"><button class="btn" id="run" ${canRun ? '' : 'disabled'}>Lancer les 9 agents</button><span class="cost">coût : ${COST} tokens · lancements : ${S.runs}</span></div>
        ${S.history.length ? `<div class="history">Essais : ${S.history.map((h, i) => `#${i + 1} ${h}/6`).join(' · ')}</div>` : ''}
      </div>
      <div>
        <div class="grid9">${devices}</div>
        <div class="card audit"><h3>Audit</h3>${checks}</div>
      </div>
    </div>
  </section>`;

  app.querySelectorAll('[data-add]').forEach(b => b.onclick = () => {
    if (S.slots.length >= MAX_SLOTS) { toast(`La règle est pleine (${MAX_SLOTS} tuiles). Retirez-en une.`); return; }
    S.slots.push(b.dataset.add); screenLevel();
  });
  app.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { S.slots.splice(+b.dataset.rm, 1); screenLevel(); });
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
  S.budget -= COST; S.runs++; updateBudget();
  const rand = rng(S.runs * 17 + S.slots.length * 7);
  const rule = [...S.slots];
  S.specs = SCREENS.map((_, i) => interpret(rule, i, rand));
  S.checks = audit(rule, S.specs);
  const okN = S.checks.filter(c => c.ok).length;
  S.history.push(okN);
  unlock(S.checks.map(c => c.key));
  screenLevel();
  if (window.innerWidth < 900) $('.grid9').scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (okN === 6) setTimeout(screenDebrief, 1400);
  else if (S.budget < COST) setTimeout(screenOut, 1600);
}

function screenDebrief() {
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
        <div class="score">${S.runs} lancement${S.runs > 1 ? 's' : ''} · ${spent} tokens</div>
        <p>${verdict}</p>
        <div class="split">
          <div class="row"><span class="badge" style="background:var(--hum)">Jugement humain</span><div>Traduire « plus visible » en règles vérifiables : un token qui porte le sens, une icône et un texte, une cible assez grande. Aucun agent ne pouvait décider ça à votre place.</div></div>
          <div class="row"><span class="badge" style="background:var(--auto)">Automatisé</span><div>Appliquer la règle aux neuf écrans, y compris le thème sombre et l’écran du tram. Une fois la règle claire, la machine est parfaite pour ça.</div></div>
          <div class="row"><span class="badge" style="background:var(--aug)">Augmenté</span><div>L’audit mesure le contraste et repère les écarts. Il vous éclaire ; c’est vous qui décidez quoi corriger.</div></div>
        </div>
      </div>
      <div class="card tom">
        <div class="mono" style="margin-bottom:.5rem">D’où vient ce niveau</div>
        <p class="src"><b>S08</b> Krakovna et al., DeepMind (2020) : le « specification gaming ».<br>
        <b>S13</b> zeroheight (2026) : 59 % des équipes voient des interfaces contourner leur design system.<br>
        <b>S15</b> W3C (2025) : le format standard des design tokens.<br>
        <b>S27</b> Cours 5, F. Levillain : visée initiale et visée interprétée.<br>
        Règles d’accessibilité : <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener">WCAG 2.2</a> et <a href="${RGAA_URL}" target="_blank" rel="noopener">RGAA 4.1.2</a>.</p>
        <p class="mono" style="color:var(--muted)">Codes S## : voir le document d’accompagnement (board FigJam).</p>
        <div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1rem">
          <button class="btn" id="carnet2">Ouvrir le carnet (${S.carnet.size})</button>
          <button class="btn ghost" id="again">Rejouer le niveau</button>
        </div>
        <p class="mono" style="margin-top:1rem;color:var(--muted)">Prochain moment : 09:30 · un nouveau composant (bientôt)</p>
      </div>
    </div>
  </section>`;
  $('#carnet2').onclick = openCarnet;
  $('#again').onclick = reset;
}

function screenOut() {
  app.innerHTML = `<section class="screen hero">
    <div class="kicker">Budget épuisé</div>
    <h2 class="h">Plus de tokens pour aujourd’hui.</h2>
    <p class="lead">Les agents ne travaillent plus. Les écrans gardent l’alerte de votre dernier essai. En 2030, l’IA a un coût : chaque lancement à l’aveugle se paie. Relisez l’audit, ouvrez le carnet, et recommencez en écrivant la règle avant de lancer.</p>
    <div style="display:flex;gap:.8rem;flex-wrap:wrap"><button class="btn" id="again">Recommencer 08:30</button><button class="btn ghost" id="carnet2">Ouvrir le carnet</button></div>
  </section>`;
  $('#again').onclick = reset; $('#carnet2').onclick = openCarnet;
}

function reset() { Object.assign(S, { slots: [], budget: START_BUDGET, runs: 0, history: [], specs: null, checks: null }); updateBudget(); screenLevel(); }

/* ---------- Carnet ---------- */
function openCarnet() {
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

screenTitle();
