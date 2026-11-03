/* Layer 9 · Tooling (optional): lesson text and figures.
   The info endpoint request shapes are from the API docs; the Python example uses only the requests and csv libraries. */
(function (root) {
  'use strict';
  const F = root.FigLib, FIG = root.FIG || (root.FIG = {}), LESSONS = root.LESSONS || (root.LESSONS = {});

  FIG['data-sources'] = P => F.svg(P, 660, 300, 'You in the centre with six data sources around you and an arrow from each saying what it delivers: price alerts from TradingView, funding and open interest from the app, venue statistics from HyperScreener, positions from the explorers, cross-exchange funding from Coinglass, and your own fills from the info API', id => {
    let s = ''; const cx = 330, cy = 150;
    s += F.c(P, cx, cy, 34, { fill: P.youSoft, stroke: P.you, sw: 1.8 }); s += F.t(P, cx, cy + 5, 'you', { anchor: 'middle', weight: 800, size: 14, fill: P.you });
    const src = [[0, 'TradingView alerts', 'one alert per level in your note'], [60, 'the app', 'funding history, open interest, countdown'], [120, 'HyperScreener', 'venue volume, OI, funding, HLP'], [180, 'explorers', 'Hypurrscan, Hyperdash: who holds what'], [240, 'Coinglass', 'funding across venues, liquidation maps'], [300, 'the info API', 'your own fills and funding, as JSON']];
    src.forEach(e => { const a = (e[0] - 90) * Math.PI / 180; const x = cx + 230 * Math.cos(a), y = cy + 115 * Math.sin(a); s += F.r(P, x - 80, y - 22, 160, 44, { rx: 9, fill: P.surf, stroke: e[0] === 300 ? P.you : P.line, sw: 1.3 }); s += F.t(P, x, y - 4, e[1], { anchor: 'middle', size: 11, weight: 800 }); s += F.t(P, x, y + 12, e[2], { anchor: 'middle', size: 9, fill: P.muted }); const bx = cx + 36 * Math.cos(a), by = cy + 36 * Math.sin(a); const ex = x - 86 * Math.cos(a) * (Math.abs(Math.cos(a)) > 0.5 ? 1 : 0) - 26 * Math.sin(a) * (Math.abs(Math.cos(a)) > 0.5 ? 0 : 1) * Math.sign(Math.sin(a)); s += F.l(P, x - 84 * Math.cos(a), y - 26 * Math.sin(a), bx, by, { stroke: P.muted, sw: 1.2, arrow: 'muted', id }); });
    return s;
  });

  FIG['fills-pipeline'] = P => F.svg(P, 660, 170, 'A pipeline from the exchange through one POST request to the info endpoint, a ten-line script, a CSV file, and into the journal, where you type only the setup, the grade and the lesson', id => {
    let s = '';
    const steps = [['Hyperliquid', 'your fills and funding', P.line], ['POST /info', '{"type":"userFills"}', P.you], ['a short script', 'Python or anything', P.line], ['fills.csv', 'the journal’s columns', P.line], ['the Journal', 'you add setup, grade, lesson', P.bid]];
    steps.forEach((st, i) => { const x = 16 + i * 128; s += F.r(P, x, 40, 116, 60, { rx: 10, fill: P.surf, stroke: st[2], sw: 1.3 }); s += F.t(P, x + 58, 64, st[0], { anchor: 'middle', weight: 800, size: 11.5 }); s += F.t(P, x + 58, 84, st[1], { anchor: 'middle', size: st[1].length > 22 ? 8.5 : 9, fill: P.muted, mono: st[1].startsWith('{') }); if (i < 4) s += F.l(P, x + 117, 70, x + 127, 70, { stroke: P.muted, sw: 1.3, arrow: 'muted', id }); });
    s += F.t(P, 16, 134, 'read-only. No signing, no private key, no order placement: the info endpoint only answers questions.', { size: 11, weight: 700 });
    s += F.t(P, 16, 154, 'this is the only API use the course asks for. A bot automates whatever edge you already have, including none.', { size: 10.5, fill: P.muted });
    return s;
  });

  LESSONS['layer-9'] = {
    intro: 'This layer is optional, and it is deliberately small. The right first use of the API for a manual trader is not a bot; it is getting your own fills into the journal without typing them. Everything else, alerts and dashboards, is about making the data come to you so that you look at the screen less, not more.',
    legend: 'In the pictures, blue marks the one API call the course asks for.',
    sections: [
      { id: 'alerts', t: 'Make the data come to you',
        p: ['The Hyperliquid app does not send price alerts, so your TradingView chart does: one alert per level in your daily note, so that the level finds you rather than you watching for it. The app itself gives you the funding history tab, the open interest in the header and the countdown. HyperScreener, where stats.hyperliquid.xyz now redirects, has the venue-wide numbers. The explorers, Hypurrscan and Hyperdash, show who holds what. Coinglass shows funding across venues and the liquidation maps. Each is in the media list with a note on what it tries to sell you.',
          'The habit this builds is the opposite of the one most traders have. Set the alert, close the chart, and let the market interrupt you when it reaches something you wrote down in advance.'],
        fig: 'data-sources', cap: 'Six sources, one of you. The point is to look less, not more.',
        key: 'Alerts on your levels, the app for funding and OI, the explorers for positioning. Set them, then close the chart.' },

      { id: 'fills-json', t: 'Your fills as JSON',
        p: ['Everything you have ever done on Hyperliquid is available from one public endpoint with no key and no signing. A single POST to the info endpoint with the type `userFills` and your address returns your fills as JSON, each with the coin, price, size, side, time, fee and closed PnL. The type `userFunding` returns the funding you paid and received. That is the whole of what the journal needs from the exchange; you add the setup, the grade and the lesson by hand, because those are the parts that teach.',
          'The script below is the entire integration. The official Python SDK does the same in a few lines if you prefer it; the media list links it.'],
        code: 'import requests, csv\n\nADDRESS = "0xYourAddressHere"\nINFO = "https://api.hyperliquid.xyz/info"\n\nfills = requests.post(INFO, json={"type": "userFills", "user": ADDRESS}).json()\n\nwith open("fills.csv", "w", newline="") as f:\n    w = csv.writer(f)\n    w.writerow(["time_ms", "coin", "side", "price", "size", "fee", "closed_pnl"])\n    for x in fills:\n        w.writerow([x["time"], x["coin"], x["side"], x["px"], x["sz"], x["fee"], x["closedPnl"]])\n\nprint(len(fills), "fills written")',
        fig: 'fills-pipeline', cap: 'One request, one short script, one CSV. The journal still wants three things only you can type.',
        key: 'POST /info with type userFills and your address returns every fill, read-only, no key. That is the only API call the course asks for.' },

      { id: 'leave-alone', t: 'What to leave alone until a positive block',
        p: ['Everything else under the API docs, signing, nonces, rate limits, the WebSocket feed, order placement, is for bots. A bot automates whatever edge you already have, and until the journal shows a positive 20-trade block with high adherence, that edge is not yet demonstrated. Automating it would only make the losses faster and the lessons quieter.',
          'The historical data the docs point to, L2 book snapshots and trade history, is there if you ever want to replay a day. That is a fine way to practise reading the book from Layer 0 without risking a cent. The pass check for this layer is modest on purpose: the journal fills itself, and you only type the setup, the grade and the lesson.'],
        key: 'Signing, WebSockets and order placement are for bots. A bot automates the edge you have, so demonstrate one first.' }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
