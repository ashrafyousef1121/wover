<p align="center">
  <img src="icons/icon.svg" width="96" height="96" alt="Wover logo">
</p>

<h1 align="center">Wover for Chrome</h1>

<p align="center">
  <b>Hold a key, point at a word, learn it.</b><br>
  A Chrome extension for learning vocabulary while you read.<br>
  Also compatible with Chromium-based browsers such as Arc.
</p>

<p align="center">
  <img alt="Chrome 116+" src="https://img.shields.io/badge/Chrome-116%2B-4285F4?logo=googlechrome&logoColor=white">
  <img alt="Manifest V3" src="https://img.shields.io/badge/Manifest-V3-555555">
  <img alt="Status: prototype" src="https://img.shields.io/badge/status-prototype-orange">
</p>

<p align="center">
  <img src="docs/screenshots/popup.png" width="760" alt="The Wover popup over an article, showing a word's pronunciation, translation and definitions. Saved words in the article are highlighted.">
</p>

Chrome version of [AEA1212/wover](https://github.com/AEA1212/wover), also compatible with Chromium-based browsers such as Arc. The code lives on this fork’s `chromium` branch. The original Firefox version remains on the unchanged `main` branch and in the upstream repository. This is a review build, not a published Chrome Web Store release.

## Features

- Definitions, pronunciation and translations while you read
- Saved vocabulary with source sentences and separate language lists
- Word highlighting and spaced-repetition review
- Light, dark and system themes, plus configurable highlight colours
- JSON backup/restore and CSV export

## 📸 Screenshots

| Review | Word lists |
| --- | --- |
| <img src="docs/screenshots/review.png" alt="A flashcard with its translation, definitions, rating buttons and review stats."> | <img src="docs/screenshots/words.png" alt="The word list with English and German lists."> |

| Colour schemes | Dark mode |
| --- | --- |
| <img src="docs/screenshots/colors.png" alt="Highlighting settings with colour schemes and highlight levels."> | <img src="docs/screenshots/popup-dark.png" alt="The popup in dark mode."> |

Screenshots are reused from the original Wover README and show the shared interface. Chrome and Arc validation results are documented below.

## Get the Chromium branch

```sh
git clone --branch chromium https://github.com/ashrafyousef1121/wover.git
cd wover
npm ci
npm run build
```

Build prerequisites are listed below. Build output is generated locally and is not committed.

## Try it locally

1. Build from source as above, then open `chrome://extensions` in Chrome, or `arc://extensions` in Arc. The manifest requires Chromium 116 or later; that minimum version has not been separately tested.
2. Enable **Developer mode**, choose **Load unpacked**, and select `dist/chromium` in this repository.
3. Select a translation language in Wover's settings. Pin Wover from the browser's Extensions menu.
4. Open or reload a regular web page, hold **Ctrl**, and point at a word. Save it, then click the toolbar icon to review it.

Internal browser pages, the Chrome Web Store, and built-in PDF viewers do not allow these content scripts. File URLs require enabling **Allow access to file URLs** in the extension's details. Incognito access is off unless you enable it.

## Build and test

Node.js 22+, npm and Python 3 are needed to build; the browser tests also require OpenSSL on your PATH. On Windows, set the `PYTHON` environment variable if your Python executable is named `python` instead of `python3`.

Users of the packaged extension need none of these development tools.

```sh
npm ci
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

If using an already installed test browser, set `CHROMIUM_EXECUTABLE` to its executable. `HEADED=1` shows the test browser. Tests create an isolated, disposable profile and never use your personal browsing profile. Screenshots and the test report go in `test-results/`. The disposable browser profile bypasses certificate checks only for the local HTTPS audio fixture. The extension does not change certificate settings. Live-provider smoke results are recorded separately and are not assertions of ongoing provider availability.

`npm run build` produces `dist/chromium/` and `dist/wover-chromium-1.0.0.zip`. Only explicitly listed runtime files are packaged. No dependencies, tests, credentials, or remote JavaScript are included.

## Chromium implementation

The MV3 service worker owns storage, lookup requests, alarms and the badge. An on-demand offscreen document parses dictionary HTML and plays pronunciation recordings. Messages keep their response channel open across asynchronous operations. Dashboard reuse finds open extension contexts instead of relying on Firefox background-window access. PNG icons are rendered from the original SVG. Word storage and backup formats remain compatible with the upstream extension.

Lookups use Wiktionary, with DictionaryAPI.dev as an English fallback. Translations use Google Translate or MyMemory. External service availability, quotas, and voices vary. Automated browser tests use deterministic responses for reproducibility; live-provider results are recorded separately.

## Validation status

Four core tests and fourteen browser checks passed on Chrome for Testing 151.0.7922.34. These cover lookup/parsing, case-sensitive German headwords, translation, popup saving, highlighting, review, backup export/restore, audio playback, offscreen recreation, worker restart and dashboard reuse.

Manual checks in the installed Arc browser passed for loading the extension, live English lookup and German translation, saving, flashcard reveal and scheduling, persistence after reload, themes, and backup download. Arc showed no extension error indicator. Ctrl-hover in Arc and audible pronunciation quality still need a manual check. See [TESTING.md](TESTING.md) for the remaining acceptance checks.

## Before publication

See [TESTING.md](TESTING.md), [PRIVACY.md](PRIVACY.md), and [STORE-CHECKLIST.md](STORE-CHECKLIST.md). Nothing is automatically pushed, signed, uploaded or submitted.
