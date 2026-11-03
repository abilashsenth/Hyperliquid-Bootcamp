// Generates docs/curriculum.md, docs/media-track.md and docs/figures/*.svg from the page and the lesson files,
// so the prose, the figures, the quizzes and the media cards cannot drift between the site and the docs.
// Usage: node tools/gen-docs.js        (from anywhere; paths are resolved from this file)
// Sources: index.html (the DATA block: layers, media, schedule, glossary), lessons/layer-*.js (lesson text and
// figures), lib/fig.js (drawing primitives) and lib/widgets.js (sandbox titles only).
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://abilashsenth.github.io/Hyperliquid-Bootcamp/';
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8').replace(/\r\n/g, '\n');

// ---- evaluate the DATA block from index.html, then the lesson and figure files, in one sandbox ----
const html = read('index.html');
const start = html.indexOf('/* ============================ DATA ============================ */');
const end = html.indexOf('/* ============================ STATE ============================ */');
if (start < 0 || end < 0) throw new Error('DATA block markers not found in index.html');
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(html.slice(start, end) + '\nthis.LAYERS=LAYERS;this.MEDIA=MEDIA;this.SCHEDULE=SCHEDULE;this.GLOSSARY=GLOSSARY;this.EVENTS=EVENTS;this.VERIFIED_ON=VERIFIED_ON;', ctx);
const lessonFiles = fs.readdirSync(path.join(ROOT, 'lessons')).filter(f => /^layer-\d+\.js$/.test(f)).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
vm.runInContext([read('lib/fig.js'), ...lessonFiles.map(f => read('lessons/' + f)), read('lib/widgets.js')].join('\n'), ctx);
const { LAYERS, MEDIA, SCHEDULE, GLOSSARY, VERIFIED_ON, FigLib, FIG, LESSONS, WIDGETS } = ctx;

// ---- figures as standalone SVG files, light palette ----
const figDir = path.join(ROOT, 'docs', 'figures');
fs.mkdirSync(figDir, { recursive: true });
const PAL = FigLib.pal('light');
const used = new Set();
for (const l of LAYERS) {
  const L = LESSONS[l.id]; if (!L) continue;
  for (const s of L.sections) { if (s.fig) used.add(s.fig); if (s.figDocs) used.add(s.figDocs); }
}
let figCount = 0;
for (const name of used) {
  if (!FIG[name]) throw new Error('figure not found: ' + name);
  const svg = FIG[name](PAL);
  if (svg.includes('[object Object]')) throw new Error('figure ' + name + ' rendered an object');
  fs.writeFileSync(path.join(figDir, name + '.svg'), svg);
  figCount++;
}
for (const f of fs.readdirSync(figDir)) { if (f.endsWith('.svg') && !used.has(f.slice(0, -4))) fs.unlinkSync(path.join(figDir, f)); }

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
// Lesson prose uses **bold**, `code` and [text](url); page-internal links (#tools) become site links.
const md = s => String(s).replace(/\]\(#([^)]+)\)/g, `](${SITE}#$1)`);
const alt = name => { const m = FIG[name](PAL).match(/aria-label="([^"]*)"/); return m ? m[1].replace(/&quot;/g, '"') : name; };

// ---- curriculum.md ----
let c = [];
c.push('# Hyperliquid Bootcamp: the curriculum');
c.push('');
c.push(`As of ${VERIFIED_ON}. Official docs links come from the Hyperliquid GitBook sitemap and the pages that carry numbers were opened that day. This file is generated from the site by \`tools/gen-docs.js\`: every lesson, figure, quiz and media card below is the same one the page shows. The interactive version, with sandboxes you can play with, a live market clock, calculators and a journal, is at [${SITE.replace('https://', '')}](${SITE}).`);
c.push('');
c.push('## How to use this');
c.push('');
c.push('This is a stack, not a reading list: ten layers, each a skill the next one assumes, the way HTML comes before CSS, CSS before JavaScript, and React before Next.js. Layer 0 is the order book. Layer 7 is you running a written trade plan with a journal. Nothing in between is optional, and nothing after Layer 7 is required to be a competent manual trader.');
c.push('');
c.push('Each layer has the same shape. **Goal** (what you can do afterwards) and **the surprise** (the one thing in the layer that changes how you trade). **The lesson**: short numbered sections that build the idea from zero, each with a figure, a one-line takeaway, and often a quick check; sections marked *Try it* have a sandbox on the site. **Recap**: the same ideas in one line each. **Read** (official docs first, then the vetted media for the layer), **Do** (hands-on drills, on testnet until Layer 7) and **Passed when** (a concrete check). Do the drill before moving on; reading alone does not transfer.');
c.push('');
c.push('Pace: 8 weeks at 5 to 8 hours a week. Prerequisites: a wallet you control (MetaMask or Rabby), a browser, and comfort reading a basic price chart. The testnet faucet only pays an address that has deposited on mainnet, so day one needs a one-time deposit of about 10 USDC. Nothing else is at risk before Layer 7, and even then the plan starts at the smallest size the exchange allows.');
c.push('');
c.push('Before the first drill, do the one-time setup (Layer 2 has the detail and the links):');
c.push('');
(LAYERS.find(l => l.id === 'layer-2').setup || []).forEach((s, i) => c.push(`${i + 1}. ${s}`));
c.push('');
c.push('Ground rules:');
c.push('');
c.push('- Testnet first. Every drill runs on [app.hyperliquid-testnet.xyz](https://app.hyperliquid-testnet.xyz) with faucet USDC until the schedule says otherwise.');
c.push('- Official docs win. Third-party explainers are linked for intuition; when they disagree with [hyperliquid.gitbook.io/hyperliquid-docs](https://hyperliquid.gitbook.io/hyperliquid-docs), the docs are right.');
c.push('- Exchange clocks are UTC. The calendar in Layer 5 is written for IST (UTC+5:30); shift it for your own zone.');
c.push('- Journal from the first testnet order. Layer 7 is built on that journal.');
c.push('');
c.push('In the figures, green is the bid side (buyers, longs), red the ask side (sellers, shorts, liquidation), blue is you (your order, your position, your level), amber is an outside reference (the oracle, spot, an underlying).');
c.push('');
c.push('Contents: ' + LAYERS.map(l => `[Layer ${l.n}](#layer-${l.n}--${l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')})`).join(' · ') + ' · [Eight-week schedule](#eight-week-schedule) · [Glossary](#glossary) · [Quiz answers](#quiz-answers)');
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
  const L = LESSONS[l.id];
  if (L) {
    c.push(`### The lesson`); c.push('');
    if (L.intro) { c.push(md(L.intro)); c.push(''); }
    if (L.legend) { c.push(`_${L.legend}_`); c.push(''); }
    L.sections.forEach((s, i) => {
      c.push(`#### ${i + 1}. ${s.t}`); c.push('');
      (s.p || []).forEach(p => { c.push(md(p)); c.push(''); });
      if (s.list) { s.list.forEach((x, k) => c.push(`${k + 1}. ${md(x)}`)); c.push(''); }
      (s.p2 || []).forEach(p => { c.push(md(p)); c.push(''); });
      if (s.code) { c.push('```python'); c.push(s.code); c.push('```'); c.push(''); }
      const figName = s.fig || s.figDocs;
      if (figName) { c.push(`![${alt(figName).replace(/[\[\]]/g, '')}](figures/${figName}.svg)`); c.push(''); if (s.cap) { c.push(`_${md(s.cap)}_`); c.push(''); } }
      if (s.try) { const W = WIDGETS[s.try]; c.push(`> **Try it on the site: ${W ? W.title : s.try}.** ${s.tryNote ? md(s.tryNote) + ' ' : ''}[Open the sandbox](${SITE}#${l.id}/${s.id}).`); c.push(''); }
      if (s.ex) { c.push(`> **Example.** ${md(s.ex)}`); c.push(''); }
      if (s.key) { c.push(`**Takeaway.** ${md(s.key)}`); c.push(''); }
      if (s.check) { c.push('<details><summary><b>Quick check.</b> ' + s.check.q + '</summary>'); c.push(''); s.check.o.forEach((o, oi) => c.push(`- ${letters[oi]}) ${o}`)); c.push(''); c.push(`**Answer: ${letters[s.check.a]}.** ${s.check.why || ''}`); c.push(''); c.push('</details>'); c.push(''); }
    });
  }
  if (l.setup) { c.push('### Setup, once'); c.push(''); l.setup.forEach((s, i) => c.push(`${i + 1}. ${s}`)); c.push(''); }
  if (l.orders) { c.push('### Order types, as a table'); c.push(''); c.push(table(['Type', 'What it does', 'The rule to remember'], l.orders)); c.push(''); }
  if (l.fees) { c.push('### Fees, in one paragraph'); c.push(''); c.push(l.fees); c.push(''); }
  if (l.concepts.length) { c.push(L ? '### Recap: the ideas in one line each' : '### Concepts, in order'); c.push(''); l.concepts.forEach(x => c.push(`- ${x}`)); c.push(''); }
  if (l.example) { c.push(`**Example.** ${l.example}`); c.push(''); }
  if (l.calendar) { c.push('### Calendar in IST'); c.push(''); c.push(table(['Event', 'UTC', 'IST, Nov to Mar', 'IST, Mar to Nov'], l.calendar)); c.push(''); }
  if (l.pieces) { c.push('### What else is on the venue, as a table'); c.push(''); c.push(table(['Piece', 'What it is', 'When it matters to you'], l.pieces)); c.push(''); }
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
fs.writeFileSync(path.join(ROOT, 'docs', 'curriculum.md'), c.join('\n'));

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
fs.writeFileSync(path.join(ROOT, 'docs', 'media-track.md'), m.join('\n'));

const sections = LAYERS.reduce((a, l) => a + ((LESSONS[l.id] || { sections: [] }).sections.length), 0);
console.log('wrote docs/curriculum.md, docs/media-track.md and', figCount, 'figures in docs/figures ·', LAYERS.length, 'layers,', sections, 'lesson sections,', Object.keys(MEDIA).length, 'media items');
