const fs = require('fs');
const html = fs.readFileSync('C:/Users/saidu/.gemini/antigravity/brain/67239705-2724-4a7e-9a9d-1ad2f360cc9f/.system_generated/steps/385/content.md', 'utf8');
const links = [];
const regex = /href="([^"]+?\.css[^"]*?)"/g;
let match;
while ((match = regex.exec(html)) !== null) {
  links.push(match[1]);
}
console.log('Unique CSS links:', [...new Set(links)]);
