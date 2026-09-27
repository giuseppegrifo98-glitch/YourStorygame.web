import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const previews = {
  'dance-esco.webp': 'outputs/mobile-fixes/02-dance.png',
  'chase-esco.webp': 'outputs/mobile-fixes/05-chase.png',
  'home-esco.webp': 'outputs/mobile-fixes/13-pablo-laser.png',
  'together-esco.webp': 'public/demo/assets/sofa-memory.png',
};
for (const [name, source] of Object.entries(previews)) {
  await sharp(source).resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 87 }).toFile('public/assets/showcase/' + name);
}
// Retained legacy routes/CSS receive the same new characters.
const aliases = {
  'dance.webp': 'dance-esco.webp', 'dance-v4.webp': 'dance-esco.webp',
  'home.webp': 'home-esco.webp', 'home-v4.webp': 'home-esco.webp',
  'together.webp': 'together-esco.webp', 'together-v4.webp': 'together-esco.webp',
  'present-v4.webp': 'together-esco.webp',
};
for (const [target, source] of Object.entries(aliases)) await writeFile('public/assets/showcase/' + target, await readFile('public/assets/showcase/' + source));
for (const [target, source] of Object.entries({ 'dance-selected.jpg': 'dance-esco.webp', 'chase-selected-2.jpg': 'chase-esco.webp', 'pablo-selected.jpg': 'home-esco.webp' })) {
  await sharp('public/assets/showcase/' + source).jpeg({ quality: 88 }).toFile('public/assets/showcase/' + target);
}
const layers = [];
for (const [index, name] of ['me', 'run', 'lana', 'kitten'].entries()) {
  const input = await sharp('public/demo/assets/sprites/' + name + '.png').resize(320, 800, { fit: 'contain', background: '#00000000' }).png().toBuffer();
  layers.push({ input, left: index * 320, top: 0 });
}
await sharp({ create: { width: 1280, height: 800, channels: 4, background: '#00000000' } }).composite(layers).png().toFile('public/assets/couple-sprites.png');
