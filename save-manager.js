/* MANUL KOMBAT — portable save export/import/reset */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const CORE_KEY = 'manulKombatVK_save';
  const EXTRA_KEY = 'manulKombat_extra_v1';
  const ACHIEVEMENTS_KEY = 'manulKombat_achievements_v1';
  const DAILY_AD_KEY = 'manulKombat_ad_day_v2';

  function notify(message) {
    const node = document.createElement('div');
    node.className = 'mk-toast';
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 2800);
  }

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
    catch (_) { return fallback; }
  }

  function exportSave() {
    if (typeof window.saveGame === 'function') window.saveGame();
    const payload = {
      format: 'manul-kombat-save',
      formatVersion: 1,
      gameVersion: '2.3.3',
      exportedAt: new Date().toISOString(),
      game: readJson(CORE_KEY, null),
      extra: readJson(EXTRA_KEY, {}),
      achievements: readJson(ACHIEVEMENTS_KEY, { unlocked: [], clicks: 0 }),
      dailyAds: readJson(DAILY_AD_KEY, { date: '', count: 0 })
    };
    if (!payload.game || typeof payload.game !== 'object') {
      notify('Не удалось подготовить сохранение. Сначала начни игру.');
      return;
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manul-kombat-save-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify('Сохранение экспортировано. Храни JSON-файл в надёжном месте.');
  }

  function validSave(data) {
    if (!data || data.format !== 'manul-kombat-save' || data.formatVersion !== 1) return false;
    if (!data.game || typeof data.game !== 'object') return false;
    const numeric = ['coins','clickPower','passiveIncome','upgClickCost','upgClickLevel','upgFarmCost','upgFarmLevel','manulXP','manulLevel'];
    return numeric.every(key => Number.isFinite(Number(data.game[key]))) &&
      Number(data.game.coins) >= 0 && Number(data.game.coins) <= 1e15 &&
      Number(data.game.manulLevel) >= 1 && Number(data.game.manulLevel) <= 100000 &&
      Number(data.game.upgClickLevel) >= 1 && Number(data.game.upgClickLevel) <= 100000 &&
      Number(data.game.upgFarmLevel) >= 0 && Number(data.game.upgFarmLevel) <= 100000;
  }

  async function importSave(file) {
    if (!file || file.size > 2 * 1024 * 1024) {
      notify('Файл не выбран или слишком большой (максимум 2 МБ).');
      return;
    }
    try {
      const data = JSON.parse(await file.text());
      if (!validSave(data)) throw new Error('invalid save');
      if (!confirm('Импорт заменит текущий прогресс. Продолжить?')) return;
      localStorage.setItem(CORE_KEY, JSON.stringify(data.game));
      localStorage.setItem(EXTRA_KEY, JSON.stringify(data.extra && typeof data.extra === 'object' ? data.extra : {}));
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(data.achievements && typeof data.achievements === 'object' ? data.achievements : { unlocked: [], clicks: 0 }));
      localStorage.setItem(DAILY_AD_KEY, JSON.stringify(data.dailyAds && typeof data.dailyAds === 'object' ? data.dailyAds : { date: '', count: 0 }));
      location.reload();
    } catch (_) {
      notify('Не удалось импортировать файл: формат сохранения не распознан.');
    }
  }

  function resetSave() {
    if (!confirm('Полностью удалить прогресс Manul Kombat на этом устройстве? Это действие нельзя отменить.')) return;
    [CORE_KEY, EXTRA_KEY, ACHIEVEMENTS_KEY, DAILY_AD_KEY].forEach(key => localStorage.removeItem(key));
    location.reload();
  }

  const exportButton = $('export-save');
  const importTrigger = $('import-save-trigger');
  const importInput = $('import-save-file');
  const resetButton = $('reset-save');
  if (exportButton) exportButton.addEventListener('click', exportSave);
  if (importTrigger && importInput) importTrigger.addEventListener('click', () => importInput.click());
  if (importInput) importInput.addEventListener('change', () => importSave(importInput.files && importInput.files[0]));
  if (resetButton) resetButton.addEventListener('click', resetSave);
})();
