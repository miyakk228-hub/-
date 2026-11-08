(function(){
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(err => console.warn('PWA offline cache unavailable:', err)));
  }
  let installPrompt = null;
  const button = document.getElementById('install-app');
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; if(button) button.hidden = false; });
  if(button) button.addEventListener('click', async () => {
    if(!installPrompt){ alert('Для установки открой игру через ярлык «Manul Kombat» или меню браузера → Установить приложение.'); return; }
    installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; button.hidden = true;
  });
  window.addEventListener('appinstalled', () => { if(button) button.hidden = true; });
})();
