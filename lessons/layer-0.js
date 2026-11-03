/* Layer 0 · The order book: lesson text and figures.
   Numbers: fees from the Fees page, rounding rules from the Tick and lot size page, block ordering and
   throughput from HyperCore docs, all opened 3 Nov 2026. The sample BTC book is a tidied snapshot from the
   public info API on 3 Nov 2026 (best bid 77,249, best ask 77,250). */
(function (root) {
  'use strict';
  const F = root.FigLib, FIG = root.FIG || (root.FIG = {}), LESSONS = root.LESSONS || (root.LESSONS = {});

  /* Sample books shared by figures and sandboxes. asks ascending, bids descending, [price, size]. */
  root.SAMPLE_BOOKS = {
    btc: { name: 'BTC', unit: 'BTC', pxDec: 0, tick: 1, szDec: 5,
      asks: [[77250, 2.11], [77251, 0.45], [77252, 1.88], [77253, 0.99], [77254, 1.59], [77255, 4.42], [77256, 9.09], [77257, 3.3], [77258, 6.7], [77259, 12.4]],
      bids: [[77249, 1.85], [77248, 0.22], [77247, 3.4], [77246, 0.9], [77245, 2.6], [77244, 5.1], [77243, 1.7], [77242, 8.3], [77241, 2.2], [77240, 10.5]] },
    thin: { name: 'a small coin', unit: 'coins', pxDec: 4, tick: 0.0001, szDec: 0,
      asks: [[1.2352, 3200], [1.2358, 1800], [1.2366, 5400], [1.2375, 2100], [1.2390, 7600], [1.2410, 4100], [1.2440, 9800], [1.2480, 6200], [1.2530, 12000], [1.2600, 15000]],
      bids: [[1.2340, 2900], [1.2333, 1500], [1.2325, 6100], [1.2312, 2600], [1.2295, 8000], [1.2270, 3300], [1.2240, 9000], [1.2200, 5500], [1.2150, 11000], [1.2080, 14000]] }
  };
  const B = root.SAMPLE_BOOKS.btc;

  /* ---------- figures ---------- */
  FIG['book-ladders'] = P => F.svg(P, 620, 318, 'A BTC order book: five ask levels above the spread row, five bid levels below, with the best ask and best bid nearest the gap', id => {
    const L = F.ladder(P, B.asks.slice(0, 5), B.bids.slice(0, 5), { x: 20, y: 16, w: 270, rowH: 22, unit: 'BTC' });
    let s = L.s;
    const ax = 300;
    s += F.l(P, ax, L.rows[77254] - 8, ax, L.rows[77250] + 8, { stroke: P.ask, sw: 2 });
    s += F.t(P, ax + 10, L.rows[77252] - 4, 'Asks: people selling.', { weight: 800, fill: P.ask });
    s += F.t(P, ax + 10, L.rows[77252] + 12, 'Cheapest seller sits nearest the gap.', { size: 12, fill: P.muted });
    s += F.l(P, ax, L.rows[77249] - 8, ax, L.rows[77245] + 8, { stroke: P.bid, sw: 2 });
    s += F.t(P, ax + 10, L.rows[77247] - 4, 'Bids: people buying.', { weight: 800, fill: P.bid });
    s += F.t(P, ax + 10, L.rows[77247] + 12, 'Highest buyer sits nearest the gap.', { size: 12, fill: P.muted });
    s += F.l(P, 400, L.rows.spread, 296, L.rows.spread, { stroke: P.muted, sw: 1.2, arrow: 'muted', id });
    s += F.t(P, 406, L.rows.spread - 2, 'the gap: nothing trades', { size: 12, fill: P.muted, weight: 700 });
    s += F.t(P, 406, L.rows.spread + 12, 'until someone crosses it', { size: 12, fill: P.muted });
    s += F.pill(P, 155, L.bottom + 18, 'size bar = how much is resting at that price', { size: 11, bg: P.inkSoft, fill: P.muted, weight: 600 });
    return s;
  });

  FIG['spread-line'] = P => F.svg(P, 620, 190, 'A price line zoomed to a few dollars around 77,250: bids on the left, asks on the right, a one-dollar spread between the best bid 77,249 and the best ask 77,250, and the mid at 77,249.5', id => {
    const x0 = 40, x1 = 580, lo = 77244.5, hi = 77254.5; const X = px => x0 + (px - lo) / (hi - lo) * (x1 - x0); const base = 128;
    let s = '';
    const gx0 = X(77249), gx1 = X(77250);
    s += F.r(P, gx0, 30, gx1 - gx0, base - 30, { fill: P.inkSoft });
    const stem = (px, sz, col) => { const h = Math.min(70, 14 + sz * 14); s += F.r(P, X(px) - 9, base - h, 18, h, { rx: 3, fill: col, op: .85 }); };
    B.bids.slice(0, 5).forEach(b => stem(b[0], b[1], P.bid));
    B.asks.slice(0, 5).forEach(a => stem(a[0], a[1], P.ask));
    s += F.axis(P, x0, x1, base, [77245, 77247, 77249, 77250, 77252, 77254].map(px => [X(px), F.fmtPx(px)]));
    s += F.l(P, X(77249.5), 22, X(77249.5), base + 2, { stroke: P.ink, sw: 1.5, dash: '4 4' });
    s += F.pill(P, X(77249.5), 16, 'mid 77,249.5', { size: 11, mono: true, bg: P.ink, fill: P.surf });
    s += F.t(P, X(77247), 48, 'best bid 77,249', { anchor: 'middle', size: 12, weight: 800, fill: P.bid });
    s += F.l(P, X(77247.6), 52, X(77248.85), base - 42, { stroke: P.bid, sw: 1.2, arrow: 'bid', id });
    s += F.t(P, X(77252), 48, 'best ask 77,250', { anchor: 'middle', size: 12, weight: 800, fill: P.ask });
    s += F.l(P, X(77251.4), 52, X(77250.15), base - 46, { stroke: P.ask, sw: 1.2, arrow: 'ask', id });
    s += F.t(P, x0, 170, 'the shaded gap is the spread: one tick, 1 dollar, 0.0013% of the price', { size: 11.5, fill: P.muted });
    return s;
  });

  FIG['depth-two-ways'] = P => F.svg(P, 660, 336, 'Left, a ladder with a size bar on every level; right, the same book as a cumulative depth chart, two slopes meeting at the mid, with a 10 BTC buy shown reaching 77,255', id => {
    const L = F.ladder(P, B.asks.slice(0, 7), B.bids.slice(0, 7), { x: 16, y: 14, w: 250, rowH: 18, unit: 'BTC', total: true, pxW: 72, szW: 60 });
    let s = L.s;
    s += F.t(P, 16, L.bottom + 20, 'Ladder: a bar per level, and a running total', { size: 11.5, fill: P.muted, weight: 700 });
    const cx0 = 320, cx1 = 640, cy0 = 40, cy1 = 230; const lo = 77240, hi = 77259;
    const X = px => cx0 + (px - lo) / (hi - lo) * (cx1 - cx0); const maxCum = 42; const Y = v => cy1 - v / maxCum * (cy1 - cy0);
    const step = (levels, dir) => { let cum = 0; const pts = [[X(dir > 0 ? levels[0][0] - 0.5 : levels[0][0] + 0.5), Y(0)]]; levels.forEach(lv => { cum += lv[1]; pts.push([X(lv[0] + (dir > 0 ? -0.5 : 0.5)), Y(cum)]); pts.push([X(lv[0] + (dir > 0 ? 0.5 : -0.5)), Y(cum)]); }); return pts; };
    const ap = step(B.asks, 1), bp = step(B.bids, -1);
    s += F.poly(P, ap.concat([[ap[ap.length - 1][0], Y(0)]]), { fill: P.askSoft, closed: true });
    s += F.poly(P, bp.concat([[bp[bp.length - 1][0], Y(0)]]), { fill: P.bidSoft, closed: true });
    s += F.poly(P, ap, { stroke: P.ask, sw: 2 }); s += F.poly(P, bp, { stroke: P.bid, sw: 2 });
    s += F.axis(P, cx0, cx1, cy1, [77241, 77245, 77249.5, 77254, 77258].map(px => [X(px), px === 77249.5 ? 'mid' : F.fmtPx(px)]));
    s += F.l(P, X(77249.5), cy0 - 6, X(77249.5), cy1, { stroke: P.ink, sw: 1, dash: '3 4' });
    s += F.l(P, X(77249.5), Y(10), X(77255.5), Y(10), { stroke: P.you, sw: 1.5, dash: '5 4' });
    s += F.l(P, X(77255.5), Y(10), X(77255.5), cy1, { stroke: P.you, sw: 1.5, dash: '5 4' });
    s += F.pill(P, X(77252.5), Y(10) - 12, 'a 10 BTC buy', { size: 11, bg: P.you, fill: P.surf });
    s += F.t(P, X(77255.5) - 6, cy1 - 8, 'runs out at 77,255', { size: 11, fill: P.you, weight: 700, anchor: 'end' });
    s += F.t(P, cx0, 26, 'bids', { size: 11.5, weight: 800, fill: P.bid }); s += F.t(P, cx1, 26, 'asks', { size: 11.5, weight: 800, fill: P.ask, anchor: 'end' });
    s += F.t(P, cx0 - 6, cy0 + 4, '42', { size: 10, mono: true, fill: P.muted, anchor: 'end' }); s += F.t(P, cx0 - 6, cy1 + 4, '0', { size: 10, mono: true, fill: P.muted, anchor: 'end' });
    s += F.wrap(P, 320, cy1 + 46, 'Depth chart: the totals drawn as slopes. Steep walls mean a deep book.', 320, { size: 11.5, fill: P.muted, weight: 700, lh: 16 }).s;
    return s;
  });

  FIG['walk-static'] = P => F.svg(P, 620, 250, 'A 5 BTC market buy consuming 77,250, 77,251 and 77,252 entirely and part of 77,253, with an average fill of 77,251.18 against a best ask of 77,250', id => {
    const L = F.ladder(P, B.asks.slice(0, 6), [], { x: 16, y: 14, w: 270, rowH: 24, unit: 'BTC', spread: false, consumed: { 77250: 1, 77251: 1, 77252: 1, 77253: 0.57 } });
    let s = L.s;
    const x = 310;
    s += F.t(P, x, 36, 'Market buy, 5 BTC', { weight: 800, size: 14 });
    const rows = [['77,250', '2.11 BTC', 'all of it'], ['77,251', '0.45 BTC', 'all of it'], ['77,252', '1.88 BTC', 'all of it'], ['77,253', '0.56 BTC', 'of 0.99, the rest stays']];
    rows.forEach((rw, i) => { const y = 62 + i * 22; s += F.t(P, x, y, rw[0], { mono: true, size: 12, fill: P.ask, weight: 600 }); s += F.t(P, x + 70, y, rw[1], { mono: true, size: 12 }); s += F.t(P, x + 150, y, rw[2], { size: 11.5, fill: P.muted }); });
    s += F.l(P, x, 158, 600, 158, { stroke: P.line });
    s += F.t(P, x, 180, 'average price 77,251.18', { mono: true, size: 13, weight: 700 });
    s += F.t(P, x, 200, 'best ask you saw 77,250.00', { mono: true, size: 12, fill: P.muted });
    s += F.t(P, x, 222, 'slippage 1.18 per BTC, 5.90 in all, 0.0015%', { size: 12, fill: P.you, weight: 700 });
    s += F.t(P, x, 240, 'taker fee 0.045% of 386,256 = 173.82', { size: 12, fill: P.muted });
    return s;
  });

  FIG['limit-static'] = P => F.svg(P, 640, 300, 'Two placements of the same limit buy: at 77,247 it rests among the bids as a maker; at 77,252 it crosses the spread and fills against three ask levels as a taker', id => {
    const A = F.ladder(P, B.asks.slice(0, 4), [[77249, 1.85], [77248, 0.22], [77247, 3.4], [77246, 0.9]], { x: 16, y: 40, w: 230, rowH: 20, unit: 'BTC', you: { price: 77247, label: 'you, 1 BTC' } });
    const Bk = F.ladder(P, B.asks.slice(0, 4), [[77249, 1.85], [77248, 0.22], [77247, 3.4], [77246, 0.9]], { x: 340, y: 40, w: 230, rowH: 20, unit: 'BTC', consumed: { 77250: 1, 77251: 1, 77252: 1 } });
    let s = A.s + Bk.s;
    s += F.t(P, 16, 24, 'Limit buy 1 BTC at 77,247', { weight: 800 });
    s += F.t(P, 340, 24, 'Limit buy 5 BTC at 77,252', { weight: 800 });
    s += F.pill(P, 16, A.bottom + 24, 'rests on the bid side  ·  maker 0.015%  ·  may never fill', { anchor: 'start', size: 11, bg: P.inkSoft, fill: P.ink, weight: 600 });
    s += F.pill(P, 340, Bk.bottom + 24, 'crosses the gap  ·  taker 0.045%  ·  fills 4.44 now', { anchor: 'start', size: 11, bg: P.you, fill: P.surf, weight: 600 });
    s += F.t(P, 340, Bk.bottom + 48, 'the unfilled 0.56 BTC then rests at 77,252 as a new best bid', { size: 11.5, fill: P.muted });
    s += F.l(P, 340 - 10, Bk.rows[77252] - 10, 340 - 10, Bk.rows[77250] + 10, { stroke: P.you, sw: 2 });
    return s;
  });

  FIG['maker-taker'] = P => F.svg(P, 660, 270, 'On a 1,000 dollar fill the taker pays 45 cents and the maker 15 cents; a table maps each order type to the role it plays', id => {
    let s = '';
    s += F.t(P, 20, 28, 'Fee on a $1,000 fill, base tier', { weight: 800, size: 14 });
    s += F.coins(P, 75, 150, 9, P.ink); s += F.t(P, 75, 172, 'taker', { anchor: 'middle', weight: 800 }); s += F.t(P, 75, 190, '$0.45 (0.045%)', { anchor: 'middle', mono: true, size: 11.5, fill: P.muted });
    s += F.coins(P, 215, 150, 3, P.muted); s += F.t(P, 215, 172, 'maker', { anchor: 'middle', weight: 800 }); s += F.t(P, 215, 190, '$0.15 (0.015%)', { anchor: 'middle', mono: true, size: 11.5, fill: P.muted });
    s += F.t(P, 20, 226, 'a round trip is two fills: taker in and out costs $0.90,', { size: 11.5, fill: P.muted });
    s += F.t(P, 20, 242, 'maker in and out $0.30. Over 100 round trips: $90 against $30.', { size: 11.5, fill: P.muted });
    const x = 330; s += F.t(P, x, 28, 'Which role does each order play?', { weight: 800, size: 14 });
    const rows = [['Market', 'taker, always'], ['IOC', 'taker'], ['Limit that rests', 'maker'], ['Limit that crosses', 'taker'], ['Post Only (ALO)', 'maker, or rejected'], ['Stop, TP or SL when it fires', 'taker: it sends a market order']];
    rows.forEach((rw, i) => { const y = 58 + i * 32; s += F.t(P, x, y - 2, rw[0], { size: 12.5, weight: 700 }); const tk = rw[1].startsWith('taker'); s += F.pill(P, 650, y + (i === 5 ? 14 : 0), rw[1], { anchor: 'end', size: 11, bg: tk ? P.ink : P.inkSoft, fill: tk ? P.surf : P.ink, weight: 700 }); if (i < 5) s += F.l(P, x, y + 16, 650, y + 16, { stroke: P.grid, sw: 1 }); });
    return s;
  });

  FIG['queue-static'] = P => F.svg(P, 640, 230, 'One price level drawn as a queue of resting orders; market sells eat from the front; cancelling and re-placing sends your order to the back behind newer orders', id => {
    let s = '';
    const row = (y, orders, title) => {
      s += F.t(P, 20, y - 14, title, { weight: 800, size: 13 });
      let x = 20; orders.forEach(o => { const w = 40 + o.sz * 50; const you = o.you; s += F.r(P, x, y, w, 34, { rx: 7, fill: you ? P.you : P.bidSoft, stroke: you ? P.you : P.bid, sw: 1.2 }); s += F.t(P, x + w / 2, y + 21, (you ? 'you ' : '') + o.sz, { anchor: 'middle', mono: true, size: 11.5, fill: you ? P.surf : P.ink, weight: 700 }); x += w + 6; });
      return x;
    };
    s += F.t(P, 20, 22, 'Bids resting at 77,249, oldest on the left', { size: 12, fill: P.muted });
    row(58, [{ sz: 0.4 }, { sz: 1.2 }, { sz: 0.25 }, { sz: 0.8 }, { sz: 0.5, you: true }], 'You join the back of the line');
    s += F.l(P, 8, 75, 18, 75, { stroke: P.ask, sw: 2, arrow: 'ask', id });
    s += F.t(P, 20, 112, 'market sells arrive here and eat from the front: 1.6 BTC of sells fills the first two orders, you still wait', { size: 11.5, fill: P.ask });
    const end = row(150, [{ sz: 0.25 }, { sz: 0.8 }, { sz: 2.0 }, { sz: 0.6 }, { sz: 0.5, you: true }], 'After you cancel and re-place: back behind two newer orders');
    s += F.t(P, 20, 210, 'the order that was third in line is now fifth, at the same price, for the same size', { size: 11.5, fill: P.muted });
    return s;
  });

  FIG['tick-ruler'] = P => F.svg(P, 640, 250, 'Allowed price grids for BTC, HYPE and DOGE with one rejected price each, and the ten-dollar minimum order', id => {
    let s = '';
    const rowY = [50, 110, 170];
    const rows = [
      { name: 'BTC', note: 'size decimals 5, so prices are whole dollars (6 − 5 = 1 decimal, but 77,250.5 has six significant figures)', ok: ['77,249', '77,250', '77,251'], bad: '77,250.5' },
      { name: 'HYPE', note: 'size decimals 2, up to 4 decimals allowed, but only five significant figures', ok: ['84.570', '84.571', '84.572'], bad: '84.5712' },
      { name: 'DOGE', note: 'size decimals 0, up to 6 decimals, five significant figures', ok: ['0.12344', '0.12345', '0.12346'], bad: '0.123456' }
    ];
    rows.forEach((rw, i) => {
      const y = rowY[i];
      s += F.t(P, 20, y + 4, rw.name, { weight: 800, size: 14 });
      s += F.l(P, 80, y, 420, y, { stroke: P.line, sw: 2 });
      rw.ok.forEach((v, k) => { const x = 110 + k * 110; s += F.l(P, x, y - 8, x, y + 8, { stroke: P.ink, sw: 2 }); s += F.pill(P, x, y + 22, v, { size: 11, mono: true, bg: P.bidSoft, fill: P.ink }); });
      s += F.pill(P, 500, y, rw.bad + '  rejected', { size: 11, mono: true, bg: P.askSoft, fill: P.ask, weight: 700 });
      s += F.t(P, 80, y - 16, rw.note, { size: 10.5, fill: P.muted });
    });
    s += F.r(P, 20, 212, 600, 28, { rx: 8, fill: P.inkSoft });
    s += F.t(P, 320, 230, 'and every order must be worth at least $10: on BTC at 77,250 that is 0.00013 BTC', { anchor: 'middle', size: 12, weight: 700 });
    return s;
  });

  FIG['candle-static'] = P => F.svg(P, 640, 260, 'Ten trades plotted in time on the left become one candle on the right: open 77,250, high 77,256, low 77,247, close 77,254, with a volume bar of the total size', id => {
    const trades = [[77250, 0.4], [77251, 1.2], [77249, 0.3], [77247, 2.1], [77248, 0.6], [77252, 0.9], [77255, 1.5], [77256, 0.7], [77253, 0.5], [77254, 1.1]];
    const lo = 77245, hi = 77258; const Y = px => 200 - (px - lo) / (hi - lo) * 160; let s = '';
    s += F.t(P, 20, 24, 'ten trades in one minute', { weight: 800 });
    trades.forEach((tr, i) => { const x = 40 + i * 36; s += F.c(P, x, Y(tr[0]), 4 + tr[1] * 3, { fill: i && tr[0] >= trades[i - 1][0] ? P.bid : P.ask, op: .85 }); s += F.t(P, x, 222, F.fmtPx(tr[0]).slice(-2), { anchor: 'middle', size: 10, mono: true, fill: P.muted }); });
    s += F.poly(P, trades.map((tr, i) => [40 + i * 36, Y(tr[0])]), { stroke: P.muted, sw: 1, dash: '2 3' });
    s += F.t(P, 20, 246, 'dot size = trade size · last two digits of the price below', { size: 11, fill: P.muted });
    const cx = 470; s += F.t(P, cx, 24, 'the 1-minute candle', { weight: 800, anchor: 'middle' });
    s += F.candle(P, cx, 77250, 77256, 77247, 77254, 34, Y);
    const lab = (px, txt, side) => { s += F.l(P, cx + (side > 0 ? 22 : -22), Y(px), cx + (side > 0 ? 36 : -36), Y(px), { stroke: P.muted, sw: 1 }); s += F.t(P, cx + (side > 0 ? 40 : -40), Y(px) + 4, txt, { size: 11.5, mono: true, anchor: side > 0 ? 'start' : 'end' }); };
    lab(77256, 'high 77,256', 1); lab(77254, 'close 77,254', 1); lab(77250, 'open 77,250', -1); lab(77247, 'low 77,247', -1);
    s += F.r(P, cx - 17, 212, 34, 22, { rx: 3, fill: P.inkSoft }); s += F.t(P, cx, 227, 'vol 9.3', { anchor: 'middle', size: 10.5, mono: true, fill: P.muted });
    return s;
  });

  FIG['trade-screen'] = P => F.svg(P, 680, 430, 'A schematic of the Hyperliquid trade page: asset header strip on top, chart in the centre, order book and trades on the right, the order form at the far right, and the positions and history tabs along the bottom', id => {
    let s = '';
    const panel = (x, y, w, h, n, title) => { s += F.r(P, x, y, w, h, { rx: 8, fill: P.surf, stroke: P.line, sw: 1.2 }); s += F.c(P, x + 14, y + 14, 9, { fill: P.you }); s += F.t(P, x + 14, y + 18, String(n), { anchor: 'middle', size: 11, weight: 800, fill: P.surf }); s += F.t(P, x + 30, y + 18, title, { size: 12.5, weight: 800 }); };
    s += F.r(P, 10, 10, 660, 410, { rx: 12, fill: P.surf2 });
    panel(20, 20, 640, 56, 1, 'BTC-USD');
    s += F.t(P, 110, 38, 'mark 77,249.6     oracle 77,241.0     24h −1.2%     24h volume $2.1B', { size: 11, mono: true, fill: P.muted });
    s += F.t(P, 50, 62, 'open interest $4.3B     funding 0.0013%  next in 23:41     max leverage 40x', { size: 11, mono: true, fill: P.muted });
    panel(20, 86, 380, 196, 2, 'Chart');
    s += F.t(P, 86, 104, 'candles, volume, your orders drawn as lines', { size: 10.5, fill: P.muted });
    const Y = v => 268 - v * 1.4; const pts = [10, 30, 22, 45, 60, 52, 70, 95, 80, 88, 110, 100, 118]; s += F.poly(P, pts.map((v, i) => [40 + i * 27, Y(v)]), { stroke: P.muted, sw: 1.5 });
    panel(410, 86, 130, 196, 3, 'Book · Trades');
    for (let i = 0; i < 5; i++) { s += F.r(P, 420, 112 + i * 13, 110 * (0.3 + 0.14 * i), 10, { rx: 2, fill: P.askSoft }); } s += F.r(P, 420, 179, 110, 11, { rx: 2, fill: P.inkSoft }); s += F.t(P, 475, 188, 'spread 1 · 0.001%', { anchor: 'middle', size: 8.5, mono: true, fill: P.muted }); for (let i = 0; i < 5; i++) { s += F.r(P, 420, 194 + i * 13, 110 * (0.9 - 0.14 * i), 10, { rx: 2, fill: P.bidSoft }); }
    s += F.t(P, 420, 272, 'grouping ▾  size: BTC ▾', { size: 9, mono: true, fill: P.muted });
    panel(550, 86, 110, 196, 4, 'Order form');
    [['Market · Limit · Pro', 122], ['Buy/Long  Sell/Short', 140], ['size  ___ BTC', 162], ['leverage ──●── 5x', 182], ['☐ reduce only', 202], ['☐ TP / SL', 220], ['[ Place order ]', 252]].forEach(rw => s += F.t(P, 560, rw[1], rw[0], { size: 9.5, mono: true, fill: rw[0].includes('Place') ? P.ink : P.muted, weight: rw[0].includes('Place') ? 800 : 500 }));
    panel(20, 292, 640, 118, 5, 'Balances · Positions · Open orders · TWAP · Trade history · Funding history · Order history');
    s += F.t(P, 50, 330, 'BTC   long 0.01   entry 77,120   mark 77,249.6   liq. 61,210   PnL +1.30   funding −0.02   margin 154.2 (isolated 5x)', { size: 10, mono: true, fill: P.muted });
    s += F.t(P, 50, 352, 'open order: limit buy 0.01 @ 77,000   ·   fill: 0.01 BTC @ 77,120, fee 0.35 (taker)', { size: 10, mono: true, fill: P.muted });
    s += F.t(P, 50, 384, 'the numbers are illustrative; the layout is a map of the real page, not a screenshot', { size: 10.5, fill: P.muted, italic: true });
    return s;
  });

  FIG['onchain-pipeline'] = P => F.svg(P, 660, 240, 'An order travels from your wallet into a block, where the chain sorts other actions first, then cancels, then new orders, into the HyperCore book, where it matches after a second margin check, and the committed result returns to you while positions, fills and liquidations become public state', id => {
    let s = '';
    s += F.box(P, 16, 70, 96, 70, 'you', ['sign an action', 'no gas'], { size: 12 });
    s += F.l(P, 112, 105, 150, 105, { stroke: P.ink, sw: 1.5, arrow: 'ink', id });
    s += F.r(P, 152, 30, 200, 150, { rx: 12, fill: P.surf2, stroke: P.line, sw: 1.2 });
    s += F.t(P, 252, 50, 'one block, sorted', { anchor: 'middle', weight: 800, size: 12.5 });
    ['1  actions that are not new orders', '2  cancels', '3  new orders (GTC, IOC)'].forEach((x, i) => { s += F.r(P, 164, 62 + i * 36, 176, 28, { rx: 7, fill: i === 2 ? P.you : P.surf, stroke: i === 2 ? P.you : P.line }); s += F.t(P, 174, 80 + i * 36, x, { size: 11.5, weight: 700, fill: i === 2 ? P.surf : P.ink }); });
    s += F.l(P, 352, 105, 390, 105, { stroke: P.ink, sw: 1.5, arrow: 'ink', id });
    s += F.box(P, 392, 48, 150, 114, 'HyperCore book', ['price-time priority', 'margin checked again', 'for the resting side', 'at the match'], { size: 12 });
    s += F.l(P, 542, 90, 580, 90, { stroke: P.ink, sw: 1.5, arrow: 'ink', id });
    s += F.box(P, 582, 60, 66, 60, 'fill', ['committed'], { size: 12 });
    s += F.p(P, 'M615 120 C615 200 60 200 64 142', { stroke: P.muted, sw: 1.3, dash: '5 4', arrow: 'muted', id });
    s += F.t(P, 330, 205, 'the response you get is the result, not a promise (median 0.2 s for a well-placed client)', { anchor: 'middle', size: 11.5, fill: P.muted });
    s += F.t(P, 330, 228, 'and the whole state is public: every position, fill and liquidation, readable by anyone', { anchor: 'middle', size: 11.5, fill: P.muted, weight: 700 });
    return s;
  });

  /* ---------- lesson ---------- */
  LESSONS['layer-0'] = {
    intro: 'This is the ground floor. Perps, funding, liquidation, everything later sits on top of the order book, so it is worth going slowly here. Nothing in the reading needs money or a wallet: the pictures and the sandboxes do the work. The drills at the end do need a testnet account, which takes a fresh wallet, a one-time 10 USDC deposit on mainnet and the faucet; the steps are in [Layer 2’s setup box](#layer-2/setup), so do them before you reach the drills. Read a section, play with its sandbox, answer the check, move on.',
    legend: 'In every picture, green is the bid side (buyers), red is the ask side (sellers), and blue is you: your order or your position.',
    sections: [
      { id: 'what-a-book-is', t: 'A market is a list of people who have not agreed yet',
        p: ['Picture a street market with one stall trading bitcoin. Buyers call out the most they will pay. Sellers call out the least they will take. Until a buyer’s number meets a seller’s number nothing happens; the numbers just hang in the air. An order book is that list of hanging numbers, written down and sorted by price.',
          'Each line in the book is a **resting order**: someone’s promise to buy or sell a stated size at a stated price, waiting. Buy orders are **bids**. Sell orders are **asks** (some people say offers). The book keeps bids sorted from highest to lowest and asks from lowest to highest, so the two sides face each other across a gap.',
          'Notice what the book is not. It is not a record of trades. Nothing on it has happened yet. It is a list of intentions, and intentions get withdrawn far more often than they get filled.'],
        fig: 'book-ladders', cap: 'A BTC book. Sellers rest above the gap, buyers below. The two numbers nearest the gap are the only ones that can trade next.',
        key: 'The book is every resting promise to buy or sell, sorted by price. Nothing on it has happened yet.' },

      { id: 'spread', t: 'Best bid, best ask, spread, mid',
        p: ['The highest bid and the lowest ask are the **best bid** and **best ask**: the two prices closest to agreeing. The gap between them is the **spread**. Halfway across the gap is the **mid**, the single number people mean when they say “the price”.',
          'The spread is your first cost, and it is charged before any fee. If you buy right now you pay the ask; if you then sell right now you receive the bid. Do both and you are poorer by exactly the spread, even though the market did not move.',
          'On BTC the spread is usually one tick: one dollar on a 77,000-dollar coin, about 0.0013%. On a small coin it can be 0.1% or more, nearly a hundred times wider, and that difference decides what kind of trading is even possible there. A strategy that scalps a few ticks on BTC is impossible on a coin where the spread alone is a few ticks’ worth of profit.'],
        fig: 'spread-line', cap: 'One tick wide: the best bid at 77,249, the best ask at 77,250, the mid at 77,249.5. Buying at the ask and selling at the bid loses the shaded gap.',
        check: { q: 'You buy at market and sell at market one second later. The price did not move. What did you lose?', o: ['The spread, plus a fee on each of the two fills', 'Nothing, because the price did not move', 'Only one fee, because it was one round trip'], a: 0, why: 'You paid the ask on the way in and received the bid on the way out, so you lost the gap between them. Each fill also pays a fee; Section 7 explains the two fee rates.' },
        key: 'The spread is paid before any fee. A one-tick spread on BTC and a 0.1% spread on a small coin are different games.' },

      { id: 'live', t: 'Watch a book breathe', try: 'book-live',
        p: ['Below is a pretend BTC book that behaves like the real one: orders arrive, orders leave, and every few seconds a trade takes a bite out of the top. Watch the best bid and best ask for a while. Then watch the sizes two or three rows back.',
          'Three things to notice. The top of the book changes constantly, often several times a second on the real thing. Most of that change is orders being added and cancelled, not trades: on a busy book most orders are cancelled unfilled. And the size at a level is not a wall; it is a crowd that can leave the moment you lean on it.'],
        tryNote: 'Press pause when something interesting happens. The spread row in the middle shows the gap in dollars and as a percentage, the way the Hyperliquid app shows it.',
        key: 'The book is a crowd of opinions that can change its mind. Treat the size you see as a hint, not a guarantee.' },

      { id: 'depth', t: 'Depth: how much is waiting at each price',
        p: ['The size column tells you how much is resting at each price. Add the sizes up as you move away from the mid and you get **depth**: how much could trade before the price has to move to the next level, and the next.',
          'Trading apps draw depth two ways. The ladder draws a bar behind each row, proportional to the size there. The depth chart adds the bars up into two slopes that meet at the mid, like a valley. A deep book has steep walls close to the mid; a thin book has a wide, flat floor where a small order can travel a long way.',
          'Depth is why the same order is harmless on BTC and dangerous on a small coin. Ten BTC is a lot of money, but a BTC book will often swallow it within a few dollars of the mid. Ten thousand dollars of a thin coin can move its price by a percent.'],
        fig: 'depth-two-ways', cap: 'The same book, twice. On the ladder each level has a bar and a running total. On the depth chart the totals become slopes; the dashed line is a 10 BTC buy, which runs out of asks at 77,255.',
        key: 'Depth is the book’s capacity to absorb an order without moving. It is the number behind the word liquidity.' },

      { id: 'walk', t: 'A market order walks the book', try: 'walk-the-book', figDocs: 'walk-static',
        p: ['A **market order** says “fill me now, whatever it costs”. It starts at the best price and takes everything resting there. If that is not enough it moves to the next price and takes that too, and keeps going until it is done. Your fill is the size-weighted average of every level it touched.',
          'The difference between the price you saw and the average price you got is **slippage**. It is not a fee and nobody charges it; it is just the shape of the book, which is why the same order slips more at 3 a.m. on a Sunday than at the US open.',
          'Drag the size slider below and watch the order eat its way up the asks. Then switch to the thin book and do it again.'],
        tryNote: 'The BTC book here is roughly what the real one looked like in early November 2026; the thin book is a typical small coin. Both are frozen so you can study them.',
        key: 'A market order does not have a price. It has a path through the book, and the path is the price.' },

      { id: 'limit', t: 'Limit orders: resting or crossing', try: 'limit-placer', figDocs: 'limit-static',
        p: ['A **limit order** names a price and says “this price or better”. What happens next depends only on where that price sits relative to the other side of the book.',
          'A limit buy below the best ask cannot trade yet, so it joins the bids and waits. It is now part of the book; it fills only if a seller comes down to it. A limit buy at or above the best ask can trade right away, so it does: it takes the asks up to its limit price, exactly like a market order with a ceiling. Anything left over rests at the limit.',
          'So a limit order is not a gentler market order. It is the same machine with a stop sign. Place the sign on your own side of the gap and you wait; place it across the gap and you trade immediately.'],
        tryNote: 'Slide your buy price up and down the ladder. The moment it reaches the best ask the order flips from resting to crossing, and the fee flips with it.',
        check: { q: 'You place a limit buy at 77,260 while the best ask is 77,250. What happens?', o: ['It rests at 77,260 and waits for a seller', 'It fills right away against the asks from 77,250 up to 77,260', 'It is rejected for being above the market'], a: 1, why: 'A buy limit at or above the best ask can trade, so it does, walking up the asks until it is filled or reaches 77,260. Only a leftover would rest.' },
        key: 'Whether a limit order waits or trades depends only on which side of the gap you put it.' },

      { id: 'maker-taker', t: 'Maker and taker: who pays what, and why',
        p: ['Every fill has two sides: an order that was already resting, and an order that arrived and hit it. The resting side **made** the market available; the arriving side **took** it. Exchanges charge the two differently, and Hyperliquid charges takers three times as much: at the base tier, **0.045% for a taker** and **0.015% for a maker**, on the dollar value of the fill.',
          'On a 1,000-dollar fill that is 45 cents against 15 cents. Small, but it is charged on every fill, and a round trip is two fills. Over a hundred round trips the taker has paid 90 dollars and the maker 30, before any slippage.',
          'Why reward the maker? A resting order is a gift to everyone else: a price anyone can trade at whenever they like, while its owner carries the risk of being picked off when news breaks. Venues pay for that service. The very largest makers are even paid to trade, a rebate instead of a fee.',
          'Which orders are which is mechanical. A market order is always a taker. An IOC order (immediate or cancel: fill what you can now, cancel the rest) is a taker. A limit order is a maker if it rests and a taker if it crosses. A **Post Only** order (Hyperliquid calls it ALO) is the one that refuses to be a taker: if it would cross, it is rejected instead of filled.'],
        fig: 'maker-taker', cap: 'The two fee rates as coins, and the role each order type plays. Fee tiers and staking discounts lower both numbers; Layer 2 has the full schedule.',
        check: { q: 'You place a limit buy below the best ask. Ten minutes later a seller comes down to it and it fills. Which fee did you pay?', o: ['Both, because the order waited and then traded', 'The taker fee, 0.045%', 'The maker fee, 0.015%'], a: 2, why: 'Your order was resting when the trade happened, so you were the maker. The seller who came down to it was the taker.' },
        key: 'Taker pays 0.045%, maker 0.015%. The difference is the price of impatience.' },

      { id: 'queue', t: 'Price-time priority: the queue at each price', try: 'queue-sim', figDocs: 'queue-static',
        p: ['Several orders can rest at the same price. When a trade arrives, who fills first? On Hyperliquid, as on every serious exchange, the answer is **price first, then time**: the best price fills before any worse price, and at one price the order that arrived first fills first.',
          'That turns each price level into a queue. When you place a limit order you join the back of the line at that price. Trades eat from the front. If a trade is smaller than the size ahead of you, you do not fill, however long you have waited.',
          'There is one habit this punishes. If you cancel your order and place it again, even at the same price, you go to the back of the queue. Nudging an order a tick away and then back costs you your place twice.'],
        tryNote: 'Join the queue at the best bid, then let market sells arrive. Try “cancel and re-place” once and see where you land.',
        key: 'Your resting order is a place in a line. Changing it means leaving the line.' },

      { id: 'tick-lot', t: 'Tick, lot and the ten-dollar floor', try: 'tick-check', figDocs: 'tick-ruler',
        p: ['The book is a grid, not a continuum. Prices must sit on the **tick size**, the smallest allowed price step, and sizes on the **lot size**, the smallest allowed size step. Each asset has its own.',
          'Hyperliquid’s rules for perps: a price may have up to **five significant figures**, and no more decimals than 6 minus the asset’s size decimals; whole-number prices are always allowed. For BTC the five-figure cap is what bites: a price like 77,250 already uses all five figures, so any decimal would be a sixth, and BTC prices are effectively whole dollars. For HYPE the decimals rule leaves room for four decimals, but the five-figure cap still applies: 84.571 is fine, 84.5712 is not. Sizes are rounded to the asset’s size decimals (five for BTC, two for HYPE). And every order must be worth at least **10 dollars**.',
          'Get any of these wrong and the order is rejected, not rounded. It is the most common reason a first order on Hyperliquid “does nothing”.'],
        tryNote: 'Pick an asset, type a price and a size, and see whether the exchange would accept them and why. The size decimals come from the exchange’s own asset list.',
        key: 'Five significant figures, the asset’s size decimals, and ten dollars. Wrong rounding is rejected, not fixed.' },

      { id: 'candles', t: 'From the book to the chart', try: 'candle-builder', figDocs: 'candle-static',
        p: ['Every fill prints a trade: a price, a size, and which side was the taker. The **Trades** tab next to the book is that stream. Candles are a summary of it: over one window of time a candle records the first trade (open), the highest and lowest, and the last (close), and the volume bar underneath adds up the size that traded.',
          'Notice the direction of time. The chart is made of trades that already happened. The book is the set of orders that might happen next. Charts summarise the past; the book is the only place the future is visible, and only a few seconds of it.'],
        tryNote: 'Step through ten trades and watch the candle grow. Try to predict the next shape before you press the button.',
        key: 'A candle is the book’s history, compressed. The book is the chart’s next tick, uncompressed.' },

      { id: 'screen', t: 'The Hyperliquid trade screen, labelled',
        p: ['Here is where everything above lives on app.hyperliquid.xyz. The layout moves around as the team ships, so this is a map rather than a photograph.',
          'Top strip: the asset, with mark price, oracle price, 24-hour change and volume, open interest, and the current funding rate with a countdown to the next payment. You will be able to read every one of those by the end of Layer 3. Centre: the chart. Right: the order book and the trades tape, with a grouping control that merges ticks so a tall book fits on one screen, and a toggle between size in coins and size in dollars. Far right: the order form. Bottom: your balances, positions, open orders, TWAPs, trade history, funding history and order history.'],
        fig: 'trade-screen', cap: '1: the header, with the three prices, volume, open interest, funding and its countdown. 2: the chart, which is the past. 3: the book and the tape, the next few seconds, with the grouping control that merges ticks. 4: the order form; every order type in Layer 2 lives behind Market, Limit and Pro. 5: the bottom tabs, your positions with their liquidation price, your orders and your history.',
        key: 'Mark, oracle, funding, open interest, book, tape, form, positions. Eight words you will use every day.' },

      { id: 'onchain', t: 'Why this book is different: it lives on a blockchain',
        p: ['On most exchanges the order book is a private database. On Hyperliquid it is the state of a blockchain, and every order, cancel and fill is a transaction that the **validators**, the computers that run the chain and vote on its state, agree on. The exchange half of that chain is called HyperCore; Layer 2 draws the map. Three consequences matter to you.',
          'First, when the app tells you an order is filled it is already final: the response is the committed result, not a promise, and trading is gas-free. The chain handles about 200,000 orders a second with a median round trip of 0.2 seconds for a well-placed client. Second, within each block the chain sorts actions in a fixed order: things that are not new orders first, then cancels, then new orders, so a cancel sent in the same block as someone else’s market order wins. Third, everything is public. Every position, every liquidation and every trader’s history is readable by anyone, which becomes a research tool in Layer 6.',
          'One more detail that saves confusion later: margin, the deposit that backs a position (Layer 4 is about it), is checked twice, when you place an order and again for the resting side at the moment it matches. A resting order that no longer has the margin behind it does not trade.'],
        fig: 'onchain-pipeline', cap: 'The path of an order. The block sorts cancels ahead of new orders; the book matches by price and time; the result comes back committed; the state is public.',
        key: 'Committed, gas-free, cancels sorted first, and public. The book is a shared ledger, not a private database.' },

      { id: 'before-you-click', t: 'Before you click: three questions',
        p: ['You now have everything the pass check for this layer asks for. Before any order, on any book, you should be able to answer three questions:'],
        list: ['**Maker or taker?** If the order will cross the spread it is a taker and pays 0.045%. If it rests it pays 0.015%, but it might never fill.',
          '**What will it really cost?** The fee, plus the spread if you cross, plus slippage if the order is bigger than the top level.',
          '**How far will it move the price?** Read the depth. If your size is a large share of the first few levels, you are the move.'],
        p2: ['Then do the drills below on testnet. Reading this layer takes an hour; the drills are where it becomes a reflex.'],
        key: 'Maker or taker, what it costs, how far it moves the price. Answer all three before every order, forever.' }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
