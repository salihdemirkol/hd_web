const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/efendilik_content.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const rule1 = /([a-zçğıöşü])([A-ZÇĞİÖŞÜ])/g;
const rule2 = /([,;!?])([A-Za-zÇĞİÖŞÜçğıöşü])/g;
const rule3 = /(\.)([A-ZÇĞİÖŞÜ])/g; // Period followed by Uppercase
const rule4 = /([a-zçğıöşü])(için|ile|ve|gibi|kadar|ki|da|de|mi|mu|mü|mı)(?=\s|$)/gi; // This might be too dangerous

let matchCount = 0;
const examples = [];

function checkText(text) {
  let changed = false;
  let newText = text;
  
  if (rule1.test(newText)) {
    newText = newText.replace(rule1, '$1 $2');
    changed = true;
  }
  if (rule2.test(newText)) {
    newText = newText.replace(rule2, '$1 $2');
    changed = true;
  }
  if (rule3.test(newText)) {
    // avoid matching '...'
    newText = newText.replace(/(?<!\.)(\.)([A-ZÇĞİÖŞÜ])/g, '$1 $2');
    changed = true;
  }
  
  // Specific fix for "YENi"
  if (/YENi([A-ZÇĞİÖŞÜ])/g.test(newText)) {
     newText = newText.replace(/YENi([A-ZÇĞİÖŞÜ])/g, 'YENİ $1');
     changed = true;
  }

  // Common merged words ending in 'i' like YENi, ESKi, HANGi, DİNİ
  newText = newText.replace(/([A-ZÇĞİÖŞÜ]+)i([A-ZÇĞİÖŞÜ]+)/g, '$1İ $2');

  if (newText !== text) {
    if (examples.length < 20) {
      examples.push(`OLD: ${text}\nNEW: ${newText}\n`);
    }
    matchCount++;
  }
}

Object.values(data).forEach(book => {
  if (book.chapters) {
    book.chapters.forEach(c => {
      checkText(c.title);
      c.paragraphs.forEach(p => {
        if (p.type === 'paragraph') checkText(p.text);
      });
    });
  }
});

console.log(`Found ${matchCount} texts that need spacing/case fixes.`);
console.log(examples.join('\n'));
