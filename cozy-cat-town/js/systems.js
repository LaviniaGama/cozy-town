import {S,emit,nid} from './state.js';
import {CROPS,RECIPES,GOODS,FISH,BUILDING_PRODUCERS,CATS,DECOR,BUILD,MISSIONS,ACH,MILESTONES,STORY,PASS_TASKS,activeMissions} from './data.js';
export const now=()=>Date.now();
export const toast=(m,k='ok')=>emit('toast',{m,k});
export const xpNeed=l=>40+l*35;
export function addCoins(n){S.coins+=n;if(n>0)S.stats.earn+=n;emit('hud')}
export function addXp(n){S.xp+=n;while(S.xp>=xpNeed(S.lv)){S.xp-=xpNeed(S.lv);S.lv++;addCoins(40*S.lv);emit('levelup',S.lv);const m=MILESTONES.find(x=>x.lv===S.lv);if(m){toast(`${m.e} Desbloqueado: ${m.n}!`);emit('milestone',m)}}emit('hud')}
export function addItem(k,n=1){S.inv[k]=(S.inv[k]||0)+n;emit('inv')}
export const itemAliases=k=>{
  const keys=[k];
  if(k==='flour')keys.push('flour_sack');
  if(k==='flour_sack')keys.push('flour');
  return [...new Set(keys)];
};
export const inventoryCount=k=>itemAliases(k).reduce((sum,alias)=>sum+(S.inv[alias]||0),0);
export const hasItem=(k,n=1)=>inventoryCount(k)>=n;
export const consumeItems=needed=>{for(const[k,n]of Object.entries(needed)){let left=n;for(const alias of itemAliases(k)){const available=S.inv[alias]||0;if(!available)continue;const used=Math.min(available,left);S.inv[alias]-=used;left-=used;if(left<=0)break}if(left>0)return false}return true};
export const have=i=>Object.entries(i).every(([k,n])=>inventoryCount(k)>=n);
export const getB=id=>S.buildings.find(b=>b.id===id);
export const nameOf=k=>(CROPS[k]||RECIPES[k]||GOODS[k]||{}).n||k;
export const emojiOf=k=>(CROPS[k]||RECIPES[k]||GOODS[k]||{}).e||'❔';
export function speed(b){const c=b.cat&&S.cats[b.cat];let s=1+.2*(b.lv-1);if(c){s*=1.1+.1*c.lv;if(CATS[b.cat].skill===b.type)s*=1.15}return s}
// farming
export const growProg=(p,t=now())=>Math.min(1,(t-p.at)/(p.end-p.at));
export function plant(bid,i,k,quiet){const b=getB(bid),c=CROPS[k];if(!b||b.type!=='farm'||b.plots[i]||!c)return false;
 if(S.lv<c.lv){quiet||toast('Nível '+c.lv+' necessário','bad');return false}
 if((S.seeds[k]||0)<1){quiet||toast('Sem sementes. Visite a loja para comprar mais.','bad');return false}
 S.seeds[k]--;const t=now();b.plots[i]={c:k,at:t,end:t+c.t*1000/speed(b)};if(k==='wheat')S.stats.wheatPlanted++;checkStory();emit('hud');emit('inv');return true}
export function harvest(bid,i){const b=getB(bid),p=b&&b.plots[i];if(!p||now()<p.end)return false;
 const n=2+(b.lv>=3?1:0)+(b.lv>=5?1:0);addItem(p.c,n);addXp(CROPS[p.c].xp);S.stats.harvest++;if(p.c==='wheat')S.stats.wheatHarvest++;b.plots[i]=null;emit('harvested',{b,i,k:p.c,n});checkStory();return true}
export function plantAll(bid,k){let n=0;const b=getB(bid);if(!b)return 0;for(let i=0;i<6;i++)if(plant(bid,i,k,true))n++;if(!n)toast('Nada plantado. Verifique sementes, nível e canteiros vazios.','bad');return n}
export function harvestAll(bid){let n=0;for(let i=0;i<6;i++)if(harvest(bid,i))n++;return n}
// production
export const cap=()=>Infinity;
export function cook(bid,rid,quantity=1){const b=getB(bid),r=RECIPES[rid];if(!b||!r||r.b!==b.type)return false;
 if(S.lv<r.lv){toast('Nível '+r.lv+' necessário','bad');return false}
 if(!Number.isSafeInteger(quantity)||quantity<1){toast('Escolha uma quantidade válida.','bad');return false}
 const needed=Object.fromEntries(Object.entries(r.in).map(([k,n])=>[k,n*quantity]));
 if(!have(needed)){toast('Faltam ingredientes para essa quantidade.','bad');return false}
 if(!consumeItems(needed)){toast('Faltam ingredientes para essa quantidade.','bad');return false}
 const t=now(),queuedCount=quantity-(b.cur?0:1);if(!b.cur)b.cur={r:rid,s:t,e:t+r.t*1000/speed(b)};
 if(queuedCount>0){const last=b.q.length-1,queued=b.q[last];if(queued&&typeof queued==='object'&&queued.r===rid)queued.n+=queuedCount;else if(queued===rid)b.q[last]={r:rid,n:queuedCount+1};else b.q.push({r:rid,n:queuedCount})}
 emit('inv');return true}
export function tickB(b,t=now()){if(!b.cur)return;let n=0;
 while(b.cur&&t>=b.cur.e&&n++<60){const id=b.cur.r,s=b.cur.e;addItem(id,1);S.stats.cook++;if(id==='bread')S.stats.breadMade++;addXp(RECIPES[id].xp);emit('cooked',{b,id});b.cur=null;checkStory();
  if(b.q.length){const queued=b.q[0],nr=typeof queued==='string'?queued:queued.r;if(typeof queued==='object'){if(queued.n>1)queued.n--;else b.q.shift()}else b.q.shift();b.cur={r:nr,s,e:s+RECIPES[nr].t*1000/speed(b)}}}}
export const upCost=b=>Math.round(120*b.lv*b.lv*(b.type==='restaurant'?1.5:1));
export function upgrade(bid){const b=getB(bid);if(!b||b.lv>=5)return false;const c=upCost(b);
 if(S.coins<c){toast('Moedas insuficientes','bad');return false}S.coins-=c;b.lv++;emit('hud');toast('Melhorado para o nível '+b.lv+'! ✨');return true}
// economy
const price=k=>(CROPS[k]||RECIPES[k]||GOODS[k]||{sell:0}).sell;
export function sell(k,all){const n=all?(S.inv[k]||0):Math.min(1,S.inv[k]||0);if(!n)return;S.inv[k]-=n;addCoins(n*price(k));emit('inv')}
export function buySeeds(k,pack=5){const c=CROPS[k];if(!c||S.lv<c.lv){toast(c?'Nível '+c.lv+' necessário':'Semente indisponível','bad');return false}
 const cost=c.seed*pack;if(S.coins<cost){toast('Moedas insuficientes para comprar as sementes.','bad');return false}
 S.coins-=cost;S.seeds[k]=(S.seeds[k]||0)+pack;S.stats.seedBought+=pack;emit('hud');emit('inv');toast(`+${pack} sementes de ${c.n.toLowerCase()}! 🌱`);return true}
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
 if(BUILDING_PRODUCERS[type])b.readyAt=now()+BUILDING_PRODUCERS[type].interval*1000/speed(b);
 if(['kitchen','bakery','dairy','packing','toolshop'].includes(type)){b.cur=null;b.q=[]}S.buildings.push(b);S.stats.build++;emit('sync');emit('hud');toast(d.n+' construído! 🏠');return b}
export const productionStatus=id=>{const b=getB(id),spec=b&&BUILDING_PRODUCERS[b.type];if(!b||!spec)return null;
 const readyAt=b.readyAt||0;return{b,spec,readyAt,remaining:Math.max(0,readyAt-now()),ready:readyAt<=now(),amount:spec.amount+Math.floor((b.lv-1)/2)}};
export function collectBuilding(id){const status=productionStatus(id);if(!status)return false;
 if(!status.ready){toast(`${GOODS[status.spec.item].n}: pronto em ${Math.ceil(status.remaining/1000)}s.`);return false}
 const {b,spec,amount}=status,good=GOODS[spec.item],n=amount+(b.cat?1:0);
 addItem(spec.item,n);addXp(good.xp*n);b.readyAt=now()+spec.interval*1000/speed(b);
 toast(`Recolheu ${n} ${good.n.toLowerCase()}! ${good.e}`);emit('production',{id,item:spec.item,n});return true}
export function buyFish(id,key){const b=getB(id),fish=FISH.find(x=>x.id===key);if(!b||b.type!=='fish_pond'||!fish)return false;
 if(S.lv<fish.lv){toast(`Nível ${fish.lv} necessário para este peixe.`,'bad');return false}
 if(S.coins<fish.cost){toast('Moedas insuficientes para comprar este peixe.','bad');return false}
 S.coins-=fish.cost;addItem(key);addXp(GOODS[key].xp);emit('hud');toast(`Comprou ${fish.n} por ${fish.cost} 🪙 ${fish.e}`);return true}
export function catchFish(id){const b=getB(id);if(!b||b.type!=='fishery')return false;
 const available=FISH.filter(f=>f.lv<=S.lv),fish=available[Math.random()*available.length|0],cost=Math.ceil(fish.cost*1.25);
 if(S.coins<cost){toast(`A pescaria custa ${cost} moedas.`,'bad');return false}
 S.coins-=cost;addItem(fish.id);addXp(GOODS[fish.id].xp);emit('hud');toast(`Pescou ${fish.n}! −${cost} 🪙 ${fish.e}`);return true}
export function buyDecor(t,decorColor){const d=DECOR[t];if(!d)return false;if(S.coins<d.price){toast('Moedas insuficientes','bad');return false}S.coins-=d.price;S.decoInv[t]=(S.decoInv[t]||0)+1;(S.decoInvColors[t]||(S.decoInvColors[t]=[])).push(decorColor??null);emit('hud');emit('inv');return true}
export const peekDecorColor=t=>S.decoInvColors[t]?.[S.decoInvColors[t].length-1];
export function placeDecor(t,x,z,r,decorColor){if(!(S.decoInv[t]>0))return null;S.decoInv[t]--;const savedColor=S.decoInvColors[t]?.pop(),color=decorColor??savedColor,d={id:nid(),type:t,x,z,r};
 if(color!=null){d.decorColor=color;if(DECOR[t].form==='flower')d.flowerColor=color}
 if(DECOR[t].form==='fruitTree')d.fruitAt=now()+DECOR[t].grow;
 S.decor.push(d);S.stats.place++;emit('sync');emit('inv');return d}
export function placeDecorBatch(t,placements,r=0,decorColor){
 const spec=DECOR[t];if(!spec||!Array.isArray(placements))return 0;
 const count=Math.min(placements.length,S.decoInv[t]||0);
 if(!count)return 0;
 for(const p of placements.slice(0,count)){
  const savedColor=S.decoInvColors[t]?.pop(),color=decorColor??savedColor;
  S.decoInv[t]--;
  const old=spec.form==='floor'?S.decor.find(d=>DECOR[d.type]?.form==='floor'&&d.x===p.x&&d.z===p.z):null;
  if(old){
   S.decoInv[old.type]=(S.decoInv[old.type]||0)+1;
   (S.decoInvColors[old.type]||(S.decoInvColors[old.type]=[])).push(old.decorColor??old.flowerColor??null);
   old.type=t;old.r=r;delete old.decorColor;delete old.flowerColor;
   if(color!=null){old.decorColor=color;if(spec.form==='flower')old.flowerColor=color}
  }else{
   const d={id:nid(),type:t,x:p.x,z:p.z,r};
   if(color!=null){d.decorColor=color;if(spec.form==='flower')d.flowerColor=color}
   S.decor.push(d);S.stats.place++;
  }
 }
 emit('sync');emit('hud');emit('inv');
 return count;
}
export function harvestTree(id){const d=S.decor.find(x=>x.id===id),spec=d&&DECOR[d.type];if(!d||spec?.form!=='fruitTree')return false;
 const t=now();if(!d.fruitAt)d.fruitAt=t+spec.grow;
 if(t<d.fruitAt){toast(`${spec.n}: frutos em ${Math.ceil((d.fruitAt-t)/1000)}s.`);return false}
 const n=spec.yield;addItem(spec.fruit,n);addXp(CROPS[spec.fruit].xp*n);S.stats.treeHarvest++;d.fruitAt=t+spec.grow;emit('treeHarvest',{id,n,fruit:spec.fruit});toast(`Colheu ${n} ${CROPS[spec.fruit].n.toLowerCase()}! 🍃`);return true}
export const treeReady=id=>{const d=S.decor.find(x=>x.id===id),spec=d&&DECOR[d.type];return !!spec&&spec.form==='fruitTree'&&Date.now()>=(d.fruitAt||0)}
export function replaceFloor(id,type,r){const old=S.decor.find(d=>d.id===id);if(!old||!(S.decoInv[type]>0))return false;
 S.decoInv[type]--;S.decoInvColors[type]?.pop();S.decoInv[old.type]=(S.decoInv[old.type]||0)+1;(S.decoInvColors[old.type]||(S.decoInvColors[old.type]=[])).push(old.decorColor??old.flowerColor??null);old.type=type;old.r=r;delete old.decorColor;delete old.flowerColor;emit('sync');emit('inv');toast('Piso renovado! ✨');return true}
export function storeDecor(id){const i=S.decor.findIndex(d=>d.id===id);if(i<0)return false;const d=S.decor.splice(i,1)[0];S.decoInv[d.type]=(S.decoInv[d.type]||0)+1;(S.decoInvColors[d.type]||(S.decoInvColors[d.type]=[])).push(d.decorColor??d.flowerColor??null);emit('sync');emit('inv');toast('Decoração guardada no inventário 📦');return true}
export function sellDecor(id){const i=S.decor.findIndex(d=>d.id===id);if(i<0)return false;const d=S.decor[i],price=Math.floor((DECOR[d.type]?.price||0)*.5);
 S.decor.splice(i,1);addCoins(price);emit('sync');emit('inv');toast(`Decoração vendida por ${price} 🪙`);return true}
export function storeBuilding(id){const i=S.buildings.findIndex(b=>b.id===id);if(i<0)return false;
 const stored=JSON.parse(JSON.stringify(S.buildings[i]));stored.cat=null;if(stored.type==='restaurant')closeRestaurantCustomers();S.storedBuildings.push(stored);S.buildings.splice(i,1);emit('sync');emit('inv');toast('Construção guardada no inventário 📦');return true}
export function placeStored(id,x,z,r){const i=S.storedBuildings.findIndex(b=>b.id===id);if(i<0)return false;
 const [b]=S.storedBuildings.splice(i,1);b.x=x;b.z=z;b.r=r;S.buildings.push(b);emit('sync');emit('inv');toast(`${BUILD[b.type].n} colocado novamente!`);return true}
export function sellBuilding(id){const i=S.buildings.findIndex(b=>b.id===id);if(i<0)return false;const b=S.buildings[i];
 if(['farm','kitchen'].includes(b.type)&&S.buildings.filter(x=>x.type===b.type).length===1){toast(`Mantenha ao menos uma ${BUILD[b.type].n.toLowerCase()} na vila. Você pode guardá-la e colocá-la de volta depois.`,'bad');return false}
 const value=Math.floor((BUILD[b.type]?.price||0)*.5);
 if(b.type==='restaurant')closeRestaurantCustomers();S.buildings.splice(i,1);addCoins(value);emit('sync');emit('hud');toast(`${BUILD[b.type].n} vendido por ${value} 🪙`);return true}
// customers
export const CUST=[];let nextSpawn=now()+4000,cid=1;
export const restaurant=()=>S.buildings.find(b=>b.type==='restaurant');
function closeRestaurantCustomers(){for(const c of CUST.slice())rmCust(c,false)}
const VISITOR_MODELS=['strawberryCat','banana','persian'];
export function tickCust(t=now()){const r=restaurant();if(!r)return;const max=Math.min(4,2+r.lv);
 for(const c of CUST.slice())if(t>c.born+c.pat)rmCust(c,false);
 if(CUST.length<Math.min(max,VISITOR_MODELS.length)&&t>=nextSpawn){nextSpawn=t+(14000+Math.random()*9000)/(r.cat?1.25:1);
  const opts=Object.keys(RECIPES).filter(k=>RECIPES[k].lv<=S.lv),want=opts[Math.random()*opts.length|0];
  const used=CUST.map(c=>c.slot);let slot=0;while(used.includes(slot))slot++;
  const available=VISITOR_MODELS.filter(model=>!CUST.some(active=>(active.model||active.kind)===model));
  if(!available.length)return;
  const model=available[Math.random()*available.length|0];
  const c={id:'c'+cid++,kind:model,model,tint:null,want,slot,born:t,pat:150000};CUST.push(c);emit('custAdd',c)}}
function rmCust(c,ok,reward){const i=CUST.indexOf(c);if(i>=0)CUST.splice(i,1);emit('custDel',{c,ok,reward})}
export function serve(id){const c=CUST.find(x=>x.id===id),r=restaurant();if(!c||!r)return false;
 if(!hasItem(c.want,1)){toast('Faltando '+nameOf(c.want)+' no inventário','bad');return false}
 const used=consumeItems({[c.want]:1});if(!used){toast('Faltando '+nameOf(c.want)+' no inventário','bad');return false}
 const rw=Math.round(RECIPES[c.want].sell*1.5*(1+.15*(r.lv-1))*(r.cat?1.1:1));
 addCoins(rw);addXp(RECIPES[c.want].xp+2);S.stats.serve++;rmCust(c,true,rw);emit('inv');toast('+'+rw+' 🪙 — cliente feliz!');return true}
const DELIVERY_POOL=[
 {k:'wheat',lv:1},{k:'carrot',lv:1},{k:'bread',lv:1},{k:'tomato',lv:1},
 {k:'flour',lv:4},{k:'baguette',lv:4},{k:'paperbag',lv:5},{k:'milk',lv:6},
 {k:'corn',lv:6},{k:'cornbread',lv:8},{k:'cardboard',lv:8},{k:'cheese',lv:9}
];
export function deliveryOrder(){if(!S.delivery.current){if(S.delivery.completed===0)S.delivery.current={items:{wheat:1,carrot:1},created:now()};else{const pool=DELIVERY_POOL.filter(x=>x.lv<=S.lv).map(x=>x.k),picked=[];while(picked.length<2&&pool.length){const i=Math.random()*pool.length|0;picked.push(pool.splice(i,1)[0])}const items={};for(const k of picked)items[k]=1;S.delivery.current={items,created:now()}}}return S.delivery.current}
export const canDeliver=()=>Object.entries(deliveryOrder().items).every(([k,n])=>inventoryCount(k)>=n);
export function deliverOrder(){if(S.lv<3){toast('O pelicano chega no nível 3.','bad');return false}const o=deliveryOrder();if(!canDeliver()){toast('Ainda faltam produtos para este pedido.','bad');return false}
 let reward=35,xp=12;for(const[k,n]of Object.entries(o.items)){if(!consumeItems({[k]:n})){toast('Ainda faltam produtos para este pedido.','bad');return false}const d=CROPS[k]||RECIPES[k]||GOODS[k];reward+=d.sell*n;xp+=d.xp||0}
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
export function claim(id){const m=[...activeMissions(S.lv),...ACH].find(x=>x.id===id);if(!m||S.claimed[id]||prog(m)<m.n)return false;
 S.claimed[id]=1;addCoins(m.r);addXp(10);toast('Recompensa: +'+m.r+' 🪙');emit('claim');return true}
export const claimable=()=>[...activeMissions(S.lv),...ACH].filter(m=>!S.claimed[m.id]&&prog(m)>=m.n).length;
// bonus cat
export function money(){const v=100+S.lv*40;addCoins(v);toast('Gatinho do dinheiro! +'+v+' 🪙');return v}
