/* Layer 2 · The Hyperliquid machine: lesson text and figures.
   Order types, TP/SL rules, TWAP and chase details, fees and onboarding from the docs pages opened 3 Nov 2026. */
(function (root) {
  'use strict';
  const F = root.FigLib, FIG = root.FIG || (root.FIG = {}), LESSONS = root.LESSONS || (root.LESSONS = {});

  FIG['core-evm'] = P => F.svg(P, 640, 250, 'One chain with two halves: HyperCore holds the order books, margin engine, spot, staking and vaults; HyperEVM runs apps; both sit on HyperBFT consensus, and a trader only needs HyperCore', id => {
    let s = '';
    s += F.r(P, 20, 20, 360, 150, { rx: 14, fill: P.youSoft, stroke: P.you, sw: 1.5 });
    s += F.t(P, 36, 46, 'HyperCore', { weight: 800, size: 15, fill: P.you }); s += F.t(P, 130, 46, 'where trading happens', { size: 11.5, fill: P.muted });
    [['order books', 'one per asset, price-time priority'], ['clearinghouse', 'margin, positions, liquidations'], ['oracle', 'validators publish every ~3 s'], ['spot · staking · vaults', 'HIP-1 tokens, HYPE staking, HLP']].forEach((b, i) => { const x = 36 + (i % 2) * 170, y = 62 + Math.floor(i / 2) * 50; s += F.r(P, x, y, 160, 42, { rx: 8, fill: P.surf, stroke: P.line }); s += F.t(P, x + 10, y + 17, b[0], { weight: 700, size: 12 }); s += F.t(P, x + 10, y + 33, b[1], { size: 10, fill: P.muted }); });
    s += F.r(P, 420, 20, 200, 150, { rx: 14, fill: P.surf2, stroke: P.line, sw: 1.5 });
    s += F.t(P, 436, 46, 'HyperEVM', { weight: 800, size: 15 }); s += F.t(P, 436, 64, 'apps, lending, bridges', { size: 11.5, fill: P.muted });
    s += F.t(P, 436, 96, 'an Ethereum-style chain', { size: 11.5, fill: P.muted }); s += F.t(P, 436, 112, 'that can read and write Core', { size: 11.5, fill: P.muted });
    s += F.t(P, 436, 150, 'not needed to trade', { size: 12, weight: 800, fill: P.ink });
    s += F.l(P, 380, 95, 420, 95, { stroke: P.muted, sw: 1.4, arrow: 'muted', id }); s += F.l(P, 420, 105, 380, 105, { stroke: P.muted, sw: 1.4, arrow: 'muted', id });
    s += F.r(P, 20, 186, 600, 50, { rx: 10, fill: P.inkSoft });
    s += F.t(P, 320, 206, 'HyperBFT consensus: one agreed order of every transaction', { anchor: 'middle', size: 11.5, weight: 700 });
    s += F.t(P, 320, 224, 'about 200,000 orders a second · median 0.2 s round trip · validators weighted by staked HYPE', { anchor: 'middle', size: 10.5, fill: P.muted });
    return s;
  });

  FIG['onboarding-flow'] = P => F.svg(P, 660, 210, 'Five steps in a row: a fresh wallet, a small mainnet deposit that also pays the one-dollar activation, the testnet faucet that only pays an address that has deposited on mainnet, enabling trading with a gas-free signature, then trading on testnet', id => {
    let s = '';
    const steps = [['1 · Wallet', 'Rabby or MetaMask', 'fresh, seed offline'], ['2 · Mainnet', '10 USDC on Arbitrum', '+1 USDC activation'], ['3 · Faucet', '1,000 mock USDC', 'same address'], ['4 · Enable trading', 'sign once, gas-free', 'per device'], ['5 · Testnet', 'the testnet app', 'until Layer 7']];
    steps.forEach((st, i) => { const x = 16 + i * 128; s += F.r(P, x, 30, 116, 92, { rx: 10, fill: i === 4 ? P.youSoft : P.surf, stroke: i === 4 ? P.you : P.line, sw: 1.3 }); s += F.t(P, x + 10, 52, st[0], { weight: 800, size: 12 }); s += F.t(P, x + 10, 74, st[1], { size: 10.5, fill: P.muted }); s += F.t(P, x + 10, 90, st[2], { size: 10.5, fill: P.muted }); if (i < 4) s += F.l(P, x + 117, 76, x + 127, 76, { stroke: P.muted, sw: 1.4, arrow: 'muted', id }); });
    s += F.t(P, 16, 150, 'why the mainnet deposit comes first: the faucet pays only an address that has deposited on mainnet.', { size: 11.5, fill: P.muted });
    s += F.t(P, 16, 170, 'why a wallet and not email: email login creates different addresses on mainnet and testnet.', { size: 11.5, fill: P.muted });
    s += F.t(P, 16, 196, 'Trading is gas-free. Deposits need a little ETH on Arbitrum for gas; withdrawals cost $1 and take a few minutes.', { size: 11.5, fill: P.muted });
    return s;
  });

  FIG['order-form'] = P => F.svg(P, 640, 330, 'A schematic of the order form: tabs for Market, Limit and Pro; the Buy/Long and Sell/Short toggle; size with a unit toggle; the leverage and margin mode control; reduce-only and TP/SL options; the place-order button and the cost summary', id => {
    let s = ''; const x = 30, w = 270;
    s += F.r(P, x, 16, w, 300, { rx: 12, fill: P.surf, stroke: P.line, sw: 1.3 });
    const row = (y, label, mono) => s += F.t(P, x + 14, y, label, { size: 11.5, mono, fill: P.ink });
    s += F.r(P, x + 10, 26, w - 20, 24, { rx: 6, fill: P.surf2 }); s += F.t(P, x + 22, 42, 'Market    Limit    Pro ▾', { size: 11.5, mono: true, weight: 700 });
    s += F.r(P, x + 10, 58, (w - 20) / 2 - 2, 24, { rx: 6, fill: P.bidSoft }); s += F.t(P, x + 10 + (w - 20) / 4, 74, 'Buy / Long', { anchor: 'middle', size: 11.5, weight: 800, fill: P.bid });
    s += F.r(P, x + 10 + (w - 20) / 2 + 2, 58, (w - 20) / 2 - 2, 24, { rx: 6, fill: P.surf2 }); s += F.t(P, x + 10 + (w - 20) * 3 / 4, 74, 'Sell / Short', { anchor: 'middle', size: 11.5, weight: 800, fill: P.muted });
    row(102, 'Available to trade        1,000.00', true);
    s += F.r(P, x + 10, 112, w - 20, 26, { rx: 6, fill: P.surf, stroke: P.line }); row(129, 'Size                 0.01   BTC ▾', true);
    s += F.l(P, x + 14, 152, x + w - 14, 152, { stroke: P.line, sw: 3 }); s += F.c(P, x + 70, 152, 6, { fill: P.you });
    row(176, 'Cross ▾      5x ▾', true);
    row(200, '☐ Reduce Only         ☐ TP / SL', true);
    s += F.r(P, x + 10, 212, w - 20, 30, { rx: 8, fill: P.you }); s += F.t(P, x + w / 2, 232, 'Place order', { anchor: 'middle', size: 12.5, weight: 800, fill: P.surf });
    row(262, 'Order value   $772.50', true); row(278, 'Margin required  $154.50', true); row(294, 'Slippage  est. 0.01%   Fees  0.045%', true);
    const notes = [[42, 'order type. Pro hides Scale, TWAP, Stop and Take, Chase, Trailing'], [72, 'direction. Selling while flat opens a short'], [129, 'size in coins or in dollars; the slider is a share of your margin, not of your risk'], [176, 'margin mode and leverage (Layer 4)'], [200, 'reduce-only can only shrink a position; TP/SL attaches exits to this order'], [232, 'a confirm dialog follows, until you tick “don’t show again”'], [280, 'read this box before every order: value, margin, slippage, fee']];
    notes.forEach(n => { s += F.l(P, x + w + 6, n[0] - 4, x + w + 26, n[0] - 4, { stroke: P.muted, sw: 1 }); s += F.wrap(P, x + w + 32, n[0], n[1], 290, { size: 11, fill: P.muted, lh: 14 }).s; });
    return s;
  });

  FIG['order-map'] = P => F.svg(P, 660, 320, 'A vertical price axis with the mid in the middle; on the left, the three ways to open a long placed where they sit relative to the mid; on the right, the exits that manage an open long', id => {
    let s = ''; const cx = 330, top = 40, bot = 290, mid = 165;
    s += F.l(P, cx, top, cx, bot, { stroke: P.line, sw: 2 });
    s += F.l(P, 60, mid, 600, mid, { stroke: P.ink, sw: 1.2, dash: '4 4' }); s += F.pill(P, cx, mid, 'mid price', { size: 11, bg: P.ink, fill: P.surf });
    s += F.t(P, cx, top - 14, 'higher', { anchor: 'middle', size: 11, fill: P.muted }); s += F.t(P, cx, bot + 18, 'lower', { anchor: 'middle', size: 11, fill: P.muted });
    s += F.t(P, 40, 24, 'to open a long', { weight: 800, size: 13, fill: P.bid }); s += F.t(P, 620, 24, 'to manage an open long', { weight: 800, size: 13, fill: P.ask, anchor: 'end' });
    const left = (y, name, how, col) => { s += F.r(P, 40, y - 18, 250, 36, { rx: 9, fill: P.surf, stroke: col, sw: 1.4 }); s += F.t(P, 52, y - 3, name, { weight: 800, size: 12 }); s += F.t(P, 52, y + 12, how, { size: 10.5, fill: P.muted }); s += F.l(P, 290, y, cx - 4, y, { stroke: col, sw: 1.2, arrow: 'muted', id }); };
    const right = (y, name, how, col) => { s += F.r(P, 370, y - 18, 250, 36, { rx: 9, fill: P.surf, stroke: col, sw: 1.4 }); s += F.t(P, 382, y - 3, name, { weight: 800, size: 12 }); s += F.t(P, 382, y + 12, how, { size: 10.5, fill: P.muted }); s += F.l(P, 370, y, cx + 4, y, { stroke: col, sw: 1.2, arrow: 'muted', id }); };
    left(90, 'Stop market buy', 'a breakout entry: fires when mark rises to the trigger', P.you);
    left(215, 'Limit buy', 'rests in the book below the mid; fills as a maker, or never', P.bid);
    left(262, 'Take market buy', 'a dip entry: fires when mark falls to the trigger', P.you);
    right(90, 'Take profit (sell)', 'fires when mark rises to the trigger; market or limit', P.you);
    right(222, 'Stop loss (sell)', 'fires when mark falls to the trigger; market or limit', P.ask);
    right(268, 'Trailing stop (sell)', 'trigger follows the highest mark, never moves back down', P.ask);
    s += F.t(P, 40, 310, 'anything with a trigger is a market order in waiting: it fires on the mark price (Layer 3) and then pays the taker fee', { size: 11, fill: P.muted });
    return s;
  });

  FIG['mark-vs-last'] = P => F.svg(P, 640, 276,'Two price lines over time, the last trade on Hyperliquid and the mark price; the mark crosses a stop trigger first and fires the stop at a price the Hyperliquid book never traded', id => {
    let s = ''; const x0 = 40, x1 = 600, y0 = 40, y1 = 190;
    const trig = 140;
    const mark = [[x0, 70], [120, 78], [200, 92], [260, 110], [310, 128], [340, 141], [380, 150], [440, 142], [520, 120], [x1, 112]];
    const last = [[x0, 72], [120, 72], [180, 86], [260, 100], [320, 118], [360, 128], [400, 136], [460, 130], [520, 116], [x1, 110]];
    s += F.l(P, x0, trig, x1, trig, { stroke: P.you, sw: 1.5, dash: '6 4' }); s += F.t(P, x1, trig - 6, 'your stop trigger', { anchor: 'end', size: 11, fill: P.you, weight: 700 });
    s += F.p(P, F.path(last), { stroke: P.muted, sw: 2, dash: '2 4' }); s += F.p(P, F.curve(mark), { stroke: P.ink, sw: 2.2 });
    s += F.c(P, 338, 141, 6, { fill: P.you }); s += F.l(P, 338, 141, 338, y1 + 10, { stroke: P.you, sw: 1, dash: '3 3' });
    s += F.pill(P, 338, y1 + 24, 'fires here, on mark', { size: 11, bg: P.you, fill: P.surf });
    s += F.t(P, 60, 56, 'mark price (built mostly from other exchanges)', { size: 11, fill: P.ink, weight: 700 });
    s += F.t(P, 400, 92, 'last trade on Hyperliquid, lagging', { size: 11, fill: P.muted });
    s += F.wrap(P, x0, 244, 'the Hyperliquid book never printed the trigger price, and the stop still fired. A market TP/SL then fills with up to 10% slippage allowed.', 560, { size: 11, fill: P.muted, lh: 14 }).s;
    return s;
  });

  FIG['oco-tree'] = P => F.svg(P, 660, 290, 'A parent limit order with two attached children, a take profit and a stop loss that cancel each other; three outcomes below: a full fill places the children, a partial fill leaves them waiting, and cancelling the parent cancels them even if part of it filled', id => {
    let s = '';
    s += F.box(P, 230, 16, 200, 50, 'parent: limit buy 0.1 @ 77,000', ['the children are sized to it'], { size: 12, stroke: P.you });
    s += F.l(P, 330, 66, 180, 96, { stroke: P.muted, sw: 1.3, arrow: 'muted', id }); s += F.l(P, 330, 66, 480, 96, { stroke: P.muted, sw: 1.3, arrow: 'muted', id });
    s += F.box(P, 80, 98, 200, 46, 'take profit: sell 0.1 @ 79,000', ['market or limit, triggers on mark'], { size: 12, stroke: P.bid });
    s += F.box(P, 380, 98, 200, 46, 'stop loss: sell 0.1 @ 76,000', ['market or limit, triggers on mark'], { size: 12, stroke: P.ask });
    s += F.l(P, 280, 121, 380, 121, { stroke: P.muted, sw: 1.2, dash: '3 3' }); s += F.pill(P, 330, 158, 'one cancels the other', { size: 10.5, bg: P.surf, stroke: P.line, sw: 1, fill: P.muted });
    const rows = [['parent fills completely', 'both children are placed, each for 0.1', P.bid], ['parent fills partly, 0.04 of 0.1', 'children stay unplaced, so the 0.04 has no stop yet', P.oracle], ['you cancel the parent, filled or not', 'children are cancelled too; add a new TP/SL for the filled part', P.ask]];
    rows.forEach((rw, i) => { const y = 190 + i * 30; s += F.c(P, 30, y - 4, 5, { fill: rw[2] }); s += F.t(P, 44, y, rw[0], { weight: 800, size: 12 }); s += F.t(P, 270, y, rw[1], { size: 11.5, fill: P.muted }); });
    s += F.t(P, 20, 282, 'one exception: a partly filled parent cancelled by the exchange for insufficient margin does place its children.', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['tif-matrix'] = P => F.svg(P, 640, 240, 'A matrix of order options against two situations, when the order could fill right now and when it could not: GTC fills or rests, IOC fills what it can and cancels the rest, Post Only is rejected or rests, reduce-only only ever shrinks a position', id => {
    let s = ''; const c1 = 150, c2 = 390; const rows = [['GTC', 'fills now (taker)', 'rests in the book (maker)'], ['IOC', 'fills what it can, cancels the rest', 'cancelled, nothing rests'], ['Post Only (ALO)', 'rejected, never a taker', 'rests in the book (maker)'], ['Reduce only', 'fills, but only up to your position', 'rests; can only shrink the position']];
    s += F.t(P, c1, 30, 'if it could fill right now…', { weight: 800, size: 12 }); s += F.t(P, c2, 30, 'if it could not fill right now…', { weight: 800, size: 12 });
    rows.forEach((rw, i) => { const y = 66 + i * 42; s += F.l(P, 20, y - 26, 620, y - 26, { stroke: P.grid, sw: 1 }); s += F.pill(P, 20, y - 5, rw[0], { anchor: 'start', size: 11.5, bg: P.inkSoft, weight: 800 }); s += F.t(P, c1, y, rw[1], { size: 12, fill: rw[1].startsWith('rejected') ? P.ask : P.ink }); s += F.t(P, c2, y, rw[2], { size: 12, fill: P.ink }); });
    s += F.t(P, 20, 232, 'GTC is “good till cancelled”, IOC is “immediate or cancel”, ALO is “add liquidity only”, Hyperliquid’s name for Post Only.', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['twap-chase'] = P => F.svg(P, 660, 330, 'Top: a TWAP slicing a ten-thousand-dollar order into suborders every thirty seconds over an hour, with one missed slice caught up by a larger one; bottom: a chase order re-pricing to sit one tick above the best bid as the bid moves', id => {
    let s = '';
    s += F.t(P, 20, 22, 'TWAP: $10,000 over 1 hour ≈ 121 slices of ≈ $83, one every 30 seconds', { weight: 800, size: 13 });
    const x0 = 20, x1 = 640, y = 90;
    s += F.l(P, x0, y, x1, y, { stroke: P.line, sw: 2 });
    for (let i = 0; i <= 24; i++) { const x = x0 + i * (x1 - x0) / 24; const miss = i === 9; const big = i === 10; s += F.r(P, x - 4, y - (big ? 30 : 16), 8, big ? 30 : 16, { rx: 2, fill: miss ? P.askSoft : (big ? P.you : P.inkSoft), stroke: miss ? P.ask : 'none', sw: 1, dash: miss ? '2 2' : undefined }); }
    s += F.t(P, x0 + 9 * (x1 - x0) / 24, y + 18, 'missed: spread too wide', { anchor: 'middle', size: 10, fill: P.ask }); s += F.t(P, x0 + 11 * (x1 - x0) / 24 + 14, y - 36, 'catch-up slice, up to 3× normal', { size: 10, fill: P.you });
    s += F.wrap(P, x0, y + 40, 'limits: $100 minimum total · 5 minutes to 7 days · each slice is a market order with 3% max slippage · pauses during a network upgrade', 610, { size: 10.5, fill: P.muted, lh: 13 }).s;
    s += F.t(P, 20, 172, 'Chase: a Post Only order that keeps re-pricing to the front of the queue', { weight: 800, size: 13 });
    const by = 232; const bids = [77249, 77250, 77251, 77250, 77252];
    bids.forEach((b, i) => { const x = 40 + i * 120; s += F.r(P, x, by - 14, 90, 28, { rx: 6, fill: P.bidSoft }); s += F.t(P, x + 45, by + 4, 'best bid ' + b.toLocaleString(), { anchor: 'middle', size: 10.5, mono: true, fill: P.bid }); s += F.r(P, x, by - 46, 90, 28, { rx: 6, fill: P.you }); s += F.t(P, x + 45, by - 28, 'you ' + (b + 1).toLocaleString(), { anchor: 'middle', size: 10.5, mono: true, fill: P.surf, weight: 700 }); if (i < 4) s += F.l(P, x + 92, by - 32, x + 118, by - 32, { stroke: P.muted, sw: 1.2, arrow: 'muted', id }); });
    s += F.wrap(P, 20, 274, 'it rests one tick above the best bid (or at it when the spread is one tick), always a maker. It runs in your browser tab: close the tab and it stops. Up to 5 at once. It ends if the order is rejected (below $10, no margin), if you modify it, switch address, or connect the same address elsewhere.', 620, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  FIG['trailing-stop'] = P => F.svg(P, 660, 270, 'The docs example of a trailing stop closing a long with a retracement of ten: the mark goes 100, 110, 105, 120, 110; the trigger rises with each new high to 90, 100, 110 and never falls; the stop fires at 110', id => {
    let s = ''; const xs = [60, 150, 240, 330, 420]; const Y = v => 210 - (v - 85) * 4;
    const marks = [100, 110, 105, 120, 110], wm = [100, 110, 110, 120, 120], trig = [90, 100, 100, 110, 110];
    s += F.poly(P, xs.map((x, i) => [x, Y(wm[i])]), { stroke: P.oracle, sw: 1.5, dash: '4 3' });
    s += F.poly(P, xs.map((x, i) => [x, Y(trig[i])]), { stroke: P.ask, sw: 2 });
    s += F.poly(P, xs.map((x, i) => [x, Y(marks[i])]), { stroke: P.ink, sw: 2.2 });
    xs.forEach((x, i) => { s += F.c(P, x, Y(marks[i]), 4.5, { fill: P.ink }); s += F.t(P, x, Y(marks[i]) - 10, String(marks[i]), { anchor: 'middle', size: 11, mono: true }); s += F.t(P, x, 236, 't' + (i + 1), { anchor: 'middle', size: 10.5, fill: P.muted, mono: true }); });
    s += F.c(P, 420, Y(110), 8, { fill: 'none', stroke: P.ask, sw: 2 }); s += F.t(P, 420, Y(110) + 26, 'fires: market sell', { size: 11.5, weight: 700, fill: P.ask, anchor: 'middle' });
    s += F.t(P, 60, 30, 'mark price', { size: 11, weight: 700 }); s += F.t(P, 150, 30, 'watermark (highest mark so far)', { size: 11, fill: P.oracle, weight: 700 }); s += F.t(P, 360, 30, 'trigger = watermark − 10', { size: 11, fill: P.ask, weight: 700 });
    const tbl = [['t1', '100', '100', '90', 'tracking starts'], ['t2', '110', '110', '100', 'new high lifts the trigger'], ['t3', '105', '110', '100', 'trigger stays put'], ['t4', '120', '120', '110', 'new high lifts it again'], ['t5', '110', '120', '110', 'mark falls to the trigger: fires']];
    s += F.t(P, 478, 62, 'mark  high  trigger', { size: 10, mono: true, fill: P.muted });
    tbl.forEach((r, i) => { const y = 84 + i * 32; s += F.t(P, 478, y, `${r[1].padStart(4)}  ${r[2].padStart(4)}  ${r[3].padStart(5)}`, { size: 11, mono: true }); s += F.t(P, 478, y + 13, r[4], { size: 9, fill: P.muted }); });
    s += F.t(P, 20, 262, 'set the retracement as a distance or a percent; an optional activation price delays the tracking. Perp markets only.', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['fee-staircase'] = P => F.svg(P, 660, 350, 'Fee tiers as a staircase from 0.045 percent taker and 0.015 percent maker at the base down to 0.024 and zero at seven billion of fourteen-day volume, with staking discounts from five to forty percent beside it', id => {
    let s = '';
    s += F.t(P, 20, 22, 'Volume tiers: 14-day volume, spot counted twice', { weight: 800, size: 12.5 });
    s += F.t(P, 20, 38, 'recomputed at the end of each UTC day · top number taker, bottom maker', { size: 10.5, fill: P.muted });
    const tiers = [['base', '0.045', '0.015'], ['>$5M', '0.040', '0.012'], ['>$25M', '0.035', '0.008'], ['>$100M', '0.030', '0.004'], ['>$500M', '0.028', '0.000'], ['>$2B', '0.026', '0.000'], ['>$7B', '0.024', '0.000']];
    tiers.forEach((tr, i) => { const x = 20 + i * 60, h = 30 + (6 - i) * 13, y = 200 - h; s += F.r(P, x, y, 52, h, { rx: 5, fill: i === 0 ? P.you : P.inkSoft }); s += F.t(P, x + 26, y - 18, tr[1] + '%', { anchor: 'middle', size: 10, mono: true, weight: 700 }); s += F.t(P, x + 26, y - 6, tr[2] + '%', { anchor: 'middle', size: 9.5, mono: true, fill: P.muted }); s += F.t(P, x + 26, 216, tr[0], { anchor: 'middle', size: 10, mono: true, fill: P.muted }); });
    s += F.t(P, 20, 236, 'you start at the blue bar and will stay there for a long time', { size: 10.5, fill: P.muted });
    s += F.t(P, 470, 22, 'Staking discounts', { weight: 800, size: 12.5 }); s += F.t(P, 470, 38, 'HYPE staked → fee discount', { size: 10.5, fill: P.muted });
    const stk = [['Wood', '>10', '5%'], ['Bronze', '>100', '10%'], ['Silver', '>1,000', '15%'], ['Gold', '>10,000', '20%'], ['Platinum', '>100,000', '30%'], ['Diamond', '>500,000', '40%']];
    stk.forEach((r, i) => { const y = 62 + i * 22; s += F.t(P, 470, y, r[0], { size: 11, weight: 700 }); s += F.t(P, 548, y, r[1], { size: 10.5, mono: true, fill: P.muted }); s += F.t(P, 640, y, r[2], { size: 11, mono: true, weight: 700, anchor: 'end' }); });
    s += F.t(P, 470, 206, 'referral code: 4% off your first $25M', { size: 10.5, fill: P.muted }); s += F.t(P, 470, 222, 'maker rebates: biggest makers only', { size: 10.5, fill: P.muted });
    s += F.r(P, 20, 252, 620, 88, { rx: 10, fill: P.inkSoft });
    s += F.wrap(P, 32, 272, 'Where it goes: to HLP (the community market-making vault) and the assistance fund, which buys and burns HYPE. No team takes a cut. One fee tier covers perps, HIP-3 and spot; spot rates are higher, 0.07% taker and 0.04% maker at the base. HIP-3 builder markets add a deployer share, and growth-mode markets cut the all-in fee by at least 90% (taker 0.0045% to 0.009%).', 596, { size: 11, fill: P.ink, lh: 15 }).s;
    return s;
  });

  LESSONS['layer-2'] = {
    intro: 'Layers 0 and 1 were about markets in general. This one is about the machine you will actually use: how to get onto it safely, what every control on the order form does, and what each order type does when the market is moving against you. There is a lot of detail here. You do not need to memorise it; you need to have met each piece once, so that the drills (every order type, once, on testnet) make sense.',
    legend: 'In the pictures, blue is you or your order, amber is an external reference such as the oracle or a watermark, red and green are the sell and buy sides.',
    sections: [
      { id: 'two-halves', t: 'Two halves of one chain',
        p: ['Hyperliquid is its own blockchain, and it has two halves. **HyperCore** is the exchange: an order book for every asset, the clearinghouse that holds margin and positions, the oracle, spot markets, staking and vaults. **HyperEVM** is an Ethereum-style chain for apps that can read and write HyperCore. Everything a manual trader does happens in HyperCore, through the app, and you never need to touch the EVM side.',
          'Under both sits one consensus (HyperBFT) that agrees the order of every transaction. That is what makes the book in Layer 0 a shared ledger rather than a private database: about 200,000 orders a second, a median round trip of 0.2 seconds, and a committed answer to every order you send.'],
        fig: 'core-evm', cap: 'HyperCore is where you trade. HyperEVM is where apps live. One consensus under both.',
        key: 'You trade on HyperCore, through the app. HyperEVM exists; you do not need it.' },

      { id: 'setup', t: 'Getting set up, in five steps',
        p: ['The order matters, because the testnet faucet only pays an address that has already deposited on mainnet. So day one is: a fresh wallet used only for this; a small mainnet deposit (about 10 USDC on Arbitrum, plus a little ETH there for gas) which also pays the one-time 1 USDC activation fee; the testnet faucet, which drips 1,000 mock USDC to the same address; one gas-free signature to enable trading; and then testnet until Layer 7.',
          'Use a wallet, not email login. Email login (through Privy) creates different addresses on mainnet and testnet, which breaks the faucet rule; the docs explain how to export an email wallet if you already have one. Keep the seed phrase offline; anyone with it has your funds.',
          'The step-by-step list with exact URLs is in the “Setup, once” box below the lesson.'],
        fig: 'onboarding-flow', cap: 'Five steps, in this order, because the faucet checks for a mainnet deposit from the same address.',
        key: 'Fresh wallet, 10 USDC on mainnet, faucet, enable trading, testnet. Email login breaks the faucet rule.' },

      { id: 'order-form', t: 'The order form, decoded',
        p: ['Every order you will ever place goes through one small panel. Across the top: **Market**, **Limit** and **Pro**, where Pro hides the rest (Scale, TWAP, Stop and Take orders, Chase, Trailing stop). Then the direction: Buy / Long or Sell / Short, which, as Layer 1 warned, opens a short if you are flat.',
          'Size can be typed in coins or in dollars, and the slider underneath sets it as a share of your available margin, which is a dangerous default for a learner: it thinks in leverage, not in risk (Layer 4 teaches the other way round: stop first, then size). The margin mode (cross or isolated) and the leverage number sit together, because together they decide how far away your liquidation is (Layer 4). Reduce Only means the order can only shrink an existing position. The TP/SL box attaches exits to the order you are placing.',
          'Under the button is the line that matters most and is read least: order value, margin required, estimated slippage and the fee. Make a habit of reading it before every click.'],
        fig: 'order-form', cap: 'The order form as a schematic. The real one rearranges itself with releases, but every control here will be somewhere on it.',
        key: 'Type the size, never slide it. Read the value, margin, slippage and fee line before you click.' },

      { id: 'order-map', t: 'Where each order type sits relative to the price', try: 'trigger-sim', figDocs: 'order-map',
        p: ['The easiest way to keep the order types straight is to place them on a price ladder. To open a long you have three choices. A **limit buy** rests below the mid and waits for the price to come down to it. A **stop market buy** has a trigger above the mid: it does nothing until the mark price rises to the trigger, then sends a market buy, the classic breakout entry. A **take market buy** has a trigger below the mid: it fires when the mark falls to it, a dip entry. Stop limit and take limit are the same triggers sending a limit order instead of a market order.',
          'To manage a long you have the mirror image. A **take profit** sells when the mark rises to its trigger; a **stop loss** sells when the mark falls to its trigger; a **trailing stop** is a stop loss whose trigger follows the highest mark reached and never moves back down.',
          'The rule hidden in all of that: every triggered order is a market order in waiting. It fires on the mark price, not on the last trade, and when it fires it pays the taker fee.'],
        tryNote: 'Pick an order, set its trigger, and press play. Watch which line crosses the trigger. The last trade on Hyperliquid often has not reached it when the order fires.',
        key: 'Triggers above the mid for stop buys and take-profit sells; below the mid for take buys and stop-loss sells. All of them fire on mark.' },

      { id: 'mark-trigger', t: 'Triggers fire on mark, not on the last trade',
        p: ['Layer 3 builds the **mark price** properly. For now you need one fact: mark is mostly made from prices on other exchanges, smoothed, and only partly from Hyperliquid’s own book. So a sharp move on Binance moves the mark here within seconds, whether or not anyone has traded at that price on Hyperliquid. If your stop trigger sits in the way, it fires.',
          'What happens next depends on the kind of TP/SL. A **market** TP/SL sends a market order with a 10% slippage tolerance, which almost always fills, at whatever the book offers. A **limit** TP/SL sends a limit order at the price you set, which caps your slippage but might not fill at all if the market gaps through it. The docs’ example: a stop with a $10 trigger and a $10 limit may sit unfilled if the price jumps from $11 to $9; with an $8 limit it fills somewhere between $9 and $8.',
          'A stop is insurance, and insurance that might not pay out is not insurance. Use a market stop unless you have a specific reason not to, and keep its size small enough that 10% slippage would be survivable.'],
        fig: 'mark-vs-last', cap: 'The mark line reaches the trigger before the Hyperliquid tape does. The stop fires anyway.',
        check: { q: 'Your stop loss on a long has a trigger of 76,000. The last trade on Hyperliquid is 76,180, but mark drops to 75,990. What happens?', o: ['Nothing until a trade prints at 76,000 on Hyperliquid', 'The stop fires, because triggers use the mark price', 'The stop is cancelled for being stale'], a: 1, why: 'TP/SL orders trigger on mark, which is built mostly from other exchanges. The Hyperliquid tape is irrelevant to whether it fires.' },
        key: 'A stop can fire at a price that never traded here. Market stops fill with up to 10% slippage; limit stops may not fill at all.' },

      { id: 'tpsl', t: 'TP/SL: on a position, or tied to an order',
        p: ['There are two places to attach a take profit or stop loss, and they behave differently. A **position** TP/SL, set from the positions table, defaults to the whole position and keeps covering it as the position grows or shrinks, unless you type a fixed size, in which case it stays fixed.',
          'An **order-tied** TP/SL, set from the order form while placing an entry, is sized to that order and only comes alive when the parent order fills completely. The two children are an OCO pair: one cancels the other. If the parent only partly fills, the children are not placed yet, so the filled part has no stop. And if you cancel the parent, the children go with it, even if part of the parent had filled. That last case is the one that catches people: cancel a half-filled entry and your half position is suddenly naked.',
          'The drill asks you to do this on purpose on testnet, once, so you feel it.'],
        fig: 'oco-tree', cap: 'A parent order with its OCO children, and the three outcomes that decide whether the children exist.',
        check: { q: 'You set a TP/SL from the positions table without typing a size, then add to the position. What does the TP/SL cover now?', o: ['The whole position, because a position TP/SL follows the position unless you fixed its size', 'Only the size you had when you set it', 'Nothing: any change to the position cancels it'], a: 0, why: 'A position TP/SL defaults to the entire position and keeps covering it as it grows or shrinks. Only a TP/SL with a typed size stays fixed.' },
        key: 'Position TP/SL follows the position. Order-tied TP/SL lives and dies with its parent order.' },

      { id: 'tif', t: 'GTC, IOC, ALO and reduce-only',
        p: ['Limit orders carry a time-in-force that says what to do if they cannot fill at once. **GTC** (good till cancelled) rests in the book until filled or cancelled; it is the default. **IOC** (immediate or cancel) fills whatever it can right now and cancels the remainder; it is the honest version of a market order, because you name the worst price you accept. **ALO** (add liquidity only), which the app calls Post Only, is the opposite: if the order would fill right now it is rejected; it only ever rests, so it only ever pays the maker fee.',
          '**Reduce only** is a separate switch that works with any of them: the order can shrink your position but never open or flip one. Put it on every exit. It is the cheapest insurance there is against the fat-finger that turns “close my long” into “open a short twice the size”.'],
        fig: 'tif-matrix', cap: 'What each option does in the two situations that matter: the order could fill now, or it could not.',
        key: 'GTC rests, IOC fills and cancels, Post Only rests or is rejected. Reduce-only on every exit.' },

      { id: 'big-orders', t: 'Big orders: scale, TWAP and chase',
        p: ['Three tools exist for orders too large to send in one piece. **Scale** places a ladder of limit orders across a price range, so you accumulate as the price moves through them instead of guessing one level. **TWAP** slices a large order into small market orders sent at regular intervals: the interval is at least 30 seconds, the running time between 5 minutes and 7 days, the total at least $100, and each slice is capped at 3% slippage. If a slice misses because the spread is wide, later slices grow to catch up, up to three times the normal size. TWAP slices pause during a network upgrade.',
          '**Chase** is a Post Only order that keeps re-pricing itself to sit one tick inside the best bid (or ask), so it stays at the front of the queue and always fills as a maker. It runs in your browser tab, not on the exchange: close the tab, switch address, or modify the order and it stops. Up to five can run at once.',
          'At learner size none of these is necessary. They are here so that the Pro tab is not a mystery, and so that when you see a wall of small prints every 30 seconds on the tape, you know what you are looking at.'],
        fig: 'twap-chase', cap: 'A TWAP’s slices across an hour, with a missed slice and its catch-up; a chase order re-pricing behind a moving best bid.',
        key: 'Scale is a ladder of limits, TWAP is slices over time, chase is a maker order that follows the best price from your browser.' },

      { id: 'trailing', t: 'Trailing stops: the watermark and the retracement',
        p: ['A trailing stop closes a position when the price turns against it by a set amount after moving in its favour. For a long, the order tracks the **highest mark price** since it activated (the watermark) and triggers a market sell when the mark falls from that high by your **retracement**, set as a distance or a percentage. The trigger only ever moves up, never down.',
          'The docs’ example: long, mark at 100, retracement 10. The trigger starts at 90. Mark goes to 110, the trigger lifts to 100. Mark dips to 105, the trigger stays at 100. Mark climbs to 120, the trigger lifts to 110. Mark falls to 110 and the position is sold at market. An optional activation price delays the tracking until the market has reached a level you choose.'],
        fig: 'trailing-stop', cap: 'The docs’ Example 1 drawn out: the watermark rises with each new high, the trigger follows ten below it, and the stop fires at 110.',
        key: 'A trailing stop follows the best mark by your retracement and never moves backwards. It fires on mark, as a market order.' },

      { id: 'fees', t: 'Fees, the full picture',
        p: ['Layer 0 gave you the two numbers that matter at the start: 0.045% taker and 0.015% maker on perps. The full schedule steps those down with your 14-day volume (spot counts double), with tiers at $5M, $25M, $100M, $500M, $2B and $7B, recomputed at the end of each UTC day. Staking HYPE discounts whatever tier you are in: 5% off at more than 10 HYPE, up to 40% at more than 500,000. A referral code takes 4% off your first $25M of volume. Spot is dearer, 0.07% and 0.04% at the base.',
          'None of the fee goes to a team. It is paid to HLP, the community vault you will meet in Layer 8, and to the assistance fund, which buys and burns HYPE. The [Tools page](#tools) has a fee calculator that applies the tier, referral and staking discounts to a round trip, and the drill asks you to reconcile one real fill against it.'],
        fig: 'fee-staircase', cap: 'The volume staircase, the staking discounts, the referral discount, and where the money goes.',
        key: 'You will live at the base tier for a long time: 0.045% and 0.015%. A referral code and staking are the only discounts that apply to you.' },

      { id: 'gas-free', t: 'Gas-free, committed, and public',
        p: ['Three practical consequences of the chain under the app. First, trading costs no gas and every response is final; the only chain costs you meet are the 1 USDC activation on your first deposit, the gas to deposit from Arbitrum, and the $1 withdrawal fee. Second, during a network upgrade, which the team announces on X and Discord, there is a short window in which only Post Only orders are accepted and nothing matches: a market stop that triggers inside it waits until the window ends, and TWAPs pause. Do not plan an exit through an upgrade. Third, everything is public: positions, fills, liquidations, and the leaderboard of who is making and losing money. Layer 6 turns that into a research tool.'],
        key: 'No gas, final answers, a window during upgrades in which nothing matches, and a public ledger of everyone’s positions.' },

      { id: 'drill-map', t: 'The drills, in order',
        p: ['The first drill says “every row of the order table, once”. Do them in this order, each with one line in your notes about what you expected and what happened:'],
        list: ['Market buy, then market sell, smallest size. Find both fees in trade history.', 'Limit buy 1% below the mid (watch it rest), then a limit buy at the best ask (watch it cross). Note which fee each paid.', 'Post Only buy at the best ask. Read the rejection.', 'IOC buy for more than the top level holds. See the partial fill and the cancelled remainder.', 'Open a small long, then set a position TP/SL. Then place a new entry with an order-tied TP/SL, let it half fill, cancel it, and watch the children vanish.', 'Stop market buy above the mid and take market buy below it; wait for one to fire. Confirm it fired on mark.', 'A reduce-only sell larger than your position. Note what fills.', 'Scale, TWAP ($100 minimum, 5 minutes), chase and trailing stop, once each, just to see them run.'],
        p2: ['When that list is done, the pass check for this layer is honest: you can place any row of the table without reading, and you know which orders trigger on mark and which fill against the book.'],
        key: 'Every order type once, on testnet, with a note. That is how the table becomes reflex.' }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
