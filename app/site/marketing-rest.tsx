'use client';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useLanguage } from './context';

export const faqs = [
 ['Was ist Your Story?', 'What is Your Story?', 'Ein interaktives Referenzprojekt: eine persönliche Geschichte als Browserspiel und ein Studio zum Sammeln eigener Geschichtenentwürfe. Die Demo erzählt die Geschichte für Lana in fünf Kapiteln.', 'An interactive portfolio project: a personal story as a browser game, plus a studio for collecting story drafts. The demo tells the story for Lana in five chapters.'],
 ['Kann ich die Demo ohne Konto spielen?', 'Can I play without an account?', 'Ja. Öffne die Demo, wähle den sichtbaren Beispielcode PABLO und starte die Geschichte. Du brauchst keinen Download und kein Konto. Die Demo ist auf Deutsch.', 'Yes. Open the demo, choose the visible example code PABLO, and start the story. No download or account is needed. The demo is in German.'],
 ['Funktioniert das auch auf dem Handy?', 'Does it work on a phone?', 'Die Demo hat eine Touch-Steuerung. Für mehr Platz empfiehlt sich das Querformat. Am Computer nutzt du die Pfeiltasten oder WASD und E zum Interagieren.', 'The demo has touch controls. Landscape gives you more space. On a computer, use the arrow keys or WASD to move and E to interact.'],
 ['Was kann ich im Studio machen?', 'What can I do in the studio?', 'Mit einem Konto kannst du Namen, drei Erinnerungen, Bildreferenzen und eine persönliche Nachricht speichern. Daraus entsteht ein privater Entwurf. Eine automatische Spielproduktion und Bestellungen sind nicht aktiviert.', 'With an account, save names, three memories, image references, and a personal message as a private draft. Automatic game production and ordering are not enabled.'],
 ['Was passiert mit meinem Fortschritt?', 'What happens to my progress?', 'Die Demo speichert deinen Fortschritt in diesem Browser. Deine Studio-Entwürfe werden in deinem Konto gespeichert. Bitte verwende in der Projektvorschau nur Testinhalte.', 'The demo saves progress in this browser. Studio drafts are saved to your account. Please use test content in this project preview.'],
];
export function FAQList() {
 const { lang } = useLanguage();
 return <Accordion type="single" collapsible className="faq-list">{faqs.map((faq,i)=><AccordionItem value={'faq-'+i} key={faq[0]}><AccordionTrigger>{faq[lang==='de'?0:1]}</AccordionTrigger><AccordionContent>{faq[lang==='de'?2:3]}</AccordionContent></AccordionItem>)}</Accordion>;
}
