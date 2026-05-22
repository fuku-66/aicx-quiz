// flashcard.js — 単語帳（フラッシュカード）

const FC_CHAPTERS = [
  { key: 'all',   label: 'すべて' },
  { key: 'Ch.01', label: 'Ch.01' },
  { key: 'Ch.02', label: 'Ch.02' },
  { key: 'Ch.03', label: 'Ch.03' },
  { key: 'Ch.04', label: 'Ch.04' },
  { key: 'Ch.05', label: 'Ch.05' },
  { key: 'Ch.06', label: 'Ch.06' },
];

const MASTERED_KEY = 'fc_mastered';

let _fcTerms = [];
let _fcFiltered = [];
let _fcIndex = 0;
let _fcFlipped = false;
let _fcReady = false;

function getMastered() {
  try { return new Set(JSON.parse(localStorage.getItem(MASTERED_KEY) || '[]')); }
  catch(e) { return new Set(); }
}
function setMastered(s) {
  try { localStorage.setItem(MASTERED_KEY, JSON.stringify([...s])); } catch(e) {}
}

async function loadFlashcard() {
  if (_fcReady && _fcTerms.length > 0) { renderFlashcard(); return; }
  const loading = document.getElementById('fc-loading');
  if (loading) loading.classList.remove('hidden');

  const res = await api('getTerms');
  if (loading) loading.classList.add('hidden');
  if (res.status !== 'ok') return;
  _fcTerms = res.data.terms || [];
  _fcReady = true;

  buildChapterFilter();
  applyFilter('all');
}

function buildChapterFilter() {
  const el = document.getElementById('fc-chapter-filter');
  if (!el) return;
  el.innerHTML = FC_CHAPTERS.map(c =>
    `<button class="fc-chapter-btn${c.key === 'all' ? ' fc-chapter-btn--active' : ''}" data-ch="${c.key}">${c.label}</button>`
  ).join('');
  el.addEventListener('click', e => {
    const btn = e.target.closest('.fc-chapter-btn');
    if (!btn) return;
    el.querySelectorAll('.fc-chapter-btn').forEach(b => b.classList.toggle('fc-chapter-btn--active', b === btn));
    applyFilter(btn.dataset.ch);
  });
}

function applyFilter(chKey) {
  _fcFiltered = chKey === 'all'
    ? _fcTerms.slice()
    : _fcTerms.filter(t => t.chapter === chKey);
  _fcIndex = 0;
  renderFlashcard();
}

function renderFlashcard() {
  const mastered = getMastered();
  const total = _fcFiltered.length;
  const masteredCount = _fcFiltered.filter(t => mastered.has(t.id)).length;

  document.getElementById('fc-progress').textContent =
    total > 0 ? `${_fcIndex + 1} / ${total}  |  覚えた: ${masteredCount}語` : '用語がありません';

  if (total === 0) return;
  const t = _fcFiltered[_fcIndex];
  const isMastered = mastered.has(t.id);

  document.getElementById('fc-term').textContent = t.term;
  document.getElementById('fc-reading').textContent = t.reading ? `（${t.reading}）` : '';
  document.getElementById('fc-chapter-f').textContent = t.chapter + ' ' + (t.section || '');
  document.getElementById('fc-chapter-b').textContent = t.chapter + ' ' + (t.section || '');
  document.getElementById('fc-fullname').textContent = t.fullName || '';
  document.getElementById('fc-meaning').textContent = t.meaning;
  document.getElementById('fc-section').textContent = t.section || '';

  const img = document.getElementById('fc-image');
  if (img) {
    if (t.id) {
      img.src = `images/${t.id}.jpg`;
      img.style.display = '';
      img.onerror = () => { img.style.display = 'none'; };
    } else {
      img.style.display = 'none';
    }
  }

  const masteredBtn = document.getElementById('fc-mastered');
  if (isMastered) {
    masteredBtn.textContent = '覚えた ✓';
    masteredBtn.classList.add('fc-mastered-btn--done');
  } else {
    masteredBtn.textContent = '覚えた';
    masteredBtn.classList.remove('fc-mastered-btn--done');
  }

  // 表面に戻す
  _fcFlipped = false;
  const inner = document.getElementById('fc-card-inner');
  if (inner) inner.classList.remove('fc-card__inner--flipped');

  document.getElementById('fc-mastered-count').textContent =
    masteredCount > 0 ? `覚えた用語: ${masteredCount} / ${total}語` : '';
}

function initFlashcardEvents() {
  // カードタップで裏返し
  const card = document.getElementById('fc-card');
  if (card) {
    card.addEventListener('click', () => {
      _fcFlipped = !_fcFlipped;
      document.getElementById('fc-card-inner').classList.toggle('fc-card__inner--flipped', _fcFlipped);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  }

  document.getElementById('fc-prev').addEventListener('click', () => {
    if (_fcFiltered.length === 0) return;
    _fcIndex = (_fcIndex - 1 + _fcFiltered.length) % _fcFiltered.length;
    renderFlashcard();
  });

  document.getElementById('fc-next').addEventListener('click', () => {
    if (_fcFiltered.length === 0) return;
    _fcIndex = (_fcIndex + 1) % _fcFiltered.length;
    renderFlashcard();
  });

  document.getElementById('fc-mastered').addEventListener('click', e => {
    e.stopPropagation();
    if (_fcFiltered.length === 0) return;
    const t = _fcFiltered[_fcIndex];
    const mastered = getMastered();
    if (mastered.has(t.id)) mastered.delete(t.id);
    else mastered.add(t.id);
    setMastered(mastered);
    renderFlashcard();
  });
}

// 初回のみイベント登録
(function() {
  let _eventsReady = false;
  const orig = window.loadFlashcard;
  window.loadFlashcard = async function() {
    if (!_eventsReady) { initFlashcardEvents(); _eventsReady = true; }
    await orig();
  };
})();
