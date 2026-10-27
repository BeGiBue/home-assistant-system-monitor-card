<p align="center">
  <img src="https://raw.githubusercontent.com/BeGiBue/home-assistant-system-monitor-card/main/images/system-monitor-card-logo-160.png?v=2" alt="System Monitor Card" width="160">
</p>

# System Monitor Card

Kompakte Custom-Card zur Überwachung des Hosts, auf dem Home Assistant läuft – vorkonfiguriert für einen **Raspberry Pi 5** mit der Integration **System Monitor**.

**Version 2.0.1**

## Vorschau

| Normalbetrieb | Unterspannung |
| --- | --- |
| <img src="https://raw.githubusercontent.com/BeGiBue/home-assistant-system-monitor-card/main/screenshots/system-monitor-normal-350-light.png" width="350" alt="System Monitor im Normalbetrieb, 350 px Kartenbreite, helles Theme"> | <img src="https://raw.githubusercontent.com/BeGiBue/home-assistant-system-monitor-card/main/screenshots/system-monitor-undervoltage-350-light.png" width="350" alt="System Monitor mit Unterspannungswarnung, 350 px Kartenbreite, helles Theme"> |

## Funktionen

- Theme-sensitive Darstellung: alle Farben kommen aus dem aktiven Home-Assistant-Theme (Light Mode, Dark Mode und benutzerdefinierte Themes)
- Editierbarer Titel und Untertitel sowie frei wählbares Symbol, Standard `mdi:raspberry-pi`
- Platinen-Illustration des Raspberry Pi 5 oben rechts; optional eigene Bild-URL oder ausblendbar
- Drei Kacheln: CPU-Auslastung, CPU-Temperatur und Netzteil-/Spannungsstatus
- Arbeitsspeicher und Speicher als Fortschrittsbalken mit Prozentwert sowie Belegt und Frei
- Warnfarben nach Schwellwerten: grün, orange und rot
- „Letzter Start“ mit dem Zeit-/Datumsformat von Home Assistant
- Tippen auf Kacheln, Balken sowie Belegt und Frei öffnet die Detailansicht der jeweiligen Entität
- Alle Entitäten über native Home-Assistant-Entity-Picker auswählbar
- Breite im Sections-Dashboard frei von 3 bis 12 Spalten einstellbar, feste Höhe (siehe Layout / Größe)

## Warnfarben

| Wert | Orange ab | Rot ab |
| --- | --- | --- |
| CPU-Auslastung | 60 % | 85 % |
| CPU-Temperatur | 60 °C | 75 °C |
| Arbeitsspeicher | 70 % | 90 % |
| Speicher | 75 % | 90 % |
| Netzteil | – | Unterspannung erkannt |

Die Netzteil-Kachel zeigt „OK“ oder rot „Warnung / Spannung“.

## Voraussetzungen

- Integration **System Monitor** (Einstellungen → Geräte & Dienste), sie liefert Prozessor, Speicher, Festplatte und letzten Start.
- Optional: Integration **Raspberry Pi Power Supply Checker** für den Netzteil-Status (`binary_sensor.rpi_power_status`).

## Standard-Entitäten

Die Card ist für folgende Entitäten vorkonfiguriert:

```
sensor.system_monitor_processor_use
sensor.system_monitor_processor_temperature
binary_sensor.rpi_power_status
sensor.system_monitor_memory_use_percent
sensor.system_monitor_memory_use
sensor.system_monitor_memory_free
sensor.system_monitor_disk_use_percent
sensor.system_monitor_disk_use
sensor.system_monitor_disk_free
sensor.system_monitor_last_boot
```

Die Entity-IDs können je nach Home-Assistant-Version und Systemname abweichen. Alle Entitäten lassen sich im grafischen Karteneditor ändern.

## Installation über HACS

Das Projekt ist im offiziellen HACS-Katalog enthalten. Ein benutzerdefiniertes Repository ist für die reguläre Installation nicht erforderlich.

1. HACS öffnen und nach **System Monitor Card** suchen.
2. **System Monitor Card** auswählen und installieren.
3. Browser bzw. Home-Assistant-App vollständig neu laden.
4. Die Karte im Dashboard hinzufügen und die Entitäten auswählen.

[![In HACS öffnen](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=BeGiBue&repository=home-assistant-system-monitor-card&category=plugin)

### Bestehende Installation aus einem Custom Repository übernehmen

1. Prüfen, ob **System Monitor Card** in der HACS-Suche im offiziellen Katalog verfügbar ist. Falls noch nicht, HACS aktualisieren und den bisherigen Eintrag vorerst behalten.
2. Sobald der Katalogeintrag verfügbar ist, unter **HACS → Benutzerdefinierte Repositories** nur den Eintrag für `BeGiBue/home-assistant-system-monitor-card` entfernen.
3. Die bestehende Installation **nicht deinstallieren**. Dashboard-Karten, YAML-Konfiguration und vorhandene Ressourcen beibehalten.
4. HACS aktualisieren bzw. die Repository-Informationen neu laden und prüfen, dass die installierte Karte weiterhin erkannt wird und Updates angeboten werden.
5. Nach einem Update das Frontend neu laden und die bestehenden Karten prüfen. Der Kartentyp `custom:system-monitor` und die Konfigurationsschlüssel bleiben erhalten.

Die Major-Version 2.0.0 kennzeichnet die Aufnahme in den offiziellen HACS-Katalog und bedeutet nicht automatisch Breaking Changes. Diese Version verlangt keine Änderung vorhandener Kartenkonfigurationen.

### Ohne HACS

1. `system-monitor.js` nach `/config/www/` kopieren.
2. Unter Einstellungen → Dashboards → Ressourcen eine Ressource hinzufügen: URL `/local/system-monitor.js`, Typ **JavaScript-Modul**.
3. Browser vollständig neu laden.

## Card hinzufügen

Minimal:

```yaml
type: custom:system-monitor
```

Mit eigenen Bezeichnungen:

```yaml
type: custom:system-monitor
title: System Monitor
subtitle: Raspberry Pi 5
icon: mdi:raspberry-pi
show_image: true
```

Vollständiges Beispiel mit den Standard-Entitäten:

```yaml
type: custom:system-monitor
title: System Monitor
subtitle: Raspberry Pi 5
icon: mdi:raspberry-pi
show_image: true
image_url: ''
cpu_entity: sensor.system_monitor_processor_use
temperature_entity: sensor.system_monitor_processor_temperature
power_entity: binary_sensor.rpi_power_status
memory_title: Arbeitsspeicher
memory_percent_entity: sensor.system_monitor_memory_use_percent
memory_used_entity: sensor.system_monitor_memory_use
memory_free_entity: sensor.system_monitor_memory_free
disk_title: Speicher
disk_percent_entity: sensor.system_monitor_disk_use_percent
disk_used_entity: sensor.system_monitor_disk_use
disk_free_entity: sensor.system_monitor_disk_free
last_start_entity: sensor.system_monitor_last_boot
```

## Bild

Oben rechts zeigt die Card eine Illustration des Raspberry Pi 5. Sie ist eine eigene, vereinfachte Zeichnung ohne Logo und direkt eingebettet; es wird kein separates Bild geladen.

Für ein eigenes Bild, zum Beispiel ein freigestelltes Foto, kann im grafischen Editor eine Bild-URL eingetragen werden:

```yaml
image_url: /local/images/pi5.png
```

Mit `show_image: false` wird das Bild vollständig ausgeblendet. Bei sehr schmalen Karten (unter 320 px) liegt das Bild abgedunkelt hinter dem Titel, damit der Text lesbar bleibt.

Eigene Bild-URLs lädt der Browser direkt. Externe Anbieter sehen dabei die IP-Adresse des Browsers; HTTP-Bilder bieten keine Transportverschlüsselung und können unter HTTPS blockiert werden. Bevorzugt lokale `/local/`-Bilder oder vertrauenswürdige HTTPS-Quellen verwenden und keine Zugangsdaten in Bild-URLs hinterlegen.

## Grafischer Editor

Die Card verwendet den eingebauten Formular-Editor von Home Assistant (`getConfigForm()`). Titel, Untertitel und Bild-URL sind native Textfelder, das Symbol ein Icon-Picker, die Bildanzeige ein Schalter und alle Entitäten native Entity-Picker.

Die Gruppen **Allgemein**, **System**, **Arbeitsspeicher**, **Speicher** und **Start** können im Editor aufgeklappt werden.

## Layout / Größe

Im Home-Assistant-Sections-Dashboard ist die Breite frei einstellbar (3 bis 12 Spalten). Die Höhe ist fest auf 6 Zeilen (376 px) eingestellt und lässt sich im Layout-Editor nicht ändern; die Card füllt diese Höhe und verteilt den Inhalt gleichmäßig. In Masonry-Dashboards meldet die Card über `getCardSize()` eine passende Höhe.

## Hinweise zu Marken

Dieses Projekt ist ein unabhängiges Community-Projekt und steht in keiner Verbindung zu Raspberry Pi Ltd oder Home Assistant. Es wird weder von Raspberry Pi Ltd noch von Home Assistant unterstützt oder herausgegeben.

**Raspberry Pi** ist eine Marke der Raspberry Pi Ltd.

## Lizenz

GNU Affero General Public License v3.0 only (**AGPL-3.0-only**).

Nutzung, Änderungen und Weitergabe sind unter den Bedingungen der AGPL erlaubt; abgeleitete Werke müssen unter derselben Lizenz stehen. Bei modifizierten Versionen, die über ein Netzwerk genutzt werden, muss der entsprechende Quellcode den Nutzern zugänglich gemacht werden.

Details stehen in [`LICENSE`](LICENSE).
