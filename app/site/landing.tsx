'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Play, Heart, Monitor, BookOpen } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context';
import { Header, Footer } from './shell';
import { FAQList } from './marketing-rest';

const scenes = [
  { image: 'dance', de: 'Der erste Tanz', en: 'The first dance', chapter: '01', textDe: 'Ein Blick. Ein Tanz. Und plötzlich beginnt eine Geschichte.', textEn: 'A glance. A dance. And suddenly, a story begins.' },
  { image: 'home', de: 'Ein Stück Zuhause', en: 'A little piece of home', chapter: '04', textDe: 'Die leisen Momente. Und ein kleines Fellknäuel namens Pablo.', textEn: 'The quiet moments. And a little ball of fur called Pablo.' },
  { image: 'together', de: 'Genau hier. Mit dir.', en: 'Right here. With you.', chapter: '05', textDe: 'Manche Geschichten enden genau dort, wo du sein möchtest.', textEn: 'Some stories end exactly where you want to be.' },
];

export function Landing() { return <LanguageProvider><Content /></LanguageProvider>; }

function Content() {
  const { t, lang } = useLanguage();
  const [scene, setScene] = useState(0);
  const current = scenes[scene];
  return <><Header /><main id="main-content" className="showcase">
    <section className="story-hero wrap">
      <div className="story-hero-copy">
        <p className="project-label"><span aria-hidden="true" />{t('Eine persönliche Geschichte. Ein spielbares Erlebnis.', 'A personal story. A playable experience.')}</p>
        <h1>{t('Manche Momente möchte man noch einmal erleben.', 'Some moments deserve to be lived again.')}</h1>
        <p className="story-lead">{t('Der erste Tanz. Eure verrückteste Nacht. Das Gefühl, zuhause zu sein. Your Story macht aus Erinnerungen ein kleines Abenteuer.', 'The first dance. Your wildest night. The feeling of being home. Your Story turns memories into a little adventure.')}</p>
        <div className="story-actions"><a className="button" href="/demo"><Play size={17} fill="currentColor" aria-hidden="true" />{t('Geschichte spielen', 'Play the story')}</a><a className="quiet-link" href="#experience">{t('Projekt entdecken', 'Explore the project')}<ArrowUpRight size={18} aria-hidden="true" /></a></div>
        <p className="hero-detail">{t('5 Kapitel · ca. 5–10 Minuten · ohne Anmeldung', '5 chapters · about 5–10 minutes · no sign-up')}{lang === 'en' && <span>Demo in German</span>}</p>
      </div>
      <div className="story-hero-art">
        <div className="hero-art-top"><span><Heart size={15} aria-hidden="true" />{t('Für Luana. Von Herzen.', 'For Luana. From the heart.')}</span><span>{t('Spielbare Demo', 'Playable demo')}</span></div>
        <a href="/demo" className="hero-art-link" aria-label={t('Die Geschichte für Luana spielen', 'Play the story for Luana')}>
          <Image src="/assets/showcase/together.webp" alt={t('Illustration aus der Demo: ein Paar gemeinsam auf dem Sofa im warmen Licht ihres Zuhauses.', 'Illustration from the demo: a couple on their sofa in the warm light of their home.')} fill sizes="(max-width: 800px) 100vw, 55vw" priority />
          <div className="hero-art-caption"><span>{t('Eine Geschichte über uns.', 'A story about us.')}</span><span className="play-disc"><Play size={24} fill="currentColor" aria-hidden="true" /></span></div>
        </a>
        <div className="hero-art-bottom"><span>{t('Aus der spielbaren Luana-Demo', 'From the playable Luana demo')}</span><span>{t('Erinnerungen werden lebendig', 'Memories come to life')}</span></div>
      </div>
    </section>
    <div className="project-facts wrap"><span><BookOpen size={18} aria-hidden="true" />{t('Eine Geschichte in fünf Kapiteln', 'One story in five chapters')}</span><span><Monitor size={18} aria-hidden="true" />{t('Direkt im Browser spielbar', 'Playable in your browser')}</span><span><Heart size={18} aria-hidden="true" />{t('Mit persönlichen Orten & Figuren', 'With personal places & characters')}</span></div>
    <section id="experience" tabIndex={-1} className="chapter-section wrap">
      <div className="showcase-heading"><div><p className="section-kicker">{t('Ein Blick in die Geschichte', 'A glimpse into the story')}</p><h2>{t('Aus „Weißt du noch?“ wird ein neues Abenteuer.', '“Remember when?” becomes a new adventure.')}</h2></div><p>{t('Erkunde vertraute Orte, entdecke kleine Details und spiele dich durch gemeinsame Erinnerungen. Jede Szene ist ein Stück dieser Geschichte.', 'Explore familiar places, discover little details, and play through shared memories. Every scene is a piece of this story.')}</p></div>
      <div className="chapter-viewer">
        <div className="chapter-picture"><Image key={current.image} src={'/assets/showcase/' + current.image + '.webp'} alt={t(current.textDe, current.textEn)} fill sizes="(max-width: 760px) 100vw, 75vw" /><span className="scene-label">{t('Kapitel', 'Chapter')} {current.chapter} / 05</span><a href="/demo" className="scene-play" aria-label={t('Vollständige Demo spielen', 'Play the full demo')}><Play size={18} fill="currentColor" aria-hidden="true" /></a></div>
        <div className="chapter-picker" aria-label={t('Szenenvorschau auswählen', 'Choose a scene preview')}>{scenes.map((item, index) => <button key={item.image} onClick={() => setScene(index)} aria-pressed={scene === index} className={scene === index ? 'selected' : ''}><span>{item.chapter}</span><span>{t(item.de, item.en)}</span><ArrowUpRight size={18} aria-hidden="true" /></button>)}</div>
      </div>
      <p className="scene-description" aria-live="polite">{t(current.textDe, current.textEn)} <span>{t('Originalszene aus der Demo.', 'Original scene from the demo.')}</span></p>
    </section>
    <section id="how" tabIndex={-1} className="idea-section">
      <div className="wrap idea-layout"><div><p className="section-kicker">{t('Die Idee dahinter', 'The idea behind it')}</p><h2>{t('Ein kleines Spiel. Ein großes Gefühl.', 'A little game. A lasting feeling.')}</h2><p className="idea-intro">{t('Was passiert, wenn ein Spiel von deiner eigenen Welt erzählt? Von den Menschen und Momenten, die sie besonders machen? Aus dieser Frage ist Your Story entstanden.', 'What happens when a game tells the story of your own world? Of the people and moments that make it special? That question became Your Story.')}</p><Link href="/create" className="quiet-link">{t('Das Geschichtenstudio entdecken', 'Explore the story studio')}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <div className="idea-steps">{[
          [t('Erinnerungen als Ausgangspunkt', 'Memories as a starting point'), t('Namen, gemeinsame Orte und die kleinen Insider machen eine Geschichte unverwechselbar.', 'Names, shared places, and inside jokes make a story unmistakably yours.')],
          [t('Mitten in eurer Geschichte', 'Inside your story'), t('Bewegen, entdecken, reden. Die Demo verbindet persönliche Dialoge mit kleinen spielbaren Herausforderungen.', 'Move, explore, talk. The demo combines personal dialogue with little playable challenges.')],
          [t('Ein Ende, das etwas bedeutet', 'An ending that means something'), t('Zum Abschluss wartet eine persönliche Nachricht für einen besonderen Menschen.', 'A personal message for someone special awaits at the end.')],
        ].map(([title, text], i) => <article key={title}><span className="step-index">0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </div>
    </section>
    <section id="project" tabIndex={-1} className="project-section wrap"><div className="project-note"><span className="project-dot" aria-hidden="true" />{t('Ein eigenständiges Webprojekt', 'An independent web project')}</div><div className="showcase-heading"><h2>{t('Eine Idee, die man ausprobieren kann.', 'An idea you can actually try.')}</h2><p>{t('Your Story verbindet eine erzählte Spielwelt mit einem eigenen Studio für Geschichtenentwürfe. Ein Referenzprojekt mit funktionierender Demo – offen zum Entdecken.', 'Your Story connects a narrative game world with a dedicated studio for story drafts. A portfolio project with a working demo, ready to explore.')}</p></div><div className="project-paths"><a className="project-path" href="/demo"><Play size={26} aria-hidden="true" /><div><h3>{t('Das Spiel erleben', 'Experience the game')}</h3><p>{t('Fünf Kapitel, persönliche Dialoge und kleine Herausforderungen. Kostenlos und ohne Konto.', 'Five chapters, personal dialogue, and little challenges. Free, with no account.')}</p><span>{t('Demo öffnen', 'Open demo')}<ArrowUpRight size={18} aria-hidden="true" /></span></div></a><Link className="project-path" href="/create"><BookOpen size={26} aria-hidden="true" /><div><h3>{t('Im Studio gestalten', 'Create in the studio')}</h3><p>{t('Namen, Erinnerungen und eine Botschaft sammeln. Mit Konto speichern und später weiterarbeiten.', 'Collect names, memories, and a message. Save with an account and continue later.')}</p><span>{t('Studio entdecken', 'Explore studio')}<ArrowUpRight size={18} aria-hidden="true" /></span></div></Link></div><p className="project-status">{t('Projektvorschau. Das Studio speichert Entwürfe; eine automatische Spielproduktion oder Bestellung ist nicht Teil dieser Version.', 'Project preview. The studio saves drafts; automatic game production and ordering are not part of this version.')}</p></section>
    <section className="showcase-faq wrap"><div><p className="section-kicker">{t('Bevor es losgeht', 'Before you begin')}</p><h2>{t('Noch neugierig?', 'Still curious?')}</h2><Link className="quiet-link" href="/help">{t('Fragen & Hilfe', 'Questions & help')}<ArrowRight size={18} aria-hidden="true" /></Link></div><FAQList /></section>
    <section className="story-ending wrap"><Heart size={30} strokeWidth={1.2} aria-hidden="true" /><p>{t('Eine kleine Zeitreise wartet auf dich.', 'A little journey through time awaits.')}</p><h2>{t('Zurück zu diesem einen Moment.', 'Back to that one moment.')}</h2><a className="button" href="/demo"><Play size={17} fill="currentColor" aria-hidden="true" />{t('Geschichte spielen', 'Play the story')}</a><span>{t('Ohne Download. Ohne Anmeldung. Einfach eintauchen.', 'No download. No sign-up. Just step inside.')}</span></section>
  </main><Footer /></>;
}
