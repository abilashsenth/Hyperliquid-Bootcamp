/* Layer 3 · Prices and funding: lesson text and figures.
   Oracle and mark construction from the Robust price indices and Oracle pages; funding from the Funding and
   Contract specifications pages; hyperps from the Hyperps page. All opened 3 Nov 2026. */
(function (root) {
  'use strict';
  const F = root.FigLib, FIG = root.FIG || (root.FIG = {}), LESSONS = root.LESSONS || (root.LESSONS = {});

  FIG['three-prices'] = P => F.svg(P, 660, 250, 'Three price lines over the same minutes: the last trade and mid from the Hyperliquid book, the oracle built from other exchanges, and the mark that blends them; each is labelled with what it is used for', id => {
    let s = ''; const x0 = 30, x1 = 420;
    const base = [[x0, 120], [90, 112], [150, 126], [210, 118], [270, 100], [330, 108], [390, 96], [x1, 100]];
    const shift = (pts, dy, jag) => pts.map((q, i) => [q[0], q[1] + dy + (jag ? (i % 2 ? 6 : -6) : 0)]);
    s += F.p(P, F.curve(shift(base, 14, false)), { stroke: P.oracle, sw: 2, dash: '5 4' });
    s += F.poly(P, shift(base, -10, true), { stroke: P.muted, sw: 1.8, dash: '2 4' });
    s += F.p(P, F.curve(base), { stroke: P.ink, sw: 2.4 });
    const row = (y, col, name, use, dash) => { s += F.l(P, 440, y, 466, y, { stroke: col, sw: 2.2, dash }); s += F.t(P, 474, y + 4, name, { size: 12, weight: 800, fill: col }); s += F.wrap(P, 474, y + 20, use, 180, { size: 10.5, fill: P.muted, lh: 13 }).s; };
    row(50, P.muted, 'last trade and mid', 'what the book shows; display only', '2 4');
    row(112, P.oracle, 'oracle', 'spot on other exchanges; sets funding', '5 4');
    row(174, P.ink, 'mark', 'the fair price: liquidations, TP/SL, PnL');
    s += F.t(P, x0, 220, 'the three can sit a few ticks apart for minutes. Only one of them can liquidate you.', { size: 11.5, fill: P.muted });
    return s;
  });

  FIG['oracle-median'] = P => F.svg(P, 660, 280, 'Eight spot sources with their weights feed each validator, which publishes a weighted median every three seconds; the chain then takes the stake-weighted median across validators to get the oracle price', id => {
    let s = '';
    const src = [['Binance', 3], ['OKX', 2], ['Bybit', 2], ['Kraken', 1], ['KuCoin', 1], ['Gate', 1], ['MEXC', 1], ['Hyperliquid', 1]];
    src.forEach((e, i) => { const x = 20 + i * 80; const w = 72; s += F.r(P, x, 30, w, 40, { rx: 8, fill: e[1] === 3 ? P.oracle : (e[1] === 2 ? P.oracleSoft : P.surf), stroke: P.oracle, sw: 1.2 }); s += F.t(P, x + w / 2, 47, e[0], { anchor: 'middle', size: 10.5, weight: 800, fill: e[1] === 3 ? P.surf : P.ink }); s += F.t(P, x + w / 2, 62, 'weight ' + e[1], { anchor: 'middle', size: 9.5, fill: e[1] === 3 ? P.surf : P.muted }); s += F.l(P, x + w / 2, 70, 330, 108, { stroke: P.line, sw: 1 }); });
    s += F.box(P, 200, 110, 260, 48, 'each validator: weighted median of spot mids', ['published about every 3 seconds'], { size: 12, stroke: P.oracle });
    s += F.l(P, 330, 158, 330, 184, { stroke: P.muted, sw: 1.4, arrow: 'muted', id });
    s += F.box(P, 170, 186, 320, 46, 'the chain: stake-weighted median of the validators’ numbers', ['= the oracle price'], { size: 12, stroke: P.oracle, fill: P.oracleSoft });
    s += F.t(P, 20, 254, 'for assets whose real market is elsewhere (BTC), Hyperliquid’s own spot is left out; for assets born here (HYPE), outside', { size: 10.5, fill: P.muted });
    s += F.t(P, 20, 270, 'sources are left out until they are liquid enough. One exchange printing a bad tick cannot move a weighted median.', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['mark-median'] = P => F.svg(P, 660, 300, 'Three estimates feed the mark price: the oracle plus a smoothed Hyperliquid premium, the median of Hyperliquid’s best bid, best ask and last trade, and a weighted median of the big exchanges’ perp prices; the mark is the median of the three', id => {
    let s = '';
    const ins = [['1 · oracle + premium', 'oracle price plus a 150-second EMA of (Hyperliquid mid − oracle)', P.oracle], ['2 · Hyperliquid’s own book', 'median of best bid, best ask and last trade here', P.bid], ['3 · other exchanges’ perps', 'weighted median of Binance 3, OKX 2, Bybit 2, Gate 1, MEXC 1', P.you]];
    ins.forEach((e, i) => { const y = 24 + i * 62; s += F.r(P, 20, y, 300, 50, { rx: 10, fill: P.surf, stroke: e[2], sw: 1.4 }); s += F.t(P, 32, y + 20, e[0], { size: 12, weight: 800 }); s += F.wrap(P, 32, y + 37, e[1], 280, { size: 10, fill: P.muted, lh: 12 }).s; s += F.l(P, 320, y + 25, 380, 118, { stroke: P.muted, sw: 1.2, arrow: 'muted', id }); });
    s += F.box(P, 382, 86, 120, 64, 'median', ['of the three'], { size: 13, stroke: P.ink });
    s += F.l(P, 502, 118, 540, 118, { stroke: P.ink, sw: 1.6, arrow: 'ink', id });
    s += F.box(P, 542, 80, 100, 76, 'mark price', ['every ~3 s'], { size: 13, stroke: P.ink, fill: P.inkSoft });
    s += F.t(P, 382, 182, 'used for', { size: 11, weight: 800 });
    ['liquidations', 'TP/SL and stop triggers', 'unrealized PnL', 'margin checks'].forEach((u, i) => s += F.t(P, 382, 200 + i * 16, '· ' + u, { size: 11, fill: P.muted }));
    s += F.wrap(P, 20, 232, 'why a median: a spike in any one input is ignored unless the other two agree. A wick on Hyperliquid alone barely moves the mark; a move on Binance and Bybit moves it within seconds. If only two inputs exist, a 30-second EMA of the Hyperliquid book median is added as a third.', 340, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  FIG['funding-clamp'] = P => F.svg(P, 660, 300, 'The funding rate against the premium: a flat zone at 0.01 percent per eight hours when the premium is between minus 0.04 and plus 0.06 percent, and a slope of one outside it, shifted by the 0.05 percent clamp; positive rates mean longs pay', id => {
    let s = ''; const x0 = 70, x1 = 600, y0 = 40, y1 = 230; const pLo = -0.22, pHi = 0.22, fLo = -0.2, fHi = 0.2;
    const X = p => x0 + (p - pLo) / (pHi - pLo) * (x1 - x0), Y = f => y1 - (f - fLo) / (fHi - fLo) * (y1 - y0);
    s += F.r(P, x0, y0, x1 - x0, Y(0) - y0, { fill: P.askSoft, op: .5 }); s += F.r(P, x0, Y(0), x1 - x0, y1 - Y(0), { fill: P.bidSoft, op: .5 });
    s += F.t(P, x1 - 6, y0 + 16, 'rate above zero: longs pay shorts', { anchor: 'end', size: 11, fill: P.ask, weight: 700 }); s += F.t(P, x1 - 6, y1 - 8, 'rate below zero: shorts pay longs', { anchor: 'end', size: 11, fill: P.bid, weight: 700 });
    s += F.l(P, x0, Y(0), x1, Y(0), { stroke: P.line, sw: 1.2 }); s += F.l(P, X(0), y0, X(0), y1, { stroke: P.line, sw: 1.2 });
    const f = p => p + Math.max(-0.05, Math.min(0.05, 0.01 - p));
    const pts = []; for (let p = pLo; p <= pHi + 1e-9; p += 0.005) pts.push([X(p), Y(f(p))]);
    s += F.poly(P, pts, { stroke: P.ink, sw: 2.4 });
    s += F.l(P, X(-0.04), Y(0.01) + 14, X(0.06), Y(0.01) + 14, { stroke: P.you, sw: 1.4 }); s += F.t(P, X(0.01), Y(0.01) + 28, 'flat zone: rate = 0.01% per 8 h whatever the premium', { anchor: 'middle', size: 10.5, fill: P.you, weight: 700 });
    [-0.2, -0.1, 0, 0.1, 0.2].forEach(p => { s += F.t(P, X(p), y1 + 16, (p > 0 ? '+' : '') + p.toFixed(2) + '%', { anchor: 'middle', size: 10, mono: true, fill: P.muted }); s += F.t(P, x0 - 8, Y(p) + 4, (p > 0 ? '+' : '') + p.toFixed(2) + '%', { anchor: 'end', size: 10, mono: true, fill: P.muted }); });
    s += F.t(P, (x0 + x1) / 2, y1 + 34, 'premium: how far the perp sits above the oracle, averaged over the hour (per 8 h)', { anchor: 'middle', size: 10.5, fill: P.muted });
    s += F.t(P, 14, 24, 'funding rate per 8 h', { size: 10.5, fill: P.muted });
    s += F.t(P, x0, 272, 'rate = premium + clamp(0.01% − premium, −0.05%, +0.05%). One eighth of it is paid every hour on the hour, capped at 4% an hour.', { size: 10.5, fill: P.muted });
    s += F.t(P, x0, 288, 'outside the flat zone the rate is the premium minus 0.05% (above) or plus 0.05% (below): crowding is charged almost one for one.', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['funding-cost-bars'] = P => F.svg(P, 660, 240, 'What a 1,000 dollar long pays per day at three hourly funding rates: 30 cents at the neutral rate, 2.40 dollars when crowded, and 960 dollars at the 4 percent cap', id => {
    let s = ''; const rows = [['neutral: 0.00125% an hour', '$0.30 a day', '$9 a month, 11% a year', 0.3], ['crowded: 0.01% an hour', '$2.40 a day', '$72 a month, 88% a year', 2.4], ['the cap: 4% an hour', '$960 a day', 'the position is gone in a day', 960]];
    s += F.t(P, 20, 26, 'a $1,000 long, held, at three funding rates', { weight: 800, size: 13 });
    rows.forEach((r, i) => { const y = 54 + i * 54; const w = 20 + Math.log10(1 + r[3]) / Math.log10(961) * 380; s += F.t(P, 20, y - 2, r[0], { size: 12, weight: 700 }); s += F.r(P, 20, y + 6, w, 18, { rx: 5, fill: i === 2 ? P.ask : (i === 1 ? P.oracle : P.bid), op: .85 }); s += F.t(P, 28 + w, y + 19, r[1], { size: 12, mono: true, weight: 700 }); s += F.t(P, 28 + w + (r[1].length * 7.5), y + 19, '· ' + r[2], { size: 10.5, fill: P.muted }); });
    s += F.t(P, 20, 222, 'bars are on a log scale. Funding is paid on the oracle notional, every hour, straight to the other side; the exchange keeps none of it.', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['impact-price'] = P => F.svg(P, 640, 260, 'An ask ladder with the first twenty thousand dollars of depth shaded: the impact ask is the average price of filling that much, which is what the funding premium measures instead of the best ask', id => {
    const asks = [[77250, 0.05], [77251, 0.04], [77252, 0.09], [77253, 0.12], [77254, 0.3], [77255, 0.6]];
    const L = F.ladder(P, asks, [], { x: 16, y: 14, w: 270, rowH: 24, unit: 'BTC', spread: false, total: true, consumed: { 77250: 1, 77251: 1, 77252: 1, 77253: 1, 77254: 0.0, 77255: 0 } });
    let s = L.s;
    const x = 310;
    s += F.t(P, x, 34, 'impact notional for BTC: 20,000 USDC', { weight: 800, size: 13 });
    s += F.wrap(P, x, 58, 'the best ask is 77,250, but only 0.05 BTC ($3,862) rests there. Buying $20,000 walks through 77,251, 77,252 and part of 77,253; the average, about 77,251.6, is the impact ask.', 310, { size: 11.5, fill: P.ink, lh: 15 }).s;
    s += F.wrap(P, x, 140, 'the funding premium compares the impact bid and impact ask to the oracle, sampled every 5 seconds and averaged over the hour. A tiny order at the touch cannot fake a premium; it takes real size on the book to move it.', 310, { size: 11, fill: P.muted, lh: 14 }).s;
    s += F.t(P, x, 232, 'BTC and ETH use 20,000 USDC; every other asset 6,000 USDC.', { size: 11, fill: P.muted, weight: 700 });
    return s;
  });

  FIG['oi-vs-volume'] = P => F.svg(P, 660, 240, 'Open interest drawn as the level in a tank, positions currently held and counted once, next to volume drawn as flow through a pipe; a gauge shows premium as the perp price minus the oracle', id => {
    let s = '';
    s += F.r(P, 30, 50, 150, 150, { rx: 12, fill: P.surf, stroke: P.line, sw: 1.5 }); s += F.r(P, 34, 120, 142, 76, { rx: 8, fill: P.youSoft });
    s += F.t(P, 105, 34, 'open interest', { anchor: 'middle', weight: 800, size: 13 }); s += F.t(P, 105, 150, 'positions held now', { anchor: 'middle', size: 11, fill: P.you, weight: 700 }); s += F.t(P, 105, 166, 'each pair counted once', { anchor: 'middle', size: 10, fill: P.muted });
    s += F.wrap(P, 30, 216, 'a level: rises when positions open, falls when they close', 160, { size: 10, fill: P.muted, lh: 12 }).s;
    s += F.r(P, 230, 110, 180, 30, { rx: 15, fill: P.surf, stroke: P.line, sw: 1.5 }); for (let i = 0; i < 5; i++) s += F.l(P, 240 + i * 36, 125, 262 + i * 36, 125, { stroke: P.muted, sw: 2, arrow: 'muted', id });
    s += F.t(P, 320, 34, 'volume', { anchor: 'middle', weight: 800, size: 13 }); s += F.t(P, 320, 90, 'size that traded in a window', { anchor: 'middle', size: 11, fill: P.muted });
    s += F.wrap(P, 230, 216, 'a flow: resets daily; opening and closing both count', 180, { size: 10, fill: P.muted, lh: 12 }).s;
    s += F.c(P, 540, 125, 60, { fill: P.surf, stroke: P.line, sw: 1.5 }); s += F.l(P, 540, 125, 578, 92, { stroke: P.ask, sw: 2.5 }); s += F.c(P, 540, 125, 4, { fill: P.ink });
    s += F.t(P, 540, 34, 'premium (basis)', { anchor: 'middle', weight: 800, size: 13 }); s += F.t(P, 540, 60, 'perp price − oracle', { anchor: 'middle', size: 11, fill: P.muted });
    s += F.t(P, 500, 170, '−', { size: 12, fill: P.bid, weight: 800 }); s += F.t(P, 578, 170, '+', { size: 12, fill: P.ask, weight: 800 });
    s += F.wrap(P, 462, 216, 'a persistent plus: crowded longs, paying funding to stay', 170, { size: 10, fill: P.muted, lh: 12 }).s;
    return s;
  });

  FIG['hyperp-ema'] = P => F.svg(P, 640, 246,'A hyperp’s jagged mark price with its own smooth eight-hour moving average underneath acting as the oracle, and the caps that stop the mark running away from it', id => {
    let s = ''; const x0 = 30, x1 = 610;
    const pts = []; for (let i = 0; i <= 58; i++) { const x = x0 + i * 10; pts.push([x, 120 - 30 * Math.sin(i / 6) + (i % 3 === 0 ? 12 : -8) * Math.sin(i * 1.3)]); }
    const ema = []; let e = pts[0][1]; pts.forEach(q => { e = e + (q[1] - e) * 0.12; ema.push([q[0], e + 6]); });
    s += F.poly(P, pts, { stroke: P.ink, sw: 1.8 }); s += F.p(P, F.curve(ema), { stroke: P.oracle, sw: 2.4 });
    s += F.t(P, x0, 30, 'hyperp mark price (its own trading, plus pre-launch perps elsewhere)', { size: 11, weight: 700 });
    s += F.t(P, x1, 200, 'oracle = 8-hour EMA of its own minutely marks', { anchor: 'end', size: 11, fill: P.oracle, weight: 700 });
    s += F.wrap(P, x0, 216, 'no spot market exists yet, so funding pushes against the asset’s own momentum. Caps: mark ≤ 3× the EMA, oracle ≤ 4× the month’s average mark.', 560, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  FIG['asset-header'] = P => F.svg(P, 660, 182,'The asset header strip with its seven fields labelled: mark, oracle, 24-hour change, 24-hour volume, open interest, funding rate and the countdown to the next payment', id => {
    let s = '';
    s += F.r(P, 16, 20, 628, 44, { rx: 10, fill: P.surf, stroke: P.line, sw: 1.3 });
    const fields = [['BTC-USD', ''], ['77,249.6', 'mark'], ['77,241.0', 'oracle'], ['−1.2%', '24h change'], ['$2.1B', '24h volume'], ['$4.3B', 'open interest'], ['0.0013%', 'funding'], ['23:41', 'next in']];
    fields.forEach((f, i) => { const x = 30 + i * 78; s += F.t(P, x, 38, f[0], { size: 11.5, mono: true, weight: 700 }); s += F.t(P, x, 54, f[1], { size: 9.5, fill: P.muted }); });
    const notes = [[108, 'mark: the price that can liquidate you'], [186, 'oracle: the outside world; it sets funding'], [342, 'volume: thin means wide spreads and slippage'], [420, 'open interest: positions open now; read with price in Layer 6'], [498, 'funding: the hourly rate and its sign; positive means longs pay']];
    notes.forEach((n, i) => { const y = 84 + i * 15; s += F.l(P, n[0], 64, n[0], y - 10 - (i ? 0 : 0), { stroke: P.line, sw: 1, dash: '2 2' }); s += F.t(P, 30, y, n[1], { size: 10, fill: P.muted }); });
    s += F.t(P, 30, 170, 'mark − oracle = the premium, +8.6 here. Positive premium, positive funding, longs paying.', { size: 10.5, fill: P.ink, weight: 700 });
    return s;
  });

  LESSONS['layer-3'] = {
    intro: 'Hyperliquid shows you three prices for every asset, and the one you watch most, the last trade, is the one the exchange cares about least. This layer builds the other two from scratch: the oracle, which sets funding, and the mark, which decides liquidations and triggers. Then it takes funding apart, formula and all, and turns it into dollars per day, which is the number you will actually use.',
    legend: 'In the pictures, amber is the oracle or anything from outside Hyperliquid, black is the mark, grey dashes are Hyperliquid’s own book, blue is you.',
    sections: [
      { id: 'three-prices', t: 'Three prices on one screen',
        p: ['Open any market and the header shows a **mark** price and an **oracle** price; the book and the tape show the **last trade** and the mid. They are rarely identical, and each has a job.',
          'The last trade and mid are just what Hyperliquid’s own book did a moment ago. They are for display. The oracle is the outside world: a weighted median of the coin’s spot price on the big exchanges, published by the validators about every three seconds. It is used to compute funding. The mark is the exchange’s best estimate of the fair perp price, built from the oracle, Hyperliquid’s own book, and other exchanges’ perps, and it is used for everything that matters: liquidations, TP/SL triggers, unrealized PnL and margin checks.',
          'The practical consequence came up in Layer 2 and is worth repeating: things happen to your position at the mark price, which can differ from any price on your screen’s tape by a few ticks for minutes at a time.'],
        fig: 'three-prices', cap: 'The three prices over the same minutes. The grey dashes are the tape, the amber dashes the oracle, the black line the mark.',
        key: 'Last is for looking at. Oracle sets funding. Mark decides liquidations, triggers and PnL.' },

      { id: 'oracle', t: 'The oracle: a weighted median of other exchanges', try: 'median-explorer', figDocs: 'oracle-median',
        p: ['Every validator watches the spot price on eight sources and publishes a weighted median: Binance counts three times, OKX and Bybit twice each, Kraken, KuCoin, Gate, MEXC and Hyperliquid’s own spot once each. For a coin whose real market is elsewhere, like BTC, Hyperliquid’s spot is left out; for a coin born here, like HYPE, outside sources are left out until they are liquid. The chain then takes a median across all the validators’ numbers, weighted by **stake**, the amount of HYPE each validator has locked up to earn the right to run the chain, so a bigger validator counts for more. The result is the oracle price, refreshed about every three seconds.',
          'A **median** is the point with half the weight below it and half above. The reason it is used instead of an average is that it ignores outliers: one exchange printing a bad tick, or one validator submitting a bad number, cannot move it unless more than half the weight agrees. Push Binance’s price around in the sandbox and watch the oracle shrug.'],
        tryNote: 'Drag one exchange’s price away from the others. The average follows it; the weighted median barely moves until the push is enormous.',
        key: 'The oracle is a stake-weighted median of weighted medians. Nothing that happens on Hyperliquid’s own BTC book can move it.' },

      { id: 'mark', t: 'The mark price: the median of three estimates', try: 'mark-explorer', figDocs: 'mark-median',
        p: ['The mark is the median of three numbers. First, the oracle plus a 150-second **exponential moving average** (EMA: a running average that weights the last couple of minutes most and forgets older values gradually) of the gap between Hyperliquid’s mid and the oracle, so Hyperliquid’s own premium leaks in slowly. Second, the median of the best bid, best ask and last trade on Hyperliquid, which is the book’s own opinion right now. Third, a weighted median of the perp prices on Binance (3), OKX (2), Bybit (2), Gate (1) and MEXC (1). Take the middle value of those three and that is the mark, updated whenever the oracle updates, so about every three seconds.',
          'The median does the same job here as in the oracle. A wick (a brief spike that reverses within seconds) on Hyperliquid alone moves only the second input, and the median ignores it. A real move on Binance and Bybit moves the third input immediately and the first within a couple of minutes, so the mark follows within seconds even if nobody on Hyperliquid has traded yet. That is the whole reason a stop can fire at a price that never printed here.'],
        tryNote: 'Spike the Hyperliquid input on its own and the mark hardly moves. Move the other-exchanges input and it follows.',
        check: { q: 'Hyperliquid’s own book wicks 2% down for a few seconds while Binance and Bybit do not move. What happens to the mark?', o: ['It drops 2%, because the book is the mark', 'It barely moves: one input out of three changed, and the median ignores it', 'It drops 1%, the average of the inputs'], a: 1, why: 'Mark is the median of three estimates, and only the Hyperliquid-book estimate moved. The other two agree with each other, so the mark stays with them.' },
        key: 'Mark = median of (oracle plus smoothed premium, Hyperliquid’s book, other exchanges’ perps). One input alone cannot move it.' },

      { id: 'stop-never-traded', t: 'Why your stop can fire at a price that never traded here',
        p: ['Put the last two sections together. Your stop loss triggers on the mark. The mark is two-thirds other exchanges. So when bitcoin dumps on Binance at three in the morning, the Hyperliquid book may still be sitting quietly while the mark slides through your trigger, and your stop fires at a price nobody here has traded. Then it sends a market order into that quiet book, which is why market stops are given a 10% slippage allowance.',
          'The same mechanism protects you the other way around. If someone tries to run the Hyperliquid book down through a cluster of stops, the mark does not follow them, and the stops do not fire. The design assumes that the outside world is harder to manipulate than one book, which for BTC and ETH is true.'],
        fig: 'mark-vs-last', cap: 'The mark line reaches the trigger before the Hyperliquid tape does. The stop fires anyway.',
        key: 'Triggers and liquidations happen on the mark, which follows other exchanges within seconds. Watch the mark, not the tape.' },

      { id: 'funding-formula', t: 'Funding: the hourly nudge, with its formula', try: 'funding-explorer', figDocs: 'funding-clamp',
        p: ['Here is the mechanism from Layer 1, done properly. Every five seconds the exchange samples the **premium**: how far the perp sits above the oracle, measured not at the best bid and ask but at the **impact prices**, the average fill for a fixed notional (next section). The samples are averaged over the hour. Then the funding rate for the hour is computed on an 8-hour basis as premium + clamp(0.01% − premium, −0.05%, +0.05%), and one eighth of it is paid at the top of the hour.',
          'Read the formula as a flat zone with slopes. If the premium is anywhere between −0.04% and +0.06%, the clamp cancels it exactly and the rate is the fixed interest rate, 0.01% per 8 hours, which is 0.00125% an hour: longs pay shorts a token amount. Beyond that zone, funding tracks the premium almost one for one, minus the 0.05% allowance. The rate is capped at 4% an hour, which sounds abstract until the sandbox shows you what 4% an hour does to a position.',
          'A positive rate means longs pay shorts; negative means shorts pay longs. The payment is size × oracle price × rate, on the **oracle** notional, not the mark, and it goes peer to peer. Hyperliquid takes nothing.'],
        tryNote: 'Slide the premium. Inside the flat zone the rate does not move; outside it, it tracks the premium. Then read the dollars-per-day line.',
        key: 'Rate per 8 h = premium + clamp(0.01% − premium, ±0.05%), paid one eighth every hour on oracle notional. Positive: longs pay.' },

      { id: 'funding-cost', t: 'What funding costs in money',
        p: ['Rates in hundredths of a percent hide the cost. Translate every rate into dollars per day on your notional and the picture changes. At the neutral rate, 0.00125% an hour, a 1,000-dollar long pays 30 cents a day, about 11% a year: cheap, but not free, and it is why a long held for a month with no move loses money. At a crowded 0.01% an hour, the same position pays 2.40 dollars a day, 88% a year, which is more than most trades make. At the 4% cap it pays 40 dollars an hour, and the position is gone in a day.',
          'Two habits follow. Before any trade you plan to hold overnight, look at the funding rate in the header and the funding history tab, and write down the daily cost in dollars. And when funding is extreme, ask who is paying whom and why; a crowded side paying 1% a day is a crowd that will eventually have to leave, and Layer 6 reads that as a signal.'],
        fig: 'funding-cost-bars', cap: 'The same 1,000-dollar long at three rates. The [funding calculator](#tools) on the Tools page does this for any notional and rate.',
        check: { q: 'Funding is +0.01% an hour and you are long $5,000. Roughly what do you pay per day?', o: ['$0.50', '$12', '$120'], a: 1, why: '0.01% of $5,000 is $0.50 an hour, which is $12 a day, and you pay it because positive funding means longs pay.' },
        key: 'Turn every rate into dollars per day on your notional. Neutral is cheap, crowded is expensive, the cap is lethal.' },

      { id: 'impact', t: 'Impact price: what 20,000 USDC would actually get',
        p: ['Why measure the premium at an impact price instead of the best bid and ask? Because the best bid and ask are cheap to fake: a tiny order at the touch could tilt a whole hour of funding. Instead the exchange asks what it would cost to fill a fixed notional, 20,000 USDC for BTC and ETH and 6,000 USDC for everything else, on each side, and uses those average prices. Moving that number takes real size resting on the book.',
          'This is the same walk through the book you did in Layer 0, used as a measuring stick. For normal perps the premium is how far the impact bid sits above the oracle, if it does, or how far the impact ask sits below it, if it does; when the oracle sits between the two impact prices, the premium is zero. For HIP-3 markets (perps deployed by outside builders, Layer 8) the premium is simply the midpoint of the two impact prices against the oracle.'],
        fig: 'impact-price', cap: 'The first 20,000 USDC of asks shaded; their average is the impact ask. Funding looks here, not at the top of the book.',
        key: 'The premium is measured at the average price of a fixed notional, so a tiny order at the touch cannot fake funding.' },

      { id: 'oi-premium', t: 'Open interest and premium',
        p: ['Two numbers in the header are about crowding rather than price. **Open interest** is the total size of all positions currently open, counted once per long-short pair. It is a level, like water in a tank: it rises when new positions open and falls when they close. Volume is a flow, the size that traded in a window, and it counts opening and closing alike, so the two can tell opposite stories. Layer 6 reads open interest together with price to guess who is doing what.',
          'The **premium**, or basis, is the perp’s price minus the oracle; funding measures it precisely at the impact prices from the previous section, and the header’s mark minus oracle is a quick read of the same thing. A premium that stays positive for hours means longs are crowded and paying to stay; the funding rate is the premium turned into a price. When you see a large positive funding rate and rising open interest together, you are looking at a crowd building on one side, and crowds pay to leave.'],
        fig: 'oi-vs-volume', cap: 'Open interest is a level; volume is a flow; premium is a gauge of which side is crowded.',
        key: 'Open interest counts positions held; volume counts trades done; premium says which side is paying to stay.' },

      { id: 'hyperps', t: 'Hyperps: a different animal',
        p: ['Some markets on Hyperliquid list before the coin exists anywhere else: pre-launch perps, which Hyperliquid calls **hyperps**. There is no spot market to build an oracle from, so the oracle is replaced by an 8-hour exponential moving average of the hyperp’s own mark price, sampled every minute. Funding then pushes against the asset’s own momentum: after a sharp move, the next eight hours of funding heavily reward the other side.',
          'Caps keep it from running away: the mark cannot exceed three times the 8-hour EMA, and the oracle cannot exceed four times the month’s average mark. When the coin lists on Binance, OKX or Bybit spot, the hyperp converts to a normal perp. They are a different animal, and this curriculum leaves them until Layer 7’s journal shows two blocks of twenty trades on the ordinary markets that were both profitable and traded to plan.'],
        fig: 'hyperp-ema', cap: 'A hyperp’s jagged mark with its own smoothed average underneath acting as the oracle.',
        key: 'Hyperps have no outside oracle; their own 8-hour average plays the part. Leave them for later.' },

      { id: 'header', t: 'Reading the asset header',
        p: ['You can now read every field in the strip at the top of the trade page. Mark and oracle: if mark is above oracle, the premium is positive and longs are paying. 24-hour change and volume: thin volume means wide spreads and more slippage. Open interest: how many positions are open, to be read with price. Funding: the hourly rate now, with its sign, and a countdown to the next payment at the top of the hour.',
          'The drills ask you to log 24 hours of funding for two coins, find a moment when mark and last diverge and name which input moved, and hold a 1x long across a funding print. After that, the header is a sentence you can read at a glance.'],
        fig: 'asset-header', cap: 'The header strip, labelled. Mark minus oracle is a quick read of the premium (funding measures it at the impact prices); its sign is the sign of funding.',
        key: 'Mark above oracle means longs pay. Thin volume means slippage. The countdown says when the next payment lands.' }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
