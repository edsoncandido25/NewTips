export type LiveMatch={id:string;home:string;away:string;competition:string;date:string;time:string;status:string;odd?:number;source:string};
const LEAGUES=['eng.1','esp.1','ita.1','ger.1','fra.1','bra.1','usa.1','uefa.champions','conmebol.libertadores'];
const day=(date:string)=>date.replaceAll('-','');
export async function fetchRealMatches(date:string):Promise<LiveMatch[]>{
 const results:LiveMatch[]=[];
 await Promise.all(LEAGUES.map(async league=>{
  try{
   const r=await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard?dates=${day(date)}`);
   if(!r.ok)return;
   const data=await r.json();
   for(const event of data.events??[]){
    const comp=event.competitions?.[0]; const competitors=comp?.competitors??[];
    const home=competitors.find((x:any)=>x.homeAway==='home'); const away=competitors.find((x:any)=>x.homeAway==='away');
    if(!home||!away)continue;
    const odds=comp?.odds?.[0]; const odd=Number(odds?.details?String(odds.details).match(/([0-9]+\.[0-9]+)/)?.[1]:odds?.price);
    results.push({id:String(event.id),home:home.team?.displayName??home.team?.name??'Mandante',away:away.team?.displayName??away.team?.name??'Visitante',competition:comp?.league?.name??data.leagues?.[0]?.name??league,date,time:new Date(event.date).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),status:event.status?.type?.description??'Agendado',odd:Number.isFinite(odd)&&odd>1?odd:undefined,source:'ESPN'});
   }
  }catch{}
 }));
 return results.sort((a,b)=>a.time.localeCompare(b.time));
}
