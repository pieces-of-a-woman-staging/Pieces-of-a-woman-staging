/* Encode responsive web assets from the original artwork; originals are retained. */
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const assets = [
  ['Product 1.PNG', 'part-1', [480, 800, 1122]],
  ['Product 2.PNG', 'part-2', [480, 800, 1122]],
  ['F4558003-BA91-40C6-8941-8A752D636795.PNG', 'flashcards', [480, 800, 1122]],
  ['Hat.PNG', 'hat', [480, 800, 1122]],
  ['Bundle deal.PNG', 'bundle', [480, 800, 1122]],
  ['images/Bookmark orginal.jpg', 'bookmarks', [480, 800, 1179]],
  ['images/author-portrait-2026.jpg', 'author', [480, 800, 1179]],
  ['images/vonita-genesis-dedication.jpg', 'vonita-dedication', [480, 767]],
  ['images/peony-satin.jpg', 'peony-satin', [800, 1536]],
  ['images/pink-water-hero-reference.jpg', 'pink-water', [800, 1328]],
  ['images/soft-pink-ripple-background.jpg', 'soft-ripple', [800, 1536]],
];

async function main() {
  const folder = path.join(root, 'images/optimized');
  await fs.mkdir(folder, { recursive: true });
  let originalBytes = 0;
  let webBytes = 0;
  for (const [source, name, widths] of assets) {
    const input = path.join(root, source);
    const metadata = await sharp(input).metadata();
    const original = (await fs.stat(input)).size;
    originalBytes += original;
    for (const width of widths) {
      const output = path.join(folder, `${name}-${width}.webp`);
      await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 88, effort: 6, smartSubsample: true })
        .toFile(output);
      const size = (await fs.stat(output)).size;
      if (width === widths.at(-1)) webBytes += size;
      console.log(`${name}-${width}.webp: ${size} bytes`);
    }
    if (!metadata.width || !metadata.height) throw new Error(`Invalid image: ${source}`);
  }
  console.log(JSON.stringify({ originalBytes, fullSizeWebBytes: webBytes,
    reductionPercent: Math.round((1 - webBytes / originalBytes) * 100) }));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
