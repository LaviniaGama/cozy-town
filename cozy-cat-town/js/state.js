import {DAY_SEC} from './data.js';
const KEY='cozycattown_v1';
export const bus=new EventTarget();
export const emit=(t,d)=>bus.dispatchEvent(new CustomEvent(t,{detail:d}));
export let S=null;let uid=1;
export const nid=()=>'i'+Date.now().toString(36)+(uid++);
export function fresh(){return{coins:200,xp:0,lv:1,inv:{wheat:3,carrot:2},decoInv:{picnic:1,statue:1,parasol:1,rainbow:1},
 cats:{banana:{lv:1},pearl:{lv:1},berry:{lv:1},cloud:{lv:1}},
 buildings:[
  {id:'farm0',type:'farm',x:-7,z:5,r:0,lv:1,cat:null,plots:Array(6).fill(null)},
  {id:'kit0',type:'kitchen',x:-6,z:-5,r:0,lv:1,cat:null,cur:null,q:[]},
  {id:'res0',type:'restaurant',x:7,z:-5,r:0,lv:1,cat:null}],
 decor:[{id:'d1',type:'fountain',x:0,z:2,r:0},{id:'d2',type:'lamp',x:-3,z:0,r:0},{id:'d3',type:'bench',x:3,z:3.5,r:0},
  {id:'d4',type:'flowerpot',x:-2.5,z:-2,r:0},{id:'d5',type:'mailbox',x:5,z:1,r:0},{id:'d6',type:'sakura',x:9,z:3,r:0}],
 stats:{harvest:0,cook:0,serve:0,place:0,pet:0,build:0,earn:0,wheatPlanted:0,wheatHarvest:0,breadMade:0,delivery:0},claimed:{},passClaimed:{},story:0,delivery:{current:null,completed:0},daily:{last:'',streak:0},clock:.33,saved:Date.now()}}
export function load(){let o=null;try{const r=typeof localStorage!=='undefined'&&localStorage.getItem(KEY);if(r)o=JSON.parse(r)}catch(e){}
 S=o?Object.assign(fresh(),o):fresh();S.stats=Object.assign(fresh().stats,S.stats);S.delivery=Object.assign(fresh().delivery,S.delivery);S.daily=Object.assign(fresh().daily,S.daily);S.passClaimed=S.passClaimed||{};if(!Number.isInteger(S.story))S.story=0;delete S.cats.trio;for(const b of S.buildings)if(b.cat==='trio')b.cat=null;return S}
export function save(){if(!S)return;S.saved=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
export function reset(){try{localStorage.removeItem(KEY)}catch(e){}S=fresh()}
export const hour=()=>S.clock*24;
