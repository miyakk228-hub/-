/* MANUL KOMBAT — character life and purchase effects */
(function () {
  'use strict';
  if (window.manulMotionFXLoaded) return;
  window.manulMotionFXLoaded = true;

  const character = document.getElementById('manul-button');
  if (!character) return;

  const style = document.createElement('style');
  style.id = 'manul-motion-fx-style';
  style.textContent = `
    .manul-character { isolation:isolate; transform-origin:50% 78%; }
    .manul-character::before {
      transform-origin:50% 78%;
      animation: mkIdleBreath 3.2s ease-in-out infinite;
      will-change:transform,filter;
    }
    @keyframes mkIdleBreath {
      0%,100% { transform:translateY(0) scale(1); }
      48% { transform:translateY(-4px) scale(1.012,1.018); }
      55% { transform:translateY(-3px) scale(1.008,1.012); }
    }
    .manul-character.mk-hit::before { animation:mkHitLunge .38s cubic-bezier(.2,.8,.25,1) both !important; }
    @keyframes mkHitLunge {
      0% { transform:translateY(0) scale(1); }
      22% { transform:translateY(8px) scale(1.09,.91) rotate(-2deg); }
      52% { transform:translateY(-15px) scale(.96,1.06) rotate(2deg); }
      78% { transform:translateY(3px) scale(1.025,.985); }
      100% { transform:translateY(0) scale(1); }
    }
    .manul-character.mk-hit { animation:mkBodyShake .38s ease-out both; }
    @keyframes mkBodyShake { 0%,100%{rotate:0deg} 25%{rotate:-2deg} 55%{rotate:2deg} 78%{rotate:-.7deg} }
    .mk-face-motion { position:absolute; inset:-12%; width:124%; height:124%; z-index:6; pointer-events:none; overflow:visible; }
    .mk-blink { transform-origin:center; animation:mkBlink 6.4s infinite; }
    @keyframes mkBlink { 0%,43%,46%,82%,85%,100%{transform:scaleY(0);opacity:0} 44.5%,83.5%{transform:scaleY(1);opacity:.9} }
    .mk-idle-paw { position:absolute; width:66px; height:70px; right:10%; bottom:12%; z-index:7; opacity:0; pointer-events:none; transform-origin:70% 85%; }
    .manul-character.mk-idle-wave .mk-idle-paw { animation:mkPawWave 1.25s ease-in-out both; }
    @keyframes mkPawWave { 0%{opacity:0;transform:translate(8px,12px) rotate(25deg)} 18%{opacity:1} 42%{transform:translate(-4px,-20px) rotate(-24deg)} 62%{transform:translate(-5px,-22px) rotate(22deg)} 82%{transform:translate(-2px,-12px) rotate(-12deg);opacity:1} 100%{opacity:0;transform:translate(8px,12px) rotate(25deg)} }
    .manul-character.mk-idle-look::before { animation:mkLookAround 1.1s ease-in-out both !important; }
    @keyframes mkLookAround { 0%,100%{transform:translateY(0) rotate(0)} 35%{transform:translateY(-3px) rotate(-2deg)} 70%{transform:translateY(-2px) rotate(2deg)} }
    .mk-dragon-flight { position:fixed; z-index:1000000; pointer-events:none; font-size:clamp(34px,6vw,58px); line-height:1; filter:drop-shadow(0 0 12px #ff9d42); animation:mkDragonFly 1.35s cubic-bezier(.2,.65,.25,1) forwards; }
    @keyframes mkDragonFly { 0%{opacity:0;transform:translate(35vw,35px) scale(.45) rotate(-12deg)} 12%{opacity:1} 48%{transform:translate(0,-48px) scale(1.12) rotate(8deg)} 100%{opacity:0;transform:translate(-85vw,-12px) scale(.72) rotate(-8deg)} }
    .mk-dragon-trail { position:fixed;z-index:999999;pointer-events:none;width:7px;height:7px;border-radius:50%;background:#ffbd59;box-shadow:0 0 13px 5px #ff7a32;animation:mkTrail .7s ease-out forwards; }
    @keyframes mkTrail { to{opacity:0;transform:translate(-35px,22px) scale(0)} }
    .mk-shop-pulse { animation:mkShopPulse .42s ease-out; }
    @keyframes mkShopPulse { 0%{transform:scale(1)} 35%{transform:scale(.96);filter:brightness(1.45)} 100%{transform:scale(1);filter:none} }
    .upgrade-btn:not(:disabled),.small-btn:not(:disabled),.primary-btn:not(:disabled) { -webkit-tap-highlight-color:transparent; }
    .upgrade-btn.mk-shop-pulse::after,.small-btn.mk-shop-pulse::after,.primary-btn.mk-shop-pulse::after { content:'✦';position:absolute;right:14px;top:10px;color:#ffe5a0;font-size:22px;animation:mkStarPop .55s ease-out forwards;pointer-events:none; }
    .upgrade-btn,.small-btn,.primary-btn { position:relative;overflow:hidden; }
    @keyframes mkStarPop { from{opacity:0;transform:scale(.2) rotate(0)} 35%{opacity:1;transform:scale(1.4) rotate(90deg)} to{opacity:0;transform:scale(.5) rotate(180deg)} }
    @media(prefers-reduced-motion:reduce){.manul-character::before,.mk-blink{animation:none!important}.mk-dragon-flight,.mk-dragon-trail{display:none!important}}
  `;
  document.head.appendChild(style);

  // Eyelids share the exact 512x512 coordinate system as the cat artwork.
  const face = document.createElementNS('http://www.w3.org/2000/svg','svg');
  face.setAttribute('viewBox','0 0 512 512');
  face.setAttribute('class','mk-face-motion');
  face.setAttribute('aria-hidden','true');
  face.innerHTML = `
<ellipse class="mk-blink" cx="207" cy="207" rx="18" ry="15" fill="#9b8267"/>
    <ellipse class="mk-blink" cx="305" cy="207" rx="18" ry="15" fill="#9b8267" style="animation-delay:2.7s"/>
  `;
  character.appendChild(face);

  const paw = document.createElementNS('http://www.w3.org/2000/svg','svg');
  paw.setAttribute('viewBox','0 0 80 80');
  paw.setAttribute('class','mk-idle-paw');
  paw.innerHTML = '<path d="M18 48 Q12 30 27 24 Q38 18 48 29 Q61 26 66 39 Q72 57 53 66 Q31 73 18 48Z" fill="#bda487" stroke="#554333" stroke-width="4"/><ellipse cx="27" cy="26" rx="7" ry="10" fill="#cdb89b"/><ellipse cx="42" cy="20" rx="7" ry="10" fill="#cdb89b"/><ellipse cx="56" cy="28" rx="7" ry="9" fill="#cdb89b"/><path d="M29 49 Q39 37 51 49 Q49 60 40 61 Q31 60 29 49Z" fill="#8b6259"/>';
  character.appendChild(paw);

  let audioContext = null;
  let lastGrowl = 0;
  function growl() {
    const now = Date.now();
    if (now - lastGrowl < 110) return;
    lastGrowl = now;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext = audioContext || new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();
      const t = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(105 + Math.random()*18,t);
      osc.frequency.exponentialRampToValueAtTime(48,t+.24);
      filter.type='lowpass'; filter.frequency.value=360;
      gain.gain.setValueAtTime(.0001,t);
      gain.gain.exponentialRampToValueAtTime(.075,t+.035);
      gain.gain.exponentialRampToValueAtTime(.0001,t+.29);
      osc.connect(filter); filter.connect(gain); gain.connect(audioContext.destination);
      osc.start(t); osc.stop(t+.3);
    } catch (_) { /* Audio is optional; gameplay must continue. */ }
  }

  let hitTimer;
  character.addEventListener('click', function () {
    character.classList.remove('mk-hit');
    void character.offsetWidth;
    character.classList.add('mk-hit');
    growl();
    clearTimeout(hitTimer);
    hitTimer=setTimeout(()=>character.classList.remove('mk-hit'),460);
  });

  let lastActivity = Date.now();
  ['pointerdown','keydown','touchstart'].forEach(type => document.addEventListener(type,()=>{lastActivity=Date.now();},{passive:true}));
  function idleAction() {
    if (document.hidden || Date.now()-lastActivity < 12000) return;
    lastActivity=Date.now();
    const action=Math.random();
    character.classList.remove('mk-idle-wave','mk-idle-look');
    void character.offsetWidth;
    character.classList.add(action < .62 ? 'mk-idle-wave' : 'mk-idle-look');
    setTimeout(()=>character.classList.remove('mk-idle-wave','mk-idle-look'),1400);
  }
  setInterval(idleAction,13000);

  function dragonFly(target) {
    const rect=target.getBoundingClientRect();
    const dragon=document.createElement('div');
    dragon.className='mk-dragon-flight'; dragon.textContent='🐉';
    dragon.style.top=Math.max(12,Math.min(window.innerHeight-75,rect.top+rect.height/2-28))+'px';
    dragon.style.left='62vw'; document.body.appendChild(dragon);
    const trailTimer=setInterval(()=>{
      if(!dragon.isConnected){clearInterval(trailTimer);return;}
      const r=dragon.getBoundingClientRect();
      const dot=document.createElement('i'); dot.className='mk-dragon-trail';
      dot.style.left=(r.left+12+Math.random()*24)+'px'; dot.style.top=(r.top+20+Math.random()*20)+'px';
      document.body.appendChild(dot); setTimeout(()=>dot.remove(),750);
    },65);
    setTimeout(()=>{clearInterval(trailTimer);dragon.remove();},1400);
  }
  document.addEventListener('click',function(event){
    const target=event.target.closest('#btn-click,#btn-farm,#btn-ad,#btn-ad-boost,#buy-crystals,#buy-vip-effect,#btn-pass-premium,#boss-attack,.shop-item .small-btn,.pass-level .small-btn');
    if(!target || target.disabled) return;
    target.classList.remove('mk-shop-pulse'); void target.offsetWidth; target.classList.add('mk-shop-pulse');
    if(target.id==='btn-farm'||target.id==='buy-crystals'||target.id==='buy-vip-effect'||target.closest('#skins-list')) dragonFly(target);
    setTimeout(()=>target.classList.remove('mk-shop-pulse'),550);
  });

  console.log('MANUL KOMBAT: living manul animations activated');
})();
