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
  const [mode, setMode] = useState<'login'|'register'>(returnTo === '/create' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try { await api('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, email, password, name }) }); location.assign(returnTo); }
    catch (e) { setError(loginError(e, t)); setBusy(false); }
  };
  return <main id="main-content" className="auth-page"><div className="auth-top"><Link href="/" className="back-link"><ArrowLeft size={17}/>{t('Zur Website','Back to website')}</Link><Brand/></div><section className="auth-card"><span className="auth-icon"><LockKeyhole size={23}/></span><p className="eyebrow">{mode==='login'?t('WILLKOMMEN ZURÜCK','WELCOME BACK'):t('DEIN KREATIVER ORT','YOUR CREATIVE CORNER')}</p><h1>{mode==='login'?t('Melde dich an.','Sign in.'):t('Erstelle dein Konto.','Create your account.')}</h1><p className="auth-intro">{mode==='login'?t('Deine Entwürfe warten auf dich.','Your drafts are waiting for you.'):t('Speichere deine Geschichte und arbeite später weiter.','Save your story and continue later.')}</p><form onSubmit={submit}>{mode==='register'&&<label className="field"><span>{t('Dein Name','Your name')}</span><input value={name} onChange={e=>setName(e.target.value)} placeholder={t('z. B. Giuse','e.g. Alex')} autoComplete="name" required/></label>}<label className="field"><span>{t('E-Mail-Adresse','Email address')}</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} name="email" spellCheck={false} placeholder="du@beispiel.de" autoComplete="email" required/></label><label className="field"><span>{t('Passwort','Password')}</span><input name="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={t('Mindestens 8 Zeichen','At least 8 characters')} minLength={8} autoComplete={mode==='login'?'current-password':'new-password'} required/></label>{error&&<p className="error-message" role="alert">{error}</p>}<button className="button auth-submit" disabled={busy}>{busy?<LoaderCircle className="spin" size={18}/>:<UserRound size={18}/>} {mode==='login'?t('Anmelden','Sign in'):t('Konto erstellen','Create account')}<ArrowUpRight size={17}/></button></form><button className="auth-switch" onClick={()=>{setMode(mode==='login'?'register':'login');setError('');}}>{mode==='login'?t('Noch kein Konto? Jetzt registrieren.','No account yet? Create one.'):t('Schon registriert? Anmelden.','Already registered? Sign in.')}</button><p className="form-hint">{t('Dein Konto ist für deine Entwürfe. Diese Testversion nimmt noch keine Zahlungen an.','Your account is for your drafts. This test version does not take payments.')}</p></section></main>;
}

function loginError(error: unknown, t: (de: string, en: string) => string) {
  const code = error instanceof Error ? error.message : '';
  const map: Record<string, [string,string]> = { invalid_credentials: ['E-Mail oder Passwort stimmen nicht.','The email or password is incorrect.'], name_required: ['Bitte gib deinen Namen ein.','Please enter your name.'], email_exists: ['Für diese E-Mail gibt es bereits ein Konto.','An account already exists for this email.'], invalid_origin: ['Diese Anfrage wurde blockiert. Lade die Seite neu.','This request was blocked. Reload the page.'] };
  return map[code]?.[0] ? t(...map[code]) : t('Das hat nicht geklappt. Bitte versuche es erneut.','That did not work. Please try again.');
}
