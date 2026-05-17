// GitHub草グラフ風カレンダー

async function loadCalendar() {
  const grid = document.getElementById('calendar-grid');
  const summary = document.getElementById('calendar-summary');
  grid.innerHTML = '<div class="loading">読み込み中...</div>';
  const res = await api('getCalendar', { days: 365 });
  if (res.status !== 'ok') { grid.textContent = 'エラー: ' + res.message; return; }
  const days = res.data;

  const total = days.reduce((a, d) => a + d.count, 0);
  const activeDays = days.filter(d => d.count > 0).length;
  summary.innerHTML = '直近365日 — 学習日数 ' + activeDays + '日 / 解答 ' + total + '問';

  // 7行×53列の縦並び（github風）
  const firstDate = new Date(days[0].date);
  const firstDow = firstDate.getDay(); // 0=Sun
  // 53列分のグリッドを行ごとに（日曜始まり）構築
  // シンプル実装: 横スクロール許容で1行=1日でつなぐ
  let html = '';
  // パディング先頭
  for (let i = 0; i < firstDow; i++) {
    html += '<div class="cal-cell" style="visibility:hidden"></div>';
  }
  days.forEach(d => {
    let lv = 'l0';
    if (d.count >= 16) lv = 'l4';
    else if (d.count >= 6) lv = 'l3';
    else if (d.count >= 1) lv = 'l1';
    html += '<div class="cal-cell ' + lv + '" title="' + d.date + ': ' + d.count + '問"></div>';
  });
  grid.innerHTML = html;
}
