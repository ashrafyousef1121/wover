'use strict';
const parser = new DOMParser();
let currentAudio = null;
function parseEntries(all) {
  // Wiktionary files Translingual entries (symbols, ISO codes) under English too.
  const own = (all || []).filter((e) => e.language !== 'Translingual');
  const entries = own.length ? own : all || [];
  const byPos = new Map();
  let lemma = '';
  let formText = '';
  let formOnly = true;
  for (const entry of entries) {
    for (const def of entry.definitions || []) {
      const { text, formOf } = cleanDefinition(def.definition || '');
      if (!text) continue;
      if (formOf) {
        if (!lemma) { lemma = formOf; formText = text; }
      } else {
        formOnly = false;
      }
      const rawExamples = def.parsedExamples ? def.parsedExamples.map((x) => x.example) : def.examples || [];
      const example = rawExamples.map(htmlToText).find(Boolean) || '';
      const pos = entry.partOfSpeech || '';
      if (!byPos.has(pos)) byPos.set(pos, []);
      const defs = byPos.get(pos);
      if (defs.length < 3) defs.push({ text: clip(text, 260), example: clip(example, 200) });
    }
  }
  return {
    meanings: [...byPos].slice(0, 4).map(([pos, defs]) => ({ pos, defs })),
    lemma,
    formText,
    formOnly: formOnly && !!lemma,
    language: (entries[0] && entries[0].language) || '',
  };
}

function cleanDefinition(html) {
  const body = parser.parseFromString(`<body>${html}`, 'text/html').body;
  const hasSubsenses = !!body.querySelector('ol, ul');
  body.querySelectorAll('ol, ul, dl, sup, style, link, .maintenance-line, .reference, .previewonly')
    .forEach((n) => n.remove());
  const text = tidy(body.textContent);
  // A heading like "Terms relating to animals." whose real senses follow as separate definitions.
  const heading = body.querySelector('.use-with-mention:not(.form-of-definition)');
  if (hasSubsenses && heading && tidy(heading.textContent) === text) return { text: '', formOf: '' };
  const link = body.querySelector('.form-of-definition-link');
  return { text, formOf: link ? tidy(link.textContent) : '' };
}

function htmlToText(html) {
  const body = parser.parseFromString(`<body>${html || ''}`, 'text/html').body;
  body.querySelectorAll('sup, style, link').forEach((n) => n.remove());
  return tidy(body.textContent);
}

const tidy = (s) => String(s || '').replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim();
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

function decodeEntities(s) {
  return parser.parseFromString(`<body>${s}`, 'text/html').body.textContent;
}


chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (sender.id !== chrome.runtime.id || msg?.target !== 'offscreen') return;
  Promise.resolve().then(async () => {
    switch (msg.operation) {
      case 'parseEntries': return parseEntries(msg.value);
      case 'decodeEntities': return decodeEntities(msg.value);
      case 'play':
        if (!/^https:\/\//.test(msg.value || '')) return { ok: false };
        if (currentAudio) currentAudio.pause();
        currentAudio = new Audio(msg.value);
        try { await currentAudio.play(); return { ok: true }; }
        catch (error) { return { ok: false, error: error.message }; }
      default: throw new Error('Unknown offscreen operation');
    }
  }).then(value => respond({ value }), error => respond({ error: error.message }));
  return true;
});
