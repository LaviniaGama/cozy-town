import * as THREE from 'three';
import {mk,sprite,glow,W,GRAD} from './world.js';
import {S} from './state.js';
import {BUILD,CROPS,DECOR} from './data.js';
import {growProg} from './systems.js';
const {Group,CylinderGeometry:Cy,SphereGeometry:Sp,ConeGeometry:Co,BoxGeometry:Bx,TorusGeometry:To}=THREE;
const C={cream:0xfff3d6,pink:0xffb3c7,blue:0xa8d8ff,yel:0xffe28a,green:0xb8e6a1,soil:0x9c6b4a,white:0xffffff,red:0xff8a8a,lav:0xd9c2ff,mint:0xbdf0d4,brown:0xb98a68};
const PI=Math.PI;
const FLOWER_PETALS={anemone:8,astilbe:10,begonia:6,camellia:9,carnation:10,chrysanthemum:12,dahlia:10,foxglove:5,freesia:6,geranium:7,hibiscus:5,hyacinth:8,jasmine:6,marigold:9,orchid:5,peony:11,petunia:5,snapdragon:6,zinnia:9,bluebell:6};
export const rectOf=b=>{const d=BUILD[b.type],sw=b.r%2?d.d:d.w,sd=b.r%2?d.w:d.d;return{x:b.x,z:b.z,hw:sw/2,hd:sd/2}};
export const decorRect=d=>{const v=DECOR[d.type]||{};return{x:d.x,z:d.z,hw:(v.w||1)/2,hd:(v.d||1)/2,floor:v.form==='floor'}};
export const front=(b,f=0,l=0)=>{const d=BUILD[b.type],a=b.r*PI/2,s=Math.sin(a),c=Math.cos(a),fz=d.d/2+f;return{x:b.x+l*c+fz*s,z:b.z-l*s+fz*c}};
export const blocked=(x,z,m=.8)=>Math.hypot(x,z)>54||S.buildings.some(b=>{const d=BUILD[b.type],a=b.r*PI/2,dx=x-b.x,dz=z-b.z,lx=dx*Math.cos(a)-dz*Math.sin(a),lz=dx*Math.sin(a)+dz*Math.cos(a);return Math.abs(lx)<d.w/2+m&&Math.abs(lz)<d.d/2+m});
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
const BUILD_STYLE={
 barn:[0xc45c55,0x793f56],silo:[0xdbc89f,0x9b805b],pen:[0xe6d5aa,0xb47c55],
 pond:[0x85c9d8,0x66aab9],garden:[0xb8db9b,0x76ad76],glass:[0xa9d9cf,0x7db5ba],
 shop:[0xf0c7d4,0xd990aa],mill:[0xc58b57,0x886141],hotel:[0xd6c4ee,0x9a83b9]
};
function extraBuilding(type,g){
 const def=BUILD[type],style=BUILD_STYLE[def.style]||[0xe9d5aa,0xb98a68],wall=style[0],roof=style[1],icon=def.e;
 const add=(geo,col,x,y,z,s,r)=>{const m=mk(geo,col,x,y,z,{s,r});g.add(m);return m};
 if(def.style==='silo'){
  for(const x of[-.72,.35]){add(new Cy(.58,.68,2.7,12),wall,x,1.35,0);add(new Sp(.58,12,8),wall,x,2.68,0,[1,.45,1]);add(new Cy(.12,.16,.3,10),roof,x,2.98,0)}
  add(new Bx(.4,.8,.08),0x765742,-.15,.42,.55);return{upd(){}}
 }
 if(def.style==='pen'||def.style==='pond'){
  add(new Bx(def.w-.3,.14,.12),wall,0,.52,-def.d/2+.1);add(new Bx(def.w-.3,.14,.12),wall,0,.52,def.d/2-.1);
  add(new Bx(.12,.14,def.d-.3),wall,-def.w/2+.1,.52,0);add(new Bx(.12,.14,def.d-.3),wall,def.w/2-.1,.52,0);
  for(const x of[-1,0,1])for(const z of[-1,1])add(new Bx(.12,.9,.12),roof,x,.48,z);
  if(def.style==='pond'){
   add(new Cy(1.45,1.55,.14,20),0x75b9cf,0,.15,0);
   for(const[x,z]of[[-.65,-.4],[.4,.42],[.6,-.55]]){add(new Sp(.34,8,6),0x76a87b,x,.25,z,[1,.16,1]);add(new Sp(.12,8,6),0xffb7cf,x,.31,z)}
  }else{
   const animal=type==='sheep_pen'?'🐑':type==='chicken_coop'?'🐔':type==='rabbit_hutch'?'🐰':type==='fish_pond'?'🐟':type==='duck_pond'?'🦆':'🐐';
   for(const[x,z]of[[-.8,-.4],[.65,.32]]){const a=sprite(animal,.85);a.position.set(x,.85,z);g.add(a)}
   add(new Bx(.75,.5,.5),roof,0,.25,def.d/2-.4);add(new Co(.65,.42,4),wall,0,.7,def.d/2-.4);
  }
  return{upd(){}}
 }
 if(def.style==='glass'){
  add(new Bx(def.w,1.8,def.d),0x90b99a,0,.9,0);
  const glass=new THREE.Mesh(new Bx(def.w-.25,1.55,def.d-.25),new THREE.MeshToonMaterial({color:0xbce9e8,transparent:true,opacity:.35,gradientMap:GRAD}));
  glass.position.set(0,1,0);glass.castShadow=true;g.add(glass);
  add(new Co(def.w*.75,1,5),roof,0,2.25,0);
  for(const x of[-1.2,-.4,.4,1.2]){add(new Cy(.04,.04,.65,6),0x6da778,x,.48,0);add(new Sp(.18,8,6),0x8bcf82,x,.85,0)}
 }else{
  add(new Bx(def.w-.4,1.85,def.d-.4),wall,0,.92,0);
  add(new Co(Math.max(def.w,def.d)*.78,1.35,5),roof,0,2.45,0);
  add(new Bx(.78,1.05,.14),0x805b49,0,.55,def.d/2-.15);
  for(const x of[-def.w*.27,def.w*.27]){
   add(new Bx(.52,.46,.12),0x9bd5e7,x,1.28,def.d/2-.18);
   add(new Bx(.08,.55,.06),0xfff0cc,x,1.28,def.d/2-.1);
  }
  if(def.style==='barn'){add(new Bx(.94,.92,.16),0xb24e4c,0,.62,def.d/2+.01);add(new Bx(.045,.86,.04),0xf0d49b,0,.62,def.d/2+.1)}
  if(def.style==='mill'){
   add(new Cy(.13,.25,.68,8),0x806445,0,3.55,0);
   for(let i=0;i<4;i++){const a=i*Math.PI/2,blade=add(new Bx(.18,1.1,.12),0xf0dfbb,Math.sin(a)*.56,3.55+Math.cos(a)*.56,def.d/2*.35);blade.rotation.z=-a}
  }
  if(def.style==='shop'||def.style==='hotel'){
   add(new Bx(def.w*.9,.2,.62),wall,0,2.05,def.d/2+.15);
   for(let i=-1;i<=1;i++)add(new Sp(.1,8,6),i%2?0xffdc79:0xff9fbc,i*.65,2.17,def.d/2+.25);
  }
  if(type==='cat_hotel'||type==='cat_library'){for(const x of[-.65,.65])add(new To(.2,.07,8,14),0xffe6a8,x,2.5,def.d/2+.05,[Math.PI/2,0,0])}
 }
 const sign=sprite(icon,1.1);sign.position.set(0,3.25,def.d/2+.3);g.add(sign);
 return{upd(dt,t){if(def.style==='mill')g.children.forEach(o=>{if(o.userData.windmill)o.rotation.z+=dt*.35})}}
}
function cropMesh(c,st){const g=new Group(),col=CROPS[c].c,gr=0x8fd68a;
 if(st===0){for(const[x,z]of[[-.2,0],[.2,.1],[0,-.2]])g.add(mk(new Co(.12,.4,6),gr,x,.4,z));return g}
 g.add(mk(new Sp(.38,10,8),gr,0,.5,0,{s:[1,.8,1]}));if(st===1)return g;
 if(c==='wheat')for(let i=0;i<5;i++){const a=i*1.26,x=Math.sin(a)*.3,z=Math.cos(a)*.3;g.add(mk(new Cy(.05,.05,.9,6),col,x,.8,z),mk(new Sp(.12,8,6),col,x,1.3,z,{s:[1,1.6,1]}))}
 else if(c==='carrot')for(let i=0;i<4;i++){const a=i*1.57;g.add(mk(new Co(.14,.45,8),col,Math.sin(a)*.25,.62,Math.cos(a)*.25,{r:[PI,0,0]}))}
 else if(c==='corn'){g.add(mk(new Cy(.07,.09,1.2,8),gr,0,.8,0),mk(new Cy(.14,.12,.55,10),col,.18,1.0,0),mk(new Cy(.14,.12,.55,10),col,-.18,1.2,0))}
 else if(c==='pumpkin')g.add(mk(new Sp(.42,12,10),col,0,.62,0,{s:[1.2,.85,1.2]}),mk(new Cy(.06,.08,.25,6),0x5aa65a,0,1.05,0));
 else for(const[x,z]of[[.28,0],[-.2,.2],[-.05,-.28]])g.add(mk(new Sp(c==='tomato'?.2:.14,10,8),col,x,.7,z));
 if(st===2){const mark=sprite(CROPS[c].e,.48);mark.position.set(0,1.42,.25);g.add(mark)}
 return g}
export function makeBuilding(b){const g=new Group();g.position.set(b.x,0,b.z);g.rotation.y=b.r*PI/2;g.userData.ref={t:'b',id:b.id};const v=(MAKE[b.type]||((_,group)=>extraBuilding(b.type,group)))(b,g);v.g=g;v.b=b;return v}
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
function extraDecor(type,d){const g=new Group(),c=d.color,a=d.accent;
 const add=(geo,col,x,y,z,s,r)=>{const m=mk(geo,col,x,y,z,{s,r});g.add(m);return m};
 if(d.form==='flower'){
  const petal=d.petalColor||0xffb3c7,center=0xffd66b,shape=d.shape;
  add(new Cy(.035,.05,.62,6),0x6da868,0,.31,0);
  add(new Sp(.13,8,6),0x78b96c,-.16,.33,.02,[1,.55,2],[0,0,-.55]);
  add(new Sp(.12,8,6),0x78b96c,.15,.43,0,[1,.55,2],[0,0,.6]);
  if(shape==='tulip'||shape==='bell'){
   add(new Sp(.2,9,7),petal,0,.72,0,[.72,1.35,.72]);
   if(shape==='tulip')for(const x of[-.1,.1])add(new Sp(.11,8,6),petal,x,.82,0,[.65,1.2,.7],[0,0,x<0?.35:-.35]);
   else add(new Cy(.12,.2,.26,8),center,0,.64,0);
  }else if(shape==='lavender'){
   add(new Cy(.025,.035,.46,6),0x6da868,0,.67,0);
   for(let i=0;i<5;i++)add(new Sp(.095,7,5),petal,Math.sin(i*.62)*.1,.82+i*.095,Math.cos(i*.62)*.08);
  }else if(shape==='rose'){
   add(new Sp(.19,9,7),center,0,.72,0);
   for(let ring=0;ring<2;ring++)for(let i=0;i<5;i++){const a=i/5*PI*2+ring*.35,r=ring?.13:.075;add(new Sp(ring?.13:.11,8,6),petal,Math.cos(a)*r,.72+ring*.045,Math.sin(a)*r,[1,.78,1],[0,a,0])}
  }else{
   const count=shape==='sunflower'?12:shape==='lily'?6:FLOWER_PETALS[shape]||8;
   for(let i=0;i<count;i++){
    const a=i/count*PI*2,dist=shape==='sunflower'?.19:shape==='chrysanthemum'||shape==='dahlia'?.18:.16;
    const elong=shape==='lily'||shape==='iris'||shape==='freesia'||shape==='foxglove'||shape==='bluebell';
    const ruffled=shape==='carnation'||shape==='chrysanthemum'||shape==='peony';
    add(new Sp(elong?.085:ruffled?.09:.105,8,6),petal,Math.cos(a)*dist,.74,Math.sin(a)*dist,elong?[.7,1.8,.65]:ruffled?[.8,1.4,.75]:[.85,1.2,.8],[0,-a,elong?-.35:ruffled?-.16:0]);
   }
   add(new Sp(shape==='sunflower'?.13:.095,9,7),shape==='sunflower'?0x80552f:center,0,.74,0);
   if(shape==='cosmos'||shape==='poppy')add(new Sp(.055,8,6),0x8c4f37,0,.81,.035);
  }
 }else if(d.form==='floor'){
  add(new Bx(.98,.08,.98),c,0,.045,0);
  const rail=.065;
  for(const z of[-.42,.42])add(new Bx(.88,.025,rail),a,0,.1,z);
  for(const x of[-.42,.42])add(new Bx(rail,.025,.78),a,x,.1,0);
  if(d.shape==='wood'){for(const z of[-.3,-.1,.1,.3])add(new Bx(.82,.018,.018),a,0,.105,z)}
  else if(d.shape==='brick'){for(const z of[-.25,.25])add(new Bx(.88,.02,.025),a,0,.105,z);for(const x of[-.23,.23])add(new Bx(.025,.02,.42),a,x,.105,0)}
  else if(d.shape==='tile'||d.shape==='mosaic'){for(const[x,z]of[[-.23,-.23],[.23,-.23],[-.23,.23],[.23,.23]])add(new Bx(.36,.025,.36),a,x,.11,z)}
  else if(d.shape==='cobble'){for(const[x,z,s]of[[-.24,-.22,.19],[.18,-.25,.22],[-.19,.2,.22],[.23,.2,.18]])add(new Sp(s,7,5),a,x,.11,z,[1,.16,1])}
  else if(d.shape==='flower'||d.shape==='fruit'){for(const[x,z]of[[-.23,-.18],[.2,-.2],[-.12,.2],[.24,.18]]){add(new Sp(.075,8,6),a,x,.12,z,[1,.38,1]);if(d.shape==='fruit')add(new Sp(.055,7,5),c,x+.06,.13,z+.04)}}
  else if(d.shape==='leaf'){for(const[x,z,r]of[[-.22,-.18,-.6],[.2,-.16,.5],[-.19,.2,.45],[.22,.2,-.5]])add(new Sp(.11,7,5),a,x,.12,z,[1,.35,.65],[0,r,r])}
  else if(d.shape==='shell'){for(const[x,z]of[[-.2,-.15],[.2,.16]])add(new To(.09,.025,5,10,PI),a,x,.12,z)}
  else if(d.shape==='cloud'){for(const[x,z,r]of[[-.2,0,.11],[0,-.17,.13],[.2,0,.11]])add(new Sp(r,7,5),a,x,.12,z,[1,.25,1])}
  else if(d.shape==='moon'){add(new To(.18,.035,7,12,PI),a,0,.13,0)}
  else if(d.shape==='wave'){for(const z of[-.3,0,.3])add(new To(.3,.018,6,14,Math.PI),a,0,.12,z,[1,.5,.5])}
  else if(d.shape==='honey'){for(const[x,z]of[[-.21,-.19],[.21,-.19],[-.21,.19],[.21,.19]])add(new Cy(.12,.12,.025,6),a,x,.12,z,[1,1,1],[0,0,Math.PI/6])}
  else if(d.shape==='marble'){add(new To(.3,.018,5,14),a,0,.12,0)}
  else if(d.shape==='snow'){for(const[x,z]of[[-.22,-.2],[.2,.18],[.18,-.21]])add(new Sp(.07,6,4),a,x,.12,z)}
  else add(new To(.16,.035,5,12),a,0,.13,0);
 }else if(d.form==='fruitTree'){
  add(new Cy(.18,.24,1.28,8),0x9b6b4c,0,.64,0);
  if(type==='fruit_tree_12'){
   add(new Cy(.16,.2,.72,7),0x9b6b4c,.08,1.25,0,null,[0,0,-.18]);
   for(let i=0;i<7;i++){const a=i/7*PI*2;add(new Sp(.23,9,7),d.leafColor,Math.sin(a)*.56,1.96,Math.cos(a)*.56,[.8,.42,3.8],[.25,a,0])}
   for(const[x,z]of[[-.18,.08],[.17,.06],[0,-.16]])add(new Sp(.2,8,6),0x9b704d,x,1.75,z);
  }else if(type==='fruit_tree_17'){
   for(let i=0;i<5;i++){const a=i/5*PI*2;add(new Sp(.28,9,7),d.leafColor,Math.sin(a)*.48,1.9,Math.cos(a)*.48,[.85,.34,2.9],[.16,a,0])}
   for(const[x,y,z]of[[-.2,1.45,.14],[.22,1.58,.11],[.02,1.7,-.15]])add(new Sp(.13,8,6),d.fruitColor,x,y,z,[1.2,1,.75]);
  }else{
   add(new Sp(.78,12,9),d.leafColor,0,1.42,0,[1,1,.95]);add(new Sp(.54,10,8),d.leafColor,-.39,1.83,.08);add(new Sp(.54,10,8),d.leafColor,.39,1.83,-.08);add(new Sp(.4,10,8),d.leafColor,0,2.12,-.1);
   for(const[x,y,z]of[[-.43,1.55,.35],[.35,1.7,.32],[.03,1.99,.23],[-.02,1.34,-.38],[.49,1.94,-.12]])add(new Sp(.16,9,7),d.fruitColor,x,y,z);
  }
 }else if(d.form==='tree'||d.form==='pine'){
  add(new Cy(.16,.23,1.05,7),0x9b6b4c,0,.52,0);
  if(d.form==='pine'||d.treeStyle==='pine'){
   for(const[y,r]of[[.9,.63],[1.45,.52],[1.93,.39],[2.3,.24]])add(new Co(r*1.65,r*1.55,7),c,0,y,0);
   add(new Sp(.15,8,6),a,0,2.52,0);
  }else if(d.treeStyle==='willow'){
   add(new Sp(.7,10,8),c,0,1.42,0,[1.15,.84,1.08]);
   for(let i=0;i<9;i++){const t=i/9*PI*2;add(new Sp(.15,8,6),i%2?a:c,Math.cos(t)*.62,1.04,Math.sin(t)*.62,[.72,1.9,.72])}
  }else if(d.treeStyle==='column'){
   add(new Sp(.56,10,8),c,0,1.44,0,[.72,1.8,.72]);
   add(new Sp(.4,9,7),a,0,2.04,0,[.75,1.45,.75]);
  }else if(d.treeStyle==='cloud'){
   for(const[x,y,z,r]of[[0,1.2,0,.48],[-.42,1.48,.04,.45],[.42,1.48,-.04,.45],[0,1.83,-.06,.43],[0,2.13,0,.34]])add(new Sp(r,10,8),c,x,y,z,[1,.82,1]);
  }else if(d.treeStyle==='crystal'){
   for(const[x,z,h,r]of[[-.36,0,1.2,.35],[0,.12,1.8,.42],[.34,-.1,1.35,.32]])add(new Co(r,h,6),c,x,h/2+.72,z);
   add(new Co(.22,.85,5),a,.12,1.05,.08,[0,0,-.18]);
  }else{
   add(new Sp(.65,10,8),c,0,1.25,0,[1,1.03,1]);
   add(new Sp(.52,10,8),c,-.33,1.7,-.05,[1,1.04,1]);
   add(new Sp(.54,10,8),a,.32,1.72,.05,[1,1.02,1]);
   add(new Sp(.38,10,8),c,0,2.02,-.08);
   for(const[x,z]of[[-.56,.12],[.48,-.22],[.1,.48]])add(new Sp(.08,7,5),a,x,1.4,z);
   if(d.treeStyle==='blossom')for(const[x,y,z]of[[-.42,1.55,.37],[.36,1.77,.3],[.03,2.07,.27],[-.1,1.25,-.44],[.48,1.91,-.14]])add(new Sp(.13,8,6),a,x,y,z);
  }
 }else if(d.form==='pot'||d.form==='urn'){
  const wide=type==='pot_giant'? .62:.43,high=type==='pot_tall'? .62:.48;
  if(type==='pot_square')add(new Bx(.82,high,.82),c,0,high/2,0);
  else{
   add(new Cy(wide*.78,wide,high,12),c,0,high/2,0);
   add(new Cy(wide+.07,wide+.07,.09,14),a,0,high-.015,0);
   add(new Cy(wide*.72,wide*.72,.08,12),0x74543f,0,high-.06,0);
   if(d.form==='urn'){add(new Cy(.22,.38,.35,10),c,0,high+.11,0);for(const x of[-.37,.37])add(new To(.12,.05,6,10),a,x,high*.72,0,[0,0,PI/2])}
  }
  for(const[x,z]of[[-.2,0],[.16,.13],[0,-.2]]){
   add(new Cy(.025,.035,.43,5),0x6a9c62,x,high+.2,z);
   add(new Sp(.19,8,6),d.color,x,high+.48,z,[1,.7,.8]);
   add(new Sp(.075,8,6),a,x,high+.5,z+.02);
  }
  if(type==='pot_berry')for(const[x,z]of[[-.22,.16],[.22,-.13]]){add(new Sp(.11,8,6),0xe95168,x,.3,z);add(new Co(.07,.12,5),0x6cab61,x,.42,z)}
 }else if(d.form==='lamp'||d.form==='lantern'||d.form==='crystal'){
  add(new Cy(.07,.11,1.4,8),type==='lamp_moon'?0x7771a4:c,0,.7,0);
  add(new Cy(.2,.3,.14,8),a,0,.14,0);
  if(type==='lamp_moon'){add(new To(.28,.07,8,18,PI),a,0,1.76,0);add(new Sp(.11,8,6),c,.18,1.72,0)}
  else if(type==='lamp_flower'){for(let i=0;i<6;i++){const t=i*PI/3;add(new Sp(.14,8,6),a,Math.cos(t)*.23,1.64+Math.sin(t)*.23,0)}add(new Sp(.13,8,6),0xfff0a0,0,1.64,0)}
  else if(type==='lamp_mushroom'){add(new Cy(.12,.17,.48,7),0xf0dfbb,0,1.48,0);add(new Sp(.48,9,7),c,0,1.76,0,[1,.55,1]);for(const[x,z]of[[-.2,0],[.18,.12],[0,-.2]])add(new Sp(.07,7,5),a,x,1.93,z)}
  else if(d.form==='crystal'){add(new Co(.31,.82,6),c,0,1.55,0);add(new Co(.2,.55,5),a,.22,1.28,.08,[.1,0,.5]);add(new Co(.16,.44,5),a,-.22,1.22,-.08,[0,0,-.5])}
  else{add(new Bx(.42,.52,.42),c,0,1.42,0);add(new Co(.34,.32,4),a,0,1.85,0);add(new Bx(.05,.46,.05),a,0,1.42,.23)}
 }else if(d.form==='bench'||d.form==='swing'){
  for(const x of[-.58,.58])add(new Bx(.12,.54,.48),a,x,.29,0);
  add(new Bx(1.52,.16,.58),c,0,.62,0);
  for(const z of[-.21,0,.21])add(new Bx(1.42,.045,.045),a,0,.715,z);
  if(type==='bench_heart'){add(new Sp(.24,.1,9,6),a,0,1.04,-.24,[1,.82,.22]);add(new Co(.08,.26,4),a,-.12,1.22,-.24,[0,0,.3]);add(new Co(.08,.26,4),a,.12,1.22,-.24,[0,0,-.3])}
  else add(new Bx(1.5,.4,.12),c,0,.94,-.25);
  if(d.form==='swing'){for(const x of[-.58,.58])add(new Cy(.035,.035,.92,6),a,x,1.48,-.25);add(new To(.73,.05,8,16,PI),a,0,1.98,-.25)}
 }else if(d.form==='topiary'){
  add(new Cy(.35,.4,.25,12),0xc4a783,0,.13,0);
  if(type==='topiary_cat'){add(new Sp(.42,10,8),c,0,.86,0);for(const x of[-.25,.25])add(new Co(.14,.35,4),c,x,1.28,0,[0,0,x<0?.3:-.3]);for(const x of[-.14,.14])add(new Sp(.045,6,4),0x493a48,x,.91,.37)}
  else if(type==='topiary_bunny'){add(new Sp(.4,10,8),c,0,.8,0);for(const x of[-.2,.2])add(new Sp(.13,8,6),c,x,1.25,0,[.7,.7,2.8])}
  else if(type==='topiary_heart'){add(new Sp(.4,10,8),c,-.2,.95,0,[1,1,1]);add(new Sp(.4,10,8),c,.2,.95,0,[1,1,1]);add(new Co(.55,.65,5),c,0,.63,0,[0,0,PI])}
 }else if(type==='mushroom_house'){
  add(new Cy(.43,.58,.72,10),0xf1dfbb,0,.38,0);add(new Sp(.8,12,8),c,0,.92,0,[1,.56,1]);
  add(new Bx(.25,.42,.06),a,0,.28,.54);add(new Sp(.07,7,5),0xf9e4a5,0,.35,.59);
  for(const[x,z]of[[-.32,.2],[.28,-.2],[.1,.35]])add(new Sp(.12,8,6),a,x,1.16,z);
 }else if(type==='birdbath'){
  add(new Cy(.13,.25,.76,9),c,0,.38,0);add(new Cy(.52,.62,.16,12),a,0,.82,0);add(new Cy(.43,.43,.09,12),0x83c8d8,0,.92,0);
  add(new Sp(.19,8,6),0x8dbd79,.18,1.12,0,[1,.7,1]);add(new Sp(.1,8,6),a,.18,1.3,0);
 }else if(type==='garden_arch'||type==='rainbow_arch'){
  const colors=type==='rainbow_arch'?[0xf48fa6,0xffd06f,0xffec8b,0x93d68a,0x82c9e8,0xb8a1e5]:[c,c,c];
  for(const x of[-.84,.84])add(new Cy(.11,.14,1.85,8),c,x,.92,0);
  add(new To(.84,.12,8,20,PI),c,0,1.84,0);
  if(type==='rainbow_arch')colors.forEach((v,i)=>add(new To(.78-i*.105,.045,8,20,PI),v,0,1.84,0));
  else for(let i=0;i<12;i++){const t=i/11*PI;add(new Sp(.12,8,6),i%2?a:c,Math.cos(t)*.84,1.84+Math.sin(t)*.84,0)}
 }else if(type==='birdhouse'){
  add(new Cy(.06,.08,1.3,7),0x8b684b,0,.65,0);add(new Bx(.65,.55,.55),c,0,1.55,0);add(new Co(.53,.48,4),a,0,2.02,0);add(new Cy(.09,.09,.08,8),0x59483c,0,1.53,.29);add(new To(.16,.045,8,16),a,0,1.13,.31,[PI/2,0,0]);
 }else if(type==='garden_clock'){
  add(new Cy(.07,.09,1.2,8),c,0,.6,0);add(new Cy(.42,.45,.12,12),a,0,1.35,0);add(new Cy(.32,.34,.08,12),0xfff4db,0,1.43,0);
  add(new Bx(.035,.22,.025),c,0,1.52,.06);add(new Bx(.2,.035,.025),c,.08,1.43,.06);
 }else if(type==='garden_well'){
  add(new Cy(.72,.82,.62,12),c,0,.31,0);add(new Cy(.65,.65,.1,12),0x71bfd0,0,.66,0);
  for(const x of[-.63,.63])add(new Cy(.09,.12,1.3,7),a,x,1.25,0);
  add(new Co(.9,.48,4),0x8a6b55,0,1.92,0);add(new Cy(.04,.04,.65,6),c,0,1.45,.74);add(new Cy(.18,.18,.22,8),a,0,1.13,.74);
 }else if(type==='windmill'){
  add(new Cy(.06,.08,1.25,7),c,0,.63,0);
  for(let i=0;i<4;i++){const t=i*PI/2;add(new Bx(.12,.58,.07),i%2?a:c,Math.cos(t)*.33,1.42+Math.sin(t)*.33,0,[0,0,-t])}
  add(new Sp(.15,8,6),a,0,1.42,.08);
 }else if(type==='table'||type==='picnic_table'){
  add(new Cy(.62,.65,.13,12),c,0,.88,0);for(const x of[-.45,.45])add(new Cy(.06,.07,.82,7),a,x,.41,0);
  add(new Sp(.17,8,6),0xffa4b7,-.2,1.08,.1);add(new Sp(.15,8,6),0xffd27a,.22,1.07,-.12);
  for(const x of[-.8,.8])add(new Bx(.42,.12,.38),a,x,.42,.72);
 }else if(type==='bird_nest'){
  add(new Sp(.44,10,7),c,0,.35,0,[1,.5,1]);for(let i=0;i<9;i++){const t=i*PI*2/9;add(new To(.3,.045,5,10),a,Math.cos(t)*.16,.37,Math.sin(t)*.16,[PI/2,0,t])}
  for(const[x,z]of[[-.17,0],[.12,.1],[.05,-.16]])add(new Sp(.12,8,6),iColor(x),x,.45,z);
 }else if(type==='flower_cart'){
  add(new Bx(.88,.32,.56),c,0,.56,0);for(const x of[-.43,.43])add(new To(.18,.05,7,12),0x493d43,x,.2,0,[PI/2,0,0]);
  add(new Bx(.09,.07,.72),a,-.61,.26,0,[0,0,-.45]);
  for(const[x,z]of[[-.25,-.16],[0,.1],[.24,-.1],[.1,.2]]){add(new Cy(.025,.035,.45,5),0x75aa66,x,.88,z);add(new Sp(.16,8,6),a,x,1.13,z)}
 }else if(type==='water_lily'){
  add(new Cy(.82,.9,.13,20),c,0,.09,0);for(const[x,z]of[[-.45,-.18],[.32,.3],[.25,-.36]])add(new Sp(.28,8,6),0x75a879,x,.19,z,[1,.12,1]);
  add(new Sp(.16,8,6),a,0,.24,0);add(new Sp(.08,8,6),0xfff0af,0,.31,0);
 }else if(type==='fence_rose'){
  add(new Bx(1.65,.12,.1),c,0,.38,0);add(new Bx(1.65,.12,.1),c,0,.75,0);
  for(const x of[-.78,-.26,.26,.78]){add(new Cy(.045,.055,.9,6),a,x,.48,0);if(x%2)add(new Sp(.16,8,6),0x77ae72,x,1,0);else add(new Sp(.15,8,6),a,x,1,0)}
 }else if(type==='cat_sign'){
  add(new Cy(.06,.08,1.25,7),c,0,.63,0);add(new Bx(.78,.52,.1),a,0,1.13,0);
  add(new Sp(.11,8,6),0xfff2d5,-.2,1.15,.07);add(new Sp(.11,8,6),0xfff2d5,.2,1.15,.07);
  add(new To(.13,.04,8,12),0x8c644b,0,1.22,.08,[0,0,PI]);
 }else if(type==='star_fountain'){
  add(new Cy(.76,.86,.35,16),c,0,.18,0);add(new Cy(.68,.68,.1,16),0x86cddd,0,.4,0);add(new Cy(.13,.18,.5,8),a,0,.63,0);
  add(new Sp(.28,8,6),0x90d9e7,0,.95,0);add(new Co(.32,.48,5),a,0,1.38,0);
 }else if(type==='crystal_cluster'){
  for(const[x,z,h]of[[-.3,0,.9],[.16,.15,1.25],[.3,-.24,.75]])add(new Co(.26,h,6),c,x,h/2,z,[.1,0,x*.4]);
  add(new Co(.17,.9,5),a,.16,.48,.15,[0,0,-.4]);
 }else if(d.form==='novelty'){
  add(new Bx(1.08,.12,.92),0xc9ae91,0,.06,0);
  add(new Bx(.92,.045,.78),a,0,.145,0);
  if(d.shape==='cat'||d.shape==='rabbit'||d.shape==='fox'||d.shape==='owl'){
   add(new Sp(.34,10,8),c,0,.55,0,[1,.92,.82]);
   add(new Sp(.31,10,8),c,0,.99,.015);
   if(d.shape==='owl'){
    add(new Sp(.16,8,6),a,-.12,1.02,.27);add(new Sp(.16,8,6),a,.12,1.02,.27);
    for(const x of[-.12,.12]){add(new Sp(.075,8,6),0xfff4da,x,1.03,.39);add(new Sp(.035,7,5),0x493d43,x,1.03,.45)}
    for(const x of[-.31,.31])add(new Sp(.15,8,6),a,x,.66,0,[.65,.7,.5]);
   }else{
    const earHeight=d.shape==='rabbit'?.48:.31,earWidth=d.shape==='fox'?.19:.14;
    for(const x of[-.2,.2]){add(new Co(earWidth,earHeight,5),c,x,1.31,0,[0,0,x<0?.18:-.18]);add(new Sp(earWidth*.42,7,5),a,x,1.34,.058,[.45,.7,.6])}
    for(const x of[-.115,.115]){add(new Sp(.043,7,5),0x493d43,x,1.02,.29);add(new Sp(.022,6,4),0xffffff,x-.012,1.04,.31)}
    add(new Sp(.07,7,5),d.shape==='fox'?0xffe6c6:a,0,.91,.32,[1,.65,.7]);
    if(d.shape==='fox')add(new Sp(.35,9,7),c,.43,.48,-.05,[.65,.7,1.25],[0,0,.5]);
    else add(new Sp(.21,8,6),a,0,.48,.29,[1,.3,.75]);
   }
   add(new To(.12,.045,5,9),d.accent,0,1.42,.02);
  }else if(d.shape==='mushroom'){
   add(new Cy(.19,.28,.62,8),0xf3e7d0,0,.47,0);
   add(new Sp(.57,10,8),c,0,.91,0,[1,.55,1]);
   for(const[x,z]of[[-.25,.04],[.19,.12],[.02,-.24]])add(new Sp(.09,7,5),a,x,1.15,z);
   add(new Bx(.2,.3,.08),0x8c644b,0,.37,.28);add(new Cy(.035,.035,.16,6),d.accent,.06,.36,.33);
   add(new Bx(.16,.14,.035),0x95c6d1,-.18,.92,.34);
  }else if(d.shape==='kiosk'){
   add(new Bx(.84,.52,.52),c,0,.48,0);add(new Bx(1.04,.12,.72),a,0,.81,0);
   add(new Bx(1.1,.2,.78),d.accent,0,1.13,0);add(new Co(.6,.15,4),d.accent,0,1.23,0);
   for(const x of[-.3,0,.3])add(new Bx(.12,.2,.04),0xfff3d9,x,1.13,.4);
   add(new Bx(.45,.24,.055),0xfff3d9,0,1.49,.18);
   for(const x of[-.28,.28])add(new To(.12,.045,8,12),0x725964,x,.18,.38,[Math.PI/2,0,0]);
  }else if(d.shape==='music'){
   add(new Bx(.7,.44,.42),c,0,.42,0);
   add(new Bx(.73,.18,.45),a,0,.73,0);
   for(let i=0;i<7;i++)add(new Bx(.07,.16,.23),i%2?0x6a5265:0xfff4d8,-.29+i*.097,.9,.03);
   add(new Cy(.045,.045,.48,7),d.accent,-.28,1.13,0);
   add(new Cy(.045,.045,.48,7),d.accent,.28,1.13,0);
   add(new Sp(.26,8,6),d.accent,0,1.37,0);
   add(new To(.17,.05,7,12),d.accent,.22,1.6,0,[0,0,-.35]);
   add(new Bx(.48,.08,.28),0x9b704d,0,.18,-.34);
  }else if(d.shape==='fountain'){
   add(new Cy(.47,.55,.2,12),c,0,.24,0);add(new Cy(.4,.4,.09,12),0x7dc7d6,0,.38,0);
   add(new Cy(.12,.17,.48,8),a,0,.62,0);add(new Sp(.16,8,6),0xa4e3ed,0,.93,0);
   add(new Sp(.07,7,5),d.accent,-.25,.36,.25);add(new Sp(.07,7,5),d.accent,.25,.36,-.2);
   for(const x of[-.35,.35])add(new Sp(.1,7,5),d.accent,x,.38,0);
  }else if(d.shape==='mailbox'){
   add(new Cy(.065,.09,1.12,7),0x8a674e,0,.56,0);
   add(new Bx(.58,.42,.42),c,0,1.24,0);add(new Sp(.3,8,6),c,0,1.45,0,[1,.48,1]);
   add(new Bx(.34,.1,.035),a,0,1.15,.22);add(new Bx(.045,.35,.045),d.accent,.34,1.42,0);
   add(new Sp(.08,7,5),d.accent,.34,1.6,0,[1,.45,1]);
   add(new Bx(.19,.14,.035),0x493d43,0,1.16,.24);
  }else{
   add(new Cy(.07,.1,1.22,8),c,0,.61,0);add(new Bx(.42,.52,.42),a,0,1.41,0);
   add(new Co(.38,.34,5),d.accent,0,1.83,0);
   add(new Bx(.05,.4,.05),d.accent,0,1.41,.23);
   for(const x of[-.31,.31])add(new Cy(.035,.035,.86,6),a,x,1.4,0);
   add(new Sp(.12,8,6),d.accent,0,1.44,.26);
  }
 }else if(d.form==='gardenExtra'){
  add(new Bx(.94,.1,.86),0xb9a58d,0,.06,0);
  add(new Bx(.78,.035,.68),a,0,.13,0);
  if(d.shape==='flowerbed'){
   add(new Bx(.72,.12,.58),c,0,.23,0);
   for(const[x,z,col]of[[-.22,-.12,a],[0,.13,c],[.22,-.12,a]]){add(new Cy(.018,.024,.36,5),0x6da868,x,.46,z);add(new Sp(.13,8,6),col,x,.66,z);add(new Sp(.055,7,5),0xffe28a,x,.67,z+.04)}
  }else if(d.shape==='stones'){
   for(const[x,z,s]of[[-.25,-.16,.22],[.03,-.2,.27],[.26,.12,.2],[-.18,.21,.18]])add(new Sp(s,7,5),x<0?c:a,x,.22,z,[1,.5,.8])
  }else if(d.shape==='crystal'){
   add(new Co(.2,.62,6),c,-.18,.42,0,[0,0,-.15]);add(new Co(.24,.84,6),a,.12,.53,.04,[0,0,.14]);add(new Co(.14,.46,5),c,.32,.34,-.08)
  }else if(d.shape==='grass'){
   for(let i=0;i<7;i++){const x=(i%3-.9)*.22,z=(Math.floor(i/3)-1)*.18;add(new Co(.07,.38+(i%2)*.12,5),i%2?a:c,x,.36,z,[0,0,(i%3-1)*.18])}
   add(new Sp(.34,8,6),c,0,.18,0,[1,.18,1])
  }else if(d.shape==='stump'){
   add(new Cy(.3,.36,.38,9),c,0,.28,0);add(new Cy(.27,.29,.035,9),a,0,.49,0)
   for(const[x,z]of[[-.18,0],[.12,.1]]){add(new Cy(.018,.025,.22,5),0x6da868,x,.61,z);add(new Sp(.12,7,5),a,x,.72,z)}
  }else if(d.shape==='leaves'){
   for(let i=0;i<7;i++){const x=(i%3-.9)*.2,z=(Math.floor(i/3)-1)*.17;add(new Sp(.17,7,5),i%2?a:c,x,.19,z,[1,.4,.7],[0,i*.7,.4])}
   add(new Sp(.06,6,4),0xf3d276,.05,.29,.04)
  }else if(d.shape==='pond'){
   add(new Cy(.39,.46,.12,14),c,0,.18,0);add(new Cy(.32,.34,.045,14),0x76c4d2,0,.27,0)
   for(const[x,z]of[[-.2,-.12],[.18,.1]]){add(new Sp(.17,.035,7,5),0x72a876,x,.31,z,[1,.2,1]);add(new Sp(.085,7,5),a,x,.36,z)}
   add(new Sp(.1,7,5),a,0,.32,0)
  }else if(d.shape==='fountain'){
   add(new Cy(.4,.46,.17,12),c,0,.2,0);add(new Cy(.32,.32,.08,12),0x7dc7d6,0,.34,0);add(new Cy(.09,.12,.43,8),a,0,.57,0);add(new Sp(.11,7,5),0xb0e5e9,0,.85,0)
  }else if(d.shape==='bridge'){
   for(const x of[-.36,.36])add(new Bx(.1,.24,.1),c,x,.22,0)
   for(let i=0;i<5;i++)add(new Bx(.14,.07,.72),i%2?a:c,-.28+i*.14,.38,0)
   for(const x of[-.42,.42]){add(new Cy(.035,.045,.58,6),a,x,.56,0);add(new To(.42,.025,6,12,Math.PI),a,x,.82,0,[0,Math.PI/2,0])}
  }else if(d.shape==='arch'){
   for(const x of[-.34,.34]){add(new Cy(.07,.09,.75,7),c,x,.49,0);for(let i=0;i<3;i++)add(new Sp(.12,7,5),a,x+(x<0?.08:-.08),.62+i*.08,0)}
   add(new To(.34,.08,7,16,Math.PI),a,0,.88,0,[0,0,Math.PI])
  }else if(d.shape==='fence'){
   for(const z of[-.27,.27])add(new Bx(.84,.08,.08),c,0,.33,z)
   for(const x of[-.35,-.12,.12,.35])add(new Bx(.08,.55,.09),a,x,.38,0)
  }else if(d.shape==='planter'){
   add(new Bx(.58,.28,.48),c,0,.28,0);add(new Bx(.64,.07,.53),a,0,.45,0)
   for(const[x,z]of[[-.17,-.1],[.12,.08],[.02,-.16]]){add(new Cy(.022,.03,.43,5),0x67965f,x,.66,z);add(new Sp(.16,7,5),d.color||a,x,.9,z)}
  }else if(d.shape==='bonsai'||d.shape==='topiary'){
   add(new Cy(.32,.4,.22,10),c,0,.18,0);add(new Cy(.19,.28,.24,9),0x8c654a,0,.4,0)
   for(const[x,y,z,r]of[[-.22,.62,0,.28],[.1,.76,0,.32],[.27,.58,.02,.25],[0,.98,-.04,.22]])add(new Sp(r,8,6),x<0?c:a,x,y,z,[1,.75,.9])
   for(const[x,z]of[[-.24,.12],[.19,.12],[0,-.18]])add(new Sp(.06,7,5),0xf4cb70,x,.76,z)
  }else if(d.shape==='windmill'){
   add(new Cy(.04,.06,.65,6),c,0,.43,0)
   for(let i=0;i<4;i++){const t=i*Math.PI/2;add(new Bx(.08,.32,.05),i%2?a:c,Math.cos(t)*.18,.84+Math.sin(t)*.18,0,[0,0,-t])}
   add(new Sp(.1,7,5),0xffe28a,0,.84,.05)
  }else if(d.shape==='birdbath'||d.shape==='sundial'){
   add(new Cy(.1,.15,.46,8),c,0,.28,0);add(new Cy(.32,.4,.1,12),a,0,.55,0)
   if(d.shape==='birdbath')add(new Sp(.12,7,5),0x8dbd79,.1,.72,.03)
   else add(new Co(.13,.46,5),c,0,.83,0)
  }else if(d.shape==='nest'||d.shape==='basket'){
   add(new Cy(.32,.42,.3,9),c,0,.26,0);add(new To(.31,.07,8,14),a,0,.42,0)
   for(const[x,z]of[[-.15,0],[0,.08],[.15,-.04]])add(new Sp(.09,7,5),d.shape==='nest'?0xf0dda8:a,x,.46,z,[1,.7,.8])
  }else if(d.shape==='bughotel'){
   add(new Bx(.38,.62,.32),c,0,.44,0);add(new Co(.38,.22,5),a,0,.86,0)
   for(const[y,z]of[[.25,.17],[.43,.17],[.6,.17]])add(new Cy(.07,.075,.025,8),0x614d43,0,y,z,[1,1,1],[Math.PI/2,0,0])
   add(new To(.23,.035,6,14),a,0,.91,.01)
  }else if(d.shape==='watering'){
   add(new Sp(.29,8,6),c,-.05,.34,0,[1,.8,1]);add(new Cy(.07,.09,.44,7),a,.22,.52,0,[0,0,-.7])
   add(new To(.18,.04,7,14),c,-.05,.56,0,[Math.PI/2,0,0])
   add(new Cy(.04,.05,.24,7),a,.35,.56,0,[0,0,-Math.PI/2])
  }else if(d.shape==='cart'){
   add(new Bx(.48,.25,.4),c,0,.43,0);   for(const x of[-.29,.29])add(new To(.13,.035,6,12),a,x,.2,0)
   add(new Bx(.05,.46,.05),a,-.35,.4,0,[0,0,-.55])
   for(const[x,z]of[[-.14,0],[.12,.08],[0,-.12]]){add(new Cy(.02,.025,.28,5),0x699761,x,.69,z);add(new Sp(.1,7,5),d.accent,x,.84,z)}
  }else if(d.shape==='sign'){
   add(new Cy(.045,.065,.75,6),c,0,.39,0);add(new Bx(.55,.35,.07),a,0,.82,0)
   add(new To(.12,.03,6,10),d.accent,0,.84,.05);add(new Sp(.055,6,4),d.accent,.19,.82,.055)
  }else if(d.shape==='lantern'){
   add(new Cy(.055,.075,.6,6),c,0,.36,0);add(new Bx(.27,.34,.24),a,0,.78,0);add(new Sp(.13,7,5),d.accent,0,.8,.14)
   add(new Co(.24,.18,5),c,0,1.04,0)
  }else if(d.shape==='bench'){
   add(new Bx(.7,.12,.32),c,0,.39,0);add(new Bx(.7,.34,.08),a,0,.62,-.13)
   for(const x of[-.26,.26])add(new Bx(.07,.35,.07),c,x,.2,0)
  }
 }else if(type==='mushroom'){
  add(new Cy(.18,.27,.54,8),0xf1e3c9,0,.28,0);add(new Sp(.55,10,8),c,0,.66,0,[1,.48,1]);
  for(const[x,z]of[[-.22,0],[.18,.15],[0,-.24]])add(new Sp(.08,7,5),a,x,.87,z);
 }else{
  add(new Cy(.24,.3,.55,10),c,0,.28,0);add(new Sp(.45,10,8),a,0,.7,0);
 }
 return g}
function iColor(x){return x<0?0xf0ddaa:0xffe6a0}
export function makeDecor(type,id,decorColor){const base=DECOR[type];if(!base)throw new Error(`Decoração desconhecida: ${type}`);const d=decorColor!=null?{...base,...(base.form==='flower'?{petalColor:decorColor}:{color:decorColor})}:base,g=DM[type]?DM[type]():extraDecor(type,d);if(decorColor!=null&&DM[type])g.traverse(o=>{if(!o.isMesh||!o.material)return;const array=Array.isArray(o.material),materials=array?o.material:[o.material],tinted=materials.map(material=>{const copy=material.clone();if(copy.color)copy.color.lerp(new THREE.Color(decorColor),.45);return copy});o.material=array?tinted:tinted[0]});if(d.form==='floor')g.userData.floor=true;if(id)g.userData.ref={t:'decor',id};return g}
