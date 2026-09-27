# Charakterwechsel – lokaler Stand vom 27.09.2026

Joe und Lana behalten ihre Namen und die vorhandene Geschichte. Ihr Aussehen ist vollständig neu gestaltet. Die Katze Pablo wurde durch den braun-weißen Hund Esco ersetzt. Keine Veröffentlichung und kein Git-Push durchgeführt.

## Umsetzung

- Neue Einzelgrafiken für Joe, Lana und Esco, Joe beim Rennen und in der Abwehrhaltung sowie neue Dialogporträts.
- Esco erscheint als kleiner Welpe und später größer; Texte, Aufgaben, Hinweisblase, Leckerli-Zähler und Beispielcode heißen jetzt Esco/ESCO.
- Neues Sofabild mit denselben Figuren und Esco. Hauptseite, Studio und Editor verwenden neue Bilder. Die drei Szenenvorschauen stammen aus dem tatsächlich gerenderten Spiel.
- Figurenbreite wird aus den tatsächlichen Bildmaßen berechnet. Damit bleiben die neuen Figuren unverzerrt; die zuvor korrigierten Höhen im Wohnzimmer bleiben erhalten.
- Bestehende Speicherstände und interne Spiel-APIs bleiben kompatibel. Interne Bezeichner wie `pablo`, `kitten` und `createPablo` sind deshalb weiterhin vorhanden, zeigen aber den Hund.
- Cache-Version auf `20260927-6` vorbereitet. Sichtbare Version: `27.09.26 / 6`.
- Alte Roh-Spritesheets aus `public/demo/assets` nach `art/legacy-sources` verschoben. Sie dienen nur noch zur reproduzierbaren Extraktion der unveränderten Nebenfiguren. Anschließend wendet `prepare-demo-sprites.mjs` immer den neuen Charakter-Satz an.
- Bereits vor dieser Arbeit vorhandenes, unversioniertes `public/assets/showcase/chase-selected.jpg` ist unbenutzt und wurde nicht verändert. Bei einer späteren Veröffentlichung nicht hinzufügen.

## Prüfung

- 34 Prüfungen für Arcade, Begegnungen und kompletten Spielverlauf bestanden. Darunter ESCO-Code, Kapitelübergänge, Wiederholungen, Spielstände, zehn Leckerlis und Finale.
- 15 Prüfungen für mobile Steuerung bestanden: Startanleitung, Loslassen, zwei Daumen, Pause, Orientierungswechsel, Sprungtaste und verschwindender Spielhinweis.
- Native Canvas-Bilder von Tanz, Flucht und Wohnzimmer visuell geprüft. Neues Sofabild und Porträts ebenfalls geprüft.
- ESLint, TypeScript und Next.js-Produktionsbuild erfolgreich.
- Geänderte Website-Bilder verwenden weiter Next Image, Größenangaben, Alternativtexte und bestehende Tastatur-/Fokusbedienung. Keine Layout- oder Steuerungsänderung.
- Reale Browserprüfung nicht möglich: Das Browser-Werkzeug blockierte den Zugriff auf die lokale Vorschau durch seine URL-Sicherheitsrichtlinie. Daher mobile/desktop Browserdarstellung, Navigation, Fokus und Medienfehler-Fallbacks in diesem Durchlauf nicht erneut bestätigt. Kein Test auf einem physischen S25 Ultra.
- Die automatischen Ablaufprüfungen verwenden `outputs/verify-updated-demo.cjs` und die bestehenden Prüfscripte im benachbarten Projekt; die mobile Prüfung liegt im Repository unter `scripts/verify-mobile.mjs`.

## Bildherkunft und Reproduktion

Erzeugt mit dem eingebauten Imagegen-Werkzeug, nicht per CLI. Transparenter Charakterbogen: `art/characters-esco/characters.png`. Sofabild: `public/demo/assets/sofa-memory.png`. Einzelgrafiken: `public/demo/assets/sprites/`. Web-Vorschauen: `public/assets/showcase/*-esco.webp`.

Sprites extrahieren: `node scripts/prepare-esco-sprites.mjs`. Nach neuen Canvas-Prüfbildern: `node scripts/prepare-esco-showcase.mjs`. Die Bildentwürfe sind neu generiert; eine rechtliche Freigabe wird damit nicht behauptet.

### Finaler Prompt: Charakterbogen

Use case: illustration-story. Create an original transparent PNG game character sprite sheet, wide landscape canvas. Exactly five separated full-body sprites in a single horizontal row, generous empty transparent gutters, no overlap, no text. Warm hand painted storybook game art, clean detailed silhouettes. All characters completely fictional, no real-person likeness or existing franchise. Left to right: (1) adult man Joe standing relaxed three-quarter toward right, clean shaven, wavy auburn hair, ochre casual overshirt open over a dark teal t-shirt, navy trousers, cream sneakers; (2) exact same man in running pose toward right, feet fully visible; (3) exact same man in tense defensive standing pose; (4) adult woman Lana standing three-quarter toward left, short dark curly bob, warm brown skin, rust orange long sleeved blouse tucked into high waisted cream wide-leg trousers, teal flats, no tattoos; (5) small friendly brown-and-white floppy-eared dog Esco standing three-quarter toward left, white muzzle and chest, brown back, wagging tail, teal collar. All full bodies, entirely inside image. Human sprites same scale, dog naturally smaller but clearly detailed. Actual transparent background, not checkerboard. No cast shadows, no ground, no background. Production asset for cozy narrative browser game.

### Finaler Prompt: Sofaszene

Use case illustration-story. Use supplied sheet solely as character identity reference. Create wide 16:9 cozy narrative game final illustration: these two adults, auburn clean-shaven man in ochre overshirt dark teal tee and navy trousers, brown-skinned woman short curly dark bob rust blouse cream trousers, sitting close together on a green sofa, their small brown-white floppy-eared dog with teal collar curled between them, open laptop on low wooden coffee table. Warm amber lamp light, apartment window at dusk with plants, books, joyful peaceful everyday feeling. Same hand painted detailed storybook art and exactly these new character designs. Natural adult proportions, eye level wide shot, complete room composition, no other people, no cats, no text, no logos.

## Namenskorrektur

Die Hauptfiguren heißen auf Wunsch des Nutzers jetzt **Tom und Maria**, der Hund weiterhin **Esco**. Die bisherige Nebenfigur Maria heißt zur eindeutigen Unterscheidung **Nina**. Dialoge, Sprecherzuordnung, Namensschilder, Titel, Finale und Website-Texte wurden angepasst. Interne Sprite-/Speicherschlüssel bleiben aus Kompatibilitätsgründen unverändert. Die früheren Namen in den dokumentierten Bildprompts beschreiben ausschließlich die ursprüngliche Generierung. Weiterhin keine Veröffentlichung.

## Gewinnbarer Fluchtabschluss

Nach allen 16 Hindernissen folgt jetzt `chase-won`: Tom erreicht Maria sicher, die Szene zeigt GESCHAFFT mit Hinderniszahl, ein Siegsignal und passende Dialoge führen nach Hause. Der bisher zwangsläufige Sturz samt Beinbruch wurde entfernt. Nach drei Fehlversuchen bleibt Überspringen möglich; `chase-skipped` und der neutrale Übergang behaupten keinen Sieg. Wiederholung, Pausen und Kapitelübergang wurden geprüft. 34 Ablauf-/Arcadeprüfungen und 15 mobile Steuerungsprüfungen bestanden. Der Gewinnbildschirm wurde im nativen Canvas visuell geprüft. Reale Browserprüfung weiterhin durch die bereits gemeldete Browser-URL-Richtlinie blockiert. Nicht veröffentlicht.

## Letzte Namenszuordnung

Auf ausdrücklichen Wunsch wurden Maria und Nina getauscht: **Tom und Nina** sind die Hauptfiguren; Nina ist die dunkelhäutige Frau mit kurzem lockigem Haar. Die Nebenfigur heißt wieder **Maria**. Dialoge und Porträts, Namensschilder, Fluchtziel und Siegszene, Finale, Demo-Titel und Manifest sowie die Hauptseite einschließlich englischer Texte, Alternativtexte und FAQ wurden angepasst. Esco bleibt unverändert. Frühere Abschnitte dokumentieren den vorherigen Stand. Nicht veröffentlicht.

## Freigabe zum Speichern und Pushen

Am 27.09.2026 hat der Nutzer mit 'push und speichern' den Commit und Push dieses Stands freigegeben. Der finale Produktionsbuild nach der Umbenennung auf Tom und Nina war erfolgreich. Der Push auf main startet die bestehende Hostinger-Veröffentlichung.
