# Spielkorrekturen – 25.09.2026

## Änderungen
- Sichtbare Namen in Demo, Dialogen, Metadaten und Website: Joe und Lana. Technische Sprite- und Speicherkennungen bleiben kompatibel, damit vorhandene Spielstände weiter funktionieren.
- Touch-Geräte starten automatisch im bildschirmfüllenden Seitenmodus; echtes Browser-Vollbild bleibt optional. Pause und Verlassen bleiben erreichbar.
- Die mobile Spielfläche übernimmt nicht länger die verkleinernde Laptop-Höhenberechnung. Dialoge und Kapiteltexte sind im Hochformat lesbar und bei Bedarf scrollbar.
- Tanz: ausschließlich große Pfeiltasten statt zusätzlichem überlappendem Joystick. Canvas-Berührungen während des Drehhinweises werden blockiert.
- Auto: linke und rechte Bildhälfte gedrückt halten. Beim Loslassen endet die seitliche Bewegung; das Auto fährt weiter vorwärts. Zwei gleichzeitig gehaltene Richtungen ergeben neutral. Abbruch, Fokusverlust, Pause und Drehung lösen die Eingaben. Pfeiltasten bleiben verfügbar; die neuen Flächen unterstützen auch Enter/Leertaste.
- Personen in den Wohnungsszenen auf ca. 300–310 statt 206–214 Canvas-Pixel vergrößert; Positionen angepasst. Originalbilder bleiben erhalten.
- Offline-Cache-Version angehoben.

## Prüfung
- Produktionsbuild und TypeScript: bestanden.
- Lint: keine Fehler; eine bereits vorhandene Warnung in der Straßenzeichnung.
- 34 bestehende Spielablauf-, Arcade- und Erinnerungsprüfungen bestanden. Die lokale Ablaufprüfung wurde an die neue gehaltene Lenkung angepasst. Prüfungen nutzen echte Spiellogik und Canvas mit DOM-Adapter, keinen echten Touchscreen.
- 10 zusätzliche Regressionstests in `scripts/verify-mobile.mjs`: bildschirmfüllender Touch-Einstieg, Joystick-Ausblendung, Halten/Loslassen, zwei Finger, pointercancel, verlorene Pointer-Erfassung, Pause, Drehung/Appwechsel und gerade Weiterfahrt bei 15/30/60/144 FPS.
- Echter Browser: Anfangsdialoge, Gang zu Maria, Tanz mit zwölf Treffern bis zum Kapitelabschluss, Fahrt-Einleitung, Lenkflächen, Pause und bildschirmfüllender Seitenmodus geprüft. Keine erfassten JavaScript-Fehler.
- Browsergrößen 320×568, 390×844, 844×390 und 1440×900: kein horizontaler Überlauf; geprüfter Dialog passt in seinen Bereich.
- Wohnung: neue Canvas-Aufnahme visuell kontrolliert, Ausgabe unter `outputs/mobile-fixes/09-present.png`.
- Geänderte Bedienelemente nach Web Interface Guidelines geprüft: beschriftete Buttons, Tastaturbedienung, sichtbarer Fokus, ausreichend große Touch-Flächen und Safe-Area-Abstände.

## Grenzen / Veröffentlichung
- Browserprüfung mit Größenanpassung und gesonderten simulierten Touch-Ereignissen; kein physisches iPhone/Android, kein Safari-Gerätetest. Das ursprünglich gemeldete gerätespezifische Symptom ist noch nicht genauer beschrieben.
- Kein neuer Bildausfall-/Offline-Netzwerktest; bestehende Ladefehleranzeige bleibt erhalten. Bestehende Canvas-Effekte wurden nicht vollständig auf reduzierte Bewegung umgestellt.
- Änderungen lokal fertig. Dieser Stand wurde noch nicht gepusht oder auf Hostinger veröffentlicht.

## Nachtrag: Grafikfehler auf dem Handy (Version 25.09.26 / 3)
- Nutzerfotos zeigen falsch ausgeschnittene Figuren, fehlende Porträts sowie alte Dialogtexte. Die genaue GPU-/Browserursache ist ohne betroffenes Gerät nicht reproduziert; ältere Texte belegen einen älteren aktiven Spielstand, nicht zwingend einen bestimmten Cache-Fehler.
- Laufzeit-Freistellung und Ausschnitte aus großen Sprite-Atlanten durch 14 vorbereitete transparente Einzelbilder ersetzt. Figuren, Köpfe und Aktionsposen verwenden jetzt einfache Bilddarstellung ohne Quellausschnitt. Reproduzierbare Erzeugung: `node scripts/prepare-demo-sprites.mjs`.
- Versionsgebundene Script-, CSS- und Bildadressen; Service Worker prüft Netzwerkantworten ohne stillschweigende Verwendung eines frischen HTTP-Caches. Sichtbare Versionsnummer im Footer. Ein bereits geöffnetes Spiel muss neu geladen werden; Spielstände werden nicht gelöscht.
- Produktionsbuild, Lint (eine bestehende Warnung), 34 Spielprüfungen und 10 mobile Steuerungsprüfungen erfolgreich. Browser-Einstieg mit einzelnen Figuren und vollständigem Porträt visuell geprüft; Aktionsszene zusätzlich als Canvas-Aufnahme kontrolliert.
- Eine Bestätigung auf dem betroffenen Handy steht aus. Die Änderung umgeht den fehleranfälligen Renderingpfad, ist kein Nachweis einer bestimmten Geräteursache.
