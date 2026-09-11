'use client';
import { ArrowUpRight, Heart, Smartphone, Gift, Sparkles } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context';
import { Header, Footer } from './shell';
import { MarketingRest } from './marketing-rest';
export function Landing(){return <LanguageProvider><Content/></LanguageProvider>;}
function Content(){
 const{t}=useLanguage();
 return <><Header/><main>
 <section className="hero wrap">
  <div className="hero-copy"><p className="eyebrow"><span className="tiny-star">✳</span>{t('KEIN GEWÖHNLICHES GESCHENK.','NOT YOUR EVERYDAY GIFT.')}</p><h1>{t('Eure Geschichte.','Your story.')}<br/><span>{t('Zum Mitspielen.','Made playable.')}</span></h1><p className="hero-description">{t('Der erste Blick. Euer Lieblingsort. Dieser eine Insider. Macht aus euren Erinnerungen ein persönliches Spiel – und aus einem Geschenk ein echtes Erlebnis.','The first look. Your favorite place. That one inside joke. Turn your memories into a personal game — and a gift into an experience.')}</p><div className="hero-buttons"><a href="/create" className="button">{t('Eure Geschichte starten','Start your story')}<ArrowUpRight size={19}/></a><a href="#how" className="button secondary">{t('So funktioniert’s','How it works')}</a></div><p className="microcopy"><Smartphone size={15}/>{t('Ein persönliches Spielerlebnis. Direkt im Browser.','A personal game experience. Right in your browser.')}</p></div>
  <div className="hero-visual"><span className="floating-label"><Sparkles size={15}/>{t('Eure Momente. Eine neue Welt.','Your moments. A whole new world.')}</span><div className="game-polaroid concept-art"><div className="scene-preview"><img src="/assets/coast.png" alt={t('Stimmungsillustration eines gemeinsamen Abends am Meer','A mood illustration of a shared evening by the sea')} fetchPriority="high"/></div><div className="polaroid-caption"><span>{t('Weißt du noch, dieser Abend?','Remember that evening?')}<small>{t('Die kleinen Momente. Eure große Geschichte.','Little moments. Your big story.')}</small></span><Heart size={24} color="#df8069"/></div></div><span className="paper-note">{t('„Das sind ja wir!“','“Wait… that’s us!”')}<span>{t('Genau dieser Moment.','That’s the moment.')}</span></span><span className="visual-footnote">{t('Stimmungsillustration · keine Spielaufnahme','Mood illustration · not game footage')}</span></div>
 </section>
 <div className="promise-strip wrap"><span><Heart size={20}/>{t('Eure Geschichte steht im Mittelpunkt','Your story takes center stage')}</span><span><Gift size={20}/>{t('Zum Jahrestag. Oder einfach so.','For your anniversary. Or just because.')}</span><span><Smartphone size={20}/>{t('Ein Geschenk zum Erleben','A gift to experience')}</span></div>
 <section id="experience" className="experience wrap section"><div className="section-heading"><div><p className="eyebrow">{t('NICHT NUR ANSEHEN. ERLEBEN.','DON’T JUST WATCH. EXPERIENCE.')}</p><h2>{t('Ein Geschenk, in dem','A gift where')}<br/>{t('ihr die Hauptrolle spielt.','you’re the main characters.')}</h2></div><p>{t('Eure gemeinsamen Orte. Die Worte, die nur ihr versteht. Die Momente, die geblieben sind. Daraus soll eine Geschichte entstehen, die man selbst entdecken kann.','Your shared places. The words only you understand. The moments that stayed. The idea is to turn them into a story you can discover for yourself.')}</p></div></section>
 <MarketingRest/>
 </main><Footer/></>;
}
