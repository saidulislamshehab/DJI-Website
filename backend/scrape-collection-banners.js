const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

function extractCollectionData(html, handle) {
  // 1. Hero Banner Image
  let heroBannerImage = null;
  let heroMobileImage = null;

  // Immersive d1-collection-hero media
  const heroMediaMatch = html.match(/class=["'][^"']*(?:d1-collection-hero|collection-hero)__media[^"']*["'][\s\S]*?<img[^>]+(?:src|data-src)=["']([^"']+)["']/i);
  if (heroMediaMatch) {
    heroBannerImage = heroMediaMatch[1];
  } else {
    // Other hero images
    const genericHeroMatch = html.match(/class=["'][^"']*(?:d1-collection-hero|collection-hero|banner)[^"']*["'][\s\S]*?<img[^>]+(?:src|data-src)=["']([^"']+)["']/i);
    if (genericHeroMatch) {
      heroBannerImage = genericHeroMatch[1];
    }
  }

  // Check picture tag for mobile source
  const pictureMatch = html.match(/<picture[\s\S]*?class=["'][^"']*(?:collection-hero|d1-collection-hero)[^"']*[\s\S]*?<\/picture>/i);
  if (pictureMatch) {
    const mobileSrcMatch = pictureMatch[0].match(/<source[^>]+media=["'][^"']*max-width[^"']*["'][^>]+srcset=["']([^"'\s]+)/i);
    if (mobileSrcMatch) heroMobileImage = mobileSrcMatch[1];
  }

  // Clean URLs (e.g. leading //)
  if (heroBannerImage && heroBannerImage.startsWith('//')) {
    heroBannerImage = 'https:' + heroBannerImage;
  }
  if (heroMobileImage && heroMobileImage.startsWith('//')) {
    heroMobileImage = 'https:' + heroMobileImage;
  }

  // 2. Breadcrumbs
  let breadcrumbs = [];
  const bcMatch = html.match(/class=["'][^"']*(?:collection-hero__breadcrumbs|breadcrumb)[^"']*["'][\s\S]*?<\/ol>/i);
  if (bcMatch) {
    breadcrumbs = [...bcMatch[0].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map(m => m[1].replace(/<[^>]+>/g, '').trim())
      .filter(t => t && t !== '/' && t !== '>' && t !== '•');
  }

  // 3. Jump Nav Tabs (e.g. Products, Bundles, Accessories)
  let tabs = [];
  const jumpNavMatch = html.match(/class=["'][^"']*(?:collection-jump-nav__nav|collection-tabs__nav)[^"']*["'][\s\S]*?<\/div>/i);
  if (jumpNavMatch) {
    tabs = [...jumpNavMatch[0].matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)]
      .map(m => m[1].replace(/<[^>]+>/g, '').trim())
      .filter(Boolean);
  }

  // 4. SubTabs (from collection-related-tabs)
  let subTabs = [];
  const subTabPanels = [...html.matchAll(/data-tab-title=["']([^"']+)["'][^>]*data-tab-handle=["']([^"']+)["']/gi)];
  if (subTabPanels.length > 0) {
    subTabs = subTabPanels.map(m => ({ title: m[1], handle: m[2] }));
  } else {
    const btnMatches = [...html.matchAll(/class=["'][^"']*collection-related-tabs__button[^"']*["'][^>]*>([\s\S]*?)<\/button>/gi)];
    if (btnMatches.length > 0) {
      subTabs = btnMatches.map(m => ({ title: m[1].replace(/<[^>]+>/g, '').trim() })).filter(t => t.title);
    }
  }

  // 5. Tagline
  let tagline = null;
  const taglineMatch = html.match(/class=["'][^"']*d1-collection-hero__tagline[^"']*["'][^>]*>([\s\S]*?)<\/(?:p|div)>/i);
  if (taglineMatch) {
    tagline = taglineMatch[1].replace(/<[^>]+>/g, '').trim();
  }

  return {
    handle,
    heroBannerImage,
    heroMobileImage,
    breadcrumbs,
    tabs,
    subTabs,
    tagline
  };
}

function fetchCollectionHtml(handle) {
  return new Promise((resolve) => {
    const req = https.get(`https://www.d1store.com.au/collections/${handle}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-AU,en-US;q=0.9,en;q=0.8'
      },
      timeout: 10000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = res.headers.location.startsWith('http') ? res.headers.location : `https://www.d1store.com.au${res.headers.location}`;
        https.get(nextUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, (r2) => {
          let data = '';
          r2.on('data', c => data += c);
          r2.on('end', () => resolve(extractCollectionData(data, handle)));
        }).on('error', () => resolve(null));
        return;
      }
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(extractCollectionData(data, handle)));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

// Run through queue with concurrency limit
async function runPool(items, limit, fn) {
  const results = [];
  let index = 0;
  
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i, items.length);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log('Connecting to MongoDB Atlas (d1store)...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to database:', mongoose.connection.name);

  const collectionsCol = mongoose.connection.db.collection('collections');
  const allCollections = await collectionsCol.find({}).toArray();
  console.log(`Found ${allCollections.length} collections in database.`);

  // Sort: Prioritize collections with productsCount > 0, then others
  allCollections.sort((a, b) => (b.productsCount || 0) - (a.productsCount || 0));

  let updatedCount = 0;
  let heroFoundCount = 0;
  let breadcrumbFoundCount = 0;
  let tabsFoundCount = 0;

  console.log(`Starting to scrape collection hero banners, breadcrumbs, and tabs (Concurrency: 4)...`);

  await runPool(allCollections, 4, async (col, idx, total) => {
    try {
      const data = await fetchCollectionHtml(col.handle);
      if (!data) {
        if ((idx + 1) % 25 === 0) {
          console.log(`Progress: ${idx + 1}/${total} collections processed...`);
        }
        return;
      }

      const updateFields = {};
      if (data.heroBannerImage) {
        updateFields.heroBannerImage = data.heroBannerImage;
        heroFoundCount++;
      }
      if (data.heroMobileImage) {
        updateFields.heroMobileImage = data.heroMobileImage;
      }
      if (data.breadcrumbs && data.breadcrumbs.length > 0) {
        updateFields.breadcrumbs = data.breadcrumbs;
        breadcrumbFoundCount++;
      }
      if (data.tabs && data.tabs.length > 0) {
        updateFields.tabs = data.tabs;
        tabsFoundCount++;
      }
      if (data.subTabs && data.subTabs.length > 0) {
        updateFields.subTabs = data.subTabs;
      }
      if (data.tagline) {
        updateFields.tagline = data.tagline;
      }

      if (Object.keys(updateFields).length > 0) {
        await collectionsCol.updateOne(
          { _id: col._id },
          { $set: updateFields }
        );
        updatedCount++;
      }

      if ((idx + 1) % 25 === 0 || idx === total - 1) {
        console.log(`Progress: ${idx + 1}/${total} (Updated: ${updatedCount}, Banners: ${heroFoundCount}, Breadcrumbs: ${breadcrumbFoundCount}, Tabs: ${tabsFoundCount})`);
      }
    } catch (err) {
      console.error(`Error on ${col.handle}:`, err.message);
    }
  });

  console.log('\n--- SCRAPING COMPLETED ---');
  console.log(`Total Collections Processed: ${allCollections.length}`);
  console.log(`Collections Updated in DB: ${updatedCount}`);
  console.log(`Hero Banners Stored: ${heroFoundCount}`);
  console.log(`Breadcrumbs Stored: ${breadcrumbFoundCount}`);
  console.log(`Tabs Stored: ${tabsFoundCount}`);

  // Print sample updated document
  const sample = await collectionsCol.findOne({ handle: 'osmo-pocket-3' });
  console.log('\nSample Updated Document (osmo-pocket-3):');
  console.log(JSON.stringify({
    title: sample.title,
    handle: sample.handle,
    heroBannerImage: sample.heroBannerImage,
    breadcrumbs: sample.breadcrumbs,
    tabs: sample.tabs,
    subTabs: sample.subTabs
  }, null, 2));

  await mongoose.disconnect();
  console.log('MongoDB disconnected successfully.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
