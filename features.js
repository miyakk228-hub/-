/* MANUL KOMBAT — quests, skins, bosses, prestige, profile and season pass */
(function () {
    'use strict';
    const KEY = 'manulKombat_extra_v1';
    const today = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
    const defaults = () => ({
        date: today(), clicks: 0, earned: 0, upgrades: 0, questsClaimed: [],
        totalClicks: 0, totalEarned: 0, bossKills: 0, bossHp: 1200, bossMaxHp: 1200,
        crystals: 0, ownedSkins: ['classic'], equippedSkin: 'classic', prestige: 0,
        passXp: 0, premiumPass: false, passClaimed: [], lastCoins: 0, lastClickLevel: 1, lastFarmLevel: 0,
        totalPlaySeconds: 0
    });
    let state = defaults();
    try { state = { ...state, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (_) {}
    if (state.date !== today()) {
        state.date = today(); state.clicks = 0; state.earned = 0; state.upgrades = 0; state.questsClaimed = [];
    }
    window.ManulExtraState = state;
    const $ = id => document.getElementById(id);
    const fmt = n => Math.floor(Number(n)||0).toLocaleString('ru-RU');
    const saveExtra = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} };
    const notify = msg => { const el=document.createElement('div'); el.className='mk-toast'; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.remove(),2800); };

    // Restore extra progress after the original game save has been applied.
    if (typeof window.saveGame === 'function') {
        const originalSave = window.saveGame;
        window.saveGame = function () { originalSave(); saveExtra(); };
    }
    function restoreExtra() {
        try { state = { ...defaults(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (_) { state = defaults(); }
        if (state.date !== today()) { state.date=today(); state.clicks=0; state.earned=0; state.upgrades=0; state.questsClaimed=[]; }
        window.ManulExtraState=state;
    }
    if (typeof window.applyParsedData === 'function') {
        const originalApply = window.applyParsedData;
        window.applyParsedData = function (json) { originalApply(json); restoreExtra(); renderAll(); window.dispatchEvent(new Event('manul-game-loaded')); };
    }
    if (typeof window.updateUI === 'function') {
        const originalUpdate = window.updateUI;
        window.updateUI = function () { originalUpdate(); renderAll(); };
    }

    const skins = [
        {id:'classic',name:'Классический',emoji:'🐾',cost:0,currency:'coins',desc:'Родной манул'},
        {id:'gold',name:'Золотой регент',emoji:'👑',cost:8500,currency:'coins',desc:'Резной золотой нагрудник, корона и тяжёлые наплечники'},
        {id:'ice',name:'Болотный Мясник',emoji:'⛓️',cost:22,currency:'crystals',desc:'Ржавый шлем с рогами, цепная перевязь и бронепластины'},
        {id:'shadow',name:'Повелитель Бездны',emoji:'🌑',cost:35,currency:'crystals',desc:'Обсидиановые рога, шипастый доспех и руны Бездны'},
        {id:'cosmic',name:'Астральный Страж',emoji:'🌌',cost:55,currency:'crystals',desc:'Звёздная диадема, сегментированный нагрудник и орбитальные кольца'},
        {id:'fire',name:'Инфернальный Манул',emoji:'🔥',cost:18,currency:'crystals',desc:'Парные костяные рога, лавовые наплечники и раскалённые когти'}
    ];
    const quests = [
        {id:'q_click',title:'Разогрев',desc:'Сделай 500 кликов',goal:500,field:'clicks',reward:25},
        {id:'q_earn',title:'Запас монет',desc:'Заработай 5 000 монет',goal:5000,field:'earned',reward:40},
        {id:'q_upgrade',title:'Модернизация',desc:'Купи 4 улучшения',goal:4,field:'upgrades',reward:50}
    ];
    const passRewards = [
        {coins:100,crystals:0},{coins:150,crystals:0},{coins:0,crystals:1},{coins:250,crystals:0},{coins:350,crystals:1},
        {coins:500,crystals:0},{coins:0,crystals:1},{coins:700,crystals:0},{coins:900,crystals:2},{coins:1200,crystals:2}
    ];
    function get(id){return $(id);}
    function buySkin(id) {
        const skin=skins.find(s=>s.id===id); if(!skin) return;
        if(state.ownedSkins.includes(id)){state.equippedSkin=id;applySkin();saveExtra();renderShop();return;}
        const balance=skin.currency==='coins'?coins:state.crystals;
        if(balance<skin.cost){notify('Не хватает валюты для этого облика');return;}
        if(skin.currency==='coins') coins-=skin.cost; else state.crystals-=skin.cost;
        state.ownedSkins.push(id);state.equippedSkin=id;applySkin();saveExtra();
        if(typeof window.saveGame==='function')window.saveGame();renderAll();notify(`Облик «${skin.name}» приобретён!`);
    }
    function applySkin(){
        const el=get('manul-button');if(!el)return;
        const id=state.equippedSkin||'classic';
        el.dataset.skin=id;
        el.classList.remove('skin-gold','skin-ice','skin-shadow','skin-cosmic','skin-fire');
        if(id!=='classic')el.classList.add('skin-'+id);
        let overlay=el.querySelector('.skin-overlay');
        if(!overlay){overlay=document.createElement('span');overlay.className='skin-overlay';overlay.setAttribute('aria-hidden','true');el.appendChild(overlay);}
        const art={
          gold:`<svg viewBox="0 0 512 512"><path d="M155 145L112 65l83 42 61-65 61 65 83-42-43 80" fill="#f8d77a" stroke="#7d4b16" stroke-width="13"/><path d="M145 275L90 230l20 105 60 25M367 275l55-45-20 105-60 25" fill="#bd8732" stroke="#58340f" stroke-width="15"/><path d="M180 290L256 250l76 40-20 105H200Z" fill="#dcae43" stroke="#fff0a8" stroke-width="12"/><path d="M210 315l46-35 46 35-46 50Z" fill="#fff0a8" stroke="#8c5719" stroke-width="8"/><path d="M150 170l-28 44 45 14m195-58 28 44-45 14" fill="none" stroke="#f8d77a" stroke-width="16" stroke-linecap="round"/></svg>`,
          ice:`<svg viewBox="0 0 512 512"><path d="M160 155Q90 115 112 45Q180 58 202 135M352 155Q422 115 400 45Q332 58 310 135" fill="#7c8c58" stroke="#263322" stroke-width="17"/><path d="M145 280L78 230l25 125 76 35M367 280l67-50-25 125-76 35" fill="#58634a" stroke="#222b22" stroke-width="18"/><path d="M175 290l81-40 81 40-20 115H195Z" fill="#59604a" stroke="#b4a77b" stroke-width="14"/><path d="M256 275v120M208 310l48 35 48-35" fill="none" stroke="#d1c59a" stroke-width="11"/><path d="M145 210l-45 75m267-75 45 75M165 385l-22 52m204-52 22 52" stroke="#a8a18b" stroke-width="12"/><path d="M120 290q-35 45 10 80m252-80q35 45-10 80" fill="none" stroke="#aab28a" stroke-width="9"/></svg>`,
          shadow:`<svg viewBox="0 0 512 512"><path d="M150 160Q70 125 100 30Q175 60 205 145M362 160Q442 125 412 30Q337 60 307 145" fill="#21152f" stroke="#a66cff" stroke-width="18"/><path d="M150 275l-75-55 20 130 78 35M362 275l75-55-20 130-78 35" fill="#261b38" stroke="#8f4ee8" stroke-width="19"/><path d="M175 280l81-48 81 48-18 130H193Z" fill="#171321" stroke="#a66cff" stroke-width="15"/><path d="M256 255l-25 65 25 68 25-68Z" fill="#b57aff"/><path d="M180 190l-45 35m197-35 45 35M190 380l-25 65m147-65 25 65" stroke="#bd8cff" stroke-width="13"/><path d="M130 115l40 30m212-30-40 30" stroke="#e0c8ff" stroke-width="9"/></svg>`,
          cosmic:`<svg viewBox="0 0 512 512"><path d="M145 155l-40-75 88 25 63-70 63 70 88-25-40 75" fill="#273d78" stroke="#b9c8ff" stroke-width="15"/><circle cx="256" cy="92" r="22" fill="#fff3b0"/><path d="M145 280l-65-45 18 120 72 38m197-113 65-45-18 120-72 38" fill="#344c89" stroke="#8eacff" stroke-width="16"/><path d="M175 285l81-45 81 45-20 120H195Z" fill="#25345f" stroke="#c2d1ff" stroke-width="13"/><path d="M256 265l-25 55 25 60 25-60Z" fill="#ffe89a"/><ellipse cx="256" cy="310" rx="145" ry="48" fill="none" stroke="#bba8ff" stroke-width="8" transform="rotate(-25 256 310)"/><circle cx="118" cy="280" r="9" fill="#fff"/><circle cx="390" cy="350" r="8" fill="#fff"/></svg>`,
          fire:`<svg viewBox="0 0 512 512"><path d="M150 160Q78 100 118 28Q180 55 204 145M362 160Q434 100 394 28Q332 55 308 145" fill="#64221a" stroke="#ff8a35" stroke-width="18"/><path d="M145 280l-68-52 20 128 77 40m191-116 68-52-20 128-77 40" fill="#77291c" stroke="#ff6935" stroke-width="18"/><path d="M175 285l81-45 81 45-20 120H195Z" fill="#421c19" stroke="#ff9b42" stroke-width="15"/><path d="M256 260l-25 65 25 70 25-70Z" fill="#ffd36b"/><path d="M125 350l-45 35 58 10m249-45 45 35-58 10" fill="none" stroke="#ffb14a" stroke-width="14"/><path d="M175 190l-35 35m197-35 35 35" stroke="#ffcf70" stroke-width="12"/></svg>`
        };
        overlay.innerHTML=art[id]||'';
        overlay.style.display=art[id]?'block':'none';
    }
    function renderShop(){
        const host=get('skins-list');if(!host)return;
        host.innerHTML=skins.map(s=>{
            const owned=state.ownedSkins.includes(s.id),active=state.equippedSkin===s.id;
            const price=s.cost===0?'Бесплатно':`${s.cost} ${s.currency==='coins'?'монет':'💎'}`;
            return `<article class="shop-item ${active?'is-active':''}"><div class="skin-art skin-art-${s.id}"><span>${s.emoji}</span><i></i></div><div class="shop-item-copy"><b>${s.name}</b><small>${s.desc}</small><small>${owned?'Уже открыто':price}</small></div><button class="small-btn" data-skin="${s.id}">${active?'Выбран':owned?'Надеть':'Купить'}</button></article>`;
        }).join('');
        host.querySelectorAll('[data-skin]').forEach(b=>b.addEventListener('click',()=>buySkin(b.dataset.skin)));
    }
    function renderQuests(){
        const host=get('quests-list');if(!host)return;
        host.innerHTML=quests.map(q=>{
            const p=Math.min(q.goal,state[q.field]||0),done=p>=q.goal,claimed=state.questsClaimed.includes(q.id);
            return `<article class="quest-item"><div class="quest-top"><b>${q.title}</b><span>${fmt(p)} / ${fmt(q.goal)}</span></div><small>${q.desc}</small><div class="mini-track"><i style="width:${p/q.goal*100}%"></i></div><button class="small-btn" data-quest="${q.id}" ${!done||claimed?'disabled':''}>${claimed?'Получено':`Забрать +${q.reward}`}</button></article>`;
        }).join('');
        host.querySelectorAll('[data-quest]').forEach(b=>b.addEventListener('click',()=>claimQuest(b.dataset.quest)));
    }
    function claimQuest(id){const q=quests.find(x=>x.id===id);if(!q||state.questsClaimed.includes(id)||(state[q.field]||0)<q.goal)return;state.questsClaimed.push(id);coins+=q.reward;state.passXp+=25;saveExtra();if(window.saveGame)window.saveGame();renderAll();notify(`Задание выполнено: +${q.reward} монет`);}
    function damageBoss(){
        if(state.bossHp<=0)return;
        const damage=Math.max(1,(Number(clickPower)||1)+Math.floor((Number(manulLevel)||1)/5));
        state.bossHp=Math.max(0,state.bossHp-damage);
        if(state.bossHp===0){state.bossKills++;const reward=Math.min(500,150+state.bossKills*20);coins+=reward;state.crystals+=1;state.passXp+=80;notify(`Босс повержен! +${fmt(reward)} монет и 1 💎`);state.bossHp=state.bossMaxHp+Math.min(9000,state.bossKills*250);state.bossMaxHp=state.bossHp;}
        saveExtra();renderBoss();
    }
    function renderBoss(){const hp=get('boss-hp'),bar=get('boss-bar'),kills=get('boss-kills');if(hp)hp.textContent=`${fmt(state.bossHp)} / ${fmt(state.bossMaxHp)} HP`;if(bar)bar.style.width=`${Math.max(0,state.bossHp/state.bossMaxHp*100)}%`;if(kills)kills.textContent=fmt(state.bossKills);}
    function canPrestige(){return Number(manulLevel||1)>=100;}
    function prestige(){if(!canPrestige()){notify('Перерождение откроется на 100 уровне манула');return;}if(!confirm('Переродиться? Уровень и обычные улучшения сбросятся, постоянный бонус останется.'))return;state.prestige++;state.crystals+=10;coins=0;clickPower=1;passiveIncome=0;upgClickLevel=1;upgClickCost=120;upgFarmLevel=0;upgFarmCost=750;manulXP=0;manulLevel=1;saveExtra();if(window.saveGame)window.saveGame();if(window.updateUI)window.updateUI();notify('Перерождение! +10 💎 · постоянный бонус к клику усилен');}
    function renderPass(){const xp=state.passXp,level=Math.min(10,Math.floor(xp/100)+1),progress=Math.min(100,xp%100);const lv=get('pass-level'),bar=get('pass-bar'),host=get('pass-rewards');if(lv)lv.textContent=`Уровень пропуска ${level} / 10`;if(bar)bar.style.width=`${level>=10?100:progress}%`;if(!host)return;host.innerHTML=passRewards.map((r,i)=>{const n=i+1,unlocked=level>=n,claimed=state.passClaimed.includes(n);return `<div class="pass-level ${unlocked?'is-unlocked':''}"><b>${n}</b><small>🎁 ${r.coins?fmt(r.coins)+' монет':''} ${r.crystals?'💎 '+r.crystals:''}</small><button class="small-btn" data-pass="${n}" ${!unlocked||claimed?'disabled':''}>${claimed?'Получено':'Забрать'}</button></div>`;}).join('');host.querySelectorAll('[data-pass]').forEach(b=>b.addEventListener('click',()=>claimPass(Number(b.dataset.pass))));}
    function claimPass(n){const r=passRewards[n-1];const level=Math.min(10,Math.floor(state.passXp/100)+1);if(!r||level<n||state.passClaimed.includes(n))return;state.passClaimed.push(n);coins+=r.coins;state.crystals+=r.crystals;if(state.premiumPass){coins+=Math.round(r.coins*0.5);state.crystals+=1;}saveExtra();if(window.saveGame)window.saveGame();renderAll();notify('Награда сезонного пропуска получена!');}
    function renderProfile(){const set=(id,v)=>{const el=get(id);if(el)el.textContent=v;};set('profile-clicks',fmt(state.totalClicks));set('profile-earned',fmt(state.totalEarned));set('profile-bosses',fmt(state.bossKills));set('profile-prestige',fmt(state.prestige));set('profile-crystals',fmt(state.crystals));set('profile-level',fmt(manulLevel||1));set('profile-playtime',`${Math.floor(state.totalPlaySeconds/60)} мин.`);}
    function renderAll(){const g=get('crystal-count');if(g)g.textContent=fmt(state.crystals);const p=get('prestige-count');if(p)p.textContent=fmt(state.prestige);renderShop();renderQuests();renderBoss();renderPass();renderProfile();applySkin();}

    const clicker=get('manul-button');if(clicker)clicker.addEventListener('click',()=>{state.clicks++;state.totalClicks++;state.passXp=Math.min(1000,state.passXp+1);damageBoss();saveExtra();renderQuests();renderPass();renderProfile();});
    ['btn-click','btn-farm'].forEach(id=>{const el=get(id);if(el)el.addEventListener('click',()=>{setTimeout(()=>{const c=Number(upgClickLevel||1),f=Number(upgFarmLevel||0);if(c>state.lastClickLevel||f>state.lastFarmLevel){state.upgrades++;state.lastClickLevel=c;state.lastFarmLevel=f;saveExtra();renderQuests();renderProfile();}},0);});});
    let lastCoins=Number(coins)||0;
    setInterval(()=>{const current=Number(coins)||0;const delta=current-lastCoins;if(delta>0){state.earned+=delta;state.totalEarned+=delta;state.passXp=Math.min(1000,state.passXp+Math.min(10,Math.floor(delta/100)));renderQuests();renderPass();renderProfile();saveExtra();}lastCoins=current;if(!document.hidden)state.totalPlaySeconds++;if(state.totalPlaySeconds%10===0)saveExtra();},1000);
    const prestigeBtn=get('btn-prestige');if(prestigeBtn)prestigeBtn.addEventListener('click',prestige);
    const bossBtn=get('boss-attack');if(bossBtn)bossBtn.addEventListener('click',damageBoss);
    const passUnlock=get('btn-pass-premium');if(passUnlock)passUnlock.addEventListener('click',()=>{if(state.premiumPass){notify('Премиум-пропуск уже открыт');return;}if(state.crystals<15){notify('Нужно 15 кристаллов. Их можно получить за боссов.');return;}state.crystals-=15;state.premiumPass=true;saveExtra();renderAll();notify('Премиум-ветка открыта за 15 💎');});
    const crystalBuy=get('buy-crystals');if(crystalBuy)crystalBuy.addEventListener('click',()=>{if(coins<25000){notify('Нужно 25 000 монет');return;}coins-=25000;state.crystals+=1;saveExtra();if(window.saveGame)window.saveGame();renderAll();notify('Получен 1 кристалл!');});
    const vipBuy=get('buy-vip-effect');if(vipBuy)vipBuy.addEventListener('click',()=>{if(state.vipEffect){notify('VIP-эффект уже открыт');return;}if(state.crystals<6){notify('Нужно 6 кристаллов');return;}state.crystals-=6;state.vipEffect=true;document.body.classList.add('vip-click-effect');saveExtra();renderAll();notify('VIP-эффект клика открыт!');});
    if(state.vipEffect)document.body.classList.add('vip-click-effect');
    const adBoost=get('btn-ad-boost');if(adBoost)adBoost.addEventListener('click',()=>{if(typeof window.vkBridge==='undefined'){notify('Бонусная реклама доступна внутри VK Mini Apps');return;}window.vkBridge.send('VKWebAppShowNativeAds',{ad_format:'reward'}).then(r=>{if(r&&r.result){state.adBoostUntil=Date.now()+5*60*1000;saveExtra();notify('Доход x2 на 5 минут!');}}).catch(()=>notify('Реклама сейчас недоступна'));});
    window.addEventListener('manul-game-loaded',()=>{lastCoins=Number(coins)||0;renderAll();});
    window.ManulFeatures={state,save:saveExtra,render:renderAll,prestige,damageBoss};
    renderAll();
    console.log('MANUL KOMBAT: New game systems loaded!');
})();
