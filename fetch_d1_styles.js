const https = require('https');
const fs = require('fs');

const url = 'https://www.d1store.com.au/cdn/shop/t/22/compiled_assets/styles.css?v=121169408206137166261791415744';

https.get(url, (res) => {
  let css = '';
  res.on('data', chunk => css += chunk);
  res.on('end', () => {
    fs.writeFileSync('d1_compiled_styles.css', css);
    console.log('Saved d1_compiled_styles.css, length:', css.length);

    // Search for d1-home-carousel
    const regex = /\.d1-home-carousel[^{]*\{[^}]*\}/g;
    let match;
    const rules = [];
    while ((match = regex.exec(css)) !== null) {
      rules.push(match[0]);
    }
    console.log('Total d1-home-carousel rules found:', rules.length);
    rules.forEach(r => console.log(r));
  });
}).on('error', err => console.error(err));
