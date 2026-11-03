# Media track

Every item was found by searching the web on 3 Nov 2026, opened where the site allowed it, and kept only if it teaches a mechanism or a skill without selling you something. Each entry says why it is here and what to be careful of. What was found and rejected is in [noise-filter.md](noise-filter.md).

Legend: _opened_ means the page was fetched and read that day; _seen in search results_ means it was found but the site blocked an automated read; _long-standing link_ means a stable address cited from memory and not re-opened.

There is deliberately no YouTube walkthrough of the Hyperliquid interface: every tutorial found came from channels whose descriptions could not be checked, and that category is dominated by referral-code content. The docs' How to start trading page plus the Layer 2 drills replace it. If you want a video anyway, open the description first and drop it if the first link is a referral code.

## Layer 0 · The order book

- **book** · Trading and Exchanges · Larry Harris, 2003
  Market microstructure for practitioners. Chapters 1 to 6 for why books behave as they do. Optional depth.

## Layer 1 · Perpetuals

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

## Layer 2 · The Hyperliquid machine

- **official** · [@HyperliquidX on X](https://x.com/HyperliquidX) · Official account
  Upgrades, listings, delistings and incidents are posted here first. Follow it and turn on notifications; it is the only account you need for news.
  _seen in search results, not opened_ · _Impersonators DM people; the real account never DMs_
- **official** · [Hyperliquid Discord](https://discord.com/invite/hyperliquid) · Official community
  Announcements and support. Use the link in the app footer rather than any link in a search result or DM.
  _seen in search results, not opened_ · _Invite seen on a community wiki, not an official page; verify from app.hyperliquid.xyz_

## Layer 3 · Prices and funding

- **tool** · [Funding rates across exchanges](https://www.coinglass.com/FundingRate) · Coinglass
  The same coin on Hyperliquid, Binance, Bybit and OKX side by side. The comparison is the intuition for Layer 3.
  _opened 3 Nov 2026_ · _Basic view is free; Pro and API upsells exist_
- **tool** · [HyperScreener (the official stats destination)](https://hyperscreener.asxn.xyz/home) · ASXN, free
  stats.hyperliquid.xyz now redirects here. Volume, open interest, funding and HLP figures for the whole venue.
  _opened 3 Nov 2026_ · _Run by a validator and research firm; data, not opinion_

## Layer 4 · Margin, liquidation and sizing

- **case** · [JELLYJELLY exploit on Hyperliquid](https://info.arkm.com/research/jellyjelly-exploit-on-hyperliquid) · Arkham Research, 26 Mar 2025
  The forensic account of a self-liquidation attack: three accounts, a $4.1M short pushed onto HLP, and a delisting that settled everything at one price. The case study for how backstop liquidations and HLP exposure actually work.
  _opened 3 Nov 2026_ · _Ends with a sign-up call to action; the research itself is the primary source_

## Layer 5 · Time, sessions and timezones

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

## Layer 6 · Reading the market

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

## Layer 7 · Plan, journal, review, psychology

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

## Layer 8 · The rest of Hyperliquid

- **case** · [Hyperliquid explains $57M SK Hynix perp liquidations after oracle anomaly](https://finance.yahoo.com/markets/crypto/articles/hyperliquid-explains-57-million-sk-114320781.html) · BeInCrypto via Yahoo Finance, 28 Jul 2026
  A HIP-3 deployer’s oracle took a thin pre-market print and liquidated 960 long accounts while the stock itself barely moved. The case study for deployer-oracle risk in Layer 8.
  _opened 3 Nov 2026_ · _News report; no post-mortem from the deployer was published_
- **case** · [JELLYJELLY exploit on Hyperliquid](https://info.arkm.com/research/jellyjelly-exploit-on-hyperliquid) · Arkham Research, 26 Mar 2025
  The forensic account of a self-liquidation attack: three accounts, a $4.1M short pushed onto HLP, and a delisting that settled everything at one price. The case study for how backstop liquidations and HLP exposure actually work.
  _opened 3 Nov 2026_ · _Ends with a sign-up call to action; the research itself is the primary source_

## Layer 9 · Tooling (optional)

- **tool** · [hyperliquid-python-sdk](https://github.com/hyperliquid-dex/hyperliquid-python-sdk) · Official, GitHub
  Ten lines to pull your fills and funding into the journal. The only API use this curriculum asks for.
  _long-standing link, not re-opened_
- **tool** · [HyperScreener (the official stats destination)](https://hyperscreener.asxn.xyz/home) · ASXN, free
  stats.hyperliquid.xyz now redirects here. Volume, open interest, funding and HLP figures for the whole venue.
  _opened 3 Nov 2026_ · _Run by a validator and research firm; data, not opinion_
- **official** · [Historical data](https://hyperliquid.gitbook.io/hyperliquid-docs/historical-data) · Hyperliquid docs
  Where the L2 book snapshots and trade history live if you ever want to replay a day.
  _opened 3 Nov 2026_

## X: who to follow, and the mute rule

X is for announcements and positioning, not for learning. Follow [@HyperliquidX](https://x.com/HyperliquidX) with notifications on, the foundation account @HyperFND, and the data tools above (HyperDash posts as @hypurrdash). Then follow the authors of the pieces on this page if they post. Mute anyone who posts PnL screenshots, leverage flexes, referral codes, "signals", or price targets without an invalidation. The official accounts never DM you; anyone who does is a scammer.

Handles were taken from the pages opened that day and a community tool list; X blocks automated checks, so confirm each handle from the links in app.hyperliquid.xyz before following.
