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
- keine Zahlungen und keine fertige Originaldemo aktiviert

Die echte Originaldemo wird später ergänzt. Persönliche Inhalte aus anderen Projekten gehören nicht zu diesem Repository.
