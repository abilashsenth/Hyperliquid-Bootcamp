# Hyperliquid Bootcamp

A self-paced course for becoming a manual perpetuals trader on [Hyperliquid](https://hyperliquid.xyz), built as a stack: ten layers, each a skill the next one assumes, the way HTML comes before CSS and React before Next.js. Layer 0 is the order book. Layer 7 is you trading a written plan with a journal. Every layer is a short illustrated lesson that starts from zero, with figures, sandboxes you can play with, quick checks, and then drills on testnet. The official docs are the source of truth; every outside resource was vetted, and the ones that were rejected are listed with the reason.

**Open the course:** [abilashsenth.github.io/Hyperliquid-Bootcamp](https://abilashsenth.github.io/Hyperliquid-Bootcamp/) or open `index.html` locally. No build step, no dependencies, no account.

**Prefer to read?** [`docs/curriculum.md`](docs/curriculum.md) is the whole course as a book, with every figure, generated from the same source as the page. The sandboxes are the only thing it cannot carry; each one is linked.

## What is inside

| Path | What it is |
| --- | --- |
| `index.html` | The site: the ten layers with lessons, drills, pass checks and quizzes; a live market clock (UTC and IST, next funding print, session, NYSE and CME status, next CPI, payrolls, FOMC and options expiry); calculators built on the docs' formulas (position size, liquidation price, funding cost, fees, expectancy); a trade journal that computes R and judges blocks of 20; the media track; the noise filter. The layer data (goals, drills, quizzes, media, schedule, glossary) lives in the `DATA` block of its script. |
| `lessons/layer-0.js` … `layer-9.js` | One file per layer: the lesson text (sections with prose, takeaways, quick checks) and that layer's figures as small SVG-drawing functions. |
| `lib/fig.js` | The drawing primitives the figures share (ladders, rulers, boxes, arrows, wrapped text) and the palette, which uses the page's CSS variables in the browser and fixed colours when exported. |
| `lib/widgets.js` | The sandboxes: a breathing order book, walk-the-book, a limit-order placer, the queue, a tick-and-lot checker, a candle builder, a leverage explorer, entry-price averaging, a trigger-order simulator, the oracle median, the mark-price median, the funding formula, the liquidation cliff, a risk-first sizer, the session dial, the open-interest matrix, a thesis builder and an expectancy simulator. |
| `docs/curriculum.md` | The course as prose, with the figures, the quizzes and the answers. Generated. |
| `docs/figures/*.svg` | Every figure as a standalone file. Generated. |
| `docs/media-track.md` | Every podcast, interview, article, research piece, tool and book that passed the filter, by layer, with why it is there and what to watch out for. Generated. |
| `docs/noise-filter.md` | What was found and rejected, by pattern, with the specific example, plus a 60-second vetting routine. |
| `docs/sources.md` | The official docs index, what was and was not verified, and the method. |
| `tools/gen-docs.js` | Regenerates the three generated items above from the page and the lesson files. |

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

## How a layer works

1. **Goal** and **the surprise**: what you can do afterwards, and the one thing in the layer that changes how you trade.
2. **The lesson**: numbered sections that build the idea from zero. Each has a figure or a sandbox, a one-line takeaway, and often a quick check with an explanation. Every section has its own link (for example `#layer-0/walk`), so you can send someone straight to the bit about slippage.
3. **Recap**: the same ideas in one line each, with the exact numbers from the docs.
4. **Read**: official docs first, then the vetted media for that layer.
5. **Do**: drills on testnet, ticked and saved. **Passed when**: a concrete self-check. **Check yourself**: five questions; full marks completes the layer.

In the figures, green is the bid side (buyers, longs), red the ask side (sellers, shorts, liquidation), blue is you (your order, your position, your level), and amber is an outside reference (the oracle, spot, an underlying).

## How to use it

1. Open the site and read the Overview, then Layer 0. Play with every sandbox; they are the point.
2. Do the drills on [testnet](https://app.hyperliquid-testnet.xyz). The faucet only pays an address that has made one mainnet deposit, so day one needs about 10 USDC on Arbitrum.
3. Tick drills and pass checks as you go, take the quiz, move on only when the pass check is honestly true.
4. From Layer 7, journal every trade in the Journal page. It computes R net of fees and funding and judges each block of 20.

Progress, quiz scores, the journal and your daily notes are stored in your browser (localStorage) on the GitHub Pages version. Clearing site data clears them. Export your journal rows before you do.

## Ground rules

- Testnet first. No real money before Layer 7, and then the smallest size the exchange allows.
- Official docs win. When an explainer disagrees with [hyperliquid.gitbook.io/hyperliquid-docs](https://hyperliquid.gitbook.io/hyperliquid-docs), the docs are right.
- Exchange clocks are UTC. The calendar is written for IST (UTC+5:30); shift it for your zone.
- Nothing here sells you anything. See `docs/noise-filter.md` for the rule and what it removed.

## Status

Built 3 November 2026. The docs pages that carry numbers (fees, funding, liquidations, margining, order types, TP/SL, tick and lot size, onboarding, faucet, entry price and PnL, robust price indices, the oracle, HIP-3, protocol vaults, staking, delisting, hyperps, margin tiers) were opened that day, as were the BLS and Federal Reserve schedules behind the market clock. The sample order book in Layer 0 and the size decimals in its checker were read from the public info API the same day. Hyperliquid changes monthly; if a number here disagrees with the docs, the docs are right and a pull request fixing it is welcome.

## Editing and regenerating

- Lesson text and figures: edit `lessons/layer-N.js`. A section is an object with an id (its link), a title, paragraphs, and optionally a figure name, a sandbox name, an example, a takeaway and a quick check. Figures are functions of a palette that return an SVG string; `lib/fig.js` has the primitives and a `wrap()` helper for text that must fit.
- Sandboxes: `lib/widgets.js`. A widget is `{title, html(id), init(root, ctx)}`; use `ctx.timer` for intervals so the page can clear them when you navigate away.
- Layer goals, drills, quizzes, media, schedule, glossary: the `DATA` block in `index.html`.
- The look: the design tokens (colours, the three typefaces, radii) are the `:root` block at the top of the stylesheet in `index.html`. The page is dark only: an obsidian canvas, a light serif (Newsreader) for headings, Inter for reading, Roboto Mono in capitals for labels and numbers, white as the one primary action. Colour appears only in the toolkit tiles on the Overview and in the figures. Figures draw with the page's variables; `lib/fig.js` repeats the same colours as fixed values for the exported SVGs, so change the two together.
- Then run `node tools/gen-docs.js`. It rewrites `docs/curriculum.md`, `docs/media-track.md` and `docs/figures/`, and fails loudly if a lesson references a figure that does not exist.

## Contributing

A resource is accepted if it teaches a mechanism or a skill and the author gains nothing from your trading. Answer the five questions in the vetting routine at the end of `docs/noise-filter.md` in the pull request. Referral links, courses, signal groups and anything that leads with a sign-up are declined. Lesson improvements are welcome too: the test is whether a reader who has never traded can follow the section, and whether every number in it is on a docs page.

## Disclaimer

Not affiliated with Hyperliquid Labs or the Hyper Foundation. Nothing here is financial advice. Perpetual futures can lose more than you expect faster than you expect; that is what Layer 4 is for.
