/*
 * Админ-режим SPARTA.
 *
 * Правки уходят на сервер (server.js) и хранятся в data/content.json — их видят
 * все посетители, с любого устройства. Пароль проверяется на сервере, сессия
 * живёт в HttpOnly-куке; в этом файле нет ничего, чем можно было бы войти.
 *
 * Если сервер недоступен (например, страницу открыли как локальный файл),
 * режим редактирования просто не включится, а сайт продолжит работать на
 * последнем сохранённом content.json.
 */
(function () {
  'use strict';

  var API = './api/';

  var UI = {
    ru: {
      title: 'Вход для администратора', user: 'Логин', pass: 'Пароль',
      enter: 'Войти', cancel: 'Отмена', bad: 'Неверный логин или пароль',
      mode: 'Режим редактирования', save: 'Сохранить', exportBtn: 'Экспорт content.json',
      exit: 'Выйти', addMember: '+ Добавить участника', photo: 'Фото', del: 'Удалить',
      saved: 'Сохранено. Изменения видны всем посетителям.', saving: 'Сохраняем…',
      saveFail: 'Не удалось сохранить — проверьте соединение и попробуйте снова.',
      sessionOut: 'Сессия истекла, войдите заново.',
      tooMuch: 'Слишком много данных: удалите часть фотографий и сохраните снова.',
      netErr: 'Сервер недоступен.',
      uploadFail: 'Не удалось загрузить снимок на сервер. Проверьте соединение и попробуйте снова.',
      hint: 'Нажмите карандаш рядом с текстом — там все три языка и оформление. Изменения сразу видят все посетители.',
      newName: 'Имя Фамилия', newRole: 'Должность', newBio: 'О человеке',
      photoAdd: 'Фото', photoDel: 'Убрать фото', cropTitle: 'Кадрирование',
      cropHint: 'Перетащите снимок мышью, ползунком выберите масштаб.', zoom: 'Масштаб',
      heic: 'Этот снимок в формате HEIC — браузеры его не открывают. На айфоне: Настройки → Камера → Форматы → «Наиболее совместимый», либо отправьте фото себе в мессенджер и сохраните — оно станет JPEG.',
      badImage: 'Не удалось открыть файл. Подойдут JPG, PNG, WebP или GIF.',
      tooBig: 'Файл больше 25 МБ — выберите снимок поменьше.',
      editText: 'Редактор текста', color: 'Цвет', size: 'Размер, px', font: 'Шрифт',
      weight: 'Начертание', align: 'Выравнивание', reset: 'Сбросить', asIs: 'Как на сайте',
      normal: 'Обычное', semibold: 'Полужирное', bold: 'Жирное',
      alignLeft: 'По левому краю', alignCenter: 'По центру', alignRight: 'По правому краю',
      edName: 'Имя участника',
      confirmDel: 'Удалить участника?'
    },
    en: {
      title: 'Administrator sign-in', user: 'Login', pass: 'Password',
      enter: 'Sign in', cancel: 'Cancel', bad: 'Wrong login or password',
      mode: 'Editing mode', save: 'Save', exportBtn: 'Export content.json',
      exit: 'Sign out', addMember: '+ Add member', photo: 'Photo', del: 'Delete',
      saved: 'Saved. Everyone can see the changes now.', saving: 'Saving…',
      saveFail: 'Could not save — check your connection and try again.',
      sessionOut: 'Session expired, please sign in again.',
      tooMuch: 'Too much data: remove some photos and save again.',
      netErr: 'Server unavailable.',
      uploadFail: 'Could not upload the photo. Check your connection and try again.',
      hint: 'Press the pencil next to any text — all three languages and styling are there. Changes go live for everyone at once.',
      newName: 'Full name', newRole: 'Role', newBio: 'About the person',
      photoAdd: 'Photo', photoDel: 'Remove photo', cropTitle: 'Crop',
      cropHint: 'Drag the photo to position it, use the slider to zoom.', zoom: 'Zoom',
      heic: 'This photo is HEIC — browsers cannot open it. On iPhone: Settings → Camera → Formats → "Most Compatible", or send the photo to yourself in a messenger and save it back as JPEG.',
      badImage: 'Could not open the file. Use JPG, PNG, WebP or GIF.',
      tooBig: 'The file is over 25 MB — please pick a smaller photo.',
      editText: 'Text editor', color: 'Colour', size: 'Size, px', font: 'Font',
      weight: 'Weight', align: 'Alignment', reset: 'Reset', asIs: 'As on the site',
      normal: 'Regular', semibold: 'Semibold', bold: 'Bold',
      alignLeft: 'Left', alignCenter: 'Centre', alignRight: 'Right',
      edName: 'Member name',
      confirmDel: 'Delete this member?'
    },
    hy: {
      title: 'Ադմինիստրատորի մուտք', user: 'Մուտքանուն', pass: 'Գաղտնաբառ',
      enter: 'Մուտք', cancel: 'Չեղարկել', bad: 'Սխալ մուտքանուն կամ գաղտնաբառ',
      mode: 'Խմբագրման ռեժիմ', save: 'Պահպանել', exportBtn: 'Արտահանել content.json',
      exit: 'Ելք', addMember: '+ Ավելացնել անդամ', photo: 'Նկար', del: 'Ջնջել',
      saved: 'Պահպանվեց: Փոփոխությունները տեսնում են բոլորը:', saving: 'Պահպանվում է…',
      saveFail: 'Չհաջողվեց պահպանել — ստուգեք կապը և կրկնեք:',
      sessionOut: 'Աշխատաշրջանն ավարտվել է, մուտք գործեք կրկին:',
      tooMuch: 'Չափազանց շատ տվյալ. հեռացրեք մի քանի նկար և պահպանեք կրկին:',
      netErr: 'Սերվերն անհասանելի է:',
      uploadFail: 'Չհաջողվեց նկարը վերբեռնել սերվեր: Ստուգեք կապը և կրկնեք:',
      hint: 'Սեղմեք տեքստի կողքի գրիչը — այնտեղ երեք լեզուն և ձևավորումն են: Փոփոխություններն անմիջապես տեսնում են բոլորը:',
      newName: 'Անուն Ազգանուն', newRole: 'Պաշտոն', newBio: 'Անձի մասին',
      photoAdd: 'Նկար', photoDel: 'Հեռացնել նկարը', cropTitle: 'Կադրավորում',
      cropHint: 'Քաշեք նկարը մկնիկով, սահիչով ընտրեք չափը:', zoom: 'Չափ',
      heic: 'Այս նկարը HEIC ձևաչափով է — դիտարկիչները չեն բացում այն: iPhone-ում՝ Կարգավորումներ → Տեսախցիկ → Ձևաչափեր → «Առավել համատեղելի», կամ ուղարկեք նկարը ձեզ մեսենջերով և պահպանեք՝ այն կդառնա JPEG:',
      badImage: 'Չհաջողվեց բացել ֆայլը: Օգտագործեք JPG, PNG, WebP կամ GIF:',
      tooBig: 'Ֆայլը 25 ՄԲ-ից մեծ է — ընտրեք ավելի փոքր նկար:',
      editText: 'Տեքստի խմբագիր', color: 'Գույն', size: 'Չափ, px', font: 'Տառատեսակ',
      weight: 'Հաստություն', align: 'Հավասարեցում', reset: 'Վերականգնել', asIs: 'Ինչպես կայքում',
      normal: 'Սովորական', semibold: 'Կիսահաստ', bold: 'Հաստ',
      alignLeft: 'Ձախ', alignCenter: 'Կենտրոն', alignRight: 'Աջ',
      edName: 'Անդամի անունը',
      confirmDel: 'Ջնջե՞լ այս անդամին:'
    }
  };

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} },
    ses: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    setSes: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    delSes: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };

  var data = { texts: { ru: {}, en: {}, hy: {} }, names: {}, photos: {}, styles: {}, extra: [], removed: [] };
  var editing = false;

  function lang() {
    if (window.SPARTA && window.SPARTA.getLang) return window.SPARTA.getLang();
    return 'ru';
  }
  function t() { return UI[lang()] || UI.ru; }
  function relang() { if (window.SPARTA && window.SPARTA.relang) window.SPARTA.relang(); }

  function merge(src) {
    if (!src) return;
    ['ru', 'en', 'hy'].forEach(function (l) {
      if (src.texts && src.texts[l]) {
        Object.keys(src.texts[l]).forEach(function (k) { data.texts[l][k] = src.texts[l][k]; });
      }
    });
    if (src.names) Object.keys(src.names).forEach(function (k) { data.names[k] = src.names[k]; });
    if (src.photos) Object.keys(src.photos).forEach(function (k) { data.photos[k] = src.photos[k]; });
    if (src.styles) Object.keys(src.styles).forEach(function (k) { data.styles[k] = src.styles[k]; });
    if (src.extra) data.extra = src.extra.slice();
    if (src.removed) data.removed = src.removed.slice();
  }

  // ---------- применение правок к странице ----------

  function pushTexts() {
    if (typeof translations === 'undefined') return;
    ['ru', 'en', 'hy'].forEach(function (l) {
      if (!translations[l]) return;
      Object.keys(data.texts[l]).forEach(function (k) { translations[l][k] = data.texts[l][k]; });
    });
    // тексты добавленных участников живут в самих карточках
    data.extra.forEach(function (m) {
      ['ru', 'en', 'hy'].forEach(function (l) {
        if (!translations[l]) return;
        translations[l]['x-' + m.id + '-role'] = (m.role && m.role[l]) || '';
        translations[l]['x-' + m.id + '-bio'] = (m.bio && m.bio[l]) || '';
      });
    });
  }

  function grid() { return document.querySelector('.team-grid'); }

  function cardMarkup(m) {
    var art = document.createElement('article');
    art.className = 'member-card';
    art.setAttribute('data-member', m.id);
    art.setAttribute('data-extra', 'true');

    var av = document.createElement('div');
    av.className = 'member-card__avatar';
    if (m.photo) {
      av.className += ' member-card__avatar--photo';
      var img = document.createElement('img');
      img.src = m.photo;
      img.alt = m.name || '';
      av.appendChild(img);
    } else {
      av.textContent = (m.name || '?').charAt(0).toUpperCase();
    }

    var box = document.createElement('div');
    box.className = 'member-card__content';
    var h3 = document.createElement('h3');
    h3.className = 'member-card__name';
    h3.textContent = m.name || '';
    var role = document.createElement('p');
    role.className = 'member-card__role';
    role.setAttribute('data-i18n', 'x-' + m.id + '-role');
    var bio = document.createElement('p');
    bio.className = 'member-card__bio';
    bio.setAttribute('data-i18n', 'x-' + m.id + '-bio');
    box.appendChild(h3); box.appendChild(role); box.appendChild(bio);

    art.appendChild(av); art.appendChild(box);
    return art;
  }

  function apply() {
    pushTexts();

    // скрытые участники
    document.querySelectorAll('[data-member]').forEach(function (card) {
      var id = card.getAttribute('data-member');
      card.hidden = data.removed.indexOf(id) !== -1;
    });

    // имена
    Object.keys(data.names).forEach(function (id) {
      var card = document.querySelector('[data-member="' + id + '"]');
      if (!card) return;
      var el = card.querySelector('.member-card__name');
      if (el) el.textContent = data.names[id];
    });

    // фото; пустая строка значит «снимок убрали» — возвращаем букву
    Object.keys(data.photos).forEach(function (id) {
      var card = document.querySelector('[data-member="' + id + '"]');
      if (!card) return;
      var av = card.querySelector('.member-card__avatar');
      if (!av) return;
      var nm = card.querySelector('.member-card__name');
      var name = nm ? nm.textContent.trim() : '';
      av.textContent = '';
      if (data.photos[id]) {
        av.className = 'member-card__avatar member-card__avatar--photo';
        var img = document.createElement('img');
        img.src = data.photos[id];
        img.alt = name;
        av.appendChild(img);
      } else {
        av.className = 'member-card__avatar';
        av.textContent = (name || '?').charAt(0).toUpperCase();
      }
    });

    // добавленные участники
    var g = grid();
    if (g) {
      g.querySelectorAll('[data-extra="true"]').forEach(function (n) { n.remove(); });
      data.extra.forEach(function (m) {
        if (data.removed.indexOf(m.id) !== -1) return;
        g.appendChild(cardMarkup(m));
      });
    }

    relang();
    applyStyles();
    if (editing) markEditable();
  }

  /*
   * Оформление, заданное через редактор: цвет, размер, шрифт, начертание,
   * выравнивание. Пустое значение означает «как в вёрстке» — тогда снимаем
   * инлайновое свойство, а не пишем в него пустую строку поверх стилей темы.
   */
  function styleTargets(key) {
    if (key.indexOf('name:') === 0) {
      var card = document.querySelector('[data-member="' + key.slice(5) + '"]');
      var el = card ? card.querySelector('.member-card__name') : null;
      return el ? [el] : [];
    }
    var out = [];
    document.querySelectorAll('[data-i18n="' + key + '"]').forEach(function (el) {
      if (!el.closest('.admin-bar') && !el.closest('.admin-modal')) out.push(el);
    });
    return out;
  }

  var styledKeys = [];

  function clearStyle(el) {
    el.style.color = '';
    el.style.fontSize = '';
    el.style.fontFamily = '';
    el.style.fontWeight = '';
    el.style.textAlign = '';
  }

  function applyStyles() {
    // сначала снимаем то, что накладывали в прошлый раз: иначе «Сбросить»
    // убирает ключ из данных, но свойства остаются висеть на узле
    styledKeys.forEach(function (key) {
      styleTargets(key).forEach(clearStyle);
    });
    styledKeys = Object.keys(data.styles);

    styledKeys.forEach(function (key) {
      var st = data.styles[key] || {};
      styleTargets(key).forEach(function (el) {
        el.style.color = st.color || '';
        el.style.fontSize = st.size ? st.size + 'px' : '';
        el.style.fontFamily = st.font || '';
        el.style.fontWeight = st.weight || '';
        el.style.textAlign = st.align || '';
      });
    });
  }

  // ---------- вход ----------

  function api(path, opts) {
    var o = opts || {};
    o.credentials = 'same-origin';
    o.headers = o.headers || {};
    if (o.body) o.headers['Content-Type'] = 'application/json';
    return fetch(API + path, o);
  }

  function openLogin() {
    var L = t();
    var back = document.createElement('div');
    back.className = 'admin-modal';
    back.innerHTML =
      '<form class="admin-modal__box">' +
      '<h3>' + L.title + '</h3>' +
      '<label>' + L.user + '<input type="text" name="u" autocomplete="username"></label>' +
      '<label>' + L.pass + '<input type="password" name="p" autocomplete="current-password"></label>' +
      '<p class="admin-modal__err" hidden></p>' +
      '<div class="admin-modal__row">' +
      '<button type="submit" class="btn btn--green btn--sm">' + L.enter + '</button>' +
      '<button type="button" class="btn btn--light btn--sm" data-close>' + L.cancel + '</button>' +
      '</div></form>';
    document.body.appendChild(back);

    var form = back.querySelector('form');
    var err = back.querySelector('.admin-modal__err');
    form.querySelector('input[name="u"]').focus();

    function close() { back.remove(); document.removeEventListener('keydown', onEsc); }
    function onEsc(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onEsc);
    back.querySelector('[data-close]').addEventListener('click', close);
    back.addEventListener('click', function (e) { if (e.target === back) close(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      api('login', {
        method: 'POST',
        body: JSON.stringify({ user: form.u.value.trim(), pass: form.p.value })
      }).then(function (r) {
        btn.disabled = false;
        if (r.ok) { close(); startEditing(); return; }
        err.textContent = r.status === 401 ? t().bad : t().netErr;
        err.hidden = false;
      }).catch(function () {
        btn.disabled = false;
        err.textContent = t().netErr;
        err.hidden = false;
      });
    });
  }

  // ---------- режим редактирования ----------

  function editableNodes() {
    var list = [];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (!el.closest('.admin-bar') && !el.closest('.admin-modal')) list.push(el);
    });
    document.querySelectorAll('.member-card__name').forEach(function (el) { list.push(el); });
    return list;
  }

  /* Ключ, под которым правки и оформление хранятся для конкретного узла. */
  function nodeKey(el) {
    var k = el.getAttribute('data-i18n');
    if (k) return k;
    if (el.classList.contains('member-card__name')) {
      var card = el.closest('[data-member]');
      if (card) return 'name:' + card.getAttribute('data-member');
    }
    return null;
  }

  /*
   * Правка идёт только через карандаш и окно редактора: там сразу видны все три
   * языка и оформление. Прежняя правка «прямо в странице» этого не давала —
   * менялся лишь текущий язык, а остальные два молча расходились с ним.
   */
  function markEditable() {
    editableNodes().forEach(function (el) {
      var key = nodeKey(el);
      if (!key) return;
      el.setAttribute('data-editable', '1');
      if (el.querySelector(':scope > .admin-pen')) return;
      var pen = document.createElement('button');
      pen.type = 'button';
      pen.className = 'admin-pen';
      pen.title = t().editText;
      pen.setAttribute('aria-label', t().editText);
      pen.innerHTML = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">' +
        '<path fill="currentColor" d="M11.7 1.6a1.4 1.4 0 0 1 2 0l.7.7a1.4 1.4 0 0 1 0 2l-.9.9-2.7-2.7.9-.9zM9.9 3.4l2.7 2.7-6.6 6.6-3.4.7.7-3.4 6.6-6.6z"/>' +
        '</svg>';
      pen.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        openTextEditor(key, el);
      });
      el.appendChild(pen);
    });
    document.querySelectorAll('[data-member]').forEach(addCardTools);
    addPlusButton();
  }

  function unmarkEditable() {
    document.querySelectorAll('[data-editable="1"]').forEach(function (el) {
      el.removeAttribute('data-editable');
    });
    document.querySelectorAll('.admin-pen, .admin-card-tools, .admin-add').forEach(function (n) { n.remove(); });
  }

  // смена языка перерисовывает тексты и уносит карандаши — возвращаем их
  document.addEventListener('click', function (e) {
    if (!editing || !e.target.closest) return;
    if (e.target.closest('.lang-opt')) setTimeout(markEditable, 0);
  });

  /* Шрифты только те, что есть у пользователя или в проекте: сторонние
     подключать нечем — на сайте нет внешних загрузок. */
  var FONTS = [
    { v: '', n: 'Как на сайте' },
    { v: '"Inter","Segoe UI",system-ui,sans-serif', n: 'Inter (основной)' },
    { v: 'Georgia,"Times New Roman",serif', n: 'Georgia' },
    { v: '"Times New Roman",Times,serif', n: 'Times New Roman' },
    { v: '"Courier New",monospace', n: 'Courier New' },
    { v: '"Sekuya",Georgia,serif', n: 'Sekuya (заголовочный)' }
  ];
  var LANGS = [{ c: 'ru', n: 'Русский' }, { c: 'en', n: 'English' }, { c: 'hy', n: 'Հայերեն' }];

  function currentText(key, l, el) {
    if (key.indexOf('name:') === 0) {
      var id = key.slice(5);
      if (typeof data.names[id] === 'string') return data.names[id];
      return el ? el.textContent.trim() : '';
    }
    if (data.texts[l] && typeof data.texts[l][key] === 'string') return data.texts[l][key];
    if (typeof translations !== 'undefined' && translations[l] && translations[l][key]) return translations[l][key];
    // ключа нет в переводах — берём то, что сейчас на странице, но только для
    // текущего языка: чужой язык подставлять сюда нельзя
    if (el && l === lang()) return el.textContent.trim();
    return '';
  }

  function openTextEditor(key, el) {
    var L = t();
    var isName = key.indexOf('name:') === 0;
    var st = data.styles[key] || {};

    var back = document.createElement('div');
    back.className = 'admin-modal';

    var fontOpts = FONTS.map(function (f) {
      return '<option value="' + f.v.replace(/"/g, '&quot;') + '">' + f.n + '</option>';
    }).join('');

    var fields = isName
      ? '<label class="admin-ed__field"><span>' + L.edName + '</span><textarea rows="2" data-lang="ru"></textarea></label>'
      : LANGS.map(function (l) {
          return '<label class="admin-ed__field"><span>' + l.n + '</span>' +
                 '<textarea rows="3" data-lang="' + l.c + '"></textarea></label>';
        }).join('');

    back.innerHTML =
      '<div class="admin-modal__box admin-ed">' +
      '<h3>' + L.editText + '</h3>' +
      '<div class="admin-ed__texts">' + fields + '</div>' +
      '<div class="admin-ed__style">' +
        '<label><span>' + L.color + '</span>' +
          '<span class="admin-ed__color">' +
            '<input type="color" data-color>' +
            '<button type="button" class="admin-mini" data-color-reset>' + L.reset + '</button>' +
          '</span></label>' +
        '<label><span>' + L.size + '</span>' +
          '<input type="number" min="10" max="96" step="1" placeholder="—" data-size></label>' +
        '<label><span>' + L.font + '</span><select data-font>' + fontOpts + '</select></label>' +
        '<label><span>' + L.weight + '</span><select data-weight>' +
          '<option value="">' + L.asIs + '</option>' +
          '<option value="400">' + L.normal + '</option>' +
          '<option value="600">' + L.semibold + '</option>' +
          '<option value="800">' + L.bold + '</option>' +
        '</select></label>' +
        '<label><span>' + L.align + '</span><select data-align>' +
          '<option value="">' + L.asIs + '</option>' +
          '<option value="left">' + L.alignLeft + '</option>' +
          '<option value="center">' + L.alignCenter + '</option>' +
          '<option value="right">' + L.alignRight + '</option>' +
        '</select></label>' +
      '</div>' +
      '<div class="admin-ed__preview" data-preview></div>' +
      '<div class="admin-modal__row">' +
        '<button type="button" class="btn btn--green btn--sm" data-save>' + L.save + '</button>' +
        '<button type="button" class="btn btn--light btn--sm" data-cancel>' + L.cancel + '</button>' +
      '</div></div>';
    document.body.appendChild(back);

    var areas = {}, initial = {};
    back.querySelectorAll('textarea[data-lang]').forEach(function (ta) {
      areas[ta.getAttribute('data-lang')] = ta;
      ta.value = currentText(key, ta.getAttribute('data-lang'), el);
      initial[ta.getAttribute('data-lang')] = ta.value;
    });

    var cIn = back.querySelector('[data-color]');
    var sIn = back.querySelector('[data-size]');
    var fIn = back.querySelector('[data-font]');
    var wIn = back.querySelector('[data-weight]');
    var aIn = back.querySelector('[data-align]');
    var prev = back.querySelector('[data-preview]');

    // цвет по умолчанию берём тот, которым текст нарисован сейчас — иначе
    // палитра открывалась бы на чёрном и «сбрасывала» вид одним касанием
    var shown = el ? getComputedStyle(el).color : '';
    cIn.value = st.color || rgbToHex(shown) || '#eef2ef';
    var colorSet = !!st.color;
    if (st.size) sIn.value = st.size;
    fIn.value = st.font || '';
    wIn.value = st.weight || '';
    aIn.value = st.align || '';

    function rgbToHex(v) {
      var m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(v || '');
      if (!m) return '';
      return '#' + [1, 2, 3].map(function (i) {
        return ('0' + parseInt(m[i], 10).toString(16)).slice(-2);
      }).join('');
    }

    function draw() {
      var l = isName ? 'ru' : lang();
      prev.textContent = (areas[l] || areas.ru).value || '—';
      prev.style.color = colorSet ? cIn.value : '';
      prev.style.fontSize = sIn.value ? sIn.value + 'px' : '';
      prev.style.fontFamily = fIn.value || '';
      prev.style.fontWeight = wIn.value || '';
      prev.style.textAlign = aIn.value || '';
    }

    cIn.addEventListener('input', function () { colorSet = true; draw(); });
    back.querySelector('[data-color-reset]').addEventListener('click', function () {
      colorSet = false; draw();
    });
    [sIn, fIn, wIn, aIn].forEach(function (n) { n.addEventListener('input', draw); });
    Object.keys(areas).forEach(function (l) { areas[l].addEventListener('input', draw); });
    draw();

    function close() { back.remove(); document.removeEventListener('keydown', onEsc); }
    function onEsc(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onEsc);
    back.querySelector('[data-cancel]').addEventListener('click', close);
    back.addEventListener('click', function (e) { if (e.target === back) close(); });

    var saveBtn = back.querySelector('[data-save]');
    saveBtn.addEventListener('click', function () {
      if (isName) {
        var id = key.slice(5);
        var nm = areas.ru.value.trim();
        data.names[id] = nm;
        var mm = findExtra(id);
        if (mm) mm.name = nm;
      } else {
        LANGS.forEach(function (l) {
          var v = areas[l.c].value.trim();
          // пустым осталось то, что пустым и было — перевода не создаём,
          // иначе пустая строка перекроет текст из вёрстки
          if (!v && !initial[l.c]) return;
          data.texts[l.c][key] = v;
          var ex = extraByKey(key);
          if (ex) {
            if (key.indexOf('-role') !== -1) ex.m.role[l.c] = v;
            else ex.m.bio[l.c] = v;
          }
        });
      }

      var st2 = {};
      if (colorSet) st2.color = cIn.value;
      if (sIn.value) st2.size = parseInt(sIn.value, 10);
      if (fIn.value) st2.font = fIn.value;
      if (wIn.value) st2.weight = wIn.value;
      if (aIn.value) st2.align = aIn.value;
      if (Object.keys(st2).length) data.styles[key] = st2;
      else delete data.styles[key];

      apply();

      saveBtn.disabled = true;
      saveBtn.textContent = L.saving;
      pushToServer(function (okRes) {
        saveBtn.disabled = false;
        saveBtn.textContent = L.save;
        if (okRes) close();
      });
    });
  }

  /* Отправка всех правок на сервер. Общая для редактора и кнопки на панели. */
  function pushToServer(done) {
    var L = t();
    api('content', { method: 'PUT', body: JSON.stringify(data) })
      .then(function (r) {
        if (r.ok) { if (done) done(true); return; }
        if (r.status === 401) { alert(L.sessionOut); stopEditing(); }
        else if (r.status === 413) alert(L.tooMuch);
        else alert(L.saveFail);
        if (done) done(false);
      })
      .catch(function () { alert(L.saveFail); if (done) done(false); });
  }

  function findExtra(id) {
    for (var i = 0; i < data.extra.length; i++) if (data.extra[i].id === id) return data.extra[i];
    return null;
  }
  function extraByKey(key) {
    var mm = key.match(/^x-(.+)-(role|bio)$/);
    if (!mm) return null;
    var m = findExtra(mm[1]);
    return m ? { m: m } : null;
  }

  function addCardTools(card) {
    var existing = card.querySelector('.admin-card-tools');
    if (existing) existing.remove();
    var L = t();
    var box = document.createElement('div');
    box.className = 'admin-card-tools';

    var id = card.getAttribute('data-member');

    var pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'admin-mini';
    pick.textContent = L.photoAdd;

    var file = document.createElement('input');
    file.type = 'file';
    file.accept = 'image/jpeg,image/png,image/webp,image/gif';
    file.hidden = true;

    pick.addEventListener('click', function () { file.click(); });
    file.addEventListener('change', function () {
      if (file.files && file.files[0]) readPhoto(file.files[0], id);
      file.value = '';  // иначе повторный выбор того же файла не вызовет change
    });

    // «убрать фото» показываем только там, где снимок реально есть
    var hasPhoto = !!card.querySelector('.member-card__avatar img');
    var rmPhoto = null;
    if (hasPhoto) {
      rmPhoto = document.createElement('button');
      rmPhoto.type = 'button';
      rmPhoto.className = 'admin-mini';
      rmPhoto.textContent = L.photoDel;
      rmPhoto.addEventListener('click', function () {
        data.photos[id] = '';
        apply();
      });
    }

    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'admin-mini admin-mini--danger';
    del.textContent = L.del;
    del.addEventListener('click', function () {
      if (!confirm(t().confirmDel)) return;
      var id = card.getAttribute('data-member');
      if (data.removed.indexOf(id) === -1) data.removed.push(id);
      apply();
    });

    box.appendChild(pick);
    if (rmPhoto) box.appendChild(rmPhoto);
    box.appendChild(file); box.appendChild(del);
    card.appendChild(box);
  }

  // фото ужимаем в браузере: иначе base64 в content.json вырастет на мегабайты
  function isHeic(file) {
    var n = (file.name || '').toLowerCase();
    return file.type === 'image/heic' || file.type === 'image/heif' ||
           n.indexOf('.heic') === n.length - 5 || n.indexOf('.heif') === n.length - 5;
  }

  /*
   * Снимок читаем через objectURL, а не base64: телефонное фото на 12 Мп
   * в виде data:URL занимает в памяти в разы больше и роняет вкладку на слабых
   * устройствах. HEIC с айфона браузеры не декодируют вовсе — ловим отдельно.
   */
  function readPhoto(file, id) {
    if (file.size > 25 * 1024 * 1024) { alert(t().tooBig); return; }

    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () { openCropper(img, id, url); };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      alert(isHeic(file) ? t().heic : t().badImage);
    };
    img.src = url;
  }

  /*
   * Обрезка кадра.
   * Картинка сначала вписывается в рамку по правилу "cover" (baseScale), а зум
   * пользователя идёт множителем поверх. Смещение считается в пикселях рамки и
   * зажимается так, чтобы кадр всегда был закрыт изображением — без пустых полей.
   */
  function openCropper(img, id, srcUrl) {
    var L = t();
    var OUT = 320;
    var S = Math.max(220, Math.min(320, window.innerWidth - 80));
    var baseScale = S / Math.min(img.width, img.height);

    var zoom = 1, ox = 0, oy = 0;

    var back = document.createElement('div');
    back.className = 'admin-modal';
    back.innerHTML =
      '<div class="admin-modal__box admin-modal__crop">' +
      '<h3>' + L.cropTitle + '</h3>' +
      '<p class="admin-crop__hint">' + L.cropHint + '</p>' +
      '<div class="admin-crop__preview" style="width:' + S + 'px;height:' + S + 'px">' +
      '<img alt="" draggable="false">' +
      '</div>' +
      '<label class="admin-crop__zoom">' + L.zoom +
      '<input type="range" min="1" max="4" step="0.02" value="1">' +
      '</label>' +
      '<div class="admin-modal__row">' +
      '<button type="button" class="btn btn--green btn--sm" data-ok>OK</button>' +
      '<button type="button" class="btn btn--light btn--sm" data-cancel>' + L.cancel + '</button>' +
      '</div></div>';
    document.body.appendChild(back);

    var pv = back.querySelector('.admin-crop__preview');
    var el = back.querySelector('.admin-crop__preview img');
    var zr = back.querySelector('.admin-crop__zoom input');
    el.src = img.src;

    function dims() {
      var k = baseScale * zoom;
      return { w: img.width * k, h: img.height * k, k: k };
    }

    function clamp() {
      var d = dims();
      if (ox > 0) ox = 0;
      if (oy > 0) oy = 0;
      if (ox < S - d.w) ox = S - d.w;
      if (oy < S - d.h) oy = S - d.h;
    }

    function draw() {
      var d = dims();
      clamp();
      el.style.width = d.w + 'px';
      el.style.height = d.h + 'px';
      el.style.left = ox + 'px';
      el.style.top = oy + 'px';
    }

    // центрируем кадр при открытии
    (function center() {
      var d = dims();
      ox = (S - d.w) / 2;
      oy = (S - d.h) / 2;
      draw();
    })();

    zr.addEventListener('input', function () {
      var d0 = dims();
      // держим центр кадра на месте при изменении зума
      var cx = (S / 2 - ox) / d0.w;
      var cy = (S / 2 - oy) / d0.h;
      zoom = parseFloat(zr.value);
      var d1 = dims();
      ox = S / 2 - cx * d1.w;
      oy = S / 2 - cy * d1.h;
      draw();
    });

    var drag = null;
    function point(e) {
      var tt = e.touches && e.touches[0] ? e.touches[0] : e;
      return { x: tt.clientX, y: tt.clientY };
    }
    function onDown(e) {
      var p = point(e);
      drag = { x: p.x, y: p.y, ox: ox, oy: oy };
      pv.setAttribute('data-drag', 'true');
      e.preventDefault();
    }
    function onMove(e) {
      if (!drag) return;
      var p = point(e);
      ox = drag.ox + (p.x - drag.x);
      oy = drag.oy + (p.y - drag.y);
      draw();
      e.preventDefault();
    }
    function onUp() { drag = null; pv.removeAttribute('data-drag'); }

    pv.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    pv.addEventListener('touchstart', onDown, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);

    function close() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      if (srcUrl) URL.revokeObjectURL(srcUrl);
      back.remove();
    }

    back.querySelector('[data-ok]').addEventListener('click', function () {
      var d = dims();
      // рамка в координатах исходника
      var sx = -ox / d.k;
      var sy = -oy / d.k;
      var ss = S / d.k;
      var c = document.createElement('canvas');
      c.width = OUT; c.height = OUT;
      var ctx = c.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, ss, ss, 0, 0, OUT, OUT);
      var out = c.toDataURL('image/webp', 0.85);
      if (out.indexOf('data:image/webp') !== 0) out = c.toDataURL('image/jpeg', 0.85);

      // снимок уходит на сервер файлом; в правках остаётся только ссылка на него,
      // иначе content.json распухал бы на сотни килобайт и грузился каждому заново
      var okBtn = back.querySelector('[data-ok]');
      okBtn.disabled = true;
      api('upload', { method: 'POST', body: JSON.stringify({ id: id, data: out }) })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          okBtn.disabled = false;
          if (!j || !j.url) { alert(t().uploadFail); return; }
          data.photos[id] = j.url;
          var m = findExtra(id);
          if (m) m.photo = j.url;
          close();
          apply();
        })
        .catch(function () {
          okBtn.disabled = false;
          alert(t().uploadFail);
        });
    });

    back.querySelector('[data-cancel]').addEventListener('click', close);
    back.addEventListener('click', function (e) { if (e.target === back) close(); });
  }

  function addPlusButton() {
    var g = grid();
    if (!g || g.parentNode.querySelector('.admin-add')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'admin-add btn btn--light btn--sm';
    b.textContent = t().addMember;
    b.addEventListener('click', function () {
      var L = t();
      var id = 'n' + Date.now().toString(36);
      data.extra.push({
        id: id,
        name: L.newName,
        role: { ru: UI.ru.newRole, en: UI.en.newRole, hy: UI.hy.newRole },
        bio: { ru: UI.ru.newBio, en: UI.en.newBio, hy: UI.hy.newBio },
        photo: ''
      });
      apply();
    });
    g.parentNode.insertBefore(b, g.nextSibling);
  }

  // ---------- панель ----------

  function bar() {
    var L = t();
    var el = document.createElement('div');
    el.className = 'admin-bar';
    el.innerHTML =
      '<strong>' + L.mode + '</strong>' +
      '<span class="admin-bar__hint">' + L.hint + '</span>' +
      '<button type="button" class="btn btn--green btn--sm" data-save>' + L.save + '</button>' +
      '<button type="button" class="btn btn--light btn--sm" data-export>' + L.exportBtn + '</button>' +
      '<button type="button" class="btn btn--light btn--sm" data-exit>' + L.exit + '</button>';
    document.body.appendChild(el);

    var saveBtn = el.querySelector('[data-save]');
    saveBtn.addEventListener('click', function () {
      var L = t();
      saveBtn.disabled = true;
      saveBtn.textContent = L.saving;
      pushToServer(function (okRes) {
        saveBtn.disabled = false;
        saveBtn.textContent = L.save;
        if (okRes) alert(L.saved);
      });
    });
    el.querySelector('[data-export]').addEventListener('click', exportJson);
    el.querySelector('[data-exit]').addEventListener('click', stopEditing);
    return el;
  }

  function exportJson() {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  function startEditing() {
    if (editing) return;
    editing = true;
    document.body.classList.add('is-admin');
    bar();
    markEditable();
  }

  function stopEditing() {
    editing = false;
    document.body.classList.remove('is-admin');
    unmarkEditable();
    var b = document.querySelector('.admin-bar');
    if (b) b.remove();
    api('logout', { method: 'POST' }).catch(function () {});
  }

  // ---------- старт ----------

  function boot() {
    var btn = document.getElementById('adminLogin');
    if (btn) btn.addEventListener('click', openLogin);

    // Общие правки с сервера. Если сервера нет — пробуем статический файл,
    // чтобы сайт не остался без сохранённого содержимого.
    api('content', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () {
        return fetch('./content.json', { cache: 'no-store' })
          .then(function (r) { return r.ok ? r.json() : null; })
          .catch(function () { return null; });
      })
      .then(function (pub) {
        merge(pub);
        apply();
        return api('session').then(function (r) { return r.ok ? r.json() : null; });
      })
      .then(function (s) { if (s && s.auth) startEditing(); })
      .catch(function () { /* сервера нет — режим редактирования недоступен */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
