/* A small, self-contained love story. No accounts, analytics or remote requests. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas=$('game'), ctx=canvas.getContext('2d'), coverCtx=$('cover-canvas').getContext('2d');
  const W=1280,H=720,SAVE_KEY='luana-memory-v1', arcade=window.MemoryArcade,moments=window.MemoryMoments;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)), lerp=(a,b,t)=>a+(b-a)*t;
  const chapters=[
    {title:'Eine ganze Tanzfläche.',subtitle:'Die Nacht, in der alles anfing.',short:'Der erste Tanz',tag:'DAMALS · IN DER DISCO',intro:'Pere, ein Abend in der Disco – und dann sehe ich Maria. Was ich noch nicht weiß: Sie ist heute nicht allein.'},
    {title:'Nur du, ich und der Bravo.',subtitle:'Am nächsten Tag.',short:'Das erste Date',tag:'AM NÄCHSTEN TAG',intro:'Manchmal braucht ein erstes Date kein großes Programm. Ein Fiat Bravo, ein ruhiger Parkplatz und dich neben mir.'},
    {title:'Diese eine verrückte Nacht.',subtitle:'Manche Geschichten haben Kratzer.',short:'Die chaotische Nacht',tag:'EIN SPÄTERER DISCOBESUCH',intro:'Nur Lana und ich, mitten in einem vollen Club. Um uns herum lauter fremde Leute. Dann zerbrechen Gläser, und alles geht plötzlich viel zu schnell.'},
    {title:'Ein kleines Stück Zuhause.',subtitle:'Und plötzlich waren wir zu dritt.',short:'Unser Pablo',tag:'UNSERE GEMEINSAME ZEIT',intro:'Nach all dem Lärm kommen die leisen Momente. Und ein winziges graues Fellknäuel, das unser Zuhause für immer verändert.'},
    {title:'Genau hier. Mit dir.',subtitle:'Die Gegenwart.',short:'Heute & für immer',tag:'HEUTE',intro:'Aus einer Begegnung wurde ein Wir. Pablo ist längst groß. Und heute sitzen wir zusammen vor diesem Bildschirm.'}
  ];
  let saved=null;try{saved=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(!saved||saved.version!==1||!Number.isInteger(saved.chapter)||saved.chapter<0||saved.chapter>4)saved=null;}catch{}
  let completed=!!saved?.completed;
  let s={screen:'cover',chapter:0,phase:'intro',time:0,phaseTime:0,player:{x:170,y:566,face:1},target:null,afterWalk:null,dialog:[],dialogIndex:0,dialogDone:null,paused:false,transitionDone:null,particles:[],toastTime:0,dance:null,drive:null,chase:null,homeStep:0,homeHearts:0,catX:520,catY:578,petTime:0,coverTime:0,elapsed:0};
  const keys=new Set();
  let mobile=null;
  const images={},spriteRects={me:[134,0,300,601],luana:[623,0,268,611],pere:[1116,0,275,611],maria:[185,610,224,414],kitten:[606,719,273,297],pablo:[1096,615,350,402]};
  let spriteReady=false,loaded=0;
  $('continue-game').disabled=true;
  // Pre-cropped transparent files avoid large runtime atlases and GPU source cropping.
  function atlasDraw(c,key,r,x,y,w,h){
    const name=(key==='luana'?'lana':key),portrait=r[3]<=184;
    const image=images[(portrait?'head-':'sprite-')+name];
    if(image?.complete&&image.naturalWidth)c.drawImage(image,x,y,w,h);
  }
  const spriteNames=['me','lana','pere','maria','kitten','pablo'];
  const headNames=['me','lana','pere','maria','kitten'];
  const actionNames=['angry','run','attacker'];
  const assets=[['club','assets/club.png'],['home','assets/home.png'],['sofa','assets/sofa-memory.png'],
    ...spriteNames.map(key=>['sprite-'+key,'assets/sprites/'+key+'.png']),
    ...headNames.map(key=>['head-'+key,'assets/sprites/head-'+key+'.png']),
    ...actionNames.map(key=>['action-'+key,'assets/sprites/'+key+'.png'])];
  assets.forEach(([name,url])=>{const im=new Image();images[name]=im;im.onload=()=>{loaded++;if(loaded===assets.length){spriteReady=true;$('continue-game').disabled=false;document.body.dataset.assetsReady='true';}};im.onerror=()=>{$('code-error').textContent='Ein Bild konnte nicht geladen werden. Bitte die Demo erneut öffnen.';};im.src=url+'?v=20260925-4';});

  const audio={context:null,master:null,on:false,next:0,step:0,
    init(){try{if(!this.context){this.context=new(window.AudioContext||window.webkitAudioContext)();this.master=this.context.createGain();this.master.gain.value=.18;this.master.connect(this.context.destination);}this.context.resume().catch(()=>{});}catch{}},
    toggle(on){this.init();this.on=!!(on&&this.context);on=this.on;this.next=this.context?.currentTime||0;$('sound').setAttribute('aria-pressed',String(on));$('sound-label').textContent=on?'Ton an':'Ton aus';$('sound-icon').textContent=on?'♫':'♪';if(this.master)this.master.gain.setTargetAtTime(on&&!s.paused?.18:0,this.context.currentTime,.15);},
    note(freq,time,duration=.3,gain=.1,type='sine'){if(!this.context||!this.on)return;const o=this.context.createOscillator(),g=this.context.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(gain,time+.015);g.gain.exponentialRampToValueAtTime(.001,time+duration);o.connect(g);g.connect(this.master);o.start(time);o.stop(time+duration+.04);},
    effect(kind){if(!this.on||!this.context)return;const t=this.context.currentTime;if(kind==='heart'){this.note(523,t,.25,.35);this.note(659,t+.1,.4,.25);}if(kind==='step')this.note(220,t,.09,.15,'triangle');if(kind==='bump')this.note(75,t,.18,.22,'triangle');if(kind==='win'){[261,329,392,523].forEach((n,i)=>this.note(n,t+i*.13,.65,.22));}},
    update(){if(!this.on||!this.context||s.paused||s.screen==='cover')return;const beat=(s.chapter===0||s.chapter===2)&&s.phase!=='finale';const stepDur=beat?.2727:.43;const now=this.context.currentTime;if(this.next<now-.5)this.next=now;while(this.next<now+.12){const roots=[220,174.61,261.63,196],root=roots[Math.floor(this.step/16)%4];const notes=[1,1.5,2,2.5,3,2.5,2,1.5];this.note(root*notes[this.step%8],this.next,beat?.2:.65,beat?.08:.12,'sine');if(beat&&this.step%2===0){this.note(55,this.next,.12,.32,'sine');this.note(root/2,this.next,.21,.13,'triangle');}this.next+=stepDur;this.step++;}}
  };
  function save(){const data={version:1,chapter:s.chapter,completed,elapsed:Math.round(s.elapsed)};try{localStorage.setItem(SAVE_KEY,JSON.stringify(data));$('saved-note').textContent='Fortschritt auf diesem Gerät gespeichert';}catch{$('saved-note').textContent='Speichern in diesem Browser nicht möglich';}saved=data;}
  function label(){const c=chapters[s.chapter];$('chapter-number').textContent=`KAPITEL ${String(s.chapter+1).padStart(2,'0')} / 05`;$('chapter-title').textContent=c.title;$('chapter-subtitle').textContent=c.subtitle;$('scene-badge').textContent=c.tag;document.querySelectorAll('.chapter-progress i').forEach((e,i)=>e.className=i<s.chapter?'done':i===s.chapter?'current':'');$('chapters-button').disabled=!completed;$('chapters-button').title=completed?'Ein Kapitel noch einmal erleben':'Nach dem ersten vollständigen Durchspielen verfügbar';}
  function objective(text){$('objective-text').textContent=text;}
  function toast(text){$('toast').textContent=text;$('toast').classList.remove('hidden');s.toastTime=2.1;}
  function hideInteractions(){['interact','rhythm-controls','dialogue','transition','pause-overlay','chapter-overlay','retry-overlay','pablo-score','finale'].forEach(id=>$(id).classList.add('hidden'));}
  function setPhase(phase){s.phase=phase;s.phaseTime=0;keys.clear();s.target=null;s.afterWalk=null;$('stage').dataset.scene=phase;canvas.setAttribute('aria-label',`${chapters[s.chapter].title} ${phase==='dance'?'Tanz-Challenge: Pfeiltasten im Takt.':phase==='drive'?'Fahre mit den Pfeiltasten zum ruhigen Parkplatz.':phase==='laser'?'Führe Pablo mit Maus, Berührung oder Pfeiltasten zu zehn Leckerlis.':'Pfeiltasten oder WASD zum Bewegen, E zum Interagieren.'}`);}
  function enterChapter(index,withIntro=true){index=clamp(index,0,4);if(!completed&&index>s.chapter+1)return;s.chapter=index;s.player={x:150,y:580,face:1};s.particles=[];s.dialog=[];s.paused=false;$('pause').textContent='Ⅱ Pause';s.time=0;s.dance=null;s.drive=null;s.chase=null;s.danceAttempt=0;s.driveAttempt=0;s.chaseAttempt=0;s.homeStep=0;s.homeHearts=0;s.petTime=0;s.catTarget=null;s.pabloGame=null;s.incident=null;hideInteractions();label();save();if(withIntro){setPhase('intro');showTransition(`KAPITEL ${String(index+1).padStart(2,'0')}`,chapters[index].title,chapters[index].intro,()=>startChapter(index),'Erinnerung betreten →');}else startChapter(index);}
  function showTransition(small,title,copy,done,button='Weiter in unserer Geschichte →'){$('transition-small').textContent=small;$('transition-title').textContent=title;$('transition-copy').textContent=copy;$('transition-go').textContent=button;$('transition').classList.remove('hidden');$('interact').classList.add('hidden');s.transitionDone=done;$('transition-go').focus({preventScroll:true});}
  function startChapter(index){$('transition').classList.add('hidden');canvas.focus({preventScroll:true});if(index===0){setPhase('club');s.player.x=160;objective('Geh zu Maria. Sie ist nicht allein.');showDialog([{who:'Joe',text:'Eigentlich sollte es nur ein Abend mit Pere werden.'},{who:'Pere',text:'Da drüben ist doch Maria. Komm, wir sagen Hallo.'}],()=>setAction('Zu Maria gehen',()=>walkTo(750,580,meetMaria)));}if(index===1){setPhase('drive-intro');objective('Finde mit Lana einen ruhigen Parkplatz.');showDialog([{who:'Joe',text:'Am nächsten Tag. Du auf dem Beifahrersitz meines Fiat Bravo. Ein ziemlich gutes erstes Date, würde ich sagen.'},{who:'Lana',text:'Fahren wir noch ein Stück? Irgendwohin, wo es ruhig ist.'},{who:'Joe',text:'Halte links oder rechts im Spielbild gedrückt, um zu lenken. Lass los, um geradeaus weiterzufahren. Am Computer gehen auch ← und →; ↑ gibt Gas, ↓ bremst. Weiche dem Verkehr aus!'}],beginDrive);}if(index===2){setPhase('club-calm');objective('Nur wir zwei, mitten im vollen Club.');s.player.x=650;showDialog([{who:'Joe',text:'Diesmal sind nur wir zwei zusammen hier. Um uns herum ein voller Club, fremde Gesichter und laute Musik.'},{who:'Lana',text:'Komm, wir tanzen noch ein bisschen.'}],()=>setAction('Weiterfeiern',beginClubIncident));}if(index===3){setPhase('home');s.player.x=175;s.catX=660;s.catY=587;s.homeStep=0;objective('Lerne euer kleines Fellknäuel kennen.');showDialog([{who:'Joe',text:'Und dann kam jemand in unser Leben, der noch kleiner war als unsere Pläne.'},{who:'Lana',text:'Schau ihn dir an. Dieses Gesicht! Willkommen zu Hause, Pablo.'}],()=>setAction('Pablo begrüßen',()=>walkTo(s.catX-70,582,petKitten)));}if(index===4){setPhase('present');s.player.x=180;s.catX=480;s.catY=590;objective('Folge Pablo zum Laptop.');showDialog([{who:'Joe',text:'Die Nächte wurden Erinnerungen. Aus dem kleinen Fellknäuel wurde ein stattlicher Kater. Und aus uns wurde ein Zuhause.'},{who:'Joe',text:'Heute habe ich dir diesen QR-Code gegeben. Jetzt sitzen wir beide vor dem Laptop – genau wie gleich im Spiel.'}],()=>{setAction('Pablo folgen',()=>{s.catTarget={x:1160,y:495};walkTo(980,480,openLaptop);});});}}
  function showDialog(lines,done){s.dialog=lines;s.dialogIndex=0;s.dialogDone=done;s.target=null;s.afterWalk=null;$('interact').classList.add('hidden');$('rhythm-controls').classList.add('hidden');renderDialog();$('dialogue').classList.remove('hidden');$('next-dialogue').focus({preventScroll:true});}
  function renderDialog(){const line=s.dialog[s.dialogIndex];$('speaker').textContent=line.who;$('dialogue-text').textContent=line.text;$('next-dialogue').innerHTML='Weiter <span>↵</span>';const pc=$('portrait').getContext('2d');pc.clearRect(0,0,160,160);pc.fillStyle=line.who==='Lana'?'#c5d5c7':'#e2d4bb';pc.fillRect(0,0,160,160);const map={'Joe':'me','Lana':'luana','Pere':'pere','Maria':'maria','Pablo':'kitten'};if(spriteReady){const key=map[line.who]||'me';const head={me:[229,4,120,143],luana:[683,8,146,160],pere:[1190,0,141,166],maria:[205,610,172,156],kitten:[641,738,212,184]}[key];atlasDraw(pc,key,head,0,0,160,160);}}
  function nextDialog(){if(s.paused||!s.dialog.length)return;if(++s.dialogIndex<s.dialog.length){renderDialog();return;}const done=s.dialogDone;s.dialog=[];s.dialogDone=null;$('dialogue').classList.add('hidden');canvas.focus({preventScroll:true});done?.();}
  let currentAction=null;
  function setAction(text,action){currentAction=action;$('interact').querySelector('span').textContent=text;$('interact').classList.remove('hidden');}
  function interact(){if(s.paused||s.screen!=='play'||s.dialog.length||!$('transition').classList.contains('hidden'))return;if(s.phase.endsWith('-crash')){retryChallenge();return;}if(s.phase==='chase'){jump();return;}if(!$('interact').classList.contains('hidden')){const fn=currentAction;$('interact').classList.add('hidden');currentAction=null;fn?.();}}
  function walkTo(x,y,done){s.target={x,y};s.afterWalk=done;}
  function meetMaria(){showDialog([{who:'Maria',text:'Hey! Schön, euch zu sehen. Das ist meine Freundin Lana.'},{who:'Lana',text:'Hi! Freut mich.'},{who:'Joe',text:'Ich weiß nicht mehr jedes Wort von diesem Abend. Aber ich weiß noch, dass ich unbedingt mit dir tanzen wollte.'},{who:'Joe',text:'Lana, hast du Lust zu tanzen?'},{who:'Lana',text:'Na los. Zeig, was du kannst.'}],()=>{objective('Geht zusammen auf die Tanzfläche.');setAction('Auf die Tanzfläche',()=>walkTo(555,575,()=>showDialog([{who:'Joe',text:'Tippe auf den leuchtenden Pfeil unten im Bild. 12 richtige Schritte schaffen den Tanz. Ein falscher Druck? Du kannst sofort korrigieren. Nach drei gescheiterten Runden darfst du überspringen.'}],beginDance)));});}
  function beginDance(){setPhase('dance');$('retry-overlay').classList.add('hidden');s.player.x=540;s.dance={clock:0,hits:0,combo:0,lastHit:-1,attempt:++s.danceAttempt,feedback:'Tippe auf den leuchtenden Pfeil.',done:false};objective('12 leuchtende Pfeile treffen – tanzt gemeinsam!');$('rhythm-controls').classList.remove('hidden');canvas.focus({preventScroll:true});audio.effect('win');}
  const pattern=[0,3,1,2,0,3,2,1,0,0,3,1,2,3,0,2,1,3,2,0,1,1,3,0];
  function danceInput(lane){
    const d=s.dance;if(s.phase!=='dance'||!d||d.done||s.paused||s.dialog.length||mobile?.isBlocked())return;
    const note=Math.floor(d.clock/1.15),expected=pattern[note%pattern.length];
    if(d.lastHit===note)return;
    if(lane!==expected){d.combo=0;d.feedback='Der leuchtende Pfeil zählt. Gleich noch einmal!';return;}
    d.lastHit=note;d.hits++;d.combo++;d.feedback='Treffer! Warte auf den nächsten Pfeil.';
    particles(655,415,9,'heart');audio.effect('heart');
    if(d.hits>=12)finishDance();
  }
  function finishDance(){s.dance.done=true;$('rhythm-controls').classList.add('hidden');audio.effect('win');showDialog([{who:'Pere',text:'Okay, ihr habt jetzt wirklich die ganze Tanzfläche übernommen.'},{who:'Maria',text:'Die beiden hören heute nicht mehr auf, oder?'},{who:'Joe',text:'Wir haben Rambazamba getanzt. Für einen Moment war der ganze Raum nur für uns.'},{who:'Lana',text:'Das machen wir wieder.'}],()=>showTransition('ERINNERUNG 01 GESAMMELT','Ein Tanz. Und plötzlich wir.','So fing es an. Nicht mit einem perfekten Satz. Sondern damit, dass wir gemeinsam die ganze Tanzfläche eingenommen haben.',()=>enterChapter(1),'Zum ersten Date →'));}
  function beginDrive(){setPhase('drive');$('retry-overlay').classList.add('hidden');s.particles=[];s.drive=arcade.createDrive(++s.driveAttempt);objective('Weiche dem Verkehr aus. Ein Zusammenstoß = Neustart.');canvas.focus({preventScroll:true});}
  function roadCenter(z){return arcade.roadCenter(z);}
  function finishDrive(){s.drive.parked=true;setPhase('parking');objective('Ein ruhiger Ort. Nur ihr zwei.');showDialog([{who:'Lana',text:'Hier ist es schön. Bleiben wir noch ein bisschen?'},{who:'Joe',text:'Der Motor aus. Die Welt ein bisschen leiser. Und du neben mir.'}],()=>setAction('Den Moment genießen',()=>{setPhase('private-moment');objective('Manche Erinnerungen gehören nur uns.');audio.effect('heart');}));}
  function finishPrivate(){showDialog([{who:'Joe',text:'Sagen wir so: Der Fiat Bravo hat diesen Parkplatz nicht vergessen.'},{who:'Joe',text:'Und was wir beide nicht vergessen haben, braucht hier keine große Erklärung.'}],()=>showTransition('ERINNERUNG 02 GESAMMELT','Ein Parkplatz irgendwo.','Es war kein besonderer Ort. Er wurde einer, weil du dort warst.',()=>enterChapter(2),'Eine andere Nacht →'));}
  function beginClubIncident(){setPhase('club-incident');s.incident=moments.incidentFrame(0);objective('Plötzlich kippt die Stimmung.');canvas.focus({preventScroll:true});}
  function finishClubIncident(){beginChase();showDialog([{who:'Joe',text:'Draußen geht es weiter. Springe mit Leertaste oder ↑ über jedes Hindernis. Wenn du stolperst, beginnt nur die Flucht neu – nicht der Abend im Club.'}],()=>canvas.focus({preventScroll:true}));}
  function beginChase(){setPhase('chase');$('retry-overlay').classList.add('hidden');s.particles=[];s.chase=arcade.createChase(++s.chaseAttempt);objective('Über jedes Hindernis springen. Stolpern = Neustart.');s.player.x=345;canvas.focus({preventScroll:true});}
  function jump(){if(s.chase&&s.phase==='chase'&&!s.paused&&!s.dialog.length&&arcade.queueJump(s.chase))audio.effect('step');}
  function failChallenge(kind){
    const run=kind==='dance'?s.dance:kind==='drive'?s.drive:s.chase;
    setPhase(kind+'-crash');$('interact').classList.add('hidden');$('rhythm-controls').classList.add('hidden');
    $('toast').classList.add('hidden');s.toastTime=0;audio.effect('bump');
    if(kind!=='dance')particles(kind==='drive'?run.x:350,kind==='drive'?470:520,22,'spark');
    const copy={
      dance:['Noch ein gemeinsamer Tanz?','Tippe auf den leuchtenden Pfeil. Auch nach einem falschen Druck kannst du denselben Schritt noch treffen.'],
      drive:['Bravo. Noch ein Versuch.','Halte die linke oder rechte Bildhälfte zum Lenken. Loslassen beendet die seitliche Bewegung. Am Computer bremst ↓.'],
      chase:['Ein Schritt zu spät.','Spring etwas früher ab. Mit ↑ am Joystick oder der Sprungtaste geht es über das Hindernis.']
    }[kind];
    objective(kind==='dance'?'Noch ein Tanzschritt. Ihr schafft das.':kind==='drive'?'Zusammenstoß. Die Fahrt beginnt neu.':'Gestolpert. Zurück zum Clubausgang.');
    $('retry-title').textContent=copy[0];$('retry-copy').textContent=copy[1];
    const progress=kind==='dance'?run.hits+' / 12 SCHRITTE':Math.floor(run.distance/(kind==='drive'?arcade.DRIVE_LENGTH:arcade.CHASE_LENGTH)*100)+' % GESCHAFFT';
    $('retry-stats').textContent='VERSUCH '+run.attempt+' · '+progress;
    $('retry-skip').classList.toggle('hidden',run.attempt<3);
    $('retry-help').textContent=run.attempt<3?'Nach drei gescheiterten Versuchen kannst du diese Challenge überspringen.':'Noch einmal versuchen oder die Geschichte ohne diese Challenge fortsetzen.';
  }
  function retryChallenge(){if(s.paused||!s.phase.endsWith('-crash')||s.phaseTime<.45)return;if(s.chapter===0)beginDance();else if(s.chapter===1)beginDrive();else if(s.chapter===2)beginChase();}
  function skipChallenge(){
    if(s.paused||!s.phase.endsWith('-crash')||s.phaseTime<.45)return;
    const run=s.chapter===0?s.dance:s.chapter===1?s.drive:s.chase;if(!run||run.attempt<3)return;
    $('retry-overlay').classList.add('hidden');$('retry-skip').classList.add('hidden');s.particles=[];
    if(s.chapter===0){setPhase('dance');finishDance();}else if(s.chapter===1)finishDrive();else finishChase();
  }
  function drawCountdown(run,label){
    if(!run||run.countdown<=0)return;
    round(ctx,445,231,390,229,16,'#102c3bee','#d5bd8555');
    text(ctx,label,640,266,11,'#cfbc8e');
    text(ctx,String(Math.ceil(run.countdown)),640,378,102,'#f7e3b8','center','Georgia');
    text(ctx,'Gleich geht’s los …',640,417,16,'#c7d6c1');
  }
  function finishChase(){s.chase.done=true;setPhase('fall');objective('Die Nacht endet anders als geplant.');}
  function finishFall(){showDialog([{who:'Joe',text:'Dann der Sturz. Die Polizei holt mich ein. Die Nacht endet auf dem Boden.'},{who:'Joe',text:'Und am Ende: ein gebrochenes Bein. Daran war wirklich nichts lustig.'},{who:'Joe',text:'Heute gehört auch diese verrückte Nacht zu unserer Geschichte. Aber zum Glück besteht sie aus so viel mehr.'}],()=>showTransition('ERINNERUNG 03 GESAMMELT','Nicht jeder Schritt war leicht.','Zwischen lauten Nächten und stillen Tagen entstand unser gemeinsames Leben.',()=>enterChapter(3),'Nach Hause →'));}
  function petKitten(){s.homeStep=1;s.petTime=1.8;particles(s.catX,s.catY-75,12,'heart');audio.effect('heart');showDialog([{who:'Joe',text:'Pablo. Viel zu kleine Pfoten, viel zu große Augen. Und sofort ein Platz in unserem Herzen.'}],()=>{objective('Bring Pablo etwas zu fressen.');setAction('Pablos Napf füllen',()=>walkTo(365,580,feedCat));});}
  function feedCat(){s.homeStep=2;s.catX=400;s.petTime=3;particles(402,531,8,'heart');audio.effect('heart');showDialog([{who:'Lana',text:'Er tut so, als hätte er seit drei Tagen nichts bekommen.'},{who:'Joe',text:'Und jetzt spielen wir mit ihm. Bewege den roten Lichtpunkt über den Boden. Pablo muss selbst zu allen zehn Leckerlis laufen.'}],()=>{objective('Locke Pablo mit dem Laserpunkt zu 10 Leckerlis.');setAction('Mit Pablo spielen',beginPabloGame);});}
  function beginPabloGame(){
    setPhase('laser');s.homeStep=3;s.pabloGame=moments.createPablo();
    $('pablo-count').textContent='0 / 10';$('pablo-score').classList.remove('hidden');
    objective('Führe den Lichtpunkt zu den Leckerlis.');canvas.focus({preventScroll:true});
  }
  function finishPabloGame(){
    s.catX=s.pabloGame.cat.x;s.catY=s.pabloGame.cat.y;
    $('pablo-score').classList.add('hidden');setPhase('laser-finished');
    audio.effect('win');showDialog([{who:'Lana',text:'Zehn von zehn. Ich glaube, Pablo hat das Spiel gewonnen.'},{who:'Joe',text:'Ein roter Punkt, ein paar Leckerlis und ein ganz normaler Abend. Manchmal sind genau das die Erinnerungen, die bleiben.'}],()=>{setPhase('growing');objective('Kleine Pfoten. Große gemeinsame Erinnerungen.');});
  }
  function finishGrowing(){setPhase('home-grown');s.catX=660;s.catY=578;objective('Kuschle mit dem großen Pablo.');setAction('Zu Pablo aufs Sofa',()=>walkTo(630,578,()=>showDialog([{who:'Lana',text:'Weißt du noch, wie klein er war?'},{who:'Joe',text:'Wir haben ihn großgezogen. Und dabei, ganz nebenbei, unser eigenes Zuhause gebaut.'}],()=>showTransition('ERINNERUNG 04 GESAMMELT','Kleine Pfoten. Große Erinnerungen.','Pablo wird größer. Die Jahreszeiten wechseln. Und irgendwo dazwischen wird aus gemeinsam verbrachter Zeit ein gemeinsames Leben.',()=>enterChapter(4),'In die Gegenwart →'))));}
  function openLaptop(){setPhase('laptop');objective('Öffne das Geschenk auf dem Laptop.');showDialog([{who:'Joe',text:'Jetzt schau einmal kurz vom Bildschirm weg. Ich sitze wirklich neben dir.'},{who:'Joe',text:'Dieses Spiel kann nicht alles zeigen, was wir erlebt haben. Es kann uns nur daran erinnern, wie viel da schon ist.'},{who:'Joe',text:'Und an das, was ich dir heute sagen möchte.'}],()=>setAction('Meine Nachricht öffnen',finishGame));}
  function finishGame(){completed=true;setPhase('finale');save();label();$('interact').classList.add('hidden');$('objective').classList.add('hidden');$('finale').classList.remove('hidden');$('finale-chapters').focus({preventScroll:true});audio.effect('win');}
  function particles(x,y,n,type='spark'){for(let i=0;i<n;i++)s.particles.push({x,y,vx:(Math.random()-.5)*110,vy:-50-Math.random()*100,life:1.5+Math.random(),age:0,type,size:6+Math.random()*11});}
  function pause(on){if(s.screen!=='play')return;s.paused=on;keys.clear();$('pause-overlay').classList.toggle('hidden',!on);$('pause').textContent=on?'▷ Weiter':'Ⅱ Pause';if(audio.master)audio.master.gain.setTargetAtTime(audio.on&&!on?.18:0,audio.context.currentTime,.12);if(on)$('resume').focus({preventScroll:true});else canvas.focus({preventScroll:true});}
  function start(index=0){s.screen='play';s.chapter=index;$('cover').classList.add('hidden');$('play').classList.remove('hidden');$('pause').classList.remove('hidden');$('objective').classList.remove('hidden');s.elapsed=saved?.elapsed||0;audio.init();if(!audio.on)audio.toggle(true);enterChapter(index);window.scrollTo({top:0,behavior:'instant'});}
  function goCover(){mobile?.exit();save();s.screen='cover';s.paused=false;keys.clear();$('cover').classList.remove('hidden');$('play').classList.add('hidden');$('pause').classList.add('hidden');$('continue-game').classList.remove('hidden');$('continue-game').textContent=completed?'Eure Erinnerungen wieder ansehen →':'Deine Zeitreise fortsetzen →';if(audio.master)audio.master.gain.setTargetAtTime(0,audio.context.currentTime,.12);}
  function chapterMenu(){if(!completed)return;s.paused=true;keys.clear();$('chapter-list').replaceChildren();chapters.forEach((c,i)=>{const b=document.createElement('button');b.className='chapter-choice';b.innerHTML=`<span>0${i+1}</span>${c.short}<em>↗</em>`;b.addEventListener('click',()=>{s.paused=false;$('objective').classList.remove('hidden');enterChapter(i);});$('chapter-list').append(b);});$('chapter-overlay').classList.remove('hidden');$('chapter-list').querySelector('button').focus({preventScroll:true});}

  // Drawing helpers keep animated objects native and backgrounds on one canvas.
  function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
  function round(c,x,y,w,h,r,color,stroke){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
  function text(c,t,x,y,size=18,color='#faedce',align='center',font='Plex'){c.font=`${size}px ${font},Arial`;c.textAlign=align;c.fillStyle=color;c.fillText(t,x,y);}
  function line(c,points,color,width=2){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
  function gradient(c,a,b,y1=0,y2=H){const g=c.createLinearGradient(0,y1,0,y2);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
  function coverImage(c,img,x,y,w,h){if(!img?.complete||!img.naturalWidth)return;const ratio=Math.max(w/img.width,h/img.height),iw=img.width*ratio,ih=img.height*ratio;c.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih);}
  function background(name){const img=images[name];if(img?.complete&&img.naturalWidth){ctx.drawImage(img,0,0,img.width,img.height,0,0,W,H);}else{ctx.fillStyle=gradient(ctx,'#143342','#917358');ctx.fillRect(0,0,W,H);}}
  function sprite(c,key,x,y,height=215,opt={}){if(!spriteReady)return;const r=spriteRects[key];if(!r)return;const width=height*r[2]/r[3];const bob=opt.walk?Math.sin(s.time*13)*3:opt.dance?Math.sin(s.time*8)*7:Math.sin(s.time*1.8)*.7;ellipse(c,x,y+2,width*.30,height*.028,'#071e293a');c.save();c.translate(x,y+bob);if(opt.face===-1)c.scale(-1,1);if(opt.dance)c.rotate(Math.sin(s.time*5+(opt.offset||0))*.1);if(opt.fall)c.rotate(opt.fall);atlasDraw(c,key,r,-width/2,-height,width,height);c.restore();}
  function nameTag(name,x,y,accent=false){const width=name.length*6.7+22;round(ctx,x-width/2,y,width,23,11,accent?'#f3dbb4':'#112e3ce3');text(ctx,name,x,y+15,10,accent?'#385452':'#eee1c4');}
  function drawMarker(x,y){const bob=Math.sin(s.time*3)*5;ellipse(ctx,x,y+6,24,6,'#f5cd7766');ctx.save();ctx.translate(x,y-17+bob);ctx.rotate(Math.PI/4);ctx.fillStyle='#f6d288';ctx.fillRect(-5,-5,10,10);ctx.restore();}
  function clubLights(){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(675,190,10,675,370,590);g.addColorStop(0,'#cd7eab16');g.addColorStop(1,'#8368bd00');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);for(let i=0;i<3;i++){const x=330+i*300+Math.sin(s.time*.35+i)*170;ctx.beginPath();ctx.moveTo(785,55);ctx.lineTo(x-85,650);ctx.lineTo(x+85,650);ctx.closePath();ctx.fillStyle=['#d5a6570a','#ca75a513','#4597a110'][i];ctx.fill();}ctx.restore();}
  function drawClub(){
    ctx.save();if(s.phase==='club-incident'){const f=s.incident||moments.incidentFrame(0);ctx.translate(Math.sin(s.time*71)*f.shake,Math.cos(s.time*63)*f.shake*.6);}background('club');clubLights();drawClubCrowd();
    if(s.phase==='club-incident'){drawClubIncident();ctx.restore();return;}
    if(s.phase==='dance'||s.phase==='dance-crash'){
      const expand=clamp((s.dance?.clock||0)/30,0,1);
      ellipse(ctx,640,591,130+expand*340,51+expand*63,'#f7c77218');
      sprite(ctx,'pere',225,555,173,{dance:true,offset:2});sprite(ctx,'maria',1010,552,165,{dance:true,offset:4});
      sprite(ctx,'me',540+Math.sin(s.time*.9)*65,583,231,{dance:true,offset:0});sprite(ctx,'luana',720+Math.sin(s.time*.9)*65,583,231,{dance:true,offset:1});drawDance();
    }else{
      const cast=arcade.clubCast(s.chapter);
      if(cast.named.includes('pere')){sprite(ctx,'pere',252,554,195);nameTag('Pere',252,566);}
      if(cast.named.includes('maria')){sprite(ctx,'maria',873,554,193);nameTag('Maria',873,566);}
      const lx=s.chapter===2?803:1040;
      sprite(ctx,'luana',lx,567,215,{dance:s.phase==='chaos',offset:1});
      sprite(ctx,'me',s.player.x,s.player.y,226,{walk:!!s.target||keys.size>0,face:s.player.face});nameTag('Lana',lx,580,true);
      if(s.phase==='club'&&!s.dialog.length)drawMarker(s.target?.x||785,562);
      if(s.phase==='chaos'){for(let i=0;i<14;i++){const px=430+Math.sin(i*2.5)*200,py=360+(s.time*130+i*38)%290;ctx.save();ctx.translate(px,py);ctx.rotate(s.time+i);ctx.fillStyle='#e2f3ef88';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(10,3);ctx.lineTo(3,13);ctx.fill();ctx.restore();}ctx.fillStyle='rgba(131,43,46,'+((Math.sin(s.time*2)+1)*.04)+')';ctx.fillRect(0,0,W,H);}
    }
    ctx.restore();
  }
  function actionSprite(key,x,y,height=226,options={}){
    const image=images['action-'+key];if(!image?.complete||!image.naturalWidth){sprite(ctx,'me',x,y,height,options);return;}
    const rect={angry:[8,91,504,817],run:[508,121,505,750],attacker:[1013,120,523,790]}[key];
    const width=height*rect[2]/rect[3],bob=options.walk?Math.sin(s.time*17)*4:0;
    ellipse(ctx,x,y+3,width*.31,7,'#0a233e44');ctx.save();ctx.translate(x,y+bob);
    if(options.face===-1)ctx.scale(-1,1);
    if(options.fall)ctx.rotate(options.fall);
    if(options.windup)ctx.rotate(-.09);
    ctx.drawImage(image,-width/2,-height,width,height);ctx.restore();
  }
  function drawClubIncident(){
    const f=s.incident||moments.incidentFrame(s.phaseTime);
    round(ctx,1172,164,85,34,4,'#427362','#d6d7b399');text(ctx,'AUSGANG',1214,187,11,'#f4eacb');
    for(const officer of f.police)if(officer.visible)drawPolice(officer.x,officer.y,-1);
    for(const guard of f.guards)if(guard.visible)drawSecurity(guard.x,guard.y,guard.id,guard.walking);
    ctx.save();ctx.translate(f.attackerX,568);ctx.rotate(f.attackerFall*Math.PI/2);actionSprite('attacker',0,0,231,{windup:f.throwWindup,face:-1});ctx.restore();
    if(f.heroPose==='idle')sprite(ctx,'me',f.heroX,583,226);
    else actionSprite(f.heroPose,f.heroX,583,238,{walk:f.heroPose==='run',face:f.heroFace});
    sprite(ctx,'luana',950,582,216);nameTag('Lana',950,592,true);
    for(const officer of f.pursuers)drawPolice(officer.x,officer.y,1);
    if(f.impact){ellipse(ctx,360,445,69,57,'#ecd8ad80');for(let i=0;i<9;i++){const a=i*Math.PI*2/9;line(ctx,[[360+Math.cos(a)*53,445+Math.sin(a)*40],[360+Math.cos(a)*80,445+Math.sin(a)*67]],'#f5d9a1',5);}}
    if(f.shout){round(ctx,426,215,427,53,9,'#18394ef2','#b5d7e0');text(ctx,f.shout,640,248,24,'#f1ecdb','center','Georgia');}
    for(const shot of f.shots){
      if(shot.active){
        ctx.save();ctx.translate(shot.x,shot.y);ctx.rotate(shot.rotation);
        round(ctx,-11,-15,22,29,3,'#cbe6df7a','#eaf7df');round(ctx,-8,1,16,10,1,'#d4965280');line(ctx,[[-11,-13],[11,-13]],'#f6f8df',3);ctx.restore();
        line(ctx,[[shot.x-25,shot.y-7],[shot.x-12,shot.y-3]],'#e4efd57a',2);
      }
      if(shot.broken&&shot.age<3){
        ctx.save();ctx.globalAlpha=clamp(1-shot.age/3,0,1);
        ellipse(ctx,shot.targetX,shot.targetY,37,8,'#bbaa6c44');
        for(let i=0;i<9;i++){const angle=i*2.4,r=12+Math.min(shot.age,.32)*100;ctx.save();ctx.translate(shot.targetX+Math.cos(angle)*r,shot.targetY+Math.sin(angle)*r*.28);ctx.rotate(angle+shot.age);ctx.beginPath();ctx.moveTo(-3,-5);ctx.lineTo(7,0);ctx.lineTo(-1,7);ctx.closePath();ctx.fillStyle='#e8f5dfc9';ctx.fill();ctx.restore();}
        ctx.restore();
      }
    }
    if(f.heroPose==='angry'){text(ctx,'!',f.heroX+44,321,41,'#e9aa78','center','Georgia');for(let i=0;i<3;i++)line(ctx,[[f.heroX-35+i*32,329],[f.heroX-39+i*37,313]],'#db9872',3);}
    round(ctx,287,647,706,44,8,'#102b3ce8');text(ctx,f.caption,640,675,18,'#efe0bf','center','Georgia');
  }
  function drawSecurity(x,y,id,walking){
    ctx.save();ctx.translate(x,y);const step=walking?Math.sin(s.time*11+id):Math.sin(s.time*2+id)*.15;
    ellipse(ctx,0,4,52,11,'#0b203c55');
    line(ctx,[[-20,-76],[-28+step*17,-38],[-31-step*14,0]],'#19252d',23);
    line(ctx,[[20,-76],[30-step*17,-38],[37+step*14,0]],'#19252d',23);
    const skin=['#c99c76','#a57555','#d3ab85'][id%3];
    round(ctx,-47,-174,94,110,21,'#222d32','#0d202b');
    ellipse(ctx,-52,-150,24,32,skin);ellipse(ctx,52,-150,24,32,skin);
    line(ctx,[[-55,-142],[-67,-107-step*10],[-58,-77]],skin,25);
    line(ctx,[[55,-142],[70,-107+step*10],[60,-76]],skin,25);
    round(ctx,-37,-176,74,46,13,'#26353b');text(ctx,'SECURITY',0,-147,11,'#e0d9bf');
    round(ctx,-13,-195,26,27,7,skin);ellipse(ctx,0,-214,25,30,skin);
    round(ctx,-25,-235,50,16,8,'#34302b');round(ctx,-23,-220,46,10,4,'#142933');line(ctx,[[-4,-199],[9,-199]],'#785844',2);
    line(ctx,[[26,-215],[31,-205],[28,-182]],'#758a8e',3);ctx.restore();
  }
  function drawClubCrowd(){
    // Distinct anonymous guests: not recolored copies of the named characters.
    const cast=arcade.clubCast(s.chapter), takeover=s.phase==='dance'?clamp((s.dance?.clock||0)/28,0,1):0;
    for(let i=0;i<cast.guests;i++){
      const row=i<14?0:i<22?1:2, local=row===0?i:row===1?i-14:i-22;
      let x=row===0?68+local*87:row===1?96+local*153:[44,135,1147,1233][local];
      const y=row===0?362+(i%3)*11:row===1?442+(i%2)*19:589+(i%2)*24;
      if(row===1&&x>325&&x<960)x=lerp(x,x<640?200+(i%2)*75:1040+(i%2)*63,takeover);
      if(s.phase==='club-incident'&&s.phaseTime>3){x+=Math.sin(i*1.3)*Math.min(100,(s.phaseTime-3)*22);}
      drawGuest(x,y,row===0?105+(i%3)*7:row===1?141:183,i,s.phase==='chaos'||s.phase==='club-incident');
    }
  }
  function drawGuest(x,y,height,seed,chaos){
    const size=height/180,beat=Math.sin(s.time*(chaos?7:3.8)+seed*1.9),skin=['#d6a27b','#a77658','#815742','#e0b99a','#bc886b'][seed%5];
    const shirt=['#875774','#687e6b','#b98f58','#516579','#8a6453','#bcaa88'][seed%6],hair=['#322e2b','#76513b','#ba9660','#49352f'][seed%4];
    ellipse(ctx,x,y+2,25*size,7*size,'#061f394d');ctx.save();ctx.translate(x,y+Math.abs(beat)*3);ctx.scale(size,size);ctx.rotate(beat*.04);
    ctx.lineCap='round';line(ctx,[[-10,-63],[-13-beat*5,-33],[-23+beat*8,0]],'#303944',14);line(ctx,[[11,-63],[18+beat*6,-31],[27-beat*7,0]],'#303944',14);
    round(ctx,-27,-124,54,67,13,shirt,'#293944');if(seed%3===0){ctx.beginPath();ctx.moveTo(-23,-81);ctx.lineTo(-39,-45);ctx.lineTo(38,-45);ctx.lineTo(22,-81);ctx.fillStyle=shirt;ctx.fill();}
    line(ctx,[[-24,-111],[-42,-89-beat*16],[-54,-119-beat*24]],shirt,12);line(ctx,[[24,-111],[43,-103+beat*20],[52,-145+beat*19]],shirt,12);
    ellipse(ctx,-54,-119-beat*24,6,7,skin);ellipse(ctx,52,-145+beat*19,6,7,skin);
    if(seed%3===1)round(ctx,-24,-170,48,55,17,hair);
    round(ctx,-7,-134,14,18,4,skin);ellipse(ctx,0,-149,21,26,skin);
    ctx.beginPath();ctx.arc(0,-155,23,Math.PI,Math.PI*2);ctx.lineTo(22,-146);ctx.lineTo(5,-162);ctx.lineTo(-19,-143);ctx.closePath();ctx.fillStyle=hair;ctx.fill();
    ellipse(ctx,-7,-147,1.7,2,'#3a3230');ellipse(ctx,8,-147,1.7,2,'#3a3230');line(ctx,[[-4,-135],[5,-134]],'#825747',1.4);
    if(seed%4===2){line(ctx,[[-16,-151],[16,-151]],'#ccb58e',2);round(ctx,-17,-155,14,10,2,'#253945');round(ctx,3,-155,14,10,2,'#253945');}
    ctx.restore();
  }
  function drawDance(){const d=s.dance;if(!d)return;const note=Math.floor(d.clock/1.15),phase=d.clock%1.15/1.15,lane=pattern[note%pattern.length];const x=640,y=218;round(ctx,439,135,402,150,14,'#102c3bdc','#eee0b323');text(ctx,'EUER GEMEINSAMER TAKT',x,161,10,'#ccb789');const arrows=['←','↑','↓','→'];for(let i=0;i<4;i++){const ax=500+i*93;ellipse(ctx,ax,y,30,30,i===lane?'#d8b46d':'#3e545d');text(ctx,arrows[i],ax,y+13,37,i===lane?'#173b40':'#afc2b5');if(i===lane){ctx.beginPath();ctx.arc(ax,y,30+(1-phase)*37,0,Math.PI*2);ctx.strokeStyle=d.lastHit===note?'#8ee6c0':phase>.24?'#f4e0b2':'#7d9d9c';ctx.lineWidth=3;ctx.stroke();}}text(ctx,d.feedback,x,270,12,'#ddd9bf');const progress=clamp(d.hits/12,0,1);round(ctx,490,307,300,5,2,'#e8cb9622');round(ctx,490,307,Math.max(2,300*progress),5,2,'#e5c48f');text(ctx,`${d.hits} / 12 Schritte · Versuch ${d.attempt} · noch ${Math.max(0,Math.ceil(34.5-d.clock))} s`,640,337,12,'#e9d8b4');document.querySelectorAll('[data-dance]').forEach((b,i)=>b.classList.toggle('lit',i===lane&&d.lastHit!==note));}
  function tree(c,x,y,size=70,dark=false){round(c,x-4,y,8,size*.65,3,dark?'#163738':'#55664a');ellipse(c,x-20,y-5,size*.46,size*.45,dark?'#143d40':'#476454');ellipse(c,x+16,y-15,size*.5,size*.57,dark?'#1d4a48':'#597b5d');ellipse(c,x,y-39,size*.4,size*.42,dark?'#2a5550':'#6e8662');}
  function car(c,x,y,angle=0,scale=1,side=false){c.save();c.translate(x,y);c.rotate(angle);c.scale(scale,scale);if(side){ellipse(c,0,39,176,20,'#001d2644');round(c,-161,-15,324,49,17,'#667e85','#243e49');c.beginPath();c.moveTo(-99,-15);c.lineTo(-65,-79);c.quadraticCurveTo(-19,-93,42,-82);c.lineTo(100,-15);c.closePath();c.fillStyle='#758e92';c.fill();c.strokeStyle='#274752';c.lineWidth=3;c.stroke();c.beginPath();c.moveTo(-79,-22);c.lineTo(-56,-67);c.lineTo(-5,-67);c.lineTo(-5,-22);c.closePath();c.fillStyle=s.phase==='private-moment'?'#aac6c5':'#183a4c';c.fill();c.beginPath();c.moveTo(5,-67);c.lineTo(37,-67);c.lineTo(78,-22);c.lineTo(5,-22);c.closePath();c.fill();line(c,[[-156,6],[154,6]],'#aec1b6',2);round(c,-158,-5,23,12,4,'#d9ac6c');round(c,143,-5,17,13,3,'#efe3ae');for(const wx of [-105,102]){ellipse(c,wx,31,29,29,'#1c303a');ellipse(c,wx,31,17,17,'#a8b4b0');ellipse(c,wx,31,7,7,'#3d5861');}text(c,'FIAT BRAVO',-13,22,10,'#e2e6d8');round(c,71,7,21,4,2,'#314e57');}else{ellipse(c,5,7,42,75,'#031d2444');round(c,-35,-70,70,136,18,'#759294','#183b46');round(c,-30,-64,60,36,10,'#91aaab');round(c,-29,-27,58,42,9,'#203f50');round(c,-25,17,50,31,8,'#93aeac');round(c,-27,47,54,12,4,'#264555');round(c,-29,-67,16,7,3,'#f9e4af');round(c,13,-67,16,7,3,'#f9e4af');round(c,-34,57,12,6,2,'#c48375');round(c,22,57,12,6,2,'#c48375');line(c,[[0,-24],[0,12]],'#759393',2);text(c,'BRAVO',0,40,7,'#304f56');}c.restore();}
  function drawDrive(){
    const d=s.drive||arcade.createDrive();
    ctx.save();if(s.phase==='drive-crash'&&s.phaseTime<.4)ctx.translate(Math.sin(s.phaseTime*95)*6,Math.cos(s.phaseTime*83)*4);
    ctx.fillStyle=gradient(ctx,'#71866f','#385e5a');ctx.fillRect(0,0,W,H);
    for(let i=0;i<16;i++){const y=(i*163+d.distance*.72)%1000-160;tree(ctx,i%2?105+(i%3)*59:1065+(i%3)*56,y,80,i%3===0);}
    const centreAt=y=>roadCenter(d.distance+(arcade.DRIVE_Y-y)/arcade.ROAD_SCALE);
    ctx.beginPath();for(let y=-20;y<=H+20;y+=10){const cx=centreAt(y);if(y===-20)ctx.moveTo(cx-210,y);else ctx.lineTo(cx-210,y);}
    for(let y=H+20;y>=-20;y-=10)ctx.lineTo(centreAt(y)+210,y);
    ctx.closePath();ctx.fillStyle='#273f49';ctx.fill();ctx.strokeStyle='#bdc0a0';ctx.lineWidth=5;ctx.stroke();
    ctx.save();ctx.setLineDash([33,35]);ctx.lineDashOffset=-d.distance*arcade.ROAD_SCALE;
    for(const offset of [-60,60]){const pts=[];for(let y=-20;y<H+20;y+=12)pts.push([centreAt(y)+offset,y]);line(ctx,pts,'#cecaa277',3);}ctx.restore();
    for(let i=0;i<7;i++){const y=(i*135+d.distance*.72)%900-90,cx=centreAt(y);round(ctx,cx-224,y,7,27,2,'#d8d4af');round(ctx,cx+217,y,7,27,2,'#d8d4af');}
    for(const vehicle of d.traffic){const y=arcade.DRIVE_Y-(vehicle.z-d.distance)*arcade.ROAD_SCALE;if(y < -180||y>H+180)continue;drawTrafficCar(roadCenter(vehicle.z)+vehicle.lane*arcade.LANE_WIDTH,y,vehicle);}
    if(d.speed>300){for(let i=0;i<14;i++){const y=(i*67+d.distance*1.4)%H,x=i%2?290+(i%3)*25:960+(i%3)*25;line(ctx,[[x,y],[x,y+18+d.speed*.025]],'#e9e5bf32',2);}}
    car(ctx,d.x,arcade.DRIVE_Y,clamp((d.targetX===null?0:d.targetX-d.x)*.001,-.12,.12),.82);
    if(s.phase==='drive-crash'){ellipse(ctx,d.x,466,38,21,'#edaa7755');text(ctx,'✷',d.x,480,63,'#ffd393');}
    round(ctx,27,514,235,143,10,'#173944ed','#ded3b32b');text(ctx,'DURCH DEN VERKEHR',46,541,10,'#d8c18f','left');
    text(ctx,String(Math.round(d.speed*.21))+' km/h',46,578,29,'#f4e7c5','left','Georgia');
    text(ctx,'Versuch '+d.attempt+' · '+d.passed+' Autos passiert',46,604,11,'#c2d3c0','left');
    round(ctx,46,623,193,5,2,'#769082');round(ctx,46,623,Math.max(2,193*d.distance/arcade.DRIVE_LENGTH),5,2,'#edc68f');
    text(ctx,'← → Lenken   ↑ Gas   ↓ Bremse',46,646,9,'#c2d3c0','left');
    if(d.distance>arcade.DRIVE_LENGTH-1500){round(ctx,1063,286,111,114,7,'#2e626c','#edf0d5');text(ctx,'P',1118,358,61,'#f6eccd');text(ctx,'GLEICH DA',1118,382,10,'#dbe9ce');}
    ctx.restore();if(!mobile?.isBlocked())drawCountdown(d,'WEICHE DEN ANDEREN AUTOS AUS');
  }
  function drawTrafficCar(x,y,v){
    ctx.save();ctx.translate(x,y);const w=v.width,h=v.length;
    ellipse(ctx,6,8,w*.65,h*.54,'#06243055');round(ctx,-w/2-4,-h*.31,8,27,2,'#172a32');round(ctx,w/2-4,-h*.31,8,27,2,'#172a32');
    round(ctx,-w/2,-h/2,w,h,v.truck?9:15,v.color,'#172f3c');
    if(v.truck){round(ctx,-w/2+5,-h/2+8,w-10,32,5,'#213c4d');round(ctx,-w/2+5,-h/2+45,w-10,h-53,4,'#a7a899','#485e62');for(let n=0;n<5;n++)line(ctx,[[-w/2+9,-h/2+55+n*15],[w/2-9,-h/2+55+n*15]],'#586d6b66',2);}
    else{round(ctx,-w/2+6,-h/2+28,w-12,29,7,'#203d4c');round(ctx,-w/2+9,0,w-18,31,7,v.color);round(ctx,-w/2+8,h/2-24,w-16,14,4,'#27424c');line(ctx,[[-w/2+8,-h/2+33],[w/2-8,-h/2+31]],'#b7d6d080',3);}
    for(const sx of [-1,1]){round(ctx,sx*w*.31-7,-h/2+3,14,5,2,'#f2dfaf');round(ctx,sx*w*.34-6,h/2-7,12,5,2,'#e87866');}
    round(ctx,-11,h/2-6,22,5,1,'#e4ddc8');ctx.restore();
  }
  function drawParking(){ctx.fillStyle=gradient(ctx,'#203d53','#b5a588',0,600);ctx.fillRect(0,0,W,H);ellipse(ctx,1000,150,44,44,'#e9d7a1');for(let i=0;i<40;i++)ellipse(ctx,(i*179)%W,40+(i*57)%290,i%3===0?1.7:1,1,'#f0e5c066');for(let i=0;i<8;i++)tree(ctx,80+i*181,360+(i%2)*15,118,true);ctx.fillStyle='#26494b';ctx.fillRect(0,440,W,280);ctx.fillStyle='#334f50';ctx.fillRect(130,505,1020,215);for(let i=0;i<5;i++)line(ctx,[[190+i*220,720],[270+i*170,505]],'#d8c8a543',4);const shake=s.phase==='private-moment'?Math.sin(s.phaseTime*8)*.017:0;car(ctx,640,551,shake,1.43,true);if(s.phase==='private-moment'){for(let i=0;i<7;i++){const t=(s.phaseTime*.18+i*.14)%1;text(ctx,'♡',566+i*22+Math.sin(t*10+i)*23,390-t*160,19+i%3*6,`rgba(233,194,150,${1-t})`);}text(ctx,'Manche Erinnerungen bleiben zwischen uns.',640,659,23,'#dfd8ba','center','Georgia');if(s.phaseTime>4.8){ctx.fillStyle=`rgba(16,39,49,${clamp((s.phaseTime-4.8)/2,0,.94)})`;ctx.fillRect(0,0,W,H);}}}
  function drawCity(){ctx.fillStyle=gradient(ctx,'#122638','#536b70');ctx.fillRect(0,0,W,H);ellipse(ctx,1080,113,34,34,'#cfdbcb');const dist=s.chase?.distance||0;for(let layer=0;layer<2;layer++){for(let i=0;i<12;i++){const bw=130+((i*57)%60),bh=180+(i*71)%210;const x=(i*170-dist*(layer?.45:.18))%2000-240;round(ctx,x,455-bh,bw,bh,2,layer?'#25434f':'#203849');for(let iy=0;iy<5;iy++)for(let ix=0;ix<3;ix++)if((ix+iy+i)%3!==1)round(ctx,x+17+ix*34,470-bh+iy*40,14,22,1,layer?'#bcab7760':'#65837d');}}ctx.fillStyle='#335059';ctx.fillRect(0,445,W,275);ctx.fillStyle='#436167';ctx.fillRect(0,515,W,36);line(ctx,[[0,551],[W,551]],'#96aaa666',3);for(let i=0;i<15;i++){const x=(i*120-dist*1.5)%W;line(ctx,[[x,610],[x+70,610]],'#8aa29b44',3);}for(let i=0;i<4;i++){const x=(i*430-dist*.75)%1700;round(ctx,x,220,7,294,3,'#142f3e');round(ctx,x-7,205,21,32,5,'#d9cba0');const g=ctx.createRadialGradient(x,250,0,x,320,140);g.addColorStop(0,'#d8ba6b19');g.addColorStop(1,'#d8ba6b00');ctx.fillStyle=g;ctx.fillRect(x-150,230,300,320);}if(['chase','chase-crash'].includes(s.phase)){const c=s.chase;
      for(const obstacle of c.obstacles){const x=obstacle.z-c.distance+345;if(x<-130||x>W+130)continue;drawRunnerObstacle(x,550,obstacle);}
      if(c.status==='running'){ctx.save();ctx.globalAlpha=.11;actionSprite('run',319,550-c.jumpY,216,{walk:true});ctx.restore();}
      actionSprite('run',345,550-c.jumpY,216,{walk:c.status==='running',fall:s.phase==='chase-crash'?-.57:0});
      for(let i=0;i<3;i++)drawPolice((s.phase==='chase-crash'?230:218)-i*86,545-i*13,1);
      if(c.countdown<=0&&c.distance<2600){round(ctx,432,141,430,48,8,'#173448e8');text(ctx,'Stehen bleiben! Halt, Polizei!',647,172,22,'#f1e2c3','center','Georgia');}
      round(ctx,977,35,258,81,9,'#143440ed');text(ctx,'DIE VERRÜCKTE NACHT',1106,57,9,'#cfbc8e');text(ctx,'Versuch '+c.attempt+' · '+c.cleared+' Hindernisse',1106,80,12,'#e9dec2');
      round(ctx,997,97,216,4,2,'#66837a');round(ctx,997,97,Math.max(2,216*c.distance/arcade.CHASE_LENGTH),4,2,'#e2bd84');
      round(ctx,35,636,405,41,7,'#15353ddd');text(ctx,'LEERTASTE / ↑  ·  SPRINGEN   —   NICHT STOLPERN!',237,662,11,'#e2d4b4');
      if(c.countdown<=0&&c.status==='running'){for(let i=0;i<8;i++){const y=574+i*13,x=(i*179-c.distance*1.4)%W;line(ctx,[[x,y],[x+72,y]],'#d6d8bd2b',2);}}
      drawCountdown(c,'SPRINGE RECHTZEITIG AB');
    }else{const t=s.phase==='aftermath'?2:clamp(s.phaseTime,0,2);sprite(ctx,'me',510,600,210,{fall:-Math.min(1.35,t)});drawPolice(lerp(90,410,t/2),555,1);drawPolice(lerp(20,635,t/2),555,-1);drawPolice(lerp(-65,300,t/2),533,1);if(s.phaseTime>2)round(ctx,410,525,120,50,15,'#0d2c3540');}const gl=ctx.createLinearGradient(0,0,270,0);gl.addColorStop(0,`rgba(91,143,188,${.1+Math.sin(s.time*4)*.04})`);gl.addColorStop(1,'#5b8fbc00');ctx.fillStyle=gl;ctx.fillRect(0,0,300,H);}
  function drawRunnerObstacle(x,y,o){
    const w=o.width,h=o.height;ellipse(ctx,x,y+3,w*.65,7,'#102b3b55');
    if(o.kind==='cone'){ctx.beginPath();ctx.moveTo(x,y-h);ctx.lineTo(x-w/2,y-5);ctx.lineTo(x+w/2,y-5);ctx.closePath();ctx.fillStyle='#c6814d';ctx.fill();line(ctx,[[x-w*.2,y-h*.5],[x+w*.2,y-h*.5]],'#eddbc4',8);round(ctx,x-w/2-7,y-7,w+14,9,3,'#4d4a3b');return;}
    if(o.kind==='barrier'){line(ctx,[[x-w/2+9,y],[x-w/2+9,y-h]],'#657d7d',7);line(ctx,[[x+w/2-9,y],[x+w/2-9,y-h]],'#657d7d',7);round(ctx,x-w/2,y-h,w,34,3,'#ddcba4','#5b6259');for(let i=0;i<4;i++)line(ctx,[[x-w/2+8+i*23,y-h+29],[x-w/2+21+i*23,y-h+5]],'#b66b4f',10);ellipse(ctx,x-w/2+10,y-h-7,5,6,'#e5ad5f');ellipse(ctx,x+w/2-10,y-h-7,5,6,'#e5ad5f');return;}
    const count=o.kind==='double'?2:1,cw=w/count;
    for(let i=0;i<count;i++){const lx=x-w/2+i*cw;round(ctx,lx,y-h,cw-3,h,4,'#8b7355','#3e4139');line(ctx,[[lx+5,y-h+5],[lx+cw-9,y-5]],'#c1a47a',4);line(ctx,[[lx+cw-9,y-h+5],[lx+5,y-5]],'#b1956e',4);line(ctx,[[lx+4,y-h*.5],[lx+cw-7,y-h*.5]],'#4b4b3a',2);}
  }
  function drawPolice(x,y,face){ctx.save();ctx.translate(x,y);ctx.scale(face,1);const step=Math.sin(s.time*11);line(ctx,[[-11,-44],[-18+step*9,0]],'#162f3d',14);line(ctx,[[12,-44],[21-step*9,0]],'#162f3d',14);round(ctx,-24,-104,48,68,9,'#253e52','#162c3a');round(ctx,-20,-100,40,40,4,'#859d9d');ctx.save();ctx.scale(face,1);text(ctx,'POLIZEI',0,-81,6,'#163844');ctx.restore();ellipse(ctx,0,-126,18,23,'#c5a080');round(ctx,-23,-152,46,12,4,'#1c364b');line(ctx,[[-20,-92],[-34,-52]],'#263f53',11);line(ctx,[[20,-92],[32,-63]],'#263f53',11);ctx.restore();}
  function drawHome(){if(s.phase==='laser'){drawPabloGame();return;}if(s.phase==='growing'&&s.phaseTime>=18){drawSofaMemory();return;}background('home');if(s.phase==='growing'){const t=s.phaseTime;const seasons=['Die ersten Tage.','Ein Sommer voller Unfug.','Draußen wird es Herbst.','Und plötzlich ist er groß.'];const si=Math.min(3,Math.floor(t/4.3));ctx.fillStyle=['#efd8970a','#a9bd7520','#b56d3d20','#bfd1ce20'][si];ctx.fillRect(0,0,W,H);sprite(ctx,'me',520,590,310);sprite(ctx,'luana',765,587,305);const growth=clamp(t/16,0,1);sprite(ctx,growth<.45?'kitten':'pablo',640,579,54+growth*38);text(ctx,seasons[si],640,180,36,'#f5ebcf','center','Georgia');round(ctx,474,211,332,4,2,'#faf4d44d');round(ctx,474,211,Math.max(2,332*growth),4,2,'#edcd95');for(let i=0;i<13;i++){const y=(i*60+t*24)%H,x=(i*133+Math.sin(t+i)*18)%W;ellipse(ctx,x,y,si===2?5:2,si===2?2:2,si===2?'#e6b26265':'#f9edbd40');}return;}const adult=s.chapter===4||s.phase==='home-grown';sprite(ctx,'luana',s.chapter===4?1060:767,s.chapter===4?510:580,300);if(s.chapter===4){sprite(ctx,'pablo',s.catX,s.catY,92,{walk:!!s.catTarget});}else{sprite(ctx,adult?'pablo':'kitten',s.catX,s.catY,adult?92:58,{walk:s.petTime>0});if(s.homeStep===3&&s.petTime>0){ellipse(ctx,s.catX-40-Math.sin(s.petTime*3)*55,581-Math.abs(Math.sin(s.petTime*4))*30,10,10,'#c7985f');}}sprite(ctx,'me',s.player.x,s.player.y,310,{walk:!!s.target||keys.size>0,face:s.player.face});if(s.chapter===3&&s.homeStep>=2){ellipse(ctx,362,588,37,12,'#e1d9bb');ellipse(ctx,362,585,30,8,'#9c7750');}if(!s.dialog.length){drawMarker(s.chapter===4?1140:s.catX,s.chapter===4?202:s.catY-15);}if(s.chapter===4){const glow=ctx.createRadialGradient(1142,242,4,1142,242,75);glow.addColorStop(0,'#d6edbf25');glow.addColorStop(1,'#d6edbf00');ctx.fillStyle=glow;ctx.fillRect(1067,167,150,150);}}
  function drawPabloGame(){
    background('home');const p=s.pabloGame;if(!p)return;
    sprite(ctx,'me',100,485,270);sprite(ctx,'luana',1180,485,265);
    for(const treat of p.treats){
      if(treat.collected)continue;
      const pulse=1+Math.sin(s.time*3+treat.id)*.11;
      ellipse(ctx,treat.x,treat.y+4,20,7,'#242d2433');
      ellipse(ctx,treat.x,treat.y,18*pulse,11*pulse,'#efcf8c2b');
      ctx.save();ctx.translate(treat.x,treat.y);ctx.rotate((treat.id%3-1)*.3);
      round(ctx,-10,-6,20,12,5,'#e0ae65','#936039');ellipse(ctx,-9,-4,5,5,'#d9a05a');ellipse(ctx,9,4,5,5,'#d9a05a');ellipse(ctx,-3,-1,1.5,1.5,'#93623e');ellipse(ctx,4,2,1.5,1.5,'#93623e');ctx.restore();
    }
    if(p.laser.active){const l=p.laser,g=ctx.createRadialGradient(l.x,l.y,1,l.x,l.y,21);g.addColorStop(0,'#ff5a5580');g.addColorStop(1,'#ff302000');ctx.fillStyle=g;ctx.fillRect(l.x-23,l.y-23,46,46);ellipse(ctx,l.x,l.y,4,3,'#ff5145');ellipse(ctx,l.x-1,l.y-1,1.5,1,'#ffe3b9');}
    sprite(ctx,'kitten',p.cat.x,p.cat.y+4,83,{walk:p.cat.moving,face:p.cat.face});
    if(p.eatPause>0)text(ctx,'♥',p.cat.x,p.cat.y-89,20,'#edc085');
    round(ctx,266,666,748,32,7,'#163831d9');
    text(ctx,p.laser.active?'MAUS / BERÜHRUNG / PFEILTASTEN  ·  FÜHRE PABLO ZUM FUTTER':'BEWEGE DEN LICHTPUNKT ÜBER DEN BODEN  ·  SAMMLE 10 LECKERLIS',640,687,11,'#eee0ba');
  }
  function drawSofaMemory(){
    const t=s.phaseTime-18,zoom=1+Math.min(t,8)*.003;
    ctx.save();ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-W/2,-H/2);background('sofa');ctx.restore();
    for(let i=0;i<4;i++){const age=(t*.23+i*.27)%1;ctx.save();ctx.globalAlpha=(1-age)*.07;ctx.strokeStyle='#f1e7d9';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(266+i*157,270-age*145);ctx.bezierCurveTo(242+i*157,239-age*145,286+i*157,216-age*145,265+i*157,190-age*145);ctx.stroke();ctx.restore();}
    round(ctx,268,635,744,53,9,'#193731df');
    text(ctx,'Unsere kleinen Auszeiten. Zusammen auf dem Sofa.',640,668,22,'#f5e6c9','center','Georgia');
  }
  function drawParticles(){for(const p of s.particles){const alpha=clamp(1-p.age/p.life,0,1);ctx.save();ctx.globalAlpha=alpha;if(p.type==='heart')text(ctx,'♥',p.x,p.y,p.size,'#ecc08c');else ellipse(ctx,p.x,p.y,p.size*.4,p.size*.4,'#f5ce8f');ctx.restore();}}
  function draw(){ctx.clearRect(0,0,W,H);if(s.chapter===0||s.chapter===2&&['chaos','intro','club-calm','club-incident','club-exit'].includes(s.phase))drawClub();else if(s.chapter===1){if(['parking','private-moment'].includes(s.phase))drawParking();else drawDrive();}else if(s.chapter===2)drawCity();else drawHome();drawParticles();if(s.target){const p=s.target;ctx.beginPath();ctx.ellipse(p.x,p.y+3,21,7,0,0,Math.PI*2);ctx.strokeStyle='#e9d49877';ctx.lineWidth=2;ctx.stroke();}const vignette=ctx.createRadialGradient(640,330,270,640,330,800);vignette.addColorStop(0,'#0b273300');vignette.addColorStop(1,'#0b273344');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);}
  function drawCover(){const c=coverCtx,w=760,h=820;c.clearRect(0,0,w,h);coverImage(c,images.club,0,0,w,h);c.fillStyle='#172f3b38';c.fillRect(0,0,w,h);const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#6d977232');g.addColorStop(1,'#d48a7c19');c.fillStyle=g;c.fillRect(0,0,w,h);const temp=s.time;s.time=s.coverTime;sprite(c,'me',243,671,433,{dance:true,offset:0});sprite(c,'luana',506,668,437,{dance:true,offset:1});for(let i=0;i<12;i++){const x=(i*91+70)%w,y=90+(i*127)%h;ellipse(c,x,y,1.5+Math.sin(s.coverTime+i)*.6,1.5,'#f3d9a166');}s.time=temp;}

  function update(dt){mobile?.sync();if(mobile?.isBlocked())return;s.coverTime+=dt;if(s.screen==='cover')return;if(s.paused)return;s.time+=dt;s.elapsed+=dt;s.toastTime-=dt;if(s.toastTime<=0)$('toast').classList.add('hidden');if(s.petTime>0)s.petTime-=dt;s.particles=s.particles.filter(p=>{p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=20*dt;return p.age<p.life;});audio.update();if(s.dialog.length||!$('transition').classList.contains('hidden'))return;s.phaseTime+=dt;
    if(s.phase==='club-incident'){s.incident=moments.incidentFrame(s.phaseTime);if(s.incident.shake>0&&!s.incidentSound){audio.effect('bump');s.incidentSound=true;}if(s.incident.shake===0)s.incidentSound=false;if(s.incident.done)finishClubIncident();return;}
    if(s.phase==='laser'){const p=s.pabloGame,eaten=moments.updatePablo(p,dt,{x:(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0),y:(keys.has('ArrowDown')||keys.has('KeyS')?1:0)-(keys.has('ArrowUp')||keys.has('KeyW')?1:0)});if(eaten.length){$('pablo-count').textContent=p.collected+' / 10';audio.effect('heart');for(const id of eaten){const food=p.treats[id];particles(food.x,food.y-25,7,'heart');}toast(p.collected+' / 10 · Lecker, Pablo!');}if(p.status==='finished')finishPabloGame();return;}
    if(s.catTarget){const dx=s.catTarget.x-s.catX,dy=s.catTarget.y-s.catY,d=Math.hypot(dx,dy);if(d<5){s.catX=s.catTarget.x;s.catY=s.catTarget.y;s.catTarget=null;}else{s.catX+=dx/d*Math.min(d,215*dt);s.catY+=dy/d*Math.min(d,215*dt);}}if(s.target){const dx=s.target.x-s.player.x,dy=s.target.y-s.player.y,distance=Math.hypot(dx,dy);s.player.face=dx>=0?1:-1;if(distance<6){s.player.x=s.target.x;s.player.y=s.target.y;s.target=null;const done=s.afterWalk;s.afterWalk=null;done?.();}else{s.player.x+=dx/distance*Math.min(distance,220*dt);s.player.y+=dy/distance*Math.min(distance,220*dt);}}else if(['club','home','home-grown','present','laptop','chaos'].includes(s.phase)){const dir=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0);if(dir){s.player.x=clamp(s.player.x+dir*225*dt,75,1200);s.player.face=dir;}}
    if(s.phase==='dance'&&!s.dance.done){s.dance.clock+=dt;if(s.dance.clock>=34.5)failChallenge('dance');}
    if(s.phase==='drive'){const d=s.drive,before=d.nearMisses;const result=arcade.updateDrive(d,dt,{steer:(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0),gas:keys.has('ArrowUp')||keys.has('KeyW'),brake:keys.has('ArrowDown')||keys.has('KeyS')});if(result==='crash')failChallenge('drive');else if(result==='finish')finishDrive();else if(d.nearMisses>before)toast('Knapp vorbei!');}
    if(s.phase==='private-moment'&&s.phaseTime>7){setPhase('parking');finishPrivate();}
    if(s.phase==='chase'){const result=arcade.updateChase(s.chase,dt);if(result==='crash')failChallenge('chase');else if(result==='finish')finishChase();}
    if(s.phase.endsWith('-crash')&&s.phaseTime>=.45&&$('retry-overlay').classList.contains('hidden')){$('retry-overlay').classList.remove('hidden');$('retry-go').focus({preventScroll:true});}
    if(s.phase==='fall'&&s.phaseTime>3.3){setPhase('aftermath');finishFall();}
    if(s.phase==='growing'&&s.phaseTime>26)finishGrowing();
  }
  let last=performance.now();function frame(now){const dt=Math.min(.04,(now-last)/1000);last=now;update(dt);if(s.screen==='cover')drawCover();else draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);

  $('fill-code').onclick=()=>{$('gift-code').value='PABLO';$('code-error').textContent='';$('gift-code').focus();};
  $('unlock-form').onsubmit=e=>{e.preventDefault();if($('gift-code').value.trim().toUpperCase()!=='PABLO'){$('code-error').textContent='Fast. Der Demo-Code lautet PABLO.';$('gift-code').setAttribute('aria-invalid','true');return;}if(loaded<assets.length){$('code-error').textContent='Die Erinnerungen werden gerade geladen. Gleich noch einmal öffnen.';return;}$('code-error').textContent='';$('gift-code').removeAttribute('aria-invalid');start(0);};
  $('continue-game').onclick=()=>{start(saved?.chapter||0);};
  if(saved){$('continue-game').classList.remove('hidden');$('continue-game').textContent=completed?'Eure Erinnerungen wieder ansehen →':'Deine Zeitreise fortsetzen →';}
  $('sound').onclick=()=>audio.toggle(!audio.on);$('pause').onclick=()=>pause(!s.paused);$('resume').onclick=()=>pause(false);$('back-cover').onclick=goCover;
  $('home-link').onclick=e=>{e.preventDefault();if(s.screen==='play')pause(true);};
  $('fullscreen').onclick=()=>mobile?.toggleFullscreen();
  $('retry-go').onclick=retryChallenge;$('retry-skip').onclick=skipChallenge;
  $('next-dialogue').onclick=nextDialog;$('interact').onclick=interact;
  $('transition-go').onclick=()=>{const fn=s.transitionDone;s.transitionDone=null;$('transition').classList.add('hidden');canvas.focus({preventScroll:true});fn?.();};
  $('chapters-button').onclick=chapterMenu;$('finale-chapters').onclick=chapterMenu;$('close-chapters').onclick=()=>{$('chapter-overlay').classList.add('hidden');s.paused=false;canvas.focus({preventScroll:true});};
  document.querySelectorAll('[data-dance]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();danceInput(Number(b.dataset.dance));});b.onclick=e=>{if(e.detail===0)danceInput(Number(b.dataset.dance));};});
  document.addEventListener('keydown',e=>{if(s.screen!=='play'||e.target instanceof HTMLInputElement||e.target?.tagName==='BUTTON')return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','Enter','Escape','KeyE','KeyA','KeyD','KeyW','KeyS'].includes(e.code))e.preventDefault();if(e.code==='Escape'){if(!$('chapter-overlay').classList.contains('hidden'))$('close-chapters').click();else pause(!s.paused);return;}if(s.paused)return;if(s.phase.endsWith('-crash')){if(['Enter','Space','KeyE'].includes(e.code)&&!e.repeat)retryChallenge();return;}if(s.dialog.length){if((e.code==='Enter'||e.code==='Space'||e.code==='KeyE')&&!e.repeat)nextDialog();return;}if(!$('transition').classList.contains('hidden')){if((e.code==='Enter'||e.code==='Space')&&!e.repeat)$('transition-go').click();return;}keys.add(e.code);if(s.phase==='dance'&&!e.repeat){const lane={ArrowLeft:0,KeyA:0,ArrowUp:1,KeyW:1,ArrowDown:2,KeyS:2,ArrowRight:3,KeyD:3}[e.code];if(lane!==undefined)danceInput(lane);}else if(s.phase==='chase'&&['ArrowUp','KeyW'].includes(e.code)&&!e.repeat)jump();else if((e.code==='KeyE'||e.code==='Space')&&!e.repeat)interact();});
  document.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{keys.clear();if(document.hidden&&s.screen==='play')pause(true);});
  function scenePoint(e){
    const r=canvas.getBoundingClientRect();
    if(typeof getComputedStyle==='function'&&['cover','contain'].includes(getComputedStyle(canvas).objectFit)){
      const scale=(getComputedStyle(canvas).objectFit==='contain'?Math.min:Math.max)(r.width/W,r.height/H),ox=(r.width-W*scale)/2,oy=(r.height-H*scale)/2;
      return {x:(e.clientX-r.left-ox)/scale,y:(e.clientY-r.top-oy)/scale};
    }
    return {x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};
  }
  canvas.addEventListener('pointerdown',e=>{if(mobile?.isBlocked()||s.paused||s.dialog.length||s.afterWalk||!$('transition').classList.contains('hidden'))return;const {x,y}=scenePoint(e);if(x<0||x>W||y<0||y>H)return;canvas.focus({preventScroll:true});if(s.phase==='laser'){moments.pointLaser(s.pabloGame,x,y);return;}if(s.phase==='dance'){if(y>=150&&y<=282&&x>=453&&x<=826)danceInput(clamp(Math.round((x-500)/93),0,3));return;}if(s.phase==='drive')return;if(s.phase==='chase'){jump();return;}if(['club','home','home-grown','present','laptop'].includes(s.phase)){walkTo(clamp(x,75,1200),clamp(y,525,625),null);}});
  canvas.addEventListener('pointermove',e=>{if(s.phase!=='laser'||mobile?.isBlocked()||s.paused||s.dialog.length||!$('transition').classList.contains('hidden'))return;if(e.pointerType==='touch'&&!e.buttons)return;const {x,y}=scenePoint(e);moments.pointLaser(s.pabloGame,x,y);});
  canvas.addEventListener('pointerleave',e=>{if(s.phase==='laser'&&s.pabloGame&&e.pointerType!=='touch')s.pabloGame.laser.active=false;});
  document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);const code=b.dataset.key;if(code==='Space'){if(s.dialog.length)nextDialog();else interact();}else if(s.phase==='chase'&&code==='ArrowUp')jump();else if(s.phase==='dance')danceInput({ArrowLeft:0,ArrowUp:1,ArrowDown:2,ArrowRight:3}[code]);else keys.add(code);});b.addEventListener('pointerup',()=>keys.delete(b.dataset.key));b.addEventListener('pointercancel',()=>keys.delete(b.dataset.key));});
  mobile=window.MemoryMobile?.create({state:()=>s,keys,danceInput,jump,interact,pause,toast,audio,blocked:()=>s.paused||s.dialog.length>0||!$('transition').classList.contains('hidden')||!$('chapter-overlay').classList.contains('hidden')});
  window.addEventListener('pagehide',()=>{if(s.screen==='play')save();});
  if(location.protocol!=='file:'&&'serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
