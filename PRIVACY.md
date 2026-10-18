# Wover privacy disclosure — draft for release review

Wover stores saved words, definitions, translations, source sentences, source page titles and URLs, review history, and preferences in the browser's local extension storage. It does not use Chrome sync or a Wover account. Backups and CSV exports are files you choose to download. Uninstalling the extension removes its local storage; exported files remain on your device.

When you request a lookup, the word is sent to Wiktionary. English dictionary lookups can fall back to DictionaryAPI.dev. A selected word or a sentence you explicitly ask to translate is sent to Google Translate or MyMemory, according to your settings and fallback selection. If you enter a MyMemory contact email, it is included in requests to that service. Providers receive ordinary network information such as your IP address. Pronunciation playback contacts Wikimedia or the recording URL supplied by the dictionary. Speech synthesis can use the browser or operating system's configured voice service.

Page text is inspected locally to identify hovered words and highlight saved vocabulary. Wover does not intentionally upload whole pages or your saved vocabulary collection. There is no analytics or advertising code in this build.

The extension requests access to websites so it can look up and highlight words wherever you read. `storage` saves vocabulary and preferences; `alarms` refreshes the review badge; `offscreen` supports dictionary HTML parsing and audio in Chromium's Manifest V3 architecture.

Delete individual words or all words in the dashboard; disable sites or restrict the extension's site access in Chrome's extension settings. Provider retention and handling are governed by those providers' policies.

Before publishing, the publisher must add a real contact address and publish this reviewed disclosure at a public URL matching the Chrome Web Store privacy disclosures.
