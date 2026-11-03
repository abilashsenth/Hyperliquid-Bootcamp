/* Layer 1 · Perpetuals: lesson text and figures.
   Formulas from the Entry price and PnL, Margining and Perpetual assets pages, opened 3 Nov 2026. */
(function (root) {
  'use strict';
  const F = root.FigLib, FIG = root.FIG || (root.FIG = {}), LESSONS = root.LESSONS || (root.LESSONS = {});

  FIG['spot-future-perp'] = P => F.svg(P, 660, 270, 'Three rows: spot, where you own the coin now; a dated future, whose price converges to spot at expiry; and a perp, which never expires and is held near spot by hourly funding', id => {
    let s = ''; const x0 = 150, x1 = 630;
    const row = (y, name, sub) => { s += F.t(P, 20, y - 2, name, { weight: 800, size: 14 }); s += F.t(P, 20, y + 15, sub, { size: 11, fill: P.muted }); };
    row(60, 'Spot', 'you own the coin');
    s += F.c(P, x0 + 20, 60, 14, { fill: P.oracleSoft, stroke: P.oracle, sw: 1.5 }); s += F.t(P, x0 + 20, 64, '1', { anchor: 'middle', size: 11, weight: 800, fill: P.oracle });
    s += F.t(P, x0 + 46, 58, 'one BTC in your wallet. Its price is whatever the market says today.', { size: 11.5, fill: P.muted });
    s += F.t(P, x0 + 46, 74, 'nothing to roll, nothing to settle, no leverage, no funding.', { size: 11.5, fill: P.muted });
    row(140, 'Dated future', 'a contract with an end date');
    s += F.l(P, x0, 150, x1, 150, { stroke: P.oracle, sw: 1.5, dash: '4 4' }); s += F.t(P, x1, 146, 'spot', { anchor: 'end', size: 10.5, fill: P.oracle });
    s += F.p(P, `M${x0} 118 C ${x0 + 150} 118, ${x0 + 300} 140, ${x1 - 80} 150`, { stroke: P.ink, sw: 2 });
    s += F.l(P, x1 - 80, 104, x1 - 80, 166, { stroke: P.muted, sw: 1.2 }); s += F.t(P, x1 - 80, 178, 'expiry: settles at spot', { anchor: 'middle', size: 10.5, fill: P.muted });
    s += F.l(P, x0 + 40, 122, x0 + 40, 150, { stroke: P.you, sw: 1.2, arrow: 'you', id }); s += F.t(P, x0 + 48, 166, 'basis: the gap to spot, shrinks to zero by the date', { size: 10.5, fill: P.you });
    row(230, 'Perp', 'a future with no date');
    s += F.l(P, x0, 240, x1, 240, { stroke: P.oracle, sw: 1.5, dash: '4 4' }); s += F.t(P, x1, 236, 'spot', { anchor: 'end', size: 10.5, fill: P.oracle });
    s += F.p(P, `M${x0} 232 C ${x0 + 60} 220, ${x0 + 110} 252, ${x0 + 170} 236 S ${x0 + 290} 228, ${x0 + 340} 246 S ${x0 + 440} 232, ${x1} 238`, { stroke: P.ink, sw: 2 });
    [x0 + 60, x0 + 230, x0 + 395].forEach((x, i) => { const up = i !== 1; s += F.l(P, x, up ? 212 : 268, x, up ? 230 : 250, { stroke: P.muted, sw: 1.2, arrow: 'muted', id }); });
    s += F.t(P, x0 + 70, 212, 'funding, every hour, nudges it back toward spot', { size: 10.5, fill: P.muted });
    s += F.t(P, x1, 266, 'no expiry: it runs forever', { anchor: 'end', size: 10.5, fill: P.muted });
    return s;
  });

  FIG['tether'] = P => F.svg(P, 640, 230, 'A perp price wandering above and below the spot price; while it is above, funding is positive and longs pay shorts, while it is below, shorts pay longs', id => {
    let s = ''; const x0 = 30, x1 = 610, y = 120;
    /* the perp path, sampled, so the regions above and below spot can be shaded separately */
    const pts = []; for (let x = x0; x <= x1; x += 4) { const u = (x - x0) / (x1 - x0); pts.push([x, y - 34 * Math.sin(u * Math.PI * 1.55 + 0.35) * (0.6 + 0.4 * Math.cos(u * 3))]); }
    const above = pts.map(q => [q[0], Math.min(q[1], y)]), below = pts.map(q => [q[0], Math.max(q[1], y)]);
    s += F.poly(P, above.concat([[x1, y], [x0, y]]), { fill: P.askSoft, closed: true });
    s += F.poly(P, below.concat([[x1, y], [x0, y]]), { fill: P.bidSoft, closed: true });
    s += F.l(P, x0, y, x1, y, { stroke: P.oracle, sw: 2, dash: '5 4' });
    s += F.poly(P, pts, { stroke: P.ink, sw: 2.2 });
    s += F.t(P, x1, y - 8, 'spot (oracle)', { anchor: 'end', size: 11, fill: P.oracle, weight: 700 });
    s += F.t(P, 70, 70, 'perp above spot: funding is positive, longs pay shorts, being long gets expensive', { size: 11.5, fill: P.ask, weight: 700 });
    s += F.t(P, 300, 185, 'perp below spot: funding is negative, shorts pay longs', { size: 11.5, fill: P.bid, weight: 700 });
    s += F.t(P, x0, 212, 'the payment is the tether. It never forces the price; it pays people to push it back.', { size: 11.5, fill: P.muted });
    return s;
  });

  FIG['long-short-mirror'] = P => F.svg(P, 640, 260, 'Profit and loss of a long and a short on 0.1 BTC against the price, two straight lines crossing at the entry: the long gains 772 dollars at plus ten percent, the short loses the same, and the reverse at minus ten percent', id => {
    let s = ''; const cx = 320, cy = 130, w = 240, h = 90;
    s += F.l(P, cx - w - 20, cy, cx + w + 20, cy, { stroke: P.line, sw: 1.5 }); s += F.l(P, cx, cy - h - 20, cx, cy + h + 20, { stroke: P.line, sw: 1.5 });
    s += F.l(P, cx - w, cy + h, cx + w, cy - h, { stroke: P.bid, sw: 2.5 }); s += F.l(P, cx - w, cy - h, cx + w, cy + h, { stroke: P.ask, sw: 2.5 });
    s += F.c(P, cx, cy, 5, { fill: P.you });
    s += F.t(P, cx + 8, cy + 16, 'entry 77,250', { size: 11, mono: true, fill: P.you, weight: 700 });
    s += F.t(P, cx + w + 20, cy + 16, '+10%', { anchor: 'end', size: 11, mono: true, fill: P.muted }); s += F.t(P, cx - w - 20, cy + 16, '−10%', { size: 11, mono: true, fill: P.muted });
    s += F.t(P, cx + w - 4, cy - h - 6, 'long: +$772', { anchor: 'end', size: 12, weight: 800, fill: P.bid }); s += F.t(P, cx + w - 4, cy + h + 16, 'short: −$772', { anchor: 'end', size: 12, weight: 800, fill: P.ask });
    s += F.t(P, cx - w + 4, cy - h - 6, 'short: +$772', { size: 12, weight: 800, fill: P.ask }); s += F.t(P, cx - w + 4, cy + h + 16, 'long: −$772', { size: 12, weight: 800, fill: P.bid });
    s += F.t(P, cx, 24, 'PnL on 0.1 BTC, by price', { anchor: 'middle', size: 12, fill: P.muted, weight: 700 });
    s += F.t(P, cx, 252, 'same slope, opposite sign. Nothing is borrowed either way; both just post margin.', { anchor: 'middle', size: 11.5, fill: P.muted });
    return s;
  });

  FIG['notional-stack'] = P => F.svg(P, 660, 250, 'Three bars for the same 0.1 BTC position worth 7,725 dollars at 1x, 5x and 20x leverage; the bar is the same length each time, only the margin slice shrinks', id => {
    let s = ''; const x0 = 150, w = 460;
    s += F.t(P, 20, 28, 'The same position, 0.1 BTC at 77,250 = $7,725 notional', { weight: 800, size: 14 });
    [[1, 60, '$7,725'], [5, 110, '$1,545'], [20, 160, '$386']].forEach(([lev, y, m]) => {
      s += F.t(P, 20, y + 19, lev + 'x', { weight: 800, size: 14, mono: true });
      s += F.r(P, x0, y, w, 28, { rx: 7, fill: P.inkSoft });
      const sliceW = w / lev;
      s += F.r(P, x0, y, sliceW, 28, { rx: 7, fill: P.you });
      if (sliceW > 100) s += F.t(P, x0 + 8, y + 18, 'margin ' + m, { size: 11.5, weight: 700, fill: P.surf });
      else s += F.t(P, x0 + sliceW + 8, y + 18, 'margin ' + m, { size: 11.5, weight: 700, fill: P.you });
      s += F.t(P, x0 + w, y + 18, 'notional $7,725', { anchor: 'end', size: 11.5, fill: P.muted });
    });
    s += F.t(P, 20, 216, 'a 1% move is $77.25 in every row. What changes is the deposit, and how far away the liquidation sits (Layer 4).', { size: 11.5, fill: P.muted });
    s += F.t(P, 20, 236, 'leverage = notional ÷ margin. On Hyperliquid it is a whole number from 1 to the asset’s maximum, 3x to 40x.', { size: 11.5, fill: P.muted });
    return s;
  });

  FIG['entry-avg-static'] = P => F.svg(P, 640, 230, 'Four fills in a table: three opening buys move the entry price to their size-weighted average, 77,062.5, and a closing sell leaves it unchanged while realising 8.75 dollars before fees', id => {
    let s = '';
    const head = ['fill', 'kind', 'position after', 'entry after', 'closed PnL'];
    const cols = [20, 220, 300, 430, 540];
    head.forEach((h, i) => s += F.t(P, cols[i], 24, h, { size: 10.5, fill: P.muted, weight: 700 }));
    const rows = [['buy 0.01 @ 77,250', 'opening', '0.01 long', '77,250.0', ''], ['buy 0.01 @ 78,000', 'opening', '0.02 long', '77,625.0', ''], ['buy 0.02 @ 76,500', 'opening', '0.04 long', '77,062.5', ''], ['sell 0.02 @ 77,500', 'closing', '0.02 long', '77,062.5', '+$8.75, less fee']];
    rows.forEach((rw, i) => { const y = 54 + i * 34; s += F.l(P, 20, y - 20, 620, y - 20, { stroke: P.grid, sw: 1 }); rw.forEach((c, k) => s += F.t(P, cols[k], y, c, { size: 12, mono: k !== 1, fill: k === 3 ? (i === 3 ? P.you : P.ink) : (k === 1 ? P.muted : P.ink), weight: k === 3 ? 700 : 500 })); });
    s += F.t(P, 20, 196, '77,062.5 = (0.01 × 77,250 + 0.01 × 78,000 + 0.02 × 76,500) ÷ 0.04', { size: 11.5, mono: true, fill: P.muted });
    s += F.t(P, 20, 218, 'the closing sell does not touch the entry price; it only turns part of the position into closed PnL', { size: 11.5, fill: P.you, weight: 700 });
    return s;
  });

  FIG['pnl-formula'] = P => F.svg(P, 640, 210, 'The two PnL formulas as boxes with a worked example: unrealized PnL equals side times mark minus entry times size, closed PnL adds the fee', id => {
    let s = '';
    s += F.t(P, 20, 28, 'unrealized PnL', { weight: 800, size: 14 });
    const b = (x, y, w, label, val, col) => { s += F.r(P, x, y, w, 46, { rx: 9, fill: P.surf, stroke: col || P.line, sw: 1.3 }); s += F.t(P, x + w / 2, y + 18, label, { anchor: 'middle', size: 10.5, fill: P.muted }); s += F.t(P, x + w / 2, y + 37, val, { anchor: 'middle', size: 13, mono: true, weight: 700, fill: col || P.ink }); };
    b(20, 42, 90, 'side', '+1 (long)', P.you); s += F.t(P, 120, 72, '×', { size: 16, anchor: 'middle' });
    b(130, 42, 110, 'mark', '78,000'); s += F.t(P, 250, 72, '−', { size: 16, anchor: 'middle' });
    b(260, 42, 110, 'entry', '77,062.5'); s += F.t(P, 380, 72, '×', { size: 16, anchor: 'middle' });
    b(390, 42, 90, 'size', '0.02'); s += F.t(P, 490, 72, '=', { size: 16, anchor: 'middle' });
    b(500, 42, 120, 'unrealized', '+$18.75', P.bid);
    s += F.t(P, 20, 122, 'closed PnL on a closing fill', { weight: 800, size: 14 });
    s += F.t(P, 20, 148, 'closed PnL = side × (fill price − entry) × size closed − fee', { size: 12.5, mono: true });
    s += F.t(P, 20, 170, 'sell 0.02 at 77,500 as a taker: (77,500 − 77,062.5) × 0.02 − $0.70 fee = +$8.05', { size: 12, mono: true, fill: P.muted });
    s += F.t(P, 20, 196, 'mark, not the last trade, feeds the unrealized number. That is why it can move while the book does not.', { size: 11.5, fill: P.muted });
    return s;
  });

  FIG['quanto'] = P => F.svg(P, 620, 150, 'Two rulers slightly offset: the oracle quotes BTC in USDT at 77,241, your collateral is USDC, and no conversion is applied between them', id => {
    let s = '';
    s += F.t(P, 20, 26, 'what the oracle quotes', { size: 11, fill: P.muted, weight: 700 }); s += F.r(P, 20, 34, 280, 30, { rx: 8, fill: P.oracleSoft }); s += F.t(P, 160, 54, 'BTC = 77,241.0 USDT', { anchor: 'middle', size: 13, mono: true, weight: 700, fill: P.oracle });
    s += F.t(P, 340, 26, 'what you post and receive', { size: 11, fill: P.muted, weight: 700 }); s += F.r(P, 340, 34, 260, 30, { rx: 8, fill: P.youSoft }); s += F.t(P, 470, 54, 'USDC, 1 for 1', { anchor: 'middle', size: 13, mono: true, weight: 700, fill: P.you });
    s += F.l(P, 300, 49, 340, 49, { stroke: P.muted, sw: 1.2, dash: '3 3' });
    s += F.t(P, 20, 96, 'USDT and USDC usually trade within a few hundredths of a percent of each other,', { size: 11.5, fill: P.muted });
    s += F.t(P, 20, 114, 'and the exchange does not convert. So the mark can sit a few dollars from the USD price elsewhere.', { size: 11.5, fill: P.muted });
    s += F.t(P, 20, 138, 'Normal, permanent, not a signal. HYPE and PURR perps are the exception: quoted in USDC directly.', { size: 11.5, fill: P.muted });
    return s;
  });

  LESSONS['layer-1'] = {
    intro: 'Layer 0 was the machine that matches buyers and sellers. This layer is about what, exactly, you are buying and selling on Hyperliquid: not coins, but contracts whose price follows a coin. Four ideas carry the whole layer: a perp is a future that never settles, long and short are mirror images, leverage changes your deposit and not your profit, and the entry price is an average of your opening fills.',
    legend: 'In the pictures, amber is spot or the oracle (the outside world’s price), white is the perp price, blue is you.',
    sections: [
      { id: 'three-ways', t: 'Three ways to own a price',
        p: ['There are three ways to be exposed to the price of bitcoin. **Spot**: you buy the coin and hold it. The price is whatever the market says, you can never lose more than you paid, and there is nothing to maintain.',
          'A **dated future** is a contract to settle on a date. Its price floats above or below spot, and the gap, called the **basis**, must shrink to zero by expiry because on that day the contract and the coin are the same thing. Futures let you take a position without holding the coin, and in either direction.',
          'A **perpetual future**, a perp, is a future with the date removed. Nothing ever settles, so nothing forces its price back to spot. Instead there is an hourly payment between the people holding longs and the people holding shorts, called **funding**, that pays whichever side is needed to push the price back toward spot. Layer 3 does the arithmetic; for now the shape is enough.'],
        fig: 'spot-future-perp', cap: 'Spot is ownership. A dated future converges to spot by its date. A perp never converges on its own, so funding keeps it tethered.',
        key: 'A perp is a futures contract that never settles. Funding replaces expiry, and everything odd about perps follows from that one substitution.' },

      { id: 'tether', t: 'Why a perp needs funding',
        p: ['Imagine the perp trading at 77,500 while bitcoin itself sits at 77,000. Nothing in the contract makes that gap close: there is no expiry day on which the two must meet. So the exchange charges the longs and pays the shorts, every hour, in proportion to how far above spot the perp sits. Holding the long now costs money, holding the short earns it, and people respond: longs close, shorts open, and the perp drifts back down.',
          'When the perp is below spot the sign flips and shorts pay longs. The payment is never large in one hour, but it is relentless, and over days it is often the biggest cost in a trade that goes nowhere.'],
        fig: 'tether', cap: 'Above spot, longs pay. Below spot, shorts pay. The payment goes peer to peer; the exchange keeps none of it.',
        key: 'Funding is a price for being on the crowded side. It does not force the perp to spot; it pays people to push it there.' },

      { id: 'mirror', t: 'Long and short are mirror images',
        p: ['A **long** profits when the price rises and loses when it falls. A **short** is the same contract with the sign flipped: it profits when the price falls. On a perp nothing is borrowed or lent to go short; both sides simply post margin and the exchange keeps score between them.',
          'This matters more than it sounds. On spot, “selling” means you no longer have a position. On a perp, selling when you are flat opens a short, which is a position with risk in the other direction. The order form says Sell / Short for exactly that reason.'],
        fig: 'long-short-mirror', cap: 'The same 0.1 BTC position as a long and as a short. Every dollar one makes, the other loses.',
        check: { q: 'You are flat and you press Sell / Short for 0.1 BTC. What do you have?', o: ['Nothing: you had no position to sell', 'A short position that profits if the price falls', 'An error, because you cannot sell what you do not own'], a: 1, why: 'On a perp, selling while flat opens a short. Nothing is borrowed; you post margin and gain as the price falls.' },
        key: 'A short is a position whose PnL rises as the price falls. On a perp, selling while flat opens one.' },

      { id: 'notional', t: 'Notional, margin, leverage', try: 'leverage-explorer', figDocs: 'notional-stack',
        p: ['Three numbers describe every position. **Notional** is the full size of the exposure: size × price, so 0.1 BTC at 77,250 is a 7,725-dollar position whatever you paid for it. **Margin** is the deposit you post to hold it. **Leverage** is the ratio of the two: notional ÷ margin.',
          'On Hyperliquid you choose leverage as a whole number from 1 up to the asset’s maximum, which ranges from 3x to 40x depending on the coin (BTC 40x, ETH 25x, SOL 20x, HYPE and most alts 10x in November 2026). The exchange checks the leverage only when you open or add to a position; after that, your margin and the mark price do the talking.',
          'Here is the thing newcomers get backwards. Leverage does not change how much you make on a move. A 1% move on a 7,725-dollar position is 77.25 dollars at 1x, at 5x and at 20x. What leverage changes is how much of your own money is behind the position, and therefore how small a move wipes that money out. Drag the sliders and watch the PnL column refuse to change.'],
        tryNote: 'Change the leverage and watch which numbers move. Profit and loss depend only on size and the price move; margin and return on margin depend on leverage.',
        key: 'Leverage is notional ÷ margin. It sets your deposit and your distance to the cliff, not your profit on a move.' },

      { id: 'entry', t: 'Entry price: the average of your opening fills', try: 'entry-avg', figDocs: 'entry-avg-static',
        p: ['A position is usually built from several fills, often at several prices. The exchange keeps one number for it: the **entry price**, the size-weighted average of every fill that opened or added to the position.',
          'The rule has two halves. A fill that increases the position (buying when long, selling when short) is an **opening** fill and moves the entry price toward its own price, weighted by size. A fill that shrinks the position is a **closing** fill and leaves the entry price exactly where it was; its profit or loss becomes closed PnL instead.',
          'So adding to a winner raises your entry, adding to a loser lowers it, and taking profit changes nothing about the fills that remain. The sandbox lets you press fills in any order and watch the number.'],
        tryNote: 'Press the fills in any order. Opening fills move the entry; the closing fill does not.',
        check: { q: 'You are long 0.02 BTC with an entry of 77,062.5. You sell 0.01 at 78,000. Your entry price is now:', o: ['77,531.25, the new average', '77,062.5, unchanged', '78,000, the last fill'], a: 1, why: 'Closing fills never touch the entry price. The 0.01 you sold realises (78,000 − 77,062.5) × 0.01 as closed PnL, and the remaining 0.01 keeps its entry of 77,062.5.' },
        key: 'Opening fills move the entry price toward themselves, weighted by size. Closing fills never touch it.' },

      { id: 'pnl', t: 'PnL, unrealized and closed',
        p: ['**Unrealized PnL** is what the position would be worth if closed at the current mark price: side × (mark − entry) × size, with side +1 for a long and −1 for a short. It uses the **mark price** (Layer 3), not the last trade, which is why the number can tick while the book is quiet.',
          '**Closed PnL** is booked on each closing fill: side × (fill price − entry) × the size closed, minus the fee. On an opening fill nothing is realised yet, so closed PnL is just the fee, shown as a small negative number before the price has moved at all.',
          'Hyperliquid’s docs say something worth remembering: entry price, unrealized PnL and closed PnL are conveniences computed by the front end. The accounting that matters, the thing that can liquidate you, is margin against the mark price, and Layer 4 is about that.'],
        fig: 'pnl-formula', cap: 'The two formulas with the numbers from the previous section. The 70-cent fee is the taker rate on a 1,550-dollar fill.',
        key: 'Unrealized PnL = side × (mark − entry) × size. Closed PnL includes the fee, so a fresh position starts slightly negative.' },

      { id: 'quanto', t: 'USDC in, USDT prices: the tiny permanent gap',
        p: ['Your collateral is USDC, but the oracle that prices most perps is built from spot markets on other exchanges that are quoted in USDT, and the exchange applies no conversion between the two. In the jargon this makes the contracts **quanto**: priced in one unit, settled in another.',
          'In practice it means the mark price you see can sit a few dollars from the dollar price on a USD venue, permanently, because USDT and USDC rarely trade at exactly one to one. It is not an arbitrage, it is not a bug, and it is not a signal. HYPE and PURR are quoted in USDC directly and do not have the gap.'],
        fig: 'quanto', cap: 'The oracle speaks USDT, the collateral is USDC, and nothing converts between them.',
        key: 'Prices are USDT, collateral is USDC, and the small permanent gap between mark and the USD price elsewhere is normal.' },

      { id: 'why-perps', t: 'Why perps took over crypto',
        p: ['Dated futures need rolling: every quarter you close one contract and open the next, paying fees and spread each time. A perp needs nothing. One contract per asset means one deep book instead of several shallow ones. Leverage is symmetric, so going short is as easy as going long. And the market never closes.',
          'The cost of all that convenience is the funding payment and the margin engine, which is why the next three layers exist. A trader who understands those two things has understood perps; the rest is practice.'],
        key: 'No expiry to roll, one book per asset, leverage both ways, 24/7. The price of that is funding and liquidation, which are Layers 3 and 4.' },

      { id: 'on-paper', t: 'The drill, on paper first',
        p: ['Before you touch testnet, do the arithmetic the first drill asks for, by hand, with the prices of the day. Here it is with the November 2026 prices in this lesson:'],
        list: ['**0.01 BTC long at 77,250, 3x.** Notional = 0.01 × 77,250 = $772.50. Margin = 772.50 ÷ 3 = $257.50. At +1% (78,022.5) the unrealized PnL is +$7.73; at −1% it is −$7.73.',
          '**0.5 SOL short at 162.34, 3x.** Notional = 0.5 × 162.34 = $81.17. Margin = $27.06. At +1% the short shows −$0.81; at −1% it shows +$0.81.',
          '**Add to the BTC long:** buy another 0.01 at 78,000. New entry = (0.01 × 77,250 + 0.01 × 78,000) ÷ 0.02 = 77,625. Close 0.01 later and the entry stays 77,625.'],
        p2: ['Now open the same positions on testnet, cover the position panel with your hand, and compare. If your numbers match to the cent, the pass check for this layer is honest.'],
        key: 'Notional, margin, entry and PnL from the fills alone, before looking at the panel. That is the whole layer.' }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
