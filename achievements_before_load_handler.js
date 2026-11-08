(function () {
    'use strict';

    const STORAGE_KEY = 'manulKombat_achievements_v1';

    const definitions = [
        // Клики
        { id: 'first_click', title: 'Первый удар', description: 'Совершить первый клик', goal: 1, reward: 25, type: 'clicks' },
        { id: 'fighter', title: 'Боец', description: 'Совершить 100 кликов', goal: 100, reward: 100, type: 'clicks' },
        { id: 'destroyer', title: 'Машина разрушения', description: 'Совершить 1 000 кликов', goal: 1000, reward: 500, type: 'clicks' },
        { id: 'legend', title: 'Легенда', description: 'Совершить 10 000 кликов', goal: 10000, reward: 5000, type: 'clicks' },
        { id: 'click_250', title: 'Разминка', description: 'Совершить 250 кликов', goal: 250, reward: 150, type: 'clicks' },
        { id: 'click_500', title: 'Неутомимый', description: 'Совершить 500 кликов', goal: 500, reward: 250, type: 'clicks' },
        { id: 'click_2500', title: 'Кулак ярости', description: 'Совершить 2 500 кликов', goal: 2500, reward: 1000, type: 'clicks' },
        { id: 'click_5000', title: 'Ураган', description: 'Совершить 5 000 кликов', goal: 5000, reward: 2000, type: 'clicks' },
        { id: 'click_7500', title: 'Мастер комбо', description: 'Совершить 7 500 кликов', goal: 7500, reward: 3000, type: 'clicks' },
        { id: 'click_25000', title: 'Повелитель арены', description: 'Совершить 25 000 кликов', goal: 25000, reward: 10000, type: 'clicks' },
        { id: 'click_50000', title: 'Живая легенда', description: 'Совершить 50 000 кликов', goal: 50000, reward: 20000, type: 'clicks' },
        { id: 'click_100000', title: 'Бесконечная ярость', description: 'Совершить 100 000 кликов', goal: 100000, reward: 40000, type: 'clicks' },
        { id: 'click_500000', title: 'Абсолютный чемпион', description: 'Совершить 500 000 кликов', goal: 500000, reward: 100000, type: 'clicks' },

        // Сила клика
        { id: 'first_upgrade', title: 'Первое улучшение', description: 'Купить первое улучшение силы клика', goal: 2, reward: 100, type: 'upgrade' },
        { id: 'power_5', title: 'Тяжёлый удар', description: 'Достичь 5 уровня силы клика', goal: 5, reward: 300, type: 'upgrade' },
        { id: 'power_10', title: 'Сокрушитель', description: 'Достичь 10 уровня силы клика', goal: 10, reward: 750, type: 'upgrade' },
        { id: 'power_25', title: 'Стальная лапа', description: 'Достичь 25 уровня силы клика', goal: 25, reward: 2000, type: 'upgrade' },
        { id: 'power_50', title: 'Мощь титана', description: 'Достичь 50 уровня силы клика', goal: 50, reward: 7500, type: 'upgrade' },
        { id: 'power_100', title: 'Разрушитель миров', description: 'Достичь 100 уровня силы клика', goal: 100, reward: 25000, type: 'upgrade' },
        { id: 'power_200', title: 'Божественный удар', description: 'Достичь 200 уровня силы клика', goal: 200, reward: 75000, type: 'upgrade' },

        // Ферма
        { id: 'farmer', title: 'Фермер', description: 'Купить первую ферму', goal: 1, reward: 250, type: 'farm' },
        { id: 'farm_5', title: 'Начинающий магнат', description: 'Купить 5 ферм', goal: 5, reward: 500, type: 'farm' },
        { id: 'farm_10', title: 'Предприниматель', description: 'Купить 10 ферм', goal: 10, reward: 1500, type: 'farm' },
        { id: 'farm_25', title: 'Фабрика монет', description: 'Купить 25 ферм', goal: 25, reward: 5000, type: 'farm' },
        { id: 'farm_50', title: 'Империя манула', description: 'Купить 50 ферм', goal: 50, reward: 15000, type: 'farm' },
        { id: 'farm_100', title: 'Монетный магнат', description: 'Купить 100 ферм', goal: 100, reward: 50000, type: 'farm' },

        // Эволюция
        { id: 'evolution', title: 'Новая форма', description: 'Достичь 5 уровня манула', goal: 5, reward: 500, type: 'level' },
        { id: 'level_10', title: 'Пробуждение силы', description: 'Достичь 10 уровня манула', goal: 10, reward: 1000, type: 'level' },
        { id: 'level_20', title: 'Опытный воин', description: 'Достичь 20 уровня манула', goal: 20, reward: 2500, type: 'level' },
        { id: 'level_35', title: 'Повелитель эволюции', description: 'Достичь 35 уровня манула', goal: 35, reward: 5000, type: 'level' },
        { id: 'level_50', title: 'Легендарная эволюция', description: 'Достичь 50 уровня манула', goal: 50, reward: 15000, type: 'level' },
        { id: 'level_75', title: 'Высшая форма', description: 'Достичь 75 уровня манула', goal: 75, reward: 35000, type: 'level' }
    ];

    let state = {
        clicks: 0,
        unlocked: []
    };

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            state.clicks = Math.max(0, Number(parsed.clicks) || 0);
            state.unlocked = Array.isArray(parsed.unlocked) ? parsed.unlocked : [];
        }
    } catch (error) {
        console.error('Achievements load error:', error);
    }

    function saveAchievements() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Achievements save error:', error);
        }
    }

    function getProgress(achievement) {
        switch (achievement.type) {
            case 'clicks':
                return state.clicks;
            case 'upgrade':
                return upgClickLevel;
            case 'farm':
                return upgFarmLevel;
            case 'level':
                return manulLevel;
            default:
                return 0;
        }
    }

    function checkAchievements() {
        let changed = false;

        definitions.forEach(achievement => {
            if (state.unlocked.includes(achievement.id)) return;

            if (getProgress(achievement) >= achievement.goal) {
                state.unlocked.push(achievement.id);
                coins += achievement.reward;
                changed = true;

                showNotification(
                    '🏆 ' + achievement.title,
                    '+' + achievement.reward + ' монет'
                );
            }
        });

        if (changed) {
            saveAchievements();
            updateUI();
            saveGame();
        }

        renderAchievements();
    }

    function showNotification(title, reward) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML =
            '<strong>' + title + '</strong><span>' + reward + '</span>';

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('visible'), 20);
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    const styles = document.createElement('style');
    styles.textContent = `
        .achievements-button {
            width: 100%;
            min-height: 48px;
            border: 1px solid rgba(255, 255, 255, .15);
            border-radius: 14px;
            background: linear-gradient(135deg, #7651d5, #4931a0);
            color: white;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            margin-top: 2px;
        }

        .achievements-button:active {
            transform: scale(.98);
        }

        .achievements-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: rgba(0, 0, 0, .78);
            backdrop-filter: blur(8px);
        }

        .achievements-overlay.open {
            display: flex;
        }

        .achievements-modal {
            width: 100%;
            max-width: 420px;
            max-height: 85vh;
            overflow-y: auto;
            padding: 22px;
            border: 1px solid rgba(255, 255, 255, .12);
            border-radius: 22px;
            background: linear-gradient(160deg, #24213b, #12111e);
            color: white;
            box-shadow: 0 20px 70px rgba(0, 0, 0, .55);
        }

        .achievements-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 18px;
        }

        .achievements-header h2 {
            margin: 0;
            font-size: 21px;
        }

        .achievements-close {
            width: 36px;
            height: 36px;
            border: 0;
            border-radius: 10px;
            background: rgba(255, 255, 255, .1);
            color: white;
            font-size: 22px;
            cursor: pointer;
        }

        .achievement-card {
            margin-bottom: 11px;
            padding: 14px;
            border: 1px solid rgba(255, 255, 255, .09);
            border-radius: 14px;
            background: rgba(255, 255, 255, .045);
        }

        .achievement-card.completed {
            border-color: rgba(65, 210, 145, .45);
            background: rgba(65, 210, 145, .09);
        }

        .achievement-card-top {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            align-items: center;
        }

        .achievement-card strong {
            font-size: 14px;
        }

        .achievement-card p {
            margin: 6px 0 10px;
            color: #b9b7c9;
            font-size: 12px;
        }

        .achievement-reward {
            white-space: nowrap;
            color: #ffd166;
            font-size: 12px;
            font-weight: 700;
        }

        .achievement-progress {
            height: 7px;
            overflow: hidden;
            border-radius: 10px;
            background: rgba(255, 255, 255, .1);
        }

        .achievement-progress-fill {
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, #8b6cff, #45d6a0);
            transition: width .3s ease;
        }

        .achievement-status {
            display: block;
            margin-top: 7px;
            color: #aaa7bc;
            font-size: 11px;
        }

        .achievement-card.completed .achievement-status {
            color: #65e5a8;
        }

        .achievement-notification {
            position: fixed;
            z-index: 10001;
            top: 20px;
            left: 50%;
            width: max-content;
            max-width: calc(100% - 32px);
            padding: 13px 20px;
            border: 1px solid rgba(255, 209, 102, .4);
            border-radius: 14px;
            background: #29243d;
            color: white;
            text-align: center;
            box-shadow: 0 8px 30px rgba(0, 0, 0, .4);
            opacity: 0;
            transform: translate(-50%, -15px);
            transition: .3s ease;
        }

        .achievement-notification.visible {
            opacity: 1;
            transform: translate(-50%, 0);
        }

        .achievement-notification strong,
        .achievement-notification span {
            display: block;
        }

        .achievement-notification span {
            margin-top: 4px;
            color: #ffd166;
            font-size: 13px;
        }
    `;
    document.head.appendChild(styles);

    const shop = document.querySelector('.shop-container');
    if (!shop) {
        console.error('Achievements: shop container not found');
        return;
    }

    const button = document.createElement('button');
    button.className = 'achievements-button';
    button.textContent = '🏆 Достижения';
    shop.appendChild(button);

    const overlay = document.createElement('div');
    overlay.className = 'achievements-overlay';

    overlay.innerHTML = `
        <div class="achievements-modal">
            <div class="achievements-header">
                <h2>🏆 Достижения</h2>
                <button class="achievements-close" aria-label="Закрыть">×</button>
            </div>
            <div class="achievements-summary"></div>
            <div class="achievements-list"></div>
        </div>
    `;

    document.body.appendChild(overlay);

    const list = overlay.querySelector('.achievements-list');
    const summary = overlay.querySelector('.achievements-summary');

    function renderAchievements() {
        const completed = state.unlocked.length;

        summary.textContent =
            'Выполнено: ' + completed + ' / ' + definitions.length;

        list.innerHTML = definitions.map(achievement => {
            const done = state.unlocked.includes(achievement.id);
            const progress = Math.min(
                getProgress(achievement),
                achievement.goal
            );
            const percent = Math.min(
                100,
                (progress / achievement.goal) * 100
            );

            return `
                <div class="achievement-card ${done ? 'completed' : ''}">
                    <div class="achievement-card-top">
                        <strong>${achievement.title}</strong>
                        <span class="achievement-reward">🪙 ${achievement.reward}</span>
                    </div>
                    <p>${achievement.description}</p>
                    <div class="achievement-progress">
                        <div class="achievement-progress-fill"
                             style="width:${percent}%"></div>
                    </div>
                    <span class="achievement-status">
                        ${done ? '✓ Выполнено' : progress + ' / ' + achievement.goal}
                    </span>
                </div>
            `;
        }).join('');
    }

    function openModal() {
        renderAchievements();
        overlay.classList.add('open');
    }

    function closeModal() {
        overlay.classList.remove('open');
    }

    button.addEventListener('click', openModal);
    overlay.querySelector('.achievements-close').addEventListener('click', closeModal);

    overlay.addEventListener('click', event => {
        if (event.target === overlay) closeModal();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeModal();
    });

    const manulButton = document.getElementById('manul-button');

    if (manulButton) {
        manulButton.addEventListener('click', () => {
            state.clicks++;
            saveAchievements();
            checkAchievements();
        });
    }

    const clickUpgrade = document.getElementById('btn-click');
    const farmUpgrade = document.getElementById('btn-farm');

    if (clickUpgrade) {
        clickUpgrade.addEventListener('click', () => {
            checkAchievements();
        });
    }

    if (farmUpgrade) {
        farmUpgrade.addEventListener('click', () => {
            checkAchievements();
        });
    }

    renderAchievements();
    checkAchievements();

    console.log('MANUL KOMBAT: Achievements system loaded!');
})();



