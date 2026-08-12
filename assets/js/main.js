/* main.js — 导航抽屉 / 滚动阴影 / 弹窗 / 表单 / 数字滚动 */
(function () {
  var BODY = document.body;

  /* —— 移动端导航抽屉 —— */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      BODY.style.overflow = open ? 'hidden' : '';
    });
    mainNav.addEventListener('click', function (e) {
      if (e.target.closest('.nav-link')) {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        BODY.style.overflow = '';
      }
    });
  }

  /* —— 头部滚动阴影 —— */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* —— 当前导航高亮 —— */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var page = location.pathname.split('/').pop() || 'index.html';
  links.forEach(function (l) {
    var href = l.getAttribute('href');
    if (!href) return;
    var target = href.split('#')[0];
    if (target === page || (target === 'index.html' && page === '')) {
      l.classList.add('active');
    }
  });

  /* —— 弹窗 —— */
  var modal = document.querySelector('.modal');
  var modalTitle = document.querySelector('.modal-title');
  var modalSub = document.querySelector('.modal-sub');
  function openModal(labelZh, labelEn, subZh, subEn) {
    if (!modal) return;
    var lang = document.documentElement.getAttribute('lang') === 'zh' ? 'zh' : 'en';
    if (modalTitle) modalTitle.textContent = lang === 'zh' ? labelZh : labelEn;
    if (modalSub) modalSub.textContent = lang === 'zh' ? subZh : subEn;
    modal.classList.add('open');
    BODY.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    BODY.style.overflow = '';
  }
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal]');
    if (opener) {
      e.preventDefault();
      openModal(
        opener.getAttribute('data-zh-title') || '获取报价',
        opener.getAttribute('data-en-title') || 'Request a Quote',
        opener.getAttribute('data-zh-sub') || '留下需求，销售工程师 24 小时内回复',
        opener.getAttribute('data-en-sub') || 'Share your needs — an FAE replies within 24h'
      );
      return;
    }
    if (e.target.closest('.modal-close')) { closeModal(); return; }
    if (modal && e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* —— 数字滚动动画 —— */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = (val >= 100 ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        animateCount(en.target);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 }) : null;
  document.querySelectorAll('[data-count]').forEach(function (el) {
    if (io) io.observe(el);
    else el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
  });

  /* —— 联系表单：拦截提交，演示提示 —— */
  var form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      if (btn) {
        var zh = btn.getAttribute('data-zh');
        var en = btn.getAttribute('data-en');
        btn.disabled = true;
        btn.textContent = document.documentElement.getAttribute('lang') === 'zh' ? '已提交 ✓' : 'Submitted ✓';
        setTimeout(function () {
          btn.disabled = false;
          btn.textContent = document.documentElement.getAttribute('lang') === 'zh' ? zh : en;
          form.reset();
        }, 2400);
      }
    });
  }
})();
