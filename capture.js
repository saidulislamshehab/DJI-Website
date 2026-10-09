const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'E:\\Github Projects\\DJI-Drone-Website\\screenshots';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const jobs = [
  { name: 'home_1920.png', w: 1920, h: 1080, url: 'http://localhost:3000' },
  { name: 'home_1024.png', w: 1024, h: 768, url: 'http://localhost:3000' },
  { name: 'home_768.png', w: 768, h: 1024, url: 'http://localhost:3000' },
  { name: 'home_390.png', w: 390, h: 844, url: 'http://localhost:3000' },
  { name: 'product_1440.png', w: 1440, h: 1080, url: 'http://localhost:3000/products/dji-mic-mini-2s' },
  { name: 'product_390.png', w: 390, h: 844, url: 'http://localhost:3000/products/dji-mic-mini-2s' },
  { name: 'collections_1440.png', w: 1440, h: 1080, url: 'http://localhost:3000/collections/drones' },
  { name: 'cart_1440.png', w: 1440, h: 1080, url: 'http://localhost:3000/cart' },
  { name: 'admin_1440.png', w: 1440, h: 1080, url: 'http://localhost:3000/admin' },
];

for (const job of jobs) {
  const target = path.join(outDir, job.name);
  console.log(`Capturing ${job.name} (${job.w}x${job.h})...`);
  const cmd = `"${edgePath}" --headless --screenshot="${target}" --window-size=${job.w},${job.h} --disable-gpu "${job.url}"`;
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 20000 });
    console.log(`✓ Saved ${job.name}`);
  } catch (err) {
    console.error(`Failed ${job.name}:`, err.message);
  }
}
console.log('All screenshots captured!');
