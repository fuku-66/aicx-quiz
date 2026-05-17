// 図鑑描画・スプライトURL組立・日本語名キャッシュ

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const POKEMON_JA_URL = 'https://raw.githubusercontent.com/sindresorhus/pokemon/main/data/ja.json';
let POKEMON_JA = null;

function spriteUrl(id, shiny) {
  return shiny ? (SPRITE_BASE + '/shiny/' + id + '.png') : (SPRITE_BASE + '/' + id + '.png');
}

async function ensurePokemonNames() {
  if (POKEMON_JA) return POKEMON_JA;
  try {
    const r = await fetch(POKEMON_JA_URL);
    POKEMON_JA = await r.json();
  } catch (e) {
    POKEMON_JA = [];
  }
  return POKEMON_JA;
}

function getPokemonName(id) {
  if (!POKEMON_JA || POKEMON_JA.length === 0) return '#' + id;
  return POKEMON_JA[id - 1] || ('#' + id);
}

async function loadPokedex() {
  const grid = document.getElementById('pokedex-grid');
  const summary = document.getElementById('pokedex-summary');
  grid.innerHTML = '<div class="loading">読み込み中...</div>';
  await ensurePokemonNames();
  const res = await api('getCollection');
  if (res.status !== 'ok') { grid.textContent = 'エラー: ' + res.message; return; }
  const d = res.data;
  const map = {};
  d.unlocked.forEach(u => { map[u.id] = u; });

  summary.innerHTML = '<div class="big">' + d.total_unlocked + ' / ' + d.total_pokemon + '</div><div class="sub">解放済み</div>';

  // 解放済み + その後30匹までだけ表示（初期描画コスト低減）
  const showMax = Math.max(60, d.total_unlocked + 30);
  let html = '';
  for (let i = 1; i <= showMax && i <= d.total_pokemon; i++) {
    const u = map[i];
    const locked = !u;
    const shiny = u && u.shiny;
    html += '<div class="poke-cell ' + (locked ? 'locked' : '') + (shiny ? ' shiny' : '') + '">';
    html += '<img src="' + spriteUrl(i, shiny) + '" alt="" loading="lazy">';
    html += '<span class="poke-id">#' + String(i).padStart(4, '0') + '</span>';
    html += '</div>';
  }
  grid.innerHTML = html;
}
