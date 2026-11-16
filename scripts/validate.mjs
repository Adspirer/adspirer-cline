// Validates the Adspirer package for Cline. Run from the package root.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const read = p => fs.readFileSync(p, 'utf8');
const c = JSON.parse(read('connector.json'));
assert.equal(c.host, 'cline');
assert.match(c.mcp.url, /^https:\/\/mcp\.adspirer\.com\/(mcp|search-ads|social-ads|retail-ads|analytics)$/);
for (const f of ['README.md', 'LISTING.md', 'llms-install.md', 'rules/adspirer.md', 'SECURITY.md', 'LICENSE', 'CHANGELOG.md', 'assets/icon.svg', 'assets/icon.png']) assert.ok(fs.existsSync(f), f);

// Skills: the layout `cline skill install` (npx skills add) discovers, and Cline's own limits.
const skills = fs.readdirSync('skills').filter(n => fs.existsSync(path.join('skills', n, 'SKILL.md'))).sort();
assert.deepEqual(skills, [...c.skills].sort(), 'connector.json skills must match skills/');
assert.ok(skills.includes(c.toolsSkill), 'tools skill');
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const n of skills) {
  const t = read(path.join('skills', n, 'SKILL.md'));
  const fm = t.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(fm, n + ': frontmatter');
  assert.match(n, /^[a-z0-9]+(-[a-z0-9]+)*$/, n + ': name format');
  assert.ok(new RegExp('^name:\\s*"?' + n + '"?\\s*$', 'm').test(fm[1]), n + ': name must match folder');
  const d = fm[1].match(/^description:\s*(.+)$/m);
  assert.ok(d, n + ': description');
  assert.ok(d[1].length <= 1024, n + ': description over 1024 characters');
  for (const r of t.matchAll(/references\/[a-z0-9-]+\.md/g)) {
    assert.ok(skills.some(s => fs.existsSync(path.join('skills', s, r[0]))), n + ': missing ' + r[0]);
  }
}

// The endpoint everywhere must be this connector's, and other hosts' setup text must not leak in.
const other = ['mcp', 'search-ads', 'social-ads', 'retail-ads', 'analytics'].map(s => 'https://mcp.adspirer.com/' + s).filter(u => u !== c.mcp.url);
const docs = ['README.md', 'LISTING.md', 'llms-install.md', 'rules/adspirer.md'];
for (const f of [...walk('skills'), ...docs]) {
  if (!f.endsWith('.md')) continue;
  const t = read(f);
  for (const u of other) assert.ok(!new RegExp(u.replace(/[.\/]/g, '\\$&') + '(?![a-z-])').test(t), f + ': wrong endpoint ' + u);
  if (!/doc-map\.md$|host-surfaces\.md$/.test(f)) assert.ok(!/Cursor Settings|\.cursor\/|~\/\.cursor|\bManus\b|Perplexity/.test(t), f + ': another host\'s instructions');
}

// Approval and purchase rules must stay in the tools skill and the rules file.
const tools = read(path.join('skills', c.toolsSkill, 'SKILL.md'));
assert.match(tools, /Never buy/, 'purchase rule missing from tools skill');
assert.ok(fs.existsSync(path.join('skills', c.toolsSkill, 'references', 'host-cline.md')), 'host reference');
assert.match(read('rules/adspirer.md'), /Never buy/, 'purchase rule missing from rules');
assert.match(read('rules/adspirer.md'), /explicit approval/, 'approval rule missing from rules');
// Cline falls back to SSE without an explicit type.
assert.match(read('llms-install.md'), /"type": "streamableHttp"/, 'llms-install.md must set the transport type');

// Marketplace entries: the checks in cline/marketplace scripts/generate.mjs --check,
// plus the schema limits that script does not enforce.
const TAGS = ['productivity', 'marketing', 'research', 'data', 'software', 'business', 'sales', 'finance', 'creative', 'memory', 'security', 'databases'];
const ids = new Set();
let entries = 0;
for (const [dir, type] of [['mcps', 'mcp'], ['skills', 'skill'], ['plugins', 'plugin']]) {
  for (const slug of fs.readdirSync(path.join('marketplace', dir))) {
    const base = path.join('marketplace', dir, slug);
    const e = JSON.parse(read(path.join(base, 'entry.json')));
    const at = base + ': ';
    assert.equal(e.id, slug, at + 'id must equal folder name');
    assert.match(e.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, at + 'id format');
    assert.ok(!ids.has(e.id), at + 'duplicate id across types'); ids.add(e.id);
    assert.equal(e.type, type, at + 'type must match directory');
    assert.equal(e.$schema, `../../../schemas/${type}.schema.json`, at + '$schema');
    for (const k of ['name', 'tagline', 'description']) assert.ok(typeof e[k] === 'string' && e[k].trim(), at + k);
    assert.ok(e.tagline.length <= 120, at + 'tagline over 120 characters');
    assert.ok(!/\.$/.test(e.tagline), at + 'tagline should not end with a period');
    assert.ok(Array.isArray(e.tags) && e.tags.length && new Set(e.tags).size === e.tags.length, at + 'tags');
    for (const t of e.tags) assert.ok(TAGS.includes(t), at + 'unknown tag ' + t);
    assert.equal(e.verified, false, at + 'verified is reserved for the Cline team');
    assert.equal(e.featured, false, at + 'featured is set by the Cline team');
    assert.ok(Array.isArray(e.install?.args) && e.install.args.length && e.install.args.every(a => typeof a === 'string'), at + 'install.args');
    for (const k of Object.keys(e.install)) assert.ok(['args', 'env', 'notes'].includes(k), at + 'unknown install key ' + k);
    for (const k of ['homepage', 'repo']) assert.match(e[k], /^https:\/\//, at + k);
    assert.equal(e.author.name, 'Adspirer', at + 'author');
    assert.ok(e.icon.startsWith('./') && fs.existsSync(path.join(base, e.icon)), at + 'icon file');
    assert.match(read(path.join(base, e.icon)), /<svg[^>]*viewBox=/, at + 'icon needs a viewBox');
    if (type === 'mcp') {
      assert.deepEqual(e.install.args, ['adspirer', '--transport', 'http', c.mcp.url], at + 'install args must match connector.json');
      assert.equal(c.install.mcp, 'cline mcp install ' + e.install.args.join(' '), 'connector.json install.mcp');
      assert.ok(!e.install.args.some(a => /<[^>]+>/.test(a)), at + 'placeholder in install args');
    } else if (type === 'plugin') {
      assert.deepEqual(e.install.args, ['https://github.com/Adspirer/adspirer-cline'], at + 'install args');
      assert.equal(c.install.plugin, 'cline plugin install ' + e.install.args.join(' '), 'connector.json install.plugin');
    } else {
      assert.deepEqual(e.install.args, ['Adspirer/adspirer-cline'], at + 'install args');
      assert.equal(c.install.skills, 'cline skill install ' + e.install.args.join(' '), 'connector.json install.skills');
    }
    entries++;
  }
}
assert.equal(entries, 3, 'expected one MCP entry, one skill entry and one plugin entry');

// Plugin: the checks in cline/plugins scripts/validate-plugins.mjs, plus the
// MCP-and-skills-only scope that repository's maintainer enforces in review.
const pdir = path.join('plugins', 'adspirer');
const pkg = JSON.parse(read(path.join(pdir, 'package.json')));
assert.equal(pkg.name, 'adspirer', 'plugin package name must equal its slug');
assert.deepEqual(pkg.cline.plugins[0].capabilities, ['mcp', 'skills'], 'plugin capabilities');
const entry = read(path.join(pdir, 'index.ts'));
assert.ok(entry.includes(c.mcp.url) && entry.includes('"streamableHttp"'), 'plugin must register the hosted endpoint');
assert.ok(!/registerTool|registerHook|registerRule|registerCommand/.test(entry), 'plugin must bundle MCP and skills only');
assert.ok(fs.existsSync(path.join(pdir, 'README.md')), 'plugin README');
for (const f of walk(pdir)) {
  const t = read(f);
  assert.ok(!t.includes('\u2014'), f + ': em dash (rejected by cline/plugins)');
  if (f.endsWith('.md')) assert.ok(!/\*\*[^*\n][\s\S]*?\*\*/.test(t), f + ': markdown bold (rejected by cline/plugins)');
}
assert.deepEqual(fs.readdirSync(path.join(pdir, 'skills')).sort(), skills, 'plugin skills must match skills/');
assert.deepEqual(JSON.parse(read('package.json')).cline.plugins[0].paths, ['./plugins/adspirer/index.ts'], 'root package.json plugin path');

// Install commands and relative links in the docs must be right.
for (const f of ['README.md', 'LISTING.md', 'llms-install.md']) {
  const t = read(f);
  assert.ok(t.includes(c.install.mcp), f + ': MCP install command');
  assert.ok(t.includes(c.install.skills), f + ': skills install command');
  for (const m of t.matchAll(/\]\(([^)]+)\)/g)) {
    const target = m[1].split('#')[0];
    if (target && !/^(https?:|mailto:)/.test(target)) assert.ok(fs.existsSync(target), f + ': broken link ' + target);
  }
}
console.log(`PASS: ${c.name} for ${c.host}: ${skills.length} skills, ${entries} marketplace entries, endpoint, links, approval and purchase rules`);
