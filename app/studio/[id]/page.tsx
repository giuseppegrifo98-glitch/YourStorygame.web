import { requireUser } from '../../auth';
import { Editor } from '../../site/editor';
export const dynamic='force-dynamic';
export const metadata={title:'Geschichte gestalten · Spielbare Erinnerungen'};
export default async function Page({params}:{params:Promise<{id:string}>}){const{id}=await params;return <ProtectedEditor id={id}/>;}
async function ProtectedEditor({id}:{id:string}){await requireUser(`/studio/${id}`);return <Editor id={id}/>;}
