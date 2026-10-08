const http = require('http');
const fs = require('fs');
const path = require('path');

// Read d1_mega_menu.ts to extract all collection handles and titles
const megaMenuPath = path.resolve(__dirname, '../../frontend/src/data/d1_mega_menu.ts');
const megaMenuContent = fs.readFileSync(megaMenuPath, 'utf8');

// Simple regex extraction of hrefs and titles
const itemMatches = [...megaMenuContent.matchAll(/"title":\s*"([^"]+)",\s*"href":\s*"\/collections\/([^"]+)"/g)];
const megaMenuMap = new Map();
itemMatches.forEach(m => {
  megaMenuMap.set(m[2], m[1]);
});

console.log(`Found ${megaMenuMap.size} collections linked in Mega Menu`);

http.get('http://localhost:5000/api/collections?limit=500', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      const dbCollections = json.data || [];
      const dbMap = new Map(dbCollections.map(c => [c.handle, c]));

      console.log(`Database has ${dbCollections.length} collections`);

      const missing = [];
      const withoutHero = [];
      const withoutTabs = [];
      const withoutBreadcrumbs = [];

      for (const [handle, title] of megaMenuMap.entries()) {
        const found = dbMap.get(handle);
        if (!found) {
          missing.push({ handle, title });
        } else {
          if (!found.heroBannerImage) withoutHero.push({ handle, title });
          if (!found.tabs || found.tabs.length === 0) withoutTabs.push({ handle, title });
          if (!found.breadcrumbs || found.breadcrumbs.length === 0) withoutBreadcrumbs.push({ handle, title });
        }
      }

      console.log(`\n=== AUDIT RESULTS ===`);
      console.log(`Missing collections entirely: ${missing.length}`);
      if (missing.length > 0) {
        console.log('Missing items:', missing);
      }
      console.log(`Collections without heroBannerImage: ${withoutHero.length}`);
      if (withoutHero.length > 0) {
        console.log('Without hero:', withoutHero.slice(0, 10));
      }
      console.log(`Collections without tabs: ${withoutTabs.length}`);
      console.log(`Collections without breadcrumbs: ${withoutBreadcrumbs.length}`);

    } catch (e) {
      console.error('Error parsing response:', e);
    }
  });
}).on('error', err => console.error('HTTP error:', err));
