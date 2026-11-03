# Hyperliquid Bootcamp: the curriculum

As of 3 Nov 2026. Official docs links come from the Hyperliquid GitBook sitemap and the pages that carry numbers were opened that day. The interactive version of this file, with a live market clock, calculators, quizzes and a journal, is `index.html` in this repository.

## How to use this

This is a stack, not a reading list: ten layers, each a skill the next one assumes, the way HTML comes before CSS, CSS before JavaScript, and React before Next.js. Layer 0 is the order book. Layer 7 is you running a written trade plan with a journal. Nothing in between is optional, and nothing after Layer 7 is required to be a competent manual trader.

Each layer has the same shape: **Goal** (what you can do afterwards), **the surprise** (the one thing in the layer that changes how you trade), **Concepts** (the ideas, in order), **Read** (official Hyperliquid docs first, then the vetted media for that layer), **Do** (a hands-on drill, on testnet until Layer 7), and **Passed when** (a concrete check). Do the drill before moving on; reading alone does not transfer.

Pace: 8 weeks at 5 to 8 hours a week. Prerequisites: a wallet you control (MetaMask or Rabby), a browser, and comfort reading a basic price chart. The testnet faucet only pays an address that has deposited on mainnet, so day one needs a one-time deposit of about 10 USDC. Nothing else is at risk before Layer 7, and even then the plan starts at the smallest size the exchange allows.

Ground rules:

- Testnet first. Every drill runs on [app.hyperliquid-testnet.xyz](https://app.hyperliquid-testnet.xyz) with faucet USDC until the schedule says otherwise.
- Official docs win. Third-party explainers are linked for intuition; when they disagree with [hyperliquid.gitbook.io/hyperliquid-docs](https://hyperliquid.gitbook.io/hyperliquid-docs), the docs are right.
- Exchange clocks are UTC. The calendar in Layer 5 is written for IST (UTC+5:30); shift it for your own zone.
- Journal from the first testnet order. Layer 7 is built on that journal.

## Layer 0 · The order book (the HTML of the stack)

**Goal.** Read a live book and know, before you click, the price you will get and what it will cost.

> Most of what traders later call manipulation is just depth. A market order does not have a price. It has a path through the book.

### Concepts, in order

- Bid, ask, spread, mid. The spread is your first cost. On BTC it is usually one tick.
- Depth: the size resting at each level. A market order walks through levels, and the walk is slippage.
- Maker and taker. A limit order that rests is a maker and pays 0.015% at the base tier. Anything that crosses the spread is a taker and pays 0.045%. Market orders are always takers.
- Price-time priority: at one price, the earliest order fills first. Cancel and re-place and you go to the back of the queue.
- Tick and lot: prices must be multiples of the tick (perp prices carry at most 5 significant figures), sizes multiples of the lot, and every order is worth at least $10. Wrong rounding is rejected, not fixed.
- Candles and volume are the book’s history: a candle is the open, high, low and close of the trades in its window; volume is how much size crossed.

### Read: official docs

- [Order book (trading rules)](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-book)
- [Order book under HyperCore (why it is on-chain, how orders are sequenced)](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/order-book)
- [Tick and lot size](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/tick-and-lot-size)

### Media for this layer

- **book** · Trading and Exchanges · Larry Harris, 2003
  Market microstructure for practitioners. Chapters 1 to 6 for why books behave as they do. Optional depth.

### Do

- [ ] Open BTC, then HYPE, on testnet. Watch each book for 10 minutes. Write down the spread, the size at the top three levels, and how often the best bid changes.
- [ ] Place a limit buy 1% below mid, then a market buy of the same size. Compare the fill price with the ask you saw, and the fee on each fill in trade history.
- [ ] Place a Post Only buy at the best ask. The rejection message is the maker/taker line in one sentence.

**Passed when:** For any order you are about to send, you can say whether it is maker or taker, what that costs, and roughly how far a market order of that size would move the price.

### Check yourself

1. A market buy larger than the size at the best ask fills at:
   - a) The best ask only
   - b) Successively worse levels until it is done
   - c) The mid price
2. Which order pays the maker fee?
   - a) A market order
   - b) A limit order that rests and later fills
   - c) An IOC order
3. Two orders at the same price. Who fills first?
   - a) The larger one
   - b) The earlier one
   - c) Random
4. Minimum order value on Hyperliquid:
   - a) $1
   - b) $10
   - c) $100
5. A Post Only buy placed at the best ask is:
   - a) Filled immediately
   - b) Rejected
   - c) Rested at the best bid

## Layer 1 · Perpetuals (the CSS of the stack)

**Goal.** Know what a perp is as a contract, and compute notional, margin, entry price and PnL by hand.

> A perp is a futures contract that never settles. Funding, not expiry, keeps it near spot, and everything odd about perps follows from that one substitution.

### Concepts, in order

- Spot: you own the coin. Dated future: a contract to settle on a date; it trades above or below spot (the basis) and converges at expiry. Perp: a future with no date; an hourly payment between longs and shorts (Layer 3) replaces convergence.
- Long and short are symmetric. A short is a position whose PnL rises as price falls. Nothing is borrowed, nothing is lent.
- Notional = size × price. Margin = what you post. Leverage = notional / margin. On Hyperliquid leverage is an integer from 1 to the asset’s maximum (BTC 40x, ETH 25x, SOL 20x, HYPE and most alts 10x as of November 2026) and is checked only when you open.
- Entry price is the size-weighted average of your opening fills; closing fills never change it. Unrealized PnL = side × (mark − entry) × size, with side +1 for a long and −1 for a short. Closed PnL includes the fee.
- Collateral is USDC but most oracle prices are quoted in USDT, so contracts are technically quanto. That is the tiny permanent gap between mark and the spot price you see elsewhere.
- Why perps won crypto: no expiry to roll, one book per asset, leverage both ways, 24/7.

### Read: official docs

- [Perpetual assets](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/perpetual-assets)
- [Contract specifications](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/contract-specifications)
- [Entry price and PnL](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/entry-price-and-pnl)
- [Hyperliquid 101 for non-crypto audiences](https://hyperliquid.gitbook.io/hyperliquid-docs/about-hyperliquid/hyperliquid-101-for-non-crypto-audiences)

### Media for this layer

- **article** · [Perpetuals 101](https://thiccy.substack.com/p/perpetuals-101) · Thiccy (Substack), Jun 2023, 4 min
  The cleanest short explanation of why a perp needs funding and how basis arbitrage pulls it back to the index. Read it before the Hyperliquid docs, then read the docs for the exact formulas.
  _opened 3 Nov 2026_ · _No promotion, no paywall_ · _One worked example has a $5 vs $1 typo; the logic is right_
- **podcast** · [Jeff Yan on how Hyperliquid works, Bloomberg Odd Lots](https://podscripts.co/podcasts/odd-lots/jeff-yans-plan-to-bring-the-entire-financial-industry-onto-hyperliquid) · Joe Weisenthal and Tracy Alloway, 15 Oct 2026
  The founder explaining the order book, collateral, oracle-tracked contracts, funding and the validator set to a non-crypto audience. The best single hour of context for Layers 1 to 3.
  _opened 3 Nov 2026_ · _Transcript link; the audio is on any podcast app under Odd Lots_ · _Also on Bloomberg video, same date_
- **interview** · [Exclusive interview with Hyperliquid founder Jeff](https://wublock.substack.com/p/exclusive-interview-with-hyperliquid) · WuBlockchain (Colin Wu), 17 Aug 2025, text
  Why the team is small, why there was no venture or market-maker deal, and why the core is meant to run itself. Explains the design choices you will trade against.
  _opened 3 Nov 2026_ · _Free, no paywall seen_
- **podcast** · [Jeff Yan on Hyperliquid’s plan to bring all finance onchain, Empire](https://blockworks.com/podcast/empire/bc375300-c276-11f1-925c-cbee0c7ea3ff) · Blockworks, 7 Oct 2026, about 30 min
  Institutional access, the cost of speed, options and whether transparent books give better execution. Listen after Odd Lots if you want the builder-side view.
  _opened 3 Nov 2026_ · _Episode page carries conference discount codes; no product pitch in the content_

### Do

- [ ] Open a 0.01 BTC long and a 0.5 SOL short at 3x on testnet. Before looking at the position panel, compute notional, margin, and PnL at +1% and −1%. Check.
- [ ] Add to the long at a different price. Recompute the entry price by hand. Check.
- [ ] Close half the long. Confirm the entry price did not move and that closed PnL includes the fee.

**Passed when:** You can fill in notional, margin, leverage, entry and PnL for any position from the fills alone.

### Check yourself

1. A perp differs from a dated future mainly because:
   - a) It has no expiry and funding keeps it near spot
   - b) It allows less leverage
   - c) It settles every day
2. Notional of 0.5 BTC at $80,000:
   - a) $40,000
   - b) $160,000
   - c) $20,000
3. Your entry price changes on:
   - a) Closing fills
   - b) Opening fills
   - c) Funding payments
4. Unrealized PnL on Hyperliquid is computed from:
   - a) Last trade
   - b) Mark price
   - c) Oracle price
5. On Hyperliquid, leverage is checked:
   - a) Continuously
   - b) Only when you open or increase a position
   - c) At each funding print

## Layer 2 · The Hyperliquid machine (the JavaScript of the stack)

**Goal.** Use every part of the trading screen on purpose, and know what each order type does under stress.

> Trading is gas-free and the response you get back is the committed result, not a promise. Because the book is on-chain, every position and liquidation is public, which Layer 6 uses.

Hyperliquid is its own L1 with two halves: HyperCore (the on-chain order books, margin engine, spot and staking) and HyperEVM (an EVM for apps). You never need HyperEVM to trade. Oracle prices update about every 3 seconds and the chain handles around 200,000 orders a second.

### Setup, once

1. Wallet: Rabby or MetaMask, a fresh wallet used only for this, seed phrase offline. Email login works but gives different addresses on mainnet and testnet, so use a wallet.
2. Mainnet: deposit about 10 USDC on Arbitrum (keep a little ETH there for gas). The first deposit pays a 1 USDC activation fee. This unlocks the testnet faucet.
3. Testnet: app.hyperliquid-testnet.xyz/drip pays 1,000 mock USDC to an address that has deposited on mainnet.
4. Click Enable Trading and sign the gas-free message. Withdrawals back to Arbitrum cost $1 and take a few minutes.

### Order types

| Type | What it does | The rule to remember |
| --- | --- | --- |
| Market | Fills now against the book | Always a taker; set your slippage tolerance |
| Limit (GTC) | Rests until filled or cancelled | Maker if it rests, taker if it crosses |
| Post Only (ALO) | Rests, or is rejected | Never pays the taker fee |
| IOC | Fills what it can now, cancels the rest | The honest market order |
| Reduce Only | Can only shrink a position | Use it on every exit |
| Stop market / stop limit | Fires when mark hits the trigger | Long triggers sit above mid, short below |
| Take market / take limit | Fires when mark hits the trigger | The opposite rule |
| TP/SL on a position | Market order on trigger, 10% slippage tolerance, mark-triggered | Use a limit TP/SL to choose your own slippage |
| Trailing stop | Follows the best mark by a distance or percent | Perps only; never moves backwards |
| Scale | A ladder of limits across a price range | Spreads entries without babysitting |
| TWAP | Slices every 30 s or more, 5 min to 7 days, $100 minimum, 3% slippage per slice | Catch-up slices grow to 3x; pauses during network upgrades |
| Chase | Post Only that re-prices to the best bid or ask | Runs in your browser tab; 5 at a time |

### Fees

0.045% taker and 0.015% maker at tier 0; spot 0.07% and 0.04%. Tiers step at $5M, $25M, $100M and $500M of 14-day volume (spot counts double), recomputed at the end of each UTC day. Staking HYPE discounts fees from 5% (more than 10 HYPE) to 40% (more than 500,000). A referral code discounts your first $25M of volume. Fees go to HLP and the assistance fund, not to a team.

### Read: official docs

- [How to start trading](https://hyperliquid.gitbook.io/hyperliquid-docs/onboarding/how-to-start-trading)
- [Testnet faucet](https://hyperliquid.gitbook.io/hyperliquid-docs/onboarding/testnet-faucet)
- [Order types](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-types)
- [Take profit and stop loss orders](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/take-profit-and-stop-loss-orders-tp-sl)
- [Fees](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees)
- [Miscellaneous UI](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/miscellaneous-ui)
- [Portfolio graphs](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-graphs)
- [FAQ: My TP/SL did not execute correctly](https://hyperliquid.gitbook.io/hyperliquid-docs/support/faq/trade-outcome-looks-incorrect/my-tp-sl-did-not-execute-correctly)
- [FAQ: Why was my chase order canceled?](https://hyperliquid.gitbook.io/hyperliquid-docs/support/faq/trade-outcome-looks-incorrect/why-was-my-chase-order-canceled)
- [FAQ: Trailing stops](https://hyperliquid.gitbook.io/hyperliquid-docs/support/faq/trailing-stops)

### Media for this layer

- **official** · [@HyperliquidX on X](https://x.com/HyperliquidX) · Official account
  Upgrades, listings, delistings and incidents are posted here first. Follow it and turn on notifications; it is the only account you need for news.
  _seen in search results, not opened_ · _Impersonators DM people; the real account never DMs_
- **official** · [Hyperliquid Discord](https://discord.com/invite/hyperliquid) · Official community
  Announcements and support. Use the link in the app footer rather than any link in a search result or DM.
  _seen in search results, not opened_ · _Invite seen on a community wiki, not an official page; verify from app.hyperliquid.xyz_

### Do

- [ ] Execute every row of the order table once on testnet, each with a line on what you expected and what happened.
- [ ] Set a position TP/SL, then an order-tied (OCO) TP/SL. Cancel a partially filled parent and watch its children vanish. That is the rule that bites people.
- [ ] Find the fee on one fill in trade history and reconcile it to the schedule.

**Passed when:** You can place any row of the order table without reading, and you know which orders trigger on mark and which fill against the book.

### Check yourself

1. TP/SL orders on Hyperliquid trigger on:
   - a) Last traded price
   - b) Mark price
   - c) Oracle price
2. Slippage tolerance on a market TP/SL:
   - a) 1%
   - b) 10%
   - c) None, it is a limit
3. You cancel a partially filled parent order that has OCO children. The children:
   - a) Stay active
   - b) Are cancelled too
   - c) Are placed immediately
4. Tier-0 perps fees, taker and maker:
   - a) 0.045% and 0.015%
   - b) 0.10% and 0.02%
   - c) 0.02% and 0.00%
5. TWAP minimum total size and smallest slice interval:
   - a) $10 and 10 s
   - b) $100 and 30 s
   - c) $1,000 and 60 s

## Layer 3 · Prices and funding

**Goal.** Know which of the three prices does what, and compute what a position costs to hold.

> Your stop can fire at a price that never traded here. Triggers and liquidations use mark, and mark is built mostly from other exchanges.

### Concepts, in order

- Oracle price: every validator publishes, about every 3 seconds, a weighted median of spot prices on Binance (weight 3), OKX (2), Bybit (2), Kraken, KuCoin, Gate, MEXC and Hyperliquid (1 each). Used for funding and as one input to mark.
- Mark price: the median of three inputs. The oracle plus a 150-second average of Hyperliquid’s own premium; the median of best bid, best ask and last trade here; and a weighted median of the large CEX perp prices. Mark drives liquidations, TP/SL triggers and unrealized PnL.
- Mid and last: what the book shows. They can sit a few ticks from mark for minutes at a time.
- Funding: paid every hour on the hour as one eighth of an 8-hour rate. Rate = premium + clamp(0.01% − premium, −0.05%, +0.05%). The premium is sampled every 5 seconds and averaged over the hour, measured on impact prices (what 20,000 USDC of BTC or ETH, or 6,000 USDC of anything else, would move the book). Positive means longs pay shorts. Capped at 4% an hour. Paid on oracle notional, peer to peer, no fee taken. When the book sits at the oracle the rate is 0.00125% an hour, about 11% a year paid by longs.
- Open interest: total size held, counted once for both sides. It is the how-many-people-are-positioned counter; Layer 6 reads it together with price.
- Premium, or basis: perp price minus oracle. A persistent premium means crowded longs and expensive carry.
- Hyperps: pre-launch perps with no external oracle; mark is an 8-hour average of their own prints. A different animal. Leave them until you have a positive 20-trade block.

### Read: official docs

- [Robust price indices (mark price)](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/robust-price-indices)
- [Oracle](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/oracle)
- [Funding](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding)
- [Contract specifications](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/contract-specifications)
- [Hyperps](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/hyperps)

### Media for this layer

- **tool** · [Funding rates across exchanges](https://www.coinglass.com/FundingRate) · Coinglass
  The same coin on Hyperliquid, Binance, Bybit and OKX side by side. The comparison is the intuition for Layer 3.
  _opened 3 Nov 2026_ · _Basic view is free; Pro and API upsells exist_
- **tool** · [HyperScreener (the official stats destination)](https://hyperscreener.asxn.xyz/home) · ASXN, free
  stats.hyperliquid.xyz now redirects here. Volume, open interest, funding and HLP figures for the whole venue.
  _opened 3 Nov 2026_ · _Run by a validator and research firm; data, not opinion_

### Do

- [ ] For BTC and one alt, write down the hourly funding for 24 hours from the funding history tab. Compute what a $1,000 long would have paid (the funding tool on the Tools page does the arithmetic).
- [ ] Find a moment where mark and last differ by more than a tick and name which input moved.
- [ ] Hold a 1x long on testnet across a funding print and watch the payment land at :00 UTC.

**Passed when:** You can state what a position pays per day at today’s rate, and which price would trigger your stop.

### Check yourself

1. Hyperliquid pays funding every:
   - a) 8 hours
   - b) Hour
   - c) Day
2. Positive funding means:
   - a) Shorts pay longs
   - b) Longs pay shorts
   - c) The exchange pays both
3. The funding payment is computed on:
   - a) Mark notional
   - b) Oracle notional
   - c) Entry notional
4. Mark price is:
   - a) The last trade
   - b) The median of three inputs including CEX prices
   - c) The best bid
5. The fixed interest component of funding, per 8 hours:
   - a) 0.01%
   - b) 0.1%
   - c) 1%

## Layer 4 · Margin, liquidation and sizing (the React of the stack)

**Goal.** Never be surprised by a liquidation, and size every trade from risk rather than from leverage.

> Leverage does not change how much you make on a move. It changes how far away the cliff is.

### Concepts, in order

- Initial margin = notional / leverage. Maintenance margin = half the initial margin at the asset’s maximum leverage: 1.25% of notional on a 40x asset like BTC, 2% on 25x, 2.5% on 20x, 5% on 10x, up to 16.7% on 3x.
- Cross: all your USDC backs all cross positions, so one bad position can take the account. Isolated: only the margin you assigned, and a liquidation touches only that position. Learn on isolated.
- Liquidation price: liq = price − side × margin_available / size / (1 − side / maintenance_leverage), where margin_available is equity minus maintenance margin. Worked through the docs’ formula: 0.005 BTC long at 76,834 on isolated 5x liquidates about 19% lower; at 10x about 9% lower. The Tools page runs this for you.
- How a liquidation runs, all on mark price: equity below maintenance, and the engine sends a market order for the whole position (20% slices with a 30-second cooldown above 100k USDC, 10k on testnet). If equity falls below two thirds of maintenance, the backstop liquidator, a part of HLP, takes the position and its margin, and the maintenance margin is not returned. No clearance fee.
- ADL: if the backstop cannot absorb a position, the most profitable and most levered positions on the other side are closed against it at mark. You can be closed while winning. No position means no exposure.
- Unrealized profit is withdrawable only while remaining margin is at least the larger of initial margin and 10% of notional.
- Sizing: choose the stop first. Risk per trade = 0.5% to 1% of the account. Size = risk / distance to stop. Leverage is an output, not an input. Keep liquidation at least three times further away than the stop.

**Example.** Account 1,000, risk 1% = $10, stop 2% away, so notional is $500. On isolated 5x that is $100 of margin and a liquidation about 19% away, nine times the stop distance.

### Read: official docs

- [Margining](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/margining)
- [Margin tiers](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/margin-tiers)
- [Liquidations](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations)
- [Auto-deleveraging](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/auto-deleveraging)
- [FAQ: Why was I liquidated?](https://hyperliquid.gitbook.io/hyperliquid-docs/support/faq/trade-outcome-looks-incorrect/why-was-i-liquidated)
- [FAQ: How does margining work?](https://hyperliquid.gitbook.io/hyperliquid-docs/support/faq/trade-outcome-looks-incorrect/how-does-margining-work)

### Media for this layer

- **case** · [JELLYJELLY exploit on Hyperliquid](https://info.arkm.com/research/jellyjelly-exploit-on-hyperliquid) · Arkham Research, 26 Mar 2025
  The forensic account of a self-liquidation attack: three accounts, a $4.1M short pushed onto HLP, and a delisting that settled everything at one price. The case study for how backstop liquidations and HLP exposure actually work.
  _opened 3 Nov 2026_ · _Ends with a sign-up call to action; the research itself is the primary source_

### Do

- [ ] Isolated, $20 margin, 10x short on a volatile alt, on testnet. Compute the liquidation price first. Let it happen. Compare the fill, what margin came back, and how long it took.
- [ ] Rebuild the same idea as a sized trade: 1% risk, stop 2% away. Note how different the position looks.
- [ ] Switch a position from cross to isolated and back. Note what the UI does to margin each way.

**Passed when:** You state liquidation price, dollars at risk and stop distance for every trade before you send it.

### Check yourself

1. Maintenance margin on an asset whose maximum leverage is 40x:
   - a) 2.5%
   - b) 1.25%
   - c) 0.5%
2. In cross margin, a liquidation can:
   - a) Only touch that position
   - b) Take all cross positions and the cross margin
   - c) Do nothing to margin
3. The backstop liquidator takes over when equity falls below:
   - a) Maintenance margin
   - b) Two thirds of maintenance margin
   - c) Half of initial margin
4. Auto-deleveraging can close:
   - a) Only losing positions
   - b) Profitable positions on the other side
   - c) Only HLP’s positions
5. Risk $10 with a stop 2% away. Notional:
   - a) $200
   - b) $500
   - c) $1,000

## Layer 5 · Time, sessions and timezones

**Goal.** Know what hour it is in the market, what happens at :00, and which scheduled events can move your position.

> Crypto trades 24/7 but is moved by things on clocks. Hourly funding, the 00:00 UTC daily close, the US cash open, the CME weekend, Friday 08:00 UTC options expiry and 08:30 ET data releases give most days their shape.

### Concepts, in order

- Exchanges run on UTC. IST is UTC+5:30 all year. US clocks move twice a year (in 2026 daylight time ran from 8 March to 1 November), so every US-anchored event shifts by an hour in IST while funding and UTC levels stay put. London moves too. Tokyo and India never move.
- Funding settles every hour at :00 UTC, which is :30 past the hour in IST. Whoever holds a position at that second pays or receives.
- Fee tier is recomputed at the end of each UTC day (05:30 IST) on rolling 14-day volume.
- The daily candle closes at 00:00 UTC (05:30 IST), the most watched level in crypto. Binance and Bybit pay funding then too, and at 08:00 and 16:00 UTC (some pairs every 4 hours); flows around those prints spill into every venue.
- Network upgrades are announced on Discord and X. During the upgrade window only post-only orders fill and TWAP slices pause.
- Sessions as regimes: Asia (00:00 to 08:00 UTC) is usually the quietest. Europe (07:00 to 16:00 UTC) builds. The US cash session (13:30 to 21:00 UTC) carries the most volume and the macro moves; the Europe/US overlap, 19:00 to 21:30 IST, is the loudest stretch of the day. Weekends are thin: bigger wicks on less size.
- CME is closed from Friday night to Sunday night, so bitcoin’s Monday open on CME often sits away from Friday’s close, the CME gap that traders watch.
- HIP-3 stock, index and commodity perps trade 24/7 while their underlyings are closed. The deployer’s oracle freezes or drifts with the book, premiums and funding build, and both snap at the underlying’s open. Do not hold one through an open unless that is the trade (Layer 8).

### Calendar in IST

| Event | UTC | IST, Nov to Mar | IST, Mar to Nov |
| --- | --- | --- | --- |
| Hyperliquid funding | every :00 | every :30 | every :30 |
| Daily close, Binance/Bybit funding, Tokyo open | 00:00 | 05:30 | 05:30 |
| NSE India session | 03:45 to 10:00 | 09:15 to 15:30 | 09:15 to 15:30 |
| London open | 08:00 (07:00 summer) | 13:30 | 12:30 |
| Binance/Bybit funding | 08:00, 16:00 | 13:30, 21:30 | 13:30, 21:30 |
| Deribit options expiry (Fridays; monthly on the last Friday) | 08:00 | 13:30 | 13:30 |
| US CPI and NFP (08:30 ET) | 13:30 (12:30 summer) | 19:00 | 18:00 |
| NYSE open (09:30 ET) | 14:30 (13:30 summer) | 20:00 | 19:00 |
| FOMC statement (14:00 ET), press conference 30 min later | 19:00 (18:00 summer) | 00:30 next day | 23:30 |
| NYSE close (16:00 ET) | 21:00 (20:00 summer) | 02:30 next day | 01:30 next day |
| CME daily break (16:00 to 17:00 CT) | 22:00 to 23:00 (21:00 to 22:00 summer) | 03:30 to 04:30 | 02:30 to 03:30 |
| CME weekly close, Friday (16:00 CT) | 22:00 (21:00 summer) | 03:30 Saturday | 02:30 Saturday |
| CME weekly open, Sunday (17:00 CT) | 23:00 (22:00 summer) | 04:30 Monday | 03:30 Monday |

### Read: official docs

- [Funding (the hourly cadence)](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding)
- [Fees (the UTC day)](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees)

### Media for this layer

- **research** · [Trading activity in bitcoin far higher during U.S. trading hours](https://k33.com/research/archive/articles/trading-activity-in-bitcoin-far-higher-during-us-trading-hours) · Vetle Lunde, K33 Research, 18 Jan 2022
  Numbers behind the session map: US cash hours are under 30% of the day but carried 36% to 43% of spot volume, and about 40% even on weekends. Old, but the shape has not changed.
  _opened 3 Nov 2026_ · _No promotion_
- **research** · [Intraday patterns in crypto: activity, volatility and spreads follow US hours](https://arxiv.org/pdf/2109.12142v2.pdf) · arXiv 2109.12142 (academic paper, 2021)
  Academic confirmation that the highest activity, highest volatility and lowest spreads on US exchanges coincide with US market hours, and that European venues follow their own local time.
  _seen in search results, not opened_ · _Seen in search results, not opened today_
- **calendar** · [NYSE hours and holidays](https://www.nyse.com/markets/hours-calendars) · NYSE
  Core session 09:30 to 16:00 ET; the holiday list is what the market clock does not model.
  _opened 3 Nov 2026_
- **calendar** · [CME Globex trading hours](https://www.cmegroup.com/trading-hours.html) · CME Group
  Equity index and bitcoin futures: Sunday 17:00 CT to Friday 16:00 CT with a daily 16:00 to 17:00 CT break. The source of the CME gap.
  _long-standing link, not re-opened_ · _Page timed out twice today; hours stated from the standard schedule_
- **calendar** · [CPI release schedule](https://www.bls.gov/schedule/news_release/cpi.htm) · US Bureau of Labor Statistics
  08:30 ET. Loaded into the market clock through Dec 2027.
  _opened 3 Nov 2026_
- **calendar** · [Employment Situation (nonfarm payrolls) schedule](https://www.bls.gov/schedule/news_release/empsit.htm) · US Bureau of Labor Statistics
  08:30 ET, usually the first Friday. Loaded into the market clock through Dec 2027.
  _opened 3 Nov 2026_
- **calendar** · [FOMC meeting calendar](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm) · Federal Reserve
  Statement at 14:00 ET on the second day, press conference 30 minutes later. The 2026 and 2027 dates are loaded into the market clock.
  _opened 3 Nov 2026_
- **calendar** · [Economic calendar](https://www.forexfactory.com/calendar) · ForexFactory
  Set the timezone to IST once and it shows every scheduled release in your clock. Ignore its forums.
  _long-standing link, not re-opened_ · _Not opened today_

### Do

- [ ] Put the calendar into your own calendar as recurring events in IST, plus this month’s CPI, NFP and FOMC dates (the Market clock page lists the next ones).
- [ ] Sit through one US open and one 00:00 UTC close on the 1-minute BTC chart with the book open. Note spread and range before, during and after.
- [ ] Hold a small testnet position across a Friday 08:00 UTC expiry and a weekend. Note Monday’s CME gap.

**Passed when:** For any IST time you can say which session you are in, when the next funding and the next scheduled release are, and whether US clocks are on daylight time.

### Check yourself

1. Hyperliquid funding settles at:
   - a) :00 UTC every hour
   - b) 00:00, 08:00 and 16:00 UTC
   - c) 08:00 UTC daily
2. IST is:
   - a) UTC+5
   - b) UTC+5:30
   - c) UTC+4:30
3. NYSE opens, in IST, during US winter time:
   - a) 19:00
   - b) 20:00
   - c) 21:00
4. The most watched daily candle close in crypto:
   - a) 00:00 UTC
   - b) 00:00 ET
   - c) 09:30 ET
5. The CME Globex daily break is:
   - a) 16:00 to 17:00 Central Time
   - b) 12:00 to 13:00 Central Time
   - c) There is none

## Layer 6 · Reading the market

**Goal.** Form a one-sentence thesis from the chart, the book, open interest and funding, and know what would prove it wrong.

> On Hyperliquid the positioning data other venues hide is public. Who is long, how levered, and where they get liquidated is on-chain, and the explorers show it.

### Concepts, in order

- Timeframes: daily for context, 4-hour and 1-hour for structure, 5- and 15-minute for entries. The higher timeframe wins a disagreement.
- Structure: higher highs and higher lows make an uptrend; the last swing low is the invalidation. Support and resistance are zones where the book got heavy before. Prior daily closes at 00:00 UTC matter most.
- Volume confirms: a break on rising volume holds more often than one on thin volume. Weekend breaks are suspect.
- The OI matrix. Price up with OI up: new longs, a trend that is also crowding. Price up with OI down: shorts covering, fuel running out. Price down with OI up: new shorts. Price down with OI down: longs liquidating, often the end of a move. Funding tells you who is paying to stay.
- Liquidation levels: leveraged positions cluster at round leverage and get liquidated in clusters, so price is drawn to them. Heatmaps estimate the clusters; the trades tape and explorers show the prints.
- Hyperliquid tells: the funding history tab, open interest in the asset header, the leaderboard, and the largest positions on the explorers.

### Read: official docs

- [Portfolio graphs](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-graphs)
- [Miscellaneous UI](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/miscellaneous-ui)

### Media for this layer

- **research** · [Inferring leveraged positioning from price and open interest](https://research.glassnode.com/leverage-position-openings-and-closures) · Frederik Theissen, Glassnode Research, 3 Jul 2025, 8 min
  The OI matrix in Layer 6, done properly: long openings, long closures, short openings, short closures, with the caveats (short-side signals are weaker, the metric lags intraday). Free.
  _opened 3 Nov 2026_ · _No paywall; newsletter prompt only_
- **tool** · [Hyperliquid whale tracker](https://www.coinglass.com/hyperliquid) · Coinglass
  Large Hyperliquid positions, long/short ratios, unrealized PnL and funding paid, read straight from the chain.
  _opened 3 Nov 2026_ · _Login prompts and Pro tier; the public view works_
- **tool** · [Liquidation heatmap](https://www.coinglass.com/pro/futures/LiquidationHeatMap) · Coinglass
  Estimated clusters of liquidation levels. Treat it as a map of where stops sit, not a prediction.
  _opened 3 Nov 2026_ · _Pro tier for some settings_
- **tool** · [Hypurrscan](https://hypurrscan.io) · Community explorer
  Address-level positions, fills, vaults and liquidations on Hyperliquid. Free. Use it to see who is on the other side of a move.
  _opened 3 Nov 2026_ · _Labelled beta_
- **tool** · [Hyperdash](https://hyperdash.info) · Community analytics
  Positions, liquidations and funding dashboards for Hyperliquid, free.
  _seen in search results, not opened_ · _Blocked automated access today; existence confirmed by several sources_
- **tool** · [Hyperliquid leaderboard](https://app.hyperliquid.xyz/leaderboard) · Official app
  Who is making and losing money, by account, because every book is public. Humbling and useful.
  _seen in search results, not opened_
- **tool** · [Hyperliquid explorer](https://app.hyperliquid.xyz/explorer) · Official app
  Every fill and liquidation, by address and block.
  _long-standing link, not re-opened_
- **tool** · [Hyperliquid open interest](https://defillama.com/open-interest/chain/hyperliquid-l1) · DefiLlama
  Venue-level open interest over time, free and independent.
  _seen in search results, not opened_ · _Blocked automated access today_
- **tool** · [HyperTracker](https://hypertracker.io/) · Independent
  Wallet PnL, liquidation distance and cohort leaderboards. The free dashboard is useful; ignore the marketing.
  _opened 3 Nov 2026_ · _Heavy API upsell (paid plans from $179 a month)_ · _Unsourced claims on its landing page_
- **book** · The Art and Science of Technical Analysis · Adam Grimes, 2012
  The one technical-analysis book that argues from evidence. His old free course now sits behind a subscription site, so the book is the resource.

### Do

- [ ] For 10 days, before the US open, write one sentence each on BTC and one alt: bias, the level that invalidates it, and what OI and funding say. Grade it at 00:00 UTC.
- [ ] Classify 20 recent 1-hour moves into the four OI quadrants.
- [ ] Mark the three largest liquidation clusters on BTC and watch what happens when price reaches one.

**Passed when:** Ten consecutive daily notes exist, each with a thesis and an invalidation, graded.

### Check yourself

1. Price up and open interest up suggests:
   - a) Shorts covering
   - b) New longs opening
   - c) Longs closing
2. Price down and open interest down suggests:
   - a) New shorts
   - b) Longs closing or being liquidated
   - c) New longs
3. The 4-hour and 5-minute charts disagree. Which wins?
   - a) The 5-minute
   - b) The 4-hour
   - c) Neither
4. On Hyperliquid, positions and liquidations are:
   - a) Hidden
   - b) Public on-chain
   - c) Visible only to market makers
5. A breakout on thin weekend volume is:
   - a) More reliable
   - b) Less reliable
   - c) The same

## Layer 7 · Plan, journal, review, psychology (the Next.js of the stack)

**Goal.** Trade a written plan with fixed risk, journal every trade, and review in blocks of 20. This is the production app. Everything before it was components.

> The enemy is not fear or greed. It is unplanned decisions. Every rule below exists to remove one decision from the moment.

### Concepts, in order

- The trade plan, one line each: setup, entry, invalidation (the stop), target, size from risk, time stop, and what would make you exit early.
- R: 1R is the dollars at risk on the trade. Record results in R (+2R, −1R), not dollars; it makes trades comparable at any account size.
- Expectancy = win rate × average win in R − loss rate × average loss in R. Judge it over blocks of 20 trades. One trade says nothing.
- Hard rules: at most 1% risk per trade; stop for the day at −3R; a maximum number of trades per day; no trade within 15 minutes of a scheduled release unless it is the plan; never add size after a loss; flat before the weekend unless planned.
- Journal fields: date and time in IST and UTC, market, setup, direction, entry, stop, target, size, R, fees, funding paid, exit reason, a grade for plan adherence (A followed, C did not) kept separate from PnL, a screenshot before and after, and one lesson. The Journal page here holds all of it and computes the block statistics.
- Review: weekly, 30 minutes, the block’s expectancy and adherence, the best and worst trade, one rule to add or remove. Nothing else changes between reviews.

### Read: official docs

- [Entry price and PnL (so your journal matches the exchange)](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/entry-price-and-pnl)

### Media for this layer

- **video** · [Mark Douglas, Think like a professional trader (4-part seminar)](https://www.youtube.com/results?search_query=Mark+Douglas+Stock+Trading+Psychology+Seminar+Think+like+a+professional+trader+Part+1+of+4) · Recorded seminar, about 4 hours total, re-uploaded on YouTube by Modern WallStreet
  The lecture version of Trading in the Zone: thinking in probabilities, why fear produces trading errors, what an edge actually is. Watch one part per week during Layer 7.
  _seen in search results, not opened_ · _Link is a YouTube search for the exact title; the uploads are re-posts, so pick the one from Modern WallStreet_ · _Skip the AI summary sites that rank above it_
- **article** · [TraderFeed](https://traderfeed.blogspot.com) · Brett Steenbarger, blog, posting as of 2 Nov 2026
  Twenty years of short posts by a clinical psychologist who coaches hedge-fund and prop traders. Free. Read the archive on process and self-coaching, one post a day.
  _opened 3 Nov 2026_ · _Links to his own books; no courses, no signals_
- **podcast** · [Chat With Traders](https://chatwithtraders.com) · Podcast since 2015, 250+ episodes
  Long interviews with working traders across futures, equities and crypto. Pick episodes by guest. Skip any where the guest sells a course; the ones that remain are the best free oral history of discretionary trading.
  _opened 3 Nov 2026_ · _Sponsor reads; original host handed over in 2022_
- **book** · Trading in the Zone · Mark Douglas, 2000
  Chapters 7 to 11 are the core: probabilities, consistency, the five fundamental truths.
- **book** · The Daily Trading Coach · Brett Steenbarger, 2009
  101 short lessons for coaching yourself. One a day alongside the drills.
- **book** · Market Wizards · Jack Schwager, 1989
  Interviews with traders about process and risk. Still the best antidote to influencer trading content.

### Do

- [ ] Back-fill your last five testnet trades into the Journal page to test the fields.
- [ ] 20 planned testnet trades, every one journaled and graded. Read the expectancy and adherence the journal computes.
- [ ] Graduate: mainnet, minimum size ($10 orders), isolated margin, 0.5% risk, 20 more trades. Raise risk toward 1% only after a block that is positive and above 90% adherence.

**Passed when:** Two consecutive 20-trade blocks show above 90% plan adherence, whatever the PnL says.

### Check yourself

1. 1R equals:
   - a) 1% of the account, always
   - b) The dollars at risk on that trade
   - c) The distance to target
2. Expectancy is judged over:
   - a) One trade
   - b) Blocks of 20 trades
   - c) A calendar year
3. The adherence grade should be:
   - a) Tied to PnL
   - b) Kept separate from PnL
   - c) Skipped on winners
4. After a losing trade you:
   - a) Double the size to recover
   - b) Keep the size the plan sets
   - c) Stop trading for the month
5. The daily stop in this plan:
   - a) −3R
   - b) −10R
   - c) There is none

## Layer 8 · The rest of Hyperliquid

**Goal.** Know what else is on the venue and exactly when a manual trader should care.

> HIP-3 lets you trade US stocks, indices, oil and gold as perps at about a tenth of the main-dex fee, 24/7. The catch is that a private deployer, not the validators, runs the oracle.

| Piece | What it is | When it matters to you |
| --- | --- | --- |
| Spot, HIP-1 and HIP-2 | Native tokens with on-chain books; HIP-2 is a built-in liquidity strategy for new tokens | Buying HYPE for the fee discount; hedging a perp with spot; fees 0.07% / 0.04% |
| HIP-3 builder perps | Stocks, indices, commodities, FX and pre-IPO names listed by deployers (trade.xyz is the largest) with their own oracle, leverage, margin mode and fees; growth-mode taker fee about 0.005% to 0.009% | 24/7 exposure to TradFi assets, but the deployer sets the oracle, can halt a market and settle it at mark, and most markets are isolated-only. Read the deployer’s own docs first |
| HIP-4 outcome markets | Yes/no markets on the same engine; fees only on close or settlement | Event trades, after Layer 7 |
| HLP | The community vault that market-makes and runs backstop liquidations; deposits lock for 4 days from the last deposit; it earns a share of fees | Parking idle USDC; knowing it is the counterparty when a liquidation goes to backstop |
| User vaults | Copy a leader’s trades; legacy vaults take a profit share | Not before Layer 7 |
| Staking HYPE | Delegate to validators; fee discounts from 5% at more than 10 HYPE to 40% at more than 500,000; unstaking queues for 7 days; linking to the trading account is permanent | Only if you hold HYPE anyway |
| Referrals and points | A referral code discounts your first $25M of volume; points programmes come and go | Use a code on day one; ignore points |
| Delisting | Markets can be delisted; open positions are settled | Check announcements before holding a small-cap for weeks |
| HyperEVM | The EVM side: apps, lending, bridges | Not needed to trade |
| Sub-accounts and API wallets | Separate books under one wallet; sub-accounts unlock after $100k of volume | Later, if ever |

### Read: official docs

- [HIPs overview](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips)
- [HIP-1: Native token standard](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-1-native-token-standard)
- [HIP-2: Hyperliquidity](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-2-hyperliquidity)
- [HIP-3: Builder-deployed perpetuals](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-3-builder-deployed-perpetuals)
- [HIP-4: Outcome markets](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-4-outcome-markets)
- [Vaults](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/vaults)
- [Protocol vaults (HLP)](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/vaults/protocol-vaults)
- [Staking](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking)
- [How to stake HYPE](https://hyperliquid.gitbook.io/hyperliquid-docs/onboarding/how-to-stake-hype)
- [Referrals](https://hyperliquid.gitbook.io/hyperliquid-docs/referrals)
- [Delisting](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/delisting)

### Media for this layer

- **case** · [Hyperliquid explains $57M SK Hynix perp liquidations after oracle anomaly](https://finance.yahoo.com/markets/crypto/articles/hyperliquid-explains-57-million-sk-114320781.html) · BeInCrypto via Yahoo Finance, 28 Jul 2026
  A HIP-3 deployer’s oracle took a thin pre-market print and liquidated 960 long accounts while the stock itself barely moved. The case study for deployer-oracle risk in Layer 8.
  _opened 3 Nov 2026_ · _News report; no post-mortem from the deployer was published_
- **case** · [JELLYJELLY exploit on Hyperliquid](https://info.arkm.com/research/jellyjelly-exploit-on-hyperliquid) · Arkham Research, 26 Mar 2025
  The forensic account of a self-liquidation attack: three accounts, a $4.1M short pushed onto HLP, and a delisting that settled everything at one price. The case study for how backstop liquidations and HLP exposure actually work.
  _opened 3 Nov 2026_ · _Ends with a sign-up call to action; the research itself is the primary source_

### Do

- [ ] Buy 1 HYPE on testnet spot and move it between the spot and perps balances.
- [ ] Open a HIP-3 market such as the S&P 500 perp. Note its margin mode, maximum leverage and fee, then watch mark against oracle for an hour after the US close.

**Passed when:** You can explain to someone else what HIP-3 oracle risk is and why you learned on validator-run perps first.

### Check yourself

1. Who runs the oracle of a HIP-3 market?
   - a) The validators
   - b) The deployer
   - c) HLP
2. HLP deposits are locked for:
   - a) 1 day
   - b) 4 days
   - c) 30 days
3. A growth-mode HIP-3 taker fee is about:
   - a) 0.045%
   - b) 0.005% to 0.009%
   - c) 0.10%
4. A HIP-3 deployer can:
   - a) Halt the market and settle positions at mark
   - b) Seize your margin directly
   - c) Change your leverage after entry
5. The staking fee discount starts at:
   - a) More than 10 HYPE, 5%
   - b) More than 1,000 HYPE, 5%
   - c) There is no discount

## Layer 9 · Tooling (optional) (the SSR of the stack)

**Goal.** Make the data come to you, and automate the journal rather than the trading.

> The right first use of the API is pulling your own fills into the journal. A bot only automates whatever edge you already have.

### Concepts, in order

- Alerts: the app does not send alerts, so your TradingView chart does. One alert per level in your daily note.
- Data: HyperScreener (where stats.hyperliquid.xyz now redirects), the explorer, the leaderboard, Hypurrscan, Hyperdash, Coinglass.
- Your own fills: copy them from the trade history tab, or pull them from the info API, which returns your fills and funding payments as JSON. The official Python SDK does it in about ten lines.
- Everything else under the API docs (signing, nonces, rate limits, WebSocket) is for bots. Park it until manual trading has a positive 20-trade block.

### Read: official docs

- [API overview](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api)
- [Info endpoint](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint)
- [Historical data](https://hyperliquid.gitbook.io/hyperliquid-docs/historical-data)

### Media for this layer

- **tool** · [hyperliquid-python-sdk](https://github.com/hyperliquid-dex/hyperliquid-python-sdk) · Official, GitHub
  Ten lines to pull your fills and funding into the journal. The only API use this curriculum asks for.
  _long-standing link, not re-opened_
- **tool** · [HyperScreener (the official stats destination)](https://hyperscreener.asxn.xyz/home) · ASXN, free
  stats.hyperliquid.xyz now redirects here. Volume, open interest, funding and HLP figures for the whole venue.
  _opened 3 Nov 2026_ · _Run by a validator and research firm; data, not opinion_
- **official** · [Historical data](https://hyperliquid.gitbook.io/hyperliquid-docs/historical-data) · Hyperliquid docs
  Where the L2 book snapshots and trade history live if you ever want to replay a day.
  _opened 3 Nov 2026_

### Do

- [ ] One script that pulls a week of your fills and funding into a CSV with the journal’s columns.

**Passed when:** The journal fills itself and you only type the setup, the grade and the lesson.

### Check yourself

1. The right first use of the API for a manual trader:
   - a) A trading bot
   - b) Pulling your own fills into the journal
   - c) Market making
2. Price alerts on Hyperliquid:
   - a) Built into the app
   - b) Not in the app; use TradingView alerts
   - c) Sent by email
3. Historical L2 book snapshots are documented on:
   - a) The Historical data page
   - b) The Fees page
   - c) Nowhere
4. stats.hyperliquid.xyz now redirects to:
   - a) Coinglass
   - b) ASXN HyperScreener
   - c) Dune
5. A bot automates:
   - a) An edge you already have
   - b) A new edge
   - c) Luck

## Eight-week schedule

Eight weeks to a journaled mainnet trader at minimum size; after that the unit of progress is a 20-trade block, not a week.

| Week | Layers | Hours | Graduation check |
| --- | --- | --- | --- |
| 1 | 0 and 1 | 6 | Maker/taker called correctly on every order; PnL and entry price by hand |
| 2 | 2 | 6 | Every order type executed once; one fee reconciled to the schedule |
| 3 | 3 | 5 | 24-hour funding log for two coins; one mark-vs-last gap explained |
| 4 | 4 | 5 | One planned liquidation; one sized trade with stop, risk and liquidation stated first |
| 5 | 5, start of 6 | 6 | Calendar built in IST; one US open and one 00:00 UTC close observed |
| 6 | 6 | 6 | 10 graded daily notes |
| 7 | 7 on testnet | 8 | 20 journaled, graded trades; expectancy and adherence computed |
| 8 | 7 on mainnet; 8 and 9 as reading | 8 | 20 mainnet trades at $10 size and 0.5% risk; adherence above 90% |

After week 8: repeat 20-trade blocks. Raise risk from 0.5% toward 1% only after a block that is both positive and above 90% adherence. Add HIP-3 markets or hyperps only after two such blocks on the main perps.

## Glossary

| Term | Meaning |
| --- | --- |
| ALO / Post Only | An order that rests or is rejected, never a taker |
| ADL | Auto-deleveraging: profitable positions closed against a bankrupt one when the backstop cannot absorb it |
| Backstop liquidation | HLP takes an underwater position and its margin when equity is below two thirds of maintenance |
| Basis / premium | Perp price minus oracle price |
| Cross / isolated | Whether all your collateral, or only an assigned amount, backs a position |
| Expectancy | Average R per trade over a block: win rate × average win − loss rate × average loss |
| Funding | The hourly payment between longs and shorts that keeps a perp near its oracle |
| HIP-1 / 2 / 3 / 4 | Native spot tokens / built-in spot liquidity / builder-deployed perps / outcome markets |
| HLP | Hyperliquidity Provider: the community vault that market-makes and runs backstop liquidations |
| HyperCore / HyperEVM | The order-book and margin engine / the EVM app layer |
| Impact price | The average price a fixed notional (20k USDC for BTC and ETH, 6k otherwise) would fill at; used for the funding premium |
| IOC / GTC | Fill now and cancel the rest / rest until filled or cancelled |
| Maintenance margin | Half the initial margin at maximum leverage; below it you are liquidatable |
| Mark / oracle / mid | The liquidation and trigger price / the CEX-median price / the book’s midpoint |
| Notional | Size × price, the full exposure regardless of leverage |
| OI | Open interest: total position size held |
| R | Dollars at risk on one trade, the unit results are recorded in |
| Reduce only | An order that can only shrink a position |
| Slippage | The difference between the price you saw and the price you got |
| Tick / lot | The smallest price step / the smallest size step |
| TWAP | A large order sliced over time |

## Quiz answers

- Layer 0: 1-b, 2-b, 3-b, 4-b, 5-b
- Layer 1: 1-a, 2-a, 3-b, 4-b, 5-b
- Layer 2: 1-b, 2-b, 3-b, 4-a, 5-b
- Layer 3: 1-b, 2-b, 3-b, 4-b, 5-a
- Layer 4: 1-b, 2-b, 3-b, 4-b, 5-b
- Layer 5: 1-a, 2-b, 3-b, 4-a, 5-a
- Layer 6: 1-b, 2-b, 3-b, 4-b, 5-b
- Layer 7: 1-b, 2-b, 3-b, 4-b, 5-a
- Layer 8: 1-b, 2-b, 3-b, 4-a, 5-a
- Layer 9: 1-b, 2-b, 3-a, 4-b, 5-a
