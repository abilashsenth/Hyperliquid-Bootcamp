/* Layer 5 · Time, sessions and timezones: lesson text and figures.
   Funding cadence and fee-tier timing from the docs; session shape from the K33 and arXiv studies in the media list;
   exchange hours from NYSE and CME schedules. IST is UTC+5:30 all year; US clocks move twice a year. */
(function (root) {
  'use strict';
  const F = root.FigLib, FIG = root.FIG || (root.FIG = {}), LESSONS = root.LESSONS || (root.LESSONS = {});

  FIG['clock-strip'] = P => F.svg(P, 660, 250, 'Three aligned rulers for the same day: UTC, IST which is always five and a half hours ahead, and New York time which is four or five hours behind depending on daylight saving', id => {
    let s = ''; const x0 = 100, x1 = 640; const X = h => x0 + h / 24 * (x1 - x0);
    const ruler = (y, name, offset, col, note) => { s += F.t(P, 20, y + 4, name, { weight: 800, size: 12, fill: col }); s += F.l(P, x0, y, x1, y, { stroke: P.line, sw: 2 }); for (let h = 0; h <= 24; h += 3) { const local = ((h + offset) % 24 + 24) % 24; s += F.l(P, X(h), y - 5, X(h), y + 5, { stroke: P.muted }); s += F.t(P, X(h), y + 18, String(Math.floor(local)).padStart(2, '0') + (local % 1 ? ':30' : ':00'), { anchor: 'middle', size: 9.5, mono: true, fill: P.muted }); } if (note) s += F.t(P, x0, y + 34, note, { size: 10, fill: P.muted }); };
    ruler(50, 'UTC', 0, P.ink, 'the exchange clock: funding at every :00, the day ends at 00:00');
    ruler(124, 'IST', 5.5, P.you, 'UTC+5:30, never changes: UTC events land at half past');
    ruler(198, 'New York', -5, P.oracle, 'UTC−5 in winter, UTC−4 in summer: US events shift an hour in IST');
    [0, 13.5, 21].forEach(h => s += F.l(P, X(h), 40, X(h), 210, { stroke: P.grid, sw: 1, dash: '3 3' }));
    s += F.pill(P, X(0) + 2, 24, '00:00 UTC = 05:30 IST', { anchor: 'start', size: 10, bg: P.inkSoft, fill: P.ink });
    s += F.pill(P, X(13.5), 104, 'US data 08:30 ET = 13:30 UTC (winter) = 19:00 IST', { size: 10, bg: P.inkSoft, fill: P.ink });
    return s;
  });

  FIG['session-ring'] = P => F.svg(P, 660, 360, 'A 24-hour ring in UTC with the Asia, Europe, US and late-US sessions shaded, the funding ticks every hour, and the daily close, London open, US data releases, NYSE open and close marked', id => {
    let s = ''; const cx = 200, cy = 180, r = 140;
    const ang = h => (h / 24) * Math.PI * 2 - Math.PI / 2; const pt = (h, rad) => [cx + rad * Math.cos(ang(h)), cy + rad * Math.sin(ang(h))];
    const arc = (h0, h1, rad, col) => { const [x0, y0] = pt(h0, rad), [x1, y1] = pt(h1, rad); const big = (h1 - h0) > 12 ? 1 : 0; s += F.p(P, `M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${rad} ${rad} 0 ${big} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`, { fill: col }); };
    arc(0, 7, r, P.inkSoft); arc(7, 13.5, r, P.oracleSoft); arc(13.5, 21, r, P.askSoft); arc(21, 24, r, P.youSoft);
    s += F.c(P, cx, cy, r, { fill: 'none', stroke: P.line, sw: 1.5 });
    for (let h = 0; h < 24; h++) { const [x0, y0] = pt(h, r), [x1, y1] = pt(h, r - (h % 6 ? 6 : 12)); s += F.l(P, x0, y0, x1, y1, { stroke: P.muted, sw: h % 6 ? 1 : 2 }); if (h % 6 === 0) { const [tx, ty] = pt(h, r + 16); s += F.t(P, tx, ty + 4, String(h).padStart(2, '0') + ':00', { anchor: 'middle', size: 10, mono: true, fill: P.muted }); } }
    const lab = (h, rad, text, col) => { const [x, y] = pt(h, rad); s += F.t(P, x, y + 4, text, { anchor: 'middle', size: 11, weight: 800, fill: col || P.ink }); };
    lab(3.5, 80, 'Asia', P.muted); lab(10.2, 80, 'Europe', P.oracle); lab(17.2, 80, 'US cash', P.ask); lab(22.5, 80, 'late US', P.you);
    const ev = (h, text) => { const [x0, y0] = pt(h, r), [x1, y1] = pt(h, r + 4); s += F.c(P, x0, y0, 4, { fill: P.ink }); };
    [0, 8, 13.5, 14.5, 21].forEach(h => ev(h));
    s += F.t(P, cx, cy + 4, 'UTC', { anchor: 'middle', size: 13, weight: 800, fill: P.muted });
    const lx = 390;
    s += F.t(P, lx, 40, 'the day’s shape, winter clocks', { weight: 800, size: 12.5 });
    const rows = [['00:00', '05:30 IST', 'daily close, Binance/Bybit funding, fee tier recompute'], ['08:00', '13:30 IST', 'London open; Friday options expiry'], ['13:30', '19:00 IST', 'US data (CPI, payrolls) on release days'], ['14:30', '20:00 IST', 'NYSE open: the loudest hour'], ['21:00', '02:30 IST', 'NYSE close; volume fades'], ['every :00', 'every :30 IST', 'Hyperliquid funding']];
    rows.forEach((rw, i) => { const y = 64 + i * 42; s += F.t(P, lx, y, rw[0], { size: 12, mono: true, weight: 700 }); s += F.t(P, lx + 80, y, rw[1], { size: 11, mono: true, fill: P.you }); s += F.wrap(P, lx, y + 15, rw[2], 250, { size: 10.5, fill: P.muted, lh: 12 }).s; });
    s += F.t(P, lx, 338, 'summer: every US-anchored row is one hour earlier in IST', { size: 10.5, fill: P.oracle, weight: 700 });
    return s;
  });

  FIG['dst-shift'] = P => F.svg(P, 640, 200, 'The NYSE open on an IST clock: 20:00 in winter and 19:00 in summer, because New York moves its clocks and India does not', id => {
    let s = ''; const x0 = 170, x1 = 600; const X = h => x0 + (h - 17) / 6 * (x1 - x0);
    const row = (y, name, open, close, col) => { s += F.t(P, 20, y + 4, name, { size: 12, weight: 800, fill: col }); s += F.l(P, x0, y, x1, y, { stroke: P.line, sw: 2 }); s += F.r(P, X(open), y - 9, X(close) - X(open), 18, { rx: 5, fill: col, op: .25 }); s += F.l(P, X(open), y - 14, X(open), y + 14, { stroke: col, sw: 2.5 }); s += F.t(P, X(open), y - 20, 'NYSE opens ' + open + ':00 IST', { anchor: 'middle', size: 10.5, fill: col, weight: 700 }); };
    row(70, 'winter (Nov–Mar)', 20, 23, P.you);
    row(140, 'summer (Mar–Nov)', 19, 22, P.oracle);
    s += F.axis(P, x0, x1, 176, [17, 18, 19, 20, 21, 22, 23].map(h => [X(h), h + ':00']));
    s += F.t(P, 20, 180, 'IST, evening', { size: 10, fill: P.muted });
    return s;
  });

  FIG['week-strip'] = P => F.svg(P, 660, 210,'A week from Monday to Sunday showing CME futures open from Sunday evening to Friday afternoon Chicago time with a daily hour-long break, and the weekend gap when only crypto trades', id => {
    let s = ''; const x0 = 70, x1 = 640; const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; const dw = (x1 - x0) / 7;
    days.forEach((d, i) => { s += F.t(P, x0 + i * dw + dw / 2, 30, d, { anchor: 'middle', size: 11, weight: 700, fill: P.muted }); s += F.l(P, x0 + i * dw, 40, x0 + i * dw, 150, { stroke: P.grid }); });
    s += F.t(P, 20, 70, 'crypto', { size: 11, weight: 800 }); s += F.r(P, x0, 58, x1 - x0, 22, { rx: 6, fill: P.youSoft }); s += F.t(P, (x0 + x1) / 2, 73, '24 hours, every day, funding every hour', { anchor: 'middle', size: 10.5, fill: P.you, weight: 700 });
    s += F.t(P, 20, 112, 'CME', { size: 11, weight: 800 });
    for (let i = 0; i < 5; i++) { const a = x0 + i * dw, b = a + dw; s += F.r(P, a, 100, dw * 0.95, 22, { rx: 6, fill: P.oracleSoft }); s += F.r(P, a + dw * 0.95, 100, dw * 0.05, 22, { fill: P.askSoft }); }
    s += F.r(P, x0 + 5 * dw, 100, dw * 1.85, 22, { rx: 6, fill: P.askSoft }); s += F.t(P, x0 + 5.92 * dw, 115, 'closed Fri 16:00 → Sun 17:00 CT', { anchor: 'middle', size: 9, fill: P.ask, weight: 700 });
    s += F.r(P, x0 + 6.85 * dw, 100, dw * 0.15, 22, { rx: 6, fill: P.oracleSoft });
    s += F.t(P, x0, 142, 'the thin red slices are the daily 16:00–17:00 CT maintenance break (03:30–04:30 IST in winter)', { size: 10, fill: P.muted });
    s += F.wrap(P, x0, 164, 'bitcoin keeps trading through the CME weekend, so Monday’s CME open often sits away from Friday’s close: the “CME gap” traders watch, and a weekend when books are thin and wicks are big.', 570, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  FIG['release-day'] = P => F.svg(P, 640, 200, 'A minute-by-minute strip around a US data release at 08:30 Eastern: a quiet hour before, a spike of range and volume in the first minutes, then a slow settling', id => {
    let s = ''; const x0 = 40, x1 = 600, y = 120; const X = m => x0 + (m + 60) / 150 * (x1 - x0);
    const pts = []; for (let m = -60; m <= 90; m += 2) { let v = 6 + Math.abs(Math.sin(m * 0.7)) * 4; if (m >= 0 && m < 15) v = 40 + 50 * Math.exp(-m / 4) * Math.abs(Math.sin(m * 1.9)) + 20 * Math.exp(-m / 6); else if (m >= 15) v = 12 + 14 * Math.exp(-(m - 15) / 25) * Math.abs(Math.sin(m * 0.5)); pts.push([X(m), y - v]); }
    s += F.poly(P, pts.concat([[X(90), y], [X(-60), y]]), { fill: P.askSoft, closed: true }); s += F.poly(P, pts, { stroke: P.ask, sw: 1.8 });
    s += F.l(P, X(0), 30, X(0), y + 6, { stroke: P.you, sw: 1.5, dash: '5 4' }); s += F.pill(P, X(0), 22, '08:30 ET release', { size: 10.5, bg: P.you, fill: P.surf });
    s += F.axis(P, x0, x1, y, [-60, -30, 0, 30, 60, 90].map(m => [X(m), (m > 0 ? '+' : '') + m + ' min']));
    s += F.t(P, x0, 160, 'range and volume per minute, stylised. The first minute often moves more than the whole hour before it.', { size: 10.5, fill: P.muted });
    s += F.t(P, x0, 180, 'the plan’s rule: no new trade within 15 minutes of a scheduled release unless the release is the trade.', { size: 10.5, fill: P.ink, weight: 700 });
    return s;
  });

  FIG['hip3-open-snap'] = P => F.svg(P, 660, 240, 'A HIP-3 stock perp over a weekend: the underlying is closed and the deployer’s oracle holds still while the perp drifts above it, then the stock opens and the oracle and the perp snap together', id => {
    let s = ''; const x0 = 40, x1 = 620, y = 130; const X = t => x0 + t / 100 * (x1 - x0);
    s += F.r(P, X(0), 40, X(62) - X(0), 150, { fill: P.inkSoft, op: .5 }); s += F.t(P, X(31), 56, 'underlying closed (weekend)', { anchor: 'middle', size: 11, fill: P.muted, weight: 700 });
    s += F.t(P, X(81), 56, 'underlying open', { anchor: 'middle', size: 11, fill: P.muted, weight: 700 });
    s += F.l(P, X(0), y, X(62), y, { stroke: P.oracle, sw: 2.5 }); s += F.p(P, `M${X(62)} ${y} L${X(64)} ${y - 26} L${X(70)} ${y - 22} L${X(80)} ${y - 30} L${X(100)} ${y - 28}`, { stroke: P.oracle, sw: 2.5 });
    const perp = []; for (let t = 0; t <= 62; t += 2) perp.push([X(t), y - 4 - t * 0.55 + 4 * Math.sin(t)]); perp.push([X(64), y - 27]); perp.push([X(70), y - 23]); perp.push([X(80), y - 29]); perp.push([X(100), y - 28]);
    s += F.poly(P, perp, { stroke: P.ink, sw: 2 });
    s += F.t(P, X(5), y + 18, 'oracle: frozen at Friday’s close', { size: 10.5, fill: P.oracle, weight: 700 });
    s += F.t(P, X(5), y - 44, 'perp: drifts on weekend news, premium builds, funding grows', { size: 10.5, fill: P.ink, weight: 700 });
    s += F.c(P, X(62), y, 6, { fill: P.you }); s += F.t(P, X(62), y + 36, 'the open: both snap to the real print', { anchor: 'middle', size: 10.5, fill: P.you, weight: 700 });
    s += F.wrap(P, x0, 212, 'the deployer, not the validators, runs this oracle. Do not hold a HIP-3 stock or index perp through its underlying’s open unless the open itself is the trade (Layer 8).', 580, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  LESSONS['layer-5'] = {
    intro: 'Crypto trades every hour of every day, which tempts people to think time does not matter. It matters more, not less, because so much of what moves the market runs on clocks that have nothing to do with crypto: funding at the top of every hour, a daily close at midnight UTC, the US stock market’s open and close, a futures exchange that shuts for the weekend, and a few government statistics with release times printed months in advance. This layer puts all of them on one clock, yours.',
    legend: 'In the pictures, black is UTC, blue is IST (your clock), amber is New York, the oracle or the underlying.',
    sections: [
      { id: 'clocks', t: 'The exchange runs on UTC; you live in IST',
        p: ['Hyperliquid’s clock is UTC. Funding settles at the top of each UTC hour; the fee tier recomputes at the end of each UTC day; the daily candle closes at 00:00 UTC. India Standard Time is UTC+5:30 all year, which makes the conversion easy and slightly odd: everything that happens on the hour in UTC happens at half past in IST.',
          'The trap is the United States, which moves its clocks twice a year (in 2026, daylight time ran from 8 March to 1 November). London moves too. So every US-anchored event, the stock market open, the data releases, the Fed, shifts by an hour in IST twice a year, while the UTC-anchored events stay put. Tokyo and India never move.'],
        fig: 'clock-strip', cap: 'The same day on three rulers. UTC and IST never change their offset; New York slides by an hour in March and November.',
        key: 'UTC events are at :30 in IST, all year. US events are at a different IST time in summer and winter.' },

      { id: 'heartbeat', t: 'The hourly heartbeat: funding at :00 UTC',
        p: ['Every hour, on the hour UTC, which is every half hour on your clock, whoever holds a position at that second pays or receives funding. The payment is small per hour and relentless over days, as Layer 3 showed. Two practical habits: look at the countdown in the header before opening a trade you intend to hold for minutes, because opening thirty seconds before the print means paying a full hour’s funding for thirty seconds of exposure; and expect a small flurry of orders in the minute around each print as people dodge or chase the payment.',
          'Layer 3’s last drill had you hold a 1x long on testnet across one print and watch the payment land in the funding history tab. If you skipped it, do it now; once you have seen it, you will never forget what the countdown is for.'],
        key: 'Funding is paid at the top of every UTC hour, :30 in IST. Check the countdown before any short hold.' },

      { id: 'midnight', t: '00:00 UTC: the day’s most watched minute',
        p: ['The daily candle closes at 00:00 UTC, 05:30 IST, and because so many traders and systems use the daily chart, where that candle closes matters more than any other price of the day. Levels drawn from daily closes are the ones Layer 6 trusts most. Binance and Bybit, the largest perp venues, pay their funding at 00:00, 08:00 and 16:00 UTC, so flows around those prints spill into every venue including this one. And Hyperliquid recomputes your fee tier at the same moment.',
          'In IST that is early morning, which is one reason the course sits one 00:00 UTC close in the drills: you need to have watched the book at 05:30 once to believe how quiet, or how violent, it can be.'],
        key: '00:00 UTC (05:30 IST) is the daily close, the big venues’ funding, and the fee-tier recompute. It is the level the market remembers.' },

      { id: 'sessions', t: 'Sessions as regimes', try: 'session-dial', figDocs: 'session-ring',
        p: ['The day has a shape. **Asia**, roughly 00:00 to 08:00 UTC, is usually the quietest: thinner books, smaller ranges, the occasional sharp move on no volume. **Europe**, 07:00 to 16:00 UTC, builds. The **US cash session**, from the New York open (14:30 UTC in winter, 13:30 in summer) to the close six and a half hours later, carries the most volume and almost all the macro-driven moves; the overlap of Europe and the US, roughly 19:00 to 22:00 IST depending on the season, is the loudest stretch of the day. After the New York close, volume fades into the next Asia session. Weekends are thin all the way through: bigger wicks on less size.',
          'The research in the media list puts numbers on it: US cash hours are under 30% of the day but carried roughly 36% to 43% of bitcoin spot volume, and about 40% even on weekends. The practical reading: your stop needs more room at 03:00 IST than at 20:00 IST, and a breakout at lunchtime in Asia means less than the same breakout at the US open.'],
        tryNote: 'Drag the hand to any time of day and read the session, the next funding, and what is scheduled. The ring is drawn in UTC with your IST time beside it.',
        key: 'Asia quiet, Europe builds, the US cash session carries the day. Weekends are thin. Give stops more room when the book is thin.' },

      { id: 'dst', t: 'Daylight saving: the twice-a-year trap',
        p: ['Here is the shift in one example. The New York Stock Exchange opens at 09:30 Eastern. In winter that is 14:30 UTC and 20:00 IST. In summer, when New York is on daylight time, it is 13:30 UTC and 19:00 IST. Every US-anchored row in this layer’s calendar moves the same way: data releases from 19:00 to 18:00 IST, the Fed’s statement from 00:30 to 23:30, the CME breaks and weekly close by an hour.',
          'Hyperliquid’s own events do not move, because they are on UTC. The market clock on this site does the conversion live and tells you which US regime is in force; the calendar table below the lesson lists both columns.'],
        fig: 'dst-shift', cap: 'The same NYSE open on your clock, in winter and in summer.',
        check: { q: 'It is July. US CPI is released at 08:30 Eastern. What time is that in IST?', o: ['19:00', '18:00', '17:30'], a: 1, why: 'In summer New York is UTC−4, so 08:30 ET is 12:30 UTC, which is 18:00 IST. In winter it would be 19:00.' },
        key: 'US events are one hour earlier in IST from March to November. Hyperliquid’s UTC events never move.' },

      { id: 'week', t: 'The week: CME and the weekend gap',
        p: ['The Chicago Mercantile Exchange trades bitcoin and equity-index futures almost around the clock on weekdays, but it closes from Friday 16:00 Central to Sunday 17:00 Central, with a daily break from 16:00 to 17:00 Central. Bitcoin itself keeps trading through the weekend on Hyperliquid and everywhere else, so when CME reopens on Sunday evening its first price is often away from Friday’s last: the **CME gap**, which a large number of traders watch and which the market has a habit of revisiting.',
          'For your purposes the weekend matters more than the gap. From Friday evening to Sunday evening the people who move size are mostly away, books are thin, and a modest order can print a long wick. The plan in Layer 7 is flat before the weekend unless the weekend is the trade.',
          'One more weekly clock, because a calendar row and a drill depend on it. Deribit, the largest crypto options venue, settles its options every Friday at 08:00 UTC (13:30 IST), with the big monthly batch on the last Friday of the month. Into an expiry the price often sits near a level where a lot of options are struck, which traders call pinning, and it tends to move more freely once the expiry has passed. You do not need to trade options to feel it; you only need to know why Friday mornings can go quiet and then suddenly not.'],
        fig: 'week-strip', cap: 'The week on two rows: crypto never stops; CME is closed from Friday afternoon to Sunday evening Chicago time, with a daily hour-long break.',
        key: 'CME closes Friday 16:00 CT and reopens Sunday 17:00 CT; Deribit options expire Fridays at 08:00 UTC. Weekend books are thin, and Monday often has a gap to fill.' },

      { id: 'releases', t: 'Scheduled releases: CPI, payrolls, the Fed',
        p: ['Three US releases move crypto reliably. Consumer price inflation (CPI) and the jobs report (nonfarm payrolls) come out at 08:30 Eastern on dates the Bureau of Labor Statistics publishes a year ahead; payrolls is usually the first Friday of the month. The Federal Reserve’s rate decision comes at 14:00 Eastern on the second day of each meeting, with a press conference thirty minutes later. The next of each is on the [market clock](#clock), loaded from the official schedules through December 2027.',
          'What they do to the tape is the same every time: a quiet hour, then a first minute that moves more than the hour before it did, then a slow settling as the market works out what it thinks. Hyperliquid’s mark price follows the big venues within seconds, so stops near the price get hit in that first minute whether or not the move lasts. The plan’s rule is blunt: no new trade within 15 minutes of a release unless the release itself is the trade, and nothing with a tight stop open across it.'],
        fig: 'release-day', cap: 'A release minute by minute. The spike is the first minute; the plan keeps you out of it.',
        key: 'CPI and payrolls at 08:30 ET, the Fed at 14:00 ET. The market clock has the dates. Nothing new within 15 minutes of them.' },

      { id: 'hip3-open', t: 'HIP-3 markets and the underlying’s open',
        p: ['Hyperliquid also lists perps on stocks, indices and commodities, deployed by builders rather than validators (Layer 8). They trade 24/7, but their underlying does not, and that creates a specific time trap. While the stock market is closed, the deployer’s oracle has nothing fresh to look at: it holds or drifts, while the perp keeps trading on weekend news, a premium builds, and funding grows with it. When the underlying opens, the oracle and the perp snap to the real print, sometimes a long way from where the perp spent the weekend.',
          'That is a feature if the open is your trade and a trap if you simply forgot. Do not hold a HIP-3 stock or index perp through its underlying’s open by accident.'],
        fig: 'hip3-open-snap', cap: 'A HIP-3 stock perp across a weekend: a frozen oracle, a drifting perp, and the snap at the open.',
        key: 'A HIP-3 perp trades while its underlying sleeps. The oracle freezes, the premium builds, and both snap at the open.' },

      { id: 'upgrades', t: 'Network upgrades',
        p: ['The last clock is the chain’s own. Hyperliquid upgrades are announced in advance on the official X account and Discord. During the short upgrade window only Post Only orders are accepted and nothing matches, and TWAPs pause. Plan no exits through an announced upgrade, and if you are holding, know that a market stop that triggers inside the window will wait until it closes.',
          'Put every recurring event in this layer into your own calendar in IST, with the month’s CPI, payrolls and Fed dates from the market clock. That is the first drill, and it is the one that quietly pays for the rest of the course.'],
        key: 'Upgrades are announced on X and Discord; during the window nothing matches. Put all of this in your calendar, in IST.' }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
