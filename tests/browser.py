#!/usr/bin/env python3
"""Chromium-Tests mit lokalen Home-Assistant-Attrappen; keine realen Geräteaufrufe.

  python tests/browser.py             # Prüfungen
  python tests/browser.py --preview   # zusätzlich Vorschaubilder nach tests/out/

Benötigt: pip install -r requirements-dev.txt  und  playwright install chromium
(oder PLAYWRIGHT_CHROMIUM_EXECUTABLE auf einen vorhandenen Chromium/Chrome setzen).
"""
import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

PAGE = """<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:14px;background:#e9edf1;font-family:Roboto,Inter,sans-serif;font-size:14px;
--primary-text-color:#141414;--secondary-text-color:#6b6f76;--primary-color:#009ac7;--success-color:#43a047;
--warning-color:#ff9800;--error-color:#e53935;--card-background-color:#fff}
</style><div id="w"></div><script>
window.__errors = [];
window.addEventListener('error', (e) => window.__errors.push(String(e.message || e)));
window.addEventListener('unhandledrejection', (e) => window.__errors.push('rejection: ' + e.reason));
customElements.define('ha-card',class extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'}).innerHTML=
  '<style>:host{display:block;background:#fff;border-radius:16px;border:1px solid #dfe3e8;box-sizing:border-box}</style><slot></slot>'}});
customElements.define('ha-icon',class extends HTMLElement{connectedCallback(){(this.shadowRoot||this.attachShadow({mode:'open'})).innerHTML=
  '<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}i{flex:1;border-radius:30%;background:currentColor;opacity:.55}</style><i></i>'}});
window.baseStates = () => {
  const st = (state, unit) => ({state, attributes: unit ? {unit_of_measurement: unit} : {}});
  return {
    'sensor.system_monitor_processor_use': st('12', '%'), 'sensor.system_monitor_processor_temperature': st('47.5', '°C'),
    'binary_sensor.rpi_power_status': st('off'),
    'sensor.system_monitor_memory_use_percent': st('32', '%'), 'sensor.system_monitor_memory_use': st('2.56', 'GiB'), 'sensor.system_monitor_memory_free': st('5.44', 'GiB'),
    'sensor.system_monitor_disk_use_percent': st('36', '%'), 'sensor.system_monitor_disk_use': st('46.08', 'GiB'), 'sensor.system_monitor_disk_free': st('81.92', 'GiB'),
    'sensor.system_monitor_last_boot': st('12. Oktober 2026 um 08:15'),
  };
};
window.fixture = ({width = 350, config = {}, language = 'de', states = window.baseStates()} = {}) => {
  const w = document.getElementById('w');
  w.replaceChildren();
  w.style.width = width + 'px';
  const card = document.createElement('system-monitor'), events = [];
  card.addEventListener('hass-more-info', (e) => events.push(e.detail.entityId));
  const mk = (s) => ({states: s, language, locale: {language}});
  card.setConfig(config);
  w.appendChild(card);
  card.hass = mk(states);
  return {card, events, set: (s) => { card.hass = mk(s); }};
};
</script>"""

TEST_JS = r"""
async () => {
  const results = [], check = (name, pass) => results.push({name, pass: !!pass});
  const attack = '"><img id="injected" src=x onerror="window.__injected=1"><script>window.__injected=1<\/script>&';
  const turn = (ms = 0) => new Promise((r) => setTimeout(r, ms));
  const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const st = (state, unit) => ({state, attributes: unit ? {unit_of_measurement: unit} : {}});
  const {fixture, baseStates} = window;
  const q = (card, sel) => card.shadowRoot.querySelector(sel);
  const text = (card, sel) => q(card, sel)?.textContent.replace(/\s+/g, ' ').trim();
  const part = (card, key) => q(card, `[data-part="${key}"]`);
  const clean = (root) => !root.querySelector('#injected, script') && !window.__injected &&
    ![...root.querySelectorAll('*')].some((el) => [...el.attributes].some((a) => /^on/i.test(a.name)));

  // ---- Aufbau und Inhalt ----
  {
    const {card, events} = fixture();
    await frames();
    check('Titel, drei Kacheln, zwei Balkenzeilen und Startzeile vorhanden',
      text(card, 'h1') === 'System Monitor' && card.shadowRoot.querySelectorAll('.tile').length === 3 &&
      card.shadowRoot.querySelectorAll('.row').length === 2 && !!part(card, 'boot'));
    check('Zahl und Einheit getrennt', text(card, '[data-part="cpu"] [data-k="v"]') === '12' && text(card, '[data-part="cpu"] [data-k="u"]') === '%');
    check('Balkenbreite folgt dem Prozentwert', q(card, '[data-part="mem"] .bar u').style.width === '32%' && q(card, '[data-part="disk"] .bar u').style.width === '36%');
    check('Belegt/Frei und Startzeit angezeigt', text(card, '[data-part="mem"] [data-k="used"]') === 'Belegt 2.56 GiB' &&
      text(card, '[data-part="disk"] [data-k="free"]') === 'Frei 81.92 GiB' && text(card, '[data-part="boot"] [data-k="v"]') === '12. Oktober 2026 um 08:15');
    check('Netzteil in Ordnung: grün, „OK"', part(card, 'power').classList.contains('tone-success') && text(card, '[data-part="power"] [data-k="v"]') === 'OK');
    part(card, 'cpu').click();
    q(card, '[data-part="mem"] [data-k="used"]').click();
    q(card, '[data-part="mem"] .bar').click();
    part(card, 'boot').click();
    check('Klick öffnet die jeweils passende Entität (Belegt hat eine eigene)',
      events.join() === ['sensor.system_monitor_processor_use', 'sensor.system_monitor_memory_use', 'sensor.system_monitor_memory_use_percent', 'sensor.system_monitor_last_boot'].join());
    check('Kein Blur auf der Card', ![...card.shadowRoot.querySelectorAll('*')].some((el) => {
      const cs = getComputedStyle(el); return (cs.backdropFilter && cs.backdropFilter !== 'none') || /blur/.test(cs.filter);
    }));
  }

  // ---- Einmaliger Aufbau: Werte tauschen, Elemente bleiben ----
  {
    const {card, set} = fixture();
    const haCard = q(card, 'ha-card'), img = q(card, 'img'), cpu = part(card, 'cpu'), bar = q(card, '[data-part="mem"] .bar u'), icon = q(card, '[data-part="cpu"] ha-icon');
    cpu.focus();
    const s = baseStates();
    s['sensor.system_monitor_processor_use'] = st('91', '%');
    s['sensor.system_monitor_memory_use_percent'] = st('74', '%');
    s['binary_sensor.rpi_power_status'] = st('on');
    set(s);
    check('Wertänderung erscheint und färbt nach Schwellwert', text(card, '[data-part="cpu"] [data-k="v"]') === '91' && cpu.classList.contains('tone-error') && part(card, 'mem').classList.contains('tone-warning'));
    check('Unterspannung: rot, Warnung, anderes Symbol', part(card, 'power').classList.contains('tone-error') && text(card, '[data-part="power"] [data-k="v"]') === 'Warnung' &&
      text(card, '[data-part="power"] [data-k="l"]') === 'Spannung' && q(card, '[data-part="power"] ha-icon').getAttribute('icon') === 'mdi:flash-alert');
    check('Kein Neuaufbau: Card, Bild, Schaltflächen, Symbole und Balken bleiben dieselben Elemente',
      q(card, 'ha-card') === haCard && q(card, 'img') === img && part(card, 'cpu') === cpu && q(card, '[data-part="mem"] .bar u') === bar && q(card, '[data-part="cpu"] ha-icon') === icon);
    check('Balken wird am bestehenden Element gesetzt (kann gleiten)', bar.style.width === '74%' && /width/.test(getComputedStyle(bar).transitionProperty));
    check('Tastaturfokus bleibt nach einer Wertänderung erhalten', card.shadowRoot.activeElement === cpu);
    const before = q(card, '[data-part="disk"] [data-k="v"]').firstChild;
    set({...s, 'sensor.fremd': st('1')});
    check('Fremde Zustandsänderung fasst nichts an', q(card, '[data-part="disk"] [data-k="v"]').firstChild === before);
    card.setConfig({title: 'Neu'});
    check('Geänderte Einstellung baut neu auf', text(card, 'h1') === 'Neu' && q(card, 'ha-card') !== haCard);
  }

  // ---- Nicht verfügbar / fehlend ----
  {
    const {card, set} = fixture();
    const s = baseStates();
    s['sensor.system_monitor_memory_use_percent'] = st('unavailable', '%');
    s['sensor.system_monitor_processor_temperature'] = st('unknown', '°C');
    s['binary_sensor.rpi_power_status'] = st('unavailable');
    delete s['sensor.system_monitor_disk_use'];
    set(s);
    check('Nicht verfügbarer Prozentwert: „—", grau, leerer Balken (nicht 0 %)',
      text(card, '[data-part="mem"] [data-k="v"]') === '—' && text(card, '[data-part="mem"] [data-k="u"]') === '' &&
      part(card, 'mem').classList.contains('tone-neutral') && q(card, '[data-part="mem"] .bar u').style.width === '0%');
    check('Unbekannte Temperatur und Netzteil: „—", grau', text(card, '[data-part="temp"] [data-k="v"]') === '—' && part(card, 'temp').classList.contains('tone-neutral') &&
      text(card, '[data-part="power"] [data-k="v"]') === '—' && part(card, 'power').classList.contains('tone-neutral'));
    check('Fehlende Entität: „—"', text(card, '[data-part="disk"] [data-k="used"]') === 'Belegt —');
    s['sensor.system_monitor_memory_use_percent'] = st('250', '%');
    set({...s});
    check('Balken bleibt auf 0–100 % begrenzt', q(card, '[data-part="mem"] .bar u').style.width === '100%');
    const empty = fixture({states: {}}).card;
    check('Ohne jede Entität: Aufbau ohne Fehler, alle Werte „—"', text(empty, '[data-part="cpu"] [data-k="v"]') === '—' && text(empty, '[data-part="boot"] [data-k="v"]') === '—');
  }

  // ---- HTML-Injection: erster Aufbau und Aktualisierung ----
  {
    const {card} = fixture({config: {title: attack, subtitle: attack, memory_title: attack, disk_title: attack, icon: attack, image_url: attack, cpu_entity: 'sensor.x' + attack}});
    await turn(50);
    check('Injection über Konfiguration bleibt Text', clean(card.shadowRoot) && text(card, 'h1').includes('<img id="injected"') && text(card, '[data-part="mem"] [data-k="l"]').includes('<img id="injected"'));
    const {card: c2, set} = fixture();
    const s = baseStates();
    for (const id of Object.keys(s)) s[id] = st(attack, attack);
    s['sensor.system_monitor_processor_use'] = st('12', attack);
    set(s);
    await turn(50);
    check('Injection über Zustände und Einheiten bleibt bei der Aktualisierung Text',
      clean(c2.shadowRoot) && text(c2, '[data-part="cpu"] [data-k="u"]').includes('<img id="injected"') && text(c2, '[data-part="boot"] [data-k="v"]').includes('<img id="injected"') &&
      text(c2, '[data-part="mem"] [data-k="used"]').includes('<img id="injected"'));
  }

  // ---- Bild-Optionen und Sprache ----
  {
    const a = fixture({config: {show_image: false}}).card;
    check('Bild abschaltbar', !q(a, 'img'));
    const b = fixture({config: {image_url: '/gibt-es-nicht.png'}}).card;
    await turn(400);
    check('Fehlendes eigenes Bild fällt auf die eingebettete Illustration zurück', q(b, 'img').getAttribute('src').startsWith('data:image/svg+xml'));
    const e = fixture({language: 'en'}).card;
    check('Englisch, wenn Home Assistant nicht deutsch ist', text(e, '[data-part="mem"] [data-k="l"]') === 'Memory' && text(e, '[data-part="boot"] [data-k="l"]') === 'Last boot');
    const f = fixture({config: {memory_title: 'RAM', disk_title: 'SSD'}}).card;
    check('Eigene Titel für Arbeitsspeicher und Speicher', text(f, '[data-part="mem"] [data-k="l"]') === 'RAM' && text(f, '[data-part="disk"] [data-k="l"]') === 'SSD');
  }

  // ---- Layout: Schriftstufen, kein Überlauf, Höhe ----
  for (const [width, fs, wide] of [[240, '14px', false], [280, '14px', false], [300, '14px', false], [350, '14px', false], [480, '15px', false], [800, '19px', true], [1100, '22px', true]]) {
    const {card} = fixture({width});
    await frames();
    const root = card.shadowRoot, hc = q(card, 'ha-card').getBoundingClientRect();
    const inside = [...root.querySelectorAll('.tile, .row, .info, h1, [data-k]')].every((el) => {
      const r = el.getBoundingClientRect(); return (!r.width && !r.height) || (r.left >= hc.left - .5 && r.right <= hc.right + .5);
    });
    const noClip = [...root.querySelectorAll('.val b, .pct b, [data-k="used"], [data-k="free"], .rt > b, .tile small')].every((el) => el.scrollWidth <= el.clientWidth + 1);
    const bg = q(card, '.bgimg').getBoundingClientRect(), tiles = q(card, '.tiles').getBoundingClientRect();
    const mem = part(card, 'mem').getBoundingClientRect(), disk = part(card, 'disk').getBoundingClientRect();
    check(width + ' px: Schriftstufe ' + fs, card.style.getPropertyValue('--fs') === fs);
    check(width + ' px: nichts ragt aus der Card, Werte und Beschriftungen sind vollständig', inside && noClip && root.querySelector('main').scrollWidth <= Math.ceil(hc.width));
    check(width + ' px: Gerätebild bleibt im Kopfbereich', bg.bottom <= tiles.top + 1);
    check(width + ' px: Arbeitsspeicher und Speicher ' + (wide ? 'nebeneinander' : 'untereinander'), wide ? Math.abs(mem.top - disk.top) < 1 : disk.top >= mem.bottom);
    const rows = card.getGridOptions().min_rows, h = q(card, 'main').offsetHeight;
    check(width + ' px: gemeldete Mindesthöhe deckt den Inhalt knapp', rows * 64 - 8 >= h && (rows - 1) * 64 - 8 < h + 2);
  }
  for (const language of ['de', 'en']) for (const width of [240, 300, 350, 480, 800]) {
    const s = baseStates();
    s['binary_sensor.rpi_power_status'] = st('on');
    s['sensor.system_monitor_processor_temperature'] = st('-12.5', '°C');
    s['sensor.system_monitor_memory_use_percent'] = st('100', '%');
    const {card} = fixture({width, language, states: s});
    await frames();
    check(width + ' px (' + language + '): Unterspannungs-Warnung und breite Werte vollständig lesbar',
      [...card.shadowRoot.querySelectorAll('.val b, .pct b, .tile small')].every((el) => el.scrollWidth <= el.clientWidth + 1));
  }
  // Nachgebildete Scrollleiste: Ist die Card höher als H, wird ihr Platz 15 px schmaler (wie bei einer
  // einblendenden Scrollleiste). Um jede Layout-Schwelle darf die Breite danach nicht dauerhaft hin- und herkippen.
  for (const T of [280, 330, 400, 600, 700, 800, 1000]) {
    const host = document.getElementById('w');
    host.replaceChildren();
    host.style.width = 'auto';
    const hass = {states: baseStates(), language: 'de', locale: {language: 'de'}};
    const mk = (W) => {
      const box = document.createElement('div'); box.style.width = W + 'px';
      const c = document.createElement('system-monitor'); c.setConfig({}); box.appendChild(c); host.appendChild(box); c.hass = hass;
      return {box, c};
    };
    const probe = [T - 20, T + 20].map(mk);
    await frames();
    const hs = probe.map((p) => p.c.offsetHeight), lo = Math.min(...hs) - 3, hi = Math.max(...hs) + 3;
    host.replaceChildren();
    const cards = [];
    for (let W = T - 14; W <= T + 30; W += 2) for (let H = lo; H <= hi; H += Math.max(2, Math.ceil((hi - lo) / 6))) cards.push({...mk(W), W, H, cur: W, n: 0});
    await frames();
    for (let f = 0; f < 60; f++) {
      const now = cards.map((o) => o.c.offsetHeight);
      cards.forEach((o, i) => { const want = o.W - (now[i] > o.H ? 15 : 0); if (want !== o.cur) { o.cur = want; o.box.style.width = want + 'px'; o.n++; } });
      await new Promise((r) => requestAnimationFrame(r));
    }
    const worst = Math.max(...cards.map((o) => o.n));
    check('Scrollleiste um ' + T + ' px: Breite pendelt sich ein (höchstens ' + worst + ' Wechsel in 60 Bildern)', worst <= 4);
  }
  for (const [start, steps, expect, read] of [
    [395, [405, 395, 409, 414, 392, 386], ['14px', '14px', '14px', '14px', '15px', '15px', '14px'], (c) => c.style.getPropertyValue('--fs')],
    [695, [705, 695, 709, 714, 692, 686], ['n', 'n', 'n', 'n', 'w', 'w', 'n'], (c) => (c.shadowRoot.querySelector('ha-card').classList.contains('wide') ? 'w' : 'n')],
    [325, [335, 325, 339, 344, 322, 316], ['s', 's', 's', 's', 'n', 'n', 's'], (c) => (c.shadowRoot.querySelector('ha-card').classList.contains('slim') ? 's' : 'n')],
    [275, [285, 275, 289, 294, 272, 266], ['x', 'x', 'x', 'x', 'n', 'n', 'x'], (c) => (c.shadowRoot.querySelector('ha-card').classList.contains('xslim') ? 'x' : 'n')],
  ]) {
    const {card} = fixture({width: start});
    await frames();
    const w = document.getElementById('w'), seen = [read(card)];
    for (const px of steps) { w.style.width = px + 'px'; await frames(); await frames(); seen.push(read(card)); }
    check('Hysterese um ' + (start + 5) + ' px: ±12 px kippen nichts (' + seen.join(' ') + ')', seen.join() === expect.join());
  }
  {
    const {card, set} = fixture({width: 800});
    await frames();
    check('Breites Layout übersteht eine Wertänderung', (set({...baseStates(), 'sensor.system_monitor_processor_use': st('13', '%')}), q(card, 'ha-card').classList.contains('wide')));
    card.setConfig({title: 'X'});
    check('Breites Layout übersteht einen Neuaufbau', q(card, 'ha-card').classList.contains('wide'));
    card.remove();
    document.getElementById('w').appendChild(card);
    await frames();
    check('Entfernen und Wiedereinhängen ohne Fehler', text(card, 'h1') === 'X');
    const grid = card.getGridOptions();
    check('Sections-Raster: volle Breite, mindestens 6 Spalten, Höhe aus dem Inhalt', grid.columns === 12 && grid.min_columns === 6 && !('rows' in grid) && !('max_rows' in grid));
  }
  {
    const w = document.getElementById('w');
    w.replaceChildren();
    const early = document.createElement('system-monitor');
    early.hass = {states: baseStates(), language: 'de'};
    w.appendChild(early);
    early.setConfig({});
    check('Werte vor der Einstellung gesetzt: Aufbau ohne Fehler', text(early, '[data-part="cpu"] [data-k="v"]') === '12');
  }
  {
    const heights = [];
    for (const width of [240, 350, 480]) { const {card} = fixture({width}); await frames(); heights.push(card.getGridOptions().min_rows); }
    const fresh = document.createElement('system-monitor');
    check('Mindesthöhe vor der ersten Messung reicht für den Inhalt schmaler Cards (' + fresh.getGridOptions().min_rows + ' ≥ ' + Math.max(...heights) + ')', fresh.getGridOptions().min_rows >= Math.max(...heights));
  }
  await frames();
  check('Keine Fehlermeldungen des Browsers, auch kein „ResizeObserver loop" (' + window.__errors.length + ')', window.__errors.length === 0);
  return results;
}
"""


def launch(p):
    executable = os.environ.get("PLAYWRIGHT_CHROMIUM_EXECUTABLE")
    return p.chromium.launch(**({"executable_path": executable, "args": ["--no-sandbox"]} if executable else {}))


def main():
    source = (ROOT / "system-monitor.js").read_text(encoding="utf8")
    errors = []
    with sync_playwright() as p:
        browser = launch(p)
        page = browser.new_page(viewport={"width": 1200, "height": 1000})
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.set_content(PAGE)
        page.add_script_tag(content=source)
        results = page.evaluate(TEST_JS)
        results.append({"name": "keine JavaScript-Fehler", "pass": not errors})
        if "--preview" in sys.argv:
            out = ROOT / "tests" / "out"
            out.mkdir(exist_ok=True)
            for width in (350, 800):
                for variant in ("normal", "undervoltage"):
                    shot = browser.new_page(viewport={"width": width + 28, "height": 400}, device_scale_factor=2)
                    shot.set_content(PAGE)
                    shot.add_script_tag(content=source)
                    shot.evaluate("""([width, low]) => { const s = window.baseStates();
                      if (low) { s['binary_sensor.rpi_power_status'].state = 'on'; s['sensor.system_monitor_processor_use'].state = '88'; s['sensor.system_monitor_memory_use_percent'].state = '78'; }
                      window.fixture({width, states: s}); }""", [width, variant != "normal"])
                    shot.wait_for_timeout(200)
                    shot.screenshot(path=str(out / f"system-monitor-{variant}-{width}.png"), full_page=True)
                    shot.close()
        browser.close()
    for result in results:
        print(("PASS " if result["pass"] else "FAIL ") + result["name"])
    failures = sum(not result["pass"] for result in results)
    print(f"\n{len(results)} Prüfungen, {failures} Fehler")
    if errors:
        print(errors)
    return bool(failures)


if __name__ == "__main__":
    raise SystemExit(main())
