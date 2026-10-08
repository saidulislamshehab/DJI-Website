const http = require('http');

http.get('http://localhost:5000/api/collections?limit=500', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      const collections = json.data || [];
      console.log('Total collections in DB:', collections.length);
      const handles = new Set(collections.map(c => c.handle));

      const checkList = [
        'dji-mavic-4-pro',
        'osmo-action-6',
        'dji-air-3s',
        'dji-mini-5-pro',
        'dji-mini-4-pro',
        'dji-lito-x1',
        'dji-lito-1',
        'dji-flip',
        'dji-neo-2',
        'dji-neo',
        'dji-avata-360',
        'dji-avata-2',
        'dji-inspire-3',
        'osmo-pocket-4p',
        'osmo-pocket-4',
        'osmo-pocket-3',
        'osmo-action-5-pro',
        'osmo-action-4',
        'osmo-nano',
        'osmo-360-2',
        'osmo-mobile-8p',
        'osmo-mobile-8',
        'dji-mic-mini-2s',
        'dji-mic-mini-2',
        'dji-rs-5',
        'dji-rs-4-pro',
        'dji-matrice-400',
        'dji-dock-3',
        'dji-agras-t100',
        'dji-flycart-100'
      ];

      console.log('\n--- Checking Key Menu Collections in DB ---');
      checkList.forEach(handle => {
        const found = collections.find(c => c.handle === handle);
        if (found) {
          console.log(`[EXISTS] ${handle}: "${found.title}" | Hero: ${found.heroBannerImage ? 'YES' : 'NO'} | Products: ${found.productsCount || 0} | Tabs: ${(found.tabs || []).join(', ')}`);
        } else {
          console.log(`[MISSING] ${handle}`);
        }
      });
    } catch (e) {
      console.error('Parse error:', e);
    }
  });
}).on('error', err => {
  console.error('Request error:', err);
});
