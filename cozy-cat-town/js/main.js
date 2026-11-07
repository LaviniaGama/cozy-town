import * as THREE from 'three';
import {W,init as initWorld,setDay,tickWorld,render,label,sweep,burst,clearFlowers} from './world.js';
import * as A from './assets.js';
import {S,load,save,bus,emit} from './state.js';
import {DAY_SEC,CATS,RECIPES,DECOR} from './data.js';
import * as G from './systems.js?v=4';
import {makeBuilding,makeDecor,rectOf} from './buildings.js';
import {CatEnt,CustEnt,MoneyCat} from './cats.js';
import * as P from './place.js?v=12';
import * as UI from './ui.js?v=22';
const bv=new Map(),dv=new Map(),cats=new Map(),custs=new Map();let money=null,pelican=null,nextMoney=Date.now()+45000,gameStarted=false;
function makePelican(){const g=new THREE.Group(),mat=c=>new THREE.MeshToonMaterial({color:c});g.userData.ref={t:'pelican'};
 const body=new THREE.Mesh(new THREE.SphereGeometry(.62,12,9),mat(0xfff8e8));body.scale.set(1,1.15,1.25);body.position.y=.88;g.add(body);
 const neck=new THREE.Mesh(new THREE.CylinderGeometry(.2,.29,.68,8),mat(0xfff8e8));neck.position.set(0,1.55,.28);g.add(neck);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.35,12,9),mat(0xfff8e8));head.position.set(0,1.88,.4);g.add(head);
 const bill=new THREE.Mesh(new THREE.BoxGeometry(.2,.16,.8),mat(0xffa84d));bill.position.set(0,1.76,.88);g.add(bill);
 const pouch=new THREE.Mesh(new THREE.SphereGeometry(.27,10,8),mat(0xf28c62));pouch.scale.set(1,.65,1.45);pouch.position.set(0,1.48,1);g.add(pouch);
 const eyeMat=mat(0x513d47);for(const x of[-.18,.18]){const e=new THREE.Mesh(new THREE.SphereGeometry(.055,8,6),eyeMat);e.position.set(x,1.98,.66);g.add(e)}
 for(const x of[-.25,.25]){const foot=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,.36,6),mat(0xf28c62));foot.position.set(x,.2,0);g.add(foot)}
 const hit=new THREE.Mesh(new THREE.SphereGeometry(1.1,8,6),new THREE.MeshBasicMaterial({visible:false}));hit.position.y=1;hit.userData.ref={t:'pelican'};g.add(hit);g.position.set(0,0,10);return g}
function ensurePelican(){if(S.lv>=3&&!pelican){pelican=makePelican();W.scene.add(pelican)}else if(S.lv<3&&pelican){W.scene.remove(pelican);pelican=null}}
function sync(){
 const ids=new Set(S.buildings.map(b=>b.id));
 for(const[id,v]of bv)if(!ids.has(id)){W.scene.remove(v.g);bv.delete(id)}
 for(const b of S.buildings){
  const existing=bv.get(b.id);
  if(existing&&existing.b!==b){W.scene.remove(existing.g);bv.delete(b.id)}
  if(!bv.has(b.id)){const v=makeBuilding(b);W.scene.add(v.g);bv.set(b.id,v);clearFlowers(rectOf(b))}
 }
 for(const g of dv.values())W.scene.remove(g);dv.clear();
 for(const d of S.decor){const g=makeDecor(d.type,d.id,d.decorColor??d.flowerColor);g.position.set(d.x,0,d.z);g.rotation.y=d.r*Math.PI/2;W.scene.add(g);dv.set(d.id,g);
  if(DECOR[d.type]&&DECOR[d.type].form==='floor')clearFlowers({x:d.x,z:d.z,hw:(DECOR[d.type].w||1)/2,hd:(DECOR[d.type].d||1)/2})}
 const catIds=new Set(Object.keys(S.cats));for(const[id,c]of cats)if(!catIds.has(id)||c.stateRef!==S.cats[id]){W.scene.remove(c.g);cats.delete(id)}
 for(const id of Object.keys(S.cats))if(!cats.has(id)){const c=new CatEnt(id);W.scene.add(c.g);cats.set(id,c)}}
const pickList=()=>[...[...bv.values()].map(v=>v.g),...dv.values(),...[...cats.values()].map(c=>c.g),...[...custs.values()].map(c=>c.g),...(money?[money.g]:[]),...(pelican?[pelican]:[])];
function collectMoney(){if(!money)return;G.money();burst(money.g.position.clone().setY(1.5),'🪙',6);W.scene.remove(money.g);money=null;nextMoney=Date.now()+(60+Math.random()*60)*1000}
function click(ref){if(!ref){P.P.sel=null;return}
 if(ref.t!=='decor')P.P.sel=null;
 if(ref.t==='b')UI.open('b',ref.id);else if(ref.t==='plot')UI.open('b',ref.bid);
 else if(ref.t==='cat'){const g=G.pet(ref.id),c=cats.get(ref.id);if(c)c.poke();if(g)G.toast(CATS[ref.id].n+' ronrona 💕 +'+g+' 🪙')}
 else if(ref.t==='pelican')UI.open('delivery');
 else if(ref.t==='decor'){const d=S.decor.find(x=>x.id===ref.id);if(d&&DECOR[d.type]?.form==='fruitTree'&&G.harvestTree(ref.id))return;P.select(ref.id)}
 else if(ref.t==='cust')G.serve(ref.id);else if(ref.t==='money')collectMoney()}
function events(){
 bus.addEventListener('sync',sync);bus.addEventListener('catAdded',sync);bus.addEventListener('money',collectMoney);
 bus.addEventListener('pauseForTitle',()=>{gameStarted=false});
 bus.addEventListener('startGame',()=>{gameStarted=true;document.getElementById('start-screen').hidden=true;document.getElementById('exit-screen').hidden=true;W.labelsVisible=S.options.showLabels;W.reducedMotion=S.options.reducedMotion;W.renderer.shadowMap.enabled=S.options.shadows;
  for(const c of custs.values())W.scene.remove(c.g);custs.clear();G.CUST.length=0;
  if(money){W.scene.remove(money.g);money=null}ensurePelican();if(S.story===0)UI.open('journey');save()});
 bus.addEventListener('custAdd',e=>{const c=new CustEnt(e.detail);W.scene.add(c.g);custs.set(e.detail.id,c)});
 bus.addEventListener('custDel',e=>{const c=custs.get(e.detail.c.id);if(c)c.leave(e.detail.ok)});
 bus.addEventListener('cooked',e=>{const v=bv.get(e.detail.b.id);if(v){burst(v.g.position.clone().setY(3),RECIPES[e.detail.id].e,3);}});
 bus.addEventListener('harvested',e=>{const v=bv.get(e.detail.b.id);if(v)burst(v.g.position.clone().setY(1.5),'✨',3)});
 bus.addEventListener('levelup',()=>{burst(W.ctl.target.clone().setY(3),'⭐',10);ensurePelican()})}
const fmt=ms=>Math.max(0,Math.ceil(ms/1000))+'s';
async function boot(){load();const ld=document.getElementById('loadbar');
 initWorld(document.getElementById('c'));await A.loadAll((n,t)=>{ld.style.width=(n/t*100)+'%'});
 sync();events();UI.init();ensurePelican();P.init(W.canvas,{list:pickList,click,decorView:id=>dv.get(id),buildingView:id=>bv.get(id)?.g,catView:id=>cats.get(id)});
 for(const b of S.buildings)G.tickB(b);
 document.getElementById('loading').remove();G.toast('Bem-vindo à Cozy Cat Town! 🐱 Clique nos prédios e nos gatinhos.');
 let last=performance.now(),acc=0,hudT=0,saveT=0,time=0;
 const loop=now=>{requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;
  P.update(dt);
  if(!gameStarted){tickWorld(dt);render();return}
  if(!(S.options&&S.options.freezeTime))S.clock=(S.clock+dt*(S.options&&S.options.clockSpeed||1)/DAY_SEC)%1;setDay(S.clock);
  acc+=dt;if(acc>.25){acc=0;for(const b of S.buildings)G.tickB(b);G.tickCust();
   if(!money&&Date.now()>nextMoney){money=new MoneyCat((Math.random()-.5)*14,(Math.random()*8)+1);W.scene.add(money.g)}}
  for(const v of bv.values())v.upd&&v.upd(dt,time);
  for(const c of cats.values())c.update(dt);
  for(const[id,c]of custs)if(c.update(dt)){W.scene.remove(c.g);custs.delete(id)}
  if(money&&money.update(dt)){W.scene.remove(money.g);money=null;nextMoney=Date.now()+60000}
  const t=Date.now();
  if(pelican)label('pelican',new THREE.Vector3(pelican.position.x,3.1,pelican.position.z),'<span class="bub">📦 Pelicano</span>',{a:'open',id:'delivery'});
  for(const b of S.buildings){const v=bv.get(b.id);if(!v)continue;const p=v.g.position;
   if(b.type==='farm'){const n=b.plots.filter(x=>x&&t>=x.end).length;if(n)label('f'+b.id,new THREE.Vector3(p.x,2.4,p.z),`✔ ${n} pronto${n>1?'s':''}`,{a:'harvestAll',id:b.id})}
   else if(b.cur)label('k'+b.id,new THREE.Vector3(p.x,5,p.z),`<span class="bub">${RECIPES[b.cur.r].e} ${fmt(b.cur.e-t)}</span>`)}
  sweep();tickWorld(dt);render();
  hudT+=dt;if(hudT>.25){hudT=0;UI.hud()}saveT+=dt;if(saveT>6){saveT=0;save()}};
 requestAnimationFrame(loop);
 addEventListener('beforeunload',()=>{if(gameStarted)save()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&gameStarted)save()})}
boot().catch(e=>{console.error(e);const l=document.getElementById('loading');if(l)l.innerHTML='<h2>😿 Erro ao iniciar</h2><p>'+e.message+'</p><p>Abra pelo servidor local (veja o LEIAME) e confira se os arquivos do jogo estão completos.</p>'});
