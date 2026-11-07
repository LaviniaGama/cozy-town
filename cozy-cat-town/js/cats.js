import * as THREE from 'three';
import {W,label,burst} from './world.js';
import * as A from './assets.js';
import {S} from './state.js';
import {CATS,RECIPES} from './data.js';
import {front,blocked} from './buildings.js';
import * as G from './systems.js';
class Actor{
 constructor(key,tint,ref,h){this.g=new THREE.Group();this.w=A.actor(key,{tint,h});this.g.add(this.w);
  const p=new THREE.Mesh(new THREE.SphereGeometry(.85,8,6),new THREE.MeshBasicMaterial({visible:false}));p.position.y=.75;this.g.add(p);
  this.g.userData.ref=ref;this.t=Math.random()*9;this.hd=Math.random()*6;this.jump=0;this.mode='idle'}
 go(x,z,dt,sp=1.7){const p=this.g.position,dx=x-p.x,dz=z-p.z,d=Math.hypot(dx,dz);if(d<.15)return true;const step=Math.min(d,sp*dt),a=Math.atan2(dx,dz),turns=[0,Math.PI/4,-Math.PI/4,Math.PI/2,-Math.PI/2,Math.PI];
  for(const turn of turns){const h=a+turn,nx=p.x+Math.sin(h)*step,nz=p.z+Math.cos(h)*step;if(!blocked(nx,nz,.55)){p.x=nx;p.z=nz;this.face(h,dt);return false}}
  return false}
 face(a,dt){let d=a-this.hd;d=Math.atan2(Math.sin(d),Math.cos(d));this.hd+=d*Math.min(1,dt*8);this.g.rotation.y=this.hd}
 anim(dt){this.t+=dt;const t=this.t;let y=0,sy=1,rz=0;
  if(W.reducedMotion){this.w.position.y=0;this.w.scale.set(1,1,1);this.w.rotation.z=0;return}
  if(this.jump>0){this.jump-=dt;const k=1-Math.max(0,this.jump)/.6;y=Math.sin(k*Math.PI)*.7;sy=1+Math.sin(k*Math.PI*2)*.08}
  else if(this.mode==='walk'){y=Math.abs(Math.sin(t*9))*.2;rz=Math.sin(t*9)*.1;sy=1+Math.sin(t*18)*.04}
  else if(this.mode==='work'){y=Math.abs(Math.sin(t*6))*.12;rz=Math.sin(t*6)*.08;sy=1+Math.sin(t*12)*.05}
  else if(this.mode==='sleep')sy=.88+Math.sin(t*1.2)*.03;else sy=1+Math.sin(t*2.2)*.03;
  const w=this.w;w.position.y=y;w.scale.set(1/Math.sqrt(sy),sy,1/Math.sqrt(sy));w.rotation.z=rz}}
export class CatEnt extends Actor{
 constructor(id){super(CATS[id].m,CATS[id].tint,{t:'cat',id});this.id=id;this.wait=Math.random()*3;this.tgt=null;
  for(let i=0;i<40;i++){const x=(Math.random()-.5)*20,z=(Math.random()-.5)*18;if(!blocked(x,z,.8)){this.g.position.set(x,0,z);break}}}
 update(dt){const b=S.buildings.find(x=>x.cat===this.id),p=this.g.position;
  if(b){const f=front(b,1.5,(this.id.charCodeAt(0)%3-1)*.9);if(this.go(f.x,f.z,dt,2.2)){this.mode='work';this.face(Math.atan2(b.x-p.x,b.z-p.z),dt)}else this.mode='walk'}
  else if(this.tgt){if(this.go(this.tgt.x,this.tgt.z,dt)){this.tgt=null;this.wait=2+Math.random()*5;this.mode='idle'}else this.mode='walk'}
  else if(W.night>.65)this.mode='sleep';
  else{this.mode='idle';this.wait-=dt;if(this.wait<=0){for(let i=0;i<16;i++){const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*43,x=Math.cos(a)*r,z=Math.sin(a)*r;if(!blocked(x,z,.6)){this.tgt={x,z};break}}this.wait=1;if(Math.random()<.25)this.jump=.6}}
  this.anim(dt)}
 poke(){this.jump=.6;burst(this.g.position.clone().setY(1.7),'💖',3)}}
export class CustEnt extends Actor{
 constructor(c){super(c.model||c.kind,c.tint,{t:'cust',id:c.id},1.3);this.c=c;this.st='in';this.g.position.set(12,0,6);this.exit=false}
 leave(ok){this.st='out';this.ok=ok;burst(this.g.position.clone().setY(1.8),ok?'🪙':'💨',3)}
 update(dt){const r=G.restaurant(),p=this.g.position;
  if(this.st==='out'){this.mode='walk';const d=this.go(13,7,dt,2.4);this.anim(dt);return d}
  if(!r){this.leave(false);return false}
  const s=front(r,1.7,(this.c.slot-1.5)*1.4);
  if(this.st==='in'){if(this.go(s.x,s.z,dt,2)){this.st='wait'}else this.mode='walk'}
  if(this.st==='wait'){this.mode='idle';this.face(Math.atan2(r.x-p.x,r.z-p.z)+Math.PI,dt);
   const ok=S.inv[this.c.want]>0,pr=1-(Date.now()-this.c.born)/this.c.pat;
   label(this.c.id,new THREE.Vector3(p.x,2.6,p.z),`<span class="bub ${ok?'ok':''}">${RECIPES[this.c.want].e}<i style="width:${Math.max(0,pr)*100}%"></i></span>`,{a:'serve',id:this.c.id})}
  this.anim(dt);return false}}
export class MoneyCat{
 constructor(x,z){this.g=new THREE.Group();this.g.add(A.actor('money',{tint:0x68d88a}));const p=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshBasicMaterial({visible:false}));p.position.y=.9;this.g.add(p);
  this.g.userData.ref={t:'money'};this.g.position.set(x,0,z);this.t=0;this.life=30;burst(new THREE.Vector3(x,1.5,z),'✨',5)}
 update(dt){this.t+=dt;this.life-=dt;this.g.children[0].rotation.y=this.t*1.6;this.g.children[0].position.y=.5+Math.abs(Math.sin(this.t*3))*.4;
  label('money',new THREE.Vector3(this.g.position.x,2.4,this.g.position.z),'<span class="bub ok">💰 +${}</span>'.replace('${}',100+S.lv*40),{a:'money',id:'m'});return this.life<=0}}
