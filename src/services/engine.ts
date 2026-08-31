export type MatchInput={home:string;away:string;date:string;competition:string};
export type Analysis={status:'approved'|'rejected';match:string;market:string;line:string;odd:number;probability:number;implied:number;edge:number;ev:number;confidence:number;robustness:string;risk:string;classification:string;reasons:string[];risks:string[]};
const url=import.meta.env.VITE_SUPABASE_URL as string|undefined;
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string|undefined;
const fallback=async(m:MatchInput,odd:number):Promise<Analysis>=>{const probability=68;const implied=100/Math.max(odd,1.01);const edge=probability-implied;const ev=(probability/100*odd-1)*100;return{status:'rejected',match:`${m.home} x ${m.away}`,market:'Mercado sem dados reais',line:'—',odd,probability,implied,edge,ev,confidence:20,robustness:'BAIXA',risk:'🔴 ALTO',classification:'🔴 SEM ENTRADA',reasons:['Backend não configurado neste ambiente.','Nenhum dado esportivo foi inventado.'],risks:['Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY para usar o motor protegido.']}};
export async function analyzeMatch(m:MatchInput,odd:number):Promise<Analysis>{
 if(!url||!key)return fallback(m,odd);
 const {createClient}=await import('@supabase/supabase-js');
 const supabase=createClient(url,key);
 const {data:{session}}=await supabase.auth.getSession();
 if(!session)return fallback(m,odd);
 const {data,error}=await supabase.functions.invoke('newtips-engine',{body:{...m,odd}});
 if(error||!data)return fallback(m,odd);
 return data as Analysis;
}
