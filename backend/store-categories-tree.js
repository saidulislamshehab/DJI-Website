const fs = require('fs');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  console.log('Connecting to MongoDB Atlas (d1store)...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to database:', mongoose.connection.name);

  const html = fs.readFileSync('homepage.html', 'utf8');
  const $ = cheerio.load(html);

  const categories = [];

  $('header-menu details.mega-menu, details.mega-menu').each((idx, details) => {
    const $details = $(details);
    const $summary = $details.find('summary');
    const catUrl = $summary.attr('data-menu-url') || '';
    const catTitle = $summary.find('span').first().text().trim();
    const summaryId = $summary.attr('id') || '';
    let catSlug = summaryId.replace(/^HeaderMenu-/, '') || catTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (!catTitle || catTitle === 'More') return;
    if (catSlug === 'enterprise-agriculture') catSlug = 'enterprise';

    const subCategories = [];

    $details.find('ul.mega-menu__list > li').each((_, li) => {
      const $li = $(li);
      const $level2 = $li.find('.mega-menu__link--level-2').first();
      if ($level2.length === 0) return;

      let subUrl = $level2.attr('href') || '';
      let subThumb = $level2.find('img').attr('src') || '';
      if (subThumb && subThumb.startsWith('//')) {
        subThumb = 'https:' + subThumb;
      }

      // Badge
      const $badge = $level2.find('.d1-nav-badge, [class*="badge"]');
      const badgeText = $badge.length ? $badge.text().trim() : null;
      $badge.remove();

      const subTitle = $level2.find('span').last().text().trim() || $level2.text().trim();
      let subSlug = subUrl
        ? subUrl.replace(/^\/collections\//, '').replace(/^\/products\//, '').replace(/^\//, '')
        : subTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Options inside ul.list-unstyled
      const options = [];
      $li.find('ul.list-unstyled > li a').each((_, optA) => {
        const $optA = $(optA);
        const optUrl = $optA.attr('href') || '';
        const $optBadge = $optA.find('.d1-nav-badge, [class*="badge"]');
        const optBadgeText = $optBadge.length ? $optBadge.text().trim() : null;
        $optBadge.remove();
        const optTitle = $optA.text().trim();
        const optSlug = optUrl
          ? optUrl.replace(/^\/collections\//, '').replace(/^\/products\//, '').replace(/^\//, '')
          : optTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        if (optTitle) {
          options.push({
            name: optTitle,
            url: optUrl,
            slug: optSlug,
            badge: optBadgeText,
            categoryName: catTitle,
            categorySlug: catSlug,
            subCategoryName: subTitle,
            subCategorySlug: subSlug,
          });
        }
      });

      // If no sub-options found and subUrl is provided, add itself as primary option
      if (options.length === 0 && subUrl) {
        options.push({
          name: subTitle,
          url: subUrl,
          slug: subSlug,
          badge: badgeText,
          categoryName: catTitle,
          categorySlug: catSlug,
          subCategoryName: subTitle,
          subCategorySlug: subSlug,
        });
      }

      subCategories.push({
        name: subTitle,
        url: subUrl,
        slug: subSlug,
        thumbnail: subThumb,
        badge: badgeText,
        categoryName: catTitle,
        categorySlug: catSlug,
        options,
      });
    });

    categories.push({
      name: catTitle,
      slug: catSlug,
      url: catUrl,
      featuredOrder: idx + 1,
      subCategories,
    });
  });

  console.log(`\nParsed ${categories.length} Top Categories from Live Header Navigation.`);

  const db = mongoose.connection.db;
  const categoriesCol = db.collection('categories');
  const subCategoriesCol = db.collection('subcategories');
  const optionsCol = db.collection('category_options');

  // Clear and update collections cleanly
  await categoriesCol.deleteMany({});
  await subCategoriesCol.deleteMany({});
  await optionsCol.deleteMany({});

  let totalSubcats = 0;
  let totalOptions = 0;

  for (const cat of categories) {
    // 1. Insert Category document with embedded subCategories & options
    await categoriesCol.insertOne({
      name: cat.name,
      slug: cat.slug,
      url: cat.url,
      featuredOrder: cat.featuredOrder,
      subCategories: cat.subCategories,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Insert into normalized collections
    for (const sc of cat.subCategories) {
      totalSubcats++;
      await subCategoriesCol.insertOne({
        name: sc.name,
        slug: sc.slug,
        url: sc.url,
        thumbnail: sc.thumbnail,
        badge: sc.badge,
        categoryName: cat.name,
        categorySlug: cat.slug,
        options: sc.options,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      for (const opt of sc.options) {
        totalOptions++;
        await optionsCol.insertOne({
          name: opt.name,
          slug: opt.slug,
          url: opt.url,
          badge: opt.badge,
          categoryName: cat.name,
          categorySlug: cat.slug,
          subCategoryName: sc.name,
          subCategorySlug: sc.slug,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }

  console.log('\n================ STORED IN DATABASE ================');
  console.log(`✓ Categories Stored in 'categories': ${categories.length}`);
  console.log(`✓ Subcategories Stored in 'subcategories': ${totalSubcats}`);
  console.log(`✓ Options Stored in 'category_options': ${totalOptions}`);

  // Print sample from DB
  const sampleCat = await categoriesCol.findOne({ slug: 'drones' });
  console.log('\nSample Stored Category (Drones):');
  console.log(JSON.stringify({
    name: sampleCat.name,
    slug: sampleCat.slug,
    url: sampleCat.url,
    subCategoriesCount: sampleCat.subCategories.length,
    sampleSubCategory: sampleCat.subCategories[0],
  }, null, 2));

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
