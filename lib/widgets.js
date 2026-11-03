/* Interactive sandboxes used inside the lessons. Each widget is {title, html(id), init(root, ctx)}.
   ctx.timer(fn, ms) registers an interval that the page clears when you navigate away.
   Browser only: tools/gen-docs.js never loads this file; the docs use the static stand-in figures instead. */
(function (root) {
  'use strict';
  const WIDGETS = root.WIDGETS || (root.WIDGETS = {});
  const F = root.FigLib; const P = () => F.pal('css');
  const $ = (r, sel) => r.querySelector(sel);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (x, d) => (x < 0 ? '−' : '') + '$' + Math.abs(x).toLocaleString('en-US', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d });
  const fpx = (x, d) => x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fsz = x => x.toLocaleString('en-US', { maximumFractionDigits: 5 });
  const pct = (x, d) => x.toFixed(d == null ? 3 : d) + '%';
  const readout = rows => `<div class="readout">${rows.map(r => `<div class="${r[2] || ''}"><b>${r[0]}</b><span>${r[1]}</span></div>`).join('')}</div>`;
  const clone = b => ({ asks: b.asks.map(x => x.slice()), bids: b.bids.map(x => x.slice()) });

  /* Walk a market buy of `size` through `asks` (ascending). Returns fills, average, consumed fractions. */
  function walkBuy(asks, size) {
    let left = size, cost = 0, filled = 0; const consumed = {}; const fills = [];
    for (const [px, sz] of asks) { if (left <= 1e-9) break; const take = Math.min(sz, left); consumed[px] = take / sz; fills.push([px, take]); cost += take * px; filled += take; left -= take; }
    return { fills, avg: filled ? cost / filled : NaN, filled, left, cost, consumed };
  }

  /* ---------------- Layer 0 ---------------- */
  WIDGETS['book-live'] = {
    title: 'A book that breathes',
    html: id => `<div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside"><div class="ctrls"><button type="button" class="btn sm" id="${id}-pause">Pause</button><button type="button" class="btn sm ghost" id="${id}-reset">Reset</button></div><div id="${id}-out"></div><p class="note">A simulation, not a feed. Orders join, orders leave, and now and then a trade eats the top of one side. On the real app this happens several times a second.</p></div></div>`,
    init(root, ctx) {
      const id = root.id; const base = root.SAMPLE || root.ownerDocument.defaultView.SAMPLE_BOOKS.btc;
      let book, paused = false, stats, flash = null, tickN = 0;
      const reset = () => { book = clone(base); stats = { added: 0, cancelled: 0, traded: 0 }; flash = null; draw(); };
      const rnd = (a, b) => a + Math.random() * (b - a);
      const step = () => {
        tickN++;
        const side = Math.random() < 0.5 ? 'asks' : 'bids'; const lv = book[side];
        const r = Math.random(); const spread = book.asks[0][0] - book.bids[0][0];
        if (r < 0.5) { const i = Math.floor(Math.random() * Math.min(6, lv.length)); const d = lv[i][1] * rnd(-0.4, 0.45); if (d > 0) stats.added++; else stats.cancelled++; lv[i][1] = Math.max(0.01, +(lv[i][1] + d).toFixed(2)); }
        else if (r < 0.72 && !(spread > 2 && Math.random() < 0.7)) { const top = lv[0]; const bite = Math.min(top[1], +rnd(0.05, 1.3).toFixed(2)); top[1] = +(top[1] - bite).toFixed(2); stats.traded++; flash = { side, px: top[0], at: tickN }; if (top[1] < 0.02) { lv.shift(); const last = lv[lv.length - 1]; lv.push([last[0] + (side === 'asks' ? 1 : -1), +rnd(0.3, 9).toFixed(2)]); } }
        else { if (spread > 1) { if (side === 'asks') book.asks.unshift([book.asks[0][0] - 1, +rnd(0.05, 1.4).toFixed(2)]); else book.bids.unshift([book.bids[0][0] + 1, +rnd(0.05, 1.4).toFixed(2)]); lv.pop(); stats.added++; } else { stats.cancelled++; const i = 1 + Math.floor(Math.random() * 4); if (lv[i]) lv[i][1] = Math.max(0.01, +(lv[i][1] * rnd(0.3, 0.8)).toFixed(2)); } }
        draw();
      };
      const draw = () => {
        const p = P(); const asks = book.asks.slice(0, 7), bids = book.bids.slice(0, 7);
        const L = F.ladder(p, asks, bids, { x: 8, y: 8, w: 300, rowH: 22, unit: 'BTC', total: true, maxSz: 12, pxW: 80, szW: 70 });
        let s = L.s;
        if (flash && tickN - flash.at < 3 && L.rows[flash.px] != null) s += F.r(p, 6, L.rows[flash.px] - 10, 304, 20, { rx: 5, fill: 'none', stroke: p.you, sw: 2 });
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 320, L.bottom + 8, 'live simulated order book', s);
        const bb = book.bids[0][0], ba = book.asks[0][0];
        $(root, '#' + id + '-out').innerHTML = readout([['best bid', fpx(bb, 0)], ['best ask', fpx(ba, 0)], ['spread', '$' + (ba - bb) + ' · ' + pct((ba - bb) / ((ba + bb) / 2) * 100, 4)], ['mid', fpx((ba + bb) / 2, 1)], ['orders added · cancelled', stats.added + ' · ' + stats.cancelled], ['trades', String(stats.traded)]]);
      };
      $(root, '#' + id + '-pause').addEventListener('click', e => { paused = !paused; e.currentTarget.textContent = paused ? 'Play' : 'Pause'; });
      $(root, '#' + id + '-reset').addEventListener('click', reset);
      reset(); ctx.timer(() => { if (!paused) step(); }, 420);
    }
  };

  WIDGETS['walk-the-book'] = {
    title: 'Walk the book',
    html: id => `<div class="ctrls"><label>Book<select id="${id}-book"><option value="btc">BTC, a deep book</option><option value="thin">A small coin, a thin book</option></select></label><label>Market buy size <span class="mono" id="${id}-szl"></span><input type="range" id="${id}-sz" min="1" max="250" value="30"></label></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div>`,
    init(root) {
      const id = root.id; const books = root.ownerDocument.defaultView.SAMPLE_BOOKS;
      const sel = $(root, '#' + id + '-book'), sl = $(root, '#' + id + '-sz');
      const draw = () => {
        const b = books[sel.value]; const p = P();
        const total = b.asks.reduce((a, x) => a + x[1], 0);
        const size = +(total * (+sl.value / 250)).toFixed(b.szDec === 0 ? 0 : 2);
        $(root, '#' + id + '-szl').textContent = fsz(size) + ' ' + b.unit;
        const w = walkBuy(b.asks, size);
        const L = F.ladder(p, b.asks, [], { x: 8, y: 8, w: 300, rowH: 21, unit: b.unit, spread: false, total: true, pxDec: b.pxDec, consumed: w.consumed, pxW: 84, szW: 70 });
        let s = L.s; s += F.t(p, 8, L.bottom + 18, 'blue = the part of each level your order takes', { size: 11, fill: p.muted });
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 320, L.bottom + 26, 'asks consumed by a market buy', s);
        const best = b.asks[0][0]; const slipU = w.avg - best; const fee = w.cost * 0.00045;
        const touched = w.fills.length;
        $(root, '#' + id + '-out').innerHTML = readout([
          ['best ask you saw', fpx(best, b.pxDec)], ['levels touched', String(touched)],
          ['average fill', isFinite(w.avg) ? fpx(w.avg, b.pxDec + 2) : '—'], ['slippage per unit', isFinite(slipU) ? fpx(slipU, b.pxDec + 2) + ' · ' + pct(slipU / best * 100, 4) : '—'],
          ['slippage in dollars', money(slipU * w.filled)], ['taker fee 0.045%', money(fee)],
          ['total above the best ask', money(slipU * w.filled + fee), 'wide']
        ]) + (w.left > 0 ? `<p class="note">The order is bigger than the ten levels shown: ${fsz(+w.left.toFixed(2))} ${b.unit} is still unfilled and would keep walking.</p>` : `<p class="note">${w.fills.length > 1 ? 'The order crossed ' + touched + ' prices. Every level after the first is slippage you chose by using a market order.' : 'Everything filled at the best ask: no slippage, only the fee and the spread.'}</p>`);
      };
      sel.addEventListener('change', draw); sl.addEventListener('input', draw); draw();
    }
  };

  WIDGETS['limit-placer'] = {
    title: 'Place a limit buy',
    html: id => `<div class="ctrls"><label>Your limit price <span class="mono" id="${id}-pxl"></span><input type="range" id="${id}-px" min="77242" max="77257" value="77247"></label><label>Size <span class="mono" id="${id}-szl"></span><input type="range" id="${id}-sz" min="1" max="60" value="10"></label></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div>`,
    init(root) {
      const id = root.id; const b = root.ownerDocument.defaultView.SAMPLE_BOOKS.btc;
      const px = $(root, '#' + id + '-px'), sz = $(root, '#' + id + '-sz');
      const draw = () => {
        const p = P(); const price = +px.value, size = +(sz.value / 10).toFixed(1);
        $(root, '#' + id + '-pxl').textContent = fpx(price, 0); $(root, '#' + id + '-szl').textContent = size + ' BTC';
        const bestAsk = b.asks[0][0], bestBid = b.bids[0][0];
        let consumed = {}, you = null, out = '';
        const asks = b.asks.slice(0, 6); let bids = b.bids.slice(0, 6).map(x => x.slice());
        if (price >= bestAsk) {
          const eligible = b.asks.filter(a => a[0] <= price); const w = walkBuy(eligible, size); consumed = w.consumed;
          const fee = w.cost * 0.00045;
          out = readout([['status', 'crosses the gap', 'wide'], ['fills now', fsz(+w.filled.toFixed(2)) + ' BTC'], ['average price', isFinite(w.avg) ? fpx(w.avg, 2) : '—'], ['role · fee', 'taker · 0.045% = ' + money(fee)], ['left over', w.left > 0.001 ? fsz(+w.left.toFixed(2)) + ' BTC rests at ' + fpx(price, 0) + ' as the new best bid' : 'nothing', 'wide']]);
          if (w.left > 0.001) { bids.unshift([price, +w.left.toFixed(2)]); you = { price, label: 'you · rests' }; }
        } else {
          const existing = b.bids.find(x => x[0] === price); const ahead = existing ? existing[1] : 0;
          if (existing) existing[1] = +(existing[1]).toFixed(2); else { bids.push([price, size]); bids.sort((a, c) => c[0] - a[0]); bids = bids.slice(0, 7); }
          you = { price, label: existing ? 'you · in queue' : 'you · new level' };
          out = readout([['status', price === bestBid ? 'joins the queue at the best bid' : (price > bestBid ? 'becomes the new best bid' : 'rests below the best bid'), 'wide'], ['fills now', '0 BTC'], ['ahead of you at this price', fsz(ahead) + ' BTC'], ['role · fee if filled', 'maker · 0.015% = ' + money(size * price * 0.00015)], ['fills when', 'a seller comes down to ' + fpx(price, 0) + '. It may never happen.', 'wide']]);
        }
        const L = F.ladder(p, asks, bids, { x: 8, y: 8, w: 300, rowH: 21, unit: 'BTC', consumed, you, pxW: 84, szW: 70 });
        let s = L.s;
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 440, L.bottom + 10, 'limit order placement on the ladder', s);
        $(root, '#' + id + '-out').innerHTML = out;
      };
      px.addEventListener('input', draw); sz.addEventListener('input', draw); draw();
    }
  };

  WIDGETS['queue-sim'] = {
    title: 'The queue at 77,249',
    html: id => `<div class="ctrls"><button type="button" class="btn sm primary" id="${id}-join">Join the queue (0.5 BTC)</button><button type="button" class="btn sm" id="${id}-sell">A market sell arrives</button><button type="button" class="btn sm" id="${id}-cancel">Cancel and re-place</button><button type="button" class="btn sm ghost" id="${id}-auto">Auto: off</button><button type="button" class="btn sm ghost" id="${id}-reset">Reset</button></div><div class="wviz" id="${id}-viz"></div><div id="${id}-out"></div>`,
    init(root, ctx) {
      const id = root.id; let q, you, auto = false, log, filledYou;
      const rnd = (a, b) => a + Math.random() * (b - a);
      const reset = () => { q = [{ sz: 0.4 }, { sz: 1.2 }, { sz: 0.25 }, { sz: 0.8 }]; you = null; log = ['Four orders are already resting at 77,249.']; filledYou = 0; draw(); };
      const join = () => { if (you) return; you = { sz: 0.5, you: true }; q.push(you); log.unshift('You joined at the back: ' + ahead().toFixed(2) + ' BTC ahead of you.'); draw(); };
      const ahead = () => { let a = 0; for (const o of q) { if (o === you) break; a += o.sz; } return a; };
      const sell = () => { let amt = +rnd(0.2, 1.6).toFixed(2); const got = amt; while (amt > 0 && q.length) { const o = q[0]; const take = Math.min(o.sz, amt); o.sz = +(o.sz - take).toFixed(2); amt = +(amt - take).toFixed(2); if (o === you) filledYou = +(filledYou + take).toFixed(2); if (o.sz <= 0) { q.shift(); if (o === you) { log.unshift('Your order is fully filled.'); you = null; } } } log.unshift('A market sell of ' + got.toFixed(2) + ' BTC ate from the front.'); if (Math.random() < 0.5) { q.push({ sz: +rnd(0.2, 1.5).toFixed(2) }); log.unshift('A new order joined behind.'); } draw(); };
      const cancel = () => { if (!you) { log.unshift('You have no order resting.'); draw(); return; } const pos = q.indexOf(you); q.splice(pos, 1); q.push({ sz: +rnd(0.3, 1.2).toFixed(2) }); q.push(you); log.unshift('Cancelled and re-placed at the same price: from position ' + (pos + 1) + ' to the back, position ' + q.length + '.'); draw(); };
      const draw = () => {
        const p = P(); let s = ''; let x = 10; const y = 30;
        s += F.t(p, 10, 18, 'resting bids at 77,249, oldest on the left · market sells eat from the left', { size: 11.5, fill: p.muted });
        s += F.l(p, 2, y + 17, 8, y + 17, { stroke: p.ask, sw: 2 });
        q.forEach(o => { const w = Math.max(44, 36 + o.sz * 48); s += F.r(p, x, y, w, 34, { rx: 7, fill: o.you ? p.you : p.bidSoft, stroke: o.you ? p.you : p.bid, sw: 1.2 }); s += F.t(p, x + w / 2, y + 21, (o.you ? 'you ' : '') + o.sz.toFixed(2), { anchor: 'middle', mono: true, size: 11.5, fill: o.you ? p.surf : p.ink, weight: 700 }); x += w + 6; });
        if (!q.length) s += F.t(p, 10, y + 22, 'the level is empty: the best bid has moved down', { size: 12, fill: p.muted });
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, Math.max(420, x + 10), 80, 'queue of resting orders at one price', s);
        $(root, '#' + id + '-out').innerHTML = readout([['your place in line', you ? (q.indexOf(you) + 1) + ' of ' + q.length : (filledYou ? 'filled' : 'not in the queue')], ['size ahead of you', you ? ahead().toFixed(2) + ' BTC' : '—'], ['filled so far', filledYou.toFixed(2) + ' BTC']]) + `<ul class="wlog">${log.slice(0, 4).map(l => '<li>' + esc(l) + '</li>').join('')}</ul>`;
      };
      $(root, '#' + id + '-join').addEventListener('click', join); $(root, '#' + id + '-sell').addEventListener('click', sell); $(root, '#' + id + '-cancel').addEventListener('click', cancel); $(root, '#' + id + '-reset').addEventListener('click', reset);
      $(root, '#' + id + '-auto').addEventListener('click', e => { auto = !auto; e.currentTarget.textContent = 'Auto: ' + (auto ? 'on' : 'off'); });
      reset(); ctx.timer(() => { if (auto) sell(); }, 1500);
    }
  };

  WIDGETS['tick-check'] = {
    title: 'Would the exchange accept this order?',
    html: id => `<div class="ctrls"><label>Asset<select id="${id}-a"><option value="BTC|5|77250|0.00013">BTC (size decimals 5)</option><option value="ETH|4|2550.5|0.004">ETH (size decimals 4)</option><option value="SOL|2|162.34|0.07">SOL (size decimals 2)</option><option value="HYPE|2|84.571|0.12">HYPE (size decimals 2)</option><option value="DOGE|0|0.12345|81">DOGE (size decimals 0)</option><option value="XRP|0|2.3456|5">XRP (size decimals 0)</option></select></label><label>Price<input type="text" id="${id}-px" inputmode="decimal" class="mono"></label><label>Size<input type="text" id="${id}-sz" inputmode="decimal" class="mono"></label></div><div id="${id}-out"></div>`,
    init(root) {
      const id = root.id; const a = $(root, '#' + id + '-a'), px = $(root, '#' + id + '-px'), sz = $(root, '#' + id + '-sz');
      const fill = () => { const [, , p0, s0] = a.value.split('|'); px.value = p0; sz.value = s0; };
      const sig = str => { const n = Number(str); if (!isFinite(n)) return NaN; let s = Math.abs(n).toString(); if (/e/i.test(s)) s = Math.abs(n).toFixed(10); s = s.replace('.', '').replace(/^0+/, '').replace(/0+$/, ''); return s.length; };
      const dec = str => { let s = Number(str).toString(); if (/e/i.test(s)) s = Number(str).toFixed(10).replace(/0+$/, ''); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
      const run = () => {
        const [name, szDec] = a.value.split('|'); const sd = +szDec; const p = Number(px.value), s = Number(sz.value);
        const rows = []; const ok = (c, msg, why) => rows.push([c, msg, why]);
        const isInt = Number.isInteger(p);
        ok(isFinite(p) && p > 0, 'price is a positive number', '');
        ok(isFinite(p) && (isInt || sig(px.value) <= 5), 'price has at most 5 significant figures' + (isInt ? ' (whole numbers are always allowed)' : ''), isFinite(p) && !isInt ? sig(px.value) + ' significant figures' : '');
        const pl = n => n + (n === 1 ? ' decimal' : ' decimals');
        ok(isFinite(p) && dec(px.value) <= 6 - sd, `price has at most ${pl(6 - sd)} (6 − size decimals ${sd})`, isFinite(p) ? pl(dec(px.value)) : '');
        ok(isFinite(s) && s > 0 && dec(sz.value) <= sd, `size has at most ${pl(sd)} (the lot size is ${sd ? '0.' + '0'.repeat(sd - 1) + '1' : '1'} ${name})`, isFinite(s) ? pl(dec(sz.value)) : '');
        const notional = p * s; ok(isFinite(notional) && notional >= 10, 'order value is at least $10', isFinite(notional) ? 'value ' + money(notional) : '');
        const pass = rows.every(r => r[0]);
        $(root, '#' + id + '-out').innerHTML = `<ul class="checks">${rows.map(r => `<li class="${r[0] ? 'ok' : 'no'}"><span class="m">${r[0] ? '✓' : '✗'}</span><span>${esc(r[1])}${r[2] ? ' <span class="muted">· ' + esc(r[2]) + '</span>' : ''}</span></li>`).join('')}</ul><div class="verdict ${pass ? 'ok' : 'no'}">${pass ? 'Accepted. The order would rest or fill.' : 'Rejected. The exchange does not round for you; fix the red line and resend.'}</div><p class="note">Size decimals for these six assets were read from the exchange’s asset list on 3 Nov 2026. Other assets have their own; the app shows the step when you type.</p>`;
      };
      a.addEventListener('change', () => { fill(); run(); }); px.addEventListener('input', run); sz.addEventListener('input', run); fill(); run();
    }
  };

  WIDGETS['candle-builder'] = {
    title: 'Build a candle from trades',
    html: id => `<div class="ctrls"><button type="button" class="btn sm primary" id="${id}-next">Next trade</button><button type="button" class="btn sm" id="${id}-play">Play</button><button type="button" class="btn sm ghost" id="${id}-reset">Reset</button></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside"><div id="${id}-out"></div><ol class="tape" id="${id}-tape"></ol></div></div>`,
    init(root, ctx) {
      const id = root.id; const trades = [[77250, 0.4, 'buy'], [77251, 1.2, 'buy'], [77249, 0.3, 'sell'], [77247, 2.1, 'sell'], [77248, 0.6, 'buy'], [77252, 0.9, 'buy'], [77255, 1.5, 'buy'], [77256, 0.7, 'buy'], [77253, 0.5, 'sell'], [77254, 1.1, 'buy']];
      let n = 0, playing = false;
      const draw = () => {
        const p = P(); const done = trades.slice(0, n); const lo = 77245, hi = 77258; const Y = px => 190 - (px - lo) / (hi - lo) * 160; let s = '';
        s += F.t(p, 10, 18, 'trades, in time order', { size: 11.5, fill: p.muted, weight: 700 });
        for (let i = 0; i < 10; i++) { const x = 30 + i * 30; s += F.l(p, x, 30, x, 200, { stroke: p.grid, sw: 1 }); }
        done.forEach((tr, i) => { const x = 30 + i * 30; s += F.c(p, x, Y(tr[0]), 3 + tr[1] * 3, { fill: tr[2] === 'buy' ? p.bid : p.ask, op: .85 }); });
        if (done.length > 1) s += F.poly(p, done.map((tr, i) => [30 + i * 30, Y(tr[0])]), { stroke: p.muted, sw: 1, dash: '2 3' });
        const cx = 380; s += F.t(p, cx, 18, 'the candle so far', { size: 11.5, fill: p.muted, weight: 700, anchor: 'middle' });
        if (done.length) {
          const o = done[0][0], c = done[done.length - 1][0], h = Math.max(...done.map(t => t[0])), l = Math.min(...done.map(t => t[0])); const vol = done.reduce((a, t) => a + t[1], 0);
          s += F.candle(p, cx, o, h, l, c, 30, Y);
          s += F.t(p, cx + 24, Y(h) + 4, 'H ' + h, { size: 11, mono: true }); s += F.t(p, cx + 24, Y(l) + 4, 'L ' + l, { size: 11, mono: true });
          s += F.t(p, cx - 24, Y(o) + 4, 'O ' + o, { size: 11, mono: true, anchor: 'end' }); s += F.t(p, cx + 24, Y(c) + 4, 'C ' + c, { size: 11, mono: true, fill: p.you, weight: 700 });
          s += F.r(p, cx - 15, 208, 30, 4 + vol * 2.2, { rx: 2, fill: p.inkSoft }); s += F.t(p, cx, 246, 'vol ' + vol.toFixed(1), { size: 10.5, mono: true, anchor: 'middle', fill: p.muted });
          $(root, '#' + id + '-out').innerHTML = readout([['open', String(o)], ['high', String(h)], ['low', String(l)], ['close', String(c)], ['volume', vol.toFixed(1) + ' BTC'], ['trades', n + ' of 10']]);
        } else { s += F.t(p, cx, 120, 'no trades yet', { size: 12, fill: p.muted, anchor: 'middle' }); $(root, '#' + id + '-out').innerHTML = readout([['open', '—'], ['high', '—'], ['low', '—'], ['close', '—'], ['volume', '0'], ['trades', '0 of 10']]); }
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 460, 256, 'trades becoming a candle', s);
        $(root, '#' + id + '-tape').innerHTML = done.map(tr => `<li class="${tr[2]}"><span class="mono">${tr[0]}</span> <span class="mono">${tr[1]}</span> <span class="muted">${tr[2] === 'buy' ? 'taker bought' : 'taker sold'}</span></li>`).reverse().join('');
        $(root, '#' + id + '-next').disabled = n >= 10;
      };
      const next = () => { if (n < 10) { n++; draw(); } else playing = false; };
      $(root, '#' + id + '-next').addEventListener('click', next); $(root, '#' + id + '-reset').addEventListener('click', () => { n = 0; playing = false; draw(); });
      $(root, '#' + id + '-play').addEventListener('click', () => { if (n >= 10) n = 0; playing = true; draw(); });
      draw(); ctx.timer(() => { if (playing) { if (n < 10) next(); else playing = false; } }, 700);
    }
  };

  /* ---------------- Layer 1 ---------------- */
  WIDGETS['leverage-explorer'] = {
    title: 'Same position, three leverages',
    html: id => `<div class="ctrls"><label>Size <span class="mono" id="${id}-szl"></span><input type="range" id="${id}-sz" min="1" max="20" value="10"></label><label>Leverage <span class="mono" id="${id}-levl"></span><input type="range" id="${id}-lev" min="1" max="40" value="5"></label><label>Price move <span class="mono" id="${id}-mvl"></span><input type="range" id="${id}-mv" min="-20" max="20" value="4"></label></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div><div class="tw" style="margin-top:12px"><table id="${id}-tbl"></table></div>`,
    init(root) {
      const id = root.id; const entry = 77250; const sz = $(root, '#' + id + '-sz'), lev = $(root, '#' + id + '-lev'), mv = $(root, '#' + id + '-mv');
      const draw = () => {
        const p = P(); const size = +sz.value / 100, L = +lev.value, move = +mv.value / 2;
        $(root, '#' + id + '-szl').textContent = size.toFixed(2) + ' BTC'; $(root, '#' + id + '-levl').textContent = L + 'x'; $(root, '#' + id + '-mvl').textContent = (move > 0 ? '+' : '') + move.toFixed(1) + '%';
        const notional = size * entry, margin = notional / L, pnl = notional * move / 100, roe = pnl / margin * 100;
        let s = ''; const x0 = 90, w = 300;
        s += F.t(p, 10, 22, 'notional, with your margin inside it', { size: 11.5, fill: p.muted, weight: 700 });
        s += F.r(p, x0, 34, w, 30, { rx: 7, fill: p.inkSoft }); s += F.r(p, x0, 34, w / L, 30, { rx: 7, fill: p.you });
        s += F.t(p, 10, 54, L + 'x', { size: 14, mono: true, weight: 700 });
        s += F.t(p, x0 + w, 84, 'notional ' + money(notional, 0), { anchor: 'end', size: 11, fill: p.muted }); s += F.t(p, x0, 84, 'margin ' + money(margin, 0), { size: 11, fill: p.you, weight: 700 });
        const py = 150; s += F.t(p, 10, 118, 'PnL of a ' + (move > 0 ? '+' : '') + move.toFixed(1) + '% move', { size: 11.5, fill: p.muted, weight: 700 });
        const barW = Math.min(w, Math.abs(pnl) / Math.max(1, notional * 0.1) * w); s += F.l(p, x0, py - 14, x0, py + 14, { stroke: p.line, sw: 1.5 });
        s += F.r(p, x0, py - 10, barW, 20, { rx: 5, fill: pnl >= 0 ? p.bid : p.ask }); s += F.t(p, x0 + barW + 8, py + 4, (pnl >= 0 ? '+' : '−') + money(Math.abs(pnl)), { size: 12, mono: true, weight: 700, fill: pnl >= 0 ? p.bid : p.ask });
        s += F.t(p, 10, 184, 'change the leverage: the PnL bar does not move.', { size: 11, fill: p.muted });
        s += F.t(p, 10, 198, 'only the blue slice and the return on margin do.', { size: 11, fill: p.muted });
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 420, 200, 'notional bar with margin slice and pnl bar', s);
        $(root, '#' + id + '-out').innerHTML = readout([['notional', money(notional)], ['margin posted', money(margin)], ['PnL of the move', (pnl >= 0 ? '+' : '−') + money(Math.abs(pnl))], ['return on margin', (roe >= 0 ? '+' : '') + roe.toFixed(1) + '%'], ['loss that would use up the margin', '−' + (100 / L).toFixed(2) + '% move (' + money(margin) + ')', 'wide']]);
        $(root, '#' + id + '-tbl').innerHTML = `<thead><tr><th>Leverage</th><th class="num">Margin</th><th class="num">PnL of this move</th><th class="num">Return on margin</th></tr></thead><tbody>${[1, 5, 20, 40].map(k => `<tr><td>${k}x${k === L ? ' <span class="tag p">chosen</span>' : ''}</td><td class="num">${money(notional / k)}</td><td class="num">${(pnl >= 0 ? '+' : '−') + money(Math.abs(pnl))}</td><td class="num">${(pnl >= 0 ? '+' : '') + (pnl / (notional / k) * 100).toFixed(1)}%</td></tr>`).join('')}</tbody>`;
      };
      [sz, lev, mv].forEach(el => el.addEventListener('input', draw)); draw();
    }
  };

  WIDGETS['entry-avg'] = {
    title: 'Build a position and watch the entry price',
    html: id => `<div class="ctrls"><button type="button" class="btn sm primary" data-fill="buy|0.01|77250">Buy 0.01 @ 77,250</button><button type="button" class="btn sm primary" data-fill="buy|0.01|78000">Buy 0.01 @ 78,000</button><button type="button" class="btn sm primary" data-fill="buy|0.02|76500">Buy 0.02 @ 76,500</button><button type="button" class="btn sm" data-fill="sell|0.01|77500">Sell 0.01 @ 77,500</button><button type="button" class="btn sm" data-fill="sell|0.02|78200">Sell 0.02 @ 78,200</button><button type="button" class="btn sm ghost" id="${id}-reset">Reset</button></div><div id="${id}-out"></div><div class="tw" style="margin-top:12px"><table id="${id}-tbl"></table></div>`,
    init(root) {
      const id = root.id; let pos, entry, closed, rows;
      const reset = () => { pos = 0; entry = NaN; closed = 0; rows = []; draw(); };
      const fill = (side, sz, px) => {
        const sign = side === 'buy' ? 1 : -1; const fee = sz * px * 0.00045; let kind, pnl = 0;
        if (pos === 0 || Math.sign(pos) === sign) { kind = 'opening'; entry = pos === 0 ? px : (entry * Math.abs(pos) + px * sz) / (Math.abs(pos) + sz); pos += sign * sz; pnl = -fee; }
        else { const closeSz = Math.min(sz, Math.abs(pos)); kind = 'closing'; pnl = -fee + Math.sign(pos) * (px - entry) * closeSz; pos += sign * closeSz; if (Math.abs(pos) < 1e-9) { pos = 0; entry = NaN; } if (closeSz < sz) { kind = 'closing, then opening the other way'; const rest = sz - closeSz; entry = px; pos = sign * rest; } }
        closed += pnl; rows.push([side + ' ' + sz + ' @ ' + fpx(px, 0), kind, pos === 0 ? 'flat' : Math.abs(pos).toFixed(2) + (pos > 0 ? ' long' : ' short'), isFinite(entry) ? fpx(entry, 1) : '—', (pnl >= 0 ? '+' : '−') + money(Math.abs(pnl))]); draw();
      };
      const draw = () => {
        $(root, '#' + id + '-out').innerHTML = readout([['position', pos === 0 ? 'flat' : Math.abs(pos).toFixed(2) + ' BTC ' + (pos > 0 ? 'long' : 'short')], ['entry price', isFinite(entry) ? fpx(entry, 1) : '—'], ['closed PnL so far, net of taker fees', (closed >= 0 ? '+' : '−') + money(Math.abs(closed)), 'wide']]);
        $(root, '#' + id + '-tbl').innerHTML = `<thead><tr><th>Fill</th><th>Kind</th><th>Position after</th><th class="num">Entry after</th><th class="num">Closed PnL</th></tr></thead><tbody>${rows.length ? rows.map(r => `<tr><td class="num">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="num">${r[3]}</td><td class="num">${r[4]}</td></tr>`).join('') : '<tr><td colspan="5" class="muted">No fills yet. Press a button.</td></tr>'}</tbody>`;
      };
      root.querySelectorAll('[data-fill]').forEach(b => b.addEventListener('click', () => { const [side, sz, px] = b.dataset.fill.split('|'); fill(side, +sz, +px); }));
      $(root, '#' + id + '-reset').addEventListener('click', reset); reset();
    }
  };

  /* ---------------- Layer 2 ---------------- */
  WIDGETS['trigger-sim'] = {
    title: 'When does a trigger order fire?',
    html: id => `<div class="ctrls"><label>Order<select id="${id}-kind"><option value="sl">Stop loss on a long: sell when mark falls to the trigger</option><option value="tp">Take profit on a long: sell when mark rises to the trigger</option><option value="sb">Stop market buy: buy when mark rises to the trigger</option><option value="tb">Take market buy: buy when mark falls to the trigger</option></select></label><label>Trigger <span class="mono" id="${id}-trl"></span><input type="range" id="${id}-tr" min="2" max="20" value="8"></label><button type="button" class="btn sm primary" id="${id}-play">Play</button><button type="button" class="btn sm ghost" id="${id}-reset">Reset</button></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div>`,
    init(root, ctx) {
      const id = root.id; const start = 77250; const N = 60;
      const mark = [], last = [];
      for (let i = 0; i < N; i++) { const f = i < 25 ? -0.016 * (i / 25) : -0.016 + 0.028 * ((i - 25) / 34); mark.push(start * (1 + f + 0.0006 * Math.sin(i * 1.7))); }
      for (let i = 0; i < N; i++) { const j = Math.max(0, i - 4); last.push(mark[j] * (1 + 0.0004 * Math.sin(i * 2.3) + (i > 20 && i < 32 ? 0.003 : 0))); }
      const kind = $(root, '#' + id + '-kind'), tr = $(root, '#' + id + '-tr');
      let t = 0, playing = false, fired = null;
      const below = () => kind.value === 'sl' || kind.value === 'tb';
      const trigger = () => start * (1 + (below() ? -1 : 1) * (+tr.value) / 1000);
      const draw = () => {
        const p = P(); const T = trigger(); $(root, '#' + id + '-trl').textContent = fpx(T, 0) + ' (' + (below() ? '−' : '+') + (+tr.value / 10).toFixed(1) + '%)';
        const lo = Math.min(...mark, ...last, T) * 0.9995, hi = Math.max(...mark, ...last, T) * 1.0005; const Y = v => 200 - (v - lo) / (hi - lo) * 160; const X = i => 30 + i * 7;
        let s = '';
        s += F.l(p, 30, Y(T), 450, Y(T), { stroke: p.you, sw: 1.5, dash: '6 4' }); s += F.t(p, 450, Y(T) - 6, 'trigger ' + fpx(T, 0), { anchor: 'end', size: 11, fill: p.you, weight: 700 });
        if (t > 1) { s += F.poly(p, last.slice(0, t).map((v, i) => [X(i), Y(v)]), { stroke: p.muted, sw: 1.8, dash: '2 4' }); s += F.poly(p, mark.slice(0, t).map((v, i) => [X(i), Y(v)]), { stroke: p.ink, sw: 2.2 }); }
        if (fired != null) { s += F.c(p, X(fired), Y(mark[fired]), 6, { fill: p.you }); s += F.pill(p, X(fired), Y(mark[fired]) - 18, 'fires', { size: 11, bg: p.you, fill: p.surf }); }
        s += F.t(p, 30, 20, 'mark', { size: 11, weight: 700 }); s += F.t(p, 70, 20, 'last trade on Hyperliquid', { size: 11, fill: p.muted });
        s += F.t(p, 30, 230, 'time →   (the path is fixed, so you can compare orders)', { size: 10.5, fill: p.muted });
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 460, 240, 'mark and last trade against a trigger', s);
        const m = fired != null ? mark[fired] : null, l = fired != null ? last[fired] : null;
        const lastReached = fired != null && last.slice(0, fired + 1).some(v => below() ? v <= T : v >= T);
        const sells = kind.value === 'sl' || kind.value === 'tp';
        $(root, '#' + id + '-out').innerHTML = readout([
          ['status', fired != null ? 'fired at step ' + (fired + 1) : (t >= N ? 'never fired on this path' : (playing ? 'watching the mark…' : 'press play')), 'wide'],
          ['mark when it fired', m ? fpx(m, 1) : '—'], ['last trade at that moment', l ? fpx(l, 1) : '—'],
          ['had Hyperliquid traded at the trigger?', fired != null ? (lastReached ? 'yes' : 'no, not yet') : '—', 'wide'],
          ['what it sends', fired != null ? ('a market ' + (sells ? 'sell' : 'buy') + ', taker fee, up to 10% slippage allowed') : '—', 'wide']
        ]);
      };
      const reset = () => { t = 0; playing = false; fired = null; $(root, '#' + id + '-play').textContent = 'Play'; draw(); };
      $(root, '#' + id + '-play').addEventListener('click', () => { if (t >= N) { t = 0; fired = null; } playing = true; draw(); });
      $(root, '#' + id + '-reset').addEventListener('click', reset); kind.addEventListener('change', reset); tr.addEventListener('input', reset);
      reset();
      ctx.timer(() => { if (!playing) return; if (t < N) { t++; const T = trigger(); if (fired == null && t > 0) { const v = mark[t - 1]; if (below() ? v <= T : v >= T) fired = t - 1; } draw(); } else playing = false; }, 120);
    }
  };

  /* ---------------- Layer 3 ---------------- */
  const wmedian = items => { const sorted = items.slice().sort((a, b) => a.px - b.px); const total = sorted.reduce((a, x) => a + x.w, 0); let acc = 0; for (const it of sorted) { acc += it.w; if (acc >= total / 2) return it.px; } return sorted[sorted.length - 1].px; };

  WIDGETS['median-explorer'] = {
    title: 'Push one exchange, watch the oracle',
    html: id => `<div class="ctrls"><label>Exchange to push<select id="${id}-ex"><option value="0">Binance (weight 3)</option><option value="1">OKX (weight 2)</option><option value="2">Bybit (weight 2)</option><option value="3">Kraken (weight 1)</option><option value="6">MEXC (weight 1)</option></select></label><label>Push <span class="mono" id="${id}-pl"></span><input type="range" id="${id}-p" min="-30" max="30" value="8"></label></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div>`,
    init(root) {
      const id = root.id; const base = [['Binance', 3, 77241], ['OKX', 2, 77243], ['Bybit', 2, 77240], ['Kraken', 1, 77246], ['KuCoin', 1, 77238], ['Gate', 1, 77244], ['MEXC', 1, 77239]];
      const ex = $(root, '#' + id + '-ex'), ps = $(root, '#' + id + '-p');
      const draw = () => {
        const p = P(); const k = +ex.value, push = +ps.value / 10; $(root, '#' + id + '-pl').textContent = (push > 0 ? '+' : '') + push.toFixed(1) + '%';
        const items = base.map((b, i) => ({ name: b[0], w: b[1], px: i === k ? b[2] * (1 + push / 100) : b[2] }));
        const med = wmedian(items); const mean = items.reduce((a, x) => a + x.px * x.w, 0) / items.reduce((a, x) => a + x.w, 0); const base0 = wmedian(base.map(b => ({ w: b[1], px: b[2] })));
        /* the cluster is drawn zoomed; a pushed source that leaves the window is shown at the edge with its real price */
        const others = items.filter((_, i) => i !== k).map(i => i.px); const lo = Math.min(...others) - 6, hi = Math.max(...others) + 6; const X = v => 30 + (v - lo) / (hi - lo) * 400;
        let s = ''; s += F.l(p, 30, 110, 430, 110, { stroke: p.line, sw: 2 });
        const sorted = items.map((it, i) => ({ it, i })).sort((a, b) => a.it.px - b.it.px);
        sorted.forEach(({ it, i }, rank) => { const inside = it.px >= lo && it.px <= hi; const x = inside ? X(it.px) : (it.px < lo ? 34 : 426); const r = 5 + it.w * 3; s += F.c(p, x, 110, r, { fill: i === k ? p.you : p.oracleSoft, stroke: i === k ? p.you : p.oracle, sw: 1.5 }); const ly = 110 - r - 8 - (rank % 3) * 12; s += F.t(p, x, ly, it.name + (inside ? '' : ' ' + fpx(it.px, 0) + (it.px < lo ? ' ←' : ' →')), { anchor: 'middle', size: 9.5, fill: i === k ? p.you : p.muted, weight: i === k ? 800 : 500 }); });
        s += F.l(p, X(med), 134, X(med), 160, { stroke: p.oracle, sw: 2.5 }); s += F.t(p, X(med), 176, 'weighted median ' + fpx(med, 0), { anchor: 'middle', size: 11, weight: 800, fill: p.oracle });
        const mx = Math.max(34, Math.min(426, X(mean))); s += F.l(p, mx, 134, mx, 148, { stroke: p.muted, sw: 1.5, dash: '3 3' }); s += F.t(p, mx, 198, 'plain average ' + fpx(mean, 0) + (X(mean) > 426 || X(mean) < 34 ? ' (off the chart)' : ''), { anchor: 'middle', size: 10.5, fill: p.muted });
        s += F.t(p, 30, 20, 'spot prices by source · dot size = weight · blue = the one you pushed', { size: 10.5, fill: p.muted });
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 460, 212, 'weighted median of exchange prices', s);
        $(root, '#' + id + '-out').innerHTML = readout([['oracle (weighted median)', fpx(med, 0)], ['moved from its unpushed value by', fpx(med - base0, 0)], ['a plain average would be', fpx(mean, 0)], ['the average moved by', fpx(mean - base.reduce((a, b) => a + b[2] * b[1], 0) / 11, 1)], ['why', push ? (Math.abs(med - base0) < 1 ? 'the pushed source slid to one end of the list; the middle of the weight is still with the others' : 'even the heaviest source cannot move a median past the next-heaviest cluster by more than one neighbour') : 'no push yet', 'wide']]) + '<p class="note">Hyperliquid’s own spot is excluded for BTC, so seven sources are shown. The stake-weighted median across validators is a second layer of the same protection.</p>';
      };
      ex.addEventListener('change', draw); ps.addEventListener('input', draw); draw();
    }
  };

  WIDGETS['mark-explorer'] = {
    title: 'Three inputs, one mark',
    html: id => `<div class="ctrls"><label>1 · oracle + smoothed premium <span class="mono" id="${id}-al"></span><input type="range" id="${id}-a" min="-200" max="200" value="-1"></label><label>2 · Hyperliquid’s own book <span class="mono" id="${id}-bl"></span><input type="range" id="${id}-b" min="-200" max="200" value="0"></label><label>3 · other exchanges’ perps <span class="mono" id="${id}-cl"></span><input type="range" id="${id}-c" min="-200" max="200" value="-2"></label></div><div class="ctrls"><button type="button" class="btn sm" id="${id}-wick">Wick on Hyperliquid only, −2%</button><button type="button" class="btn sm" id="${id}-cex">Binance and Bybit drop 1%</button><button type="button" class="btn sm ghost" id="${id}-reset">Reset</button></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div>`,
    init(root) {
      const id = root.id; const base = 77250; const sl = ['a', 'b', 'c'].map(k => $(root, '#' + id + '-' + k)); const names = ['oracle + premium', 'Hyperliquid book', 'other exchanges’ perps'];
      const val = i => base * (1 + (+sl[i].value) / 10000);
      const draw = () => {
        const p = P(); const v = [0, 1, 2].map(val); ['al', 'bl', 'cl'].forEach((k, i) => $(root, '#' + id + '-' + k).textContent = fpx(v[i], 0));
        const sorted = v.slice().sort((a, b) => a - b); const mark = sorted[1]; const which = v.indexOf(mark);
        const lo = Math.min(...v) - 30, hi = Math.max(...v) + 30; const X = x => 30 + (x - lo) / (hi - lo) * 400;
        let s = ''; const cols = [p.oracle, p.bid, p.you];
        [0, 1, 2].forEach(i => { const y = 50 + i * 40; s += F.l(p, 30, y, 430, y, { stroke: p.grid, sw: 1 }); s += F.c(p, X(v[i]), y, 8, { fill: cols[i] }); s += F.t(p, 30, y - 12, (i + 1) + ' · ' + names[i] + '  ' + fpx(v[i], 0), { size: 10.5, fill: p.muted }); });
        s += F.l(p, X(mark), 36, X(mark), 170, { stroke: p.ink, sw: 2, dash: '5 3' }); s += F.pill(p, X(mark), 186, 'mark ' + fpx(mark, 0), { size: 11.5, bg: p.ink, fill: p.surf, mono: true });
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 460, 206, 'three mark inputs and their median', s);
        $(root, '#' + id + '-out').innerHTML = readout([['mark', fpx(mark, 0), 'wide'], ['the median input is', (which + 1) + ' · ' + names[which]], ['distance from the unmoved price', (mark - base >= 0 ? '+' : '') + fpx(mark - base, 0)], ['so', Math.abs(mark - base) < 2 ? 'nothing you did moved the mark: one input alone cannot' : 'two inputs agree on a new price, so the mark went with them', 'wide']]);
      };
      sl.forEach(s => s.addEventListener('input', draw));
      $(root, '#' + id + '-wick').addEventListener('click', () => { sl[0].value = -1; sl[1].value = -200; sl[2].value = -2; draw(); });
      $(root, '#' + id + '-cex').addEventListener('click', () => { sl[0].value = -100; sl[1].value = 0; sl[2].value = -100; draw(); });
      $(root, '#' + id + '-reset').addEventListener('click', () => { sl[0].value = -1; sl[1].value = 0; sl[2].value = -2; draw(); });
      draw();
    }
  };

  WIDGETS['funding-explorer'] = {
    title: 'From premium to dollars per day',
    html: id => `<div class="ctrls"><label>Premium, per 8 h <span class="mono" id="${id}-pl"></span><input type="range" id="${id}-p" min="-300" max="300" value="20"></label><label>Your notional (USDC)<input type="number" id="${id}-n" value="1000" step="any"></label><label>Side<select id="${id}-s"><option value="1">Long</option><option value="-1">Short</option></select></label></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div>`,
    init(root) {
      const id = root.id; const ps = $(root, '#' + id + '-p'), nn = $(root, '#' + id + '-n'), ss = $(root, '#' + id + '-s');
      const rate8 = prem => prem + Math.max(-0.05, Math.min(0.05, 0.01 - prem));
      const draw = () => {
        const p = P(); const prem = +ps.value / 1000; const notional = +nn.value || 0; const side = +ss.value;
        $(root, '#' + id + '-pl').textContent = (prem > 0 ? '+' : '') + prem.toFixed(3) + '%';
        const r8 = rate8(prem); const rh = Math.max(-4, Math.min(4, r8 / 8)); const perHour = notional * rh / 100 * side;
        const x0 = 50, x1 = 430, y0 = 24, y1 = 150; const pLo = -0.32, pHi = 0.32, fLo = -0.3, fHi = 0.3;
        const X = v => x0 + (v - pLo) / (pHi - pLo) * (x1 - x0), Y = v => y1 - (v - fLo) / (fHi - fLo) * (y1 - y0);
        let s = ''; s += F.r(p, x0, y0, x1 - x0, Y(0) - y0, { fill: p.askSoft, op: .45 }); s += F.r(p, x0, Y(0), x1 - x0, y1 - Y(0), { fill: p.bidSoft, op: .45 });
        s += F.l(p, x0, Y(0), x1, Y(0), { stroke: p.line }); s += F.l(p, X(0), y0, X(0), y1, { stroke: p.line });
        const pts = []; for (let q = pLo; q <= pHi + 1e-9; q += 0.005) pts.push([X(q), Y(rate8(q))]); s += F.poly(p, pts, { stroke: p.ink, sw: 2.2 });
        s += F.c(p, X(prem), Y(r8), 7, { fill: p.you }); s += F.l(p, X(prem), Y(r8), X(prem), y1, { stroke: p.you, sw: 1, dash: '3 3' });
        s += F.t(p, x1, y0 + 12, 'longs pay', { anchor: 'end', size: 10.5, fill: p.ask, weight: 700 }); s += F.t(p, x1, y1 - 6, 'shorts pay', { anchor: 'end', size: 10.5, fill: p.bid, weight: 700 });
        s += F.t(p, x0, y1 + 16, 'premium per 8 h →', { size: 10, fill: p.muted }); s += F.t(p, 8, y0 + 4, 'rate', { size: 10, fill: p.muted });
        [-0.3, 0, 0.3].forEach(v => s += F.t(p, X(v), y1 + 16 + 12, (v > 0 ? '+' : '') + v.toFixed(2) + '%', { anchor: 'middle', size: 9.5, mono: true, fill: p.muted }));
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 460, 190, 'funding rate against premium with the current point marked', s);
        const pays = perHour > 0; const who = r8 > 0 ? 'longs pay shorts' : (r8 < 0 ? 'shorts pay longs' : 'nobody pays');
        $(root, '#' + id + '-out').innerHTML = readout([['rate per 8 h', (r8 > 0 ? '+' : '') + r8.toFixed(4) + '%'], ['rate per hour', (rh > 0 ? '+' : '') + rh.toFixed(5) + '%'], ['who pays', who, 'wide'], ['you, per hour', (pays ? 'pay ' : 'receive ') + money(Math.abs(perHour), 4)], ['per day', (pays ? 'pay ' : 'receive ') + money(Math.abs(perHour * 24))], ['per 30 days', (pays ? 'pay ' : 'receive ') + money(Math.abs(perHour * 720))], ['annualised', (rh * 24 * 365).toFixed(1) + '%'], ['in the flat zone?', Math.abs(0.01 - prem) <= 0.05 ? 'yes: the clamp cancels the premium, rate = 0.01% per 8 h' : 'no: the rate tracks the premium, less the 0.05% allowance', 'wide']]);
      };
      [ps, nn, ss].forEach(el => el.addEventListener('input', draw)); ss.addEventListener('change', draw); draw();
    }
  };

  /* ---------------- Layer 4 ---------------- */
  const liqPrice = (entry, L, mm, side, size, extra) => { const notional = entry * size; const margin = notional / L + (extra || 0); const avail = margin - notional * mm; return entry - side * avail / size / (1 - mm * side); };

  WIDGETS['cliff-explorer'] = {
    title: 'Walk a position toward the floor',
    html: id => `<div class="ctrls"><label>Leverage <span class="mono" id="${id}-ll"></span><input type="range" id="${id}-l" min="1" max="40" value="5"></label><label>Price now <span class="mono" id="${id}-pl"></span><input type="range" id="${id}-p" min="-250" max="80" value="-40"></label><label>Side<select id="${id}-s"><option value="1">Long</option><option value="-1">Short</option></select></label><label>Asset<select id="${id}-a"><option value="40">BTC (max 40x, maintenance 1.25%)</option><option value="25">ETH (max 25x, 2%)</option><option value="10">HYPE (max 10x, 5%)</option></select></label></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div>`,
    init(root) {
      const id = root.id; const entry = 77250, size = 0.1; const el = k => $(root, '#' + id + '-' + k);
      const draw = () => {
        const p = P(); const maxL = +el('a').value; const mm = 1 / (2 * maxL); if (+el('l').value > maxL) el('l').value = maxL; const L = +el('l').value; const side = +el('s').value; const move = +el('p').value / 10;
        el('ll').textContent = L + 'x'; el('pl').textContent = (move > 0 ? '+' : '') + move.toFixed(1) + '%';
        const notional = entry * size, margin = notional / L, price = entry * (1 + move / 100), pnl = side * (price - entry) * size, equity = margin + pnl, maint = price * size * mm;
        const liq = liqPrice(entry, L, mm, side, size, 0); const liqDistPct = (liq - entry) / entry * 100; const liquidated = side === 1 ? price <= liq : price >= liq;
        const lo = -25, hi = 8; const X = f => 30 + (f - lo) / (hi - lo) * 400;
        let s = ''; const y = 70;
        s += F.l(p, 30, y, 430, y, { stroke: p.line, sw: 2 });
        s += F.c(p, X(0), y, 6, { fill: p.you }); s += F.t(p, X(0), y - 14, 'entry', { anchor: 'middle', size: 10, fill: p.you, weight: 700 });
        const lx = Math.max(30, Math.min(430, X(liqDistPct))); s += F.l(p, lx, y - 16, lx, y + 16, { stroke: p.ask, sw: 2.5 }); s += F.t(p, lx, y + 30, 'liquidation ' + (liqDistPct > 0 ? '+' : '') + liqDistPct.toFixed(1) + '%', { anchor: 'middle', size: 10, fill: p.ask, weight: 700 });
        const px = Math.max(30, Math.min(430, X(move))); s += F.l(p, px, y - 22, px, y + 10, { stroke: p.ink, sw: 1.5, dash: '3 3' }); s += F.pill(p, px, y - 32, 'price ' + (move > 0 ? '+' : '') + move.toFixed(1) + '%', { size: 10, bg: p.ink, fill: p.surf });
        s += F.t(p, 30, 130, 'equity in the position', { size: 10.5, fill: p.muted, weight: 700 }); s += F.t(p, 430, 130, 'floor = maintenance ' + money(maint, 0), { anchor: 'end', size: 10.5, fill: p.ask, weight: 700 });
        const bw = 400; const eq = Math.max(0, Math.min(1, equity / margin)); s += F.r(p, 30, 140, bw, 22, { rx: 6, fill: p.inkSoft }); s += F.r(p, 30, 140, bw * eq, 22, { rx: 6, fill: liquidated ? p.ask : p.you });
        const fx = 30 + bw * Math.min(1, maint / margin); s += F.l(p, fx, 134, fx, 168, { stroke: p.ask, sw: 2.5 });
        s += F.t(p, 30, 186, 'margin posted ' + money(margin, 0) + ' → equity now ' + money(equity, 0) + (liquidated ? ' · below the floor: liquidated' : ''), { size: 11, weight: 700, fill: liquidated ? p.ask : p.ink });
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 460, 200, 'price ruler with entry and liquidation, and an equity bar with the maintenance floor', s);
        $(root, '#' + id + '-out').innerHTML = readout([['notional', money(notional)], ['margin at ' + L + 'x', money(margin)], ['PnL at this price', (pnl >= 0 ? '+' : '−') + money(Math.abs(pnl))], ['equity', money(equity)], ['maintenance margin', money(maint) + ' (' + (mm * 100).toFixed(2) + '%)'], ['liquidation price', fpx(liq, 0) + ' (' + (liqDistPct > 0 ? '+' : '') + liqDistPct.toFixed(1) + '%)'], ['status', liquidated ? 'liquidated: equity fell to the floor' : 'open: ' + money(equity - maint, 0) + ' above the floor', 'wide']]) + '<p class="note">Isolated margin, no extra margin added, using the docs’ formula liq = price − side × margin_available ÷ size ÷ (1 − maintenance × side). Change the leverage: the PnL does not change, the floor does not move, only your starting equity does.</p>';
      };
      ['l', 'p', 's', 'a'].forEach(k => { el(k).addEventListener('input', draw); el(k).addEventListener('change', draw); }); draw();
    }
  };

  WIDGETS['risk-sizer'] = {
    title: 'Size from the stop, then choose a leverage',
    html: id => `<div class="ctrls"><label>Account (USDC)<input type="number" id="${id}-acct" value="1000" step="any"></label><label>Risk per trade <span class="mono" id="${id}-rl"></span><input type="range" id="${id}-r" min="25" max="200" value="100"></label><label>Stop distance <span class="mono" id="${id}-sl"></span><input type="range" id="${id}-s" min="5" max="100" value="20"></label><label>Leverage <span class="mono" id="${id}-ll"></span><input type="range" id="${id}-l" min="1" max="40" value="5"></label></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div>`,
    init(root) {
      const id = root.id; const entry = 77250, mm = 0.0125; const el = k => $(root, '#' + id + '-' + k);
      const draw = () => {
        const p = P(); const acct = +el('acct').value || 0; const riskPct = +el('r').value / 100; const stopPct = +el('s').value / 10; const L = +el('l').value;
        el('rl').textContent = riskPct.toFixed(2) + '% = ' + money(acct * riskPct / 100); el('sl').textContent = stopPct.toFixed(1) + '%'; el('ll').textContent = L + 'x';
        const risk = acct * riskPct / 100, notional = risk / (stopPct / 100), size = notional / entry, margin = notional / L; const liqD = (1 / L - mm) / (1 - mm) * 100; const ratio = liqD / stopPct;
        const lo = -Math.max(25, liqD + 3), hi = 4; const X = f => 30 + (f - lo) / (hi - lo) * 400; const y = 80;
        let s = ''; s += F.l(p, 30, y, 430, y, { stroke: p.line, sw: 2 });
        s += F.r(p, X(-stopPct), y - 10, X(0) - X(-stopPct), 20, { rx: 4, fill: p.youSoft });
        s += F.c(p, X(0), y, 6, { fill: p.you }); s += F.t(p, X(0), y - 16, 'entry', { anchor: 'middle', size: 10, fill: p.you, weight: 700 });
        s += F.l(p, X(-stopPct), y - 16, X(-stopPct), y + 16, { stroke: p.ink, sw: 2.5 }); s += F.t(p, X(-stopPct), y + 30, 'stop −' + stopPct.toFixed(1) + '%', { anchor: 'middle', size: 10, weight: 700 });
        s += F.l(p, X(-liqD), y - 16, X(-liqD), y + 16, { stroke: p.ask, sw: 2.5 }); s += F.t(p, X(-liqD), y + 30, 'liquidation −' + liqD.toFixed(1) + '%', { anchor: 'middle', size: 10, fill: p.ask, weight: 700 });
        s += F.t(p, 30, 24, 'where the stop and the liquidation sit, for the leverage you chose', { size: 10.5, fill: p.muted });
        s += F.t(p, 30, 140, 'liquidation is ' + ratio.toFixed(1) + '× the stop distance away', { size: 12, weight: 800, fill: ratio >= 3 ? p.bid : p.ask });
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 460, 156, 'stop and liquidation on a price ruler', s);
        $(root, '#' + id + '-out').innerHTML = readout([['dollars at risk (1R)', money(risk)], ['notional = risk ÷ stop', money(notional)], ['size', size.toFixed(5) + ' BTC'], ['margin at ' + L + 'x', money(margin)], ['liquidation distance', liqD.toFixed(1) + '%'], ['stop distance', stopPct.toFixed(1) + '%'], ['verdict', ratio >= 3 ? '<span class="tag ok">liquidation far enough: the stop does the closing</span>' : '<span class="tag bad">too close: lower the leverage</span>', 'wide']]) + '<p class="note">Notice what the leverage slider does not change: the notional, the size and the dollars at risk. It only changes how much margin you lock up and where the cliff is.</p>';
      };
      ['acct', 'r', 's', 'l'].forEach(k => el(k).addEventListener('input', draw)); draw();
    }
  };

  /* ---------------- Layer 5 ---------------- */
  WIDGETS['session-dial'] = {
    title: 'Any hour, on both clocks',
    html: id => `<div class="ctrls"><label>Time of day (IST) <span class="mono" id="${id}-tl"></span><input type="range" id="${id}-t" min="0" max="1439" value="720" style="width:260px"></label><button type="button" class="btn sm" id="${id}-now">Now</button></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div>`,
    init(root) {
      const id = root.id; const sl = $(root, '#' + id + '-t');
      const nyOffset = () => { try { const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' }).formatToParts(new Date()); const tz = (parts.find(p => p.type === 'timeZoneName') || {}).value; return tz === 'EDT' ? -4 : -5; } catch (e) { return -5; } };
      const pad = n => String(n).padStart(2, '0');
      const draw = () => {
        const p = P(); const istMin = +sl.value; const utcMin = ((istMin - 330) % 1440 + 1440) % 1440; const h = utcMin / 60; const off = nyOffset();
        sl.previousElementSibling.textContent = pad(Math.floor(istMin / 60)) + ':' + pad(istMin % 60);
        const session = h < 7 ? 'Asia: usually the quietest, thin books' : (h < 13.5 ? 'Europe: volume builds' : (h < 16 ? 'Europe and US overlap: the loudest stretch' : (h < 21 ? 'US cash session: most volume, macro moves' : 'late US: fading into Asia')));
        const cx = 150, cy = 150, r = 96; const ang = hh => (hh / 24) * Math.PI * 2 - Math.PI / 2; const pt = (hh, rad) => [cx + rad * Math.cos(ang(hh)), cy + rad * Math.sin(ang(hh))];
        let s = '';
        const arc = (h0, h1, col) => { const [x0, y0] = pt(h0, r), [x1, y1] = pt(h1, r); s += F.p(p, `M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${h1 - h0 > 12 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`, { fill: col }); };
        arc(0, 7, p.inkSoft); arc(7, 13.5, p.oracleSoft); arc(13.5, 21, p.askSoft); arc(21, 24, p.youSoft);
        s += F.c(p, cx, cy, r, { fill: 'none', stroke: p.line, sw: 1.5 });
        for (let k = 0; k < 24; k++) { const [x0, y0] = pt(k, r), [x1, y1] = pt(k, r - (k % 6 ? 5 : 10)); s += F.l(p, x0, y0, x1, y1, { stroke: p.muted, sw: k % 6 ? 1 : 2 }); if (k % 6 === 0) { const [tx, ty] = pt(k, r + 14); s += F.t(p, tx, ty + 4, pad(k) + 'Z', { anchor: 'middle', size: 9.5, mono: true, fill: p.muted }); } }
        const [hx, hy] = pt(h, r - 14); s += F.l(p, cx, cy, hx, hy, { stroke: p.ink, sw: 3, cap: 'round' }); s += F.c(p, cx, cy, 5, { fill: p.ink });
        const marks = [[0, 'close'], [13.5 + (off === -4 ? -1 : 0), 'US data'], [14.5 + (off === -4 ? -1 : 0), 'NYSE'], [21 + (off === -4 ? -1 : 0), 'NY close']];
        marks.forEach(m => { const [x, y] = pt(m[0], r + 2); s += F.c(p, x, y, 3.5, { fill: p.you }); const [tx, ty] = pt(m[0], r + 38); s += F.t(p, tx, ty + 4, m[1], { anchor: 'middle', size: 9, fill: p.you, weight: 700 }); });
        s += F.t(p, cx, 296, 'ring in UTC · blue dots are US-anchored events for today’s clocks', { anchor: 'middle', size: 9.5, fill: p.muted });
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 300, 306, 'session ring with a hand at the chosen time', s);
        const nextFund = 60 - (utcMin % 60); const usData = (13.5 + (off === -4 ? -1 : 0)) * 60; const nyse = (14.5 + (off === -4 ? -1 : 0)) * 60;
        const until = target => { let d = target - utcMin; if (d <= 0) d += 1440; return Math.floor(d / 60) + 'h ' + pad(d % 60) + 'm'; };
        $(root, '#' + id + '-out').innerHTML = readout([['UTC', pad(Math.floor(utcMin / 60)) + ':' + pad(utcMin % 60)], ['IST', pad(Math.floor(istMin / 60)) + ':' + pad(istMin % 60)], ['session', session, 'wide'], ['next funding print', 'in ' + nextFund + ' min'], ['next daily close (00:00 UTC)', 'in ' + until(0)], ['next US data slot (08:30 ET)', 'in ' + until(usData)], ['next NYSE open (09:30 ET)', 'in ' + until(nyse)], ['US clocks right now', off === -4 ? 'daylight time (EDT, UTC−4): US events an hour earlier in IST' : 'standard time (EST, UTC−5)', 'wide']]);
      };
      sl.addEventListener('input', draw);
      $(root, '#' + id + '-now').addEventListener('click', () => { const d = new Date(); const ist = (d.getUTCHours() * 60 + d.getUTCMinutes() + 330) % 1440; sl.value = ist; draw(); });
      const d = new Date(); sl.value = (d.getUTCHours() * 60 + d.getUTCMinutes() + 330) % 1440; draw();
    }
  };

  /* ---------------- Layer 6 ---------------- */
  WIDGETS['oi-matrix'] = {
    title: 'Price, open interest, funding: who is doing what?',
    html: id => `<div class="ctrls"><label>Price over the last hours<select id="${id}-p"><option value="up">rising</option><option value="down">falling</option></select></label><label>Open interest<select id="${id}-o"><option value="up">rising</option><option value="down">falling</option></select></label><label>Funding<select id="${id}-f"><option value="neutral">near neutral</option><option value="pos">clearly positive (longs paying)</option><option value="neg">clearly negative (shorts paying)</option></select></label></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div>`,
    init(root) {
      const id = root.id; const el = k => $(root, '#' + id + '-' + k);
      const draw = () => {
        const p = P(); const pr = el('p').value, oi = el('o').value, fd = el('f').value;
        const key = pr + '-' + oi;
        const read = { 'up-up': ['New longs are opening', 'A trend with new money behind it, and a crowd forming. Healthy early; fragile once funding climbs.', 'the crowd getting expensive: funding rising, premium widening. That is when the trend is most likely to shake people out.'], 'up-down': ['Shorts are covering', 'Price is lifted by people leaving, not arriving. The fuel runs out when the covering ends.', 'the rise stalling as open interest stops falling. Without new longs there is nothing to carry it further.'], 'down-up': ['New shorts are opening', 'A downtrend with conviction behind it, and a crowd that can be squeezed.', 'funding turning negative while price holds a level: a crowded short that could be squeezed.'], 'down-down': ['Longs are closing or being liquidated', 'Often the end of a move: forced sellers finish, and then there is nobody left to sell.', 'liquidation prints drying up and open interest flattening. That is when the selling is done.'] }[key];
        const fdNote = fd === 'neutral' ? 'Funding near neutral: the side in the trend is not yet paying much to stay. Room for the move to continue.' : (fd === 'pos' ? 'Longs are paying clearly. ' + (pr === 'up' ? 'The crowd is on the trend side and paying for it: fragile.' : 'Longs are paying while price falls: the pain is on the long side, and more liquidations are likely below.') : 'Shorts are paying clearly. ' + (pr === 'down' ? 'The crowd is short and paying: a squeeze is possible.' : 'Shorts are paying while price rises: a squeeze may already be under way.'));
        let s = ''; const x0 = 30, x1 = 430;
        const line = (dir, y0, col, label) => { const pts = []; for (let i = 0; i <= 10; i++) { const x = x0 + i * (x1 - x0) / 10; const v = dir === 'up' ? y0 - i * 6 - (i % 2 ? 4 : 0) : y0 + i * 6 + (i % 2 ? 4 : 0); pts.push([x, v]); } s += F.poly(p, pts, { stroke: col, sw: 2.2 }); s += F.t(p, x1, pts[10][1] + (dir === 'up' ? -8 : 16), label, { anchor: 'end', size: 10.5, fill: col, weight: 700 }); };
        line(pr, 80, pr === 'up' ? p.bid : p.ask, 'price ' + pr); line(oi, 160, p.you, 'open interest ' + oi);
        s += F.t(p, x0, 24, 'the last few hours, stylised', { size: 10.5, fill: p.muted });
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 460, 230, 'price and open interest directions', s);
        $(root, '#' + id + '-out').innerHTML = readout([['reading', read[0], 'wide'], ['what it means', read[1], 'wide'], ['funding', fdNote, 'wide'], ['watch for', read[2], 'wide']]);
      };
      ['p', 'o', 'f'].forEach(k => el(k).addEventListener('change', draw)); draw();
    }
  };

  WIDGETS['thesis-builder'] = {
    title: 'Write today’s sentence',
    html: id => `<div class="ctrls"><label>Market<input type="text" id="${id}-m" value="BTC" style="width:90px"></label><label>Bias<select id="${id}-b"><option>bullish</option><option>bearish</option><option>range-bound</option></select></label><label>While this level holds<input type="text" id="${id}-l" value="76,200" inputmode="decimal"></label></div><div class="ctrls"><label>Because (what OI and funding say)<input type="text" id="${id}-e" value="OI is rising with price and funding is near neutral" style="width:340px"></label><label>Wrong below / above<input type="text" id="${id}-i" value="75,900" inputmode="decimal"></label></div><div class="thesis" id="${id}-s"></div><div class="ctrls" style="margin-top:10px"><button type="button" class="btn sm primary" id="${id}-save">Add to my notes</button><button type="button" class="btn sm" id="${id}-copy">Copy</button></div><div id="${id}-notes"></div>`,
    init(root) {
      const id = root.id; const el = k => $(root, '#' + id + '-' + k);
      const key = 'hlwb.notes'; const load = () => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; } }; const save = n => { try { localStorage.setItem(key, JSON.stringify(n)); } catch (e) {} };
      const sentence = () => { const b = el('b').value; const dir = b === 'bearish' ? 'above' : 'below'; return `${(el('m').value || 'BTC').trim()} is ${b} while ${(el('l').value || '[level]').trim()} holds, because ${(el('e').value || '[evidence]').trim()}. Wrong ${dir} ${(el('i').value || '[invalidation]').trim()}.`; };
      const drawNotes = () => { const notes = load(); const graded = notes.filter(n => n.grade).length; const streak = (() => { let k = 0; for (const n of notes) { if (n.grade === 'pass') k++; else break; } return k; })(); $(root, '#' + id + '-notes').innerHTML = notes.length ? `<p class="note" style="margin:12px 0 6px">${notes.length} note${notes.length === 1 ? '' : 's'} · ${graded} graded · ${streak} passed in a row (the drill wants ten). Saved in this browser.</p><ul class="wlog">${notes.slice(0, 12).map((n, i) => `<li><span class="mono">${esc(n.date)}</span> ${esc(n.text)} <select data-grade="${i}" class="grade"><option value="">grade…</option><option value="pass" ${n.grade === 'pass' ? 'selected' : ''}>pass: reasoning held</option><option value="fail" ${n.grade === 'fail' ? 'selected' : ''}>fail: no level, or ignored it</option></select> <button type="button" class="x" data-rm="${i}">remove</button></li>`).join('')}</ul>` : ''; };
      const draw = () => { $(root, '#' + id + '-s').textContent = sentence(); };
      ['m', 'b', 'l', 'e', 'i'].forEach(k => { el(k).addEventListener('input', draw); el(k).addEventListener('change', draw); });
      el('save').addEventListener('click', () => { const notes = load(); const d = new Date(); notes.unshift({ date: d.toISOString().slice(0, 10), text: sentence(), grade: '' }); save(notes); drawNotes(); if (root.ownerDocument.defaultView.toast) root.ownerDocument.defaultView.toast('Note saved'); });
      el('copy').addEventListener('click', () => { const w = root.ownerDocument.defaultView; if (w.navigator.clipboard) w.navigator.clipboard.writeText(sentence()).then(() => w.toast && w.toast('Copied')).catch(() => {}); });
      root.addEventListener('change', e => { const g = e.target.closest('[data-grade]'); if (g) { const notes = load(); notes[+g.dataset.grade].grade = g.value; save(notes); drawNotes(); } });
      root.addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (b) { const notes = load(); notes.splice(+b.dataset.rm, 1); save(notes); drawNotes(); } });
      draw(); drawNotes();
    }
  };

  /* ---------------- Layer 7 ---------------- */
  WIDGETS['expectancy-sim'] = {
    title: 'Two hundred blocks of twenty trades',
    html: id => `<div class="ctrls"><label>Win rate <span class="mono" id="${id}-wl"></span><input type="range" id="${id}-w" min="20" max="80" value="45"></label><label>Average win <span class="mono" id="${id}-al"></span><input type="range" id="${id}-a" min="5" max="50" value="20"></label><label>Average loss <span class="mono" id="${id}-bl"></span><input type="range" id="${id}-b" min="5" max="20" value="10"></label><button type="button" class="btn sm primary" id="${id}-run">Run again</button></div><div class="wrow"><div class="wviz" id="${id}-viz"></div><div class="wside" id="${id}-out"></div></div>`,
    init(root) {
      const id = root.id; const el = k => $(root, '#' + id + '-' + k);
      const run = () => {
        const p = P(); const wr = +el('w').value / 100, aw = +el('a').value / 10, al = +el('b').value / 10;
        el('wl').textContent = Math.round(wr * 100) + '%'; el('al').textContent = '+' + aw.toFixed(1) + 'R'; el('bl').textContent = '−' + al.toFixed(1) + 'R';
        const exp = wr * aw - (1 - wr) * al; const blocks = []; let streak = 0, worstStreak = 0; const first = [];
        for (let b = 0; b < 200; b++) { let sum = 0; for (let t = 0; t < 20; t++) { const win = Math.random() < wr; const r = win ? aw : -al; sum += r; if (win) streak = 0; else { streak++; worstStreak = Math.max(worstStreak, streak); } if (b === 0) first.push(r); } blocks.push(sum); }
        const lo = Math.floor(Math.min(...blocks) / 4) * 4, hi = Math.ceil(Math.max(...blocks) / 4) * 4; const nb = Math.max(1, (hi - lo) / 4); const bins = new Array(nb).fill(0); blocks.forEach(v => { const i = Math.min(nb - 1, Math.floor((v - lo) / 4)); bins[i]++; }); const maxN = Math.max(...bins);
        const x0 = 36, x1 = 440, y0 = 30, y1 = 150; const bw = (x1 - x0) / nb;
        let s = ''; s += F.t(p, x0, 18, 'total R per block, 200 blocks', { size: 10.5, fill: p.muted, weight: 700 });
        bins.forEach((n, i) => { const h = n / maxN * (y1 - y0); const centre = lo + i * 4 + 2; s += F.r(p, x0 + i * bw + 1, y1 - h, Math.max(1, bw - 2), h, { rx: 2, fill: centre < 0 ? p.ask : p.bid, op: .8 }); });
        s += F.l(p, x0, y1, x1, y1, { stroke: p.line, sw: 1.5 });
        [lo, 0, hi].forEach(v => { const x = x0 + (v - lo) / (hi - lo) * (x1 - x0); s += F.t(p, Math.max(x0 + 10, Math.min(x1 - 10, x)), y1 + 14, (v > 0 ? '+' : '') + v + 'R', { anchor: 'middle', size: 9.5, mono: true, fill: p.muted }); });
        s += F.t(p, x0, 190, 'the first block, trade by trade', { size: 10.5, fill: p.muted, weight: 700 });
        let eq = 0; const pts = [[x0, 230]]; first.forEach((r, i) => { eq += r; pts.push([x0 + (i + 1) * 20, 230 - eq * 4]); });
        s += F.l(p, x0, 230, x1, 230, { stroke: p.grid }); s += F.poly(p, pts, { stroke: p.you, sw: 2 }); first.forEach((r, i) => s += F.c(p, x0 + (i + 1) * 20, 230 - (pts[i + 1] ? (230 - pts[i + 1][1]) : 0), 3, { fill: r > 0 ? p.bid : p.ask }));
        $(root, '#' + id + '-viz').innerHTML = F.svg(p, 460, 280, 'histogram of block results and one block equity curve', s);
        const losing = blocks.filter(b => b < 0).length; const sorted = blocks.slice().sort((a, b) => a - b);
        $(root, '#' + id + '-out').innerHTML = readout([['expectancy per trade', (exp >= 0 ? '+' : '') + exp.toFixed(2) + 'R'], ['expected per block of 20', (exp * 20 >= 0 ? '+' : '') + (exp * 20).toFixed(1) + 'R'], ['losing blocks', losing + ' of 200 (' + (losing / 2).toFixed(0) + '%)'], ['worst block · best block', sorted[0].toFixed(0) + 'R · +' + sorted[199].toFixed(0) + 'R'], ['longest losing streak', worstStreak + ' trades in a row'], ['break-even win rate', (al / (aw + al) * 100).toFixed(0) + '%'], ['so', exp > 0 ? (losing > 0 ? 'a sound system still had ' + losing + ' losing blocks. One trade says nothing; one block says a little.' : 'no losing blocks this run; run it again, there will be') : 'negative expectancy: no sizing rule can save this. Fix the ratio or the win rate.', 'wide']]);
      };
      ['w', 'a', 'b'].forEach(k => el(k).addEventListener('input', run)); el('run').addEventListener('click', run); run();
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
