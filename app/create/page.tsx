import { getChatGPTUser } from '../chatgpt-auth';
import { CreateScreen } from '../site/studio';
export const dynamic='force-dynamic';
export const metadata={title:'Deine Geschichte starten · Spielbare Erinnerungen'};
export default async function Page(){return <CreateScreen signedIn={!!(await getChatGPTUser())}/>;}
