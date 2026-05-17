// pokemon.js — 図鑑描画・地方フィルタ・カードポップアップ・鳴き声
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_JA_URL = 'https://raw.githubusercontent.com/sindresorhus/pokemon/main/data/ja.json';
const CRY_BASE = 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest';

let POKEMON_JA = null;

const TYPE_COLORS = {
  normal:'#A8A77A', fire:'#EE8130',  water:'#6390F0',  electric:'#F7D02C',
  grass:'#7AC74C',  ice:'#96D9D6',   fighting:'#C22E28',poison:'#A33EA1',
  ground:'#E2BF65', flying:'#A98FF3',psychic:'#F95587', bug:'#A6B91A',
  rock:'#B6A136',   ghost:'#735797', dragon:'#6F35FC',  dark:'#705746',
  steel:'#B7B7CE',  fairy:'#D685AD',
};
const TYPE_JA = {
  normal:'ノーマル', fire:'ほのお',  water:'みず',    electric:'でんき',
  grass:'くさ',     ice:'こおり',   fighting:'かくとう',poison:'どく',
  ground:'じめん',  flying:'ひこう',psychic:'エスパー',bug:'むし',
  rock:'いわ',      ghost:'ゴースト',dragon:'ドラゴン',dark:'あく',
  steel:'はがね',   fairy:'フェアリー',
};
const REGIONS = [
  {name:'すべて',   min:1,   max:905},
  {name:'カントー', min:1,   max:151},
  {name:'ジョウト', min:152, max:251},
  {name:'ホウエン', min:252, max:386},
  {name:'シンオウ', min:387, max:493},
  {name:'イッシュ', min:494, max:649},
  {name:'カロス',   min:650, max:721},
  {name:'アローラ', min:722, max:809},
  {name:'ガラル',   min:810, max:905},
];

let _regionIdx = 0;
let _unlockMap = {};
let _currentAudio = null;
let _tabsReady = false;
let _gridReady = false;
let _cardReady = false;

function spriteUrl(id, shiny) {
  return shiny ? `${SPRITE_BASE}/shiny/${id}.png` : `${SPRITE_BASE}/${id}.png`;
}

async function ensurePokemonNames() {
  if (POKEMON_JA) return;
  try { POKEMON_JA = await (await fetch(POKEMON_JA_URL)).json(); }
  catch(e) { POKEMON_JA = []; }
}

function getPokemonName(id) {
  return (POKEMON_JA && POKEMON_JA[id - 1]) || ('#' + id);
}

function getCached(id) {
  try { return JSON.parse(localStorage.getItem('pk_' + id)); } catch(e) { return null; }
}
function setCache(id, data) {
  try { localStorage.setItem('pk_' + id, JSON.stringify(data)); } catch(e) {}
}

async function fetchPokeData(id) {
  const c = getCached(id);
  if (c) return c;
  try {
    const j = await (await fetch(`${POKEAPI_URL}/${id}`)).json();
    const d = {types: j.types.map(t => t.type.name)};
    setCache(id, d);
    return d;
  } catch(e) { return null; }
}

// ---- Region tabs ----
function buildRegionTabs() {
  if (_tabsReady) return;
  _tabsReady = true;
  const el = document.getElementById('region-tabs');
  if (!el) return;
  el.innerHTML = REGIONS.map((r, i) =>
    `<button class="region-tab${i === 0 ? ' region-tab--active' : ''}" data-region="${i}">${r.name}</button>`
  ).join('');
  el.addEventListener('click', e => {
    const btn = e.target.closest('.region-tab');
    if (!btn) return;
    _regionIdx = Number(btn.dataset.region);
    el.querySelectorAll('.region-tab').forEach(b =>
      b.classList.toggle('region-tab--active', b === btn)
    );
    renderGrid();
  });
}

// ---- Grid render ----
function renderGrid() {
  const {min, max} = REGIONS[_regionIdx];
  const grid = document.getElementById('pokedex-grid');
  let html = '';
  for (let id = min; id <= max; id++) {
    const u = _unlockMap[id];
    const locked = !u;
    const shiny = u && u.shiny;
    const col = u && u.typeColor;
    const style = col ? ` style="background:${col}30;box-shadow:0 0 0 1.5px ${col}60 inset;"` : '';
    html += `<div class="poke-cell${locked?' locked':''}${shiny?' shiny':''}" data-pid="${id}"${locked?'':style}>`;
    html += `<img src="${spriteUrl(id, shiny)}" alt="" loading="lazy">`;
    html += `<span class="poke-id">#${String(id).padStart(4,'0')}</span>`;
    html += '</div>';
  }
  grid.innerHTML = html;

  // Lazy type-color fetch for unlocked cells
  grid.querySelectorAll('.poke-cell:not(.locked)').forEach(cell => {
    const id = Number(cell.dataset.pid);
    if (_unlockMap[id] && !_unlockMap[id].typeColor) {
      fetchPokeData(id).then(d => {
        if (!d || !d.types) return;
        const col = TYPE_COLORS[d.types[0]] || '#6390F0';
        _unlockMap[id].typeColor = col;
        cell.style.background = col + '30';
        cell.style.boxShadow = `0 0 0 1.5px ${col}60 inset`;
      });
    }
  });
}

// ---- Grid click → card popup ----
function initGridClick() {
  if (_gridReady) return;
  _gridReady = true;
  document.getElementById('pokedex-grid').addEventListener('click', e => {
    const cell = e.target.closest('.poke-cell');
    if (cell) openPokeCard(Number(cell.dataset.pid));
  });
}

// ---- Pokémon Card Popup ----
async function openPokeCard(id) {
  const overlay = document.getElementById('poke-card-overlay');
  const bg = document.getElementById('poke-card-bg');
  const u = _unlockMap[id];
  const locked = !u;
  const shiny = u && u.shiny;

  document.getElementById('poke-card-img').src = spriteUrl(id, shiny);
  document.getElementById('poke-card-img').className = locked ? 'poke-card__img--locked' : 'poke-card__img';
  document.getElementById('poke-card-id').textContent = '#' + String(id).padStart(4, '0');
  document.getElementById('poke-card-shiny').classList.toggle('hidden', !shiny);
  document.getElementById('poke-card-cry').dataset.pid = id;

  if (locked) {
    document.getElementById('poke-card-name').textContent = '？？？';
    document.getElementById('poke-card-types').innerHTML = '<span class="poke-card__locked-msg">まだ解放されていません</span>';
    bg.style.background = '';
    document.getElementById('poke-card-cry').classList.add('hidden');
  } else {
    document.getElementById('poke-card-name').textContent = getPokemonName(id);
    document.getElementById('poke-card-types').innerHTML = '<span class="poke-card__loading">…</span>';
    document.getElementById('poke-card-cry').classList.remove('hidden');
    bg.style.background = '';

    const d = await fetchPokeData(id);
    if (d && d.types && d.types.length) {
      const col = TYPE_COLORS[d.types[0]] || '#6390F0';
      bg.style.background = `linear-gradient(150deg, ${col}44 0%, #2E333E 60%)`;
      document.getElementById('poke-card-types').innerHTML = d.types.map(t =>
        `<span class="type-badge" style="background:${TYPE_COLORS[t]||'#666'}">${TYPE_JA[t]||t}</span>`
      ).join('');
      if (_unlockMap[id]) _unlockMap[id].typeColor = col;
    } else {
      document.getElementById('poke-card-types').innerHTML = '';
    }
  }

  overlay.classList.remove('hidden');
}

// ---- Card events ----
function initPokeCardEvents() {
  if (_cardReady) return;
  _cardReady = true;
  const overlay = document.getElementById('poke-card-overlay');
  const close = () => {
    overlay.classList.add('hidden');
    if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
  };
  document.getElementById('poke-card-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.getElementById('poke-card-cry').addEventListener('click', e => {
    playCry(Number(e.currentTarget.dataset.pid));
  });
}

// ---- Cry playback ----
function playCry(id) {
  if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
  const a = new Audio(`${CRY_BASE}/${id}.ogg`);
  a.volume = 0.6;
  _currentAudio = a;
  a.play().catch(() => {});
}

// ---- Main entry ----
async function loadPokedex() {
  const grid = document.getElementById('pokedex-grid');
  if (!_tabsReady) grid.innerHTML = '<div class="loading">読み込み中...</div>';

  await ensurePokemonNames();
  const res = await api('getCollection');
  if (res.status !== 'ok') { grid.textContent = 'エラー: ' + res.message; return; }

  const d = res.data;
  _unlockMap = {};
  d.unlocked.forEach(u => {
    const cached = getCached(u.id);
    if (cached && cached.types && cached.types.length) {
      u.typeColor = TYPE_COLORS[cached.types[0]] || '#6390F0';
    }
    _unlockMap[u.id] = u;
  });

  document.getElementById('pokedex-summary').innerHTML =
    `<div class="big">${d.total_unlocked}<span class="pokedex-summary__unit"> 匹解放</span></div>`;

  buildRegionTabs();
  renderGrid();
  initGridClick();
  initPokeCardEvents();
}
