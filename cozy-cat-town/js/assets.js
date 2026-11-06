import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {GRAD,toonMat} from './world.js';
// h = altura alvo (unidades do mundo); w = largura alvo (para o trio deitado); ry = giro para ajustar para onde o modelo "olha"
const DEF={banana:{f:'cute_cat_in_cute_banana.glb',h:1.5,ry:0},persian:{f:'sylvanian_persian_cat_baby.glb',h:1.5,ry:0},
 frog:{f:'cute_christmas_frog.glb',h:1.3,ry:0},duck:{f:'strawhat_duck.glb',h:1.3,ry:0},money:{f:'cat_money_200_dollars.glb',w:1.4,ry:0}};
const cache={};
export async function loadAll(cb){const L=new GLTFLoader();let n=0,tot=Object.keys(DEF).length;
 await Promise.all(Object.entries(DEF).map(([k,d])=>new Promise(res=>L.load('assets/models/'+d.f,g=>{cache[k]=g.scene;cb&&cb(++n,tot);res()},undefined,e=>{console.warn('Falha ao carregar',d.f,e);cb&&cb(++n,tot);res()}))))}
function toon(root,tint){const tc=tint!=null?new THREE.Color(tint):null;
 root.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.frustumCulled=false;o.raycast=()=>{};
  const conv=m=>{const t=new THREE.MeshToonMaterial({gradientMap:GRAD,map:m.map||null,color:m.color?m.color.clone():new THREE.Color(0xffffff),transparent:m.transparent,opacity:m.opacity,alphaTest:m.alphaTest,side:m.side,vertexColors:m.vertexColors});
   if(m.map)m.map.anisotropy=4;if(tc)t.color.multiply(tc);return t};
  o.material=Array.isArray(o.material)?o.material.map(conv):conv(o.material)})}
function wbox(root){root.updateMatrixWorld(true);const b=new THREE.Box3(),v=new THREE.Vector3();
 try{root.traverse(o=>{if(!o.isMesh)return;if(o.isSkinnedMesh&&o.getVertexPosition){o.skeleton.update();const p=o.geometry.attributes.position,st=Math.max(1,p.count/5000|0);for(let i=0;i<p.count;i+=st){o.getVertexPosition(i,v);v.applyMatrix4(o.matrixWorld);b.expandByPoint(v)}}else b.union(new THREE.Box3().setFromObject(o))})}catch(e){b.setFromObject(root)}
 if(b.isEmpty()||!isFinite(b.min.x))b.setFromObject(root);return b}
function fallback(key,tint){const g=new THREE.Group(),c=tint??({frog:0x9be37f,duck:0xffe27a,money:0xa8e6a0}[key]||0xffe2c8);
 const a=(geo,x,y,z,s)=>{const m=new THREE.Mesh(geo,toonMat(c));m.position.set(x,y,z);if(s)m.scale.set(...s);m.castShadow=true;g.add(m);return m};
 a(new THREE.SphereGeometry(.5,16,12),0,.5,0,[1,.9,1]);a(new THREE.SphereGeometry(.4,16,12),0,1.1,.1);a(new THREE.ConeGeometry(.14,.3,4),-.25,1.45,.1);a(new THREE.ConeGeometry(.14,.3,4),.25,1.45,.1);
 const e=toonMat(0x4a3a4a);for(const x of[-.14,.14]){const m=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),e);m.position.set(x,1.12,.46);g.add(m)}return g}
export function actor(key,{tint=null,h}={}){const d=DEF[key],wrap=new THREE.Group(),root=new THREE.Group();let model;
 if(cache[key]){model=clone(cache[key]);toon(model,tint)}else model=fallback(key,tint);
 model.rotation.y=d.ry||0;root.add(model);const sz=wbox(root).getSize(new THREE.Vector3());
 const s=d.w&&!h?d.w/Math.max(sz.x,sz.z,1e-4):(h||d.h)/Math.max(sz.y,1e-4);model.scale.multiplyScalar(s);
 const b=wbox(root),c=b.getCenter(new THREE.Vector3());model.position.set(-c.x,-b.min.y,-c.z);wrap.add(root);return wrap}
