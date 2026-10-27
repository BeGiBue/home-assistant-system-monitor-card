# Security-Review – System Monitor Card

Stand: 2026-10-24, Version 2.0.0.

## Ergebnis und Befunde

Im geprüften Projektcode wurden keine bestätigten Sicherheitslücken und insbesondere keine offenen hohen oder kritischen Befunde festgestellt. Das ist ein begrenztes Code-Review und keine Sicherheitsgarantie für Home Assistant, Geräteintegrationen oder den Browser.

| Risiko / Beobachtung | Schweregrad | Korrektur / Status |
| --- | --- | --- |
| Eigene Bild-URLs werden direkt vom Browser geladen. Externe Hosts sehen die Browser-IP; konfigurierte HTTP-URLs sind unverschlüsselt. | Niedrig, Konfigurationsrisiko | Lokale `/local/`-Bilder oder vertrauenswürdige HTTPS-Quellen verwenden, keine Zugangsdaten in URLs. In der README dokumentiert; externe Bildquellen bleiben optional verfügbar. |
| `innerHTML` ist ein sicherheitsrelevanter Sink; kein bestätigter ungefilterter Eingabepfad gefunden. | Information | Vorhandenes Escaping beibehalten und adversariale Regressionstests ausführen; umgesetzt. |

Die Bild-URLs stehen ausschließlich in HTML-escaped, doppelt zitierten `img.src`-Attributen. Es gibt keine dynamischen Navigationslinks, Script-URLs oder HTML-Event-Attribute. Ein Attributausbruch ist durch das Escaping verhindert; eine JavaScript-Ausführung über ein Bild wurde nicht nachgewiesen. Ein URL-Protokollfilter wird daher nicht als behobene XSS-Lücke ausgegeben.

## Geprüfte Vertrauensgrenzen

- Die gesamte JavaScript-Datei wurde gelesen. `outerHTML`, `insertAdjacentHTML`, `eval` und `new Function` werden nicht eingesetzt.
- Entity-Zustände, Einheiten, formatierte Zustände, Konfigurationstexte, Icons und Entity-Identifier wurden bis zum HTML-Sink verfolgt. Der vorhandene Escaper ersetzt `&`, `<`, `>` und beide Anführungszeichen. Kontrollierte konstante HTML-Fragmente bleiben bewusst Markup.
- Zahlen in dynamischen Styles werden in Zahlen umgewandelt und begrenzt; daraus entsteht kein injizierbarer Attributtext. Event-Handler werden nach dem Rendern als Funktionen gebunden.
- Die Karte ist lesend: Sie nutzt Home-Assistant-Zustände und öffnet bei Benutzerinteraktion den `hass-more-info`-Dialog. Sie sendet keine eigenen API-, WebSocket- oder Service-Anfragen.
- Keine eigenen Zugangsdaten, Tokens, gespeicherten Geheimnisse oder externen API-Endpunkte im Laufzeitcode. Bild-URLs sind die einzige konfigurierbare externe Netzwerkquelle.
- Keine npm-/Python-Laufzeitabhängigkeiten, kein Paketmanager-Manifest und kein Lockfile. Das eingebettete Bild ist ein Asset. Home Assistant und Browser gehören zu den technischen Voraussetzungen und müssen unabhängig aktuell gehalten werden.

## Tests

Das Review erforderte keinen Sicherheitsfix im Laufzeitcode. Die bestehende Sicherheitsgrenze wird durch Tests in `tests/security.test.mjs` abgesichert: Titel/Konfiguration, Entity-Zustand, Einheit bei numerischem Zustand, Bild-URL mit Attributausbruch und Entity-Identifier. Der Validate-Workflow führt die Syntaxprüfung und diese Tests bei jedem Push auf `main` und bei Pull Requests aus.

Die Tests rendern die tatsächlichen Kartentemplates mit DOM-Attrappen. Sie ersetzen keinen echten Browser und keinen Home-Assistant-Gerätetest.

## Restrisiken

- Die Vertrauensentscheidung für eigene Bildquellen liegt bei der Person, die die Karte konfiguriert.
- Gerätespezifisches Verhalten (grafischer Editor, vorhandene Konfiguration, Entitätsdetails) lässt sich nur in Home Assistant selbst prüfen.
