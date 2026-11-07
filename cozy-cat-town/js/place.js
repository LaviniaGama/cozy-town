import * as THREE from 'three';
import {W,groundAt,pickAt,tint} from './world.js';
import {S,emit} from './state.js';
import {BUILD,DECOR} from './data.js';
import {makeBuilding,makeDecor,rectOf,decorRect} from './buildings.js';
import * as G from './systems.js';
export const P={mode:null,sel:null,ghost:null,moveEnabled:false};
let hooks,down=null;const snap=v=>Math.round(v*2)/2,keys=new Set(),cameraVelocity=new THREE.Vector3();
const snapAt=(type,v)=>DECOR[type]?.form==='floor'?Math.round(v):snap(v);
const typeOf=(kind,id)=>kind==='b'?S.buildings.find(x=>x.id===id):S.decor.find(x=>x.id===id);
function validAt(kind,type,x,z,r,ign){
 const isBuilding=kind==='b'||kind==='storedB',floor=!isBuilding&&DECOR[type]?.form==='floor';
 if(Math.hypot(x,z)>(isBuilding?48:53))return false;
 let hw,hd;
 if(isBuilding){const d=BUILD[type];hw=(r%2?d.d:d.w)/2;hd=(r%2?d.w:d.d)/2}
 else{const d=DECOR[type];hw=(d.w||1)/2;hd=(d.d||1)/2;if(r%2)[hw,hd]=[hd,hw]}
 const overlaps=(ax,az,aw,ad,bx,bz,bw,bd,margin=0)=>Math.abs(ax-bx)<aw+bw+margin-.015&&Math.abs(az-bz)<ad+bd+margin-.015;
 for(const b of S.buildings){if(isBuilding&&b.id===ign)continue;const q=rectOf(b);if(overlaps(x,z,hw,hd,q.x,q.z,q.hw,q.hd,.08))return false}
 for(const d of S.decor){if(!isBuilding&&d.id===ign)continue;const q=decorRect(d),dw=d.r%2?q.hd:q.hw,dh=d.r%2?q.hw:q.hd;
  if(isBuilding||(floor&&q.floor)){if(floor&&q.floor&&kind==='d')continue;if(overlaps(x,z,hw,hd,d.x,d.z,dw,dh))return false}
  else if(!floor&&!q.floor&&overlaps(x,z,hw,hd,d.x,d.z,dw,dh,.08))return false}
 return true}
function setGhost(){
 const m=P.mode;P.ghost.position.set(m.x,0,m.z);P.ghost.rotation.y=m.r*Math.PI/2;
 m.ok=validAt(m.kind==='moveB'?'b':m.kind,m.type,m.x,m.z,m.r,m.id);
 tint(P.ghost,m.ok)}
function begin(ghost,mode,source=null){
 if(P.ghost)W.scene.remove(P.ghost);
 P.ghost=ghost;P.mode=mode;P.sel=null;P.mode.source=source;if(source)source.visible=false;
 W.scene.add(ghost);W.ctl.enabled=false;
 if(mode.smooth){ghost.position.set(mode.x,0,mode.z);ghost.rotation.y=mode.r*Math.PI/2}
 setGhost();emit('mode')}
export function startPlace(kind,type,decorColor){
 cancel();const gh=kind==='b'?makeBuilding({id:'ghost',type,x:0,z:0,r:0,lv:1,plots:Array(6).fill(null),q:[],cat:null}).g:makeDecor(type,undefined,decorColor);
 begin(gh,{kind,type,r:0,x:snapAt(type,0),z:snapAt(type,4),decorColor})}
export function startMove(kind,id){
 cancel();const item=typeOf(kind,id);if(!item)return;
 const type=item.type,source=kind==='b'?hooks.buildingView(id):hooks.decorView(id);
 const gh=kind==='b'?makeBuilding(item).g:makeDecor(type,undefined,item.decorColor??item.flowerColor);
 begin(gh,{kind:kind==='b'?'moveB':'moveD',type,id,r:item.r||0,x:item.x,z:item.z,decorColor:item.decorColor??item.flowerColor,smooth:true},source)}
export function startStored(id){
 cancel();const b=S.storedBuildings.find(x=>x.id===id);if(!b)return;
 begin(makeBuilding(b).g,{kind:'storedB',type:b.type,id,r:b.r||0,x:snap(b.x),z:snap(b.z)})}
export function toggleMove(){
 if(P.moveEnabled){P.moveEnabled=false;if(P.mode&&['moveB','moveD'].includes(P.mode.kind))cancel()}
 else{cancel();P.moveEnabled=true;P.sel=null}
 emit('mode')}
export function cancel(){if(P.mode?.source)P.mode.source.visible=true;if(P.ghost){W.scene.remove(P.ghost);P.ghost=null}P.mode=null;if(W.ctl)W.ctl.enabled=true;emit('mode')}
export function confirm(){
 const m=P.mode;if(!m)return;if(!m.ok){G.toast('Local inválido: afaste de construções, árvores e pisos ocupados.','bad');return}
 if(m.kind==='b'){if(!G.buyBuilding(m.type,m.x,m.z,m.r))return}
 else if(m.kind==='storedB'){if(!G.placeStored(m.id,m.x,m.z,m.r))return}
 else if(m.kind==='moveB'){const b=S.buildings.find(x=>x.id===m.id);if(!b)return;b.x=m.x;b.z=m.z;b.r=m.r;if(m.source){m.source.position.set(m.x,0,m.z);m.source.rotation.y=m.r*Math.PI/2;m.source.visible=true}S.stats.buildingMoves++;emit('sync');emit('inv');G.toast(`${BUILD[b.type].n} movido!`)}
 else if(m.kind==='moveD'){const d=S.decor.find(x=>x.id===m.id);if(!d)return;d.x=m.x;d.z=m.z;d.r=m.r;if(m.decorColor!=null){d.decorColor=m.decorColor;if(DECOR[d.type].form==='flower')d.flowerColor=m.decorColor}if(m.source)m.source.visible=true;S.stats.decorMoves++;emit('sync');emit('inv');G.toast(`${DECOR[d.type].n} movido!`)}
 else if(DECOR[m.type].form==='floor'){const old=S.decor.find(d=>DECOR[d.type]?.form==='floor'&&d.x===m.x&&d.z===m.z);if(old){if(!G.replaceFloor(old.id,m.type,m.r))return}else if(!G.placeDecor(m.type,m.x,m.z,m.r))return}
 else if(!G.placeDecor(m.type,m.x,m.z,m.r,m.decorColor))return;
 cancel()}
export function rotate(){
 if(P.mode){P.mode.r=(P.mode.r+1)%4;setGhost();return}
 const s=P.sel;if(!s)return;
 if(s.kind==='decor'){const d=S.decor.find(x=>x.id===s.id);if(d){const r=(d.r+1)%4;if(!validAt('moveD',d.type,d.x,d.z,r,d.id)){G.toast('Não há espaço para girar aqui.','bad');return}d.r=r;emit('sync')}}
 else if(s.kind==='b'){const b=S.buildings.find(x=>x.id===s.id);if(b){const r=(b.r+1)%4;if(!validAt('moveB',b.type,b.x,b.z,r,b.id)){G.toast('Não há espaço para girar aqui.','bad');return}b.r=r;emit('sync')}}
}
export function select(id,kind='decor'){if(P.mode)return;P.sel={id,kind};emit('mode')}
export function store(){if(!P.sel)return;const ok=P.sel.kind==='b'?G.storeBuilding(P.sel.id):G.storeDecor(P.sel.id);if(ok){P.sel=null;emit('mode')}}
export function sell(){if(!P.sel)return;const ok=P.sel.kind==='b'?G.sellBuilding(P.sel.id):G.sellDecor(P.sel.id);if(ok){P.sel=null;emit('mode')}}
export function init(canvas,h){
 hooks=h;
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;down={x:e.clientX,y:e.clientY};if(P.mode)e.preventDefault()},true);
 canvas.addEventListener('pointermove',e=>{if(!P.mode)return;const p=groundAt(e);if(p){P.mode.x=snapAt(P.mode.type,p.x);P.mode.z=snapAt(P.mode.type,p.z);setGhost()}});
 addEventListener('pointerup',e=>{
  if(e.button!==0||!down)return;const mv=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;
  if(mv>8)return;
  if(!P.mode){const hit=pickAt(e,hooks.list()),ref=hit&&hit.ref;
   if(P.moveEnabled&&(ref?.t==='b'||ref?.t==='decor')){startMove(ref.t==='b'?'b':'d',ref.id);return}
   if(P.moveEnabled&&ref?.t==='plot'){startMove('b',ref.bid);return}
   hooks.click(ref||null);return}
  const p=groundAt(e);if(p){P.mode.x=snapAt(P.mode.type,p.x);P.mode.z=snapAt(P.mode.type,p.z);setGhost()}confirm()});
 addEventListener('keydown',e=>{
  if(e.target instanceof HTMLElement&&['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
  if(['w','a','s','d','W','A','S','D'].includes(e.key)){keys.add(e.key.toLowerCase());e.preventDefault();return}
  if(e.key==='r'||e.key==='R'){rotate();return}
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','+','-'].includes(e.key)){
   e.preventDefault();
   if(e.key==='ArrowLeft')W.ctl.rotateLeft(.2);else if(e.key==='ArrowRight')W.ctl.rotateLeft(-.2);
   else if(e.key==='+'||e.key==='ArrowUp')W.ctl.dollyIn(1.12);else W.ctl.dollyOut(1.12);
  }
  if(e.key==='Escape'){cancel();P.moveEnabled=false;P.sel=null;emit('mode');emit('close')}
 });
 addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
 addEventListener('blur',()=>keys.clear());
}
export function update(dt){
 const f=new THREE.Vector3();W.cam.getWorldDirection(f);f.y=0;f.normalize();
 const right=new THREE.Vector3().crossVectors(f,new THREE.Vector3(0,1,0)).normalize();
 const desired=new THREE.Vector3();
 if(keys.has('w'))desired.add(f);if(keys.has('s'))desired.sub(f);
 if(keys.has('d'))desired.add(right);if(keys.has('a'))desired.sub(right);
 if(desired.lengthSq())desired.normalize().multiplyScalar(9);
 cameraVelocity.lerp(desired,1-Math.exp(-9*dt));
 const shift=cameraVelocity.clone().multiplyScalar(dt);
 const tx=THREE.MathUtils.clamp(W.ctl.target.x+shift.x,-48,48),tz=THREE.MathUtils.clamp(W.ctl.target.z+shift.z,-48,48);
 shift.set(tx-W.ctl.target.x,0,tz-W.ctl.target.z);
 W.ctl.target.add(shift);W.cam.position.add(shift);
 if(P.mode?.smooth&&P.ghost){const alpha=1-Math.exp(-18*dt);P.ghost.position.x=THREE.MathUtils.lerp(P.ghost.position.x,P.mode.x,alpha);P.ghost.position.z=THREE.MathUtils.lerp(P.ghost.position.z,P.mode.z,alpha)}
}
