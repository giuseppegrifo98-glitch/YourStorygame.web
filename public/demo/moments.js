/* Story moments and Pablo's laser game. Pure state logic, no browser or saves. */
(() => {
  'use strict';
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const FLOOR={left:145,right:1135,top:463,bottom:642};
  const TREAT_POSITIONS=[[230,492],[425,618],[610,476],[815,618],[1057,487],
    [1090,624],[903,513],[705,565],[503,526],[251,623]];
  function createPablo(){
    return {cat:{x:390,y:579,face:1,moving:false},laser:{x:520,y:570,active:false},
      treats:TREAT_POSITIONS.map(([x,y],id)=>({id,x,y,collected:false})),
      collected:0,elapsed:0,eatPause:0,status:'playing'};
  }
  function pointLaser(game,x,y){
    if(game.status!=='playing'||!Number.isFinite(x)||!Number.isFinite(y))return;
    game.laser.x=clamp(x,FLOOR.left,FLOOR.right);
    game.laser.y=clamp(y,FLOOR.top,FLOOR.bottom);
    game.laser.active=true;
  }
  function updatePablo(game,seconds,input={}){
    const eaten=[];
    let left=Math.max(0,seconds);
    while(left>.000001&&game.status==='playing'){
      const dt=Math.min(left,1/120);left-=dt;game.elapsed+=dt;
      const dx=input.x||0,dy=input.y||0;
      if(dx||dy){const n=Math.hypot(dx,dy);pointLaser(game,game.laser.x+dx/n*330*dt,game.laser.y+dy/n*330*dt);}
      game.cat.moving=false;
      if(game.eatPause>0){game.eatPause=Math.max(0,game.eatPause-dt);continue;}
      if(!game.laser.active)continue;
      const vx=game.laser.x-game.cat.x,vy=game.laser.y-game.cat.y,distance=Math.hypot(vx,vy);
      if(distance>7){
        const step=Math.min(distance,Math.max(95,Math.min(238,distance*3))*dt);
        game.cat.x+=vx/distance*step;game.cat.y+=vy/distance*step;
        if(Math.abs(vx)>1)game.cat.face=vx>=0?1:-1;
        game.cat.moving=true;
      }
      for(const treat of game.treats){
        if(treat.collected||Math.hypot(treat.x-game.cat.x,treat.y-game.cat.y)>21)continue;
        treat.collected=true;game.collected++;game.eatPause=.28;game.cat.moving=false;eaten.push(treat.id);
        if(game.collected===10){game.status='finished';game.laser.active=false;}
        break;
      }
    }
    return eaten;
  }
  function incidentFrame(time){
    const t=Math.max(0,time),throwTimes=[1.25,2.48,3.55];
    const shots=throwTimes.map((start,i)=>{
      const p=clamp((t-start)/.76,0,1),targetX=[677,802,712][i],targetY=[564,551,587][i];
      return {id:i,start,active:t>=start&&t<start+.76,broken:t>=start+.76,
        age:t-start-.76,x:269+(targetX-269)*p,y:359+(targetY-359)*p-Math.sin(p*Math.PI)*112,
        targetX,targetY,rotation:p*7+i};
    });
    const charge=clamp((t-4.55)/.95,0,1),fall=clamp((t-5.5)/.65,0,1),exiting=t>=12.2;
    const heroX=exiting?418+clamp((t-12.2)/3.8,0,1)*1150:650-charge*232;
    const guards=Array.from({length:6},(_,i)=>{const p=clamp((t-6.55-i*.19)/1.8,0,1);return {id:i,visible:p>0,x:(i%2?-150:1420)+((i%2?230+i*47:610+i*30)-(i%2?-150:1420))*p,y:510+(i%3)*35,walking:p<1};});
    const police=Array.from({length:7},(_,i)=>{const p=clamp((t-9.3-i*.16)/1.65,0,1);return {id:i,visible:p>0,x:1380+(745+i*67-1380)*p,y:464+(i%3)*32};});
    const pursuers=Array.from({length:3},(_,i)=>({id:i,x:heroX-155-i*99,y:563-i*14}));
    return {time:t,attackerX:-95+Math.min(1,t/.95)*414-fall*52,attackerFall:fall,
      heroX,heroPose:t<3.08?'idle':exiting||t>=4.55&&t<5.5?'run':'angry',heroFace:exiting?1:-1,batonVisible:t>=3.08,
      throwWindup:throwTimes.some(start=>t>start-.36&&t<start+.12),
      guards,police,pursuers:exiting?pursuers:[],impact:t>=5.5&&t<5.76,
      shots,shake:shots.reduce((sum,p)=>sum+(p.age>=0&&p.age<.2?(1-p.age/.2)*4:0),0)+(t>=5.5&&t<5.8?(1-(t-5.5)/.3)*10:0),
      shout:exiting?'Stehen bleiben! Halt, Polizei!':'',
      caption:t<1.25?'Plötzlich steht da dieser Typ.':t<3.08?'Er wirft Gläser auf uns.':t<4.55?'Ich raste aus. Der Schlagstock ist in meiner Hand.':t<5.5?'Ich gehe auf den Gläserwerfer los.':t<6.55?'Er fällt zu Boden.':t<9.3?'Plötzlich kommen überall riesige Sicherheitsleute.':t<12.2?'Und dann auch noch jede Menge Polizei.':'Ich renne raus. Drei Polizisten direkt hinter mir.',
      done:t>=16.3};
  }
  window.MemoryMoments=Object.freeze({FLOOR,createPablo,pointLaser,updatePablo,incidentFrame});
})();
