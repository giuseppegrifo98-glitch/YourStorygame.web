import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const elements=new Map(),windowEvents={},documentEvents={};
function element(id){if(elements.has(id))return elements.get(id);const classes=new Set(),events={};const e={style:{},dataset:{},events,textContent:'',classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle(x,on){if(on)classes.add(x);else classes.delete(x);}},setAttribute(){},setPointerCapture(){},getBoundingClientRect:()=>({left:0,top:0,width:138,height:138}),addEventListener(n,fn){(events[n]??=[]).push(fn);},fire(n,id=1){for(const fn of events[n]||[])fn({pointerId:id,preventDefault(){},clientX:130,clientY:69});}};elements.set(id,e);return e;}
const portrait={matches:false,addEventListener(n,fn){this.change=fn;}},coarse={matches:true,addEventListener(){}};
const sandbox={window:{addEventListener(n,fn){windowEvents[n]=fn;}},document:{getElementById:element,body:element('body'),addEventListener(n,fn){documentEvents[n]=fn;}},matchMedia:q=>q.includes('portrait')?portrait:coarse,navigator:{maxTouchPoints:2},screen:{},console};
vm.runInNewContext(readFileSync(new URL('../public/demo/arcade.js',import.meta.url),'utf8'),sandbox);
vm.runInNewContext(readFileSync(new URL('../public/demo/mobile.js',import.meta.url),'utf8'),sandbox);
const arcade=sandbox.window.MemoryArcade,state={screen:'play',phase:'drive',drive:arcade.createDrive(),paused:false},keys=new Set();
const mobile=sandbox.window.MemoryMobile.create({state:()=>state,keys,blocked:()=>state.paused,audio:{on:false},pause(){},interact(){},jump(){},danceInput(){}});
const checks=[];function check(name,fn){fn();checks.push(name);}
check('Phones start in a page-filling stage with visible pause and exit',()=>{assert(element('body').classList.contains('immersive'));assert(!element('game-tools').classList.contains('hidden'));});
check('Driving has no joystick and uses both halves',()=>{assert(element('mobile-pad').classList.contains('hidden'));assert(!element('drive-controls').classList.contains('hidden'));});
check('Hold survives frame synchronization and release clears steering',()=>{element('drive-right').fire('pointerdown');mobile.sync();assert(keys.has('ArrowRight'));element('drive-right').fire('pointerup');assert.equal(keys.size,0);});
check('Two thumbs neutralize; releasing one restores the remaining direction',()=>{element('drive-left').fire('pointerdown',1);element('drive-right').fire('pointerdown',2);assert.equal(keys.size,0);element('drive-right').fire('pointerup',2);assert(keys.has('ArrowLeft'));element('drive-left').fire('pointerup',1);assert.equal(keys.size,0);});
for(const event of ['pointercancel','lostpointercapture'])check(event+' releases steering',()=>{element('drive-left').fire('pointerdown');element('drive-left').fire(event);assert.equal(keys.size,0);});
check('Pause clears held input; resume never continues steering',()=>{element('drive-left').fire('pointerdown');state.paused=true;mobile.sync();assert.equal(keys.size,0);state.paused=false;mobile.sync();assert.equal(keys.size,0);});
check('Rotation and app switching release input',()=>{element('drive-left').fire('pointerdown');windowEvents.resize();assert.equal(keys.size,0);element('drive-right').fire('pointerdown');windowEvents.blur();assert.equal(keys.size,0);portrait.matches=true;portrait.change();assert(mobile.isBlocked());assert(element('drive-controls').classList.contains('hidden'));portrait.matches=false;portrait.change();});
check('Dance only shows arrow controls, never joystick',()=>{state.phase='dance';mobile.sync();assert(element('mobile-pad').classList.contains('hidden'));assert(element('drive-controls').classList.contains('hidden'));});
check('Releasing steering keeps x constant while forward travel continues at 15/30/60/144 FPS',()=>{for(const fps of [15,30,60,144]){const d=arcade.createDrive();d.countdown=0;d.traffic=[];for(let i=0;i<fps*.1;i++)arcade.updateDrive(d,1/fps,{steer:1});const x=d.x,z=d.distance;for(let i=0;i<fps;i++)arcade.updateDrive(d,1/fps,{});assert(Math.abs(d.x-x)<.00001);assert(d.distance>z);}});
console.log(JSON.stringify({passed:checks.length,checks},null,2));

