import type {PlannerInput} from './engines';
// A draft can be mid-edit: empty names and unfinished score changes are preserved.
// Calculation/import validation still runs through the stricter engine contract.
export function restorePlannerDraft(raw:string):string|null {
 if(raw.length>65536)return null;
 try {
  const value=JSON.parse(raw) as PlannerInput;
  const num=(n:unknown)=>typeof n==='number'&&Number.isFinite(n);
  const str=(s:unknown,max:number)=>typeof s==='string'&&s.length<=max;
  if(!value||!['points','tokens'].includes(value.mode)||!['coins','trades'].includes(value.objective))return null;
  if(![value.currentScore,value.targetScore,value.currentTokens,value.targetTokens,value.coinBalance,value.taxRate].every(num))return null;
  if(!Array.isArray(value.cards)||value.cards.length>128||!Array.isArray(value.upgrades)||value.upgrades.length>16)return null;
  if(!value.cards.every(c=>c&&str(c.id,100)&&str(c.name,160)&&num(c.buy)&&num(c.sell)&&typeof c.owned==='boolean'))return null;
  if(!value.upgrades.every(u=>u&&str(u.id,100)&&str(u.setId,100)&&str(u.name,160)&&[u.currentScore,u.plannedScore,u.currentTokens,u.plannedTokens].every(num)&&Array.isArray(u.cardIds)&&u.cardIds.length<=128&&u.cardIds.every(id=>str(id,100))))return null;
  return JSON.stringify(value);
 }catch{return null}
}
