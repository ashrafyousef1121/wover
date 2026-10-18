# Validation and local acceptance

Run `npm run build && npm test` and `npm run test:browser`. Browser tests load the actual unpacked extension into a clean profile. Provider fixtures make HTML parsing, translation and audio checks repeatable. `test-results/report.json` lists completed checks. A passed fixture test does not certify third-party availability.

## Recorded results

- **Chrome for Testing 151.0.7922.34:** 4 core tests and 14 browser checks passed, with no captured page errors.
- **Live providers:** Wiktionary returned English “hello” and German “Haus”; Google translated “hello” to “Hallo”.
- **Installed Arc, manual UI checks:** unpacked installation, live lookup/translation, saving “hello”, revealing its flashcard, rating Good, 24-hour scheduling, persistence after reload, theme persistence, and JSON backup download passed. The extension manager showed no error indicator.
- **Arc limitations:** the automation API could not hold Ctrl alone, so Ctrl-hover was not verified in Arc. The pronunciation control was clicked, but audible quality was not verified. One test word, “hello”, remains saved for review; the theme was restored to system mode.
- **Dependencies:** the installation audit reported zero vulnerabilities at the time of validation.

The results above are completed checks. The checklist below includes additional checks still to perform; it is not a claim that each item passed.

## Manual acceptance before pushing

- Load `dist/chromium` using Developer mode. Confirm settings open and the toolbar icon renders.
- Set your translation language. Hold Ctrl over words on several real sites, including a non-English article. Try Shift/Alt trigger options, selected phrases and sentence translation.
- Check real pronunciation volume and voice quality. Test automatic playback on/off and unavailable recordings.
- Save words in different languages, verify highlights and source context, search, edit notes, delete and undo.
- Reveal a review card; try Again, Hard, Good and Easy. Confirm schedule and badge updates.
- Export JSON and CSV; restore the backup using merge. Test replacement only with disposable vocabulary.
- Try light, dark and system themes, colour schemes, narrow windows and keyboard navigation.
- Disable a site and restrict browser site access. Confirm unsupported browser/PDF/store pages are handled as expected.
- Restart the browser and verify saved words, settings and badge. In extension DevTools stop the worker, then retry a lookup.
- Simulate network failure and check fallback/error messages. Check the extension Errors panel.

Audible quality, real-site coverage, minimum Chrome 116 behavior, and other Chromium brands require manual coverage beyond the installed test browser. No claim of exhaustive testing is made.
