import {S,emit,nid} from './state.js';
import {CROPS,RECIPES,CATS,DECOR,BUILD,MISSIONS,ACH,MILESTONES,STORY,PASS_TASKS} from './data.js';
export const now=()=>Date.now();
export const toast=(m,k='ok')=>emit('toast',{m,k});
export const xpNeed=l=>40+l*35;
export function addCoins(n){S.coins+=n;if(n>0)S.stats.earn+=n;emit('hud')}
export function addXp(n){S.xp+=n;while(S.xp>=xpNeed(S.lv)){S.xp-=xpNeed(S.lv);S.lv++;addCoins(40*S.lv);emit('levelup',S.lv);const m=MILESTONES.find(x=>x.lv===S.lv);if(m){toast(`${m.e} Desbloqueado: ${m.n}!`);emit('milestone',m)}}emit('hud')}
export function addItem(k,n=1){S.inv[k]=(S.inv[k]||0)+n;emit('inv')}
export const have=i=>Object.entries(i).every(([k,n])=>(S.inv[k]||0)>=n);
export const getB=id=>S.buildings.find(b=>b.id===id);
export const nameOf=k=>(CROPS[k]||RECIPES[k]||{}).n||k;
export const emojiOf=k=>(CROPS[k]||RECIPES[k]||{}).e||'❔';
export function speed(b){const c=b.cat&&S.cats[b.cat];let s=1+.2*(b.lv-1);if(c){s*=1.1+.1*c.lv;if(CATS[b.cat].skill===b.type)s*=1.15}return s}
// farming
export const growProg=(p,t=now())=>Math.min(1,(t-p.at)/(p.end-p.at));
export function plant(bid,i,k,quiet){const b=getB(bid),c=CROPS[k];if(!b||b.type!=='farm'||b.plots[i]||!c)return false;
 if(S.lv<c.lv){quiet||toast('Nível '+c.lv+' necessário','bad');return false}
 if(S.coins<c.seed){quiet||toast('Moedas insuficientes','bad');return false}
 S.coins-=c.seed;const t=now();b.plots[i]={c:k,at:t,end:t+c.t*1000/speed(b)};if(k==='wheat')S.stats.wheatPlanted++;checkStory();emit('hud');return true}
export function harvest(bid,i){const b=getB(bid),p=b&&b.plots[i];if(!p||now()<p.end)return false;
 const n=2+(b.lv>=3?1:0)+(b.lv>=5?1:0);addItem(p.c,n);addXp(CROPS[p.c].xp);S.stats.harvest++;if(p.c==='wheat')S.stats.wheatHarvest++;b.plots[i]=null;emit('harvested',{b,i,k:p.c,n});checkStory();return true}
export function plantAll(bid,k){let n=0;const b=getB(bid);if(!b)return 0;for(let i=0;i<6;i++)if(plant(bid,i,k,true))n++;if(!n)toast('Nada plantado (moedas/nível?)','bad');return n}
export function harvestAll(bid){let n=0;for(let i=0;i<6;i++)if(harvest(bid,i))n++;return n}
// production
export const cap=b=>3+Math.floor(b.lv/2);
export function cook(bid,rid){const b=getB(bid),r=RECIPES[rid];if(!b||!r||r.b!==b.type)return false;
 if(S.lv<r.lv){toast('Nível '+r.lv+' necessário','bad');return false}
 if((b.cur?1:0)+b.q.length>=cap(b)){toast('Fila cheia','bad');return false}
 if(!have(r.in)){toast('Faltam ingredientes','bad');return false}
 for(const[k,n]of Object.entries(r.in))S.inv[k]-=n;
 if(!b.cur)b.cur={r:rid,s:now(),e:now()+r.t*1000/speed(b)};else b.q.push(rid);emit('inv');return true}
export function tickB(b,t=now()){if(!b.cur)return;let n=0;
 while(b.cur&&t>=b.cur.e&&n++<60){const id=b.cur.r,s=b.cur.e;addItem(id,1);S.stats.cook++;if(id==='bread')S.stats.breadMade++;addXp(RECIPES[id].xp);emit('cooked',{b,id});b.cur=null;checkStory();
  if(b.q.length){const nr=b.q.shift();b.cur={r:nr,s,e:s+RECIPES[nr].t*1000/speed(b)}}}}
export const upCost=b=>Math.round(120*b.lv*b.lv*(b.type==='restaurant'?1.5:1));
export function upgrade(bid){const b=getB(bid);if(!b||b.lv>=5)return false;const c=upCost(b);
 if(S.coins<c){toast('Moedas insuficientes','bad');return false}S.coins-=c;b.lv++;emit('hud');toast('Melhorado para o nível '+b.lv+'! ✨');return true}
// economy
const price=k=>(CROPS[k]||RECIPES[k]||{sell:0}).sell;
export function sell(k,all){const n=all?(S.inv[k]||0):Math.min(1,S.inv[k]||0);if(!n)return;S.inv[k]-=n;addCoins(n*price(k));emit('inv')}
// cats
export function unlockCat(id){const c=CATS[id];if(!c||S.cats[id])return false;
 if(c.lv>=6&&!S.buildings.some(b=>b.type==='observatory')){toast('Construa o observatório para atrair gatos raros.','bad');return false}
 if(S.lv<c.lv){toast('Nível '+c.lv+' necessário','bad');return false}
 if(S.coins<c.price){toast('Moedas insuficientes','bad');return false}
 S.coins-=c.price;S.cats[id]={lv:1};emit('catAdded',id);emit('hud');toast(c.n+' chegou à vila! 🐱');return true}
export const catUpCost=id=>80*S.cats[id].lv*S.cats[id].lv;
export function catUp(id){const c=S.cats[id];if(!c||c.lv>=5)return false;const p=catUpCost(id);
 if(S.coins<p){toast('Moedas insuficientes','bad');return false}S.coins-=p;c.lv++;emit('hud');return true}
export function assign(bid,cid){if(cid)for(const b of S.buildings)if(b.cat===cid)b.cat=null;const b=getB(bid);if(b)b.cat=cid||null;emit('assign')}
const petCd={};
export function pet(id){const t=now();if(petCd[id]>t)return 0;petCd[id]=t+2500;S.stats.pet++;const g=1+(Math.random()*3|0);addCoins(g);addXp(1);return g}
// build & decor
export function buyBuilding(type,x,z,r){const d=BUILD[type];if(S.lv<d.lv||S.coins<d.price){toast(S.lv<d.lv?'Nível '+d.lv+' necessário':'Moedas insuficientes','bad');return null}
 S.coins-=d.price;const b={id:nid(),type,x,z,r,lv:1,cat:null};if(type==='farm')b.plots=Array(6).fill(null);
 if(['kitchen','bakery','dairy','packing','toolshop'].includes(type)){b.cur=null;b.q=[]}S.buildings.push(b);S.stats.build++;emit('sync');emit('hud');toast(d.n+' construído! 🏠');return b}
export function buyDecor(t){const d=DECOR[t];if(S.coins<d.price){toast('Moedas insuficientes','bad');return false}S.coins-=d.price;S.decoInv[t]=(S.decoInv[t]||0)+1;emit('hud');emit('inv');return true}
export function placeDecor(t,x,z,r){if(!(S.decoInv[t]>0))return null;S.decoInv[t]--;const d={id:nid(),type:t,x,z,r};S.decor.push(d);S.stats.place++;emit('sync');emit('inv');return d}
export function storeDecor(id){const i=S.decor.findIndex(d=>d.id===id);if(i<0)return;const d=S.decor.splice(i,1)[0];S.decoInv[d.type]=(S.decoInv[d.type]||0)+1;emit('sync');emit('inv')}
// customers
export const CUST=[];let nextSpawn=now()+4000,cid=1;
export const restaurant=()=>S.buildings.find(b=>b.type==='restaurant');
const TINTS=[null,0xffd1dc,0xb5e3ff,0xfff0a8,0xc9f2c7];
export function tickCust(t=now()){const r=restaurant();if(!r)return;const max=Math.min(4,2+r.lv);
 for(const c of CUST.slice())if(t>c.born+c.pat)rmCust(c,false);
 if(CUST.length<max&&t>=nextSpawn){nextSpawn=t+(14000+Math.random()*9000)/(r.cat?1.25:1);
  const opts=Object.keys(RECIPES).filter(k=>RECIPES[k].lv<=S.lv),want=opts[Math.random()*opts.length|0];
  const used=CUST.map(c=>c.slot);let slot=0;while(used.includes(slot))slot++;
  const available=['frog','duck','banana','persian'].filter(k=>!CUST.some(active=>active.kind===k));
  const kind=available.length?available[Math.random()*available.length|0]:['frog','duck','banana','persian'][Math.random()*4|0];
  const c={id:'c'+cid++,kind,tint:kind==='frog'||kind==='duck'?null:TINTS[Math.random()*TINTS.length|0],want,slot,born:t,pat:150000};CUST.push(c);emit('custAdd',c)}}
function rmCust(c,ok,reward){const i=CUST.indexOf(c);if(i>=0)CUST.splice(i,1);emit('custDel',{c,ok,reward})}
export function serve(id){const c=CUST.find(x=>x.id===id),r=restaurant();if(!c||!r)return false;
 if(!(S.inv[c.want]>0)){toast('Faltando '+nameOf(c.want)+' no inventário','bad');return false}
 S.inv[c.want]--;const rw=Math.round(RECIPES[c.want].sell*1.5*(1+.15*(r.lv-1))*(r.cat?1.1:1));
 addCoins(rw);addXp(RECIPES[c.want].xp+2);S.stats.serve++;rmCust(c,true,rw);emit('inv');toast('+'+rw+' 🪙 — cliente feliz!');return true}
const DELIVERY_POOL=[
 {k:'wheat',lv:1},{k:'carrot',lv:1},{k:'bread',lv:1},{k:'tomato',lv:1},
 {k:'flour',lv:4},{k:'baguette',lv:4},{k:'paperbag',lv:5},{k:'milk',lv:6},
 {k:'corn',lv:6},{k:'cornbread',lv:8},{k:'cardboard',lv:8},{k:'cheese',lv:9}
];
export function deliveryOrder(){if(!S.delivery.current){if(S.delivery.completed===0)S.delivery.current={items:{wheat:1,carrot:1},created:now()};else{const pool=DELIVERY_POOL.filter(x=>x.lv<=S.lv).map(x=>x.k),picked=[];while(picked.length<2&&pool.length){const i=Math.random()*pool.length|0;picked.push(pool.splice(i,1)[0])}const items={};for(const k of picked)items[k]=1;S.delivery.current={items,created:now()}}}return S.delivery.current}
export const canDeliver=()=>Object.entries(deliveryOrder().items).every(([k,n])=>(S.inv[k]||0)>=n);
export function deliverOrder(){if(S.lv<3){toast('O pelicano chega no nível 3.','bad');return false}const o=deliveryOrder();if(!canDeliver()){toast('Ainda faltam produtos para este pedido.','bad');return false}
 let reward=35,xp=12;for(const[k,n]of Object.entries(o.items)){S.inv[k]-=n;const d=CROPS[k]||RECIPES[k];reward+=d.sell*n;xp+=d.xp||0}
 reward=Math.round(reward*1.5);S.delivery.completed++;S.delivery.current=null;S.stats.delivery++;addCoins(reward);addXp(xp);emit('inv');emit('delivery');checkStory();toast(`Pedido entregue! +${reward} moedas e +${xp} XP.`);return true}
export function storyStep(){return STORY[Math.min(S.story,STORY.length-1)]}
export function startStory(){if(S.story===0){S.story=1;emit('story');checkStory()} }
function checkStory(){while(S.story>0&&S.story<STORY.length-1){const step=STORY[S.story];if(!step.stat||(S.stats[step.stat]||0)<step.n)break;S.story++;addCoins(15);addXp(5);toast(`Etapa concluída: ${step.t}!`);emit('story')} }
const dayKey=t=>{const d=new Date(t);return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
export const dailyReady=()=>S.lv>=10&&S.daily.last!==dayKey(now());
export function claimDaily(){if(!dailyReady())return false;const t=now(),y=new Date(t);y.setDate(y.getDate()-1);S.daily.streak=S.daily.last===dayKey(y)?S.daily.streak+1:1;S.daily.last=dayKey(t);const coins=100+Math.min(20,S.daily.streak-1)*25;addCoins(coins);addXp(25);emit('daily');toast(`PresenÃ§a diÃ¡ria: +${coins} moedas e +25 XP!`);return true}
export const passProg=t=>S.stats[t.stat]||0;
export function claimPass(id){if(S.lv<13)return false;const t=PASS_TASKS.find(x=>x.id===id);if(!t||S.passClaimed[id]||passProg(t)<t.n)return false;S.passClaimed[id]=1;addCoins(t.coins);addXp(t.xp);emit('pass');toast(`Passe fofinho: +${t.coins} moedas e +${t.xp} XP!`);return true}
// missions
export const prog=m=>m.k==='lv'?S.lv:m.k==='cats'?Object.keys(S.cats).length:(S.stats[m.k]||0);
export function claim(id){const m=[...MISSIONS,...ACH].find(x=>x.id===id);if(!m||S.claimed[id]||prog(m)<m.n)return false;
 S.claimed[id]=1;addCoins(m.r);addXp(10);toast('Recompensa: +'+m.r+' 🪙');emit('claim');return true}
export const claimable=()=>[...MISSIONS,...ACH].filter(m=>!S.claimed[m.id]&&prog(m)>=m.n).length;
// bonus cat
export function money(){const v=100+S.lv*40;addCoins(v);toast('Gatinho do dinheiro! +'+v+' 🪙');return v}
