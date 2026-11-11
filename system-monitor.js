/*
 * System Monitor Card — kompakte Home Assistant Custom Card zur Überwachung
 * eines Hosts (vorkonfiguriert für Raspberry Pi 5 mit der Integration "System Monitor").
 * Version 2.2.0 — AGPL-3.0-only — BeGiBue
 * https://github.com/BeGiBue/home-assistant-system-monitor-card
 *
 * Installation: siehe README.md (HACS) oder manuell:
 *   1. Datei nach /config/www/system-monitor.js kopieren
 *   2. Einstellungen > Dashboards > Ressourcen > "+":
 *        URL: /local/system-monitor.js      Typ: JavaScript-Modul
 *   3. Karte hinzufügen:  type: custom:system-monitor
 */

const SYSTEM_MONITOR_CARD_VERSION = "2.2.0";

// Eingebettete Platinen-Illustration (eigene Zeichnung, ohne Logo); optional per image_url ersetzbar
const BOARD_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 118"><defs><linearGradient id="pcb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f9a52"/><stop offset="1" stop-color="#1b6d38"/></linearGradient><linearGradient id="met" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1f3f6"/><stop offset="1" stop-color="#aeb4be"/></linearGradient><linearGradient id="soc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9dde3"/><stop offset="1" stop-color="#8f96a2"/></linearGradient><linearGradient id="usb3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#1d4fb8"/></linearGradient><linearGradient id="usb2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4f58"/><stop offset="1" stop-color="#23262c"/></linearGradient></defs><rect x="6" y="6" width="168" height="106" rx="8" fill="url(#pcb)" stroke="#124f28" stroke-width="1.5"/><rect x="9" y="9" width="162" height="100" rx="6" fill="none" stroke="#ffffff" stroke-opacity=".12"/><path d="M24 30H58" stroke="#ffffff" stroke-opacity=".10" stroke-width="1"/><path d="M24 36H58" stroke="#ffffff" stroke-opacity=".10" stroke-width="1"/><path d="M24 42H58" stroke="#ffffff" stroke-opacity=".10" stroke-width="1"/><circle cx="16" cy="16" r="4.6" fill="#d8b24a"/><circle cx="16" cy="16" r="2.6" fill="#0f3d20"/><circle cx="16" cy="102" r="4.6" fill="#d8b24a"/><circle cx="16" cy="102" r="2.6" fill="#0f3d20"/><circle cx="122" cy="16" r="4.6" fill="#d8b24a"/><circle cx="122" cy="16" r="2.6" fill="#0f3d20"/><circle cx="122" cy="102" r="4.6" fill="#d8b24a"/><circle cx="122" cy="102" r="2.6" fill="#0f3d20"/><rect x="30" y="10" width="86" height="11" rx="1.5" fill="#1a1c20"/><rect x="33.0" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="33.0" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="37.2" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="37.2" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="41.4" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="41.4" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="45.6" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="45.6" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="49.8" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="49.8" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="54.0" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="54.0" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="58.2" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="58.2" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="62.4" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="62.4" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="66.6" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="66.6" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="70.8" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="70.8" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="75.0" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="75.0" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="79.2" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="79.2" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="83.4" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="83.4" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="87.6" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="87.6" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="91.8" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="91.8" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="96.0" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="96.0" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="100.2" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="100.2" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="104.4" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="104.4" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="108.6" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="108.6" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="112.8" y="12" width="2.2" height="2.2" fill="#e6c25a"/><rect x="112.8" y="16.4" width="2.2" height="2.2" fill="#e6c25a"/><rect x="60" y="36" width="40" height="40" rx="4" fill="#202328"/><rect x="63" y="39" width="34" height="34" rx="3" fill="url(#soc)" stroke="#6f7580" stroke-width="1"/><rect x="68" y="44" width="24" height="24" rx="2" fill="none" stroke="#ffffff" stroke-opacity=".45"/><rect x="106" y="40" width="22" height="26" rx="2.5" fill="#17191d"/><rect x="109" y="43" width="16" height="3" fill="#ffffff" fill-opacity=".14"/><rect x="28" y="44" width="24" height="18" rx="2" fill="url(#met)" stroke="#8d939d" stroke-width=".8"/><rect x="30" y="70" width="7" height="4" rx=".8" fill="#161719"/><rect x="40" y="70" width="7" height="4" rx=".8" fill="#161719"/><rect x="50" y="70" width="7" height="4" rx=".8" fill="#161719"/><rect x="104" y="74" width="5" height="8" rx=".8" fill="#161719"/><rect x="112" y="74" width="5" height="8" rx=".8" fill="#161719"/><rect x="60" y="84" width="10" height="5" rx=".8" fill="#161719"/><rect x="2" y="48" width="20" height="24" rx="2" fill="#2a2d33"/><rect x="4" y="52" width="14" height="16" rx="1" fill="#14161a"/><rect x="130" y="10" width="16" height="6" rx="1" fill="#f0f0ee"/><rect x="130" y="100" width="16" height="6" rx="1" fill="#f0f0ee"/><rect x="22" y="104" width="15" height="9" rx="2.5" fill="url(#met)" stroke="#8d939d" stroke-width=".8"/><rect x="26" y="107" width="7" height="3" rx="1.5" fill="#1a1c20"/><rect x="46" y="104" width="14" height="9" rx="1.5" fill="url(#met)" stroke="#8d939d" stroke-width=".8"/><rect x="49" y="107" width="8" height="3" fill="#1a1c20"/><rect x="66" y="104" width="14" height="9" rx="1.5" fill="url(#met)" stroke="#8d939d" stroke-width=".8"/><rect x="69" y="107" width="8" height="3" fill="#1a1c20"/><rect x="136" y="20" width="40" height="32" rx="2" fill="url(#met)" stroke="#8d939d" stroke-width="1"/><rect x="150" y="26" width="22" height="20" rx="1.5" fill="#14161a"/><rect x="152" y="28" width="18" height="3" fill="#e6c25a" fill-opacity=".8"/><circle cx="142" cy="26" r="1.6" fill="#7bd88f"/><circle cx="142" cy="32" r="1.6" fill="#f2b84b"/><rect x="136" y="54" width="40" height="26" rx="2" fill="url(#usb3)" stroke="#173f94" stroke-width="1"/><rect x="152" y="58" width="20" height="7" fill="#0c1220"/><rect x="152" y="69" width="20" height="7" fill="#0c1220"/><rect x="136" y="82" width="40" height="26" rx="2" fill="url(#usb2)" stroke="#16181c" stroke-width="1"/><rect x="152" y="86" width="20" height="7" fill="#0c0d10"/><rect x="152" y="97" width="20" height="7" fill="#0c0d10"/></svg>';
const BOARD_IMG = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(BOARD_SVG);

// Language: German when Home Assistant uses German, otherwise English.
const SM_I18N={
  "en": {
    "l_title": "Title",
    "l_subtitle": "Subtitle",
    "l_icon": "Icon",
    "l_show_image": "Show device image",
    "l_image_url": "Custom device image (URL, optional)",
    "l_cpu_entity": "CPU usage",
    "l_temperature_entity": "CPU temperature",
    "l_power_entity": "Power supply / undervoltage",
    "l_memory_percent_entity": "RAM used (%)",
    "l_memory_used_entity": "RAM used",
    "l_memory_free_entity": "RAM free",
    "l_disk_percent_entity": "Storage used (%)",
    "l_disk_used_entity": "Storage used",
    "l_disk_free_entity": "Storage free",
    "l_last_start_entity": "Last boot",
    "s_general": "General",
    "s_system": "System",
    "s_memory": "Memory",
    "s_disk": "Storage",
    "s_boot": "Boot",
    "h_image_url": "Empty = built-in illustration, e.g. /local/images/pi5.png",
    "memory": "Memory",
    "disk": "Storage",
    "temperature": "Temperature",
    "warning": "Warning",
    "voltage": "Voltage",
    "power_supply": "Power supply",
    "used": "Used",
    "free": "Free",
    "last_start": "Last boot",
    "description": "Compact monitoring card for a host, e.g. Raspberry Pi 5 (System Monitor integration)."
  },
  "de": {
    "l_title": "Titel",
    "l_subtitle": "Untertitel",
    "l_icon": "Symbol",
    "l_show_image": "Gerätebild anzeigen",
    "l_image_url": "Eigenes Gerätebild (URL, optional)",
    "l_cpu_entity": "CPU-Auslastung",
    "l_temperature_entity": "CPU-Temperatur",
    "l_power_entity": "Netzteil / Unterspannung",
    "l_memory_percent_entity": "RAM belegt (%)",
    "l_memory_used_entity": "RAM belegt",
    "l_memory_free_entity": "RAM frei",
    "l_disk_percent_entity": "Speicher belegt (%)",
    "l_disk_used_entity": "Speicher belegt",
    "l_disk_free_entity": "Speicher frei",
    "l_last_start_entity": "Letzter Start",
    "s_general": "Allgemein",
    "s_system": "System",
    "s_memory": "Arbeitsspeicher",
    "s_disk": "Speicher",
    "s_boot": "Start",
    "h_image_url": "Leer = eingebettete Illustration, z. B. /local/images/pi5.png",
    "memory": "Arbeitsspeicher",
    "disk": "Speicher",
    "temperature": "Temperatur",
    "warning": "Warnung",
    "voltage": "Spannung",
    "power_supply": "Netzteil",
    "used": "Belegt",
    "free": "Frei",
    "last_start": "Letzter Start",
    "description": "Kompakte Monitoring-Karte für einen Host, z. B. Raspberry Pi 5 (Integration System Monitor)."
  }
};
const SMLang=(hass)=>String(hass?.locale?.language||hass?.language||globalThis.document?.querySelector?.("home-assistant")?.hass?.locale?.language||globalThis.document?.documentElement?.lang||globalThis.navigator?.language||"en").toLowerCase().startsWith("de")?"de":"en";
const SMT=(hass)=>SM_I18N[SMLang(hass)];

const DEF = {
  title: "System Monitor",
  subtitle: "Raspberry Pi 5",
  icon: "mdi:raspberry-pi",
  show_image: true,
  image_url: "",

  cpu_entity: "sensor.system_monitor_processor_use",
  temperature_entity: "sensor.system_monitor_processor_temperature",
  power_entity: "binary_sensor.rpi_power_status",

  memory_percent_entity: "sensor.system_monitor_memory_use_percent",
  memory_used_entity: "sensor.system_monitor_memory_use",
  memory_free_entity: "sensor.system_monitor_memory_free",

  disk_percent_entity: "sensor.system_monitor_disk_use_percent",
  disk_used_entity: "sensor.system_monitor_disk_use",
  disk_free_entity: "sensor.system_monitor_disk_free",

  last_start_entity: "sensor.system_monitor_last_boot",
};

const SM_OFF = ["unavailable", "unknown", ""];

class SystemMonitorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEF };
    this._sig = "";
    this._parts = {};
  }

  static getStubConfig() {
    return { ...DEF };
  }

  static getConfigForm() {
    const e = (n) => ({ name: n, selector: { entity: {} } });
    const t = (n) => ({ name: n, selector: { text: {} } });
    const x = (name, title, schema) => ({ type: "expandable", name, title, flatten: true, schema });
    const T = SMT();
    const L = { memory_title: T.l_title, disk_title: T.l_title };
    return {
      schema: [
        x("general", T.s_general, [t("title"), t("subtitle"), { name: "icon", selector: { icon: {} } }, { name: "show_image", selector: { boolean: {} } }, t("image_url")]),
        x("system", T.s_system, [e("cpu_entity"), e("temperature_entity"), e("power_entity")]),
        x("memory", T.s_memory, [t("memory_title"), e("memory_percent_entity"), e("memory_used_entity"), e("memory_free_entity")]),
        x("disk", T.s_disk, [t("disk_title"), e("disk_percent_entity"), e("disk_used_entity"), e("disk_free_entity")]),
        x("boot", T.s_boot, [e("last_start_entity")]),
      ],
      computeLabel: (s) => L[s.name] || T[`l_${s.name}`],
      computeHelper: (s) => (s.name === "image_url" ? T.h_image_url : undefined),
    };
  }

  setConfig(c) {
    this._config = { ...DEF, ...c };
    this._sig = "";
    this._update();
  }

  set hass(h) {
    this._hass = h;
    this._update();
  }
  get hass() {
    return this._hass;
  }

  // Sections-Dashboard: Höhe ergibt sich aus dem Inhalt; min_rows verhindert, dass im Layout-Editor
  // weniger Zeilen eingestellt werden, als der Inhalt braucht (sonst ragt die Card in die nächste hinein)
  getGridOptions() {
    return { columns: 12, min_columns: 6, min_rows: this._minRows || 7 };
  }

  // Masonry-Dashboard: ungefähre Höhe in Zeilen (je ca. 50 px)
  getCardSize() {
    const h = this.shadowRoot?.querySelector("ha-card")?.offsetHeight;
    return h ? Math.ceil(h / 50) : 9;
  }

  connectedCallback() {
    if (!this._ro && typeof ResizeObserver !== "undefined") {
      this._ro = new ResizeObserver(() => {
        this._applyTier();
        this._measure();
      });
    }
    this._ro?.observe(this);
    this._applyTier();
    this._update();
  }

  disconnectedCallback() {
    this._ro?.disconnect();
  }

  // Schriftstufe nach Breite (14/15/17/19/22 px ab 0/400/600/800/1000 px) und breites Layout ab 700 px, beide
  // mit ±12 px Hysterese: Ändert eine ein- und ausblendende Scrollleiste die Breite um wenige Pixel, kippt
  // nichts hin und her (sonst schwingt die Höhe mit)
  _applyTier() {
    const w = this.clientWidth;
    if (!w) return;
    const T = [0, 400, 600, 800, 1000], S = [14, 15, 17, 19, 22], H = 12;
    let t = this._tier;
    if (t === undefined) {
      t = 0;
      for (let i = 1; i < T.length; i++) if (w >= T[i]) t = i;
    } else {
      while (t < T.length - 1 && w >= T[t + 1] + H) t++;
      while (t > 0 && w < T[t] - H) t--;
    }
    if (t !== this._tier) {
      this._tier = t;
      this.style.setProperty("--fs", S[t] + "px");
    }
    // Auch die schmalen Layouts per Klasse mit Hysterese statt per Container-Abfrage: Sie ändern die Höhe, und eine
    // dadurch ein- und ausblendende Scrollleiste würde die Breite sonst endlos um die Schwelle kippen
    const below = (prev, at) => (prev === undefined ? w <= at : prev ? w <= at + H : w <= at - H);
    this._wide = this._wide === undefined ? w >= 700 : this._wide ? w >= 700 - H : w >= 700 + H;
    this._slim = below(this._slim, 330);
    this._xslim = below(this._xslim, 280);
    const cl = this.shadowRoot.querySelector("ha-card")?.classList;
    if (cl) {
      cl.toggle("wide", this._wide);
      cl.toggle("slim", this._slim);
      cl.toggle("xslim", this._xslim);
    }
  }

  // Natürliche Inhaltshöhe in Grid-Zeilen umrechnen (HA: 56 px Zeile + 8 px Abstand)
  _measure() {
    const card = this.shadowRoot?.querySelector("ha-card"), main = card?.querySelector("main");
    if (!main || !this.clientWidth) return;
    const cs = getComputedStyle(card), hs = getComputedStyle(this);
    const h = main.offsetHeight + (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
    const rh = parseFloat(hs.getPropertyValue("--row-height")) || 56, gap = parseFloat(hs.getPropertyValue("--row-gap")) || 8;
    this._minRows = Math.max(1, Math.ceil((h + gap) / (rh + gap)));
  }

  // ---------- Helfer ----------
  _s(id) { return id && this._hass?.states?.[id]; }

  // Zustand nur, wenn verfügbar
  _v(id) {
    const s = this._s(id);
    return s && !SM_OFF.includes(String(s.state)) ? s : null;
  }

  _f(id) {
    const s = this._v(id);
    if (!s) return "—";
    try {
      if (this._hass?.formatEntityState) return this._hass.formatEntityState(s);
    } catch (_) { /* Fallback unten */ }
    const u = s.attributes?.unit_of_measurement;
    return `${s.state}${u ? ` ${u}` : ""}`;
  }

  _n(id) {
    const s = this._v(id);
    const n = s ? Number(String(s.state).replace(",", ".")) : NaN;
    return Number.isFinite(n) ? n : NaN;
  }

  // Zahl und Einheit getrennt (für große Zahl mit kleiner Einheit)
  _split(id) {
    if (!this._v(id)) return { v: "—", u: "" };
    const txt = String(this._f(id)), m = txt.match(/^(-?[\d.,\s]+?)\s*([^\d\s.,].*)?$/);
    return m ? { v: m[1].trim(), u: (m[2] || "").trim() } : { v: txt, u: "" };
  }

  _e(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  // Farbe nach Schwellwerten (warn/err): höher = schlechter; im Normalbereich Akzentfarbe, ohne Wert grau
  _level(id, warn, err) {
    const n = this._n(id);
    if (!Number.isFinite(n)) return "neutral";
    if (n >= err) return "error";
    if (n >= warn) return "warning";
    return "primary";
  }

  _more(id) {
    if (id) this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId: id } }));
  }

  // ---------- Bausteine ----------
  // Jeder Baustein beschreibt seinen Stand als Daten: Klasse (Farbton), Texte je Feld, Symbol, Balkenbreite.
  // _build() schreibt sie einmal ins Markup, _update() setzt danach nur geänderte Felder (textContent/Attribute).

  _metricPart(icon, id, label, warn, err) {
    const x = this._split(id);
    return { cls: `tile tone-${this._level(id, warn, err)}`, icon, t: { l: label, v: x.v, u: x.u } };
  }

  // Netzteil (binary_sensor.rpi_power_status): on = Unterspannung erkannt
  _powerPart(id) {
    const T = SMT(this._hass), s = this._v(id), low = s?.state === "on";
    return {
      cls: `tile txt tone-${!s ? "neutral" : low ? "error" : "success"}`,
      icon: low ? "mdi:flash-alert" : "mdi:power-plug-battery-outline",
      t: { l: low ? T.voltage : T.power_supply, v: !s ? "—" : low ? T.warning : "OK", u: "" },
    };
  }

  // Zeile mit Fortschrittsbalken: Prozent + Belegt/Frei
  _barPart(title, percentId, usedId, freeId, warn, err) {
    const T = SMT(this._hass), n = this._n(percentId), x = this._split(percentId);
    return {
      cls: `panel row tone-${this._level(percentId, warn, err)}`,
      w: Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0,
      t: { l: title, v: x.v, u: x.u, used: `${T.used} ${this._f(usedId)}`, free: `${T.free} ${this._f(freeId)}` },
    };
  }

  _computeParts() {
    const c = this._config, T = SMT(this._hass);
    return {
      cpu: this._metricPart("mdi:chip", c.cpu_entity, "CPU", 60, 85),
      temp: this._metricPart("mdi:thermometer", c.temperature_entity, T.temperature, 60, 75),
      power: this._powerPart(c.power_entity),
      mem: this._barPart(c.memory_title || T.memory, c.memory_percent_entity, c.memory_used_entity, c.memory_free_entity, 70, 90),
      disk: this._barPart(c.disk_title || T.disk, c.disk_percent_entity, c.disk_used_entity, c.disk_free_entity, 75, 90),
      boot: { cls: "panel info", t: { l: T.last_start, v: this._f(c.last_start_entity) } },
    };
  }

  _field(p, k, tag = "span") {
    return `<${tag} data-k="${k}">${this._e(p.t[k])}</${tag}>`;
  }

  _tileHtml(key, p, id) {
    return `<button class="${p.cls}" data-part="${key}" data-more="${this._e(id)}">
      <span class="chip"><ha-icon icon="${this._e(p.icon)}"></ha-icon></span>
      ${this._field(p, "l", "small")}
      <span class="val">${this._field(p, "v", "b")}${this._field(p, "u", "em")}</span>
    </button>`;
  }

  _barHtml(key, p, icon, percentId, usedId, freeId) {
    return `<button class="${p.cls}" data-part="${key}" data-more="${this._e(percentId)}">
      <span class="chip"><ha-icon icon="${icon}"></ha-icon></span>
      <span class="rb">
        <span class="rt">${this._field(p, "l", "b")}<span class="pct">${this._field(p, "v", "b")}${this._field(p, "u", "em")}</span></span>
        <i class="bar"><u style="width:${p.w}%"></u></i>
        <span class="uf"><span class="lnk" data-k="used" data-more="${this._e(usedId)}">${this._e(p.t.used)}</span><span class="lnk" data-k="free" data-more="${this._e(freeId)}">${this._e(p.t.free)}</span></span>
      </span>
    </button>`;
  }

  // ---------- Aufbau und Aktualisierung ----------

  // Die Card wird nur einmal aufgebaut (und neu bei geänderter Konfiguration oder Sprache). Danach setzt
  // _update() nur die Felder, deren Stand sich geändert hat: Schaltflächen und Bild bleiben bestehen,
  // der Tastaturfokus bleibt erhalten und die Balken gleiten zum neuen Wert.
  _update() {
    if (!this._hass) return;
    const sig = JSON.stringify([SMLang(this._hass), this._config]);
    const parts = this._computeParts();
    if (sig !== this._sig) {
      this._sig = sig;
      this._parts = parts;
      this._build(parts);
      return;
    }
    let changed = false;
    Object.keys(parts).forEach((key) => {
      const now = parts[key], old = this._parts[key] || { t: {} };
      if (JSON.stringify(old) === JSON.stringify(now)) return;
      const el = this.shadowRoot.querySelector(`[data-part="${key}"]`);
      if (!el) return;
      changed = true;
      if (old.cls !== now.cls) el.className = now.cls;
      if (now.icon && old.icon !== now.icon) el.querySelector("ha-icon")?.setAttribute("icon", now.icon);
      if (now.w !== undefined && old.w !== now.w) {
        const bar = el.querySelector(".bar u");
        if (bar) bar.style.width = `${now.w}%`;
      }
      Object.keys(now.t).forEach((k) => {
        if (old.t[k] === now.t[k]) return;
        const f = el.querySelector(`[data-k="${k}"]`);
        if (f) f.textContent = now.t[k];
      });
    });
    this._parts = parts;
    if (changed) this._measure();
  }

  _build(p) {
    const c = this._config;
    const img = c.show_image === false ? "" : (c.image_url || "").trim() || BOARD_IMG;

    this.shadowRoot.innerHTML = `<style>${SystemMonitorCard.css}</style>
<ha-card>${img ? `<img class="bgimg" src="${this._e(img)}" alt="">` : ""}<main>

  <div class="title">
    <span class="chip big"><ha-icon icon="${this._e(c.icon || "mdi:raspberry-pi")}"></ha-icon></span>
    <div class="tt"><h1>${this._e(c.title)}</h1><p>${this._e(c.subtitle)}</p></div>
  </div>

  <section class="tiles">
    ${this._tileHtml("cpu", p.cpu, c.cpu_entity)}
    ${this._tileHtml("temp", p.temp, c.temperature_entity)}
    ${this._tileHtml("power", p.power, c.power_entity)}
  </section>

  ${this._barHtml("mem", p.mem, "mdi:memory", c.memory_percent_entity, c.memory_used_entity, c.memory_free_entity)}
  ${this._barHtml("disk", p.disk, "mdi:harddisk", c.disk_percent_entity, c.disk_used_entity, c.disk_free_entity)}

  <button class="${p.boot.cls}" data-part="boot" data-more="${this._e(c.last_start_entity)}">
    <span class="chip"><ha-icon icon="mdi:clock-outline"></ha-icon></span>
    <span class="at">${this._field(p.boot, "l", "b")}${this._field(p.boot, "v", "small")}</span>
  </button>

</main></ha-card>`;

    const im = this.shadowRoot.querySelector(".bgimg");
    if (im) im.onerror = () => { if (im.getAttribute("src") !== BOARD_IMG) im.setAttribute("src", BOARD_IMG); else im.style.display = "none"; };
    // Ein Klick öffnet den Dialog der nächstliegenden Entität (Belegt/Frei haben eigene, sonst die der Zeile)
    this.shadowRoot.querySelectorAll("button[data-more]").forEach((b) => {
      b.onclick = (ev) => this._more((ev.target.closest?.("[data-more]") || b).dataset.more);
    });
    this._applyTier();
    this._measure();
  }

  /* Alle Größen in em: Die Basisschrift wächst mit der Kartenbreite (iPhone → iPad → Kiosk).
     Bewusst ohne backdrop-filter/blur – schont den Raspberry Pi. */
  static get css() {
    return `
:host{display:block;width:100%;height:100%;container-type:inline-size;
  --txt:var(--primary-text-color,#111);
  --mut:var(--secondary-text-color,#777);
  --pri:var(--primary-color,#03a9f4);
  --ok:var(--success-color,#4caf50);
  --warn:var(--warning-color,#ff9800);
  --err:var(--error-color,#f44336);
  --line:color-mix(in srgb,var(--txt) 12%,transparent);
  --fill:color-mix(in srgb,var(--txt) 5%,transparent);
  --fill-hi:color-mix(in srgb,var(--txt) 10%,transparent)}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
button{font:inherit;color:inherit;cursor:pointer;touch-action:manipulation;text-align:left;border:0;background:none;padding:0;margin:0}
/* Hintergrund, Rand und Radius kommen vom Theme */
ha-card{position:relative;height:100%;font-size:var(--fs,14px);overflow:hidden;color:var(--txt)}
main{position:relative;z-index:1;padding:16px;display:grid;gap:.6em}
.tone-primary{--t:var(--pri)}.tone-success{--t:var(--ok)}.tone-warning{--t:var(--warn)}.tone-error{--t:var(--err)}.tone-neutral{--t:var(--mut)}
.panel{background:var(--fill);border:1px solid var(--line);border-radius:1.1em}
.chip{flex:none;display:grid;place-items:center;width:2.1em;height:2.1em;border-radius:.65em;
  background:color-mix(in srgb,var(--t,var(--pri)) 18%,transparent);color:var(--t,var(--pri))}
.chip ha-icon{--mdc-icon-size:1.3em}
.chip.big{width:2.8em;height:2.8em;border-radius:.85em}.chip.big ha-icon{--mdc-icon-size:1.7em}

.title{display:flex;align-items:center;gap:.7em;min-width:0;min-height:4.2em}
.tt{min-width:0}
h1{margin:0;font-size:1.7em;font-weight:600;line-height:1.1;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tt p{margin:.25em 0 0;color:var(--mut);font-size:.9em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* Gerätebild oben rechts im Kopfbereich, zum Rand hin ausgeblendet; der Titel liegt darüber */
.bgimg{position:absolute;z-index:0;top:.9em;right:.9em;height:4.6em;width:auto;max-width:40%;object-fit:contain;object-position:right top;opacity:.5;pointer-events:none;
  -webkit-mask-image:radial-gradient(ellipse 80% 85% at 60% 40%,#000 45%,transparent 100%);mask-image:radial-gradient(ellipse 80% 85% at 60% 40%,#000 45%,transparent 100%)}

.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6em}
.tile{min-width:0;display:grid;gap:.35em;align-content:start;padding:.7em;background:var(--fill);border:1px solid var(--line);border-radius:1em}
.tile small{font-size:.85em;color:var(--mut);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.val{display:flex;align-items:baseline;gap:.25em;min-width:0}
.val b{font-size:1.5em;font-weight:600;line-height:1.1;font-variant-numeric:tabular-nums;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.val em,.pct em{font-style:normal;font-size:.85em;color:var(--mut);white-space:nowrap}
em:empty{display:none}
.tile.txt .val b{font-size:1.2em;line-height:1.375}
.tile.tone-warning .val b,.tile.tone-error .val b{color:var(--t)}
.tile:active,.row:active,.info:active{background:var(--fill-hi);transform:scale(.985)}
@media (hover:hover){.tile:hover,.row:hover,.info:hover{background:var(--fill-hi)}.lnk:hover{text-decoration:underline}}
.tile:focus-visible,.row:focus-visible,.info:focus-visible{outline:2px solid var(--pri);outline-offset:2px}

.row{width:100%;min-width:0;display:flex;align-items:center;gap:.8em;padding:.8em .9em}
.rb{flex:1;min-width:0;display:grid;gap:.45em}
.rt{display:flex;justify-content:space-between;align-items:baseline;gap:.6em;min-width:0}
.rt>b{font-size:1.05em;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pct{flex:none;display:flex;align-items:baseline;gap:.2em}
.pct b{font-size:1.25em;font-weight:600;font-variant-numeric:tabular-nums}
.row.tone-warning .pct b,.row.tone-error .pct b{color:var(--t)}
.bar{display:block;height:.3em;border-radius:.2em;background:var(--line);overflow:hidden}
.bar u{display:block;height:100%;border-radius:inherit;background:var(--t);text-decoration:none;transition:width .4s}
.uf{display:flex;justify-content:space-between;gap:.6em;color:var(--mut);font-size:.85em;min-width:0}
.uf .lnk{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.info{width:100%;min-width:0;display:flex;align-items:center;gap:.8em;padding:.6em .9em}
.at{display:grid;gap:.1em;min-width:0}
.at b{font-weight:600}
.at small{color:var(--mut);font-size:.85em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ab ~700 px (iPad, Kiosk): Arbeitsspeicher und Speicher nebeneinander; die Klasse setzt _applyTier() mit Hysterese */
.wide main{grid-template-columns:repeat(2,minmax(0,1fr))}
.wide .title,.wide .tiles,.wide .info{grid-column:1/-1}
/* schmal bis ~330 px (halbe Sections-Spalte, sehr kleine Displays): Messwerte als Zeilen untereinander, Belegt/Frei darf
   umbrechen; unter ~280 px ohne Symbol in den Balkenzeilen. Die Klassen setzt _applyTier() mit Hysterese */
.slim main{padding:12px}
.slim .tiles{grid-template-columns:minmax(0,1fr)}
.slim .tile{grid-template-columns:auto minmax(0,1fr) auto;align-items:center;column-gap:.6em;padding:.45em .6em}
.slim .tile.txt .val b{font-size:1.5em;line-height:1.1}
.slim .uf{flex-wrap:wrap;gap:.1em .6em}
.slim .at small{white-space:normal}
.slim .bgimg{max-width:34%}
.xslim .row{padding:.7em}
.xslim .row>.chip{display:none}
@media (prefers-reduced-motion:reduce){
  .bar u{transition:none}
  .tile:active,.row:active,.info:active{transform:none}
}`;
  }
}

if (!customElements.get("system-monitor")) customElements.define("system-monitor", SystemMonitorCard);

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "system-monitor")) {
  window.customCards.push({
    type: "system-monitor",
    name: "System Monitor",
    description: SMT().description,
    preview: true,
    documentationURL: "https://github.com/BeGiBue/home-assistant-system-monitor-card",
  });
}
console.info(`System Monitor Card v${SYSTEM_MONITOR_CARD_VERSION}`);
