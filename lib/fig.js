/* Shared drawing primitives for the lesson figures.
   Every figure is a pure function (P) => svg string, where P is a palette from FigLib.pal().
   In the browser P uses the page's CSS variables; tools/gen-docs.js calls the same functions with the
   same colours fixed, to write standalone SVG files for the docs that look like the page's figures. */
(function (root) {
  'use strict';
  const FIG = root.FIG || (root.FIG = {});
  let counter = 0;

  function pal(mode) {
    if (mode === 'css') return {
      mode: 'css', bg: null,
      ink: 'currentColor', muted: 'var(--muted)', line: 'var(--line-2)', grid: 'var(--line)',
      surf: 'var(--surface)', surf2: 'var(--surface-2)',
      bid: 'var(--good)', ask: 'var(--bad)', you: 'var(--info)', oracle: 'var(--warn)', mark: 'currentColor', mint: 'var(--primary)',
      bidSoft: 'color-mix(in srgb,var(--good) 20%,transparent)', askSoft: 'color-mix(in srgb,var(--bad) 18%,transparent)',
      youSoft: 'color-mix(in srgb,var(--info) 16%,transparent)', oracleSoft: 'color-mix(in srgb,var(--warn) 20%,transparent)',
      inkSoft: 'color-mix(in srgb,currentColor 9%,transparent)', mintSoft: 'color-mix(in srgb,var(--primary) 18%,transparent)',
      font: 'var(--sans)', mono: 'var(--mono)'
    };
    /* The page's figure palette with the values fixed (index.html :root): an abyss well, cloud ink, ash text. */
    return {
      mode: 'fixed', bg: '#090a0b', bgStroke: 'rgba(255,255,255,.08)',
      ink: '#f5f5f7', muted: '#9f9fa0', line: '#6a6b6b', grid: '#3f4041',
      surf: '#2e2e2e', surf2: '#3f4041',
      bid: '#4fce8f', ask: '#f47067', you: '#00b3dd', oracle: '#e3a63d', mark: '#f5f5f7', mint: '#ffffff',
      bidSoft: 'rgba(79,206,143,.20)', askSoft: 'rgba(244,112,103,.18)', youSoft: 'rgba(0,179,221,.16)', oracleSoft: 'rgba(227,166,61,.20)',
      inkSoft: 'rgba(245,245,247,.09)', mintSoft: 'rgba(255,255,255,.18)',
      font: "Inter, 'Segoe UI', system-ui, -apple-system, sans-serif", mono: "'Roboto Mono', Consolas, Menlo, monospace"
    };
  }

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const num = n => Number.isInteger(n) ? String(n) : String(+n.toFixed(2));
  const style = o => {
    const parts = [];
    if (o.fill !== undefined) parts.push('fill:' + o.fill);
    if (o.stroke !== undefined) parts.push('stroke:' + o.stroke);
    if (o.sw !== undefined) parts.push('stroke-width:' + o.sw);
    if (o.dash) parts.push('stroke-dasharray:' + o.dash);
    if (o.op !== undefined) parts.push('opacity:' + o.op);
    if (o.cap) parts.push('stroke-linecap:' + o.cap);
    if (o.join) parts.push('stroke-linejoin:' + o.join);
    if (o.font) parts.push('font-family:' + o.font);
    if (o.size) parts.push('font-size:' + o.size + 'px');
    if (o.weight) parts.push('font-weight:' + o.weight);
    if (o.italic) parts.push('font-style:italic');
    if (o.ls) parts.push('letter-spacing:' + o.ls);
    return parts.length ? ` style="${parts.join(';')}"` : '';
  };

  /* A figure: returns the <svg> with viewBox, role img and aria-label. body(id) receives the figure's unique id for marker ids. */
  function svg(P, w, h, label, body) {
    const id = 'fg' + (++counter);
    const inner = typeof body === 'function' ? body(id) : body;
    const bg = P.bg ? `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="12"${style({ fill: P.bg, stroke: P.bgStroke, sw: P.bgStroke ? 1 : undefined })}/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"${style({ font: P.font, size: 13 })} data-w="${w}">${bg}${defs(P, id)}${inner}</svg>`;
  }
  function defs(P, id) {
    const m = (name, color) => `<marker id="${id}-${name}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0.5 L10 5 L0 9.5 z"${style({ fill: color })}/></marker>`;
    return `<defs>${m('ink', P.ink)}${m('muted', P.muted)}${m('bid', P.bid)}${m('ask', P.ask)}${m('you', P.you)}${m('oracle', P.oracle)}${m('mint', P.mint)}</defs>`;
  }
  const arrow = (id, name) => ` marker-end="url(#${id}-${name})"`;

  function t(P, x, y, s, o) {
    o = o || {};
    const anchor = o.anchor ? ` text-anchor="${o.anchor}"` : '';
    return `<text x="${num(x)}" y="${num(y)}"${anchor}${o.dy ? ` dy="${o.dy}"` : ''}${style({ fill: o.fill || P.ink, font: o.mono ? P.mono : undefined, size: o.size || 13, weight: o.weight, italic: o.italic, op: o.op, ls: o.ls })}>${esc(s)}</text>`;
  }
  function r(P, x, y, w, h, o) {
    o = o || {};
    return `<rect x="${num(x)}" y="${num(y)}" width="${num(Math.max(0, w))}" height="${num(Math.max(0, h))}"${o.rx != null ? ` rx="${o.rx}"` : ''}${style({ fill: o.fill === undefined ? 'none' : o.fill, stroke: o.stroke, sw: o.sw, dash: o.dash, op: o.op })}/>`;
  }
  function l(P, x1, y1, x2, y2, o) {
    o = o || {};
    return `<line x1="${num(x1)}" y1="${num(y1)}" x2="${num(x2)}" y2="${num(y2)}"${o.arrow ? arrow(o.id, o.arrow) : ''}${style({ stroke: o.stroke || P.ink, sw: o.sw || 1.5, dash: o.dash, op: o.op, cap: o.cap || 'round' })}/>`;
  }
  function c(P, cx, cy, rad, o) {
    o = o || {};
    return `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(rad)}"${style({ fill: o.fill === undefined ? P.ink : o.fill, stroke: o.stroke, sw: o.sw, op: o.op })}/>`;
  }
  function p(P, d, o) {
    o = o || {};
    return `<path d="${d}"${o.arrow ? arrow(o.id, o.arrow) : ''}${style({ fill: o.fill === undefined ? 'none' : o.fill, stroke: o.stroke, sw: o.sw, dash: o.dash, op: o.op, cap: o.cap || 'round', join: o.join || 'round' })}/>`;
  }
  function poly(P, pts, o) {
    o = o || {};
    const tag = o.closed ? 'polygon' : 'polyline';
    return `<${tag} points="${pts.map(q => num(q[0]) + ',' + num(q[1])).join(' ')}"${style({ fill: o.fill === undefined ? 'none' : o.fill, stroke: o.stroke, sw: o.sw, dash: o.dash, op: o.op, cap: 'round', join: 'round' })}/>`;
  }
  /* Word-wrapped text: breaks `text` into lines that fit maxW (estimated from the font size) and draws them from (x, y). Returns {s, lines, h}. */
  function wrap(P, x, y, text, maxW, o) {
    o = o || {}; const size = o.size || 12; const cw = size * (o.mono ? 0.62 : (o.weight >= 700 ? 0.6 : 0.56));
    const maxChars = Math.max(8, Math.floor(maxW / cw)); const words = String(text).split(' '); const lines = []; let cur = '';
    for (const w of words) { if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; }
    if (cur) lines.push(cur);
    const lh = o.lh || Math.round(size * 1.4); let s = '';
    lines.forEach((ln, i) => { s += t(P, x, y + i * lh, ln, o); });
    return { s, lines: lines.length, h: lines.length * lh };
  }
  /* A label on a soft pill. width is estimated from the text. */
  function pill(P, x, y, s, o) {
    o = o || {};
    const size = o.size || 12;
    const w = o.w || Math.round(String(s).length * size * (o.mono ? 0.62 : 0.56) + 16);
    const h = o.h || size + 10;
    const anchor = o.anchor || 'middle';
    let rx = x; if (anchor === 'middle') rx = x - w / 2; if (anchor === 'end') rx = x - w;
    return r(P, rx, y - h / 2, w, h, { rx: h / 2, fill: o.bg || P.inkSoft, stroke: o.stroke, sw: o.sw }) + t(P, rx + w / 2, y + size * 0.36, s, { anchor: 'middle', size, weight: o.weight || 700, fill: o.fill || P.ink, mono: o.mono });
  }
  /* A box with a title and optional lines of text. */
  function box(P, x, y, w, h, title, lines, o) {
    o = o || {};
    let s = r(P, x, y, w, h, { rx: o.rx == null ? 10 : o.rx, fill: o.fill || P.surf, stroke: o.stroke || P.line, sw: o.sw || 1.2, dash: o.dash });
    const size = o.size || 13;
    let ty = y + (o.pad == null ? 22 : o.pad);
    if (title) { s += t(P, o.align === 'left' ? x + 12 : x + w / 2, ty, title, { anchor: o.align === 'left' ? 'start' : 'middle', weight: 800, size, fill: o.titleFill || P.ink }); ty += size + 5; }
    (lines || []).forEach(line => { s += t(P, o.align === 'left' ? x + 12 : x + w / 2, ty, line, { anchor: o.align === 'left' ? 'start' : 'middle', size: size - 1, fill: o.lineFill || P.muted }); ty += size + 3; });
    return s;
  }
  /* Horizontal number line with ticks. ticks: [[x, label], ...] */
  function axis(P, x0, x1, y, ticks, o) {
    o = o || {};
    let s = l(P, x0, y, x1, y, { stroke: P.line, sw: 1.5 });
    (ticks || []).forEach(k => { s += l(P, k[0], y - 4, k[0], y + 4, { stroke: P.muted, sw: 1 }) + t(P, k[0], y + 18, k[1], { anchor: 'middle', size: o.size || 11, fill: P.muted, mono: true }); });
    return s;
  }
  function fmtPx(x, d) { return x.toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function fmtSz(x) { return x.toLocaleString('en-US', { maximumFractionDigits: 5 }); }

  /* An order-book ladder. asks and bids are arrays of [price, size] with asks ascending and bids descending.
     opts: {x, y, w, rowH, pxDec, unit, spread:boolean, bars:boolean, maxSz, consumed:{price:fraction}, you:{side,price,size}, total:boolean, pxW, szW}
     Returns {s, rows} where rows maps price -> row centre y. Asks are drawn top-down with the best ask nearest the gap. */
  function ladder(P, asks, bids, o) {
    o = o || {};
    const x = o.x || 0, y = o.y || 0, w = o.w || 300, rowH = o.rowH || 20, pxDec = o.pxDec || 0;
    const maxSz = o.maxSz || Math.max(...asks.map(a => a[1]), ...bids.map(b => b[1]));
    const pxW = o.pxW || 86, szW = o.szW || 74;
    const barX = x + pxW + 6, barW = w - pxW - 6;
    const rows = {}; let s = ''; let cy = y;
    const head = o.head !== false;
    if (head) {
      s += t(P, x + pxW - 4, cy + 11, 'Price', { anchor: 'end', size: 10.5, fill: P.muted, weight: 700 });
      s += t(P, x + pxW + szW + 8, cy + 11, o.unit ? 'Size (' + o.unit + ')' : 'Size', { anchor: 'end', size: 10.5, fill: P.muted, weight: 700 });
      if (o.total) s += t(P, x + w - 4, cy + 11, 'Total', { anchor: 'end', size: 10.5, fill: P.muted, weight: 700 });
      cy += 18;
    }
    const draw = (lv, side, cum) => {
      const [px, sz] = lv; const color = side === 'ask' ? P.ask : P.bid, soft = side === 'ask' ? P.askSoft : P.bidSoft;
      const frac = Math.min(1, sz / maxSz);
      if (o.bars !== false) s += r(P, barX + barW - barW * frac, cy + 2, barW * frac, rowH - 4, { rx: 3, fill: soft });
      const con = o.consumed && o.consumed[px];
      if (con) s += r(P, barX + barW - barW * frac, cy + 2, barW * frac * Math.min(1, con), rowH - 4, { rx: 3, fill: P.you, op: .55 });
      s += t(P, x + pxW - 4, cy + rowH / 2 + 4.5, fmtPx(px, pxDec), { anchor: 'end', size: 12, mono: true, fill: color, weight: 600 });
      s += t(P, x + pxW + szW + 8, cy + rowH / 2 + 4.5, fmtSz(sz), { anchor: 'end', size: 12, mono: true, fill: P.ink });
      if (o.total) s += t(P, x + w - 4, cy + rowH / 2 + 4.5, fmtSz(+cum.toFixed(5)), { anchor: 'end', size: 11, mono: true, fill: P.muted });
      rows[px] = cy + rowH / 2; cy += rowH;
    };
    let cum = 0; const askRows = asks.slice().reverse(); const cums = []; let acc = 0;
    asks.forEach(a => { acc += a[1]; cums.push(acc); }); cums.reverse();
    askRows.forEach((a, i) => draw(a, 'ask', cums[i]));
    if (o.spread !== false && asks.length && bids.length) {
      const sp = asks[0][0] - bids[0][0];
      s += r(P, x, cy + 1, w, rowH - 2, { rx: 4, fill: P.inkSoft });
      s += t(P, x + w / 2, cy + rowH / 2 + 4, `Spread ${fmtPx(sp, pxDec)}  ·  ${(sp / ((asks[0][0] + bids[0][0]) / 2) * 100).toFixed(sp / asks[0][0] < 0.0001 ? 4 : 3)}%`, { anchor: 'middle', size: 11, mono: true, fill: P.muted, weight: 600 });
      rows.spread = cy + rowH / 2; cy += rowH;
    }
    cum = 0; bids.forEach(b => { cum += b[1]; draw(b, 'bid', cum); });
    if (o.you) {
      const yy = rows[o.you.price];
      if (yy != null) {
        s += r(P, x - 4, yy - rowH / 2 + 1, w + 8, rowH - 2, { rx: 6, fill: 'none', stroke: P.you, sw: 2 });
        s += pill(P, x + w + 12, yy, o.you.label || 'you', { anchor: 'start', bg: P.you, fill: P.surf, size: 11 });
      }
    }
    return { s, rows, bottom: cy, barX, barW };
  }
  /* Candle at x with open, high, low, close in price units; yOf maps price to y. */
  function candle(P, x, open, high, low, close, w, yOf, o) {
    o = o || {};
    const up = close >= open; const col = up ? P.bid : P.ask;
    let s = l(P, x, yOf(high), x, yOf(low), { stroke: col, sw: 1.5 });
    const top = yOf(Math.max(open, close)), bot = yOf(Math.min(open, close));
    s += r(P, x - w / 2, top, w, Math.max(1.5, bot - top), { rx: 1.5, fill: up ? (o.hollow ? P.surf : col) : col, stroke: col, sw: 1.2 });
    return s;
  }
  /* Simple line chart path from [[x,y],...] */
  const path = pts => pts.map((q, i) => (i ? 'L' : 'M') + num(q[0]) + ' ' + num(q[1])).join(' ');
  /* Smooth-ish curve (Catmull-Rom to Bezier) */
  function curve(pts) {
    if (pts.length < 3) return path(pts);
    let d = 'M' + num(pts[0][0]) + ' ' + num(pts[0][1]);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${num(c1[0])} ${num(c1[1])} ${num(c2[0])} ${num(c2[1])} ${num(p2[0])} ${num(p2[1])}`;
    }
    return d;
  }
  /* Legend chips: items [[color, label], ...] drawn in a row from x,y */
  function legend(P, x, y, items, o) {
    o = o || {};
    let s = '', cx = x;
    items.forEach(it => {
      s += r(P, cx, y - 6, 12, 12, { rx: 3, fill: it[0] });
      s += t(P, cx + 17, y + 4, it[1], { size: o.size || 11.5, fill: P.muted, weight: 600 });
      cx += 17 + it[1].length * (o.size || 11.5) * 0.56 + 18;
    });
    return s;
  }
  /* A tiny stick figure of money: n coins stacked, for fee comparisons */
  function coins(P, x, y, n, color) {
    let s = ''; for (let i = 0; i < n; i++) s += `<ellipse cx="${num(x)}" cy="${num(y - i * 5)}" rx="14" ry="5"${style({ fill: color, stroke: P.surf, sw: 1 })}/>`; return s;
  }

  root.FigLib = { pal, svg, t, wrap, r, l, c, p, poly, pill, box, axis, ladder, candle, path, curve, legend, coins, fmtPx, fmtSz, esc, num, style };
})(typeof window !== 'undefined' ? window : globalThis);
