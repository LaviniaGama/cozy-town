import * as THREE from 'three';
import {mk,sprite,glow,W} from './world.js';
import {S} from './state.js';
import {BUILD,CROPS} from './data.js';
import {growProg} from './systems.js';
const {Group,CylinderGeometry:Cy,SphereGeometry:Sp,ConeGeometry:Co,BoxGeometry:Bx,TorusGeometry:To}=THREE;
const C={cream:0xfff3d6,pink:0xffb3c7,blue:0xa8d8ff,yel:0xffe28a,green:0xb8e6a1,soil:0x9c6b4a,white:0xffffff,red:0xff8a8a,lav:0xd9c2ff,mint:0xbdf0d4,brown:0xb98a68};
const PI=Math.PI;
export const rectOf=b=>{const d=BUILD[b.type],sw=b.r%2?d.d:d.w,sd=b.r%2?d.w:d.d;return{x:b.x,z:b.z,hw:sw/2,hd:sd/2}};
export const front=(b,f=0,l=0)=>{const d=BUILD[b.type],a=b.r*PI/2,s=Math.sin(a),c=Math.cos(a),fz=d.d/2+f;return{x:b.x+l*c+fz*s,z:b.z-l*s+fz*c}};
export const blocked=(x,z,m=.8)=>S.buildings.some(b=>{const r=rectOf(b);return Math.abs(x-r.x)<r.hw+m&&Math.abs(z-r.z)<r.hd+m});
function smoke(g,x,y,z){const ps=[0,1,2].map(i=>{const m=new THREE.Mesh(new Sp(.22,8,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0}));m.userData.p=i/3;m.raycast=()=>{};g.add(m);return m});
 return(dt,on)=>{for(const m of ps){const p=m.userData.p=(m.userData.p+dt*.4)%1;m.position.set(x+Math.sin(p*6)*.15,y+p*1.6,z);m.scale.setScalar(.6+p*1.4);m.material.opacity=on?(1-p)*.8:0}}}
function win(g,a,r,y,col=C.yel){const w=mk(new Sp(.32,12,10),col,Math.sin(a)*r,y,Math.cos(a)*r,{s:[1,1,.35],r:[0,a,0]});glow(w.material);g.add(w)}
const UTILITY={housing:[0xffe2a8,0xffad72,'🏘️'],wardrobe:[0xffb3c7,0xd9c2ff,'👒'],resthouse:[0xa8d8ff,0xffc2d9,'🛏️'],observatory:[0xc3b8ff,0x6c77bd,'🔭'],fishery:[0x8bd7d3,0x4ca7b2,'🎣'],nightmarket:[0x9d85bd,0x51467a,'🏮'],flowergarden:[0xffd3e4,0x9bd68b,'🌷'],archive:[0xffdb8a,0xffa58a,'📚']};
UTILITY.dairy=[0xfff3d6,0xa8d8ff,'🥛'];UTILITY.packing=[0xffe28a,0xffb3c7,'🛍️'];UTILITY.toolshop=[0xb8e6a1,0x9c6b4a,'🧰'];
function utility(type){return(b,g)=>{const[wall,roof,icon]=UTILITY[type]||[0xe8cfa8,0xb98a68,'🏠'];g.add(mk(new Bx(3.7,1.8,2.8),wall,0,.95,0),mk(new Co(2.55,1.35,5),roof,0,2.45,0),mk(new Bx(.85,1.05,.12),C.blue,0,.72,1.46));const s=sprite(icon,1.25);s.position.set(0,3.45,0);g.add(s);return{upd:(dt,t)=>{}}}}
const MAKE={
 housing:utility('housing'),wardrobe:utility('wardrobe'),resthouse:utility('resthouse'),observatory:utility('observatory'),fishery:utility('fishery'),nightmarket:utility('nightmarket'),flowergarden:utility('flowergarden'),archive:utility('archive'),
 dairy:utility('dairy'),packing:utility('packing'),toolshop:utility('toolshop'),
 kitchen(b,g){g.add(mk(new Cy(1.7,1.85,1.7,24),C.cream,0,.85,0),mk(new Co(2.25,1.7,24),C.pink,0,2.55,0),mk(new Cy(.28,.34,1.1,12),C.blue,.95,2.7,-.7),mk(new Cy(.46,.46,.14,18),C.blue,0,.55,1.78,{r:[PI/2,0,0]}));
  win(g,-.8,1.72,1.1);win(g,.8,1.72,1.1);const s=sprite('🍲',1.3);s.position.y=4.1;g.add(s);const sm=smoke(g,.95,3.4,-.7);return{upd:(dt)=>sm(dt,!!b.cur)}},
 bakery(b,g){g.add(mk(new Cy(1.8,1.9,1.5,24),C.yel,0,.75,0),mk(new Sp(2,20,12,0,PI*2,0,PI/2),C.blue,0,1.5,0,{s:[1,.85,1]}),mk(new To(.8,.16,10,18,PI),C.pink,0,1.2,1.75,{r:[0,0,0]}),mk(new Cy(.4,.4,.14,18),C.pink,0,.5,1.82,{r:[PI/2,0,0]}),mk(new Cy(.26,.3,.9,12),C.cream,-1,2.5,-.6));
  win(g,-.85,1.8,.95,C.pink);win(g,.85,1.8,.95,C.pink);const s=sprite('🥐',1.3);s.position.y=3.8;g.add(s);const sm=smoke(g,-1,3,-.6);return{upd:(dt)=>sm(dt,!!b.cur)}},
 restaurant(b,g){g.add(mk(new Cy(2,2.15,1.8,28),C.blue,0,.9,0,{s:[1.2,1,1]}),mk(new Co(2.5,1.4,28),C.pink,0,2.5,0,{s:[1.2,1,1]}),mk(new Cy(.5,.5,.14,18),C.cream,0,.6,2.1,{r:[PI/2,0,0]}),mk(new Cy(.05,.05,1.6,8),C.cream,1.4,3.5,0));
  const f=mk(new Bx(.8,.45,.05),C.yel,1.8,4,0);g.add(f);win(g,-.9,2.05,1.1);win(g,.9,2.05,1.1);
  for(const x of[-1.7,1.7]){g.add(mk(new Cy(.4,.4,.08,14),C.white,x,.62,2.9),mk(new Cy(.05,.05,.6,6),C.cream,x,.3,2.9))}
  const s=sprite('🍽️',1.4);s.position.y=4.5;g.add(s);return{upd:(dt,t)=>{f.rotation.y=Math.sin(t*3)*.3}}},
 farm(b,g){const post=new Cy(.1,.1,.7,8);for(let i=0;i<=6;i++)for(const z of[-2,2])g.add(mk(post,C.cream,i-3,.35,z));for(let i=1;i<4;i++)for(const x of[-3,3])g.add(mk(post,C.cream,x,.35,-2+i));
  g.add(mk(new Bx(6,.08,.08),C.cream,0,.55,-2),mk(new Bx(6,.08,.08),C.cream,0,.55,2),mk(new Bx(.08,.08,4),C.cream,-3,.55,0),mk(new Bx(.08,.08,4),C.cream,3,.55,0));
  const pv=[];for(let i=0;i<6;i++){const pg=new Group();pg.position.set((i%3-1)*1.9,0,(i<3?-1:1));pg.userData.ref={t:'plot',bid:b.id,i};pg.add(mk(new Cy(.8,.9,.22,16),C.soil,0,.11,0));const cg=new Group();pg.add(cg);g.add(pg);pv.push({cg,key:''})}
  const s=sprite('🌱',1.1);s.position.set(-3,1.5,2);g.add(s);
  return{upd(dt,t){pv.forEach((v,i)=>{const p=b.plots&&b.plots[i];let pr=0,k='-';if(p){pr=growProg(p);k=p.c+(pr>=1?'R':pr>.5?'B':'A')}
   if(k!==v.key){v.key=k;v.cg.clear();if(p)v.cg.add(cropMesh(p.c,pr>=1?2:pr>.5?1:0))}
   v.cg.scale.setScalar(p?(pr>=1?1:.5+pr*.5):1);v.cg.position.y=p&&pr>=1?Math.abs(Math.sin(t*4+i))*.12:0})}}}};
function cropMesh(c,st){const g=new Group(),col=CROPS[c].c,gr=0x8fd68a;
 if(st===0){for(const[x,z]of[[-.2,0],[.2,.1],[0,-.2]])g.add(mk(new Co(.12,.4,6),gr,x,.4,z));return g}
 g.add(mk(new Sp(.38,10,8),gr,0,.5,0,{s:[1,.8,1]}));if(st===1)return g;
 if(c==='wheat')for(let i=0;i<5;i++){const a=i*1.26,x=Math.sin(a)*.3,z=Math.cos(a)*.3;g.add(mk(new Cy(.05,.05,.9,6),col,x,.8,z),mk(new Sp(.12,8,6),col,x,1.3,z,{s:[1,1.6,1]}))}
 else if(c==='carrot')for(let i=0;i<4;i++){const a=i*1.57;g.add(mk(new Co(.14,.45,8),col,Math.sin(a)*.25,.62,Math.cos(a)*.25,{r:[PI,0,0]}))}
 else if(c==='corn'){g.add(mk(new Cy(.07,.09,1.2,8),gr,0,.8,0),mk(new Cy(.14,.12,.55,10),col,.18,1.0,0),mk(new Cy(.14,.12,.55,10),col,-.18,1.2,0))}
 else if(c==='pumpkin')g.add(mk(new Sp(.42,12,10),col,0,.62,0,{s:[1.2,.85,1.2]}),mk(new Cy(.06,.08,.25,6),0x5aa65a,0,1.05,0));
 else for(const[x,z]of[[.28,0],[-.2,.2],[-.05,-.28]])g.add(mk(new Sp(c==='tomato'?.2:.14,10,8),col,x,.7,z));
 return g}
export function makeBuilding(b){const g=new Group();g.position.set(b.x,0,b.z);g.rotation.y=b.r*PI/2;g.userData.ref={t:'b',id:b.id};const v=MAKE[b.type](b,g);v.g=g;v.b=b;return v}
const DM={
 bench(){const g=new Group();g.add(mk(new Bx(1.5,.14,.5),C.pink,0,.5,0),mk(new Bx(1.5,.5,.1),C.pink,0,.85,-.22));for(const x of[-.6,.6])g.add(mk(new Bx(.12,.5,.4),C.cream,x,.25,0));return g},
 lamp(){const g=new Group();g.add(mk(new Cy(.07,.1,2,8),C.cream,0,1,0));const b=mk(new Sp(.3,12,10),C.yel,0,2.15,0);glow(b.material);g.add(b);return g},
 flowerpot(){const g=new Group();g.add(mk(new Cy(.4,.3,.5,12),0xffc9a8,0,.25,0),mk(new Sp(.35,10,8),C.green,0,.6,0,{s:[1,.7,1]}));[[.2,0,C.pink],[-.15,.15,C.yel],[0,-.2,C.lav]].forEach(([x,z,c])=>g.add(mk(new Sp(.14,8,6),c,x,.9,z)));return g},
 fountain(){const g=new Group();g.add(mk(new Cy(1.1,1.2,.5,24),C.cream,0,.25,0),mk(new Cy(.95,.95,.1,24),C.blue,0,.48,0),mk(new Cy(.18,.22,.9,10),C.cream,0,.9,0),mk(new Cy(.55,.3,.2,16),C.cream,0,1.4,0),mk(new Sp(.3,10,8),C.blue,0,1.6,0));return g},
 sakura(){const g=new Group();g.add(mk(new Cy(.14,.2,1.1,8),C.brown,0,.55,0));[[0,1.5,0,.8],[.45,1.2,.2,.5],[-.4,1.25,-.1,.55]].forEach(([x,y,z,r])=>g.add(mk(new Sp(r,12,10),0xffc2d9,x,y,z)));return g},
 mailbox(){const g=new Group();g.add(mk(new Cy(.06,.08,.9,8),C.cream,0,.45,0),mk(new Bx(.5,.35,.35),C.blue,0,1,0),mk(new Bx(.05,.25,.05),C.red,.28,1.15,0));return g},
 picnic(){const g=new Group();g.add(mk(new Cy(.9,.9,.05,20),C.red,0,.03,0),mk(new Cy(.5,.5,.04,20),C.white,0,.07,0),mk(new Cy(.22,.2,.22,10),C.yel,.2,.2,0),mk(new Sp(.12,8,6),C.pink,-.3,.2,.2));return g},
 statue(){const g=new Group();g.add(mk(new Cy(.5,.55,.35,14),C.cream,0,.17,0),mk(new Sp(.35,12,10),C.white,0,.7,0,{s:[1,1.2,1]}),mk(new Sp(.27,12,10),C.white,0,1.2,0),mk(new Co(.1,.2,4),C.white,-.15,1.45,0),mk(new Co(.1,.2,4),C.white,.15,1.45,0));return g},
 parasol(){const g=new Group();g.add(mk(new Cy(.04,.04,1.8,6),C.cream,0,.9,0),mk(new Co(1.1,.6,12),C.yel,0,1.95,0),mk(new Cy(.5,.5,.5,10),C.pink,.9,.25,0));return g},
 rainbow(){const g=new Group();[0xff8a8a,0xffd08a,0xffee8a,0xb8e6a1,0xa8d8ff,0xd9c2ff].forEach((c,i)=>g.add(mk(new To(1.5-i*.15,.08,8,24,PI),c,0,0,0,{no:true})));return g}};
export function makeDecor(type,id){const g=DM[type]();if(id)g.userData.ref={t:'decor',id};return g}
