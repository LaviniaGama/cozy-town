import {S,save,reset,emit,bus,hasSave} from './state.js';
import {CROPS,RECIPES,CATS,DECOR,BUILD,MISSIONS,ACH,MILESTONES,PASS_TASKS,FRUIT_TREES,FLOWER_COLORS,activeMissions} from './data.js';
import {W} from './world.js';
import * as G from './systems.js';
import * as P from './place.js';
const $=id=>document.getElementById(id);
export const ui={panel:null,seed:'wheat',recipeQuery:'',cookAmounts:{},decorCategory:'all',decorSearch:'',flowerType:'',decorColorType:''};
const bar=p=>`<div class="pb"><i style="width:${Math.round(Math.max(0,Math.min(1,p))*100)}%"></i></div>`;
const fmt=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return s>=60?Math.floor(s/60)+':'+String(s%60).padStart(2,'0'):s+'s'};
const ing=i=>Object.entries(i).map(([k,n])=>`<span class="${(S.inv[k]||0)>=n?'':'lack'}">${G.emojiOf(k)}${n}</span>`).join(' ');
const bname=b=>BUILD[b.type].e+' '+BUILD[b.type].n;
export const open=(type,id)=>{ui.panel={type,id};$('panel').hidden=false;$('panel').style.display='grid';render()};
export const close=()=>{ui.panel=null;$('panel').hidden=true;$('panel').style.display='none'};
function catSel(b){const o=Object.keys(S.cats).map(k=>`<option value="${k}" ${b.cat===k?'selected':''}>${CATS[k].n} (nv ${S.cats[k].lv})${CATS[k].skill===b.type?' ⭐':''}</option>`).join('');
 return `<div class="row"><span>🐱 Gato trabalhador</span><select data-a="assign" data-id="${b.id}"><option value="">— ninguém —</option>${o}</select></div>`}
const upBtn=b=>b.lv>=5?'<div class="sub">Nível máximo ✨</div>':`<button class="big" data-a="upgrade" data-id="${b.id}">⬆ Melhorar para nv ${b.lv+1} — 🪙${G.upCost(b)}</button>`;
const cropGroups=[
 ['🌾 Grãos e cereais',['wheat','corn','barley','oat','rye','rice','quinoa','millet']],
 ['🥕 Hortaliças e raízes',['carrot','tomato','pumpkin','potato','onion','lettuce','cucumber','pepper','broccoli','cauliflower','beet','radish','eggplant','cabbage','garlic','zucchini','spinach','celery','pea','bean']],
 ['🍓 Frutas e bagas',['strawberry','watermelon','melon','blueberry','raspberry','grape','apple','pear','peach','cherry','plum','lemon','orange','pineapple','kiwi','mango','banana','papaya','coconut','avocado','fig','pomegranate','apricot','guava','passionfruit','lychee','starfruit','blackberry','lime','dragonfruit']],
 ['🌿 Especiais e flores',['cotton','coffee','tea','cocoa','vanilla','sunflower','lavender','chamomile','mint','basil']]
];
function farmH(b){const t=Date.now(),cropEntries=Object.entries(CROPS),grouped=cropGroups.map(([title,keys])=>[title,cropEntries.filter(([k])=>keys.includes(k))]).filter(([,items])=>items.length),known=new Set(grouped.flatMap(([,items])=>items.map(([k])=>k))),other=cropEntries.filter(([k])=>!known.has(k));if(other.length)grouped.push(['🌱 Outras sementes',other]);
 if(!CROPS[ui.seed]||S.lv<CROPS[ui.seed].lv)ui.seed='wheat';
 let h=`<div class="sub">🌱 ${S.seeds[ui.seed]||0} sementes selecionadas · <button data-a="open" data-id="shop">Ir à loja de sementes</button></div><div class="seed-catalog">`;
 for(const[title,items]of grouped)h+=`<section class="seed-group"><h4>${title}</h4><div class="chips">${items.map(([k,c])=>`<button class="chip ${ui.seed===k?'on':''}" data-a="seed" data-k="${k}" ${S.lv<c.lv?'disabled':''}>${c.e} ${c.n}<small>${S.lv<c.lv?'🔒 nv '+c.lv:'🌱 '+(S.seeds[k]||0)+' · '+Math.round(c.t/G.speed(b))+'s'}</small></button>`).join('')}</div></section>`;
 h+='</div><div class="plots">';
 b.plots.forEach((p,i)=>{if(!p)h+=`<button class="plot" data-a="plant" data-id="${b.id}" data-i="${i}">＋<small>Plantar ${CROPS[ui.seed].e}</small></button>`;
  else if(t>=p.end)h+=`<button class="plot ready" data-a="harvest" data-id="${b.id}" data-i="${i}">${CROPS[p.c].e}<small>Colher!</small></button>`;
  else h+=`<div class="plot">${CROPS[p.c].e}${bar(G.growProg(p,t))}<small>${fmt(p.end-t)}</small></div>`});
 return h+`</div><div class="row"><button data-a="plantAll" data-id="${b.id}">🌱 Plantar tudo</button><button data-a="harvestAll" data-id="${b.id}">✂ Colher tudo</button></div><div class="sub">Rende ${2+(b.lv>=3?1:0)+(b.lv>=5?1:0)} por colheita</div>`}
function prodH(b){const t=Date.now(),q=ui.recipeQuery.toLowerCase();let h=`<label class="recipe-search">🔎 <input type="search" data-role="recipe-filter" placeholder="Buscar entre 100 receitas" value="${ui.recipeQuery.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}"></label>`;
 if(b.cur){const r=RECIPES[b.cur.r];h+=`<div class="card2">Preparando ${r.e} <b>${r.n}</b>${bar((t-b.cur.s)/(b.cur.e-b.cur.s))}<small>${fmt(b.cur.e-t)}</small></div>`}else h+='<div class="sub">Cozinha livre — escolha uma receita!</div>';
 if(b.q.length){const queued=new Map();for(const item of b.q){const id=typeof item==='string'?item:item.r;queued.set(id,(queued.get(id)||0)+(typeof item==='string'?1:item.n))}h+=`<div class="sub">Na fila: ${[...queued].map(([id,n])=>`${RECIPES[id].e} ×${n}`).join(' · ')}</div>`}
 for(const[k,r]of Object.entries(RECIPES)){if(r.b!==b.type)continue;const lock=S.lv<r.lv,ingredients=Object.entries(r.in),batchMax=ingredients.length?Math.min(Number.MAX_SAFE_INTEGER,...ingredients.map(([item,n])=>Math.floor((S.inv[item]||0)/n))):null,batchKey=`${b.id}:${k}`,amount=batchMax===null?ui.cookAmounts[batchKey]||1:Math.min(ui.cookAmounts[batchKey]||1,batchMax||1),max=batchMax===null?'':`max="${batchMax}"`;
  h+=`<div class="item recipe-row ${lock?'lock':''}" data-recipe-name="${r.n.toLowerCase()}" ${r.n.toLowerCase().includes(q)?'':'hidden'}><span class="em">${r.e}</span><div><b>${r.n}</b><br><small>${lock?'🔒 Nível '+r.lv:ing(r.in)+' · ⏱'+fmt(r.t*1000/G.speed(b))+' · 🪙'+r.sell}</small></div>${lock?'':`<label class="cook-count">× <input type="number" data-role="cook-quantity" data-id="${b.id}" data-k="${k}" aria-label="Quantidade de ${r.n}" min="1" step="1" ${max} value="${amount}" ${batchMax!==null&&batchMax<1?'disabled':''}></label><button data-a="cook" data-id="${b.id}" data-k="${k}" ${batchMax!==null&&batchMax<1?'disabled':''}>Cozinhar</button>`}</div>`}
 return h}
function restH(b){let h=`<div class="sub">Gorjetas +${Math.round(15*(b.lv-1))}% · até ${Math.min(5,2+b.lv)} clientes</div>`;
 if(!G.CUST.length)h+='<div class="sub">Nenhum cliente no momento… 🐱🍓</div>';
 for(const c of G.CUST){const ok=S.inv[c.want]>0;h+=`<div class="item"><span class="em">${{strawberryCat:'🍓',banana:'🍌',persian:'🐱'}[c.model||c.kind]||'🐱'}</span><div>Quer <b>${RECIPES[c.want].e} ${RECIPES[c.want].n}</b>${bar(1-(Date.now()-c.born)/c.pat)}</div><button data-a="serve" data-id="${c.id}" class="${ok?'':'dim'}">Servir</button></div>`}
 return h}
function bPanel(b){let h=`<div class="sub">Nível ${b.lv} · Velocidade ×${G.speed(b).toFixed(2)}</div>`;
 h+=b.type==='farm'?farmH(b):b.type==='restaurant'?restH(b):['kitchen','bakery','dairy','packing','toolshop'].includes(b.type)?prodH(b):`<div class="card2">${BUILD[b.type].e} ${BUILD[b.type].desc||'Uma nova parte da vila para explorar.'}</div>`;
 h+=`<div class="row"><button data-a="storeB" data-id="${b.id}">📦 Guardar</button><button data-a="sellB" data-id="${b.id}">🪙 Vender</button></div>`;
 return h+catSel(b)+upBtn(b)}
function invH(){let h='';const sec=(t,o)=>{const e=Object.entries(o).filter(([k])=>S.inv[k]>0);h+=`<h4>${t}</h4>`+(e.length?e.map(([k,x])=>`<div class="item"><span class="em">${x.e}</span><div><b>${x.n}</b> ×${S.inv[k]}<br><small>🪙${x.sell} cada</small></div><button data-a="sell" data-k="${k}">Vender 1</button><button data-a="sellAll" data-k="${k}">Tudo</button></div>`).join(''):'<div class="sub">vazio</div>')};
 sec('Ingredientes',CROPS);sec('Pratos',RECIPES);h+='<h4>Decorações guardadas</h4>';const d=Object.entries(S.decoInv).filter(([,n])=>n>0);
 h+='<h4>Sementes</h4>'+Object.entries(S.seeds).filter(([,n])=>n>0).map(([k,n])=>`<div class="item"><span class="em">${CROPS[k].e}</span><div><b>${CROPS[k].n}</b> ×${n}</div><button data-a="open" data-id="shop">Comprar mais</button></div>`).join('');
 h+='<h4>Construções armazenadas</h4>'+S.storedBuildings.map(b=>`<div class="item"><span class="em">${BUILD[b.type].e}</span><div><b>${BUILD[b.type].n}</b></div><button data-a="placeStored" data-id="${b.id}">Colocar</button></div>`).join('');
 return h+(d.length?d.map(([k,n])=>`<div class="item"><span class="em">${DECOR[k].e}</span><div><b>${DECOR[k].n}</b> ×${n}</div><button data-a="placeDecor" data-k="${k}">Colocar</button></div>`).join(''):'<div class="sub">nenhuma — compre na loja de decoração</div>')}
function catsH(){return Object.entries(CATS).map(([k,c])=>{const o=S.cats[k];
 if(!o)return `<div class="item lock"><span class="em">❓</span><div><b>${c.n}</b><br><small>${S.lv<c.lv?'🔒 Nível '+c.lv:'Disponível!'} · ⭐ ${BUILD[c.skill].n}</small></div>${S.lv<c.lv?'':`<button data-a="unlockCat" data-k="${k}">Adotar 🪙${c.price}</button>`}</div>`;
 const w=S.buildings.find(b=>b.cat===k);return `<div class="item"><span class="em">🐱</span><div><b>${c.n}</b> · nv ${o.lv}<br><small>⭐ ${BUILD[c.skill].n} · ${w?'Trabalha em '+bname(w):'Livre, passeando'}</small></div>${o.lv<5?`<button data-a="catUp" data-k="${k}">⬆ 🪙${G.catUpCost(k)}</button>`:'<small>MAX</small>'}</div>`}).join('')}
const buildH=()=>`<h4>Construções guardadas</h4>`+(S.storedBuildings.length?S.storedBuildings.map(b=>`<div class="item"><span class="em">${BUILD[b.type].e}</span><div><b>${BUILD[b.type].n}</b><br><small>${b.type==='farm'?'Horta completa, com canteiros preservados.':'Prédio preservado no inventário.'}</small></div><button data-a="placeStored" data-id="${b.id}">Colocar</button></div>`).join(''):'<div class="sub">Nenhuma construção guardada.</div>')+`<h4>Novas construções</h4>`+Object.entries(BUILD).map(([k,d])=>`<div class="item ${S.lv<d.lv?'lock':''}"><span class="em">${d.e}</span><div><b>${d.n}</b><br><small>${S.lv<d.lv?'🔒 Nível '+d.lv:d.w+'×'+d.d+' tiles'} · ${d.desc||''}</small></div>${S.lv<d.lv?'':`<button data-a="build" data-k="${k}">🪙${d.price}</button>`}</div>`).join('')+'<div class="sub">Para mover, ative ↔ Mover na barra inferior. Clique numa construção, mova o mouse e clique novamente para confirmar. R gira; Esc cancela.</div>';
const shopH=()=>`<h4>🌱 Banco de sementes</h4><div class="sub">Cada pacote contém 5 sementes. Compre aqui; plantar não consome moedas.</div>`+Object.entries(CROPS).map(([k,c])=>`<div class="item ${S.lv<c.lv?'lock':''}"><span class="em">${c.e}</span><div><b>${c.n}</b><br><small>Estoque: ${S.seeds[k]||0} · Pacote: 🪙${c.seed*5} · ${S.lv<c.lv?'Desbloqueia no nível '+c.lv:'Colheita: 🪙'+c.sell}</small></div>${S.lv<c.lv?'🔒':`<button data-a="buySeeds" data-k="${k}">Comprar 5</button>`}</div>`).join('')+`<h4>🍎 Pomar: 30 árvores frutíferas</h4><div class="sub">Colha os frutos quando amadurecerem. Cada árvore guarda seu próprio ciclo de colheita.</div>`+Object.entries(FRUIT_TREES).map(([k,t])=>`<div class="item ${S.lv<t.lv?'lock':''}"><span class="em">${t.e}</span><div><b>${t.n}</b><br><small>${t.desc}<br>Estoque: ${S.decoInv[k]||0} · Nível ${t.lv} · 🪙${t.price}</small></div>${S.lv<t.lv?'🔒':`<button data-a="buyDecor" data-k="${k}">Comprar</button>`}${S.decoInv[k]>0?`<button data-a="placeDecor" data-k="${k}">Plantar</button>`:''}</div>`).join('');
const decorCategories=[
 {id:'all',label:'✨ Tudo'},
 {id:'flowers',label:'🌼 Flores'},
 {id:'floors',label:'🧱 Pisos'},
 {id:'trees',label:'🌳 Árvores'},
 {id:'pots',label:'🪴 Vasos'},
 {id:'lights',label:'💡 Luzes'},
 {id:'seating',label:'🪑 Descanso'},
 {id:'garden',label:'🌿 Jardim'},
 {id:'Bichinhos da Vila',label:'🐾 Bichinhos'},
 {id:'Cantinho Encantado',label:'✨ Encanto'},
 {id:'Praça da Vila',label:'🏘️ Praça'},
 {id:'Festa e Música',label:'🎉 Festa'},
 {id:'Coleção de Patinhas',label:'🐈 Coleção'}
];
const decorCategory=d=>d.group||({flower:'flowers',floor:'floors',tree:'trees',pine:'trees',pot:'pots',urn:'pots',lamp:'lights',lantern:'lights',crystal:'lights',bench:'seating',swing:'seating'})[d.form]||'garden';
const flowerTypes=()=>{const found=new Map();for(const[k,d]of Object.entries(DECOR))if(d.form==='flower'&&!found.has(d.shape))found.set(d.shape,[k,d]);return[...found.values()]};
const treeCatalog=new Map([
 ['tree_green','Árvore de copa redonda'],['tree_pine','Pinheiro'],['tree_variety_1','Árvore florida'],
 ['tree_variety_16','Árvore chorona'],['tree_variety_17','Árvore colunar'],['tree_variety_18','Árvore de nuvem'],['tree_variety_19','Árvore de cristal']
]);
const decorName=(k,d)=>treeCatalog.get(k)||d.n;
const decorPicker=()=>{const type=ui.decorColorType,d=DECOR[type];if(!d)return'';const chosen=S.options.decorColors[type]??(d.form==='flower'?S.options.flowerColor:d.color),label=FLOWER_COLORS.find(c=>c.color===chosen)?.n||'cor personalizada';return `<section class="flower-picker"><h4>🎨 Personalizar: ${decorName(type,d)}</h4><div class="sub">Escolha uma das 50 cores ou compre a peça no acabamento original. A personalização fica salva e acompanha o item.</div><div class="flower-palette">${FLOWER_COLORS.map(c=>`<button class="color-chip ${chosen===c.color?'on':''}" style="--flower-color:#${c.color.toString(16).padStart(6,'0')}" data-a="decorColor" data-color="${c.color}" aria-label="${c.n}" aria-pressed="${chosen===c.color}" title="${c.n}"></button>`).join('')}</div><div class="sub">Cor: ${label}</div><button data-a="buyDecorCustom" data-k="${type}">🎨 Comprar nesta cor · 🪙${d.price}</button></section>`};
const decorH=()=>{
 const allFlowers=flowerTypes(),flowerByShape=new Map(allFlowers.map(([k,d])=>[d.shape,k]));
 const entries=Object.entries(DECOR).filter(([k,d])=>d.form!=='fruitTree'&&(d.form!=='flower'||flowerByShape.get(d.shape)===k)&&(!['tree','pine'].includes(d.form)||treeCatalog.has(k))&&(ui.decorCategory==='all'||decorCategory(d)===ui.decorCategory));
 const selectedColorType=entries.some(([k])=>k===ui.decorColorType);
 const rows=entries.map(([k,d])=>{const isFlower=d.form==='flower',isTree=d.form==='tree'||d.form==='pine',title=isFlower?d.n.replace(/\s+(rosa|amarela|branca|lilás|vermelha)$/i,''):decorName(k,d);
  return `<div class="item decor-entry" data-decor-name="${(title+' '+(d.desc||'')).toLowerCase()}"><span class="em">${d.e}</span><div><b>${title}</b><small>${d.desc||'Um detalhe aconchegante para sua vila.'}<br>Estoque: ${S.decoInv[k]||0} · na vila: ${S.decor.filter(x=>x.type===k).length}</small></div><div class="decor-actions"><button data-a="chooseDecorColor" data-k="${k}" aria-pressed="${ui.decorColorType===k}">🎨 Cor</button><button data-a="buyDecor" data-k="${k}">🪙 Comprar padrão · ${d.price}</button>${S.decoInv[k]>0?`<button data-a="placeDecor" data-k="${k}">${isFlower?'Plantar':'Colocar'}</button>`:''}</div></div>`}).join('');
 return `<div class="sub">Escolha uma categoria para encontrar pisos, árvores ornamentais, flores e enfeites. Personalize a cor antes da compra ou compre o acabamento padrão. As árvores frutíferas ficam na Loja da Fazenda.</div><div class="decor-tools"><label class="decor-search">🔎 <input type="search" data-role="decor-filter" placeholder="Buscar uma decoração..." value="${ui.decorSearch.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"\'":'&#39;'}[c]))}"></label><nav class="decor-categories" aria-label="Categorias de decoração">${decorCategories.map(c=>`<button class="${ui.decorCategory===c.id?'on':''}" data-a="decorCategory" data-k="${c.id}" aria-pressed="${ui.decorCategory===c.id}">${c.label}</button>`).join('')}</nav></div>${selectedColorType?decorPicker():''}<div class="decor-grid" id="decor-items">${rows||'<div class="sub">Não há itens nesta categoria.</div>'}</div><div class="sub">Para mover, ative ↔ Mover na barra inferior. Clique no item e clique novamente para confirmar; R gira e Esc cancela.</div>`
};
const misH=()=>{const r=(t,a)=>`<h4>${t}</h4>`+a.map(m=>{const p=G.prog(m),done=S.claimed[m.id];return `<div class="item ${done?'lock':''}"><div style="flex:1"><b>${m.t}</b>${bar(p/m.n)}<small>${Math.min(p,m.n)}/${m.n} · 🪙${m.r}</small></div>${done?'✔':`<button data-a="claim" data-id="${m.id}" class="${p>=m.n?'':'dim'}">Resgatar</button>`}</div>`}).join('');return r('Missões',activeMissions(S.lv))+r('Conquistas',ACH)};
const setH=()=>`<h4>Preferências da vila</h4>
 <button class="big" data-a="toggleTime">${S.options&&S.options.freezeTime?'▶ Retomar ciclo dia e noite':'⏸ Pausar ciclo dia e noite'}</button>
 <button class="big" data-a="speedTime">⏱ Velocidade do tempo: ×${S.options&&S.options.clockSpeed||1}</button>
 <button class="big" data-a="toggleLabels">${W.labelsVisible===false?'👁 Mostrar':'🙈 Ocultar'} dicas e etiquetas</button>
 <button class="big" data-a="toggleMotion">${W.reducedMotion?'✨ Ativar animações':'🍃 Reduzir animações'}</button>
 <button class="big" data-a="toggleShadows">${W.renderer&&W.renderer.shadowMap.enabled?'🌤 Desativar sombras':'🌥 Ativar sombras'}</button>
 <button class="big" data-a="cameraHome">🎥 Centralizar câmera</button>
 <div class="row"><button data-a="zoomIn">＋ Aproximar</button><button data-a="zoomOut">－ Afastar</button></div>
 <button class="big" data-a="saveNow">💾 Salvar agora</button><button class="big" data-a="reset">🗑 Recomeçar do zero</button>
 <div class="sub">Salvamento automático a cada poucos segundos.<br>Arraste para girar · Botão direito para mover · Scroll para zoom.<br>W A S D: mover câmera · ← →: girar · ↑ ↓: zoom · R: girar item · Esc: cancelar.</div>`;
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
 else{const views={inv:invH,cats:catsH,build:buildH,decor:decorH,shop:shopH,miss:misH,set:setH,journey:journeyPage,delivery:deliveryH};if(!views[p.type])return close();t=p.type==='shop'?'🌱 Loja da Fazenda':TITLES[p.type];h=views[p.type]()}
 $('panel').hidden=false;$('panel').style.display='grid';$('panel').dataset.view=p.type;$('pt').textContent=t;if($('pb')._h!==h){$('pb').innerHTML=h;$('pb')._h=h}}
// handlers
const H={
 continueGame:()=>emit('startGame'),
 newGame:()=>{if(hasSave()&&!confirm('Começar uma nova vila? O progresso atual será substituído.'))return;reset();emit('sync');close();emit('startGame')},
 titleSettings:()=>open('set'),
 startStory:()=>{G.startStory();render()},deliver:()=>{G.deliverOrder();render()},daily:()=>{G.claimDaily();render()},passClaim:d=>{G.claimPass(d.id);render()},
 open:d=>open(d.id),close,seed:d=>{ui.seed=d.k;render()},
 buySeeds:d=>{G.buySeeds(d.k);render()},
 storeB:d=>{G.storeBuilding(d.id);close()},sellB:d=>{if(confirm('Vender esta construção por metade do valor original?')){G.sellBuilding(d.id);close()}},
 moveMode:()=>P.toggleMove(),decorCategory:d=>{ui.decorCategory=d.k;render()},chooseDecorColor:d=>{if(DECOR[d.k]){ui.decorColorType=d.k;render()}},decorColor:d=>{const n=Number(d.color),type=ui.decorColorType;if(DECOR[type]&&FLOWER_COLORS.some(c=>c.color===n)){S.options.decorColors[type]=n;if(DECOR[type].form==='flower')S.options.flowerColor=n;render()}},flowerColor:d=>{const n=Number(d.color);if(FLOWER_COLORS.some(c=>c.color===n)){S.options.flowerColor=n;render()}},sellSelected:()=>{if(P.P.sel&&confirm('Vender esta decoração por metade do valor original?'))P.sell()},
 harvestTree:d=>{G.harvestTree(d.id);render()},placeStored:d=>{close();P.startStored(d.id)},
 plant:d=>{G.plant(d.id,+d.i,ui.seed);render()},harvest:d=>{G.harvest(d.id,+d.i);render()},plantAll:d=>{G.plantAll(d.id,ui.seed);render()},harvestAll:d=>{G.harvestAll(d.id);render()},
 cook:d=>{G.cook(d.id,d.k,ui.cookAmounts[`${d.id}:${d.k}`]||1);render()},upgrade:d=>{G.upgrade(d.id);render()},sell:d=>{G.sell(d.k);render()},sellAll:d=>{G.sell(d.k,true);render()},
 buyDecor:d=>{G.buyDecor(d.k);render()},buyDecorCustom:d=>{const spec=DECOR[d.k],color=S.options.decorColors[d.k]??(spec.form==='flower'?S.options.flowerColor:spec.color);ui.decorColorType=d.k;if(G.buyDecor(d.k,color)){S.options.decorColors[d.k]=color;close();P.startPlace('d',d.k,color)}else render()},placeDecor:d=>{const spec=DECOR[d.k],inventoryColor=G.peekDecorColor(d.k),color=inventoryColor!==undefined?inventoryColor:S.options.decorColors[d.k]??(spec.form==='flower'?S.options.flowerColor:undefined);close();P.startPlace('d',d.k,color)},build:d=>{close();P.startPlace('b',d.k)},
 unlockCat:d=>{G.unlockCat(d.k);render()},catUp:d=>{G.catUp(d.k);render()},claim:d=>{G.claim(d.id);render()},serve:d=>{G.serve(d.id);render()},
 money:()=>emit('money'),b_ok:()=>P.confirm(),b_rot:()=>P.rotate(),b_cancel:()=>P.cancel(),b_store:()=>P.store(),b_done:()=>{P.P.sel=null;emit('mode')},
 toggleTime:()=>{S.options=S.options||{};S.options.freezeTime=!S.options.freezeTime;render()},
 speedTime:()=>{S.options=S.options||{};S.options.clockSpeed=({1:2,2:4,4:1}[S.options.clockSpeed||1]);render()},
 toggleLabels:()=>{S.options.showLabels=W.labelsVisible===false;W.labelsVisible=S.options.showLabels;render()},
 toggleMotion:()=>{S.options.reducedMotion=!W.reducedMotion;W.reducedMotion=S.options.reducedMotion;render()},
 toggleShadows:()=>{S.options.shadows=!W.renderer.shadowMap.enabled;W.renderer.shadowMap.enabled=S.options.shadows;render()},
 cameraHome:()=>{W.ctl.target.set(0,0,1);W.cam.position.set(42,28,43);W.ctl.update()},
 zoomIn:()=>W.ctl.dollyIn(1.2),zoomOut:()=>W.ctl.dollyOut(1.2),
 saveNow:()=>{save();G.toast('Jogo salvo 💾')},reset:()=>{if(confirm('Apagar todo o progresso?')){reset();emit('sync');emit('pauseForTitle');close();$('continue').disabled=!hasSave();document.getElementById('start-screen').hidden=false}}};
export function init(){
 close();$('bar').hidden=true;
 $('start-screen').hidden=false;$('continue').disabled=!hasSave();W.labelsVisible=S.options.showLabels;W.reducedMotion=S.options.reducedMotion;
 if(W.renderer)W.renderer.shadowMap.enabled=S.options.shadows;
 document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el||el.tagName==='SELECT')return;const f=H[el.dataset.a];if(f)f(el.dataset)});
 document.addEventListener('input',e=>{if(e.target.matches('[data-role="recipe-filter"]')){const q=e.target.value.trim().toLowerCase();ui.recipeQuery=e.target.value;document.querySelectorAll('.recipe-row').forEach(row=>{row.hidden=!row.dataset.recipeName.includes(q)})}});
 document.addEventListener('input',e=>{if(e.target.matches('[data-role="decor-filter"]')){const q=e.target.value.trim().toLowerCase();ui.decorSearch=e.target.value;document.querySelectorAll('.decor-entry').forEach(row=>{row.hidden=!row.dataset.decorName.includes(q)})}});
 $('panel').addEventListener('click',e=>{if(e.target===$('panel'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(ui.panel)close();else if(P.P.mode)P.cancel();else if(P.P.sel)P.P.sel=null}});
 document.addEventListener('change',e=>{const el=e.target;if(el.tagName==='SELECT'&&el.dataset.a==='assign'){G.assign(el.dataset.id,el.value);render()}});
 document.addEventListener('change',e=>{const el=e.target;if(el.matches('[data-role="cook-quantity"]')){const value=Number(el.value);if(Number.isSafeInteger(value)&&value>0)ui.cookAmounts[`${el.dataset.id}:${el.dataset.k}`]=value}});
 bus.addEventListener('toast',e=>{const d=document.createElement('div');d.className='toast '+(e.detail.k||'');d.textContent=e.detail.m;$('toasts').appendChild(d);setTimeout(()=>d.remove(),2600)});
 bus.addEventListener('saveError',()=>G.toast('Não foi possível salvar. Verifique o espaço do navegador.','bad'));
 bus.addEventListener('levelup',e=>{G.toast('🎉 Nível '+e.detail+'! Novidades desbloqueadas')});
 bus.addEventListener('close',close);bus.addEventListener('inv',render);bus.addEventListener('assign',render);bus.addEventListener('story',render);bus.addEventListener('delivery',render);bus.addEventListener('pass',render)}
export function hud(){const need=G.xpNeed(S.lv),h=S.clock*24,hh=Math.floor(h),mm=Math.floor((h-hh)*60);
 $('lv').textContent=S.lv;$('xpb').style.width=(S.xp/need*100)+'%';$('coins').textContent=Math.floor(S.coins);
 $('clock').textContent=(h>=6&&h<17?'☀️':h>=17&&h<20?'🌇':'🌙')+' '+String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0');
 const c=G.claimable();$('badge').textContent=c||'';$('badge').hidden=!c;
 const bar$=$('bar'),m=P.P.mode,s=P.P.sel;
 const setBar=html=>{bar$.hidden=!html;bar$.style.display=html?'':'none';if(bar$._h!==html){bar$.innerHTML=html;bar$._h=html}};
 if(m){const n=['b','moveB','storedB'].includes(m.kind)?BUILD[m.type]:DECOR[m.type];setBar(`<b>${n.e} ${n.n}</b> ${m.kind==='b'?'🪙'+n.price:''}<button data-a="b_ok">${m.kind==='moveB'||m.kind==='moveD'?'✅ Confirmar movimento':'✅ Colocar'}</button><button data-a="b_rot">↻ Girar</button><button data-a="b_cancel">✖ Cancelar</button>`)}
 else if(P.P.moveEnabled)setBar('<b>↔ Mover itens</b> Clique num item da vila para movê-lo. <button data-a="moveMode">Concluir</button>');
 else if(s){const d=s.kind==='decor'&&S.decor.find(x=>x.id===s.id);if(d){const ready=G.treeReady(d.id);setBar(`<b>${DECOR[d.type].e} ${DECOR[d.type].n}</b><button data-a="b_rot">↻ Girar</button><button data-a="b_store">📦 Guardar</button><button data-a="sellSelected">🪙 Vender</button>${DECOR[d.type].form==='fruitTree'?`<button data-a="harvestTree" data-id="${d.id}" ${ready?'':'disabled'}>🍎 Colher</button>`:''}<button data-a="b_done">✔ Fechar</button>`)}else setBar('')}
 else setBar('');
 const moveButton=$('move-mode');if(moveButton){moveButton.classList.toggle('on',P.P.moveEnabled);moveButton.setAttribute('aria-pressed',String(P.P.moveEnabled))}
 if(ui.panel&&!(document.activeElement&&['SELECT','INPUT','TEXTAREA'].includes(document.activeElement.tagName)))render()}
