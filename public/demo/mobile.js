/* Touch controls and an immersive, orientation-aware game view. */
(() => {
  'use strict';
  window.MemoryMobile={create(api){
    const $=id=>document.getElementById(id),stage=$('stage'),stick=$('joystick'),knob=$('joystick-knob');
    const coarse=matchMedia('(pointer: coarse)'),portrait=matchMedia('(orientation: portrait)');
    const held=new Set(),drivePointers=new Map();
    let pointer=null,lastLane=-1,dismissed=false,fallback=false,lastScene='',lastShout='',wasPlaying=false,driveReady=false,laserStarted=false;
    const touch=()=>coarse.matches||navigator.maxTouchPoints>0;
    const nativeFull=()=>document.fullscreenElement===stage||document.webkitFullscreenElement===stage;
    const blocked=()=>api.blocked()||isBlocked();
    function isBlocked(){const s=api.state();return s.screen==='play'&&((touch()&&portrait.matches&&!dismissed)||(s.phase==='drive'&&!driveReady));}
    function release(){drivePointers.clear();$('drive-left').classList.remove('pressed');$('drive-right').classList.remove('pressed');for(const code of held)api.keys.delete(code);held.clear();pointer=null;lastLane=-1;knob.style.transform='translate(0px,0px)';stick.classList.remove('active');}
    function setHeld(list){for(const code of held)if(!list.includes(code)){api.keys.delete(code);held.delete(code);}for(const code of list){api.keys.add(code);held.add(code);}}
    function move(event){
      if(blocked()){release();return;}
      const r=stick.getBoundingClientRect(),limit=r.width*.32;
      let x=event.clientX-r.left-r.width/2,y=event.clientY-r.top-r.height/2;
      const length=Math.hypot(x,y);if(length>limit){x*=limit/length;y*=limit/length;}
      knob.style.transform=`translate(${x}px,${y}px)`;
      const lane=length<r.width*.12?-1:Math.abs(x)>Math.abs(y)?(x<0?0:3):(y<0?1:2),s=api.state();
      if(s.phase==='dance'){setHeld([]);if(lane!==-1&&lane!==lastLane)api.danceInput(lane);}
      else if(s.phase==='chase'){setHeld([]);if(lane===1&&lastLane!==1)api.jump();}
      else{const list=[];if(Math.abs(x)>r.width*.13)list.push(x<0?'ArrowLeft':'ArrowRight');if(Math.abs(y)>r.width*.13)list.push(y<0?'ArrowUp':'ArrowDown');setHeld(list);if(s.phase==='drive'&&list.length)s.drive.targetX=null;}
      lastLane=lane;
    }
    stick.addEventListener('pointerdown',event=>{if(pointer!==null||blocked())return;event.preventDefault();pointer=event.pointerId;stick.setPointerCapture(pointer);stick.classList.add('active');move(event);});
    stick.addEventListener('pointermove',event=>{if(event.pointerId===pointer){event.preventDefault();move(event);}});
    for(const name of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(name,event=>{if(event.pointerId===pointer)release();});
    stick.addEventListener('contextmenu',event=>event.preventDefault());
    function syncDrive(){
      const directions=new Set(drivePointers.values());
      setHeld(directions.size===1?[directions.has('left')?'ArrowLeft':'ArrowRight']:[]);
      $('drive-left').classList.toggle('pressed',directions.has('left'));
      $('drive-right').classList.toggle('pressed',directions.has('right'));
    }
    for(const side of ['left','right']){
      const button=$('drive-'+side);
      button.addEventListener('pointerdown',event=>{
        if(blocked()||api.state().phase!=='drive')return;
        event.preventDefault();button.setPointerCapture(event.pointerId);
        api.state().drive.targetX=null;drivePointers.set(event.pointerId,side);syncDrive();
      });
      for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,event=>{
        if(drivePointers.delete(event.pointerId))syncDrive();
      });
      button.addEventListener('keydown',event=>{
        if(!['Space','Enter'].includes(event.code)||blocked()||api.state().phase!=='drive')return;
        event.preventDefault();drivePointers.set('keyboard-'+side,side);syncDrive();
      });
      button.addEventListener('keyup',event=>{
        if(['Space','Enter'].includes(event.code)&&drivePointers.delete('keyboard-'+side))syncDrive();
      });
      button.addEventListener('blur',()=>{if(drivePointers.delete('keyboard-'+side))syncDrive();});
      button.addEventListener('contextmenu',event=>event.preventDefault());
    }
    $('mobile-action').addEventListener('pointerdown',event=>{event.preventDefault();if(blocked())return;if(api.state().phase==='chase')api.jump();else api.interact();});
    $('mobile-action').addEventListener('click',event=>{if(event.detail===0&&!blocked()){if(api.state().phase==='chase')api.jump();else api.interact();}});
    $('drive-start').onclick=()=>{if(api.blocked()||(touch()&&portrait.matches&&!dismissed))return;driveReady=true;release();sync();$('game').focus({preventScroll:true});};
    $('game').addEventListener('pointerdown',()=>{if(api.state().phase==='laser'&&!blocked()){laserStarted=true;sync();}});
    $('game').addEventListener('pointermove',event=>{if(api.state().phase==='laser'&&!blocked()&&(event.pointerType==='mouse'||event.buttons)){laserStarted=true;sync();}});
    $('game-pause').onclick=()=>api.pause(!api.state().paused);
    $('game-sound').onclick=()=>api.audio.toggle(!api.audio.on);
    function sync(){
      const s=api.state(),playing=s.screen==='play',isTouch=touch();
      if(lastScene!==s.phase){driveReady=false;laserStarted=false;}
      if(s.phase==='laser'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyW','KeyA','KeyS','KeyD'].some(key=>api.keys.has(key)))laserStarted=true;
      // Start phones in the page-filling fallback, including Safari without element fullscreen.
      if(playing&&!wasPlaying&&isTouch){fallback=true;document.body.classList.add('immersive');}
      wasPlaying=playing;
      const full=nativeFull()||fallback;
      document.body.classList.toggle('playing',playing);document.body.classList.toggle('touch-game',isTouch);
      $('rotate-hint').classList.toggle('hidden',!(playing&&isTouch&&portrait.matches&&!dismissed));
      $('fullscreen-nudge').classList.toggle('hidden',!playing||!isTouch||full||portrait.matches||blocked());
      $('game-tools').classList.toggle('hidden',!playing||!full);
      const driving=playing&&s.phase==='drive'&&!api.blocked()&&!(isTouch&&portrait.matches&&!dismissed);
      $('drive-start').classList.toggle('hidden',!driving||driveReady);
      $('drive-controls').classList.toggle('instructing',!driveReady);
      $('laser-hint').classList.toggle('hidden',!playing||s.phase!=='laser'||blocked()||laserStarted);
      stick.classList.toggle('hidden',['chase','laser'].includes(s.phase));
      $('joystick-label').classList.toggle('hidden',['chase','laser'].includes(s.phase));
      $('drive-controls').classList.toggle('hidden',!driving);
      const usable=playing&&isTouch&&!blocked()&&!s.afterWalk&&['club','home','home-grown','present','laptop','chase'].includes(s.phase);
      $('mobile-pad').classList.toggle('hidden',!usable);
      $('mobile-action').classList.toggle('hidden',!usable||!['chase','club','home','home-grown','present','laptop'].includes(s.phase));
      $('mobile-action').textContent=s.phase==='chase'?'↑ SPRINGEN':'AKTION';
      $('mobile-action').setAttribute('aria-label',s.phase==='chase'?'Springen':'Interagieren');
      $('joystick-label').textContent=s.phase==='dance'?'PFEIL TREFFEN':s.phase==='chase'?'↑ SPRINGEN':s.phase==='laser'?'LICHTPUNKT':'BEWEGEN';
      if((!usable&&!driving)||lastScene!==s.phase)release();lastScene=s.phase;
      const note=s.phase==='dance'&&s.dance?Math.floor(s.dance.clock/1.15):-1;
      stick.dataset.lane=note<0?'':String([0,3,1,2,0,3,2,1,0,0,3,1,2,3,0,2,1,3,2,0,1,1,3,0][note%24]);
      $('game-sound').textContent=api.audio.on?'♫':'♪';$('game-sound').setAttribute('aria-pressed',String(api.audio.on));
      if((s.paused||!api.audio.on)&&window.speechSynthesis?.speaking)window.speechSynthesis.cancel();
      // Use a device-local German voice when available; captions always remain visible.
      const shout=playing&&s.phase==='club-incident'&&s.incident?.shout?'club':playing&&s.phase==='chase'&&s.chase?.distance>120&&s.chase.distance<300?'chase-'+s.chase.attempt:'';
      if(shout&&shout!==lastShout&&!blocked()){lastShout=shout;speak('Stehen bleiben! Halt, Polizei!');}
    }
    function speak(words){
      if(!api.audio.on||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;
      const voice=speechSynthesis.getVoices().find(v=>v.localService&&/^de[-_]/i.test(v.lang));if(!voice)return;
      const speech=new SpeechSynthesisUtterance(words);speech.voice=voice;speech.lang='de-DE';speech.rate=1.1;speech.pitch=.8;speech.volume=1;speechSynthesis.cancel();speechSynthesis.speak(speech);
    }
    async function enter(){
      if(api.state().screen!=='play')return;
      release();fallback=true;document.body.classList.add('immersive');
      const request=stage.requestFullscreen||stage.webkitRequestFullscreen;
      try{if(request)await request.call(stage,{navigationUI:'hide'});}catch{}
      if(nativeFull()){
        fallback=false;document.body.classList.remove('immersive');
        try{await screen.orientation?.lock?.('landscape');}catch{}
      }else{$('fullscreen-help').classList.remove('hidden');}
      sync();
    }
    async function exit(){
      release();fallback=false;document.body.classList.remove('immersive');$('fullscreen-help').classList.add('hidden');
      try{screen.orientation?.unlock?.();if(nativeFull())await(document.exitFullscreen?.()||document.webkitExitFullscreen?.());}catch{}
      sync();
    }
    async function toggleFullscreen(){if(nativeFull()||fallback)await exit();else await enter();}
    $('game-exit').onclick=exit;$('rotate-fullscreen').onclick=enter;$('fullscreen-nudge').onclick=enter;
    $('rotate-dismiss').onclick=()=>{dismissed=true;sync();};$('fullscreen-help-close').onclick=()=>$('fullscreen-help').classList.add('hidden');
    for(const name of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(name,()=>{release();if(!nativeFull()&&!fallback&&api.state().screen==='play')api.pause(true);sync();});
    window.addEventListener('blur',()=>{release();window.speechSynthesis?.cancel();});
    document.addEventListener('visibilitychange',()=>{release();if(document.hidden)window.speechSynthesis?.cancel();});
    window.addEventListener('resize',()=>{release();sync();});coarse.addEventListener?.('change',sync);portrait.addEventListener?.('change',()=>{dismissed=false;release();sync();});
    sync();return {sync,isBlocked,exit,toggleFullscreen};
  }};
})();
