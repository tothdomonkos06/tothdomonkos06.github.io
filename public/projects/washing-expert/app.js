/* washing_expert – alkalmazáslogika (függőségmentes, file:// alól is fut) */
(function () {
  'use strict';

  const app = document.getElementById('app');
  const crumbs = document.getElementById('crumbs');
  const state = { color: 'colored', soil: 'normal' };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const findCat = (id) => CATEGORIES.find((c) => c.id === id);
  const findItem = (cat, id) => cat && cat.items.find((i) => i.id === id);

  /* ---------- Szabálymotor: alapadat + szín + szennyezettség ---------- */
  function recommend(item, color, soil) {
    const r = JSON.parse(JSON.stringify(item));
    r.tips = [...item.tips];
    r.prep = [...item.prep];
    const washable = r.wash.type !== 'no';

    if (!r.specialDetergent) r.detergent = { ...DETERGENT_BY_COLOR[color] };

    if (washable) {
      if (color === 'white' && item.whiteTemp) r.wash.temp = item.whiteTemp;
      if (color === 'dark' && !r.insideOut) {
        r.insideOut = true;
        r.prep.unshift('Fordítsd ki – a sötét szín így kevésbé fakul');
      }
      if (color === 'white' && r.bleach === 'none' && !r.specialDetergent) {
        r.tips.push('Fehér ruhánál is kerüld a fehérítőt ennél az anyagnál.');
      }
      if (color === 'colored' || color === 'dark') {
        r.tips.push('Színfogó kendő a dobban megfogja a kioldódó festéket.');
      }

      if (soil === 'heavy') {
        const max = item.maxTemp || r.wash.temp;
        if (r.wash.type === 'machine' && r.wash.temp < max) {
          r.wash.temp = Math.min(max, r.wash.temp + 10);
          r.soilNote = `Erős szennyeződés miatt ${r.wash.temp} °C-ra emeltük (ennél melegebben ne mosd).`;
        }
        r.prep.push('Kezeld elő a foltokat folttisztítóval 10–15 perccel mosás előtt');
        if (r.wash.type === 'machine') r.tips.push('Kapcsold be az előmosást, vagy áztasd be 30 percre.');
        r.dose = 'Emelt adag (a flakon „erősen szennyezett” jelölése szerint)';
      } else if (soil === 'light') {
        if (r.wash.type === 'machine') r.tips.push('Enyhén szennyezett ruhához elég a gyors (30 perces) program – energiát spórolsz.');
        r.dose = 'Csökkentett adag (kb. ⅔ – a túl sok mosószer lerakódik)';
      } else {
        r.dose = 'Normál adag a flakon szerint (vízkeménységtől függ)';
      }
    }
    return r;
  }

  /* ---------- Kezelési címke szimbólumok (ISO 3758 jellegű SVG) ---------- */
  const CROSS = '<path d="M6 6 L54 54 M54 6 L6 54" class="sym-cross"/>';
  const svg = (inner, label, h = 64) =>
    `<svg viewBox="0 0 60 ${h}" class="sym" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${inner}</svg>`;

  function washSym(w) {
    const tub = '<path d="M8 20 q5.5 -6 11 0 t11 0 t11 0 t11 0 L46 50 H14 Z" class="sym-line"/>';
    if (w.type === 'no') return svg(tub + CROSS, 'Nem mosható');
    const inside = w.type === 'hand'
      ? '<text x="30" y="43" class="sym-emoji">✋</text>'
      : `<text x="30" y="42" class="sym-text">${w.temp}</text>`;
    let lines = '';
    for (let i = 0; i < w.gentle; i++) lines += `<path d="M12 ${55 + i * 5} H48" class="sym-line"/>`;
    const label = w.type === 'hand' ? 'Kézi mosás, max. 30 °C' : `Gépi mosás ${w.temp} °C${w.gentle ? (w.gentle === 2 ? ', extra kímélő' : ', kímélő') : ''}`;
    return svg(tub + inside + lines, label);
  }
  function bleachSym(b) {
    const tri = '<path d="M30 8 L54 50 H6 Z" class="sym-line"/>';
    if (b === 'none') return svg(tri + CROSS, 'Fehérítés tilos');
    if (b === 'oxygen') return svg(tri + '<path d="M22 46 L32 24 M29 46 L39 24" class="sym-line"/>', 'Csak oxigénes (klórmentes) fehérítő');
    return svg(tri, 'Bármilyen fehérítő');
  }
  function tumbleSym(t) {
    const box = '<rect x="8" y="8" width="44" height="44" class="sym-line"/><circle cx="30" cy="30" r="15" class="sym-line"/>';
    if (t === 0) return svg(box + CROSS, 'Szárítógép tilos');
    const dots = t === 1 ? '<circle cx="30" cy="30" r="2.6" class="sym-dot"/>'
      : '<circle cx="25" cy="30" r="2.6" class="sym-dot"/><circle cx="35" cy="30" r="2.6" class="sym-dot"/>';
    return svg(box + dots, t === 1 ? 'Szárítógép alacsony hőfokon' : 'Szárítógép normál hőfokon');
  }
  function naturalSym(m) {
    const box = '<rect x="8" y="8" width="44" height="44" class="sym-line"/>';
    if (m === 'flat') return svg(box + '<path d="M16 30 H44" class="sym-line"/>', 'Fektetve szárítsd');
    if (m === 'hanger') return svg(box + '<path d="M22 16 V44 M30 16 V44 M38 16 V44" class="sym-line"/>', 'Vállfán / csepegtetve szárítsd');
    return svg(box + '<path d="M8 18 q22 14 44 0" class="sym-line"/>', 'Kötélen szárítsd');
  }
  function ironSym(level) {
    const shape = '<path d="M8 46 H52 L50 32 Q48 22 36 22 H20 Q14 30 8 46 Z M24 22 Q24 14 32 14 H46" class="sym-line"/>';
    if (level === 0) return svg(shape + CROSS, 'Vasalás tilos');
    const xs = { 1: [30], 2: [25, 35], 3: [21, 30, 39] }[level];
    const dots = xs.map((x) => `<circle cx="${x}" cy="36" r="2.4" class="sym-dot"/>`).join('');
    return svg(shape + dots, `Vasalás max. ${IRON_TEMPS[level]} °C`);
  }
  function proSym(p) {
    if (!p) return '';
    return svg(`<circle cx="30" cy="30" r="22" class="sym-line"/><text x="30" y="39" class="sym-text">${p}</text>`, 'Szakszerű (vegy)tisztítás lehetséges');
  }
  const IRON_TEMPS = { 1: 110, 2: 150, 3: 200 };

  /* ---------- Infografikák ---------- */
  function thermometer(w) {
    const max = 95, t = w.type === 'no' ? 0 : w.temp;
    const h = 150, fill = Math.round((t / max) * h);
    const col = t <= 30 ? 'var(--cold)' : t <= 40 ? 'var(--warm)' : 'var(--hot)';
    const marks = [30, 40, 60, 90].map((m) => {
      const y = 170 - Math.round((m / max) * h);
      return `<path d="M44 ${y} H52" class="thermo-mark"/><text x="58" y="${y + 4}" class="thermo-label">${m}°</text>`;
    }).join('');
    const big = w.type === 'no' ? '—' : (w.type === 'hand' ? `≤${t}°` : `${t}°C`);
    return `
      <figure class="info-card">
        <svg viewBox="0 0 90 210" class="thermo" role="img" aria-label="Mosási hőfok: ${esc(big)}">
          <rect x="28" y="16" width="14" height="158" rx="7" class="thermo-tube"/>
          <rect x="31" y="${170 - fill}" width="8" height="${fill + 4}" rx="4" fill="${col}"/>
          <circle cx="35" cy="186" r="14" fill="${w.type === 'no' ? 'var(--muted)' : col}"/>
          ${marks}
        </svg>
        <figcaption><strong class="big">${esc(big)}</strong><span>${w.type === 'hand' ? 'kézi mosás, langyos víz' : w.type === 'no' ? 'ne mosd vízben' : 'mosási hőfok'}</span></figcaption>
      </figure>`;
  }
  function spinGauge(spin) {
    const frac = Math.min(spin / 1400, 1);
    const angle = Math.PI * (1 - frac);
    const nx = 60 + 40 * Math.cos(angle), ny = 64 - 40 * Math.sin(angle);
    return `
      <figure class="info-card">
        <svg viewBox="0 0 120 80" class="gauge" role="img" aria-label="Centrifuga: ${spin} fordulat/perc">
          <path d="M12 64 A48 48 0 0 1 108 64" class="gauge-bg" pathLength="100"/>
          <path d="M12 64 A48 48 0 0 1 108 64" class="gauge-fg" pathLength="100" style="stroke-dasharray:${(frac * 100).toFixed(1)} 100"/>
          <line x1="60" y1="64" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" class="gauge-needle"/>
          <circle cx="60" cy="64" r="4" class="gauge-hub"/>
          <text x="12" y="78" class="gauge-label">0</text><text x="108" y="78" class="gauge-label" text-anchor="end">1400</text>
        </svg>
        <figcaption><strong class="big">${spin ? spin : 'Nincs'}</strong><span>${spin ? 'fordulat / perc centrifuga' : 'ne centrifugáld'}</span></figcaption>
      </figure>`;
  }
  function drum(load) {
    const pct = Math.round(load * 100);
    const y = 90 - 70 * load;
    const label = load >= 0.9 ? 'Egyedül, tele dob' : load >= 0.7 ? 'Kb. ¾-ig töltsd' : load >= 0.45 ? 'Félig töltsd' : load > 0 ? 'Csak ¼-ig, kevés ruha' : 'Nem gépbe való';
    return `
      <figure class="info-card">
        <svg viewBox="0 0 110 110" class="drum" role="img" aria-label="Dob töltöttsége: ${pct}%">
          <rect x="6" y="6" width="98" height="98" rx="16" class="drum-body"/>
          <clipPath id="drumclip"><circle cx="55" cy="55" r="35"/></clipPath>
          <circle cx="55" cy="55" r="35" class="drum-window"/>
          <rect x="15" y="${y.toFixed(1)}" width="80" height="80" clip-path="url(#drumclip)" class="drum-fill"/>
          <circle cx="55" cy="55" r="35" class="drum-ring"/>
          <circle cx="90" cy="16" r="3" class="drum-led"/>
        </svg>
        <figcaption><strong class="big">${pct}%</strong><span>${esc(label)}</span></figcaption>
      </figure>`;
  }
  function detergentIcon(kind) {
    if (kind === 'powder') return '<svg viewBox="0 0 48 48" class="det-ico" aria-hidden="true"><path d="M10 14 H38 V42 H10 Z" class="det-a"/><path d="M10 14 L16 6 H32 L38 14" class="det-b"/><circle cx="24" cy="28" r="6" class="det-c"/></svg>';
    if (kind === 'special') return '<svg viewBox="0 0 48 48" class="det-ico" aria-hidden="true"><rect x="12" y="10" width="24" height="32" rx="6" class="det-a"/><path d="M18 22 h12 M18 28 h12 M18 34 h8" class="det-line"/></svg>';
    return '<svg viewBox="0 0 48 48" class="det-ico" aria-hidden="true"><path d="M18 4 H30 V10 L34 14 V42 Q34 44 32 44 H16 Q14 44 14 42 V14 L18 10 Z" class="det-a"/><rect x="18" y="22" width="12" height="12" rx="2" class="det-c"/></svg>';
  }

  const DRY_TEXT = { line: 'Kötélen', flat: 'Fektetve (törölközőn)', hanger: 'Vállfán' };
  const TUMBLE_TEXT = { 0: 'Szárítógép: tilos', 1: 'Szárítógép: csak alacsony hőfok', 2: 'Szárítógép: mehet' };
  const IRON_TEXT = { 0: 'Ne vasald', 1: 'Alacsony (max. 110 °C, gőz nélkül)', 2: 'Közepes (max. 150 °C)', 3: 'Magas (max. 200 °C, gőzzel)' };

  /* ---------- Nézetek ---------- */
  function setCrumbs(cat, item) {
    const parts = ['<a href="#/">Ruhák</a>'];
    if (cat) parts.push(item ? `<a href="#/${cat.id}">${esc(cat.name)}</a>` : `<span aria-current="page">${esc(cat.name)}</span>`);
    if (item) parts.push(`<span aria-current="page">${esc(item.name)}</span>`);
    crumbs.innerHTML = parts.join('<span class="sep" aria-hidden="true">›</span>');
    const step = item ? 3 : cat ? 2 : 1;
    document.querySelectorAll('.stepper li').forEach((li, i) => {
      li.classList.toggle('active', i + 1 === step);
      li.classList.toggle('done', i + 1 < step);
    });
  }

  function viewHome() {
    setCrumbs();
    app.innerHTML = `
      <section class="hero">
        <h1>Mit szeretnél kimosni?</h1>
        <p>Válaszd ki a ruhát és az anyagát – megmondjuk a programot, a hőfokot, a mosószert és a szárítást.</p>
        <label class="search">
          <span class="sr-only">Keresés</span>
          <input id="q" type="search" placeholder="Keress rá… pl. farmer, selyem, törölköző" autocomplete="off">
        </label>
        <ul id="results" class="search-results" role="list"></ul>
      </section>
      <div class="grid">
        ${CATEGORIES.map((c) => `
          <a class="card cat" href="#/${c.id}">
            <span class="cat-ico" aria-hidden="true">${c.icon}</span>
            <span class="cat-name">${esc(c.name)}</span>
            <span class="cat-count">${c.items.length} anyag</span>
          </a>`).join('')}
      </div>`;
    const q = document.getElementById('q');
    const out = document.getElementById('results');
    q.addEventListener('input', () => {
      const term = q.value.trim().toLowerCase();
      if (!term) { out.innerHTML = ''; return; }
      const hits = [];
      CATEGORIES.forEach((c) => c.items.forEach((i) => {
        if ((i.name + ' ' + i.desc + ' ' + c.name).toLowerCase().includes(term)) hits.push({ c, i });
      }));
      out.innerHTML = hits.length
        ? hits.slice(0, 8).map(({ c, i }) => `<li><a href="#/${c.id}/${i.id}"><span aria-hidden="true">${c.icon}</span> ${esc(i.name)} <small>${esc(c.name)}</small></a></li>`).join('')
        : '<li class="empty">Nincs találat – válassz a kategóriák közül.</li>';
    });
  }

  function viewCategory(cat) {
    setCrumbs(cat);
    app.innerHTML = `
      <section class="hero small">
        <h1><span aria-hidden="true">${cat.icon}</span> ${esc(cat.name)}</h1>
        <p>Milyen anyagból van?</p>
      </section>
      <div class="grid">
        ${cat.items.map((i) => `
          <a class="card item" href="#/${cat.id}/${i.id}">
            <span class="item-name">${esc(i.name)}</span>
            <span class="item-desc">${esc(i.desc)}</span>
            <span class="item-meta">
              <span class="pill ${i.wash.type}">${i.wash.type === 'no' ? 'Nem mosható' : i.wash.type === 'hand' ? 'Kézi mosás' : i.wash.temp + ' °C'}</span>
            </span>
          </a>`).join('')}
      </div>
      <p class="back"><a href="#/">← Vissza a ruhákhoz</a></p>`;
  }

  function segmented(name, options, current) {
    return `<div class="seg" role="radiogroup" aria-label="${name === 'color' ? 'Szín' : 'Szennyezettség'}">
      ${options.map((o) => `
        <button type="button" role="radio" aria-checked="${o.id === current}" data-${name}="${o.id}" class="${o.id === current ? 'on' : ''}">
          ${o.swatch ? `<span class="swatch" style="background:${o.swatch}" aria-hidden="true"></span>` : ''}${esc(o.label)}
        </button>`).join('')}
    </div>`;
  }

  function viewItem(cat, item) {
    setCrumbs(cat, item);
    const r = recommend(item, state.color, state.soil);
    const washable = r.wash.type !== 'no';
    const headline = washable
      ? `${r.wash.type === 'hand' ? 'Kézzel, max. ' + r.wash.temp + ' °C-on' : r.wash.temp + ' °C-on'}${r.insideOut ? ', kifordítva' : ''} mosd`
      : 'Ne mosd vízben – szakszerű tisztítás';

    app.innerHTML = `
      <section class="result-head">
        <div>
          <p class="eyebrow">${cat.icon} ${esc(cat.name)} · ${esc(item.desc)}</p>
          <h1>${esc(item.name)}</h1>
          <p class="headline">${esc(headline)}</p>
          ${r.soilNote ? `<p class="note">ℹ️ ${esc(r.soilNote)}</p>` : ''}
        </div>
        <div class="filters">
          <div><span class="filter-label">Szín</span>${segmented('color', COLOR_OPTIONS, state.color)}</div>
          ${washable ? `<div><span class="filter-label">Szennyezettség</span>${segmented('soil', SOIL_OPTIONS, state.soil)}</div>` : ''}
        </div>
      </section>

      <section class="program" aria-label="Ajánlott program">
        <div class="program-main">
          <span class="program-label">Ajánlott program</span>
          <strong class="program-name">${esc(r.program)}</strong>
        </div>
        <div class="badges">
          ${badge(r.insideOut, 'Kifordítva', 'Színén')}
          ${badge(r.softener, 'Öblítő mehet', 'Öblítő nélkül')}
          ${washable ? badge(r.bleach !== 'none', r.bleach === 'oxygen' ? 'Csak oxigénes fehérítő' : 'Fehérítő mehet', 'Fehérítő nélkül') : ''}
        </div>
      </section>

      <section class="infos" aria-label="Infografikák">
        ${thermometer(r.wash)}
        ${spinGauge(r.spin)}
        ${drum(r.load)}
        <figure class="info-card det">
          ${detergentIcon(r.detergent.icon)}
          <figcaption>
            <strong>${esc(r.detergent.name)}</strong>
            <span>${esc(r.detergent.note)}</span>
            ${r.dose ? `<span class="dose">Adagolás: ${esc(r.dose)}</span>` : ''}
          </figcaption>
        </figure>
      </section>

      <section class="panel">
        <h2>Kezelési címke</h2>
        <div class="symbols">
          ${symbolCell(washSym(r.wash), washable ? (r.wash.type === 'hand' ? 'Kézi mosás' : `${r.wash.temp} °C`) : 'Nem mosható')}
          ${symbolCell(bleachSym(r.bleach), r.bleach === 'none' ? 'Nincs fehérítő' : r.bleach === 'oxygen' ? 'Csak oxigénes' : 'Fehéríthető')}
          ${symbolCell(tumbleSym(r.dry.tumble), TUMBLE_TEXT[r.dry.tumble].replace('Szárítógép: ', 'Szárítógép – '))}
          ${symbolCell(naturalSym(r.dry.method), DRY_TEXT[r.dry.method])}
          ${symbolCell(ironSym(r.iron), r.iron ? `Max. ${IRON_TEMPS[r.iron]} °C` : 'Ne vasald')}
          ${r.pro ? symbolCell(proSym(r.pro), 'Vegytisztítható') : ''}
        </div>
      </section>

      <section class="panel">
        <h2>Lépésről lépésre</h2>
        <ol class="timeline">
          <li><span class="t-ico" aria-hidden="true">🧺</span><div><h3>Előkészítés</h3><ul>${r.prep.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div></li>
          <li><span class="t-ico" aria-hidden="true">🫧</span><div><h3>Mosás</h3><ul>
            ${washable
              ? `<li>${esc(r.program)} program, ${r.wash.type === 'hand' ? 'langyos (max. ' + r.wash.temp + ' °C) víz' : r.wash.temp + ' °C'}</li>
                 <li>Centrifuga: ${r.spin ? r.spin + ' ford./perc' : 'nincs – nyomd ki törölközőben'}</li>
                 <li>${esc(r.detergent.name)}${r.softener ? ', öblítővel' : ', öblítő nélkül'}</li>`
              : `<li>${esc(r.program)}</li><li>${esc(r.detergent.name)}</li>`}
          </ul></div></li>
          <li><span class="t-ico" aria-hidden="true">☀️</span><div><h3>Szárítás</h3><ul><li>${DRY_TEXT[r.dry.method]}</li><li>${TUMBLE_TEXT[r.dry.tumble]}</li></ul></div></li>
          <li><span class="t-ico" aria-hidden="true">♨️</span><div><h3>Vasalás</h3><ul><li>${IRON_TEXT[r.iron]}</li></ul></div></li>
        </ol>
      </section>

      <div class="two-col">
        <section class="panel good"><h2>💡 Hasznos tippek</h2><ul>${r.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>
        <section class="panel bad"><h2>⛔ Kerüld</h2><ul>${r.avoid.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>
      </div>

      <p class="back"><a href="#/${cat.id}">← Másik anyag</a> · <a href="#/">Másik ruha</a></p>`;

    app.querySelectorAll('[data-color]').forEach((b) => b.addEventListener('click', () => { state.color = b.dataset.color; rerender(b, 'color'); }));
    app.querySelectorAll('[data-soil]').forEach((b) => b.addEventListener('click', () => { state.soil = b.dataset.soil; rerender(b, 'soil'); }));

    function rerender(btn, key) {
      const scroll = window.scrollY;
      viewItem(cat, item);
      window.scrollTo(0, scroll);
      const again = app.querySelector(`[data-${key}="${btn.dataset[key]}"]`);
      if (again) again.focus();
    }
  }

  const badge = (on, yes, no) => `<span class="badge ${on ? 'yes' : 'no'}">${on ? '✓' : '✕'} ${esc(on ? yes : no)}</span>`;
  const symbolCell = (sym, label) => `<div class="symbol">${sym}<span>${esc(label)}</span></div>`;

  /* ---------- Router ---------- */
  function route() {
    const [, catId, itemId] = (location.hash || '#/').split('/');
    const cat = findCat(catId);
    const item = findItem(cat, itemId);
    if (item) viewItem(cat, item);
    else if (cat) viewCategory(cat);
    else viewHome();
    app.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  route();
})();
