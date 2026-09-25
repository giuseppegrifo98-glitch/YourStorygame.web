# Lokale Änderungen – noch nicht veröffentlicht

Stand: 25.09.2026, nach Schritt 1 und 2. Kein Push und kein Deployment durchgeführt.

- Wohnzimmer: einheitliche, perspektivisch skalierte Erwachsene (Joe bis 450, Lana bis 430 Canvas-Pixel), angepasste Abstände und Jahreszeitenüberschrift. 34 Spieltests und Lint bestanden.
- Hauptseite: die drei vom Nutzer gelieferten JPG-Dateien unverändert übernommen. Reihenfolge Tanz / Verfolgungsjagd / Pablo mit passenden Kapiteln 01 / 03 / 04, Texten und Alternativtexten. Vollständige Bilder statt Beschnitt; keine zusätzlichen Bild-Overlays.
- Spielstartseite: Erinnerungssticker im normalen Layout unter dem Bild (25 Pixel Abstand mobil, 30 Pixel Desktop); Bildtitel frei. Dekorativer Überschriftenstern auf kleinen Bildschirmen ausgeblendet, da er horizontalen Überlauf verursachte.
- Browser: drei Bildwechsel geprüft; Sticker-Abstand bei 320, 412 und 1440 Pixeln geprüft. Nach Korrektur kein horizontaler Überlauf der Startseite bei 320 und 412 Pixeln. Falscher Code zeigt verständlichen PABLO-Hinweis.
- Lint, TypeScript und Produktionsbuild erfolgreich. Die abschließende reine CSS-Korrektur des Sterns anschließend im Browser geprüft.
- Noch kein Test auf physischem S25 Ultra. Öffentlich bleibt Version 4 unverändert. Bei später freigegebener Veröffentlichung Demo-Assetversion und Service-Worker-Cache gemeinsam erhöhen.

- Ergänzung: Verfolgungsjagd-Vorschau durch 232708.jpg ersetzt (chase-selected-2.jpg). Rücklink als kontrastreicher 46-Pixel-Button in Kopf- und Fußbereich, mobil über die verfügbare Breite. Zusätzlich direkter Hauptseiten-Link in den Vollbild-Spielwerkzeugen. Mobile Breite 412 Pixel ohne Überlauf und Rücknavigation im Browser bestätigt; neues Vorschaubild lädt. Lint und Produktionsbuild erfolgreich. Weiterhin nicht veröffentlicht.

## Veröffentlichungsfreigabe
Der Nutzer hat anschließend Push und Live-Veröffentlichung ausdrücklich freigegeben. Die oben dokumentierten lokalen Änderungen werden gemeinsam als Version 5 veröffentlicht; Demo-Dateien und Service Worker sind dafür versioniert.
