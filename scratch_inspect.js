const https = require('https');

https.get('https://www.d1store.com.au/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    // Find all mega-menu elements
    const megaMenus = html.match(/<header-menu[\s\S]*?<\/header-menu>/gi);
    console.log('Total header menus:', megaMenus ? megaMenus.length : 0);
    if (megaMenus) {
      megaMenus.forEach((m, idx) => {
        const titleMatch = m.match(/<span[^>]*class="[^"]*header__menu-item[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
                           m.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
        console.log(`Menu ${idx + 1}:`, titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : 'Unknown');
      });
    }
  });
}).on('error', console.error);
