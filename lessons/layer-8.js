/* Layer 8 · The rest of Hyperliquid: lesson text and figures.
   HIP-3, protocol vaults, staking, delisting and fees pages, opened 3 Nov 2026; the SK Hynix case from the news report in the media list. */
(function (root) {
  'use strict';
  const F = root.FigLib, FIG = root.FIG || (root.FIG = {}), LESSONS = root.LESSONS || (root.LESSONS = {});

  FIG['venue-map'] = P => F.svg(P, 660, 320, 'A map of the venue: validator-run perps in the centre, spot markets, builder-deployed HIP-3 perps, outcome markets, the HLP vault, user vaults and staking around it, and HyperEVM at the edge; the centre is where this course lives', id => {
    let s = '';
    s += F.r(P, 20, 20, 620, 240, { rx: 16, fill: P.surf2 }); s += F.t(P, 36, 44, 'HyperCore', { weight: 800, size: 13 });
    s += F.r(P, 200, 90, 260, 90, { rx: 12, fill: P.youSoft, stroke: P.you, sw: 1.8 }); s += F.t(P, 330, 118, 'validator-run perps', { anchor: 'middle', weight: 800, size: 14, fill: P.you }); s += F.t(P, 330, 138, 'BTC, ETH, SOL, HYPE and 200+ more', { anchor: 'middle', size: 11, fill: P.muted }); s += F.t(P, 330, 156, 'this course, Layers 0 to 7', { anchor: 'middle', size: 11, fill: P.you, weight: 700 });
    const sat = (x, y, title, sub, col) => { s += F.r(P, x, y, 150, 50, { rx: 10, fill: P.surf, stroke: col || P.line, sw: 1.3 }); s += F.t(P, x + 75, y + 20, title, { anchor: 'middle', weight: 800, size: 11.5 }); s += F.t(P, x + 75, y + 37, sub, { anchor: 'middle', size: 9.5, fill: P.muted }); };
    sat(36, 60, 'spot (HIP-1, HIP-2)', 'native tokens; HYPE lives here');
    sat(36, 190, 'staking', 'delegate HYPE; fee discounts');
    sat(474, 60, 'HIP-3 builder perps', 'stocks, indices, commodities, FX', P.oracle);
    sat(474, 190, 'HIP-4 outcome markets', 'yes/no on the same engine');
    sat(255, 196, 'vaults', 'HLP makes markets and backstops');
    s += F.r(P, 20, 272, 620, 36, { rx: 10, fill: P.inkSoft }); s += F.t(P, 330, 295, 'HyperEVM: apps, lending, bridges. Not needed to trade.', { anchor: 'middle', size: 11.5, weight: 700 });
    return s;
  });

  FIG['hip3-trust'] = P => F.svg(P, 660, 340, 'Two columns comparing who you trust: validator-run perps use an oracle published by the stake-weighted validator set, while a HIP-3 market’s oracle, leverage, fees, halting and settlement are controlled by one deployer who has staked five hundred thousand HYPE', id => {
    let s = '';
    const col = (x, title, rows, c) => { s += F.r(P, x, 20, 300, 290, { rx: 12, fill: P.surf, stroke: c, sw: 1.5 }); s += F.t(P, x + 16, 46, title, { weight: 800, size: 13, fill: c }); rows.forEach((r, i) => { const y = 72 + i * 48; s += F.t(P, x + 16, y, r[0], { size: 10.5, fill: P.muted, weight: 700 }); s += F.wrap(P, x + 16, y + 15, r[1], 270, { size: 11, fill: P.ink, lh: 13 }).s; }); };
    col(20, 'validator-run perps', [['oracle', 'stake-weighted median of many validators, from 8 spot sources'], ['leverage and margin', 'set by the protocol; cross or isolated'], ['who can halt it', 'validators, by vote; delisting settles at a 1-hour oracle average'], ['fees', 'the standard schedule'], ['if the oracle is wrong', 'many validators would have to agree on the wrong number']], P.you);
    col(340, 'HIP-3 builder perps', [['oracle', 'the deployer’s own feed, from whatever source they choose'], ['leverage and margin', 'set by the deployer; many markets isolated-only'], ['who can halt it', 'the deployer, at any time, settling positions at the current mark'], ['fees', 'the deployer adds a share; growth mode cuts the all-in fee 90%'], ['if the oracle is wrong', 'one feed, one operator; validators can slash their 500k HYPE stake afterwards']], P.oracle);
    s += F.t(P, 20, 332, 'slashed stake is burned, not paid to the traders who were hurt. The deterrent protects the venue, not your position.', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['thin-print'] = P => F.svg(P, 660, 250, 'A stock’s pre-market trades as a flat line with one thin print far below it; the HIP-3 oracle takes the print, the perp’s mark follows, and a band of long positions is liquidated while the stock itself barely moves', id => {
    let s = ''; const x0 = 40, x1 = 620, y = 100; const X = t => x0 + t / 100 * (x1 - x0);
    s += F.l(P, x0, y, x1, y, { stroke: P.muted, sw: 2 }); s += F.t(P, x0, y - 10, 'the stock, pre-market: a few thin trades around one price', { size: 11, fill: P.muted, weight: 700 });
    s += F.c(P, X(55), y + 70, 5, { fill: P.ask }); s += F.l(P, X(55), y, X(55), y + 64, { stroke: P.ask, sw: 1.2, dash: '3 3' }); s += F.t(P, X(55) + 10, y + 74, 'one tiny trade, far below', { size: 11, fill: P.ask, weight: 700 });
    const oracle = [[X(0), y + 4], [X(54), y + 4], [X(56), y + 70], [X(62), y + 70], [X(64), y + 6], [X(100), y + 6]];
    s += F.poly(P, oracle, { stroke: P.oracle, sw: 2.5 }); s += F.t(P, x1, y + 30, 'the deployer’s oracle takes the print; mark follows', { size: 11, fill: P.oracle, weight: 700, anchor: 'end' });
    s += F.r(P, X(8), y + 22, X(50) - X(8), 14, { rx: 4, fill: P.askSoft }); s += F.t(P, X(29), y + 33, 'liquidation prices of ~960 long accounts', { anchor: 'middle', size: 10, fill: P.ask });
    s += F.wrap(P, x0, 212, 'July 2026, SK Hynix perp: about $57M of longs liquidated on a pre-market print while the stock barely moved. No external exchange disagreed, because the oracle was one deployer’s feed. (News report in the media list; no deployer post-mortem was published.)', 580, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  FIG['hlp-role'] = P => F.svg(P, 660, 260, 'HLP drawn as a vault with three jobs: quoting on the books as a market maker, taking over positions as the backstop liquidator, and supplying USDC to Earn, funded by depositors who share its PnL and a portion of trading fees, with a four-day lock on deposits', id => {
    let s = '';
    s += F.r(P, 230, 30, 200, 90, { rx: 14, fill: P.youSoft, stroke: P.you, sw: 1.6 }); s += F.t(P, 330, 60, 'HLP', { anchor: 'middle', weight: 800, size: 16, fill: P.you }); s += F.t(P, 330, 80, 'Hyperliquidity Provider', { anchor: 'middle', size: 11, fill: P.muted }); s += F.t(P, 330, 100, 'community-owned vault', { anchor: 'middle', size: 11, fill: P.muted });
    const job = (x, title, sub) => { s += F.r(P, x, 160, 190, 60, { rx: 10, fill: P.surf, stroke: P.line, sw: 1.3 }); s += F.t(P, x + 95, 184, title, { anchor: 'middle', weight: 800, size: 11.5 }); s += F.t(P, x + 95, 204, sub, { anchor: 'middle', size: 10, fill: P.muted }); s += F.l(P, 330, 120, x + 95, 158, { stroke: P.muted, sw: 1.3, arrow: 'muted', id }); };
    job(20, 'market making', 'quotes on the books, both sides'); job(235, 'backstop liquidations', 'inherits positions the book cannot'); job(450, 'supplies USDC to Earn', 'lends idle collateral');
    s += F.l(P, 150, 108, 228, 108, { stroke: P.bid, sw: 1.4, arrow: 'bid', id }); s += F.t(P, 20, 56, 'depositors’ USDC', { size: 11, weight: 700, fill: P.bid }); s += F.t(P, 20, 72, 'share the PnL; 4-day lock', { size: 10, fill: P.muted }); s += F.t(P, 20, 86, 'from the last deposit', { size: 10, fill: P.muted });
    s += F.l(P, 510, 108, 432, 108, { stroke: P.bid, sw: 1.4, arrow: 'bid', id }); s += F.t(P, 640, 56, 'a share of trading fees', { size: 11, weight: 700, fill: P.bid, anchor: 'end' }); s += F.t(P, 640, 72, 'every fee you pay feeds it', { size: 10, fill: P.muted, anchor: 'end' });
    s += F.t(P, 330, 246, 'when your liquidation goes to the backstop, HLP is who takes the other side. JELLY (Layer 4) is what happens when that is attacked.', { anchor: 'middle', size: 10.5, fill: P.muted });
    return s;
  });

  FIG['staking-flow'] = P => F.svg(P, 660, 190, 'HYPE moving between the spot account, the staking account and validators: transfers in are instant, delegation locks for one day, and moving back to spot takes a seven-day queue; a link to the trading account is permanent', id => {
    let s = '';
    s += F.box(P, 20, 50, 150, 70, 'spot account', ['HYPE you bought'], { size: 12 });
    s += F.l(P, 170, 75, 230, 75, { stroke: P.bid, sw: 1.5, arrow: 'bid', id }); s += F.t(P, 200, 66, 'instant', { anchor: 'middle', size: 10, fill: P.bid, weight: 700 });
    s += F.l(P, 230, 96, 170, 96, { stroke: P.ask, sw: 1.5, arrow: 'ask', id }); s += F.t(P, 200, 126, '7-day queue', { anchor: 'middle', size: 10, fill: P.ask, weight: 700 });
    s += F.box(P, 232, 50, 170, 70, 'staking account', ['fee discount applies here'], { size: 12, stroke: P.you });
    s += F.l(P, 402, 85, 462, 85, { stroke: P.muted, sw: 1.5, arrow: 'muted', id }); s += F.t(P, 432, 76, 'delegate', { anchor: 'middle', size: 10, fill: P.muted, weight: 700 }); s += F.t(P, 432, 104, '1-day lock', { anchor: 'middle', size: 9.5, fill: P.muted });
    s += F.box(P, 464, 50, 176, 70, 'validators', ['rewards ≈ 2.4% a year', 'at 400M staked'], { size: 12 });
    s += F.wrap(P, 20, 150, 'discounts: 5% at more than 10 HYPE up to 40% at more than 500,000. Linking a staking address to a trading address is permanent. Only worth it if you hold HYPE anyway.', 620, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  LESSONS['layer-8'] = {
    intro: 'Hyperliquid is more than the perps you have been trading. There are spot markets, perps on stocks and gold run by outside builders, yes-or-no markets, a community vault that makes markets and takes over failed liquidations, and staking. A manual trader needs to know what each piece is and, more importantly, exactly when it matters. For most of them the honest answer is: later, or never. This layer is a map with a few warning signs on it.',
    legend: 'In the pictures, blue is the part of the venue this course trades, amber is anything run by an outside deployer or an outside reference.',
    sections: [
      { id: 'venue-map', t: 'A map of the venue',
        p: ['Everything on HyperCore shares one margin engine and one consensus, which is why a fee discount from staking applies to perps, or why HLP can inherit a position from any market. The centre of the map is the set of validator-run perps, where this course lives. Around it: spot markets for native tokens (HIP-1 and HIP-2), HIP-3 perps deployed by builders, HIP-4 outcome markets, the vaults, and staking. HyperEVM, the app chain, sits outside all of it.',
          'The table below the lesson lists each piece with what it is and the one moment it matters to a manual trader.'],
        fig: 'venue-map', cap: 'The venue, with the course’s territory in blue. Everything else is context until Layer 7 is behind you.',
        key: 'One engine, many markets. You trade the validator-run perps; the rest is context with a few specific warnings.' },

      { id: 'hip3', t: 'HIP-3: TradFi perps with a private oracle',
        p: ['HIP-3 lets a builder who stakes 500,000 HYPE deploy their own perp exchange on HyperCore: stocks, indices, commodities, foreign exchange, pre-IPO names, trading 24/7 at a fraction of the main fee in **growth mode**, a setting for markets that do not compete with the main perps that cuts the all-in fee by at least 90% (a taker rate around 0.0045% to 0.009%). The largest deployer in late 2026 is trade.xyz. For a trader, the appeal is obvious: the S&P 500 or gold, on the same screen, with the same margin.',
          'The catch is who you are trusting. On a validator-run perp the oracle is a stake-weighted median of many validators reading eight exchanges. On a HIP-3 market the oracle is the deployer’s own feed, the leverage and margin mode are the deployer’s choice, most markets are isolated-only, and the deployer can halt the market at any time and settle every position at the current mark. Validators can slash the deployer’s stake afterwards, but the slashed HYPE is burned, not paid to the traders who were hurt. Read the deployer’s own documentation before touching their market.'],
        fig: 'hip3-trust', cap: 'Who you trust on each kind of market. The right-hand column is one operator.',
        check: { q: 'Who runs the oracle of a HIP-3 market, and what can they do with the market?', o: ['The validators; nothing beyond pricing', 'The deployer; they can also halt it and settle positions at mark', 'HLP; it can liquidate positions early'], a: 1, why: 'HIP-3 markets are defined and operated by their deployer, oracle included. The haltTrading action cancels orders and settles positions at the current mark price.' },
        key: 'HIP-3 markets are deployer-run: their oracle, their leverage, their right to halt and settle. Cheap fees do not change that.' },

      { id: 'skhynix', t: 'The SK Hynix case: a thin print and 960 accounts',
        p: ['In July 2026 a HIP-3 perp on SK Hynix, the Korean chip maker, liquidated about 960 long accounts, roughly 57 million dollars, while the stock itself barely moved. The deployer’s oracle had taken a thin pre-market print far below the previous price; the mark followed; the liquidation engine did its job on a price nobody else agreed with. On a validator-run market the median across exchanges would have ignored that print.',
          'This is the deployer-oracle risk from the previous section with a date on it, and the reason Layer 5 told you not to hold a HIP-3 position through its underlying’s open by accident. The news report is in the media list; no post-mortem from the deployer was published.'],
        fig: 'thin-print', cap: 'One thin print, one oracle, and a band of liquidation prices in between.',
        key: 'A single-source oracle can take a bad print and liquidate on it. Treat HIP-3 markets as what they are: someone else’s exchange.' },

      { id: 'hlp', t: 'HLP: the counterparty of last resort',
        p: ['**HLP**, the Hyperliquidity Provider, is a community-owned vault that does three jobs: it quotes on the books as a market maker, it takes over positions the book cannot absorb as the backstop liquidator (Layer 4), and it lends USDC through the app’s Earn feature. Anyone can deposit and share its PnL; deposits lock for four days from the most recent deposit; and a portion of every trading fee on the venue flows into it.',
          'Two things to know as a trader. When your liquidation goes to the backstop, HLP is who takes the other side, and the JELLY case in Layer 4 is what it looks like when someone aims a thin market at it. And as a place to park idle USDC it is a real option, with the usual caveats: it is a trading strategy with drawdowns, not a savings account.'],
        fig: 'hlp-role', cap: 'HLP’s three jobs, its two sources of money, and the four-day lock.',
        key: 'HLP market-makes, backstops liquidations and earns a share of fees. Deposits lock four days. It is the other side of a failed liquidation.' },

      { id: 'vaults', t: 'User vaults: copying someone else',
        p: ['Beyond HLP, any trader can open a vault that others deposit into, and the vault trades as one account: depositors copy the leader’s positions in proportion and pay a profit share on legacy vaults. The leaderboard makes it tempting. The course’s position is plain: not before Layer 7, and probably not after, because a vault teaches you nothing and the leaderboard shows last month’s winners, not next month’s. Builders can also create vaults on HyperEVM with custom accounting; the same advice applies.'],
        key: 'User vaults copy a leader for a profit share. They teach nothing. Not before Layer 7, if ever.' },

      { id: 'staking-referrals', t: 'Staking, referrals and points',
        p: ['Staking HYPE earns a small reward (around 2.4% a year at 400 million staked, falling as more is staked) and, more usefully, a trading fee discount from 5% at more than 10 HYPE up to 40% at more than 500,000. Transfers from spot to the staking account are instant; moving back to spot takes a seven-day queue. Linking a staking address to a different trading address is permanent. It is only worth it if you hold HYPE anyway; buying HYPE to save 5% on fees is a trade, not a discount.',
          'A referral code gives 4% off your first 25 million dollars of volume, so use one on day one. Points programmes come and go; ignore them, because they optimise for volume, which is the opposite of what a learner needs.'],
        fig: 'staking-flow', cap: 'Where HYPE moves and how long each move takes.',
        key: 'Stake only HYPE you would hold anyway. Use a referral code on day one. Ignore points.' },

      { id: 'delisting-hip4', t: 'Delisting, and outcome markets',
        p: ['Validators can vote to delist a perp. When they do, all positions settle to the 1-hour time-weighted oracle price before the delisting time and open orders are cancelled. It is a normal end for a market whose underlying has died, and the reason to check the announcements before holding a small-cap perp for weeks.',
          'HIP-4 outcome markets are yes-or-no contracts on the same engine, with fees charged only on close or settlement. They are event trades, a different discipline, and belong after Layer 7 if anywhere.'],
        key: 'Delisting settles positions at a 1-hour oracle average. Outcome markets are event trades for later.' },

      { id: 'when-to-care', t: 'When a manual trader should care',
        p: ['Here is the whole layer as a decision list. Spot: when you want HYPE for the fee discount or to hedge a perp with the coin. HIP-3: when you understand that you are trading on one deployer’s oracle and have read their docs, and only after two blocks of twenty trades on the main perps that were both profitable and above 90% adherence. HLP: as a place for idle USDC, knowing it can draw down. User vaults: no. Staking: if you hold HYPE anyway. Referral code: day one. Points: never. Delisting: check announcements before a long hold in a small market. HyperEVM, sub-accounts and API wallets: later, if ever.',
          'The pass check asks you to explain HIP-3 oracle risk to someone else and why you learned on validator-run perps first. If you can give the SK Hynix story in three sentences, you have passed.'],
        key: 'Most of the venue is “later or never” for a manual trader. The exceptions are a referral code, maybe HYPE, and knowing who runs the oracle.' }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
