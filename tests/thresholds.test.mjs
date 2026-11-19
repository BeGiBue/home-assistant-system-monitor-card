import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function card(config, temp) {
  const defs = new Map();
  vm.runInNewContext(readFileSync(new URL("../system-monitor.js", import.meta.url), "utf8"), {
    HTMLElement: class { attachShadow() { this.shadowRoot = { innerHTML: "", querySelector: () => null, querySelectorAll: () => [] }; } dispatchEvent() {} },
    customElements: { get: (n) => defs.get(n), define: (n, c) => defs.set(n, c) },
    window: {}, console: { info() {} }, CustomEvent: class {}, setTimeout, clearTimeout,
  });
  const c = new (defs.get("system-monitor"))();
  c.setConfig(config);
  c.hass = { language: "de", locale: { language: "de" }, states: { "sensor.system_monitor_processor_temperature": { state: String(temp), attributes: { unit_of_measurement: "°C" } } } };
  return c._computeParts().temp.cls;
}

test("defaults fit a Raspberry Pi 5 without cooling (orange from 75 °C, red from 80 °C)", () => {
  assert.match(card({}, 65), /tone-primary/);
  assert.match(card({}, 74.9), /tone-primary/);
  assert.match(card({}, 75), /tone-warning/);
  assert.match(card({}, 80), /tone-error/);
});

test("thresholds from the editor are used", () => {
  const cfg = { temperature_warning: 60, temperature_critical: 70 };
  assert.match(card(cfg, 59), /tone-primary/);
  assert.match(card(cfg, 65), /tone-warning/);
  assert.match(card(cfg, 70), /tone-error/);
});

test("empty or invalid thresholds fall back to the defaults; red never below orange", () => {
  assert.match(card({ temperature_warning: "", temperature_critical: "abc" }, 76), /tone-warning/);
  assert.match(card({ temperature_warning: 85, temperature_critical: 70 }, 80), /tone-primary/);
  assert.match(card({ temperature_warning: 85, temperature_critical: 70 }, 85), /tone-error/);
});

test("editor offers both thresholds with labels and helpers", () => {
  const defs = new Map();
  vm.runInNewContext(readFileSync(new URL("../system-monitor.js", import.meta.url), "utf8"), {
    HTMLElement: class {}, customElements: { get: (n) => defs.get(n), define: (n, c) => defs.set(n, c) }, window: {}, console: { info() {} },
  });
  const f = defs.get("system-monitor").getConfigForm();
  const sys = f.schema.find((s) => s.name === "system").schema.map((s) => s.name);
  assert.deepEqual([...sys], ["cpu_entity", "temperature_entity", "temperature_warning", "temperature_critical", "power_entity"]);
  for (const n of ["temperature_warning", "temperature_critical"]) {
    assert.ok(f.computeLabel({ name: n }));
    assert.ok(f.computeHelper({ name: n }));
  }
  assert.equal(f.computeHelper({ name: "title" }), undefined);
});
