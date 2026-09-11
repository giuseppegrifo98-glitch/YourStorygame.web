# YourStorygame.web

YourStory ist eine internationale Website für persönliche, spielbare Erinnerungen. Dieser Stand ist als normale Next.js-/Node.js-Anwendung für Hostinger vorbereitet.

## Lokale Entwicklung

Voraussetzung: Node.js 22 oder neuer.

```bash
npm install
npm run dev
```

Die App läuft danach unter `http://localhost:3000`.

## Speicherung

Die Anwendung nutzt keine Cloudflare-Dienste. Entwürfe und Konten werden in einer lokalen SQLite-Datei gespeichert. Bilder werden unter `data/uploads/` abgelegt. Für Hostinger sollte `YOURSTORY_DATA_DIR` auf ein dauerhaftes, beschreibbares Verzeichnis außerhalb des temporären Build-Ordners zeigen.

## Aktueller Produktstand

- Verkaufsseite auf Deutsch und Englisch
- eigenes Konto mit Anmeldung und Registrierung
- geschütztes Studio für persönliche Entwürfe
- automatische Speicherung von Namen, Erinnerungen und Nachricht
- private Bildreferenzen
- spielbare Originaldemo für Luana unter `/demo`, mit fünf Kapiteln und Handy-Steuerung
- keine Zahlungen aktiviert

## Originaldemo

Die freigegebene Demo liegt unter `public/demo/` und ist über `/demo` erreichbar. Der sichtbare Testcode lautet **PABLO**. Sie benötigt kein Konto; Spielstände bleiben im jeweiligen Browser gespeichert und werden nicht geräteübergreifend synchronisiert.

Die Spiel-Dateien und benötigten Illustrationen stammen aus der fertig ausgearbeiteten Luana-Demo. Lokale Übergabenotizen, Testberichte, ZIP-Archive und Originalfotos sind nicht Teil dieser Veröffentlichung. Die Demo verwendet nur lokale Dateien; sie benötigt keinen separaten Server oder zusätzliche Umgebungsvariablen.

Nach dem GitHub-Push in Hostinger den neuesten Stand von `main` bereitstellen. Die Demo ist dann unter `https://DEINE-DOMAIN/demo` erreichbar.
