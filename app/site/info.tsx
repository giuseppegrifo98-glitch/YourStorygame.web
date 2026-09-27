'use client';

import Link from 'next/link';
import { LanguageProvider, useLanguage } from './context';
import { Header, Footer } from './shell';
import { FAQList } from './marketing-rest';

type InfoType = 'privacy' | 'legal' | 'help';

export function InfoPage({ type }: { type: InfoType }) {
  return <LanguageProvider><InfoContent type={type} /></LanguageProvider>;
}

function InfoContent({ type }: { type: InfoType }) {
  const { t } = useLanguage();
  return <>
    <Header />
    <main id="main-content" className="wrap info-page legal-copy">
      {type === 'help' ? <HelpContent /> : type === 'privacy' ? <PrivacyContent /> : <LegalContent />}
      {type !== 'help' && <p className="legal-updated">{t('Stand: 27. September 2026', 'Last updated: 27 September 2026')}</p>}
    </main>
    <Footer />
  </>;
}

function LegalContent() {
  const { t } = useLanguage();
  return <>
    <p className="eyebrow">{t('ANBIETER & KONTAKT', 'PROVIDER & CONTACT')}</p>
    <h1>{t('Impressum', 'Legal notice')}</h1>
    <p>{t('Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG).', 'Provider information pursuant to section 5 of the German Digital Services Act (DDG).')}</p>
    <section>
      <h2>{t('Anbieter', 'Provider')}</h2>
      <address>Giuseppe Grifo<br />Luisenstraße 9A<br />75228 Ispringen<br />{t('Deutschland', 'Germany')}</address>
    </section>
    <section>
      <h2>{t('Kontakt', 'Contact')}</h2>
      <p>{t('Telefon', 'Phone')}: <a href="tel:+4915224117777">01522 411 7777</a><br />{t('E-Mail', 'Email')}: <a href="mailto:dynamicupscale@gmail.com">dynamicupscale@gmail.com</a></p>
    </section>
    <section>
      <h2>{t('Projektstatus', 'Project status')}</h2>
      <p>{t('„Your Story“ ist ein interaktives Referenz- und Portfolio-Projekt. Über diese Website werden derzeit keine kostenpflichtigen Bestellungen, Zahlungen oder Verträge angeboten.', '“Your Story” is an interactive reference and portfolio project. This website currently offers no paid orders, payments, or contracts.')}</p>
    </section>
    <section>
      <h2>{t('Verantwortlich für die Inhalte', 'Responsible for the content')}</h2>
      <p>{t('Giuseppe Grifo, Anschrift wie oben.', 'Giuseppe Grifo, address as stated above.')}</p>
    </section>
    <section>
      <h2>{t('Verbraucherstreitbeilegung', 'Consumer dispute resolution')}</h2>
      <p>{t('Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.', 'We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board.')}</p>
    </section>
    <section>
      <h2>{t('Urheberrecht', 'Copyright')}</h2>
      <p>{t('Die auf dieser Website erstellten Inhalte, Illustrationen, Spielgrafiken und Programmteile unterliegen dem geltenden Urheberrecht. Eine Nutzung außerhalb der gesetzlichen Grenzen bedarf der vorherigen Zustimmung des jeweiligen Rechteinhabers.', 'The content, illustrations, game graphics, and software components created for this website are protected by applicable copyright law. Use beyond statutory limits requires the prior consent of the respective rights holder.')}</p>
    </section>
  </>;
}

function PrivacyContent() {
  const { t } = useLanguage();
  return <>
    <p className="eyebrow">{t('TRANSPARENT VON ANFANG AN', 'CLEAR FROM THE START')}</p>
    <h1>{t('Datenschutzerklärung', 'Privacy policy')}</h1>
    <p>{t('Diese Erklärung beschreibt die Datenverarbeitung auf der öffentlich zugänglichen Projektseite, in der spielbaren Demo und im geschlossenen Testbereich.', 'This policy describes data processing on the public project site, in the playable demo, and in the closed test area.')}</p>
    <section>
      <h2>{t('1. Verantwortlicher', '1. Controller')}</h2>
      <address>Giuseppe Grifo<br />Luisenstraße 9A<br />75228 Ispringen<br />{t('Deutschland', 'Germany')}<br />{t('Telefon', 'Phone')}: <a href="tel:+4915224117777">01522 411 7777</a><br />{t('E-Mail', 'Email')}: <a href="mailto:dynamicupscale@gmail.com">dynamicupscale@gmail.com</a></address>
    </section>
    <section>
      <h2>{t('2. Hosting und Server-Logfiles', '2. Hosting and server logs')}</h2>
      <p>{t('Diese Website wird bei Hostinger gehostet. Vertragspartner für Kunden in der Europäischen Union ist Hostinger International Limited, 61 Lordou Vironos Street, 6023 Larnaca, Zypern. Beim Aufruf der Website kann der Hostinganbieter technisch erforderliche Zugriffsdaten verarbeiten, insbesondere IP-Adresse, Datum und Uhrzeit, aufgerufene Datei oder URL, übertragene Datenmenge, Referrer, Browser, Betriebssystem und Status des Abrufs.', 'This website is hosted by Hostinger. The contracting entity for customers in the European Union is Hostinger International Limited, 61 Lordou Vironos Street, 6023 Larnaca, Cyprus. When the website is accessed, the hosting provider may process technically necessary access data, in particular the IP address, date and time, requested file or URL, amount of data transferred, referrer, browser, operating system, and request status.')}</p>
      <p>{t('Die Verarbeitung dient der sicheren, stabilen und fehlerfreien Bereitstellung der Website sowie der Abwehr von Missbrauch. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im sicheren Betrieb dieses Onlineangebots. Hostinger verarbeitet diese Daten als Auftragsverarbeiter nach Art. 28 DSGVO und nach den vertraglichen Speicher- und Löschregeln des gebuchten Hostingdienstes.', 'Processing serves the secure, stable, and error-free delivery of the website and the prevention of misuse. The legal basis is Article 6(1)(f) GDPR. Our legitimate interest is the secure operation of this online service. Hostinger processes this data as a processor under Article 28 GDPR and in accordance with the contractual storage and deletion rules of the hosting service.')}</p>
    </section>
    <section>
      <h2>{t('3. Spielbare Demo und Geschenkcode', '3. Playable demo and access code')}</h2>
      <p>{t('Die Demo kann ohne Konto genutzt werden. Der sichtbare Beispielcode „ESCO“ wird ausschließlich im Browser geprüft und nicht an unseren Server übermittelt. Die Demo speichert Kapitelstand, Abschlussstatus und ungefähre Spielzeit im lokalen Speicher des Browsers, damit ein Spiel später fortgesetzt werden kann. Ein Service Worker kann die für die Demo benötigten Dateien im Browser-Cache ablegen, damit sie zuverlässig geladen werden.', 'The demo can be used without an account. The visible sample code “ESCO” is checked only in the browser and is not sent to our server. The demo stores chapter progress, completion status, and approximate play time in the browser’s local storage so a game can be continued later. A service worker may cache the files required for the demo so they load reliably.')}</p>
      <p>{t('Diese Speicherungen sind für die ausdrücklich aufgerufene Spielfunktion und das gewünschte Fortsetzen der Demo erforderlich. Rechtsgrundlage für eine damit verbundene Verarbeitung personenbezogener Daten ist Art. 6 Abs. 1 lit. f DSGVO; der Zugriff auf den Gerätespeicher erfolgt nach § 25 Abs. 2 Nr. 2 TDDDG. Die Daten bleiben auf dem verwendeten Gerät, bis sie über die Browser-Einstellungen oder durch Löschen der Website-Daten entfernt werden.', 'This storage is necessary for the game function explicitly requested and for continuing the demo. The legal basis for any related processing of personal data is Article 6(1)(f) GDPR; access to device storage is based on section 25(2)(2) TDDDG. The data remains on the device until it is removed through the browser settings or by clearing the website data.')}</p>
    </section>
    <section>
      <h2>{t('4. Spracheinstellung', '4. Language preference')}</h2>
      <p>{t('Wenn die Sprache umgeschaltet wird, speichert die Website die gewählte Sprache lokal im Browser. Dadurch bleibt die Auswahl bei einem späteren Besuch erhalten. Die Einstellung wird nicht zu Analyse- oder Werbezwecken verwendet und kann über die Browser-Einstellungen gelöscht werden. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. f DSGVO und § 25 Abs. 2 Nr. 2 TDDDG.', 'When the language is changed, the website stores the selected language locally in the browser. This keeps the selection for a later visit. The setting is not used for analytics or advertising and can be deleted in the browser settings. The legal bases are Article 6(1)(f) GDPR and section 25(2)(2) TDDDG.')}</p>
    </section>
    <section>
      <h2>{t('5. Geschlossener Testbereich', '5. Closed test area')}</h2>
      <p>{t('Neue Registrierungen sind deaktiviert. Bereits eingerichtete Testkonten können sich weiterhin anmelden. Dabei verarbeiten wir E-Mail-Adresse, Anzeigename, einen nicht im Klartext gespeicherten Passwort-Hash, eine zufällige Sitzungskennung sowie Erstellungs- und Ablaufzeitpunkte. Die Anmeldung setzt ein technisch erforderliches, vor Zugriff durch JavaScript geschütztes Sitzungscookie. Es läuft nach 30 Tagen ab; abgelaufene Serversitzungen werden bei der nächsten Zugriffsprüfung entfernt.', 'New registrations are disabled. Existing test accounts can still sign in. We process the email address, display name, a password hash that is not stored in plain text, a random session identifier, and creation and expiry timestamps. Signing in sets a technically necessary session cookie protected from JavaScript access. It expires after 30 days; expired server sessions are removed during the next access check.')}</p>
      <p>{t('Im Testbereich können Namen, Anlass, Sprache, persönliche Erinnerungen, eine Abschlussnachricht und freiwillig hochgeladene Bilder gespeichert werden. Originalbilder können vorhandene Metadaten enthalten. Die Inhalte dienen ausschließlich dem privaten Entwurf im geschützten Konto. Sie werden nicht öffentlich geteilt und nicht automatisch an einen KI-Dienst übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO für die Bereitstellung des angeforderten Testzugangs. Bilder anderer Personen dürfen nur mit deren Erlaubnis hochgeladen werden.', 'The test area can store names, occasion, language, personal memories, a final message, and voluntarily uploaded images. Original images may contain existing metadata. The content is used exclusively for the private draft in the protected account. It is not shared publicly or automatically sent to an AI service. The legal basis is Article 6(1)(b) GDPR for providing the requested test access. Images of other people may be uploaded only with their permission.')}</p>
    </section>
    <section>
      <h2>{t('6. Speicherdauer und Löschung', '6. Storage and deletion')}</h2>
      <p>{t('Lokale Demo- und Spracheinstellungen bleiben auf dem verwendeten Gerät, bis sie im Browser gelöscht werden. Das Sitzungscookie läuft nach 30 Tagen ab oder wird beim Abmelden entfernt. Kontodaten, Entwürfe und Uploads im geschlossenen Testbereich speichern wir, solange der Testzugang genutzt wird. Sie werden gelöscht, wenn der Zugang beendet wird, der Testbetrieb eingestellt wird oder eine berechtigte Löschung verlangt wird, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Einzelne Bilder können im Studio direkt gelöscht werden; eine vollständige Löschung kann über die oben genannte E-Mail-Adresse verlangt werden.', 'Local demo and language settings remain on the device until they are deleted in the browser. The session cookie expires after 30 days or is removed on sign-out. Account data, drafts, and uploads in the closed test area are stored for as long as the test access is used. They are deleted when access ends, the test operation is discontinued, or a valid deletion request is made, unless statutory retention duties apply. Individual images can be deleted directly in the studio; complete deletion can be requested using the email address above.')}</p>
    </section>
    <section>
      <h2>{t('7. Empfänger und Drittlandübermittlungen', '7. Recipients and international transfers')}</h2>
      <p>{t('Empfänger der für den Betrieb erforderlichen Daten ist unser Hostinganbieter Hostinger als Auftragsverarbeiter. Die Website bindet keine Werbe-, Analyse- oder Social-Media-Dienste ein. Schriftarten und Bilder werden vom eigenen Server geladen. Eine gezielte Übermittlung der Studioinhalte an Empfänger außerhalb des Europäischen Wirtschaftsraums findet nicht statt. Soweit Hostinger vertraglich eingesetzte Unterauftragsverarbeiter verwendet, gelten die Regelungen des mit Hostinger geschlossenen Auftragsverarbeitungsvertrags.', 'The recipient of data required for operation is our hosting provider Hostinger acting as a processor. The website does not embed advertising, analytics, or social media services. Fonts and images are loaded from the same server. Studio content is not intentionally transferred to recipients outside the European Economic Area. Where Hostinger uses contractually appointed subprocessors, the terms of the data processing agreement with Hostinger apply.')}</p>
    </section>
    <section>
      <h2>{t('8. Ihre Rechte', '8. Your rights')}</h2>
      <p>{t('Sie haben im Rahmen der gesetzlichen Voraussetzungen das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Einer Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO können Sie aus Gründen widersprechen, die sich aus Ihrer besonderen Situation ergeben. Wenden Sie sich dazu an die oben genannte E-Mail-Adresse.', 'Subject to the statutory requirements, you have the right to access, rectification, erasure, restriction of processing, and data portability. You may object to processing based on Article 6(1)(f) GDPR for reasons arising from your particular situation. Please use the email address stated above.')}</p>
    </section>
    <section>
      <h2>{t('9. Beschwerderecht', '9. Right to lodge a complaint')}</h2>
      <p>{t('Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Für den Verantwortlichen ist grundsätzlich der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg zuständig, Lautenschlagerstraße 20, 70173 Stuttgart.', 'You have the right to lodge a complaint with a data protection supervisory authority. The supervisory authority generally responsible for the controller is the State Commissioner for Data Protection and Freedom of Information of Baden-Württemberg, Lautenschlagerstraße 20, 70173 Stuttgart.')}</p>
      <p><a href="https://www.baden-wuerttemberg.datenschutz.de/" rel="noreferrer">baden-wuerttemberg.datenschutz.de</a></p>
    </section>
    <section>
      <h2>{t('10. Änderungen dieser Erklärung', '10. Changes to this policy')}</h2>
      <p>{t('Wir aktualisieren diese Datenschutzerklärung, wenn sich Funktionen, eingesetzte Dienste oder rechtliche Anforderungen ändern.', 'We update this privacy policy when functions, services used, or legal requirements change.')}</p>
    </section>
  </>;
}

function HelpContent() {
  const { t } = useLanguage();
  return <>
    <p className="eyebrow">{t('FRAGEN ZUR DEMO', 'DEMO QUESTIONS')}</p>
    <h1>{t('Fragen & Hilfe', 'Questions & help')}</h1>
    <p>{t('Hier findest du Antworten zur spielbaren Demo und zum aktuellen Projektstand.', 'Find answers about the playable demo and the current project status.')}</p>
    <FAQList />
    <h2>{t('Wie starte ich die Demo?', 'How do I start the demo?')}</h2>
    <p>{t('Öffne die Demo und gib den sichtbaren Beispielcode ESCO ein. Eine Registrierung ist nicht erforderlich.', 'Open the demo and enter the visible sample code ESCO. Registration is not required.')}</p>
    <Link className="button" href="/demo">{t('Demo öffnen', 'Open demo')}</Link>
  </>;
}
