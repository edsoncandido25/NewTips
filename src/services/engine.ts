export type MatchInput={home:string;away:string;date:string;competition:string};
export type Analysis={status:'approved'|'rejected';match:string;market:string;line:string;odd:number;probability:number;implied:number;edge:number;ev:number;confidence:number;robustness:string;risk:string;classification:string;reasons:string[];risks:string[]};
const clamp=(n:number,min=0,max=100)=>Math.max(min,Math.min(max,n));
/** Deterministic fallback model. Production mode should call the protected Supabase Edge Function. */
export async function analyzeMatch(m:MatchInput,odd:number):Promise<Analysis>{
 const base=62+(m.competition?4:0)+(m.date?2:0);const probability=clamp(base);const implied=100/Math.max(odd,1.01);const edge=probability-implied;const ev=(probability/100*odd-1)*100;const approved=odd>=1.5&&probability>=75&&edge>0;
 return {status:approved?'approved':'rejected',match:`${m.home} x ${m.away}`,market:'Mercado a validar pelo motor',line:'—',odd,probability,implied,edge,ev,confidence:48,robustness:'BAIXA',risk:'🟡 MÉDIO',classification:approved?'🟡 VALOR':'🔴 REJEITADA',reasons:['Fallback local ativo: nenhum dado esportivo foi inventado.','A decisão definitiva depende da coleta multi-fonte e modelagem V3 no backend.','A odd informada é tratada apenas como referência de preço.'],risks:['Escalações, árbitro e contexto ainda não foram validados.','Amostra estatística e matchup ainda não foram coletados.','Sem confirmação das fontes, o motor deve evitar uma entrada definitiva.']};
}
