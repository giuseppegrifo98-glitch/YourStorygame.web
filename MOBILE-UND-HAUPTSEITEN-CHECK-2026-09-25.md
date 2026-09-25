# Mobile Bedienung und Hauptseitenprüfung – Version 4, 25.09.2026

## Umgesetzt
- Auto: Fahrt wartet auf „▶ Fahrt starten“. Nach dem Start verschwinden beide Daumenhinweise, der Startknopf und die Hinweiszeile. Unsichtbare linke/rechte Bildschirmhälften bleiben zum Halten aktiv. Loslassen beendet das seitliche Lenken; der Tacho bleibt sichtbar. Neue Versuche erhalten erneut die Anleitung.
- Rennen: Joystick und dessen Beschriftung entfernt, große Sprungtaste mit 116 × 94 CSS-Pixeln. Tastaturaktivierung löst ebenfalls einen Sprung aus.
- Pablo: kein Joystick. Sprechblase mit direkter Fingeranleitung und dezent bewegtem Handzeichen. Sie verschwindet bei erster Berührung, Mausbewegung oder Tastaturbewegung. Animation berücksichtigt reduzierte Bewegung. Leckerlis werden weiterhin erst durch Pablos tatsächliche Bewegung gesammelt.
- Hauptseite: drei aktuelle Szenenaufnahmen mit neuen Dateinamen. Kapitel 05 zeigt jetzt tatsächlich die Gegenwart statt der Sofa-Erinnerung aus Kapitel 04. Hero verwendet die aktuelle Sofa-Illustration. Veralteten Bildnachweis auf der verlinkten Informationsseite korrigiert.
- Versionierte Demo-Dateien und Service-Worker-Cache auf Version 4 angehoben.

## Hauptseite geprüft
- Hero, Projektfakten, Szenenauswahl, Idee, Projekt/Studio, FAQ, Abschluss-CTA und Footer inhaltlich und anhand des Browser-DOM geprüft.
- Browserbreiten 320, 412 und 1440 CSS-Pixel: kein horizontaler Überlauf in den gemessenen Ansichten.
- Szenenauswahl per Klick und Enter, aktuelle geladene Bilder, FAQ-Aufklappen, DE/EN-Wechsel und mobiles Menü mit Ankernavigation geprüft.
- Alle Hauptseiten-Ziele liefern HTTP 200: Demo, Erstellen, Studio (korrekte Weiterleitung zum Login), Hilfe, Datenschutz, Impressum.
- Hauptseite besitzt kein Eingabeformular. Geschenkcode-Validierung ist in den Spieltests abgedeckt. Kontoerstellung und Uploads sind nicht Teil dieser Änderung und wurden nicht erneut ausgeführt.
- Sichtbare Fokusstile, beschriftete Buttons, Bildabmessungen, Lazy Loading unterhalb des ersten Bildschirms, reduzierte Bewegung und klare Trennung von Demo und Studio im Code kontrolliert; Web Interface Guidelines berücksichtigt.
- Keine erfundenen Kundenbelege, Preise oder Bestellfunktionen. Funktionierende Demo bleibt Hauptaktion; Studio wird als Entwurfsfunktion beschrieben.

## Verifikation
- 15 automatisierte mobile Steuerungstests bestanden.
- 34 Spiel-/Arcade-/Pablo-Tests bestanden (VM-Adapter und native Canvas-Ausgabe).
- Die drei geänderten Szenen mit echter Spiel- und Steuerungslogik in einer separaten lokalen Browser-Testansicht geprüft: Start per Enter, Fokus zurück auf Spielfeld, ausgeblendete Fahrhinweise, große Sprungtaste ohne Joystick, Pablo-Hinweis verschwindet beim ersten Klick. Keine JavaScript-Fehler. Die Testansicht ist nicht Teil der Veröffentlichung.
- Lint ohne Warnungen und Fehler, TypeScript und Produktionsbuild erfolgreich.

## Grenzen und verbleibende Punkte
- Kein physisches S25 Ultra verbunden. Browserbreiten und simulierte Touch-Erkennung ersetzen den Gerätetest nicht.
- Offline-Neuinstallation, erzwungene Bildladefehler und vollständige Screenreader-Navigation nicht erneut geprüft; vorhandene Alternativtexte und Spielladefehleranzeige im Code kontrolliert.
- Anbieter-/Kontaktangaben auf der Informationsseite sind weiterhin unvollständig. Diese Daten müssen vom Betreiber kommen; keine Daten erfunden und keine rechtliche Vollständigkeit behauptet.
- Neue Screenshots werden aktuell aus der Spielverifikation exportiert. Bei künftigen Grafikänderungen diese Vorschauen mit aktualisieren.

