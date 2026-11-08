/* ============================================================
   Markiz Launcher — скрипты
   ============================================================ */

(() => {
  'use strict';

  /* ---------- 1. Меню на мобильных ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    if (!burger || !navLinks) return;
    burger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
  };

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      navLinks.classList.toggle('is-open', !open);
    });
    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  /* ---------- 2. Табы Windows / Linux ---------- */
  const tabs = Array.from(document.querySelectorAll('.seg'));

  const selectTab = (name) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      const panel = document.getElementById('panel-' + tab.dataset.tab);
      if (panel) {
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      }
    });
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => selectTab(tab.dataset.tab)));

  // Если открыто на Linux — сразу показываем его инструкцию
  const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  if (/linux/i.test(platform) && !/android/i.test(navigator.userAgent)) {
    selectTab('linux');
  }

  /* ---------- 3. Копирование команд ---------- */
  document.querySelectorAll('.copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const code = btn.closest('.code')?.querySelector('code');
      if (!code) return;
      const text = code.innerText.trim();

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch { /* no-op */ }
        ta.remove();
      }

      const prev = btn.innerHTML;
      btn.classList.add('is-done');
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 13 4.5 4.5L19 7"/></svg>';
      setTimeout(() => {
        btn.classList.remove('is-done');
        btn.innerHTML = prev;
      }, 1600);
    });
  });

  /* ---------- 4. Появление блоков при скролле ---------- */
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealItems.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
    );
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- 5. Плавное затемнение шапки при скролле ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const setNavState = () => {
      nav.style.borderBottomColor = window.scrollY > 8 ? 'rgba(255,255,255,.12)' : 'transparent';
    };
    setNavState();
    window.addEventListener('scroll', setNavState, { passive: true });
  }

  /* ---------- 6. Год в футере ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- 7. FAQ: открыт только один вопрос ---------- */
  const questions = Array.from(document.querySelectorAll('.qa'));
  questions.forEach((qa) => {
    qa.addEventListener('toggle', () => {
      if (!qa.open) return;
      questions.forEach((other) => { if (other !== qa) other.open = false; });
    });
  });

  /* ---------- 8. Telegram: предупреждение, если канал не настроен ---------- */
  document.querySelectorAll('[data-telegram-link]').forEach((a) => {
    if (a.href.includes('TELEGRAM_CHANNEL')) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        console.warn('Укажите username Telegram-канала в index.html (вместо TELEGRAM_CHANNEL).');
      });
    }
  });
})();
