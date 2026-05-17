// AICX Quiz Web App — main.js
// GitHub Pages版: fetchはGAS Web AppへCORS越し
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbynXSk736sYdLrEes2DDXQXYv6jFE05lPu4P-D5b-NPuypn8P7pepHMXUBtPtYvCwaQ/exec';

const PILLAR_NAMES = [
  '生成AIとAIエージェントの基礎',
  '業務の基礎',
  'AIデータリテラシーとマネジメント',
  '自動化レベルとワークフロー設計',
  '人と組織から考えるAI時代の組織設計',
  'AIエージェントを実装する5Dモデル',
];
const PILLAR_SHORT = ['Ch.01','Ch.02','Ch.03','Ch.04','Ch.05','Ch.06'];
const QUIZ_LIMIT = 20; // architecture.md 準拠

const state = {
  view: 'home',
  mode: 'weak',
  pillar: '',
  questions: [],
  currentIdx: 0,
  combo: 0,
  sessionAnswered: 0,
  sessionCorrect: 0,
  questionStartAt: 0,
};

// ---- API helper ----
// GAS Web AppへCORSプリフライト無しで通すため:
//  - GET: クエリ文字列で叩く（プリフライト不要）
//  - POST: Content-Type: text/plain にしてプリフライト回避（kakeibo方式）
async function api(action, params, method) {
  method = method || 'GET';
  if (method === 'GET') {
    const qs = new URLSearchParams(Object.assign({ action: action }, params || {})).toString();
    const r = await fetch(GAS_API_URL + '?' + qs, { redirect: 'follow' });
    return r.json();
  } else {
    const body = JSON.stringify(Object.assign({ action: action }, params || {}));
    const r = await fetch(GAS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: body,
      redirect: 'follow',
    });
    return r.json();
  }
}

// ---- View switching ----
function switchView(v) {
  state.view = v;
  document.querySelectorAll('.tabbar__btn').forEach(b => {
    const active = b.dataset.view === v;
    b.classList.toggle('tabbar__btn--active', active);
    if (active) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('.view').forEach(s => s.classList.toggle('view--active', s.id === 'view-' + v));
  if (v === 'home') loadHome();
  if (v === 'pokedex') loadPokedex();
  if (v === 'learn') { loadStats(); loadCalendar(); }
}

// ---- Home view ----
async function loadHome() {
  // pillar ring 3つ + 直近解放 + 84日カレンダー(mini) を並列取得
  const [statsRes, collectionRes, calRes] = await Promise.all([
    api('getStats'),
    api('getCollection'),
    api('getCalendar', { days: 84 }),
  ]);

  // pillar rings
  const ringsEl = document.getElementById('home-rings');
  if (statsRes.status === 'ok') {
    const pillars = statsRes.data.pillars || [];
    let html = '';
    pillars.forEach(p => {
      const pct = Math.round((p.rate || 0) * 100);
      const colorClass = 'ring--p' + p.pillar;
      html += '<div class="ring ' + colorClass + '">';
      html += '  <svg class="ring__svg" viewBox="0 0 36 36" aria-hidden="true">';
      html += '    <circle class="ring__bg" cx="18" cy="18" r="15.9155"></circle>';
      html += '    <circle class="ring__fill" cx="18" cy="18" r="15.9155" stroke-dasharray="' + pct + ',100"></circle>';
      html += '  </svg>';
      html += '  <div class="ring__text"><div class="ring__pct">' + pct + '%</div><div class="ring__lbl">' + PILLAR_SHORT[p.pillar] + '</div></div>';
      html += '</div>';
    });
    ringsEl.innerHTML = html;

    // 次の解放まで（10問正解ごと=normal trigger基準）
    const tc = statsRes.data.total_correct || 0;
    const nextRem = 10 - (tc % 10);
    const nextEl = document.getElementById('home-next-unlock');
    if (nextEl) nextEl.textContent = 'あと ' + nextRem + ' 問正解で次のポケモン解放';
  } else {
    ringsEl.innerHTML = '<div class="ring-loading">統計取得エラー</div>';
  }

  // 直近解放3匹
  const recentEl = document.getElementById('home-recent-unlocks');
  if (collectionRes.status === 'ok') {
    await ensurePokemonNames();
    const unlocked = collectionRes.data.unlocked || [];
    const recent3 = unlocked.slice(-3).reverse();
    if (recent3.length === 0) {
      recentEl.innerHTML = '<div class="home__recent-empty">まだ解放されたポケモンはいません。クイズを始めて1匹目を解放しよう。</div>';
    } else {
      let html = '';
      recent3.forEach(u => {
        html += '<div class="home__recent-cell' + (u.shiny ? ' home__recent-cell--shiny' : '') + '">';
        html += '  <img src="' + spriteUrl(u.id, u.shiny) + '" alt="" loading="lazy">';
        html += '  <span class="home__recent-name">#' + String(u.id).padStart(4, '0') + ' ' + getPokemonName(u.id) + '</span>';
        html += '</div>';
      });
      html += '<button type="button" class="home__recent-more" id="home-to-pokedex">→ 図鑑へ</button>';
      recentEl.innerHTML = html;
      const more = document.getElementById('home-to-pokedex');
      if (more) more.addEventListener('click', () => switchView('pokedex'));
    }
  } else {
    recentEl.textContent = '取得エラー';
  }

  // 84日草グラフ (mini)
  const miniEl = document.getElementById('home-calendar-mini');
  if (calRes.status === 'ok') {
    const days = calRes.data;
    let html = '<div class="cal-mini">';
    days.forEach(d => {
      let lv = 'l0';
      if (d.count >= 16) lv = 'l4';
      else if (d.count >= 6) lv = 'l3';
      else if (d.count >= 1) lv = 'l1';
      html += '<div class="cal-cell ' + lv + '" title="' + d.date + ': ' + d.count + '問"></div>';
    });
    html += '</div>';
    const total = days.reduce((a, d) => a + d.count, 0);
    const activeDays = days.filter(d => d.count > 0).length;
    html += '<div class="cal-mini__sub">直近84日 — 学習 ' + activeDays + '日 / 解答 ' + total + '問</div>';
    miniEl.innerHTML = html;
  } else {
    miniEl.textContent = '取得エラー';
  }
}

// ---- Quiz flow ----
async function startSession() {
  state.questions = [];
  state.currentIdx = 0;
  state.sessionAnswered = 0;
  state.sessionCorrect = 0;
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('quiz-loading').classList.remove('hidden');
  document.getElementById('quiz-card').classList.add('hidden');

  state.mode = document.getElementById('mode-select').value;
  state.pillar = document.getElementById('pillar-select').value;

  const res = await api('getQuestions', { mode: state.mode, pillar: state.pillar, limit: QUIZ_LIMIT });
  document.getElementById('quiz-loading').classList.add('hidden');

  if (res.status !== 'ok' || !res.data || res.data.length === 0) {
    alert('問題が取得できなかった: ' + (res.message || '0件'));
    return;
  }
  state.questions = res.data;
  await refreshCombo();
  renderQuestion();
}

async function refreshCombo() {
  const res = await api('getStats');
  if (res.status === 'ok') {
    state.combo = res.data.current_combo || 0;
    updateComboBar();
  }
}

function updateComboBar() {
  const bar = document.getElementById('combo-bar');
  if (state.combo > 0) {
    bar.classList.remove('hidden');
    document.getElementById('combo-count').textContent = state.combo;
  } else {
    bar.classList.add('hidden');
  }
}

function renderQuestion() {
  const card = document.getElementById('quiz-card');
  card.classList.remove('hidden');
  const q = state.questions[state.currentIdx];
  if (!q) { finishSession(); return; }

  const tag = document.getElementById('quiz-pillar-tag');
  tag.textContent = PILLAR_SHORT[q.pillar] + ': ' + PILLAR_NAMES[q.pillar];
  tag.className = 'pillar-tag p' + q.pillar;

  document.getElementById('quiz-progress').textContent = (state.currentIdx + 1) + ' / ' + state.questions.length;
  document.getElementById('quiz-question').textContent = q.question;

  const choicesEl = document.getElementById('quiz-choices');
  choicesEl.innerHTML = '';
  q.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.type = 'button';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    btn.setAttribute('aria-label', '選択肢' + (i + 1) + ': ' + c);
    btn.textContent = c;
    btn.addEventListener('click', () => selectChoice(i));
    choicesEl.appendChild(btn);
  });
  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('next-btn').classList.add('hidden');
  state.questionStartAt = Date.now();
}

async function selectChoice(idx) {
  const q = state.questions[state.currentIdx];
  const correct = (idx === q.answer_index);
  const seconds = Math.round((Date.now() - state.questionStartAt) / 1000);

  // UI更新
  const buttons = document.querySelectorAll('#quiz-choices .choice-btn');
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer_index) b.classList.add('show-correct');
    if (i === idx) {
      b.classList.add(correct ? 'correct' : 'wrong');
      b.setAttribute('aria-checked', 'true');
    }
  });

  // フィードバック
  const fb = document.getElementById('quiz-feedback');
  fb.className = 'quiz-feedback ' + (correct ? 'correct-fb' : 'wrong-fb');
  fb.textContent = (correct ? '◯ 正解。 ' : '✕ 不正解。 ') + (q.explanation || '');
  fb.classList.remove('hidden');
  document.getElementById('next-btn').classList.remove('hidden');

  // コンボ更新
  state.sessionAnswered++;
  if (correct) {
    state.sessionCorrect++;
    state.combo++;
  } else {
    state.combo = 0;
  }
  updateComboBar();

  // サーバ送信
  const res = await api('recordAttempt', {
    question_id: q.id,
    correct: correct,
    seconds: seconds,
    mode: state.mode,
    combo_count: state.combo,
  }, 'POST');

  if (res.status === 'ok' && res.data.newly_unlocked && res.data.newly_unlocked.length > 0) {
    showUnlocks(res.data.newly_unlocked);
  }
}

function nextQuestion() {
  state.currentIdx++;
  if (state.currentIdx >= state.questions.length) {
    finishSession();
  } else {
    renderQuestion();
  }
}

function finishSession() {
  document.getElementById('quiz-card').classList.add('hidden');
  const result = document.getElementById('quiz-result');
  result.classList.remove('hidden');
  document.getElementById('result-summary').innerHTML =
    '正答 ' + state.sessionCorrect + ' / ' + state.sessionAnswered + ' 問<br>' +
    '正答率 ' + Math.round(state.sessionCorrect / Math.max(1, state.sessionAnswered) * 100) + '%';
}

// ---- Stats view (資料タブ内) ----
async function loadStats() {
  const el = document.getElementById('stats-content');
  el.innerHTML = '<div class="loading">読み込み中...</div>';
  const res = await api('getStats');
  if (res.status !== 'ok') { el.textContent = 'エラー: ' + res.message; return; }
  const d = res.data;

  let html = '';
  html += '<div class="stat-card"><h3>累計</h3><div class="total-summary">';
  html += '<div class="total-block"><div class="num">' + d.total_attempts + '</div><div class="lbl">解答数</div></div>';
  html += '<div class="total-block"><div class="num">' + d.total_correct + '</div><div class="lbl">正解数</div></div>';
  html += '<div class="total-block"><div class="num">' + d.current_combo + '</div><div class="lbl">現コンボ</div></div>';
  html += '</div></div>';

  html += '<div class="stat-card"><h3>pillar別 正答率</h3>';
  d.pillars.forEach(p => {
    const pct = Math.round(p.rate * 100);
    html += '<div class="pillar-row">';
    html += '<div class="pillar-name">' + PILLAR_SHORT[p.pillar] + ' ' + PILLAR_NAMES[p.pillar] + '</div>';
    html += '<div class="pillar-bar"><div class="pillar-fill p' + p.pillar + '" style="width:' + pct + '%"></div></div>';
    html += '<div class="pillar-rate">' + pct + '%' + (p.mastered ? '<span class="mastered-badge">★</span>' : '') + '</div>';
    html += '</div>';
  });
  html += '</div>';

  if (d.weak_questions && d.weak_questions.length > 0) {
    html += '<div class="stat-card"><h3>次の目標(正答率<60%)</h3><div class="weak-list">';
    d.weak_questions.forEach(w => {
      html += '<div class="weak-item"><span>' + w.id + '</span><span class="weak-rate">' + Math.round(w.rate * 100) + '%</span></div>';
    });
    html += '</div></div>';
  }

  el.innerHTML = html;
}

// ---- Unlocks UI ----
let unlockQueue = [];
function showUnlocks(arr) {
  unlockQueue = unlockQueue.concat(arr);
  if (document.getElementById('unlock-overlay').classList.contains('hidden')) {
    showNextUnlock();
  }
}
function showNextUnlock() {
  if (unlockQueue.length === 0) return;
  const u = unlockQueue.shift();
  const overlay = document.getElementById('unlock-overlay');
  document.getElementById('unlock-img').src = spriteUrl(u.pokedex_id, u.is_shiny);
  document.getElementById('unlock-name').textContent = '#' + String(u.pokedex_id).padStart(4, '0') + ' ' + getPokemonName(u.pokedex_id) + (u.is_shiny ? ' ✨' : '');
  document.getElementById('unlock-trigger').textContent = triggerLabel(u.trigger);
  overlay.classList.remove('hidden');
}
function triggerLabel(t) {
  if (t === 'normal') return '10問正解達成';
  if (t === 'combo3') return '3連コンボ';
  if (t === 'combo5') return '5連コンボ +2';
  if (t === 'combo10') return '10連コンボ +5';
  if (t && t.indexOf('pillar_master_') === 0) return '分野制覇 伝説';
  if (t === 'all_master') return '全分野制覇 幻';
  return t;
}

// ---- Event wiring ----
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tabbar__btn').forEach(b => {
    b.addEventListener('click', () => switchView(b.dataset.view));
  });
  const homeCta = document.getElementById('home-cta');
  if (homeCta) homeCta.addEventListener('click', () => {
    switchView('quiz');
    setTimeout(startSession, 100);
  });
  document.getElementById('start-btn').addEventListener('click', startSession);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('restart-btn').addEventListener('click', startSession);
  const resultHomeBtn = document.getElementById('result-home-btn');
  if (resultHomeBtn) resultHomeBtn.addEventListener('click', () => switchView('home'));
  document.getElementById('unlock-close').addEventListener('click', () => {
    document.getElementById('unlock-overlay').classList.add('hidden');
    setTimeout(showNextUnlock, 200);
  });
  // 初期表示はホーム
  loadHome();
  refreshCombo();
});
