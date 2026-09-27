'use client';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useLanguage } from './context';

export const faqs = [
 ['Was ist Your Story?', 'What is Your Story?', 'Ein interaktives Referenzprojekt: eine persönliche Geschichte als Browserspiel. Die Demo erzählt die Geschichte für Nina in fünf Kapiteln.', 'An interactive portfolio project: a personal story as a browser game. The demo tells the story for Nina in five chapters.'],
 ['Kann ich die Demo ohne Konto spielen?', 'Can I play without an account?', 'Ja. Öffne die Demo, wähle den sichtbaren Beispielcode ESCO und starte die Geschichte. Du brauchst keinen Download und kein Konto. Die Demo ist auf Deutsch.', 'Yes. Open the demo, choose the visible example code ESCO, and start the story. No download or account is needed. The demo is in German.'],
 ['Funktioniert das auch auf dem Handy?', 'Does it work on a phone?', 'Die Demo hat eine Touch-Steuerung. Für mehr Platz empfiehlt sich das Querformat. Am Computer nutzt du die Pfeiltasten oder WASD und E zum Interagieren.', 'The demo has touch controls. Landscape gives you more space. On a computer, use the arrow keys or WASD to move and E to interact.'],
 ['Brauche ich eine Registrierung?', 'Do I need to register?', 'Nein. Die öffentliche Demo funktioniert ausschließlich mit dem sichtbaren Beispielcode ESCO. Neue Kontoregistrierungen sind geschlossen.', 'No. The public demo works with the visible sample code ESCO. New account registrations are closed.'],
 ['Was passiert mit meinem Fortschritt?', 'What happens to my progress?', 'Die Demo speichert den Fortschritt nur in diesem Browser. Du kannst die gespeicherten Website-Daten jederzeit in den Browser-Einstellungen löschen.', 'The demo saves progress only in this browser. You can clear the stored website data at any time in your browser settings.'],
];
export function FAQList() {
 const { lang } = useLanguage();
 return <Accordion type="single" collapsible className="faq-list">{faqs.map((faq,i)=><AccordionItem value={'faq-'+i} key={faq[0]}><AccordionTrigger>{faq[lang==='de'?0:1]}</AccordionTrigger><AccordionContent>{faq[lang==='de'?2:3]}</AccordionContent></AccordionItem>)}</Accordion>;
}
