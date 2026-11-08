// ==========================================
// MANUL KOMBAT — FULL GAME.JS
// ==========================================

// ИГРОВЫЕ ПЕРЕМЕННЫЕ
let coins = 0;
let clickPower = 1;
let passiveIncome = 0;

let upgClickCost = 10;
let upgClickLevel = 1;
let upgFarmCost = 50;
let upgFarmLevel = 0;

// ЭВОЛЮЦИЯ
let manulXP = 0;
let manulLevel = 1;

const evolutionStages = [
    { level: 1, name: "Дикий манул" },
    { level: 5, name: "Боевой манул" },
    { level: 10, name: "Грозовой манул" },
    { level: 20, name: "Золотой манул" },
    { level: 35, name: "Теневой манул" },
    { level: 50, name: "Ледяной манул" },
    { level: 75, name: "Космический манул" },
    { level: 100, name: "Бог манулов" }
];

// ЭЛЕМЕНТЫ
const balanceText = document.getElementById('balance-text');
const statsText = document.getElementById('stats-text');
const manulButton = document.getElementById('manul-button');

const evolutionName = document.getElementById('evolution-name');
const evolutionLevel = document.getElementById('evolution-level');
const evolutionXP = document.getElementById('evolution-xp');
const evolutionBar = document.getElementById('evolution-bar');
const nextEvolution = document.getElementById('next-evolution');

const btnClick = document.getElementById('btn-click');
const btnFarm = document.getElementById('btn-farm');
const btnAd = document.getElementById('btn-ad');

const lblClickLvl = document.getElementById('lbl-click-lvl');
const lblClickCost = document.getElementById('lbl-click-cost');
const lblFarmLvl = document.getElementById('lbl-farm-lvl');
const lblFarmCost = document.getElementById('lbl-farm-cost');

// ==========================================
// ОПЫТ И ЭВОЛЮЦИЯ
// ==========================================

function xpForNextLevel() {
    return 100 + (manulLevel - 1) * 50;
}

function getCurrentEvolution() {
    let current = evolutionStages[0];

    for (const stage of evolutionStages) {
        if (manulLevel >= stage.level) current = stage;
    }

    return current;
}

function addExperience(amount) {
    manulXP += amount;

    while (manulXP >= xpForNextLevel()) {
        manulXP -= xpForNextLevel();
        manulLevel++;

        createFloatingText(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "LEVEL UP! " + manulLevel
        );
    }
}

function updateEvolutionUI() {
    const current = getCurrentEvolution();
    const next = evolutionStages.find(stage => stage.level > manulLevel);
    const requiredXP = xpForNextLevel();

    if (evolutionName) evolutionName.innerText = current.name;
    if (evolutionLevel) evolutionLevel.innerText = manulLevel;

    if (evolutionXP) {
        evolutionXP.innerText = manulXP + " / " + requiredXP;
    }

    if (evolutionBar) {
        evolutionBar.style.width =
            Math.min(100, (manulXP / requiredXP) * 100) + "%";
    }

    if (nextEvolution) {
        nextEvolution.innerText = next
            ? "Следующая форма: " + next.name + " — уровень " + next.level
            : "Достигнута последняя эволюция!";
    }
}

// ==========================================
// ИНТЕРФЕЙС
// ==========================================

function formatCoins(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function updateUI() {
    if (balanceText) balanceText.innerText = formatCoins(coins);

    if (statsText) {
        statsText.innerText =
            `Клик: +${clickPower} | В секунду: +${passiveIncome}`;
    }

    if (lblClickLvl) lblClickLvl.innerText = upgClickLevel;
    if (lblClickCost) lblClickCost.innerText = formatCoins(upgClickCost);
    if (lblFarmLvl) lblFarmLvl.innerText = upgFarmLevel;
    if (lblFarmCost) lblFarmCost.innerText = formatCoins(upgFarmCost);

    if (btnClick) btnClick.disabled = coins < upgClickCost;
    if (btnFarm) btnFarm.disabled = coins < upgFarmCost;

    updateEvolutionUI();
}

// ==========================================
// ВСПЛЫВАЮЩИЙ ТЕКСТ
// ==========================================

function createFloatingText(x, y, text) {
    const clickText = document.createElement('div');

    clickText.classList.add('floating-click-text');
    clickText.innerText = text;
    clickText.style.left = `${x - 15}px`;
    clickText.style.top = `${y - 20}px`;

    document.body.appendChild(clickText);

    setTimeout(() => clickText.remove(), 600);
}

// ==========================================
// ЭФФЕКТЫ УДАРА
// ==========================================

function createHitEffect(x, y) {
    const arena = document.querySelector('.manul-clicker-container');

    if (arena) {
        arena.classList.remove('hit-shake');
        void arena.offsetWidth;
        arena.classList.add('hit-shake');

        setTimeout(() => {
            arena.classList.remove('hit-shake');
        }, 250);
    }

    const ring = document.createElement('div');

    ring.className = 'hit-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;

    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 450);

    for (let i = 0; i < 8; i++) {
        const spark = document.createElement('div');

        spark.className = 'hit-spark';

        const angle = (Math.PI * 2 * i) / 8;
        const distance = 45 + Math.random() * 35;

        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;

        spark.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
        spark.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);

        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 550);
    }
}

// ==========================================
// КОМБО
// ==========================================

let comboCount = 0;
let comboResetTimer = null;
let comboIndicator = null;

function updateComboDisplay(multiplier) {
    const arena = document.querySelector('.manul-clicker-container');
    if (!arena) return;

    if (!comboIndicator) {
        comboIndicator = document.createElement('div');
        comboIndicator.className = 'combo-indicator';
        arena.appendChild(comboIndicator);
    }

    if (comboCount >= 20) {
        comboIndicator.innerText = `RAGE MODE x${multiplier}`;
        comboIndicator.classList.add('rage');

        if (manulButton) manulButton.classList.add('rage-mode');

    } else if (comboCount >= 5) {
        comboIndicator.innerText = `COMBO x${multiplier}`;
        comboIndicator.classList.remove('rage');

        if (manulButton) manulButton.classList.remove('rage-mode');

    } else {
        comboIndicator.innerText = `${comboCount} / 5`;
        comboIndicator.classList.remove('rage');

        if (manulButton) manulButton.classList.remove('rage-mode');
    }

    comboIndicator.style.display = 'block';
}

function resetCombo() {
    comboCount = 0;

    if (comboIndicator) {
        comboIndicator.style.display = 'none';
        comboIndicator.classList.remove('rage');
    }

    if (manulButton) {
        manulButton.classList.remove('rage-mode');
    }
}

// ==========================================
// ОСНОВНОЙ КЛИК
// ==========================================

function processClick(e) {
    comboCount++;

    let comboMultiplier = 1;

    if (comboCount >= 20) {
        comboMultiplier = 5;
    } else if (comboCount >= 10) {
        comboMultiplier = 3;
    } else if (comboCount >= 5) {
        comboMultiplier = 2;
    }

    const reward =
        (clickPower + Math.floor(manulLevel / 5)) * comboMultiplier;

    coins += reward;

    addExperience(1);
    updateComboDisplay(comboMultiplier);

    clearTimeout(comboResetTimer);
    comboResetTimer = setTimeout(resetCombo, 2000);

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
    }

    createFloatingText(clientX, clientY, `+${reward}`);
    createHitEffect(clientX, clientY);

    updateUI();
}

if (manulButton) {
    manulButton.addEventListener('click', processClick);
}

// ==========================================
// УЛУЧШЕНИЯ
// ==========================================

if (btnClick) {
    btnClick.addEventListener('click', () => {
        if (coins >= upgClickCost) {
            coins -= upgClickCost;
            upgClickLevel++;
            clickPower = upgClickLevel;
            upgClickCost = Math.floor(upgClickCost * 1.5);

            saveGame();
            updateUI();
        }
    });
}

if (btnFarm) {
    btnFarm.addEventListener('click', () => {
        if (coins >= upgFarmCost) {
            coins -= upgFarmCost;
            passiveIncome += 2;
            upgFarmLevel++;
            upgFarmCost = Math.floor(upgFarmCost * 1.6);

            saveGame();
            updateUI();
        }
    });
}

// ==========================================
// ПАССИВНЫЙ ДОХОД
// ==========================================

setInterval(() => {
    coins += passiveIncome;
    updateUI();
}, 1000);

// ==========================================
// СОХРАНЕНИЕ
// ==========================================

function saveGame() {
    const gameData = {
        coins,
        clickPower,
        passiveIncome,
        upgClickCost,
        upgClickLevel,
        upgFarmCost,
        upgFarmLevel,
        manulXP,
        manulLevel
    };

    const stringData = JSON.stringify(gameData);

    localStorage.setItem('manulKombatVK_save', stringData);

    if (typeof vkBridge !== 'undefined') {
        vkBridge.send('VKWebAppStorageSet', {
            key: 'manul_save',
            value: stringData
        })
        .then(() => console.log('Успешно сохранено в VK!'))
        .catch(e => console.error('Ошибка сохранения VK:', e));
    }
}

function loadGame() {
    if (typeof vkBridge !== 'undefined') {
        vkBridge.send('VKWebAppStorageGet', {
            keys: ['manul_save']
        })
        .then(data => {
            if (data.keys && data.keys[0].value) {
                applyParsedData(data.keys[0].value);
            } else {
                loadLocalBackup();
            }
        })
        .catch(() => loadLocalBackup());

    } else {
        loadLocalBackup();
    }
}

function loadLocalBackup() {
    const savedData = localStorage.getItem('manulKombatVK_save');

    if (savedData) {
        applyParsedData(savedData);
    }
}

function applyParsedData(jsonString) {
    try {
        const data = JSON.parse(jsonString);

        coins = Number(data.coins) || 0;
        clickPower = Number(data.clickPower) || 1;
        passiveIncome = Number(data.passiveIncome) || 0;

        upgClickCost = Number(data.upgClickCost) || 10;
        upgClickLevel = Number(data.upgClickLevel) || 1;

        upgFarmCost = Number(data.upgFarmCost) || 50;
        upgFarmLevel = Number(data.upgFarmLevel) || 0;

        manulXP = Math.max(0, Number(data.manulXP) || 0);
        manulLevel = Math.max(1, Number(data.manulLevel) || 1);

    } catch (e) {
        console.error(e);
    }

    updateUI();
}

// ==========================================
// VK И РЕКЛАМА
// ==========================================

if (typeof vkBridge !== 'undefined') {
    vkBridge.send('VKWebAppInit')
    .then(() => {
        console.log('VK Bridge готов!');

        loadGame();

        vkBridge.send('VKWebAppShowNativeAds', {
            ad_format: 'interstitial'
        }).catch(e => console.log(e));
    });

    setInterval(() => {
        vkBridge.send('VKWebAppShowNativeAds', {
            ad_format: 'interstitial'
        }).catch(e => console.log(e));
    }, 120000);

} else {
    setTimeout(loadGame, 100);
}

function showVKRewardVideoAd() {
    if (typeof vkBridge !== 'undefined') {
        vkBridge.send('VKWebAppShowNativeAds', {
            ad_format: 'reward'
        })
        .then(data => {
            if (data.result) {
                coins += 500;
                saveGame();
                updateUI();
                alert("Бонус +500 коинов зачислен!");
            }
        })
        .catch(e => alert("Реклама пока недоступна"));

    } else {
        coins += 500;
        saveGame();
        updateUI();

        createFloatingText(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "+500 Бонус!"
        );
    }
}

if (btnAd) {
    btnAd.addEventListener('click', showVKRewardVideoAd);
}

setInterval(saveGame, 5000);

// ==========================================
// ВИЗУАЛЬНАЯ ЭВОЛЮЦИЯ МАНУЛА
// ==========================================

function applyManulEvolution() {
    const manul = document.querySelector('.manul-character');
    if (!manul) return;

    let form = 'wild';
    let glow = 'none';

    if (manulLevel >= 100) {
        form = 'god';
        glow = 'drop-shadow(0 0 30px gold)';
    } else if (manulLevel >= 75) {
        form = 'cosmic';
        glow = 'drop-shadow(0 0 25px violet)';
    } else if (manulLevel >= 50) {
        form = 'ice';
        glow = 'drop-shadow(0 0 20px cyan)';
    } else if (manulLevel >= 35) {
        form = 'shadow';
        glow = 'drop-shadow(0 0 20px purple)';
    } else if (manulLevel >= 20) {
        form = 'gold';
        glow = 'drop-shadow(0 0 20px gold)';
    } else if (manulLevel >= 10) {
        form = 'thunder';
        glow = 'drop-shadow(0 0 18px deepskyblue)';
    } else if (manulLevel >= 5) {
        form = 'battle';
        glow = 'drop-shadow(0 0 15px red)';
    }

    manul.classList.remove(
        'evo-wild', 'evo-battle', 'evo-thunder', 'evo-gold',
        'evo-shadow', 'evo-ice', 'evo-cosmic', 'evo-god'
    );

    manul.classList.add('evo-' + form);
    manul.style.filter = glow;
}

setInterval(applyManulEvolution, 500);

// ==========================================
// ЗАПРЕТ ВЫДЕЛЕНИЯ ТЕКСТА
// ==========================================

const noSelectStyle = document.createElement('style');

noSelectStyle.textContent = `
    * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-tap-highlight-color: transparent;
    }

    img {
        -webkit-user-drag: none;
        user-drag: none;
        pointer-events: none;
    }

    body {
        -webkit-touch-callout: none;
    }
`;

document.head.appendChild(noSelectStyle);

document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});

// ==========================================
// EVOLUTION FX — АУРЫ И ПОВЫШЕНИЕ УРОВНЯ
// ==========================================

(function () {
    if (window.manulEvolutionFXLoaded) return;
    window.manulEvolutionFXLoaded = true;

    const style = document.createElement('style');

    style.textContent = `
        .manul-character {
            position: relative;
            isolation: isolate;
            transition: filter 0.4s ease;
        }

        .manul-character::after {
            content: "";
            position: absolute;
            inset: -18px;
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.65;
            animation: manulAuraPulse 2s ease-in-out infinite;
        }

        .manul-character.evo-wild::after {
            box-shadow: 0 0 15px #aaaaaa;
        }

        .manul-character.evo-battle::after {
            box-shadow: 0 0 25px #ff3333, 0 0 45px #ff0000;
        }

        .manul-character.evo-thunder::after {
            box-shadow: 0 0 25px #00ccff, 0 0 50px #0088ff;
        }

        .manul-character.evo-gold::after {
            box-shadow: 0 0 30px #ffd700, 0 0 55px #ffaa00;
        }

        .manul-character.evo-shadow::after {
            box-shadow: 0 0 30px #9900ff, 0 0 55px #440077;
        }

        .manul-character.evo-ice::after {
            box-shadow: 0 0 30px #66ddff, 0 0 55px #0088ff;
        }

        .manul-character.evo-cosmic::after {
            box-shadow: 0 0 35px #cc00ff, 0 0 65px #4400ff;
        }

        .manul-character.evo-god::after {
            box-shadow: 0 0 40px #fff000, 0 0 80px #ff9900;
        }

        @keyframes manulAuraPulse {
            0%, 100% {
                transform: scale(0.94);
                opacity: 0.45;
            }
            50% {
                transform: scale(1.12);
                opacity: 0.9;
            }
        }

        .manul-level-banner {
            position: fixed;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%) scale(0.5);
            z-index: 99999;
            color: #ffd700;
            font-size: clamp(28px, 7vw, 55px);
            font-weight: 900;
            text-shadow: 0 0 10px #ff8800, 0 0 25px #ff4400;
            pointer-events: none;
            white-space: nowrap;
            animation: manulLevelUp 1.5s ease-out forwards;
        }

        @keyframes manulLevelUp {
            0% {
                opacity: 0;
                transform: translate(-50%, -30%) scale(0.4);
            }
            20% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2);
            }
            75% {
                opacity: 1;
                transform: translate(-50%, -70%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -100%) scale(0.8);
            }
        }

        .manul-level-flash {
            position: fixed;
            inset: 0;
            z-index: 99990;
            pointer-events: none;
            background: radial-gradient(circle, rgba(255,215,0,0.35), transparent 70%);
            animation: manulFlash 0.7s ease-out forwards;
        }

        @keyframes manulFlash {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        .manul-level-particle {
            position: fixed;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: #ffd700;
            box-shadow: 0 0 12px #ffaa00;
            z-index: 99995;
            pointer-events: none;
            animation: manulParticle 0.9s ease-out forwards;
        }

        @keyframes manulParticle {
            from {
                opacity: 1;
                transform: translate(0, 0) scale(1);
            }
            to {
                opacity: 0;
                transform: translate(var(--dx), var(--dy)) scale(0);
            }
        }
    `;

    document.head.appendChild(style);

    function showManulLevelUp(level) {
        const banner = document.createElement('div');

        banner.className = 'manul-level-banner';
        banner.textContent = 'LEVEL UP! ' + level;

        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 1600);

        const flash = document.createElement('div');
        flash.className = 'manul-level-flash';

        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 800);

        const character = document.querySelector('.manul-character');
        const arena = document.querySelector('.manul-clicker-container');
        const rect = (character || arena || document.body).getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 24; i++) {
            const particle = document.createElement('div');
            particle.className = 'manul-level-particle';

            const angle = Math.PI * 2 * i / 24;
            const distance = 70 + Math.random() * 100;

            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }

    const originalAddExperience = addExperience;

    addExperience = function (amount) {
        const previousLevel = manulLevel;

        originalAddExperience(amount);

        if (manulLevel > previousLevel) {
            showManulLevelUp(manulLevel);
        }
    };

    console.log('MANUL KOMBAT: Evolution FX activated!');
})();

// ==========================================
// ORIGINAL MANUL CHARACTER — SVG
// ==========================================

(function () {
    const oldStyle = document.getElementById('manul-original-style');
    if (oldStyle) oldStyle.remove();

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="fur" cx="45%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#c7ae8b"/>
          <stop offset="65%" stop-color="#8d755e"/>
          <stop offset="100%" stop-color="#514337"/>
        </radialGradient>
        <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d6c2a1"/>
          <stop offset="100%" stop-color="#8e7862"/>
        </linearGradient>
        <radialGradient id="eye">
          <stop offset="0%" stop-color="#dfff75"/>
          <stop offset="100%" stop-color="#829d25"/>
        </radialGradient>
      </defs>

      <path d="M365 345 C455 350 470 425 407 438 C370 447 346 422 370 400"
        fill="none" stroke="#655344" stroke-width="48" stroke-linecap="round"/>
      <path d="M400 385 Q420 395 433 402 M390 413 Q412 420 425 421"
        fill="none" stroke="#30271f" stroke-width="10" stroke-linecap="round"/>

      <path d="M112 320 Q85 275 125 244 Q155 204 211 218 Q270 188 331 222 Q397 222 417 280 Q448 342 405 395 Q370 444 256 439 Q142 445 105 390 Q80 357 112 320Z"
        fill="url(#fur)" stroke="#46392e" stroke-width="8"/>

      <g fill="none" stroke="#d3b995" stroke-width="7" stroke-linecap="round" opacity=".65">
        <path d="M120 300 l-18 19 M139 275 l-17 13"/>
        <path d="M168 241 l-12 -17 M195 235 l-5 -20"/>
        <path d="M337 246 l15 -17 M379 269 l19 -12"/>
        <path d="M395 323 l19 8 M387 372 l17 13"/>
        <path d="M142 393 l-15 15 M183 421 l-8 13"/>
        <path d="M315 423 l8 13 M359 408 l16 10"/>
      </g>

      <g fill="none" stroke="#40352b" stroke-width="12" stroke-linecap="round" opacity=".8">
        <path d="M160 260 Q180 280 185 302"/>
        <path d="M211 237 Q228 262 226 285"/>
        <path d="M277 235 Q263 260 269 283"/>
        <path d="M331 250 Q310 274 316 298"/>
      </g>

      <path d="M133 367 Q117 410 155 432 Q188 447 207 421 L207 390Z"
        fill="#a18a70" stroke="#493c30" stroke-width="7"/>
      <path d="M306 392 Q304 429 342 437 Q381 440 391 408 L372 375Z"
        fill="#a18a70" stroke="#493c30" stroke-width="7"/>

      <g fill="none" stroke="#40352b" stroke-width="9" stroke-linecap="round">
        <path d="M143 390 l20 8 M146 410 l19 7"/>
        <path d="M333 403 l21 8 M331 421 l20 7"/>
      </g>

      <path d="M137 235 Q112 187 137 130 Q149 94 190 112 Q251 70 321 110 Q363 92 385 133 Q407 183 375 238 Q351 302 256 315 Q162 302 137 235Z"
        fill="url(#face)" stroke="#46392e" stroke-width="9"/>

      <path d="M145 166 Q112 100 145 83 Q179 85 190 137Z"
        fill="#77604b" stroke="#44362c" stroke-width="8"/>
      <path d="M367 166 Q400 100 367 83 Q333 85 322 137Z"
        fill="#77604b" stroke="#44362c" stroke-width="8"/>

      <path d="M147 130 Q144 103 157 110 L171 143Z" fill="#b88c80"/>
      <path d="M365 130 Q368 103 355 110 L341 143Z" fill="#b88c80"/>

      <g fill="none" stroke="#493b30" stroke-width="13" stroke-linecap="round">
        <path d="M216 119 Q224 145 212 164"/>
        <path d="M256 109 Q256 137 256 158"/>
        <path d="M296 119 Q288 145 300 164"/>
      </g>

      <path d="M145 205 Q105 225 148 263 Q178 283 203 256Z" fill="#d6c4a7" opacity=".9"/>
      <path d="M367 205 Q407 225 364 263 Q334 283 309 256Z" fill="#d6c4a7" opacity=".9"/>

      <g fill="none" stroke="#514337" stroke-width="10" stroke-linecap="round">
        <path d="M151 211 Q174 221 183 239"/>
        <path d="M143 231 Q162 237 173 252"/>
        <path d="M361 211 Q338 221 329 239"/>
        <path d="M369 231 Q350 237 339 252"/>
      </g>

      <ellipse cx="205" cy="206" rx="24" ry="17" fill="#e9dfc9"/>
      <ellipse cx="307" cy="206" rx="24" ry="17" fill="#e9dfc9"/>
      <ellipse cx="207" cy="207" rx="13" ry="14" fill="url(#eye)"/>
      <ellipse cx="305" cy="207" rx="13" ry="14" fill="url(#eye)"/>
      <ellipse cx="207" cy="207" rx="5" ry="12" fill="#17140f"/>
      <ellipse cx="305" cy="207" rx="5" ry="12" fill="#17140f"/>

      <g fill="white">
        <circle cx="211" cy="201" r="4"/>
        <circle cx="309" cy="201" r="4"/>
      </g>

      <ellipse cx="256" cy="249" rx="46" ry="32" fill="#e0ceb4"/>
      <path d="M243 241 Q256 229 269 241 Q267 254 256 257 Q245 254 243 241Z" fill="#49352f"/>

      <path d="M256 256 Q255 275 237 278 M256 256 Q257 275 275 278"
        fill="none" stroke="#49352f" stroke-width="5" stroke-linecap="round"/>

      <g fill="none" stroke="#eee0c9" stroke-width="3" stroke-linecap="round">
        <path d="M220 254 Q183 246 163 258"/>
        <path d="M220 264 Q184 265 165 278"/>
        <path d="M292 254 Q329 246 349 258"/>
        <path d="M292 264 Q328 265 347 278"/>
      </g>

      <g fill="none" stroke="#e0c9a7" stroke-width="4" stroke-linecap="round" opacity=".7">
        <path d="M178 294 l-12 12 M195 302 l-7 13"/>
        <path d="M334 294 l12 12 M317 302 l7 13"/>
        <path d="M229 307 l-4 12 M282 307 l4 12"/>
      </g>
    </svg>`;

    const image = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

    const style = document.createElement('style');
    style.id = 'manul-original-style';

    style.textContent = `
        .manul-character {
            position: relative;
            overflow: visible;
        }

        .manul-character::before {
            content: "";
            position: absolute;
            inset: -12%;
            display: block;
            background-image: url("${image}");
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            font-size: 0 !important;
            pointer-events: none;
            z-index: 2;
            filter: drop-shadow(0 8px 7px rgba(0,0,0,.45));
        }
    `;

    document.head.appendChild(style);

    console.log('MANUL KOMBAT: Original manul loaded!');
})();

// ==========================================
// LIVE CHARACTER ANIMATION
// ==========================================

(function () {
    if (window.manulLiveAnimationLoaded) return;
    window.manulLiveAnimationLoaded = true;

    const style = document.createElement('style');

    style.textContent = `
        .manul-character::before {
            animation: manulBreathing 3s ease-in-out infinite;
            transform-origin: center bottom;
            will-change: transform;
        }

        @keyframes manulBreathing {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-5px) scale(1.015); }
        }

        .manul-character.manul-clicked::before {
            animation: manulBounce 0.25s ease-out;
        }

        @keyframes manulBounce {
            0% { transform: scale(1); }
            35% { transform: scale(0.92, 0.88); }
            70% { transform: scale(1.08, 1.04); }
            100% { transform: scale(1); }
        }

        .manul-character.manul-rage::before {
            animation: manulRage 0.3s ease-in-out infinite alternate;
        }

        @keyframes manulRage {
            from { transform: scale(1) rotate(-1deg); }
            to { transform: scale(1.07) rotate(1deg); }
        }

        @media (prefers-reduced-motion: reduce) {
            .manul-character::before { animation: none !important; }
        }
    `;

    document.head.appendChild(style);

    const button = document.getElementById('manul-button');
    const character = document.querySelector('.manul-character');

    if (!button || !character) return;

    let animationTimer;

    button.addEventListener('click', function () {
        character.classList.remove('manul-clicked');
        void character.offsetWidth;
        character.classList.add('manul-clicked');

        clearTimeout(animationTimer);

        animationTimer = setTimeout(function () {
            character.classList.remove('manul-clicked');
        }, 300);

        if (comboCount >= 20) {
            character.classList.add('manul-rage');
        }
    });

    const originalResetCombo = resetCombo;

    resetCombo = function () {
        originalResetCombo();
        character.classList.remove('manul-rage');
    };

    console.log('MANUL KOMBAT: Character animations activated!');
})();

// ==========================================
// MANUL BITE — SVG COORDINATE FIX
// ==========================================

(function () {
    if (window.manulArenaLoaded) return;
    window.manulArenaLoaded = true;

    const character = document.querySelector('.manul-character');
    const button = document.getElementById('manul-button');

    if (!character || !button) return;

    character.querySelectorAll('.manul-bite-mouth').forEach(el => el.remove());

    const style = document.createElement('style');

    style.textContent = `
        .manul-character {
            position: relative !important;
            overflow: visible !important;
        }

        .manul-bite-mouth {
            position: absolute !important;
            inset: -12% !important;
            width: 124% !important;
            height: 124% !important;

            z-index: 5 !important;
            pointer-events: none !important;
            overflow: visible !important;

            opacity: 0;
            transform: scaleY(0);
            transform-origin: 50% 53%;
        }

        .manul-character.manul-biting .manul-bite-mouth {
            animation: manulSnarl 380ms ease-out forwards;
        }

        @keyframes manulSnarl {
            0% {
                opacity: 0;
                transform: scaleY(0);
            }

            25% {
                opacity: 1;
                transform: scaleY(1.25);
            }

            65% {
                opacity: 1;
                transform: scaleY(1);
            }

            100% {
                opacity: 0;
                transform: scaleY(.85);
            }
        }
    `;

    document.head.appendChild(style);

    const mouth = document.createElement('div');
    mouth.className = 'manul-bite-mouth';

    mouth.innerHTML = `
        <svg viewBox="0 0 512 512"
             width="100%"
             height="100%"
             xmlns="http://www.w3.org/2000/svg">

            <path
                d="M222 258 Q256 310 290 258 Q256 284 222 258Z"
                fill="#541016"
                stroke="#281014"
                stroke-width="5"
                stroke-linejoin="round"
            />

            <path d="M226 261 L239 281 L245 266Z" fill="#fff4dc"/>
            <path d="M286 261 L273 281 L267 266Z" fill="#fff4dc"/>
            <path d="M246 286 L256 299 L266 286Z" fill="#fff4dc"/>

            <path
                d="M232 263 Q256 278 280 263"
                fill="none"
                stroke="#e58a83"
                stroke-width="3"
            />
        </svg>
    `;

    character.appendChild(mouth);

    let biteTimer;

    button.addEventListener('click', function () {
        character.classList.remove('manul-biting');
        void character.offsetWidth;
        character.classList.add('manul-biting');

        clearTimeout(biteTimer);

        biteTimer = setTimeout(function () {
            character.classList.remove('manul-biting');
        }, 400);
    });

    console.log('MANUL KOMBAT: SVG-aligned bite activated!');
})();

// ==========================================
// RESPONSIVE FULL BATTLE ARENA
// ==========================================

(function () {
    if (document.getElementById('manul-full-arena')) return;

    const style = document.createElement('style');
    style.id = 'manul-full-arena';

    style.textContent = `
        .game-container {
            position: relative;
            isolation: isolate;
            box-sizing: border-box;
            width: min(94vw, 1250px);
            min-height: 850px;
            margin: 30px auto;
            padding: 35px 45px;
            border: 1px solid rgba(214,153,91,.3);
            border-radius: 30px;
            overflow: hidden;

            background:
                radial-gradient(ellipse at 50% 65%,
                    rgba(210,105,45,.22), transparent 45%),
                radial-gradient(ellipse at 10% 35%,
                    rgba(45,90,125,.24), transparent 40%),
                radial-gradient(ellipse at 90% 30%,
                    rgba(45,90,125,.20), transparent 40%),
                linear-gradient(180deg,
                    #111c29 0%,
                    #202a32 48%,
                    #352820 100%);

            box-shadow:
                inset 0 0 100px rgba(0,0,0,.6),
                0 0 45px rgba(0,0,0,.45);
        }

        .game-container::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;

            background:
                linear-gradient(135deg,
                    transparent 0 15%,
                    rgba(0,0,0,.32) 16% 21%,
                    transparent 22%),
                linear-gradient(225deg,
                    transparent 0 20%,
                    rgba(0,0,0,.3) 21% 27%,
                    transparent 28%),
                radial-gradient(ellipse at 50% 100%,
                    rgba(255,137,54,.2), transparent 55%);
        }

        .game-container > * {
            position: relative;
            z-index: 1;
        }

        .manul-clicker-container {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
        }

        .manul-clicker-container::after {
            display: none !important;
        }

        .game-container .arena-dust {
            position: absolute;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: rgba(255,205,145,.55);
            box-shadow: 0 0 12px rgba(255,160,80,.6);
            pointer-events: none;
            z-index: 1;
            animation: arenaDustFloat 7s ease-in-out infinite alternate;
        }

        @keyframes arenaDustFloat {
            from {
                transform: translateY(15px);
                opacity: .15;
            }
            to {
                transform: translateY(-35px);
                opacity: .65;
            }
        }

        @media (min-width: 1200px) {
            .game-container {
                width: min(92vw, 1400px);
                min-height: 900px;
                padding: 45px 65px;
                margin: 35px auto;
            }
        }

        @media (min-width: 900px) and (max-width: 1199px) {
            .game-container {
                width: 94%;
                min-height: 850px;
                padding: 35px;
            }
        }

        @media (min-width: 600px) and (max-width: 899px) {
            .game-container {
                width: 97%;
                min-height: 800px;
                padding: 25px 18px;
                margin: 15px auto;
                border-radius: 24px;
            }
        }

        @media (max-width: 599px) {
            .game-container {
                width: 100%;
                min-height: 100vh;
                min-height: 100svh;
                padding: 18px 12px;
                margin: 0;
                border-radius: 0;
            }
        }
    `;

    document.head.appendChild(style);

    const arena = document.querySelector('.game-container');

    if (arena) {
        arena.querySelectorAll('.arena-dust').forEach(item => item.remove());

        for (let i = 0; i < 24; i++) {
            const dust = document.createElement('div');
            dust.className = 'arena-dust';

            dust.style.left = (3 + Math.random() * 94) + '%';
            dust.style.top = (5 + Math.random() * 90) + '%';
            dust.style.animationDelay = (Math.random() * 7) + 's';
            dust.style.animationDuration = (5 + Math.random() * 6) + 's';

            arena.appendChild(dust);
        }
    }

    console.log('MANUL KOMBAT: Responsive arena activated!');
})();

// ==========================================
// MANUL KOMBAT — READY
// ==========================================

updateUI();

console.log('MANUL KOMBAT: Game loaded successfully!');