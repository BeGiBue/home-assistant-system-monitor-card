# Changelog

## 2.2.0 - 2026-11-11

- New look in line with the NAS, Eaton UPS and TouchKio cards: three large tiles for CPU, temperature and power supply, memory and storage as panels with a bar, last boot as its own row. Bars and values use the accent colour and turn orange or red above the thresholds. / Neues Aussehen passend zu NAS-, Eaton-UPS- und TouchKio-Card: drei große Kacheln für CPU, Temperatur und Netzteil, Arbeitsspeicher und Speicher als Felder mit Balken, „Letzter Start" als eigene Zeile. Balken und Werte nutzen die Akzentfarbe und werden oberhalb der Schwellwerte orange oder rot.
- The card is built once and then only sets the values that changed, and only when one of its own entities changed. The keyboard focus survives incoming values, bars glide to the new value, and the device image is no longer reloaded. / Die Karte wird einmal aufgebaut und setzt danach nur geänderte Werte, und nur wenn sich eine eigene Entität geändert hat. Der Tastaturfokus übersteht eintreffende Werte, die Balken gleiten zum neuen Wert, das Gerätebild wird nicht mehr neu geladen.
- Unavailable or unknown values are shown as "—" in grey with an empty bar instead of 0 %. / Nicht verfügbare oder unbekannte Werte erscheinen als „—" in Grau mit leerem Balken statt als 0 %.
- Text and spacing grow with the card width (phone, tablet, kiosk); from about 700 px memory and storage sit side by side. A few pixels of width change no longer make the layout flip. / Schrift und Abstände wachsen mit der Kartenbreite (Handy, Tablet, Kiosk); ab etwa 700 px stehen Arbeitsspeicher und Speicher nebeneinander. Wenige Pixel Breitenänderung lassen das Layout nicht mehr kippen.
- The fixed height of 6 rows is gone: the card is as tall as its content (about 50 px taller on a phone) and reports the height it needs to the Sections dashboard. Minimum width in Sections is now 6 columns instead of 3; below about 330 px the three values are stacked as rows. / Die feste Höhe von 6 Zeilen entfällt: Die Karte ist so hoch wie ihr Inhalt (auf dem Handy etwa 50 px höher) und meldet dem Sections-Dashboard die benötigte Höhe. Die Mindestbreite in Sections beträgt jetzt 6 statt 3 Spalten; unter etwa 330 px stehen die drei Messwerte als Zeilen untereinander.
- Long or non-numeric values no longer push labels away; large used/free values wrap instead of being cut. / Lange oder nicht-numerische Werte verdrängen keine Beschriftungen mehr; große Belegt/Frei-Werte brechen um, statt gekürzt zu werden.
- Visible focus outline and press feedback on all buttons; respects "reduce motion". / Sichtbarer Fokusrahmen und Rückmeldung beim Antippen auf allen Schaltflächen; beachtet „Bewegung reduzieren".
- Card type, options and entities are unchanged. / Kartentyp, Optionen und Entitäten bleiben unverändert.
- Browser tests added (no rebuild on value changes, unavailable values, layout at several widths). / Browser-Tests ergänzt (kein Neuaufbau bei Wertänderungen, nicht verfügbare Werte, Layout in mehreren Breiten).

## 2.1.0 - 2026-11-04

- The card and its editor now appear in English by default and in German when Home Assistant is set to German. / Karte und Editor erscheinen jetzt standardmäßig auf Englisch und auf Deutsch, wenn Home Assistant auf Deutsch eingestellt ist.
- The default titles for memory and storage follow the Home Assistant language; titles already saved in a card stay unchanged. / Die Standardtitel für Arbeitsspeicher und Speicher folgen der Sprache von Home Assistant; bereits gespeicherte Titel bleiben unverändert.
- README shortened and available in English and German. / README gekürzt und auf Englisch und Deutsch verfügbar.

## 2.0.1 - 2026-10-27

- Aufräumarbeiten ohne Funktionsänderung: doppelten Baustein der Netzteil-Kachel mit den anderen Kacheln zusammengeführt und eine überflüssige Prüfung entfernt. Aussehen, Konfiguration und Verhalten bleiben unverändert.
- Repository verschlankt: nicht benötigte Logo-Dateien, interne Release-Checkliste und die Pflicht-Datei `RELEASE_NOTES_<Version>.md` entfernt (der Release-Text kommt jetzt aus diesem Changelog).

## 2.0.0 - 2026-10-24

- Aufnahme in den offiziellen HACS-Katalog; Installation über die HACS-Suche als Standardweg dokumentiert.
- Migration bestehender Custom-Repositories beschrieben: nur den benutzerdefinierten Eintrag entfernen, die Installation und vorhandene Dashboard-Konfigurationen erhalten.
- README auf Funktionen, Voraussetzungen, Konfiguration und Bedienung ausgerichtet.
- Adversariale Rendering-Tests für DOM-Ausgaben, Entity-Werte, Attribute, Bild-URLs und Home-Assistant-Schnittstellen ergänzt.
- Major-Version als Kennzeichnung des HACS-Katalogeintrags: kein automatischer Hinweis auf Breaking Changes; vorhandene Kartentypen und Konfigurationen bleiben kompatibel.

## 1.0.4

- Neue, im Browser erstellte Vorschauen aus dem unveränderten Original-Code in der README.
- Vorschau-Bilder über absolute Raw-URLs für die Anzeige in GitHub und HACS eingebunden.
- Versionsangaben für das Patch-Release aktualisiert.

Keine Änderungen an der Funktionsweise der Karte oder Integration.

## 1.0.3 - 2026-10-08

### Behoben

- Die Card wurde im Sections-Dashboard unten abgeschnitten. Die feste Höhe beträgt jetzt 6 Zeilen (376 px) statt 5 Zeilen (312 px), damit der Inhalt auch mit den Schriften von Home Assistant vollständig hineinpasst.
- Masonry-Dashboards: `getCardSize()` meldet 8 statt 6.

Nach dem Update über HACS den Browser vollständig neu laden. Falls die alte Höhe noch angezeigt wird, die Card einmal im Layout-Editor öffnen und speichern.

## 1.0.2 - 2026-10-08

### Geändert

- Feste Höhe im Sections-Dashboard: 5 Zeilen (312 px), im Layout-Editor nicht änderbar. Die Card füllt diese Höhe und verteilt den Inhalt gleichmäßig; der Inhalt passt bei Kartenbreiten ab 240 px ohne Überlauf hinein.
- Masonry-Dashboards: `getCardSize()` meldet 6 statt 4.

## 1.0.1 - 2026-10-08

### Hinzugefügt

- Platinen-Illustration des Raspberry Pi 5 oben rechts im Kopfbereich, direkt in `system-monitor.js` eingebettet (eigene Zeichnung ohne Logo), mit Deckkraft 65 %.
- Neue Optionen `show_image` (Bild ausblenden) und `image_url` (eigenes Bild); beide im visuellen Editor einstellbar.
- Link zum Hinzufügen des Repositories in HACS im README und in den Release Notes.

### Geändert

- Schmale Layouts richten sich über Container-Abfragen nach der Kartenbreite statt nach dem Browserfenster: unter 380 px werden die Kacheln enger, unter 320 px liegt das Bild abgedunkelt hinter dem Titel.

## 1.0.0 - 2026-10-07

### Hinzugefügt

- Erste öffentliche Version der System Monitor Card für Home Assistant, vorkonfiguriert für einen Raspberry Pi 5 mit der Integration „System Monitor“.
- Kompakte Darstellung im Stil der NAS Card: Kopfzeile, drei Kacheln (CPU, Temperatur, Netzteil), zwei Balkenzeilen (Arbeitsspeicher, Speicher) und „Letzter Start“.
- Netzteil-/Spannungsstatus über `binary_sensor.rpi_power_status` (Raspberry Pi Power Supply Checker): „OK“ oder rot „Warnung / Spannung“.
- Warnfarben nach Schwellwerten: CPU ab 60/85 %, Temperatur ab 60/75 °C, RAM ab 70/90 %, Speicher ab 75/90 %.
- Farben ausschließlich aus dem aktiven Home-Assistant-Theme.
- Nativer visueller Editor mit Entity-Pickern und Textfeldern (`getConfigForm`), Symbol per Icon-Picker wählbar.
- Breite im Sections-Dashboard von 3 bis 12 Spalten einstellbar; Höhe ergibt sich automatisch.
- Tippen auf Kacheln, Balken sowie „Belegt“ und „Frei“ öffnet die Detailansicht der jeweiligen Entität.
- HACS-Unterstützung als Dashboard-Plugin (`hacs.json`) mit Validierungs-Workflow.
