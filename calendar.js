// 棒グラフカレンダー（軽量版）

function buildBarChart(days, maxBars) {
  const recent = days.slice(-maxBars);
  const maxCount = Math.max(...recent.map(d => d.count), 1);

  const bars = recent.map(d => {
    const pct = Math.round((d.count / maxCount) * 100);
    const dateObj = new Date(d.date + 'T00:00:00');
    const mo = dateObj.getMonth() + 1;
    const da = dateObj.getDate();
    const dow = ['日','月','火','水','木','金','土'][dateObj.getDay()];
    const label = `${mo}/${da}<br><span class="bar-chart__dow">${dow}</span>`;
    const active = d.count > 0;
    return `<div class="bar-chart__col${active ? ' active' : ''}" title="${d.date}: ${d.count}問">
      <div class="bar-chart__count">${d.count > 0 ? d.count : ''}</div>
      <div class="bar-chart__bar-wrap">
        <div class="bar-chart__bar" style="height:${pct}%"></div>
      </div>
      <div class="bar-chart__label">${label}</div>
    </div>`;
  }).join('');

  return `<div class="bar-chart">${bars}</div>`;
}

async function loadCalendar() {
  const gridEl = document.getElementById('calendar-grid');
  const summary = document.getElementById('calendar-summary');
  gridEl.innerHTML = '<div class="loading">読み込み中...</div>';

  const res = await api('getCalendar', { days: 84 });
  if (res.status !== 'ok') { gridEl.textContent = 'エラー: ' + res.message; return; }
  const days = res.data;

  const total = days.reduce((a, d) => a + d.count, 0);
  const activeDays = days.filter(d => d.count > 0).length;
  summary.innerHTML = `直近84日 — 学習日数 ${activeDays}日 / 解答 ${total}問`;

  gridEl.innerHTML = buildBarChart(days, 30);
}
