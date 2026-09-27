'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowUpRight, LoaderCircle, LockKeyhole, UserRound } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context';
import { Brand } from './shell';
import { api } from './api';

export function LoginScreen({ returnTo }: { returnTo: string }) { return <LanguageProvider><LoginContent returnTo={returnTo}/></LanguageProvider>; }

function LoginContent({ returnTo }: { returnTo: string }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try { await api('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'login', email, password }) }); location.assign(returnTo); }
    catch (e) { setError(loginError(e, t)); setBusy(false); }
  };
  return <main id="main-content" className="auth-page"><div className="auth-top"><Link href="/" className="back-link"><ArrowLeft size={17} aria-hidden="true" />{t('Zur Website','Back to website')}</Link><Brand/></div><section className="auth-card"><span className="auth-icon"><LockKeyhole size={23} aria-hidden="true" /></span><p className="eyebrow">{t('GESCHLOSSENER TESTZUGANG','CLOSED TEST ACCESS')}</p><h1>{t('Melde dich an.','Sign in.')}</h1><p className="auth-intro">{t('Dieser Zugang ist nur für bereits eingerichtete Testkonten verfügbar. Neue Registrierungen sind geschlossen.','This access is available only to existing test accounts. New registrations are closed.')}</p><form onSubmit={submit}><label className="field"><span>{t('E-Mail-Adresse','Email address')}</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} name="email" spellCheck={false} placeholder="du@beispiel.de" autoComplete="email" required/></label><label className="field"><span>{t('Passwort','Password')}</span><input name="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={t('Mindestens 8 Zeichen','At least 8 characters')} minLength={8} autoComplete="current-password" required/></label>{error&&<p className="error-message" role="alert">{error}</p>}<button className="button auth-submit" disabled={busy}>{busy?<LoaderCircle className="spin" size={18} aria-hidden="true" />:<UserRound size={18} aria-hidden="true" />} {t('Anmelden','Sign in')}<ArrowUpRight size={17} aria-hidden="true" /></button></form><p className="form-hint">{t('Du möchtest nur die Demo ansehen? Dafür brauchst du kein Konto.','Just want to view the demo? You do not need an account.')}</p><a className="quiet-link" href="/demo">{t('Demo mit Code ESCO öffnen','Open demo with code ESCO')}<ArrowUpRight size={17} aria-hidden="true" /></a><nav className="auth-legal" aria-label={t('Rechtliche Hinweise','Legal information')}><Link href="/privacy">{t('Datenschutz','Privacy')}</Link><Link href="/legal">{t('Impressum','Legal notice')}</Link></nav></section></main>;
}

function loginError(error: unknown, t: (de: string, en: string) => string) {
  const code = error instanceof Error ? error.message : '';
  const map: Record<string, [string,string]> = { invalid_credentials: ['E-Mail oder Passwort stimmen nicht.','The email or password is incorrect.'], registration_closed: ['Neue Registrierungen sind derzeit geschlossen.','New registrations are currently closed.'], invalid_origin: ['Diese Anfrage wurde blockiert. Lade die Seite neu.','This request was blocked. Reload the page.'] };
  return map[code]?.[0] ? t(...map[code]) : t('Das hat nicht geklappt. Bitte versuche es erneut.','That did not work. Please try again.');
}
