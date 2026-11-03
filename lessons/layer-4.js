/* Layer 4 · Margin, liquidation and sizing: lesson text and figures.
   Margining, Liquidations, Auto-deleveraging and Margin tiers pages, opened 3 Nov 2026. */
(function (root) {
  'use strict';
  const F = root.FigLib, FIG = root.FIG || (root.FIG = {}), LESSONS = root.LESSONS || (root.LESSONS = {});
  /* isolated liquidation distance as a fraction of entry, for a long (side 1) or short (−1): (1/L − mm) / (1 − side·mm) */
  const liqDist = (L, mm, side) => (1 / L - mm) / (1 - side * mm);

  FIG['margin-stack'] = P => F.svg(P, 660, 280, 'A notional bar with the initial margin slice at 5x and the much thinner maintenance margin floor beneath it, next to a table of maintenance margin by maximum leverage from 40x to 3x', id => {
    let s = ''; const x0 = 20, w = 360;
    s += F.t(P, x0, 24, '0.1 BTC at 77,250 = $7,725 notional, opened at 5x', { weight: 800, size: 13 });
    s += F.r(P, x0, 40, w, 30, { rx: 7, fill: P.inkSoft }); s += F.t(P, x0 + w, 88, 'notional $7,725', { anchor: 'end', size: 11, fill: P.muted });
    s += F.r(P, x0, 40, w / 5, 30, { rx: 7, fill: P.you }); s += F.t(P, x0 + 6, 59, 'initial margin', { size: 11, weight: 700, fill: P.surf }); s += F.t(P, x0, 88, '$1,545 = notional ÷ 5', { size: 11, fill: P.you, weight: 700 });
    s += F.r(P, x0, 110, w, 30, { rx: 7, fill: P.inkSoft }); s += F.r(P, x0, 110, w * 0.0125, 30, { rx: 3, fill: P.ask });
    s += F.t(P, x0 + 12, 129, 'maintenance margin $96.56 = 1.25% of notional (BTC, max 40x)', { size: 11, weight: 700, fill: P.ask });
    s += F.wrap(P, x0, 164, 'your equity in the position starts at the initial margin and moves with the mark. When it falls to the red sliver, liquidation begins. The gap between the two is your whole buffer.', 360, { size: 11, fill: P.muted, lh: 14 }).s;
    const tx = 420; s += F.t(P, tx, 24, 'maintenance margin by asset', { weight: 800, size: 12.5 });
    s += F.t(P, tx, 42, 'half the initial margin at the asset’s max leverage', { size: 10, fill: P.muted });
    const rows = [['40x', 'BTC', '1.25%'], ['25x', 'ETH', '2%'], ['20x', 'SOL, XRP', '2.5%'], ['10x', 'HYPE, most alts', '5%'], ['5x', 'some small caps', '10%'], ['3x', 'the smallest', '16.7%']];
    rows.forEach((r, i) => { const y = 66 + i * 26; s += F.t(P, tx, y, r[0], { size: 12, mono: true, weight: 700 }); s += F.t(P, tx + 44, y, r[1], { size: 11, fill: P.muted }); s += F.t(P, 640, y, r[2], { size: 12, mono: true, weight: 700, anchor: 'end', fill: P.ask }); s += F.l(P, tx, y + 8, 640, y + 8, { stroke: P.grid }); });
    s += F.t(P, tx, 236, 'you choose the leverage; the asset fixes the floor', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['cliff-static'] = P => F.svg(P, 660, 260, 'Three price rulers for the same BTC long at 5x, 10x and 20x: the entry is in the same place on each, but the liquidation marker sits 19, 8.9 and 3.8 percent below it', id => {
    let s = ''; const x0 = 90, x1 = 600; const lo = -0.25, hi = 0.05; const X = f => x0 + (f - lo) / (hi - lo) * (x1 - x0);
    s += F.t(P, 20, 24, 'a BTC long, isolated, maintenance 1.25%. Same entry, same PnL per move; different cliff.', { weight: 800, size: 12.5 });
    [[5, 60], [10, 125], [20, 190]].forEach(([L, y]) => {
      const d = liqDist(L, 0.0125, 1);
      s += F.t(P, 20, y + 4, L + 'x', { size: 14, mono: true, weight: 700 });
      s += F.l(P, x0, y, x1, y, { stroke: P.line, sw: 2 });
      s += F.r(P, X(-d), y - 9, X(0) - X(-d), 18, { rx: 5, fill: P.bidSoft });
      s += F.r(P, x0, y - 9, X(-d) - x0, 18, { rx: 5, fill: P.askSoft });
      s += F.c(P, X(0), y, 6, { fill: P.you }); s += F.t(P, X(0), y - 14, 'entry', { anchor: 'middle', size: 10, fill: P.you, weight: 700 });
      s += F.l(P, X(-d), y - 14, X(-d), y + 14, { stroke: P.ask, sw: 2.5 }); s += F.t(P, X(-d), y + 28, 'liquidation −' + (d * 100).toFixed(1) + '%', { anchor: 'middle', size: 10.5, fill: P.ask, weight: 700 });
      s += F.t(P, x1, y - 14, 'margin ' + (7725 / L).toLocaleString('en-US', { maximumFractionDigits: 0 }), { anchor: 'end', size: 10, fill: P.muted });
    });
    s += F.axis(P, x0, x1, 228, [-0.25, -0.2, -0.15, -0.1, -0.05, 0, 0.05].map(f => [X(f), (f * 100).toFixed(0) + '%']));
    s += F.t(P, x0, 256, 'distance to liquidation ≈ (1 ÷ leverage − maintenance) ÷ (1 − maintenance). At 40x it is zero.', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['cross-vs-isolated'] = P => F.svg(P, 660, 280, 'Cross margin drawn as one pool of USDC backing three positions, which one losing position can drain; isolated margin drawn as three separate buckets, where a loss empties only its own bucket', id => {
    let s = '';
    s += F.t(P, 20, 24, 'Cross: one pool backs everything', { weight: 800, size: 13 }); s += F.t(P, 350, 24, 'Isolated: a bucket per position', { weight: 800, size: 13 });
    s += F.r(P, 20, 40, 300, 60, { rx: 10, fill: P.youSoft, stroke: P.you, sw: 1.3 }); s += F.t(P, 170, 64, 'all your USDC', { anchor: 'middle', size: 12, weight: 800, fill: P.you }); s += F.t(P, 170, 82, 'plus unrealized PnL of every cross position', { anchor: 'middle', size: 10, fill: P.muted });
    ['BTC long', 'ETH short', 'SOL long'].forEach((n, i) => { const x = 20 + i * 104; s += F.l(P, x + 46, 100, x + 46, 126, { stroke: i === 2 ? P.ask : P.muted, sw: 1.4 }); s += F.r(P, x, 128, 92, 40, { rx: 8, fill: P.surf, stroke: i === 2 ? P.ask : P.line, sw: 1.3 }); s += F.t(P, x + 46, 148, n, { anchor: 'middle', size: 11.5, weight: 700 }); s += F.t(P, x + 46, 162, i === 2 ? 'losing badly' : 'fine', { anchor: 'middle', size: 10, fill: i === 2 ? P.ask : P.muted }); });
    s += F.wrap(P, 20, 194, 'the SOL loss eats the shared pool. When the whole account’s value falls below the sum of all maintenance margins, every cross position is liquidated together. Efficient, and how accounts die.', 300, { size: 10.5, fill: P.muted, lh: 13 }).s;
    ['BTC long', 'ETH short', 'SOL long'].forEach((n, i) => { const x = 350 + i * 104; s += F.r(P, x, 40, 92, 60, { rx: 10, fill: P.youSoft, stroke: P.you, sw: 1.3 }); s += F.t(P, x + 46, 64, 'its margin', { anchor: 'middle', size: 11, weight: 800, fill: P.you }); s += F.t(P, x + 46, 80, i === 2 ? 'draining' : 'untouched', { anchor: 'middle', size: 10, fill: i === 2 ? P.ask : P.muted }); s += F.l(P, x + 46, 100, x + 46, 126, { stroke: P.muted, sw: 1.4 }); s += F.r(P, x, 128, 92, 40, { rx: 8, fill: P.surf, stroke: i === 2 ? P.ask : P.line, sw: 1.3 }); s += F.t(P, x + 46, 148, n, { anchor: 'middle', size: 11.5, weight: 700 }); s += F.t(P, x + 46, 162, i === 2 ? 'liquidated alone' : 'fine', { anchor: 'middle', size: 10, fill: i === 2 ? P.ask : P.muted }); });
    s += F.wrap(P, 350, 194, 'only the SOL bucket is at risk; you can top it up or let it go. Strict isolated is the same bucket with the tap welded shut: margin cannot be removed, only released as the position closes.', 300, { size: 10.5, fill: P.muted, lh: 13 }).s;
    s += F.t(P, 20, 268, 'learn on isolated. Switch to cross only when you can say, before a trade, what every open position does to every other.', { size: 11, weight: 700 });
    return s;
  });

  FIG['liquidation-pipeline'] = P => F.svg(P, 660, 330, 'A flow from equity falling below maintenance margin, to a market order on the book, to the backstop liquidator taking the position when equity is below two thirds of maintenance, to auto-deleveraging if the account goes negative', id => {
    let s = '';
    const step = (x, y, w, h, title, lines, col) => { s += F.r(P, x, y, w, h, { rx: 10, fill: P.surf, stroke: col || P.line, sw: 1.4 }); s += F.t(P, x + 12, y + 20, title, { size: 12, weight: 800, fill: col || P.ink }); let yy = y + 36; lines.forEach(ln => { const r = F.wrap(P, x + 12, yy, ln, w - 24, { size: 10.5, fill: P.muted, lh: 13 }); s += r.s; yy += r.h; }); };
    step(20, 20, 300, 86, '1 · equity falls below maintenance margin', ['measured on the mark price, every ~3 seconds', 'cross: whole account against all positions; isolated: that bucket alone'], P.oracle);
    s += F.l(P, 170, 106, 170, 126, { stroke: P.muted, sw: 1.4, arrow: 'muted', id });
    step(20, 128, 300, 96, '2 · a market order for the whole position', ['above 100k USDC (10k on testnet): 20% slices with a 30-second cooldown', 'if enough closes to restore maintenance, the rest stays yours', 'no clearance fee'], P.ask);
    s += F.l(P, 320, 176, 350, 176, { stroke: P.muted, sw: 1.4, arrow: 'muted', id });
    step(352, 128, 290, 96, '3 · backstop, if equity < ⅔ of maintenance', ['HLP’s liquidator vault takes the position and its margin', 'the maintenance margin is not returned to you'], P.ask);
    s += F.l(P, 497, 224, 497, 244, { stroke: P.muted, sw: 1.4, arrow: 'muted', id });
    step(352, 246, 290, 70, '4 · ADL, if the account goes negative', ['profitable traders on the other side are closed against it at the previous mark'], P.ask);
    s += F.wrap(P, 20, 250, 'most liquidations end at step 2: the position is sold on the book and whatever equity is left stays in your account. Steps 3 and 4 are for markets that gap or go illiquid.', 300, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  FIG['adl-ranking'] = P => F.svg(P, 660, 240, 'Traders on the winning side ranked by profit times leverage; the top of the queue is closed first against a bankrupt position at the previous mark price', id => {
    let s = '';
    s += F.t(P, 20, 24, 'who gets auto-deleveraged first: rank = (mark ÷ entry) × (notional ÷ account value)', { weight: 800, size: 12.5 });
    const rows = [['A', 'up 18%, 20x', 1.18 * 20], ['B', 'up 9%, 10x', 1.09 * 10], ['C', 'up 25%, 3x', 1.25 * 3], ['D', 'up 2%, 2x', 1.02 * 2], ['you', 'up 4%, 5x', 1.04 * 5]];
    rows.sort((a, b) => b[2] - a[2]);
    rows.forEach((r, i) => { const y = 54 + i * 30; const w = r[2] / 24 * 420; const me = r[0] === 'you'; s += F.t(P, 20, y + 4, r[0], { size: 12, weight: 800, fill: me ? P.you : P.ink }); s += F.r(P, 60, y - 9, w, 18, { rx: 5, fill: i === 0 ? P.ask : (me ? P.you : P.inkSoft) }); s += F.t(P, 68 + w, y + 4, r[1] + '  ·  rank ' + r[2].toFixed(1), { size: 10.5, fill: P.muted }); });
    s += F.t(P, 60, 220, 'A is closed first, at the previous mark, with their profit intact up to that price. The lesson: no position, no exposure.', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['sizing-ruler'] = P => F.svg(P, 660, 250, 'A price ruler for the worked trade: entry at 77,250, the stop 2 percent below at 75,705, and the liquidation 19 percent below at about 62,600, nine and a half stop distances away', id => {
    let s = ''; const x0 = 60, x1 = 620; const lo = -0.22, hi = 0.03; const X = f => x0 + (f - lo) / (hi - lo) * (x1 - x0); const y = 120;
    s += F.t(P, 20, 24, 'account $1,000 · risk 1% = $10 · stop 2% away → notional $500 → at 5x, margin $100', { weight: 800, size: 12.5 });
    s += F.l(P, x0, y, x1, y, { stroke: P.line, sw: 2 });
    s += F.r(P, X(-0.02), y - 10, X(0) - X(-0.02), 20, { rx: 4, fill: P.youSoft });
    s += F.c(P, X(0), y, 6, { fill: P.you }); s += F.t(P, X(0), y - 18, 'entry 77,250', { anchor: 'middle', size: 10.5, fill: P.you, weight: 700 });
    s += F.l(P, X(-0.02), y - 16, X(-0.02), y + 16, { stroke: P.ink, sw: 2.5 }); s += F.t(P, X(-0.02), y + 32, 'stop −2% (75,705)', { anchor: 'middle', size: 10.5, weight: 700 }); s += F.t(P, X(-0.02), y + 46, 'you lose $10 here, on purpose', { anchor: 'middle', size: 10, fill: P.muted });
    const d = liqDist(5, 0.0125, 1);
    s += F.l(P, X(-d), y - 16, X(-d), y + 16, { stroke: P.ask, sw: 2.5 }); s += F.t(P, X(-d), y + 32, 'liquidation −' + (d * 100).toFixed(0) + '% (' + (77250 * (1 - d)).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ')', { anchor: 'middle', size: 10.5, fill: P.ask, weight: 700 }); s += F.t(P, X(-d), y + 46, 'you never get here', { anchor: 'middle', size: 10, fill: P.muted });
    s += F.l(P, X(-d), y - 36, X(-0.02), y - 36, { stroke: P.muted, sw: 1.2, arrow: 'muted', id }); s += F.l(P, X(-0.02), y - 36, X(-d), y - 36, { stroke: P.muted, sw: 1.2, arrow: 'muted', id }); s += F.t(P, (X(-d) + X(-0.02)) / 2, y - 44, (d / 0.02).toFixed(1) + '× the stop distance', { anchor: 'middle', size: 11, fill: P.muted, weight: 700 });
    s += F.axis(P, x0, x1, 200, [-0.2, -0.15, -0.1, -0.05, 0].map(f => [X(f), (f * 100).toFixed(0) + '%']));
    s += F.t(P, x0, 238, 'the rule of thumb in this course: keep the liquidation at least three stop-distances away. Here it is nine.', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['margin-tiers'] = P => F.svg(P, 640, 210, 'Margin tiers on mainnet: BTC allows 40x up to 150 million dollars of notional and 20x above; ETH 25x then 15x above 100 million; SOL 20x then 10x above 70 million; most alts 10x then 5x above 20 million', id => {
    let s = '';
    s += F.t(P, 20, 24, 'max leverage falls for very large positions (mainnet, Nov 2026)', { weight: 800, size: 12.5 });
    const rows = [['BTC', '40x up to $150M', '20x above'], ['ETH', '25x up to $100M', '15x above'], ['SOL, XRP', '20x up to $70M / $40M', '10x above'], ['HYPE and most alts', '10x up to $20M', '5x above'], ['ARB, BNB, DOT, PAXG…', '10x up to $3M', '5x above']];
    rows.forEach((r, i) => { const y = 54 + i * 26; s += F.t(P, 20, y, r[0], { size: 11.5, weight: 700 }); s += F.r(P, 200, y - 12, 240, 18, { rx: 5, fill: P.youSoft }); s += F.t(P, 210, y + 1, r[1], { size: 11, mono: true, fill: P.you, weight: 700 }); s += F.r(P, 446, y - 12, 100, 18, { rx: 5, fill: P.inkSoft }); s += F.t(P, 456, y + 1, r[2], { size: 11, mono: true }); });
    s += F.wrap(P, 20, 194, 'at learner size this never applies; it explains why a huge whale shows a lower max leverage than you. Testnet tiers are far lower (BTC 40x only to $10k) so you can see the effect for free.', 600, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  FIG['jelly-flow'] = P => F.svg(P, 660, 250, 'A simplified diagram of the JELLY incident: an attacker’s under-margined short is liquidated, the backstop inherits it, the price is pushed up so the inherited short loses, and the market is delisted and settled at a single price', id => {
    let s = '';
    const b = (x, y, w, h, title, lines, col) => { s += F.r(P, x, y, w, h, { rx: 10, fill: P.surf, stroke: col, sw: 1.4 }); s += F.t(P, x + 12, y + 20, title, { size: 12, weight: 800, fill: col }); lines.forEach((ln, i) => s += F.t(P, x + 12, y + 38 + i * 14, ln, { size: 10.5, fill: P.muted })); };
    b(20, 30, 200, 80, '1 · the attacker', ['a big JELLY short, thin margin,', 'in one account; longs elsewhere', 'on a coin with a tiny spot market'], P.ink);
    s += F.l(P, 220, 70, 250, 70, { stroke: P.muted, sw: 1.4, arrow: 'muted', id });
    b(252, 30, 180, 80, '2 · self-liquidation', ['the spot price is pushed up,', 'the short is liquidated,', 'the book cannot absorb it'], P.ask);
    s += F.l(P, 432, 70, 462, 70, { stroke: P.muted, sw: 1.4, arrow: 'muted', id });
    b(464, 30, 180, 80, '3 · backstop inherits', ['HLP’s liquidator vault now', 'holds the short, about $4M,', 'and bleeds as price rises'], P.ask);
    s += F.l(P, 554, 110, 554, 140, { stroke: P.muted, sw: 1.4, arrow: 'muted', id });
    b(300, 142, 344, 66, '4 · validators delist JELLY', ['all positions are settled at a single price, open orders cancelled;', 'the attack is unwound, and the design questions stay'], P.oracle);
    s += F.wrap(P, 20, 232, 'simplified from Arkham’s account of 26 March 2025 (linked below). The point for you: the backstop and HLP are the counterparty of last resort, and thin markets can be weaponised against them.', 620, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  LESSONS['layer-4'] = {
    intro: 'This is the layer that keeps you solvent. Everything in it follows from two numbers, your margin and the mark price, and one rule: when your equity in a position falls to a floor the asset sets, the exchange closes it for you. The second half of the layer turns that into the only sizing method this course allows: choose the stop first, size from risk, and let leverage fall out at the end.',
    legend: 'In the pictures, blue is you or your margin, red is the liquidation side, amber is a threshold or a reference.',
    sections: [
      { id: 'margin-deposit', t: 'Margin is a deposit, not a price of admission',
        p: ['When you open a position you do not pay for it; you post a deposit against it. The **initial margin** is notional ÷ leverage: 7,725 dollars of BTC at 5x needs 1,545 dollars posted. Your equity in the position is that deposit plus or minus the unrealized PnL, measured at the mark price, and it moves every three seconds.',
          'The floor is the **maintenance margin**, and it is set by the asset, not by you: half of the initial margin at the asset’s maximum leverage. BTC allows 40x, so its maintenance margin is 1.25% of notional. ETH at 25x is 2%; SOL at 20x is 2.5%; HYPE and most alts at 10x are 5%; a 3x coin is 16.7%. When your equity falls to that floor, liquidation starts.',
          'So the buffer between “opened” and “liquidated” is the gap between your initial margin and that floor. At 5x on BTC it is 20% minus 1.25% of the notional. At 40x it is zero: you open on the floor.'],
        fig: 'margin-stack', cap: 'The initial margin you post, the maintenance margin the asset requires, and the table of floors by maximum leverage.',
        key: 'Initial margin = notional ÷ your leverage. Maintenance margin = half the initial margin at the asset’s max leverage. The gap is your buffer.' },

      { id: 'cliff', t: 'The cliff: leverage changes the distance, not the profit', try: 'cliff-explorer', figDocs: 'cliff-static',
        p: ['Layer 1 showed that a 1% move is worth the same dollars at any leverage. Here is what leverage does change. On an isolated BTC long, the liquidation price is roughly (1 ÷ leverage − 1.25%) ÷ (1 − 1.25%) below the entry: about 19% at 5x, 9% at 10x, 3.8% at 20x, and nothing at all at 40x. Leverage moves the cliff closer. It does not change the slope of the ground.',
          'For a short the cliff is above the entry and slightly closer: (1 ÷ leverage − maintenance) ÷ (1 + maintenance). The first drill is a 10x short on a 10x alt, where the maintenance margin is 5%: it liquidates about 4.8% above the entry, while a 10x long on the same coin would liquidate about 5.3% below. Work the number out before you place the drill, then watch the exchange agree with you.',
          'The exchange checks your leverage only when you open or add. After that, nothing stops a position from drifting toward the floor; you are expected to watch it yourself. On an isolated position you can add margin, which pushes the liquidation away; on cross you can deposit, which does the same for every position at once.',
          'Drag the sliders: pick a leverage, then move the price. Watch the equity bar drain toward the floor and the PnL number stay honest.'],
        tryNote: 'The liquidation price is computed with the docs’ formula for an isolated position. Set the leverage, then walk the price down and see where the bar hits the floor.',
        check: { q: 'You open a BTC long at 10x, isolated. Roughly how far below your entry is the liquidation price?', o: ['About 1%', 'About 9%', 'About 19%'], a: 1, why: '(1/10 − 0.0125) ÷ (1 − 0.0125) is 8.9%. At 5x it would be 19%, at 20x 3.8%.' },
        key: 'Liquidation distance ≈ (1/leverage − maintenance) ÷ (1 − maintenance) below the entry for a long, ÷ (1 + maintenance) above it for a short. Leverage moves the cliff; it does not change the profit on a move.' },

      { id: 'cross-isolated', t: 'Cross, isolated and strict isolated',
        p: ['**Cross** margin, the default, backs every cross position with your whole account: all your USDC plus the unrealized PnL of every other cross position. It is capital-efficient and it is how accounts die, because one position going badly wrong can drag every other one into a single liquidation.',
          '**Isolated** margin gives a position its own bucket. Only the margin you assigned to it is at risk, a liquidation touches only that position, and you can add or remove margin from the bucket while it is open. **Strict isolated**, a newer mode, is the same bucket with the tap welded shut: margin can only leave as the position closes.',
          'A detail that confuses people in cross: when you close a winning position, its margin may not appear in your available balance if another cross position is under water and needs it. The money is still yours; it is just already working.'],
        fig: 'cross-vs-isolated', cap: 'One pool against three positions, or three buckets. In cross, a bad SOL trade can take the BTC and ETH positions with it.',
        key: 'Learn on isolated: one bucket per position, one liquidation at a time, and the margin you did not assign is never at risk.' },

      { id: 'liquidation-run', t: 'How a liquidation actually runs',
        p: ['Liquidation is a sequence, not a single event, and all of it runs on the mark price. First, when equity falls below the maintenance margin, the exchange sends a market order for the whole position into the book. For positions above 100,000 USDC (10,000 on testnet) it sends 20% slices with a 30-second cooldown. If enough is closed to restore the maintenance requirement, the rest of the position and whatever equity remains stay with you. There is no clearance fee: unlike some exchanges, nothing extra is charged for being liquidated.',
          'Second, if the book cannot do the job and equity falls below two thirds of the maintenance margin, the **backstop liquidator**, a strategy inside the HLP vault, takes over the position together with its margin. In that case the maintenance margin is not returned. In cross, every cross position and the cross margin go together; in isolated, only that bucket.',
          'Third, if even that leaves the account negative, auto-deleveraging closes profitable traders on the other side against it, which the next section explains. On liquid markets at learner size you will only ever see the first step, which is the point of the first drill: let a 20-dollar testnet short get liquidated and read what came back.'],
        fig: 'liquidation-pipeline', cap: 'The three stages. Almost every real liquidation ends at stage two with the leftover equity still in your account.',
        key: 'Below maintenance: market order. Below two thirds of maintenance: the backstop takes the position and margin. Below zero: ADL.' },

      { id: 'backstop-adl', t: 'ADL: you can be closed while winning',
        p: ['**Auto-deleveraging** is the last resort that keeps the exchange free of bad debt. When an account goes negative and the backstop cannot absorb it, the exchange looks at the traders on the opposite side of that market, ranks them by how much profit they are sitting on and how much leverage they are using (the docs’ formula multiplies mark ÷ entry by notional ÷ account value, so a big unrealised gain at high leverage ranks first), and closes the top of the list against the bankrupt position at the previous mark price.',
          'If you are the most profitable, most levered long on the day a big short blows up, your long is closed for you, at a price you did not choose, with the profit up to that price intact. Nothing was done wrong; it is the cost of there being no clearing house. Two consequences for you: a very profitable, highly levered position is more exposed to ADL than a modest one, and a trader with no open position can never have anyone else’s losses passed to them.'],
        fig: 'adl-ranking', cap: 'The ADL queue: the trader with the highest profit times leverage is closed first, at the previous mark.',
        key: 'ADL closes the most profitable, most levered traders on the other side at the previous mark. No position means no exposure.' },

      { id: 'withdraw-profit', t: 'Taking profit out: the 10% rule',
        p: ['Unrealized profit in a cross account, or in an isolated bucket, becomes usable margin at once, but moving it out is restricted. You can withdraw, transfer to spot, or pull margin from an isolated position only if what remains is at least the larger of the initial margin requirement and 10% of the total notional of your open positions. In practice: a 20x position cannot have its paper profit withdrawn until it is reduced, because 10% of notional is twice its initial margin. A worked number: a 1,000-dollar account holding 10,000 dollars of notional at 10x must keep max(1,000, 1,000) = 1,000 dollars in the account, which is all of it, so nothing comes out until the position shrinks.',
          'This is also why the docs call entry price and PnL front-end conveniences. The thing the exchange actually tracks is margin against mark, and this rule is one of the places you feel it.'],
        key: 'Profit comes out only while remaining margin is at least max(initial margin, 10% of open notional).' },

      { id: 'size-from-risk', t: 'Size from risk, not from leverage', try: 'risk-sizer',
        p: ['Everything above is defensive. Here is the method that makes it almost never matter. Before a trade, choose the **stop**: the price at which the idea is wrong (Layer 6 is about finding it). Decide the **risk**: the dollars you are willing to lose if the stop is hit, 0.5% to 1% of the account in this course. Then the size is forced: notional = risk ÷ stop distance. A 1,000-dollar account risking 1% with a stop 2% away trades 500 dollars of notional, whatever the coin and whatever the leverage.',
          'Only now does leverage enter, and only as a choice of how much margin to post against that fixed notional. Pick a leverage that keeps the liquidation price at least three stop-distances away, so that the stop, not the exchange, is what closes a losing trade. The sizer below does the arithmetic and draws the ruler; the [Tools page](#tools) has the same calculator without the drawing.'],
        tryNote: 'Change the stop distance and watch the notional change. Change the leverage and watch only the margin and the liquidation move. The verdict turns red when the liquidation is closer than three stops.',
        check: { q: 'Account $2,000, risk 0.5%, stop 4% away. What notional do you trade?', o: ['$250', '$500', '$1,000'], a: 0, why: 'Risk is $10. $10 ÷ 4% = $250 of notional. Leverage has not entered the calculation yet.' },
        key: 'Stop first. Risk = 0.5% to 1% of the account. Notional = risk ÷ stop distance. Leverage is an output, and it must keep the liquidation three stops away.' },

      { id: 'worked-trade', t: 'A worked trade, on the ruler',
        p: ['Account 1,000 dollars. Risk 1%, so 10 dollars. BTC at 77,250; the stop sits 2% below at 75,705. Notional = 10 ÷ 0.02 = 500 dollars, which is 0.00647 BTC. At 5x isolated that is 100 dollars of margin. The liquidation price is about 19% below the entry, at roughly 62,600, which is nine and a half stop-distances away. If the stop is hit you lose 10 dollars and 400 dollars of margin come home untouched. If BTC fell 19% without your stop firing, something else has gone very wrong.',
          'Now the same idea sized the way most beginners do it, from the slider: 100 dollars of margin at 20x is 2,000 dollars of notional. The same 2% stop now costs 40 dollars, four times the plan, and the liquidation sits 3.8% away, less than two stops. One stop distance of noise and the exchange closes the trade before the idea had a chance.'],
        fig: 'sizing-ruler', cap: 'Entry, stop and liquidation on one ruler for the worked trade. The stop is where you lose on purpose; the liquidation is where you never go.',
        key: 'Same account, same idea: sized from risk it costs $10 and has nine and a half stops of room; sized from the slider it costs $40 and has less than two.' },

      { id: 'margin-tiers', t: 'Margin tiers for big positions',
        p: ['One more thing you will see in the header: the maximum leverage for some assets falls as a position gets very large. BTC allows 40x up to 150 million dollars of notional and 20x above it; ETH 25x then 15x above 100 million; SOL 20x then 10x above 70 million; most alts 10x then 5x above 20 million. The maintenance margin steps up with it, in a way the docs define so that the total is continuous.',
          'At learner size this never applies. It is here so that a lower-than-expected max leverage on a whale’s position, or on testnet, where the tiers are deliberately tiny, does not confuse you.'],
        fig: 'margin-tiers', cap: 'Mainnet margin tiers in November 2026. Testnet tiers kick in at a few thousand dollars so you can watch the effect.',
        key: 'Very large positions get lower max leverage and higher maintenance margin. Irrelevant at your size; visible on testnet.' },

      { id: 'jelly', t: 'The JELLY case: liquidation as a weapon',
        p: ['In March 2025 a trader used the liquidation machine itself as the attack. They opened a large short on JELLY, a thin coin, with deliberately thin margin, and longs in other accounts, then pushed the coin’s price up on the small spot market. The short was liquidated, the book could not absorb it, and the backstop, which is HLP, inherited a short of around four million dollars that lost more with every tick higher. The validators delisted the market and settled every position at a single price, unwinding the attack and starting an argument about who should be able to do that.',
          'For you the case is a map of Layer 4 with real names: the floor, the market order that failed, the backstop that took over, and the vault whose depositors were on the hook. It is also why the course keeps you on validator-run, deep markets, and leaves thin coins and HIP-3 markets until Layer 7’s journal shows two blocks of twenty trades that were both profitable and traded to plan. Arkham’s forensic write-up is linked in the media list below.'],
        fig: 'jelly-flow', cap: 'The JELLY incident, simplified. The backstop is the counterparty of last resort, and a thin market can be aimed at it.',
        key: 'The backstop can be targeted. Trade deep markets until your plan has a track record, and know that HLP is who takes over when a book fails.' }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
