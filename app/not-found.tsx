import Link from 'next/link';
export default function NotFound(){return <main id="main-content" className="notice-page"><span className="eyebrow">404</span><h1>Hier ist gerade keine Geschichte.</h1><p>Dieser Link ist ungültig oder wurde zurückgezogen.<br/>This link is invalid or has been revoked.</p><Link className="button" href="/">Zur Startseite / Back home</Link></main>;}
