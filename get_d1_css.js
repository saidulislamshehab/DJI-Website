const https = require('https');
const fs = require('fs');

https.get('https://www.d1store.com.au', (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    // Find all css link tags
    const links = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map(m => m[1]);
    console.log('Found CSS links:', links.length);
    const relevant = links.filter(l => l.includes('carousel') || l.includes('section') || l.includes('component') || l.includes('d1') || l.includes('base'));
    console.log('Relevant CSS:', relevant);

    // Let's also check for inline styles or classes in html
    const cardMatches = [...html.matchAll(/d1-home-carousel__cta[^"]*/g)].slice(0, 5);
    console.log('CTA matches:', cardMatches.map(m => m[0]));
    
    // Check if section-custom-product-carousel.css exists
    relevant.forEach(url => {
      const fullUrl = url.startsWith('http') ? url : 'https:' + url;
      https.get(fullUrl, (cssRes) => {
        let cssData = '';
        cssRes.on('data', c => cssData += c);
        cssRes.on('end', () => {
          if (cssData.includes('d1-home-carousel__cta') || cssData.includes('d1-home-carousel__featured-btn')) {
            console.log('=== MATCH IN CSS:', fullUrl);
            const lines = cssData.split('\n');
            lines.forEach((line, idx) => {
              if (line.includes('d1-home-carousel__cta') || line.includes('d1-home-carousel__featured-btn') || line.includes('d1-home-carousel__card-title') || line.includes('d1-home-carousel__price')) {
                console.log(lines.slice(Math.max(0, idx - 2), idx + 10).join('\n'));
              }
            });
          }
        });
      });
    });
  });
}).on('error', err => console.error(err));
