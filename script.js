(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  // Интро: кремовый → тёмно-зелёный → слово Sparta → занавес уходит вверх
  const intro = document.getElementById('intro');
  if (intro) {
    const root = document.documentElement;
    if (reduced) {
      intro.remove();
    } else {
      root.classList.add('is-intro');
      let closed = false;
      const finish = () => {
        if (closed) return;
        closed = true;
        clearTimeout(timer);
        intro.classList.add('is-done');
        root.classList.remove('is-intro');
        setTimeout(() => intro.remove(), 500);
      };
      const timer = setTimeout(finish, 2200);
      intro.addEventListener('click', finish);
      addEventListener('keydown', e => {
        if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') finish();
      });
      addEventListener('wheel', finish, { once: true, passive: true });
    }
  }

  // Тема: всегда тёмная (light режим удалён вместе с кнопкой)
  document.documentElement.dataset.theme = 'dark';

  // Переключение языков через dropdown
  const langToggle = document.getElementById('langToggle');
  const langMenu = document.getElementById('langMenu');
  const langOpts = document.querySelectorAll('.lang-opt');
  const langText = document.querySelector('.nav__lang-text');
  const langNames = { ru: 'РУ', en: 'EN', hy: 'ՀՅ' };

  // localStorage бросает SecurityError, если браузер блокирует данные сайта —
  // язык тогда просто не запоминается между визитами, но переключение работает
  const store = {
    get(key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (e) { /* not persisted */ }
    }
  };

  let currentLang = store.get('sparta-lang') || 'ru';
  if (!langNames[currentLang]) currentLang = 'ru';

  const closeLangMenu = () => {
    if (!langMenu || !langToggle) return;
    langMenu.setAttribute('data-open', 'false');
    langToggle.setAttribute('aria-expanded', 'false');
  };

  if (langToggle && langMenu && langText) {
    langText.textContent = langNames[currentLang];
    const activeOpt = document.querySelector('.lang-opt[data-lang="' + currentLang + '"]');
    if (activeOpt) activeOpt.setAttribute('data-active', 'true');

    langToggle.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = langMenu.getAttribute('data-open') === 'true';
      if (isOpen) {
        closeLangMenu();
      } else {
        langMenu.setAttribute('data-open', 'true');
        langToggle.setAttribute('aria-expanded', 'true');
      }
    });

    langOpts.forEach(opt => {
      opt.addEventListener('click', e => {
        e.stopPropagation();
        langOpts.forEach(o => o.removeAttribute('data-active'));
        opt.setAttribute('data-active', 'true');
        currentLang = opt.dataset.lang;
        langText.textContent = langNames[currentLang];
        store.set('sparta-lang', currentLang);
        updatePageLanguage(currentLang);
        closeLangMenu();
      });
    });

    document.addEventListener('click', closeLangMenu);
  }

  // Локализация при загрузке
  updatePageLanguage(currentLang);

  // Хук для админ-режима: он подменяет тексты и должен уметь перерисовать страницу
  window.SPARTA = {
    getLang: function () { return currentLang; },
    relang: function () { updatePageLanguage(currentLang); }
  };

  function updatePageLanguage(lang) {
    if (typeof translations === 'undefined') return;
    const t = translations[lang] || translations.ru;

    document.documentElement.lang = lang;
    document.title = t['page-title'] || document.title;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = t[el.dataset.i18n];
      if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const value = t[el.dataset.i18nPlaceholder];
      if (value !== undefined) el.placeholder = value;
    });

    // год в подвале переписывается вместе с текстом — возвращаем актуальный
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  // Прилипающая шапка
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  // Мобильное меню
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');
  const closeMenu = () => {
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', e => { if (e.target.tagName === 'A') closeMenu(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Появление блоков + запуск счётчиков
  const io = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      obs.unobserve(entry.target);
      const counter = entry.target.querySelector('[data-count]');
      if (counter) animateCount(counter);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -40px' });

  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 70}ms`;
    io.observe(el);
  });

  function animateCount(el) {
    const target = Number(el.dataset.count) || 0;
    if (reduced) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Форма обратной связи — письма уходят на почту команды через FormSubmit
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/info.sparta.solutions@gmail.com';
  const form = document.getElementById('form');
  const status = document.getElementById('formStatus');
  const submitBtn = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const valid = data.get('name').trim() && /\S+@\S+\.\S+/.test(data.get('email')) && data.get('msg').trim();
    status.classList.toggle('is-error', !valid);
    const t = (typeof translations !== 'undefined' && translations[currentLang]) || {};
    if (!valid) {
      status.textContent = t['form-error'] || 'Проверьте поля: имя, корректный e-mail и сообщение обязательны.';
      return;
    }

    // Служебные поля FormSubmit: тема письма и отключение его собственной страницы-заглушки
    data.append('_subject', 'SPARTA — заявка с сайта: ' + data.get('topic'));
    data.append('_template', 'table');

    status.classList.remove('is-error');
    status.textContent = t['form-sending'] || 'Отправляем…';
    submitBtn.disabled = true;

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    }).then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(() => {
      status.classList.remove('is-error');
      status.textContent = t['form-success'] || 'Заявка отправлена. Мы ответим в течение рабочего дня.';
      form.reset();
    }).catch(() => {
      status.classList.add('is-error');
      status.textContent = t['form-error-network'] || 'Не удалось отправить. Напишите нам на info.sparta.solutions@gmail.com';
    }).then(() => {
      submitBtn.disabled = false;
    });
  });

  // Параллакс фоновой графики первого экрана
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg && !reduced && matchMedia('(min-width: 941px)').matches) {
    const layers = [...heroBg.querySelectorAll('.hero__obj')];
    let ticking = false;

    addEventListener('pointermove', e => {
      if (ticking) return;
      ticking = true;
      const dx = (e.clientX / innerWidth - 0.5) * 2;
      const dy = (e.clientY / innerHeight - 0.5) * 2;
      requestAnimationFrame(() => {
        layers.forEach((el, i) => {
          const d = (i + 1) * 9;
          el.style.transform = 'translate(' + (dx * d) + 'px,' + (dy * d * 0.4) + 'px)';
        });
        ticking = false;
      });
    }, { passive: true });
  }
})();
