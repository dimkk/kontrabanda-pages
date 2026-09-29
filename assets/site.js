(() => {
  'use strict';
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];
  const menu = $('[data-menu]');
  const toggle = $('[data-menu-toggle]');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu?.classList.toggle('is-open', open);
  });
  $$('[data-menu] a').forEach(a => a.addEventListener('click', () => {
    menu?.classList.remove('is-open'); toggle?.setAttribute('aria-expanded', 'false');
  }));
  const dialog = $('#search-dialog'); let lastFocus;
  const input = $('[data-dialog-search]'); const results = $$('.search-results li');
  const norm = s => s.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
  const filterSearch = () => {
    let visible = 0; const q = norm(input?.value || '');
    results.forEach(li => { li.hidden = !norm(li.textContent + ' ' + (li.dataset.keywords || '')).includes(q); if (!li.hidden) visible++; });
    const empty = $('[data-search-empty]'); if (empty) empty.hidden = visible > 0;
  };
  $$('[data-open-search]').forEach(button => button.addEventListener('click', () => {
    lastFocus = button; dialog?.showModal(); document.body.classList.add('is-modal'); input?.focus();
  }));
  $('[data-close-search]')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog?.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); dialog.close(); } });
  dialog?.addEventListener('close', () => {document.body.classList.remove('is-modal'); lastFocus?.focus();});
  $$('.search-results a').forEach(a => a.addEventListener('click', () => dialog?.close()));
  input?.addEventListener('input', filterSearch);
  const archiveInput = $('[data-archive-search]'); const archiveItems = $$('[data-archive-item]');
  const topicButtons = $$('[data-topic]'); let topic = 'all';
  const filterArchive = () => {
    let n = 0; const q = norm(archiveInput?.value || '');
    archiveItems.forEach(item => {const matches = norm(item.textContent + ' ' + item.dataset.keywords).includes(q) && (topic === 'all' || (item.dataset.tags || '').split(' ').includes(topic)); item.hidden = !matches; if (matches) n++;});
    const empty = $('[data-archive-empty]'); if (empty) empty.hidden = n > 0;
  };
  archiveInput?.addEventListener('input', filterArchive);
  topicButtons.forEach(button => button.addEventListener('click', () => {
    topic = button.dataset.topic; topicButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button))); filterArchive();
  }));
  const initialTopic = new URLSearchParams(location.search).get('topic');
  if (initialTopic) topicButtons.find(b => b.dataset.topic === initialTopic)?.click();
  const toast = $('[data-toast]'); let toastTimer;
  function notify(message) { if (!toast) return; clearTimeout(toastTimer); toast.textContent = message; toast.classList.add('show'); toastTimer = setTimeout(() => toast.classList.remove('show'), 4500); }
  $$('[data-copy-email]').forEach(b => b.addEventListener('click', async () => {
    const email = b.dataset.copyEmail; try {await navigator.clipboard.writeText(email); notify('Почта скопирована');} catch {notify(email);}
  }));
  // Back-end optional. No request is sent with the default static configuration.
  // Only explicit same-origin paths are accepted. HTML supplied by the API is never inserted.
  const cfg = window.KS_CONFIG || {};
  const feed = $('[data-serverless-news]');
  const safeEndpoint = value => typeof value === 'string' && /^\/(?!\/)[A-Za-z0-9_/?=&.%-]+$/.test(value);
  if (feed && cfg.newsEnabled && safeEndpoint(cfg.newsEndpoint)) {
    fetch(cfg.newsEndpoint, { headers: { Accept: 'application/json' }, credentials: 'same-origin', signal: AbortSignal.timeout(10000) })
      .then(r => {if (!r.ok) throw new Error('feed'); return r.json();})
      .then(data => {
        if (!Array.isArray(data.items)) throw new Error('format');
        const items = data.items.filter(v => v && v.status === 'published' && typeof v.title === 'string').slice(0, 50);
        if (!items.length) return;
        const fragment = document.createDocumentFragment();
        items.forEach(v => {
          const article = document.createElement('article'); article.className = 'feed-article';
          const h = document.createElement('h2'); h.textContent = v.title; article.append(h);
          const p = document.createElement('p'); p.textContent = String(v.summary || ''); article.append(p);
          if (v.source && /^https:\/\//.test(v.source.url || '')) { const a = document.createElement('a'); a.href = v.source.url; a.textContent = v.source.name || 'Первоисточник'; a.rel = 'noopener noreferrer'; a.target = '_blank'; a.className = 'text-link'; article.append(a); }
          const note = document.createElement('p'); note.textContent = 'Обсуждения ещё не открыты.'; note.className = 'byline'; article.append(note); fragment.append(article);
        });
        feed.replaceChildren(fragment);
      }).catch(() => {notify('Не удалось обновить ленту. Сохранён статический вид страницы.');});
  }
})();
