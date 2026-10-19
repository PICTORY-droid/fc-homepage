// _previews/*.svg → public/fun/cards/<분류>/thumbs/<이름>.jpg (Chromium 로 래스터화)
import { createRequire } from 'module';
import fs from 'fs'; import path from 'path';
const require = createRequire(process.env.PW_PATH + '/');
const { chromium } = require('playwright');
const here = path.dirname(new URL(import.meta.url).pathname);
const prev = path.join(here, '_previews');
const out = path.join(here, '..', '..', '..', 'public', 'fun', 'cards');
const catOf = JSON.parse(fs.readFileSync(path.join(here, '..', '..', '..', 'src', 'config', 'cards.data.json'), 'utf8'));
const map = {};
for (const [cat, v] of Object.entries(catOf)) for (const it of v.items) map[`${cat}-${String(it.no).padStart(2, '0')}`] = cat;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const pg = await b.newPage({ viewport: { width: 640, height: 726 } });
let n = 0;
for (const f of fs.readdirSync(prev).filter(x => x.endsWith('.svg'))) {
  const name = f.replace(/\.svg$/, ''); const cat = map[name];
  const dir = path.join(out, cat, 'thumbs'); fs.mkdirSync(dir, { recursive: true });
  const svg = fs.readFileSync(path.join(prev, f), 'utf8');
  await pg.setContent(`<body style="margin:0">${svg}</body>`);
  await pg.screenshot({ path: path.join(dir, name + '.jpg'), type: 'jpeg', quality: 72, clip: { x: 0, y: 0, width: 640, height: 726 } });
  n++;
}
await b.close(); console.log('thumbs', n);
