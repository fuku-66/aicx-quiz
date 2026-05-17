// GitHub草グラフ風カレンダー

async function loadCalendar() {
  const gridEl = document.getElementById('calendar-grid');
  const summary = document.getElementById('calendar-summary');
  gridEl.innerHTML = '<div class="loading">読み込み中...</div>';
  const res = await api('getCalendar', { days: 365 });
  if (res.status !== 'ok') { gridEl.textContent = 'エラー: ' + res.message; return; }
  const days = res.data;

  const total = days.reduce((a, d) => a + d.count, 0);
  const activeDays = days.filter(d => d.count > 0).length;
  summary.innerHTML = '直近365日 — 学習日数 ' + activeDays + '日 / 解答 ' + total + '問';

  const firstDate = new Date(days[0].date + 'T00:00:00');
  const firstDow = firstDate.getDay(); // 0=Sun

  // 曜日ラベル（月・水・金のみ）
  const wdayLabels = ['', '月', '', '水', '', '金', ''];
  let labelsHtml = '';
  wdayLabels.forEach(lbl => { labelsHtml += '<span>' + lbl + '</span>'; });

  let cellsHtml = '';
  for (let i = 0; i < firstDow; i++) {
    cellsHtml += '<div class="cal-cell" style="background:transparent"></div>';
  }
  days.forEach(d => {
    let lv = 'l0';
    if (d.count >= 16) lv = 'l4';
    else if (d.count >= 6) lv = 'l3';
    else if (d.count >= 2) lv = 'l2';
    else if (d.count >= 1) lv = 'l1';
    cellsHtml += '<div class="cal-cell ' + lv + '" title="' + d.date + ': ' + d.count + '問"></div>';
  });

  gridEl.innerHTML =
    '<div class="cal-full-wrap">' +
      '<div class="cal-wday-labels">' + labelsHtml + '</div>' +
      '<div class="cal-cells">' + cellsHtml + '</div>' +
    '</div>' +
    '<div class="cal-legend"><span>少</span>' +
      ['l1', 'l2', 'l3', 'l4'].map(lv => '<div class="cal-legend-cell ' + lv + '"></div>').join('') +
    '<span>多</span></div>';
}
