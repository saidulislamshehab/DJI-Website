const fs = require('fs');
const html = fs.readFileSync('C:/Users/saidu/.gemini/antigravity-ide/brain/6b9f074d-9f5d-44e6-a4aa-01e513ba6f64/live_header.html', 'utf8');

const regex = /<header-menu>([\s\S]*?)<\/header-menu>/gi;
let match;
const menus = [];

while ((match = regex.exec(html)) !== null) {
  const block = match[1];
  
  // Extract id and label
  const summaryMatch = block.match(/<summary[^>]*id="HeaderMenu-([^"]*)"[^>]*>([\s\S]*?)<\/summary>/i);
  const menuId = summaryMatch ? summaryMatch[1] : '';
  const menuUrlMatch = block.match(/data-menu-url="([^"]*)"/i);
  const menuHref = menuUrlMatch ? menuUrlMatch[1] : '';
  
  let label = '';
  if (summaryMatch) {
    label = summaryMatch[2].replace(/<svg[\s\S]*?<\/svg>/gi, '').replace(/<[^>]+>/g, '').trim();
  }

  // Extract columns/groups inside .mega-menu__list > li
  const listMatch = block.match(/<ul[^>]*class="[^"]*mega-menu__list[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
  const groups = [];

  if (listMatch) {
    const liRegex = /<li[^>]*style="--d1-mnav-i:[^"]*"[^>]*>([\s\S]*?)<\/li>\s*(?=<li[^>]*style="--d1-mnav-i:|<\/ul>)/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(listMatch[1])) !== null) {
      const liContent = liMatch[1];
      
      // Group header (thumb + title or link)
      const headerDivMatch = liContent.match(/<div[^>]*class="[^"]*mega-menu__link--level-2[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      const headerLinkMatch = liContent.match(/<a[^>]*class="[^"]*mega-menu__link--level-2[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
      
      let groupTitle = '';
      let groupHref = '';
      let groupImg = '';

      if (headerLinkMatch) {
        groupHref = headerLinkMatch[1];
        const inner = headerLinkMatch[2];
        const imgMatch = inner.match(/src="([^"]*)"/i);
        if (imgMatch) groupImg = imgMatch[1].startsWith('//') ? 'https:' + imgMatch[1] : imgMatch[1];
        groupTitle = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      } else if (headerDivMatch) {
        const inner = headerDivMatch[1];
        const imgMatch = inner.match(/src="([^"]*)"/i);
        if (imgMatch) groupImg = imgMatch[1].startsWith('//') ? 'https:' + imgMatch[1] : imgMatch[1];
        groupTitle = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }

      // Group items (sub-links)
      const subItems = [];
      const subLinkRegex = /<a[^>]*class="mega-menu__link link"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
      let sMatch;
      while ((sMatch = subLinkRegex.exec(liContent)) !== null) {
        const sHref = sMatch[1];
        const sRaw = sMatch[2];
        
        let badge = '';
        const badgeMatch = sRaw.match(/<span[^>]*class="[^"]*d1-nav-badge[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
        if (badgeMatch) {
          badge = badgeMatch[1].trim();
        }

        const title = sRaw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        subItems.push({ title, href: sHref, badge });
      }

      if (groupTitle || subItems.length > 0) {
        groups.push({
          title: groupTitle,
          href: groupHref,
          img: groupImg,
          items: subItems
        });
      }
    }
  }

  menus.push({
    id: menuId,
    label,
    href: menuHref,
    groups
  });
}

fs.writeFileSync('C:/Users/saidu/.gemini/antigravity-ide/brain/6b9f074d-9f5d-44e6-a4aa-01e513ba6f64/structured_mega_menus.json', JSON.stringify(menus, null, 2));

console.log('Successfully structured', menus.length, 'mega menus:');
menus.forEach(m => {
  console.log(`- ${m.label} (${m.id}): ${m.groups.length} groups`);
  m.groups.forEach(g => {
    console.log(`   * [${g.title}] (${g.items.length} items, img: ${!!g.img})`);
  });
});
