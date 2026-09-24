# Your Story – Überarbeitung als Referenzprojekt

## Ergebnis

Die bestehende Next.js-App wurde für die Präsentation als eigenes Referenzprojekt überarbeitet. Kein Frameworkwechsel und keine Änderung der Hostinger-Bereitstellung. Die spielbare Demo steht jetzt vor der Kontoerstellung im Mittelpunkt.

## Änderungen

- Neue Startseite mit Petrol, Papierweiß und Salbeigrün, ruhiger Serifentypografie und Bildmaterial aus der vorhandenen Demo.
- Direkt spielbare Demo als Hauptaktion; Projektidee, Funktionsumfang und Studio als klar getrennte Einstiege.
- Drei auswählbare Szenen mit zugänglichen Buttons und Beschreibung. Szenen starten die vollständige Demo, keinen behaupteten Kapitelsprung.
- Gemeinsame Wortmarke und Infinity-Symbol, überarbeitete Navigation, Footer und Favicon.
- Anmeldung, Studio und Editor übernehmen das Farbsystem und passendes Bildmaterial.
- Neuen Besuchern wird beim Einstieg über „Konto erstellen“ direkt das Registrierungsformular gezeigt. Die bestehende Anmeldung bleibt erreichbar.
- FAQ beschreibt den tatsächlichen Projektstand. Englische Besucher erhalten den Hinweis auf die deutschsprachige Demo. Keine erfundenen Kundenbewertungen oder Verkaufsversprechen.
- Mobiles Menü schließt vor dem Sprung zum Abschnitt; Fokus wird zum Ziel geführt. Navigation zu Abschnitten funktioniert auch von Unterseiten aus.
- Sprachzustand über useSyncExternalStore, synchronisiert mit Browser-Einstellung und URL. React-Hook-Fehler im Studio und Editor bereinigt. Ein Sprachwechsel löst im Editor kein erneutes Laden des Entwurfs aus.
- Optimierte WebP-Bilder: Tanz 161 KB, Zuhause 139 KB, Sofa 212 KB (gerundet). Marketing- und Studio-Bilder verwenden next/image. Private Uploads verwenden unoptimized, damit die Kontoprüfung erhalten bleibt.
- Skip-Link, sichtbarer Fokus, verständliche Bildbeschreibungen und vorhandene Reduced-Motion-Regeln.

## Validierung

| Prüfung | Ergebnis |
| --- | --- |
| Produktionsbuild einschließlich Standalone-Assets | bestanden |
| TypeScript, npx tsc --noEmit | bestanden |
| ESLint | 0 Fehler; 2 vorhandene Warnungen in unveränderter Demo-Logik |
| Bestehende Demo-Prüfungen | 34 bestanden: 9 Arcade, 8 Moments, 17 Spielablauf |
| Browser, Startseite bei 320/390/768/1440 CSS-Pixeln | kein horizontaler Überlauf; keine defekten geladenen Bilder |
| Szene wechseln, FAQ aufklappen | bestanden |
| Sprache DE/EN umschalten | bestanden |
| Mobiles Menü schließen und zum Abschnitt springen | bestanden; Ziel und Fokus im Browser geprüft |
| Tastatur: Skip-Link, sichtbarer Fokus, Enter | bestanden |
| Login-Pflichtfelder | ungültige Felder erkannt; Fokus auf E-Mail |
| Login mit lokalem Testkonto | bestanden |
| Entwurf anlegen, Namen eintragen, Texte ergänzen, Autospeichern | bestanden |
| Entwurf nach Neuladen | Namen und gespeicherter Zustand bestätigt |
| Demo im Browser: falscher Code, Beispielcode, Spielstart, Pause | bestanden |
| Web Interface Guidelines | geänderte Oberfläche auf Semantik, Fokus, Bildmaße, responsives Layout und Bewegung geprüft |

Die Spielprüfungen laufen mit der vorhandenen lokalen DOM-/Canvas-Testumgebung; sie ersetzen keinen vollständigen manuellen Durchlauf auf einem echten Handy. Browserprüfungen wurden im integrierten Chromium-Browser durchgeführt. Kein separater Safari-/iOS-Test, keine Netzwerkausfall-Simulation und kein Lighthouse-Bericht. Reduced Motion wurde im CSS geprüft, nicht über eine OS-Einstellung aktiviert. Bild-Fallback: Beschreibungen und Hintergrund bleiben vorhanden; ein absichtlich provozierter Bildladefehler wurde nicht getestet.

## Vorschau und Stand

- Produktionsvorschau dieser Sitzung: http://127.0.0.1:3138/
- Start später: npm run build und npm start im Projektordner.
- Screenshot Einstieg: outputs/showcase-review/hero.png
- Screenshot Mobil: outputs/showcase-review/mobile.png
- Testdaten ausschließlich im lokalen Audit-Datenverzeichnis, nicht auf Hostinger.
- Kein Git-Push und kein öffentliches Deployment. Die bestehende Live-Seite ist noch unverändert.
- Bestehende Betreiber-/Datenschutzhinweise und noindex bleiben erhalten. Diese Überarbeitung ist keine Freigabe für einen öffentlichen Shop.

## Herkunft des Bildmaterials

Alle verwendeten Visuals stammen aus der bereits vorhandenen Luana-Demo: sofa-memory.png sowie die lokal vorhandenen Spielaufnahmen 01-club.png und 07-pablo-kitten.png. Für die Website wurden sie nur verkleinert und als WebP optimiert. Die Spiel-Logik blieb unverändert; die vorhandene Importprüfung bestätigt dies.
