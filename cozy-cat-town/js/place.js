import {W,groundAt,pickAt,tint} from './world.js';
import {S,emit} from './state.js';
import {BUILD,DECOR} from './data.js';
import {makeBuilding,makeDecor,rectOf} from './buildings.js';
import * as G from './systems.js';
export const P={mode:null,sel:null,ghost:null};
let hooks,drag=null,down=null;const snap=v=>Math.round(v*2)/2;
export function validAt(kind,type,x,z,r,ign){
 if(Math.hypot(x,z)>(kind==='b'?48:51))return false;let hw=.5,hd=.5;
 if(kind==='b'){const d=BUILD[type];hw=(r%2?d.d:d.w)/2;hd=(r%2?d.w:d.d)/2}
 const m=kind==='b'?.5:.1;
 for(const b of S.buildings){const q=rectOf(b);if(Math.abs(x-q.x)<q.hw+hw+m&&Math.abs(z-q.z)<q.hd+hd+m)return false}
 for(const d of S.decor){if(d.id===ign)continue;if(kind==='b'){if(Math.abs(x-d.x)<hw+.6&&Math.abs(z-d.z)<hd+.6)return false}else if(Math.hypot(x-d.x,z-d.z)<1)return false}
 return true}
function upGhost(){const m=P.mode;P.ghost.position.set(m.x,0,m.z);P.ghost.rotation.y=m.r*Math.PI/2;m.ok=validAt(m.kind,m.type,m.x,m.z,m.r);tint(P.ghost,m.ok)}
export function startPlace(kind,type){cancel();const gh=kind==='b'?makeBuilding({id:'ghost',type,x:0,z:0,r:0,lv:1,plots:Array(6).fill(null),q:[],cat:null}).g:makeDecor(type);
 W.scene.add(gh);P.ghost=gh;P.sel=null;P.mode={kind,type,r:0,x:0,z:4};upGhost();emit('mode')}
export function cancel(){if(P.ghost){W.scene.remove(P.ghost);P.ghost=null}P.mode=null;emit('mode')}
export function confirm(){const m=P.mode;if(!m)return;if(!m.ok){G.toast('Não dá para colocar aqui','bad');return}
 if(m.kind==='b'){if(!G.buyBuilding(m.type,m.x,m.z,m.r))return}else G.placeDecor(m.type,m.x,m.z,m.r);cancel()}
export function rotate(){if(P.mode){P.mode.r=(P.mode.r+1)%4;upGhost()}else if(P.sel){const d=S.decor.find(x=>x.id===P.sel);if(d){d.r=(d.r+1)%4;emit('sync')}}}
export function select(id){if(P.mode)return;P.sel=id;emit('mode')}
export function store(){if(P.sel){G.storeDecor(P.sel);P.sel=null;emit('mode')}}
export function init(canvas,h){hooks=h;
 canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};if(P.mode)return;const hit=pickAt(e,hooks.list());
  if(hit&&hit.ref.t==='decor'){drag={id:hit.ref.id,on:false};W.ctl.enabled=false}},true);
 canvas.addEventListener('pointermove',e=>{if(P.mode){const p=groundAt(e);if(p){P.mode.x=snap(p.x);P.mode.z=snap(p.z);upGhost()}return}
  if(drag&&down){const d=S.decor.find(x=>x.id===drag.id);if(!drag.on&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>6){drag.on=true;P.sel=drag.id;emit('mode')}
   if(drag.on&&d){const p=groundAt(e),v=hooks.decorView(d.id);if(p&&v){drag.x=snap(p.x);drag.z=snap(p.z);v.position.set(drag.x,.15,drag.z);drag.ok=validAt('d',d.type,drag.x,drag.z,0,d.id);tint(v,drag.ok)}}}});
 addEventListener('pointerup',e=>{W.ctl.enabled=true;if(!down)return;const mv=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;
  if(drag&&drag.on){const d=S.decor.find(x=>x.id===drag.id);if(d&&drag.ok&&drag.x!=null){d.x=drag.x;d.z=drag.z}else G.toast('Local inválido','bad');emit('sync');drag=null;return}
  drag=null;if(mv>6)return;
  if(P.mode){const p=groundAt(e);if(p){P.mode.x=snap(p.x);P.mode.z=snap(p.z);upGhost()}confirm();return}
  const hit=pickAt(e,hooks.list());hooks.click(hit?hit.ref:null)});
 addEventListener('keydown',e=>{if(e.key==='r'||e.key==='R')rotate();if(e.key==='Escape'){cancel();P.sel=null;emit('mode');emit('close')}})}
