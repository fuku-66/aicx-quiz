// flashcard.js — 用語集グリッド（検索 + チャプタータグ + 詳細モーダル）

const GL_IMG_BASE = 'https://raw.githubusercontent.com/fuku-66/aicx-quiz/main/images';

const GL_CHAPTERS = [
  { key: 'all',   label: 'すべて' },
  { key: 'Ch.01', label: 'Ch.01' },
  { key: 'Ch.02', label: 'Ch.02' },
  { key: 'Ch.03', label: 'Ch.03' },
  { key: 'Ch.04', label: 'Ch.04' },
  { key: 'Ch.05', label: 'Ch.05' },
  { key: 'Ch.06', label: 'Ch.06' },
];

let _glTerms = [];
let _glReady = false;
let _glChapter = 'all';
let _glQuery = '';

async function loadFlashcard() {
  if (!_glReady) {
    const loading = document.getElementById('fc-loading');
    if (loading) loading.classList.remove('hidden');

    const res = await api('getTerms');
    if (loading) loading.classList.add('hidden');
    if (res.status !== 'ok') return;
    _glTerms = res.data.terms || [];
    _glReady = true;

    buildGlChapterFilter();
    initGlEvents();
  }
  renderGlGrid();
}

function buildGlChapterFilter() {
  const el = document.getElementById('gl-chapter-filter');
  if (!el) return;
  el.innerHTML = GL_CHAPTERS.map(c =>
    `<button class="gl-chapter-btn${c.key === 'all' ? ' gl-chapter-btn--active' : ''}" data-ch="${c.key}">${c.label}</button>`
  ).join('');
  el.addEventListener('click', e => {
    const btn = e.target.closest('.gl-chapter-btn');
    if (!btn) return;
    el.querySelectorAll('.gl-chapter-btn').forEach(b => b.classList.toggle('gl-chapter-btn--active', b === btn));
    _glChapter = btn.dataset.ch;
    renderGlGrid();
  });
}

function getFiltered() {
  const q = _glQuery.trim().toLowerCase();
  return _glTerms.filter(t => {
    const chOk = _glChapter === 'all' || t.chapter === _glChapter;
    if (!chOk) return false;
    if (!q) return true;
    return (t.term || '').toLowerCase().includes(q)
      || (t.meaning || '').toLowerCase().includes(q)
      || (t.reading || '').toLowerCase().includes(q)
      || (t.fullName || '').toLowerCase().includes(q);
  });
}

function renderGlGrid() {
  const filtered = getFiltered();
  const countEl = document.getElementById('gl-count');
  if (countEl) countEl.textContent = `${filtered.length} 件`;

  const grid = document.getElementById('gl-grid');
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:32px 0;">該当する用語がありません</p>';
    return;
  }

  const q = _glQuery.trim().toLowerCase();

  grid.innerHTML = filtered.map(t => {
    const pillar = (t.chapter || '').replace('Ch.', '').padStart(2, '0');
    const term = q ? highlight(t.term, q) : esc(t.term);
    const meaning = q ? highlight(t.meaning, q) : esc(t.meaning);
    return `<div class="gl-card" data-pillar="${pillar}" data-id="${esc(t.id)}" role="button" tabindex="0">
      <span class="gl-card__chapter-tag">${esc(t.chapter)}</span>
      <div class="gl-card__term">${term}</div>
      <div class="gl-card__meaning">${meaning}</div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.gl-card').forEach(card => {
    card.addEventListener('click', () => openGlModal(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGlModal(card.dataset.id); } });
  });
}

function highlight(text, q) {
  if (!text || !q) return esc(text);
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return esc(text).replace(re, '<mark>$1</mark>');
}

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function openGlModal(id) {
  const t = _glTerms.find(x => String(x.id) === String(id));
  if (!t) return;
  const modalImg = document.getElementById('gl-modal-img');
  if (modalImg) {
    modalImg.src = `${GL_IMG_BASE}/${t.id}.jpg`;
    modalImg.alt = t.term;
    modalImg.parentElement.style.display = '';
  }
  document.getElementById('gl-modal-chapter').textContent = (t.chapter || '') + (t.section ? '  ' + t.section : '');
  document.getElementById('gl-modal-term').textContent = t.term || '';
  document.getElementById('gl-modal-reading').textContent = t.reading ? `（${t.reading}）` : '';
  document.getElementById('gl-modal-fullname').textContent = t.fullName || '';
  document.getElementById('gl-modal-meaning').textContent = t.meaning || '';
  document.getElementById('gl-modal-section').textContent = t.section || '';

  const overlay = document.getElementById('gl-modal-overlay');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeGlModal() {
  document.getElementById('gl-modal-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function initGlEvents() {
  const search = document.getElementById('gl-search');
  if (search) {
    search.addEventListener('input', () => {
      _glQuery = search.value;
      renderGlGrid();
    });
  }

  document.getElementById('gl-modal-close')?.addEventListener('click', closeGlModal);
  document.getElementById('gl-modal-overlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeGlModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeGlModal();
  });
}
