/* MANUL KOMBAT — 32 achievements */
(function () {
    'use strict';
    const KEY = 'manulKombat_achievements_v1';
    const definitions = [
        ...[1, 10, 50, 100, 250, 500, 1000, 2500, 5000, 7500, 10000, 25000, 50000].map((goal, i) => ({
            id: `click_${goal}`, title: ['Первый удар','Разминка','Неутомимый','Сотня ударов','Первые 250','Полтысячи','Тысяча кликов','Кликер','Мастер кликов','Мастер комбо','Десять тысяч','Легенда арены','Повелитель кликов'][i],
            description: `Совершить ${goal.toLocaleString('ru-RU')} кликов`, type: 'clicks', goal, reward: [2,3,5,6,8,10,12,15,18,20,25,35,50][i]
        })),
        ...[{id:'first_upgrade',title:'Первое улучшение',goal:2,reward:5},{id:'power_5',title:'Сильная лапа',goal:5,reward:6},{id:'power_10',title:'Крепкий удар',goal:10,reward:8},{id:'power_25',title:'Разрушитель',goal:25,reward:12},{id:'power_50',title:'Титан',goal:50,reward:18},{id:'power_100',title:'Абсолютная сила',goal:100,reward:25},{id:'power_200',title:'Бесконечная мощь',goal:200,reward:40}].map(x=>({...x,description:`Достичь ${x.goal} уровня улучшения клика`,type:'upgrade'})),
        ...[{id:'farmer',title:'Первое хозяйство',goal:1,reward:5},{id:'farm_5',title:'Фермер',goal:5,reward:8},{id:'farm_10',title:'Агрохолдинг',goal:10,reward:12},{id:'farm_25',title:'Империя дохода',goal:25,reward:18},{id:'farm_50',title:'Фабрикант',goal:50,reward:25},{id:'farm_100',title:'Денежный магнат',goal:100,reward:40}].map(x=>({...x,description:`Построить ${x.goal} ферм`,type:'farm'})),
        ...[{id:'evolution',title:'Новая форма',goal:5,reward:8},{id:'level_10',title:'Грозовой характер',goal:10,reward:12},{id:'level_20',title:'Золотой манул',goal:20,reward:18},{id:'level_35',title:'Тень арены',goal:35,reward:25},{id:'level_50',title:'Ледяная мощь',goal:50,reward:35},{id:'level_75',title:'Космический разум',goal:75,reward:50}].map(x=>({...x,description:`Достичь ${x.goal} уровня манула`,type:'level'}))
    ];
    let state = { unlocked: [], clicks: 0 };
    try { state = { ...state, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (_) {}
    const $ = (id) => document.getElementById(id);
    function progress(a) {
        if (a.type === 'clicks') return Number(state.clicks) || 0;
        if (a.type === 'upgrade') return Number(typeof upgClickLevel !== 'undefined' ? upgClickLevel : 1);
        if (a.type === 'farm') return Number(typeof upgFarmLevel !== 'undefined' ? upgFarmLevel : 0);
        if (a.type === 'level') return Number(typeof manulLevel !== 'undefined' ? manulLevel : 1);
        return 0;
    }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }
    function check() {
        let changed = false;
        definitions.forEach(a => {
            if (!state.unlocked.includes(a.id) && progress(a) >= a.goal) {
                state.unlocked.push(a.id); changed = true;
                if (typeof coins !== 'undefined') coins += a.reward;
                toast(`🏆 ${a.title} · +${a.reward} монет`);
            }
        });
        if (changed) { save(); if (typeof window.updateUI === 'function') window.updateUI(); }
        render();
    }
    function toast(message) {
        const el = document.createElement('div'); el.className = 'mk-toast'; el.textContent = message;
        document.body.appendChild(el); setTimeout(() => el.remove(), 3000);
    }
    function render() {
        const host = $('achievements-list'); if (!host) return;
        const count = state.unlocked.length;
        const label = $('achievement-count'); if (label) label.textContent = `${count} / ${definitions.length}`;
        host.innerHTML = definitions.map(a => {
            const done = state.unlocked.includes(a.id), p = Math.min(a.goal, progress(a));
            return `<article class="achievement ${done ? 'is-done' : ''}"><div class="achievement-icon">${done ? '🏆' : '🔒'}</div><div class="achievement-copy"><b>${a.title}</b><small>${a.description}</small><div class="mini-track"><i style="width:${Math.min(100,p/a.goal*100)}%"></i></div><small>${p.toLocaleString('ru-RU')} / ${a.goal.toLocaleString('ru-RU')} · награда ${a.reward}</small></div></article>`;
        }).join('');
    }
    const clicker = document.getElementById('manul-button');
    if (clicker) clicker.addEventListener('click', () => { state.clicks++; save(); check(); });
    ['btn-click','btn-farm'].forEach(id => { const el=$(id); if(el) el.addEventListener('click',()=>setTimeout(check,0)); });
    window.addEventListener('manul-game-loaded', check);
    window.ManulAchievements = { check, render, getState:()=>({...state}), definitions };
    render(); check();
    console.log('MANUL KOMBAT: Achievements system loaded!');
})();
