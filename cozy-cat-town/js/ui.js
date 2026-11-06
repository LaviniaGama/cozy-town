import {S,save,reset,emit,bus} from './state.js';
import {CROPS,RECIPES,CATS,DECOR,BUILD,MISSIONS,ACH,MILESTONES,PASS_TASKS} from './data.js';
import * as G from './systems.js';
import * as P from './place.js';
const $=id=>document.getElementById(id);
export const ui={panel:null,seed:'wheat'};
const bar=p=>`<div class="pb"><i style="width:${Math.round(Math.max(0,Math.min(1,p))*100)}%"></i></div>`;
const fmt=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return s>=60?Math.floor(s/60)+':'+String(s%60).padStart(2,'0'):s+'s'};
const ing=i=>Object.entries(i).map(([k,n])=>`<span class="${(S.inv[k]||0)>=n?'':'lack'}">${G.emojiOf(k)}${n}</span>`).join(' ');
const bname=b=>BUILD[b.type].e+' '+BUILD[b.type].n;
export const open=(type,id)=>{ui.panel={type,id};$('panel').hidden=false;$('panel').style.display='grid';render()};
export const close=()=>{ui.panel=null;$('panel').hidden=true;$('panel').style.display='none'};
function catSel(b){const o=Object.keys(S.cats).map(k=>`<option value="${k}" ${b.cat===k?'selected':''}>${CATS[k].n} (nv ${S.cats[k].lv})${CATS[k].skill===b.type?' ⭐':''}</option>`).join('');
 return `<div class="row"><span>🐱 Gato trabalhador</span><select data-a="assign" data-id="${b.id}"><option value="">— ninguém —</option>${o}</select></div>`}
const upBtn=b=>b.lv>=5?'<div class="sub">Nível máximo ✨</div>':`<button class="big" data-a="upgrade" data-id="${b.id}">⬆ Melhorar para nv ${b.lv+1} — 🪙${G.upCost(b)}</button>`;
function farmH(b){const t=Date.now();let h='<div class="chips">'+Object.entries(CROPS).map(([k,c])=>`<button class="chip ${ui.seed===k?'on':''}" data-a="seed" data-k="${k}" ${S.lv<c.lv?'disabled':''}>${c.e} ${c.n}<small>${S.lv<c.lv?'🔒 nv '+c.lv:'🪙'+c.seed+' · '+Math.round(c.t/G.speed(b))+'s'}</small></button>`).join('')+'</div><div class="plots">';
 b.plots.forEach((p,i)=>{if(!p)h+=`<button class="plot" data-a="plant" data-id="${b.id}" data-i="${i}">＋<small>Plantar ${CROPS[ui.seed].e}</small></button>`;
  else if(t>=p.end)h+=`<button class="plot ready" data-a="harvest" data-id="${b.id}" data-i="${i}">${CROPS[p.c].e}<small>Colher!</small></button>`;
  else h+=`<div class="plot">${CROPS[p.c].e}${bar(G.growProg(p,t))}<small>${fmt(p.end-t)}</small></div>`});
 return h+`</div><div class="row"><button data-a="plantAll" data-id="${b.id}">🌱 Plantar tudo</button><button data-a="harvestAll" data-id="${b.id}">✂ Colher tudo</button></div><div class="sub">Rende ${2+(b.lv>=3?1:0)+(b.lv>=5?1:0)} por colheita</div>`}
function prodH(b){const t=Date.now();let h='';
 if(b.cur){const r=RECIPES[b.cur.r];h+=`<div class="card2">Preparando ${r.e} <b>${r.n}</b>${bar((t-b.cur.s)/(b.cur.e-b.cur.s))}<small>${fmt(b.cur.e-t)}</small></div>`}else h+='<div class="sub">Cozinha livre — escolha uma receita!</div>';
 if(b.q.length)h+=`<div class="sub">Na fila: ${b.q.map(k=>RECIPES[k].e).join(' ')} (${(b.cur?1:0)+b.q.length}/${G.cap(b)})</div>`;
 for(const[k,r]of Object.entries(RECIPES)){if(r.b!==b.type)continue;const lock=S.lv<r.lv;
  h+=`<div class="item ${lock?'lock':''}"><span class="em">${r.e}</span><div><b>${r.n}</b><br><small>${lock?'🔒 Nível '+r.lv:ing(r.in)+' · ⏱'+fmt(r.t*1000/G.speed(b))+' · 🪙'+r.sell}</small></div>${lock?'':`<button data-a="cook" data-id="${b.id}" data-k="${k}">Cozinhar</button>`}</div>`}
 return h}
function restH(b){let h=`<div class="sub">Gorjetas +${Math.round(15*(b.lv-1))}% · até ${Math.min(5,2+b.lv)} clientes</div>`;
 if(!G.CUST.length)h+='<div class="sub">Nenhum cliente no momento… 🐸🦆</div>';
 for(const c of G.CUST){const ok=S.inv[c.want]>0;h+=`<div class="item"><span class="em">${{frog:'🐸',duck:'🦆'}[c.kind]||'🐱'}</span><div>Quer <b>${RECIPES[c.want].e} ${RECIPES[c.want].n}</b>${bar(1-(Date.now()-c.born)/c.pat)}</div><button data-a="serve" data-id="${c.id}" class="${ok?'':'dim'}">Servir</button></div>`}
 return h}
function bPanel(b){let h=`<div class="sub">Nível ${b.lv} · Velocidade ×${G.speed(b).toFixed(2)}</div>`;
 h+=b.type==='farm'?farmH(b):b.type==='restaurant'?restH(b):['kitchen','bakery','dairy','packing','toolshop'].includes(b.type)?prodH(b):`<div class="card2">${BUILD[b.type].e} ${BUILD[b.type].desc||'Uma nova parte da vila para explorar.'}</div>`;return h+catSel(b)+upBtn(b)}
function invH(){let h='';const sec=(t,o)=>{const e=Object.entries(o).filter(([k])=>S.inv[k]>0);h+=`<h4>${t}</h4>`+(e.length?e.map(([k,x])=>`<div class="item"><span class="em">${x.e}</span><div><b>${x.n}</b> ×${S.inv[k]}<br><small>🪙${x.sell} cada</small></div><button data-a="sell" data-k="${k}">Vender 1</button><button data-a="sellAll" data-k="${k}">Tudo</button></div>`).join(''):'<div class="sub">vazio</div>')};
 sec('Ingredientes',CROPS);sec('Pratos',RECIPES);h+='<h4>Decorações guardadas</h4>';const d=Object.entries(S.decoInv).filter(([,n])=>n>0);
 return h+(d.length?d.map(([k,n])=>`<div class="item"><span class="em">${DECOR[k].e}</span><div><b>${DECOR[k].n}</b> ×${n}</div><button data-a="placeDecor" data-k="${k}">Colocar</button></div>`).join(''):'<div class="sub">nenhuma — compre na loja de decoração</div>')}
function catsH(){return Object.entries(CATS).map(([k,c])=>{const o=S.cats[k];
 if(!o)return `<div class="item lock"><span class="em">❓</span><div><b>${c.n}</b><br><small>${S.lv<c.lv?'🔒 Nível '+c.lv:'Disponível!'} · ⭐ ${BUILD[c.skill].n}</small></div>${S.lv<c.lv?'':`<button data-a="unlockCat" data-k="${k}">Adotar 🪙${c.price}</button>`}</div>`;
 const w=S.buildings.find(b=>b.cat===k);return `<div class="item"><span class="em">🐱</span><div><b>${c.n}</b> · nv ${o.lv}<br><small>⭐ ${BUILD[c.skill].n} · ${w?'Trabalha em '+bname(w):'Livre, passeando'}</small></div>${o.lv<5?`<button data-a="catUp" data-k="${k}">⬆ 🪙${G.catUpCost(k)}</button>`:'<small>MAX</small>'}</div>`}).join('')}
const buildH=()=>Object.entries(BUILD).map(([k,d])=>`<div class="item ${S.lv<d.lv?'lock':''}"><span class="em">${d.e}</span><div><b>${d.n}</b><br><small>${S.lv<d.lv?'🔒 Nível '+d.lv:d.w+'×'+d.d+' tiles'}</small></div>${S.lv<d.lv?'':`<button data-a="build" data-k="${k}">🪙${d.price}</button>`}</div>`).join('')+'<div class="sub">Depois de escolher, mova o mouse, use ↻ para girar e clique para construir.</div>';
const decorH=()=>Object.entries(DECOR).map(([k,d])=>`<div class="item"><span class="em">${d.e}</span><div><b>${d.n}</b><br><small>Em estoque: ${S.decoInv[k]||0} · na vila: ${S.decor.filter(x=>x.type===k).length}</small></div><button data-a="buyDecor" data-k="${k}">🪙${d.price}</button>${S.decoInv[k]>0?`<button data-a="placeDecor" data-k="${k}">Colocar</button>`:''}</div>`).join('')+'<div class="sub">Arraste decorações na vila para mover. Clique nelas para girar ou guardar.</div>';
const misH=()=>{const r=(t,a)=>`<h4>${t}</h4>`+a.map(m=>{const p=G.prog(m),done=S.claimed[m.id];return `<div class="item ${done?'lock':''}"><div style="flex:1"><b>${m.t}</b>${bar(p/m.n)}<small>${Math.min(p,m.n)}/${m.n} · 🪙${m.r}</small></div>${done?'✔':`<button data-a="claim" data-id="${m.id}" class="${p>=m.n?'':'dim'}">Resgatar</button>`}</div>`}).join('');return r('Missões',MISSIONS)+r('Conquistas',ACH)};
const setH=()=>`<button class="big" data-a="saveNow">💾 Salvar agora</button><button class="big" data-a="reset">🗑 Recomeçar do zero</button><div class="sub">Salva automaticamente a cada poucos segundos.<br>🖱 Arrastar: girar câmera · Scroll: zoom · Clique: interagir · R: girar objeto · Esc: cancelar<br>Gatos trabalhando em prédios acelerem a produção (⭐ = bônus de especialidade).</div>`;
const TITLES={inv:'🧺 Inventário',cats:'🐱 Gatos',build:'🏗️ Construir',decor:'🌸 Decoração',miss:'📜 Missões',set:'⚙️ Opções'};
Object.assign(TITLES,{journey:'Jornada',delivery:'Entregas'});
const journeyH=()=>{const s=G.storyStep(),p=s.stat?Math.min(1,(S.stats[s.stat]||0)/s.n):S.story?1:0;let h=`<div class="card2"><h4>${s.t}</h4><p>${s.d}</p><b>${s.goal}</b>${s.stat?bar(p):''}`;
 if(S.story===0)h+='<button class="big" data-a="startStory">Começar jornada</button>';else if(s.stat)h+=`<small>${Math.min(S.stats[s.stat]||0,s.n)}/${s.n}</small>`;
 h+='</div><h4>Desbloqueios por nível</h4>';const ms=MILESTONES.filter(m=>m.lv<=S.lv+3);return h+ms.map(m=>`<div class="item ${S.lv<m.lv?'lock':''}"><span class="em">${m.e}</span><div><b>Nível ${m.lv} · ${m.n}</b><br><small>${m.d}</small></div>${S.lv>=m.lv?'✓':'🔒'}</div>`).join('')};
const deliveryH=()=>{if(S.lv<3)return '<div class="card2"><h4>O pelicano está a caminho</h4><p>Desbloqueia no nível 3, junto com o centro de moradias e novas áreas de cultivo.</p></div>';const o=G.deliveryOrder(),entries=Object.entries(o.items),ready=G.canDeliver();let h='<div class="sub">O pelicano leva mercadorias para outras vilas e paga em moedas e experiência.</div>';
 h+=entries.map(([k,n])=>{const item=CROPS[k]||RECIPES[k],have=S.inv[k]||0;return `<div class="item ${have<n?'lock':''}"><span class="em">${item.e}</span><div><b>${item.n}</b><br><small>Pedido: ${n} · Você tem: ${have}</small></div></div>`}).join('');
 return h+`<button class="big" data-a="deliver" ${ready?'':'disabled'}>📦 Entregar pedido</button><div class="sub">Pedidos concluídos: ${S.delivery.completed}</div>`};
const dailyH=()=>{const ready=G.dailyReady();return `<div class="card2"><h4>Presença diária · sequência ${S.daily.streak}</h4><p>Volte à vila todos os dias para receber moedas e experiência.</p><button class="big" data-a="daily" ${ready?'':'disabled'}>${ready?'Resgatar recompensa de hoje':'Recompensa de hoje já recebida'}</button></div>`};
const passH=()=>'<h4>Passe fofinho</h4>'+PASS_TASKS.map(t=>{const n=G.passProg(t),done=S.passClaimed[t.id];return `<div class="item ${done?'lock':''}"><div><b>${t.t}</b>${bar(n/t.n)}<small>${Math.min(n,t.n)}/${t.n} · ${t.coins} moedas + ${t.xp} XP</small></div>${done?'✓':`<button data-a="passClaim" data-id="${t.id}" ${n>=t.n?'':'disabled'}>Resgatar</button>`}</div>`}).join('');
const journeyPage=()=>journeyH()+(S.lv>=10?dailyH():'')+(S.lv>=13?passH():'');
export function render(){const p=ui.panel;if(!p)return;let t='',h='';
 if(p.type==='b'){const b=G.getB(p.id);if(!b)return close();t=bname(b);h=bPanel(b)}
 else{const views={inv:invH,cats:catsH,build:buildH,decor:decorH,miss:misH,set:setH,journey:journeyPage,delivery:deliveryH};if(!views[p.type])return close();t=TITLES[p.type];h=views[p.type]()}
 $('panel').hidden=false;$('panel').style.display='grid';$('panel').dataset.view=p.type;$('pt').textContent=t;if($('pb')._h!==h){$('pb').innerHTML=h;$('pb')._h=h}}
// handlers
const H={
 startStory:()=>{G.startStory();render()},deliver:()=>{G.deliverOrder();render()},daily:()=>{G.claimDaily();render()},passClaim:d=>{G.claimPass(d.id);render()},
 open:d=>open(d.id),close,seed:d=>{ui.seed=d.k;render()},
 plant:d=>{G.plant(d.id,+d.i,ui.seed);render()},harvest:d=>{G.harvest(d.id,+d.i);render()},plantAll:d=>{G.plantAll(d.id,ui.seed);render()},harvestAll:d=>{G.harvestAll(d.id);render()},
 cook:d=>{G.cook(d.id,d.k);render()},upgrade:d=>{G.upgrade(d.id);render()},sell:d=>{G.sell(d.k);render()},sellAll:d=>{G.sell(d.k,true);render()},
 buyDecor:d=>{G.buyDecor(d.k);render()},placeDecor:d=>{close();P.startPlace('d',d.k)},build:d=>{close();P.startPlace('b',d.k)},
 unlockCat:d=>{G.unlockCat(d.k);render()},catUp:d=>{G.catUp(d.k);render()},claim:d=>{G.claim(d.id);render()},serve:d=>{G.serve(d.id);render()},
 money:()=>emit('money'),b_ok:()=>P.confirm(),b_rot:()=>P.rotate(),b_cancel:()=>P.cancel(),b_store:()=>P.store(),b_done:()=>{P.P.sel=null;emit('mode')},
 saveNow:()=>{save();G.toast('Jogo salvo 💾')},reset:()=>{if(confirm('Apagar todo o progresso?')){reset();location.reload()}}};
export function init(){
 close();$('bar').hidden=true;$('bar').style.display='none';
 document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el||el.tagName==='SELECT')return;const f=H[el.dataset.a];if(f)f(el.dataset)});
 $('panel').addEventListener('click',e=>{if(e.target===$('panel'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(ui.panel)close();else if(P.P.mode)P.cancel();else if(P.P.sel)P.P.sel=null}});
 document.addEventListener('change',e=>{const el=e.target;if(el.tagName==='SELECT'&&el.dataset.a==='assign'){G.assign(el.dataset.id,el.value);render()}});
 bus.addEventListener('toast',e=>{const d=document.createElement('div');d.className='toast '+(e.detail.k||'');d.textContent=e.detail.m;$('toasts').appendChild(d);setTimeout(()=>d.remove(),2600)});
 bus.addEventListener('levelup',e=>{G.toast('🎉 Nível '+e.detail+'! Novidades desbloqueadas')});
 bus.addEventListener('close',close);bus.addEventListener('inv',render);bus.addEventListener('assign',render);bus.addEventListener('story',render);bus.addEventListener('delivery',render);bus.addEventListener('pass',render)}
export function hud(){const need=G.xpNeed(S.lv),h=S.clock*24,hh=Math.floor(h),mm=Math.floor((h-hh)*60);
 $('lv').textContent=S.lv;$('xpb').style.width=(S.xp/need*100)+'%';$('coins').textContent=Math.floor(S.coins);
 $('clock').textContent=(h>=6&&h<17?'☀️':h>=17&&h<20?'🌇':'🌙')+' '+String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0');
 const c=G.claimable();$('badge').textContent=c||'';$('badge').hidden=!c;
 const bar$=$('bar'),m=P.P.mode,s=P.P.sel;
 if(m){const n=m.kind==='b'?BUILD[m.type]:DECOR[m.type];bar$.hidden=false;bar$.innerHTML=`<b>${n.e} ${n.n}</b> ${m.kind==='b'?'🪙'+n.price:''}<button data-a="b_ok">✅ Colocar</button><button data-a="b_rot">↻ Girar</button><button data-a="b_cancel">✖ Cancelar</button>`}
 else if(s){const d=S.decor.find(x=>x.id===s);if(d){bar$.hidden=false;bar$.innerHTML=`<b>${DECOR[d.type].e} ${DECOR[d.type].n}</b><button data-a="b_rot">↻ Girar</button><button data-a="b_store">📦 Guardar</button><button data-a="b_done">✔ Ok</button>`}else bar$.hidden=true}
 else bar$.hidden=true;
 if(ui.panel&&!(document.activeElement&&document.activeElement.tagName==='SELECT'))render()}
