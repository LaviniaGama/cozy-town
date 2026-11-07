import {DAY_SEC} from './data.js';
const KEY='cozycattown_v1';
export const bus=new EventTarget();
export const emit=(t,d)=>bus.dispatchEvent(new CustomEvent(t,{detail:d}));
export let S=null;let uid=1;
export const nid=()=>'i'+Date.now().toString(36)+(uid++);
export function fresh(){return{coins:300,xp:0,lv:1,inv:{wheat:3,carrot:2},seeds:{wheat:8,carrot:6},decoInv:{picnic:1,statue:1,parasol:1,rainbow:1,floor_cream:12},decoInvColors:{},
 buildingInv:{},storedBuildings:[],
 cats:{banana:{lv:1},pearl:{lv:1},berry:{lv:1}},
 buildings:[
  {id:'farm0',type:'farm',x:-7,z:5,r:0,lv:1,cat:null,plots:Array(6).fill(null)},
  {id:'kit0',type:'kitchen',x:-6,z:-5,r:0,lv:1,cat:null,cur:null,q:[]},
  {id:'res0',type:'restaurant',x:7,z:-5,r:0,lv:1,cat:null}],
 decor:[{id:'d1',type:'fountain',x:0,z:0,r:0}],
 stats:{harvest:0,cook:0,serve:0,place:0,pet:0,build:0,earn:0,wheatPlanted:0,wheatHarvest:0,breadMade:0,delivery:0,treeHarvest:0,seedBought:0,buildingMoves:0,decorMoves:0},claimed:{},passClaimed:{},story:0,delivery:{current:null,completed:0},daily:{last:'',streak:0},options:{freezeTime:false,clockSpeed:1,showLabels:true,reducedMotion:false,shadows:true,flowerColor:0xf48fb1,decorColors:{}},clock:.33,saved:Date.now()}}
export function hasSave(){try{return typeof localStorage!=='undefined'&&!!localStorage.getItem(KEY)}catch(e){console.error('Não foi possível acessar o salvamento local.',e);return false}}
export function load(){let o=null;try{const r=typeof localStorage!=='undefined'&&localStorage.getItem(KEY);if(r)o=JSON.parse(r)}catch(e){console.error('O salvamento local não pôde ser lido; uma nova cidade será iniciada.',e)}
 const base=fresh();S=o?Object.assign(base,o):base;S.inv=Object.assign({},base.inv,S.inv);S.seeds=Object.assign({},base.seeds,S.seeds);S.decoInv=Object.assign({},base.decoInv,S.decoInv);S.decoInvColors=Object.assign({},base.decoInvColors,S.decoInvColors);S.buildingInv=Object.assign({},base.buildingInv,S.buildingInv);S.storedBuildings=S.storedBuildings||[];S.cats=S.cats||base.cats;S.buildings=S.buildings||base.buildings;S.decor=S.decor||base.decor;S.options=Object.assign({},base.options,S.options);S.options.decorColors=Object.assign({},base.options.decorColors,S.options.decorColors);S.stats=Object.assign(base.stats,S.stats);S.delivery=Object.assign(base.delivery,S.delivery);S.daily=Object.assign(base.daily,S.daily);S.passClaimed=S.passClaimed||{};if(!Number.isInteger(S.story))S.story=0;delete S.cats.trio;for(const b of S.buildings)if(b.cat==='trio')b.cat=null;return S}
export function save(){if(!S)return;S.saved=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){console.error('Falha ao salvar a cidade no armazenamento local.',e);emit('saveError',e)}}
export function reset(){try{localStorage.removeItem(KEY)}catch(e){console.error('Não foi possível remover o salvamento local.',e)}S=fresh()}
export const hour=()=>S.clock*24;
