const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
let content = fs.readFileSync(dbPath, 'utf8');

content = content.replace(/\.jpg"/g, '.webp"');
content = content.replace(/\.png"/g, '.webp"');
content = content.replace(/\.jpeg"/g, '.webp"');

fs.writeFileSync(dbPath, content, 'utf8');
console.log('Updated db.json references to .webp');
