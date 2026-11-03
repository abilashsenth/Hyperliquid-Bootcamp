/* Layer 6 · Reading the market: lesson text and figures.
   The open-interest matrix follows the Glassnode piece in the media list; everything else is general market-reading
   practice applied to what Hyperliquid makes public. */
(function (root) {
  'use strict';
  const F = root.FigLib, FIG = root.FIG || (root.FIG = {}), LESSONS = root.LESSONS || (root.LESSONS = {});

  FIG['timeframe-stack'] = P => F.svg(P, 660, 230, 'Four chart timeframes stacked from daily at the top to five-minute at the bottom, each with its job: context, structure, timing, entry; an arrow shows that the higher timeframe wins a disagreement', id => {
    let s = '';
    const rows = [['Daily', 'context: which way is the tide; the 00:00 UTC closes that matter', 6], ['4-hour', 'structure: the swings, the last higher low, the invalidation', 12], ['1-hour', 'timing: when the structure is being tested', 24], ['5- and 15-minute', 'entry and exit only; never the thesis', 40]];
    rows.forEach((r, i) => { const y = 30 + i * 46; s += F.r(P, 20, y, 150, 34, { rx: 8, fill: i === 0 ? P.ink : P.inkSoft }); s += F.t(P, 95, y + 21, r[0], { anchor: 'middle', size: 12, weight: 800, fill: i === 0 ? P.surf : P.ink }); s += F.t(P, 190, y + 21, r[1], { size: 11.5, fill: P.muted }); const n = r[2]; for (let k = 0; k < n; k++) { const x = 520 + k * (120 / n); s += F.r(P, x, y + 6 + (k % 3) * 6, Math.max(1.5, 120 / n - 2), 14 - (k % 3) * 4, { rx: 1, fill: k % 2 ? P.bidSoft : P.askSoft }); } });
    s += F.l(P, 10, 206, 10, 34, { stroke: P.you, sw: 1.8, arrow: 'you', id });
    s += F.t(P, 20, 218, 'when two timeframes disagree, the higher one wins', { size: 11, fill: P.you, weight: 700 });
    return s;
  });

  FIG['structure-hh-hl'] = P => F.svg(P, 660, 260, 'A price path making higher highs and higher lows with each swing labelled; the most recent higher low is marked as the level that invalidates the uptrend', id => {
    let s = ''; const pts = [[40, 200], [120, 120], [170, 160], [260, 90], [320, 140], [410, 60], [470, 110], [560, 40], [620, 80]];
    s += F.p(P, F.path(pts), { stroke: P.ink, sw: 2.2 });
    const labs = [[120, 120, 'HH'], [170, 160, 'HL'], [260, 90, 'HH'], [320, 140, 'HL'], [410, 60, 'HH'], [470, 110, 'HL'], [560, 40, 'HH']];
    labs.forEach(l => { const high = l[2] === 'HH'; s += F.c(P, l[0], l[1], 4.5, { fill: high ? P.bid : P.ask }); s += F.t(P, l[0], l[1] + (high ? -10 : 18), l[2], { anchor: 'middle', size: 10.5, weight: 800, fill: high ? P.bid : P.ask }); });
    s += F.l(P, 440, 110, 640, 110, { stroke: P.you, sw: 1.5, dash: '6 4' }); s += F.pill(P, 540, 128, 'invalidation: the last higher low', { size: 10.5, bg: P.you, fill: P.surf });
    s += F.r(P, 236, 84, 180, 12, { rx: 3, fill: P.oracleSoft }); s += F.wrap(P, 222, 60, 'a zone where the book got heavy before: resistance, then support', 170, { size: 9.5, fill: P.oracle, lh: 11, anchor: 'end' }).s;
    s += F.wrap(P, 40, 234, 'higher highs and higher lows make an uptrend. The trend is wrong, by definition, the moment price closes below the last higher low.', 600, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  FIG['volume-confirm'] = P => F.svg(P, 660, 240, 'Two breakouts above the same level side by side: one on rising volume during the US session that holds, and one on thin weekend volume that fails and falls back', id => {
    let s = '';
    const panel = (x, title, path, vols, holds) => {
      s += F.t(P, x, 26, title, { weight: 800, size: 12 });
      s += F.l(P, x, 100, x + 290, 100, { stroke: P.oracle, sw: 1.5, dash: '5 4' }); s += F.t(P, x + 290, 96, 'level', { anchor: 'end', size: 10, fill: P.oracle });
      s += F.poly(P, path.map(q => [x + q[0], q[1]]), { stroke: holds ? P.bid : P.ask, sw: 2.2 });
      vols.forEach((v, i) => s += F.r(P, x + 10 + i * 28, 196 - v, 18, v, { rx: 2, fill: i >= 5 ? (holds ? P.bid : P.ask) : P.inkSoft, op: .85 }));
      s += F.t(P, x, 214, holds ? 'volume rises into and through the break: it holds' : 'volume stays thin: the break fails and falls back', { size: 10.5, fill: holds ? P.bid : P.ask, weight: 700 });
    };
    panel(20, 'US session, Tuesday', [[10, 150], [60, 130], [110, 140], [160, 110], [200, 90], [240, 70], [290, 60]], [14, 16, 18, 22, 30, 44, 56, 62, 58, 50], true);
    panel(350, 'Sunday, 04:00 UTC', [[10, 150], [60, 130], [110, 140], [160, 110], [200, 85], [240, 110], [290, 140]], [10, 8, 12, 9, 11, 14, 12, 9, 10, 8], false);
    return s;
  });

  FIG['oi-matrix'] = P => F.svg(P, 660, 300, 'A two by two matrix of price direction against open interest direction: price up with open interest up is new longs, price up with open interest down is shorts covering, price down with open interest up is new shorts, price down with open interest down is longs closing or being liquidated', id => {
    let s = ''; const x0 = 150, y0 = 50, w = 230, h = 100;
    const cell = (cx, cy, title, body, col) => { s += F.r(P, cx, cy, w, h, { rx: 10, fill: P.surf, stroke: col, sw: 1.5 }); s += F.t(P, cx + 14, cy + 24, title, { size: 12.5, weight: 800, fill: col }); s += F.wrap(P, cx + 14, cy + 44, body, w - 28, { size: 10.5, fill: P.muted, lh: 13 }).s; };
    cell(x0, y0, 'new longs opening', 'a trend that is also a crowd forming. Healthy early, fragile late; watch funding climb.', P.bid);
    cell(x0 + w + 20, y0, 'shorts covering', 'price lifted by people leaving, not arriving. Fuel runs out when the covering ends.', P.oracle);
    cell(x0, y0 + h + 20, 'new shorts opening', 'a downtrend with conviction behind it, and a crowd that can be squeezed.', P.ask);
    cell(x0 + w + 20, y0 + h + 20, 'longs closing or liquidated', 'the end of a move, often. Forced sellers finish; then there is nobody left to sell.', P.muted);
    s += F.t(P, x0 + w / 2, 38, 'open interest rising', { anchor: 'middle', size: 11, weight: 700 }); s += F.t(P, x0 + w + 20 + w / 2, 38, 'open interest falling', { anchor: 'middle', size: 11, weight: 700 });
    s += F.t(P, 20, y0 + h / 2 + 4, 'price up', { size: 11, weight: 700, fill: P.bid }); s += F.t(P, 20, y0 + h + 20 + h / 2 + 4, 'price down', { size: 11, weight: 700, fill: P.ask });
    s += F.wrap(P, 20, 282, 'read with funding: if the crowd is paying a lot to stay, the move is more fragile than it looks. Short-side signals are weaker and the metric lags intraday (see the Glassnode piece in the media list).', 620, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  FIG['liq-clusters'] = P => F.svg(P, 660, 250, 'A vertical price axis with clusters of estimated liquidation levels above and below the current price at round leverage multiples; price is drawn being pulled toward the nearest cluster', id => {
    let s = ''; const x0 = 300, top = 30, bot = 220; const Y = f => bot - (f + 0.12) / 0.24 * (bot - top);
    s += F.l(P, x0, top, x0, bot, { stroke: P.line, sw: 2 });
    s += F.c(P, x0, Y(0), 6, { fill: P.you }); s += F.t(P, x0 + 14, Y(0) + 4, 'price now', { size: 11, fill: P.you, weight: 700 });
    const clusters = [[0.095, 36, 'shorts at ~10x', P.ask], [0.048, 60, 'shorts at ~20x', P.ask], [-0.045, 64, 'longs at ~20x', P.bid], [-0.09, 40, 'longs at ~10x', P.bid], [-0.02, 20, 'longs at ~40x', P.bid]];
    clusters.forEach(c => { s += F.r(P, x0 - c[1] / 2, Y(c[0]) - 5, c[1], 10, { rx: 3, fill: c[3], op: .7 }); s += F.t(P, x0 - c[1] / 2 - 10, Y(c[0]) + 4, c[2], { anchor: 'end', size: 10.5, fill: c[3], weight: 700 }); });
    s += F.l(P, x0 + 40, Y(0) - 12, x0 + 40, Y(-0.045) + 8, { stroke: P.muted, sw: 1.4, arrow: 'muted', id }); s += F.t(P, x0 + 50, Y(-0.02) + 4, 'the nearest big cluster is below: a dip there', { size: 10.5, fill: P.muted }); s += F.t(P, x0 + 50, Y(-0.02) + 18, 'forces sellers to sell, which is why price gets pulled to it', { size: 10.5, fill: P.muted });
    s += F.t(P, 20, 240, 'bar width = estimated size that would be liquidated there. Heatmaps estimate; the explorers show the real prints afterwards.', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['thesis-template'] = P => F.svg(P, 660, 150, 'A sentence template for a daily market note with four blanks: the bias, the level that holds it, the evidence from open interest and funding, and the invalidation level', id => {
    let s = '';
    const parts = [['BTC is', P.muted], ['[bias]', P.you], ['while', P.muted], ['[level]', P.you], ['holds, because', P.muted], ['[what OI and funding say]', P.you], ['. Wrong below', P.muted], ['[invalidation]', P.ask], ['.', P.muted]];
    let x = 20; parts.forEach(p => { const blank = p[0].startsWith('['); const w = p[0].length * 7.4 + (blank ? 14 : 4); if (blank) s += F.r(P, x, 42, w, 26, { rx: 7, fill: p[1] === P.ask ? P.askSoft : P.youSoft }); s += F.t(P, x + (blank ? 7 : 2), 60, p[0], { size: 13, weight: blank ? 800 : 500, fill: p[1] }); x += w + 6; if (x > 560 && p[0] === 'holds, because') { x = 20; } });
    s += F.wrap(P, 20, 108, 'example: “BTC is bullish while 76,200 holds, because OI is rising with price and funding is still near neutral. Wrong below 75,900.” One sentence, graded at 00:00 UTC.', 620, { size: 11, fill: P.muted, lh: 14 }).s;
    return s;
  });

  LESSONS['layer-6'] = {
    intro: 'Everything before this layer was mechanics: what the exchange does. This layer is judgement: forming an opinion about where price is going, in one sentence, with a level that would prove it wrong. It is deliberately modest. You are not learning to predict; you are learning to say what you think, why, and what would change your mind, and then to grade yourself every day until the habit sticks. Hyperliquid adds one unusual tool: the positions of every other trader are public.',
    legend: 'In the pictures, green and red are up and down moves or long and short crowds, blue is you or your level, amber is a reference level.',
    sections: [
      { id: 'timeframes', t: 'Timeframes: context, structure, entry',
        p: ['Start with the chart, and start with the slowest one. The **daily** chart says which way the tide is running and holds the levels the market remembers, the 00:00 UTC closes. The **4-hour** chart shows the structure: the swings, the last higher low, the place where the trend would be wrong. The **1-hour** chart shows timing, when the structure is being tested. The **5- and 15-minute** charts are for pulling the trigger and nothing else.',
          'The rule that keeps beginners out of trouble: when two timeframes disagree, the higher one wins. A perfect-looking 5-minute breakout inside a 4-hour downtrend is a 4-hour downtrend.'],
        fig: 'timeframe-stack', cap: 'Each timeframe has one job. The thesis lives on the daily and 4-hour; the 5-minute only times the click.',
        key: 'Daily for context, 4-hour for structure, 1-hour for timing, 5-minute for the click. The higher timeframe wins.' },

      { id: 'structure', t: 'Structure: higher highs, higher lows, and the invalidation',
        p: ['An uptrend is a sequence of higher highs and higher lows; a downtrend the mirror. That definition gives you the invalidation for free: an uptrend is wrong, by definition, when price closes below the most recent higher low. That level is where the stop goes, which is why Layer 4 could say “choose the stop first”: the chart chooses it for you.',
          '**Support** and **resistance** are zones, not lines, and they are zones because of Layer 0: they are prices where the book got heavy before, where a lot of orders filled and a lot of people remember their entry. Prior daily closes are the strongest of them. Draw them as bands, not lines: on BTC a zone is tens of dollars wide, far more than the one-dollar tick, because the orders that made it were spread over a range.'],
        fig: 'structure-hh-hl', cap: 'Higher highs and higher lows, with the last higher low marked. Below it the uptrend is wrong, so that is where the stop lives.',
        check: { q: 'An uptrend on the 4-hour chart. Where is the invalidation?', o: ['Below the most recent higher low', 'Below the most recent higher high', 'At the 24-hour low'], a: 0, why: 'An uptrend is higher highs and higher lows. It stops being one when price closes below the last higher low, so that is the level that proves the thesis wrong.' },
        key: 'The last higher low is the invalidation of an uptrend. The stop goes just beyond it, and sizing follows from there.' },

      { id: 'volume', t: 'Volume confirms',
        p: ['A move that happens on rising volume is a move that many people agreed to; a move on thin volume is one that a few people were able to push. The practical test is simple: when price breaks a level, look at the volume bars under the break compared with the hour before it. A break on rising volume holds more often than one on thin volume, and a break during the quietest hours of the week, a Sunday in the Asia session, is suspect until it is confirmed when the big sessions wake up.',
          'Layer 5 is the other half of this. Knowing when the book is thin tells you which breaks to distrust before the volume bar even prints.'],
        fig: 'volume-confirm', cap: 'The same level broken twice: on rising US-session volume it holds; on thin Sunday volume it fails and falls back.',
        key: 'Volume is agreement. A break on rising volume in a busy session is worth more than one on a thin weekend.' },

      { id: 'oi-matrix', t: 'The open interest matrix', try: 'oi-matrix', figDocs: 'oi-matrix',
        p: ['Layer 3 defined open interest as the total size of positions currently open. Read it together with price and it tells you who is doing what. Price up with open interest up: new longs are opening, a trend that is also a crowd forming. Price up with open interest down: shorts are covering, a rise powered by people leaving, which runs out when the covering ends. Price down with open interest up: new shorts. Price down with open interest down: longs closing or being liquidated, which is often how a move ends, because once the forced sellers are done there is nobody left to sell.',
          'Funding is the third dial. If the crowd on one side is paying a lot to stay, the move is more fragile than the chart suggests. Two cautions from the research in the media list: short-side signals are weaker than long-side ones, and open interest lags intraday, so this is a daily and 4-hour tool, not a 5-minute one.'],
        tryNote: 'Pick a price direction and an open-interest direction, then add a funding reading, and read the interpretation. Then find twenty real hours on the chart and classify them: that is the second drill.',
        key: 'Price with OI: up-up new longs, up-down covering, down-up new shorts, down-down longs leaving. Funding says how crowded the side is.' },

      { id: 'funding-tell', t: 'Funding tells you who is paying to stay',
        p: ['The funding history tab on Hyperliquid is a list of who paid whom, hour by hour. Sustained positive funding means longs have been paying for hours or days; the position is crowded and the people in it are losing a little every hour, which makes them quick to leave. Sustained negative funding is the mirror. Extreme funding in either direction is not a signal to fade on its own, but it is a reason to distrust a move in the crowded direction and to expect a violent one the other way when the crowd is forced out.',
          'Compare venues too: Coinglass shows the same coin’s funding on Hyperliquid, Binance, Bybit and OKX side by side. When every venue agrees, the crowd is everywhere; when Hyperliquid alone is extreme, the crowd is local and small.'],
        key: 'Hours of one-sided funding mean a crowd that pays to stay and leaves fast. Distrust moves in the crowded direction.' },

      { id: 'liq-clusters', t: 'Liquidation clusters: where price gets pulled',
        p: ['Leveraged positions get liquidated at predictable distances from their entries, roughly 1/leverage below for longs and above for shorts, and because people choose round leverage, those levels cluster. A cluster of long liquidations below the price is a pool of forced sellers waiting to be triggered: if price reaches it, the liquidations sell into the book and push price further, which triggers the next. That is why price so often “runs the stops” and then reverses: the forced selling finishes and the buyers were waiting underneath.',
          'Heatmaps estimate where the clusters sit from exchange data; treat them as a map of where stops are, not as a prediction. On Hyperliquid you do not have to estimate afterwards: the explorers and the trades tape show the liquidation prints as they happen, with the addresses attached.'],
        fig: 'liq-clusters', cap: 'Estimated liquidation clusters around the price. The nearest large one below pulls price toward it, because reaching it forces selling.',
        key: 'Liquidations cluster at round leverage distances. Price is drawn to the nearest cluster, and often reverses once it is cleared.' },

      { id: 'tells', t: 'Hyperliquid’s tells: what is public here',
        p: ['On a centralised exchange, positioning is a rumour. On Hyperliquid it is a table. The leaderboard shows who is making and losing money, by account. The explorer shows every fill and liquidation by address. Hypurrscan and Hyperdash show the largest open positions, their entries and their liquidation prices. Coinglass shows long-short ratios and the funding paid. All of it is free and all of it updates in real time.',
          'Use it for one thing at this stage: to see who is on the other side of a move. When price is running into a cluster and the explorer shows a handful of very large longs with liquidation prices just below it, the mechanism in the previous section is no longer a theory. The media list for this layer has every tool with a note on what it is for and what it tries to sell you.'],
        key: 'Positions, liquidations and the leaderboard are public. Use them to see who is on the other side, not to copy anyone.' },

      { id: 'thesis', t: 'The one-sentence thesis', try: 'thesis-builder', figDocs: 'thesis-template',
        p: ['Everything in this layer compresses into one sentence a day: a bias, the level that holds it, the evidence from open interest and funding, and the price that would prove it wrong. “BTC is bullish while 76,200 holds, because open interest is rising with price and funding is near neutral. Wrong below 75,900.” That is a complete thesis. Anything without the last part is content, not analysis, which is also the test the course’s [Noise filter](#noise) page applies to other people’s opinions.',
          'The drill is ten consecutive days of these, for BTC and one alt, written before the US open and graded at 00:00 UTC. Grade the reasoning, not the outcome: a well-argued note that turned out wrong is a pass; a lucky guess with no level is a fail. The sandbox builds the sentence and copies it for your notes.'],
        tryNote: 'Fill in the four blanks and copy the sentence. Ten of these in a row, graded, is the pass check for this layer.',
        key: 'Bias, level, evidence, invalidation. One sentence a day, graded on the reasoning at 00:00 UTC.' }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
