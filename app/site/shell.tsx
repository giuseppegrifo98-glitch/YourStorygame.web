'use client';
import { useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Infinity as InfinityIcon, Menu } from 'lucide-react';
import { useLanguage } from './context';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';

export function Brand() { return <Link href="/" className="brand" aria-label="Your Story — Home"><span className="brand-mark"><InfinityIcon size={25} aria-hidden="true" /></span><span translate="no">your story<span className="brand-period">.</span><small>made playable</small></span></Link>; }

export function Header() {
  const { lang, t, toggle } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingAnchor = useRef<string | null>(null);
  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && location.pathname === '/' && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      pendingAnchor.current = href.slice(2);
      setMenuOpen(false);
    }
  };
  const afterClose = (event: Event) => {
    const id = pendingAnchor.current;
    if (!id) return;
    event.preventDefault();
    pendingAnchor.current = null;
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      history.replaceState(null, '', '#' + id);
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    });
  };
  const links = [['/#experience', t('Das Erlebnis', 'The experience')], ['/#how', t('Die Idee', 'The idea')], ['/#project', t('Das Projekt', 'The project')]];
  return <><a className="skip-link" href="#main-content">{t('Zum Inhalt', 'Skip to content')}</a><header className="site-header wrap"><Brand /><nav className="desktop-nav" aria-label={t('Hauptnavigation', 'Main navigation')}>{links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav><div className="header-actions"><button className="language" onClick={toggle} aria-label={t('Switch to English', 'Auf Deutsch wechseln')}>{lang.toUpperCase()}</button><a href="/demo" className="button small desktop-start">{t('Demo spielen', 'Play demo')}<ArrowUpRight size={16} aria-hidden="true" /></a><Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetTrigger className="mobile-menu" aria-label={t('Menü öffnen', 'Open menu')}><Menu aria-hidden="true" /></SheetTrigger><SheetContent className="mobile-sheet" onCloseAutoFocus={afterClose}><SheetHeader className="mobile-sheet-head"><SheetTitle>{t('Entdecke Your Story', 'Discover Your Story')}</SheetTitle><SheetDescription>{t('Eine Geschichte, die du selbst erleben kannst.', 'A story you can experience for yourself.')}</SheetDescription></SheetHeader><nav className="mobile-links">{[...links, ['/studio', t('Mein Studio', 'My studio')]].map(([href, label]) => <SheetClose asChild key={href}><Link href={href} onClick={event => navigate(event, href)}>{label}</Link></SheetClose>)}<SheetClose asChild><a className="button" href="/demo">{t('Demo spielen', 'Play demo')}</a></SheetClose></nav></SheetContent></Sheet></div></header></>;
}

export function Footer() {
  const { t } = useLanguage();
  return <footer className="site-footer wrap"><div><Brand /><p>{t('Für die Momente, die bleiben.', 'For the moments that stay.')}</p></div><nav aria-label={t('Weitere Seiten', 'More pages')}><Link href="/studio">{t('Mein Studio', 'My studio')}</Link><Link href="/help">{t('Hilfe', 'Help')}</Link><Link href="/privacy">{t('Datenschutz', 'Privacy')}</Link><Link href="/legal">{t('Impressum', 'Legal')}</Link></nav><small><span>Your Story — {t('Konzept, Design & Entwicklung', 'Concept, design & development')}</span><span>{t('Interaktives Referenzprojekt', 'Interactive portfolio project')}</span></small></footer>;
}
