import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { normalizeWheelDelta } from './camera.js';
export const W={night:0};
export const GRAD=(()=>{const t=new THREE.DataTexture(new Uint8Array([105,185,255]),3,1,THREE.RedFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.needsUpdate=true;return t})();
export const toonMat=(c,o={})=>new THREE.MeshToonMaterial({color:c,gradientMap:GRAD,...o});
const OUT=new THREE.MeshBasicMaterial({color:0x7a5a6e,side:THREE.BackSide});
export function mk(geo,color,x=0,y=0,z=0,o={}){const m=new THREE.Mesh(geo,toonMat(color));m.position.set(x,y,z);if(o.s)m.scale.set(...o.s);if(o.r)m.rotation.set(...o.r);m.castShadow=true;m.receiveShadow=true;
 if(!o.no){geo.computeBoundingSphere();const k=1+Math.min(.14,.045/Math.max(.15,geo.boundingSphere.radius));const ol=new THREE.Mesh(geo,OUT);ol.scale.setScalar(k);ol.raycast=()=>{};m.add(ol)}return m}
const glowMats=[];
export function glow(m){m.emissive=new THREE.Color(0xffd66b);m.emissiveIntensity=0;glowMats.push(m)}
export function tint(obj,ok){obj.traverse(o=>{if(o.isMesh&&o.material.isMeshToonMaterial){o.material.emissive=o.material.emissive||new THREE.Color();o.material.emissive.setHex(ok?0x33dd77:0xff3355);o.material.emissiveIntensity=.55}})}
// emoji sprites
const TX={};
export function sprite(e,s=1){if(!TX[e]){const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');x.font='72px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,48,52);TX[e]=new THREE.CanvasTexture(c);TX[e].colorSpace=THREE.SRGBColorSpace}
 const m=new THREE.Sprite(new THREE.SpriteMaterial({map:TX[e],transparent:true,depthTest:false}));m.scale.set(s,s,1);m.renderOrder=10;m.raycast=()=>{};return m}
const fx=[];
export function burst(pos,e='💖',n=4){if(W.reducedMotion)return;for(let i=0;i<n;i++){const s=sprite(e,.55);s.position.copy(pos).add(new THREE.Vector3((Math.random()-.5)*.8,Math.random()*.4,(Math.random()-.5)*.8));s.userData={vy:1+Math.random(),t:0};W.scene.add(s);fx.push(s)}}
// labels (DOM following 3D points)
const L=new Map(),seen=new Set(),v3=new THREE.Vector3();
export function label(key,pos,html,act){seen.add(key);let e=L.get(key);if(!e){e=document.createElement('div');e.className='lb';document.getElementById('labels').appendChild(e);L.set(key,e)}
 if(e._h!==html){e.innerHTML=html;e._h=html}if(act){e.dataset.a=act.a;e.dataset.id=act.id;e.classList.add('btn')}
 v3.copy(pos).project(W.cam);e.style.display=W.labelsVisible===false||v3.z>=1?'none':'';e.style.transform=`translate(-50%,-100%) translate(${(v3.x*.5+.5)*innerWidth}px,${(-v3.y*.5+.5)*innerHeight}px)`}
export function sweep(){for(const[k,e]of L)if(!seen.has(k)){e.remove();L.delete(k)}seen.clear()}
// picking
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
function aim(ev){const r=W.canvas.getBoundingClientRect();ndc.set((ev.clientX-r.left)/r.width*2-1,-((ev.clientY-r.top)/r.height)*2+1);ray.setFromCamera(ndc,W.cam)}
export function groundAt(ev){aim(ev);const p=new THREE.Vector3();return ray.ray.intersectPlane(plane,p)?p:null}
export function pickAt(ev,list){aim(ev);for(const h of ray.intersectObjects(list,true)){let o=h.object;while(o){if(o.userData.ref)return{ref:o.userData.ref,point:h.point};o=o.parent}}return null}
// init
const SKY={n:new THREE.Color(0x2a3270),d:new THREE.Color(0xbfe6ff),u:new THREE.Color(0xffc2d4)},sky=new THREE.Color();let hemi,sun,clouds=[],FL=[];
export function init(canvas){W.canvas=canvas;const r=new THREE.WebGLRenderer({canvas,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,1.75));r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xbfe6ff);scene.fog=new THREE.Fog(0xbfe6ff,130,270);
 const cam=new THREE.PerspectiveCamera(38,1,.5,600);cam.position.set(30,23,30);
 const ctl=new OrbitControls(cam,canvas);ctl.enableDamping=true;ctl.dampingFactor=.08;ctl.minDistance=14;ctl.maxDistance=135;ctl.minPolarAngle=.48;ctl.maxPolarAngle=1.38;ctl.enablePan=true;ctl.mouseButtons.LEFT=THREE.MOUSE.ROTATE;ctl.zoomSpeed=.45;ctl.target.set(0,0,1);
 canvas.addEventListener('wheel',(event)=>{
  const deltaY=normalizeWheelDelta(event.deltaY ?? event.deltaX ?? 0);
  if(deltaY===0)return;
  event.preventDefault();
  Object.defineProperty(event,'deltaY',{value:deltaY,configurable:true});
 },{passive:false});
 hemi=new THREE.HemisphereLight(0xffffff,0xc9e8b0,.9);scene.add(hemi);
 sun=new THREE.DirectionalLight(0xfff1d6,1.7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=sc.bottom=-64;sc.right=sc.top=64;sc.near=1;sc.far=180;sun.shadow.bias=-.0006;scene.add(sun,sun.target);
 Object.assign(W,{renderer:r,scene,cam,ctl});
 const rs=()=>{r.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};addEventListener('resize',rs);rs();island();return W}
export function setDay(ph){const e=Math.sin((ph-.25)*Math.PI*2),d=THREE.MathUtils.clamp(e*2.2+.4,0,1),u=THREE.MathUtils.clamp(1-Math.abs(e)*3,0,1);
 sky.copy(SKY.n).lerp(SKY.d,d).lerp(SKY.u,u*.55);W.scene.background.copy(sky);W.scene.fog.color.copy(sky);W.night=1-d;
 sun.intensity=.2+1.55*d;hemi.intensity=.4+.55*d;sun.color.setHex(0x9fb2ff).lerp(new THREE.Color(0xfff1d6),d);
 const a=(ph-.25)*Math.PI*2;sun.position.set(Math.cos(a)*16,10+10*Math.max(e,.15),9);sun.target.position.set(0,0,0);
 for(const m of glowMats)m.emissiveIntensity=W.night*1.1}
const INIT=[[-7,5,3.6,2.6],[-6,-5,2.8,2.8],[0,-6,2.8,2.8],[7,-5,3.4,2.8]];
function island(){const s=W.scene,g=new THREE.Mesh(new THREE.CylinderGeometry(56,53,2.4,10),[toonMat(0xe8cfa8),toonMat(0xb8e6a1),toonMat(0xe8cfa8)]);g.position.y=-1.2;g.receiveShadow=true;g.castShadow=true;s.add(g);
 const rock=new THREE.Mesh(new THREE.ConeGeometry(53,14,10),toonMat(0xd9b99b));rock.rotation.x=Math.PI;rock.position.y=-9.2;s.add(rock);
 const map=document.createElement('canvas');map.width=map.height=1536;const ctx=map.getContext('2d');
 ctx.fillStyle='#b8e6a1';ctx.fillRect(0,0,map.width,map.height);
 for(let i=0;i<6500;i++){const x=Math.random()*map.width,y=Math.random()*map.height,r=2+Math.random()*11;ctx.fillStyle=i%2?'rgba(234,247,190,.18)':'rgba(119,176,111,.12)';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
 const paths=[[[0,0],[0,-56]],[[0,0],[0,56]],[[0,0],[-56,0]],[[0,0],[56,0]]];
 const px=(x,z)=>[(x+56)/112*map.width,(56-z)/112*map.height];
 const trace=()=>{ctx.beginPath();for(const line of paths){const p=px(...line[0]);ctx.moveTo(p[0],p[1]);for(const q of line.slice(1)){const v=px(...q);ctx.lineTo(v[0],v[1])}}};
 ctx.lineCap='butt';ctx.lineJoin='miter';trace();ctx.strokeStyle='#888780';ctx.lineWidth=38;ctx.stroke();
 trace();ctx.strokeStyle='#c8c4ba';ctx.lineWidth=34;ctx.stroke();
 trace();ctx.strokeStyle='#a6a198';ctx.lineWidth=30;ctx.setLineDash([36,5]);ctx.stroke();ctx.setLineDash([]);
 const plaza=px(0,0);ctx.fillStyle='#c8c4ba';ctx.beginPath();ctx.arc(plaza[0],plaza[1],51,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#888780';ctx.lineWidth=3;ctx.stroke();
 const grass=new THREE.CanvasTexture(map);grass.colorSpace=THREE.SRGBColorSpace;grass.anisotropy=4;
 const ground=new THREE.Mesh(new THREE.CircleGeometry(55.8,96),new THREE.MeshToonMaterial({map:grass,gradientMap:GRAD}));
 ground.rotation.x=-Math.PI/2;ground.position.y=.018;ground.receiveShadow=true;s.add(ground);
 const tree=(x,z,k,c)=>{const t=new THREE.Group();t.add(mk(new THREE.CylinderGeometry(.18*k,.25*k,1.2*k,8),0xb98a68,0,.6*k,0));for(const[y,r]of[[1.6,.9],[2.3,.7],[2.85,.45]])t.add(mk(new THREE.SphereGeometry(r*k,12,10),c,0,y*k,0));t.position.set(x,0,z);s.add(t)};
 const tc=[0x9fd98c,0x8ccf9a,0xb5e6a0,0xffc2d4];for(let i=0;i<88;i++){const a=i/88*6.283+Math.random()*.2,r=50+Math.random()*3;tree(Math.cos(a)*r,Math.sin(a)*r,.9+Math.random()*.5,tc[i%4])}
 // flowers
 const nearPath=(x,z)=>paths.some(line=>line.slice(1).some((b,j)=>{const a=line[j],dx=b[0]-a[0],dz=b[1]-a[1],t=THREE.MathUtils.clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1),0,1);return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t)<1.5}));
 const n=2200,head=new THREE.InstancedMesh(new THREE.SphereGeometry(.16,8,6),toonMat(0xffffff),n),stem=new THREE.InstancedMesh(new THREE.CylinderGeometry(.025,.025,.3,5),toonMat(0x7ccf7c),n),m=new THREE.Matrix4(),c=new THREE.Color(),cols=[0xff9ec7,0xfff08a,0xffffff,0xb7d8ff,0xffc9a8];let i=0,tr=0;
 while(i<n&&tr++<50000){const a=Math.random()*6.283,r=Math.sqrt(Math.random())*52,x=Math.cos(a)*r,z=Math.sin(a)*r;
  if(INIT.some(q=>Math.abs(x-q[0])<q[2]+.8&&Math.abs(z-q[1])<q[3]+.8)||Math.hypot(x,z-2)<3.8||nearPath(x,z))continue;
  FL.push({x,z,i});m.makeTranslation(x,.32,z);head.setMatrixAt(i,m);head.setColorAt(i,c.setHex(cols[Math.random()*5|0]));m.makeTranslation(x,.15,z);stem.setMatrixAt(i,m);i++}
 W.fl={head,stem};s.add(head,stem);
 for(let k=0;k<10;k++){const cl=new THREE.Group();for(let j=0;j<3;j++){const b=new THREE.Mesh(new THREE.SphereGeometry(1.2+Math.random(),10,8),toonMat(0xffffff));b.position.set(j*1.4,Math.random()*.4,Math.random());cl.add(b)}cl.position.set(-100+k*22,18+Math.random()*8,-70+Math.random()*140);s.add(cl);clouds.push(cl)}}
export function clearFlowers(q){const m=new THREE.Matrix4().makeScale(0,0,0);let ch=false;for(const f of FL)if(!f.gone&&Math.abs(f.x-q.x)<q.hw+.5&&Math.abs(f.z-q.z)<q.hd+.5){f.gone=1;W.fl.head.setMatrixAt(f.i,m);W.fl.stem.setMatrixAt(f.i,m);ch=true}
 if(ch){W.fl.head.instanceMatrix.needsUpdate=true;W.fl.stem.instanceMatrix.needsUpdate=true}}
export function tickWorld(dt){for(const c of clouds){c.position.x+=dt*.6;if(c.position.x>115)c.position.x=-115}
 for(let i=fx.length-1;i>=0;i--){const s=fx[i];s.userData.t+=dt;s.position.y+=s.userData.vy*dt;s.material.opacity=Math.max(0,1-s.userData.t/1.2);if(s.userData.t>1.2){W.scene.remove(s);fx.splice(i,1)}}}
export function render(){W.ctl.update();W.renderer.render(W.scene,W.cam)}
