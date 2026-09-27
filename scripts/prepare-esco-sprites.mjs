import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';

// Extract connected silhouettes so the runner's foot does not crop Joe's shoe.
const source = new URL('../art/characters-esco/characters.png', import.meta.url);
const destination = new URL('../public/demo/assets/sprites/', import.meta.url);
const { data, info } = await sharp(fileURLToPath(source)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const seen = new Uint8Array(width * height);
const components = [];
for (let start = 0; start < seen.length; start++) {
  if (seen[start] || data[start * 4 + 3] < 30) continue;
  const pixels = [start]; seen[start] = 1;
  let left = width, right = 0, top = height, bottom = 0;
  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i], x = pixel % width, y = Math.floor(pixel / width);
    left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
    for (const next of [x > 0 ? pixel - 1 : -1, x < width - 1 ? pixel + 1 : -1, pixel - width, pixel + width]) {
      if (next < 0 || next >= seen.length || seen[next] || data[next * 4 + 3] < 30) continue;
      seen[next] = 1; pixels.push(next);
    }
  }
  if (pixels.length > 15000) components.push({ pixels, left, top, width: right - left + 1, height: bottom - top + 1 });
}
components.sort((a, b) => a.left - b.left);
if (components.length !== 5) throw new Error(`Expected five sprites, found ${components.length}`);
const names = ['me', 'run', 'angry', 'lana', 'kitten'];
const manifest = JSON.parse(await readFile(new URL('manifest.json', destination), 'utf8'));
for (let i = 0; i < names.length; i++) {
  const component = components[i], name = names[i];
  const rgba = Buffer.alloc(component.width * component.height * 4);
  for (const pixel of component.pixels) {
    const target = ((Math.floor(pixel / width) - component.top) * component.width + pixel % width - component.left) * 4;
    data.copy(rgba, target, pixel * 4, pixel * 4 + 4);
  }
  const png = await sharp(rgba, { raw: { width: component.width, height: component.height, channels: 4 } }).png().toBuffer();
  await writeFile(new URL(name + '.png', destination), png);
  manifest[name] = { file: name + '.png', width: component.width, height: component.height };
  if (['me', 'lana', 'kitten'].includes(name)) {
    const size = Math.min(component.width, Math.round(component.height * (name === 'kitten' ? .64 : .28)));
    await sharp(png).extract({ left: name === 'kitten' ? 0 : Math.round((component.width - size) / 2), top: 0, width: size, height: size }).resize(160, 160).png().toFile(fileURLToPath(new URL('head-' + name + '.png', destination)));
    manifest['head-' + name] = { file: 'head-' + name + '.png', width: 160, height: 160 };
  }
  if (name === 'kitten') {
    await writeFile(new URL('pablo.png', destination), png);
    manifest.pablo = { ...manifest.kitten, file: 'pablo.png' };
  }
}
await writeFile(new URL('manifest.json', destination), JSON.stringify(manifest, null, 2) + '\n');
console.log(names.map(name => ({ name, ...manifest[name] })));
