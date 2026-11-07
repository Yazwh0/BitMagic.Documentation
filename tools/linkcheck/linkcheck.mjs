// Crawls the docs site and reports broken links (internal pages, assets and external links).
//
//   node tools/linkcheck/linkcheck.mjs                         # checks https://bitmagic.org/
//   node tools/linkcheck/linkcheck.mjs http://127.0.0.1:4000/  # checks a local `jekyll serve`
//
// Exits with 1 if anything is broken. Some sites (cx16forum.com, commanderx16.com) return
// 403 to scripts, so a 403 on an external link is usually bot blocking, not a dead link.

const START = new URL(process.argv[2] || 'https://bitmagic.org/').href;
const HOST = new URL(START).host;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const ASSET = /\.(png|jpe?g|gif|svg|ico|css|js|zip|webmanifest|xml|mp4|webm|woff2?|wav|prg|bin)$/i;

const pages = new Set();
const queue = [START];
const linkSources = new Map(); // url -> Set(pages linking to it)
const status = new Map();

function norm(u) { const x = new URL(u); x.hash = ''; return x.href; }

async function check(url) {
  if (status.has(url)) return status.get(url);
  let s;
  try {
    // HEAD first as it's cheap; some sites (VS Marketplace, NuGet) answer HEAD with 404, so retry with GET.
    let r = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': UA } });
    if (r.status >= 400) r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': UA } });
    s = r.status;
  } catch (e) { s = 'ERR ' + (e.cause?.code || e.message); }
  status.set(url, s);
  return s;
}

while (queue.length) {
  const url = queue.shift();
  if (pages.has(url)) continue;
  pages.add(url);
  let r;
  try { r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': UA } }); }
  catch (e) { status.set(url, 'ERR ' + (e.cause?.code || e.message)); continue; }
  status.set(url, r.status);
  if (!r.ok || !(r.headers.get('content-type') || '').includes('text/html')) continue;
  const html = await r.text();
  const re = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1].trim();
    if (/^(mailto:|javascript:|data:|tel:|vscode:|#)/i.test(raw)) continue;
    let abs;
    try { abs = norm(new URL(raw, r.url).href); } catch { continue; }
    if (!/^https?:/.test(abs)) continue;
    if (!linkSources.has(abs)) linkSources.set(abs, new Set());
    linkSources.get(abs).add(url);
    const u = new URL(abs);
    if (u.host === HOST && !pages.has(abs) && !ASSET.test(u.pathname)) queue.push(abs);
  }
}

const all = [...linkSources.keys()];
const CONCURRENCY = 8;
for (let i = 0; i < all.length; i += CONCURRENCY) await Promise.all(all.slice(i, i + CONCURRENCY).map(check));

// 403 (bot blocking) and 429 (rate limited, GitHub does this) mean we couldn't tell, not that it's dead.
const isBlocked = s => s === 403 || s === 429;
const failed = all.filter(u => { const s = status.get(u); return typeof s !== 'number' || s >= 400; }).sort();
const bad = failed.filter(u => !isBlocked(status.get(u)));
const blocked = failed.filter(u => isBlocked(status.get(u)));

function report(title, list) {
  if (!list.length) return;
  console.log(`${title}:`);
  for (const u of list) {
    console.log(`${status.get(u)}  ${u}`);
    for (const s of linkSources.get(u)) console.log(`      from ${s}`);
  }
  console.log();
}

console.log(`Pages crawled: ${pages.size}, unique links: ${all.length}, broken: ${bad.length}, couldn't check: ${blocked.length}\n`);
report('Broken', bad);
report("Couldn't check (403 bot blocking / 429 rate limited, check by hand)", blocked);
process.exit(bad.length ? 1 : 0);
