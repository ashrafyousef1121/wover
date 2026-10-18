const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const sharp = require('sharp');
(async () => {
  const root = path.resolve(__dirname, '..');
  for (const size of [16, 32, 48, 128]) await sharp(path.join(root, 'icons/icon.svg')).resize(size, size).png().toFile(path.join(root, `icons/icon-${size}.png`));
  const out = path.join(root, 'dist/chromium');
  // Rebuild from a clean directory so stale files cannot enter the package.
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const files = ['manifest.json', 'browser-api.js', 'service-worker.js', 'common.js', 'background.js', 'offscreen.html', 'offscreen.js', 'content.js', 'highlight.css', 'dashboard.html', 'dashboard.js', 'dashboard.css', 'options.html', 'options.js'];
  for (const file of files) fs.copyFileSync(path.join(root, file), path.join(out, file));
  fs.cpSync(path.join(root, 'icons'), path.join(out, 'icons'), { recursive: true });
  const version = require('../manifest.json').version;
  const zip = path.join(root, `dist/wover-chromium-${version}.zip`);
  fs.rmSync(zip, { force: true });
  // Python is used only for the portable ZIP container; the runtime has no dependencies.
  execFileSync(process.env.PYTHON || 'python3', ['-c', 'import pathlib,sys,zipfile\np=pathlib.Path(sys.argv[1])\nwith zipfile.ZipFile(sys.argv[2],"w",zipfile.ZIP_DEFLATED) as z:\n for f in sorted(p.rglob("*")):\n  if f.is_file(): z.write(f,f.relative_to(p))', out, zip]);
  console.log(`Unpacked extension: ${out}\nPackage: ${zip}`);
})();
