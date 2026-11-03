// Generates index.html, docs/curriculum.md and docs/media-track.md from the workbench page source.
// Usage: node tools/gen-docs.js <page-source.html> <repo-root>   (the source is the page without the html/head/body skeleton; index.html is its wrapped output)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = process.argv[2];
const OUT = process.argv[3];
const html = fs.readFileSync(SRC, 'utf8');

// ---- extract the DATA block and evaluate it ----
const start = html.indexOf('/* ============================ DATA ============================ */');
const end = html.indexOf('/* ============================ STATE ============================ */');
if (start < 0 || end < 0) throw new Error('DATA block markers not found');
const dataSrc = html.slice(start, end);
const ctx = {};
vm.createContext(ctx);
vm.runInContext(dataSrc + '\nthis.LAYERS=LAYERS;this.MEDIA=MEDIA;this.SCHEDULE=SCHEDULE;this.GLOSSARY=GLOSSARY;this.EVENTS=EVENTS;this.VERIFIED_ON=VERIFIED_ON;', ctx);
const { LAYERS, MEDIA, SCHEDULE, GLOSSARY, VERIFIED_ON } = ctx;

// ---- helpers ----
const esc = s => String(s).replace(/\|/g, '\\|');
const table = (head, rows) => ['| ' + head.join(' | ') + ' |', '| ' + head.map(() => '---').join(' | ') + ' |', ...rows.map(r => '| ' + r.map(esc).join(' | ') + ' |')].join('\n');
const ver = m => m.type === 'book' ? '' : (m.v === 'opened' ? `opened ${VERIFIED_ON}` : (m.v === 'listed' ? 'seen in search results, not opened' : 'long-standing link, not re-opened'));
const mline = id => {
  const m = MEDIA[id];
  const title = m.u ? `[${m.t}](${m.u})` : m.t;
  const flags = [ver(m), ...m.flags].filter(Boolean).map(f => `_${f}_`).join(' · ');
  return `- **${m.type}** · ${title} · ${m.by}\n  ${m.why}${flags ? `\n  ${flags}` : ''}`;
};
const letters = ['a', 'b', 'c', 'd'];

// ---- curriculum.md ----
let c = [];
c.push('# Hyperliquid Bootcamp: the curriculum');
c.push('');
c.push(`As of ${VERIFIED_ON}. Official docs links come from the Hyperliquid GitBook sitemap and the pages that carry numbers were opened that day. The interactive version of this file, with a live market clock, calculators, quizzes and a journal, is \`index.html\` in this repository.`);
c.push('');
c.push('## How to use this');
c.push('');
c.push('This is a stack, not a reading list: ten layers, each a skill the next one assumes, the way HTML comes before CSS, CSS before JavaScript, and React before Next.js. Layer 0 is the order book. Layer 7 is you running a written trade plan with a journal. Nothing in between is optional, and nothing after Layer 7 is required to be a competent manual trader.');
c.push('');
c.push('Each layer has the same shape: **Goal** (what you can do afterwards), **the surprise** (the one thing in the layer that changes how you trade), **Concepts** (the ideas, in order), **Read** (official Hyperliquid docs first, then the vetted media for that layer), **Do** (a hands-on drill, on testnet until Layer 7), and **Passed when** (a concrete check). Do the drill before moving on; reading alone does not transfer.');
c.push('');
c.push('Pace: 8 weeks at 5 to 8 hours a week. Prerequisites: a wallet you control (MetaMask or Rabby), a browser, and comfort reading a basic price chart. The testnet faucet only pays an address that has deposited on mainnet, so day one needs a one-time deposit of about 10 USDC. Nothing else is at risk before Layer 7, and even then the plan starts at the smallest size the exchange allows.');
c.push('');
c.push('Ground rules:');
c.push('');
c.push('- Testnet first. Every drill runs on [app.hyperliquid-testnet.xyz](https://app.hyperliquid-testnet.xyz) with faucet USDC until the schedule says otherwise.');
c.push('- Official docs win. Third-party explainers are linked for intuition; when they disagree with [hyperliquid.gitbook.io/hyperliquid-docs](https://hyperliquid.gitbook.io/hyperliquid-docs), the docs are right.');
c.push('- Exchange clocks are UTC. The calendar in Layer 5 is written for IST (UTC+5:30); shift it for your own zone.');
c.push('- Journal from the first testnet order. Layer 7 is built on that journal.');
c.push('');
const answers = [];
for (const l of LAYERS) {
  c.push(`## Layer ${l.n} · ${l.name}${l.tag ? ` (the ${l.tag} of the stack)` : ''}`);
  c.push('');
  c.push(`**Goal.** ${l.goal}`);
  c.push('');
  c.push(`> ${l.surprise}`);
  c.push('');
  if (l.intro) { c.push(l.intro); c.push(''); }
  if (l.setup) { c.push('### Setup, once'); c.push(''); l.setup.forEach((s, i) => c.push(`${i + 1}. ${s}`)); c.push(''); }
  if (l.orders) { c.push('### Order types'); c.push(''); c.push(table(['Type', 'What it does', 'The rule to remember'], l.orders)); c.push(''); }
  if (l.fees) { c.push('### Fees'); c.push(''); c.push(l.fees); c.push(''); }
  if (l.concepts.length) { c.push('### Concepts, in order'); c.push(''); l.concepts.forEach(x => c.push(`- ${x}`)); c.push(''); }
  if (l.example) { c.push(`**Example.** ${l.example}`); c.push(''); }
  if (l.calendar) { c.push('### Calendar in IST'); c.push(''); c.push(table(['Event', 'UTC', 'IST, Nov to Mar', 'IST, Mar to Nov'], l.calendar)); c.push(''); }
  if (l.pieces) { c.push(table(['Piece', 'What it is', 'When it matters to you'], l.pieces)); c.push(''); }
  c.push('### Read: official docs'); c.push('');
  l.read.forEach(r => c.push(`- [${r.t}](${r.u})`)); c.push('');
  if (l.media.length) { c.push('### Media for this layer'); c.push(''); l.media.forEach(id => c.push(mline(id))); c.push(''); }
  c.push('### Do'); c.push('');
  l.drills.forEach(d => c.push(`- [ ] ${d}`)); c.push('');
  c.push(`**Passed when:** ${l.pass}`); c.push('');
  c.push('### Check yourself'); c.push('');
  l.quiz.forEach((q, qi) => { c.push(`${qi + 1}. ${q.q}`); q.o.forEach((o, oi) => c.push(`   - ${letters[oi]}) ${o}`)); });
  c.push('');
  answers.push(`- Layer ${l.n}: ${l.quiz.map((q, qi) => `${qi + 1}-${letters[q.a]}`).join(', ')}`);
}
c.push('## Eight-week schedule'); c.push('');
c.push('Eight weeks to a journaled mainnet trader at minimum size; after that the unit of progress is a 20-trade block, not a week.'); c.push('');
c.push(table(['Week', 'Layers', 'Hours', 'Graduation check'], SCHEDULE)); c.push('');
c.push('After week 8: repeat 20-trade blocks. Raise risk from 0.5% toward 1% only after a block that is both positive and above 90% adherence. Add HIP-3 markets or hyperps only after two such blocks on the main perps.'); c.push('');
c.push('## Glossary'); c.push(''); c.push(table(['Term', 'Meaning'], GLOSSARY)); c.push('');
c.push('## Quiz answers'); c.push(''); answers.forEach(a => c.push(a)); c.push('');
fs.writeFileSync(path.join(OUT, 'docs', 'curriculum.md'), c.join('\n'));

// ---- media-track.md ----
let m = [];
m.push('# Media track');
m.push('');
m.push(`Every item was found by searching the web on ${VERIFIED_ON}, opened where the site allowed it, and kept only if it teaches a mechanism or a skill without selling you something. Each entry says why it is here and what to be careful of. What was found and rejected is in [noise-filter.md](noise-filter.md).`);
m.push('');
m.push('Legend: _opened_ means the page was fetched and read that day; _seen in search results_ means it was found but the site blocked an automated read; _long-standing link_ means a stable address cited from memory and not re-opened.');
m.push('');
m.push('There is deliberately no YouTube walkthrough of the Hyperliquid interface: every tutorial found came from channels whose descriptions could not be checked, and that category is dominated by referral-code content. The docs\' How to start trading page plus the Layer 2 drills replace it. If you want a video anyway, open the description first and drop it if the first link is a referral code.');
m.push('');
for (const l of LAYERS) {
  if (!l.media.length) continue;
  m.push(`## Layer ${l.n} · ${l.name}`); m.push('');
  l.media.forEach(id => m.push(mline(id))); m.push('');
}
m.push('## X: who to follow, and the mute rule'); m.push('');
m.push('X is for announcements and positioning, not for learning. Follow [@HyperliquidX](https://x.com/HyperliquidX) with notifications on, the foundation account @HyperFND, and the data tools above (HyperDash posts as @hypurrdash). Then follow the authors of the pieces on this page if they post. Mute anyone who posts PnL screenshots, leverage flexes, referral codes, "signals", or price targets without an invalidation. The official accounts never DM you; anyone who does is a scammer.'); m.push('');
m.push('Handles were taken from the pages opened that day and a community tool list; X blocks automated checks, so confirm each handle from the links in app.hyperliquid.xyz before following.'); m.push('');
fs.writeFileSync(path.join(OUT, 'docs', 'media-track.md'), m.join('\n'));

// ---- index.html (standalone) ----
const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>') + '</style>'.length;
const bodyStart = ['<header class="topbar">', '<div class="app">'].map(m => html.indexOf(m)).filter(i => i >= 0).sort((a, b) => a - b)[0];
if (bodyStart == null) throw new Error('body start marker not found');
const style = html.slice(styleStart, styleEnd);
const body = html.slice(bodyStart);
const linkMatch = html.match(/<link rel="stylesheet"[^>]*>/);
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="description" content="A ten-layer manual perps-trading curriculum for Hyperliquid with a live market clock, calculators built on the docs' formulas, a vetted media track, quizzes and a trade journal.">
<title>Hyperliquid Workbench</title>
${linkMatch ? linkMatch[0] : ''}
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}img{max-width:100%}</style>
${style}
</head>
<body>
${body}
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), page);
console.log('wrote', ['index.html', 'docs/curriculum.md', 'docs/media-track.md'].join(', '), 'layers:', LAYERS.length, 'media:', Object.keys(MEDIA).length);
