# Hyperliquid Bootcamp

A self-paced curriculum for becoming a manual perpetuals trader on [Hyperliquid](https://hyperliquid.xyz), built as a stack: ten layers, each a skill the next one assumes, the way HTML comes before CSS and React before Next.js. Layer 0 is the order book. Layer 7 is you trading a written plan with a journal. The official docs are the source of truth; every outside resource was vetted, and the ones that were rejected are listed with the reason.

**Open the workbench:** [abilashsenth.github.io/Hyperliquid-Bootcamp](https://abilashsenth.github.io/Hyperliquid-Bootcamp/) or open `index.html` locally. No build step, no dependencies, no account.

## What is inside

| File | What it is |
| --- | --- |
| `index.html` | The workbench: the ten layers with drills, pass checks and quizzes; a live market clock (UTC and IST, next funding print, session, NYSE and CME status, next CPI, payrolls, FOMC and options expiry); calculators built on the docs' formulas (position size, liquidation price, funding cost, fees, expectancy); a trade journal that computes R and judges blocks of 20; the media track; the noise filter. |
| `docs/curriculum.md` | The same curriculum as prose, with the quizzes and answers. |
| `docs/media-track.md` | Every podcast, interview, article, research piece, tool and book that passed the filter, by layer, with why it is there and what to watch out for. |
| `docs/noise-filter.md` | What was found and rejected, by pattern, with the specific example, plus a 60-second vetting routine. |
| `docs/sources.md` | The official docs index, what was and was not verified, and the method. |

## The stack

| Layer | Name | Afterwards you can |
| --- | --- | --- |
| 0 | The order book | Say, before you click, whether an order is maker or taker, what it costs, and how far it would move the price |
| 1 | Perpetuals | Compute notional, margin, entry price and PnL by hand |
| 2 | The Hyperliquid machine | Use every order type on purpose and know which ones trigger on mark |
| 3 | Prices and funding | Tell oracle, mark and last apart, and price what a position costs to hold |
| 4 | Margin, liquidation and sizing | State liquidation price, dollars at risk and stop distance before every trade |
| 5 | Time, sessions and timezones | Know the session, the next funding print and the next scheduled release at any hour |
| 6 | Reading the market | Form a one-sentence thesis with an invalidation from chart, book, open interest and funding |
| 7 | Plan, journal, review, psychology | Trade a written plan at fixed risk and review in blocks of 20 |
| 8 | The rest of Hyperliquid | Explain HIP-3 oracle risk, HLP, staking and vaults, and when they matter |
| 9 | Tooling (optional) | Pull your own fills into the journal; nothing else from the API |

Eight weeks at 5 to 8 hours a week gets you to Layer 7 on mainnet at minimum size. After that the unit of progress is a 20-trade block.

## How to use it

1. Open the workbench and read the Overview, then Layer 0.
2. Do the drills on [testnet](https://app.hyperliquid-testnet.xyz). The faucet only pays an address that has made one mainnet deposit, so day one needs about 10 USDC on Arbitrum.
3. Tick drills and pass checks as you go, take the five-question quiz, move on only when the pass check is honestly true.
4. From Layer 7, journal every trade in the Journal page. It computes R net of fees and funding and judges each block of 20.

Progress, quiz scores and the journal are stored in your browser (localStorage) on the GitHub Pages version. Clearing site data clears them. Export your journal rows before you do.

## Ground rules

- Testnet first. No real money before Layer 7, and then the smallest size the exchange allows.
- Official docs win. When an explainer disagrees with [hyperliquid.gitbook.io/hyperliquid-docs](https://hyperliquid.gitbook.io/hyperliquid-docs), the docs are right.
- Exchange clocks are UTC. The calendar is written for IST (UTC+5:30); shift it for your zone.
- Nothing here sells you anything. See `docs/noise-filter.md` for the rule and what it removed.

## Status

Built 3 November 2026. The docs pages that carry numbers (fees, funding, liquidations, order types, TP/SL, onboarding, faucet, entry price and PnL, HIP-3, protocol vaults) were opened that day, as were the BLS and Federal Reserve schedules behind the market clock. Hyperliquid changes monthly; if a number here disagrees with the docs, the docs are right and a pull request fixing it is welcome.

## Contributing

A resource is accepted if it teaches a mechanism or a skill and the author gains nothing from your trading. Answer the five questions in the vetting routine at the end of `docs/noise-filter.md` in the pull request. Referral links, courses, signal groups and anything that leads with a sign-up are declined.

## Disclaimer

Not affiliated with Hyperliquid Labs or the Hyper Foundation. Nothing here is financial advice. Perpetual futures can lose more than you expect faster than you expect; that is what Layer 4 is for.
