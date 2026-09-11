# YourStory auf Hostinger bereitstellen

Diese Anleitung beschreibt den aktuellen Hostinger-Stand ohne Cloudflare.

## 1. Node.js-Version

Wähle in Hostinger Node.js **22.x** oder neuer. Das Projekt setzt mindestens Node.js `22.13.0` voraus.

## 2. GitHub-Branch

Verbinde das Repository `giuseppegrifo98-glitch/YourStorygame.web` und deploye den Branch **main**.

## 3. Install Command

```bash
npm install
```

## 4. Build Command

```bash
npm run build
```

Der Build erzeugt einen Next.js-Standalone-Server unter `.next/standalone`. Das Postbuild-Skript kopiert die benötigten öffentlichen Assets automatisch dorthin.

## 5. Start Command

```bash
npm start
```

Der Startbefehl führt den erzeugten Standalone-Server aus und bindet standardmäßig an `0.0.0.0`. Hostinger stellt den Port über `PORT` bereit.

## 6. Environment Variables

Lege in Hostinger mindestens diese Variable an:

```text
YOURSTORY_DATA_DIR=/home/DEIN-BENUTZER/domains/DEINE-DOMAIN/yourstory-data
```

Der Ordner muss dauerhaft beschreibbar sein. Dort liegen die SQLite-Datenbank und die privaten Uploads. `PORT` wird normalerweise von Hostinger gesetzt und muss nicht manuell eingetragen werden.

## 7. Build Output

Verwendet wird der Next.js-Standalone-Output:

```text
.next/standalone
```

Nicht in Git committen: `node_modules/`, `.next/`, `data/` und lokale `.env`-Dateien.

## 8. Hostinger-Einstellungen

Wähle eine Node.js-Anwendung, setze den **Application Root** auf den Projektordner und verwende `npm install`, `npm run build` und `npm start`. Weise die gewünschte Domain dieser Node.js-Anwendung zu. Der Datenordner muss außerhalb eines automatisch gelöschten temporären Build-Verzeichnisses liegen.

## 9. GitHub mit Hostinger verbinden

In Hostinger wählst du beim Erstellen der Node.js-Anwendung die GitHub-Quelle aus, meldest dich bei GitHub an und wählst das Repository `giuseppegrifo98-glitch/YourStorygame.web` mit dem Branch `main`.

## 10. Nach einem GitHub-Push neu deployen

Öffne die Node.js-Anwendung in Hostinger und starte **Redeploy**, **Deploy latest commit** oder die entsprechende Aktualisierungsaktion. Hostinger lädt dann den neuesten Commit von `main`, führt Install und Build aus und startet die Anwendung neu.

## Sicherheit und offene Produktpunkte

Die aktuelle Version nimmt keine Zahlungen an und enthält noch keine fertige Originaldemo. Für einen öffentlichen Verkaufsstart müssen Betreiberangaben, Rechtstexte, Backups für den Datenordner, E-Mail-Verifizierung, Passwort-Reset, Monitoring und ein belastbares Löschkonzept ergänzt werden.
