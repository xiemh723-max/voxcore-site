/* i18n.js — 中英双语切换（localStorage 记忆，默认跟随浏览器语言） */
(function () {
  var STORAGE_KEY = 'voixcore_lang';
  var SUPPORTED = ['zh', 'en'];

  function detectLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.indexOf('zh') !== -1) return 'zh';
    return 'en';
  }

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    var switcher = document.querySelector('.lang-switch');
    if (switcher) switcher.setAttribute('aria-label', lang === 'zh' ? '切换至 English' : 'Switch to 中文');
    document.title = document.documentElement.getAttribute('data-title-' + lang) || document.title;
    document.querySelectorAll('[data-ph-zh]').forEach(function (el) {
      var ph = el.getAttribute('data-ph-' + lang);
      if (ph) el.setAttribute('placeholder', ph);
    });
    window.dispatchEvent(new CustomEvent('voixcore:lang', { detail: { lang: lang } }));
  }

  function toggleLang() {
    var current = document.documentElement.getAttribute('lang') === 'zh' ? 'en' : 'zh';
    applyLang(current);
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(detectLang());
    var switcher = document.querySelector('.lang-switch');
    if (switcher) switcher.addEventListener('click', toggleLang);
  });
})();
