import * as THREE from 'three';
import {W,groundAt,pickAt,tint} from './world.js';
import {S,emit} from './state.js';
import {BUILD,DECOR} from './data.js';
import {makeBuilding,makeDecor,rectOf,decorRect} from './buildings.js';
import * as G from './systems.js?v=4';
export const P={mode:null,sel:null,selected:[],selectionAction:'move',confirmAction:null,ghost:null,batchGhost:null,moveEnabled:false};
let hooks,down=null,batchDrag=null,selectionDrag=null,selectionBox=null,catDrag=null,leftMouseAction=null;const selectionHighlights=[],snap=v=>Math.round(v*2)/2,keys=new Set(),cameraVelocity=new THREE.Vector3();
const snapAt=(type,v)=>DECOR[type]?.form==='floor'?Math.round(v):snap(v);
const isBatchable=type=>['floor','flower','tree','pine'].includes(DECOR[type]?.form);
const batchStep=type=>{const d=DECOR[type];return d.form==='floor'?1:Math.ceil(Math.max(d.w||1,d.d||1)*2)/2};
const batchSnap=(type,v)=>{const step=batchStep(type);return Math.round(v/step)*step};
const typeOf=(kind,id)=>kind==='b'?S.buildings.find(x=>x.id===id):S.decor.find(x=>x.id===id);
const isIgnored=(kind,id,ignore)=>ignore instanceof Set?ignore.has(`${kind}:${id}`):id===ignore;
function validAt(kind,type,x,z,r,ign){
 const isBuilding=kind==='b'||kind==='storedB',floor=!isBuilding&&DECOR[type]?.form==='floor';
 if(Math.hypot(x,z)>(isBuilding?48:53))return false;
 let hw,hd;
 if(isBuilding){const d=BUILD[type];hw=(r%2?d.d:d.w)/2;hd=(r%2?d.w:d.d)/2}
 else{const d=DECOR[type];hw=(d.w||1)/2;hd=(d.d||1)/2;if(r%2)[hw,hd]=[hd,hw]}
 const overlaps=(ax,az,aw,ad,bx,bz,bw,bd,margin=0)=>Math.abs(ax-bx)<aw+bw+margin-.015&&Math.abs(az-bz)<ad+bd+margin-.015;
 for(const b of S.buildings){if(isIgnored('b',b.id,ign))continue;const q=rectOf(b);if(overlaps(x,z,hw,hd,q.x,q.z,q.hw,q.hd,.08))return false}
 for(const d of S.decor){if(isIgnored('d',d.id,ign))continue;const q=decorRect(d),dw=d.r%2?q.hd:q.hw,dh=d.r%2?q.hw:q.hd;
  if(DECOR[type]?.form==='flower'||DECOR[d.type]?.form==='flower')continue;
  if(isBuilding||(floor&&q.floor)){if(floor&&q.floor&&kind==='d')continue;if(overlaps(x,z,hw,hd,d.x,d.z,dw,dh))return false}
  else if(!floor&&!q.floor&&overlaps(x,z,hw,hd,d.x,d.z,dw,dh,.08))return false}
 return true}
function setGhost(){
 const m=P.mode;P.ghost.position.set(m.x,0,m.z);P.ghost.rotation.y=m.r*Math.PI/2;
 if(m.kind==='moveGroup'){
  const ignore=new Set(m.items.map(item=>`${item.kind}:${item.id}`));
  const positions=m.items.map(item=>{const a=m.r*Math.PI/2,dx=item.dx*Math.cos(a)+item.dz*Math.sin(a),dz=-item.dx*Math.sin(a)+item.dz*Math.cos(a);return{item,x:m.x+dx,z:m.z+dz,r:(item.r+m.r)%4}});
  m.positions=positions;
  m.ok=positions.every(p=>validAt(p.item.kind,p.item.type,p.x,p.z,p.r,ignore))&&positions.every((p,i)=>positions.slice(i+1).every(q=>!itemOverlap(p.item,p.x,p.z,p.r,q.item,q.x,q.z,q.r)));
  for(const p of positions)moveSource(p.item.source,p.x,p.z,p.r);
 }else{
  m.ok=validAt(m.kind==='moveB'?'b':m.kind,m.type,m.x,m.z,m.r,m.id);
  if(m.kind==='moveB'||m.kind==='moveD')moveSource(m.source,m.x,m.z,m.r);
 }
 tint(P.ghost,m.ok)}
function moveSource(source,x,z,r){if(source){source.position.set(x,0,z);source.rotation.y=r*Math.PI/2;source.visible=true}}
function restoreMoveSources(m){
 if(m.kind==='moveGroup'){for(const item of m.items)moveSource(item.source,item.x,item.z,item.r)}
 else if(m.kind==='moveB'||m.kind==='moveD')moveSource(m.source,m.x,m.z,m.r);
}
function itemOverlap(a,ax,az,ar,b,bx,bz,br){
 const af=a.kind==='d'&&DECOR[a.type].form==='floor',bf=b.kind==='d'&&DECOR[b.type].form==='floor';
 const afl=a.kind==='d'&&DECOR[a.type].form==='flower',bfl=b.kind==='d'&&DECOR[b.type].form==='flower';
 if(af&&bf||af&&b.kind==='d'||bf&&a.kind==='d'||afl||bfl)return false;
 const size=(item,r)=>{if(item.kind==='b'){const d=BUILD[item.type];return{hw:(r%2?d.d:d.w)/2,hd:(r%2?d.w:d.d)/2}}
  const d=DECOR[item.type];return{hw:(r%2?d.d:d.w)/2,hd:(r%2?d.w:d.d)/2}};
 const aa=size(a,ar),bb=size(b,br);
 return Math.abs(ax-bx)<aa.hw+bb.hw+.065&&Math.abs(az-bz)<aa.hd+bb.hd+.065;
}
function clearBatchGhost(){if(P.batchGhost){W.scene.remove(P.batchGhost);P.batchGhost.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose()});P.batchGhost=null}}
function batchRect(type,x,z){const d=DECOR[type];return{hw:(d.w||1)/2,hd:(d.d||1)/2}}
function batchOverlaps(type,x,z,placed){
 const a=batchRect(type,x,z),floor=DECOR[type].form==='floor';
 return placed.some(p=>{const b=batchRect(type,p.x,p.z);return Math.abs(x-p.x)<a.hw+b.hw+(floor?0:.08)-.015&&Math.abs(z-p.z)<a.hd+b.hd+(floor?0:.08)-.015});
}
function updateBatch(p){
 const m=P.mode;if(!m||!isBatchable(m.type))return;
 const step=batchStep(m.type),start={x:batchSnap(m.type,batchDrag.start.x),z:batchSnap(m.type,batchDrag.start.z)};
 const end={x:batchSnap(m.type,p.x),z:batchSnap(m.type,p.z)},dx=Math.round((end.x-start.x)/step),dz=Math.round((end.z-start.z)/step);
 const key=`${start.x},${start.z}:${end.x},${end.z}:${S.decoInv[m.type]||0}`;
 if(batchDrag.key===key)return;
 batchDrag.key=key;
 const cells=[];
 for(let ix=0;ix<=Math.abs(dx);ix++)for(let iz=0;iz<=Math.abs(dz);iz++)cells.push({x:start.x+Math.sign(dx)*ix*step,z:start.z+Math.sign(dz)*iz*step});
 const available=S.decoInv[m.type]||0,placements=[];
 for(const cell of cells){
  if(placements.length>=available)break;
  if(validAt('d',m.type,cell.x,cell.z,m.r)&&!batchOverlaps(m.type,cell.x,cell.z,placements))placements.push(cell);
 }
 m.batchPositions=placements;
 clearBatchGhost();
 P.batchGhost=new THREE.Group();
 for(const cell of placements){
  const ghost=makeDecor(m.type,undefined,m.decorColor);
  ghost.position.set(cell.x,0,cell.z);ghost.rotation.y=m.r*Math.PI/2;tint(ghost,true);
  P.batchGhost.add(ghost);
 }
 W.scene.add(P.batchGhost);
 if(P.ghost)P.ghost.visible=false;
}
function finishBatch(){
 if(!batchDrag)return;
 const moved=Math.hypot(batchDrag.lastX-batchDrag.startX,batchDrag.lastY-batchDrag.startY)>8;
 const positions=P.mode?.batchPositions||[];
 batchDrag=null;
 clearBatchGhost();
 if(P.ghost)P.ghost.visible=true;
 if(!moved)return false;
 if(!positions.length){G.toast('Não há espaço livre ou itens suficientes para colocar aqui.','bad');return true}
 const m=P.mode,count=G.placeDecorBatch(m.type,positions,m.r,m.decorColor);
 if(count){G.toast(`${count} itens colocados! ✨`);cancel()}
 return true
}
function hideSelectionBox(){if(selectionBox)selectionBox.hidden=true;selectionDrag=null}
function lockLeftMouse(){if(leftMouseAction===null&&W.ctl){leftMouseAction=W.ctl.mouseButtons.LEFT;W.ctl.mouseButtons.LEFT=null}}
function restoreLeftMouse(){if(leftMouseAction!==null&&W.ctl){W.ctl.mouseButtons.LEFT=leftMouseAction;leftMouseAction=null}}
function clearSelectionHighlights(){for(const highlight of selectionHighlights){W.scene.remove(highlight);highlight.traverse(o=>{if(o.isMesh){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose()}})}selectionHighlights.length=0}
function showSelectionHighlights(){
 clearSelectionHighlights();
 for(const selected of P.selected){
  const item=typeOf(selected.kind,selected.id);if(!item)continue;
  const source=selected.kind==='b'?hooks.buildingView(item.id):hooks.decorView(item.id);if(!source)continue;
  const highlight=source.clone(true);
  highlight.traverse(o=>{if(!o.isMesh)return;
   const material=()=>new THREE.MeshBasicMaterial({color:0x42d98a,transparent:true,opacity:.38,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
   o.material=Array.isArray(o.material)?o.material.map(material):material();o.renderOrder=8;o.castShadow=false;o.receiveShadow=false;o.raycast=()=>{}});
  W.scene.add(highlight);selectionHighlights.push(highlight);
 }
}
function updateSelectionBox(x,y){
 if(!selectionBox||!selectionDrag)return;
 selectionBox.style.left=`${Math.min(selectionDrag.x,x)}px`;selectionBox.style.top=`${Math.min(selectionDrag.y,y)}px`;
 selectionBox.style.width=`${Math.abs(x-selectionDrag.x)}px`;selectionBox.style.height=`${Math.abs(y-selectionDrag.y)}px`;
}
function updateSelectionFromPointer(e,finalize=false){
 if(!selectionDrag)return;
 const drag=selectionDrag,rect={left:Math.min(drag.x,e.clientX),right:Math.max(drag.x,e.clientX),top:Math.min(drag.y,e.clientY),bottom:Math.max(drag.y,e.clientY)};
 const items=[];
 if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<=8){
  const ref=pickAt(e,hooks.list())?.ref;if(ref?.t==='b'||ref?.t==='decor')items.push({kind:ref.t==='b'?'b':'d',id:ref.id});
 }else{
  W.scene.updateMatrixWorld(true);W.cam.updateMatrixWorld(true);
  const canvasRect=W.canvas.getBoundingClientRect();
  for(const root of hooks.list()){
   const ref=root.userData.ref;if(ref?.t!=='b'&&ref?.t!=='decor')continue;
   const projected=new THREE.Vector3().setFromMatrixPosition(root.matrixWorld).project(W.cam);
   const x=canvasRect.left+(projected.x+1)*canvasRect.width/2,y=canvasRect.top+(1-projected.y)*canvasRect.height/2;
   if(x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom)items.push({kind:ref.t==='b'?'b':'d',id:ref.id});
  }
 }
 const selected=[...new Map(items.map(item=>[`${item.kind}:${item.id}`,item])).values()];
 const changed=selected.length!==P.selected.length||selected.some((item,i)=>item.kind!==P.selected[i]?.kind||item.id!==P.selected[i]?.id);
 P.selected=selected;
 P.sel=P.selected.length===1?{id:P.selected[0].id,kind:P.selected[0].kind}:null;
 if(changed)showSelectionHighlights();
 if(finalize){P.confirmAction=null;hideSelectionBox();emit('mode');if(!P.selected.length)G.toast('Nenhum item selecionado. Arraste sobre a vila para selecionar.','bad')}
}
function selectInRect(e){updateSelectionFromPointer(e,true)}
export function clearSelection(){P.selected=[];P.sel=null;P.confirmAction=null;clearSelectionHighlights();emit('mode')}
export function setSelectionAction(action){if(!['move','store','sell'].includes(action))return;if(P.mode)cancel();P.moveEnabled=true;P.selectionAction=action;P.confirmAction=null;emit('mode');if(action!=='move')applySelectionAction();}
export function cancelSelectionConfirm(){P.confirmAction=null;emit('mode')}
function exitSelection(){P.moveEnabled=false;clearSelection();emit('mode')}
function itemData(selected){
 const item=typeOf(selected.kind,selected.id);if(!item)return null;
 return{kind:selected.kind,id:item.id,type:item.type,x:item.x,z:item.z,r:item.r||0,decorColor:item.decorColor??item.flowerColor??null,source:selected.kind==='b'?hooks.buildingView(item.id):hooks.decorView(item.id)}
}
export function startGroupMove(){
 const items=P.selected.map(itemData).filter(Boolean);
 if(!items.length){G.toast('Selecione pelo menos um item para mover.','bad');return}
 cancel();clearSelectionHighlights();const anchor=items[0],ghost=new THREE.Group();
 for(const item of items){
  const model=item.kind==='b'?makeBuilding(item).g:makeDecor(item.type,undefined,item.decorColor);
  model.position.set(item.x-anchor.x,0,item.z-anchor.z);model.rotation.y=item.r*Math.PI/2;ghost.add(model);
  item.dx=item.x-anchor.x;item.dz=item.z-anchor.z;
 }
 begin(ghost,{kind:'moveGroup',items,r:0,x:snap(anchor.x),z:snap(anchor.z)});
}
export function applySelectionAction(){
 const items=P.selected.map(itemData).filter(Boolean);
 if(!items.length){G.toast('Selecione pelo menos um item primeiro.','bad');return}
 if(P.selectionAction==='move'){startGroupMove();return}
 const action=P.selectionAction;
 let count=0;
 for(const item of items){
  const ok=action==='store'?(item.kind==='b'?G.storeBuilding(item.id):G.storeDecor(item.id)):(item.kind==='b'?G.sellBuilding(item.id):G.sellDecor(item.id));
  if(ok)count++;
 }
 clearSelection();
 if(count)G.toast(`${count} item${count===1?'':'s'} ${action==='store'?'guardado':'vendido'}${count===1?'':'s'}!`);
 else G.toast('Nenhum item pôde ser processado.','bad');
}
function begin(ghost,mode,source=null){
 if(P.ghost)W.scene.remove(P.ghost);
 P.ghost=ghost;P.mode=mode;P.sel=null;P.mode.source=source;
 W.scene.add(ghost);
 if(mode.smooth){ghost.position.set(mode.x,0,mode.z);ghost.rotation.y=mode.r*Math.PI/2}
 setGhost();
 if(['moveB','moveD','moveGroup'].includes(mode.kind))ghost.visible=false;
 else if(source)source.visible=false;
 emit('mode')}
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
 if(P.moveEnabled){if(P.mode)cancel();exitSelection()}
 else{cancel();P.moveEnabled=true;P.selectionAction='move';clearSelection()}
 emit('mode')}
export function cancel(){const m=P.mode,wasGroup=m?.kind==='moveGroup';batchDrag=null;clearBatchGhost();hideSelectionBox();if(m&&!m.committed)restoreMoveSources(m);if(m?.source)m.source.visible=true;if(wasGroup)for(const item of m.items)if(item.source)item.source.visible=true;if(P.ghost){W.scene.remove(P.ghost);P.ghost=null}P.mode=null;if(wasGroup&&P.moveEnabled&&P.selected.length)showSelectionHighlights();emit('mode')}
export function confirm(){
 const m=P.mode;if(!m)return;if(!m.ok){G.toast('Local inválido: afaste de construções, árvores e pisos ocupados.','bad');return}
 if(m.kind==='b'){if(!G.buyBuilding(m.type,m.x,m.z,m.r))return}
 else if(m.kind==='storedB'){if(!G.placeStored(m.id,m.x,m.z,m.r))return}
 else if(m.kind==='moveB'){const b=S.buildings.find(x=>x.id===m.id);if(!b)return;b.x=m.x;b.z=m.z;b.r=m.r;m.committed=true;if(m.source)m.source.visible=true;S.stats.buildingMoves++;emit('sync');emit('inv');G.toast(`${BUILD[b.type].n} movido!`)}
 else if(m.kind==='moveD'){const d=S.decor.find(x=>x.id===m.id);if(!d)return;d.x=m.x;d.z=m.z;d.r=m.r;if(m.decorColor!=null){d.decorColor=m.decorColor;if(DECOR[d.type].form==='flower')d.flowerColor=m.decorColor}m.committed=true;if(m.source)m.source.visible=true;S.stats.decorMoves++;emit('sync');emit('inv');G.toast(`${DECOR[d.type].n} movido!`)}
 else if(m.kind==='moveGroup'){
  for(const p of m.positions){const item=p.item;if(item.kind==='b'){const b=S.buildings.find(x=>x.id===item.id);if(b){b.x=p.x;b.z=p.z;b.r=p.r;S.stats.buildingMoves++}}
   else{const d=S.decor.find(x=>x.id===item.id);if(d){d.x=p.x;d.z=p.z;d.r=p.r;S.stats.decorMoves++}}
   if(item.source)item.source.visible=true}
   m.committed=true;P.selected=[];P.sel=null;P.moveEnabled=false;
   emit('sync');emit('inv');G.toast(`${m.positions.length} itens movidos!`)
 }
 else if(DECOR[m.type].form==='floor'){const old=S.decor.find(d=>DECOR[d.type]?.form==='floor'&&d.x===m.x&&d.z===m.z);if(old){if(!G.replaceFloor(old.id,m.type,m.r))return}else if(!G.placeDecor(m.type,m.x,m.z,m.r))return}
 else if(!G.placeDecor(m.type,m.x,m.z,m.r,m.decorColor))return;
 if(m.kind==='d'&&!isBatchable(m.type)&&S.decoInv[m.type]>0){
  const next=makeDecor(m.type,undefined,m.decorColor);
  begin(next,{kind:m.kind,type:m.type,r:m.r,x:snapAt(m.type,0),z:snapAt(m.type,4),decorColor:m.decorColor});
  return;
 }
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
 hooks=h;selectionBox=document.createElement('div');selectionBox.className='selection-rect';selectionBox.hidden=true;document.body.appendChild(selectionBox);
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;down={x:e.clientX,y:e.clientY};if(P.mode||P.moveEnabled){lockLeftMouse();e.preventDefault()}else if(pickAt(e,hooks.list())?.ref?.t==='cat')lockLeftMouse()},true);
 canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  if(P.moveEnabled&&!P.mode){e.preventDefault();e.stopPropagation();selectionDrag={x:e.clientX,y:e.clientY};selectionBox.hidden=false;updateSelectionBox(e.clientX,e.clientY);if(canvas.setPointerCapture)canvas.setPointerCapture(e.pointerId);return}
  if(!P.mode){
   const hit=pickAt(e,hooks.list());
   if(hit?.ref?.t==='cat'){const cat=hooks.catView(hit.ref.id);if(cat){catDrag={cat,x:e.clientX,y:e.clientY,active:false};e.preventDefault();if(canvas.setPointerCapture)canvas.setPointerCapture(e.pointerId)}}
   return;
  }
  if(P.mode?.kind==='d'&&isBatchable(P.mode.type)){
   const p=groundAt(e);if(!p)return;
   e.preventDefault();e.stopPropagation();
   const start={x:batchSnap(P.mode.type,p.x),z:batchSnap(P.mode.type,p.z)};
   batchDrag={start,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,key:null};
   P.mode.x=snapAt(P.mode.type,p.x);P.mode.z=snapAt(P.mode.type,p.z);setGhost();
   if(canvas.setPointerCapture)canvas.setPointerCapture(e.pointerId);
   updateBatch(p);
  }
 },true);
 canvas.addEventListener('pointermove',e=>{
  if(selectionDrag){updateSelectionBox(e.clientX,e.clientY);updateSelectionFromPointer(e);return}
  if(catDrag){if(e.buttons&1){if(!catDrag.active&&Math.hypot(e.clientX-catDrag.x,e.clientY-catDrag.y)>6){catDrag.active=true;catDrag.cat.dragging=true;catDrag.cat.tgt=null}
    if(catDrag.active){const p=groundAt(e);if(p)catDrag.cat.dragTo(p.x,p.z)}}return}
  if(!P.mode)return;
  if(e.buttons&&!(e.buttons&1))return;
  const p=groundAt(e);if(!p)return;
  if(batchDrag){batchDrag.lastX=e.clientX;batchDrag.lastY=e.clientY;updateBatch(p);return}
  P.mode.x=snapAt(P.mode.type,p.x);P.mode.z=snapAt(P.mode.type,p.z);setGhost()
 });
 addEventListener('pointerup',e=>{
  if(e.button===0&&selectionDrag){selectInRect(e);down=null;restoreLeftMouse();return}
  if(e.button===0&&catDrag){const drag=catDrag;catDrag=null;restoreLeftMouse();if(drag.active){drag.cat.dragging=false;drag.cat.resumeWalking();down=null;return}}
  if(e.button===0&&batchDrag){const p=groundAt(e);if(p){batchDrag.lastX=e.clientX;batchDrag.lastY=e.clientY;updateBatch(p)}if(finishBatch()){down=null;restoreLeftMouse();return}}
  if(e.button!==0||!down){restoreLeftMouse();return}const mv=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;restoreLeftMouse();
  if(mv>8)return;
  if(!P.mode){const hit=pickAt(e,hooks.list()),ref=hit&&hit.ref;
   if(P.moveEnabled){selectInRect(e);return}
   hooks.click(ref||null);return}
  const p=groundAt(e);if(p){P.mode.x=snapAt(P.mode.type,p.x);P.mode.z=snapAt(P.mode.type,p.z);setGhost()}confirm()});
 canvas.addEventListener('pointercancel',e=>{if(selectionDrag)hideSelectionBox();if(catDrag){if(catDrag.active)catDrag.cat.dragging=false;catDrag=null}restoreLeftMouse();if(batchDrag){batchDrag=null;clearBatchGhost();if(P.ghost)P.ghost.visible=true}});
 addEventListener('keydown',e=>{
  if(e.target instanceof HTMLElement&&['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
  if(['w','a','s','d','W','A','S','D','Shift'].includes(e.key)){keys.add(e.key.toLowerCase());if(e.key!=='Shift')e.preventDefault();return}
  if(e.key==='r'||e.key==='R'){rotate();return}
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','+','-'].includes(e.key)){
   e.preventDefault();
   if(e.key==='ArrowLeft')W.ctl.rotateLeft(.2);else if(e.key==='ArrowRight')W.ctl.rotateLeft(-.2);
   else if(e.key==='+'||e.key==='ArrowUp')W.ctl.dollyIn(1.12);else W.ctl.dollyOut(1.12);
  }
  if(e.key==='Escape'){cancel();exitSelection();emit('close')}
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
 if(desired.lengthSq())desired.normalize().multiplyScalar(keys.has('shift')?18:9);
 cameraVelocity.lerp(desired,1-Math.exp(-9*dt));
 const shift=cameraVelocity.clone().multiplyScalar(dt);
 const tx=THREE.MathUtils.clamp(W.ctl.target.x+shift.x,-48,48),tz=THREE.MathUtils.clamp(W.ctl.target.z+shift.z,-48,48);
 shift.set(tx-W.ctl.target.x,0,tz-W.ctl.target.z);
 W.ctl.target.add(shift);W.cam.position.add(shift);
 if(P.mode?.smooth&&P.ghost){const alpha=1-Math.exp(-18*dt);P.ghost.position.x=THREE.MathUtils.lerp(P.ghost.position.x,P.mode.x,alpha);P.ghost.position.z=THREE.MathUtils.lerp(P.ghost.position.z,P.mode.z,alpha)}
}
