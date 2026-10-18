const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../common.js');
const W = globalThis.Wover;
test('language-specific keys do not merge homographs', () => {
 assert.notEqual(W.keyOf('en','Gift'), W.keyOf('de','Gift'));
 assert.equal(W.keyOf('en-US',' Cat '), 'w:en:cat');
});
test('review scheduling advances and records lapses', () => {
 const now = 1000000;
 const entry = W.newEntry({word:'cat'}, now);
 const good = W.schedule(entry, 3, now);
 assert.ok(good.due > now); assert.equal(good.reviews, 1);
 const again = W.schedule(good, 1, now);
 assert.ok(again.due < good.due); assert.ok(again.lapses > good.lapses);
});
test('saved lookup preserves translation language and context', () => {
 const word = W.entryFromLookup({word:'cat', lang:'en', translation:{text:'Katze', target:'de', alts:[]}}, {sentence:'A cat.'});
 assert.equal(word.trLang,'de'); assert.equal(word.context.sentence,'A cat.');
});
test('manifest references shipped files and Chromium worker', () => {
 const fs = require('node:fs'); const path = require('node:path'); const m = require('../manifest.json');
 assert.equal(m.manifest_version,3); assert.ok(m.permissions.includes('offscreen')); assert.equal(m.background.scripts,undefined);
 for (const f of [m.background.service_worker,...Object.values(m.icons),...m.content_scripts.flatMap(x=>[...x.js,...x.css])]) assert.ok(fs.existsSync(path.join(__dirname,'..',f)),f);
 assert.ok(m.description.length <= 132);
});
