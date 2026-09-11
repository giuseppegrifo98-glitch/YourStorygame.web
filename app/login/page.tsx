import { getCurrentUser } from '../auth';
import { redirect } from 'next/navigation';
import { LoginScreen } from '../site/login';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Anmelden · Spielbare Erinnerungen' };

export default async function Page({ searchParams }: { searchParams: Promise<{ return_to?: string }> }) {
  const user = await getCurrentUser();
  const raw = (await searchParams).return_to || '/studio';
  const returnTo = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/studio';
  if (user) redirect(returnTo);
  return <LoginScreen returnTo={returnTo} />;
}
