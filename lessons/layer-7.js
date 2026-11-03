/* Layer 7 · Plan, journal, review, psychology: lesson text and figures.
   The process here is the course’s own; the psychology section paraphrases Mark Douglas’s five fundamental truths. */
(function (root) {
  'use strict';
  const F = root.FigLib, FIG = root.FIG || (root.FIG = {}), LESSONS = root.LESSONS || (root.LESSONS = {});

  FIG['decision-timeline'] = P => F.svg(P, 660, 240, 'A trade drawn as a timeline: the decisions a plan makes before entry sit above the line in blue, and the decisions an unplanned trader makes in the moment sit below the line crossed out in red', id => {
    let s = ''; const x0 = 40, x1 = 620, y = 120;
    s += F.l(P, x0, y, x1, y, { stroke: P.line, sw: 2, arrow: 'muted', id });
    s += F.c(P, 200, y, 6, { fill: P.you }); s += F.t(P, 200, y + 22, 'entry', { anchor: 'middle', size: 10.5, fill: P.you, weight: 700 });
    s += F.c(P, 520, y, 6, { fill: P.ink }); s += F.t(P, 520, y + 22, 'exit', { anchor: 'middle', size: 10.5, weight: 700 });
    s += F.t(P, x0, 28, 'decided before the trade, when you are calm', { size: 11.5, weight: 800, fill: P.you });
    ['setup', 'entry price', 'stop', 'target', 'size from risk', 'time stop', 'early-exit rule'].forEach((d, i) => { const x = x0 + i * 82; s += F.r(P, x, 40, 76, 26, { rx: 7, fill: P.youSoft }); s += F.t(P, x + 38, 57, d, { anchor: 'middle', size: 10, fill: P.you, weight: 700 }); s += F.l(P, x + 38, 66, x + 38, y - 10, { stroke: P.grid, sw: 1, dash: '2 3' }); });
    s += F.t(P, x0, 170, 'decided in the moment, with money on the line', { size: 11.5, weight: 800, fill: P.ask });
    ['“move the stop a bit”', '“add, it will come back”', '“take profit now”', '“one more trade to get it back”'].forEach((d, i) => { const x = x0 + i * 148; s += F.r(P, x, 182, 140, 26, { rx: 7, fill: P.askSoft }); s += F.t(P, x + 70, 199, d, { anchor: 'middle', size: 10, fill: P.ask, weight: 700 }); s += F.l(P, x + 8, 208, x + 132, 182, { stroke: P.ask, sw: 1.5 }); });
    s += F.t(P, x0, 230, 'every rule in this layer exists to move one decision from the second row to the first', { size: 10.5, fill: P.muted });
    return s;
  });

  FIG['plan-card'] = P => F.svg(P, 660, 270, 'A filled-in trade plan card with seven lines: setup, entry, invalidation, target, size from risk, time stop and early exit, using the worked numbers from Layer 4', id => {
    let s = '';
    s += F.r(P, 20, 16, 620, 240, { rx: 14, fill: P.surf, stroke: P.line, sw: 1.3 });
    s += F.t(P, 36, 42, 'Trade plan · BTC long · 3 Nov 2026, 19:10 IST', { weight: 800, size: 13 });
    const rows = [['Setup', '4-hour higher low retest at 76,200 after a daily close above it'], ['Entry', 'limit buy 0.0222 BTC at 76,350 (resting, maker)'], ['Invalidation', 'stop at 75,900: a 4-hour close below the last higher low. Market stop, reduce-only'], ['Target', '77,700, three times the stop distance; take-profit limit, reduce-only'], ['Size', '$10 risk (1% of $1,000) ÷ $450 stop = 0.0222 BTC · $1,696 notional · $339 margin at 5x'], ['Time stop', 'out at the next 00:00 UTC close if neither level has been reached'], ['Early exit', 'a 4-hour close back below 76,200 before the target: exit, whatever the PnL']];
    rows.forEach((r, i) => { const y = 70 + i * 26; s += F.t(P, 36, y, r[0], { size: 11.5, weight: 800, fill: P.you }); s += F.t(P, 130, y, r[1], { size: 11, fill: P.ink }); s += F.l(P, 36, y + 9, 624, y + 9, { stroke: P.grid }); });
    s += F.t(P, 36, 248, 'seven lines. If any of them is blank, there is no trade.', { size: 10.5, fill: P.muted, weight: 700 });
    return s;
  });

  FIG['r-ruler'] = P => F.svg(P, 660, 190, 'A price ruler marked in R units: the stop at minus one R, the entry at zero, and the target at plus three R; a note says one three-R winner pays for three one-R losers', id => {
    let s = ''; const x0 = 60, x1 = 600; const X = r => x0 + (r + 1.5) / 5 * (x1 - x0); const y = 90;
    s += F.l(P, x0, y, x1, y, { stroke: P.line, sw: 2 });
    [[-1, 'stop', '−1R = −$10', P.ask], [0, 'entry', '0', P.you], [1, '', '+1R', P.muted], [2, '', '+2R', P.muted], [3, 'target', '+3R = +$30', P.bid]].forEach(m => { s += F.l(P, X(m[0]), y - 12, X(m[0]), y + 12, { stroke: m[3], sw: m[1] ? 2.5 : 1.2 }); s += F.t(P, X(m[0]), y + 30, m[2], { anchor: 'middle', size: 11, mono: true, fill: m[3], weight: m[1] ? 700 : 500 }); if (m[1]) s += F.t(P, X(m[0]), y - 20, m[1], { anchor: 'middle', size: 11, weight: 800, fill: m[3] }); });
    s += F.r(P, X(-1), y - 6, X(0) - X(-1), 12, { rx: 3, fill: P.askSoft }); s += F.r(P, X(0), y - 6, X(3) - X(0), 12, { rx: 3, fill: P.bidSoft });
    s += F.t(P, x0, 30, '1R = the dollars you lose if the stop is hit. Every result is written as a multiple of it.', { size: 11.5, weight: 700 });
    s += F.wrap(P, x0, 154, 'a +3R winner pays for three −1R losers. At $10 of risk that is +$30 against −$30; at $1,000 of risk the same trade is +$3,000 against −$3,000. Same trade, same R.', 540, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  FIG['expectancy-dist'] = P => F.svg(P, 660, 280, 'A histogram of the total R earned in two hundred simulated blocks of twenty trades for a system that wins forty-five percent of the time with two-R winners and one-R losers; most blocks are positive, a meaningful minority are negative', id => {
    let s = ''; const bins = [[-14, 2], [-10, 6], [-6, 14], [-2, 26], [2, 38], [6, 42], [10, 34], [14, 22], [18, 10], [22, 5], [26, 1]];
    const x0 = 60, x1 = 620, y0 = 40, y1 = 210; const bw = (x1 - x0) / bins.length; const maxN = 42;
    bins.forEach((b, i) => { const h = b[1] / maxN * (y1 - y0); const neg = b[0] < 0; s += F.r(P, x0 + i * bw + 4, y1 - h, bw - 8, h, { rx: 4, fill: neg ? P.ask : P.bid, op: .8 }); s += F.t(P, x0 + i * bw + bw / 2, y1 + 16, (b[0] > 0 ? '+' : '') + b[0] + 'R', { anchor: 'middle', size: 9.5, mono: true, fill: P.muted }); });
    s += F.l(P, x0, y1, x1, y1, { stroke: P.line, sw: 1.5 });
    s += F.t(P, x0, 26, 'total R per block of 20 trades · 45% win rate · winners +2R · losers −1R · expectancy +0.35R per trade, +7R per block', { size: 11, weight: 700 });
    s += F.t(P, x0, 248, 'about one block in seven loses money even though the system is sound. One trade says nothing; one block says a little; three blocks say something.', { size: 10.5, fill: P.muted });
    s += F.t(P, x0, 266, 'the sandbox runs this simulation live with your own numbers', { size: 10.5, fill: P.you, weight: 700 });
    return s;
  });

  FIG['journal-row'] = P => F.svg(P, 660, 256, 'One journal entry drawn as a row of fields: when, market, setup, side, entry, stop, target, size, exit, fees, funding, the result in R, the adherence grade kept separate from PnL, the exit reason and one lesson', id => {
    let s = '';
    const fields = [['when', '03/11 19:12 IST'], ['market', 'BTC'], ['setup', '4h HL retest'], ['side', 'long'], ['entry', '76,350'], ['stop', '75,900'], ['target', '77,700'], ['size', '0.0222'], ['exit', '77,700'], ['fees', '0.64'], ['funding', '0.11'], ['R', '+2.95'], ['grade', 'A'], ['reason', 'target'], ['lesson', 'waited for the 4h close; no fiddling']];
    let x = 20, y = 40;
    fields.forEach((f, i) => { const w = Math.max(54, f[1].length * 7.2 + 18); if (x + w > 640) { x = 20; y += 58; } const isR = f[0] === 'R', isG = f[0] === 'grade'; s += F.r(P, x, y, w, 40, { rx: 8, fill: isG ? P.youSoft : (isR ? P.bidSoft : P.surf), stroke: isG ? P.you : P.line, sw: 1.2 }); s += F.t(P, x + 8, y + 15, f[0], { size: 9, fill: P.muted, weight: 700 }); s += F.t(P, x + 8, y + 31, f[1], { size: 11, mono: true, weight: 700, fill: isR ? P.bid : (isG ? P.you : P.ink) }); x += w + 6; });
    s += F.wrap(P, 20, y + 62, 'the grade is for following the plan, not for making money: an A on a −1R trade is a good trade; a C on a +3R trade is a lucky one. The Journal page computes R net of fees and funding and judges each block of 20.', 620, { size: 10.5, fill: P.muted, lh: 13 }).s;
    return s;
  });

  FIG['review-loop'] = P => F.svg(P, 660, 230, 'A loop: twenty journaled trades feed a thirty-minute weekly review that reads expectancy and adherence, names the best and worst trade and changes at most one rule, which feeds the next block; nothing else changes between reviews', id => {
    let s = '';
    s += F.box(P, 30, 70, 170, 80, '20 trades', ['every one journaled', 'and graded'], { size: 13, stroke: P.you });
    s += F.l(P, 200, 110, 240, 110, { stroke: P.ink, sw: 1.6, arrow: 'ink', id });
    s += F.box(P, 242, 40, 200, 140, 'the review, 30 minutes', ['expectancy and adherence', 'the best and the worst trade', 'why each went the way it did', 'one rule to add or remove'], { size: 13, stroke: P.ink });
    s += F.l(P, 442, 110, 482, 110, { stroke: P.ink, sw: 1.6, arrow: 'ink', id });
    s += F.box(P, 484, 70, 150, 80, 'next block', ['same plan, one', 'rule different'], { size: 13, stroke: P.bid });
    s += F.p(P, 'M559 150 C559 215 115 215 115 152', { stroke: P.muted, sw: 1.3, dash: '5 4', arrow: 'muted', id });
    s += F.t(P, 330, 212, 'nothing else changes between reviews. Not the risk, not the setups, not the size.', { anchor: 'middle', size: 11, fill: P.muted, weight: 700 });
    return s;
  });

  FIG['graduation-ladder'] = P => F.svg(P, 660, 250, 'Four steps up: twenty planned testnet trades, then mainnet at ten-dollar orders with half-percent risk, then risk raised toward one percent after a positive block with over ninety percent adherence, then HIP-3 markets and hyperps only after two such blocks', id => {
    let s = '';
    const steps = [['1 · testnet', '20 planned trades, journaled and graded', 'expectancy and adherence computed'], ['2 · mainnet, min size', '$10 orders, isolated, 0.5% risk, 20 trades', 'fees and funding are real now'], ['3 · raise the risk', 'toward 1% only after a block that is positive', 'and above 90% adherence'], ['4 · widen the markets', 'HIP-3 and hyperps only after two such blocks', 'on the main validator-run perps']];
    steps.forEach((st, i) => { const x = 20 + i * 158, y = 150 - i * 36; s += F.r(P, x, y, 150, 100 + i * 36 - 10, { rx: 10, fill: i === 3 ? P.youSoft : P.surf, stroke: i === 3 ? P.you : P.line, sw: 1.3 }); s += F.t(P, x + 10, y + 20, st[0], { size: 11.5, weight: 800 }); s += F.wrap(P, x + 10, y + 38, st[1], 132, { size: 10, fill: P.muted, lh: 12 }).s; s += F.wrap(P, x + 10, y + 66, st[2], 132, { size: 10, fill: P.muted, lh: 12 }).s; });
    s += F.t(P, 20, 30, 'a step is earned by a block, never by a calendar', { size: 11.5, weight: 800, fill: P.you });
    return s;
  });

  LESSONS['layer-7'] = {
    intro: 'Everything before this layer was a component. This is the application: a written plan, a fixed amount of risk, a journal, and a review every twenty trades. It is the layer most people skip because it looks like paperwork, and it is the layer that separates the people who are still trading in a year from the people who are not. There are no new exchange mechanics here. There is one idea, repeated in six forms: take decisions out of the moment.',
    legend: 'In the pictures, blue is a decision made in advance or a rule, red is a decision made in the moment, green is a result.',
    sections: [
      { id: 'unplanned', t: 'The enemy is unplanned decisions',
        p: ['Fear and greed get the blame, but they are symptoms. The disease is making decisions with money on the line: where the stop goes, whether to add, whether to take profit early, whether to try one more trade. Each of those decisions, made in the moment, is made by the worst version of you: tired, excited, anchored to the last tick.',
          'The plan is not a prediction. It is a list of decisions moved to a calm moment, before the trade, when you can still think. Every rule in this layer exists to move exactly one decision from the heat of the moment to the plan, where it is cheap.'],
        fig: 'decision-timeline', cap: 'The same trade with its decisions in two places. The plan empties the second row.',
        key: 'The plan is a list of decisions made in advance. Its job is to leave nothing to decide while the trade is open.' },

      { id: 'plan-card', t: 'The plan, one line each',
        p: ['A plan is seven lines. **Setup**: the pattern or condition you are trading, named so you can count it later. **Entry**: the price and order type. **Invalidation**: the price at which the idea is wrong, which Layer 6 gave you and which is where the stop goes. **Target**: where you take profit, usually a multiple of the stop distance. **Size**: from risk, as Layer 4 taught; never from leverage. **Time stop**: when you leave if nothing has happened. **Early exit**: the condition short of the stop that means the idea has already failed.',
          'Write it before the order, not after. If any line is blank, there is no trade; that is the whole test. The card below uses the worked numbers from Layer 4.'],
        fig: 'plan-card', cap: 'A filled plan. Seven lines, written before the order, with the size computed from the stop.',
        key: 'Setup, entry, invalidation, target, size, time stop, early exit. Blank line, no trade.' },

      { id: 'r-unit', t: 'R: the unit that makes trades comparable',
        p: ['Record results in **R**, not dollars. 1R is the dollars at risk on the trade, the distance from entry to stop times the size. A trade that hits its stop is −1R; one that reaches a target three stop-distances away is +3R. The unit makes trades comparable across markets, sizes and account growth: a +2R on a 1,000-dollar account and a +2R on a 100,000-dollar account are the same trade, and your statistics stay meaningful as the account changes.',
          'It also fixes the question people argue about for years, “what win rate do I need?”. With 1R losers and 3R winners you can lose two trades in three and make money. The Journal page here computes R for every trade, net of the fees and funding you enter.'],
        fig: 'r-ruler', cap: 'A ruler in R. The stop is −1R by definition; targets are set in multiples of it.',
        check: { q: 'Your entry is 76,350, your stop 75,900 and your size 0.0222 BTC. You exit at 77,250. Result in R?', o: ['+2.0R', '+0.9R', '+9R'], a: 0, why: '1R is (76,350 − 75,900) × 0.0222 = $10. The exit is 900 above entry, which is 2.0 stop distances, so +2R before fees.' },
        key: '1R = the dollars at risk on the trade. Results in R are comparable across sizes, markets and time.' },

      { id: 'expectancy', t: 'Expectancy, and why one trade says nothing', try: 'expectancy-sim', figDocs: 'expectancy-dist',
        p: ['**Expectancy** is the average R you make per trade: win rate × average win − loss rate × average loss. A system that wins 45% of the time with +2R winners and −1R losers has an expectancy of 0.45 × 2 − 0.55 × 1 = +0.35R per trade, which is excellent. It also loses money in about one block of twenty out of seven, purely by chance, and has losing streaks of five or six in a row every few hundred trades.',
          'That is why the course judges everything in blocks of 20 trades and never on a single trade. A trade is a coin flip with a slightly bent coin; a block is a sample. Run the simulation below with your own numbers and look at the spread of block results. Then look at the worst losing streak. That streak will happen to you, and the plan must survive it, which is where the 1% risk rule comes from.'],
        tryNote: 'Set a win rate and the average win and loss in R, then run two hundred blocks. Notice how many blocks lose with a positive expectancy, and how long the losing streaks get.',
        key: 'Expectancy = win rate × average win − loss rate × average loss, in R. Judge it over blocks of 20. Plan for the losing streak.' },

      { id: 'rules', t: 'Hard rules',
        p: ['These are the rules that do not get reviewed. They are the floor under everything else.'],
        list: ['At most 1% of the account at risk per trade; 0.5% for the first mainnet block.', 'Stop for the day at −3R. Close the screen.', 'A maximum number of trades per day, written down. Three is a good start.', 'No new trade within 15 minutes of a scheduled release unless the release is the plan.', 'Never add size after a loss. Never widen a stop.', 'Flat before the weekend unless the weekend is the plan.', 'Reduce-only on every exit order, and a stop on every position: attached to the entry order when the form allows it, placed by hand the moment the entry fills when it does not.'],
        key: 'Seven hard rules that do not get reviewed. They exist so that the worst streak is survivable.' },

      { id: 'journal', t: 'The journal and the grade',
        p: ['The journal is the plan plus what happened. Date and time in IST and UTC, market, setup, direction, entry, stop, target, size, exit, fees, funding paid, the result in R, the exit reason, a screenshot before and after, and one lesson. And a **grade** for plan adherence, A, B or C, kept strictly separate from the PnL: an A on a −1R trade is a good trade, a C on a +3R trade is a lucky one. Over a block, the share of A grades, the adherence, is the number that tells you whether you are trading the plan or trading your feelings.',
          'The [Journal page](#journal) on this site has every field, computes R net of fees and funding, and judges each block of 20 by expectancy and adherence. The first drill is to back-fill your last five testnet trades into it, to learn the fields before they matter.'],
        fig: 'journal-row', cap: 'One entry, every field. The grade is for adherence, never for the result.',
        key: 'Journal every trade with a grade for adherence kept separate from PnL. Adherence over a block is the number that matters.' },

      { id: 'review', t: 'The weekly review loop',
        p: ['Once a week, thirty minutes, with the journal open: the block’s expectancy and adherence so far, the best trade and the worst trade and why each went the way it did, and one rule to add or remove. One. Then nothing else changes until the next review: not the risk, not the setups, not the size. The temptation to redesign the plan after every losing day is the same unplanned decision from the first section wearing a lab coat.',
          'Why one rule at a time: a block of 20 is a small sample, and if you change three things at once you will never know which one mattered.'],
        fig: 'review-loop', cap: 'Twenty trades, one review, one change, twenty more.',
        key: 'Review weekly for thirty minutes. Change one rule at most. Between reviews, change nothing.' },

      { id: 'graduation', t: 'Graduation: testnet to mainnet',
        p: ['The ladder is earned by blocks, not by dates. Twenty planned testnet trades, every one journaled and graded, with the expectancy and adherence read off the Journal page. Then mainnet at the minimum size, 10-dollar orders, isolated margin, 0.5% risk, for twenty more. Raise risk toward 1% only after a block that is both positive and above 90% adherence. Add HIP-3 markets or hyperps only after two such blocks on the main perps.',
          'The pass check for the whole layer, and in a sense the whole course, is two consecutive blocks above 90% adherence, whatever the PnL says. PnL follows adherence with a lag; adherence does not follow PnL at all.'],
        fig: 'graduation-ladder', cap: 'Four steps, each earned by a block of twenty.',
        key: 'Testnet block, then mainnet at minimum size, then more risk after a positive block with 90% adherence. Dates earn nothing.' },

      { id: 'psychology', t: 'Five truths and one habit',
        p: ['Mark Douglas, whose seminar and book are in the media list for this layer, reduced trading psychology to five truths. Anything can happen. You do not need to know what will happen next to make money. Wins and losses are randomly distributed for any set of variables that define an edge. An edge is nothing more than a higher probability of one thing happening over another. Every moment in the market is unique.',
          'Read them against the sandbox you just ran. A positive expectancy with random ordering is exactly what the five truths describe, and the plan is how you act on them: you take every valid setup at fixed risk because any single outcome is noise and only the block is signal. The habit that follows is simple to say and takes a year to build: trade the plan, grade the adherence, and let the PnL be a by-product.'],
        key: 'Anything can happen; the edge is only a probability; the order of wins and losses is random. So trade the plan and grade the adherence.' }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
