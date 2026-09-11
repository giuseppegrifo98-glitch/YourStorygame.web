import { requireChatGPTUser } from '../chatgpt-auth';
import { Studio } from '../site/studio';
export const dynamic='force-dynamic';
export const metadata={title:'Mein Studio · Spielbare Erinnerungen'};
export default async function Page(){const user=await requireChatGPTUser('/studio');return <Studio email={user.email}/>;}
